---
layout: post
title: "Android OkHttp 总结"
date: 2026-04-29 10:25:00 +0800
description: "梳理 OkHttp 在 Android 网络栈中的角色、核心类、连接复用、拦截器、缓存和面试重点。"
tags: [android, okhttp, network, interview]
categories: [android]
---

# Android OkHttp 总结

简洁结论：**OkHttp 是 Square 开源的高性能 HTTP 客户端，是 Android 网络请求体系中非常常见的底层网络库。** 它负责真正执行 HTTP 请求，提供连接复用、HTTP/2、GZIP、缓存、超时、重试、拦截器等能力。Retrofit 通常负责接口抽象，OkHttp 负责底层请求执行。

## 1. What：它是什么？

OkHttp 是一个 HTTP 客户端库，用来发送 HTTP/HTTPS 请求并接收响应。

在 Android 项目中，它通常承担网络栈的底层执行角色：

```text
ViewModel
  -> Repository
  -> Retrofit
  -> OkHttp
  -> Network
```

OkHttp 的核心类包括：

- `OkHttpClient`：HTTP 客户端，负责连接池、超时、拦截器、缓存等全局配置。
- `Request`：请求对象，包含 URL、method、headers、body。
- `Response`：响应对象，包含状态码、headers、body。
- `Call`：一次请求任务，可以同步执行或异步入队。
- `Interceptor`：拦截器，可以观察、修改、重试请求或响应。
- `Dispatcher`：管理异步请求并发。
- `ConnectionPool`：连接池，用于连接复用。

面试中可以一句话概括：**OkHttp 是 Android 常用的 HTTP 客户端，负责把请求真正发到网络，并通过连接池、拦截器、缓存和超时机制提升网络请求的性能和可维护性。**

## 2. Why：它解决了什么问题？

OkHttp 解决的是移动端网络请求的可靠性、性能和可扩展性问题。

如果直接使用原生 `HttpURLConnection` 或手写 Socket，会遇到很多问题：

- 请求构造和响应解析样板代码多。
- 连接复用、重定向、重试、缓存需要自己处理。
- 超时、取消、并发控制不统一。
- 统一加 header、token、日志、错误处理很麻烦。
- HTTPS、证书、HTTP/2 等细节复杂。

OkHttp 提供了成熟的 HTTP 客户端能力：

- 支持同步和异步请求。
- 支持连接池，减少 TCP/TLS 握手成本。
- 支持 HTTP/2，同一主机多个请求可以复用连接。
- 支持透明 GZIP，减少传输体积。
- 支持响应缓存，减少重复网络请求。
- 支持拦截器，便于统一加 token、日志、重试、缓存策略。
- 支持请求取消和超时配置。
- 支持 WebSocket。

典型场景：

- Retrofit 的底层 HTTP client。
- 直接下载文件、上传文件。
- 统一添加认证 header。
- 网络日志打印。
- token 失效后刷新 token。
- 配置证书锁定或自定义 TLS。

## 3. How：它怎么使用？

### 3.1 创建 OkHttpClient

官方推荐复用同一个 `OkHttpClient` 实例，因为它内部维护连接池和线程资源。

```kotlin
val client = OkHttpClient.Builder()
    .connectTimeout(10, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
    .addInterceptor(AuthInterceptor(tokenProvider))
    .build()
```

不要每次请求都创建新的 `OkHttpClient`，否则连接池无法复用，性能和资源占用都会变差。

### 3.2 同步请求

```kotlin
val request = Request.Builder()
    .url("https://api.example.com/users")
    .get()
    .build()

client.newCall(request).execute().use { response ->
    if (!response.isSuccessful) {
        throw IOException("Unexpected code $response")
    }

    val body = response.body.string()
}
```

同步请求会阻塞当前线程，因此不能在 Android 主线程执行。

### 3.3 异步请求

```kotlin
val request = Request.Builder()
    .url("https://api.example.com/users")
    .build()

client.newCall(request).enqueue(object : Callback {
    override fun onFailure(call: Call, e: IOException) {
        // 请求失败或被取消
    }

    override fun onResponse(call: Call, response: Response) {
        response.use {
            val body = it.body.string()
        }
    }
})
```

注意：OkHttp 的回调不一定在主线程。如果要更新 UI，需要切回主线程。

### 3.4 添加应用拦截器

```kotlin
class AuthInterceptor(
    private val tokenProvider: TokenProvider
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val newRequest = chain.request()
            .newBuilder()
            .addHeader("Authorization", "Bearer ${tokenProvider.token}")
            .build()

        return chain.proceed(newRequest)
    }
}
```

注册：

```kotlin
val client = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenProvider))
    .build()
```

应用拦截器常用于：

- 添加公共 header。
- 打印日志。
- 统一错误处理。
- 修改请求或响应。

### 3.5 配合 Retrofit

实际 Android 项目中更常见的是 Retrofit + OkHttp：

```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .client(client)
    .addConverterFactory(MoshiConverterFactory.create())
    .build()
```

这里 Retrofit 负责接口声明、参数解析、数据转换；OkHttp 负责实际 HTTP 请求。

### 3.6 配置缓存

```kotlin
val cache = Cache(
    directory = File(context.cacheDir, "http_cache"),
    maxSize = 50L * 1024L * 1024L
)

val client = OkHttpClient.Builder()
    .cache(cache)
    .build()
```

缓存是否生效不仅取决于客户端配置，也取决于服务端返回的缓存头。

## 4. Principle：它的核心原理是什么？

OkHttp 的核心原理可以概括为：**Call 抽象 + Dispatcher 调度 + 拦截器责任链 + 连接池复用 + 缓存和重试机制。**

### 4.1 Call 表示一次完整请求任务

OkHttp 用 `Call` 表示一次请求执行过程。

一次 `Call` 可能包含：

- 原始请求。
- 添加请求头。
- 缓存判断。
- DNS 解析。
- 连接建立。
- TLS 握手。
- 请求发送。
- 响应读取。
- 重定向。
- 认证重试。
- 失败后切换 route 重试。

所以 `Call` 不只是一次简单的 Socket 读写，而是完成一个 HTTP 请求所需的整体任务。

### 4.2 Dispatcher 管理异步并发

异步请求通过 `enqueue()` 加入队列，由 `Dispatcher` 管理并发。

它会限制：

- 总并发请求数。
- 单个 host 的并发请求数。

这样可以避免无限制创建网络请求导致资源耗尽。

### 4.3 拦截器责任链

OkHttp 最重要的设计之一是拦截器链。

拦截器可以在请求发出前和响应返回后插入逻辑：

```text
Request
  -> Interceptor 1
  -> Interceptor 2
  -> Cache / Connect / Network
  <- Response
```

每个拦截器都通过：

```kotlin
chain.proceed(request)
```

把请求传给下一个节点，并得到响应。

OkHttp 有两类拦截器：

- Application Interceptor：应用拦截器，更关注业务层请求和最终响应。
- Network Interceptor：网络拦截器，更接近真实网络层，可以看到重定向、网络连接等细节。

### 4.4 连接池和 HTTP/2

OkHttp 使用 `ConnectionPool` 复用连接。

连接复用的好处：

- 减少 TCP 握手。
- 减少 TLS 握手。
- 降低延迟。
- 节省电量和网络资源。

如果使用 HTTP/2，同一个 host 的多个请求还可以在同一连接上多路复用。

### 4.5 缓存、重定向和重试

OkHttp 会根据 HTTP 规范处理缓存、重定向、认证挑战和部分连接失败场景。

例如：

- 服务端返回可缓存响应时，后续请求可能直接走缓存。
- 302 等重定向响应可以触发后续请求。
- 连接失败时可能尝试备用 route。
- 认证失败时可通过 `Authenticator` 补充凭证后重试。

这些能力让业务层不用关心大量 HTTP 细节。

## 5. Trade-off：局限、缺点、常见坑和替代方案

OkHttp 很强，但它是 HTTP 客户端，不是完整网络架构。

### 5.1 不要频繁创建 OkHttpClient

`OkHttpClient` 内部有连接池和线程资源。频繁创建会导致：

- 连接无法复用。
- 资源浪费。
- 请求延迟增加。

通常应该在应用级或依赖注入容器中创建单例。

### 5.2 ResponseBody 必须关闭

同步请求中要使用：

```kotlin
response.use {
    // read body
}
```

如果不关闭响应体，连接可能无法回收，造成资源泄漏。

### 5.3 回调不在主线程

OkHttp 的异步回调不是 Android 主线程回调。更新 UI 前必须切换到主线程。

如果使用 Retrofit suspend + Coroutine，线程切换会更自然。

### 5.4 拦截器中不要做危险阻塞

拦截器会影响所有请求链路。里面如果做长时间阻塞、递归请求、错误锁等待，可能导致请求堆积甚至死锁。

尤其是 token 刷新逻辑，需要谨慎处理并发刷新和重试次数。

### 5.5 网络缓存依赖 HTTP 缓存语义

OkHttp 缓存不是万能缓存。它遵循 HTTP 缓存规则，是否缓存取决于请求和响应头。

如果业务要做离线缓存、数据库缓存、分页缓存，通常应该放在 Repository 或本地数据库层。

### 5.6 SSL 配置容易出安全问题

为了调试方便而信任所有证书、跳过主机名校验，是严重安全风险。生产环境应使用正确的证书链和必要时的证书锁定。

### 5.7 OkHttp 不负责接口抽象和 JSON 映射

OkHttp 处理的是 HTTP 请求和响应。它不会自动把接口方法映射成请求，也不会默认把 JSON 转成业务对象。

这些通常交给 Retrofit 和 Converter 完成。

### 5.8 类似技术对比

**OkHttp vs Retrofit**

OkHttp 是底层 HTTP 客户端，负责真正执行请求。Retrofit 是上层 REST API 声明框架，负责把接口注解转换成 HTTP 请求。Retrofit 默认通常基于 OkHttp 执行网络请求。

**OkHttp vs HttpURLConnection**

`HttpURLConnection` 是平台原生 API，能力基础但使用繁琐。OkHttp 提供更现代的连接池、拦截器、HTTP/2、缓存和更友好的 API。

**OkHttp vs Volley**

Volley 是 Android 早期常用网络库，适合小请求和请求队列管理。OkHttp 更偏通用高性能 HTTP 客户端，常作为 Retrofit 底层。

**OkHttp vs Ktor Client**

Ktor Client 是 Kotlin 多平台 HTTP 客户端，适合 KMP 场景。OkHttp 在 Android/JVM 网络栈中更成熟，生态中和 Retrofit 结合非常常见。

## 面试口述版

OkHttp 是 Android 中常用的高性能 HTTP 客户端，负责真正执行 HTTP 请求和接收响应。它解决的是网络请求性能、连接复用、超时、缓存、重试和统一拦截处理的问题。使用上一般创建一个全局复用的 `OkHttpClient`，通过 `Request` 构造请求，用 `Call.execute()` 同步执行或 `enqueue()` 异步执行；实际项目中更多是把 OkHttp 配给 Retrofit，并通过拦截器统一添加 token、日志和错误处理。原理上，OkHttp 用 `Call` 表示一次完整请求任务，用 `Dispatcher` 管理异步并发，用拦截器责任链处理请求和响应，同时通过连接池复用 HTTP/1.x 连接，并支持 HTTP/2 多路复用。它的常见坑是不要频繁创建 client、响应体要关闭、异步回调不在主线程、拦截器不要做危险阻塞、SSL 配置不能为了省事绕过安全校验。和 Retrofit 对比，OkHttp 是底层 HTTP client，Retrofit 是上层接口声明和数据转换框架。

## 参考资料

- OkHttp: Overview  
  https://square.github.io/okhttp/
- OkHttp: Calls  
  https://square.github.io/okhttp/features/calls/
- OkHttp: Interceptors  
  https://square.github.io/okhttp/features/interceptors/
- OkHttp: Connections  
  https://square.github.io/okhttp/features/connections/
- OkHttp: Caching  
  https://square.github.io/okhttp/features/caching/
