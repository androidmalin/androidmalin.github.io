---
layout: post
title: "单链表反转：迭代与递归实现及可视化"
date: 2026-06-17 08:00:00 +0800
tags: [algorithm, linked-list, kotlin]
---

单链表反转是面试与算法学习中最经典的问题之一。它看似简单，却很好地考察了对**指针操作**和**引用关系**的理解。本文介绍两种最常用的实现方式：空间复杂度为 `O(1)` 的**双指针迭代法**，以及代码更简洁、但借助函数调用栈的**递归法**。文中分别附上了两种方法的交互式可视化演示。

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

反转链表的关键，是在遍历过程中**逐个断开当前节点与其原后继节点的链接，再把它指向前驱节点**。为了做到不断链，我们需要两个指针协同移动，并用一个临时变量保存下一个节点：

| 指针   | 含义                                           |
| ------ | ---------------------------------------------- |
| `prev` | 前驱节点，初始为 `null`                        |
| `curr` | 当前正在处理的节点                             |
| `next` | 临时保存 `curr.next`，防止断链后找不到后续节点 |

每轮循环做四件事：

1. 先用 `next` 保存 `curr.next`；
2. 将 `curr.next` 指向 `prev`，完成当前节点的反转；
3. `prev` 前移到 `curr`；
4. `curr` 前移到 `next`。

当 `curr == null` 时遍历结束，`prev` 就是新链表的头节点。

## 3. 图形记忆法：把代码和图画绑定

每次写代码前，先在草稿纸上画这张图：

```text
  已经反转好的部分          当前节点          还没处理的部分
   null ← ... ← prev        curr ──→         next ──→ ...
```

然后代码就是：

1. `next = curr.next` → 先把右边截下来
2. `curr.next = prev` → 把当前节点挂到左边
3. `prev = curr` → 左边界往右扩
4. `curr = next` → 当前节点往右移

## 4. 迭代实现（Kotlin）

```kotlin
fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var curr = head

    while (curr != null) {
        val next = curr.next       // ① 先保存下一个，防止断链
        curr.next = prev           // ② 当前节点指向前驱
        prev = curr                // ③ prev 前移
        curr = next                // ④ curr 前移
    }

    return prev                    // prev 即新头节点
}
```

## 5. 可视化演示：双指针迭代

下面的交互页面展示了 `prev`、`curr` 两个指针以及 `next` 临时变量在每一步的位置变化。点击「下一步」可以逐步观察链表是如何被反转的。

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

## 6. 递归实现

递归法的核心思想是**先递后归**：把反转除头节点以外子链表的任务交给递归函数，然后处理当前节点和下一个节点之间的指针关系。

### 6.1 核心思路

1. **基准情况**：如果链表为空或只有一个节点，直接返回该节点，它本身就是反转后的新头节点。
2. **递归下沉**：调用 `reverseList(head.next)`，假设它能正确反转从 `head.next` 开始的后半部分，并返回新头节点 `newHead`。
3. **回升时反转指针**：
   - 让原后继节点指向当前节点：`head.next.next = head`
   - 断开当前节点原来指向后继的链接：`head.next = null`
4. **返回新头节点**：每一层都把 `newHead` 继续向上返回。

以一个四层链表 `A → B → C → D` 为例，递归过程如下：

- 先不断下沉：`reverseList(A)` → `reverseList(B)` → `reverseList(C)` → `reverseList(D)`
- 到达 `D` 时触发基准情况，返回 `D` 作为 `newHead`
- 回到 `C` 层：`D.next = C`，`C.next = null`，返回 `D`
- 回到 `B` 层：`C.next = B`，`B.next = null`，返回 `D`
- 回到 `A` 层：`B.next = A`，`A.next = null`，返回 `D`

最终得到 `D → C → B → A`。

### 6.2 图形记忆法

递归法可以画成一条「先向下钻、再向上弹」的曲线：

```text
递： A → B → C → D  （不断进入下一层，直到基准情况）
归： A ← B ← C ← D  （每层回来时反转相邻两个节点的指针）
```

记住两个关键操作：

- `head.next.next = head`：让「后面那个节点」回头指向「当前节点」
- `head.next = null`：断开当前节点原来指向后继的链接

### 6.3 完整代码（Java）

为了与下方递归可视化演示中的代码保持一致，这里用 Java 实现：

```java
public ListNode reverseList(ListNode head) {
    // 基准情况：空链表或只有一个节点
    if (head == null || head.next == null) return head;

    ListNode newHead = reverseList(head.next);  // ① 递归反转后续链表
    head.next.next = head;                       // ② 让后继节点指回当前节点
    head.next = null;                            // ③ 断开当前节点原来指向后继的链接

    return newHead;                              // ④ 把新头节点逐层返回
}
```

### 6.4 复杂度分析

- **时间复杂度**：`O(n)`，每个节点只被访问一次。
- **空间复杂度**：`O(n)`，递归调用栈的深度等于链表长度。

## 7. 迭代法与递归法对比

| 维度       | 双指针迭代       | 递归                   |
| ---------- | ---------------- | ---------------------- |
| 代码量     | 稍多             | 更简洁                 |
| 空间复杂度 | `O(1)`           | `O(n)`（调用栈）       |
| 是否易理解 | 需要跟踪多个指针 | 依赖「先递后归」的思维 |
| 适用场景   | 长链表、内存敏感 | 代码简洁优先、链表不长 |

## 8. 可视化演示：递归反转

下面的交互页面展示了递归调用栈如何「先下沉、再回升」，并在回升过程中逐层反转相邻节点的指针。注意观察右侧调用栈的变化，以及 `head` 和 `newHead` 两个指针的位置。

<iframe
  id="ll-vis-recursive"
  src="{{ site.baseurl }}/assets/html/linked-list-reverse-recursive-visualization.html"
  width="100%"
  height="1050"
  scrolling="no"
  style="border:1px solid #d0d7de; border-radius:8px; overflow:hidden;"
  title="递归反转单链表可视化">
</iframe>

<script>
window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'll-vis-recursive-height') {
        var iframe = document.getElementById('ll-vis-recursive');
        if (iframe) {
            iframe.style.height = e.data.height + 'px';
        }
    }
});
</script>

如果 iframe 无法加载，也可以直接打开页面：

{% if jekyll.environment == "production" %}
<a href="https://androidmalin.com/assets/html/linked-list-reverse-recursive-visualization.html" target="_blank" rel="noopener noreferrer">https://androidmalin.com/assets/html/linked-list-reverse-recursive-visualization.html</a>
{% else %}
<a href="http://localhost:8080/assets/html/linked-list-reverse-recursive-visualization.html" target="_blank" rel="noopener noreferrer">http://localhost:8080/assets/html/linked-list-reverse-recursive-visualization.html</a>
{% endif %}

## 9. 小结

- 双指针法是反转单链表最标准的迭代写法，空间复杂度为 `O(1)`，适合对内存敏感或链表较长的场景。
- 递归法代码更短，核心在于「先递后归」：先把问题抛给更深层，返回时让后继节点指回当前节点，再断开当前节点原来的正向指针。
- 保存 `curr.next`（迭代）与「让后继指回当前节点、再断开当前节点的原正向指针」（递归）是防止断链的关键。
- 熟练掌握这两种写法后，诸如「反转前 k 个节点」「K 个一组反转」等变形题也会更容易理解。
