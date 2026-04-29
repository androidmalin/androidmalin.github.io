---
layout: post
title: "Android Coroutine 面试分析"
date: 2026-04-29 10:00:00 +0800
description: "梳理 Kotlin Coroutine 在 Android 中的定位、核心概念、线程切换、结构化并发和面试常见问题。"
tags: [android, kotlin, coroutine, interview]
categories: [android]
---

# Android Coroutine 面试分析

简洁结论：**Coroutine 是 Kotlin 提供的轻量级并发编程模型，在 Android 中主要用于以接近同步代码的方式编写异步任务。** 它通过挂起函数、协程作用域、调度器和结构化并发，解决回调嵌套、线程切换复杂、生命周期取消困难等问题，是现代 Android 异步编程的主流方案。

## 1. What：它是什么？

Coroutine，中文通常叫协程，是一种可以挂起和恢复的计算任务。

它不是线程，但运行时仍然需要线程承载。协程的关键能力是：**挂起时不阻塞线程，恢复时可以继续执行后续代码。**

在 Kotlin/Android 中，协程通常由以下概念组成：

- `suspend fun`：挂起函数，可以暂停并在之后恢复。
- `CoroutineScope`：协程作用域，用来管理协程生命周期。
- `Job`：协程任务本身，可以取消、等待、查询状态。
- `CoroutineContext`：协程上下文，包含 `Job`、`Dispatcher` 等信息。
- `CoroutineDispatcher`：调度器，决定协程在哪个线程或线程池执行。
- `launch`：启动一个不返回结果的协程。
- `async`：启动一个返回 `Deferred` 结果的协程。
- `withContext`：切换协程上下文，常用于切线程。

面试中可以一句话概括：**Coroutine 是 Kotlin 的轻量级异步并发模型，它让异步代码可以用顺序代码的方式表达，同时通过作用域和 Job 管理任务生命周期。**

## 2. Why：它解决了什么问题？

Coroutine 主要解决 Android 异步编程复杂、线程切换繁琐、生命周期管理困难的问题。

在 Android 中，很多任务不能在主线程执行：

- 网络请求。
- 数据库读写。
- 文件读写。
- 图片处理。
- 加密解密。
- 数据计算。

传统方案包括 `Thread`、`Handler`、`AsyncTask`、回调、RxJava 等。它们可以解决问题，但常见痛点是：

- 回调层层嵌套，可读性差。
- 线程切换样板代码多。
- 任务取消复杂。
- Activity/Fragment 销毁后异步任务仍然回调，容易泄漏或崩溃。
- 异常传播不直观。
- 多任务并发、串行、超时、取消等组合逻辑复杂。

Coroutine 的价值是：

- 用顺序代码表达异步流程。
- `suspend` 挂起而不是阻塞线程。
- 使用 `Dispatchers` 明确线程切换。
- 使用 `CoroutineScope` 管理任务生命周期。
- 使用结构化并发让子协程跟随父协程取消。
- 和 ViewModel、Lifecycle、Room、Retrofit、Flow 等 Jetpack/生态组件协作自然。

典型 Android 场景：

```text
ViewModel
    -> viewModelScope.launch
    -> Repository suspend function
    -> Retrofit / Room / DataStore
    -> 更新 StateFlow 或 LiveData
```

## 3. How：它怎么使用？

### 3.1 在 ViewModel 中使用 viewModelScope

页面相关的数据加载通常放在 ViewModel 中：

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun loadUser() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            runCatching {
                repository.getUser()
            }.onSuccess { user ->
                _uiState.value = UserUiState(userName = user.name)
            }.onFailure { throwable ->
                _uiState.value = UserUiState(errorMessage = throwable.message)
            }
        }
    }
}
```

`viewModelScope` 的特点是：当 ViewModel 被清除时，其中的协程会自动取消。

### 3.2 在 Repository 中定义 suspend 函数

Repository 可以向上层暴露挂起函数：

```kotlin
class UserRepository(
    private val api: UserApi,
    private val dao: UserDao
) {

    suspend fun getUser(): User {
        val remoteUser = api.getUser()
        dao.insert(remoteUser)
        return remoteUser
    }
}
```

如果 Retrofit 接口使用 `suspend`，网络请求可以直接写成：

```kotlin
interface UserApi {
    @GET("user")
    suspend fun getUser(): User
}
```

### 3.3 使用 withContext 切换线程

CPU 密集型任务适合 `Dispatchers.Default`，IO 密集型任务适合 `Dispatchers.IO`：

```kotlin
suspend fun loadFile(): String = withContext(Dispatchers.IO) {
    file.readText()
}
```

面试中可以强调：**不要在主线程做耗时任务，协程不是让耗时任务变快，而是让线程使用更合理、异步代码更清晰。**

### 3.4 在 Activity/Fragment 中使用 lifecycleScope

如果任务和页面生命周期绑定，可以用 `lifecycleScope`：

```kotlin
class UserActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launch {
            val user = repository.getUser()
            render(user)
        }
    }
}
```

不过如果是收集 Flow 更新 UI，更推荐：

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.uiState.collect { state ->
            render(state)
        }
    }
}
```

### 3.5 launch、async、withContext 的区别

`launch` 适合启动不需要返回值的任务：

```kotlin
viewModelScope.launch {
    repository.refresh()
}
```

`async` 适合并发执行并返回结果：

```kotlin
viewModelScope.launch {
    val userDeferred = async { repository.getUser() }
    val ordersDeferred = async { repository.getOrders() }

    val user = userDeferred.await()
    val orders = ordersDeferred.await()
}
```

`withContext` 适合切换上下文并返回结果：

```kotlin
val data = withContext(Dispatchers.IO) {
    dao.query()
}
```

### 3.6 超时和取消

协程支持取消和超时：

```kotlin
withTimeout(5_000) {
    repository.sync()
}
```

取消是协作式的。挂起函数通常会检查取消状态，但如果你写的是长时间 CPU 循环，需要主动检查：

```kotlin
while (isActive) {
    doWork()
}
```

## 4. Principle：它的核心原理是什么？

Coroutine 的核心原理可以概括为：**挂起函数状态机 + Continuation + CoroutineContext + Dispatcher + 结构化并发。**

### 4.1 挂起不是阻塞

`suspend` 的含义不是开启线程，也不是阻塞线程，而是允许函数在某个挂起点暂停，并在结果可用后恢复执行。

例如：

```kotlin
val user = api.getUser()
render(user)
```

当 `api.getUser()` 挂起时，当前线程可以去执行其他任务；请求完成后，协程再恢复到下一行。

### 4.2 Continuation 和状态机

Kotlin 编译器会把挂起函数转换成类似状态机的结构，并通过 `Continuation` 记录“下一步该从哪里继续执行”。

可以简单理解为：

```text
suspend 函数
    -> 编译成状态机
    -> 挂起时保存状态
    -> 恢复时从挂起点继续执行
```

这就是为什么协程代码看起来像同步代码，但实际可以非阻塞执行。

### 4.3 CoroutineContext

协程上下文是一组元素的集合，常见元素包括：

- `Job`：控制协程生命周期。
- `Dispatcher`：控制协程在哪执行。
- `CoroutineName`：调试用名称。
- `CoroutineExceptionHandler`：处理未捕获异常。

协程启动时会继承父协程上下文，也可以局部覆盖：

```kotlin
viewModelScope.launch(Dispatchers.IO) {
    repository.refresh()
}
```

### 4.4 Dispatcher 调度线程

常见调度器：

- `Dispatchers.Main`：主线程，适合更新 UI。
- `Dispatchers.IO`：IO 线程池，适合网络、数据库、文件。
- `Dispatchers.Default`：默认线程池，适合 CPU 密集型任务。
- `Dispatchers.Unconfined`：不限制线程，Android 业务代码中很少直接使用。

调度器决定协程在哪个线程或线程池执行，但协程和线程不是一一绑定关系。

### 4.5 结构化并发

结构化并发是协程很重要的设计原则。

父协程会管理子协程：

- 父协程取消，子协程也会取消。
- 子协程失败，默认会影响父协程和兄弟协程。
- 父协程会等待子协程完成。

例如：

```kotlin
viewModelScope.launch {
    launch { loadUser() }
    launch { loadOrders() }
}
```

这两个子任务都属于外层协程管理范围。ViewModel 清除时，整个任务树会取消。

### 4.6 SupervisorJob

如果希望某个子协程失败时不影响其他兄弟协程，可以使用监督作用域：

```kotlin
supervisorScope {
    launch { loadUser() }
    launch { loadOrders() }
}
```

或者在自定义 scope 中使用 `SupervisorJob`。

## 5. Trade-off：局限、缺点、常见坑和替代方案

Coroutine 很强，但使用不当也容易出问题。

### 5.1 不要使用 GlobalScope

`GlobalScope` 的生命周期和应用进程接近，不跟随页面或业务作用域取消。

错误倾向：

```kotlin
GlobalScope.launch {
    repository.sync()
}
```

这可能导致任务泄漏、异常难处理、页面销毁后仍然执行。

更推荐：

- 页面任务使用 `viewModelScope`。
- UI 生命周期任务使用 `lifecycleScope`。
- 数据层需要外部作用域时显式注入 `CoroutineScope`。
- 后台可靠任务使用 `WorkManager`。

### 5.2 协程不是线程

协程轻量，但耗时计算仍然会占用线程。如果在 `Dispatchers.Main` 中执行 CPU 密集型任务，依然会卡 UI。

应该根据任务类型选择调度器：

- UI 更新：`Dispatchers.Main`
- IO：`Dispatchers.IO`
- CPU：`Dispatchers.Default`

### 5.3 取消是协作式的

协程取消并不是强制杀死线程。如果代码长时间运行且没有挂起点，需要主动检查取消状态。

例如：

```kotlin
while (isActive) {
    calculate()
}
```

否则即使调用了 `cancel()`，任务也可能不会及时停止。

### 5.4 异常传播容易误解

`launch` 中未捕获异常会向父协程传播；`async` 的异常通常在 `await()` 时暴露。

常见坑是以为给子协程加 `try-catch` 或 `CoroutineExceptionHandler` 就能处理所有异常，但结构化并发下异常传播和作用域关系有关。

面试中可以说：**协程异常要结合 Job 层级、launch/async、supervisorScope 一起理解。**

### 5.5 runBlocking 不适合 Android 主线程

`runBlocking` 会阻塞当前线程，通常只适合测试、main 函数或特殊桥接场景。

在 Android 主线程中使用 `runBlocking` 可能导致卡顿甚至 ANR。

### 5.6 lifecycleScope 不等于可见生命周期

`lifecycleScope.launch` 会在 Lifecycle 销毁时取消，但不会在页面 `STOPPED` 时自动停止。

收集 UI 状态时应使用：

```kotlin
repeatOnLifecycle(Lifecycle.State.STARTED)
```

Compose 中使用：

```kotlin
collectAsStateWithLifecycle()
```

### 5.7 不适合可靠后台任务

协程适合表达异步逻辑，但它本身不是可靠后台任务框架。

如果任务需要满足：

- App 退出后继续执行。
- 设备重启后恢复。
- 满足网络、电量等约束。
- 失败后可靠重试。

更适合使用 `WorkManager`。

### 5.8 类似技术对比

**Coroutine vs Thread**

线程是操作系统调度单位，资源成本较高。协程是运行在线程上的轻量任务，可以挂起而不阻塞线程。协程适合高并发异步逻辑，但底层仍然离不开线程。

**Coroutine vs Handler**

Handler 是 Android 原生消息机制，适合线程间消息投递和主线程调度。Coroutine 更适合结构化异步流程、网络请求、数据库操作和并发任务编排。

**Coroutine vs AsyncTask**

`AsyncTask` 已经过时，不推荐使用。Coroutine 更灵活，生命周期管理更清晰，也更容易组合。

**Coroutine vs RxJava**

RxJava 更强调响应式流和操作符组合，适合复杂事件流。Coroutine 更贴近顺序代码，可读性更好，和 Kotlin 语言、Jetpack 结合更自然。现代 Android 中，简单异步任务通常用 Coroutine，连续数据流用 Flow。

**Coroutine vs WorkManager**

Coroutine 是异步编程模型；WorkManager 是可靠后台任务调度框架。需要页面内异步任务用 Coroutine，需要离开页面甚至进程后可靠执行用 WorkManager。

## 面试口述版

Coroutine 是 Kotlin 提供的轻量级异步并发模型，在 Android 中主要用于网络请求、数据库操作、文件读写和并发任务编排。它解决了传统回调、Thread、Handler、AsyncTask 带来的代码嵌套、线程切换复杂和生命周期取消困难的问题。使用上通常在 ViewModel 中通过 `viewModelScope.launch` 启动页面相关任务，在 Repository 中暴露 `suspend` 函数，用 `withContext(Dispatchers.IO)` 执行 IO 操作，UI 层收集 Flow 时配合 `repeatOnLifecycle`。原理上，挂起函数会被编译成状态机，通过 `Continuation` 保存恢复点；协程上下文里包含 `Job` 和 `Dispatcher`，`Job` 管理生命周期，`Dispatcher` 决定运行线程；结构化并发保证子协程受父协程管理。它的局限是协程不是线程，耗时任务仍然要选对调度器；取消是协作式的；`GlobalScope` 容易造成泄漏；可靠后台任务应该用 WorkManager，而不是只依赖协程。

## 参考资料

- Android Developers: Use Kotlin coroutines with lifecycle-aware components  
  https://developer.android.com/topic/libraries/architecture/coroutines
- Android Developers: Best practices for coroutines in Android  
  https://developer.android.com/kotlin/coroutines/coroutines-best-practices
- Kotlin Documentation: Coroutines basics  
  https://kotlinlang.org/docs/coroutines-basics.html
- Kotlin Documentation: Coroutine context and dispatchers  
  https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html
