---
layout: post
title: "ANR-WatchDog、ACRA、Firebase Crashlytics、xCrash 核心原理对比总结"
date: 2026-05-13 10:00:00 +0800
description: "对比分析四大崩溃/ANR 检测库的核心实现原理：ANR-WatchDog、ACRA、Firebase Crashlytics 和 xCrash。"
tags: [android, crash-report, anr, crashlytics, acra, xcrash]
categories: [android]
---

## 一、总览对比表

| 维度             | ANR-WatchDog          | ACRA                             | Firebase Crashlytics                          | xCrash                           |
| ---------------- | --------------------- | -------------------------------- | --------------------------------------------- | -------------------------------- |
| **定位**         | ANR 检测工具          | Java 崩溃报告库                  | 云端崩溃分析服务                              | 本地崩溃+ANR 捕获库              |
| **Java Crash**   | ❌ 不捕获             | ✅ `UncaughtExceptionHandler`    | ✅ `UncaughtExceptionHandler`                 | ✅ `UncaughtExceptionHandler`    |
| **Native Crash** | ❌ 不支持             | ❌ 不支持（核心模块）            | ✅ Crashlytics NDK                            | ✅ 信号拦截（`sigaction`）       |
| **ANR 检测**     | ✅ Watchdog 心跳      | ❌ 无主动检测                    | ❌ 无主动检测                                 | ✅ SIGQUIT 信号监听              |
| **ANR 收集**     | 实时抛出 `ANRError`   | DropBox 被动附带（权限限制明显） | `ApplicationExitInfo` 历史回溯（Android 11+） | SIGQUIT 触发 ART Dump            |
| **线程堆栈**     | 主线程 + 可选其他线程 | Java 线程堆栈                    | Java + Native 堆栈                            | Java + Native + 锁 + GC          |
| **依赖系统 API** | 无                    | `DropBoxManager` / 系统日志权限  | `ApplicationExitInfo` (API 30+)               | `libart.so` 内部符号（兼容风险） |
| **网络权限**     | 无                    | 需自行配置发送                   | 内置上报（需联网）                            | 无（仅写本地文件）               |
| **离线可用**     | ✅                    | ✅                               | ⚠️ 需缓存待上报                               | ✅                               |

---

## 二、各库核心原理详解

### 1. ANR-WatchDog

**设计哲学**：极简的 ANR 检测器，不做崩溃收集，只做"主线程心跳检测"。

**ANR 检测原理**：

```
Watchdog 线程（后台）
  │
  ├─ 仅当上一轮的 _tick 已被主线程消费（_tick == 0）时
  │   才向主线程 Handler post _ticker（_ticker 会将 _tick 置 0）
  ├─ sleep(N 秒)
  └─ 检查 _tick 是否为 0
       ├─ 是 → 主线程在 N 秒内执行了 _ticker，正常
       └─ 否 → 主线程未消费心跳，判定为 ANR，构造 ANRError 抛出
            （此时本轮不再 post 新心跳）
```

**Crash 处理**：

- **本身不捕获任何 Crash**。它只是在检测到 ANR 时抛出一个继承自 `Error` 的 `ANRError`。
- 这个 `ANRError` 可以被系统的默认崩溃处理程序捕获，也可以被接入的其他崩溃收集库（如 ACRA、Crashlytics）捕获。但这会表现为一次未捕获异常导致的 Java Crash，而不是系统判定的原生 ANR。
- 生产环境如果只是想做实时预警，通常更适合配置自定义 listener，把堆栈作为 non-fatal 或自定义事件上报；默认抛出 `ANRError` 会主动终止进程，适合开发、测试或明确接受崩溃副作用的灰度场景。

**本质**：一个可以集成到任何崩溃收集体系中的 **ANR 检测探针**。

---

### 2. ACRA

**设计哲学**：开源的、可自托管的 Java 崩溃报告框架，强调灵活性和隐私可控。

**Java Crash 原理**：

```
应用发生未捕获异常
  │
  ▼
ErrorReporterImpl (UncaughtExceptionHandler)
  │
  ▼
ReportBuilder 组装报告数据
  │
  ▼
CrashReportDataFactory 并行调用所有 Collector
  ├─ ThreadCollector → 线程堆栈
  ├─ DeviceCollector → 设备信息
  ├─ DropBoxCollector → 系统日志（含 ANR）
  └─ ... 其他 Collector
  │
  ▼
持久化为本地文件 → 调度器选择时机发送（HTTP/Email/Notification）
```

**ANR 原理**：

- **无主动 ANR 检测机制**（无 Watchdog、无信号监听）。
- 通过 `DropBoxCollector` 在**发生崩溃时顺带读取**系统 `DropBoxManager` 中最近 `dropboxCollectionMinutes` 分钟（默认 5 分钟）的记录。
- 筛选的系统标签不止 ANR，而是一组：`system_app_anr`、`system_app_wtf`、`system_app_crash`、`system_server_anr`、`system_server_wtf`、`system_server_crash`、`SYSTEM_TOMBSTONE` 等（需开启 `includeDropBoxSystemTags`，默认 `false`），内容统一写入 `ReportField.DROPBOX` 字段。因此 ACRA 也能顺带捕到系统侧记录的 native tombstone 和 WTF。
- **致命限制**：所有这些都必须在 ACRA 本身生成一次报告时才会被读取；若发生 ANR 后没有后续 Java Crash 或手动报告，ANR/tombstone 信息不会自动变成 ACRA 报告。
- **权限限制**：`DropBoxManager` 读取系统标签通常受系统日志权限限制，普通三方应用很难依赖它稳定读取系统 ANR / tombstone 内容。因此 ACRA 的 DropBox 更适合看作“有权限时的附带信息”，不能当作主动 ANR 监控方案。

**Native Crash**：

- ACRA 核心模块**不支持** Native Crash 捕获。

---

### 3. Firebase Crashlytics

**设计哲学**：Google 提供的云端崩溃分析服务，强调全平台覆盖、实时统计、与其他 Firebase 服务联动。

**Java Crash 原理**：

- 与 ACRA 类似，注册 `Thread.UncaughtExceptionHandler` 捕获未捕获异常。
- 但增加了 Session 概念，崩溃数据与 Session 关联，支持"无崩溃用户率"等统计指标。

**Native Crash 原理**：

- 通过 `firebase-crashlytics-ndk` 模块集成 Crashlytics 的 NDK crash reporter。公开文档需要开发者添加 NDK 依赖并上传 native symbols，具体底层实现细节应以当前 SDK 为准。
- 在 Native 层注册信号处理器（`SIGSEGV`、`SIGABRT`、`SIGFPE`、`SIGILL`、`SIGBUS`、`SIGTRAP`）。
- Native crash 发生时，由 SDK 生成 minidump，下次启动时解析并上报。

**ANR 原理**：

```
应用启动初始化
  │
  ▼
CrashlyticsController.doCloseSessions(...)
  │
  ▼
SessionReportingCoordinator.persistRelevantAppExitInfoEvent(...)
  │
  ▼
ActivityManager.getHistoricalProcessExitReasons(null, 0, 0)
  │
  ▼
跳过 getReason() != ApplicationExitInfo.REASON_ANR 的条目
  │
  ▼
构造 Event(type="anr")
  │
  ▼
持久化为高优先级 Event → 随报告上报
```

- **完全被动**：依赖 Android 系统（API 30+）在进程退出时记录的 `ApplicationExitInfo`。
- **下次启动时**读取历史记录，提取 `REASON_ANR` 事件。
- 事件类型固定为 `"anr"`，包含 `appExitInfo`（pid、processName、traceFile 等）。公开 Android API 能保证的是历史退出原因和可选 trace 输入流；trace 可能为空或被系统清理，Crashlytics 控制台最终如何结构化展示也属于 SDK / 后台实现细节。

---

### 4. xCrash

**设计哲学**：爱奇艺开源的**自包含**崩溃捕获库，强调"零权限、零网络、零第三方依赖"，只负责生成本地 Tombstone 文件。

**Java Crash 原理**：

```
未捕获异常
  │
  ▼
JavaCrashHandler (UncaughtExceptionHandler)
  │
  ├─ notifyJavaCrashed() → 通知 Native/ANR 处理器暂停
  ├─ 创建 .java.xcrash 日志文件
  ├─ 写入 Tombstone 头部（时间、版本、设备信息）
  ├─ 写入 Java StackTrace
  ├─ 写入 logcat / FD 列表 / 网络信息 / 内存信息
  ├─ 写入其他线程 Java 堆栈（可选）
  └─ 触发 ICrashCallback.onCrash()
```

**Native Crash 原理**：

- 在 Native 层通过 `sigaction()` 注册信号处理器，并通过 `sigaltstack()` 设置 128 KB 备用栈（`SA_ONSTACK`），保证栈溢出场景下信号处理器仍可运行。
- 捕获 8 个信号：`SIGABRT`、`SIGBUS`、`SIGFPE`、`SIGILL`、`SIGSEGV`、`SIGTRAP`、`SIGSYS`、`SIGSTKFLT`。
- 信号触发后，通过 `clone(CLONE_VFORK | CLONE_FS | CLONE_UNTRACED)`（非 NDK 构建则退回 `fork()`）派生子进程，随即 `execl()` 启动**独立的 `xcrash_dumper` ELF 可执行文件**——dumper 与崩溃进程**完全隔离**，因此其代码无需是 async-signal-safe。
- Dumper 通过 `ptrace` attach 崩溃进程并读取其内存/寄存器，使用 xCrash **自研的 DWARF / ARM EXIDX 解析器**（`xcrash_dumper/xcd_dwarf.c`、`xcd_arm_exidx.c`）进行栈回溯；只有 in-process fallback 路径（`xc_fallback.c`）才会使用 libcorkscrew / libunwind / clang unwind。
- 最终产物：包含 Native 堆栈、寄存器、内存映射、FD 列表的 Tombstone 文件。

**ANR 原理**（最具特色）：

```
系统判定 ANR → 发送 SIGQUIT 到应用进程
  │
  ▼
xc_trace_handler (信号处理器)
  │
  ▼
eventfd 通知 xc_trace_dumper 线程
  │
  ▼
dump 线程执行：
  ├─ 创建 .trace.xcrash 文件
  ├─ dup2(stderr) 重定向到文件
  ├─ 调用 art::Runtime::DumpForSigQuit()  ← 直接调用 ART 内部方法
  ├─ 恢复 stderr
  ├─ 写入 logcat / FD / 内存信息
  ├─ tgkill() 转发 SIGQUIT 给系统 Signal Catcher（兼容系统行为）
  └─ Java 层 traceCallback()
       ├─ Util.checkProcessAnrState() 校验 NOT_RESPONDING
       └─ .trace.xcrash → .anr.xcrash 重命名
```

**核心亮点**：

- 劫持 `SIGQUIT` 信号，通过 `dlopen/dlsym` 调用 `libart.so` 内部的 `DumpForSigQuit`，尽量获取接近系统 `/data/anr/trace` 的内容。
- 这条路径依赖 ART 内部符号，不属于 Android SDK 稳定 API；Android 官方对 non-SDK interface 有兼容限制，因此新 Android 版本、厂商 ROM 或 ART 实现变化都可能影响可用性。
- 使用 `sigsetjmp/longjmp` 保护，防止调用 ART 内部方法时崩溃。
- 低版本（API < 21）使用 `FileObserver` 监视 `/data/anr/` 目录。

---

## 三、ANR 检测机制对比

| 维度                 | ANR-WatchDog                                                   | ACRA                             | Firebase Crashlytics                           | xCrash                                                                     |
| -------------------- | -------------------------------------------------------------- | -------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| **检测方式**         | 主动 Watchdog 心跳                                             | 无主动检测                       | 无主动检测                                     | 被动 SIGQUIT 信号                                                          |
| **检测时机**         | 主线程卡顿 N 秒时（实时）                                      | 崩溃时附带历史 DropBox           | 下次启动读取历史                               | ANR 发生瞬间                                                               |
| **是否依赖系统判定** | ❌ 否（与系统 5s ANR 完全脱钩，仅以主线程 N 秒未消费心跳为准） | ✅ 是（DropBox 内容）            | ✅ 是（系统记录的 ExitInfo）                   | ✅ 是（SIGQUIT 信号 + `getProcessesInErrorState()` 校验 `NOT_RESPONDING`） |
| **堆栈来源**         | `Thread.getStackTrace()`                                       | `DropBoxManager.getNextEntry()`  | `ApplicationExitInfo.getTraceInputStream()`    | `art::Runtime::DumpForSigQuit()`                                           |
| **Native 堆栈**      | ❌ 无                                                          | ❌ 无                            | ⚠️ trace 文本中可能出现，非 NDK 崩溃符号化链路 | ✅ 完整 Native 堆栈                                                        |
| **锁信息**           | ❌ 无                                                          | ❌ 无                            | ❌ 无                                          | ✅ 有（ART dump 输出）                                                     |
| **实时性**           | ⭐⭐⭐⭐⭐ 最高                                                | ⭐ 被动附带                      | ⭐⭐ 下次启动                                  | ⭐⭐⭐⭐ 发生瞬间                                                          |
| **准确性**           | ⭐⭐⭐ 可能误报（同步 Binder 短阻塞也会被算成 ANR）            | ⭐⭐ 受 DropBox 权限和可用性影响 | ⭐⭐⭐⭐⭐ 系统判定                            | ⭐⭐⭐⭐ 系统判定 + `checkProcessAnrState()` 二次校验，但依赖内部 ART 符号 |
| **信息丰富度**       | ⭐⭐⭐ 中等                                                    | ⭐⭐ 低                          | ⭐⭐⭐ 中等                                    | ⭐⭐⭐⭐⭐ 极高                                                            |

---

## 四、Crash 检测机制对比

| 维度             | ANR-WatchDog | ACRA                          | Firebase Crashlytics          | xCrash                        |
| ---------------- | ------------ | ----------------------------- | ----------------------------- | ----------------------------- |
| **Java Crash**   | ❌ 不捕获    | ✅ `UncaughtExceptionHandler` | ✅ `UncaughtExceptionHandler` | ✅ `UncaughtExceptionHandler` |
| **Native Crash** | ❌ 不支持    | ❌ 不支持                     | ✅ Crashlytics NDK minidump   | ✅ 信号处理+unwind            |
| **Java 堆栈**    | N/A          | ✅ 完整                       | ✅ 完整                       | ✅ 完整+其他线程              |
| **Native 堆栈**  | N/A          | ❌                            | ✅ minidump 解析              | ✅ inline unwind              |
| **寄存器信息**   | N/A          | ❌                            | ✅                            | ✅                            |
| **内存映射**     | N/A          | ❌                            | ✅                            | ✅                            |
| **logcat 附带**  | N/A          | ⚠️ 需配置                     | ✅ 自动                       | ✅ 自动                       |
| **网络发送**     | N/A          | ⚠️ 需配置                     | ✅ 内置                       | ❌ 仅本地文件                 |

---

## 五、如何选择？

| 场景                                          | 推荐方案                                          | 理由                                                                       |
| --------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| **只需要 ANR 预警（开发阶段）**               | ANR-WatchDog                                      | 实时、简单、无依赖，可在 ANR 临界点提前报警                                |
| **只需要 Java Crash 上报+自托管**             | ACRA                                              | 开源、灵活、支持多种发送方式（HTTP/邮件）                                  |
| **生产环境全平台监控+云端分析**               | Firebase Crashlytics                              | 自动上报、实时仪表板、支持 NDK、用户影响分析                               |
| **需要完整的本地 Tombstone+离线诊断**         | xCrash                                            | 信息最完整（Java/Native/ANR 统一格式）、零网络依赖、可接入私有上报通道     |
| **已有 Crashlytics，想补 ANR 实时预警**       | ANR-WatchDog + Crashlytics non-fatal / 自定义上报 | 不要默认把 `ANRError` 当作生产 ANR 上报方案；默认抛出会制造一次 Java Crash |
| **需要 ANR 根因深度分析（死锁/Native 阻塞）** | xCrash                                            | 通过 ART DumpForSigQuit 获取的锁信息和 Native 堆栈是其他库无法提供的       |

---

## 六、一句话总结

| 库                       | 核心原理一句话                                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **ANR-WatchDog**         | 用一个后台线程周期性地给主线程 Handler 发心跳任务，超时未响应就抛异常。                                                                 |
| **ACRA**                 | 通过 `UncaughtExceptionHandler` 捕获 Java 崩溃，ANR 仅在报告生成时尝试顺带从系统 DropBox 读取。                                         |
| **Firebase Crashlytics** | Java/Native 双通道崩溃捕获 + 下次启动时从系统 `ApplicationExitInfo` 回溯历史 ANR。                                                      |
| **xCrash**               | 拦截系统 ANR 的 `SIGQUIT` 信号，调用 ART 内部方法 DumpForSigQuit，生成包含 Java/Native 堆栈和锁信息的 Tombstone，但兼容性依赖内部实现。 |

---

## 七、参考资料

- [Android Developers: Diagnose and fix ANRs](https://developer.android.com/topic/performance/anrs/diagnose-and-fix-anrs)
- [Android API Reference: `ApplicationExitInfo`](https://developer.android.com/reference/android/app/ApplicationExitInfo)
- [Android API Reference: `DropBoxManager`](https://developer.android.com/reference/android/os/DropBoxManager)
- [Android Developers: Restrictions on non-SDK interfaces](https://developer.android.com/guide/app-compatibility/restrictions-non-sdk-interfaces)
- [Firebase Docs: Get started with Firebase Crashlytics](https://firebase.google.com/docs/crashlytics/get-started)
- [Firebase Docs: Get NDK crash reports](https://firebase.google.com/docs/crashlytics/ndk-reports)
- [Firebase Docs: Customize Crashlytics reports](https://firebase.google.com/docs/crashlytics/customize-crash-reports)
- [ACRA documentation](https://www.acra.ch/docs)
- [ANR-WatchDog repository](https://github.com/SalomonBrys/ANR-WatchDog)
- [xCrash repository](https://github.com/iqiyi/xCrash)
