(() => {
  // Same lamp as scroll-ball.js: it hangs LAMP px above the cursor, its slant is capped at SLANT,
  // and without a cursor it shines from LIGHT = (-0.45, -0.55, -0.7), i.e. shadows fall toward REST.
  const LAMP = 240;
  const SLANT = 1.4;
  const SELECTOR = ".post-list > li, .featured-posts .card, .header-bar h1, .pagination .page-link";

  const moving = matchMedia("(prefers-reduced-motion: no-preference)");
  const hovering = matchMedia("(hover: hover) and (pointer: fine)");

  let pointer = null;
  let frame = 0;
  let listeners = null;

  function shade() {
    frame = 0;
    for (const element of document.querySelectorAll(SELECTOR)) {
      if (!pointer) {
        element.style.removeProperty("--lx");
        element.style.removeProperty("--ly");
        continue;
      }
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = (left + width / 2 - pointer[0]) / LAMP;
      const y = (top + height / 2 - pointer[1]) / LAMP;
      const reach = Math.max(1, Math.hypot(x, y) / SLANT);
      element.style.setProperty("--lx", (x / reach).toFixed(3));
      element.style.setProperty("--ly", (y / reach).toFixed(3));
    }
  }

  function schedule() {
    frame ||= requestAnimationFrame(shade);
  }

  function follow(event) {
    if (event.pointerType !== "mouse") return;
    pointer = [event.clientX, event.clientY];
    schedule();
  }

  function forget() {
    pointer = null;
    schedule();
  }

  function start() {
    if (listeners) return;
    listeners = new AbortController();
    const { signal } = listeners;
    addEventListener("pointermove", follow, { passive: true, signal });
    document.documentElement.addEventListener("pointerleave", forget, { signal });
    addEventListener("scroll", () => pointer && schedule(), { passive: true, signal });
  }

  function stop() {
    if (!listeners) return;
    listeners.abort();
    listeners = null;
    forget();
  }

  function update() {
    if (moving.matches && hovering.matches) start();
    else stop();
  }

  moving.addEventListener("change", update);
  hovering.addEventListener("change", update);
  update();
})();
