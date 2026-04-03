---
layout: post
title: "gradle 版本冲突解决"
date: 2018-03-16 10:25:00 +0800
description: "记录 Android 工程中 support 依赖版本冲突的排查与处理方式。"
tags: [android, gradle]
categories: [android]
---

0.

```
Error:Conflict with dependency 'com.android.support:multidex' in project ':app'. Resolved versions for app (1.0.3) and test app (1.0.1) differ. See http://g.co/androidstudio/app-test-app-conflict for details.
```

[http://blog.csdn.net/qq_28486273/article/details/78849506](http://blog.csdn.net/qq_28486273/article/details/78849506)
[https://github.com/talklittle/TestMultidex102](https://github.com/talklittle/TestMultidex102)
[https://www.reddit.com/r/androiddev/comments/6n4lcu/wheres_multidex_102/](https://www.reddit.com/r/androiddev/comments/6n4lcu/wheres_multidex_102/)

```
compile 'com.android.support:multidex:1.0.3'
androidTestCompile 'com.android.support:multidex:1.0.3'
androidTestCompile 'com.android.support:multidex-instrumentation:1.0.3'
```



1.插件
`app/build.gradle`顶部增加
`apply plugin: 'project-report'`
执行
`gradlew.bat projectReport`
`gradlew.bat -DsocksProxyHost=127.0.0.1 -DsocksProxyPort=1080 projectReport`
在浏览器中打开生成的html链接

搜索
`com.android.support:multidex:1.0.3`
`com.android.support:multidex-instrumentation:1.0.3`


2.内置任务
`gradle -q app:dependencies`
`gradle -q app:dependencies > depen.txt`

3.统一版本

所有工程
```
allprojects {
    //将配置一次性地应用于所有的Project
    repositories {
        maven { url 'https://maven.google.com' }
        maven { url 'https://dl.google.com/dl/android/maven2/' }
        jcenter()
    }
    configurations.all {
        resolutionStrategy {
            eachDependency { details ->
                // Force all of the primary support libraries to use the same version.
                if (details.requested.group == 'com.android.support'
                        && details.requested.name != 'multidex'
                        && details.requested.name != 'multidex-instrumentation') {
                    details.useVersion "27.1.0"
                }
                // Force all the error-prone dependencies to use the same version.
                if (details.requested.group == 'com.android.support'
                        && (details.requested.name.startsWith('multidex') || details.requested.name.startsWith('multidex-instrumentation'))) {
                    details.useVersion "1.0.3"
                }
            }
        }
    }
}
```

或者

```
allprojects {
    //将配置一次性地应用于所有的Project
    repositories {
        maven { url 'https://maven.google.com' }
        maven { url 'https://dl.google.com/dl/android/maven2/' }
        jcenter()
    }

    configurations.all {
        resolutionStrategy {
            force 'com.android.support:multidex:1.0.3'
            force 'com.android.support:multidex-instrumentation:1.0.3'
        }
    }

}
```


除主工程外
```
subprojects {
    //配置所有的子Project（不包含根Project）
    repositories {
        maven { url 'https://maven.google.com' }
        maven { url 'https://dl.google.com/dl/android/maven2/' }
        jcenter()
    }
    configurations.all {
        resolutionStrategy {
            eachDependency { details ->
                // Force all of the primary support libraries to use the same version.
                if (details.requested.group == 'com.android.support'
                        && details.requested.name != 'multidex'
                        && details.requested.name != 'multidex-instrumentation') {
                    details.useVersion "27.1.0"
                }
                // Force all the error-prone dependencies to use the same version.
                if (details.requested.group == 'com.android.support'
                        && (details.requested.name.startsWith('multidex') || details.requested.name.startsWith('multidex-instrumentation'))) {
                    details.useVersion "1.0.3"
                }
            }
        }
    }
    task subTask << {
        println project.name
    }
}
```

https://github.com/facebook/shimmer-android
https://github.com/tabassumLatif/ShimmerRecyclerView
https://github.com/sharish/ShimmerRecyclerView
http://facebook.github.io/shimmer-android/
https://github.com/team-supercharge/ShimmerLayout

https://stackoverflow.com/questions/36857713/place-holder-list-item-like-facebook-for-content-loading
http://mercury.io/blog/the-psychology-of-waiting-loading-animations-and-facebook
