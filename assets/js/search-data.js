// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-",
    title: "",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-首页",
          title: "首页",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/index.html";
          },
        },{id: "nav-关于",
          title: "关于",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/about/";
          },
        },{id: "post-android-视频与面试资料整理",
        
          title: "Android 视频与面试资料整理",
        
        description: "整理 Android 视频、Handler、Binder 和面试相关资料。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/10/16/android-video/";
          
        },
      },{id: "post-androidx-migrate-jetifier",
        
          title: "AndroidX,migrate,jetifier",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/10/08/androidx/";
          
        },
      },{id: "post-kde-connect-indicator",
        
          title: "KDE Connect Indicator",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/09/12/kde-ubuntu/";
          
        },
      },{id: "post-busybox",
        
          title: "BusyBox",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/09/12/busybox/";
          
        },
      },{id: "post-source-for-android-28",
        
          title: "Source for Android 28",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/08/18/android-source/";
          
        },
      },{id: "post-chromium-cronet",
        
          title: "chromium-cronet",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/08/08/chromium-cronet/";
          
        },
      },{id: "post-微信数据库解密",
        
          title: "微信数据库解密",
        
        description: "记录微信数据库密钥推导与解密过程。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/06/15/wechat-db/";
          
        },
      },{id: "post-magisk",
        
          title: "Magisk",
        
        description: "记录 Nexus 6P 安装 TWRP、解锁和刷入 Magisk 的过程。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/06/08/magisk/";
          
        },
      },{id: "post-douyin-相关资料整理",
        
          title: "Douyin 相关资料整理",
        
        description: "整理抖音 Android 开发相关的开源库、推送和广告接入资料。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/06/05/douyin/";
          
        },
      },{id: "post-gradle-版本冲突解决",
        
          title: "gradle 版本冲突解决",
        
        description: "记录 Android 工程中 support 依赖版本冲突的排查与处理方式。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/03/16/gradle-solve-conflict/";
          
        },
      },{id: "post-gradle-proxy-android-studio",
        
          title: "gradle-proxy-android-studio",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/03/08/gradle-proxy-android-studio/";
          
        },
      },{id: "post-从-apk-so-文件中定位-openssl",
        
          title: "从 APK SO 文件中定位 OpenSSL",
        
        description: "从 APK 的 so 文件中定位 OpenSSL 相关符号。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2018/03/07/find-openssl-from-apk-so/";
          
        },
      },{id: "post-replugin-publishtomavenlocal",
        
          title: "replugin-publishToMavenLocal",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/26/replugin-offline-compile/";
          
        },
      },{id: "post-find-so-from-aar",
        
          title: "find-so-from-aar",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/19/find-aar-so/";
          
        },
      },{id: "post-aosp-telegrame-shadowsocks-chromium-vlc",
        
          title: "AOSP-Telegrame-Shadowsocks-Chromium-VLC",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/19/compile/";
          
        },
      },{id: "post-vlc-android-build",
        
          title: "vlc-android-build",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/18/vlc-android-build/";
          
        },
      },{id: "post-shadowsocks-android-build",
        
          title: "shadowsocks-android-build",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/14/shadowsocks-android-build/";
          
        },
      },{id: "post-jenkins-windows",
        
          title: "Jenkins Windows",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/11/jenkins-windows/";
          
        },
      },{id: "post-chromium-android源码编译",
        
          title: "Chromium Android源码编译",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/11/chromium-android-build/";
          
        },
      },{id: "post-chrome-android",
        
          title: "chrome android",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/07/chrome-android/";
          
        },
      },{id: "post-rename-andorid-module-source",
        
          title: "Rename andorid module source",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/12/05/rename-android-module-source/";
          
        },
      },{id: "post-rename-android-module-source-name",
        
          title: "rename-android-module-source-name",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/28/rename-android-module-source-name/";
          
        },
      },{id: "post-gradle3-0-0-aar-not-found",
        
          title: "gradle3.0.0-aar-not-found",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/28/gradle3.0.0-aar-not-found/";
          
        },
      },{id: "post-question",
        
          title: "question",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/21/questions/";
          
        },
      },{id: "post-gradle-optimize-your-build-speed",
        
          title: "gradle Optimize Your Build Speed",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/21/gradle-speed/";
          
        },
      },{id: "post-jenkins-gmail-config",
        
          title: "jenkins-gmail-config",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/19/jenkins/";
          
        },
      },{id: "post-telegram-android-源码编译",
        
          title: "Telegram-android-源码编译",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/19/telegram-android-android-studio-build-compile-source/";
          
        },
      },{id: "post-android-studio-gradle-resouce-third-library-resource-not-found",
        
          title: "android-studio-gradle-resouce-third-library-resource-not-found",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/13/android-studio-gradle-resouce-third-library-resource-not-found/";
          
        },
      },{id: "post-android-develop-tools-release-notes",
        
          title: "Android Develop Tools release-notes",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/11/06/android-sdk-support-tools-gradle-plugin/";
          
        },
      },{id: "post-ubuntu-2k",
        
          title: "Ubuntu 2k",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/03/30/ubuntu-2k/";
          
        },
      },{id: "post-ubuntu-adb-backup",
        
          title: "Ubuntu adb backup",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/03/02/adb-backup/";
          
        },
      },{id: "post-ubuntu-vps",
        
          title: "Ubuntu VPS",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2017/01/11/vps/";
          
        },
      },{id: "post-smali-baksmali",
        
          title: "Smali,BakSmali",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/12/26/smali/";
          
        },
      },{id: "post-使用脚本安装并启动一个apk",
        
          title: "使用脚本安装并启动一个APK",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/12/22/shell/";
          
        },
      },{id: "post-ubuntu修改host不生效的问题",
        
          title: "Ubuntu修改Host不生效的问题",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/12/18/http/";
          
        },
      },{id: "post-ubuntu-http-请求",
        
          title: "Ubuntu Http 请求",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/12/14/host/";
          
        },
      },{id: "post-android使用tcpdump抓包",
        
          title: "android使用tcpdump抓包",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/12/06/unzip/";
          
        },
      },{id: "post-ubuntu下解压乱码的问题",
        
          title: "Ubuntu下解压乱码的问题",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/12/04/tcp/";
          
        },
      },{id: "post-tinker",
        
          title: "Tinker",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/11/29/tinker/";
          
        },
      },{id: "post-终端下完成tinker-sample的调试",
        
          title: "终端下完成Tinker Sample的调试",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/11/28/tinker-cn/";
          
        },
      },{id: "post-linux-unix下环境变量的配置",
        
          title: "Linux,Unix下环境变量的配置",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/11/17/adb/";
          
        },
      },{id: "post-android中常用的gradle命令",
        
          title: "Android中常用的Gradle命令",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/10/12/command-gradle/";
          
        },
      },{id: "post-android中遇到的一些问题",
        
          title: "Android中遇到的一些问题",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/10/05/android-question/";
          
        },
      },{id: "post-android开发中相见恨晚的网站",
        
          title: "Android开发中相见恨晚的网站",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/10/04/android-good-website/";
          
        },
      },{id: "post-编写易于删除-而不是易于扩展的代码",
        
          title: "编写易于删除，而不是易于扩展的代码",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/2016/03/09/write-code-that-is-easy-to-delete-not-easy-to/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
