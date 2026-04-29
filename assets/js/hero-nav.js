// Toggle a transparent state on the navbar while it overlays a hero image,
// then switch to the solid theme background once the user scrolls past it.
(function () {
  const navbar = document.getElementById("navbar");
  const hero = document.querySelector(".hero");
  if (!navbar || !hero) return;

  const update = () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const navHeight = navbar.offsetHeight;
    if (window.scrollY < heroBottom - navHeight) {
      navbar.classList.add("navbar-transparent");
    } else {
      navbar.classList.remove("navbar-transparent");
    }
  };

  // Start transparent so the first paint matches; flip immediately if needed.
  navbar.classList.add("navbar-transparent");
  update();

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
})();
