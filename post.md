# 新博客本地预览流程

本文记录在当前博客仓库中，新建一篇文章并使用 Docker 在本地预览的完整流程。

## 1. 启动本地预览环境

进入仓库目录：

```bash
cd /Users/malin/blog/androidmalin.github.io
```

检查预览服务是否已经启动：

```bash
docker compose ps
```

如果服务没有运行，启动本地预览：

```bash
docker compose up -d
```

如果之前遇到依赖不匹配或镜像问题，使用重建方式启动：

```bash
docker compose up --build -d
```

启动成功后，在浏览器打开：

```text
http://localhost:8080
```

## 2. 正确创建博客文章

新文章不能直接放在仓库根目录，例如 `new.md` 这种位置不会被当成博客文章。

博客文章必须放在 `_posts/` 目录下，并且文件名必须符合以下格式：

```text
_posts/YYYY-MM-DD-title.md
```

例如：

```text
_posts/2026-04-06-new.md
```

说明：

- `YYYY-MM-DD` 是文章日期
- `title` 是文章 slug，建议使用小写英文、数字和连字符

## 3. 写入文章头部信息

新建文章后，先写 front matter。可直接使用下面的模板：

```md
---
layout: post
title: "我的新文章"
date: 2026-04-06 10:00:00 +0800
description: "这是一篇用于本地预览测试的新文章。"
tags: [android, blog]
categories: [android]
---

这里开始写正文。

## 二级标题

这是正文内容。
```

说明：

- `layout` 必须是 `post`
- `title` 是文章标题
- `date` 建议写完整时间和时区
- `description` 会用于列表摘要或 SEO 信息
- `tags` 和 `categories` 可按需调整

## 4. 保存后自动预览

当前 Docker 预览模式支持自动重新生成页面。

你在 `_posts/2026-04-06-new.md` 中保存修改后，通常几秒内就会自动更新，不需要重新执行 `docker compose up`。

## 5. 预览入口

### 首页预览

当前仓库首页就是博客列表页，打开：

```text
http://localhost:8080/
```

你可以在首页查看新文章是否已经出现在文章列表中。

### 文章详情页预览

当前站点配置的文章永久链接格式为：

```text
/:year/:month/:day/:title/
```

所以如果文章文件名是：

```text
_posts/2026-04-06-new.md
```

则文章详情页通常为：

```text
http://localhost:8080/2026/04/06/new/
```

## 6. 如果预览没有更新

先查看日志：

```bash
cd /Users/malin/blog/androidmalin.github.io
docker compose logs -f
```

常见原因：

- 文件没有放在 `_posts/`
- 文件名不符合 `YYYY-MM-DD-title.md`
- YAML front matter 格式错误
- `date` 字段格式错误

## 7. 如果服务异常

可以重启容器：

```bash
docker compose down
docker compose up -d
```

如果仍然有问题，重建镜像：

```bash
docker compose down
docker compose up --build -d
```

## 8. 每次写新文章的推荐最短流程

```bash
cd /Users/malin/blog/androidmalin.github.io
docker compose up -d
```

然后创建文章文件：

```text
_posts/2026-04-06-new.md
```

写入 front matter 和正文，保存后访问：

```text
http://localhost:8080/
```

以及文章详情页：

```text
http://localhost:8080/2026/04/06/new/
```

## 9. 停止本地预览

不再需要预览时，执行：

```bash
docker compose down
```
