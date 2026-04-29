---
layout: post
title: "Android Retrofit 总结"
date: 2026-04-29 10:30:00 +0800
description: "梳理 Retrofit 的声明式 API、注解、Converter、CallAdapter，以及它和 OkHttp 的协作方式。"
tags: [android, retrofit, network, interview]
categories: [android]
---

# Android Retrofit 总结

简洁结论：**Retrofit 是 Square 开源的类型安全 HTTP API 声明框架，常用于 Android 中把 REST API 描述成 Kotlin/Java 接口。** 它负责把接口方法、注解和参数转换成 HTTP 请求，并通过 Converter 把响应体转换成业务对象；真正的网络请求通常交给 OkHttp 执行。

## 1. What：它是什么？

Retrofit 是一个 HTTP API 客户端框架。它的核心思想是：**用接口和注解声明网络请求，让框架在运行时生成接口实现。**

例如：

```kotlin
interface UserApi {

    @GET("users/{id}")
    suspend fun getUser(
        @Path("id") id: String
    ): User
}
```

Retrofit 会根据这些注解生成请求：

```text
GET https://api.example.com/users/123
```

Retrofit 的核心角色包括：

- `Retrofit`：入口类，用来创建接口实现。
- Service Interface：定义 API 的接口。
- HTTP method annotations：例如 `@GET`、`@POST`、`@PUT`、`@DELETE`。
- Parameter annotations：例如 `@Path`、`@Query`、`@Body`、`@Header`。
- Converter：负责请求体和响应体转换，例如 Gson、Moshi、Kotlinx Serialization。
- CallAdapter：把 HTTP 调用适配成不同返回类型，例如 `Call<T>`、suspend、RxJava。
- OkHttp：默认常用的底层 HTTP client。

面试中可以一句话概括：**Retrofit 是对 HTTP API 的声明式封装，它把接口注解解析成 OkHttp 请求，并把响应转换成业务对象。**

## 2. Why：它解决了什么问题？

Retrofit 主要解决手写网络请求样板代码多、接口不清晰、参数拼接和 JSON 解析容易出错的问题。

如果只用 OkHttp 手写每个接口，通常要写：

- URL 拼接。
- Query 参数拼接。
- Header 添加。
- RequestBody 构造。
- ResponseBody 读取。
- JSON 解析。
- 错误处理。
- 线程和回调处理。

这些代码重复多，而且业务接口越多越难维护。

Retrofit 的价值是：

- 用接口统一描述后端 API。
- 用注解声明 URL、method、header、query、body。
- 自动把参数转换成请求。
- 自动把响应体转换成数据类。
- 支持 Kotlin `suspend` 函数。
- 支持 OkHttp 拦截器、连接池、缓存等能力。
- 接口定义清晰，便于测试和维护。

典型 Android 架构：

```text
ViewModel
    -> Repository
    -> Retrofit Service
    -> OkHttp
    -> Server
```

## 3. How：它怎么使用？

### 3.1 添加接口声明

```kotlin
interface UserApi {

    @GET("users/{id}")
    suspend fun getUser(
        @Path("id") id: String
    ): User

    @GET("users")
    suspend fun searchUsers(
        @Query("keyword") keyword: String,
        @Query("page") page: Int
    ): List<User>

    @POST("users")
    suspend fun createUser(
        @Body request: CreateUserRequest
    ): User
}
```

常见注解：

- `@GET`、`@POST`、`@PUT`、`@PATCH`、`@DELETE`：HTTP 方法。
- `@Path`：替换路径参数。
- `@Query`：添加查询参数。
- `@QueryMap`：批量添加查询参数。
- `@Header`：动态请求头。
- `@Headers`：静态请求头。
- `@Body`：请求体。
- `@FormUrlEncoded` + `@Field`：表单请求。
- `@Multipart` + `@Part`：文件上传。

### 3.2 创建 Retrofit 实例

```kotlin
val okHttpClient = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenProvider))
    .build()

val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .client(okHttpClient)
    .addConverterFactory(MoshiConverterFactory.create())
    .build()

val userApi = retrofit.create(UserApi::class.java)
```

注意：`baseUrl` 通常需要以 `/` 结尾，否则相对路径解析可能不符合预期。

### 3.3 在 Repository 中调用

```kotlin
class UserRepository(
    private val userApi: UserApi
) {

    suspend fun getUser(id: String): User {
        return userApi.getUser(id)
    }
}
```

ViewModel 中调用：

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    fun loadUser(id: String) {
        viewModelScope.launch {
            runCatching {
                repository.getUser(id)
            }.onSuccess { user ->
                // update ui state
            }.onFailure { throwable ->
                // update error state
            }
        }
    }
}
```

### 3.4 返回 Response<T>

如果需要拿到 HTTP 状态码、header 或错误体，可以返回 `Response<T>`：

```kotlin
@GET("users/{id}")
suspend fun getUserResponse(
    @Path("id") id: String
): Response<User>
```

调用时：

```kotlin
val response = api.getUserResponse(id)
if (response.isSuccessful) {
    val user = response.body()
} else {
    val errorBody = response.errorBody()
}
```

### 3.5 文件上传

```kotlin
interface UploadApi {

    @Multipart
    @POST("upload")
    suspend fun uploadAvatar(
        @Part file: MultipartBody.Part
    ): UploadResult
}
```

构造文件 part：

```kotlin
val requestBody = file.asRequestBody("image/jpeg".toMediaType())
val part = MultipartBody.Part.createFormData(
    name = "avatar",
    filename = file.name,
    body = requestBody
)
```

## 4. Principle：它的核心原理是什么？

Retrofit 的核心原理可以概括为：**接口动态代理 + 注解解析 + ServiceMethod 缓存 + Converter 转换 + CallAdapter 适配 + OkHttp 执行。**

### 4.1 动态代理生成接口实现

开发者只定义接口，不写实现类：

```kotlin
val api = retrofit.create(UserApi::class.java)
```

Retrofit 会通过动态代理创建接口实现。当调用接口方法时，代理对象会拦截方法调用，解析方法上的注解和参数。

### 4.2 注解解析成请求描述

Retrofit 会解析方法注解：

```kotlin
@GET("users/{id}")
```

也会解析参数注解：

```kotlin
@Path("id") id: String
```

然后组装出请求所需信息：

- HTTP method。
- 相对 URL。
- path 参数。
- query 参数。
- header。
- request body。

### 4.3 ServiceMethod 缓存

接口方法的注解解析有一定成本。Retrofit 会把解析结果缓存起来，避免每次调用都重复解析。

可以理解为：

```text
Method -> ServiceMethod -> RequestFactory / HttpServiceMethod
```

后续再次调用同一个接口方法时，可以复用解析结果。

### 4.4 Converter 负责数据转换

Retrofit 默认只能处理 OkHttp 的 `RequestBody` 和 `ResponseBody`。要把 JSON 转成业务对象，需要添加 Converter。

例如：

```kotlin
.addConverterFactory(MoshiConverterFactory.create())
```

Converter 负责：

- 把 `@Body` 对象转换成请求体。
- 把响应体转换成 `User`、`List<User>` 等业务类型。

### 4.5 CallAdapter 负责返回类型适配

CallAdapter 决定接口方法返回什么类型。

常见返回类型：

- `Call<T>`
- `suspend fun`
- RxJava `Single<T>` / `Observable<T>`
- Java `CompletableFuture`

Retrofit 官方文档中说明 Kotlin `suspend` 函数不需要额外依赖即可支持。

### 4.6 OkHttp 负责真正执行请求

Retrofit 自己不负责底层连接池、DNS、TLS、缓存和拦截器链。真正执行 HTTP 请求的通常是 OkHttp。

流程可以简化为：

```text
调用 API 接口方法
    -> 动态代理拦截
    -> 解析注解和参数
    -> Converter 处理 body
    -> CallAdapter 适配返回类型
    -> OkHttp Call 执行请求
    -> Converter 转换响应
    -> 返回业务对象
```

## 5. Trade-off：局限、缺点、常见坑和替代方案

Retrofit 能显著简化网络层，但它不是万能网络框架。

### 5.1 baseUrl 和相对路径容易写错

`baseUrl` 通常需要以 `/` 结尾：

```kotlin
baseUrl("https://api.example.com/")
```

接口路径如果以 `/` 开头，可能会覆盖 baseUrl 的路径部分。团队中最好统一 URL 写法。

### 5.2 suspend 不等于自动业务成功

Retrofit suspend 函数可以让网络请求写起来像同步代码，但 HTTP 错误码、业务错误码、异常仍然需要处理。

例如：

- 4xx / 5xx。
- 网络不可用。
- 超时。
- JSON 解析失败。
- 后端返回 code != 0。

这些需要 Repository 层统一封装结果。

### 5.3 Converter 顺序会影响解析

Retrofit 会按添加顺序查找 Converter。多个 Converter 同时存在时，顺序可能影响最终使用哪个 Converter。

### 5.4 不适合直接暴露给 UI 层

UI 层不应该直接调用 Retrofit Service。更合理的结构是：

```text
UI -> ViewModel -> Repository -> Retrofit Service
```

这样可以在 Repository 里统一处理缓存、错误映射、数据合并和测试替换。

### 5.5 错误体不会自动变成业务错误

`errorBody()` 需要手动解析。很多项目会封装统一的 `ApiResult` 或 `Result` 类型，避免每个接口重复处理。

### 5.6 大文件上传下载要关注进度和内存

Retrofit 可以上传下载文件，但进度监听、断点续传、大文件缓存、失败恢复等不是它自动解决的。复杂下载场景可能需要 OkHttp、DownloadManager、WorkManager 或专门下载模块。

### 5.7 动态代理和反射有运行时错误风险

接口注解写错、参数注解缺失、Converter 不匹配等问题，很多会在运行时暴露。因此接口层需要测试覆盖。

### 5.8 类似技术对比

**Retrofit vs OkHttp**

OkHttp 是底层 HTTP 客户端，负责真正执行请求；Retrofit 是上层接口声明框架，负责把接口方法转换成 HTTP 请求。二者通常配合使用。

**Retrofit vs HttpURLConnection**

`HttpURLConnection` 是原生底层 API，样板代码多。Retrofit 抽象层更高，接口更清晰，也更适合大型项目维护。

**Retrofit vs Volley**

Volley 提供请求队列、缓存和小请求处理能力，早期 Android 使用较多。Retrofit 更适合 REST API 接口声明和类型安全调用。

**Retrofit vs Ktor Client**

Ktor Client 是 Kotlin 多平台 HTTP 客户端，更适合 KMP。Retrofit 在 Android/JVM REST API 场景中生态成熟，和 OkHttp、Moshi、Hilt 等配合常见。

**Retrofit vs Apollo GraphQL**

Retrofit 面向 REST API；Apollo 更适合 GraphQL，有 schema、query、类型生成等能力。

## 面试口述版

Retrofit 是 Android 中常用的类型安全 HTTP API 框架，它通过接口和注解描述 REST 请求，比如 `@GET`、`@POST`、`@Path`、`@Query`、`@Body`，然后在运行时生成接口实现。它解决的是手写 URL、参数、请求体、响应解析样板代码多且容易出错的问题。使用上通常定义一个 API 接口，通过 `Retrofit.Builder` 配置 `baseUrl`、`OkHttpClient` 和 Converter，再在 Repository 中调用接口，ViewModel 不直接接触 Retrofit。原理上，Retrofit 通过动态代理拦截接口方法调用，解析方法和参数注解，构造成 OkHttp 请求；Converter 负责请求体和响应体转换，CallAdapter 负责适配返回类型，比如 `Call<T>`、suspend 或 RxJava，最终由 OkHttp 执行网络请求。它的常见坑包括 baseUrl 写法、错误码和业务错误需要统一处理、Converter 顺序、不要把 Service 直接暴露给 UI、大文件上传下载需要额外处理。和 OkHttp 对比，Retrofit 是上层 API 声明框架，OkHttp 是底层 HTTP 客户端。

## 参考资料

- Retrofit: Introduction  
  https://square.github.io/retrofit/
- Retrofit: Declarations  
  https://square.github.io/retrofit/declarations/
- Retrofit: Configuration  
  https://square.github.io/retrofit/configuration/
- Retrofit API: Retrofit class  
  https://square.github.io/retrofit/2.x/retrofit/retrofit2/Retrofit.html
