---
layout: post
title: "shadowsocks-android-build"
date: 2017-12-14 11:39:00 +0800
tags: [shadowsocks]
---

源码
[shadowsocks-android](https://github.com/shadowsocks/shadowsocks-android)


编译按照github readme即可.
1.编译下载依赖速度很慢
2.出现一些日志[error](https://github.com/shadowsocks/shadowsocks-android/issues/1312)不要害怕

编译需要的工具
JDK
SBT(scal编译使用)
Go
Andorid SDK
- Build Tools 26+
- Android Support Repository and Google Repository (see `build.sbt` for version)
- Android NDK r16+

### PREREQUISITES

* JDK 1.8
* SBT 0.13.0+
* Go 1.4+
* Android SDK
  - Build Tools 26+
  - Android Support Repository and Google Repository (see `build.sbt` for version)
  - Android NDK r16+

### BUILD

* Set environment variable `ANDROID_HOME` to `/path/to/android-sdk`
* (optional) Set environment variable `ANDROID_NDK_HOME` to `/path/to/android-ndk` (default: `$ANDROID_HOME/ndk-bundle`)
* Set environment variable `GOROOT_BOOTSTRAP` to `/path/to/go`
* Create your key following the instructions at https://developer.android.com/studio/publish/app-signing.html
* Create `mobile/local.properties` from `mobile/local.properties.example` with your own key information
* Invoke the building like this

```bash
    git submodule update --init --recursive

    # Build the App
    sbt clean go-build android:package-release
```
