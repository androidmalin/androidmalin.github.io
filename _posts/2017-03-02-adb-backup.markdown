---
layout: post
title: "Ubuntu adb backup"
date: 2017-03-02 15:59:00 +0800
tags: []
---

[xda](https://forum.xda-developers.com/showthread.php?t=2011811)

1.DownLoad [adbextractor](https://sourceforge.net/projects/adbextractor/)
android-backup-extractor-20160710-bin.zip

2.unzip

3.DownLoad JCR
[Java7 JCR](http://www.oracle.com/technetwork/java/javase/downloads/jce-7-download-432124.html)
[Jave8 JCR](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html)

解压后可以得到三个文件
local_policy.jar，US_export_policy.jar，README.txt，将两个jar文件拷贝到java的安装路径中。
例如：`/home/user1/jdk1.8.0/jre/lib/security`
`cp local_policy.jar US_export_policy.jar /home/user1/jdk1.8.0/jre/lib/security`

4.从手机中备份应用数据
`adb backup -nosystem -noshared -apk -f com.android.demo.ab com.android.demo`

-nosystem表示不备份系统应用
-noshared表示不备份应用存储在SD中的数据
-apk表示备份应用APK安装包
-f 表示备份的.ab文件路径和文件名
最后是要备份应用的packageName

执行后，手机上会提示备份数据，请输入密码，确认备份。

5.到adbextractor解压后的文件夹android-backup-extractor-20160710-bin中。
将第4部得到的com.android.demo.ab文件拷贝到android-backup-extractor-20160710-bin文件夹中。
`java -jar abe.jar unpack com.android.demo.ab com.android.demo.tar <password>`

6.解压tar文件
tar -xvf com.android.demo.tar


[1](http://www.droidsec.cn/%E8%AF%A6%E8%A7%A3android-app-allowbackup%E9%85%8D%E7%BD%AE%E5%B8%A6%E6%9D%A5%E7%9A%84%E9%A3%8E%E9%99%A9/)
[xda](https://forum.xda-developers.com/showthread.php?t=2011811)
