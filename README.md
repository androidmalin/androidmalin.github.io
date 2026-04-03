# androidmalin.github.io

这个仓库已经重建为 `Jekyll + al-folio` 博客站点，部署目标是 GitHub Pages 用户站点：

- 线上地址：`https://androidmalin.github.io`
- 本地预览：Docker
- 主题：`https://github.com/alshedivat/al-folio`

## 目录约定

- `_posts/`：你的博客 Markdown 文章
- `_pages/`：站点页面
- `assets/`：图片、样式、脚本等静态资源
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署

## 先安装 Docker Desktop

你的机器现在没有 Docker。先安装 Docker Desktop for Mac（Apple Silicon）：

1. 打开 `https://docs.docker.com/desktop/setup/install/mac-install/`
2. 安装 Docker Desktop
3. 首次启动 Docker Desktop，等待状态变成 Running
4. 在终端确认：

```bash
docker --version
docker compose version
```

## 本地构建和预览

在仓库根目录执行：

```bash
docker compose pull
docker compose up
```

启动后访问：

```text
http://localhost:8080
```

如果你修改了 Markdown、页面或样式，容器会自动重新生成站点。

## 写文章

把原始 Markdown 放到 `_posts/`，文件名建议：

```text
_posts/2026-04-03-my-post.md
```

文章头部最小示例：

```yaml
---
layout: post
title: Android Studio 配置
date: 2026-04-03 20:00:00 +0800
description: 本文记录常用开发环境配置
tags: [android, studio]
categories: [android]
---
```

为了兼容你旧站的链接结构，站点 permalink 已改成：

```text
/:year/:month/:day/:title/
```

这意味着文章会发布为：

```text
/2026/04/03/my-post/
```

## 发布到 GitHub Pages

1. 把改动提交到 `master` 或 `main`
2. 打开 GitHub 仓库的 `Settings -> Actions -> General`
3. 将 `Workflow permissions` 改为 `Read and write permissions`
4. 打开 `Settings -> Pages`
5. 将发布分支设置为 `gh-pages`
6. 推送代码后，GitHub Actions 会自动构建并发布

部署工作流已经在仓库中：

```text
.github/workflows/deploy.yml
```

## 下一步建议

1. 安装 Docker Desktop
2. 把你的 Markdown 批量放进 `_posts/`
3. 把文章里的图片统一迁移到 `assets/img/` 或你自己的图床
4. 根据需要继续修改 `_config.yml`、首页文案和导航
