---
layout: post
title: "vlc-android-build"
date: 2017-12-18 15:26:00 +0800
tags: []
---

出现了如下的问题

1.环境变量的问题

```
Set $ANDROID_SDK to point to your Android SDK directory

export ANDROID_SDK=/path/to/android-sdk
Set $ANDROID_NDK to point to your Android NDK directory

export ANDROID_NDK=/path/to/android-ndk
Add some useful binaries to your $PATH

export PATH=$PATH:$ANDROID_SDK/platform-tools:$ANDROID_SDK/tools
```

2.Gradle下载过慢的问题
分析[compile.sh](https://code.videolan.org/videolan/vlc-android/blob/master/compile.sh)脚本发现它使用的gradle远程下载地址过慢.
解决办法就是将compile.sh中的gradle下载地址换掉

```
-   GRADLE_URL=https://download.videolan.org/pub/contrib/gradle/gradle-${GRADLE_VERSION}-bin.zip
+   GRADLE_URL=https://downloads.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip
```


3.clone vlc-3.0下载速度过慢的问题

需要分析[compile.sh](https://code.videolan.org/videolan/vlc-android/blob/master/compile.sh)脚本到底做了什么工作

```
malin@malin:~/gitlab/vlc-android$ sh compile.sh -a armeabi-v7a
VLC source not found, cloning
正克隆到 'vlc'...
remote: Counting objects: 540230, done.
remote: Compressing objects: 100% (103216/103216), done.
error: RPC failed; curl 56 GnuTLS recv error (-54): Error in the pull function.
fatal: The remote end hung up unexpectedly
fatal: 过早的文件结束符（EOF）
fatal: index-pack 失败
```

原因是网速过慢,下载中断了,解决方法,使用github的地址下载vlc-3.0
https://github.com/videolan/vlc-3.0

`git clone git@github.com:videolan/vlc-3.0.git vlc`

4.ndk的版本问题
ndk需要[android-ndk-r14b](https://developer.android.com/ndk/downloads/older_releases.html#ndk-14-downloads)



5.wrong sha1 sqlite-autoconf-3180200.tar.g
解决办法:手动下载放到制定的位置,并解压
`find . -name "*sqlite-autoconf-3180200*" -type f`
下载地址`https://sqlite.org/2017/sqlite-autoconf-3180200.tar.gz`

6.修改记录`git status`



Required by:
     project :libwrapper
  > Could not resolve com.android.support:appcompat-v7:26.1.0.
     > Could not get resource ''.
        > Could not HEAD 'https://maven.google.com/com/android/support/appcompat-v7/26.1.0/appcompat-v7-26.1.0.pom'.
           > Connect to maven.google.com:443 [] failed: Connection timed out: connect

https://maven.google.com/com/android/support/appcompat-v7/26.1.0/appcompat-v7-26.1.0.pom
maven.google.com/172.217.31.227

```
malin@malin:/onet/malin/vlc-android/vlc-android$ git diff compile.sh
diff --git a/compile.sh b/compile.sh
index 23d829cb0..183255539 100755
--- a/compile.sh
+++ b/compile.sh
@@ -117,7 +117,8 @@ fi
 if [ ! -d "gradle/wrapper" ]; then
     diagnostic "Downloading gradle"
     GRADLE_VERSION=4.1
-    GRADLE_URL=https://download.videolan.org/pub/contrib/gradle/gradle-${GRADLE_VERSION}-bin.zip
+    GRADLE_URL=https://downloads.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip
     wget ${GRADLE_URL} 2>/dev/null || curl -O ${GRADLE_URL}
     checkfail "gradle: download failed"

@@ -230,7 +231,8 @@ fi
 TESTED_HASH=3f53b97
 if [ ! -d "vlc" ]; then
     diagnostic "VLC source not found, cloning"
-    git clone https://git.videolan.org/git/vlc/vlc-3.0.git vlc
+    git clone git@github.com:videolan/vlc-3.0.git vlc
     checkfail "vlc source: git clone failed"
 fi
 diagnostic "VLC source found"
```

参考文章
[VLC-AndroidCompile](https://wiki.videolan.org/AndroidCompile#Get_VLC_Source)
[vlc-android Gitlab源码](https://code.videolan.org/videolan/vlc-android)
[videolan](https://git.videolan.org/)
[VLC-Github](https://github.com/videolan/vlc-3.0)
[protobuf3编译安装](https://github.com/google/protobuf/blob/master/src/README.md)
[从零开始在Linux编译VLC-Android开源项目](http://blog.csdn.net/wkw1125/article/details/56845405)
