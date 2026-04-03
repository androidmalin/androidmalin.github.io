---
layout: post
title: "rename-android-module-source-name"
date: 2017-11-28 15:30:00 +0800
tags: [gradle3]
---

0.socket5代理设置

`gradle -DsocksProxyHost=127.0.0.1 -DsocksProxyPort=1080 build`

1.[build cache](https://docs.gradle.org/current/userguide/build_cache.html)

开启:
`gradle assembleDebug --build-cache`

或者:


关闭:
`gradle assembleDebug --no-build-cache`

2.[daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)
```
Since Gradle 3.0, we enable Daemon by default and recommend using it for both developers' machines and Continuous Integration servers.
However, if you suspect that Daemon makes your CI builds unstable,
you can disable it to use a fresh runtime for each build since the runtime is completely isolated from any previous builds.

从Gradle 3.0开始，我们默认启用守护进程，并推荐将其用于开发人员的机器和持续集成服务器。
但是，如果您怀疑守护进程使得您的CI构建不稳定，则可以将其禁用,
以便为每个构建使用全新的运行时，因为运行时与以前的任何构建完全隔离。
```

开启:(从gradle3.0版本开始默认开启)
`gradle assembleDebug --daemon`

禁用:这个很重要.`可以让每个构建使用全新的运行时，因为运行时与以前的任何构建完全隔离`。

Windows:
`(if not exist "%USERPROFILE%/.gradle" mkdir "%USERPROFILE%/.gradle") && (echo. >> "%USERPROFILE%/.gradle/gradle.properties" && echo org.gradle.daemon=false >> "%USERPROFILE%/.gradle/gradle.properties")`

UNIX-like:
`mkdir -p ~/.gradle && echo "org.gradle.daemon=false" >> ~/.gradle/gradle.properties`
`gradle assembleDebug --no-daemon`

停止守护进程:
`gradle --stop`

验证是否已经停止
`jps`

```
As mentioned, the Daemon is a background process.
You needn’t worry about a build up of Gradle processes on your machine, though.
Every Daemon monitors its memory usage compared to total system memory and will stop itself if idle when available system memory is low.
If you want to explicitly stop running Daemon processes for any reason, just use the command gradle --stop.

This will terminate all Daemon processes that were started with the same version of Gradle used to execute the command.
If you have the Java Development Kit (JDK) installed, you can easily verify that a Daemon has stopped by running the `jps` command.
You’ll see any running Daemons listed with the name GradleDaemon


如前所述，守护进程是一个后台进程。
不过，您不必担心在您的计算机上建立Gradle进程。
每个守护进程监视其内存使用情况与系统总内存的比较，并在可用系统内存不足时自动停止。
如果由于某种原因想要显式地停止运行守护进程，只需使用命令gradle --stop即可。
这将终止所有用于执行命令的相同版本的Gradle启动的守护进程。
如果安装了Java Development Kit（JDK），则可以通过运行jps命令轻松验证守护程序是否已停止。
您将看到任何正在运行的名为GradleDaemon的守护进程。
```

3.GRADLE_USER_HOME路径的配置,这个很重要,可以解决Windows上Jenkins打包机器上,gradle cache路径过程导致的问题,曾经被困扰了一周.
`gradle assembleDebug -g /home/malin/gradlehome/`

```
Note, «GRADLE_USER_HOME» defaults to «USER_HOME»/.gradle, where «USER_HOME» is the home directory of the current user.
This location can be configured via the -g and --gradle-user-home command line switches,
as well as by the GRADLE_USER_HOME environment variable and org.gradle.user.home JVM system property.
```




4.配置的优先级
```
The --daemon and --no-daemon command line options enable and disable usage of the Daemon for individual build invocations when using the Gradle command line interface.
These command line options have the highest precedence when considering the build environment.
Typically, it is more convenient to enable the Daemon for an environment (e.g. a user account)
so that all builds use the Daemon without requiring to remember to supply the --daemon option
```


5.判断是否是守护进程导致的问题

```
If it is suspected that the Daemon process has become unstable, it can simply be killed.
Recall that the --no-daemon switch can be specified for a build to prevent use of the Daemon.
This can be useful to diagnose whether or not the Daemon is actually the culprit of a problem.
```

6.gradle4.3版本出错,关闭buildcache后正常,使用gradle4.4版本正常.

```
android.useDeprecatedNdk=true
org.gradle.daemon=false
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.configureondemand=true
android.enableBuildCache=false
org.gradle.caching=false
android.enableAapt2=true
android.enableD8=true
```
7.(build_environment)[https://docs.gradle.org/current/userguide/build_environment.html]
