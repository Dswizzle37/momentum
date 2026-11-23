/* Models, batch A: units, motion1d, vectors, projectile, circular, relative, forces, atwood, drag */
(function () {
  const { D, COLORS: K, fmt, W, H, integrate } = window.Models;
  const M = window.Models.MODELS;
  const g0 = 9.8;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

  // ---------------- units ----------------
  const PREF = [["T", 12], ["G", 9], ["M", 6], ["k", 3], ["", 0], ["c", -2], ["m", -3], ["µ", -6], ["n", -9], ["p", -12]];
  M.units = {
    title: (p) => (p.chain ? "Conversion chain: multiply by 1 until the units cancel" : "Prefix ladder: every step is a power of ten"),
    tag: "Unit model",
    setup(p) {
      if (p.chain) {
        const n = p.chain.length;
        let vals = [p.value]; p.chain.forEach((c) => vals.push(vals[vals.length - 1] * c.factor));
        return {
          tmax: n + 1, speed: 0.8,
          draw(g, t) {
            const k = Math.min(n, Math.floor(t));
            D.text(g, "Start", 20, 30, { size: 12, color: K.muted });
            const bw = Math.min(130, (W - 160) / (n + 1)); let x = 20; const y = 150;
            const box = (top, bot, hl, cancelTop, cancelBot) => {
              g.save(); g.fillStyle = hl ? "#e9f0fe" : "#fff"; g.strokeStyle = hl ? K.v : "#ced4da"; g.lineWidth = hl ? 2 : 1; g.fillRect(x, y - 50, bw, 100); g.strokeRect(x, y - 50, bw, 100); g.restore();
              D.text(g, top, x + bw / 2, y - 22, { size: 14, bold: true, align: "center" });
              if (bot) { D.line(g, x + 10, y, x + bw - 10, y, K.ink, 1.5); D.text(g, bot, x + bw / 2, y + 22, { size: 14, bold: true, align: "center" }); }
              if (cancelTop) D.line(g, x + 14, y - 14, x + bw - 14, y - 30, K.F, 2);
              if (cancelBot) D.line(g, x + 14, y + 30, x + bw - 14, y + 14, K.F, 2);
              x += bw + 22;
            };
            box(`${fmt(p.value, 4)} ${p.startUnit}`, "", k === 0, k >= 1, false);
            p.chain.forEach((c, i) => { D.text(g, "×", x - 11, y, { size: 18, align: "center", color: K.muted }); box(c.num, c.den, k === i + 1, k >= i + 2 && i < n - 1, k >= i + 1); });
            D.text(g, "=", x - 11, y, { size: 18, align: "center", color: K.muted });
            D.text(g, `${fmt(vals[k], 4)} ${k === n ? p.endUnit : "…"}`, x + 4, y, { size: 18, bold: true, color: k === n ? K.g : K.ink });
            D.text(g, k < n ? `Step ${k + 1}: multiply by ${p.chain[k].num} / ${p.chain[k].den} (equal to 1, so the quantity doesn't change)` : "Every unwanted unit has cancelled — only the target unit is left.", 20, 300, { size: 13, color: "#495057" });
            D.text(g, "Red slashes = units that cancel (same unit on top and bottom).", 20, 325, { size: 12, color: K.F });
          },
          readouts: (t) => { const k = Math.min(n, Math.floor(t)); return vals.slice(0, k + 1).map((v, i) => [i === 0 ? "start" : `after factor ${i}`, fmt(v, 4), i === 0 ? p.startUnit : i === n ? p.endUnit : "", i === n]); },
          facts: [["result", `${fmt(vals[n], 4)} ${p.endUnit}`]],
        };
      }
      const fromE = p.fromE, toE = p.toE;
      return {
        tmax: 3,
        draw(g, t) {
          const u = Math.min(1, t / 2.2), e = fromE + (toE - fromE) * u;
          const top = 30, step = 30, x = 150;
          PREF.forEach(([s, ex], i) => {
            const y = top + i * step; const on = Math.abs(ex - e) < 0.6;
            g.fillStyle = ex === fromE ? "#e5f6e7" : ex === toE ? "#e9f0fe" : "#fff"; g.fillRect(x, y, 150, step - 4);
            g.strokeStyle = "#dee2e6"; g.strokeRect(x, y, 150, step - 4);
            D.text(g, `${s || "(base)"}${p.unit}`, x + 10, y + 13, { size: 13, bold: on });
            D.text(g, `10^${ex}`, x + 140, y + 13, { size: 12, align: "right", color: K.muted });
          });
          const yOf = (ex) => { const i = PREF.findIndex((q) => q[1] <= ex); const a = PREF[Math.max(0, i - 1)], b = PREF[i]; if (!b) return top + 9 * step + 13; if (i === 0 || a[1] === b[1]) return top + i * step + 13; return top + (i - 1) * step + 13 + ((a[1] - ex) / (a[1] - b[1])) * step; };
          D.arrow(g, x - 20, yOf(fromE), x - 20, yOf(e) + 0.01, K.a, "", { w: 3 });
          D.ball(g, x - 20, yOf(e), 8, "#f76707");
          const moved = fromE - e;
          D.text(g, `${p.value} ${PREF.find((q) => q[1] === fromE)[0]}${p.unit}`, 340, 80, { size: 18, bold: true });
          D.text(g, `= ${fmt(p.value * Math.pow(10, fromE - toE), 4)} ${PREF.find((q) => q[1] === toE)[0]}${p.unit}`, 340, 115, { size: 18, bold: true, color: u >= 1 ? K.g : "#adb5bd" });
          D.text(g, `Moving ${toE < fromE ? "down" : "up"} the ladder by ${Math.abs(fromE - toE)} powers of ten`, 340, 160, { size: 13, color: "#495057" });
          D.text(g, toE < fromE ? "→ smaller unit, so the NUMBER gets bigger (× 10^" + (fromE - toE) + ")" : "→ bigger unit, so the NUMBER gets smaller (× 10^" + (fromE - toE) + ")", 340, 185, { size: 13, color: "#495057" });
          D.text(g, `Factor so far: 10^${Math.round(moved * 10) / 10}`, 340, 220, { size: 13, color: K.a });
        },
        readouts: () => [["from", `10^${fromE}`, ""], ["to", `10^${toE}`, ""], ["multiply by", `10^${fromE - toE}`, "", true]],
        facts: [["converted value", `${fmt(p.value * Math.pow(10, fromE - toE), 4)} ${PREF.find((q) => q[1] === toE)[0]}${p.unit}`]],
      };
    },
  };

  // ---------------- motion1d ----------------
  M.motion1d = {
    title: (p) => p.title || (p.axis === "y" ? "Vertical motion along the y-axis" : "Motion along the x-axis"),
    controls(p) {
      if (p.xf) return [];
      const lv = Math.max(10, Math.ceil(Math.abs(p.v0) * 2)), la = Math.max(5, Math.ceil(Math.abs(p.a) * 2));
      return [{ key: "v0", label: "Initial velocity v₀", min: -lv, max: lv, step: 0.5, unit: "m/s" }, { key: "a", label: "Acceleration a", min: -la, max: la, step: 0.1, unit: "m/s²" }];
    },
    setup(p) {
      const ax = p.axis || "x";
      const xf = p.xf || ((t) => p.x0 + p.v0 * t + 0.5 * p.a * t * t);
      const vf = p.vf || ((t) => p.v0 + p.a * t);
      const af = p.af || (() => p.a);
      const tmax = p.tmax;
      let lo = Infinity, hi = -Infinity, vmax = 0, amax = 0;
      for (let i = 0; i <= 200; i++) { const t = (tmax * i) / 200; const x = xf(t); lo = Math.min(lo, x); hi = Math.max(hi, x); vmax = Math.max(vmax, Math.abs(vf(t))); amax = Math.max(amax, Math.abs(af(t))); }
      if (hi - lo < 1) { hi += 1; lo -= 1; }
      const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
      const vert = p.orient === "v" || ax === "y";
      const S = vert ? (x) => 320 - ((x - lo) / (hi - lo)) * 280 : (x) => 40 + ((x - lo) / (hi - lo)) * 520;
      const dist = (t) => { let s = 0, n = 120, prev = xf(0); for (let i = 1; i <= n; i++) { const x = xf((t * i) / n); s += Math.abs(x - prev); prev = x; } return s; };
      return {
        tmax,
        draw(g, t) {
          const step = D.niceStep(hi - lo, 8);
          if (vert) {
            const X0 = 150; D.line(g, X0, 30, X0, 330, "#adb5bd", 3);
            for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) { D.line(g, X0 - 6, S(v), X0 + 6, S(v), "#868e96", 1); D.text(g, fmt(+v.toFixed(6)) + " m", X0 - 12, S(v), { size: 10, align: "right", color: K.muted }); }
            if (p.ground != null) D.ground(g, X0 - 80, X0 + 80, S(p.ground));
            for (let k = 0; k <= 12; k++) { const tk = (tmax * k) / 12; if (tk > t) break; g.fillStyle = "rgba(24,101,242,.18)"; g.beginPath(); g.arc(X0 + 40, S(xf(tk)), 5, 0, 7); g.fill(); }
            D.text(g, "motion diagram (equal time steps)", X0 + 40, 18, { size: 10, color: K.muted, align: "center" });
            const y = S(xf(t)); D.ball(g, X0, y, 12, "#f76707");
            const v = vf(t), a = af(t); const vs = vmax ? 90 / vmax : 0, as = amax ? 60 / amax : 0;
            D.arrow(g, X0 + 90, y, X0 + 90, y - v * vs, K.v, `v = ${fmt(v)} m/s`, { off: 14 });
            D.arrow(g, X0 + 200, y, X0 + 200, y - a * as, K.a, `a = ${fmt(a)} m/s²`, { off: 14 });
            D.text(g, `${ax} = ${fmt(xf(t))} m`, 420, 60, { size: 16, bold: true });
            D.text(g, `t = ${t.toFixed(2)} s`, 420, 85, { size: 14, color: K.muted });
            D.text(g, "+y is up", 420, 110, { size: 12, color: K.muted });
          } else {
            const Y0 = 210; D.line(g, 30, Y0, 610, Y0, "#adb5bd", 3);
            for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) { D.line(g, S(v), Y0 - 6, S(v), Y0 + 6, "#868e96", 1); D.text(g, fmt(+v.toFixed(6)), S(v), Y0 + 18, { size: 10, align: "center", color: K.muted }); }
            D.text(g, `${ax} (m)`, 610, Y0 + 32, { size: 11, align: "right", color: K.muted });
            for (let k = 0; k <= 12; k++) { const tk = (tmax * k) / 12; if (tk > t) break; g.fillStyle = "rgba(24,101,242,.22)"; g.beginPath(); g.arc(S(xf(tk)), Y0 - 60, 5, 0, 7); g.fill(); D.text(g, k % 3 === 0 ? `${tk.toFixed(1)}s` : "", S(xf(tk)), Y0 - 74, { size: 9, align: "center", color: K.muted }); }
            D.text(g, "motion diagram (dots every " + fmt(tmax / 12, 2) + " s)", 40, Y0 - 95, { size: 10, color: K.muted });
            const x = S(xf(t));
            if (p.obj === "ball") D.ball(g, x, Y0 - 14, 13, "#f76707"); else { D.block(g, x, Y0 - 14, 46, 22, 0, "#1865f2", "car"); D.ball(g, x - 13, Y0 - 2, 5, "#343a40"); D.ball(g, x + 13, Y0 - 2, 5, "#343a40"); }
            const v = vf(t), a = af(t); const vs = vmax ? 110 / vmax : 0, as = amax ? 70 / amax : 0;
            D.arrow(g, x, Y0 - 120, x + v * vs, Y0 - 120, K.v, `v = ${fmt(v)} m/s`, { off: 30 });
            D.arrow(g, x, Y0 - 150, x + a * as, Y0 - 150, K.a, `a = ${fmt(a)} m/s²`, { off: 30 });
            D.text(g, `${ax} = ${fmt(xf(t))} m   ·   t = ${t.toFixed(2)} s`, 40, 30, { size: 15, bold: true });
            (p.marks || []).forEach((mk) => { D.line(g, S(mk.x), Y0 - 30, S(mk.x), Y0 + 6, K.g, 2, [3, 3]); D.text(g, mk.label, S(mk.x), Y0 + 44, { size: 11, align: "center", color: K.g, bold: true }); });
          }
        },
        readouts: (t) => [["t", t.toFixed(2), "s"], [ax, xf(t), "m"], [`v${ax}`, vf(t), "m/s"], [`a${ax}`, af(t), "m/s²"], ["speed", Math.abs(vf(t)), "m/s"], ["displacement", xf(t) - xf(0), "m"], ["distance traveled", dist(t), "m"]],
        graphs: [
          { title: `${ax} vs t`, ylabel: "m", series: [{ f: xf, color: K.ink }] },
          { title: `v${ax} vs t  (slope of ${ax}-t)`, ylabel: "m/s", series: [{ f: vf, color: K.v }] },
          { title: `a${ax} vs t  (slope of v-t)`, ylabel: "m/s²", series: [{ f: af, color: K.a }] },
        ],
        facts: p.facts || [],
      };
    },
    explain: () => ["The dots show where the object is at equal time intervals: wider spacing = faster.", "The blue arrow is velocity; the orange arrow is acceleration. When they point the same way the object speeds up.", "On the graphs, slope of x–t is velocity and slope of v–t is acceleration; area under v–t is displacement."],
  };

  // ---------------- vectors ----------------
  M.vectors = {
    title: (p) => p.title || (p.product === "dot" ? "Dot product: how much two vectors point together" : p.product === "cross" ? "Cross product: area of the parallelogram, direction by the right-hand rule" : "Adding vectors tip-to-tail"),
    tag: "Vector model",
    setup(p) {
      const vs = p.vecs.map((v, i) => Object.assign({ z: 0, color: ["#1865f2", "#e8590c", "#2b8a3e", "#ae3ec9"][i % 4] }, v));
      const n = vs.length; const prod = p.product;
      const tip = prod ? false : p.mode !== "tail";
      const starts = []; let cx = 0, cy = 0;
      vs.forEach((v) => { starts.push(tip ? [cx, cy] : [0, 0]); if (tip) { cx += v.x; cy += v.y; } });
      const R = vs.reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y, z: a.z + v.z }), { x: 0, y: 0, z: 0 });
      const pts = [[0, 0], [R.x, R.y]]; vs.forEach((v, i) => { pts.push(starts[i]); pts.push([starts[i][0] + v.x, starts[i][1] + v.y]); });
      if (prod) pts.push([vs[0].x + vs[1].x, vs[0].y + vs[1].y]);
      let x0 = Math.min(...pts.map((q) => q[0])), x1 = Math.max(...pts.map((q) => q[0])), y0 = Math.min(...pts.map((q) => q[1])), y1 = Math.max(...pts.map((q) => q[1]));
      const span = Math.max(x1 - x0, y1 - y0, 1); const pad = span * 0.15;
      x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
      const view = D.view(x0, x1, y0, y1, { x: 40, y: 20, w: 560, h: 320 });
      const mag = (v) => Math.hypot(v.x, v.y, v.z || 0), ang = (v) => { let a = deg(Math.atan2(v.y, v.x)); return a; };
      const A = vs[0], B = vs[1] || { x: 0, y: 0, z: 0 };
      const dot = A.x * B.x + A.y * B.y + (A.z || 0) * (B.z || 0);
      const cr = { x: A.y * (B.z || 0) - (A.z || 0) * B.y, y: (A.z || 0) * B.x - A.x * (B.z || 0), z: A.x * B.y - A.y * B.x };
      const phi = deg(Math.acos(Math.max(-1, Math.min(1, dot / (mag(A) * mag(B) || 1)))));
      const u = p.unit || "";
      return {
        tmax: n + (prod ? 1.5 : 1.2), speed: 0.9,
        draw(g, t) {
          D.grid(g, view, D.niceStep(x1 - x0, 8), { units: [`x ${u}`, `y ${u}`] });
          D.line(g, view.X(x0), view.Y(0), view.X(x1), view.Y(0), "#868e96", 1.2); D.line(g, view.X(0), view.Y(y0), view.X(0), view.Y(y1), "#868e96", 1.2);
          if (prod && t > n) {
            const s = Math.min(1, t - n); g.save(); g.fillStyle = prod === "cross" ? `rgba(174,62,201,${0.18 * s})` : "rgba(0,0,0,0)";
            g.beginPath(); g.moveTo(view.X(0), view.Y(0)); g.lineTo(view.X(A.x), view.Y(A.y)); g.lineTo(view.X(A.x + B.x), view.Y(A.y + B.y)); g.lineTo(view.X(B.x), view.Y(B.y)); g.closePath(); g.fill(); g.restore();
            if (prod === "dot") { const bh = { x: B.x / mag(B), y: B.y / mag(B) }; const pr = (A.x * bh.x + A.y * bh.y); D.line(g, view.X(A.x), view.Y(A.y), view.X(pr * bh.x), view.Y(pr * bh.y), "#868e96", 1.2, [4, 3]); D.arrow(g, view.X(0), view.Y(0), view.X(pr * bh.x), view.Y(pr * bh.y), "#ae3ec9", `A cosφ = ${fmt(pr)}`, { w: 4 }); }
            const a0 = Math.atan2(-A.y, A.x), a1 = Math.atan2(-B.y, B.x); D.arc(g, view.X(0), view.Y(0), 34, a0, a1, `φ = ${fmt(phi)}°`);
            if (prod === "cross") D.text(g, `A×B points ${cr.z > 0 ? "OUT of the page ⊙" : cr.z < 0 ? "INTO the page ⊗" : "(zero)"}  ·  |A×B| = area = ${fmt(mag(cr))}`, 50, 30, { size: 13, bold: true, color: "#ae3ec9", bg: true });
          }
          vs.forEach((v, i) => {
            const s = Math.max(0, Math.min(1, t - i)); if (s <= 0) return;
            const [sx, sy] = starts[i]; const ex = sx + v.x * s, ey = sy + v.y * s;
            if (p.components !== false && s >= 1 && !prod) { D.line(g, view.X(sx), view.Y(sy), view.X(sx + v.x), view.Y(sy), v.color, 1.2, [4, 3]); D.line(g, view.X(sx + v.x), view.Y(sy), view.X(sx + v.x), view.Y(sy + v.y), v.color, 1.2, [4, 3]); }
            D.arrow(g, view.X(sx), view.Y(sy), view.X(ex), view.Y(ey), v.color, s >= 1 ? `${v.label} (${fmt(v.x)}, ${fmt(v.y)})` : "", { w: 3.2 });
          });
          if (!prod && p.sum !== false && t > n) {
            const s = Math.min(1, (t - n) / 0.8);
            D.arrow(g, view.X(0), view.Y(0), view.X(R.x * s), view.Y(R.y * s), "#212529", s >= 1 ? `${p.sumLabel || "R"} = (${fmt(R.x)}, ${fmt(R.y)})` : "", { w: 4 });
            if (s >= 1) { D.line(g, view.X(0), view.Y(0), view.X(R.x), view.Y(0), "#212529", 1, [2, 3]); D.arc(g, view.X(0), view.Y(0), 28, 0, -Math.atan2(R.y, R.x), `${fmt(ang(R))}°`); }
          }
        },
        readouts: () => {
          const r = [];
          vs.forEach((v) => { r.push([`${v.label}ₓ, ${v.label}ᵧ${v.z ? ", " + v.label + "_z" : ""}`, `${fmt(v.x)}, ${fmt(v.y)}${v.z ? ", " + fmt(v.z) : ""}`, u]); r.push([`|${v.label}|, angle`, `${fmt(mag(v))}, ${fmt(ang(v))}°`, ""]); });
          if (prod === "dot") { r.push(["A·B = AₓBₓ+AᵧBᵧ+A_zB_z", dot, "", true]); r.push(["angle φ between", `${fmt(phi)}°`, "", true]); }
          else if (prod === "cross") { r.push(["A×B (x, y, z)", `${fmt(cr.x)}, ${fmt(cr.y)}, ${fmt(cr.z)}`, "", true]); r.push(["|A×B| = AB sinφ", mag(cr), "", true]); }
          else if (p.sum !== false) { r.push([`${p.sumLabel || "R"}ₓ, ${p.sumLabel || "R"}ᵧ`, `${fmt(R.x)}, ${fmt(R.y)}`, u, true]); r.push([`|${p.sumLabel || "R"}|`, Math.hypot(R.x, R.y, R.z), u, true]); r.push(["direction (from +x)", `${fmt(ang(R))}°`, "", true]); }
          return r;
        },
      };
    },
    explain: (p) => p.product ? ["Dot product = (component of A along B) × |B| — it is largest when the vectors are parallel and zero when perpendicular.", "Cross product magnitude = area of the shaded parallelogram = AB sin φ; point the fingers of your right hand along A, curl toward B, thumb gives the direction."] : ["Each vector is placed tip-to-tail; the resultant runs from the first tail to the last tip.", "The dashed lines are components. Adding vectors = adding x-components and adding y-components separately.", "The resultant's angle comes from tan θ = Rᵧ/Rₓ — check the quadrant!"],
  };

  // ---------------- projectile ----------------
  M.projectile = {
    title: () => "Projectile motion: independent x and y",
    controls: (p) => [{ key: "v0", label: "Launch speed v₀", min: 1, max: Math.max(40, Math.ceil(p.v0 * 1.6)), step: 0.5, unit: "m/s" }, { key: "angle", label: "Launch angle θ", min: -60, max: 90, step: 1, unit: "°" }, { key: "h0", label: "Launch height", min: 0, max: Math.max(40, Math.ceil(p.h0 * 1.6 + 1)), step: 0.5, unit: "m" }],
    setup(p) {
      const gg = p.g || g0, th = rad(p.angle), vx = p.v0 * Math.cos(th), vy0 = p.v0 * Math.sin(th), h0 = p.h0 || 0, yl = p.yLand || 0;
      const disc = vy0 * vy0 + 2 * gg * (h0 - yl);
      const tf = disc >= 0 ? (vy0 + Math.sqrt(disc)) / gg : 2 * Math.max(vy0, 0.1) / gg;
      const R = vx * tf, Hm = vy0 > 0 ? h0 + (vy0 * vy0) / (2 * gg) : h0, tApex = vy0 > 0 ? vy0 / gg : 0;
      const xf = (t) => vx * t, yf = (t) => h0 + vy0 * t - 0.5 * gg * t * t, vyf = (t) => vy0 - gg * t;
      const xmax = Math.max(R, 1) * 1.12, ymax = Math.max(Hm, h0, yl, 1) * 1.2;
      let equal = true; if (xmax / ymax > 6 || ymax / xmax > 3) equal = false;
      const view = D.view(-xmax * 0.06, xmax, Math.min(0, yl) - ymax * 0.05, ymax, { x: 46, y: 16, w: 570, h: 300 }, equal);
      return {
        tmax: tf,
        draw(g, t) {
          D.grid(g, view, 0, { stepX: D.niceStep(xmax, 7), stepY: D.niceStep(ymax, 5), units: ["x (m)", "y (m)"] });
          D.ground(g, view.X(view.x0), view.X(view.x1), view.Y(Math.min(0, yl)));
          if (h0 > 0) { g.fillStyle = "#dee2e6"; g.fillRect(view.X(view.x0), view.Y(h0), view.X(0) - view.X(view.x0), view.Y(0) - view.Y(h0)); D.dim(g, view.X(0) - 14, view.Y(0), view.X(0) - 14, view.Y(h0), `${fmt(h0)} m`); }
          if (yl > 0) { g.fillStyle = "#dee2e6"; g.fillRect(view.X(R * 0.92), view.Y(yl), view.X(view.x1) - view.X(R * 0.92), view.Y(0) - view.Y(yl)); }
          g.save(); g.strokeStyle = "rgba(24,101,242,.25)"; g.setLineDash([5, 5]); g.lineWidth = 1.5; g.beginPath();
          for (let i = 0; i <= 100; i++) { const tt = (tf * i) / 100; i ? g.lineTo(view.X(xf(tt)), view.Y(yf(tt))) : g.moveTo(view.X(xf(tt)), view.Y(yf(tt))); } g.stroke(); g.restore();
          g.save(); g.strokeStyle = K.v; g.lineWidth = 2.2; g.beginPath();
          for (let i = 0; i <= 100; i++) { const tt = (t * i) / 100; i ? g.lineTo(view.X(xf(tt)), view.Y(yf(tt))) : g.moveTo(view.X(xf(tt)), view.Y(yf(tt))); } g.stroke(); g.restore();
          for (let k = 1; k < 10; k++) { const tk = (tf * k) / 10; if (tk > t) break; g.fillStyle = "rgba(247,103,7,.35)"; g.beginPath(); g.arc(view.X(xf(tk)), view.Y(yf(tk)), 4, 0, 7); g.fill(); }
          if (vy0 > 0 && t >= tApex) { D.line(g, view.X(xf(tApex)), view.Y(Hm), view.X(xf(tApex)), view.Y(0), K.g, 1, [3, 3]); D.text(g, `max height ${fmt(Hm)} m`, view.X(xf(tApex)), view.Y(Hm) - 12, { size: 11, align: "center", color: K.g, bold: true, bg: true }); }
          if (t >= tf - 1e-6) D.dim(g, view.X(0), view.Y(Math.min(0, yl)) + 18, view.X(R), view.Y(Math.min(0, yl)) + 18, `range ${fmt(R)} m`);
          const x = view.X(xf(t)), y = view.Y(yf(t)), s = 55 / Math.max(p.v0, 1);
          D.arrow(g, x, y, x + vx * s, y, K.g, "vₓ", { off: 10 });
          D.arrow(g, x, y, x, y - vyf(t) * s, K.F, "vᵧ", { off: 10 });
          D.arrow(g, x, y, x + vx * s, y - vyf(t) * s, K.v, "v", { off: 10 });
          D.arrow(g, x + 26, y + 10, x + 26, y + 40, K.a, "g", { off: 10, w: 2 });
          D.ball(g, x, y, 8, "#f76707");
          if (!equal) D.text(g, "axes scaled differently to fit", 610, 340, { size: 10, align: "right", color: K.muted });
        },
        readouts: (t) => [["t", t.toFixed(2), "s"], ["x", xf(t), "m"], ["y", yf(t), "m"], ["vₓ (constant)", vx, "m/s"], ["vᵧ", vyf(t), "m/s"], ["speed |v|", Math.hypot(vx, vyf(t)), "m/s"], ["direction", `${fmt(deg(Math.atan2(vyf(t), vx)))}°`, ""], ["aᵧ", -gg, "m/s²"]],
        facts: [["time of flight", `${fmt(tf)} s`], ["horizontal range", `${fmt(R)} m`], ["max height", `${fmt(Hm)} m`], ["impact speed", `${fmt(Math.hypot(vx, vyf(tf)))} m/s`]],
        graphs: [{ title: "y vs t", ylabel: "m", series: [{ f: yf, color: K.ink }] }, { title: "vᵧ vs t (slope = −g)", ylabel: "m/s", series: [{ f: vyf, color: K.F }] }, { title: "x vs t (straight line)", ylabel: "m", series: [{ f: xf, color: K.g }] }],
      };
    },
    explain: () => ["Horizontal: no force, so vₓ never changes (green arrow keeps its length).", "Vertical: constant acceleration −g, so vᵧ shrinks to zero at the top, then grows downward.", "Both directions share the same clock t — find t from one direction and use it in the other."],
  };

  // ---------------- circular ----------------
  M.circular = {
    title: (p) => ({ flat: "Uniform circular motion (top view)", vertical: "Motion in a vertical circle", banked: "Banked curve — cross-section and forces", conical: "Conical pendulum" })[p.mode || "flat"],
    controls: (p) => (p.mode === "banked" ? [{ key: "v", label: "Speed v", min: 1, max: Math.max(40, Math.ceil(p.v * 1.8)), step: 0.5, unit: "m/s" }, { key: "theta", label: "Bank angle θ", min: 0, max: 45, step: 1, unit: "°" }] : p.mode === "conical" ? [{ key: "theta", label: "String angle θ", min: 5, max: 80, step: 1, unit: "°" }, { key: "L", label: "String length L", min: 0.2, max: 5, step: 0.1, unit: "m" }] : [{ key: "v", label: p.mode === "vertical" ? "Speed at bottom" : "Speed v", min: 0.5, max: Math.max(30, Math.ceil(p.v * 2)), step: 0.5, unit: "m/s" }, { key: "r", label: "Radius r", min: 0.2, max: Math.max(20, Math.ceil(p.r * 2)), step: 0.1, unit: "m" }]),
    setup(p) {
      const m = p.m || 1, mode = p.mode || "flat";
      if (mode === "flat" || (mode === "vertical" && p.constSpeed)) {
        const w = p.v / p.r, T = (2 * Math.PI) / w, ac = (p.v * p.v) / p.r;
        const vert = mode === "vertical";
        return {
          tmax: Math.max(T * 2, 2), loop: true, speed: T > 6 ? T / 4 : T < 0.6 ? 0.25 : 1,
          draw(g, t) {
            const cx = 230, cy = 180, Rp = 130, th = w * t + (vert ? -Math.PI / 2 : 0);
            g.save(); g.strokeStyle = "#ced4da"; g.lineWidth = 2; g.setLineDash([6, 5]); g.beginPath(); g.arc(cx, cy, Rp, 0, 7); g.stroke(); g.restore();
            D.ball(g, cx, cy, 4, "#495057");
            const x = cx + Rp * Math.cos(th), y = cy - Rp * Math.sin(th);
            D.line(g, cx, cy, x, y, "#adb5bd", 1.2); D.text(g, `r = ${fmt(p.r)} m`, (cx + x) / 2, (cy + y) / 2 - 10, { size: 11, bg: true, align: "center" });
            for (let k = 1; k < 8; k++) { const a = th - k * 0.18; g.fillStyle = `rgba(24,101,242,${0.25 - k * 0.03})`; g.beginPath(); g.arc(cx + Rp * Math.cos(a), cy - Rp * Math.sin(a), 6, 0, 7); g.fill(); }
            D.arrow(g, x, y, x - 70 * Math.sin(th), y - 70 * Math.cos(th), K.v, `v = ${fmt(p.v)} m/s`, { off: 20 });
            D.arrow(g, x, y, x + (cx - x) * 0.45, y + (cy - y) * 0.45, K.a, `a꜀ = ${fmt(ac)} m/s²`, { off: 18 });
            D.ball(g, x, y, 11, "#f76707");
            if (vert) {
              const phi = th + Math.PI / 2; const N = m * ac + m * g0 * Math.cos(phi);
              D.arrow(g, x, y, x, y + 50, K.g, "mg", { off: 10 });
              D.text(g, `Normal/tension force here: ${fmt(N)} N ${N < 0 ? "(negative → loses contact!)" : ""}`, 400, 330, { size: 12, align: "left", color: N < 0 ? K.F : K.N, bold: true });
            }
            D.text(g, "Velocity is tangent; acceleration points to the center.", 400, 40, { size: 12, color: "#495057" });
            D.text(g, `ω = v/r = ${fmt(w)} rad/s`, 400, 80, { size: 14, bold: true }); D.text(g, `T = 2πr/v = ${fmt(T)} s`, 400, 105, { size: 14, bold: true }); D.text(g, `a꜀ = v²/r = ${fmt(ac)} m/s²`, 400, 130, { size: 14, bold: true, color: K.a });
            if (p.m) D.text(g, `F_net = m v²/r = ${fmt(m * ac)} N`, 400, 155, { size: 14, bold: true, color: K.F });
          },
          readouts: (t) => [["t", t.toFixed(2), "s"], ["angle θ", `${fmt((deg(w * t)) % 360)}°`, ""], ["x = r cos ωt", p.r * Math.cos(w * t), "m"], ["y = r sin ωt", p.r * Math.sin(w * t), "m"], ["speed (constant)", p.v, "m/s"], ["ω", w, "rad/s"], ["period T", T, "s", true], ["frequency f", 1 / T, "Hz"], ["a꜀", ac, "m/s²", true], ...(p.m ? [["F_c = ma꜀", m * ac, "N", true]] : [])],
          graphs: [{ title: "x(t) = r cos ωt", ylabel: "m", series: [{ f: (t) => p.r * Math.cos(w * t), color: K.v }] }, { title: "y(t) = r sin ωt", ylabel: "m", series: [{ f: (t) => p.r * Math.sin(w * t), color: K.F }] }],
        };
      }
      if (mode === "vertical") {
        const r = p.r, vb = p.v;
        const vAt = (phi) => Math.sqrt(Math.max(0.0001, vb * vb - 2 * g0 * r * (1 - Math.cos(phi))));
        const sol = integrate((t, y) => [vAt(y[0]) / r], [0], 60, 0.004, (t, y) => y[0] >= 2 * Math.PI);
        const tmax = Math.min(sol.tEnd, 20);
        const vtop2 = vb * vb - 4 * g0 * r, Ntop = m * vtop2 / r - m * g0, Nbot = m * vb * vb / r + m * g0;
        return {
          tmax,
          draw(g, t) {
            const cx = 220, cy = 180, Rp = 130, phi = sol.at(t)[0];
            g.save(); g.strokeStyle = "#868e96"; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, Rp + 14, 0, 7); g.stroke(); g.restore();
            const x = cx + Rp * Math.sin(phi), y = cy + Rp * Math.cos(phi), v = vAt(phi);
            const N = m * v * v / r + m * g0 * Math.cos(phi);
            const ux = (cx - x) / Rp, uy = (cy - y) / Rp, fs = 60 / Math.max(Nbot, m * g0);
            D.arrow(g, x, y, x + Math.cos(phi) * 50 * v / vb, y - Math.sin(phi) * 50 * v / vb, K.v, `v ${fmt(v)}`, { off: 16 });
            D.arrow(g, x, y, x + ux * Math.max(0, N) * fs, y + uy * Math.max(0, N) * fs, K.N, `N ${fmt(N)}`, { off: 16 });
            D.arrow(g, x, y, x, y + m * g0 * fs, K.g, "mg", { off: 10 });
            D.ball(g, x, y, 11, "#f76707");
            D.text(g, "Energy sets the speed: v² = v_b² − 2gr(1 − cos φ)", 400, 40, { size: 12, color: "#495057" });
            D.text(g, `At bottom: N = mv²/r + mg = ${fmt(Nbot)} N`, 400, 80, { size: 13, bold: true });
            D.text(g, `At top: N = mv²/r − mg = ${fmt(Ntop)} N`, 400, 105, { size: 13, bold: true, color: Ntop < 0 ? K.F : K.ink });
            D.text(g, `Minimum speed at top: √(gr) = ${fmt(Math.sqrt(g0 * r))} m/s`, 400, 130, { size: 13 });
            if (N < 0) D.text(g, "N < 0 here → the object would leave the track", 400, 160, { size: 13, color: K.F, bold: true });
          },
          readouts: (t) => { const phi = sol.at(t)[0], v = vAt(phi); return [["angle from bottom φ", `${fmt(deg(phi) % 360)}°`, ""], ["speed", v, "m/s"], ["a꜀ = v²/r", v * v / r, "m/s²"], ["normal force N", m * v * v / r + m * g0 * Math.cos(phi), "N"], ["speed at top", Math.sqrt(Math.max(0, vtop2)), "m/s", true], ["N at top", Ntop, "N", true]]; },
          graphs: [{ title: "speed vs t", ylabel: "m/s", series: [{ f: (t) => vAt(sol.at(t)[0]), color: K.v }] }, { title: "normal force vs t", ylabel: "N", series: [{ f: (t) => { const phi = sol.at(t)[0], v = vAt(phi); return m * v * v / r + m * g0 * Math.cos(phi); }, color: K.N }] }],
        };
      }
      if (mode === "banked") {
        const th = rad(p.theta), r = p.r, v = p.v, mu = p.mu || 0;
        const N = m * (g0 * Math.cos(th) + (v * v / r) * Math.sin(th)), f = m * ((v * v / r) * Math.cos(th) - g0 * Math.sin(th));
        const vi = Math.sqrt(r * g0 * Math.tan(th)), vmax = Math.cos(th) - mu * Math.sin(th) > 0 ? Math.sqrt((r * g0 * (Math.sin(th) + mu * Math.cos(th))) / (Math.cos(th) - mu * Math.sin(th))) : Infinity;
        const w = v / r, T = 2 * Math.PI / w;
        return {
          tmax: Math.max(4, Math.min(T, 12)), loop: true,
          draw(g, t) {
            const bx = 60, by = 280, L = 320;
            const ex = bx + L * Math.cos(th), ey = by - L * Math.sin(th);
            g.fillStyle = "#e9ecef"; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.lineTo(ex, by); g.closePath(); g.fill(); D.line(g, bx, by, ex, ey, K.ground, 3);
            D.arc(g, bx, by, 50, 0, -th, `θ = ${fmt(p.theta)}°`);
            D.text(g, "← center of the curve", ex - 20, by + 22, { size: 11, color: K.muted, align: "right" });
            const cx = bx + L * 0.55 * Math.cos(th), cy = by - L * 0.55 * Math.sin(th) - 14;
            D.block(g, cx, cy, 50, 24, -th, "#1865f2", "car");
            const F = 70 / (m * g0);
            D.arrow(g, cx, cy, cx, cy + m * g0 * F, K.g, `mg ${fmt(m * g0)} N`, { off: 14 });
            D.arrow(g, cx, cy, cx - Math.sin(th) * N * F, cy - Math.cos(th) * N * F, K.N, `N ${fmt(N)} N`, { off: 14 });
            if (Math.abs(f) > 1e-6) D.arrow(g, cx, cy, cx - Math.sign(f) * Math.cos(th) * Math.abs(f) * F, cy + Math.sign(f) * Math.sin(th) * Math.abs(f) * F, K.f, `f ${fmt(Math.abs(f))} N`, { off: 14 });
            D.arrow(g, cx, cy - 60, cx - m * v * v / r * F, cy - 60, K.a, `needed: mv²/r = ${fmt(m * v * v / r)} N`, { off: 14, dash: [5, 3] });
            const ox = 520, oy = 90, R = 55; g.save(); g.strokeStyle = "#ced4da"; g.lineWidth = 8; g.beginPath(); g.arc(ox, oy, R, 0, 7); g.stroke(); g.restore();
            D.ball(g, ox + R * Math.cos(w * t * (12 / Math.max(T, 1))), oy - R * Math.sin(w * t * (12 / Math.max(T, 1))), 7, "#1865f2"); D.text(g, "top view", ox, oy + R + 18, { size: 10, align: "center", color: K.muted });
            D.text(g, f > 1e-6 ? "Friction points DOWN the bank (car faster than ideal)" : f < -1e-6 ? "Friction points UP the bank (car slower than ideal)" : "No friction needed — ideal speed!", 20, 24, { size: 12, bold: true, color: K.f });
          },
          readouts: () => [["speed v", v, "m/s"], ["ideal speed √(rg tanθ)", vi, "m/s", true], ["normal force N", N, "N"], ["friction needed f", f, "N"], ["μ needed = |f|/N", Math.abs(f) / N, ""], ["max speed with μ", isFinite(vmax) ? fmt(vmax) : "no limit", "m/s"]],
        };
      }
      // conical
      const th = rad(p.theta), L = p.L, r = L * Math.sin(th), Tn = m * g0 / Math.cos(th), v = Math.sqrt(g0 * r * Math.tan(th)), T = 2 * Math.PI * Math.sqrt(L * Math.cos(th) / g0);
      return {
        tmax: T * 2, loop: true,
        draw(g, t) {
          const px = 230, py = 40, s = 200 / Math.max(L, 0.5), hh = L * Math.cos(th) * s, rr = r * s, a = (2 * Math.PI * t) / T;
          D.line(g, 130, py, 330, py, K.ground, 4);
          g.save(); g.strokeStyle = "#ced4da"; g.setLineDash([5, 4]); g.beginPath(); g.ellipse(px, py + hh, rr, rr * 0.25, 0, 0, 7); g.stroke(); g.restore();
          const bx = px + rr * Math.cos(a), by = py + hh + rr * 0.25 * Math.sin(a);
          D.line(g, px, py, bx, by, "#495057", 1.5); D.line(g, px, py, px, py + hh, "#adb5bd", 1, [3, 3]);
          D.arc(g, px, py, 40, Math.PI / 2, Math.PI / 2 - th, `θ`);
          const F = 80 / Tn; D.arrow(g, bx, by, bx + (px - bx) * Tn * F / (L * s), by + (py - by) * Tn * F / (L * s), K.T, `T ${fmt(Tn)} N`, { off: 14 }); D.arrow(g, bx, by, bx, by + m * g0 * F, K.g, "mg", { off: 10 });
          D.ball(g, bx, by, 10, "#f76707");
          D.text(g, `Vertical: T cos θ = mg → T = ${fmt(Tn)} N`, 380, 80, { size: 13, bold: true }); D.text(g, `Horizontal: T sin θ = mv²/r → v = ${fmt(v)} m/s`, 380, 105, { size: 13, bold: true }); D.text(g, `Period = 2π√(L cos θ / g) = ${fmt(T)} s`, 380, 130, { size: 13, bold: true, color: K.a });
        },
        readouts: () => [["radius r = L sinθ", r, "m"], ["tension T", Tn, "N", true], ["speed v", v, "m/s", true], ["period", T, "s", true]],
      };
    },
    explain: (p) => p.mode === "banked" ? ["Resolve N and f into horizontal (toward center) and vertical parts.", "Horizontal parts must add to mv²/r; vertical parts must balance mg.", "At the ideal speed the horizontal part of N alone provides the centripetal force."] : ["The net force always points toward the center — it changes the direction of v, not its size.", "Centripetal is not a new force: it is the job done by tension, normal force, friction or gravity.", "a꜀ = v²/r = rω² (both on your equation sheet)."],
  };

  // ---------------- relative ----------------
  M.relative = {
    title: () => "Relative velocity: boat crossing a river",
    controls: (p) => [{ key: "heading", label: "Heading (upstream of straight across)", min: -60, max: 80, step: 1, unit: "°" }, { key: "vb", label: "Boat speed (rel. water)", min: 0.5, max: Math.max(10, p.vb * 2), step: 0.1, unit: "m/s" }],
    setup(p) {
      const h = rad(p.heading), vbx = -p.vb * Math.sin(h), vby = p.vb * Math.cos(h), gx = p.vr + vbx, gy = vby;
      const tc = gy > 0 ? p.w / gy : 1e9, drift = gx * tc, sp = Math.hypot(gx, gy);
      const tmax = Math.min(tc, 600);
      const len = Math.max(p.w * 1.6, Math.abs(drift) * 1.4 + p.w * 0.4);
      const view = D.view(-len / 2 + Math.min(0, drift) * 0.3, len / 2 + Math.max(0, drift) * 0.5, -p.w * 0.15, p.w * 1.15, { x: 20, y: 20, w: 600, h: 300 });
      return {
        tmax, speed: tmax / 8,
        draw(g, t) {
          g.fillStyle = "#d0ebff"; g.fillRect(view.X(view.x0), view.Y(p.w), view.X(view.x1) - view.X(view.x0), view.Y(0) - view.Y(p.w));
          g.fillStyle = "#d3f9d8"; g.fillRect(0, view.Y(0), W, H - view.Y(0)); g.fillRect(0, 0, W, view.Y(p.w));
          for (let i = 0; i < 18; i++) { const yy = p.w * ((i * 0.37) % 1), xx = ((i * 7.3 + p.vr * t) % (view.x1 - view.x0)) + view.x0; D.arrow(g, view.X(xx), view.Y(yy), view.X(xx) + 18, view.Y(yy), "rgba(24,101,242,.35)", "", { w: 1.5 }); }
          D.dim(g, view.X(view.x0) + 30, view.Y(0), view.X(view.x0) + 30, view.Y(p.w), `${fmt(p.w)} m`);
          const tt = Math.min(t, tmax), x = gx * tt, y = gy * tt;
          D.line(g, view.X(0), view.Y(0), view.X(gx * tmax), view.Y(Math.min(p.w, gy * tmax)), "rgba(0,0,0,.25)", 1.5, [6, 4]);
          const s = 60 / Math.max(p.vb, p.vr, 0.1), X = view.X(x), Y = view.Y(y);
          D.arrow(g, X, Y, X + vbx * s, Y - vby * s, "#e8590c", "boat rel. water", { off: 16 });
          D.arrow(g, X + vbx * s, Y - vby * s, X + gx * s, Y - gy * s, K.v, "river", { off: 14 });
          D.arrow(g, X, Y, X + gx * s, Y - gy * s, "#212529", "rel. ground", { off: 16, w: 3.4 });
          D.block(g, X, Y, 26, 12, -Math.atan2(vby, vbx), "#f76707");
          if (t >= tmax - 1e-6 && gy > 0) D.text(g, `lands ${fmt(Math.abs(drift))} m ${drift >= 0 ? "downstream" : "upstream"}`, view.X(drift), view.Y(p.w) - 14, { size: 12, bold: true, align: "center", bg: true });
        },
        readouts: (t) => [["v (boat rel. ground) x", gx, "m/s"], ["v (boat rel. ground) y", gy, "m/s"], ["ground speed", sp, "m/s", true], ["crossing time = w / vᵧ", gy > 0 ? tc : "never", "s", true], ["downstream drift", drift, "m", true], ["heading to go straight across", p.vb > p.vr ? `${fmt(deg(Math.asin(p.vr / p.vb)))}°` : "impossible (river too fast)", ""]],
      };
    },
    explain: () => ["v(boat rel. ground) = v(boat rel. water) + v(water rel. ground) — add them tip-to-tail.", "Only the across-river component carries the boat across, so time = width ÷ that component.", "Drift = downstream component × crossing time."],
  };

  // ---------------- forces (incline / flat / elevator / hanging) ----------------
  M.forces = {
    title: (p) => ({ incline: "Block on an incline — free-body diagram", flat: "Block on a horizontal surface — free-body diagram", elevator: "Apparent weight in an accelerating elevator", hanging: "Hanging mass held by two ropes" })[p.setup || "incline"],
    controls(p) {
      const s = p.setup || "incline";
      if (s === "elevator") return [{ key: "a", label: "Elevator acceleration (+ up)", min: -9.8, max: 9.8, step: 0.1, unit: "m/s²" }];
      if (s === "hanging") return [{ key: "th1", label: "Left rope angle", min: 5, max: 85, step: 1, unit: "°" }, { key: "th2", label: "Right rope angle", min: 5, max: 85, step: 1, unit: "°" }];
      const c = [];
      if (s === "incline") c.push({ key: "theta", label: "Incline angle θ", min: 0, max: 70, step: 1, unit: "°" });
      c.push({ key: "F", label: "Applied force F", min: 0, max: Math.max(50, Math.ceil((p.F || 0) * 2)), step: 0.5, unit: "N" });
      c.push({ key: "mus", label: "μs (static)", min: 0, max: 1.2, step: 0.01, unit: "" });
      c.push({ key: "muk", label: "μk (kinetic)", min: 0, max: 1.2, step: 0.01, unit: "" });
      return c;
    },
    defaults: { theta: 0, F: 0, Fang: 0, mus: 0, muk: 0, v0: 0, m: 2 },
    setup(p) {
      const s = p.setup || "incline", m = p.m;
      if (s === "elevator") {
        const a = p.a, N = m * (g0 + a), v0 = p.v0 || 0;
        const yf = (t) => v0 * t + 0.5 * a * t * t, vf = (t) => v0 + a * t;
        return {
          tmax: 3,
          draw(g, t) {
            const y = yf(t), sh = 150 - Math.max(-120, Math.min(120, y * 25));
            g.fillStyle = "#f1f3f5"; g.fillRect(140, 10, 160, 340);
            g.fillStyle = "#fff"; g.strokeStyle = "#495057"; g.lineWidth = 2; g.fillRect(150, sh - 60, 140, 150); g.strokeRect(150, sh - 60, 140, 150);
            D.line(g, 220, 10, 220, sh - 60, "#495057", 1.5);
            D.block(g, 220, sh + 82, 60, 8, 0, "#adb5bd"); D.text(g, `${fmt(N)} N`, 220, sh + 82, { size: 10, align: "center", bold: true, color: "#fff" });
            g.fillStyle = "#f76707"; g.beginPath(); g.arc(220, sh + 10, 12, 0, 7); g.fill(); g.fillRect(210, sh + 22, 20, 48);
            const F = 70 / (m * g0);
            D.arrow(g, 260, sh + 40, 260, sh + 40 + m * g0 * F, K.g, `mg ${fmt(m * g0)} N`, { off: 14 });
            D.arrow(g, 260, sh + 40, 260, sh + 40 - N * F, K.N, `N ${fmt(N)} N`, { off: 14 });
            D.arrow(g, 120, 180, 120, 180 - a * 10, K.a, `a = ${fmt(a)} m/s²`, { off: 14 });
            D.text(g, "Newton's 2nd law (up = +):", 360, 60, { size: 13, bold: true }); D.text(g, "N − mg = ma", 360, 85, { size: 14 }); D.text(g, `N = m(g + a) = ${fmt(N)} N`, 360, 110, { size: 14, bold: true, color: K.N });
            D.text(g, a > 0 ? "Scale reads MORE than your weight" : a < 0 ? "Scale reads LESS than your weight" : "Scale reads your true weight", 360, 145, { size: 12, color: "#495057" });
            D.text(g, `True weight mg = ${fmt(m * g0)} N`, 360, 170, { size: 12, color: K.g });
          },
          readouts: (t) => [["acceleration", a, "m/s²"], ["velocity", vf(t), "m/s"], ["scale reading N", N, "N", true], ["true weight", m * g0, "N"], ["apparent / true", N / (m * g0), ""]],
        };
      }
      if (s === "hanging") {
        const a1 = rad(p.th1), a2 = rad(p.th2), Wt = m * g0;
        const T1 = Wt * Math.cos(a2) / Math.sin(a1 + a2), T2 = Wt * Math.cos(a1) / Math.sin(a1 + a2);
        return {
          static: true, tmax: 1,
          draw(g) {
            const kx = 320, ky = 200; D.line(g, 60, 40, 580, 40, K.ground, 4);
            const L1 = 150 / Math.sin(a1 || 0.1), L2 = 150 / Math.sin(a2 || 0.1);
            const ax1 = kx - Math.min(260, L1 * Math.cos(a1)), ax2 = kx + Math.min(260, L2 * Math.cos(a2));
            D.line(g, kx, ky, ax1, 40, "#495057", 2); D.line(g, kx, ky, ax2, 40, "#495057", 2);
            D.arc(g, ax1, 40, 40, 0, a1, `${p.th1}°`); D.arc(g, ax2, 40, 40, Math.PI, Math.PI - a2, `${p.th2}°`);
            D.line(g, kx, ky, kx, ky + 50, "#495057", 2); D.block(g, kx, ky + 70, 50, 40, 0, "#1865f2", `${fmt(m)} kg`);
            const F = 110 / Math.max(T1, T2, Wt);
            D.arrow(g, kx, ky, kx - Math.cos(a1) * T1 * F, ky - Math.sin(a1) * T1 * F, K.T, `T₁ ${fmt(T1)} N`, { off: 16 });
            D.arrow(g, kx, ky, kx + Math.cos(a2) * T2 * F, ky - Math.sin(a2) * T2 * F, K.T, `T₂ ${fmt(T2)} N`, { off: 16 });
            D.arrow(g, kx + 50, ky + 70, kx + 50, ky + 70 + Wt * F * 0.6, K.g, `mg ${fmt(Wt)} N`, { off: 14 });
            D.text(g, "x: T₁cosθ₁ = T₂cosθ₂     y: T₁sinθ₁ + T₂sinθ₂ = mg", 320, 340, { size: 13, align: "center", bold: true });
          },
          readouts: () => [["weight mg", Wt, "N"], ["T₁ (left)", T1, "N", true], ["T₂ (right)", T2, "N", true], ["check x: T₁cosθ₁ − T₂cosθ₂", T1 * Math.cos(a1) - T2 * Math.cos(a2), "N"], ["check y: ΣFᵧ", T1 * Math.sin(a1) + T2 * Math.sin(a2) - Wt, "N"]],
        };
      }
      // incline / flat
      const th = rad(s === "flat" ? 0 : p.theta), fa = rad(p.Fang || 0), F = p.F || 0;
      const Fs = F * Math.cos(fa), Fn = F * Math.sin(fa);
      const Nraw = m * g0 * Math.cos(th) - Fn, N = Math.max(0, Nraw);
      const S = Fs - m * g0 * Math.sin(th);
      // piecewise motion
      const phases = []; let v0 = p.v0 || 0;
      function phase(v, t0, x0) {
        let f, a, mode;
        if (Math.abs(v) < 1e-9) {
          if (Math.abs(S) <= p.mus * N + 1e-9) { f = -S; a = 0; mode = "static"; }
          else { f = -Math.sign(S) * p.muk * N; a = (S + f) / m; mode = "kinetic"; }
        } else { f = -Math.sign(v) * p.muk * N; a = (S + f) / m; mode = "kinetic"; }
        return { t0, x0, v, a, f, mode };
      }
      let ph = phase(v0, 0, 0); phases.push(ph);
      if (ph.mode === "kinetic" && Math.abs(v0) > 1e-9 && Math.sign(ph.a) !== Math.sign(v0) && ph.a !== 0) {
        const ts = -v0 / ph.a; const xs = v0 * ts + 0.5 * ph.a * ts * ts; const ph2 = phase(0, ts, xs); phases.push(ph2);
      }
      const tmax = Math.max(2.5, phases[phases.length - 1].t0 + 2);
      const at = (t) => { let q = phases[0]; phases.forEach((z) => { if (t >= z.t0) q = z; }); const d = t - q.t0; return { x: q.x0 + q.v * d + 0.5 * q.a * d * d, v: q.v + q.a * d, a: q.a, f: q.f, mode: q.mode }; };
      const xr = Math.max(1, ...[0, tmax / 2, tmax].map((t) => Math.abs(at(t).x)));
      return {
        tmax,
        draw(g, t) {
          const st = at(t);
          const bx = 40, by = 300, L = 380;
          const ex = bx + L * Math.cos(th), ey = by - L * Math.sin(th);
          g.fillStyle = "#e9ecef"; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.lineTo(ex, by); g.closePath(); g.fill(); D.line(g, bx, by, ex, ey, K.ground, 3);
          if (th > 0) D.arc(g, bx, by, 60, 0, -th, `θ = ${fmt(deg(th))}°`, "#495057");
          const sMid = L * 0.5 + Math.max(-L * 0.42, Math.min(L * 0.42, (st.x / xr) * L * 0.4));
          const cx = bx + sMid * Math.cos(th) - Math.sin(th) * 17, cy = by - sMid * Math.sin(th) - Math.cos(th) * 17;
          D.block(g, cx, cy, 52, 34, -th, "#1865f2", `${fmt(m)} kg`);
          // FBD inset
          const ox = 530, oy = 175, fmax = Math.max(m * g0, N, Math.abs(st.f), F, 1), sc = 85 / fmax;
          g.fillStyle = "#fff"; g.strokeStyle = "#dee2e6"; g.fillRect(440, 30, 185, 300); g.strokeRect(440, 30, 185, 300);
          D.text(g, "Free-body diagram", 532, 46, { size: 12, bold: true, align: "center" });
          const u = [Math.cos(th), -Math.sin(th)], n = [-Math.sin(th), -Math.cos(th)];
          const vec = (along, perp) => [ox + (u[0] * along + n[0] * perp) * sc, oy + (u[1] * along + n[1] * perp) * sc];
          D.arrow(g, ox, oy, ox, oy + m * g0 * sc, K.g, `mg ${fmt(m * g0)}`, { off: 12, size: 11 });
          if (N > 0) D.arrow(g, ox, oy, ...vec(0, N), K.N, `N ${fmt(N)}`, { off: 12, size: 11 });
          if (Math.abs(st.f) > 1e-6) D.arrow(g, ox, oy, ...vec(st.f, 0), K.f, `f${st.mode === "static" ? "s" : "k"} ${fmt(Math.abs(st.f))}`, { off: 14, size: 11 });
          if (F > 0) D.arrow(g, ox, oy, ...vec(Fs, Fn), K.F, `F ${fmt(F)}`, { off: 12, size: 11 });
          g.fillStyle = "#212529"; g.beginPath(); g.arc(ox, oy, 4, 0, 7); g.fill();
          D.text(g, st.mode === "static" ? "STATIC: friction balances" : `KINETIC: a = ${fmt(st.a)} m/s²`, 532, 318, { size: 11, bold: true, align: "center", color: st.mode === "static" ? K.g : K.a });
          if (Nraw < 0) D.text(g, "F lifts the block off the surface!", 230, 30, { size: 12, color: K.F, bold: true, align: "center" });
          // arrows on block
          D.arrow(g, cx, cy, cx, cy + 45, K.g, "", { w: 2 });
          if (Math.abs(st.v) > 0.01) D.arrow(g, cx, cy - 34, cx + Math.sign(st.v) * u[0] * 50, cy - 34 + Math.sign(st.v) * u[1] * 50, K.v, `v ${fmt(st.v)} m/s`, { off: 22 });
          D.text(g, `Along the surface (+ = ${th > 0 ? "up the slope" : "right"}): ΣF = ${fmt(S + st.f)} N`, 20, 24, { size: 12, bold: true });
        },
        readouts: (t) => { const st = at(t); return [["weight mg", m * g0, "N"], ["mg sinθ (along)", m * g0 * Math.sin(th), "N"], ["mg cosθ (into surface)", m * g0 * Math.cos(th), "N"], ["normal force N", N, "N", true], ["friction", `${fmt(st.f)} (${st.mode})`, "N", true], ["max static μsN", p.mus * N, "N"], ["net force", S + st.f, "N"], ["acceleration", st.a, "m/s²", true], ["velocity", st.v, "m/s"], ["position along surface", st.x, "m"]]; },
        graphs: [{ title: "velocity along surface vs t", ylabel: "m/s", series: [{ f: (t) => at(t).v, color: K.v }] }, { title: "friction force vs t", ylabel: "N", series: [{ f: (t) => at(t).f, color: K.f }] }],
      };
    },
    explain: () => ["Tilt your axes: x along the surface, y perpendicular. Then N only has a y-part and friction only an x-part.", "Static friction is only as big as it needs to be (up to μsN). If the needed amount is larger, the block slips and kinetic friction μkN takes over.", "Use ΣF = ma separately in each direction."],
  };

  // ---------------- atwood / connected masses ----------------
  M.atwood = {
    title: (p) => ({ atwood: "Atwood machine", table: "Block on a table pulled by a hanging mass", incline: "Block on an incline connected to a hanging mass" })[p.setup || "atwood"],
    controls: (p) => [{ key: "m1", label: "m₁", min: 0.1, max: Math.max(10, p.m1 * 2), step: 0.1, unit: "kg" }, { key: "m2", label: "m₂ (hanging)", min: 0.1, max: Math.max(10, p.m2 * 2), step: 0.1, unit: "kg" }, ...(p.setup !== "atwood" ? [{ key: "muk", label: "μk", min: 0, max: 1, step: 0.01, unit: "" }] : []), { key: "Mp", label: "Pulley mass (disk)", min: 0, max: 10, step: 0.1, unit: "kg" }],
    defaults: { setup: "atwood", muk: 0, mus: null, theta: 30, Mp: 0, Rp: 0.1 },
    setup(p) {
      const s = p.setup, m1 = p.m1, m2 = p.m2, I = 0.5 * (p.Mp || 0) * p.Rp * p.Rp, Ieff = I / (p.Rp * p.Rp), th = rad(p.theta || 0);
      const mus = p.mus == null ? p.muk : p.mus;
      let a = 0, T1, T2, moving = true, note = "";
      if (s === "atwood") { a = (m2 - m1) * g0 / (m1 + m2 + Ieff); T1 = m1 * (g0 + a); T2 = m2 * (g0 - a); }
      else if (s === "table") {
        if (m2 * g0 <= mus * m1 * g0) { moving = false; a = 0; T1 = T2 = m2 * g0; note = "static friction holds"; }
        else { a = (m2 * g0 - p.muk * m1 * g0) / (m1 + m2 + Ieff); T2 = m2 * (g0 - a); T1 = m1 * a + p.muk * m1 * g0; }
      } else {
        const drive = m2 * g0 - m1 * g0 * Math.sin(th), fr = m1 * g0 * Math.cos(th);
        if (Math.abs(drive) <= mus * fr) { moving = false; a = 0; T1 = T2 = m2 * g0; note = "static friction holds"; }
        else { const dir = Math.sign(drive); a = (drive - dir * p.muk * fr) / (m1 + m2 + Ieff); T2 = m2 * (g0 - a); T1 = m1 * a + m1 * g0 * Math.sin(th) + dir * p.muk * fr; }
      }
      const dmax = 1.0, tmax = moving && Math.abs(a) > 1e-6 ? Math.min(4, Math.sqrt((2 * dmax) / Math.abs(a))) : 2.5;
      const sf = (t) => 0.5 * a * t * t, vf = (t) => a * t;
      return {
        tmax,
        draw(g, t) {
          const d = sf(t) * 150, F = 60 / Math.max(m1, m2) / g0, Rp = 26;
          if (s === "atwood") {
            const px = 300, py = 60; D.line(g, px, 10, px, py, "#495057", 3);
            g.save(); g.translate(px, py); g.rotate(sf(t) / p.Rp * 0.3); g.fillStyle = p.Mp ? "#868e96" : "#ced4da"; g.beginPath(); g.arc(0, 0, Rp, 0, 7); g.fill(); g.strokeStyle = "#495057"; g.beginPath(); g.moveTo(-Rp, 0); g.lineTo(Rp, 0); g.stroke(); g.restore();
            const y1 = 190 - d, y2 = 190 + d;
            D.line(g, px - Rp, py, px - Rp, y1 - 20, "#495057", 1.5); D.line(g, px + Rp, py, px + Rp, y2 - 20, "#495057", 1.5);
            D.block(g, px - Rp, y1, 44, 40, 0, "#1865f2", `m₁ ${fmt(m1)}`); D.block(g, px + Rp, y2, 44, 40, 0, "#e8590c", `m₂ ${fmt(m2)}`);
            D.arrow(g, px - Rp - 40, y1, px - Rp - 40, y1 - T1 * F, K.T, `T₁ ${fmt(T1)}`, { off: 12 }); D.arrow(g, px - Rp - 40, y1, px - Rp - 40, y1 + m1 * g0 * F, K.g, `m₁g ${fmt(m1 * g0)}`, { off: 12 });
            D.arrow(g, px + Rp + 40, y2, px + Rp + 40, y2 - T2 * F, K.T, `T₂ ${fmt(T2)}`, { off: 12 }); D.arrow(g, px + Rp + 40, y2, px + Rp + 40, y2 + m2 * g0 * F, K.g, `m₂g ${fmt(m2 * g0)}`, { off: 12 });
          } else if (s === "table") {
            const tx = 40, ty = 180, tw = 400; g.fillStyle = "#e9ecef"; g.fillRect(tx, ty, tw, 14); D.line(g, tx + 20, ty + 14, tx + 20, 340, "#adb5bd", 6); D.line(g, tx + tw - 20, ty + 14, tx + tw - 20, 340, "#adb5bd", 6);
            const px = tx + tw + 10, py = ty - 6; g.fillStyle = "#ced4da"; g.beginPath(); g.arc(px, py, 16, 0, 7); g.fill();
            const bx = 200 + d; D.block(g, bx, ty - 22, 60, 44, 0, "#1865f2", `m₁ ${fmt(m1)}`);
            D.line(g, bx + 30, ty - 22, px, py - 16, "#495057", 1.5); D.line(g, px + 16, py, px + 16, 250 + d - 22, "#495057", 1.5);
            D.block(g, px + 16, 250 + d, 40, 40, 0, "#e8590c", `m₂ ${fmt(m2)}`);
            D.arrow(g, bx + 30, ty - 40, bx + 30 + T1 * F, ty - 40, K.T, `T ${fmt(T1)}`, { off: 18 });
            if (p.muk) D.arrow(g, bx - 30, ty - 4, bx - 30 - (moving ? p.muk * m1 * g0 : T1) * F, ty - 4, K.f, `f ${fmt(moving ? p.muk * m1 * g0 : T1)}`, { off: 18 });
            D.arrow(g, px + 50, 250 + d, px + 50, 250 + d - T2 * F, K.T, `T ${fmt(T2)}`, { off: 12 }); D.arrow(g, px + 50, 250 + d, px + 50, 250 + d + m2 * g0 * F, K.g, `m₂g ${fmt(m2 * g0)}`, { off: 12 });
          } else {
            const bx = 40, by = 310, L = 380, ex = bx + L * Math.cos(th), ey = by - L * Math.sin(th);
            g.fillStyle = "#e9ecef"; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.lineTo(ex, by); g.closePath(); g.fill(); D.line(g, bx, by, ex, ey, K.ground, 3);
            D.arc(g, bx, by, 46, 0, -th, `${fmt(p.theta)}°`);
            g.fillStyle = "#ced4da"; g.beginPath(); g.arc(ex + 8, ey - 8, 14, 0, 7); g.fill();
            const sPos = L * 0.55 + d, cx = bx + sPos * Math.cos(th) - Math.sin(th) * 18, cy = by - sPos * Math.sin(th) - Math.cos(th) * 18;
            D.block(g, cx, cy, 50, 34, -th, "#1865f2", `m₁ ${fmt(m1)}`);
            D.line(g, cx + 25 * Math.cos(th), cy - 25 * Math.sin(th), ex + 8 - 14 * Math.sin(th), ey - 8 - 14 * Math.cos(th), "#495057", 1.5);
            D.line(g, ex + 22, ey - 8, ex + 22, ey + 70 + d, "#495057", 1.5); D.block(g, ex + 22, ey + 90 + d, 36, 36, 0, "#e8590c", `m₂`);
            D.arrow(g, cx, cy, cx + Math.cos(th) * T1 * F, cy - Math.sin(th) * T1 * F, K.T, `T₁ ${fmt(T1)}`, { off: 16 });
            D.arrow(g, cx, cy, cx, cy + m1 * g0 * F, K.g, "m₁g", { off: 10 });
          }
          D.text(g, moving ? `a = ${fmt(a)} m/s²  (${a >= 0 ? "m₂ moves down" : "m₂ moves up"})` : `No motion — ${note}`, 20, 24, { size: 14, bold: true, color: K.a });
          if (p.Mp) D.text(g, `Massive pulley: T₁ ≠ T₂ because the pulley needs a net torque (I = ½MR²)`, 20, 46, { size: 11, color: "#495057" });
        },
        readouts: (t) => [["acceleration a", a, "m/s²", true], ["tension T₁ (m₁ side)", T1, "N", true], ["tension T₂ (m₂ side)", T2, "N"], ["speed", Math.abs(vf(t)), "m/s"], ["distance moved", Math.abs(sf(t)), "m"], ["system mass (+I/R²)", m1 + m2 + Ieff, "kg"]],
        graphs: [{ title: "speed vs t", ylabel: "m/s", series: [{ f: (t) => Math.abs(vf(t)), color: K.v }] }, { title: "distance vs t", ylabel: "m", series: [{ f: (t) => Math.abs(sf(t)), color: K.ink }] }],
        facts: [["a", `${fmt(a)} m/s²`], ["T₁", `${fmt(T1)} N`]],
      };
    },
    explain: () => ["Treat the masses as one system to get a quickly: a = (net external force along the string) ÷ (total mass).", "Then isolate one mass and use ΣF = ma on it to find the tension.", "With a massive pulley, add I/R² to the mass in the denominator."],
  };

  // ---------------- drag ----------------
  M.drag = {
    title: () => "Falling with linear drag: F = −bv",
    controls: (p) => [{ key: "m", label: "Mass m", min: 0.01, max: Math.max(5, p.m * 3), step: 0.01, unit: "kg" }, { key: "b", label: "Drag constant b", min: 0.01, max: Math.max(5, p.b * 3), step: 0.01, unit: "kg/s" }],
    setup(p) {
      const m = p.m, b = p.b, v0 = p.v0 || 0, vT = (m * g0) / b, tau = m / b;
      const vf = (t) => vT + (v0 - vT) * Math.exp(-t / tau), af = (t) => g0 - (b / m) * vf(t), yf = (t) => vT * t + (v0 - vT) * tau * (1 - Math.exp(-t / tau));
      const tmax = 5 * tau;
      return {
        tmax, speed: tmax / 6,
        draw(g, t) {
          const y = yf(t), v = vf(t);
          g.fillStyle = "#e7f5ff"; g.fillRect(80, 0, 220, H);
          for (let k = -2; k < 14; k++) { const yy = ((k * 40 - (y * 30) % 40) + 400) % 440 - 40; D.line(g, 90, yy, 290, yy, "rgba(24,101,242,.12)", 1); D.text(g, "", 0, 0); }
          D.ball(g, 190, 160, 16, "#f76707");
          const F = 90 / (m * g0);
          D.arrow(g, 190, 160, 190, 160 + m * g0 * F, K.g, `mg ${fmt(m * g0)} N`, { off: 14 });
          D.arrow(g, 190, 160, 190, 160 - b * v * F, K.F, `bv ${fmt(b * v)} N`, { off: 14 });
          D.text(g, "Newton's 2nd law (down = +):", 330, 50, { size: 13, bold: true }); D.text(g, "m dv/dt = mg − bv", 330, 75, { size: 14 });
          D.text(g, `terminal speed v_T = mg/b = ${fmt(vT)} m/s`, 330, 110, { size: 13, bold: true, color: K.v }); D.text(g, `time constant τ = m/b = ${fmt(tau)} s`, 330, 135, { size: 13, bold: true, color: K.a });
          D.text(g, `v(t) = v_T(1 − e^(−t/τ))`, 330, 160, { size: 13 });
          D.text(g, `Now: ${fmt((100 * v) / vT)}% of terminal speed`, 330, 195, { size: 13, color: "#495057" });
          D.text(g, "(view follows the falling object)", 190, 340, { size: 10, align: "center", color: K.muted });
        },
        readouts: (t) => [["t", t.toFixed(2), "s"], ["v", vf(t), "m/s"], ["a = g − (b/m)v", af(t), "m/s²"], ["drag force bv", b * vf(t), "N"], ["distance fallen", yf(t), "m"], ["terminal speed", vT, "m/s", true], ["τ = m/b", tau, "s", true]],
        graphs: [{ title: "v vs t (approaches v_T)", ylabel: "m/s", series: [{ f: vf, color: K.v }], hlines: [{ y: vT, label: "v_T", color: K.v }, { y: 0.632 * vT + 0.368 * v0, label: "63% at t = τ", color: K.a }] }, { title: "a vs t (decays to 0)", ylabel: "m/s²", series: [{ f: af, color: K.a }] }],
        facts: [["terminal speed", `${fmt(vT)} m/s`], ["time to 63% of v_T", `${fmt(tau)} s`]],
      };
    },
    explain: () => ["As speed grows, the drag force bv grows until it equals mg — then a = 0 and v = v_T.", "Solving m dv/dt = mg − bv gives an exponential approach: after one τ you're at 63% of v_T, after 5τ you're above 99%.", "The acceleration starts at g and decays exponentially to zero."],
  };
})();
