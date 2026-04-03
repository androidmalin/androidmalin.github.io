---
layout: post
title: "Rename andorid module source"
date: 2017-12-05 10:49:00 +0800
tags: []
---

0.去除无用的资源.color,image,drawable,sytle等等.
1.shell文件批量增加前缀
find /tmp/dir -type f | rename 's/^/pl_libutil_/'
rename 's/^/pl_libutil_/' *.png


-------------java文件--------------------
R.drawable.common_back_icon

图片文件搜索方法
crl+h
R.drawable.xxxxxxxxx
-------------java文件--------------------


-------------xml文件--------------------
R.drawable.common_back_icon

图片文件搜索方法
crl+h
R.drawable.xxxxxxxxx
-------------xml文件--------------------

<color name="$name$">$color$</color>
