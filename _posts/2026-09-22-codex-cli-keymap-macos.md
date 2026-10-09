---
layout: post
title: "Codex CLI 快捷键参考（macOS）"
date: 2026-09-22
description: "面向 macOS 的 Codex CLI 快捷键参考，涵盖光标移动、文本编辑、会话交互、分页浏览、Vim 模式与自定义绑定。"
tags: [ai, codex, cli, macos]
categories: [ai]
toc:
  beginning: true
---

> 基于 Codex CLI TUI 默认 keymap（readline / Emacs 风格）。  
> macOS 上：`Ctrl` 为主修饰键；文档中的 `Alt` / `Option` 对应 **⌥ Option**。  
> 终端里多数快捷键用 **Ctrl**，不是 **Cmd**。

## 官方文档

| 内容 | 链接 |
|------|------|
| Interactive shortcuts | https://developers.openai.com/codex/cli/reference |
| `/keymap` 与斜杠命令 | https://developers.openai.com/codex/cli/slash-commands |
| `tui.keymap` 配置参考 | https://developers.openai.com/codex/config-reference |
| 配置示例 | https://developers.openai.com/codex/config-sample |
| 默认绑定源码 | https://github.com/openai/codex/blob/main/codex-rs/tui/src/keymap.rs |

会话内也可按 `?` 查看提示，或运行 `/keymap` 查看 / 改绑。

---

## 输入前缀

| 输入 | 作用 |
|------|------|
| `/` | 打开斜杠命令菜单 |
| `@` | 模糊搜索工作区文件并插入路径 |
| `!` | 在当前审批/沙箱设置下执行本地 shell 命令 |

---

## 光标移动（Editor）

| 快捷键 | 作用 |
|--------|------|
| `←` / `Ctrl+B` | 左移一个字符 |
| `→` / `Ctrl+F` | 右移一个字符 |
| `↑` / `Ctrl+P` | 上一行 / 历史草稿 |
| `↓` / `Ctrl+N` | 下一行 / 历史草稿 |
| `Ctrl+A` / `Home` | 跳到行首 |
| `Ctrl+E` / `End` | 跳到行尾 |
| `Option+B` / `Option+←` / `Ctrl+←` | 按词左移 |
| `Option+F` / `Option+→` / `Ctrl+→` | 按词右移 |

---

## 删除 / 剪切 / 粘贴（Editor）

| 快捷键 | 作用 |
|--------|------|
| `Backspace` / `Ctrl+H` | 删除前一个字符 |
| `Delete` / `Ctrl+D` | 删除后一个字符 |
| `Ctrl+W` / `Option+Backspace` / `Ctrl+Backspace` | 删除前一个词 |
| `Option+D` / `Option+Delete` / `Ctrl+Delete` | 删除后一个词 |
| `Ctrl+U` | 删除到行首（kill to line start） |
| `Ctrl+K` | 删除到行尾（kill to line end） |
| `Ctrl+Y` | 粘贴刚剪切的内容（yank） |

**整行删除：** 默认未绑定 `kill_whole_line`。常用做法：

1. `Ctrl+A` → `Ctrl+K`
2. 或 `Ctrl+U` + `Ctrl+K`
3. 或用 `/keymap` 为 `kill_whole_line` 自行绑定

**换行（多行输入）：** `Ctrl+J` / `Ctrl+M` / `Shift+Enter` / `Option+Enter`（具体以终端是否透传为准）

---

## Composer / 会话交互

| 快捷键 | 作用 |
|--------|------|
| `Enter` | 发送提示；若 Codex 正在运行，则注入当前回合 |
| `Tab` | Codex 运行中时，排队下一条提示/命令 |
| `Ctrl+R` | 搜索历史提示（上一条匹配） |
| `Ctrl+S` | 搜索历史提示（下一条匹配） |
| `?` | 切换快捷键提示 overlay |
| `Ctrl+G` | 用外部编辑器打开当前草稿（`$VISUAL` / `$EDITOR`） |
| `Ctrl+T` | 打开 transcript overlay |
| `Ctrl+O` | 复制最近一次完整 Codex 输出（也可用 `/copy`） |
| `Ctrl+L` | 清屏（不清对话；与 `/clear` 不同） |
| `Esc` | 中断当前回合 |
| `Esc` 两次（输入框为空） | 编辑上一条用户消息并 fork |
| `Ctrl+C` | 退出会话（也可用 `/exit`） |
| `Option+R` | 切换 raw scrollback（便于复制 transcript） |

### 推理强度 / 队列编辑

| 快捷键 | 作用 |
|--------|------|
| `Option+,` / `Shift+↓` | 降低 reasoning effort |
| `Option+.` / `Shift+↑` | 提高 reasoning effort |
| `Option+↑` / `Shift+←` | 编辑已排队消息 |

---

## Pager（分页 / transcript 浏览）

| 快捷键 | 作用 |
|--------|------|
| `↑` / `k` | 上滚 |
| `↓` / `j` | 下滚 |
| `PageUp` / `Shift+Space` / `Ctrl+B` | 上一页 |
| `PageDown` / `Space` / `Ctrl+F` | 下一页 |
| `Ctrl+U` | 上半页 |
| `Ctrl+D` | 下半页 |
| `Home` | 跳到顶部 |
| `End` | 跳到底部 |
| `q` / `Ctrl+C` | 关闭 |
| `Ctrl+T` | 关闭 transcript |

---

## Vim 模式（可选）

默认未绑定「切换 Vim 模式」快捷键（`toggle_vim_mode` 为空）。开启 Vim 模式后，常见绑定包括：

| 按键 | 作用 |
|------|------|
| `i` | 进入插入 |
| `a` / `A` | 光标后 / 行尾追加 |
| `I` | 行首插入 |
| `o` / `O` | 下方 / 上方新开一行 |
| `h` `j` `k` `l` | 左右上下 |
| `w` `b` `e` | 词前进 / 后退 / 词尾 |
| `0` / `$` | 行首 / 行尾 |
| `x` | 删除字符 |
| `D` / `C` | 删到行尾 / 改到行尾 |
| `d` `y` `c` | 删除 / 复制 / 修改操作符（再跟 motion，如 `dd`） |
| `p` | 粘贴 |
| `Esc` | 取消 operator / 回 normal |

可用 `/keymap` 为 `toggle_vim_mode` 绑定快捷键。

---

## 自定义绑定

### 会话内

1. 输入 `/keymap`
2. 选择 context 与 action
3. 输入新绑定，或清空以解除绑定

改动会写入 `~/.codex/config.toml` 的 `[tui.keymap]`。

### 配置文件示例

```toml
[tui.keymap.global]
open_transcript = "ctrl-t"
open_external_editor = "ctrl-g"

[tui.keymap.composer]
submit = ["enter", "ctrl-m"]

[tui.keymap.editor]
# 为「删除整行」自行绑定，例如：
# kill_whole_line = "ctrl-shift-u"

[tui.keymap.chat]
interrupt_turn = "esc"
```

键名格式示例：`ctrl-a`、`alt-b`、`shift-enter`、`page-down`。  
`[]` 表示解除该 action 的绑定。

---

## macOS 终端注意点

1. **Option 作 Meta：** 若 `Option+B` / `Option+F` 无效，在 Terminal / iTerm 中将 Left Option 设为 Meta / Esc+。
2. **Cmd 多数无效：** TUI 走终端控制序列，请优先用 Ctrl。
3. **`Ctrl+L` vs `/clear`：** `Ctrl+L` 只清视图；`/clear` 会开新对话。
4. **版本差异：** 默认绑定可能随 Codex 版本变化；以会话内 `/keymap` 或当前源码为准。

---

## 常用速查

| 我想… | 按… |
|--------|-----|
| 跳到行首 | `Ctrl+A` |
| 跳到行尾 | `Ctrl+E` |
| 删到行尾 | `Ctrl+K` |
| 删到行首 | `Ctrl+U` |
| 尽量删整行 | `Ctrl+A` 再 `Ctrl+K` |
| 删前一个词 | `Ctrl+W` |
| 外部编辑器 | `Ctrl+G` |
| 搜历史 | `Ctrl+R` |
| 看快捷键提示 | `?` |
| 改快捷键 | `/keymap` |
