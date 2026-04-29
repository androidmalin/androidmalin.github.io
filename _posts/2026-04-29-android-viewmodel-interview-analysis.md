---
layout: post
title: "Android ViewModel 总结"
date: 2026-04-29 10:35:00 +0800
description: "梳理 Jetpack ViewModel 的职责、生命周期、状态保存、viewModelScope 和常见 Android 面试问题。"
tags: [android, jetpack, viewmodel, interview]
categories: [android]
---

# Android ViewModel 总结

简洁结论：**ViewModel 是 Android Jetpack 中用于管理 UI 状态和屏幕级业务逻辑的组件。** 它通常位于 UI 层和数据层之间，负责为 Activity、Fragment 或 Compose Screen 准备并暴露界面状态。它最大的价值是：在配置变化时保留状态，例如屏幕旋转导致 Activity/Fragment 重建时，ViewModel 不会立刻销毁。

## 1. What：它是什么？

ViewModel 是 Jetpack Architecture Components 中的一个 **屏幕级状态持有者**，官方现在也会把它描述为 UI 层中的业务逻辑或屏幕级状态持有者。

它通常负责：

- 保存 UI 状态。
- 暴露状态给 Activity、Fragment 或 Compose。
- 处理和当前页面相关的用户行为。
- 调用 Repository 或 UseCase 获取数据。
- 启动和页面相关的协程任务。
- 在作用域结束时清理资源。

典型结构是：

```text
Activity / Fragment / Compose
        ↓ observe / collect
ViewModel
        ↓ call
Repository / UseCase
        ↓
DataSource / Network / Database
```

面试中可以一句话概括：**ViewModel 不是 View，也不是数据层，它是 UI 层的状态和页面逻辑持有者，用来把 Activity/Fragment 从状态管理和业务调用中解耦出来。**

## 2. Why：它解决了什么问题？

ViewModel 主要解决 Activity/Fragment 直接管理状态带来的问题。

如果没有 ViewModel，很多状态和逻辑都会写在 Activity/Fragment 中：

- 网络请求结果。
- 加载、错误、空页面状态。
- 表单输入状态。
- 列表筛选条件。
- 页面事件处理。
- 数据层调用逻辑。

这样会带来几个问题：

### 2.1 配置变化导致状态丢失

Android 中屏幕旋转、语言切换、深色模式切换等配置变化，可能导致 Activity/Fragment 被销毁并重建。如果状态只放在 Activity/Fragment 字段里，重建后就会丢失。

ViewModel 的生命周期比普通 UI 控制器更长，可以跨配置变化保留数据。

### 2.2 Activity/Fragment 职责过重

Activity/Fragment 本来应该更偏向 UI 渲染和用户交互入口。如果同时负责请求数据、保存状态、处理业务逻辑，就会变得臃肿，难测试，也难维护。

ViewModel 可以把页面状态和页面业务逻辑抽离出来，让 UI 层更清晰：

- Activity/Fragment 负责渲染。
- ViewModel 负责准备 UI 状态。
- Repository 负责数据来源。

### 2.3 异步任务生命周期更清晰

页面相关的协程任务可以放在 `viewModelScope` 中启动。当 ViewModel 被清除时，`viewModelScope` 会自动取消，避免任务无限持有页面相关对象。

### 2.4 多个 Fragment 共享状态更方便

同一个 Activity 下的多个 Fragment 可以共享 Activity 范围的 ViewModel，例如列表页和详情页共享选中项状态。

```kotlin
private val viewModel: SharedViewModel by activityViewModels()
```

这比 Fragment 之间直接互相引用更解耦。

## 3. How：它怎么使用？

### 3.1 创建 ViewModel

现代 Android 项目中，ViewModel 常用 `StateFlow` 或 `LiveData` 暴露 UI 状态。

以 `StateFlow` 为例：

```kotlin
data class UserUiState(
    val isLoading: Boolean = false,
    val userName: String = "",
    val errorMessage: String? = null
)

class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun loadUser() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            runCatching {
                repository.getUser()
            }.onSuccess { user ->
                _uiState.value = UserUiState(userName = user.name)
            }.onFailure { throwable ->
                _uiState.value = UserUiState(
                    errorMessage = throwable.message
                )
            }
        }
    }
}
```

这里有几个面试重点：

- 对外暴露不可变的 `StateFlow` 或 `LiveData`。
- ViewModel 处理用户行为，例如 `loadUser()`。
- 真正的数据获取委托给 Repository。
- 异步任务使用 `viewModelScope`。

### 3.2 在 Fragment 中使用 ViewModel

```kotlin
class UserFragment : Fragment(R.layout.fragment_user) {

    private val viewModel: UserViewModel by viewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    render(state)
                }
            }
        }
    }

    private fun render(state: UserUiState) {
        binding.progressBar.isVisible = state.isLoading
        binding.userNameText.text = state.userName
    }
}
```

如果 ViewModel 暴露的是 `LiveData`，可以这样观察：

```kotlin
viewModel.userName.observe(viewLifecycleOwner) { name ->
    binding.userNameText.text = name
}
```

Fragment 中更新 View 时，推荐使用 `viewLifecycleOwner`，避免 Fragment View 销毁后仍然持有旧 View 引用。

### 3.3 在 Activity 中使用 ViewModel

```kotlin
class UserActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    render(state)
                }
            }
        }
    }
}
```

### 3.4 多个 Fragment 共享 ViewModel

如果多个 Fragment 需要共享同一个 Activity 范围的状态，可以使用：

```kotlin
private val viewModel: SharedViewModel by activityViewModels()
```

如果使用 Navigation，常见做法是使用导航图范围的 ViewModel，让同一导航图内的页面共享状态，导航图出栈后 ViewModel 被清理。

### 3.5 配合 Hilt 注入依赖

实际项目中 ViewModel 经常需要 Repository，可以用 Hilt 注入：

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel()
```

Fragment 中获取：

```kotlin
private val viewModel: UserViewModel by viewModels()
```

Compose 中可以使用：

```kotlin
val viewModel: UserViewModel = hiltViewModel()
val uiState by viewModel.uiState.collectAsStateWithLifecycle()
```

### 3.6 使用 SavedStateHandle

ViewModel 默认只能跨配置变化保留状态，不能天然应对系统杀进程。对于少量需要恢复的关键状态，可以使用 `SavedStateHandle`。

```kotlin
@HiltViewModel
class SearchViewModel @Inject constructor(
    private val repository: SearchRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    var query: String
        get() = savedStateHandle["query"] ?: ""
        set(value) {
            savedStateHandle["query"] = value
        }
}
```

适合放入 `SavedStateHandle` 的通常是轻量状态：

- 搜索关键词。
- 当前 tab。
- 选中项 ID。
- 表单中的少量输入。

不适合放大对象、Bitmap、完整列表数据或复杂业务缓存。

## 4. Principle：它的核心原理是什么？

ViewModel 的核心原理可以概括为：**ViewModelStoreOwner + ViewModelStore + ViewModelProvider + Factory。**

### 4.1 ViewModelStoreOwner

`ViewModelStoreOwner` 是 ViewModel 的作用域拥有者。

常见的 `ViewModelStoreOwner` 包括：

- Activity
- Fragment
- Navigation BackStackEntry

ViewModel 会绑定到某个作用域上。这个作用域决定了 ViewModel 能活多久。

例如：

- Activity 范围的 ViewModel，在 Activity 真正 finish 时清除。
- Fragment 范围的 ViewModel，在 Fragment 被移除或 detach 后清除。
- Navigation 目的地或导航图范围的 ViewModel，在对应 back stack entry 出栈后清除。

### 4.2 ViewModelStore

`ViewModelStore` 可以理解为保存 ViewModel 实例的容器。

它内部会按照 key 保存 ViewModel：

```text
ViewModelStore
  keyA -> UserViewModel
  keyB -> SearchViewModel
```

配置变化时，例如屏幕旋转，旧 Activity/Fragment 会销毁并重建，但对应作用域的 `ViewModelStore` 会被保留下来。新的 Activity/Fragment 再次请求 ViewModel 时，可以拿到之前的同一个 ViewModel 实例。

### 4.3 ViewModelProvider

`ViewModelProvider` 负责从 `ViewModelStore` 中获取 ViewModel。

流程大致是：

```text
UI 请求 ViewModel
     ↓
ViewModelProvider 根据 key 查找 ViewModelStore
     ↓
如果已经存在，直接返回旧实例
     ↓
如果不存在，通过 Factory 创建新实例并存入 ViewModelStore
```

所以面试中可以说：**ViewModel 能跨配置变化保留状态，不是因为它不受生命周期影响，而是因为它被存放在和 UI 控制器不同生命周期的 ViewModelStore 中。**

### 4.4 ViewModelProvider.Factory

如果 ViewModel 构造函数有参数，例如 Repository、SavedStateHandle，就需要 Factory 创建。

现在项目中常见的是使用 Hilt、Koin 或官方 `viewModelFactory` 简化 Factory 编写。

### 4.5 onCleared 和 viewModelScope

当 ViewModel 的作用域真正结束时，系统会清理 ViewModel，并调用：

```kotlin
override fun onCleared() {
    super.onCleared()
}
```

通常可以在这里释放和 ViewModel 相关的资源。

`viewModelScope` 是绑定到 ViewModel 的协程作用域。ViewModel 清除时，`viewModelScope` 会取消，因此适合运行和当前页面状态相关的协程任务。

需要注意：`viewModelScope` 的生命周期通常比 Activity/Fragment 的某一次 View 生命周期更长，所以不要在协程中直接持有 View 或 Binding。

## 5. Trade-off：局限、缺点、常见坑和替代方案

ViewModel 很重要，但它不是万能状态容器。

### 5.1 ViewModel 不能天然应对进程死亡

ViewModel 可以跨配置变化保留状态，但系统杀进程后，ViewModel 实例会丢失。

如果需要恢复少量关键 UI 状态，可以使用：

- `SavedStateHandle`
- `onSaveInstanceState`
- Compose 中的 `rememberSaveable`

如果是业务数据，应该依赖数据库、磁盘缓存或 Repository 重新加载。

### 5.2 不要持有 Activity、Fragment、View 或 Binding

这是 ViewModel 最常见的内存泄漏问题。

错误示例：

```kotlin
class UserViewModel(
    private val activity: Activity
) : ViewModel()
```

ViewModel 的生命周期可能长于 Activity/Fragment 的某次实例。如果它持有 Activity、Fragment、View、Binding、Dialog 等对象，就可能导致内存泄漏。

如果确实需要 Context，优先考虑传入 Application 级别能力，或者使用 `AndroidViewModel`，但不要把它当成默认选择。

### 5.3 不要把 ViewModel 写成万能业务类

ViewModel 属于 UI 层，不应该直接承担所有业务规则、数据库访问、网络请求细节。

更合理的职责划分是：

- ViewModel：页面状态、页面事件、调用业务入口。
- UseCase：封装具体业务规则。
- Repository：管理数据来源、缓存、远程和本地数据。
- DataSource：具体网络、数据库、文件实现。

否则 ViewModel 会变成另一个臃肿的 Activity。

### 5.4 作用域容易选错

不同写法对应不同 ViewModel 作用域：

```kotlin
by viewModels()
by activityViewModels()
navGraphViewModels()
hiltViewModel()
```

常见问题：

- 本来应该页面独立，却用了 Activity 共享 ViewModel，导致状态互相污染。
- 本来需要多个页面共享，却用了 Fragment 独立 ViewModel，导致状态无法同步。
- Navigation 出栈后期望状态保留，但实际 ViewModel 已经被清理。

面试中可以说：**使用 ViewModel 时要先确定状态属于哪个作用域，再决定用 Activity、Fragment 还是 Navigation Graph 范围。**

### 5.5 viewModelScope 不等于 UI 可见生命周期

`viewModelScope` 会在 ViewModel 清除时取消，但不会因为 Fragment 进入 `STOPPED` 就自动停止。

因此：

- 在 ViewModel 中加载页面状态，可以用 `viewModelScope`。
- 在 UI 层收集 Flow 更新界面，应该配合 `repeatOnLifecycle` 或 `collectAsStateWithLifecycle`。

否则页面不可见时仍然可能持续收集和更新 UI，造成资源浪费或崩溃风险。

### 5.6 一次性事件要谨慎设计

Toast、Snackbar、导航、弹窗这类一次性事件，不适合简单混在持久 UI 状态里，否则配置变化后可能重复消费。

常见方案：

- `SharedFlow`
- `Channel`
- 事件包装类
- 将事件转成明确的 UI 状态，并在消费后回写状态

在面试中可以表达为：**ViewModel 适合管理状态，但事件要单独建模。**

### 5.7 不适合长时间后台任务

ViewModel 适合页面相关任务，不适合执行必须离开页面后继续完成的任务。

例如：

- 大文件上传。
- 可靠后台同步。
- 定时任务。
- 用户可感知的长时间下载。

这些场景更适合：

- WorkManager
- Service / Foreground Service
- Repository 中的应用级任务管理

### 5.8 类似技术对比

**ViewModel vs Activity/Fragment 字段**

Activity/Fragment 字段会随 UI 控制器重建而丢失；ViewModel 可以跨配置变化保留状态。

**ViewModel vs SavedStateHandle**

ViewModel 保存内存中的 UI 状态，主要应对配置变化。`SavedStateHandle` 保存少量可恢复状态，可以辅助应对系统杀进程。

**ViewModel vs Repository**

ViewModel 面向 UI 状态和页面事件；Repository 面向数据来源和数据策略。二者是上下游协作关系，不是替代关系。

**ViewModel vs UseCase**

ViewModel 可以调用 UseCase，但不应该塞入大量复杂业务规则。复杂业务逻辑抽到 UseCase 更利于复用和测试。

**ViewModel vs Presenter**

Presenter 常见于 MVP，需要开发者自己管理生命周期和状态恢复；ViewModel 是 Jetpack 体系中的状态持有者，更适合和 Lifecycle、Navigation、Compose、Flow 等组件协作。

**ViewModel vs Compose remember**

`remember` 保存的是组合生命周期内的状态，适合局部 UI 状态。ViewModel 更适合屏幕级状态、业务逻辑和跨配置变化的状态。

**ViewModel vs rememberSaveable**

`rememberSaveable` 适合保存少量可序列化的 UI 状态，例如输入框内容、选中 tab。ViewModel 更适合管理完整页面状态和事件处理。

**ViewModel vs Plain State Holder**

Compose 中有时可以用普通状态持有类管理复杂组件状态。普通 state holder 更轻量，适合组合内部或可复用组件；ViewModel 更适合屏幕级、需要依赖数据层或跨配置变化的状态。

## 面试口述版

ViewModel 是 Android Jetpack 中用于管理 UI 状态和屏幕级业务逻辑的组件，通常作为 Activity、Fragment 或 Compose Screen 的状态持有者。它解决的核心问题是配置变化导致的状态丢失，以及 Activity/Fragment 直接承担太多状态管理和业务调用的问题。使用上一般是在 ViewModel 中暴露 `StateFlow` 或 `LiveData`，Activity/Fragment 负责观察或收集状态并渲染 UI，真正的数据获取交给 Repository 或 UseCase。原理上，ViewModel 会绑定到一个 `ViewModelStoreOwner`，比如 Activity、Fragment 或 Navigation BackStackEntry，实例存放在 `ViewModelStore` 中，由 `ViewModelProvider` 获取或创建。配置变化时 UI 控制器会重建，但 `ViewModelStore` 中的 ViewModel 可以保留；当作用域真正结束时，ViewModel 会被清理并调用 `onCleared()`，`viewModelScope` 也会取消。它的局限是不能天然应对系统杀进程，不能持有 Activity、Fragment、View 或 Binding，也不应该承担数据层职责。少量可恢复状态可以配合 `SavedStateHandle`，复杂业务逻辑应放到 UseCase 或 Repository，长期后台任务则应该考虑 WorkManager 或 Service。

## 参考资料

- Android Developers: ViewModel overview  
  https://developer.android.com/topic/libraries/architecture/viewmodel
- Android Developers: ViewModel API reference  
  https://developer.android.com/reference/androidx/lifecycle/ViewModel
- Android Developers: Saved State module for ViewModel  
  https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate
- Android Developers: SavedStateHandle API reference  
  https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle
- Android Developers: State and Jetpack Compose  
  https://developer.android.com/develop/ui/compose/state
