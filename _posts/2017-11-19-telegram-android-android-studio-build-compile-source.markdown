---
layout: post
title: "Telegram-android-源码编译"
date: 2017-11-19 11:27:00 +0800
tags: [telegram]
---

1.git modules
`git clone git@github.com:DrKLO/Telegram.git --recursive`

2.ndk


3.[README](https://github.com/DrKLO/Telegram)

## Telegram messenger for Android

[Telegram](https://telegram.org) is a messaging app with a focus on speed and security. It’s superfast, simple and free.
This repo contains the official source code for [Telegram App for Android](https://play.google.com/store/apps/details?id=org.telegram.messenger).

##Creating your Telegram Application

We welcome all developers to use our API and source code to create applications on our platform.
There are several things we require from **all developers** for the moment.

1. [**Obtain your own api_id**](https://core.telegram.org/api/obtaining_api_id) for your application.
2. Please **do not** use the name Telegram for your app — or make sure your users understand that it is unofficial.
3. Kindly **do not** use our standard logo (white paper plane in a blue circle) as your app's logo.
3. Please study our [**security guidelines**](https://core.telegram.org/mtproto/security_guidelines) and take good care of your users' data and privacy.
4. Please remember to publish **your** code too in order to comply with the licences.

### API, Protocol documentation

Telegram API manuals: https://core.telegram.org/api

MTproto protocol manuals: https://core.telegram.org/mtproto

### Usage

**Beware of using the dev branch and uploading it to any markets, in many cases it not will work as expected**.

First of all, take a look at **src/main/java/org/telegram/messenger/BuildVars.java** and fill it with correct values.
Import the root folder into your IDE (tested on Android Studio), then run project.

### Localization

We moved all translations to https://translations.telegram.org/en/android/. Please use it.

ParallelExecutorCompat

link:
[Telegram](https://github.com/DrKLO/Telegram)
[added in version 23.1.0,Deprecated since API level 26.0.0](https://developer.android.com/reference/android/support/v4/content/ParallelExecutorCompat.html)
[26.0.0 support_api_diff deprecated](https://developer.android.com/sdk/support_api_diff/26.0.0/changes.html)
[27.0.0 support_api_diff remove](https://developer.android.com/sdk/support_api_diff/27.0.0/changes.html)
