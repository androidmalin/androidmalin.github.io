---
layout: post
title:  "Android中常用的Gradle命令"
date:   2016-10-12 11:39 +0800
categories: Ma Lin update
---
### 说明
本文中使用的是Gradle命令，已经添加将Gradle添加到了环境变量中。

0.查看Gradle版本<br/>
`gradle --version`


1.刷新Gradle缓存<br/>
[force gradle to redownload dependencies](http://stackoverflow.com/questions/13565082/how-can-i-force-gradle-to-redownload-dependencies#)<br/>

用于解决一些奇怪的依赖问题<br/>
`gradle --refresh-dependencies`



<br/>
2.查看依赖关系
比如项目引用了很多库，这些库都依赖了okhttp,此时你又单独引入了okhttp后，此时存在多个okhttp的版本。<br/>
那么最后，这些库到底依赖或者说使用了哪个版本的okhttp呢？这个问题，在某些情况下，显得十分重要。<br/>

比如我在项目中使用了如下的库

>RxJava  
compile 'io.reactivex:rxandroid:1.2.1'  
compile 'io.reactivex:rxjava:1.1.10'  

>Retrofit2  
compile 'com.squareup.retrofit2:retrofit:2.1.0'  
compile 'com.squareup.retrofit2:converter-gson:2.1.0'  
compile 'com.squareup.retrofit2:adapter-rxjava:2.1.0'  

>OkHttp  
compile 'com.squareup.okhttp3:okhttp:3.4.1'  

>logging-interceptor  
debugCompile 'com.squareup.okhttp3:logging-interceptor:3.4.1'  

查看okhttp，在各个库的依赖中最后依赖的版本<br/>
`gradle -q app:dependencyInsight --dependency okhttp --configuration compile`

![okhttp](http://ogxkun013.bkt.clouddn.com/okhttp.png)
<br/>
<br/>


查看rxjava，在各个库的依赖中最后依赖的版本<br/>
`gradle -q app:dependencyInsight --dependency rxjava --configuration compile`

查看support-annotations，在各个库的依赖中最后依赖的版本<br/>
`gradle -q app:dependencyInsight --dependency com.android.support:support-annotations --configuration compile`

![annotations](http://ogxkun013.bkt.clouddn.com/annotations.png)

查看Android相关库的依赖关系<br/>
`gradle androidDependencies`


显示 task 使用细节执行<br/>
`gradle -q help --task assemble`

可以获取到 task 的详细信息， 或者多项目构建中相同 task 名称的所有 task 的信息<br/>


查看module相关库的依赖关系<br/>
`gradle -q dependencies app:dependencie`

查看某个Task的相关库的依赖关系<br/>
`gradle -q dependencies app:dependencies --configuration compile`



依赖报告<br/>
`gradle projectReport`
file:///home/malin/gitlab/bilibili/app/build/reports/project/dependencies/root.app.html<br/>

在浏览器中打开可以看到如下的网页，十分简介清楚。

![denpendencies1](http://ogxkun013.bkt.clouddn.com/dependencies_one.png)
![denpendencies2](http://ogxkun013.bkt.clouddn.com/dependencies_two.png)

>说明:这里需要在module中的buil.gradle中添加如下声明:<br/>
`apply plugin: 'project-report'`



禁止lint Task<br/>
`gradle build -x lint`

Task 编译耗时检测<br/>
`gradle build --profile`
file:///home/malin/gitlab/bilibili/build/reports/profile/<br/>

生成Gradle脚本<br/>
`gradle init wrapper`

lint<br/>
`gradle lint`
file:///home/malin/gitlab/bilibili/app/build/outputs/<br/>

项目结构<br/>
`gradle project`

显示依赖包的存储路径<br/>
`gradle showMeCache`


clean<br/>
`gradle clean`

打包
`gradle assembleDebug --debug`
`gradle assembleRelease --info`

//打包并安装
//gradle installXiaomiDebug<br/>
//gradle installXiaomiRelease<br/>

//包名
// /home/malin/sdk/build-tools/24.0.3/aapt
//aapt dump badging app-release.apk
//grep过滤
//aapt dump badging app-xiaomi-debug.apk | grep package
//aapt dump badging app-xiaomi-debug.apk | grep uses-permission

//查看权限
//aapt dump permissions app-xiaomi-debug.apk

//查看资源列表
//aapt dump resources app-xiaomi-debug.apk
//一般都会输出很多的信息，如要全部查看，请用下面这两句：
//aapt dump resources app-xiaomi-debug.apk > /home/malin/aaaa/sodino.txt
//这样会把所有的信息通过重定向符">"输出到sodino.txt文件中，然后再打开该文件即可查看。

//查看apk配置信息
//aapt dump configurations app-xiaomi-debug.apk

//查看指定apk的指定xml文件。
//aapt dump xmltree app-xiaomi-debug.apk res/layout/progress_dialog_layout.xml



//应用的启动时间：
//adb shell am start -W com.malin.animation/.mvp.MActivity

//内存
//adb shell dumpsys meminfo com.malin.animation

//gradle编译工具的版本信息
//gradle buildEnvironment

//签名信息
//gradle signingReport

//GUI
//gradle -gui

//查看栈顶的Activity(包名)
//adb shell dumpsys activity top | grep ACTIVITY
//adb shell dumpsys activity | grep mFocusedActivity

//查看安装应用的信息
//adb shell dumpsys package com.malin.animation

//查看安装应用的权限
//adb shell dumpsys package com.malin.animation | grep permission

//查看手机的屏幕信息
//adb shell dumpsys display

//查看手机分辨率
//adb shell dumpsys display | grep DisplayInfo | grep app | grep width | grep height | grep real | grep mOverrideDisplayInfo

//查看当前Activity的状态
//adb shell dumpsys activity top


//列出所有安装的应用的包名
//adb shell pm list packages

//adb shell screencap /sdcard/screen.png

//adb shell am start -a android.intent.action.VIEW

//启动一个Activity
//adb shell am start -n com.malin.animation/.mvp.MActivity

//adb shell am force-stop com.malin.animation

//http://stormzhang.com/2016/09/08/common-adb-commands/

//adb 命令大全
//https://github.com/androidmalin/awesome-adb
//http://adbshell.com/
//https://developer.android.com/studio/command-line/shell.html

//adb shell monkey -p com.malin.animation -v 100

//屏幕分辨率
//adb shell wm size

//屏幕密度
//adb shell wm density

//屏幕分辨率和密度，虚拟按键的高度
//adb shell dumpsys window displays | grep init

//adb shell am start -W -S -R 9 -n com.malin.animation/.mvp.MActivity

//adb shell am start -n com.malin.animation/.mvp.MActivity

//adb shell screenrecord --bugreport /sdcard/a.mp4
//adb shell screenrecord /sdcard/a.mp4
//adb pull /sdcard/a.mp4 /home/malin/aaaa

//monkey
//adb shell monkey -p com.malin.animation -v 10000
//adb shell monkey -p com.malin.animation -v -v -v --ignore-crashes --ignore-timeouts --monitor-native-crashes 100 > d:\aaaa\a.txt

//--ignore-crashes crash后继续
// --ignore-timeouts ANR后继续
// --monitor-native-crashes
//--ignore-security-exceptions 权限问题后，继续

//gradle文档
//https://dongchuan.gitbooks.io/gradle-user-guide-/content/

//即可看到所有依赖的对应路径，
//Note : 因为 gradle 文件顺序执行的特点，这个任务应该定义在dependencies节点之下。
//gradle showMeCache

//离线模式编译
//gradlew.bat build --offline -x lint

//多命令顺序执行
//gradlew.bat clean & gradlew.bat showMeCache & gradlew.bat build --offline -x lint


//点击坐标点x=50  y=250的位置
//adb shell input tap 50 250


//task showMeCache << {
//    configurations.compile.each { println it }
//}

////////////////////////////自动化///////////////////////////////////
////光标切换到输入用户名
//adb shell input tap 200 800
//
////输入用户名
//adb shell input text 15510600873
//
////光标切换到输入密码
//adb shell input tap 200 900
//
////输入密码 abcd
//adb shell input text abcdefgh
//
////点击登陆
//adb shell input tap 900 1200
//
////点击返回键
//adb shell input keyevent 4
////////////////////////////自动化///////////////////////////////////


//just for windows
//task cleanall(type: Exec) {
//    ext.lockhunter = '\"D:\\LockHunter\\LockHunter.exe\"'
//    def buildDir = file(new File("build"))
//    commandLine 'cmd', "$lockhunter", '/delete', '/silent', buildDir
//}
