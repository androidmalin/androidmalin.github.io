---
layout: post
title: "单链表反转：双指针迭代法的实现与可视化"
date: 2026-06-17 08:00:00 +0800
tags: [algorithm, linked-list, kotlin]
---

单链表反转是面试与算法学习中最经典的问题之一。它看似简单，却很好地考察了对**指针操作**和**引用关系**的理解。本文介绍一种最常用、最直观的迭代实现：双指针法，并在文末附上一个可交互的可视化演示。

## 1. 问题描述

给定一个单链表的头节点 `head`，要求将其整体反转，并返回新的头节点。

例如：

```text
原始: A -> B -> C -> D -> null
反转: D -> C -> B -> A -> null
```

单链表节点的定义通常如下（Kotlin）：

```kotlin
class ListNode(var value: Int) {
    var next: ListNode? = null
}
```

## 2. 核心思路：双指针迭代

反转链表的关键，是在遍历过程中**逐个断开当前节点与原 next 的链接，再把它指向前驱节点**。为了做到不断链，我们需要两个指针协同移动，并用一个临时变量保存下一个节点：

| 指针 | 含义 |
|------|------|
| `prev` | 前驱节点，初始为 `null` |
| `curr` | 当前正在处理的节点 |
| `nextTemp` | 临时保存 `curr.next`，防止断链后找不到后续节点 |

每轮循环做四件事：

1. 先用 `nextTemp` 保存 `curr.next`；
2. 将 `curr.next` 指向 `prev`，完成当前节点的反转；
3. `prev` 前移到 `curr`；
4. `curr` 前移到 `nextTemp`。

当 `curr == null` 时遍历结束，`prev` 就是新链表的头节点。

## 3. 完整代码（Kotlin）

```kotlin
fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var curr = head

    while (curr != null) {
        val nextTemp = curr.next   // ① 先保存下一个，防止断链
        curr.next = prev           // ② 当前节点指向前驱
        prev = curr                // ③ prev 前移
        curr = nextTemp            // ④ curr 前移
    }

    return prev                    // prev 即新头节点
}
```

## 4. 复杂度分析

- **时间复杂度**：`O(n)`，每个节点只被访问一次。
- **空间复杂度**：`O(1)`，仅使用两个指针变量和一个临时变量，没有额外数据结构。

## 5. 可视化演示

下面的交互页面展示了 `prev`、`curr` 两个指针以及 `nextTemp` 临时变量在每一步的位置变化。点击「下一步」可以逐步观察链表是如何被反转的。

<iframe
  id="ll-vis"
  src="{{ site.baseurl }}/assets/html/linked-list-reverse-visualization.html"
  width="100%"
  height="1050"
  scrolling="no"
  style="border:1px solid #d0d7de; border-radius:8px; overflow:hidden;"
  title="单链表反转可视化">
</iframe>

<script>
window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'll-vis-height') {
        var iframe = document.getElementById('ll-vis');
        if (iframe) {
            iframe.style.height = e.data.height + 'px';
        }
    }
});
</script>

如果 iframe 无法加载，也可以直接打开页面：

{% if jekyll.environment == "production" %}
<a href="https://androidmalin.com/assets/html/linked-list-reverse-visualization.html" target="_blank" rel="noopener noreferrer">https://androidmalin.com/assets/html/linked-list-reverse-visualization.html</a>
{% else %}
<a href="http://localhost:8080/assets/html/linked-list-reverse-visualization.html" target="_blank" rel="noopener noreferrer">http://localhost:8080/assets/html/linked-list-reverse-visualization.html</a>
{% endif %}

## 6. 小结

- 双指针法是反转单链表最标准的迭代写法，空间复杂度为 `O(1)`。
- 保存 `curr.next` 是防止断链的关键步骤，初学者最容易在这里出错。
- 熟练掌握这个模式后，诸如「反转前 k 个节点」「K 个一组反转」等变形题也会更容易理解。

---

**参考代码语言**：Kotlin  
**难度**：简单  
**标签**：链表、双指针、迭代
