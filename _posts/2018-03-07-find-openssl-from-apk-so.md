---
layout: post
title: "从 APK SO 文件中定位 OpenSSL"
date: 2018-03-07 15:22:00 +0800
description: "从 APK 的 so 文件中定位 OpenSSL 相关符号。"
tags: [android, apk, openssl]
categories: [android]
---

1.解压APK,进入`lib/armeabi/`目录
2.到处所有`so`文件的函数表.
`nm -D libName.so`查看`so`文件符号表
可以使用下面的`shell`脚本

```
#!/bin/bash
mkdir -p sooutput
for file in *.so
do
filename=$(echo $file | cut -d '.' -f1)
nm -D $file | awk '{print $3}' > ./sooutput/$file.txt
done
```
3.在函数表文件夹`sooutput`,使用内容查找包含`SSL`字段的文件.
`cd sooutput`
`grep -rn "SSL"*`

4.将可疑的符号表文件和标准的SSL文件对比.
ssl.h的github上的地址为[https://github.com/openssl/openssl/blob/master/include/openssl/ssl.h](https://github.com/openssl/openssl/blob/master/include/openssl/ssl.h)
匹配关键的方法.
`http https://raw.githubusercontent.com/openssl/openssl/master/include/openssl/ssl.h | grep __owur`

或者导出Android手机中的libssl.so文件.使用类似的方式,导出函数表文件.对比两个文件相同的行.
`cat $1 $2 | sort | uniq -d | sort -n`

5.综合判断

附录:
`awk '{print $1}'`取出第一列
`grep -rn "hello,world!" *`
```
* : 表示当前目录所有文件，也可以是某个文件名
-r 是递归查找
-n 是显示行号
-R 查找所有文件包含子目录
-i 忽略大小写
```

链接:
[OpenSSL Version List](https://en.wikipedia.org/wiki/OpenSSL)
[Linux的nm查看动态和静态库中的符号](http://www.cnblogs.com/itech/archive/2012/09/16/2687423.html)
[strings命令](http://man.linuxde.net/strings)
[C语言中#define的用法](http://blog.csdn.net/benny5609/article/details/2314541)
