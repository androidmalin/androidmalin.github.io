---
layout: post
title: "Source for Android 28"
date: 2018-08-18 17:58:00 +0800
tags: []
---

#1. Source for Android 28
android SDK Platform -> Android API 28 -> Source for Android 28 这个源码位置在
[frameworks/base](https://android.googlesource.com/platform/frameworks/base/+refs)下的[sdk-release](https://android.googlesource.com/platform/frameworks/base/+/sdk-release)分支.

#2. [Build your own android-28 sources](https://gist.github.com/cketti/71475220a08c9ee43fd48ecaaf7046a5)
Build "Sources for Android 28" so you can comfortably browse the Android API source in Android Studio.

1. Collect source files

```shell
mkdir android-sdk-source-build
cd android-sdk-source-build

mkdir -p frameworks/base

# Fetch repositories that contain the sources we're interested in
git clone --depth 1 https://android.googlesource.com/platform/frameworks/base -b android-9.0.0_r3 frameworks/base
git clone --depth 1 https://android.googlesource.com/platform/libcore -b android-9.0.0_r3
git clone --depth 1 https://android.googlesource.com/platform/development -b android-9.0.0_r3

# Create a basic source.properties file
echo -e "Pkg.UserSrc=false\nPkg.Revision=1\nAndroidVersion.ApiLevel=28" > source.properties

# Modify the script to create a sources ZIP to use "android-28" as top-level directory
cat development/build/tools/mk_sources_zip.py | sed -e 's/TOP_FOLDER = .*/TOP_FOLDER = "android-28"/' > my_mk_sources_zip.py

# Run the script to create android-28-sources.zip
python my_mk_sources_zip.py -z source.properties android-28-sources.zip .
```

2. Extract into Android SDK source directory
```shell
unzip android-28-sources.zip -d ${ANDROID_HOME}/sources
```

3. Restart Android Studio and SDK sources should show up.

说明:android-9.0.0_r3是一个tag.
指定 tag 代码
`git checkout -b demobranch demotag`


#3.
第一次使用
Sync成功后，所有的git库都处于 no branch状态，不能进行操作
需要初化分支
Repo start master –all

#4. 对tag的理解

[how-to-checkout-remote-git-tag](https://stackoverflow.com/questions/35979642/how-to-checkout-remote-git-tag/35981459)

```
A tag is used to label and mark a specific commit in the history.
It is usually used to mark release points (eg. v1.0, etc.).

Although a tag may appear similar to branch, a tag, however, does not change.
It points directly to a specific commit in the history.
```


#5. repo如何取消本地改动（How to discard changes using repo）
`repo forall -vc "git reset --hard"`
如果执行完成后，依旧提示某个目录有改动，则切换到有问题的目录，继续执行
`git reset --hard`

[how-to-discard-changes-using-repo](https://stackoverflow.com/a/18096819/3326683)

#6. android studio 打开AOSP源码
官方文档
[development/tools/idegen](https://android.googlesource.com/platform/development/+/android-9.0.0_r3/tools/idegen/README)

#7. android 27
sdk `Source for Android 27` 中包含
`/home/malin/sdk/sources/android-27/android/arch/lifecycle/LifecycleRuntimeTrojanProvider.java`
这个很奇怪.按道理应该是手动引入的依赖.现在却放在了`Source for Android 27`中了.
如果手动引入这个类对应的依赖.可以覆盖.
因为这个类的名字`特洛伊木马`会被杀毒软件检测出来,认为是病毒.新版已经将名字修改了.

[Remove LifecycleDispatcher & Rename LifecycleRuntimeTrojanProvider](https://github.com/aosp-mirror/platform_frameworks_support/commit/566dbfd4b16f43685d4bdc835b1b862883b94d96)

`cd /onet/malin/android_source/frameworks/support`
`git log --all | grep -C 10 "Remove" | grep -C 10 LifecycleDispatcher | grep -C 10 566dbfd4b16f43685d4bdc835b1b862883b94d96`


#8. ubuntu18.04 编译android-8.1.0_r43, 编译aosp_angler-userdebug
```
35 warnings generated.
[  4% 4298/89666] Lex: applypatch <= bootable/recovery/edify/lexer.ll
FAILED: out/target/product/angler/obj/STATIC_LIBRARIES/libedify_intermediates/lexer.cpp
/bin/bash -c "prebuilts/misc/linux-x86/flex/flex-2.5.39 -oout/target/product/angler/obj/STATIC_LIBRARIES/libedify_intermediates/lexer.cpp bootable/recovery/edify/lexer.ll"
flex-2.5.39: loadlocale.c:130:_nl_intern_locale_data: ?? 'cnt < (sizeof (_nl_value_type_LC_TIME) / sizeof (_nl_value_type_LC_TIME[0]))' ???
Aborted (core dumped)
[  4% 4305/89666] target StaticLib: libv8src (out/target/product/angler/obj/STATIC_LIBRARIES/libv8src_intermediates/libv8src.a)
ninja: build stopped: subcommand failed.
15:00:53 ninja failed with: exit status 1

#### failed to build some targets (07:19 (mm:ss)) ####

malin@malin:/onet/malin/android_source$ export LC_ALL=C

```
解决办法
`export LC_ALL=C`
[building_with_ubuntu_1804](https://www.reddit.com/r/LineageOS/comments/8v2pjc/building_with_ubuntu_1804/)
[aosp-build-stopped-subcommand-failed](https://stackoverflow.com/questions/51324238/aosp-build-stopped-subcommand-failed)
[android-7-1-2-armv7](https://stackoverflow.com/questions/49301627/android-7-1-2-armv7)


#9. aosp编译完占用的空间.
android-8.1.0_r43, 编译aosp_angler-userdebug 完成. 占用192G空间.


#10

找到对应tag的名称
[platform-code-names-versions-api-levels-and-ndk-releases](https://source.android.com/setup/start/build-numbers?hl=en#platform-code-names-versions-api-levels-and-ndk-releases)
`OPM6.171019.030.H1	android-8.1.0_r43    Nexus 5X and Nexus 6P`

驱动下载
[drivers#angler](https://developers.google.com/android/drivers#angler)
`Nexus 6P binaries for Android 8.1.0 (OPM6.171019.030.H1)`

ota
[ota](https://developers.google.com/android/ota)
`"angler" for Nexus 6P`
`(OPM6.171019.030.H1, Aug 2018)`

[running](https://source.android.com/setup/build/running?hl=en)
Nexus 6P	angler	aosp_angler-userdebug

[build/jack](https://source.android.com/setup/build/jack)
`Jack 是一种 Android 工具链，用于将 Java 源代码编译成 Android dex 字节码。要使用 Jack，您只需使用标准的 Makefile 命令来编译源代码树或您的项目即可，无需进行任何其他操作。Android 8.1 是使用 Jack 的最后一个版本`

[开始编译包括驱动](https://source.android.com/setup/build/building)
[刷机](https://source.android.com/setup/build/running)

[Android系统源码编译及刷机实战](https://blog.csdn.net/u012417380/article/details/73196722)
[NEXUS 5 工厂镜像刷机教程及刷机包目录解析](https://blog.csdn.net/u012417380/article/details/72843185)
[android源码编译7.1.2 for Nexus 6P手机](https://tuzhao.org/article/40)
[android源码编译8.1.0 for Nexus 6P手机](https://tuzhao.org/article/44)
[building_with_ubuntu_1804](https://www.reddit.com/r/LineageOS/comments/8v2pjc/building_with_ubuntu_1804/)


#11 repo切换分支

`repo init -b android-8.1.0_r43`
`sync`
`repo start android-8.1.0_r43 --all`

#12 compile
`export LC_ALL=C`
`make clean`
`make clobber`
`vim device/huawei/angler/vendorsetup.sh`
增加`add_lunch_combo aosp_angler-eng`

`source build/envsetup.sh`
`make -j8`

#13 Android Studio 断点源码
不用先make 完整编译,只需要编译idegen模块即可
1.`make idegen`
2.`./development/tools/idegen/idegen.sh`
3.修改编译好的android.imi,增加不需要的文件夹.
`cat development/tools/idegen/README`
4.修改android studio的参数.
```
If you're using IntelliJ...

    If this is your first time using IDEGen...

        Android is large, thus IDEA needs a lot of memory. Add "-Xms1g -Xmx5g" to
        your VM options in "Help > Edit Custom VM" and increase the
        file size limit in "Help -> Edit custom properties" by adding
        "idea.max.intellisense.filesize=100000". Make sure to restart the IDE for
        the new settings to take effect.

        Create a JDK configuration named "1.8 (No Libraries)" by adding a new
        JDK like you normally would and then removing all of the jar entries
        under the "Classpath" tab. This will ensure that you only get access to
        Android's core libraries and not those from your desktop VM.

    From the project's root directory...

        Repeat these steps after each sync...

        1) make (to produce generated .java source)
        2) development/tools/idegen/idegen.sh
        3) Open android.ipr in IntelliJ. If you already have the project open,
           hit the sync button in IntelliJ, and it will automatically detect the
           updated configuration.

        If you get unexpected compilation errors from IntelliJ, try running
        "Build -> Rebuild Project". Sometimes IntelliJ gets confused after the
        project changes significantly.
```

#14 gdb命令
```
List of classes of commands:

aliases -- Aliases of other commands
breakpoints -- Making program stop at certain points
data -- Examining data
files -- Specifying and examining files
internals -- Maintenance commands
obscure -- Obscure features
running -- Running the program
stack -- Examining the stack
status -- Status inquiries
support -- Support facilities
tracepoints -- Tracing of program execution without stopping the program
user-defined -- User-defined commands

Type "help" followed by a class name for a list of commands in that class.
Type "help all" for the list of all commands.
Type "help" followed by command name for full documentation.
Type "apropos word" to search for commands related to "word".
Command name abbreviations are allowed if unambiguous.
```

#15 gdb 调试

1.编译`aosp_angler-eng`到nexus6p手机中.

2.查看要调试的应用进程
`adb shell ps | grep malin` 例如得到的是
`u0_a63        7807   921 4315356  58780 SyS_epoll_wait 753e1f83f8 S com.malin.nativeframework`
应用进程为`7807`


设置环境变量
`source  build/envsetup.sh`
`lunch aosp_angler-eng`
`command -v gdbclient.py`

3.使用GDB调试应用
`gdbclient 7807`
[此脚本会设置端口转发，在设备上启动相应的 gdbserver，在主机上启动相应的 gdb，配置 gdb 以找出符号，然后将 gdb 连接到远程 gdbserver](https://source.android.com/devices/tech/debug/gdb)

4.进入gdb后,
`info sharedlibrary`
查看so库的加载路径是否正确可使用info sharedlibrary命令，如果已找到对应的文件则其From和To的加载地址会有值，
并且右边路径显示的就是加载文件所在的地址，这个时候，如果so库文件含符号信息，则syms Read的值为Yes，否则为No，
如果未找到对应的文件则From和To的地址为空，syms Read的值为No，此时右边路径显示的是Coredump文件中库文件路径。
[GDB动态库搜索路径](https://blog.csdn.net/_xiao/article/details/23289971)
```
(gdb) info sharedlibrary
From                To                  Syms Read   Shared Object Library
0x000000753f265640  0x000000753f320e74  Yes         /onet/malin/android_source/out/target/product/angler/symbols/system/bin/linker64
0x000000753d538cc8  0x000000753d630b1c  Yes         /onet/malin/android_source/out/target/product/angler/symbols/system/lib64/libandroid_runtime.so
...
```

5.进入gdb后,设置断点文件的目录
`dir source 指定源码路径`
`dir /onet/malin/android_source/system/core/libutils`

6.进入gdb后,查看要断点的文件的行数
`list file:filenum       显示文件file中的filenum行 `
`list Looper.cpp:67`
`list android_os_MessageQueue.cpp:190`

7.进入gdb后,给文件具体行数设置断点.
`b Looper.cpp:67`
`b Looper.cpp:68`
`b android_os_MessageQueue.cpp:190`
`b android_os_MessageQueue.cpp:191`

列出设置的断点
`info breakpoints`

8.操作应用程序,触发断点.

9.程序在运行到断点的地方停止.

10.在终端gdb,输入`c`,然后回车继续.

11.在终端gdb,输入`c`,然后回车继续.

12.在终端gdb,输入`bt`,查看方法调用栈.

```
(gdb) bt
#0  android::android_os_MessageQueue_nativePollOnce (env=0x74ba6cb1c0, obj=<optimized out>, ptr=501344133568, timeoutMillis=<optimized out>) at frameworks/base/core/jni/android_os_MessageQueue.cpp:192
#1  0x00000000727d2830 in android.app.NativeActivity.onWindowFocusChangedNative [DEDUPED] () from /onet/malin/android_source/out/target/product/angler/symbols/system/framework/arm64/boot-framework.oat
#2  0x00000074ba4f0b8c in art_quick_invoke_stub () at art/runtime/arch/arm64/quick_entrypoints_arm64.S:1697
#3  0x00000074ba082598 in art::ArtMethod::Invoke (this=0x7110fcc8, self=0x74ba6bea00, args=0x7ff682ca5c, args_size=16, result=0x7ff682cc20, shorty=0x74b8850213 "VJI") at art/runtime/art_method.cc:367
#4  0x00000074ba2414a0 in art::interpreter::ArtInterpreterToCompiledCodeBridge (self=0x74ba6bea00, caller=<optimized out>, shadow_frame=<optimized out>, arg_offset=<optimized out>, result=0x7ff682cc20)
    at art/runtime/interpreter/interpreter_common.cc:516
#5  0x00000074ba23ba94 in art::PerformCall (self=0x74ba6bea00, caller_method=<optimized out>, first_dest_reg=<optimized out>, result=0x7ff682cc20, code_item=<optimized out>, callee_frame=<optimized out>,
    use_interpreter_entrypoint=<optimized out>) at art/runtime/common_dex_operations.h:56
#6  art::interpreter::DoCallCommon<false, false> (called_method=<optimized out>, self=<optimized out>, shadow_frame=..., result=<optimized out>, number_of_inputs=<optimized out>, arg=..., vregC=<optimized out>)
    at art/runtime/interpreter/interpreter_common.cc:1124
#7  art::interpreter::DoCall<false, false> (called_method=<optimized out>, self=0x74ba6bea00, shadow_frame=..., inst=<optimized out>, inst_data=<optimized out>, result=0x7ff682cc20)
    at art/runtime/interpreter/interpreter_common.cc:1157
#8  0x00000074ba4d9d6c in art::interpreter::DoFastInvoke<(art::InvokeType)1> (self=0x74ba6bea00, shadow_frame=..., result=0x7ff682cc20, inst=<optimized out>, inst_data=<optimized out>)
    at art/runtime/interpreter/interpreter_common.h:156
#9  MterpInvokeDirect (self=0x74ba6bea00, shadow_frame=0x7ff682cd20, dex_pc_ptr=0x74b869d316, inst_data=16496) at art/runtime/interpreter/mterp/mterp.cc:194
#10 0x00000074ba4e2a18 in artMterpAsmInstructionStart () at art/runtime/interpreter/mterp/out/mterp_arm64.S:2998
#11 0x00000074ba21bc04 in art::interpreter::Execute (self=0x74ba6bea00, code_item=0x74b869d2dc, shadow_frame=..., result_register=..., stay_in_interpreter=<optimized out>) at art/runtime/interpreter/interpreter.cc:314
#12 0x00000074ba2217d0 in art::interpreter::ArtInterpreterToInterpreterBridge (self=0x74ba6bea00, code_item=0x74b869d2dc, shadow_frame=0x7ff682cd20, result=0x7ff682cfa0) at art/runtime/interpreter/interpreter.cc:632
#13 0x00000074ba23ba74 in art::PerformCall (self=<optimized out>, caller_method=<optimized out>, first_dest_reg=<optimized out>, result=<optimized out>, code_item=<optimized out>, callee_frame=<optimized out>,
    use_interpreter_entrypoint=<optimized out>) at art/runtime/common_dex_operations.h:54
#14 art::interpreter::DoCallCommon<false, false> (called_method=<optimized out>, self=<optimized out>, shadow_frame=..., result=<optimized out>, number_of_inputs=<optimized out>, arg=..., vregC=<optimized out>)
    at art/runtime/interpreter/interpreter_common.cc:1124
#15 art::interpreter::DoCall<false, false> (called_method=<optimized out>, self=0x74ba6bea00, shadow_frame=..., inst=<optimized out>, inst_data=<optimized out>, result=0x7ff682cfa0)
    at art/runtime/interpreter/interpreter_common.cc:1157
#16 0x00000074ba4d8adc in art::interpreter::DoFastInvoke<(art::InvokeType)2> (self=0x74ba6bea00, shadow_frame=..., result=0x7ff682cfa0, inst=<optimized out>, inst_data=<optimized out>)
    at art/runtime/interpreter/interpreter_common.h:156
#17 MterpInvokeVirtual (self=0x74ba6bea00, shadow_frame=0x7ff682d0a0, dex_pc_ptr=0x74b869b3c0, inst_data=4206) at art/runtime/interpreter/mterp/mterp.cc:161
#18 0x00000074ba4e2918 in artMterpAsmInstructionStart () at art/runtime/interpreter/mterp/out/mterp_arm64.S:2932
#19 0x00000074ba21bc04 in art::interpreter::Execute (self=0x74ba6bea00, code_item=0x74b869b380, shadow_frame=..., result_register=..., stay_in_interpreter=<optimized out>) at art/runtime/interpreter/interpreter.cc:314
#20 0x00000074ba2217d0 in art::interpreter::ArtInterpreterToInterpreterBridge (self=0x74ba6bea00, code_item=0x74b869b380, shadow_frame=0x7ff682d0a0, result=0x7ff682d330) at art/runtime/interpreter/interpreter.cc:632
#21 0x00000074ba23ba74 in art::PerformCall (self=<optimized out>, caller_method=<optimized out>, first_dest_reg=<optimized out>, result=<optimized out>, code_item=<optimized out>, callee_frame=<optimized out>,
    use_interpreter_entrypoint=<optimized out>) at art/runtime/common_dex_operations.h:54
#22 art::interpreter::DoCallCommon<false, false> (called_method=<optimized out>, self=<optimized out>, shadow_frame=..., result=<optimized out>, number_of_inputs=<optimized out>, arg=..., vregC=<optimized out>)
    at art/runtime/interpreter/interpreter_common.cc:1124
#23 art::interpreter::DoCall<false, false> (called_method=<optimized out>, self=0x74ba6bea00, shadow_frame=..., inst=<optimized out>, inst_data=<optimized out>, result=0x7ff682d330)
    at art/runtime/interpreter/interpreter_common.cc:1157
#24 0x00000074ba4d9f54 in art::interpreter::DoFastInvoke<(art::InvokeType)0> (self=0x74ba6bea00, shadow_frame=..., result=0x7ff682d330, inst=<optimized out>, inst_data=<optimized out>)
    at art/runtime/interpreter/interpreter_common.h:156
#25 MterpInvokeStatic (self=0x74ba6bea00, shadow_frame=0x7ff682d3b0, dex_pc_ptr=0x74b8337caa, inst_data=113) at art/runtime/interpreter/mterp/mterp.cc:205
#26 0x00000074ba4e2a98 in artMterpAsmInstructionStart () at art/runtime/interpreter/mterp/out/mterp_arm64.S:3024
#27 0x00000074ba21bc04 in art::interpreter::Execute (self=0x74ba6bea00, code_item=0x74b8337c18, shadow_frame=..., result_register=..., stay_in_interpreter=<optimized out>) at art/runtime/interpreter/interpreter.cc:314
#28 0x00000074ba4cb454 in artQuickToInterpreterBridge (method=<optimized out>, self=0x74ba6bea00, sp=0x7ff682d550) at art/runtime/entrypoints/quick/quick_trampoline_entrypoints.cc:806
#29 0x00000074ba4f9d10 in art_quick_to_interpreter_bridge () at art/runtime/arch/arm64/quick_entrypoints_arm64.S:2518
#30 0x00000074ba4f0e50 in art_quick_invoke_static_stub () at art/runtime/arch/arm64/quick_entrypoints_arm64.S:1814
#31 0x00000074ba0825d4 in art::ArtMethod::Invoke (this=0x710f99c8, self=0x74ba6bea00, args=0x7ff682d8f8, args_size=4, result=0x7ff682d8c8, shorty=0x74b885046c "VL") at art/runtime/art_method.cc:369
#32 0x00000074ba414dcc in art::InvokeWithArgArray (soa=..., method=0x710f99c8, arg_array=<optimized out>, result=<optimized out>, shorty=<optimized out>) at art/runtime/reflection.cc:454
#33 0x00000074ba416970 in art::InvokeMethod (soa=..., javaMethod=<optimized out>, javaReceiver=<optimized out>, javaArgs=<optimized out>, num_frames=<optimized out>) at art/runtime/reflection.cc:667
#34 0x00000074ba39a188 in art::Method_invoke (env=<optimized out>, javaMethod=0x14843840, javaReceiver=0x0, javaArgs=0x74ba6bea00) at art/runtime/native/java_lang_reflect_Method.cc:87
#35 0x00000000714faf38 in java.lang.Class.getDeclaredMethodInternal [DEDUPED] () from /onet/malin/android_source/out/target/product/angler/symbols/system/framework/arm64/boot.oat
#36 0x00000074ba4f0b8c in art_quick_invoke_stub () at art/runtime/arch/arm64/quick_entrypoints_arm64.S:1697
#37 0x00000074ba082598 in art::ArtMethod::Invoke (this=0x709f67f0, self=0x74ba6bea00, args=0x7ff682dccc, args_size=12, result=0x7ff682de90, shorty=0x74b9e0c9a3 "LLL") at art/runtime/art_method.cc:367
#38 0x00000074ba2414a0 in art::interpreter::ArtInterpreterToCompiledCodeBridge (self=0x74ba6bea00, caller=<optimized out>, shadow_frame=<optimized out>, arg_offset=<optimized out>, result=0x7ff682de90)
    at art/runtime/interpreter/interpreter_common.cc:516
#39 0x00000074ba23ba94 in art::PerformCall (self=0x74ba6bea00, caller_method=<optimized out>, first_dest_reg=<optimized out>, result=0x7ff682de90, code_item=<optimized out>, callee_frame=<optimized out>,
    use_interpreter_entrypoint=<optimized out>) at art/runtime/common_dex_operations.h:56
#40 art::interpreter::DoCallCommon<false, false> (called_method=<optimized out>, self=<optimized out>, shadow_frame=..., result=<optimized out>, number_of_inputs=<optimized out>, arg=..., vregC=<optimized out>)
    at art/runtime/interpreter/interpreter_common.cc:1124
#41 art::interpreter::DoCall<false, false> (called_method=<optimized out>, self=0x74ba6bea00, shadow_frame=..., inst=<optimized out>, inst_data=<optimized out>, result=0x7ff682de90)
    at art/runtime/interpreter/interpreter_common.cc:1157
#42 0x00000074ba4d8adc in art::interpreter::DoFastInvoke<(art::InvokeType)2> (self=0x74ba6bea00, shadow_frame=..., result=0x7ff682de90, inst=<optimized out>, inst_data=<optimized out>)
    at art/runtime/interpreter/interpreter_common.h:156
#43 MterpInvokeVirtual (self=0x74ba6bea00, shadow_frame=0x7ff682df10, dex_pc_ptr=0x74b8f402ea, inst_data=12398) at art/runtime/interpreter/mterp/mterp.cc:161
---Type <return> to continue, or q <return> to quit---
#44 0x00000074ba4e2918 in artMterpAsmInstructionStart () at art/runtime/interpreter/mterp/out/mterp_arm64.S:2932
#45 0x00000074ba21bc04 in art::interpreter::Execute (self=0x74ba6bea00, code_item=0x74b8f402c4, shadow_frame=..., result_register=..., stay_in_interpreter=<optimized out>) at art/runtime/interpreter/interpreter.cc:314
#46 0x00000074ba4cb454 in artQuickToInterpreterBridge (method=<optimized out>, self=0x74ba6bea00, sp=0x7ff682e0a0) at art/runtime/entrypoints/quick/quick_trampoline_entrypoints.cc:806
#47 0x00000074ba4f9d10 in art_quick_to_interpreter_bridge () at art/runtime/arch/arm64/quick_entrypoints_arm64.S:2518
#48 0x00000000736318e8 in com.android.internal.os.ZygoteInit.main () from /onet/malin/android_source/out/target/product/angler/symbols/system/framework/arm64/boot-framework.oat
#49 0x00000074ba4f0e50 in art_quick_invoke_static_stub () at art/runtime/arch/arm64/quick_entrypoints_arm64.S:1814
#50 0x00000074ba0825d4 in art::ArtMethod::Invoke (this=0x7110ac50, self=0x74ba6bea00, args=0x7ff682e4a0, args_size=4, result=0x7ff682e480, shorty=0x74b9124816 "VL") at art/runtime/art_method.cc:369
#51 0x00000074ba414dcc in art::InvokeWithArgArray (soa=..., method=0x7110ac50, arg_array=<optimized out>, result=<optimized out>, shorty=<optimized out>) at art/runtime/reflection.cc:454
#52 0x00000074ba4149f0 in art::InvokeWithVarArgs (soa=..., obj=0x0, mid=<optimized out>, args=...) at art/runtime/reflection.cc:481
#53 0x00000074ba31b42c in art::JNI::CallStaticVoidMethodV (env=<optimized out>, mid=0x7110ac50, args=...) at art/runtime/jni_internal.cc:1731
#54 0x00000074ba0b6a90 in art::CheckJNI::CallMethodV (function_name=0x74ba518fe4 "CallStaticVoidMethodV", env=0x74ba6cb1c0, obj=0x0, c=0x69, mid=0x7110ac50, vargs=..., type=<optimized out>, invoke=<optimized out>)
    at art/runtime/check_jni.cc:3248
#55 0x00000074ba0a70e4 in art::CheckJNI::CallStaticVoidMethodV (env=<optimized out>, c=<optimized out>, mid=0x7ff682e480, vargs=...) at art/runtime/check_jni.cc:2143
#56 0x000000753d539da8 in _JNIEnv::CallStaticVoidMethod (this=<optimized out>, clazz=<optimized out>, methodID=<optimized out>) at libnativehelper/include_jni/jni.h:780
#57 0x000000753d53c51c in android::AndroidRuntime::start (this=<optimized out>, className=0x5580a87969 "com.android.internal.os.ZygoteInit", options=..., zygote=<optimized out>) at frameworks/base/core/jni/AndroidRuntime.cpp:1122
#58 0x0000005580a86444 in main (argc=<optimized out>, argv=<optimized out>) at frameworks/base/cmds/app_process/app_main.cpp:352

```

13.
[GDB调试Android代码——环境搭建及调试过程](https://blog.csdn.net/zhu929033262/article/details/76064044)
