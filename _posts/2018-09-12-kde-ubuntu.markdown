---
layout: post
title: "KDE Connect Indicator"
date: 2018-09-12 16:53:00 +0800
tags: []
---

1.indicator-kdeconnect

```
sudo add-apt-repository ppa:webupd8team/indicator-kdeconnect
sudo apt update
sudo apt install  indicator-kdeconnect
```
2.
```
sudo apt install python-nautilus
sudo apt install python-nemo
sudo apt install python-caja
```
1c6063510bfbc364

[indicator-kdeconnect](https://github.com/Bajoja/indicator-kdeconnect)


3.电脑发送文件到手机
`kdeconnect-send %F aa.img`

mkdir -p /run/user/1000/xxxxxxxxxxxxxxxx
sudo mount -v -t fuse.sshfs \
  -o rw,nosuid,nodev,uid=1000,gid=1000 \
  kdeconnect@10.31.4.43:/ /home/malin/kdeconnect
