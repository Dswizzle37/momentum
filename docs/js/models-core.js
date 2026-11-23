/* Model engine: mounts an interactive, animated model for a problem spec.
   A model definition: MODELS[type] = { title, tag, controls(p)->[{key,label,min,max,step,unit}], setup(p)->sim }
   sim = { tmax, loop, speed, draw(g,t), readouts(t)->[[label,value,unit,isAnswer]], graphs:[{title,ylabel,xlabel,series:[{f,color,name}], x0,x1, xOf?}], facts:[[label,value]] }
*/
(function () {
  const W = 640, H = 360;
  const COLORS = { v: "#1865f2", a: "#e8590c", F: "#d92916", N: "#7048e8", f: "#c2255c", T: "#0c8599", g: "#2b8a3e", p: "#5f3dc4", K: "#1865f2", U: "#2b8a3e", Us: "#0c8599", Eth: "#e8590c", E: "#21242c", ink: "#21242c", muted: "#868e96", grid: "#e9ecef", ground: "#495057" };
  const MODELS = {};
  const fmt = (x, n = 3) => (window.Phys ? window.Phys.sig(x, n) : (+x).toPrecision(n));

  // ---------- drawing helpers ----------
  const D = {
    COLORS,
    view(x0, x1, y0, y1, box, equal = true) {
      let sx = box.w / (x1 - x0), sy = box.h / (y1 - y0);
      if (equal) { const s = Math.min(sx, sy); sx = sy = s; }
      const ox = box.x + (box.w - (x1 - x0) * sx) / 2, oy = box.y + box.h - (box.h - (y1 - y0) * sy) / 2;
      return { X: (x) => ox + (x - x0) * sx, Y: (y) => oy - (y - y0) * sy, sx, sy, x0, x1, y0, y1 };
    },
    line(g, x1, y1, x2, y2, color = COLORS.ink, w = 1.5, dash) {
      g.save(); g.strokeStyle = color; g.lineWidth = w; if (dash) g.setLineDash(dash);
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore();
    },
    arrow(g, x1, y1, x2, y2, color = COLORS.ink, label, opt = {}) {
      const w = opt.w || 2.6, len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 1) return;
      const ang = Math.atan2(y2 - y1, x2 - x1), hs = Math.min(10, 4 + len * 0.25);
      g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = w; g.lineCap = "round";
      if (opt.dash) g.setLineDash(opt.dash);
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2 - Math.cos(ang) * hs * 0.8, y2 - Math.sin(ang) * hs * 0.8); g.stroke();
      g.setLineDash([]);
      g.beginPath(); g.moveTo(x2, y2);
      g.lineTo(x2 - hs * Math.cos(ang - 0.42), y2 - hs * Math.sin(ang - 0.42));
      g.lineTo(x2 - hs * Math.cos(ang + 0.42), y2 - hs * Math.sin(ang + 0.42)); g.closePath(); g.fill();
      g.restore();
      if (label) {
        const off = opt.off || 12;
        const lx = x2 + Math.cos(ang) * off + (opt.dx || 0), ly = y2 + Math.sin(ang) * off + (opt.dy || 0);
        D.text(g, label, lx, ly, { color, bold: true, size: opt.size || 12, align: "center", bg: true });
      }
    },
    text(g, s, x, y, o = {}) {
      g.save();
      g.font = `${o.bold ? "700 " : ""}${o.size || 12}px Lato, -apple-system, Helvetica, Arial, sans-serif`;
      g.textAlign = o.align || "left"; g.textBaseline = o.base || "middle";
      if (o.bg) {
        const m = g.measureText(s); const w = m.width + 6, h = (o.size || 12) + 4;
        const bx = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w + 3 : x - 3;
        g.fillStyle = o.bgColor || "rgba(255,255,255,.88)"; g.fillRect(bx, y - h / 2, w, h);
      }
      g.fillStyle = o.color || COLORS.ink; g.fillText(s, x, y); g.restore();
    },
    grid(g, v, step, o = {}) {
      g.save(); g.strokeStyle = COLORS.grid; g.lineWidth = 1;
      const sx = o.stepX || step, sy = o.stepY || step;
      for (let x = Math.ceil(v.x0 / sx) * sx; x <= v.x1 + 1e-9; x += sx) { g.beginPath(); g.moveTo(v.X(x), v.Y(v.y0)); g.lineTo(v.X(x), v.Y(v.y1)); g.stroke(); if (o.labels !== false) D.text(g, fmt(+x.toFixed(6), 3), v.X(x), v.Y(v.y0) + 9, { size: 10, color: COLORS.muted, align: "center" }); }
      for (let y = Math.ceil(v.y0 / sy) * sy; y <= v.y1 + 1e-9; y += sy) { g.beginPath(); g.moveTo(v.X(v.x0), v.Y(y)); g.lineTo(v.X(v.x1), v.Y(y)); g.stroke(); if (o.labels !== false) D.text(g, fmt(+y.toFixed(6), 3), v.X(v.x0) - 4, v.Y(y), { size: 10, color: COLORS.muted, align: "right" }); }
      if (o.units) { D.text(g, o.units[0], v.X(v.x1), v.Y(v.y0) + 20, { size: 11, color: COLORS.muted, align: "right" }); D.text(g, o.units[1], v.X(v.x0) - 4, v.Y(v.y1) - 10, { size: 11, color: COLORS.muted, align: "right" }); }
      g.restore();
    },
    niceStep(range, target = 8) {
      const raw = range / target, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
      return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
    },
    ground(g, x1, x2, y, color = COLORS.ground) {
      D.line(g, x1, y, x2, y, color, 2);
      g.save(); g.strokeStyle = "#adb5bd"; g.lineWidth = 1;
      for (let x = x1; x < x2; x += 10) { g.beginPath(); g.moveTo(x, y); g.lineTo(x - 7, y + 7); g.stroke(); }
      g.restore();
    },
    block(g, cx, cy, w, h, ang = 0, color = "#4dabf7", label) {
      g.save(); g.translate(cx, cy); g.rotate(ang);
      g.fillStyle = color; g.strokeStyle = "#1c3d6e"; g.lineWidth = 1.5;
      g.beginPath(); g.roundRect ? g.roundRect(-w / 2, -h / 2, w, h, 3) : g.rect(-w / 2, -h / 2, w, h); g.fill(); g.stroke();
      if (label) { g.fillStyle = "#fff"; g.font = "700 12px Lato, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(label, 0, 1); }
      g.restore();
    },
    ball(g, x, y, r, color = "#f76707", label) {
      g.save(); const grd = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
      grd.addColorStop(0, "#fff"); grd.addColorStop(0.25, color); grd.addColorStop(1, shade(color, -0.35));
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      if (label) { g.fillStyle = "#fff"; g.font = "700 11px Lato, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(label, x, y + 1); }
      g.restore();
    },
    spring(g, x1, y1, x2, y2, coils = 10, width = 10, color = "#495057") {
      const len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1);
      g.save(); g.translate(x1, y1); g.rotate(ang); g.strokeStyle = color; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0);
      const lead = Math.min(10, len * 0.1), body = len - 2 * lead, n = coils * 2;
      g.lineTo(lead, 0);
      for (let i = 1; i <= n; i++) g.lineTo(lead + (body * (i - 0.5)) / n, i % 2 ? -width : width);
      g.lineTo(lead + body, 0); g.lineTo(len, 0); g.stroke(); g.restore();
    },
    dim(g, x1, y1, x2, y2, label, color = "#868e96") {
      D.line(g, x1, y1, x2, y2, color, 1, [4, 3]);
      const a = Math.atan2(y2 - y1, x2 - x1), n = 5;
      [[x1, y1], [x2, y2]].forEach(([x, y]) => D.line(g, x - Math.sin(a) * n, y + Math.cos(a) * n, x + Math.sin(a) * n, y - Math.cos(a) * n, color, 1));
      if (label) D.text(g, label, (x1 + x2) / 2, (y1 + y2) / 2, { color: "#495057", size: 11, align: "center", bg: true });
    },
    arc(g, cx, cy, r, a0, a1, label, color = "#495057") {
      g.save(); g.strokeStyle = color; g.lineWidth = 1.3; g.beginPath(); g.arc(cx, cy, r, a0, a1, a1 < a0); g.stroke(); g.restore();
      if (label) { const am = (a0 + a1) / 2; D.text(g, label, cx + Math.cos(am) * (r + 14), cy + Math.sin(am) * (r + 14), { size: 11, align: "center", color }); }
    },
    // vertical energy bar chart (supports negative values)
    bars(g, x, y, w, h, items, vmax, title) {
      g.save();
      g.fillStyle = "#fff"; g.strokeStyle = "#dee2e6"; g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h);
      if (title) D.text(g, title, x + w / 2, y + 11, { size: 11, bold: true, align: "center", color: "#495057" });
      const neg = items.some((i) => i.value < -1e-9);
      const top = y + 24, bot = y + h - 22, zero = neg ? (top + bot) / 2 : bot, span = neg ? (bot - top) / 2 : bot - top;
      const bw = (w - 16) / items.length;
      D.line(g, x + 4, zero, x + w - 4, zero, "#868e96", 1);
      items.forEach((it, i) => {
        const bh = vmax > 0 ? Math.max(-span, Math.min(span, (it.value / vmax) * span)) : 0;
        const bx = x + 8 + i * bw + bw * 0.15;
        g.fillStyle = it.color; g.fillRect(bx, zero - Math.max(bh, 0), bw * 0.7, Math.abs(bh));
        D.text(g, it.label, bx + bw * 0.35, bot + 11, { size: 10, align: "center", color: "#495057", bold: true });
        D.text(g, fmt(it.value, 3), bx + bw * 0.35, bh >= 0 ? zero - bh - 8 : zero - bh + 8, { size: 9, align: "center", color: it.color });
      });
      g.restore();
    },
    label(g, s, x, y, color) { D.text(g, s, x, y, { size: 11, color: color || "#495057", bg: true }); },
  };
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + c * amt)));
    return `rgb(${f(r)},${f(gg)},${f(b)})`;
  }

  // ---------- graph ----------
  function Graph(canvas, spec) {
    const GW = 300, GH = 170, dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = GW * dpr; canvas.height = GH * dpr;
    const g = canvas.getContext("2d"); g.scale(dpr, dpr);
    const x0 = spec.x0 || 0, x1 = spec.x1;
    const N = 240; const pts = spec.series.map((s) => { const a = []; for (let i = 0; i <= N; i++) { const x = x0 + ((x1 - x0) * i) / N; const y = s.f(x); a.push([x, isFinite(y) ? y : NaN]); } return a; });
    let ymin = spec.ymin, ymax = spec.ymax;
    if (ymin == null || ymax == null) {
      const ys = pts.flat().map((p) => p[1]).filter(isFinite); let lo = Math.min(0, ...ys), hi = Math.max(0, ...ys);
      if (hi - lo < 1e-9) { hi += 1; lo -= 1; }
      const pad = (hi - lo) * 0.1; if (ymin == null) ymin = lo - (lo < 0 ? pad : 0); if (ymax == null) ymax = hi + pad;
    }
    const box = { x: 42, y: 22, w: GW - 52, h: GH - 50 };
    const X = (x) => box.x + ((x - x0) / (x1 - x0)) * box.w, Y = (y) => box.y + box.h - ((y - ymin) / (ymax - ymin)) * box.h;
    const bg = document.createElement("canvas"); bg.width = GW * dpr; bg.height = GH * dpr; const b = bg.getContext("2d"); b.scale(dpr, dpr);
    b.fillStyle = "#fff"; b.fillRect(0, 0, GW, GH);
    D.text(b, spec.title || "", 8, 10, { size: 11, bold: true, color: "#343a40" });
    const ys = D.niceStep(ymax - ymin, 4), xs = D.niceStep(x1 - x0, 5);
    b.strokeStyle = COLORS.grid; b.lineWidth = 1;
    for (let y = Math.ceil(ymin / ys) * ys; y <= ymax; y += ys) { b.beginPath(); b.moveTo(box.x, Y(y)); b.lineTo(box.x + box.w, Y(y)); b.stroke(); D.text(b, fmt(+y.toFixed(8), 3), box.x - 4, Y(y), { size: 9, align: "right", color: COLORS.muted }); }
    for (let x = Math.ceil(x0 / xs) * xs; x <= x1 + 1e-9; x += xs) { b.beginPath(); b.moveTo(X(x), box.y); b.lineTo(X(x), box.y + box.h); b.stroke(); D.text(b, fmt(+x.toFixed(8), 3), X(x), box.y + box.h + 9, { size: 9, align: "center", color: COLORS.muted }); }
    if (ymin < 0 && ymax > 0) D.line(b, box.x, Y(0), box.x + box.w, Y(0), "#868e96", 1);
    D.line(b, box.x, box.y, box.x, box.y + box.h, "#868e96", 1);
    D.text(b, spec.xlabel || "t (s)", box.x + box.w, GH - 6, { size: 10, align: "right", color: COLORS.muted });
    if (spec.ylabel) D.text(b, spec.ylabel, box.x, 10, { size: 10, align: "left", color: COLORS.muted }) ;
    (spec.hlines || []).forEach((h) => { D.line(b, box.x, Y(h.y), box.x + box.w, Y(h.y), h.color || "#868e96", 1, [5, 4]); D.text(b, h.label, box.x + box.w - 2, Y(h.y) - 7, { size: 9, align: "right", color: h.color || "#868e96" }); });
    if (spec.shade) {
      const sh = spec.shade; b.save(); b.fillStyle = sh.color || "rgba(24,101,242,.15)"; b.beginPath(); b.moveTo(X(sh.a), Y(0));
      for (let i = 0; i <= 120; i++) { const x = sh.a + ((sh.b - sh.a) * i) / 120; b.lineTo(X(x), Y(spec.series[0].f(x))); }
      b.lineTo(X(sh.b), Y(0)); b.closePath(); b.fill(); b.restore();
    }
    pts.forEach((a, si) => {
      const s = spec.series[si]; b.save(); b.strokeStyle = s.color || COLORS.v; b.lineWidth = 2; if (s.dash) b.setLineDash(s.dash); b.beginPath();
      let pen = false; a.forEach(([x, y]) => { if (!isFinite(y) || y < ymin - (ymax - ymin) || y > ymax + (ymax - ymin)) { pen = false; return; } if (!pen) { b.moveTo(X(x), Y(y)); pen = true; } else b.lineTo(X(x), Y(y)); });
      b.stroke(); b.restore();
    });
    if (spec.series.length > 1) spec.series.forEach((s, i) => D.text(b, s.name || "", box.x + 6 + i * 58, box.y + 6, { size: 10, bold: true, color: s.color }));
    return {
      draw(t) {
        g.clearRect(0, 0, GW, GH); g.drawImage(bg, 0, 0, GW, GH);
        const xv = spec.xOf ? spec.xOf(t) : t;
        if (xv == null || !isFinite(xv)) return;
        const cx = X(Math.max(x0, Math.min(x1, xv)));
        if (spec.areaTo) { g.save(); g.fillStyle = "rgba(24,101,242,.18)"; g.beginPath(); g.moveTo(X(spec.areaTo.from), Y(0)); const a = spec.areaTo.from, bb = xv; for (let i = 0; i <= 80; i++) { const x = a + ((bb - a) * i) / 80; g.lineTo(X(x), Y(spec.series[0].f(x))); } g.lineTo(X(bb), Y(0)); g.closePath(); g.fill(); g.restore(); }
        D.line(g, cx, box.y, cx, box.y + box.h, "rgba(33,36,44,.35)", 1, [3, 3]);
        spec.series.forEach((s) => { const y = s.f(xv); if (isFinite(y) && y >= ymin && y <= ymax) { g.fillStyle = s.color || COLORS.v; g.beginPath(); g.arc(cx, Y(y), 4, 0, 7); g.fill(); } });
      },
    };
  }

  // ---------- mount ----------
  const ICON_PLAY = '<svg viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="#21242c"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 16 16"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="#21242c"/></svg>';
  const ICON_RESET = '<svg viewBox="0 0 16 16" fill="none" stroke="#21242c" stroke-width="1.8"><path d="M3 8a5 5 0 1 0 1.6-3.7"/><path d="M3 2v3h3"/></svg>';

  function mount(host, spec, opts = {}) {
    const def = MODELS[spec.type];
    if (!def) { host.innerHTML = `<p class="muted">No model for “${spec.type}”.</p>`; return { destroy() {} }; }
    const p = Object.assign({}, def.defaults || {}, spec);
    const el = document.createElement("div"); el.className = "model";
    const photos = ((window.PHOTOS || {})[opts.chapter] || []);
    const photo = photos.length ? photos[(spec.photo != null ? spec.photo : 0) % photos.length] : null;
    el.innerHTML = `<div class="model-head"><b>${def.title(p)}</b><span class="tag">${def.tag || "Interactive model"}</span></div>
      <div class="model-body"><div class="model-stage"><canvas class="main-cv"></canvas>
        <div class="model-ctrl"><button class="tbtn" data-a="play" title="Play / pause">${ICON_PLAY}</button><button class="tbtn" data-a="reset" title="Restart">${ICON_RESET}</button>
        <input type="range" class="scrub" min="0" max="1000" value="0"><span class="tval"></span>
        <select class="spd" title="Playback speed"><option value="0.25">¼×</option><option value="0.5">½×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select></div></div>
        </div><div class="model-side"><div class="sl-wrap"></div><div><h5>Live readouts</h5><table class="readouts live"></table></div><div class="facts"></div></div>
      <div class="model-graphs"></div>
      <div class="model-foot"><div class="steps"></div><div class="ph">${photo ? `<div class="photo-card"><img loading="lazy" src="${photo.src}" alt=""><div class="pc"><b>Real world: ${photo.title}</b>${photo.artist || ""} · ${photo.license} · <a href="${photo.page}" target="_blank" rel="noopener">source</a></div></div>` : ""}</div></div>`;
    host.appendChild(el);
    const cv = el.querySelector(".main-cv"), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext("2d");
    const scrub = el.querySelector(".scrub"), tval = el.querySelector(".tval"), playBtn = el.querySelector('[data-a="play"]');
    let sim, graphs = [], t = 0, playing = true, speed = 1, raf = 0, last = 0, frame = 0, revealed = !opts.hideAnswer;

    const controls = def.controls ? def.controls(p) : [];
    const slw = el.querySelector(".sl-wrap");
    if (controls.length) {
      slw.innerHTML = `<h5>What if…? (drag to change)</h5><div class="sliders">${controls.map((c) => `<label><span><b>${c.label}</b><em data-v="${c.key}"></em></span><input type="range" data-k="${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" value="${p[c.key]}"></label>`).join("")}</div>
        <button class="btn ghost sm" data-a="orig" style="margin:-4px 0 6px;padding:2px 6px">↺ Back to the problem's numbers</button>`;
      const orig = Object.assign({}, p);
      const upd = () => controls.forEach((c) => { slw.querySelector(`[data-v="${c.key}"]`).textContent = `${fmt(+p[c.key], 3)} ${c.unit || ""}`; });
      slw.querySelectorAll("input").forEach((inp) => inp.oninput = () => { p[inp.dataset.k] = +inp.value; p.__changed = true; upd(); build(); });
      slw.querySelector('[data-a="orig"]').onclick = () => { Object.assign(p, orig); p.__changed = false; slw.querySelectorAll("input").forEach((i) => i.value = p[i.dataset.k]); upd(); build(); };
      upd();
    }
    function build() {
      sim = def.setup(p);
      sim.tmax = sim.tmax || 5;
      t = 0; playing = true; playBtn.innerHTML = ICON_PAUSE;
      speed = +el.querySelector(".spd").value * (sim.speed || 1);
      const gh = el.querySelector(".model-graphs"); gh.innerHTML = ""; graphs = [];
      (sim.graphs || []).forEach((gs) => { const c = document.createElement("canvas"); gh.appendChild(c); graphs.push(Graph(c, Object.assign({ x1: sim.tmax }, gs))); });
      const f = el.querySelector(".facts");
      f.innerHTML = sim.facts && sim.facts.length ? `<h5>Key results</h5><table class="readouts">${sim.facts.map(([l, v]) => `<tr class="hl"><td>${l}</td><td>${revealed ? v : '<a href="javascript:void 0" class="rv">reveal</a>'}</td></tr>`).join("")}</table>` : "";
      f.querySelectorAll(".rv").forEach((a) => a.onclick = () => { revealed = true; build(); });
      if (p.__changed) f.insertAdjacentHTML("afterbegin", '<div class="pill purple" style="margin-bottom:6px">Exploring new numbers</div>');
      draw();
    }
    function draw() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      g.fillStyle = "#fbfcff"; g.fillRect(0, 0, W, H);
      try { sim.draw(g, t); } catch (e) { console.error(e); }
      graphs.forEach((gr) => gr.draw(t));
      scrub.value = Math.round((t / sim.tmax) * 1000);
      tval.textContent = sim.timeLabel ? sim.timeLabel(t) : `t = ${t.toFixed(2)} s`;
      if (frame++ % 3 === 0 && sim.readouts) {
        const rows = sim.readouts(t);
        el.querySelector(".readouts.live").innerHTML = rows.map(([l, v, u, ans]) => `<tr class="${ans ? "hl" : ""}"><td>${l}</td><td>${ans && !revealed ? "?" : (typeof v === "number" ? fmt(v, 3) : v) + (u ? " " + u : "")}</td></tr>`).join("");
      }
    }
    function loop(ts) {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
      if (playing && !sim.static) {
        t += dt * speed;
        if (t >= sim.tmax) { if (sim.loop) t = t % sim.tmax; else { t = sim.tmax; playing = false; playBtn.innerHTML = ICON_PLAY; } }
        draw();
      } else if (frame % 20 === 0) { frame++; }
    }
    playBtn.onclick = () => { if (!playing && t >= sim.tmax - 1e-6) t = 0; playing = !playing; playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY; draw(); };
    el.querySelector('[data-a="reset"]').onclick = () => { t = 0; playing = true; playBtn.innerHTML = ICON_PAUSE; draw(); };
    scrub.oninput = () => { t = (scrub.value / 1000) * sim.tmax; playing = false; playBtn.innerHTML = ICON_PLAY; frame = 0; draw(); };
    el.querySelector(".spd").onchange = (e) => { speed = +e.target.value * (sim.speed || 1); };
    // steps
    const steps = opts.steps && opts.steps.length ? opts.steps : (def.explain ? def.explain(p) : []);
    el.querySelector(".steps").innerHTML = `<h5 style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.7px;color:#6b6f7a">${opts.steps ? "How the model connects to the solution" : "What to notice"}</h5><ol>${steps.map((s) => `<li>${s}</li>`).join("")}</ol>${opts.hideAnswer ? '<div class="small muted">Answer-revealing results are hidden — click “reveal” when you are ready.</div>' : ""}`;
    if (window.renderMathInElement) try { window.renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false }); } catch (e) {}
    build();
    raf = requestAnimationFrame(loop);
    if (sim.static) playing = false;
    return { destroy() { cancelAnimationFrame(raf); el.remove(); }, el };
  }

  // numeric ODE integrator (RK4) that returns a sampled table for interpolation
  function integrate(f, y0, t1, dt, stop) {
    const ts = [0], ys = [y0.slice()]; let y = y0.slice(), t = 0;
    while (t < t1) {
      const k1 = f(t, y), k2 = f(t + dt / 2, y.map((v, i) => v + (dt / 2) * k1[i])), k3 = f(t + dt / 2, y.map((v, i) => v + (dt / 2) * k2[i])), k4 = f(t + dt, y.map((v, i) => v + dt * k3[i]));
      y = y.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t += dt;
      ts.push(t); ys.push(y.slice());
      if (stop && stop(t, y)) break;
    }
    const at = (tt) => {
      if (tt <= 0) return ys[0];
      if (tt >= ts[ts.length - 1]) return ys[ys.length - 1];
      const i = Math.min(ts.length - 2, Math.floor(tt / dt)); const u = (tt - ts[i]) / dt;
      return ys[i].map((v, k) => v + (ys[i + 1][k] - v) * u);
    };
    return { at, tEnd: ts[ts.length - 1], ts, ys };
  }

  window.Models = { mount, MODELS, D, Graph, integrate, W, H, fmt, COLORS };
})();
