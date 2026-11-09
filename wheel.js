// Rotating feelings wheel. Three concentric rings (core, secondary, tertiary)
// sweep in from the left edge; whatever lines up on the horizontal row is the feeling.
(function () {
  var body = document.body;
  var canvas = document.getElementById("wheelCanvas");
  var ctx = canvas.getContext("2d");
  var textBox = document.getElementById("wheelText");
  var phrase = document.getElementById("wheelPhrase");
  var hint = document.getElementById("wheelHint");
  var live = document.getElementById("wheelLive");
  var toggle = document.getElementById("toggleView");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var TAU = Math.PI * 2;
  var BG = "#0c0e12";

  // Flatten the data: every tertiary word gets one equal slot around the wheel.
  var tert = [], secs = [], cores = [];
  WHEEL.forEach(function (c) {
    var cStart = tert.length;
    Object.keys(c.children).forEach(function (sName) {
      var sStart = tert.length;
      c.children[sName].forEach(function (t) {
        tert.push({ name: t, sec: sName, core: c.name, color: c.color });
      });
      secs.push({ name: sName, core: c.name, color: c.color, start: sStart, end: tert.length });
    });
    cores.push({ name: c.name, color: c.color, start: cStart, end: tert.length });
  });
  var N = tert.length;
  var SLOT = TAU / N;

  var W, H, dpr, fs, cx, cy, R0, R1, R2, R3, wide;
  // Rotation: slot i is on the row when rot = (i + 0.5) * SLOT. Opens on "calm".
  var startIdx = Math.max(0, tert.findIndex(function (t) { return t.name === "calm"; }));
  var rot = (startIdx + 0.5) * SLOT;
  var isOpen = false;
  var frame = 0, anim = null, lastSel = -1, wheelTimer = 0;

  function norm(a) {
    a = a % TAU;
    if (a > Math.PI) a -= TAU;
    if (a <= -Math.PI) a += TAU;
    return a;
  }
  function mod(n, m) { return ((n % m) + m) % m; }
  function font(size) { return "400 " + size + 'px "Cormorant Garamond", Georgia, serif'; }
  function selIndex() { return mod(Math.round(rot / SLOT - 0.5), N); }
  // Soft fade away from the row, for a calm vignette.
  function fade(a) { return Math.pow(Math.max(0, Math.cos(a)), 6); }

  function layout() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    fs = W < 600 ? 15 : (W < 1000 ? 17 : 19);

    function widest(list, size) {
      ctx.font = font(size);
      return Math.max.apply(null, list.map(function (x) { return ctx.measureText(x.name).width; }));
    }
    var wc = widest(cores, fs + 2) + fs * 2.2;
    var ws = widest(secs, fs) + fs * 2;
    var wt = widest(tert, fs) + fs * 2;

    // Make the outer ring big enough that each word gets a readable line.
    R2 = (fs * 1.45) / SLOT;
    R1 = R2 - ws;
    R0 = R1 - wc;
    R3 = R2 + wt;

    var left = W < 600 ? 14 : Math.min(80, W * 0.05);
    var ringW = R3 - R0;
    cx = left - R0;
    wide = W - (left + ringW) > 340;
    cy = wide ? H / 2 : H * 0.58;

    textBox.classList.toggle("wide", wide);
    if (wide) {
      textBox.style.left = (left + ringW + 36) + "px";
      textBox.style.top = cy + "px";
    } else {
      textBox.style.left = "";
      textBox.style.top = "";
    }
  }

  function sector(rIn, rOut, a0, a1) {
    ctx.beginPath();
    ctx.arc(cx, cy, rOut, a0, a1);
    ctx.arc(cx, cy, rIn, a1, a0, true);
    ctx.closePath();
  }

  function label(text, angle, radius, color, alpha, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = font(size);
    ctx.fillText(text, radius, 0);
    ctx.restore();
  }

  function visible(a0, a1) { return a1 > -Math.PI / 2 && a0 < Math.PI / 2; }

  // Draws a ring of grouped segments (core or secondary) with labels that stick to the row.
  function drawGroups(list, rIn, rOut, selKey, sel, baseAlpha, selAlpha, size) {
    list.forEach(function (g) {
      var half = (g.end - g.start) * SLOT / 2;
      var mid = norm(((g.start + g.end) / 2) * SLOT - rot);
      var a0 = mid - half, a1 = mid + half;
      if (!visible(a0, a1)) return;
      var isSel = selKey(g, sel);
      var near = Math.max(a0, Math.min(0, a1));

      sector(rIn, rOut, a0, a1);
      ctx.globalAlpha = (isSel ? selAlpha : baseAlpha) * (0.35 + 0.65 * fade(near));
      ctx.fillStyle = g.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeStyle = BG;
      ctx.stroke();

      var pad = SLOT * 0.6;
      var la = a1 - a0 > pad * 2 ? Math.max(a0 + pad, Math.min(0, a1 - pad)) : mid;
      // Keep neighbouring labels clear of the row so it reads cleanly.
      var gap = SLOT * 2.2;
      if (!isSel && Math.abs(la) < gap) {
        la = la < 0 || (la === 0 && mid < 0) ? -gap : gap;
        if (la < a0 + pad || la > a1 - pad) la = mid;
      }
      label(g.name, la, rIn + fs * 0.9, g.color, isSel ? 1 : 0.1 + 0.7 * fade(la), size);
    });
  }

  function draw() {
    frame = 0;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    var sel = selIndex();
    var st = tert[sel];

    drawGroups(cores, R0, R1, function (g) { return g.name === st.core; }, sel, 0.17, 0.36, fs + 2);
    drawGroups(secs, R1, R2, function (g) { return g.core === st.core && g.name === st.sec; }, sel, 0.1, 0.28, fs);

    for (var i = 0; i < N; i++) {
      var a0 = norm(i * SLOT - rot), a1 = a0 + SLOT, mid = a0 + SLOT / 2;
      if (!visible(a0, a1)) continue;
      var t = tert[i], isSel = i === sel;
      sector(R2, R3, a0, a1);
      ctx.globalAlpha = isSel ? 0.26 : 0.06 * (0.35 + 0.65 * fade(mid));
      ctx.fillStyle = t.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      ctx.strokeStyle = BG;
      ctx.stroke();
      label(t.name, mid, R2 + fs * 0.9, t.color, isSel ? 1 : 0.08 + 0.7 * fade(mid), fs);
    }

    // A faint tick marking the row.
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = st.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + R3 + 8, cy);
    ctx.lineTo(cx + R3 + 22, cy);
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (sel !== lastSel) {
      lastSel = sel;
      phrase.textContent = "";
      var span = document.createElement("span");
      span.className = "feeling";
      span.style.setProperty("--c", st.color);
      span.textContent = st.name;
      phrase.append("I’m feeling ", span, ".");
    }
  }

  function requestDraw() { if (!frame) frame = requestAnimationFrame(draw); }

  function settle() {
    var t = tert[selIndex()];
    live.textContent = "I’m feeling " + t.name + " (" + t.core + ", " + t.sec + ")";
  }

  function stopAnim() { anim = null; }

  function animateTo(target) {
    var from = rot, dist = Math.abs(target - from);
    if (reduceMotion || dist < 1e-6) { rot = target; requestDraw(); settle(); return; }
    var dur = Math.max(260, Math.min(900, 300 + (dist / SLOT) * 22));
    var start = performance.now();
    anim = { from: from, to: target };
    var mine = anim;
    (function step(now) {
      if (anim !== mine) return;
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      rot = from + (target - from) * e;
      draw();
      if (p < 1) requestAnimationFrame(step);
      else { anim = null; settle(); }
    })(start);
  }

  function snapTarget(r) { return (Math.round(r / SLOT - 0.5) + 0.5) * SLOT; }
  function goTo(i) { animateTo(rot + norm((i + 0.5) * SLOT - rot)); }
  function interacted() { hint.classList.add("gone"); }

  // Dragging: the wheel turns with the pointer, then glides and settles on a word.
  var drag = null;
  function pointerAngle(e) { return Math.atan2(e.clientY - cy, e.clientX - cx); }

  canvas.addEventListener("pointerdown", function (e) {
    stopAnim();
    interacted();
    drag = { a: pointerAngle(e), t: e.timeStamp, x: e.clientX, y: e.clientY, moved: 0, v: 0, start: e.timeStamp };
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var a = pointerAngle(e);
    var d = norm(a - drag.a);
    var dt = Math.max(1, e.timeStamp - drag.t);
    rot -= d;
    drag.v = 0.7 * (-d / dt) + 0.3 * drag.v;
    drag.a = a;
    drag.t = e.timeStamp;
    drag.moved += Math.abs(e.movementY || 0) + Math.abs(e.movementX || 0);
    requestDraw();
  });

  function endDrag(e) {
    if (!drag) return;
    var d = drag;
    drag = null;
    var dist = Math.hypot(e.clientX - d.x, e.clientY - d.y);
    if (dist < 6 && e.timeStamp - d.start < 400) {
      var r = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (r >= R0 && r <= R3) {
        goTo(mod(Math.floor((pointerAngle(e) + rot) / SLOT), N));
        return;
      }
    }
    var still = e.timeStamp - d.t > 80;
    animateTo(snapTarget(rot + (still ? 0 : d.v * 260)));
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    stopAnim();
    interacted();
    var dy = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
    rot += dy * 0.0009;
    requestDraw();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { animateTo(snapTarget(rot)); }, 140);
  }, { passive: false });

  canvas.addEventListener("keydown", function (e) {
    var sel = selIndex(), step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, PageDown: 5, PageUp: -5 }[e.key];
    if (step) { e.preventDefault(); interacted(); stopAnim(); goTo(mod(sel + step, N)); }
  });

  // Start on whatever the word view has narrowed down to so far.
  function syncFromWords() {
    var path = window.feelingPath || [];
    if (!path.length) return;
    var idx = -1;
    for (var i = 0; i < N; i++) {
      var t = tert[i];
      if (t.core === path[0] && (!path[1] || t.sec === path[1]) && (!path[2] || t.name === path[2])) { idx = i; break; }
    }
    if (idx >= 0) rot = (idx + 0.5) * SLOT;
  }

  toggle.addEventListener("click", function () {
    isOpen = !isOpen;
    body.classList.toggle("wheel-open", isOpen);
    toggle.textContent = isOpen ? "back to words" : "the wheel";
    if (isOpen) {
      stopAnim();
      syncFromWords();
      layout();
      draw();
      settle();
      canvas.focus({ preventScroll: true });
    }
  });

  // index.html#wheel opens straight onto the wheel.
  if (location.hash === "#wheel") toggle.click();

  window.addEventListener("resize", function () { if (isOpen) { layout(); requestDraw(); } });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { if (isOpen) { layout(); requestDraw(); } });
  }
})();
