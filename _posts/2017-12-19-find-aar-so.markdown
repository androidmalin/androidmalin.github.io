---
layout: post
title: "find-so-from-aar"
date: 2017-12-19 13:02:00 +0800
tags: []
---

1.编译
`gradle assembleDebug -x lint`


2.查找aar
`mkdir -p malinaar && find . -name "*.aar" -type f | xargs -i cp {} ./malinaar`


3.重命名aar为zip后缀
`cd malinaar && rename 's/\.aar/.zip/' *.aar`


4.批量解压到对应的zip文件名下
将如下的脚本保存成 unzipll.sh 然后赋予可执行的权限

例如可以这样
`vim unzipll.sh && chmod +x unzipll.sh`

```
#!/bin/bash
mkdir -p malinoutput

for file in *.zip
do
filename=$(echo $file|cut -d'.' -f1)
unzip $file -d malinoutput/$filename
done
```

然后执行`unzipll.sh`

`./unzipll.sh`



5.从解压的文件中查找对应的so

`cd malinoutput `

xxx表示要寻找的so
`find . -name "*.so" -type f | grep xxx`


或者用下面的步骤

1.同上

2.同上

3.同上

4.将zip包中的信息保存在file.json文件中
`unzip -v "*.zip" > ./file.json`

5.从文件中查找制定的so
可以使用文本编辑器
