---
layout: post
title: "replugin-publishToMavenLocal"
date: 2017-12-26 18:33:00 +0800
tags: []
---

1.删除build-cache
`rm -rf /home/malin/.android/build-cache`

2.删除gradle的cache
`rm -rf /home/malin/.gradle/caches/modules-2/files-2.1/com.qihoo360.replugin/replugin-host-gradle`
`rm -rf /home/malin/.gradle/caches/modules-2/files-2.1/com.qihoo360.replugin/replugin-plugin-gradle`


3.删除mavenLocal中replugin目录
cd
`rm -rf /home/malin/.m2/repository/com/qihoo360/replugin`

4.replugin-host-gradle的publishToMavenLocal
`cd /home/malin/malin_demo/RePlugin/replugin-host-gradle`
`gradle publishToMavenLocal`

5.replugin-plugin-gradle的publishToMavenLocal
`cd /home/malin/malin_demo/RePlugin/replugin-plugin-gradle`
`gradle publishToMavenLocal`

6.clean实例Demo的工程缓存
`cd /home/malin/malin_github/RePluginSample`
`rm -rf .gradle .idea && find . -name "*build*" -type d | xargs rm -rf`

7.修改项目根目录中build.gradle的第一个仓库为 mavenLocal()

8.离线编译安装Demo查看log,确认修改插件的输出
`cd /home/malin/malin_github/RePluginSample`
`gradle assembleDebug --offline`


commandLine 'git', 'describe', '--tags', '--always', '--abbrev=0'

git describe --tags --always --abbrev=0
