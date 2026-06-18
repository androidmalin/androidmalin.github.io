---
layout: post
title: "Now in Android 的 Hilt 组件依赖图"
date: 2026-06-04 00:00:00 +0800
tags: [android, hilt, dagger, scabbard]
---

> 本文用 [Scabbard](https://github.com/arunkumar9t2/scabbard) 为 [Now in Android](https://github.com/android/nowinandroid) 生成的 Hilt 组件依赖图,直接以交互形式嵌入。图由 Hilt 在编译期生成的组件源码导出,如实反映 `NiaApplication` 的组件层级与作用域关系。

## 组件层级总览

下面这张是**总览树**,展示了 NiA 中全部 Hilt 组件的父子关系与作用域。点击任意节点会在**新标签页**满屏打开该组件的完整依赖详情图。

<iframe id="nia-hilt-tree" src="{{ '/assets/html/nia-hilt-graph/tree_com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.SingletonC.html' | relative_url }}"
        title="NiA Hilt 组件层级总览"
        frameborder="0" scrolling="auto" loading="lazy"
        style="width: 100%; height: 600px; border: 1px solid #d0d7de; border-radius: 6px; display: block;"></iframe>

<script>
  // iframe 与本站同源,因此父页面可直接读取/操作其内容。
  (function () {
    var frame = document.getElementById("nia-hilt-tree");
    if (!frame) return;
    var hintCleanup = null;

    // 只在博客内嵌 iframe 中隐藏「返回博客」入口;独立打开总览图时仍然显示。
    function hideBackToBlogInFrame() {
      try {
        var doc = frame.contentWindow.document;
        var style = doc.getElementById("nia-hide-back-to-blog-style");
        if (!style) {
          style = doc.createElement("style");
          style.id = "nia-hide-back-to-blog-style";
          style.textContent = "#back-to-blog{display:none!important}";
          doc.head.appendChild(style);
        }
      } catch (e) {
        /* 忽略:隐藏失败不影响图的查看 */
      }
    }

    // 按真实内容高度自适应。树页面 body 设了 min-height:100vh,会让 scrollHeight 至少为一屏,
    // 所以先把它临时置 0(只改 iframe 内存中的 DOM)再测量。
    function fit() {
      try {
        var doc = frame.contentWindow.document;
        var html = doc.documentElement;
        var body = doc.body;
        html.style.height = "auto";
        if (body) {
          body.style.minHeight = "0";
          body.style.height = "auto";
        }
        var h = Math.max(html ? html.scrollHeight : 0, body ? body.scrollHeight : 0);
        if (h) frame.style.height = h + "px";
      } catch (e) {
        /* 理论上同源不会进这里;若读取失败则保留回退高度 */
      }
    }

    // 自动选中「@FragmentScoped 节点 → @ViewScoped 节点」那条连线。用语义匹配而非写死 edge 序号,
    // 重新生成图后仍然有效。派发 click 复用内嵌页自带的依赖链高亮逻辑。
    function autoSelectFragmentToView() {
      try {
        var doc = frame.contentWindow.document;
        var svg = doc.querySelector("svg");
        if (svg && svg.classList.contains("has-active")) return;
        var scopeOf = {};
        doc.querySelectorAll("g.node").forEach(function (node) {
          var title = node.querySelector("title");
          if (title) scopeOf[title.textContent] = node.textContent;
        });
        var edges = doc.querySelectorAll("g.edge");
        for (var i = 0; i < edges.length; i++) {
          var title = edges[i].querySelector("title");
          if (!title) continue;
          var ends = title.textContent.split("->");
          if (ends.length !== 2) continue;
          var src = scopeOf[ends[0]] || "";
          var dst = scopeOf[ends[1]] || "";
          if (src.indexOf("FragmentScoped") !== -1 && dst.indexOf("ViewScoped") !== -1) {
            edges[i].dispatchEvent(
              new frame.contentWindow.MouseEvent("click", { bubbles: true, cancelable: true }),
            );
            return;
          }
        }
      } catch (e) {
        /* 忽略:选中失败不影响图本身的查看 */
      }
    }

    // 新生成的 SVG 可能不再给节点链接保留 target="_blank";在博客 iframe 内统一恢复
    // 「点击组件节点在新标签页打开详情图」的行为。
    function openTreeNodesInNewTabs() {
      try {
        var doc = frame.contentWindow.document;
        var baseUrl = frame.contentWindow.location.href;
        doc.querySelectorAll("g.node a").forEach(function (anchor) {
          var href =
            anchor.getAttribute("href") ||
            anchor.getAttribute("xlink:href") ||
            anchor.getAttributeNS("http://www.w3.org/1999/xlink", "href");
          if (!href) return;

          anchor.setAttribute("target", "_blank");
          anchor.setAttribute("rel", "noopener");
          if (anchor.getAttribute("data-nia-new-tab-bound") === "true") return;
          anchor.setAttribute("data-nia-new-tab-bound", "true");
          anchor.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            var opened = window.open(new URL(href, baseUrl).href, "_blank", "noopener");
            if (opened) opened.opener = null;
          });
        });
      } catch (e) {
        /* 忽略:链接降级为 iframe 内默认跳转 */
      }
    }

    // 首次进入(iframe 内)时:在 SingletonC 上方悬浮动态小手,并在若干节点旁浮出
    // 「点击查看详情」气泡(可逐节点指定 left/right/above 方位),引导用户点击。
    function showClickHint() {
      try {
        var doc = frame.contentWindow.document;
        var win = frame.contentWindow;
        if (doc.body.getAttribute("data-nia-hints-dismissed") === "true") return;
        if (hintCleanup) hintCleanup();

        // 每个节点的气泡方位;SingletonC 额外带小手。
        var bubbleConfig = {
          SingletonC: "right",
          ActivityRetainedC: "left",
          ActivityC: "left",
          ViewModelC: "right",
          FragmentC: "above",
        };
        var handName = "SingletonC";

        // 节点类名 = 该节点最后一个 <text>;精确匹配,避免 FragmentC 误中 ViewWithFragmentC。
        var byName = {};
        var nodes = doc.querySelectorAll("g.node");
        for (var i = 0; i < nodes.length; i++) {
          var texts = nodes[i].querySelectorAll("text");
          if (!texts.length) continue;
          byName[texts[texts.length - 1].textContent.trim()] = nodes[i];
        }

        if (!doc.getElementById("nia-hint-style")) {
          var style = doc.createElement("style");
          style.id = "nia-hint-style";
          style.textContent =
            "@keyframes nia-hint-bob{0%,100%{transform:translateY(-10px)}50%{transform:translateY(3px)}}" +
            "@keyframes nia-hint-in{from{opacity:0}to{opacity:1}}" +
            ".nia-click-hint{position:fixed;z-index:99999;pointer-events:none;animation:nia-hint-in .3s ease both}" +
            ".nia-click-hint span{display:block;font-size:52px;line-height:1;filter:drop-shadow(0 3px 4px rgba(0,0,0,.4));animation:nia-hint-bob 1s ease-in-out infinite}" +
            ".nia-hint-bubble{position:fixed;z-index:99999;pointer-events:none;background:#0969da;color:#fff;font-size:13px;font-weight:600;padding:6px 11px;border-radius:8px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.28);animation:nia-hint-in .3s ease both}" +
            ".nia-hint-bubble::after{content:'';position:absolute;border-style:solid}" +
            ".nia-hint-bubble.side-right::after{left:-6px;top:50%;margin-top:-5px;border-width:5px 6px 5px 0;border-color:transparent #0969da transparent transparent}" +
            ".nia-hint-bubble.side-left::after{right:-6px;top:50%;margin-top:-5px;border-width:5px 0 5px 6px;border-color:transparent transparent transparent #0969da}" +
            ".nia-hint-bubble.side-above::after{left:50%;margin-left:-5px;bottom:-6px;border-width:6px 5px 0 5px;border-color:#0969da transparent transparent transparent}";
          doc.head.appendChild(style);
        }

        // 收集所有悬浮元素及其锚点节点,统一定位/移除。
        var items = [];

        if (byName[handName]) {
          var hand = doc.createElement("div");
          hand.className = "nia-click-hint";
          hand.innerHTML = "<span>👇</span>";
          doc.body.appendChild(hand);
          items.push({ el: hand, target: byName[handName], kind: "hand" });
        }

        Object.keys(bubbleConfig).forEach(function (name) {
          if (!byName[name]) return;
          var side = bubbleConfig[name];
          var bubble = doc.createElement("div");
          bubble.className = "nia-hint-bubble side-" + side;
          bubble.textContent = "点击查看详情";
          doc.body.appendChild(bubble);
          items.push({ el: bubble, target: byName[name], kind: "bubble", side: side });
        });

        if (!items.length) return;

        function place() {
          items.forEach(function (item) {
            var r = item.target.getBoundingClientRect();
            var s = item.el.style;
            if (item.kind === "hand") {
              s.left = r.left + r.width / 2 + "px";
              s.top = r.top + "px";
              s.transform = "translate(-50%, -100%)";
            } else if (item.side === "left") {
              s.left = r.left - 12 + "px";
              s.top = r.top + r.height / 2 + "px";
              s.transform = "translate(-100%, -50%)";
            } else if (item.side === "above") {
              s.left = r.left + r.width / 2 + "px";
              s.top = r.top - 10 + "px";
              s.transform = "translate(-50%, -100%)";
            } else {
              s.left = r.right + 12 + "px";
              s.top = r.top + r.height / 2 + "px";
              s.transform = "translateY(-50%)";
            }
          });
        }
        place();

        function dismiss() {
          items.forEach(function (item) {
            if (item.el && item.el.parentNode) item.el.parentNode.removeChild(item.el);
          });
          items = [];
          win.removeEventListener("resize", place);
          window.removeEventListener("resize", place);
          doc.removeEventListener("click", onDocClick, true);
          if (hintCleanup === dismiss) hintCleanup = null;
        }
        // 仅当用户在 iframe 内实际停留并点击节点时才移除提示;打开新标签页的节点链接会保留提示。
        function onDocClick(event) {
          var t = event.target;
          if (!t || !t.closest || !t.closest("g.node")) return;
          if (t.closest("g.node a")) return;
          doc.body.setAttribute("data-nia-hints-dismissed", "true");
          dismiss();
        }
        doc.addEventListener("click", onDocClick, true);
        win.addEventListener("resize", place);
        window.addEventListener("resize", place);
        hintCleanup = dismiss;
      } catch (e) {
        /* 悬浮提示失败不影响图的查看 */
      }
    }

    function onReady() {
      hideBackToBlogInFrame();
      fit();
      openTreeNodesInNewTabs();
      autoSelectFragmentToView();
      showClickHint();
    }

    frame.addEventListener("load", onReady);
    window.addEventListener("resize", fit);
    window.addEventListener("pageshow", onReady);
    window.addEventListener("focus", onReady);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) onReady();
    });
    if (frame.contentDocument && frame.contentDocument.readyState === "complete") onReady();
  })();
</script>

<p style="text-align: right; margin: 6px 0 0; font-size: 0.9em; color: #57606a;">
  想要更大视野?<a href="{{ '/assets/html/nia-hilt-graph/tree_com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.SingletonC.html' | relative_url }}" target="_blank" rel="noopener">↗ 在新标签页全屏打开</a>,可自由缩放滚动。
</p>

## 怎么看这张图

- **节点**:每个方框是一个 Hilt 组件,上方标注其作用域注解(如 `@Singleton`、`@ActivityRetainedScoped`、`@ViewModelScoped` 等)。
- **连线方向**:箭头表示父组件 → 子组件的派生关系。
- **交互**:点击任意连线会高亮它所在的**完整依赖链**(上游调用方 + 下游依赖);实心脉冲的那条是当前锚点。点其他连线可换锚点,点空白处清除高亮。
- **下钻**:点节点跳到对应组件(如 `SingletonC`、`ViewModelC`)的详情图,查看该组件内部的具体绑定与提供者。

## 各组件详情图直达

`SingletonC`、`ViewModelC` 等组件的详情图较大,在上方内嵌窗口里会偏小。下面的链接会在新标签页以满屏方式打开对应大图(可自由缩放滚动):

<ul>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.SingletonC.html' | relative_url }}" target="_blank" rel="noopener">SingletonC(@Singleton)</a></li>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.ActivityRetainedC.html' | relative_url }}" target="_blank" rel="noopener">ActivityRetainedC(@ActivityRetainedScoped)</a></li>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.ServiceC.html' | relative_url }}" target="_blank" rel="noopener">ServiceC(@ServiceScoped)</a></li>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.ActivityC.html' | relative_url }}" target="_blank" rel="noopener">ActivityC(@ActivityScoped)</a></li>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.ViewModelC.html' | relative_url }}" target="_blank" rel="noopener">ViewModelC(@ViewModelScoped)</a></li>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.FragmentC.html' | relative_url }}" target="_blank" rel="noopener">FragmentC(@FragmentScoped)</a></li>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.ViewC.html' | relative_url }}" target="_blank" rel="noopener">ViewC(@ViewScoped)</a></li>
  <li><a href="{{ '/assets/html/nia-hilt-graph/com.google.samples.apps.nowinandroid.NiaApplication_HiltComponents.ViewWithFragmentC.html' | relative_url }}" target="_blank" rel="noopener">ViewWithFragmentC(@ViewScoped)</a></li>
</ul>

## 作用域层级速记

NiA 的组件层级从上到下依次是:

```
SingletonC (@Singleton)
└── ActivityRetainedC (@ActivityRetainedScoped)
    ├── ServiceC (@ServiceScoped)
    ├── ActivityC (@ActivityScoped)
    └── ViewModelC (@ViewModelScoped)
        ├── FragmentC (@FragmentScoped)
        │   └── ViewWithFragmentC (@ViewScoped)
        └── ViewC (@ViewScoped)
```

越靠上的组件生命周期越长、可见范围越大;子组件能注入父组件提供的所有绑定,反之不行。这也是排查「为什么这个依赖在这里注入不到」时的第一张参考图。
