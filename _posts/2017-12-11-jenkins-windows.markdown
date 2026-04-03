---
layout: post
title: "Jenkins Windows"
date: 2017-12-11 11:12:00 +0800
tags: [chromium]
---

一:ubuntu jenkins结果
0.不勾选,gradle命令不加-g参数

1.只勾选
Force GRADLE_USER_HOME to use workspace

在工程根目录下生成如下几个文件夹
caches/
daemon/
native/


2.只加-g参数,不勾选
-g=$WORKSPACE/.gradlecache

在项目根目录下生成.gradlecache目录,该目录下有如下文件夹

caches/
daemon/
native/
workers/
.gradlecache/

二:Windows jenkins结果
和ubuntu类似




最后解决办法:
1.解决.gradle路径过长的问题
gradle命令增加参数,不勾选Force GRADLE_USER_HOME
-g=$WORKSPACE/.gradlecache

2.解决apk生成路径不同的问题

jenkins-->构建后操作-->Archive the artifacts



${WORKSPACE}/app/build/outputs/apk/

修改为
${WORKSPACE}/app/build/outputs/apk/**/*.apk

ContentProviderSample/app/apk/malin.apk
ContentProviderSample/app/build/outputs/apk/google/release/malin.apk

assemble${PRODUCT_FLAVORS}${BUILD_TYPE} -x lint --build-cache --daemon --parallel -g=$WORKSPACE/.gradlecache

${PRODUCT_FLAVORS}${BUILD_TYPE}

3.守护进程关闭
--no-daemon
4.禁止build-cache
--no-build-cache

最新命令
gradle clean assemble${channel}Release -g=$WORKSPACE/.gradlecache --no-daemon --no-build-cache
