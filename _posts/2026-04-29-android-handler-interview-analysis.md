---
layout: post
title: "Android Handler 总结"
date: 2026-04-29 10:05:00 +0800
description: "梳理 Android Handler、Looper、MessageQueue 和 Message 的消息机制，以及线程通信、延迟消息和内存泄漏问题。"
tags: [android, handler, interview]
categories: [android]
---

# Android Handler 总结

简洁结论：**Handler 是 Android 消息机制中的核心类，用于向某个线程的 MessageQueue 发送和处理 Message 或 Runnable。** 它常用于线程间通信、把子线程结果切回主线程、延迟任务和消息调度。Handler 背后的核心是 `Handler + Looper + MessageQueue + Message` 这一套消息循环机制。

## 1. What：它是什么？

Handler 是 Android Framework 提供的消息处理工具。

官方定义里，Handler 可以发送和处理与某个线程 `MessageQueue` 关联的 `Message` 和 `Runnable`。每个 Handler 都绑定到一个 `Looper`，消息最终会在这个 Looper 所属线程执行。

Handler 体系中常见角色：

- `Handler`：负责发送消息、发送 Runnable、处理消息。
- `Looper`：负责不断从 MessageQueue 中取消息并分发。
- `MessageQueue`：消息队列，保存待处理的 Message。
- `Message`：消息对象，包含 `what`、`arg1`、`arg2`、`obj`、`callback` 等信息。
- `HandlerThread`：自带 Looper 的线程。

面试中可以一句话概括：**Handler 是 Android 线程消息机制的入口类，它把任务投递到指定线程的消息队列中，并由该线程的 Looper 取出执行。**

## 2. Why：它解决了什么问题？

Handler 主要解决 Android 中线程间通信和主线程任务调度的问题。

Android 有一个重要规则：**UI 只能在主线程更新。**

但是很多耗时操作必须在子线程执行：

- 网络请求。
- 数据库读写。
- 文件读写。
- 图片解码。
- 复杂计算。

子线程完成任务后，需要把结果切回主线程更新 UI。Handler 就是早期最常用的主线程调度工具。

它解决的问题包括：

- 子线程向主线程发送任务。
- 主线程延迟执行任务。
- 在线程内部排队串行处理消息。
- 不同线程之间通过 Message 传递数据。
- HandlerThread 后台线程按消息顺序处理任务。

典型场景：

```text
子线程执行耗时任务
    -> Handler.post(...)
    -> 主线程 MessageQueue
    -> 主线程 Looper 分发
    -> 更新 UI
```

在现代 Android 中，很多场景可以被 Coroutine、Flow、LiveData、ViewModel 替代，但 Handler 仍然是理解 Android 主线程模型、事件分发、UI 刷新机制的基础。

## 3. How：它怎么使用？

### 3.1 主线程 Handler

现在推荐显式指定 Looper：

```kotlin
val mainHandler = Handler(Looper.getMainLooper())
```

把任务投递到主线程：

```kotlin
mainHandler.post {
    textView.text = "Loaded"
}
```

延迟执行：

```kotlin
mainHandler.postDelayed({
    showTimeout()
}, 3_000)
```

不要使用无参 `Handler()` 构造函数，因为隐式绑定当前线程 Looper 容易引发不明确的行为，官方也已经不推荐这种写法。

### 3.2 发送 Message

```kotlin
val handler = Handler(Looper.getMainLooper()) { msg ->
    when (msg.what) {
        MSG_UPDATE -> {
            val text = msg.obj as String
            textView.text = text
            true
        }
        else -> false
    }
}

val message = Message.obtain(handler, MSG_UPDATE, "Hello")
message.sendToTarget()
```

`post(Runnable)` 更适合简单任务；`sendMessage(Message)` 更适合带消息类型和参数的场景。

### 3.3 移除回调和消息

在页面销毁时，应该移除不再需要的延迟任务：

```kotlin
override fun onDestroy() {
    mainHandler.removeCallbacksAndMessages(null)
    super.onDestroy()
}
```

如果只想移除某个任务：

```kotlin
mainHandler.removeCallbacks(runnable)
```

### 3.4 使用 HandlerThread

如果需要一个带消息队列的后台线程，可以使用 `HandlerThread`：

```kotlin
val handlerThread = HandlerThread("worker").apply {
    start()
}

val workerHandler = Handler(handlerThread.looper)

workerHandler.post {
    doBackgroundWork()
}
```

释放：

```kotlin
handlerThread.quitSafely()
```

不过官方文档也提醒：如果不是必须使用 Handler API，后台任务可以优先考虑 `Executor`、`ExecutorService` 或 Kotlin coroutines。

### 3.5 Handler 与 Coroutine 的现代写法对比

过去常见：

```kotlin
Thread {
    val result = loadData()
    Handler(Looper.getMainLooper()).post {
        render(result)
    }
}.start()
```

现代 Kotlin 项目中更常见：

```kotlin
viewModelScope.launch {
    val result = withContext(Dispatchers.IO) {
        loadData()
    }
    render(result)
}
```

Handler 仍然重要，但日常业务异步代码通常会优先使用协程。

## 4. Principle：它的核心原理是什么？

Handler 的核心原理可以概括为：**一个线程对应一个 Looper，一个 Looper 对应一个 MessageQueue，Handler 负责入队和分发消息。**

### 4.1 Looper.prepare()

普通线程默认没有消息循环。如果要让一个线程拥有消息队列，需要调用：

```kotlin
Looper.prepare()
```

它会为当前线程创建 Looper 和 MessageQueue，并保存在线程本地变量中。

Android 主线程的 Looper 由系统创建，所以应用通常直接使用：

```kotlin
Looper.getMainLooper()
```

### 4.2 Handler 绑定 Looper

创建 Handler 时要指定 Looper：

```kotlin
val handler = Handler(Looper.getMainLooper())
```

这个 Handler 发送的消息会进入该 Looper 对应的 MessageQueue，最终在该 Looper 所属线程执行。

### 4.3 Message 入队

调用：

```kotlin
handler.post(runnable)
handler.sendMessage(message)
handler.postDelayed(runnable, delay)
```

本质上都是把任务封装成 Message，然后按执行时间插入 MessageQueue。

`post(Runnable)` 会把 Runnable 放到 Message 的 callback 字段里；`sendMessage(Message)` 通常由 Handler 的 `handleMessage()` 或 `Callback` 处理。

### 4.4 Looper.loop()

Looper 会不断循环：

```text
while true:
    msg = MessageQueue.next()
    msg.target.dispatchMessage(msg)
```

其中 `msg.target` 就是发送该消息的 Handler。

Handler 分发消息时大致顺序是：

```text
如果 Message 有 callback Runnable，执行 callback
否则如果 Handler 有 Callback，调用 Callback.handleMessage
否则调用 Handler.handleMessage
```

### 4.5 MessageQueue

MessageQueue 是一个按时间排序的消息队列。立即消息、延迟消息、指定时间消息都会放在里面。

当没有到期消息时，线程会阻塞等待；有消息到来或时间到达时，Looper 被唤醒继续处理。

### 4.6 ThreadLocal

每个线程只能有一个 Looper。Looper 通常通过 ThreadLocal 保存，因此：

```kotlin
Looper.myLooper()
```

能取到当前线程的 Looper。

这也是为什么在没有 Looper 的线程中直接创建 Handler 会出错。

## 5. Trade-off：局限、缺点、常见坑和替代方案

Handler 是 Android 基础机制，但业务开发中使用不当很容易出问题。

### 5.1 内存泄漏

经典问题是非静态内部类 Handler 持有外部 Activity 引用，而 MessageQueue 中又有延迟消息持有 Handler，导致 Activity 无法释放。

例如：

```text
MessageQueue -> Message -> Handler -> Activity
```

解决思路：

- 在 `onDestroy()` 中移除消息和回调。
- 避免长时间延迟任务持有 Activity。
- 使用静态内部类 + 弱引用。
- 现代项目中优先使用 lifecycle-aware 组件或协程作用域。

### 5.2 无参 Handler 构造函数不推荐

无参 `Handler()` 会隐式绑定当前线程的 Looper。问题是：

- 当前线程可能没有 Looper，导致崩溃。
- 绑定到哪个线程不够明确。
- Looper 退出后消息可能丢失。

推荐显式指定：

```kotlin
Handler(Looper.getMainLooper())
```

或者使用 `View.getHandler()`、`Executor`、Coroutine。

### 5.3 postDelayed 不保证精确执行

`postDelayed` 表示延迟到某个时间后加入执行条件，但如果主线程繁忙，实际执行会推迟。

因此它不适合做高精度定时器。

### 5.4 removeCallbacksAndMessages(null) 要谨慎

```kotlin
handler.removeCallbacksAndMessages(null)
```

会移除该 Handler 上所有回调和消息。如果同一个 Handler 被多个模块共享，可能误删其他任务。

更好的方式是用 token 或独立 Handler 管理任务。

### 5.5 MessageQueue 查询和删除可能是 O(n)

官方文档提到，检查或移除队列中的 callback/message 可能是最坏 O(n)。如果频繁做这类操作，可能带来性能问题。

可以考虑用外部状态标记取消，而不是频繁扫描队列。

### 5.6 HandlerThread 不适合所有后台任务

HandlerThread 是单线程串行队列，适合顺序处理消息。但如果任务是大量并发 IO 或需要结构化取消，Coroutine 或 Executor 可能更合适。

### 5.7 类似技术对比

**Handler vs Coroutine**

Handler 关注线程消息投递；Coroutine 关注结构化异步流程。现代 Android 业务异步逻辑更推荐 Coroutine，但 Handler 仍是主线程消息机制的基础。

**Handler vs Executor**

Executor 负责把任务提交到线程池执行；Handler 把任务提交到某个 Looper 线程的 MessageQueue。Handler 更适合指定线程串行消息处理，Executor 更适合通用线程池任务。

**Handler vs LiveData / StateFlow**

LiveData 和 StateFlow 更适合 UI 状态分发。Handler 更底层，只负责消息调度，不负责状态建模或生命周期感知。

**Handler vs View.post**

`View.post` 也是把 Runnable 投递到 View 关联线程的消息队列，底层仍然和 Handler/Looper 机制相关。它更适合和某个 View 绑定的 UI 操作。

**Handler vs HandlerThread**

Handler 是消息发送和处理工具；HandlerThread 是带 Looper 的后台线程，常和 Handler 配合使用。

## 面试口述版

Handler 是 Android 消息机制中的核心类，用来向某个线程的 MessageQueue 发送和处理 Message 或 Runnable。它解决的核心问题是线程间通信，尤其是子线程完成任务后切回主线程更新 UI，以及延迟任务和串行消息调度。使用上一般通过 `Handler(Looper.getMainLooper())` 创建主线程 Handler，然后调用 `post`、`postDelayed` 或 `sendMessage`；如果需要后台消息线程，可以使用 HandlerThread 创建带 Looper 的线程。原理上，一个线程可以通过 Looper 拥有一个 MessageQueue，Handler 负责把消息放入队列，Looper.loop 不断从队列中取出消息，并通过消息的 target Handler 分发执行。它的常见坑是 Handler 持有 Activity 导致内存泄漏、延迟消息未移除、无参 Handler 构造函数不推荐、postDelayed 不保证精确执行。现代 Android 中，业务异步流程更推荐 Coroutine，状态分发更推荐 LiveData 或 StateFlow，但 Handler 仍然是理解主线程消息循环和 UI 事件机制的基础。

## 参考资料

- Android Developers: Handler API reference  
  https://developer.android.com/reference/android/os/Handler.html
- Android Developers: Looper API reference  
  https://developer.android.com/reference/android/os/Looper
- Android Developers: MessageQueue API reference  
  https://developer.android.com/reference/android/os/MessageQueue
- Android Developers: Message API reference  
  https://developer.android.com/reference/android/os/Message
- Android Developers: HandlerThread API reference  
  https://developer.android.com/reference/android/os/HandlerThread.html
