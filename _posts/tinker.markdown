---
layout: post
title:  "Tinker"
date:   2016-11-17 20:14 +0800
categories: Ma Lin update
---

0.
cd /home/malin/github/tinker/tinker-sample-android

1.`gradle assembleDebug`

2.`cd /home/malin/github/tinker/tinker-sample-android/app/build/bakApk`

3.`adb install app-debug-1129-11-29-42.apk`

4.`adb shell am start tinker.sample.android/.app.MainActivity`

5

`cd /home/malin/github/tinker/tinker-sample-android/app/`
`cat build.gradle | grep tinkerOldApkPath`
`vim /home/malin/github/tinker/tinker-sample-android/app/buid.gradle`


6.`gradle tinkerPatchDebug`

7.
`cd /home/malin/github/tinker/tinker-sample-android/app/build/outputs/tinkerPatch/debug`

8.`adb push patch_signed_7zip.apk /storage/sdcard0/`

9.重启应用
`adb shell am force-stop tinker.sample.android`

或者

`PROID=`adb shell ps | grep tinker.sample.android | awk '{print $2}' | head -n 1``
`adb shell kill -9 $PROID`

10.`adb shell am start tinker.sample.android/.app.MainActivity`

11.`pidcat.py tinker.sample.android -t Tinker.MainActivity`
