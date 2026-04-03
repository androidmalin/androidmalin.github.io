---
layout: post
title: "android-studio-gradle-resouce-third-library-resource-not-found"
date: 2017-11-13 15:25:00 +0800
tags: [gradle]
---

引言:之前碰到一个问题,想看android-gradle 插件的源码,我的AS中点击后,找不见源码,而同事的电脑点击可以.</br>

很奇怪.卸载重装AS也不管用.后来,搜索相关文章后.
发现看不见源码是因为缺少gralde--xxx.source.jar.</br>

于是我下载相关的source.jar放入到AndroidStudio安装目录中gradle下对应的目录中.写了个shell脚本完成这个工作.

后来升级到`com.android.tools.build:gradle:3.0.0-beta7`后,打开新的项目,发现AndroidStudio下面显示正在下载gradle插件的source.jar文件.</br>

于是推断这个是AndroidStudio和android的gradle插件两个配合一起完成的,就是根据当前引入的依赖,自动在jcenter,Maven仓库中搜索相关库的source.jar文件,如果不存在,就自动帮助下载.

为了可以看到gradle插件的源码,或者其他第三方库的源码,比如okhttp,fresco源码.</br>

1. 确保项目使用`com.android.tools.build:gradle:3.0.0`;确保使用AndroidStudio3.x版本.</br>

2. 关闭AndroidStudio</br>

3. 删除项目根目录下的`.idea`,`.gradle`,`build`文件夹,删除`.imi`文件.</br>

4. 重新打开AndroidStudio,打开自己的工程,喝杯咖啡,等待下载相关插件第三方库源码,等待同步资源索引的完成.</br>

5. control+鼠标左键,点击gradle类,第三方库的引用,查看相关源码.</br>

6. 可以在工程根目录下,进入.idea/librarie/目录,可以看见xxx.xml,如com_google_code_gson_gson_2_8_2_jar.xml,查看这个xml文件.
```
<component name="libraryTable">
  <library name="com.google.code.gson:gson:2.8.2@jar">
    <CLASSES>
      <root url="jar://$USER_HOME$/.gradle/caches/modules-2/files-2.1/com.google.code.gson/gson/2.8.2/3edcfe49d2c6053a70a2a47e4e1c2f94998a49cf/gson-2.8.2.jar!/" />
    </CLASSES>
    <JAVADOC />
    <SOURCES>
      <root url="jar://$USER_HOME$/.gradle/caches/modules-2/files-2.1/com.google.code.gson/gson/2.8.2/b2da9f8444128651758719856de579eacff7f387/gson-2.8.2-sources.jar!/" />
    </SOURCES>
  </library>
```
我们可以看到`SOURCES`标签下,url就是gson源码在本地存储的路径.

为了方便完成上述步骤,可以使用下面的脚本

1. 关闭AndroidStudio</br>
```
sudo kill `ps -aux | grep java | grep studio | awk '{print $2}' | xargs echo | cut -d ' ' -f 1`
```

2. 切到工程目录下</br>
```
cd xxxx
```

3. 删除项目根目录下的`.idea`,`build`,`.gradle`文件夹,删除`.imi`文件.
```
rm -rf .idea .gradle && find . -name "*build*" -type d | xargs rm -rf && find . -name "*.iml" -type f | xargs rm -rf
```

4. 重启启动AndroidStudio</br>
sh xxxx/studio.sh
