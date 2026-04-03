---
layout: post
title: "gradle-proxy-android-studio"
date: 2018-03-08 17:07:00 +0800
tags: []
---

1.android studio 设置中选择proxy设置后,竟然将相关的配置写入了
`/home/user/.gradle/gradle.properties`文件中了.导致全局生效,关闭代理后,依赖下载不下来.
