(() => {
  // Same lamp as scroll-ball.js: it hangs LAMP px above the cursor, its slant is capped at SLANT,
  // and without a cursor it shines from LIGHT = (-0.45, -0.55, -0.7), i.e. the CSS defaults for --lx/--ly.
  const LAMP = 240;
  const SLANT = 1.4;
  const LIT =
    "#navbar > .container, #back-to-top, .ball__settings-trigger, .ball__settings, .post-list > li, .featured-posts .card, .pagination .page-link";
  const SHEEN = "#navbar > .container, #back-to-top, .post-list > li, .featured-posts .card, .pagination .page-link";
  const STOPS = ".navbar-nav .nav-item > .nav-link, #search-toggle .nav-link, #light-toggle";
  // Edge refraction: [selector, bezel width, displacement scale]. The scale is twice the largest shift, in px.
  const LENSES = [
    ["#navbar > .container", 20, 28],
    ["#back-to-top", 14, 18],
    [".ball__settings-trigger", 10, 12],
  ];
  const SETTLE = 160;
  const PROFILE = 128;
  const IOR = 1.5;
  const SVG = "http://www.w3.org/2000/svg";

  const moving = matchMedia("(prefers-reduced-motion: no-preference)");
  const hovering = matchMedia("(hover: hover) and (pointer: fine)");
  const plain = matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)");
  const wide = matchMedia("(min-width: 576px)");
  // Only Chromium can feed an SVG filter to backdrop-filter, and WebKit drops the whole chain when it meets url().
  const refracting = "userAgentData" in navigator;

  const capsule = document.querySelector("#navbar > .container");
  const drop = document.createElement("span");

  let pointer = null;
  let hovered = null;
  let frame = 0;
  let listeners = null;
  let current = null;
  let svg = null;
  let observer = null;
  let profile = null;
  const lenses = [];

  function shade() {
    frame = 0;
    const items = [...document.querySelectorAll(LIT)];
    const boxes = items.map((item) => item.getBoundingClientRect());
    items.forEach((item, i) => {
      if (!pointer) {
        item.style.removeProperty("--lx");
        item.style.removeProperty("--ly");
        return;
      }
      const { left, top, width, height } = boxes[i];
      const x = (left + width / 2 - pointer[0]) / LAMP;
      const y = (top + height / 2 - pointer[1]) / LAMP;
      const reach = Math.max(1, Math.hypot(x, y) / SLANT);
      item.style.setProperty("--lx", (x / reach).toFixed(3));
      item.style.setProperty("--ly", (y / reach).toFixed(3));
      if (item === hovered) {
        item.style.setProperty("--px", `${(pointer[0] - left).toFixed(1)}px`);
        item.style.setProperty("--py", `${(pointer[1] - top).toFixed(1)}px`);
      }
    });
  }

  function schedule() {
    frame ||= requestAnimationFrame(shade);
  }

  function follow(event) {
    if (event.pointerType !== "mouse") return;
    pointer = [event.clientX, event.clientY];
    hovered = event.target instanceof Element ? event.target.closest(SHEEN) : null;
    schedule();
  }

  function forget() {
    pointer = null;
    hovered = null;
    schedule();
  }

  // Light the glass up under a finger too, where nothing follows the pointer.
  function press(event) {
    const target = event.target instanceof Element && event.target.closest(SHEEN);
    if (!target) return;
    const { left, top } = target.getBoundingClientRect();
    target.style.setProperty("--px", `${(event.clientX - left).toFixed(1)}px`);
    target.style.setProperty("--py", `${(event.clientY - top).toFixed(1)}px`);
  }

  function startLamp() {
    if (listeners) return;
    listeners = new AbortController();
    const { signal } = listeners;
    addEventListener("pointermove", follow, { passive: true, signal });
    document.documentElement.addEventListener("pointerleave", forget, { signal });
    addEventListener("scroll", () => pointer && schedule(), { passive: true, signal });
    addEventListener("resize", () => pointer && schedule(), { signal });
  }

  function stopLamp() {
    if (!listeners) return;
    listeners.abort();
    listeners = null;
    forget();
  }

  function updateLamp() {
    if (moving.matches && hovering.matches) startLamp();
    else stopLamp();
  }

  function stop(node) {
    return node instanceof Element ? node.closest(STOPS) : null;
  }

  function home() {
    return capsule.querySelector(".nav-item.active > .nav-link");
  }

  function place(target, instant = false) {
    const moved = target !== current;
    current = target;
    const rect = target?.getBoundingClientRect();
    if (!wide.matches || !rect?.width || !rect.height) {
      drop.classList.remove("glass__drop--shown");
      return;
    }
    const box = capsule.getBoundingClientRect();
    const appearing = !drop.classList.contains("glass__drop--shown");
    if (appearing || instant) drop.classList.add("glass__drop--instant");
    drop.style.setProperty("--drop-x", `${(rect.left - box.left).toFixed(1)}px`);
    drop.style.setProperty("--drop-y", `${(rect.top - box.top).toFixed(1)}px`);
    drop.style.setProperty("--drop-w", `${rect.width.toFixed(1)}px`);
    drop.style.setProperty("--drop-h", `${rect.height.toFixed(1)}px`);
    drop.classList.add("glass__drop--shown");
    if (appearing || instant) {
      drop.offsetWidth; // Commit the jump before the transitions come back.
      requestAnimationFrame(() => drop.classList.remove("glass__drop--instant"));
    } else if (moved && moving.matches) {
      drop.animate({ scale: ["1", "1.12 0.9", "1"] }, { duration: 420, easing: "ease-out" });
    }
  }

  function setupDrop() {
    if (!capsule) return;
    drop.className = "glass__drop";
    drop.setAttribute("aria-hidden", "true");
    capsule.prepend(drop);
    capsule.classList.add("glass__capsule");
    capsule.addEventListener("pointerover", (event) => {
      const target = stop(event.target);
      if (target) place(target);
    });
    capsule.querySelector(".navbar-nav")?.addEventListener("pointerleave", () => place(home()));
    capsule.addEventListener("focusin", (event) => {
      const target = stop(event.target);
      if (target && event.target.matches(":focus-visible")) place(target);
    });
    capsule.addEventListener("focusout", (event) => {
      if (!capsule.contains(event.relatedTarget)) place(home());
    });
    capsule.addEventListener("pointerdown", (event) => {
      if (stop(event.target)) drop.classList.add("glass__drop--pressed");
    });
    for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
      capsule.addEventListener(type, () => drop.classList.remove("glass__drop--pressed"));
    }
    new ResizeObserver(() => place(current, true)).observe(capsule);
    document.fonts.ready.then(() => place(current, true));
    wide.addEventListener("change", () => place(home(), true));
    place(home(), true);
  }

  function node(name, attributes) {
    const element = document.createElementNS(SVG, name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  }

  // Lateral shift through a round bezel, h(u) = sqrt(1 - (1 - u)^2), refracted at IOR, sampled from the rim
  // (u = 0) inward and normalized to its peak. A squircle bezel bends only the outermost pixels, which the frost
  // then washes out.
  function lensProfile() {
    if (profile) return profile;
    profile = new Float32Array(PROFILE);
    let peak = 0;
    for (let i = 0; i < PROFILE; i++) {
      const rest = 1 - (i + 0.5) / PROFILE;
      const lift = Math.sqrt(1 - rest ** 2);
      const tilt = Math.atan(rest / lift);
      profile[i] = lift * Math.tan(tilt - Math.asin(Math.sin(tilt) / IOR));
      peak = Math.max(peak, profile[i]);
    }
    for (let i = 0; i < PROFILE; i++) profile[i] /= peak;
    return profile;
  }

  // Red and green carry the x and y shift around 128. Every rim pixel samples inward along its normal,
  // since the backdrop only exists inside the box.
  function paintMap(width, height, radius, bezel) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const map = context.createImageData(width, height);
    const shift = lensProfile();
    const innerX = width / 2 - radius;
    const innerY = height / 2 - radius;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const px = x + 0.5 - width / 2;
        const py = y + 0.5 - height / 2;
        const qx = Math.abs(px) - innerX;
        const qy = Math.abs(py) - innerY;
        let depth;
        let nx = 0;
        let ny = 0;
        if (qx > 0 && qy > 0) {
          const length = Math.hypot(qx, qy);
          depth = radius - length;
          nx = qx / length;
          ny = qy / length;
        } else if (qx > qy) {
          depth = radius - qx;
          nx = 1;
        } else {
          depth = radius - qy;
          ny = 1;
        }
        nx *= Math.sign(px) || 1;
        ny *= Math.sign(py) || 1;
        const amount = depth > 0 && depth < bezel ? shift[Math.min(PROFILE - 1, Math.floor((depth / bezel) * PROFILE))] : 0;
        const i = (y * width + x) * 4;
        map.data[i] = Math.round(128 - 127 * amount * nx);
        map.data[i + 1] = Math.round(128 - 127 * amount * ny);
        map.data[i + 2] = 128;
        map.data[i + 3] = 255;
      }
    }
    context.putImageData(map, 0, 0);
    return canvas.toDataURL(); // The CSP allows data: images but not blob: ones.
  }

  function cornerOf(element, width, height) {
    const value = getComputedStyle(element).borderTopLeftRadius;
    const amount = parseFloat(value) || 0;
    const radius = value.endsWith("%") ? (amount / 100) * Math.min(width, height) : amount;
    return Math.min(radius, width / 2, height / 2);
  }

  function makeLens(element, bezel, scale, index) {
    const id = `glass-lens-${index}`;
    const filter = node("filter", { id, x: 0, y: 0, width: "100%", height: "100%", "color-interpolation-filters": "sRGB" });
    // The flood keeps pixels outside the map, or before it decodes, at a neutral 128.
    const image = node("feImage", { x: 0, y: 0, width: 0, height: 0, preserveAspectRatio: "none", result: "map" });
    const displace = node("feDisplacementMap", { in: "SourceGraphic", in2: "field", scale: 0, xChannelSelector: "R", yChannelSelector: "G" });
    filter.append(
      node("feFlood", { "flood-color": "rgb(128, 128, 128)", result: "flat" }),
      image,
      node("feComposite", { in: "map", in2: "flat", operator: "over", result: "field" }),
      displace
    );
    svg.append(filter);
    return { element, bezel, scale, id, image, displace, size: "", timer: 0, generation: 0, ready: false };
  }

  async function rebuild(lens, width, height) {
    const generation = ++lens.generation;
    if (width < 2 || height < 2) return;
    const radius = cornerOf(lens.element, width, height);
    const url = paintMap(width, height, radius, Math.min(lens.bezel, width / 2, height / 2));
    const picture = new Image();
    picture.src = url;
    try {
      await picture.decode();
    } catch {
      return;
    }
    if (generation !== lens.generation || !svg) return;
    lens.image.setAttribute("href", url);
    lens.image.setAttribute("width", width);
    lens.image.setAttribute("height", height);
    if (!lens.ready) {
      lens.ready = true;
      lens.element.style.setProperty("--glass-refract", `url(#${lens.id})`);
    }
    requestAnimationFrame(() => {
      if (generation === lens.generation && svg) lens.displace.setAttribute("scale", lens.scale);
    });
  }

  // A stale map would show a seam mid-resize (window, or the phone menu opening), so flatten the lens until the
  // size settles, then rebuild it.
  function resized(entries) {
    for (const entry of entries) {
      const lens = lenses.find((item) => item.element === entry.target);
      if (!lens) continue;
      const [box] = entry.borderBoxSize ?? [];
      const width = Math.round(box ? box.inlineSize : entry.contentRect.width);
      const height = Math.round(box ? box.blockSize : entry.contentRect.height);
      const size = `${width}x${height}`;
      if (size === lens.size) continue;
      lens.size = size;
      lens.displace.setAttribute("scale", 0);
      clearTimeout(lens.timer);
      lens.timer = setTimeout(() => rebuild(lens, width, height), SETTLE);
    }
  }

  function startLenses() {
    if (!refracting || plain.matches || svg) return;
    // Not display: none, or Chromium never resolves the filters inside.
    svg = node("svg", { class: "glass__lenses", width: 0, height: 0, "aria-hidden": "true", focusable: "false" });
    svg.style.cssText = "position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none";
    document.body.append(svg);
    observer = new ResizeObserver(resized);
    LENSES.forEach(([selector, bezel, scale], index) => {
      const element = document.querySelector(selector);
      if (!element) return;
      lenses.push(makeLens(element, bezel, scale, index));
      observer.observe(element, { box: "border-box" });
    });
    document.documentElement.classList.add("liquid-glass-refraction");
  }

  function stopLenses() {
    if (!svg) return;
    observer.disconnect();
    observer = null;
    for (const lens of lenses) {
      clearTimeout(lens.timer);
      lens.generation++;
      lens.element.style.removeProperty("--glass-refract");
    }
    lenses.length = 0;
    svg.remove();
    svg = null;
    document.documentElement.classList.remove("liquid-glass-refraction");
  }

  moving.addEventListener("change", updateLamp);
  hovering.addEventListener("change", updateLamp);
  plain.addEventListener("change", () => {
    stopLenses();
    startLenses();
  });
  addEventListener("pointerdown", press, { passive: true });
  updateLamp();
  setupDrop();
  startLenses();
})();
