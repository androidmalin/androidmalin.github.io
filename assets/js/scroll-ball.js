(() => {
  const ballScript = document.currentScript;
  const portrait = ballScript.dataset.logo;
  const initialsText = ballScript.dataset.initials || "AM";

  const moving = matchMedia("(prefers-reduced-motion: no-preference)");
  const narrow = matchMedia("(max-width: 48.75em)");
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const forcedColors = matchMedia("(forced-colors: active)");
  const glassPage = document.body.classList.contains("liquid-glass-page");
  const settingsPanel = document.querySelector(".ball__settings");
  const settingsTrigger = document.querySelector(".ball__settings-trigger");
  const mainCard = document.querySelector(".container[role='main'] > .post");
  const heading = mainCard?.querySelector(".header-bar h1");
  const CARD_SELECTOR = ".post-list > li, .featured-posts .card";
  const RAINBOW = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#8B00FF"].map((color) =>
    [1, 3, 5].map((start) => toLinear(parseInt(color.slice(start, start + 2), 16) / 255))
  );
  const GLASS_PALETTES = ["red", "orange", "yellow", "green", "cyan", "blue", "purple"];
  const GLASS_PROPERTIES = ["--glass-bg-start", "--glass-bg-end", "--glass-halo-1", "--glass-halo-2", "--glass-halo-3", "--glass-halo-4"];
  const GLASS_DURATION = 900;

  const STIFFNESS = 70;
  const DAMPING = 11;
  const TRAIL_LIFE = 8000;
  const GRAVITY = 2600;
  const JUMP = 760;
  const BOUNCE = 0.4;
  const THIN = 0.2;
  const WIDE = 1.1;
  const SWELL = 0.8;
  const NARROW = 0.1;
  const UNWIND = 4;
  const GROW = 3;
  const LABEL_GROWTH = 1 - Math.log(2) / Math.log(GROW);
  const KEEP = 20;
  const LABEL = 256;
  const MAX_BANDS = 8;
  const LABEL_UNIFORMS = ["span", "shrink", "stamped", "lettered", "label", "initials"];
  const labelSources = {
    android: portrait,
    code: symbol('<path d="m90 70-54 58 54 58m76-116 54 58-54 58M145 58l-34 140"/>'),
    star: symbol('<path d="m128 25 29 67 73 7-55 48 17 72-64-38-64 38 17-72-55-48 73-7Z"/>'),
  };
  const INITIALS_SPAN = 0.6;
  const WHITE = [1, 1, 1];
  const TURN = 2000;
  const TILT = 2400;
  const FRICTION = 0.9;
  const TOP_SPEED = 2500;
  const BAND = 1.6;
  const LIGHT = normalize([-0.45, -0.55, -0.7]);
  const LAMP = 240;
  const SLANT = 1.4;
  const BLUR_SAMPLES = 8;

  const trail = document.createElement("canvas");
  const sphere = document.createElement("canvas");
  const shadow = document.createElement("div");
  const handle = document.createElement("button");
  const dock = document.createElement("div");
  trail.className = "ball__trail";
  sphere.className = "ball__sphere";
  shadow.className = "ball__shadow";
  handle.className = "ball__handle";
  handle.type = "button";
  handle.setAttribute("aria-label", "与小球互动");
  trail.setAttribute("aria-hidden", "true");
  sphere.setAttribute("aria-hidden", "true");
  shadow.setAttribute("aria-hidden", "true");
  dock.className = "ball__dock";
  dock.setAttribute("aria-hidden", "true");

  const sphereGl = sphere.getContext("webgl2", { preserveDrawingBuffer: true, antialias: false });
  const trailGl = trail.getContext("webgl2", { antialias: false });

  const number = (value) => value.toFixed(6);
  const CLIP = `
  uniform vec2 view;
  uniform float scroll;
  vec4 toClip(vec2 at) {
    return vec4(at.x / view.x * 2.0 - 1.0, 1.0 - (at.y - scroll) / view.y * 2.0, 0.0, 1.0);
  }`;
  const LETTER = `
  uniform float span;
  uniform float shrink;
  uniform bool stamped;
  uniform sampler2D label;
  float crown() {
    return sqrt(max(0.0, 1.0 - span * span));
  }
  float letter(vec3 body) {
    if (!stamped || span <= 0.0 || body.z <= crown()) return 0.0;
    vec2 uv = vec2(body.x, -body.y) / span;
    if (abs(uv.x) >= 1.0 || abs(uv.y) >= 1.0) return 0.0;
    return texture(label, (uv + 1.0) / 2.0).a;
  }
  uniform sampler2D initials;
  uniform bool lettered;
  float initial(vec3 body) {
    if (!lettered || body.z >= 0.0) return 0.0;
    vec2 uv = body.xy * shrink / ${number(INITIALS_SPAN)};
    if (abs(uv.x) >= 1.0 || abs(uv.y) >= 1.0) return 0.0;
    return texture(initials, (uv + 1.0) / 2.0).a;
  }`;
  const BALL_VERTEX = `#version 300 es
  in vec2 corner;
  out vec2 p;
  void main() {
    p = vec2(corner.x, -corner.y);
    gl_Position = vec4(corner, 0.0, 1.0);
  }`;
  const BALL_FRAGMENT = `#version 300 es
  precision highp float;
  in vec2 p;
  out vec4 color;
  uniform mat3 orient;
  uniform vec3 paint;
  uniform vec3 bands[${MAX_BANDS}];
  uniform int count;
  uniform bool blended;
  uniform vec3 paper;
  uniform vec3 mark;
  uniform float extent;
  uniform vec3 lamp;
  uniform float spotlight;
  uniform float shading;
  uniform vec4 spin;
  ${LETTER}
  vec3 toGamma(vec3 v) {
    v = clamp(v, 0.0, 1.0);
    return mix(v * 12.92, 1.055 * pow(v, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, v));
  }
  vec3 turned(vec3 v, vec3 axis, float angle) {
    float c = cos(angle);
    return v * c + cross(axis, v) * sin(angle) + axis * dot(axis, v) * (1.0 - c);
  }
  vec3 surface(vec3 body) {
    float t = acos(clamp(-body.z, -1.0, 1.0)) / ${number(Math.PI)};
    float rim = span > 0.0 ? acos(-crown()) / ${number(Math.PI)} : 1.0;
    vec3 tint = paint;
    if (count > 1 && blended) {
      float f = clamp(t / rim, 0.0, 1.0) * float(count - 1);
      int i = min(int(f), count - 2);
      tint = mix(bands[i], bands[i + 1], f - float(i));
    } else if (count > 0) {
      float f = t / rim * float(count);
      int i = min(int(f), count - 1);
      float edge = smoothstep(1.0 - fwidth(f), 1.0, fract(f));
      tint = mix(bands[i], bands[min(i + 1, count - 1)], edge);
    }
    if (span > 0.0) tint = mix(tint, paper, smoothstep(rim - 0.005, rim, t));
    tint = mix(tint, mark, letter(body));
    return mix(tint, vec3(1.0), initial(body));
  }
  void main() {
    float d = dot(p, p);
    if (d >= 1.0) discard;
    vec3 n = vec3(p, -sqrt(1.0 - d));
    // Average the surface over this frame's rotation so fast spins smear instead of strobing.
    int samples = spin.w > 0.05 ? ${BLUR_SAMPLES} : 1;
    vec3 tint = vec3(0.0);
    for (int k = 0; k < ${BLUR_SAMPLES}; k++) {
      if (k >= samples) break;
      float s = samples > 1 ? float(k) / float(samples - 1) : 0.0;
      tint += surface(orient * turned(n, spin.xyz, spin.w * s));
    }
    tint /= float(samples);
    float wrap = max(0.0, (dot(n, lamp) + 0.3) / 1.3);
    float occlusion = mix(0.7, 1.0, smoothstep(0.0, 0.6, -n.z));
    float light = mix(1.0, (0.12 + 0.9 * wrap) * occlusion, shading);
    float gloss = max(0.0, dot(n, normalize(lamp - vec3(0.0, 0.0, 1.0))));
    float glow =
      (pow(gloss, 48.0) * 0.55 + pow(gloss, 8.0) * 0.06) * spotlight +
      pow(1.0 + n.z, 4.0) * 0.05 * shading;
    float alpha = min(1.0, (1.0 - sqrt(d)) * extent * 1.5);
    color = vec4(toGamma(min(tint * light + glow, 1.0)) * alpha, alpha);
  }`;
  const STROKE_VERTEX = `#version 300 es
  in vec2 corner;
  in vec2 center;
  in float size;
  in vec2 facing;
  in float cut;
  in vec3 tint;
  uniform float ratio;
  out vec2 local;
  flat out float vSize;
  flat out vec2 vFacing;
  flat out float vCut;
  flat out vec3 vTint;
  ${CLIP}
  void main() {
    local = corner * (size + 1.0 / ratio);
    vSize = size;
    vFacing = facing;
    vCut = cut;
    vTint = tint;
    gl_Position = toClip(center + local);
  }`;
  const STROKE_FRAGMENT = `#version 300 es
  precision highp float;
  in vec2 local;
  flat in float vSize;
  flat in vec2 vFacing;
  flat in float vCut;
  flat in vec3 vTint;
  out vec4 color;
  uniform float ratio;
  void main() {
    float a = clamp((vSize - length(local)) * ratio + 0.5, 0.0, 1.0) *
      clamp((dot(local, vFacing) - vCut) * ratio + 0.5, 0.0, 1.0);
    if (a <= 0.0) discard;
    color = vec4(vTint * a, a);
  }`;
  const SPRITE_VERTEX = `#version 300 es
  in vec2 corner;
  uniform vec4 rect;
  out vec2 uv;
  ${CLIP}
  void main() {
    uv = corner * 0.5 + 0.5;
    gl_Position = toClip(rect.xy + corner * rect.zw * 0.5);
  }`;
  const SPRITE_FRAGMENT = `#version 300 es
  precision highp float;
  in vec2 uv;
  out vec4 color;
  uniform sampler2D sprite;
  uniform float alpha;
  void main() {
    color = texture(sprite, uv) * alpha;
  }`;
  const PRINT_VERTEX = `#version 300 es
  in vec2 corner;
  in vec2 center;
  in vec2 direction;
  in float along;
  in float fade;
  in vec3 axisX;
  in vec3 axisY;
  in vec3 axisZ;
  in vec3 tint;
  uniform float across;
  out vec2 ground;
  flat out float vFade;
  flat out vec3 vX;
  flat out vec3 vY;
  flat out vec3 vZ;
  flat out vec3 vTint;
  ${CLIP}
  void main() {
    ground = direction * corner.x * along + vec2(-direction.y, direction.x) * corner.y * across;
    vFade = fade;
    vTint = tint;
    vX = axisX;
    vY = axisY;
    vZ = axisZ;
    gl_Position = toClip(center + ground);
  }`;
  const PRINT_FRAGMENT = `#version 300 es
  precision highp float;
  in vec2 ground;
  flat in float vFade;
  flat in vec3 vX;
  flat in vec3 vY;
  flat in vec3 vZ;
  flat in vec3 vTint;
  out vec4 color;
  uniform float radius;
  uniform bool cut;
  ${LETTER}
  void main() {
    vec2 at = ground / radius;
    vec3 body = normalize(vX * at.x + vY * at.y + vZ);
    float a = (cut ? initial(body) : letter(body)) * vFade;
    if (a <= 0.0) discard;
    color = vec4(vTint * a, a);
  }`;

  let radius = 0;
  let unit = 0;
  let grow = 1;
  let pixelRatio = 1;
  const labels = {};
  let initials = null;
  let themeAccent = [0, 0, 1];
  let accent = [0, 0, 1];
  let colorStage = -1;
  let glassStage = null;
  let glassTheme = null;
  let glassColors = null;
  let glassTransition = null;
  const palettes = { poline: [], gradient: [] };
  let appearance = {
    spotlight: true,
    shading: true,
    shadow: true,
    initials: false,
    stamp: "android",
    size: 25,
    color: "cycle",
    custom: "#3ddc84",
  };
  let base = [0, 0, 0];
  let tone = 0;
  let paint = [0, 0, 0];
  let paper = [1, 1, 1];
  let mark = [0, 0, 0];
  let ink = [0, 0, 0];
  let drawn = null;
  let band = null;
  let bandWidth = 0;
  let bandHeight = 0;
  let pageHeight = 0;
  let runout = 0;
  let track = { x: 0, start: 0, end: 0, bottom: 0, exit: 0, cardHeight: 1 };
  let trailGap = false;
  let returning = null;
  let deepest = 0;
  let ball = null;
  let floor = null;
  const STROKE_SIZE = 9;
  const PRINT_SIZE = 18;
  let strokeData = new Float32Array(STROKE_SIZE * 4096);
  let printData = new Float32Array(PRINT_SIZE * 1024);
  let position = null;
  let velocity = [0, 0];
  let height = 0;
  let lift = 0;
  let spinning = [0, 0, 0];
  let target = null;
  let parked = true;
  let armed = false;
  let glare = null;
  let lamp = LIGHT;
  let rotation = [0, 0, 0, 1];
  let blur = [0, 0, 1, 0];
  let points = [];
  let splashes = [];
  let prints = [];
  let stroke = 0;
  let tilt = null;
  let level = null;
  let last = 0;
  let lastScroll = 0;
  let depth = 0;
  let plunge = 0;
  let unwind = 0;
  let swipe = null;
  let fling = 0;
  let glide = 0;
  let gliding = false;
  let nativeFling = false;
  let flick = null;
  let touching = false;
  let wheeling = false;
  let frame = 0;
  let active = false;
  let listeners = null;
  let resizeObserver = null;
  let themeObserver = null;

  function symbol(drawing) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g fill="none" stroke="black" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">${drawing}</g></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  function normalize([x, y, z]) {
    const length = Math.hypot(x, y, z);
    return [x / length, y / length, z / length];
  }

  function toLinear(v) {
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }

  function toGamma(v) {
    v = Math.min(Math.max(v, 0), 1);
    return v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
  }

  function readColor(color) {
    const probe = document.createElement("i");
    probe.style.color = color;
    document.body.append(probe);
    const computed = getComputedStyle(probe).color;
    const channels = computed
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number);
    probe.remove();
    // CSS color-mix(in srgb, ...) resolves to color(srgb ...) with channels in 0..1.
    return channels.map((v) => toLinear(computed.startsWith("color(srgb ") ? v : v / 255));
  }

  function labelTextures(gl) {
    return Object.fromEntries(Object.keys(labelSources).map((name) => [name, texture(gl, labels[name])]));
  }

  async function buildLabel(name) {
    if (labels[name]) return;
    const image = new Image();
    image.src = labelSources[name];
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = LABEL;
    const context = canvas.getContext("2d");
    const scale = Math.min(LABEL / image.width, LABEL / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.beginPath();
    context.arc(LABEL / 2, LABEL / 2, LABEL / 2, 0, Math.PI * 2);
    context.clip();
    context.drawImage(image, (LABEL - width) / 2, (LABEL - height) / 2, width, height);
    labels[name] = canvas;
    ball.labels[name] = texture(sphereGl, canvas, ball.labels[name]);
    floor.labels[name] = texture(trailGl, canvas, floor.labels[name]);
    drawn = null;
    wake();
  }

  async function buildInitials() {
    if (initials) return;
    const family = getComputedStyle(document.body).fontFamily;
    const size = LABEL * 0.6;
    await document.fonts.load(`${size}px ${family}`, initialsText);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = LABEL;
    const context = canvas.getContext("2d");
    context.font = `${size}px ${family}`;
    context.textAlign = "center";
    const { actualBoundingBoxAscent } = context.measureText(initialsText);
    context.fillText(initialsText, LABEL / 2, (LABEL + actualBoundingBoxAscent) / 2);
    initials = canvas;
    ball.initials = texture(sphereGl, initials, ball.initials);
    floor.initials = texture(trailGl, initials, floor.initials);
    drawn = null;
    wake();
  }

  function buildColors() {
    syncColorStage();
    if (!glassColors) paper = readColor(getComputedStyle(document.body).backgroundColor);
    const root = getComputedStyle(document.documentElement);
    themeAccent = readColor(getComputedStyle(document.body).getPropertyValue("--ball-accent"));
    accent = selectedColor();
    base = readColor(root.getPropertyValue("--global-text-color"));
    mixPaint();
    drawn = null;
  }

  function mixPaint() {
    const amount = appearance.color === "theme" ? tone : 0;
    paint = accent.map((v, i) => v + (base[i] - v) * amount);
    ink = paint.map(toGamma);
    const colors = palette();
    const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const isDark = document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && dark.matches);
    mark = colors.length ? colors.reduce((a, b) => (luminance(b) < luminance(a) ? b : a)) : isDark ? WHITE : paint;
  }

  function selectedColor() {
    if (appearance.color === "theme") return themeAccent;
    if (appearance.color === "cycle") return colorStage < 0 ? themeAccent : RAINBOW[colorStage];
    if (palette().length) return palette()[0];
    return readColor(appearance.color === "custom" ? appearance.custom : appearance.color);
  }

  function palette() {
    return palettes[appearance.color] ?? [];
  }

  function buildPalette(mode) {
    // Interpolate random HSL anchors on a polar plane, with an independent easing per axis.
    const easings = [
      (t) => t,
      (t) => t ** 2,
      (t) => t ** 3,
      (t) => t ** 4,
      (t) => t ** 5,
      (t) => Math.sin((t * Math.PI) / 2),
      (t) => Math.asin(t) / (Math.PI / 2),
      (t) => 1 - Math.sqrt(1 - t),
      (t) => t * t * (3 - 2 * t),
    ];
    const hue = Math.random() * Math.PI * 2;
    const anchors = [
      [hue, Math.random(), 0.75 + Math.random() * 0.2],
      [hue + Math.PI / 3 + Math.random() * Math.PI, Math.random(), 0.3 + Math.random() * 0.2],
    ].map(([h, s, l]) => [0.5 + Math.cos(h) * l * 0.5, 0.5 + Math.sin(h) * l * 0.5, s]);
    const curves = Array.from({ length: 3 }, () => easings[Math.floor(Math.random() * easings.length)]);
    const count = 4 + Math.floor(Math.random() * 4);
    const colors = Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const [x, y, s] = anchors[0].map((v, axis) => v + (anchors[1][axis] - v) * curves[axis](t));
      const h = (Math.atan2(y - 0.5, x - 0.5) * 180) / Math.PI;
      const l = Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 2);
      return `hsl(${h} ${s * 100}% ${l * 100}%)`;
    });
    palettes[mode] = colors.map(readColor);
    const stops = mode === "gradient" ? colors : colors.map((color, i) => `${color} ${(i * 100) / count}% ${((i + 1) * 100) / count}%`);
    settingsPanel?.style.setProperty(`--ball-${mode}`, `conic-gradient(${stops.join(", ")})`);
  }

  function contactColor() {
    const colors = palette();
    const t = Math.acos(Math.min(Math.max(rotate(rotation, [0, 0, -1])[2], -1), 1)) / Math.acos(paintEdge());
    if (appearance.color === "gradient") {
      const at = Math.min(Math.max(t * (colors.length - 1), 0), colors.length - 1);
      const i = Math.min(Math.floor(at), colors.length - 2);
      return colors[i].map((v, channel) => v + (colors[i + 1][channel] - v) * (at - i));
    }
    return colors[Math.min(Math.floor(t * colors.length), colors.length - 1)];
  }

  function syncColorStage(now = performance.now()) {
    const interval = Math.floor(overrun() / (2 * track.cardHeight));
    colorStage = appearance.color !== "cycle" || interval === 0 ? -1 : (interval - 1) % RAINBOW.length;
    syncGlassPalette(now);
  }

  function cycleColor(now) {
    syncColorStage(now);
    if (appearance.color !== "cycle") return;
    const color = selectedColor();
    if (color === accent) return;
    accent = color;
    mixPaint();
  }

  function readGlassColors() {
    const style = getComputedStyle(document.body);
    const percentage = (name) => parseFloat(style.getPropertyValue(name)) / 100;
    const tint = readColor(style.getPropertyValue("--glass-palette-base")).map(toGamma);
    const stops = ["start", "end"].map((end) => {
      const neutral = readColor(style.getPropertyValue(`--glass-neutral-${end}`)).map(toGamma);
      const amount = percentage(`--glass-mix-${end}`);
      // Match CSS's sRGB component mixing, then animate the resulting colors in linear RGB.
      return [...neutral.map((v, i) => toLinear(v + (tint[i] - v) * amount)), 1];
    });
    return [...stops, ...[1, 2, 3, 4].map((i) => [...tint.map(toLinear), percentage(`--glass-halo-opacity-${i}`)])];
  }

  function showGlassColors() {
    glassColors.forEach((color, i) => {
      const rgb = color
        .slice(0, 3)
        .map((v) => (toGamma(v) * 255).toFixed(3))
        .join(" ");
      document.body.style.setProperty(GLASS_PROPERTIES[i], `rgb(${rgb} / ${color[3].toFixed(4)})`);
    });
    paper = glassColors[0].slice(0, 3);
    drawn = null; // The cap must repaint even when the ball has stopped moving.
  }

  function syncGlassPalette(now) {
    if (!glassPage) return;
    if (!active || forcedColors.matches || sphereGl.isContextLost() || trailGl.isContextLost()) {
      resetGlassPalette();
      return;
    }
    const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    if (glassStage === colorStage && glassTheme === theme) return;
    if (!glassColors) {
      glassColors = readGlassColors();
      showGlassColors();
    }
    glassStage = colorStage;
    glassTheme = theme;
    document.body.setAttribute("data-glass-palette", GLASS_PALETTES[colorStage] ?? "initial");
    const to = readGlassColors();
    // Retarget from the last displayed frame, never queue an intermediate scroll stage or theme.
    const changed = to.some((color, i) => color.some((v, channel) => Math.abs(v - glassColors[i][channel]) > 1e-8));
    glassTransition = changed ? { from: glassColors, to, start: now } : null;
  }

  function fadeGlass(now) {
    if (!glassTransition) return true;
    const { from, to, start } = glassTransition;
    const progress = Math.min(Math.max((now - start) / GLASS_DURATION, 0), 1);
    const eased = easeInOut(progress);
    glassColors = to.map((color, i) => color.map((v, channel) => from[i][channel] + (v - from[i][channel]) * eased));
    showGlassColors();
    if (progress === 1) glassTransition = null;
    return !glassTransition;
  }

  function resetGlassPalette() {
    if (!glassColors) return;
    glassColors = glassTransition = glassStage = glassTheme = null;
    document.body.removeAttribute("data-glass-palette");
    for (const property of GLASS_PROPERTIES) document.body.style.removeProperty(property);
    paper = readColor(getComputedStyle(document.body).backgroundColor);
    drawn = null;
  }

  function blend(dt) {
    const root = document.documentElement;
    const goal = scrollY + innerHeight >= root.scrollHeight - 2 ? 1 : 0;
    if (tone === goal) return true;
    tone = Math.abs(goal - tone) < 0.01 ? goal : tone + (goal - tone) * (1 - Math.exp(-dt / 0.15));
    mixPaint();
    return false;
  }

  function compile(gl, vertex, fragment, names) {
    const program = gl.createProgram();
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }
    const uniforms = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));
    return { program, uniforms };
  }

  function attributes(gl, program, buffer, layout, divisor) {
    const stride = layout.reduce((sum, [, size]) => sum + size, 0) * 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let offset = 0;
    for (const [name, size] of layout) {
      const location = gl.getAttribLocation(program, name);
      if (location >= 0) {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
        gl.vertexAttribDivisor(location, divisor);
      }
      offset += size * 4;
    }
  }

  function shape(gl, { program, uniforms }, layout = null) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const corners = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corners);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    attributes(gl, program, corners, [["corner", 2]], 0);
    const instances = layout && gl.createBuffer();
    if (layout) attributes(gl, program, instances, layout, 1);
    gl.bindVertexArray(null);
    return { program, uniforms, vao, instances };
  }

  function texture(gl, source, previous = null) {
    if (previous) gl.deleteTexture(previous);
    const result = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, result);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (source) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    }
    return result;
  }

  function setupBall() {
    const gl = sphereGl;
    ball = {
      ...shape(
        gl,
        compile(gl, BALL_VERTEX, BALL_FRAGMENT, [
          "orient",
          "paint",
          "bands",
          "count",
          "blended",
          "paper",
          "mark",
          "extent",
          "lamp",
          "spotlight",
          "shading",
          "spin",
          ...LABEL_UNIFORMS,
        ])
      ),
      labels: labelTextures(gl),
      initials: texture(gl, initials),
    };
    drawn = null;
  }

  function setupFloor() {
    const gl = trailGl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    floor = {
      strokes: shape(gl, compile(gl, STROKE_VERTEX, STROKE_FRAGMENT, ["view", "scroll", "ratio"]), [
        ["center", 2],
        ["size", 1],
        ["facing", 2],
        ["cut", 1],
        ["tint", 3],
      ]),
      sprites: shape(gl, compile(gl, SPRITE_VERTEX, SPRITE_FRAGMENT, ["view", "scroll", "rect", "sprite", "alpha"])),
      prints: shape(gl, compile(gl, PRINT_VERTEX, PRINT_FRAGMENT, ["view", "scroll", "across", "radius", ...LABEL_UNIFORMS, "cut"]), [
        ["center", 2],
        ["direction", 2],
        ["along", 1],
        ["fade", 1],
        ["axisX", 3],
        ["axisY", 3],
        ["axisZ", 3],
        ["tint", 3],
      ]),
      labels: labelTextures(gl),
      initials: texture(gl, initials),
    };
    splashes = splashes.filter((splash) => !splash.texture);
  }

  function rotate([qx, qy, qz, qw], [x, y, z]) {
    const tx = 2 * (qy * z - qz * y);
    const ty = 2 * (qz * x - qx * z);
    const tz = 2 * (qx * y - qy * x);
    return [x + qw * tx + qy * tz - qz * ty, y + qw * ty + qz * tx - qx * tz, z + qw * tz + qx * ty - qy * tx];
  }

  function conjugate([x, y, z, w]) {
    return [-x, -y, -z, w];
  }

  function spin(q, [wx, wy, wz], dt) {
    const angle = Math.hypot(wx, wy, wz) * dt;
    if (angle < 1e-6) return q;
    const s = Math.sin(angle / 2) / (angle / dt);
    const [ax, ay, az, aw] = [wx * s, wy * s, wz * s, Math.cos(angle / 2)];
    const [bx, by, bz, bw] = q;
    const r = [
      aw * bx + ax * bw + ay * bz - az * by,
      aw * by - ax * bz + ay * bw + az * bx,
      aw * bz + ax * by - ay * bx + az * bw,
      aw * bw - ax * bx - ay * by - az * bz,
    ];
    const length = Math.hypot(...r);
    return r.map((v) => v / length);
  }

  function labelShrink() {
    return grow ** LABEL_GROWTH;
  }

  function labelSpan() {
    const edge = 1 - appearance.size / 50;
    return Math.sqrt(Math.max(0, 1 - edge * edge)) / labelShrink();
  }

  function paintEdge() {
    return -Math.sqrt(Math.max(0, 1 - labelSpan() ** 2));
  }

  function applyLabel(gl, model, uniforms) {
    gl.uniform1f(uniforms.span, labelSpan());
    gl.uniform1f(uniforms.shrink, labelShrink());
    gl.uniform1i(uniforms.stamped, appearance.stamp === "hole" ? 0 : 1);
    gl.uniform1i(uniforms.lettered, Number(appearance.initials));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, model.labels[appearance.stamp] ?? model.labels.android);
    gl.uniform1i(uniforms.label, 0);
  }

  function inked() {
    return rotate(rotation, [0, 0, -1])[2] > paintEdge() - 0.3;
  }

  function splash(angle, spread, count, reach, now) {
    const drops = Array.from({ length: count }, () => {
      const direction = angle + (Math.random() - 0.5) * spread;
      const distance = radius * 0.5 + unit * Math.random() * reach;
      const size = unit * (0.03 + Math.random() ** 2 * 0.14);
      const flick = Math.random() < 0.25;
      return {
        x: Math.cos(direction) * distance,
        y: Math.sin(direction) * distance,
        angle: direction,
        size,
        stretch: flick ? unit * (0.3 + Math.random() * 0.6) : size * (1 + Math.random() * 1.5),
        bend: (Math.random() - 0.5) * unit * 0.6,
        flick,
      };
    });
    const extent = Math.max(...drops.map((drop) => Math.hypot(drop.x, drop.y) + drop.stretch)) + radius;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = Math.ceil(extent * 2 * pixelRatio);
    const context = canvas.getContext("2d");
    context.setTransform(pixelRatio, 0, 0, pixelRatio, extent * pixelRatio, extent * pixelRatio);
    context.fillStyle = context.strokeStyle = `rgb(${ink.map((v) => Math.round(v * 255)).join(" ")})`;
    context.lineCap = "round";
    for (const drop of drops) paintSplat(context, drop);
    splashes.push({
      x: position[0],
      y: position[1],
      texture: texture(trailGl, canvas),
      size: extent * 2,
      time: now,
    });
  }

  function paintSplat(context, { x, y, angle, size, stretch, bend, flick }) {
    context.beginPath();
    if (flick) {
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      context.lineWidth = size;
      context.moveTo(x, y);
      context.quadraticCurveTo(x + dx * stretch * 0.5 - dy * bend, y + dy * stretch * 0.5 + dx * bend, x + dx * stretch, y + dy * stretch);
      context.stroke();
    } else {
      context.ellipse(x, y, stretch, size, angle, 0, Math.PI * 2);
      context.fill();
    }
  }

  function resize() {
    pixelRatio = devicePixelRatio || 1;
    unit = parseFloat(getComputedStyle(sphere).width) / 2;
    radius = unit * grow;
    pageHeight = Math.max(document.body.offsetHeight, innerHeight);
    runout = document.querySelector(".runout")?.offsetHeight ?? 0;
    const width = document.documentElement.clientWidth;
    const height = Math.min(Math.ceil(innerHeight * BAND), pageHeight);
    if (width !== bandWidth || height !== bandHeight || trail.width !== width * pixelRatio) {
      bandWidth = width;
      bandHeight = height;
      trail.width = width * pixelRatio;
      trail.height = height * pixelRatio;
      trail.style.width = `${width}px`;
      trail.style.height = `${height}px`;
    }
    band = null;
    const size = Math.ceil(unit * 2 * GROW * pixelRatio);
    if (sphere.width !== size) {
      sphere.width = sphere.height = size;
      drawn = null;
    }
    measureTrack();
  }

  function lasting({ y, expired }) {
    return runout > 0 && !expired && y >= pageHeight - runout;
  }

  function retire(now) {
    deepest = Math.max(deepest, position[1]);
    const limit = deepest - KEEP * innerHeight;
    for (const items of [points, splashes, prints]) {
      for (const item of items) {
        if (item.y >= limit || !lasting(item)) continue;
        item.expired = true;
        item.time = now;
      }
    }
  }

  function life(item, now) {
    return lasting(item) ? 1 : 1 - (now - item.time) / TRAIL_LIFE;
  }

  function swell() {
    grow = 1 + (GROW - 1) * (1 - Math.exp(-overrun() / (innerHeight * 4)));
    radius = unit * grow;
  }

  function camera() {
    return Math.max(0, scrollY) + depth;
  }

  function slide() {
    const view = camera();
    const limit = Math.max(0, pageHeight - bandHeight) + depth;
    if (band === null || band > limit || view < band || view + innerHeight > band + bandHeight) {
      const centered = view - (bandHeight - innerHeight) / 2;
      band = Math.min(Math.max(centered, 0), limit);
    }
    trail.style.translate = `0 ${band - depth}px`;
  }

  function axes() {
    const inverse = conjugate(rotation);
    return [...rotate(inverse, [1, 0, 0]), ...rotate(inverse, [0, 1, 0]), ...rotate(inverse, [0, 0, 1])];
  }

  function paintSphere() {
    const key = `${rotation.join()},${height},${lamp.join()},${tone},${grow},${paint.join()},${blur.join()}`;
    if (key === drawn || sphereGl.isContextLost()) return;
    drawn = key;
    const gl = sphereGl;
    const { program, uniforms, vao } = ball;
    gl.viewport(0, 0, sphere.width, sphere.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniformMatrix3fv(uniforms.orient, false, axes());
    gl.uniform3fv(uniforms.paint, paint);
    const colors = palette().slice(0, MAX_BANDS);
    gl.uniform1i(uniforms.count, colors.length);
    gl.uniform1i(uniforms.blended, Number(appearance.color === "gradient"));
    if (colors.length) gl.uniform3fv(uniforms.bands, colors.flat());
    gl.uniform3fv(uniforms.paper, paper);
    gl.uniform3fv(uniforms.mark, mark);
    gl.uniform1f(uniforms.extent, sphere.width / 2);
    gl.uniform3fv(uniforms.lamp, lamp);
    gl.uniform1f(uniforms.spotlight, Number(appearance.spotlight));
    gl.uniform1f(uniforms.shading, Number(appearance.shading));
    gl.uniform4fv(uniforms.spin, blur);
    applyLabel(gl, ball, uniforms);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, ball.initials);
    gl.uniform1i(uniforms.initials, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function place() {
    const x = position[0];
    const y = position[1] - camera();
    sphere.style.translate = `${x - unit}px ${y - unit}px`;
    sphere.style.scale = (1 + height / 500) * grow;
    if (appearance.shadow) {
      const reach = shadow.offsetWidth / 2;
      const slant = Math.min(1.6, Math.hypot(lamp[0], lamp[1]) / Math.max(-lamp[2], 0.01));
      const angle = Math.atan2(-lamp[1], -lamp[0]);
      const cast = slant * (radius * 0.55 + height * 0.7);
      shadow.style.translate = `${x - reach + Math.cos(angle) * cast}px ${y - reach + Math.sin(angle) * cast}px`;
      shadow.style.scale = (1 + (height * 0.25) / reach) * grow;
      shadow.style.opacity = 1 / (1 + height / 70);
      sphere.style.setProperty("--contact-x", `${Math.cos(angle) * slant * 1.5}px`);
      sphere.style.setProperty("--contact-y", `${Math.sin(angle) * slant * 1.5}px`);
      sphere.style.setProperty("--contact", 1 / (1 + height / 20));
    }
    handle.style.translate = `${x - unit}px ${y - unit}px`;
    handle.style.scale = grow;
    handle.disabled = overrun() === 0;
    const [dockX, dockY] = corner();
    const dockRadius = dock.offsetWidth / 2;
    dock.style.translate = `${dockX - dockRadius}px ${dockY - dockRadius}px`;
  }

  function stamp(count, x, y, size, [px, py, pz], edge, fade, color) {
    const reach = Math.hypot(px, py);
    const cut = reach < 1e-6 ? (pz >= edge ? -Infinity : Infinity) : (radius * fade * (edge - pz)) / reach;
    if (cut >= size) return count;
    if (strokeData.length < (count + 1) * STROKE_SIZE) {
      const grown = new Float32Array(strokeData.length * 2);
      grown.set(strokeData);
      strokeData = grown;
    }
    const whole = cut <= -size;
    strokeData.set([x, y, size, whole ? 0 : px / reach, whole ? 0 : py / reach, whole ? -1e6 : cut, ...color], count * STROKE_SIZE);
    return count + 1;
  }

  function press(now, ground) {
    const speed = Math.hypot(...ground);
    if (!initials || speed < 1) return;
    const orient = axes();
    const last = prints.at(-1);
    const travelled = last ? Math.hypot(position[0] - last.x, position[1] - last.y) : 0;
    const reach = travelled < radius ? travelled : Math.min(Math.max(1.5, speed / 60), 6);
    prints.push({
      x: position[0],
      y: position[1],
      direction: [ground[0] / speed, ground[1] / speed],
      along: reach / 2 + 0.4,
      orient,
      color: (orient[8] < 0 ? WHITE : mark).map(toGamma),
      time: now,
    });
  }

  function paintTrail(now) {
    const gl = trailGl;
    if (gl.isContextLost()) return;
    slide();
    gl.viewport(0, 0, trail.width, trail.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const top = band - radius * 2;
    const bottom = band + bandHeight + radius * 2;
    let count = 0;
    for (let i = 0; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      const from = a && !b.gap ? a : b;
      if (Math.max(from.y, b.y) < top || Math.min(from.y, b.y) > bottom) continue;
      const fade = Math.sqrt(life(b, now));
      const spacing = Math.max(1.5, Math.min(from.width, b.width) * fade * 0.25);
      const steps = Math.max(1, Math.ceil(Math.hypot(b.x - from.x, b.y - from.y) / spacing));
      for (let s = 1; s <= steps; s++) {
        const k = s / steps;
        const mix = (u, v) => u + (v - u) * k;
        count = stamp(
          count,
          mix(from.x, b.x),
          mix(from.y, b.y),
          (mix(from.width, b.width) / 2) * fade,
          [mix(from.pole[0], b.pole[0]), mix(from.pole[1], b.pole[1]), mix(from.pole[2], b.pole[2])],
          mix(from.edge, b.edge),
          fade,
          b.color
        );
      }
    }
    if (count) {
      const { program, uniforms, vao, instances } = floor.strokes;
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, instances);
      gl.bufferData(gl.ARRAY_BUFFER, strokeData.subarray(0, count * STROKE_SIZE), gl.STREAM_DRAW);
      gl.uniform2f(uniforms.view, bandWidth, bandHeight);
      gl.uniform1f(uniforms.scroll, band);
      gl.uniform1f(uniforms.ratio, pixelRatio);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    }
    const visible = splashes.filter(({ y, size }) => y + size / 2 >= top && y - size / 2 <= bottom);
    if (visible.length) {
      const { program, uniforms, vao } = floor.sprites;
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(uniforms.view, bandWidth, bandHeight);
      gl.uniform1f(uniforms.scroll, band);
      gl.uniform1i(uniforms.sprite, 0);
      gl.activeTexture(gl.TEXTURE0);
      for (const item of visible) {
        const { x, y, texture, size } = item;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform4f(uniforms.rect, x, y, size, size);
        gl.uniform1f(uniforms.alpha, life(item, now));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
    const pressed = prints.filter(({ y }) => y >= top && y <= bottom);
    if (pressed.length) {
      if (printData.length < pressed.length * PRINT_SIZE) {
        printData = new Float32Array(pressed.length * PRINT_SIZE * 2);
      }
      pressed.forEach((item, i) => {
        const { x, y, direction, along, orient, color } = item;
        printData.set([x, y, ...direction, along, life(item, now), ...orient, ...color], i * PRINT_SIZE);
      });
      const { program, uniforms, vao, instances } = floor.prints;
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, instances);
      gl.bufferData(gl.ARRAY_BUFFER, printData.subarray(0, pressed.length * PRINT_SIZE), gl.STREAM_DRAW);
      gl.uniform2f(uniforms.view, bandWidth, bandHeight);
      gl.uniform1f(uniforms.scroll, band);
      gl.uniform1f(uniforms.across, radius * 0.9);
      gl.uniform1f(uniforms.radius, radius);
      applyLabel(gl, floor, uniforms);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, floor.initials);
      gl.uniform1i(uniforms.initials, 1);
      gl.uniform1i(uniforms.cut, 0);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, pressed.length);
      gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1i(uniforms.cut, 1);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, pressed.length);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  }

  function step(now) {
    if (!active) {
      frame = 0;
      return;
    }
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    // Native jumps (Home, the scrollbar, back-to-top) must not retain a virtual camera offset.
    if (scrollY <= 0 || !bottomed()) resetRunout();
    coast(dt);
    const climbing = plunge < depth;
    // A handed-off fling already moves smoothly, so the camera rides it directly instead of easing after it.
    gliding &&= glide > 0;
    depth = gliding || Math.abs(plunge - depth) < 0.5 ? plunge : depth + (plunge - depth) * (1 - Math.exp(-dt / 0.12));
    swell();
    const shift = camera() - lastScroll;
    const crossed = camera() > track.exit !== lastScroll > track.exit;
    lastScroll = camera();
    const before = position;
    let jumped = trailGap || crossed || Math.abs(shift) > innerHeight / 2;
    trailGap = false;
    const grounded = height === 0;
    const run = overrun();
    const [x, y] = corner();
    const destination = [x, y + camera()];
    cycleColor(now);
    const backgroundSettled = fadeGlass(now);

    if (run === 0) {
      // An interrupted free interaction must never pull the ball diagonally through the card.
      jumped ||= (!parked && !returning) || Math.abs(before[0] - track.x) > 1;
      if (!parked || height > 0) park();
    } else if (!parked) {
      if (shift > 0) returning = null;
      if (shift < 0 && run <= Math.max(innerHeight / 2, radius * 6) && !returning) {
        returning = { distance: run, end: Math.min(unit, run / 2), offset: position.map((v, i) => v - destination[i]) };
        height = lift = 0;
        velocity = [0, 0];
        spinning = [0, 0, 0];
        tilt = target = null;
      }
      if (returning && run <= returning.end) park();
      if (!returning) homing();
    }

    const following = parked || returning;
    const [tx, ty] = following ? destination : target ? [target[0], target[1] + camera()] : position;
    if (following) {
      // Automatic motion is a function of scroll position, with no spring or accumulated velocity.
      const ease = returning ? easeInOut(Math.min((run - returning.end) / (returning.distance - returning.end), 1)) : 0;
      position = destination.map((v, i) => v + (returning ? returning.offset[i] * ease : 0));
      velocity = [0, 0];
    } else {
      if (grounded) {
        const ax = tilt ? TILT * tilt[0] - FRICTION * velocity[0] : STIFFNESS * (tx - position[0]) - DAMPING * velocity[0];
        const ay = tilt ? TILT * tilt[1] - FRICTION * velocity[1] : STIFFNESS * (ty - position[1]) - DAMPING * velocity[1];
        velocity = [velocity[0] + ax * dt, velocity[1] + ay * dt];
        turn(ax, ay, now);
      }
      const rush = Math.hypot(...velocity) / TOP_SPEED;
      if (rush > 1) velocity = velocity.map((v) => v / rush);
      position = [position[0] + velocity[0] * dt, position[1] + velocity[1] * dt];
      if (tilt) bounce(now);
    }
    if (height > 0) {
      lift -= GRAVITY * dt;
      height += lift * dt;
      if (height <= 0) land(now);
    }
    if (run > 0) position[1] = Math.max(position[1], track.bottom + radius * (1 + height / 500));

    const ground = position.map((v, i) => (dt > 0 ? (v - before[i]) / dt : 0));
    const speed = Math.hypot(...ground);
    if (height === 0) spinning = [ground[1] / radius, -ground[0] / radius, 0];
    rotation = spin(rotation, spinning, dt);
    const turning = Math.hypot(...spinning);
    blur = turning * dt > 1e-6 ? [...spinning.map((v) => v / turning), Math.min(turning * dt, Math.PI)] : [0, 0, 1, 0];

    if (palette().length) ink = contactColor().map(toGamma);
    const previous = points.at(-1);
    if (height === 0) {
      const gap = jumped || !grounded || !previous || previous.lifted;
      const pace = climbing && unwind ? speed / unwind : speed;
      const goal = radius * (THIN + (WIDE - THIN) * Math.exp(-pace / 200));
      if (gap) stroke = radius * THIN;
      const ease = goal > stroke ? SWELL : NARROW;
      stroke += (goal - stroke) * (1 - Math.exp(-dt / ease));
      const width = stroke;
      if (gap || Math.hypot(position[0] - previous.x, position[1] - previous.y) > 1.5) {
        const pole = rotate(rotation, [0, 0, -1]);
        points.push({ x: position[0], y: position[1], width, pole, edge: paintEdge(), gap, color: ink, time: now });
        press(now, ground);
      } else {
        // Keep the original timestamp so stationary ink can fade and the loop can sleep.
        previous.width = width;
      }
    } else if (previous) {
      previous.lifted = true;
    }
    retire(now);
    let broken = false;
    points = points.filter((point) => {
      if (life(point, now) <= 0) return !(broken = true);
      if (broken) point.gap = true;
      broken = false;
      return true;
    });
    splashes = splashes.filter((splash) => {
      const alive = life(splash, now) > 0;
      if (!alive) trailGl.deleteTexture(splash.texture);
      return alive;
    });
    prints = prints.filter((print) => life(print, now) > 0);

    const lit = aim(dt);
    const toned = blend(dt);
    paintTrail(now);
    paintSphere();
    place();
    updateSettingsVisibility();

    const resting =
      !glide &&
      depth === plunge &&
      lit &&
      toned &&
      backgroundSettled &&
      height === 0 &&
      speed < 0.5 &&
      (following || Math.hypot(tx - position[0], ty - position[1]) < 0.5);
    frame = resting && [points, splashes, prints].every((items) => items.every(lasting)) ? 0 : requestAnimationFrame(step);
  }

  function aim(dt) {
    let goal = LIGHT;
    if (glare) {
      // Keep the lamp within ~54° of the view axis so a distant cursor never leaves the ball in shadow.
      const x = (glare[0] - position[0]) / LAMP;
      const y = (glare[1] - position[1] + camera()) / LAMP;
      const reach = Math.max(1, Math.hypot(x, y) / SLANT);
      goal = normalize([x / reach, y / reach, -1]);
    }
    if (Math.hypot(...goal.map((v, i) => v - lamp[i])) < 0.002) {
      lamp = goal;
      return true;
    }
    lamp = normalize(lamp.map((v, i) => v + (goal[i] - v) * (1 - Math.exp(-dt / 0.08))));
    return false;
  }

  function turn(ax, ay, now) {
    const speed = Math.hypot(...velocity);
    if (speed < 80 || !inked()) return;
    const along = (ax * velocity[0] + ay * velocity[1]) / speed;
    const px = ax - (along * velocity[0]) / speed;
    const py = ay - (along * velocity[1]) / speed;
    const lateral = Math.hypot(px, py);
    if (lateral < TURN || Math.random() > (lateral - TURN) / (TURN * 3)) return;
    const outward = Math.atan2(-py, -px);
    const forward = Math.atan2(velocity[1], velocity[0]);
    const angle = outward + Math.atan2(Math.sin(forward - outward), Math.cos(forward - outward)) / 3;
    splash(angle, 0.9, 1 + Math.floor(Math.random() * 3), 0.5 + speed / 700, now);
  }

  function bounce(now) {
    const walls = [
      [0, radius, innerWidth - radius],
      [1, camera() + radius, camera() + innerHeight - radius],
    ];
    for (const [axis, min, max] of walls) {
      const side = position[axis] < min ? -1 : position[axis] > max ? 1 : 0;
      if (!side) continue;
      position[axis] = side < 0 ? min : max;
      const impact = Math.abs(velocity[axis]);
      velocity[axis] = impact > 60 ? -velocity[axis] * 0.45 : 0;
      if (height === 0 && impact > 250 && inked()) {
        const angle = axis ? (side > 0 ? Math.PI / 2 : -Math.PI / 2) : side > 0 ? 0 : Math.PI;
        splash(angle, 2, Math.min(16, Math.round(impact / 60)), 0.3 + impact / 900, now);
      }
    }
  }

  function land(now) {
    height = 0;
    const impact = -lift;
    if (inked() && impact > 450) {
      const count = Math.min(28, Math.round(impact / 35));
      splash(0, Math.PI * 2, count, 0.4 + impact / 450, now);
    }
    lift = impact * BOUNCE > 120 ? impact * BOUNCE : 0;
    if (lift) height = 0.01;
    const rolling = [-spinning[1] * radius, spinning[0] * radius];
    velocity = velocity.map((v, i) => (5 * v + 2 * rolling[i]) / 7);
  }

  function jump(event) {
    if (event.pointerType === "mouse") nativeFling = false;
    if (parked || returning || !overrun() || event.pointerType !== "mouse" || event.button !== 0 || inSettings(event)) return;
    hop();
  }

  function twirl() {
    const speed = Math.hypot(...velocity);
    const roll = 1.2 + Math.random() * 0.8;
    const twist = (Math.random() < 0.5 ? -1 : 1) * (speed * 0.6 + lift * 0.4);
    spinning = [(velocity[1] / radius) * roll, (-velocity[0] / radius) * roll, twist / radius];
  }

  function hop(power = 1) {
    if (!position || height > 0 || returning || !overrun()) return;
    lift = JUMP * power;
    height = 0.01;
    twirl();
    wake();
  }

  function wake() {
    if (frame || !active || !position) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  }

  function groove() {
    const card = mainCard?.getBoundingClientRect();
    const content = document.querySelector(".post-list, .featured-posts")?.getBoundingClientRect();
    if (!card || !content || content.left - card.left < unit * 2) return null;
    return card.left + unit;
  }

  function measureTrack() {
    const card = mainCard?.getBoundingClientRect();
    const title = heading?.getBoundingClientRect();
    const lane = narrow.matches ? null : groove();
    const bottom = card ? card.bottom + scrollY : 0;
    const floor = document.documentElement.clientHeight - unit * 2.5;
    const start = title ? (title.top + title.bottom) / 2 + scrollY : floor;
    // Keep the route downward even in a short viewport, or when the whole card fits on screen.
    const end = card ? Math.max(start, Math.min(floor, (bottom + unit + start) / 2)) : floor;
    const heights = [...(mainCard?.querySelectorAll(CARD_SELECTOR) ?? [])]
      .map((card) => card.getBoundingClientRect().height)
      .filter((height) => height > 0)
      .sort((a, b) => a - b);
    const middle = Math.floor(heights.length / 2);
    const cardHeight = heights.length ? (heights[middle] + heights[Math.floor((heights.length - 1) / 2)]) / 2 : innerHeight / 2;
    const next = {
      x: narrow.matches ? unit * 1.25 : (lane ?? document.documentElement.clientWidth - unit * 2.5),
      start,
      end,
      bottom,
      // At this scroll position the ball's top, not its center, reaches the panel's actual bottom.
      exit: Math.max(0, bottom + unit - end),
      cardHeight: Math.max(1, cardHeight),
    };
    if (Object.keys(next).some((key) => Math.abs(next[key] - track[key]) > 0.01)) {
      trailGap = true;
      returning = null;
    }
    track = next;
  }

  function corner() {
    const scrolled = track.exit > 0 ? Math.min(camera() / track.exit, 1) : 1;
    const y = track.start + (track.end - track.start) * easeInOut(scrolled);
    // Drift toward mid-screen over eight screens of runout, so running out of page never yanks the ball back up.
    return [ski(track.x), y + (innerHeight / 2 - y) * smooth(innerHeight * 8)];
  }

  function overrun() {
    if (!runout) return 0;
    return Math.max(0, camera() - track.exit);
  }

  function easeInOut(t) {
    return t * t * (3 - 2 * t);
  }

  // How far into the runout the page has been pushed, over `span` pixels, eased in and out.
  function smooth(span = runout + innerHeight) {
    const t = Math.min(overrun() / span, 1);
    return easeInOut(t);
  }

  function ski(x) {
    const run = overrun();
    if (!run) return x;
    const width = document.documentElement.clientWidth;
    const ease = smooth();
    const noise = Math.sin(run / 310) * 0.5 + Math.sin(run / 170 + 1.7) * 0.3 + Math.sin(run / 530 + 4.1) * 0.2;
    const drift = Math.min(Math.max(width / 2 + noise * width * 0.3, radius * 1.5), width - radius * 1.5);
    // Ease the bounds too: the narrow-screen lane can start left of the grown ball's inset.
    return x + (drift - x) * ease;
  }

  function homing() {
    const [x, y] = corner();
    const distance = Math.hypot(position[0] - x, position[1] - camera() - y);
    if (distance > radius * 3) armed = true;
    if (armed && height === 0 && distance < radius * 0.5) park();
  }

  function park() {
    parked = true;
    armed = false;
    returning = tilt = target = null;
    velocity = [0, 0];
    spinning = [0, 0, 0];
    height = lift = 0;
    dock.classList.remove("ball__dock--visible");
    document.body.append(handle);
  }

  function release() {
    if (!overrun() || returning) return;
    parked = false;
    handle.remove();
    dock.classList.add("ball__dock--visible");
    target = null;
    if (typeof window.DeviceOrientationEvent?.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((state) => state === "granted" && listen())
        .catch(() => {});
    } else {
      listen();
    }
    hop();
  }

  function follow(event) {
    if (event.pointerType !== "mouse" || inSettings(event)) return;
    glare = [event.clientX, event.clientY];
    if (!parked && !returning && overrun()) target = [event.clientX, event.clientY];
    wake();
  }

  function bottomed() {
    return scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
  }

  function resetRunout() {
    depth = plunge = unwind = glide = fling = 0;
    gliding = false;
    document.documentElement.style.overscrollBehaviorY = "";
  }

  function shove(distance) {
    if (distance > 0) unwind = 0;
    else unwind ||= Math.max(UNWIND, plunge / (2 * innerHeight));
    plunge = Math.max(0, plunge + (distance < 0 ? distance * unwind : distance));
  }

  function nativeScroll(event) {
    // Search results live in shadow DOM, so inspect the composed path rather than just the target.
    for (const element of event.composedPath()) {
      if (element === document.body || element === document.documentElement) break;
      if (!(element instanceof Element)) continue;
      if (
        element.matches(
          "dialog, [role='dialog'], [aria-modal='true'], ninja-keys, .ball__settings, .ball__settings-trigger, input, textarea, select, [contenteditable]"
        )
      )
        return true;
      if (element.scrollHeight > element.clientHeight && /auto|scroll|overlay/.test(getComputedStyle(element).overflowY)) return true;
    }
    return false;
  }

  function travel(distance, event) {
    if (event.defaultPrevented || !event.cancelable || event.ctrlKey || !distance || !bottomed() || (distance < 0 && !depth) || nativeScroll(event)) {
      return false;
    }
    event.preventDefault();
    shove(distance);
    wake();
    return true;
  }

  function coast(dt) {
    if (!glide) return;
    shove(glide * dt);
    glide *= Math.exp(-dt / 0.5);
    if (Math.abs(glide) < 20 || (glide < 0 && !plunge)) glide = 0;
  }

  // A native fling that hits the bottom hands its speed to the runout, so the ball rolls on instead of stopping dead.
  // Wheels and fingers drive the runout themselves; this only catches momentum the browser was coasting on.
  function handoff() {
    const now = performance.now();
    const dt = flick ? (now - flick.time) / 1000 : 0;
    const moved = flick ? scrollY - flick.y : 0;
    const continuous = dt > 0 && dt < 0.1 && Math.abs(moved) < innerHeight / 2;
    if (!continuous) nativeFling = false;
    const speed = continuous ? flick.speed * 0.2 + (moved / dt) * 0.8 : 0;
    const arrived = bottomed() && flick && !flick.bottomed;
    const carry = arrived && continuous ? Math.max(flick.speed, speed) : 0;
    flick = { y: scrollY, time: now, speed, bottomed: bottomed() };
    const overscroll = overrun() > 0 ? "none" : "";
    if (document.documentElement.style.overscrollBehaviorY !== overscroll) document.documentElement.style.overscrollBehaviorY = overscroll;
    if (arrived && nativeFling && !touching && !wheeling && carry > 0 && !depth) {
      nativeFling = false;
      glide = carry;
      gliding = true;
      wake();
    }
  }

  function dive(event) {
    wheeling = true;
    nativeFling = gliding = false;
    glide = 0;
    travel(event.deltaY * (event.deltaMode === 1 ? 16 : 1), event);
  }

  function drag(event) {
    touching = event.type === "touchstart" || event.type === "touchmove";
    wheeling = false;
    if (event.type === "touchcancel" || event.touches.length > 1 || inSettings(event)) {
      swipe = null;
      fling = glide = 0;
      nativeFling = false;
      return;
    }
    if (event.type === "touchend") {
      nativeFling = !!swipe && performance.now() - swipe.time < 100;
      glide = nativeFling ? fling : 0;
      if (glide) wake();
      return;
    }
    const y = event.touches[0].clientY;
    const time = performance.now();
    if (event.type === "touchstart") {
      nativeFling = false;
      glide = 0;
      fling = 0;
    } else if (swipe) {
      const moved = travel(swipe.y - y, event);
      const dt = Math.max(time - swipe.time, 1) / 1000;
      fling = moved ? fling * 0.2 + ((swipe.y - y) / dt) * 0.8 : 0;
    }
    swipe = { y, time };
  }

  function touch(event) {
    if (parked || returning || !overrun() || event.touches.length !== 1 || inSettings(event)) return;
    if (tilt) {
      if (event.type === "touchstart") hop();
      return;
    }
    const { clientX, clientY } = event.touches[0];
    target = [clientX, clientY];
    wake();
  }

  function orient({ beta, gamma }) {
    if (parked || returning || !overrun() || beta == null || gamma == null) return;
    level ??= beta;
    const x = Math.sin((gamma * Math.PI) / 180);
    const y = Math.sin(((beta - level) * Math.PI) / 180);
    const turned = ((screen.orientation?.angle ?? 0) * Math.PI) / 180;
    const cos = Math.cos(turned);
    const sin = Math.sin(turned);
    tilt = [x * cos + y * sin, y * cos - x * sin].map((v) => (Math.abs(v) < 0.03 ? 0 : v));
    target = null;
    wake();
  }

  function listen() {
    if (active) on(window, "deviceorientation", orient);
  }

  function on(target, type, callback, options = {}) {
    target.addEventListener(type, callback, { ...options, signal: listeners.signal });
  }

  function inSettings(event) {
    return settingsPanel?.contains(event.target) || settingsTrigger?.contains(event.target);
  }

  function applyAppearance() {
    shadow.hidden = !appearance.shadow;
    sphere.classList.toggle("ball__sphere--grounded", appearance.shadow);
    syncColorStage();
    accent = selectedColor();
    mixPaint();
    drawn = null;
    wake();
  }

  function setSettingsOpen(open) {
    if (!settingsPanel || !settingsTrigger) return;
    settingsPanel.classList.toggle("ball__settings--open", open);
    settingsPanel.inert = !open;
    settingsPanel.setAttribute("aria-hidden", String(!open));
    settingsTrigger.setAttribute("aria-expanded", String(open));
  }

  function updateSettingsVisibility() {
    if (!settingsTrigger) return;
    const visible = overrun() > innerHeight * 0.75;
    if (visible === settingsTrigger.classList.contains("ball__settings-trigger--visible")) return;
    settingsTrigger.classList.toggle("ball__settings-trigger--visible", visible);
    if (!visible) setSettingsOpen(false);
  }

  function setupSettings() {
    if (!settingsPanel || !settingsTrigger) return;
    const controls = settingsPanel.elements;
    for (const [name, value] of Object.entries(appearance)) {
      const control = controls.namedItem(name);
      if (typeof value === "boolean") control.checked = value;
      else control.value = value;
    }
    settingsPanel.style.setProperty("--ball-custom", appearance.custom);
    const stampButton = settingsPanel.querySelector(".ball__settings-stamp");
    const stamps = { android: "Android", code: "代码", star: "星形", hole: "留白" };
    const updateStamp = () => {
      const name = controls.stamp.value;
      stampButton.style.setProperty("--stamp", labelSources[name] ? `url("${labelSources[name]}")` : "none");
      stampButton.classList.toggle("ball__settings-stamp--hole", name === "hole");
      stampButton.setAttribute("aria-label", `${stamps[name]}，点击切换印章`);
    };
    updateStamp();
    on(stampButton, "click", () => {
      const names = Object.keys(stamps);
      controls.stamp.value = names[(names.indexOf(controls.stamp.value) + 1) % names.length];
      updateStamp();
      settingsPanel.dispatchEvent(new Event("input", { bubbles: true }));
    });
    on(settingsPanel, "click", (event) => {
      const mode = event.target.value;
      if (!Object.hasOwn(palettes, mode)) return;
      buildPalette(mode);
      if (appearance.color === mode) applyAppearance();
    });
    on(settingsPanel, "submit", (event) => event.preventDefault());
    on(settingsPanel, "input", (event) => {
      if (event.target === controls.custom) controls.color.value = "custom";
      appearance = {
        spotlight: controls.spotlight.checked,
        shading: controls.shading.checked,
        shadow: controls.shadow.checked,
        initials: controls.initials.checked,
        stamp: controls.stamp.value,
        size: Number(controls.size.value),
        color: controls.color.value,
        custom: controls.custom.value,
      };
      settingsPanel.style.setProperty("--ball-custom", appearance.custom);
      applyAppearance();
    });
    on(settingsTrigger, "click", () => setSettingsOpen(settingsTrigger.getAttribute("aria-expanded") !== "true"));
    on(settingsPanel, "keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setSettingsOpen(false);
      settingsTrigger.focus({ preventScroll: true });
    });
    [...settingsPanel.children].forEach((row, i, rows) => {
      row.style.setProperty("--rank", i);
      row.style.setProperty("--order", rows.length - 1 - i);
    });
    setSettingsOpen(false);
    settingsPanel.hidden = false;
    settingsTrigger.hidden = false;
  }

  function start() {
    if (active || !moving.matches || !sphereGl || !trailGl) return;
    if (!ball) setupBall();
    if (!floor) setupFloor();
    active = true;
    listeners = new AbortController();
    document.body.classList.add("scroll-ball-active");
    document.body.prepend(trail);
    document.body.append(dock, shadow, sphere, handle);
    resize();
    for (const name of Object.keys(palettes)) {
      if (!palettes[name].length) buildPalette(name);
    }
    buildColors();
    for (const name of Object.keys(labelSources)) buildLabel(name);
    buildInitials();
    setupSettings();
    shadow.hidden = !appearance.shadow;
    sphere.classList.toggle("ball__sphere--grounded", appearance.shadow);
    const [x, y] = corner();
    position = [x, y + camera()];
    lastScroll = camera();
    paintSphere();
    place();
    wake();
    on(handle, "click", release);
    on(handle, "pointerenter", (event) => {
      if (event.pointerType === "mouse") hop(0.55);
    });
    on(window, "pointermove", follow, { passive: true });
    on(document.documentElement, "pointerleave", () => {
      glare = null;
      wake();
    });
    on(window, "pointerdown", jump, { passive: true });
    on(window, "touchstart", touch, { passive: true });
    on(window, "touchmove", touch, { passive: true });
    on(window, "wheel", dive, { passive: false });
    on(window, "touchstart", drag, { passive: true });
    on(window, "touchmove", drag, { passive: false });
    on(window, "touchend", drag, { passive: true });
    on(window, "touchcancel", drag, { passive: true });
    on(
      window,
      "scroll",
      () => {
        if (scrollY <= 0 || !bottomed()) resetRunout();
        handoff();
        wake();
      },
      { passive: true }
    );
    const remeasure = () => {
      if (!active) return;
      resize();
      wake();
    };
    on(window, "load", remeasure);
    on(document.fonts, "loadingdone", remeasure);
    document.fonts.ready.then(() => {
      remeasure();
    });
    resizeObserver = new ResizeObserver(remeasure);
    for (const element of [document.body, sphere, mainCard, heading, ...(mainCard?.querySelectorAll(CARD_SELECTOR) ?? [])]) {
      if (element) resizeObserver.observe(element);
    }
    on(window, "resize", remeasure);
    for (const target of [dark, forcedColors, window])
      on(target, target === window ? "themechange" : "change", () => {
        buildColors();
        wake();
      });
    themeObserver = new MutationObserver(() => {
      if (!active) return;
      buildColors();
      wake();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    for (const [canvas, setup] of [
      [sphere, setupBall],
      [trail, setupFloor],
    ]) {
      on(canvas, "webglcontextlost", (event) => {
        event.preventDefault();
        resetGlassPalette();
        wake();
      });
      on(canvas, "webglcontextrestored", () => {
        setup();
        buildColors();
        wake();
      });
    }
  }

  function stop() {
    if (!active) return;
    active = false;
    resetGlassPalette();
    cancelAnimationFrame(frame);
    frame = 0;
    listeners.abort();
    resizeObserver.disconnect();
    themeObserver.disconnect();
    setSettingsOpen(false);
    if (settingsPanel) settingsPanel.hidden = true;
    if (settingsTrigger) {
      settingsTrigger.hidden = true;
      settingsTrigger.classList.remove("ball__settings-trigger--visible");
    }
    document.body.classList.remove("scroll-ball-active");
    for (const element of [trail, sphere, shadow, handle, dock]) element.remove();
    for (const splash of splashes) trailGl.deleteTexture(splash.texture);
    points = [];
    splashes = [];
    prints = [];
    position = target = glare = tilt = level = swipe = returning = null;
    velocity = [0, 0];
    spinning = [0, 0, 0];
    rotation = [0, 0, 0, 1];
    blur = [0, 0, 1, 0];
    height = lift = depth = plunge = unwind = glide = fling = deepest = tone = 0;
    gliding = nativeFling = touching = wheeling = false;
    trailGap = true;
    flick = null;
    document.documentElement.style.overscrollBehaviorY = "";
    grow = 1;
    lamp = LIGHT;
    parked = true;
    armed = false;
    dock.classList.remove("ball__dock--visible");
    drawn = null;
  }

  moving.addEventListener("change", () => (moving.matches ? start() : stop()));
  start();
})();
