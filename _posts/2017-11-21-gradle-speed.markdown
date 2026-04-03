---
layout: post
title: "gradle Optimize Your Build Speed"
date: 2017-11-21 11:02:00 +0800
tags: []
---

0.保持工具为最新

1.用Android7.0以上的设备测试

2.minSkd>=21

3.为测试版本创建productFlavors

4.Avoid compiling unnecessary resources

5.Use static build config values with your debug build

6.Use static dependency versions

7.Enable offline mode

8.Enable configuration on demand

9.Create library modules



1.${home}/.gradle/gradle.properties
创建gradle.properties文件。

```
#加快编译速度的配置
org.gradle.daemon=true
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.configureondemand=true
#加快编译速度的配置

#设置socoket5代理
#org.gradle.jvmargs=-DsocksProxyHost=127.0.0.1 -DsocksProxyPort=1080


#GitHub中引用jar包更新失败的解决方案
#To fix compile error. 这里的三个变量名根据uploadArchives中所引用的变量名不同，具体看情况而配置.
sonatypeRepo=null
sonatypeUsername=null
sonatypePassword=null  
#GitHub中引用jar包更新失败的解决方案
```
