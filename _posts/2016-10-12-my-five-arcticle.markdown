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

com.android.tools.build:gradle版本网址查看地址<br/>
https://bintray.com/android/android-tools/com.android.tools.build.gradle<br/>

其他的一些android tool版本分布查看网址
https://bintray.com/android/android-tools/<br/>

1.刷新Gradle缓存<br/>
[force gradle to redownload dependencies](http:stackoverflow.com/questions/13565082/how-can-i-force-gradle-to-redownload-dependencies#)<br/>

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
file:/home/malin/gitlab/bilibili/app/build/reports/project/dependencies/root.app.html<br/>

在浏览器中打开可以看到如下的网页，十分简介清楚。

![denpendencies1](http://ogxkun013.bkt.clouddn.com/dependencies_one.png)
![denpendencies2](http://ogxkun013.bkt.clouddn.com/dependencies_two.png)

>说明:这里需要在module中的buil.gradle中添加如下声明:<br/>
`apply plugin: 'project-report'`



禁止lint Task<br/>
`gradle build -x lint`

Task 编译耗时检测<br/>
`gradle build --profile`
file:/home/malin/gitlab/bilibili/build/reports/profile/<br/>

生成Gradle脚本<br/>
`gradle init wrapper`

lint<br/>
`gradle lint`
file:/home/malin/gitlab/bilibili/app/build/outputs/<br/>

项目结构<br/>
`gradle project`

显示依赖包的存储路径<br/>
`gradle showMeCache`


clean<br/>
`gradle clean`

打包<br/>
`gradle assembleDebug --debug`
`gradle assembleRelease --info`

打包并安装<br/>
`gradle installDebug`<br/>
`gradle installRelease`<br/>

获取APK包名<br/>
将`/sdk/build-tools/24.0.3/aapt`配置到环境变量中<br/>
`aapt dump badging app.apk`<br/>

grep过滤<br/>
`aapt dump badging app.apk | grep package`<br/>
`aapt dump badging app.apk | grep uses-permission`<br/>

查看权限<br/>
`aapt dump permissions app.apk`<br/>

查看资源列表<br/>
`aapt dump resources app.apk`<br/>

一般都会输出很多的信息，如要全部查看，请用下面这两句：<br/>
`aapt dump resources app-xiaomi-debug.apk > /home/malin/xxx/xxx.txt`<br/>
这样会把所有的信息通过重定向符">"输出到sodino.txt文件中，然后再打开该文件即可查看。<br/>

查看apk配置信息<br/>
aapt dump configurations app.apk<br/>

查看指定apk的指定xml文件。<br/>
`aapt dump xmltree app.apk res/layout/progress_dialog_layout.xml`<br/>
`aapt dump xmltree app.apk AndroidManifest.xml`<br/>


应用的启动时间：<br/>
`adb shell am start -W com.malin.animation/.mvp.MActivity`<br/>

内存<br/>
`adb shell dumpsys meminfo com.malin.animation`<br/>

gradle编译工具的版本信息<br/>
`gradle buildEnvironment`<br/>

签名信息<br/>
`gradle signingReport`<br/>

Gradle GUI<br/>
`gradle -gui`<br/>

查看栈顶的Activity(包名)<br/>
`adb shell dumpsys activity top | grep ACTIVITY`<br/>
`adb shell dumpsys activity | grep mFocusedActivity`<br/>

查看安装应用的信息<br/>
`adb shell dumpsys package com.malin.animation`<br/>

查看安装应用的权限<br/>
`adb shell dumpsys package com.malin.animation | grep permission`<br/>

查看手机的屏幕信息<br/>
`adb shell dumpsys display`<br/>

查看手机分辨率<br/>
`adb shell dumpsys display | grep DisplayInfo | grep app | grep width | grep height | grep real | grep mOverrideDisplayInfo`<br/>

查看当前Activity的状态<br/>
`adb shell dumpsys activity top`<br/>


列出所有安装的应用的包名<br/>
`adb shell pm list packages`<br/>

`adb shell screencap /sdcard/screen.png`<br/>

`adb shell am start -a android.intent.action.VIEW`<br/>

启动一个Activity<br/>
`adb shell am start -n com.malin.animation/.mvp.MActivity`<br/>

`adb shell am force-stop com.malin.animation`<br/>

http:stormzhang.com/2016/09/08/common-adb-commands/<br/>

adb 命令大全<br/>
https:github.com/androidmalin/awesome-adb
http:adbshell.com/
https:developer.android.com/studio/command-line/shell.html

`adb shell monkey -p com.malin.animation -v 100`<br/>

屏幕分辨率<br/>
`adb shell wm size`<br/>

屏幕密度<br/>
`adb shell wm density`<br/>

屏幕分辨率和密度，虚拟按键的高度<br/>
`adb shell dumpsys window displays | grep init`<br/>

`adb shell am start -W -S -R 9 -n com.malin.animation/.mvp.MActivity`<br/>

`adb shell am start -n com.malin.animation/.mvp.MActivity`<br/>

`adb shell screenrecord --bugreport /sdcard/a.mp4`<br/>
`adb shell screenrecord /sdcard/a.mp4`<br/>
`adb pull /sdcard/a.mp4 /home/malin/aaaa`<br/>

monkey<br/>
`adb shell monkey -p com.malin.animation -v 10000`<br/>
`adb shell monkey -p com.malin.animation -v -v -v --ignore-crashes --ignore-timeouts --monitor-native-crashes 100 > d:\aaaa\a.txt`<br/>

--ignore-crashes crash后继续<br/>
 --ignore-timeouts ANR后继续<br/>
 --monitor-native-crashes<br/>
--ignore-security-exceptions 权限问题后，继续<br/>

gradle文档<br/>
https:dongchuan.gitbooks.io/gradle-user-guide-/content/<br/>

即可看到所有依赖的对应路径，<br/>
Note : 因为 gradle 文件顺序执行的特点，这个任务应该定义在dependencies节点之下。<br/>
`gradle showMeCache`<br/>

离线模式编译<br/>
`gradlew.bat build --offline -x lint`<br/>

多命令顺序执行<br/>
`gradlew.bat clean & gradlew.bat showMeCache & gradlew.bat build --offline -x lint`


点击坐标点x=50  y=250的位置<br/>
`adb shell input tap 50 250`


>task showMeCache << {
    configurations.compile.each { println it }
}

自动化<br/>
光标切换到输入用户名<br/>
`adb shell input tap 200 800`<br/>

输入用户名<br/>
`adb shell input text 15510600873`<br/>

光标切换到输入密码<br/>
`adb shell input tap 200 900`<br/>

输入密码 abcd<br/>
`adb shell input text abcdefgh`<br/>

点击登陆<br/>
`adb shell input tap 900 1200`<br/>

点击返回键<br/>
`adb shell input keyevent 4`<br/>

自动化<br/>


>just for windows
task cleanall(type: Exec) {
    ext.lockhunter = '\"D:\\LockHunter\\LockHunter.exe\"'
    def buildDir = file(new File("build"))
    commandLine 'cmd', "$lockhunter", '/delete', '/silent', buildDir
}
