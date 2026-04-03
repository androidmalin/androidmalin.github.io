---
layout: post
title: "question"
date: 2017-11-21 11:02:00 +0800
tags: []
---

-19.查看webview 数据库文件db
`data/data/packagename/app_webview/Cookies`
使用sqilite
`sqlite3 Cookies`
`.help`
`.schema` List names of tables If TABLE specified, only list tables matching LIKE pattern TABLE
`.tables` Show the CREATE statements matching PATTERN Add --indent for pretty-printing
`.schema cookies`
`select * from cookies;` 查看cookies表

-18.

```
SUBSYSTEMS=="usb", ATTRS{idVendor}=="18d1", MODE="0640", OWNER="mbp"
```

```
malin@malin:~/sdk/platform-tools$ ll
总用量 8152
drwxrwxr-x  5 malin malin    4096 4月  14 13:41 ./
drwxrwxr-x 18 malin malin    4096 4月  16 14:57 ../
-rwxrwxr-x  1 malin malin 2604257 4月  14 13:41 adb*
drwxrwxr-x  2 malin malin    4096 4月  14 13:41 api/
-rwxrwxr-x  1 malin malin   57775 4月  14 13:41 dmtracedump*
-rwxrwxr-x  1 malin malin  795033 4月  14 13:41 e2fsdroid*
-rwxrwxr-x  1 malin malin  300287 4月  14 13:41 etc1tool*
-rwxrwxr-x  1 malin malin 1265485 4月  14 13:41 fastboot*
-rwxrwxr-x  1 malin malin   16938 4月  14 13:41 hprof-conv*
drwxrwxr-x  2 malin malin    4096 4月  14 13:41 lib64/
-rwxrwxr-x  1 malin malin  163952 4月  14 13:41 make_f2fs*
-rwxrwxr-x  1 malin malin  768379 4月  14 13:41 mke2fs*
-rwxrwxr-x  1 malin malin    1184 4月  14 13:41 mke2fs.conf*
-rw-rw-r--  1 malin malin  323847 4月  14 13:41 NOTICE.txt
-rw-rw-r--  1 malin malin   17208 4月  14 13:41 package.xml
-rwxrwxr-x  1 malin malin  703237 4月  14 13:41 sload_f2fs*
-rw-rw-r--  1 malin malin      38 4月  14 13:41 source.properties
-rwxrwxr-x  1 malin malin 1272133 4月  14 13:41 sqlite3*
drwxrwxr-x  3 malin malin    4096 4月  14 13:41 systrace/
malin@malin:~/sdk/platform-tools$ sudo chmod +s fastboot
[sudo] malin 的密码：
malin@malin:~/sdk/platform-tools$ ll
总用量 8152
drwxrwxr-x  5 malin malin    4096 4月  14 13:41 ./
drwxrwxr-x 18 malin malin    4096 4月  16 14:57 ../
-rwxrwxr-x  1 malin malin 2604257 4月  14 13:41 adb*
drwxrwxr-x  2 malin malin    4096 4月  14 13:41 api/
-rwxrwxr-x  1 malin malin   57775 4月  14 13:41 dmtracedump*
-rwxrwxr-x  1 malin malin  795033 4月  14 13:41 e2fsdroid*
-rwxrwxr-x  1 malin malin  300287 4月  14 13:41 etc1tool*
-rwsrwsr-x  1 malin malin 1265485 4月  14 13:41 fastboot*
-rwxrwxr-x  1 malin malin   16938 4月  14 13:41 hprof-conv*
drwxrwxr-x  2 malin malin    4096 4月  14 13:41 lib64/
-rwxrwxr-x  1 malin malin  163952 4月  14 13:41 make_f2fs*
-rwxrwxr-x  1 malin malin  768379 4月  14 13:41 mke2fs*
-rwxrwxr-x  1 malin malin    1184 4月  14 13:41 mke2fs.conf*
-rw-rw-r--  1 malin malin  323847 4月  14 13:41 NOTICE.txt
-rw-rw-r--  1 malin malin   17208 4月  14 13:41 package.xml
-rwxrwxr-x  1 malin malin  703237 4月  14 13:41 sload_f2fs*
-rw-rw-r--  1 malin malin      38 4月  14 13:41 source.properties
-rwxrwxr-x  1 malin malin 1272133 4月  14 13:41 sqlite3*
drwxrwxr-x  3 malin malin    4096 4月  14 13:41 systrace/

```

-17.android gradle插件升级到3.1.x之后出现的几个问题

[Configuration on demand is not supported by the current version of the Android Gradle plugin](https://stackoverflow.com/questions/49990933/configuration-on-demand-is-not-supported-by-the-current-version-of-the-android-g)

[The SourceSet 'xxx' is not recognized by the Android Gradle Plugin. Perhaps you misspelled something?](https://stackoverflow.com/questions/48846879/new-error-after-update-to-gradle-tool-to-3-1-0-beta3-or-3-2-0-alpha03)

[The SourceSet 'instrumentTest' is not recognized by the Android Gradle Plugin](https://stackoverflow.com/questions/49511200/the-sourceset-instrumenttest-is-not-recognized-by-the-android-gradle-plugin)







-16.使用IntelliJ IDEA搭建Android集成开发环境
idea没有sync button 解决方案,[https://stackoverflow.com/questions/20815998/cant-find-sync-project-with-gradle-files-button-in-intellij-idea](https://stackoverflow.com/questions/20815998/cant-find-sync-project-with-gradle-files-button-in-intellij-idea)


-15.sendStatReportRequest

```
04-24 18:52:14.071 11679-13684/? I/StatReportEngine: selfUpdateReport sendStatReportRequest
04-24 18:52:14.071 11679-13684/? I/SDKReportManager2: timelyReport
    >>mPostHandler handleMessage exit
04-24 18:52:14.071 11679-31357/? I/BaseHttpRequest: halleyTest serverUrl=http://masdk.3g.qq.com/
04-24 18:52:14.154 11679-31357/? I/StatReportEngine: errorCode: 0
04-24 18:52:14.155 11679-31357/? I/ProtocolPackage: enter
```
-14.Ubuntu Android Studio 使用ss配置代理.
在项目根目录下的gradle.properties中加入如下的配置
`org.gradle.jvmargs=-DsocksProxyHost=127.0.0.1 -DsocksProxyPort=1080`

-13.第三方sdk
`https://github.com/TuSDK/TuSDK-for-Android-demo`
`https://github.com/NodeMedia/NodeMediaClient-Android`
`https://github.com/vinc3m1/RoundedImageView`
`https://github.com/AgoraIO/Agora-Android-Tutorial-1to1/blob/master/README.zh.md`
`https://github.com/ksvc/KSYStreamer_Android`

org.lasque.tusdk : 图图sdk
org.lasque.tusdk
com.makeramen:RoundedImageView

-12.`Installation failed with message Failed to finalize session : INSTALL_FAILED_TEST_ONLY.`

```
Installation failed with message Failed to finalize session : INSTALL_FAILED_TEST_ONLY.
It is possible that this issue is resolved by uninstalling an existing version of the apk if it is present, and then re-installing.

WARNING: Uninstalling will remove the application data!

Do you want to uninstall the existing application?
```

-11.极光推动的问题
```
fix 极光推送没有配置jpush_notification_icon.png这个资源默认使用应用图标作为通知icon,在一加手机8.0系统上的引起的,因为网络状态切换导致的闪退.
https://docs.jiguang.cn/jpush/client/Android/android_guide/
https://community.jiguang.cn/t/android8-0-3/22652/5
https://community.jiguang.cn/t/android-3-1-0-android-8-0/23130/7
https://community.jiguang.cn/t/3t/24024/6
https://community.jiguang.cn/t/android-3-1-0-android-8-0/23130/6
https://community.jiguang.cn/t/android8-0-3/22652/5
https://community.jiguang.cn/t/android-3-1-0-android-8-0/23130/7
https://docs.jiguang.cn/jpush/client/Android/android_guide/
https://community.jiguang.cn/t/8-0/25616
```

-10.修改最近的commit注释
`git commit --amend`

-9.查看apk中可以去掉的第三个依赖中的文件`META-INF`下的配置文件
`unzip -p app.apk | strings | grep "META-INF" | sort | uniq | awk '{print $2}' | grep '^META-INF'`
`unzip -p app.apk | strings | grep "META-INF" | sort | uniq | awk '{print $2}' | grep '^META-INF' | cut -d '/' -f 2`

-8.
Android 6.0 版移除了对 Apache HTTP 客户端的支持。如果您的应用使用该客户端，并以 Android 2.3（API 级别 9）或更高版本为目标平台，请改用 HttpURLConnection 类。此 API 效率更高，因为它可以通过透明压缩和响应缓存减少网络使用，并可最大限度降低耗电量。要继续使用 Apache HTTP API，您必须先在 build.gradle 文件中声明以下编译时依赖项：

```
android {
    useLibrary 'org.apache.http.legacy'
}
```

-7.aliyun
```
buildscript {
    repositories {
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public/' }
        maven { url "http://repo1.maven.org/maven2" }
        jcenter { url "http://jcenter.bintray.com/" }
        maven { url "http://oss.sonatype.org/content/repositories/snapshots" }
        maven { url 'https://maven.google.com' }
        maven { url 'https://dl.google.com/dl/android/maven2/' }
        jcenter()
        google()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.1'
    }
}
```
-6.ClassLoader
[Android动态加载之ClassLoader详解](https://www.jianshu.com/p/a620e368389a)

-5.
`Warning:The `android.dexOptions.incremental` property is deprecated and it has no effect on the build process.`

-4.取消已经 push 的行为
`git reset -hard commmitId`

 强制 PUSH，此时远程分支已经恢复成指定的 commit 了
`git push origin master --force`

-3.gradle插件代码断点调试
`gradle assembleDebug -Dorg.gradle.jvmargs="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"`

或者在工程根目录下的`gradle.properties`文件中增加`org.gradle.jvmargs=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005`


`org.gradle.debug=(true,false)`
When set to true, Gradle will run the build with remote debugging enabled, listening on port 5005. Note that this is the equivalent of adding `-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005` to the JVM command line and will suspend the virtual machine until a debugger is attached.
Default is false.

参考
[How to run Jetty via Gradle in Debug Mode](https://stackoverflow.com/questions/9315398/how-to-run-jetty-via-gradle-in-debug-mode/9648945#)
[Gradle userguide build_environment](https://docs.gradle.org/current/userguide/build_environment.html)
[How do you attach a debugger to gradle so that I can debug it running a task?](https://discuss.gradle.org/t/how-do-you-attach-a-debugger-to-gradle-so-that-i-can-debug-it-running-a-task/7526)
[gradle-tip-attaching-a-debugger](http://www.jasondl.ee/posts/2013/gradle-tip-attaching-a-debugger.html)

-2.代码生成图片
https://github.com/dawnlabs/carbon
https://carbon.now.sh

-1.项目中gradle版本的升级
`gradle wrapper --gradle-version 4.0 --distribution-type all`

0.Release版本中去除Log代码
在app/build.gradle中增加,使用`proguard-android-optimize.txt`替换默认的`proguard-android.txt`
```
release {
            //noinspection GroovyAssignabilityCheck
            debuggable false
            zipAlignEnabled true
            signingConfig signingConfigs.myConfig
            minifyEnabled true //启用通过 ProGuard 实现的代码压缩
            shrinkResources true // 去除无效的资源文件
            // proguard-android.txt 文件的位置 /sdk/tools/proguard/
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
```
然后在`proguard-rules.pro`中增加

```
#-------------------------------log-------------------------------
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
    public static int wtf(...);
}

#keep 这个类
-keep class com.orhanobut.logger.AndroidLogAdapter
# 删除自定义的日志提示类提示语句
-assumenosideeffects class com.orhanobut.logger.AndroidLogAdapter {
     public static *** v(...);
     public static *** i(...);
     public static *** w(...);
     public static *** d(...);
     public static *** e(...);
     public static *** wtf(...);
}
#-------------------------------log-------------------------------
```

```
dump.txt 说明 APK 中所有类文件的内部结构。

mapping.txt提供原始与混淆过的类、方法和字段名称之间的转换。

seeds.txt 列出未进行混淆的类和成员。

usage.txt 列出从 APK 移除的代码。

这些文件保存在 <module-name>/build/outputs/mapping/release/ 中。
```
https://www.jianshu.com/p/9e98cba39227

1.v2签名问题,如何打印当前的签名是否是v2
在`app/build.gradle`中增加如下配置
```
signingConfigs {
    myConfig {
        storeFile file(STOREFILE)
        //noinspection GroovyAssignabilityCheck
        storePassword STOREPASSWORD
        //noinspection GroovyAssignabilityCheck
        keyAlias KEYALIAS
        //noinspection GroovyAssignabilityCheck
        keyPassword KEYPASSWORD
    }
}

//Release
println 'sign config_' + android.signingConfigs.myConfig

//Debug
println 'sign config_' + android.signingConfigs.debug
```
执行`gralde clean`

```
sign config_SigningConfig_Decorated{name=myConfig, storeFile=/home/malin/malin_demo/application/malin.jks, storePassword=xxxx, keyAlias=xxxx, keyPassword=xxxx, storeType=/home/malin/malin_demo/application/malin.jks, v1SigningEnabled=true, v2SigningEnabled=true}
```

2.http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0312/2587.html
查看编译使用的Proguard的版本
`gradle buildEnvironment | grep proguard`

3.如何查看一个依赖的依赖库.例如:`com.alibaba.android:ultraviewpager:1.0.3`
方法自己拼接pom的地址.
http://central.maven.org/maven2/com/alibaba/android/ultraviewpager/1.0.3/ultraviewpager-1.0.3.pom

4.aapt2
gradle.properties中增加`android.enableAapt2=false`
```
Error:(11) error: '@@array/pref_entries_player' is incompatible with attribute android:entries (attr) reference.
```

5.ndk
```
Error: Flag android.useDeprecatedNdk is no longer supported and will be removed in the next version of Android Studio.  Please switch to a supported build system.
  Consider using CMake or ndk-build integration. For more information, go to:
   https://d.android.com/r/studio-ui/add-native-code.html#ndkCompile
   To get started, you can use the sample ndk-build script the Android
   plugin generated for you at:
   /home/malin/panda2/pandalive-android-v2/jniverify/build/intermediates/ndk/debug/Android.mk
  Alternatively, you can use the experimental plugin:
   https://developer.android.com/r/tools/experimental-plugin.html
  To continue using the deprecated NDK compile for another 60 days, set
  android.deprecatedNdkCompileLease=1511234986381 in gradle.properties
```


6.
```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':libtest:packageDebugResources'.

/home/malin/malin_demo/ContentProviderSample/libtest/src/main/res/values/strings.xml: Error: In DataSet 'main', no data file for changedFile. This is an internal error in the incremental builds code; to work around it, try doing a full clean build.
```

7.
```
FAILURE: Build completed with 3 failures.

1: Task failed with an exception.
-----------
* What went wrong:
Could not resolve all files for configuration ':libxy:debugAnnotationProcessorClasspath'.
> Could not resolve org.apache.commons:commons-lang3:3.4.
  Required by:
      project :libxy > com.alibaba:arouter-compiler:1.1.4
   > Could not resolve org.apache.commons:commons-lang3:3.4.
      > Could not parse POM https://jcenter.bintray.com/org/apache/commons/commons-lang3/3.4/commons-lang3-3.4.pom
         > Could not resolve org.apache.commons:commons-parent:37.
            > Could not resolve org.apache.commons:commons-parent:37.
               > Could not get resource 'https://jcenter.bintray.com/org/apache/commons/commons-parent/37/commons-parent-37.pom'.
                  > Could not GET 'https://jcenter.bintray.com/org/apache/commons/commons-parent/37/commons-parent-37.pom'.
                     > Read timed out

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.
==============================================================================

2: Task failed with an exception.
-----------
* What went wrong:
Could not resolve all files for configuration ':libpanda:debugAnnotationProcessorClasspath'.
> Could not resolve org.apache.commons:commons-lang3:3.4.
  Required by:
      project :libpanda > com.alibaba:arouter-compiler:1.1.4
   > Could not resolve org.apache.commons:commons-lang3:3.4.
      > Could not parse POM https://jcenter.bintray.com/org/apache/commons/commons-lang3/3.4/commons-lang3-3.4.pom
         > Could not download commons-parent.pom (org.apache.commons:commons-parent:37): Skipped due to earlier error
   > Could not resolve org.apache.commons:commons-lang3:3.4.
      > Could not parse POM http://maven.aliyun.com/nexus/content/groups/public/org/apache/commons/commons-lang3/3.4/commons-lang3-3.4.pom
         > Could not download commons-parent.pom (org.apache.commons:commons-parent:37): Skipped due to earlier error

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.
==============================================================================

3: Task failed with an exception.
-----------
* What went wrong:
Could not resolve all files for configuration ':libsesame:debugAnnotationProcessorClasspath'.
> Could not resolve org.apache.commons:commons-lang3:3.4.
  Required by:
      project :libsesame > com.alibaba:arouter-compiler:1.1.4
   > Could not resolve org.apache.commons:commons-lang3:3.4.
      > Could not parse POM https://jcenter.bintray.com/org/apache/commons/commons-lang3/3.4/commons-lang3-3.4.pom
         > Could not download commons-parent.pom (org.apache.commons:commons-parent:37): Skipped due to earlier error
   > Could not resolve org.apache.commons:commons-lang3:3.4.
      > Could not parse POM http://maven.aliyun.com/nexus/content/groups/public/org/apache/commons/commons-lang3/3.4/commons-lang3-3.4.pom
         > Could not download commons-parent.pom (org.apache.commons:commons-parent:37): Skipped due to earlier error

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.
==============================================================================

* Get more help at https://help.gradle.org

BUILD FAILED in 2m 8s
1550 actionable tasks: 1550 executed
```

8.Telegram

Running dex as a separate process.

```
To run dex in process, the Gradle daemon needs a larger heap.
It currently has 1024 MB.
For faster builds, increase the maximum heap size for the Gradle daemon to at least 1536 MB.
To do this set org.gradle.jvmargs=-Xmx1536M in the project gradle.properties.
For more information see https://docs.gradle.org/current/userguide/build_environment.html


UNEXPECTED TOP-LEVEL ERROR:
java.lang.OutOfMemoryError: GC overhead limit exceeded
        at com.android.dx.util.ByteArray.slice(ByteArray.java:98)
        at com.android.dx.cf.cst.ConstantPoolParser.parseUtf8(ConstantPoolParser.java:417)
        at com.android.dx.cf.cst.ConstantPoolParser.parse0(ConstantPoolParser.java:271)
        at com.android.dx.cf.cst.ConstantPoolParser.parse0(ConstantPoolParser.java:297)
        at com.android.dx.cf.cst.ConstantPoolParser.parse(ConstantPoolParser.java:153)
        at com.android.dx.cf.cst.ConstantPoolParser.parseIfNecessary(ConstantPoolParser.java:127)
        at com.android.dx.cf.cst.ConstantPoolParser.getPool(ConstantPoolParser.java:118)
        at com.android.dx.cf.direct.DirectClassFile.parse0(DirectClassFile.java:505)
        at com.android.dx.cf.direct.DirectClassFile.parse(DirectClassFile.java:420)
        at com.android.dx.cf.direct.DirectClassFile.parseToInterfacesIfNecessary(DirectClassFile.java:402)
        at com.android.dx.cf.direct.DirectClassFile.getMagic(DirectClassFile.java:253)
        at com.android.dx.command.dexer.Main.parseClass(Main.java:774)
        at com.android.dx.command.dexer.Main.access$1600(Main.java:86)
        at com.android.dx.command.dexer.Main$ClassParserTask.call(Main.java:1745)
        at com.android.dx.command.dexer.Main.processClass(Main.java:757)
        at com.android.dx.command.dexer.Main.processFileBytes(Main.java:725)
        at com.android.dx.command.dexer.Main.access$1200(Main.java:86)
        at com.android.dx.command.dexer.Main$FileBytesConsumer.processFileBytes(Main.java:1698)
        at com.android.dx.cf.direct.ClassPathOpener.processArchive(ClassPathOpener.java:284)
        at com.android.dx.cf.direct.ClassPathOpener.processOne(ClassPathOpener.java:166)
        at com.android.dx.cf.direct.ClassPathOpener.process(ClassPathOpener.java:144)
        at com.android.dx.command.dexer.Main.processOne(Main.java:679)
        at com.android.dx.command.dexer.Main.processAllFiles(Main.java:571)
        at com.android.dx.command.dexer.Main.runMultiDex(Main.java:368)
        at com.android.dx.command.dexer.Main.runDx(Main.java:289)
        at com.android.dx.command.dexer.Main.main(Main.java:247)
        at com.android.dx.command.Main.main(Main.java:94)
```

在用户目录下.gradle目录下,建立gradle.properties文件.内容如下
/home/malin/.gradle/gradle.properties
```
android.useDeprecatedNdk=true
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true
#用aapt2
android.enableAapt2=true

android.enableBuildCache=true

#https://marschall.github.io/2017/04/17/disabling-gradle-cache.html
org.gradle.caching=true

#http://developers.googleblog.cn/2017/08/draft-android-dex.html
android.enableD8=true
```

9.
```
#.gradle 的路径过长，windows不支持,会出现如下错误
#C:\Windows\System32\config\systemprofile\.gradle\caches\transforms-1\files-1.1\appcompat-v7-27.0.0.aar\192971c5e8296a0a2330dc28124a19bf\res\layout\tooltip.xml: error: file not found
#需要修改.gradle的路径
#http://blog.h5min.cn/msl0903/article/details/71077898
#http://blog.csdn.net/qq_19764133/article/details/70792558
#http://www.cnblogs.com/doublegi/p/5956575.html
#http://blog.h5min.cn/msl0903/article/details/71077898
#https://stackoverflow.com/questions/43674890/jenkins-gradle-appmergedebugresources-unable-to-open-png-file
#https://stackoverflow.com/questions/47272220/appmergedebugresources-failed-error-java-util-concurrent-executionexception
#https://stackoverflow.com/questions/47471777/error-when-compiling-with-gradle-cant-find-downloaded-dependencies
#.gradle修改修改,增加环境变量
#$GRADLE_USER_HOME$
#或者配置gradle.user.home=C:\gradle-cache

最后解决办法:
1.解决.gradle路径过长的问题
gradle命令增加参数,不勾选Force GRADLE_USER_HOME
-g=$WORKSPACE/.gradlecache
```
10.
Error:Execution failed for task ':libbiz:mockableAndroidJar'.
`Output file [/home/malin/pandarecorder-android/src/libbiz/build/generated/mockable-android-27.v3.jar] already exists.`


11.
```
>Task :app:transformDexArchiveWithDexMergerForGuanwangDebug FAILED
Dex: Error converting bytecode to dex:
Cause: com.android.dex.DexException: Multiple dex files define Ltv/panda/PandaSocket/panda/packet/PacketBodyPushMessage;
    UNEXPECTED TOP-LEVEL EXCEPTION:
    com.android.dex.DexException: Multiple dex files define Ltv/panda/PandaSocket/panda/packet/PacketBodyPushMessage;

com.android.dex.DexException: Multiple dex files define Ltv/panda/PandaSocket/panda/packet/PacketBodyPushMessage;
        at com.android.dx.merge.DexMerger.readSortableTypes(DexMerger.java:661)
        at com.android.dx.merge.DexMerger.getSortedTypes(DexMerger.java:616)
        at com.android.dx.merge.DexMerger.mergeClassDefs(DexMerger.java:598)
        at com.android.dx.merge.DexMerger.mergeDexes(DexMerger.java:171)
        at com.android.dx.merge.DexMerger.merge(DexMerger.java:198)
        at com.android.builder.dexing.DexArchiveMergerCallable.call(DexArchiveMergerCallable.java:61)
        at com.android.builder.dexing.DexArchiveMergerCallable.call(DexArchiveMergerCallable.java:36)
        at java.util.concurrent.ForkJoinTask$AdaptedCallable.exec(ForkJoinTask.java:1424)
        at java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:289)
        at java.util.concurrent.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1056)
        at java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1692)
        at java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:157)
```

12.android studio 启动崩溃
malin@malin:~$ `sh android-studio/android-studio-3.0.1/bin/studio.sh`

```
#
# A fatal error has been detected by the Java Runtime Environment:
#
#  SIGSEGV (0xb) at pc=0x00007fd5b854a679, pid=3819, tid=0x00007fd545816700
#
# JRE version: OpenJDK Runtime Environment (8.0_152-b01) (build 1.8.0_152-release-915-b01)
# Java VM: OpenJDK 64-Bit Server VM (25.152-b01 mixed mode linux-amd64 compressed oops)
# Problematic frame:
# V  [libjvm.so+0x640679]  jni_GetObjectClass+0x69
#
# Failed to write core dump. Core dumps have been disabled. To enable core dumping, try "ulimit -c unlimited" before starting Java again
#
# An error report file with more information is saved as:
# /home/malin/java_error_in_STUDIO_3819.log
#
# If you would like to submit a bug report, please visit:
#   http://bugreport.java.com/bugreport/crash.jsp
#
Aborted (core dumped)
```

13.gradle 编译时使用的Proguard版本
```
# Starting with version 2.2 of the Android plugin for Gradle, this file is distributed together with
# the plugin and unpacked at build-time. The files in $ANDROID_HOME are no longer maintained and
# will be ignored by new version of the Android plugin for Gradle.
```

14.项目增加git远程地址

```
git remote add origin git@github.com:yourname/projectname.git
git push -u origin master
```

15.
```
AndroidRuntime  D  Shutting down VM
E  FATAL EXCEPTION: main
E  Process: tv.panda.live.broadcast, PID: 4685
E  java.lang.RuntimeException: Unable to instantiate application tv.panda.live.broadcast.PandaApplication: java.lang.ClassNotFoundException: Didn't find class "tv.panda.live.broadcast.PandaApplication" o
   n path: DexPathList[[zip file "/data/app/tv.panda.live.broadcast-1/base.apk"],nativeLibraryDirectories=[/data/app/tv.panda.live.broadcast-1/lib/arm, /vendor/lib, /system/lib]]
E      at android.app.LoadedApk.makeApplication(LoadedApk.java:572)
E      at android.app.ActivityThread.handleBindApplication(ActivityThread.java:4883)
E      at android.app.ActivityThread.access$1500(ActivityThread.java:178)
E      at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1573)
E      at android.os.Handler.dispatchMessage(Handler.java:111)
E      at android.os.Looper.loop(Looper.java:194)
E      at android.app.ActivityThread.main(ActivityThread.java:5691)
E      at java.lang.reflect.Method.invoke(Native Method)
E      at java.lang.reflect.Method.invoke(Method.java:372)
E      at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:959)
E      at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:754)
E  Caused by: java.lang.ClassNotFoundException: Didn't find class "tv.panda.live.broadcast.PandaApplication" on path: DexPathList[[zip file "/data/app/tv.panda.live.broadcast-1/base.apk"],nativeLibraryDi
   rectories=[/data/app/tv.panda.live.broadcast-1/lib/arm, /vendor/lib, /system/lib]]
E      at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:56)
E      at java.lang.ClassLoader.loadClass(ClassLoader.java:511)
E      at java.lang.ClassLoader.loadClass(ClassLoader.java:469)
E      at android.app.Instrumentation.newApplication(Instrumentation.java:988)
E      at android.app.LoadedApk.makeApplication(LoadedApk.java:567)
E      ... 10 more
E      Suppressed: java.lang.ClassNotFoundException: tv.panda.live.broadcast.PandaApplication
E          at java.lang.Class.classForName(Native Method)
E          at java.lang.BootClassLoader.findClass(ClassLoader.java:781)
E          at java.lang.BootClassLoader.loadClass(ClassLoader.java:841)
E          at java.lang.ClassLoader.loadClass(ClassLoader.java:504)
E          ... 13 more
E      Caused by: java.lang.NoClassDefFoundError: Class not found using the boot class loader; no stack available

```

16.
```
Error:Execution failed for task ':libdetail:processDebugAndroidTestManifest'.
> Manifest merger failed : Attribute application@label value=(@string/app_name) from [__tested_artifact__::libdetail] AndroidManifest.xml:10:9-41
  	is also present at [:libshare] AndroidManifest.xml:9:18-62 value=(@string/pl_libshare_app_name).
  	Suggestion: add 'tools:replace="android:label"' to <application> element at manifestMerger2207436844503973186.xml:7:5-9:19 to override.
```

17.
```
Error:Execution failed for task ':app:processDebugManifest'.
> Multiple entries with same key: tools:label=REPLACE and android:label=REPLACE
```
18.
```
Caused by: java.io.IOException: 设备上没有空间
        at java.io.FileOutputStream.writeBytes(Native Method)
        at java.io.FileOutputStream.write(FileOutputStream.java:326)
        at org.gradle.internal.hash.DefaultStreamHasher.doHash(DefaultStreamHasher.java:58)
        at org.gradle.internal.hash.DefaultStreamHasher.hashCopy(DefaultStreamHasher.java:46)
        at org.gradle.caching.internal.tasks.TarTaskOutputPacker.unpackPropertyEntry(TarTaskOutputPacker.java:338)
        at org.gradle.caching.internal.tasks.TarTaskOutputPacker.unpack(TarTaskOutputPacker.java:281)
        at org.gradle.caching.internal.tasks.TarTaskOutputPacker.unpack(TarTaskOutputPacker.java:241)
        at org.gradle.caching.internal.tasks.GZipTaskOutputPacker.unpack(GZipTaskOutputPacker.java:66)
        at org.gradle.caching.internal.tasks.TaskOutputCacheCommandFactory$LoadCommand.load(TaskOutputCacheCommandFactory.java:121)
```

19.

```
malin@malin:~/gitlab/vlc-android$ sh compile.sh -a armeabi-v7a
Downloading gradle
Archive:  gradle-4.1-bin.zip
   creating: gradle-4.1/
  inflating: gradle-4.1/LICENSE      
  inflating: gradle-4.1/NOTICE       
   creating: gradle-4.1/media/
  inflating: gradle-4.1/media/gradle-icon-16x16.png  
  inflating: gradle-4.1/media/gradle-icon-48x48.png  
  inflating: gradle-4.1/media/gradle-icon-32x32.png  
  inflating: gradle-4.1/media/gradle-icon-24x24.png  
  inflating: gradle-4.1/media/gradle-icon-64x64.png  
  inflating: gradle-4.1/media/gradle-icon-512x512.png  
  inflating: gradle-4.1/media/gradle.icns  
  inflating: gradle-4.1/media/gradle-icon-256x256.png  
  inflating: gradle-4.1/media/gradle-icon-128x128.png  
   creating: gradle-4.1/init.d/
  inflating: gradle-4.1/init.d/readme.txt  
  inflating: gradle-4.1/getting-started.html  
   creating: gradle-4.1/bin/
  inflating: gradle-4.1/bin/gradle.bat  
  inflating: gradle-4.1/bin/gradle   
   creating: gradle-4.1/lib/
  inflating: gradle-4.1/lib/annotations-13.0.jar  
  inflating: gradle-4.1/lib/gradle-kotlin-dsl-0.10.3.jar  
  inflating: gradle-4.1/lib/gradle-kotlin-dsl-compiler-plugin-0.10.3.jar  
  inflating: gradle-4.1/lib/gradle-kotlin-dsl-tooling-builders-0.10.3.jar  
  inflating: gradle-4.1/lib/gradle-kotlin-dsl-tooling-models-0.10.3.jar  
  inflating: gradle-4.1/lib/kotlin-compiler-embeddable-1.1.3-2.jar  
  inflating: gradle-4.1/lib/kotlin-reflect-1.1.3-2.jar  
  inflating: gradle-4.1/lib/kotlin-stdlib-1.1.3-2.jar  
  inflating: gradle-4.1/lib/gradle-launcher-4.1.jar  
  inflating: gradle-4.1/lib/gradle-runtime-api-info-4.1.jar  
  inflating: gradle-4.1/lib/gradle-tooling-api-4.1.jar  
  inflating: gradle-4.1/lib/gradle-wrapper-4.1.jar  
  inflating: gradle-4.1/lib/gradle-installation-beacon-4.1.jar  
  inflating: gradle-4.1/lib/gradle-core-4.1.jar  
  inflating: gradle-4.1/lib/gradle-jvm-services-4.1.jar  
  inflating: gradle-4.1/lib/gradle-logging-4.1.jar  
  inflating: gradle-4.1/lib/gradle-process-services-4.1.jar  
  inflating: gradle-4.1/lib/gradle-resources-4.1.jar  
  inflating: gradle-4.1/lib/gradle-native-4.1.jar  
  inflating: gradle-4.1/lib/gradle-model-groovy-4.1.jar  
  inflating: gradle-4.1/lib/gradle-model-core-4.1.jar  
  inflating: gradle-4.1/lib/gradle-base-services-groovy-4.1.jar  
  inflating: gradle-4.1/lib/gradle-messaging-4.1.jar  
  inflating: gradle-4.1/lib/gradle-base-services-4.1.jar  
  inflating: gradle-4.1/lib/gradle-cli-4.1.jar  
  inflating: gradle-4.1/lib/kryo-2.20.jar  
  inflating: gradle-4.1/lib/reflectasm-1.07-shaded.jar  
  inflating: gradle-4.1/lib/asm-debug-all-6.0_ALPHA.jar  
  inflating: gradle-4.1/lib/commons-io-2.2.jar  
  inflating: gradle-4.1/lib/jul-to-slf4j-1.7.10.jar  
  inflating: gradle-4.1/lib/log4j-over-slf4j-1.7.10.jar  
  inflating: gradle-4.1/lib/jcl-over-slf4j-1.7.10.jar  
  inflating: gradle-4.1/lib/slf4j-api-1.7.10.jar  
  inflating: gradle-4.1/lib/guava-jdk5-17.0.jar  
  inflating: gradle-4.1/lib/jsr305-1.3.9.jar  
  inflating: gradle-4.1/lib/commons-lang-2.6.jar  
  inflating: gradle-4.1/lib/jcip-annotations-1.0.jar  
  inflating: gradle-4.1/lib/groovy-all-2.4.11.jar  
  inflating: gradle-4.1/lib/ant-1.9.6.jar  
  inflating: gradle-4.1/lib/javax.inject-1.jar  
  inflating: gradle-4.1/lib/commons-collections-3.2.2.jar  
  inflating: gradle-4.1/lib/native-platform-0.14.jar  
  inflating: gradle-4.1/lib/gradle-docs-4.1.jar  
  inflating: gradle-4.1/lib/jansi-1.14.jar  
  inflating: gradle-4.1/lib/ant-launcher-1.9.6.jar  
  inflating: gradle-4.1/lib/native-platform-freebsd-amd64-libcpp-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-freebsd-amd64-libstdcpp-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-freebsd-i386-libcpp-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-freebsd-i386-libstdcpp-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-linux-amd64-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-linux-i386-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-osx-amd64-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-osx-i386-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-windows-amd64-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-windows-i386-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-linux-amd64-ncurses5-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-linux-amd64-ncurses6-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-linux-i386-ncurses5-0.14.jar  
  inflating: gradle-4.1/lib/native-platform-linux-i386-ncurses6-0.14.jar  
  inflating: gradle-4.1/lib/minlog-1.2.jar  
  inflating: gradle-4.1/lib/objenesis-1.2.jar  
   creating: gradle-4.1/lib/plugins/
  inflating: gradle-4.1/lib/plugins/gradle-code-quality-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-antlr-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-osgi-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-signing-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-plugin-development-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-maven-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-ide-play-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-ide-native-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-ide-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-scala-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-build-comparison-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-ear-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-platform-play-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-javascript-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-ivy-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-jacoco-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-build-init-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-plugins-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-tooling-api-builders-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-test-kit-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-composite-builds-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-announce-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-language-groovy-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-language-scala-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-testing-jvm-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-language-java-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-language-jvm-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-platform-jvm-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-testing-native-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-language-native-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-platform-native-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-diagnostics-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-testing-base-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-reporting-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-publish-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-platform-base-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-plugin-use-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-resources-s3-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-build-cache-http-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-resources-http-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-resources-sftp-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-workers-4.1.jar  
  inflating: gradle-4.1/lib/plugins/gradle-dependency-management-4.1.jar  
  inflating: gradle-4.1/lib/plugins/jatl-0.2.2.jar  
  inflating: gradle-4.1/lib/plugins/httpclient-4.4.1.jar  
  inflating: gradle-4.1/lib/plugins/commons-cli-1.2.jar  
  inflating: gradle-4.1/lib/plugins/biz.aQute.bndlib-3.2.0.jar  
  inflating: gradle-4.1/lib/plugins/maven-core-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/pmaven-common-0.8-20100325.jar  
  inflating: gradle-4.1/lib/plugins/pmaven-groovy-0.8-20100325.jar  
  inflating: gradle-4.1/lib/plugins/plexus-component-annotations-1.5.5.jar  
  inflating: gradle-4.1/lib/plugins/commons-codec-1.6.jar  
  inflating: gradle-4.1/lib/plugins/bcpg-jdk15on-1.51.jar  
  inflating: gradle-4.1/lib/plugins/rhino-1.7R3.jar  
  inflating: gradle-4.1/lib/plugins/gson-2.7.jar  
  inflating: gradle-4.1/lib/plugins/simple-4.1.21.jar  
  inflating: gradle-4.1/lib/plugins/testng-6.3.1.jar  
  inflating: gradle-4.1/lib/plugins/junit-4.12.jar  
  inflating: gradle-4.1/lib/plugins/jcifs-1.3.17.jar  
  inflating: gradle-4.1/lib/plugins/nekohtml-1.9.14.jar  
  inflating: gradle-4.1/lib/plugins/xercesImpl-2.9.1.jar  
  inflating: gradle-4.1/lib/plugins/ivy-2.2.0.jar  
  inflating: gradle-4.1/lib/plugins/jsch-0.1.54.jar  
  inflating: gradle-4.1/lib/plugins/aws-java-sdk-s3-1.11.6.jar  
  inflating: gradle-4.1/lib/plugins/aws-java-sdk-kms-1.11.6.jar  
  inflating: gradle-4.1/lib/plugins/aws-java-sdk-core-1.11.6.jar  
  inflating: gradle-4.1/lib/plugins/jackson-core-2.6.6.jar  
  inflating: gradle-4.1/lib/plugins/jackson-annotations-2.6.6.jar  
  inflating: gradle-4.1/lib/plugins/jackson-databind-2.6.6.jar  
  inflating: gradle-4.1/lib/plugins/joda-time-2.8.2.jar  
  inflating: gradle-4.1/lib/plugins/xbean-reflect-3.4.jar  
  inflating: gradle-4.1/lib/plugins/bcprov-jdk15on-1.51.jar  
  inflating: gradle-4.1/lib/plugins/maven-settings-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/maven-settings-builder-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/plexus-utils-2.0.6.jar  
  inflating: gradle-4.1/lib/plugins/plexus-interpolation-1.14.jar  
  inflating: gradle-4.1/lib/plugins/plexus-container-default-1.5.5.jar  
  inflating: gradle-4.1/lib/plugins/plexus-classworlds-2.4.jar  
  inflating: gradle-4.1/lib/plugins/plexus-cipher-1.7.jar  
  inflating: gradle-4.1/lib/plugins/plexus-sec-dispatcher-1.3.jar  
  inflating: gradle-4.1/lib/plugins/maven-compat-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/maven-model-builder-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/maven-model-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/maven-artifact-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/maven-repository-metadata-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/maven-plugin-api-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/maven-aether-provider-3.0.4.jar  
  inflating: gradle-4.1/lib/plugins/wagon-file-2.4.jar  
  inflating: gradle-4.1/lib/plugins/wagon-http-2.4.jar  
  inflating: gradle-4.1/lib/plugins/wagon-provider-api-2.4.jar  
  inflating: gradle-4.1/lib/plugins/wagon-http-shared4-2.4.jar  
  inflating: gradle-4.1/lib/plugins/aether-api-1.13.1.jar  
  inflating: gradle-4.1/lib/plugins/aether-impl-1.13.1.jar  
  inflating: gradle-4.1/lib/plugins/aether-spi-1.13.1.jar  
  inflating: gradle-4.1/lib/plugins/aether-util-1.13.1.jar  
  inflating: gradle-4.1/lib/plugins/aether-connector-wagon-1.13.1.jar  
  inflating: gradle-4.1/lib/plugins/bsh-2.0b4.jar  
  inflating: gradle-4.1/lib/plugins/jcommander-1.12.jar  
  inflating: gradle-4.1/lib/plugins/snakeyaml-1.6.jar  
  inflating: gradle-4.1/lib/plugins/httpcore-4.4.4.jar  
  inflating: gradle-4.1/lib/plugins/xml-apis-1.3.04.jar  
  inflating: gradle-4.1/lib/plugins/hamcrest-core-1.3.jar  
Starting a Gradle Daemon (subsequent builds will be faster)
Parallel execution with configuration on demand is an incubating feature.

BUILD SUCCESSFUL in 2s
1 actionable task: 1 executed
Downloading https://services.gradle.org/distributions/gradle-4.1-bin.zip
................................................................
Unzipping /home/malin/.gradle/wrapper/dists/gradle-4.1-bin/c3kp51zwwt108wc78u68yt7vs/gradle-4.1-bin.zip to /home/malin/.gradle/wrapper/dists/gradle-4.1-bin/c3kp51zwwt108wc78u68yt7vs
Set executable permissions for: /home/malin/.gradle/wrapper/dists/gradle-4.1-bin/c3kp51zwwt108wc78u68yt7vs/gradle-4.1/bin/gradle

------------------------------------------------------------
Gradle 4.1
------------------------------------------------------------

Build time:   2017-08-07 14:38:48 UTC
Revision:     941559e020f6c357ebb08d5c67acdb858a3defc2

Groovy:       2.4.11
Ant:          Apache Ant(TM) version 1.9.6 compiled on June 29 2015
JVM:          1.8.0_151 (Oracle Corporation 25.151-b12)
OS:           Linux 4.10.0-42-generic amd64

VLC source not found, cloning
正克隆到 'vlc'...
remote: Counting objects: 540041, done.
remote: Compressing objects: 100% (103027/103027), done.
error: RPC failed; curl 56 GnuTLS recv error (-54): Error in the pull function.
fatal: The remote end hung up unexpectedly
fatal: 过早的文件结束符（EOF）
fatal: index-pack 失败
malin@malin:~/gitlab/vlc-android$ sh compile.sh -a armeabi-v7a
VLC source not found, cloning
正克隆到 'vlc'...
remote: Counting objects: 540041, done.
remote: Compressing objects: 100% (103027/103027), done.
error: RPC failed; curl 56 GnuTLS recv error (-54): Error in the pull function.
fatal: The remote end hung up unexpectedly
fatal: 过早的文件结束符（EOF）
fatal: index-pack 失败
malin@malin:~/gitlab/vlc-android$ sh compile.sh -a armeabi-v7a
VLC source not found, cloning
正克隆到 'vlc'...
remote: Counting objects: 540041, done.
remote: Compressing objects: 100% (103027/103027), done.
error: RPC failed; curl 56 GnuTLS recv error (-54): Error in the pull function.
fatal: The remote end hung up unexpectedly
fatal: 过早的文件结束符（EOF）
fatal: index-pack 失败
malin@malin:~/gitlab/vlc-android$ sh compile.sh -a armeabi-v7a
VLC source not found, cloning
正克隆到 'vlc'...
fatal: unable to access 'https://git.videolan.org/git/vlc/vlc-3.0.git/': gnutls_handshake() failed: The TLS connection was non-properly terminated.
malin@malin:~/gitlab/vlc-android$ sh compile.sh -a armeabi-v7a
VLC source not found, cloning
正克隆到 'vlc'...
remote: Counting objects: 540041, done.
remote: Compressing objects: 100% (103027/103027), done.
error: RPC failed; curl 56 GnuTLS recv error (-54): Error in the pull function.
fatal: The remote end hung up unexpectedly
fatal: 过早的文件结束符（EOF）
fatal: index-pack 失败

```

14.vlc编译出现的问题
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

15.
```
git clone
git checkout -b malin master
git malin rebase master
git checkout master
git merge malin
```


16.
vivo 手机不显示通知
增加这个属性可以了`builder.setTicker`

当前配置`com.android.support:support-v4:27.0.2`
`import android.support.v4.app.NotificationCompat`
```
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this);

        builder.setTicker(!TextUtils.isEmpty(content) ? content : "");
        builder.setSmallIcon(R.drawable.pl_libshare_share_icon);
        builder.setContentTitle(user);
        builder.setContentText(content);

        Intent intent = new Intent(this, ScreenRecordDanmuActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);
        builder.setContentIntent(pendingIntent);

        builder.setAutoCancel(true);

        // 设置通知的优先级
        builder.setPriority(NotificationCompat.PRIORITY_MAX);
        Uri alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        // 设置通知的提示音
        builder.setSound(alarmSound);
        Notification notification = builder.build();

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null && notification != null) {
            manager.notify(1, notification);
        }
```
17.
```
Reason: Input dispatching timed out (Waiting because no window has focus but there is a focused application that may eventually add a window when it finishes starting up.)
```

18.support版本统一
```
configurations.all {
    resolutionStrategy {
        eachDependency { details ->
            // Force all of the primary support libraries to use the same version.
            if (details.requested.group == 'com.android.support'
                    && details.requested.name != 'multidex'
                    && details.requested.name != 'multidex-instrumentation') {
                details.useVersion "27.0.2"
            }
        }
    }
}
```

19.查看buildscript块中插件的依赖关系,使用 `gradle buildEnvironment`
```
buildscript {
    repositories {
        jcenter()
        google()
        maven { url "https://oss.sonatype.org/content/repositories/snapshots" }//ButterKnife
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.1'
        classpath 'com.jakewharton:butterknife-gradle-plugin:9.0.0-SNAPSHOT'
    }
}
```
运行命令后可以看到

```
+--- com.android.tools.build:gradle:3.0.1 -> 3.1.0-alpha09
|    +--- com.android.tools.build:gradle-core:3.1.0-alpha09
|    |    +--- com.android.tools.build:builder:3.1.0-alpha09
|    |    |    +--- com.android.tools.build:builder-model:3.1.0-alpha09
|    |    |    |    \--- com.android.tools:annotations:26.1.0-alpha09
|    |    |    +--- com.android.tools.build:builder-test-api:3.1.0-alpha09
|    |    |    |    \--- com.android.tools.ddms:ddmlib:26.1.0-alpha09
|    |    |    |         +--- com.android.tools:common:26.1.0-alpha09
|    |    |    |         |    +--- com.android.tools:annotations:26.1.0-alpha09
|    |    |    |         |    \--- com.google.guava:guava:22.0
|    |    |    |         |         +--- com.google.code.findbugs:jsr305:1.3.9
|    |    |    |         |         +--- com.google.errorprone:error_prone_annotations:2.0.18 -> 2.1.2
|    |    |    |         |         +--- com.google.j2objc:j2objc-annotations:1.1
|    |    |    |         |         \--- org.codehaus.mojo:animal-sniffer-annotations:1.14
|    |    |    |         \--- net.sf.kxml:kxml2:2.3.0

...........
\--- com.jakewharton:butterknife-gradle-plugin:9.0.0-SNAPSHOT
     +--- com.android.tools.build:gradle:3.1.0-alpha09 (*)
     +--- com.github.javaparser:javaparser-core:3.5.14
     +--- com.squareup:javapoet:1.10.0
     \--- org.jetbrains.kotlin:kotlin-stdlib-jre8:1.2.21 (*)
```

`com.jakewharton:butterknife-gradle-plugin:9.0.0-SNAPSHOT`插件依赖`com.android.tools.build:gradle:3.1.0-alpha09`
导致`com.android.tools.build:gradle:3.0.1`被升级到了`3.1.0-alpha09`,为了继续使用`3.0.1`版本,需要exclude`com.android.tools.build:gradle:`
修改`buildscript`块中的`dependencies`为

```
buildscript {
    repositories {
        jcenter()
        google()
        maven { url "https://oss.sonatype.org/content/repositories/snapshots" }//ButterKnife
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.1'
        classpath('com.jakewharton:butterknife-gradle-plugin:9.0.0-SNAPSHOT') {
            exclude group: 'com.android.tools.build'
        }
    }
}
```

重新执行`gradle buildEnvironment`命令得到如下结果

```
+--- com.android.tools.build:gradle:3.0.1
|    \--- com.android.tools.build:gradle-core:3.0.1
|         +--- com.android.tools.build:builder:3.0.1
|         |    +--- com.android.tools.build:builder-model:3.0.1
|         |    |    \--- com.android.tools:annotations:26.0.1
|         |    +--- com.android.tools.build:builder-test-api:3.0.1
|         |    |    \--- com.android.tools.ddms:ddmlib:26.0.1
|         |    |         +--- com.android.tools:common:26.0.1
|         |    |         |    +--- com.android.tools:annotations:26.0.1
|         |    |         |    \--- com.google.guava:guava:22.0
|         |    |         |         +--- com.google.code.findbugs:jsr305:1.3.9
|         |    |         |         +--- com.google.errorprone:error_prone_annotations:2.0.18
|         |    |         |         +--- com.google.j2objc:j2objc-annotations:1.1
|         |    |         |         \--- org.codehaus.mojo:animal-sniffer-annotations:1.14
|         |    |         \--- net.sf.kxml:kxml2:2.3.0
...........
\--- com.jakewharton:butterknife-gradle-plugin:9.0.0-SNAPSHOT
     +--- com.github.javaparser:javaparser-core:3.5.14
     +--- com.squareup:javapoet:1.10.0
     \--- org.jetbrains.kotlin:kotlin-stdlib-jre8:1.2.21
          +--- org.jetbrains.kotlin:kotlin-stdlib:1.2.21 (*)
          \--- org.jetbrains.kotlin:kotlin-stdlib-jre7:1.2.21
               \--- org.jetbrains.kotlin:kotlin-stdlib:1.2.21 (*)

```
可以发现`com.jakewharton:butterknife-gradle-plugin:9.0.0-SNAPSHOT`依赖的`com.android.tools.build:gradle:3.1.0-alpha09`不在了.
`com.android.tools.build:gradle:3.0.1`插件没有被升级.至此,问题得到解决.

20.
gradle 本身包含了groovy,依赖JDK
gradle init 可以将 translate simple pom.xml files to Gradle.


21.
`grep -n demo` #显示行号
`grep -C 5 demo` #搜索显示demo关键字出现的上下5行内容
`cat -n demo.txt` #显示行号

22.查看`support-annotations`最终使用的版本

`com.android.tools.build:gradle:3.0.0`之前使用
`gradle :app:dependencyInsight --dependency com.android.support --configuration compile`
`gradle :app:dependencyInsight --dependency appcompat-v7 --configuration compile`
`gradle :app:dependencyInsight --dependency gson --configuration compile`
`gradle :app:dependencyInsight --dependency okhttp --configuration compile`
`gradle :app:dependencyInsight --dependency eventbus --configuration compile`



`com.android.tools.build:gradle:3.0.0`之后使用
`gradle :app:dependencyInsight --dependency com.android.support --configuration releaseCompileClasspath`
`gradle :app:dependencyInsight --dependency com.android.support --configuration debugCompileClasspath`

`gradle :app:dependencyInsight --dependency appcompat-v7 --configuration releaseRuntimeClasspath`
`gradle :app:dependencyInsight --dependency appcompat-v7 --configuration debugRuntimeClasspath`

例子:
`gradle :app:dependencyInsight --dependency com.android --configuration debugCompileClasspath`
`gradle :app:dependencyInsight --dependency com.android.support:preference-v7 --configuration debugCompileClasspath`
`gradle :app:dependencyInsight --dependency com.android.support:cardview-v7 --configuration debugCompileClasspath`

参考链接 [https://guides.gradle.org/building-android-apps](https://guides.gradle.org/building-android-apps)

23.查看依赖
`gradle :app:dependencies --configuration releaseCompileClasspath`


24.gradle 依赖报告

参考链接 [https://docs.gradle.org/current/userguide/userguide_single.html#project_report_plugin](https://docs.gradle.org/current/userguide/userguide_single.html#project_report_plugin)

首先在`app/build.gradle`中应用 `'project-report'`插件
`apply plugin: 'project-report'`
然后执行`gradle projectReport`命令生成依赖报告

`gradle :app:dependencyInsight --dependency com.android.support:appcompat-v7 --configuration releaseRuntimeClasspath`
https://stackoverflow.com/questions/21645071/using-gradle-to-find-dependency-tree

```
androidJacocoAgent - The Jacoco agent to use to get coverage data.
androidJacocoAnt - The Jacoco ant tasks to use to get execute Gradle tasks.
androidTestImplementation - Implementation only dependencies for 'androidTest' sources.
debugAndroidTestCompileClasspath - Resolved configuration for compilation for variant: debugAndroidTest
debugAndroidTestRuntimeClasspath - Resolved configuration for runtime for variant: debugAndroidTest
debugCompileClasspath - Resolved configuration for compilation for variant: debug
debugImplementation - Implementation only dependencies for 'debug' sources.
debugRuntimeClasspath - Resolved configuration for runtime for variant: debug ++++
debugUnitTestCompileClasspath - Resolved configuration for compilation for variant: debugUnitTest
debugUnitTestRuntimeClasspath - Resolved configuration for runtime for variant: debugUnitTest
implementation - Implementation only dependencies for 'main' sources.

releaseCompileClasspath - Resolved configuration for compilation for variant: release
releaseRuntimeClasspath - Resolved configuration for runtime for variant: release
releaseUnitTestCompileClasspath - Resolved configuration for compilation for variant: releaseUnitTest
releaseUnitTestRuntimeClasspath - Resolved configuration for runtime for variant: releaseUnitTest
```

27.下载视频

MacOS版本
`http get https://newapi.meipai.com/medias/user_timeline.json "uid"=="1011849060" | jq . | grep "\"video\":" | sed 's/\"//g'| sed -e 's/[ ][ ]*//g'|  sed 's/video://g' | sed 's/,//g'| awk 'NR==2{print}' | xargs wget -O malin.mp4 | open malin.mp4
`
Linux版本
`http get https://newapi.meipai.com/medias/user_timeline.json "uid"=="1011849060" | jq . | grep "\"video\":" | sed 's/\"//g'| sed -e 's/[ ][ ]*//g'|  sed 's/video://g' | sed 's/,//g'| awk 'NR==2{print}' | xargs wget -O malin.mp4 | xargs vlc --video malin.mp4`

28.gradle wrapper升级
`gradlew wrapper --gradle-version 4.2.1`
`gradlew wrapper`

29.gradle的命令行flag,环境变量,配置文件,的优先顺序
`Command-line flags such as --build-cache. These have precedence over properties and environment variables.`

30.gradle命令提示自动完成
[Command-line completion](https://github.com/gradle/gradle-completion)
Gradle provides bash and zsh tab completion support for tasks, options, and Gradle properties through gradle-completion, installed separately.
[](https://docs.gradle.org/current/userguide/img/gradle-completion-4.0.gif)


31.gradle配置文件,生效的优先级
Setting up a consistent environment for your build is as simple as placing these settings into a `gradle.properties` file. The configuration is applied in following order (if an option is configured in multiple locations the _last one wins_):

* `gradle.properties` in project root directory.
* `gradle.properties` in `GRADLE_USER_HOME` directory.
* system properties, e.g. when `-Dgradle.user.home` is set on the command line.


31.
Performance options
Try these options when optimizing build performance. Learn more about improving performance of Gradle builds here.

Many of these options can be specified in gradle.properties so command-line flags are not necessary. See the configuring build environment guide.

`--build-cache`, `--no-build-cache`
Toggles the Gradle build cache. Gradle will try to reuse outputs from previous builds. Default is off.

`--configure-on-demand`, `--no-configure-on-demand`
Toggles Configure-on-demand. Only relevant projects are configured in this build run. Default is off.

`--max-workers`
Sets maximum number of workers that Gradle may use. Default is number of processors.

`--parallel`, `--no-parallel`
Build projects in parallel. For limitations of this option please see the section called “Parallel project execution”. Default is off.

`--profile`
Generates a high-level performance report in the $buildDir/reports/profile directory. --scan is preferred.

`--scan`
Generate a build scan with detailed performance diagnostics.


Gradle daemon options
You can manage the Gradle Daemon through the following command line options.

`--daemon`, `--no-daemon`
Use the Gradle Daemon to run the build. Starts the daemon if not running or existing daemon busy. Default is on.

`--foreground`
Starts the Gradle Daemon in a foreground process.

`--status` (Standalone command)
Run gradle --status to list running and recently stopped Gradle daemons. Only displays daemons of the same Gradle version.

`--stop` (Standalone command)
Run gradle --stop to stop all Gradle Daemons of the same version.

`-Dorg.gradle.daemon.idletimeout=(number of milliseconds)`
Gradle Daemon will stop itself after this number of milliseconds of idle time. Default is 10800000 (3 hours).


Execution options
The following options affect how builds are executed, by changing what is built or how dependencies are resolved.

`--include-build`
Run the build as a composite, including the specified build. See Composite Builds.

`--offline`
Specifies that the build should operate without accessing network resources. Learn more about options to override dependency caching.

`--refresh-dependencies`
Refresh the state of dependencies. Learn more about how to use this in the dependency management docs.

`--dry-run`
Run Gradle with all task actions disabled. Use this to show which task would have executed.



Logging options
Setting log level
You can customize the verbosity of Gradle logging with the following options, ordered from least verbose to most verbose. Learn more in the logging documentation.

`-Dorg.gradle.logging.level=(quiet,warn,lifecycle,info,debug)`
Set logging level via Gradle properties.

`-q`, `--quiet`
Log errors only.

`-w`, `--warn`
Set log level to warn.

`-i`, `--info`
Set log level to info.

`-d`, `--debug`
Log in debug mode (includes normal stacktrace).


`Customizing log format`
You can control the use of rich output (colors and font variants) by specifying the "console" mode in the following ways:

`-Dorg.gradle.console=(auto,plain,rich,verbose)`
Specify console mode via Gradle properties. Different modes described immediately below.

`--console=(auto,plain,rich,verbose)`
Specifies which type of console output to generate.

Set to `plain` to generate plain text only. This option disables all color and other rich output in the console output. This is the default when Gradle is not attached to a terminal.

Set to `auto` (the default) to enable color and other rich output in the console output when the build process is attached to a console, or to generate plain text only when not attached to a console. This is the default when Gradle is attached to a terminal.

Set to `rich` to enable color and other rich output in the console output, regardless of whether the build process is not attached to a console. When not attached to a console, the build output will use ANSI control characters to generate the rich output.

Set to `verbose` to enable color and other rich output like the rich, but output task names and outcomes at the lifecycle log level, as is done by default in Gradle 3.5 and earlier.




40.`java.lang.NoClassDefFoundError: com/android/tools/lint/detector/api/Detector$UastScanner`
```
> Task :app:lintVitalAndroidqaRelease
Could not load custom rule jar file /home/malin/panda2/connect3/pandalive-android-v2/broadcast/build/intermediates/exploded-aar/com.jakewharton/butterknife/9.0.0-SNAPSHOT/jars/lint.jar
java.lang.NoClassDefFoundError: com/android/tools/lint/detector/api/Detector$UastScanner
        at java.lang.ClassLoader.defineClass1(Native Method)
        at java.lang.ClassLoader.defineClass(ClassLoader.java:763)
        at java.security.SecureClassLoader.defineClass(SecureClassLoader.java:142)
        at java.net.URLClassLoader.defineClass(URLClassLoader.java:467)
        at java.net.URLClassLoader.access$100(URLClassLoader.java:73)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:368)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:362)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(URLClassLoader.java:361)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
        at butterknife.lint.LintRegistry.getIssues(LintRegistry.java:15)
        at com.android.tools.lint.client.api.JarFileIssueRegistry.<init>(JarFileIssueRegistry.java:125)
        at com.android.tools.lint.client.api.JarFileIssueRegistry.get(JarFileIssueRegistry.java:90)
        at com.android.tools.lint.client.api.LintDriver.registerCustomDetectors(LintDriver.java:603)
        at com.android.tools.lint.client.api.LintDriver.analyze(LintDriver.java:521)
        at com.android.tools.lint.client.api.LintDriver.analyze(LintDriver.java:483)
        at com.android.tools.lint.LintCliClient.run(LintCliClient.java:143)
        at com.android.build.gradle.internal.LintGradleClient.run(LintGradleClient.java:197)
        at com.android.build.gradle.tasks.Lint.runLint(Lint.java:340)
        at com.android.build.gradle.tasks.Lint.lintSingleVariant(Lint.java:307)
        at com.android.build.gradle.tasks.Lint.lint(Lint.java:119)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.gradle.internal.reflect.JavaMethod.invoke(JavaMethod.java:73)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.doExecute(StandardTaskAction.java:46)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:39)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:26)
        at org.gradle.api.internal.AbstractTask$TaskActionWrapper.execute(AbstractTask.java:788)
        at org.gradle.api.internal.AbstractTask$TaskActionWrapper.execute(AbstractTask.java:755)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter$1.run(ExecuteActionsTaskExecuter.java:124)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:336)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:328)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:199)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:110)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeAction(ExecuteActionsTaskExecuter.java:113)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeActions(ExecuteActionsTaskExecuter.java:95)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.execute(ExecuteActionsTaskExecuter.java:73)
        at org.gradle.api.internal.tasks.execution.OutputDirectoryCreatingTaskExecuter.execute(OutputDirectoryCreatingTaskExecuter.java:51)
        at org.gradle.api.internal.tasks.execution.SkipCachedTaskExecuter.execute(SkipCachedTaskExecuter.java:103)
        at org.gradle.api.internal.tasks.execution.SkipUpToDateTaskExecuter.execute(SkipUpToDateTaskExecuter.java:59)
        at org.gradle.api.internal.tasks.execution.ResolveTaskOutputCachingStateExecuter.execute(ResolveTaskOutputCachingStateExecuter.java:54)
        at org.gradle.api.internal.tasks.execution.ResolveBuildCacheKeyExecuter.execute(ResolveBuildCacheKeyExecuter.java:66)
        at org.gradle.api.internal.tasks.execution.ValidatingTaskExecuter.execute(ValidatingTaskExecuter.java:59)
        at org.gradle.api.internal.tasks.execution.SkipEmptySourceFilesTaskExecuter.execute(SkipEmptySourceFilesTaskExecuter.java:101)
        at org.gradle.api.internal.tasks.execution.FinalizeInputFilePropertiesTaskExecuter.execute(FinalizeInputFilePropertiesTaskExecuter.java:44)
        at org.gradle.api.internal.tasks.execution.CleanupStaleOutputsExecuter.execute(CleanupStaleOutputsExecuter.java:91)
        at org.gradle.api.internal.tasks.execution.ResolveTaskArtifactStateTaskExecuter.execute(ResolveTaskArtifactStateTaskExecuter.java:62)
        at org.gradle.api.internal.tasks.execution.SkipTaskWithNoActionsExecuter.execute(SkipTaskWithNoActionsExecuter.java:59)
        at org.gradle.api.internal.tasks.execution.SkipOnlyIfTaskExecuter.execute(SkipOnlyIfTaskExecuter.java:54)
        at org.gradle.api.internal.tasks.execution.ExecuteAtMostOnceTaskExecuter.execute(ExecuteAtMostOnceTaskExecuter.java:43)
        at org.gradle.api.internal.tasks.execution.CatchExceptionTaskExecuter.execute(CatchExceptionTaskExecuter.java:34)
        at org.gradle.execution.taskgraph.DefaultTaskGraphExecuter$EventFiringTaskWorker$1.run(DefaultTaskGraphExecuter.java:256)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:336)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:328)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:199)
        at org.gradle.internal.progress.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:110)
        at org.gradle.execution.taskgraph.DefaultTaskGraphExecuter$EventFiringTaskWorker.execute(DefaultTaskGraphExecuter.java:249)
        at org.gradle.execution.taskgraph.DefaultTaskGraphExecuter$EventFiringTaskWorker.execute(DefaultTaskGraphExecuter.java:238)
        at org.gradle.execution.taskgraph.DefaultTaskPlanExecutor$TaskExecutorWorker.processTask(DefaultTaskPlanExecutor.java:123)
        at org.gradle.execution.taskgraph.DefaultTaskPlanExecutor$TaskExecutorWorker.access$200(DefaultTaskPlanExecutor.java:79)
        at org.gradle.execution.taskgraph.DefaultTaskPlanExecutor$TaskExecutorWorker$1.execute(DefaultTaskPlanExecutor.java:104)
        at org.gradle.execution.taskgraph.DefaultTaskPlanExecutor$TaskExecutorWorker$1.execute(DefaultTaskPlanExecutor.java:98)
        at org.gradle.execution.taskgraph.DefaultTaskExecutionPlan.execute(DefaultTaskExecutionPlan.java:663)
        at org.gradle.execution.taskgraph.DefaultTaskExecutionPlan.executeWithTask(DefaultTaskExecutionPlan.java:597)
        at org.gradle.execution.taskgraph.DefaultTaskPlanExecutor$TaskExecutorWorker.run(DefaultTaskPlanExecutor.java:98)
        at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:63)
        at org.gradle.internal.concurrent.ManagedExecutorImpl$1.run(ManagedExecutorImpl.java:46)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
        at org.gradle.internal.concurrent.ThreadFactoryImpl$ManagedThreadRunnable.run(ThreadFactoryImpl.java:55)
        at java.lang.Thread.run(Thread.java:748)
Caused by: java.lang.ClassNotFoundException: com.android.tools.lint.detector.api.Detector$UastScanner
        at java.net.URLClassLoader.findClass(URLClassLoader.java:381)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
        ... 74 more
```

https://github.com/JakeWharton/timber/issues/275

https://github.com/permissions-dispatcher/PermissionsDispatcher/issues/392


http://blog.csdn.net/tp7309/article/details/78694243
https://juejin.im/entry/596de7075188252a2a34e94b

```
第二个问题是新的插件和最新的Butterknife插件8.7+版本会冲突，编译时会报错
Unable to find method 'com.android.build.gradle.api.BaseVariant.getOutputs()Ljava/util/List
github上已经有了这个issue，暂时的解决办法是降至8.4版本
```


42.

```
:app:mergeAndroidqaReleaseResourcesAAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c576adc34d838f95f27963d875377dd09054442a\output\res\drawable-xhdpi-v4\abc_text_select_handle_middle_mtrl_light.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c99564b5f2ae114d6ce9d4cf6cc2ac0ab229a0fb\output\res\drawable-xxhdpi-v4\xx_list_live_enter_move.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c99564b5f2ae114d6ce9d4cf6cc2ac0ab229a0fb\output\res\drawable-xxhdpi-v4\xx_start_record_friend_circle_pressed.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c99564b5f2ae114d6ce9d4cf6cc2ac0ab229a0fb\output\res\drawable-xxhdpi-v4\xx_chat_tab_follow_close_ic.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_badge_level_bg_1_6.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\d95b7cd5b41860dd78bb55c47cee7fde74fb46b3\output\res\drawable-xxhdpi-v4\xy_dialog_fighted_share_wechat_icon.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_badge_level_bg_1_4.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_badge_level_bg_1_3.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_badge_level_bg_1_1.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xxhdpi-v4\pl_libpanda_btn_recordscreen.9.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\d95b7cd5b41860dd78bb55c47cee7fde74fb46b3\output\res\drawable-xxhdpi-v4\xy_gift_img.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_capital_level_7.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_capital_level_2.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\e1d3138f66f2ee6ee30eeb1b7832c32e2000d5f4\output\res\drawable-xxhdpi-v4\venvy_live_crane_lottery_click_button_pressed.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\ce0e47705ec1b92ed9c07e4816082c030aaf8fd7\output\res\drawable-xxhdpi-v4\xy_gift_send_send_disable.9.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\d95b7cd5b41860dd78bb55c47cee7fde74fb46b3\output\res\drawable-xxhdpi-v4\xy_ic_share_wechat.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\60c1582c255fbad34963a1eb1b3b1cc57c6b2c73\output\res\drawable-xxhdpi-v4\pl_libshare_pre_qq_2x.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_baiyin_1.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\60c1582c255fbad34963a1eb1b3b1cc57c6b2c73\output\res\drawable-xxhdpi-v4\pl_libshare_live_prepare_pyq_selected.png ERROR: Unable to open PNG file
AAPT err(Facade for 480759511) : No Delegate set : lost message:\\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_baiyin_5.png ERROR: Unable to open PNG file

AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\7e0dac42f8ffe89624ecf91d40abf81ed3d87673\output\res\drawable-xxhdpi-v4\mg_liveness_cancel.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c4abbdcffb7db9e4aa57b855561deccc46052466\output\res\drawable-mdpi-v4\common_google_signin_btn_text_dark_normal_background.9.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c576adc34d838f95f27963d875377dd09054442a\output\res\drawable-hdpi-v4\abc_ic_menu_share_mtrl_alpha.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xhdpi-v4\pl_libpanda_rtc_ic_close.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\ce0e47705ec1b92ed9c07e4816082c030aaf8fd7\output\res\drawable-xxhdpi-v4\xy_user_card_follow_selected.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\bc3dc9ada15e2c3d28ce7d00f4e63ab5398c229e\output\res\drawable-xxhdpi-v4\umcsdk_mobile_logo.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_selected_country_code.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xxhdpi-v4\pl_libpanda_ic_nodata.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_badge_level_bg_1_5.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_badge_level_bg_1_2.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\60c1582c255fbad34963a1eb1b3b1cc57c6b2c73\output\res\drawable-xxhdpi-v4\pl_libshare_share_weibo_xuanzhong.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xxhdpi-v4\pl_libpanda_zhibo_icon_fantuan.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_tiezhi_default.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_baiyin_4.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_baiyin_2.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\ce0e47705ec1b92ed9c07e4816082c030aaf8fd7\output\res\drawable-xxhdpi-v4\xy_anchor_audit.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\ce0e47705ec1b92ed9c07e4816082c030aaf8fd7\output\res\drawable-xxhdpi-v4\xy_dialog_true_love_task_normal.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\55f531b7c1858d626f0485cd5140a0f7a07ff38e\output\res\drawable-xxhdpi-v4\weibosdk_empty_failed.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xxhdpi-v4\pl_libpanda_panda_chat_send_no_msg.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\1d17221359da35cb1a6430224feb96cd0329d11d\output\res\drawable-xxhdpi-v4\pl_libres_ico_xing_yan.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\ce0e47705ec1b92ed9c07e4816082c030aaf8fd7\output\res\drawable-xxhdpi-v4\xy_rank_btns_bg.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xxhdpi-v4\pl_libpanda_button_open_flash.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xhdpi-v4\pl_libpanda_pengyouquan_gray.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\7e0dac42f8ffe89624ecf91d40abf81ed3d87673\output\res\drawable-xxhdpi-v4\liveness_layout_head_mask.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xxhdpi-v4\pl_libpanda_ic_reddot.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\9f97b725f92eb053cbfcaa2b275805e25b865310\output\res\drawable-xhdpi-v4\pl_libpanda_loginlogo.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c99564b5f2ae114d6ce9d4cf6cc2ac0ab229a0fb\output\res\drawable-xxhdpi-v4\xx_start_record_wechat_normal.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c576adc34d838f95f27963d875377dd09054442a\output\res\drawable-mdpi-v4\abc_btn_check_to_on_mtrl_015.png ERROR: Unable to open PNG file
AAPT: \\?\C:\Windows\System32\config\systemprofile\.android\build-cache\c576adc34d838f95f27963d875377dd09054442a\output\res\drawable-mdpi-v4\abc_btn_check_to_on_mtrl_000.png ERROR: Unable to open PNG file
```


42.
```
classpath
+--- com.android.tools.build:gradle:3.0.1
|    \--- com.android.tools.build:gradle-core:3.0.1
|         +--- com.android.tools.build:builder:3.0.1
|         |    +--- com.android.tools.build:builder-model:3.0.1
|         |    |    \--- com.android.tools:annotations:26.0.1
|         |    +--- com.android.tools.build:builder-test-api:3.0.1
|         |    |    \--- com.android.tools.ddms:ddmlib:26.0.1
|         |    |         +--- com.android.tools:common:26.0.1
|         |    |         |    +--- com.android.tools:annotations:26.0.1
|         |    |         |    \--- com.google.guava:guava:22.0
|         |    |         |         +--- com.google.code.findbugs:jsr305:1.3.9
|         |    |         |         +--- com.google.errorprone:error_prone_annotations:2.0.18
|         |    |         |         +--- com.google.j2objc:j2objc-annotations:1.1
|         |    |         |         \--- org.codehaus.mojo:animal-sniffer-annotations:1.14
|         |    |         \--- net.sf.kxml:kxml2:2.3.0
|         |    +--- com.android.tools:sdklib:26.0.1
|         |    |    +--- com.android.tools.layoutlib:layoutlib-api:26.0.1
|         |    |    |    +--- com.android.tools:common:26.0.1 (*)
|         |    |    |    +--- net.sf.kxml:kxml2:2.3.0
|         |    |    |    +--- com.android.tools:annotations:26.0.1
|         |    |    |    \--- com.intellij:annotations:12.0
|         |    |    +--- com.android.tools:dvlib:26.0.1
|         |    |    |    \--- com.android.tools:common:26.0.1 (*)
|         |    |    +--- com.android.tools:repository:26.0.1
|         |    |    |    +--- com.android.tools:common:26.0.1 (*)
|         |    |    |    +--- org.apache.commons:commons-compress:1.12
|         |    |    |    +--- com.google.jimfs:jimfs:1.1
|         |    |    |    |    \--- com.google.guava:guava:18.0 -> 22.0 (*)
|         |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.1.3-2 -> 1.2.21
|         |    |    |         \--- org.jetbrains:annotations:13.0
|         |    |    +--- com.google.code.gson:gson:2.3
|         |    |    +--- org.apache.commons:commons-compress:1.12
|         |    |    +--- org.apache.httpcomponents:httpclient:4.2.6
|         |    |    |    +--- org.apache.httpcomponents:httpcore:4.2.5
|         |    |    |    +--- commons-logging:commons-logging:1.1.1
|         |    |    |    \--- commons-codec:commons-codec:1.6
|         |    |    \--- org.apache.httpcomponents:httpmime:4.1
|         |    |         +--- org.apache.httpcomponents:httpcore:4.1 -> 4.2.5
|         |    |         \--- commons-logging:commons-logging:1.1.1
|         |    +--- com.android.tools:sdk-common:26.0.1
|         |    |    +--- com.android.tools:sdklib:26.0.1 (*)
|         |    |    +--- com.android.tools.build:builder-test-api:3.0.1 (*)
|         |    |    +--- com.android.tools.build:builder-model:3.0.1 (*)
|         |    |    +--- com.android.tools.ddms:ddmlib:26.0.1 (*)
|         |    |    +--- org.bouncycastle:bcpkix-jdk15on:1.56
|         |    |    |    \--- org.bouncycastle:bcprov-jdk15on:1.56
|         |    |    +--- org.bouncycastle:bcprov-jdk15on:1.56
|         |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.1.3-2 -> 1.2.21 (*)
|         |    |    \--- com.google.protobuf:protobuf-java:3.0.0
|         |    +--- com.android.tools:common:26.0.1 (*)
|         |    +--- com.android.tools.build:manifest-merger:26.0.1
|         |    |    +--- com.android.tools:common:26.0.1 (*)
|         |    |    +--- com.android.tools:sdklib:26.0.1 (*)
|         |    |    +--- com.android.tools:sdk-common:26.0.1 (*)
|         |    |    +--- net.sf.kxml:kxml2:2.3.0
|         |    |    \--- com.google.code.gson:gson:2.3
|         |    +--- com.android.tools.ddms:ddmlib:26.0.1 (*)
|         |    +--- com.android.tools.analytics-library:protos:26.0.1
|         |    |    \--- com.google.protobuf:protobuf-java:3.0.0
|         |    +--- com.android.tools.analytics-library:shared:26.0.1
|         |    |    +--- com.android.tools.analytics-library:protos:26.0.1 (*)
|         |    |    +--- com.android.tools:annotations:26.0.1
|         |    |    +--- com.android.tools:common:26.0.1 (*)
|         |    |    +--- com.google.guava:guava:22.0 (*)
|         |    |    \--- com.google.code.gson:gson:2.3
|         |    +--- com.android.tools.analytics-library:tracker:26.0.1
|         |    |    +--- com.android.tools:annotations:26.0.1
|         |    |    +--- com.android.tools:common:26.0.1 (*)
|         |    |    +--- com.android.tools.analytics-library:protos:26.0.1 (*)
|         |    |    +--- com.android.tools.analytics-library:shared:26.0.1 (*)
|         |    |    +--- com.google.protobuf:protobuf-java:3.0.0
|         |    |    \--- com.google.guava:guava:22.0 (*)
|         |    +--- com.android.tools.build:apksig:3.0.1
|         |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.1.3-2 -> 1.2.21 (*)
|         |    +--- com.squareup:javawriter:2.5.0
|         |    +--- org.bouncycastle:bcpkix-jdk15on:1.56 (*)
|         |    +--- org.bouncycastle:bcprov-jdk15on:1.56
|         |    +--- org.ow2.asm:asm:5.1
|         |    +--- org.ow2.asm:asm-tree:5.1
|         |    |    \--- org.ow2.asm:asm:5.1
|         |    +--- org.ow2.asm:asm-commons:5.1
|         |    |    \--- org.ow2.asm:asm-tree:5.1 (*)
|         |    +--- org.ow2.asm:asm-util:5.1
|         |    |    \--- org.ow2.asm:asm-tree:5.1 (*)
|         |    +--- it.unimi.dsi:fastutil:7.2.0
|         |    +--- net.sf.jopt-simple:jopt-simple:4.9
|         |    \--- com.googlecode.json-simple:json-simple:1.1
|         +--- com.android.tools.lint:lint:26.0.1
|         |    +--- com.android.tools.lint:lint-checks:26.0.1
|         |    |    +--- com.android.tools.lint:lint-api:26.0.1
|         |    |    |    +--- com.android.tools:sdk-common:26.0.1 (*)
|         |    |    |    +--- com.android.tools.build:builder-model:3.0.1 (*)
|         |    |    |    +--- com.android.tools.external.com-intellij:intellij-core:26.0.1
|         |    |    |    |    \--- org.jetbrains.trove4j:trove4j:20160824
|         |    |    |    +--- com.android.tools.external.org-jetbrains:uast:26.0.1
|         |    |    |    +--- com.android.tools.build:manifest-merger:26.0.1 (*)
|         |    |    |    +--- org.ow2.asm:asm:5.1
|         |    |    |    +--- org.ow2.asm:asm-tree:5.1 (*)
|         |    |    |    +--- org.jetbrains.kotlin:kotlin-reflect:1.1.3-2
|         |    |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.1.3-2 -> 1.2.21 (*)
|         |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.1.3-2 -> 1.2.21 (*)
|         |    |    \--- org.ow2.asm:asm-analysis:5.1
|         |    |         \--- org.ow2.asm:asm-tree:5.1 (*)
|         |    +--- com.android.tools.build:manifest-merger:26.0.1 (*)
|         |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.1.3-2 -> 1.2.21 (*)
|         |    \--- org.eclipse.jdt.core.compiler:ecj:4.6.1
|         +--- com.android.tools.external.org-jetbrains:uast:26.0.1
|         +--- com.android.tools.build:gradle-api:3.0.1
|         |    +--- com.android.tools.build:builder-model:3.0.1 (*)
|         |    \--- com.google.guava:guava:22.0 (*)
|         +--- com.android.databinding:compilerCommon:3.0.1
|         |    +--- com.android.databinding:baseLibrary:3.0.1
|         |    +--- org.antlr:antlr4:4.5.3
|         |    +--- commons-io:commons-io:2.4
|         |    +--- com.googlecode.juniversalchardet:juniversalchardet:1.0.3
|         |    +--- com.google.guava:guava:22.0 (*)
|         |    \--- com.android.tools:annotations:24.5.0 -> 26.0.1
|         +--- org.jetbrains.kotlin:kotlin-stdlib:1.1.3-2 -> 1.2.21 (*)
|         +--- com.android.tools.build:transform-api:2.0.0-deprecated-use-gradle-api
|         +--- org.ow2.asm:asm:5.1
|         +--- org.ow2.asm:asm-analysis:5.1 (*)
|         +--- org.ow2.asm:asm-commons:5.1 (*)
|         +--- org.ow2.asm:asm-util:5.1 (*)
|         +--- org.jacoco:org.jacoco.core:0.7.4.201502262128
|         +--- org.jacoco:org.jacoco.report:0.7.4.201502262128
|         |    \--- org.jacoco:org.jacoco.core:0.7.4.201502262128
|         +--- net.sf.jopt-simple:jopt-simple:4.9
|         +--- net.sf.proguard:proguard-gradle:5.3.3
|         |    \--- net.sf.proguard:proguard-base:5.3.3
|         \--- com.google.protobuf:protobuf-java:3.0.0
+--- me.tatarka:gradle-retrolambda:3.7.0
+--- me.tatarka.retrolambda.projectlombok:lombok.ast:0.2.3.a2
\--- com.jakewharton:butterknife-gradle-plugin:9.0.0-SNAPSHOT
     +--- com.github.javaparser:javaparser-core:3.5.14
     +--- com.squareup:javapoet:1.10.0
     \--- org.jetbrains.kotlin:kotlin-stdlib-jre8:1.2.21
          +--- org.jetbrains.kotlin:kotlin-stdlib:1.2.21 (*)
          \--- org.jetbrains.kotlin:kotlin-stdlib-jre7:1.2.21
               \--- org.jetbrains.kotlin:kotlin-stdlib:1.2.21 (*)

(*) - dependencies omitted (listed previously)

```


```
@Override
@SuppressLint("PrivateApi")
public void setInitialSavedState(@Nullable SavedState state) {
    try {
        Field fragmentStateField = SavedState.class.getDeclaredField("mState");
        if (fragmentStateField != null) {
            fragmentStateField.setAccessible(true);
            ((Bundle) fragmentStateField.get(state)).setClassLoader(BaseFragment2.class.getClassLoader());
        }
    } catch (Throwable e) {
        e.printStackTrace();
    }
    super.setInitialSavedState(state);
}
```


34.skip Test tasks
```
//skip Test tasks
    gradle.taskGraph.whenReady {
        tasks.each { task ->
            if (task.name.contains("lint")
                    //如果项目中有用到aidl则不可以舍弃这个任务
                    || (task.name.contains("Aidl") && (!task.name.contains("Google") || !task.name.contains("google")))
                    //用不到测试的时候就可以先关闭
                    || task.name.contains("mockableAndroidJar")
                    || task.name.contains("UnitTest")
                    || task.name.contains("AndroidTest")) {
                task.enabled = false
            }
        }
    }
```

35.很奇怪的一个错误.感觉像是网络不好,没有将android的gradle插件相关的依赖工具库下载下来.
```
malin@malin:~/panda2/old/pandalive-android-v2$ gradle assembleGuanwangDebug -x lint
Parallel execution with configuration on demand is an incubating feature.

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':account'.
> Could not resolve all dependencies for configuration ':account:_debugPublish'.
   > A problem occurred configuring project ':uikit'.
      > Could not resolve all dependencies for configuration ':uikit:_debugPublish'.
         > A problem occurred configuring project ':share'.
            > Could not resolve all dependencies for configuration ':share:_debugCompile'.
               > A problem occurred configuring project ':pandaappsdk'.
                  > Failed to notify project evaluation listener.
                     > com.android.build.gradle.tasks.factory.AndroidJavaCompile.setDependencyCacheDir(Ljava/io/File;)V

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 5.0.
See https://docs.gradle.org/4.6/userguide/command_line_interface.html#sec:command_line_warnings

BUILD FAILED in 0s
```
