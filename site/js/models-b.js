/* Models, batch B: energy, forcegraph, collision, impulse, com, rotation, torque, rolling, angmom, beam, orbit, shm */
(function () {
  const { D, COLORS: K, fmt, W, H, integrate } = window.Models;
  const M = window.Models.MODELS;
  const g0 = 9.8, G = 6.67e-11;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

  // ---------------- energy ----------------
  M.energy = {
    title: (p) => ({ drop: "Energy in free fall", ramp: "Sliding down a ramp, then across a rough floor", spring: "Spring launch onto a rough surface", track: "Roller-coaster track: energy bar chart", pendulum: "Pendulum: trading U and K", vspring: "Dropping onto a vertical spring" })[p.scene],
    tag: "Energy model",
    controls(p) {
      const c = [];
      if (["drop", "ramp", "track", "vspring"].includes(p.scene)) c.push({ key: "h", label: "Height h", min: 0.5, max: Math.max(30, Math.ceil(p.h * 2)), step: 0.5, unit: "m" });
      if (p.scene === "ramp" || p.scene === "spring") c.push({ key: "muk", label: "Floor μk", min: 0, max: 1, step: 0.01, unit: "" });
      if (p.scene === "spring" || p.scene === "vspring") c.push({ key: "k", label: "Spring constant k", min: 10, max: Math.max(2000, p.k * 2), step: 10, unit: "N/m" });
      if (p.scene === "spring") c.push({ key: "x0", label: "Compression", min: 0.01, max: Math.max(0.5, p.x0 * 2), step: 0.01, unit: "m" });
      if (p.scene === "pendulum") c.push({ key: "angle0", label: "Release angle", min: 5, max: 90, step: 1, unit: "°" });
      return c;
    },
    defaults: { m: 1, muk: 0, theta: 30 },
    setup(p) {
      const m = p.m;
      let tmax, st, drawScene, Emax;
      if (p.scene === "drop") {
        const h = p.h, tf = Math.sqrt((2 * h) / g0); tmax = tf; Emax = m * g0 * h;
        st = (t) => { const y = h - 0.5 * g0 * t * t; return { y: Math.max(0, y), v: g0 * t, K: 0.5 * m * (g0 * t) ** 2, Ug: m * g0 * Math.max(0, y), Us: 0, Eth: 0 }; };
        drawScene = (g, s) => { const sc = 280 / h, X = 160; D.ground(g, 60, 300, 320); D.dim(g, 90, 320, 90, 320 - h * sc, `h = ${fmt(h)} m`); D.ball(g, X, 320 - s.y * sc - 10, 10); D.arrow(g, X + 20, 320 - s.y * sc - 10, X + 20, 320 - s.y * sc - 10 + Math.min(80, s.v * 4), K.v, `v ${fmt(s.v)}`, { off: 12 }); };
      } else if (p.scene === "ramp") {
        const h = p.h, th = rad(p.theta), L1 = h / Math.sin(th), a1 = g0 * (Math.sin(th) - (p.mukRamp || 0) * Math.cos(th));
        const t1 = Math.sqrt((2 * L1) / a1), vb = a1 * t1, a2 = p.muk * g0, tFree = 1.5, d2 = a2 > 0 ? (vb * vb) / (2 * a2) : vb * tFree, t2 = a2 > 0 ? vb / a2 : tFree;
        tmax = t1 + t2; Emax = m * g0 * h;
        st = (t) => {
          if (t <= t1) { const s = 0.5 * a1 * t * t, v = a1 * t, y = h - s * Math.sin(th); return { s, y, v, x: -L1 * Math.cos(th) + s * Math.cos(th), K: 0.5 * m * v * v, Ug: m * g0 * y, Us: 0, Eth: (p.mukRamp || 0) * m * g0 * Math.cos(th) * s }; }
          const tt = Math.min(t - t1, a2 > 0 ? t2 : 1e9), v = Math.max(0, vb - a2 * tt), d = vb * tt - 0.5 * a2 * tt * tt;
          const E1 = (p.mukRamp || 0) * m * g0 * Math.cos(th) * L1;
          return { y: 0, v, x: d, K: 0.5 * m * v * v, Ug: 0, Us: 0, Eth: E1 + a2 * m * d, d };
        };
        const span = L1 * Math.cos(th) + Math.min(d2, 40) * 1.1; const sc = Math.min(260 / h, 540 / span), ox = 40 + L1 * Math.cos(th) * sc;
        drawScene = (g, s) => {
          g.fillStyle = "#e9ecef"; g.beginPath(); g.moveTo(40, 320 - h * sc); g.lineTo(ox, 320); g.lineTo(40, 320); g.closePath(); g.fill();
          D.line(g, 40, 320 - h * sc, ox, 320, K.ground, 3); D.ground(g, ox, 600, 320); if (p.muk) { g.fillStyle = "rgba(232,89,12,.15)"; g.fillRect(ox, 314, 600 - ox, 6); D.text(g, `rough: μk = ${p.muk}`, ox + 80, 336, { size: 11, color: K.Eth }); }
          D.dim(g, 30, 320, 30, 320 - h * sc, `${fmt(h)} m`);
          const X = ox + s.x * sc, Y = 320 - s.y * sc; D.block(g, X, Y - 12, 26, 22, s.y > 0 ? th : 0, "#1865f2");
          if (s.d != null && s.v <= 1e-6 && a2 > 0) D.dim(g, ox, 300, ox + s.d * sc, 300, `stops after ${fmt(s.d)} m`);
        };
      } else if (p.scene === "spring") {
        const k = p.k, x0 = p.x0, w = Math.sqrt(k / m), t1 = Math.PI / (2 * w), vl = x0 * w, a2 = p.muk * g0;
        const fricSpring = false;
        const t2 = a2 > 0 ? vl / a2 : 2.5, d2 = a2 > 0 ? (vl * vl) / (2 * a2) : vl * 2.5; tmax = t1 + t2; Emax = 0.5 * k * x0 * x0;
        st = (t) => {
          if (t <= t1) { const x = -x0 * Math.cos(w * t), v = x0 * w * Math.sin(w * t); return { x, v, K: 0.5 * m * v * v, Us: 0.5 * k * x * x, Ug: 0, Eth: 0 }; }
          const tt = t - t1, v = Math.max(0, vl - a2 * tt), d = vl * tt - 0.5 * a2 * tt * tt;
          return { x: d, v, K: 0.5 * m * v * v, Us: 0, Ug: 0, Eth: a2 * m * d, d };
        };
        void fricSpring;
        const sc = Math.min(160 / x0, 420 / Math.max(d2, 0.1)), ox = 180;
        drawScene = (g, s) => {
          D.ground(g, 20, 620, 260); D.line(g, 40, 180, 40, 260, K.ground, 5);
          const bx = ox + s.x * sc; D.spring(g, 40, 238, Math.min(bx - 18, ox - 18 + Math.min(0, s.x) * sc + (s.x > 0 ? 0 : 0)), 238, 12, 8);
          D.block(g, bx, 238, 36, 36, 0, "#1865f2", `${fmt(m)}kg`);
          D.line(g, ox, 270, ox, 200, K.muted, 1, [3, 3]); D.text(g, "spring's natural length", ox, 190, { size: 10, align: "center", color: K.muted });
          if (s.x < 0) D.dim(g, bx, 285, ox, 285, `compressed ${fmt(-s.x)} m`);
          if (s.d != null) D.dim(g, ox, 300, bx, 300, `${fmt(s.d)} m`);
          if (p.muk) D.text(g, `rough floor μk = ${p.muk}`, 420, 330, { size: 11, color: K.Eth });
        };
      } else if (p.scene === "vspring") {
        // drop mass from h above spring top, compresses to max then stop (show only down phase)
        const h = p.h, k = p.k, xm = (m * g0 + Math.sqrt((m * g0) ** 2 + 2 * k * m * g0 * h)) / k;
        const tf = Math.sqrt((2 * h) / g0), v1 = g0 * tf, w = Math.sqrt(k / m), xe = (m * g0) / k;
        const A = Math.sqrt(xe * xe + (v1 / w) ** 2), ph = Math.atan2(v1 / w, -xe); // x(t)=xe + A sin(w t - ?), solve generally
        // x(t) measured downward from spring top: x = xe + B cos(w t) + C sin(w t), x(0)=0, v(0)=v1
        const B = -xe, Cc = v1 / w; const tdn = (Math.atan2(Cc, B) + 2 * Math.PI) % (2 * Math.PI) / w;
        void A; void ph;
        tmax = tf + tdn; Emax = m * g0 * (h + xm);
        st = (t) => {
          if (t <= tf) { const y = h - 0.5 * g0 * t * t; return { y, v: g0 * t, K: 0.5 * m * (g0 * t) ** 2, Ug: m * g0 * (y + xm), Us: 0, Eth: 0 }; }
          const tt = t - tf, x = xe + B * Math.cos(w * tt) + Cc * Math.sin(w * tt), v = -B * w * Math.sin(w * tt) + Cc * w * Math.cos(w * tt);
          return { y: -x, v, K: 0.5 * m * v * v, Ug: m * g0 * (xm - x), Us: 0.5 * k * x * x, Eth: 0 };
        };
        const sc = 250 / (h + xm), top = 300 - xm * sc;
        drawScene = (g, s) => {
          D.ground(g, 60, 300, 300 + 4);
          const ytop = top - Math.max(0, -s.y) * 0 + (s.y < 0 ? -s.y * sc : 0);
          D.spring(g, 160, 300, 160, top + (s.y < 0 ? -s.y * sc : 0), 9, 12);
          D.ball(g, 160, top - Math.max(s.y, 0) * sc - 12 + (s.y < 0 ? -s.y * sc : 0), 12);
          D.dim(g, 110, top, 110, top - h * sc, `h = ${fmt(h)} m`); D.dim(g, 210, top, 210, 300 - (xm < 0 ? 0 : 0) - 0, "");
          D.text(g, `max compression ${fmt(xm)} m`, 230, top + xm * sc / 2, { size: 11, color: K.Us });
          void ytop;
        };
      } else if (p.scene === "track") {
        const h = p.h, L = 40, yTr = (x) => { const u = x / L; return h * (0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, u * 1.6))) * (u < 0.625 ? 1 : 0) + (u >= 0.625 ? h * (p.hill || 0.55) * Math.sin(Math.PI * Math.min(1, (u - 0.625) / 0.375)) ** 2 : 0); };
        const dy = (x) => (yTr(x + 1e-3) - yTr(x - 1e-3)) / 2e-3;
        const sol = integrate((t, y) => { const x = y[0]; const v2 = 2 * g0 * (h - yTr(x)) + (p.v0 || 0.3) ** 2; const v = Math.sqrt(Math.max(v2, 0)); return [v / Math.sqrt(1 + dy(x) ** 2)]; }, [0.001], 30, 0.005, (t, y) => y[0] >= L);
        tmax = sol.tEnd; Emax = m * g0 * h + 0.5 * m * (p.v0 || 0.3) ** 2;
        st = (t) => { const x = sol.at(t)[0], y = yTr(x), v = Math.sqrt(Math.max(0, 2 * g0 * (h - y) + (p.v0 || 0.3) ** 2)); return { x, y, v, K: 0.5 * m * v * v, Ug: m * g0 * y, Us: 0, Eth: 0 }; };
        const sc = Math.min(250 / h, 540 / L);
        drawScene = (g, s) => {
          g.save(); g.strokeStyle = "#495057"; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 200; i++) { const x = (L * i) / 200; i ? g.lineTo(40 + x * sc, 320 - yTr(x) * sc) : g.moveTo(40 + x * sc, 320 - yTr(x) * sc); } g.stroke(); g.restore();
          D.ground(g, 30, 610, 322);
          D.dim(g, 30, 320, 30, 320 - h * sc, `${fmt(h)} m`);
          D.ball(g, 40 + s.x * sc, 320 - s.y * sc - 9, 9);
          D.text(g, `v = ${fmt(s.v)} m/s`, 40 + s.x * sc, 320 - s.y * sc - 30, { size: 11, align: "center", bg: true, bold: true, color: K.v });
        };
      } else {
        // pendulum (exact, numeric)
        const L = p.L || 1, th0 = rad(p.angle0);
        const sol = integrate((t, y) => [y[1], -(g0 / L) * Math.sin(y[0])], [th0, 0], 30, 0.002, (t, y) => t > 0.2 && y[1] > 0 && y[0] >= th0 - 1e-3);
        tmax = sol.tEnd; Emax = m * g0 * L * (1 - Math.cos(th0));
        st = (t) => { const [th, w] = sol.at(t), v = L * Math.abs(w), y = L * (1 - Math.cos(th)); return { th, v, y, K: 0.5 * m * v * v, Ug: m * g0 * y, Us: 0, Eth: 0, Tn: m * v * v / L + m * g0 * Math.cos(th) }; };
        drawScene = (g, s) => {
          const px = 210, py = 40, sc = 230 / L, bx = px + L * sc * Math.sin(s.th), by = py + L * sc * Math.cos(s.th);
          D.line(g, 130, py, 290, py, K.ground, 4); D.line(g, px, py, px, py + L * sc + 10, "#ced4da", 1, [3, 3]);
          g.save(); g.strokeStyle = "rgba(24,101,242,.25)"; g.setLineDash([4, 4]); g.beginPath(); g.arc(px, py, L * sc, Math.PI / 2 - th0, Math.PI / 2 + th0); g.stroke(); g.restore();
          D.line(g, px, py, bx, by, "#495057", 1.6); D.ball(g, bx, by, 12);
          D.dim(g, px + L * sc * Math.sin(th0) + 20, py + L * sc * Math.cos(th0), px + L * sc * Math.sin(th0) + 20, py + L * sc, `${fmt(L * (1 - Math.cos(th0)))} m`);
          const F = 60 / (m * g0); D.arrow(g, bx, by, bx + (px - bx) / (L * sc) * s.Tn * F, by + (py - by) / (L * sc) * s.Tn * F, K.T, `T ${fmt(s.Tn)}`, { off: 12 }); D.arrow(g, bx, by, bx, by + m * g0 * F, K.g, "mg", { off: 10 });
        };
      }
      const Etot = (s) => s.K + s.Ug + s.Us + s.Eth;
      return {
        tmax,
        draw(g, t) {
          const s = st(t); drawScene(g, s);
          D.bars(g, 440, 20, 190, 300, [{ label: "K", value: s.K, color: K.K }, { label: "U_g", value: s.Ug, color: K.U }, { label: "U_s", value: s.Us, color: K.Us }, { label: "E_th", value: s.Eth, color: K.Eth }, { label: "Total", value: Etot(s), color: "#495057" }], Emax * 1.05, "Energy (J)");
        },
        readouts: (t) => { const s = st(t); return [["t", t.toFixed(2), "s"], ["speed", s.v, "m/s", true], ["kinetic K", s.K, "J"], ["gravitational U_g", s.Ug, "J"], ["spring U_s", s.Us, "J"], ["thermal E_th", s.Eth, "J"], ["total", Etot(s), "J"]]; },
        graphs: [{ title: "energy vs t", ylabel: "J", series: [{ f: (t) => st(t).K, color: K.K, name: "K" }, { f: (t) => st(t).Ug + st(t).Us, color: K.U, name: "U" }, { f: (t) => st(t).Eth, color: K.Eth, name: "E_th" }] }, { title: "speed vs t", ylabel: "m/s", series: [{ f: (t) => st(t).v, color: K.v }] }],
      };
    },
    explain: () => ["The bars always add up to the same total — energy moves between forms but isn't created or destroyed.", "Without friction, K + U stays constant (mechanical energy is conserved).", "Kinetic friction turns mechanical energy into thermal energy: E_th = f_k·d."],
  };

  // ---------------- forcegraph (work area / potential-energy curve) ----------------
  M.forcegraph = {
    title: (p) => (p.mode === "ucurve" ? "Potential-energy curve: the particle rolls inside U(x)" : "Work = area under the F–x graph"),
    tag: "Graph model",
    controls: (p) => (p.mode === "ucurve" ? [{ key: "E", label: "Total energy E", min: p.Emin != null ? p.Emin : -10, max: p.Emax != null ? p.Emax : 20, step: 0.1, unit: "J" }] : []),
    setup(p) {
      if (p.mode === "ucurve") {
        const U = p.U, m = p.m || 1, [xa, xb] = p.xr; const F = (x) => -(U(x + 1e-4) - U(x - 1e-4)) / 2e-4;
        let lo = Infinity, hi = -Infinity; for (let i = 0; i <= 200; i++) { const u = U(xa + ((xb - xa) * i) / 200); lo = Math.min(lo, u); hi = Math.max(hi, u); }
        hi = Math.max(hi, p.E); lo = Math.min(lo, p.E);
        const pad = (hi - lo) * 0.12 || 1;
        const view = D.view(xa, xb, lo - pad, hi + pad, { x: 50, y: 20, w: 560, h: 290 }, false);
        let x0 = p.x0;
        const sol = integrate((t, y) => [y[1], F(y[0]) / m], [x0, 0], 40, 0.004, (t, y) => y[0] < xa || y[0] > xb);
        const turning = []; for (let i = 0; i < 400; i++) { const a = xa + ((xb - xa) * i) / 400, b = xa + ((xb - xa) * (i + 1)) / 400; if ((U(a) - p.E) * (U(b) - p.E) < 0) turning.push((a + b) / 2); }
        const eq = []; for (let i = 1; i < 400; i++) { const a = xa + ((xb - xa) * (i - 1)) / 400, b = xa + ((xb - xa) * i) / 400; if (F(a) * F(b) < 0) eq.push({ x: (a + b) / 2, stable: F(a) > 0 }); }
        return {
          tmax: Math.min(sol.tEnd, 40), speed: 1,
          draw(g, t) {
            D.grid(g, view, 0, { stepX: D.niceStep(xb - xa, 8), stepY: D.niceStep(hi - lo + 2 * pad, 6), units: ["x (m)", "U (J)"] });
            g.save(); g.strokeStyle = K.U; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 300; i++) { const x = xa + ((xb - xa) * i) / 300; i ? g.lineTo(view.X(x), view.Y(U(x))) : g.moveTo(view.X(x), view.Y(U(x))); } g.stroke(); g.restore();
            D.line(g, view.X(xa), view.Y(p.E), view.X(xb), view.Y(p.E), K.E, 2, [7, 4]); D.text(g, `E = ${fmt(p.E)} J`, view.X(xb) - 4, view.Y(p.E) - 10, { size: 12, bold: true, align: "right", bg: true });
            g.save(); g.fillStyle = "rgba(43,138,62,.08)"; for (let i = 0; i < 300; i++) { const x = xa + ((xb - xa) * i) / 300; if (U(x) > p.E) g.fillRect(view.X(x), view.Y(hi + pad), view.X(xb) / 300 + 2, view.Y(U(x)) - view.Y(hi + pad)); } g.restore();
            turning.forEach((x) => { D.line(g, view.X(x), view.Y(p.E), view.X(x), view.Y(lo - pad), "#ae3ec9", 1, [3, 3]); D.text(g, "turning pt", view.X(x), view.Y(lo - pad) - 8, { size: 10, align: "center", color: "#ae3ec9" }); });
            eq.forEach((e) => D.text(g, e.stable ? "● stable eq." : "○ unstable eq.", view.X(e.x), view.Y(U(e.x)) + (e.stable ? 16 : -14), { size: 10, align: "center", color: "#495057", bg: true }));
            const [x, v] = sol.at(t);
            D.line(g, view.X(x), view.Y(U(x)), view.X(x), view.Y(p.E), K.K, 5);
            D.text(g, `K = ${fmt(p.E - U(x))} J`, view.X(x) + 8, (view.Y(U(x)) + view.Y(p.E)) / 2, { size: 11, color: K.K, bold: true, bg: true });
            D.ball(g, view.X(x), view.Y(U(x)) - 9, 9);
            const f = F(x); D.arrow(g, view.X(x), view.Y(U(x)) - 30, view.X(x) + Math.max(-60, Math.min(60, f * 6)), view.Y(U(x)) - 30, K.F, `F = −dU/dx = ${fmt(f)} N`, { off: 26 });
            void v;
          },
          readouts: (t) => { const [x, v] = sol.at(t); return [["x", x, "m"], ["U(x)", U(x), "J"], ["K = E − U", p.E - U(x), "J"], ["speed", Math.abs(v), "m/s"], ["F = −dU/dx", F(x), "N"], ["turning points", turning.map((q) => fmt(q)).join(", ") || "none", "m", true]]; },
        };
      }
      // work mode
      const F = p.F, x1 = p.x1, x2 = p.x2, xa = p.xr ? p.xr[0] : Math.min(x1, x2, 0), xb = p.xr ? p.xr[1] : Math.max(x1, x2) * 1.1;
      const Wf = (x) => { let s = 0, n = 200; for (let i = 0; i < n; i++) { const a = x1 + ((x - x1) * i) / n, b = x1 + ((x - x1) * (i + 1)) / n; s += ((F(a) + F(b)) / 2) * (b - a); } return s; };
      const Wtot = Wf(x2);
      const xOf = (t) => x1 + (x2 - x1) * Math.min(1, t / 4);
      let lo = 0, hi = 0; for (let i = 0; i <= 200; i++) { const f = F(xa + ((xb - xa) * i) / 200); lo = Math.min(lo, f); hi = Math.max(hi, f); }
      const pad = (hi - lo) * 0.12 || 1;
      const view = D.view(xa, xb, lo - pad, hi + pad, { x: 56, y: 110, w: 550, h: 210 }, false);
      const vAt = (x) => (p.m ? Math.sqrt(Math.max(0, (p.vi || 0) ** 2 + (2 * Wf(x)) / p.m)) : null);
      return {
        tmax: 4.5,
        draw(g, t) {
          const x = xOf(t);
          D.grid(g, view, 0, { stepX: D.niceStep(xb - xa, 8), stepY: D.niceStep(hi - lo + 2 * pad, 4), units: [`x (${p.xu || "m"})`, `F (${p.fu || "N"})`] });
          g.save(); g.fillStyle = Wf(x) >= 0 ? "rgba(24,101,242,.22)" : "rgba(217,41,22,.2)"; g.beginPath(); g.moveTo(view.X(x1), view.Y(0)); for (let i = 0; i <= 100; i++) { const xx = x1 + ((x - x1) * i) / 100; g.lineTo(view.X(xx), view.Y(F(xx))); } g.lineTo(view.X(x), view.Y(0)); g.closePath(); g.fill(); g.restore();
          g.save(); g.strokeStyle = K.F; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 300; i++) { const xx = xa + ((xb - xa) * i) / 300; i ? g.lineTo(view.X(xx), view.Y(F(xx))) : g.moveTo(view.X(xx), view.Y(F(xx))); } g.stroke(); g.restore();
          // block on a track above
          D.ground(g, view.X(xa), view.X(xb), 80);
          D.block(g, view.X(x), 66, 30, 26, 0, "#1865f2");
          const f = F(x); D.arrow(g, view.X(x), 50, view.X(x) + Math.max(-70, Math.min(70, (f / Math.max(Math.abs(hi), Math.abs(lo), 1e-9)) * 70)), 50, K.F, `F = ${fmt(f)} ${p.fu || "N"}`, { off: 30 });
          D.text(g, `W so far = area = ${fmt(Wf(x))} J`, 20, 20, { size: 14, bold: true, color: K.v });
          if (p.m) D.text(g, `speed = √(v₀² + 2W/m) = ${fmt(vAt(x))} m/s`, 330, 20, { size: 13, bold: true, color: "#495057" });
        },
        readouts: (t) => { const x = xOf(t); return [["position x", x, p.xu || "m"], ["force F(x)", F(x), p.fu || "N"], ["work so far ∫F dx", Wf(x), "J"], ["total work x₁→x₂", Wtot, "J", true], ...(p.m ? [["speed", vAt(x), "m/s"]] : [])]; },
        facts: [["W (x₁→x₂)", `${fmt(Wtot)} J`]],
        graphs: [{ title: "work done vs x", xlabel: `x (${p.xu || "m"})`, ylabel: "J", x0: xa, x1: xb, series: [{ f: (x) => (x < Math.min(x1, x2) || x > Math.max(x1, x2) ? NaN : Wf(x)), color: K.v }], xOf }],
      };
    },
    explain: (p) => (p.mode === "ucurve" ? ["The particle can only be where E ≥ U(x); where the curve rises above the E line it must turn around.", "The gap between the E line and the curve is the kinetic energy.", "Force is the negative slope: F = −dU/dx, so the particle is pushed downhill on the curve. Minima are stable equilibria, maxima unstable."] : ["Work is the signed area between the F(x) curve and the x-axis: W = ∫F dx.", "Area below the axis counts as negative work.", "By the work–kinetic energy theorem the total work equals ΔK."]),
  };

  // ---------------- collision ----------------
  M.collision = {
    title: (p) => (p.dim === 2 ? "Two-dimensional collision: momentum in x and y" : `One-dimensional ${p.kind === "elastic" ? "elastic" : p.kind === "inelastic" ? "perfectly inelastic" : ""} collision`),
    controls: (p) => (p.dim === 2 ? [] : [{ key: "m1", label: "m₁", min: 0.1, max: Math.max(10, p.m1 * 2), step: 0.1, unit: "kg" }, { key: "m2", label: "m₂", min: 0.1, max: Math.max(10, p.m2 * 2), step: 0.1, unit: "kg" }, { key: "v1", label: "v₁ initial", min: -15, max: 15, step: 0.1, unit: "m/s" }]),
    setup(p) {
      if (p.dim === 2) {
        const { m1, m2 } = p, v1 = p.v1, v2 = p.v2 || [0, 0];
        const P = [m1 * v1[0] + m2 * v2[0], m1 * v1[1] + m2 * v2[1]];
        let v1f, v2f;
        if (p.stick) { v1f = v2f = [P[0] / (m1 + m2), P[1] / (m1 + m2)]; } else { v1f = p.v1f; v2f = [(P[0] - m1 * v1f[0]) / m2, (P[1] - m1 * v1f[1]) / m2]; }
        const Ki = 0.5 * m1 * (v1[0] ** 2 + v1[1] ** 2) + 0.5 * m2 * (v2[0] ** 2 + v2[1] ** 2), Kf = 0.5 * m1 * (v1f[0] ** 2 + v1f[1] ** 2) + 0.5 * m2 * (v2f[0] ** 2 + v2f[1] ** 2);
        const tc = 2;
        const pos = (t, which) => { const v = which === 1 ? v1 : v2, vf = which === 1 ? v1f : v2f; return t < tc ? [v[0] * (t - tc), v[1] * (t - tc)] : [vf[0] * (t - tc), vf[1] * (t - tc)]; };
        const vmax = Math.max(Math.hypot(...v1), Math.hypot(...v2), Math.hypot(...v1f), Math.hypot(...v2f), 0.1);
        const sc = 70 / vmax;
        return {
          tmax: 4,
          draw(g, t) {
            const cx = 200, cy = 190;
            [1, 2].forEach((w) => { g.save(); g.strokeStyle = w === 1 ? "rgba(24,101,242,.35)" : "rgba(232,89,12,.35)"; g.setLineDash([4, 4]); g.beginPath(); for (let i = 0; i <= 40; i++) { const q = pos((t * i) / 40, w); i ? g.lineTo(cx + q[0] * sc, cy - q[1] * sc) : g.moveTo(cx + q[0] * sc, cy - q[1] * sc); } g.stroke(); g.restore(); });
            const a = pos(t, 1), b = pos(t, 2);
            D.ball(g, cx + a[0] * sc, cy - a[1] * sc, 10 + m1 * 2, "#1865f2", "1"); D.ball(g, cx + b[0] * sc, cy - b[1] * sc, 10 + m2 * 2, "#e8590c", "2");
            // momentum vector diagram
            const ox = 440, oy = 250, ps = 90 / Math.max(Math.hypot(...P), m1 * Math.hypot(...v1), 0.1);
            g.fillStyle = "#fff"; g.strokeStyle = "#dee2e6"; g.fillRect(390, 20, 240, 320); g.strokeRect(390, 20, 240, 320);
            D.text(g, "Momentum vectors (kg·m/s)", 510, 36, { size: 12, bold: true, align: "center" });
            const p1 = [m1 * v1[0], m1 * v1[1]], p2 = [m2 * v2[0], m2 * v2[1]], p1f = [m1 * v1f[0], m1 * v1f[1]], p2f = [m2 * v2f[0], m2 * v2f[1]];
            if (t < tc) { D.arrow(g, ox, oy, ox + p1[0] * ps, oy - p1[1] * ps, "#1865f2", "p₁"); D.arrow(g, ox + p1[0] * ps, oy - p1[1] * ps, ox + P[0] * ps, oy - P[1] * ps, "#e8590c", "p₂"); }
            else { D.arrow(g, ox, oy, ox + p1f[0] * ps, oy - p1f[1] * ps, "#1865f2", "p₁′"); D.arrow(g, ox + p1f[0] * ps, oy - p1f[1] * ps, ox + P[0] * ps, oy - P[1] * ps, "#e8590c", "p₂′"); }
            D.arrow(g, ox, oy, ox + P[0] * ps, oy - P[1] * ps, "#212529", "P total", { w: 3.5, dash: [6, 3] });
            D.text(g, t < tc ? "BEFORE" : "AFTER (same total P!)", 510, 325, { size: 12, bold: true, align: "center", color: t < tc ? "#495057" : K.g });
          },
          readouts: () => [["P total x", P[0], "kg·m/s"], ["P total y", P[1], "kg·m/s"], ["v₂′ (x, y)", `${fmt(v2f[0])}, ${fmt(v2f[1])}`, "m/s", true], ["|v₂′|", Math.hypot(...v2f), "m/s", true], ["v₂′ direction", `${fmt(deg(Math.atan2(v2f[1], v2f[0])))}°`, "", true], ["K before", Ki, "J"], ["K after", Kf, "J"], ["K lost", Ki - Kf, "J"]],
        };
      }
      const { m1, m2 } = p, v1 = p.v1, v2 = p.v2 || 0;
      let v1f, v2f;
      if (p.kind === "elastic") { v1f = ((m1 - m2) / (m1 + m2)) * v1 + ((2 * m2) / (m1 + m2)) * v2; v2f = ((2 * m1) / (m1 + m2)) * v1 + ((m2 - m1) / (m1 + m2)) * v2; }
      else if (p.kind === "inelastic") { v1f = v2f = (m1 * v1 + m2 * v2) / (m1 + m2); }
      else { v1f = p.v1f; v2f = (m1 * v1 + m2 * v2 - m1 * v1f) / m2; }
      const rel = v1 - v2; const gap = 3; const tc = rel > 0 ? gap / rel : 1.5;
      const Tm = Math.min(tc, 6), dtc = 0.12;
      const x1 = (t) => (t < Tm ? -gap / 2 - 0.0 + v1 * (t - Tm) + (rel > 0 ? 0 : 0) : v1f * (t - Tm)) - 0.4;
      const x2 = (t) => (t < Tm ? v2 * (t - Tm) : v2f * (t - Tm)) + 0.4;
      const tmax = Tm + 2.5;
      const P = m1 * v1 + m2 * v2, Ki = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2, Kf = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;
      const vv1 = (t) => (t < Tm ? v1 : v1f), vv2 = (t) => (t < Tm ? v2 : v2f);
      const span = Math.max(...[0, tmax].flatMap((t) => [Math.abs(x1(t)), Math.abs(x2(t))]), 3);
      const view = D.view(-span, span, -1, 1, { x: 20, y: 40, w: 600, h: 120 }, false);
      return {
        tmax,
        draw(g, t) {
          D.ground(g, 20, 620, 150);
          const X1 = view.X(x1(t)), X2 = view.X(x2(t));
          D.block(g, X1, 128, Math.min(90, 52 + m1 * 4), 40, 0, "#1865f2", `${fmt(m1)}kg`); D.block(g, X2, 128, Math.min(90, 52 + m2 * 4), 40, 0, "#e8590c", `${fmt(m2)}kg`);
          const vs = 12; D.arrow(g, X1, 90, X1 + vv1(t) * vs, 90, "#1865f2", `${fmt(vv1(t))} m/s`, { off: 22 }); D.arrow(g, X2, 70, X2 + vv2(t) * vs, 70, "#e8590c", `${fmt(vv2(t))} m/s`, { off: 22 });
          const pm = Math.max(Math.abs(m1 * v1), Math.abs(m2 * v2), Math.abs(P), Math.abs(m1 * v1f), Math.abs(m2 * v2f), 0.1);
          D.bars(g, 20, 175, 290, 175, [{ label: "p₁", value: m1 * vv1(t), color: "#1865f2" }, { label: "p₂", value: m2 * vv2(t), color: "#e8590c" }, { label: "p total", value: m1 * vv1(t) + m2 * vv2(t), color: "#495057" }], pm * 1.1, "Momentum (kg·m/s)");
          D.bars(g, 330, 175, 290, 175, [{ label: "K₁", value: 0.5 * m1 * vv1(t) ** 2, color: "#1865f2" }, { label: "K₂", value: 0.5 * m2 * vv2(t) ** 2, color: "#e8590c" }, { label: "K total", value: 0.5 * m1 * vv1(t) ** 2 + 0.5 * m2 * vv2(t) ** 2, color: "#495057" }], Ki * 1.1 || 1, "Kinetic energy (J)");
          D.text(g, t < Tm ? "Before the collision" : `After: total p unchanged; K ${Math.abs(Ki - Kf) < 1e-6 * Ki ? "unchanged (elastic)" : `lost ${fmt(Ki - Kf)} J`}`, 20, 20, { size: 13, bold: true, color: t < Tm ? "#495057" : K.g });
          void dtc;
        },
        readouts: (t) => [["v₁", vv1(t), "m/s"], ["v₂", vv2(t), "m/s"], ["total momentum", m1 * vv1(t) + m2 * vv2(t), "kg·m/s"], ["v₁′ (after)", v1f, "m/s", true], ["v₂′ (after)", v2f, "m/s", true], ["K before", Ki, "J"], ["K after", Kf, "J", true], ["fraction of K lost", Ki > 0 ? (Ki - Kf) / Ki : "n/a (K was created)", ""]],
        graphs: [{ title: "momentum vs t", ylabel: "kg·m/s", series: [{ f: (t) => m1 * vv1(t), color: "#1865f2", name: "p₁" }, { f: (t) => m2 * vv2(t), color: "#e8590c", name: "p₂" }, { f: () => P, color: "#495057", name: "total", dash: [5, 4] }] }, { title: "velocity vs t", ylabel: "m/s", series: [{ f: vv1, color: "#1865f2", name: "v₁" }, { f: vv2, color: "#e8590c", name: "v₂" }] }],
      };
    },
    explain: () => ["Total momentum (gray bar) is the same before and after — external forces are negligible during the collision.", "Kinetic energy is conserved only in elastic collisions. When objects stick, the most K possible is lost.", "In 2D, conserve momentum separately in x and in y."],
  };

  // ---------------- impulse ----------------
  M.impulse = {
    title: () => "Impulse: area under the force–time curve",
    setup(p) {
      const m = p.m, vi = p.vi, vf = p.vf, dt = p.dt, J = m * (vf - vi), shape = p.shape || "tri";
      const Fmax = shape === "rect" ? J / dt : shape === "sine" ? (J * Math.PI) / (2 * dt) : (2 * J) / dt;
      const t0 = 1;
      const Fof = (t) => { const u = (t - t0) / dt; if (u < 0 || u > 1) return 0; return shape === "rect" ? Fmax : shape === "sine" ? Fmax * Math.sin(Math.PI * u) : Fmax * (1 - Math.abs(2 * u - 1)); };
      const Jof = (t) => { let s = 0, n = 200, a = t0, b = Math.min(t, t0 + dt); if (b <= a) return 0; for (let i = 0; i < n; i++) s += Fof(a + ((b - a) * (i + 0.5)) / n) * ((b - a) / n); return s; };
      const v = (t) => vi + Jof(t) / m;
      // display time is stretched: map real t to display seconds
      const tmax = t0 * 2 + dt;
      return {
        tmax, speed: 1,
        timeLabel: (t) => (t >= t0 && t <= t0 + dt ? `contact: ${fmt((t - t0) * 1000, 3)} ms of ${fmt(dt * 1000, 3)} ms` : t < t0 ? "approaching" : "after contact"),
        draw(g, t) {
          const wall = 560; g.fillStyle = "#adb5bd"; g.fillRect(wall, 40, 18, 200);
          const xx = t < t0 ? wall - 20 - (t0 - t) * (Math.abs(vi) > 1e-6 ? 120 : 0) : t > t0 + dt ? wall - 20 - (t - t0 - dt) * 120 * Math.min(3, Math.abs(vf) / Math.max(Math.abs(vi), Math.abs(vf) / 2, 1e-6)) : wall - 20 - 10 * Math.sin((Math.PI * (t - t0)) / dt);
          const squash = t >= t0 && t <= t0 + dt ? 1 - 0.35 * Math.sin((Math.PI * (t - t0)) / dt) : 1;
          g.save(); g.translate(xx, 140); g.scale(squash, 1 / squash); D.ball(g, 0, 0, 20, "#f76707"); g.restore();
          D.arrow(g, xx, 90, xx + v(t) * 8, 90, K.v, `v = ${fmt(v(t))} m/s`, { off: 30 });
          if (Fof(t) > 0) D.arrow(g, xx + 20, 140, xx + 20 - 60, 140, K.F, `F = ${fmt(Fof(t))} N`, { off: 20 });
          D.text(g, `J = Δp = m(v_f − v_i) = ${fmt(J)} N·s`, 20, 290, { size: 14, bold: true, color: K.p });
          D.text(g, `Average force = J/Δt = ${fmt(J / dt)} N   ·   Peak force = ${fmt(Fmax)} N`, 20, 315, { size: 13, color: "#495057" });
          D.text(g, "Sign convention: + is to the right", 20, 340, { size: 11, color: K.muted });
        },
        readouts: (t) => [["velocity", v(t), "m/s"], ["momentum", m * v(t), "kg·m/s"], ["impulse so far", Jof(t), "N·s"], ["total impulse J", J, "N·s", true], ["average force", J / dt, "N", true], ["peak force", Fmax, "N"]],
        graphs: [{ title: "force vs t (area = impulse)", ylabel: "N", x0: t0 - dt * 0.5, x1: t0 + dt * 1.5, series: [{ f: Fof, color: K.F }], shade: { a: t0, b: t0 + dt, color: "rgba(95,61,196,.18)" }, xOf: (t) => Math.max(t0 - dt * 0.5, Math.min(t0 + dt * 1.5, t)) }, { title: "momentum vs t", ylabel: "kg·m/s", series: [{ f: (t) => m * v(t), color: K.p }] }],
      };
    },
    explain: () => ["Impulse is the area under F(t). It equals the change in momentum, J = Δp.", "A longer contact time (airbags, bending knees) spreads the same Δp over more time, so the average force is smaller.", "Bouncing back gives a bigger Δp than stopping — direction matters!"],
  };

  // ---------------- center of mass ----------------
  M.com = {
    title: (p) => (p.rod ? "Center of mass of a non-uniform rod" : "Center of mass of a system of particles"),
    controls: (p) => (p.rod ? [] : [{ key: "m0", label: `mass of ${p.masses[0].label || "1"}`, min: 0.1, max: Math.max(10, p.masses[0].m * 3), step: 0.1, unit: "kg" }]),
    setup(p) {
      if (p.rod) {
        const { L, lam } = p.rod; const n = 400; let Mt = 0, Mx = 0; for (let i = 0; i < n; i++) { const x = ((i + 0.5) * L) / n; Mt += lam(x) * (L / n); Mx += x * lam(x) * (L / n); }
        const xc = Mx / Mt; let lmax = 0; for (let i = 0; i <= 100; i++) lmax = Math.max(lmax, lam((i * L) / 100));
        return {
          tmax: 3,
          draw(g, t) {
            const x0 = 60, w = 520, y = 120, s = Math.min(1, t / 2);
            for (let i = 0; i < 200; i++) { const x = (i * L) / 200; const a = 0.15 + 0.85 * (lam(x) / lmax); g.fillStyle = `rgba(24,101,242,${a})`; g.fillRect(x0 + (i * w) / 200, y - 14, w / 200 + 1, 28); }
            g.strokeStyle = "#1c3d6e"; g.strokeRect(x0, y - 14, w, 28);
            D.text(g, "x = 0", x0, y + 30, { size: 11, align: "center" }); D.text(g, `x = ${fmt(L)} m`, x0 + w, y + 30, { size: 11, align: "center" });
            D.text(g, "darker = denser", x0 + w / 2, y - 26, { size: 10, align: "center", color: K.muted });
            const cx = x0 + (xc / L) * w * s;
            g.fillStyle = "#212529"; g.beginPath(); g.moveTo(cx, y + 14); g.lineTo(cx - 14, y + 44); g.lineTo(cx + 14, y + 44); g.closePath(); g.fill();
            D.text(g, `x_cm = ${fmt(xc * s)} m`, cx, y + 60, { size: 13, bold: true, align: "center", bg: true });
            const gv = D.view(0, L, 0, lmax * 1.15, { x: x0, y: 200, w, h: 120 }, false);
            g.save(); g.strokeStyle = K.v; g.lineWidth = 2.5; g.beginPath(); for (let i = 0; i <= 100; i++) { const x = (i * L) / 100; i ? g.lineTo(gv.X(x), gv.Y(lam(x))) : g.moveTo(gv.X(x), gv.Y(lam(x))); } g.stroke(); g.restore();
            D.line(g, x0, gv.Y(0), x0 + w, gv.Y(0), "#868e96", 1); D.text(g, `λ(x) = ${p.rod.lamText || ""}`, x0 + 4, 215, { size: 12, bold: true, color: K.v });
          },
          readouts: () => [["M = ∫λ dx", Mt, "kg"], ["∫xλ dx", Mx, "kg·m"], ["x_cm = ∫xλdx / M", xc, "m", true], ["uniform-rod CM would be", L / 2, "m"]],
          facts: [["x_cm", `${fmt(xc)} m`], ["total mass", `${fmt(Mt)} kg`]],
        };
      }
      const ms = p.masses.map((q, i) => Object.assign({}, q, i === 0 && p.m0 != null ? { m: p.m0 } : {}));
      if (p.m0 == null) p.m0 = ms[0].m;
      const Mt = ms.reduce((s, q) => s + q.m, 0), xc = ms.reduce((s, q) => s + q.m * q.x, 0) / Mt, yc = ms.reduce((s, q) => s + q.m * (q.y || 0), 0) / Mt;
      const xs = ms.map((q) => q.x).concat([0]), ys = ms.map((q) => q.y || 0).concat([0]);
      const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1);
      const view = D.view(Math.min(...xs) - span * 0.2, Math.max(...xs) + span * 0.2, Math.min(...ys) - span * 0.2, Math.max(...ys) + span * 0.2, { x: 40, y: 20, w: 400, h: 310 });
      return {
        tmax: ms.length + 1,
        draw(g, t) {
          D.grid(g, view, D.niceStep(span * 1.4, 7), { units: ["x (m)", "y (m)"] });
          const k = Math.min(ms.length, Math.floor(t) + 1);
          let Mk = 0, Xk = 0, Yk = 0;
          ms.forEach((q, i) => { const on = i < k; D.ball(g, view.X(q.x), view.Y(q.y || 0), 8 + Math.sqrt(q.m) * 4, on ? "#1865f2" : "#ced4da", ""); D.text(g, `${q.label || i + 1}: ${fmt(q.m)} kg`, view.X(q.x), view.Y(q.y || 0) - 22 - Math.sqrt(q.m) * 2, { size: 11, align: "center", bg: true }); if (on) { Mk += q.m; Xk += q.m * q.x; Yk += q.m * (q.y || 0); } });
          const cx = view.X(Xk / Mk), cy = view.Y(Yk / Mk);
          g.strokeStyle = "#d92916"; g.lineWidth = 2.5; g.beginPath(); g.arc(cx, cy, 10, 0, 7); g.moveTo(cx - 16, cy); g.lineTo(cx + 16, cy); g.moveTo(cx, cy - 16); g.lineTo(cx, cy + 16); g.stroke();
          D.text(g, k < ms.length ? `CM of the first ${k}` : "CM of the system", cx + 16, cy + 18, { size: 11, color: K.F, bold: true, bg: true });
          D.text(g, "x_cm = Σmᵢxᵢ / Σmᵢ", 460, 40, { size: 14, bold: true }); D.text(g, "y_cm = Σmᵢyᵢ / Σmᵢ", 460, 65, { size: 14, bold: true });
          ms.forEach((q, i) => D.text(g, `${fmt(q.m)}×${fmt(q.x)}${q.y != null ? ` , ${fmt(q.m)}×${fmt(q.y)}` : ""}`, 460, 100 + i * 20, { size: 12, color: i < k ? K.ink : K.muted }));
          D.text(g, `= (${fmt(Xk)}${p.twoD ? `, ${fmt(Yk)}` : ""}) / ${fmt(Mk)}`, 460, 110 + ms.length * 20, { size: 12, bold: true });
        },
        readouts: () => [["total mass", Mt, "kg"], ["Σ m x", ms.reduce((s, q) => s + q.m * q.x, 0), "kg·m"], ["x_cm", xc, "m", true], ...(p.twoD ? [["y_cm", yc, "m", true]] : [])],
      };
    },
    explain: () => ["The center of mass is a mass-weighted average position — heavier masses pull it toward themselves.", "For a continuous object replace the sum with an integral: x_cm = ∫x λ dx / ∫λ dx.", "If no external force acts, the CM moves at constant velocity no matter what the parts do."],
  };

  // ---------------- rotation (kinematics) ----------------
  M.rotation = {
    title: () => "Rotating disk: angular and linear variables",
    controls: (p) => (p.thf ? [] : [{ key: "w0", label: "ω₀", min: Math.min(-20, -Math.abs(p.w0) * 2), max: Math.max(20, Math.abs(p.w0) * 2), step: 0.1, unit: "rad/s" }, { key: "alpha", label: "α", min: Math.min(-10, -Math.abs(p.alpha) * 2), max: Math.max(10, Math.abs(p.alpha) * 2), step: 0.1, unit: "rad/s²" }, { key: "r", label: "point radius r", min: 0.05, max: Math.max(1, p.R || 1), step: 0.01, unit: "m" }]),
    defaults: { R: 0.5, r: 0.4, w0: 0, alpha: 0 },
    setup(p) {
      const tmax = p.tmax || 4, th = p.thf || ((t) => p.w0 * t + 0.5 * p.alpha * t * t), w = p.wf || ((t) => p.w0 + p.alpha * t), alf = p.alf || (() => p.alpha);
      return {
        tmax,
        draw(g, t) {
          const cx = 190, cy = 180, Rp = 140, a = th(t), rp = (p.r / p.R) * Rp;
          g.fillStyle = "#e7f5ff"; g.strokeStyle = "#1c3d6e"; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, Rp, 0, 7); g.fill(); g.stroke();
          for (let k = 0; k < 6; k++) { const q = -a + (k * Math.PI) / 3; D.line(g, cx, cy, cx + Rp * Math.cos(q), cy + Rp * Math.sin(q), "rgba(28,61,110,.25)", 1); }
          D.line(g, cx, cy, cx + Rp, cy, "#adb5bd", 1, [4, 3]);
          D.line(g, cx, cy, cx + Rp * Math.cos(-a), cy + Rp * Math.sin(-a), "#d92916", 3);
          const turns = a / (2 * Math.PI);
          D.arc(g, cx, cy, 30, 0, -(a % (2 * Math.PI)), "");
          const px = cx + rp * Math.cos(-a), py = cy + rp * Math.sin(-a), ux = -Math.sin(-a), uy = Math.cos(-a);
          const vt = p.r * w(t), at = p.r * alf(t), ac = p.r * w(t) ** 2, sv = 70 / Math.max(Math.abs(p.r * w(tmax)), Math.abs(p.r * w(0)), Math.abs(p.r * w(tmax / 2)), 0.1);
          D.arrow(g, px, py, px - ux * vt * sv, py - uy * vt * sv, K.v, `v ${fmt(vt)}`, { off: 14 });
          const am = Math.max(Math.abs(at), Math.abs(p.r * Math.max(w(0) ** 2, w(tmax) ** 2)), 0.1), sa = 60 / am;
          D.arrow(g, px, py, px + (cx - px) / rp * ac * sa, py + (cy - py) / rp * ac * sa, K.a, `a꜀ ${fmt(ac)}`, { off: 14 });
          if (Math.abs(at) > 1e-9) D.arrow(g, px, py, px - ux * at * sa, py - uy * at * sa, "#ae3ec9", `aₜ ${fmt(at)}`, { off: 14 });
          D.ball(g, px, py, 7, "#f76707", "P");
          D.text(g, `θ = ${fmt(a)} rad = ${fmt(turns)} rev`, 380, 50, { size: 15, bold: true }); D.text(g, `ω = ${fmt(w(t))} rad/s  (${fmt((w(t) * 60) / (2 * Math.PI))} rpm)`, 380, 78, { size: 14, bold: true, color: K.v }); D.text(g, `α = ${fmt(alf(t))} rad/s²`, 380, 104, { size: 14, bold: true, color: "#ae3ec9" });
          D.text(g, "Point P (radius r):", 380, 145, { size: 13, color: "#495057" }); D.text(g, `v = rω = ${fmt(vt)} m/s`, 380, 168, { size: 13 }); D.text(g, `aₜ = rα = ${fmt(at)} m/s²`, 380, 190, { size: 13 }); D.text(g, `a꜀ = rω² = ${fmt(ac)} m/s²`, 380, 212, { size: 13 });
          (p.notes || []).forEach((n, i) => D.text(g, n, 380, 250 + i * 20, { size: 12, color: "#5f3dc4", bold: true }));
          D.text(g, "Counterclockwise = positive", 380, 340, { size: 11, color: K.muted });
        },
        readouts: (t) => [["t", t.toFixed(2), "s"], ["θ", th(t), "rad"], ["revolutions", th(t) / (2 * Math.PI), "rev"], ["ω", w(t), "rad/s"], ["α", alf(t), "rad/s²"], ["v (point P)", p.r * w(t), "m/s"], ["a total (P)", Math.hypot(p.r * alf(t), p.r * w(t) ** 2), "m/s²"], ...(p.I ? [["I", p.I, "kg·m²"], ["K_rot = ½Iω²", 0.5 * p.I * w(t) ** 2, "J"]] : [])],
        graphs: [{ title: "θ vs t", ylabel: "rad", series: [{ f: th, color: K.ink }] }, { title: "ω vs t (slope = α)", ylabel: "rad/s", series: [{ f: w, color: K.v }] }],
        facts: p.facts || [],
      };
    },
    explain: () => ["Every point on a rigid body shares the same θ, ω and α — but points farther out move faster (v = rω).", "Constant-α equations look exactly like the linear ones with x→θ, v→ω, a→α.", "aₜ changes the speed of the point; a꜀ changes its direction."],
  };

  // ---------------- torque ----------------
  M.torque = {
    title: (p) => ({ wrench: "Torque: τ = rF sin φ", pulley: "Hanging mass on a massive pulley", rod: "Rod pivoted at one end, released from horizontal" })[p.mode || "wrench"],
    controls: (p) => (p.mode === "pulley" ? [{ key: "M", label: "Pulley mass M", min: 0, max: Math.max(10, p.M * 2), step: 0.1, unit: "kg" }, { key: "m", label: "Hanging mass m", min: 0.1, max: Math.max(5, p.m * 2), step: 0.1, unit: "kg" }] : p.mode === "rod" ? [{ key: "L", label: "Rod length L", min: 0.2, max: 3, step: 0.05, unit: "m" }] : [{ key: "F", label: "Force F", min: 1, max: Math.max(100, p.F * 2), step: 1, unit: "N" }, { key: "r", label: "Distance r", min: 0.05, max: Math.max(1, p.r * 2), step: 0.01, unit: "m" }, { key: "phi", label: "Angle φ between r and F", min: 0, max: 180, step: 1, unit: "°" }]),
    setup(p) {
      const mode = p.mode || "wrench";
      if (mode === "wrench") {
        const ph = rad(p.phi), tau = p.r * p.F * Math.sin(ph);
        return {
          static: true, tmax: 1,
          draw(g) {
            const px = 120, py = 220, len = 300;
            D.block(g, px + len / 2, py, len + 30, 20, 0, "#adb5bd");
            g.fillStyle = "#495057"; g.beginPath(); g.arc(px, py, 14, 0, 7); g.fill(); D.text(g, "pivot", px, py + 28, { size: 11, align: "center", color: K.muted });
            const ex = px + len * Math.min(1, p.r / Math.max(p.r, 0.5)), ey = py;
            D.arrow(g, px, py - 2, ex, ey - 2, "#495057", `r = ${fmt(p.r)} m`, { off: 0, dy: -16, w: 2 });
            const fl = 110, fx = ex + fl * Math.cos(-ph), fy = ey + fl * Math.sin(-ph);
            D.arrow(g, ex, ey, fx, fy, K.F, `F = ${fmt(p.F)} N`, { off: 16 });
            D.arc(g, ex, ey, 30, 0, -ph, `φ = ${fmt(p.phi)}°`);
            D.arrow(g, ex, ey, ex, ey - fl * Math.sin(ph), "#ae3ec9", `F⊥ = ${fmt(p.F * Math.sin(ph))} N`, { off: 14, dash: [5, 3], dx: 50 });
            // lever arm
            const dx = Math.cos(-ph), dy = Math.sin(-ph); const tt = (px - ex) * dx + (py - ey) * dy; const qx = ex + dx * tt, qy = ey + dy * tt;
            D.line(g, ex, ey, qx, qy, K.F, 1, [3, 3]); D.line(g, px, py, qx, qy, K.g, 2.5); D.text(g, `lever arm r⊥ = r sin φ = ${fmt(p.r * Math.sin(ph))} m`, (px + qx) / 2, (py + qy) / 2 - 12, { size: 11, color: K.g, bold: true, bg: true, align: "center" });
            D.text(g, `τ = rF sin φ = ${fmt(tau)} N·m  ${tau > 1e-9 ? "(counterclockwise ⟲)" : tau < -1e-9 ? "(clockwise ⟳)" : ""}`, 20, 30, { size: 15, bold: true, color: K.p });
            D.text(g, "Two ways to see it: (lever arm) × F, or r × (F⊥)", 20, 55, { size: 12, color: "#495057" });
          },
          readouts: () => [["r", p.r, "m"], ["F", p.F, "N"], ["φ", `${fmt(p.phi)}°`, ""], ["F⊥ = F sin φ", p.F * Math.sin(ph), "N"], ["lever arm", p.r * Math.sin(ph), "m"], ["τ", tau, "N·m", true]],
          graphs: [{ title: "τ vs angle φ (max at 90°)", xlabel: "φ (°)", ylabel: "N·m", x0: 0, x1: 180, series: [{ f: (x) => p.r * p.F * Math.sin(rad(x)), color: K.p }], xOf: () => p.phi }],
        };
      }
      if (mode === "pulley") {
        const { M: Mp, R, m } = p, I = (p.k || 0.5) * Mp * R * R, a = (m * g0) / (m + I / (R * R)), T = m * (g0 - a), al = a / R;
        const tmax = Math.min(4, Math.sqrt((2 * (p.h || 2)) / a));
        return {
          tmax,
          draw(g, t) {
            const cx = 240, cy = 80, Rp = 50, y = 0.5 * a * t * t, th = y / R;
            D.line(g, cx, 10, cx, cy, "#495057", 4);
            g.save(); g.translate(cx, cy); g.rotate(th); g.fillStyle = "#adb5bd"; g.beginPath(); g.arc(0, 0, Rp, 0, 7); g.fill(); g.strokeStyle = "#495057"; g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Rp * Math.cos((k * Math.PI) / 2), Rp * Math.sin((k * Math.PI) / 2)); g.stroke(); } g.restore();
            const by = 150 + Math.min(180, (y / (p.h || 2)) * 160);
            D.line(g, cx + Rp, cy, cx + Rp, by - 18, "#495057", 1.5); D.block(g, cx + Rp, by, 40, 36, 0, "#e8590c", `${fmt(m)} kg`);
            const F = 60 / (m * g0); D.arrow(g, cx + Rp + 36, by, cx + Rp + 36, by - T * F, K.T, `T ${fmt(T)} N`, { off: 12 }); D.arrow(g, cx + Rp + 36, by, cx + Rp + 36, by + m * g0 * F, K.g, `mg ${fmt(m * g0)} N`, { off: 12 });
            D.arrow(g, cx - Rp - 20, cy + 30, cx - Rp - 20, cy - 30, K.p, "", { w: 2 });
            D.text(g, "Block: mg − T = ma", 380, 40, { size: 13, bold: true }); D.text(g, "Pulley: TR = Iα,  a = Rα", 380, 64, { size: 13, bold: true }); D.text(g, `→ a = mg / (m + I/R²) = ${fmt(a)} m/s²`, 380, 92, { size: 13, color: K.a, bold: true }); D.text(g, `I = ${p.k || 0.5}MR² = ${fmt(I)} kg·m²`, 380, 118, { size: 12 });
          },
          readouts: (t) => [["a (block)", a, "m/s²", true], ["α (pulley)", al, "rad/s²", true], ["tension T", T, "N", true], ["speed", a * t, "m/s"], ["ω pulley", al * t, "rad/s"], ["drop", 0.5 * a * t * t, "m"], ["K_trans + K_rot", 0.5 * m * (a * t) ** 2 + 0.5 * I * (al * t) ** 2, "J"], ["mgΔh", m * g0 * 0.5 * a * t * t, "J"]],
          graphs: [{ title: "speed of block vs t", ylabel: "m/s", series: [{ f: (t) => a * t, color: K.v }] }, { title: "energy vs t", ylabel: "J", series: [{ f: (t) => 0.5 * m * (a * t) ** 2, color: K.K, name: "K_block" }, { f: (t) => 0.5 * I * (al * t) ** 2, color: K.p, name: "K_pulley" }] }],
        };
      }
      // rod pivot end released from horizontal
      const L = p.L, Mr = p.M || 1, I = (Mr * L * L) / 3;
      const sol = integrate((t, y) => [y[1], ((Mr * g0 * L) / 2) * Math.cos(y[0]) / I], [0, 0], 10, 0.002, (t, y) => y[0] >= Math.PI / 2);
      return {
        tmax: sol.tEnd,
        draw(g, t) {
          const [th, w] = sol.at(t), px = 160, py = 80, sc = 220 / L;
          g.fillStyle = "#495057"; g.beginPath(); g.arc(px, py, 8, 0, 7); g.fill();
          const ex = px + L * sc * Math.cos(th), ey = py + L * sc * Math.sin(th);
          g.save(); g.strokeStyle = "#1865f2"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(px, py); g.lineTo(ex, ey); g.stroke(); g.restore();
          D.arrow(g, (px + ex) / 2, (py + ey) / 2, (px + ex) / 2, (py + ey) / 2 + 60, K.g, "Mg (at center)", { off: 12 });
          D.arrow(g, ex, ey, ex - Math.sin(th) * w * L * 15, ey + Math.cos(th) * w * L * 15, K.v, `v_tip ${fmt(w * L)}`, { off: 16 });
          D.text(g, `τ = Mg(L/2)cos θ = ${fmt(Mr * g0 * (L / 2) * Math.cos(th))} N·m`, 360, 40, { size: 13, bold: true }); D.text(g, `α = τ/I = ${fmt((Mr * g0 * (L / 2) * Math.cos(th)) / I)} rad/s²`, 360, 64, { size: 13, bold: true, color: "#ae3ec9" });
          D.text(g, `I_end = ML²/3 = ${fmt(I)} kg·m²`, 360, 88, { size: 12 }); D.text(g, `Energy: ω at bottom = √(3g/L) = ${fmt(Math.sqrt((3 * g0) / L))} rad/s`, 360, 112, { size: 12 });
        },
        readouts: (t) => { const [th, w] = sol.at(t); return [["angle below horizontal", `${fmt(deg(th))}°`, ""], ["α", (Mr * g0 * (L / 2) * Math.cos(th)) / I, "rad/s²", true], ["ω", w, "rad/s"], ["tip speed", w * L, "m/s"], ["initial α = 3g/2L", (3 * g0) / (2 * L), "rad/s²", true]]; },
        graphs: [{ title: "ω vs t", ylabel: "rad/s", series: [{ f: (t) => sol.at(t)[1], color: K.v }] }],
      };
    },
    explain: (p) => (p.mode === "pulley" ? ["Write ΣF = ma for the block and Στ = Iα for the pulley, then link them with a = Rα.", "A massive pulley 'adds' I/R² to the inertia, so the acceleration is less than g.", "Energy check: mgh = ½mv² + ½Iω²."] : ["Only the perpendicular part of the force (or the perpendicular distance) creates torque.", "Pushing straight along r (φ = 0° or 180°) gives zero torque.", "Counterclockwise torques are positive by convention."]),
  };

  // ---------------- rolling ----------------
  const BETA = { hoop: 1, disk: 0.5, sphere: 0.4, shell: 2 / 3, slide: 0 };
  const NAMES = { hoop: "hoop", disk: "solid disk/cylinder", sphere: "solid sphere", shell: "hollow sphere", slide: "frictionless block" };
  M.rolling = {
    title: () => "Rolling race down an incline",
    controls: (p) => [{ key: "theta", label: "Incline angle", min: 5, max: 60, step: 1, unit: "°" }, { key: "h", label: "Height", min: 0.2, max: Math.max(5, p.h * 2), step: 0.1, unit: "m" }],
    setup(p) {
      const th = rad(p.theta), L = p.h / Math.sin(th), shapes = p.shapes || ["sphere", "disk", "hoop"], hl = p.highlight || shapes[0], Mm = p.M || 1;
      const data = shapes.map((s) => { const b = BETA[s], a = (g0 * Math.sin(th)) / (1 + b), T = Math.sqrt((2 * L) / a); return { s, b, a, T, vb: a * T }; });
      const tmax = Math.max(...data.map((d) => d.T)) * 1.05;
      const colors = ["#1865f2", "#e8590c", "#2b8a3e", "#ae3ec9", "#495057"];
      const H0 = data.find((d) => d.s === hl) || data[0];
      return {
        tmax,
        draw(g, t) {
          const bx = 30, by = 320, Lp = 400, ex = bx + Lp * Math.cos(th), ey = by - Lp * Math.sin(th);
          const sc = Lp / L, rr = 14;
          g.fillStyle = "#e9ecef"; g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex, by); g.lineTo(bx, by); g.closePath(); g.fill();
          D.line(g, bx, by, ex, ey, K.ground, 3); D.arc(g, bx, by, 50, 0, -th, `${fmt(p.theta)}°`);
          data.forEach((d, i) => {
            const tt = Math.min(t, d.T), s = L - 0.5 * d.a * tt * tt, off = (i - (data.length - 1) / 2) * 0;
            const cxp = bx + s * sc * Math.cos(th) - Math.sin(th) * (rr + i * 0), cyp = by - s * sc * Math.sin(th) - Math.cos(th) * rr;
            void off;
            g.save(); g.globalAlpha = d.s === hl ? 1 : 0.85; g.translate(cxp, cyp - i * 0); g.rotate((-(L - s) * sc) / rr * (d.b ? 1 : 0));
            g.fillStyle = colors[i]; g.beginPath(); g.arc(0, 0, rr, 0, 7); g.fill(); if (d.s === "hoop" || d.s === "shell") { g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, rr * (d.s === "hoop" ? 0.7 : 0.5), 0, 7); g.fill(); }
            if (d.s === "slide") { g.fillStyle = colors[i]; g.fillRect(-rr, -rr, rr * 2, rr * 2); }
            g.strokeStyle = "#fff"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(rr, 0); g.stroke(); g.restore();
            D.text(g, `${NAMES[d.s]} ${t >= d.T ? `✓ ${fmt(d.T)} s` : ""}`, 440, 40 + i * 20, { size: 12, bold: d.s === hl, color: colors[i] });
          });
          const tt = Math.min(t, H0.T), v = H0.a * tt, Kt = 0.5 * Mm * v * v, Kr = 0.5 * H0.b * Mm * v * v, U = Mm * g0 * (p.h - (0.5 * H0.a * tt * tt) * Math.sin(th));
          D.bars(g, 440, 150, 190, 190, [{ label: "U", value: U, color: K.U }, { label: "K_trans", value: Kt, color: K.K }, { label: "K_rot", value: Kr, color: K.p }], Mm * g0 * p.h * 1.05, `Energy of the ${NAMES[hl]} (J)`);
        },
        readouts: (t) => data.map((d, i) => [`${NAMES[d.s]}`, `a=${fmt(d.a)}, v_bottom=${fmt(d.vb)}`, "", d.s === hl]).concat([["rule", "a = g sinθ / (1 + I/MR²)", ""]]),
        graphs: [{ title: "speed vs t", ylabel: "m/s", series: data.map((d, i) => ({ f: (t) => d.a * Math.min(t, d.T), color: colors[i], name: d.s })) }],
        facts: [[`v at bottom (${NAMES[hl]})`, `${fmt(H0.vb)} m/s`], [`a (${NAMES[hl]})`, `${fmt(H0.a)} m/s²`]],
      };
    },
    explain: () => ["Rolling without slipping links the motions: v_cm = Rω.", "Energy: Mgh = ½Mv² + ½Iω² = ½Mv²(1 + I/MR²). More of the energy goes into spinning for a hoop, so it is slowest.", "The winner depends only on the shape factor I/MR² — not on mass or radius!"],
  };

  // ---------------- angular momentum ----------------
  M.angmom = {
    title: (p) => ({ skater: "Spinning skater pulls in her arms", drop: "Disk dropped onto a spinning disk", clay: "Clay hits a rod and sticks" })[p.mode],
    setup(p) {
      if (p.mode === "clay") {
        const { m, v, d, Mr, L, pivot } = p; const Irod = pivot === "center" ? (Mr * L * L) / 12 : (Mr * L * L) / 3; const If = Irod + m * d * d, w = (m * v * d) / If;
        const Ki = 0.5 * m * v * v, Kf = 0.5 * If * w * w, tc = 1.2;
        return {
          tmax: tc + 3,
          draw(g, t) {
            const px = 300, py = 180, sc = 240 / L, th = t > tc ? -w * (t - tc) : 0;
            const r0 = pivot === "center" ? -L / 2 : 0;
            g.save(); g.translate(px, py); g.rotate(th); g.fillStyle = "#1865f2"; g.fillRect(r0 * sc, -6, L * sc, 12);
            if (t > tc) { D.ball(g, d * sc, 0, 8, "#e8590c"); }
            g.restore(); g.fillStyle = "#212529"; g.beginPath(); g.arc(px, py, 6, 0, 7); g.fill();
            if (t <= tc) { const cy = py - 160 + (t / tc) * 160; D.ball(g, px + d * sc, cy, 8, "#e8590c"); D.arrow(g, px + d * sc + 20, cy, px + d * sc + 20, cy + 40, K.v, `v ${fmt(v)} m/s`, { off: 12 }); }
            D.text(g, "L before = m v d (clay)", 20, 30, { size: 13, bold: true }); D.text(g, `= ${fmt(m)}×${fmt(v)}×${fmt(d)} = ${fmt(m * v * d)} kg·m²/s`, 20, 52, { size: 13 });
            D.text(g, "L after = (I_rod + m d²) ω", 20, 80, { size: 13, bold: true }); D.text(g, `ω = ${fmt(w)} rad/s`, 20, 102, { size: 14, bold: true, color: K.v });
            D.text(g, `K lost: ${fmt(Ki - Kf)} J (sticking = inelastic)`, 20, 330, { size: 12, color: K.F });
          },
          readouts: (t) => [["I_rod", Irod, "kg·m²"], ["I after", If, "kg·m²"], ["L (constant)", m * v * d, "kg·m²/s"], ["ω after", w, "rad/s", true], ["K before", Ki, "J"], ["K after", Kf, "J"]],
        };
      }
      const I1 = p.I1, w1 = p.w1, I2 = p.mode === "drop" ? p.I1 + p.I2 : p.I2;
      const w2 = (I1 * w1) / I2, tc = 2, Lm = I1 * w1;
      const w = (t) => (t < tc ? w1 : w2), I = (t) => (t < tc ? I1 : I2), ang = (t) => (t < tc ? w1 * t : w1 * tc + w2 * (t - tc));
      return {
        tmax: tc + 2.5,
        draw(g, t) {
          const cx = 190, cy = 180, a = ang(t);
          if (p.mode === "skater") {
            const arm = t < tc ? 90 : 25;
            g.save(); g.translate(cx, cy); g.rotate(-a);
            g.fillStyle = "#ae3ec9"; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
            g.strokeStyle = "#ae3ec9"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(-arm, 0); g.lineTo(arm, 0); g.stroke();
            D.ball(g, arm, 0, 8, "#f76707"); D.ball(g, -arm, 0, 8, "#f76707");
            g.restore(); D.text(g, "top view", cx, cy + 120, { size: 11, align: "center", color: K.muted });
          } else {
            g.save(); g.translate(cx, cy); g.rotate(-a); g.fillStyle = "#4dabf7"; g.beginPath(); g.arc(0, 0, 110, 0, 7); g.fill(); g.strokeStyle = "#1c3d6e"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(110, 0); g.stroke(); g.restore();
            if (t >= tc) { g.save(); g.translate(cx, cy); g.rotate(-a); g.fillStyle = "rgba(232,89,12,.85)"; g.beginPath(); g.arc(0, 0, 80, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.beginPath(); g.moveTo(0, 0); g.lineTo(80, 0); g.stroke(); g.restore(); }
            else D.text(g, "second disk about to drop ↓", cx, 40, { size: 12, align: "center", color: "#e8590c", bold: true });
          }
          D.text(g, "No external torque → L = Iω stays constant", 360, 40, { size: 13, bold: true });
          D.text(g, `I = ${fmt(I(t))} kg·m²`, 360, 75, { size: 14 }); D.text(g, `ω = ${fmt(w(t))} rad/s`, 360, 100, { size: 14, color: K.v, bold: true }); D.text(g, `L = ${fmt(I(t) * w(t))} kg·m²/s`, 360, 125, { size: 14, color: K.p, bold: true }); D.text(g, `K = ½Iω² = ${fmt(0.5 * I(t) * w(t) ** 2)} J`, 360, 150, { size: 14, color: K.K });
          D.text(g, p.mode === "skater" ? "K increases — she does work pulling her arms in." : "K decreases — friction between the disks makes heat.", 360, 185, { size: 12, color: "#495057" });
        },
        readouts: (t) => [["I", I(t), "kg·m²"], ["ω", w(t), "rad/s"], ["L", I(t) * w(t), "kg·m²/s"], ["K", 0.5 * I(t) * w(t) ** 2, "J"], ["final ω", w2, "rad/s", true], ["final K / initial K", (0.5 * I2 * w2 * w2) / (0.5 * I1 * w1 * w1), "", true]],
        graphs: [{ title: "ω vs t", ylabel: "rad/s", series: [{ f: w, color: K.v }] }, { title: "L vs t (flat!)", ylabel: "kg·m²/s", ymin: 0, ymax: Lm * 1.4 || 1, series: [{ f: (t) => I(t) * w(t), color: K.p }] }],
      };
    },
    explain: () => ["With no external torque, angular momentum L = Iω is conserved.", "Smaller I → bigger ω, and vice versa.", "Kinetic energy is NOT conserved in these 'rotational collisions'."],
  };

  // ---------------- beam / ladder / boom (static equilibrium) ----------------
  M.beam = {
    title: (p) => ({ beam: "Beam on two supports — static equilibrium", ladder: "Ladder against a frictionless wall", boom: "Horizontal boom held by a cable" })[p.mode || "beam"],
    tag: "Equilibrium model",
    controls: (p) => (p.mode === "ladder" ? [{ key: "theta", label: "Ladder angle with floor", min: 20, max: 85, step: 1, unit: "°" }, { key: "d", label: "Person's distance up ladder", min: 0, max: p.L, step: 0.1, unit: "m" }] : p.mode === "boom" ? [{ key: "phi", label: "Cable angle", min: 10, max: 80, step: 1, unit: "°" }] : p.loads && p.loads.length ? [{ key: "x0", label: `Position of ${p.loads[0].label}`, min: 0, max: p.L, step: 0.05, unit: "m" }] : []),
    setup(p) {
      const mode = p.mode || "beam";
      if (mode === "ladder") {
        const { L, M: Ml, m = 0, d = 0, theta } = p, th = rad(theta);
        const Nw = ((Ml * g0 * (L / 2) + m * g0 * d) * Math.cos(th)) / (L * Math.sin(th)), Nf = (Ml + m) * g0, f = Nw, mu = f / Nf;
        return {
          static: true, tmax: 1,
          draw(g) {
            const bx = 160, by = 320, sc = 260 / L, tx = bx + L * sc * Math.cos(th), ty = by - L * sc * Math.sin(th);
            D.ground(g, 40, 600, by); g.fillStyle = "#dee2e6"; g.fillRect(bx + L * sc * Math.cos(th), 20, 16, by - 20);
            g.save(); g.strokeStyle = "#8d6e63"; g.lineWidth = 8; g.beginPath(); g.moveTo(bx, by); g.lineTo(tx, ty); g.stroke(); g.restore();
            D.arc(g, bx, by, 40, Math.PI, Math.PI + 0, "");
            D.arc(g, bx, by, 36, 0, -th, `${theta}°`);
            const F = 90 / Math.max(Nf, 1);
            D.arrow(g, bx, by, bx, by - Nf * F, K.N, `N_floor ${fmt(Nf)} N`, { off: 12 });
            D.arrow(g, bx, by, bx + f * F, by, K.f, `f ${fmt(f)} N`, { off: 14, dy: 14 });
            D.arrow(g, tx, ty, tx - Nw * F, ty, K.N, `N_wall ${fmt(Nw)} N`, { off: 14 });
            const mx = (bx + tx) / 2, my = (by + ty) / 2; D.arrow(g, mx, my, mx, my + Ml * g0 * F, K.g, `Mg ${fmt(Ml * g0)}`, { off: 12 });
            if (m) { const qx = bx + d * sc * Math.cos(th), qy = by - d * sc * Math.sin(th); D.ball(g, qx, qy - 10, 9, "#f76707"); D.arrow(g, qx, qy, qx, qy + m * g0 * F, K.g, `mg ${fmt(m * g0)}`, { off: 12 }); }
            D.text(g, "Torques about the foot:", 360, 40, { size: 13, bold: true }); D.text(g, "N_wall·L sinθ = Mg(L/2)cosθ + mg·d cosθ", 360, 62, { size: 12 });
            D.text(g, `→ N_wall = ${fmt(Nw)} N = friction needed`, 360, 84, { size: 12, bold: true, color: K.f }); D.text(g, `μ needed = f / N_floor = ${fmt(mu)}`, 360, 108, { size: 13, bold: true, color: K.F });
          },
          readouts: () => [["N_floor", Nf, "N"], ["N_wall", Nw, "N", true], ["friction at floor", f, "N", true], ["minimum μs", mu, "", true]],
        };
      }
      if (mode === "boom") {
        const { L, M: Mb, mL, phi } = p, ph = rad(phi);
        const T = ((Mb * g0 * L) / 2 + mL * g0 * L) / (L * Math.sin(ph)), Hh = T * Math.cos(ph), V = (Mb + mL) * g0 - T * Math.sin(ph);
        return {
          static: true, tmax: 1,
          draw(g) {
            const hx = 60, hy = 220, sc = 400 / L; g.fillStyle = "#dee2e6"; g.fillRect(30, 20, 30, 320);
            D.block(g, hx + (L * sc) / 2, hy, L * sc, 14, 0, "#adb5bd"); g.fillStyle = "#212529"; g.beginPath(); g.arc(hx, hy, 7, 0, 7); g.fill();
            const ex = hx + L * sc, cy = hy - L * sc * Math.tan(ph); D.line(g, ex, hy, hx, cy, "#495057", 1.8);
            D.arc(g, ex, hy, 36, Math.PI, Math.PI + ph, `${phi}°`);
            D.line(g, ex, hy, ex, hy + 40, "#495057", 1.5); D.block(g, ex, hy + 58, 36, 36, 0, "#e8590c", `${fmt(mL)}kg`);
            const F = 90 / Math.max(T, (Mb + mL) * g0);
            D.arrow(g, ex, hy, ex - Math.cos(ph) * T * F, hy - Math.sin(ph) * T * F, K.T, `T ${fmt(T)} N`, { off: 16 });
            D.arrow(g, hx, hy, hx + Hh * F, hy, K.N, `H ${fmt(Hh)}`, { off: 16, dy: 14 }); D.arrow(g, hx, hy, hx, hy - V * F, K.N, `V ${fmt(V)}`, { off: 14 });
            D.arrow(g, hx + (L * sc) / 2, hy, hx + (L * sc) / 2, hy + Mb * g0 * F, K.g, `Mg ${fmt(Mb * g0)}`, { off: 12 });
            D.text(g, "Torques about the hinge: T sinφ · L = Mg·L/2 + m g·L", 250, 330, { size: 12, bold: true, align: "center" });
          },
          readouts: () => [["cable tension T", T, "N", true], ["hinge horizontal H", Hh, "N", true], ["hinge vertical V", V, "N", true]],
        };
      }
      const L = p.L, Mb = p.M || 0, [xa, xb] = p.supports;
      const loads = p.loads.map((q, i) => Object.assign({}, q, i === 0 && p.x0 != null ? { x: p.x0 } : {}));
      if (p.x0 == null && loads[0]) p.x0 = loads[0].x;
      const torqueA = loads.reduce((s, q) => s + q.m * g0 * (q.x - xa), 0) + Mb * g0 * (L / 2 - xa);
      const single = p.supports.length === 1;
      const Wt = loads.reduce((s, q) => s + q.m * g0, 0) + Mb * g0, Rb = single ? 0 : torqueA / (xb - xa), Ra = Wt - Rb;
      const items = [...loads.map((q) => ({ label: q.label, F: -q.m * g0, x: q.x })), ...(Mb ? [{ label: "beam Mg", F: -Mb * g0, x: L / 2 }] : []), { label: single ? "R_pivot" : "R_A", F: Ra, x: xa }, ...(single ? [] : [{ label: "R_B", F: Rb, x: xb }])];
      if (single) {
        const tilt = Math.max(-0.25, Math.min(0.25, (torqueA / (Wt * L)) * 2));
        return {
          tmax: 2,
          draw(g, t) {
            const x0 = 60, w = 520, y = 200, sc = w / L, ang = tilt * Math.min(1, t), F = 90 / Wt;
            g.fillStyle = "#495057"; g.beginPath(); g.moveTo(x0 + xa * sc, y + 7); g.lineTo(x0 + xa * sc - 18, y + 50); g.lineTo(x0 + xa * sc + 18, y + 50); g.closePath(); g.fill();
            g.save(); g.translate(x0 + xa * sc, y); g.rotate(ang);
            D.block(g, (L / 2 - xa) * sc, 0, w, 12, 0, "#adb5bd");
            items.filter((i) => i.F < 0).forEach((it) => { const X = (it.x - xa) * sc; D.arrow(g, X, -10 - Math.abs(it.F) * F, X, -8, K.g, "", { w: 3 }); D.text(g, `${it.label} ${fmt(-it.F)} N @ ${fmt(it.x)} m`, X, -22 - Math.abs(it.F) * F, { size: 11, align: "center", bold: true, bg: true, color: K.g }); });
            g.restore();
            D.text(g, `Net torque about the pivot: ${fmt(-torqueA)} N·m ${Math.abs(torqueA) < 1e-6 * Wt * L ? "→ balanced!" : torqueA > 0 ? "(tips clockwise ⟳)" : "(tips counterclockwise ⟲)"}`, 20, 30, { size: 13, bold: true, color: Math.abs(torqueA) < 1e-6 * Wt * L ? K.g : K.F });
            D.text(g, "Balance: Σ (weight × lever arm) on the left = Σ on the right", 20, 54, { size: 12, color: "#495057" });
          },
          readouts: () => [...items.map((i) => [`${i.label} at x = ${fmt(i.x)} m`, i.F, "N"]), ["net torque about pivot", -torqueA, "N·m", true]],
        };
      }
      return {
        tmax: items.length + 1, speed: 0.8,
        draw(g, t) {
          const x0 = 60, w = 520, y = 190, sc = w / L, F = 100 / Math.max(...items.map((i) => Math.abs(i.F)));
          D.block(g, x0 + w / 2, y, w, 14, 0, "#adb5bd");
          [xa, xb].forEach((x, i) => { g.fillStyle = "#495057"; g.beginPath(); g.moveTo(x0 + x * sc, y + 7); g.lineTo(x0 + x * sc - 14, y + 34); g.lineTo(x0 + x * sc + 14, y + 34); g.closePath(); g.fill(); D.text(g, i ? "B" : "A", x0 + x * sc, y + 46, { size: 12, bold: true, align: "center" }); });
          const k = Math.floor(t);
          items.forEach((it, i) => {
            const X = x0 + it.x * sc; const on = i <= k;
            if (it.F < 0) { D.arrow(g, X, y - 10 - Math.abs(it.F) * F, X, y - 8, on ? K.g : "#ced4da", "", { w: 3 }); D.text(g, `${it.label} ${fmt(-it.F)} N`, X, y - 22 - Math.abs(it.F) * F, { size: 11, align: "center", bold: true, bg: true, color: on ? K.g : K.muted }); }
            else { D.arrow(g, X, y + 60 + it.F * F, X, y + 10, on ? K.N : "#ced4da", "", { w: 3 }); D.text(g, `${it.label} ${fmt(it.F)} N`, X, y + 72 + it.F * F, { size: 11, align: "center", bold: true, bg: true, color: on ? K.N : K.muted }); }
            if (it.label !== "R_A" && on) D.dim(g, x0 + xa * sc, y + 22 + i * 0, X, y + 22, "");
          });
          D.text(g, `Torques about support A: ${items.slice(0, Math.min(k + 1, items.length)).filter((i) => i.label !== "R_A").map((i) => `${i.F > 0 ? "+" : "−"}${fmt(Math.abs(i.F))}×${fmt(i.x - xa)}`).join(" ")}`, 20, 30, { size: 12, bold: true });
          D.text(g, "Στ = 0 → R_B;  ΣF = 0 → R_A", 20, 52, { size: 12, color: "#495057" });
          D.text(g, `0 m`, x0, y + 18, { size: 10, align: "center", color: K.muted }); D.text(g, `${fmt(L)} m`, x0 + w, y + 18, { size: 10, align: "center", color: K.muted });
        },
        readouts: () => [...items.map((i) => [`${i.label} at x = ${fmt(i.x)} m`, i.F, "N", i.label.startsWith("R")]), ["Σ F (check)", items.reduce((s, i) => s + i.F, 0), "N"]],
      };
    },
    explain: () => ["Equilibrium needs BOTH ΣF = 0 and Στ = 0 (about any point).", "Pick the pivot where an unknown force acts — its torque vanishes, so one equation has one unknown.", "A uniform beam's weight acts at its center."],
  };

  // ---------------- orbit ----------------
  M.orbit = {
    title: (p) => ({ circular: "Circular orbit: gravity provides the centripetal force", ellipse: "Elliptical orbit: Kepler's 2nd law (equal areas)", escape: "Launching straight up: escape speed", field: "Gravitational field inside and outside a planet" })[p.mode || "circular"],
    tag: "Gravity model",
    controls: (p) => (p.mode === "escape" ? [{ key: "frac", label: "Launch speed (fraction of v_esc)", min: 0.3, max: 1.3, step: 0.01, unit: "" }] : p.mode === "ellipse" ? [{ key: "e", label: "Eccentricity e", min: 0, max: 0.9, step: 0.01, unit: "" }] : p.mode === "field" ? [] : [{ key: "rf", label: "Orbit radius (× planet radius)", min: 1.02, max: 10, step: 0.01, unit: "" }]),
    setup(p) {
      const Mp = p.M, R = p.R, m = p.m || 1000, mode = p.mode || "circular", GM = G * Mp;
      const timeLbl = (T) => (t) => `t = ${fmt((t / 6) * T, 3)} s (${fmt(((t / 6) * T) / 3600, 3)} h)`;
      if (mode === "circular") {
        const r = p.rf ? p.rf * R : p.r; if (!p.rf) p.rf = r / R;
        const v = Math.sqrt(GM / r), T = (2 * Math.PI * r) / v, Kk = 0.5 * m * v * v, U = (-GM * m) / r;
        return {
          tmax: 6, loop: true, timeLabel: timeLbl(T),
          draw(g, t) {
            const cx = 200, cy = 180, sc = 150 / r, a = (2 * Math.PI * t) / 6;
            g.fillStyle = "#4dabf7"; g.beginPath(); g.arc(cx, cy, R * sc, 0, 7); g.fill(); D.text(g, p.planet || "planet", cx, cy, { size: 11, color: "#fff", bold: true, align: "center" });
            g.save(); g.strokeStyle = "#ced4da"; g.setLineDash([5, 4]); g.beginPath(); g.arc(cx, cy, r * sc, 0, 7); g.stroke(); g.restore();
            const x = cx + r * sc * Math.cos(a), y = cy - r * sc * Math.sin(a);
            D.arrow(g, x, y, x - 60 * Math.sin(a), y - 60 * Math.cos(a), K.v, `v ${fmt(v)} m/s`, { off: 22 }); D.arrow(g, x, y, x + (cx - x) * 0.3, y + (cy - y) * 0.3, K.F, "F_g", { off: 12 });
            D.block(g, x, y, 16, 10, -a, "#495057");
            D.bars(g, 420, 20, 210, 220, [{ label: "K", value: Kk, color: K.K }, { label: "U", value: U, color: K.U }, { label: "E", value: Kk + U, color: "#495057" }], Math.abs(U) * 1.05, "Energy (J)");
            D.text(g, "GMm/r² = mv²/r → v = √(GM/r)", 420, 262, { size: 12, bold: true }); D.text(g, "E = −GMm / 2r  (bound orbit: E < 0)", 420, 284, { size: 12 }); D.text(g, "T² = (4π²/GM) r³", 420, 306, { size: 12 });
          },
          readouts: () => [["orbit radius r", r, "m"], ["altitude", r - R, "m"], ["orbital speed", v, "m/s", true], ["period T", T, "s", true], ["period", T / 3600, "h"], ["K", Kk, "J"], ["U = −GMm/r", U, "J"], ["E = K + U", Kk + U, "J", true], ["g at orbit", GM / (r * r), "m/s²"]],
        };
      }
      if (mode === "ellipse") {
        const rp = p.rp || 2 * R, e = p.e, a = rp / (1 - e), b = a * Math.sqrt(1 - e * e), T = 2 * Math.PI * Math.sqrt((a ** 3) / GM), E = (-GM * m) / (2 * a);
        const posAt = (t) => { const Mn = (2 * Math.PI * t) / 6; let Ea = Mn; for (let i = 0; i < 30; i++) Ea = Ea - (Ea - e * Math.sin(Ea) - Mn) / (1 - e * Math.cos(Ea)); const x = a * (Math.cos(Ea) - e), y = b * Math.sin(Ea); return [x, y, Math.hypot(x, y)]; };
        const vAt = (r) => Math.sqrt(GM * (2 / r - 1 / a));
        return {
          tmax: 6, loop: true, timeLabel: timeLbl(T),
          draw(g, t) {
            const sc = Math.min(250 / (2 * a), 140 / b), cx = 220 + a * e * sc, cy = 180;
            g.save(); g.strokeStyle = "#ced4da"; g.setLineDash([5, 4]); g.beginPath(); g.ellipse(cx - a * e * sc, cy, a * sc, b * sc, 0, 0, 7); g.stroke(); g.restore();
            for (let k = 0; k < 6; k++) { const t0 = k, t1 = k + 0.5; g.fillStyle = k % 2 ? "rgba(174,62,201,.18)" : "rgba(24,101,242,.18)"; g.beginPath(); g.moveTo(cx, cy); for (let i = 0; i <= 20; i++) { const q = posAt(t0 + ((t1 - t0) * i) / 20); g.lineTo(cx + q[0] * sc, cy - q[1] * sc); } g.closePath(); g.fill(); }
            D.text(g, "each shaded wedge = same time → same area", 220, 340, { size: 11, align: "center", color: K.muted });
            g.fillStyle = "#ffd43b"; g.beginPath(); g.arc(cx, cy, Math.max(6, R * sc), 0, 7); g.fill();
            const [x, y, r] = posAt(t); const v = vAt(r); D.line(g, cx, cy, cx + x * sc, cy - y * sc, "#adb5bd", 1);
            D.ball(g, cx + x * sc, cy - y * sc, 7, "#1865f2");
            D.text(g, `r = ${fmt(r)} m   v = ${fmt(v)} m/s`, 420, 50, { size: 13, bold: true });
            D.text(g, `Fastest at perihelion: ${fmt(vAt(rp))} m/s`, 420, 80, { size: 12 }); D.text(g, `Slowest at aphelion: ${fmt(vAt(a * (1 + e)))} m/s`, 420, 100, { size: 12 });
            D.text(g, `L = m r v⊥ is constant`, 420, 130, { size: 12, color: K.p }); D.text(g, `E = −GMm/2a = ${fmt(E)} J`, 420, 150, { size: 12 });
          },
          readouts: (t) => { const r = posAt(t)[2]; return [["r", r, "m"], ["speed (vis-viva)", vAt(r), "m/s"], ["K", 0.5 * m * vAt(r) ** 2, "J"], ["U", (-GM * m) / r, "J"], ["E (constant)", E, "J"], ["semi-major axis a", a, "m"], ["period T", T, "s", true]]; },
          graphs: [{ title: "distance r vs time", ylabel: "m", series: [{ f: (t) => posAt(t)[2], color: K.ink }] }, { title: "speed vs time", ylabel: "m/s", series: [{ f: (t) => vAt(posAt(t)[2]), color: K.v }] }],
        };
      }
      if (mode === "escape") {
        const vesc = Math.sqrt((2 * GM) / R), v0 = (p.frac || 0.8) * vesc;
        const sol = integrate((t, y) => [y[1], -GM / (y[0] * y[0])], [R, v0], 4e5, 20, (t, y) => y[0] < R * 0.999 || y[0] > 12 * R);
        const tEnd = sol.tEnd, E = 0.5 * m * v0 * v0 - (GM * m) / R, rmax = E < 0 ? (GM * m) / (-E) : Infinity;
        return {
          tmax: 6, timeLabel: (t) => `t = ${fmt(((t / 6) * tEnd) / 60, 3)} min`,
          draw(g, t) {
            const [r, v] = sol.at((t / 6) * tEnd), sc = 260 / (10 * R);
            g.fillStyle = "#4dabf7"; g.beginPath(); g.arc(60, 180, R * sc, 0, 7); g.fill();
            D.line(g, 60, 180, 600, 180, "#dee2e6", 1, [4, 4]);
            if (isFinite(rmax) && rmax < 11 * R) { D.line(g, 60 + rmax * sc, 150, 60 + rmax * sc, 210, K.F, 1.5, [3, 3]); D.text(g, `turns back at r = ${fmt(rmax / R)}R`, 60 + rmax * sc, 140, { size: 11, align: "center", color: K.F }); }
            D.block(g, 60 + Math.min(r, 11 * R) * sc, 180, 16, 10, 0, "#e8590c");
            D.bars(g, 420, 210, 210, 140, [{ label: "K", value: 0.5 * m * v * v, color: K.K }, { label: "U", value: (-GM * m) / r, color: K.U }, { label: "E", value: E, color: "#495057" }], (GM * m) / R, "Energy (J)");
            D.text(g, `v_esc = √(2GM/R) = ${fmt(vesc)} m/s`, 360, 40, { size: 13, bold: true }); D.text(g, `launch: ${fmt(v0)} m/s (${fmt(p.frac || 0.8)} × v_esc)`, 360, 64, { size: 12 });
            D.text(g, E >= 0 ? "E ≥ 0 → escapes to infinity" : "E < 0 → bound: it falls back", 360, 90, { size: 13, bold: true, color: E >= 0 ? K.g : K.F });
          },
          readouts: (t) => { const [r, v] = sol.at((t / 6) * tEnd); return [["r / R", r / R, ""], ["speed", v, "m/s"], ["E (constant)", E, "J"], ["escape speed", vesc, "m/s", true]]; },
        };
      }
      // field
      const gs = GM / (R * R);
      const gOf = (r) => (r < R ? (GM * r) / R ** 3 : GM / (r * r));
      const w = Math.sqrt(GM / R ** 3), Tt = (2 * Math.PI) / w;
      return {
        tmax: 6, loop: true, timeLabel: (t) => `tunnel trip: ${fmt(((t / 6) * Tt) / 60, 3)} min`,
        draw(g, t) {
          const cx = 140, cy = 180, Rp = 110;
          g.fillStyle = "#4dabf7"; g.beginPath(); g.arc(cx, cy, Rp, 0, 7); g.fill(); g.fillStyle = "#e7f5ff"; g.fillRect(cx - Rp, cy - 6, 2 * Rp, 12);
          const x = R * Math.cos((2 * Math.PI * t) / 6); D.ball(g, cx + (x / R) * Rp, cy, 7, "#e8590c");
          D.text(g, "tunnel through a uniform planet → SHM", cx, 320, { size: 11, align: "center", color: K.muted });
          const gv = D.view(0, 3 * R, 0, gs * 1.15, { x: 300, y: 40, w: 320, h: 260 }, false);
          g.save(); g.strokeStyle = K.g; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 200; i++) { const r = (3 * R * i) / 200; i ? g.lineTo(gv.X(r), gv.Y(gOf(r))) : g.moveTo(gv.X(r), gv.Y(gOf(r))); } g.stroke(); g.restore();
          D.line(g, gv.X(R), gv.Y(0), gv.X(R), gv.Y(gs * 1.1), "#adb5bd", 1, [3, 3]); D.text(g, "surface", gv.X(R), gv.Y(gs * 1.12), { size: 10, align: "center" });
          D.text(g, "inside: g ∝ r", gv.X(R * 0.5), gv.Y(gs * 0.75), { size: 11, align: "center", color: K.g }); D.text(g, "outside: g ∝ 1/r²", gv.X(R * 2), gv.Y(gs * 0.5), { size: 11, align: "center", color: K.g });
          const r = Math.abs(x); g.fillStyle = "#e8590c"; g.beginPath(); g.arc(gv.X(r), gv.Y(gOf(r)), 5, 0, 7); g.fill();
          D.line(g, gv.X(0), gv.Y(0), gv.X(3 * R), gv.Y(0), "#868e96", 1); D.text(g, "r", gv.X(3 * R), gv.Y(0) + 12, { size: 11 }); D.text(g, "g(r)", gv.X(0) + 4, gv.Y(gs * 1.15) + 4, { size: 11 });
        },
        readouts: (t) => { const r = Math.abs(R * Math.cos((2 * Math.PI * t) / 6)); return [["r", r, "m"], ["g(r)", gOf(r), "m/s²"], ["g at surface", gs, "m/s²", true], ["tunnel period", Tt, "s"]]; },
      };
    },
    explain: (p) => (p.mode === "ellipse" ? ["A planet sweeps out equal areas in equal times, so it speeds up near the star.", "That is conservation of angular momentum: r × v stays the same.", "Total energy depends only on the semi-major axis: E = −GMm/2a."] : ["Gravity is the centripetal force for a circular orbit: GMm/r² = mv²/r.", "U = −GMm/r is negative and approaches 0 far away; a bound orbit has E < 0.", "Escape speed makes total energy exactly zero: v_esc = √(2GM/R)."]),
  };

  // ---------------- shm ----------------
  M.shm = {
    title: (p) => ({ spring: "Mass on a spring: simple harmonic motion", vertical: "Vertical spring: oscillation about the new equilibrium", pendulum: "Simple pendulum", physical: "Physical pendulum" })[p.mode || "spring"],
    controls: (p) => (p.mode === "pendulum" ? [{ key: "L", label: "Length L", min: 0.1, max: Math.max(5, p.L * 2), step: 0.05, unit: "m" }, { key: "A", label: "Amplitude (deg)", min: 2, max: 60, step: 1, unit: "°" }] : p.mode === "physical" ? [{ key: "d", label: "Pivot-to-CM distance d", min: 0.02, max: Math.max(1, p.d * 2), step: 0.01, unit: "m" }] : [{ key: "m", label: "Mass m", min: 0.05, max: Math.max(5, p.m * 2), step: 0.05, unit: "kg" }, { key: "k", label: "Spring constant k", min: 1, max: Math.max(500, p.k * 2), step: 1, unit: "N/m" }, { key: "A", label: "Amplitude A", min: 0.01, max: Math.max(0.5, p.A * 2), step: 0.01, unit: "m" }, { key: "b", label: "Damping b (enrichment)", min: 0, max: 2, step: 0.01, unit: "kg/s" }]),
    defaults: { phi: 0, b: 0 },
    setup(p) {
      const mode = p.mode || "spring";
      let w, T, xf, vf, af, Kf, Uf, unit = "m", Emax, drawObj, label = "x";
      if (mode === "pendulum" || mode === "physical") {
        const A = rad(p.A);
        if (mode === "pendulum") { w = Math.sqrt(g0 / p.L); } else { w = Math.sqrt((p.Mb * g0 * p.d) / (p.I != null ? p.I + (p.Iadd || 0) : p.Icm + p.Mb * p.d * p.d)); }
        T = (2 * Math.PI) / w; const Ieff = mode === "pendulum" ? p.m * p.L * p.L : (p.I != null ? p.I : p.Icm + p.Mb * p.d * p.d), mg = mode === "pendulum" ? p.m * g0 : p.Mb * g0, dd = mode === "pendulum" ? p.L : p.d;
        xf = (t) => A * Math.cos(w * t + p.phi); vf = (t) => -A * w * Math.sin(w * t + p.phi); af = (t) => -A * w * w * Math.cos(w * t + p.phi);
        Kf = (t) => 0.5 * Ieff * vf(t) ** 2; Uf = (t) => mg * dd * (1 - Math.cos(xf(t))); Emax = mg * dd * (1 - Math.cos(A)) * 1.05 + 1e-9; unit = "rad"; label = "θ";
        drawObj = (g, t) => {
          const px = 170, py = 40, Lp = 240, th = xf(t);
          D.line(g, 100, py, 240, py, K.ground, 4); D.line(g, px, py, px, py + Lp + 10, "#ced4da", 1, [3, 3]);
          if (mode === "pendulum") { const bx = px + Lp * Math.sin(th), by = py + Lp * Math.cos(th); D.line(g, px, py, bx, by, "#495057", 1.6); D.ball(g, bx, by, 13); D.text(g, `L = ${fmt(p.L)} m`, px - 10, py + Lp / 2, { size: 11, align: "right" }); D.arrow(g, bx, by, bx, by + 50, K.g, "mg", { off: 10 }); D.arrow(g, bx, by, bx - Math.cos(th) * 0 - Math.sin(th) * 0 - 50 * Math.cos(th) * Math.sign(th) * 0 + (-Math.cos(th)) * 0 + -Math.sign(th) * 0, by, K.F, "", {}); D.arrow(g, bx, by, bx - 40 * Math.sin(th) * Math.cos(th) * 3, by + 40 * Math.sin(th) * Math.sin(th) * 3, K.F, `restoring mg sinθ`, { off: 18 }); }
          else { g.save(); g.translate(px, py); g.rotate(-th); g.fillStyle = "#1865f2"; g.fillRect(-8, -20, 16, Lp + 20); g.restore(); const cmx = px + (p.d / (p.Lrod || p.d * 2)) * Lp * Math.sin(th), cmy = py + (p.d / (p.Lrod || p.d * 2)) * Lp * Math.cos(th); g.fillStyle = "#d92916"; g.beginPath(); g.arc(cmx, cmy, 6, 0, 7); g.fill(); D.text(g, "CM", cmx + 10, cmy, { size: 11, color: K.F, bold: true }); g.fillStyle = "#212529"; g.beginPath(); g.arc(px, py, 5, 0, 7); g.fill(); }
          D.text(g, mode === "pendulum" ? `T = 2π√(L/g) = ${fmt(T)} s` : `T = 2π√(I/mgd) = ${fmt(T)} s`, 300, 300, { size: 14, bold: true, color: K.a });
          D.text(g, "small-angle approximation: sinθ ≈ θ", 300, 325, { size: 11, color: K.muted });
        };
      } else {
        const m = p.m, k = p.k, A = p.A, b = p.b || 0;
        const w0 = Math.sqrt(k / m), gam = b / (2 * m); w = Math.sqrt(Math.max(1e-9, w0 * w0 - gam * gam)); T = (2 * Math.PI) / w;
        xf = (t) => A * Math.exp(-gam * t) * Math.cos(w * t + p.phi);
        vf = (t) => A * Math.exp(-gam * t) * (-gam * Math.cos(w * t + p.phi) - w * Math.sin(w * t + p.phi));
        af = (t) => (-k * xf(t) - b * vf(t)) / m;
        Kf = (t) => 0.5 * m * vf(t) ** 2; Uf = (t) => 0.5 * k * xf(t) ** 2; Emax = 0.5 * k * A * A * 1.05;
        const vert = mode === "vertical", dEq = (m * g0) / k;
        drawObj = (g, t) => {
          const x = xf(t), sc = 120 / Math.max(A, 1e-6);
          if (!vert) {
            const ex = 220; D.ground(g, 20, 400, 230); D.line(g, 30, 150, 30, 230, K.ground, 5);
            D.spring(g, 30, 205, ex + x * sc - 24, 205, 12, 10); D.block(g, ex + x * sc, 205, 48, 48, 0, "#1865f2", `${fmt(m)}kg`);
            D.line(g, ex, 240, ex, 150, K.muted, 1, [3, 3]); D.text(g, "x = 0", ex, 142, { size: 10, align: "center", color: K.muted });
            D.line(g, ex - A * sc, 240, ex - A * sc, 175, "#ced4da", 1, [2, 3]); D.line(g, ex + A * sc, 240, ex + A * sc, 175, "#ced4da", 1, [2, 3]);
            D.text(g, "−A", ex - A * sc, 250, { size: 10, align: "center", color: K.muted }); D.text(g, "+A", ex + A * sc, 250, { size: 10, align: "center", color: K.muted });
            const vs = 60 / (A * w0), as = 50 / (A * w0 * w0);
            D.arrow(g, ex + x * sc, 160, ex + x * sc + vf(t) * vs, 160, K.v, "v", { off: 10 }); D.arrow(g, ex + x * sc, 270, ex + x * sc + af(t) * as, 270, K.a, "a", { off: 10 });
            D.arrow(g, ex + x * sc, 300, ex + x * sc - k * x * (50 / (k * A)), 300, K.F, `F = −kx = ${fmt(-k * x)} N`, { off: 50 });
          } else {
            const ey = 190; D.line(g, 120, 20, 300, 20, K.ground, 4);
            D.spring(g, 210, 20, 210, ey + x * sc - 24, 12, 12); D.block(g, 210, ey + x * sc, 48, 48, 0, "#1865f2", `${fmt(m)}kg`);
            D.line(g, 150, ey, 280, ey, K.muted, 1, [3, 3]); D.text(g, `equilibrium (stretched ${fmt(dEq)} m = mg/k)`, 285, ey, { size: 10, color: K.muted });
          }
          // reference circle
          const rx = 340, ry = 70, rr = 45, ph = w * t + p.phi; g.save(); g.strokeStyle = "#ced4da"; g.beginPath(); g.arc(rx, ry, rr, 0, 7); g.stroke(); g.restore();
          D.line(g, rx, ry, rx + rr * Math.cos(ph), ry - rr * Math.sin(ph), "#ae3ec9", 2); D.ball(g, rx + rr * Math.cos(ph), ry - rr * Math.sin(ph), 4, "#ae3ec9");
          D.line(g, rx + rr * Math.cos(ph), ry - rr * Math.sin(ph), rx + rr * Math.cos(ph), ry + rr + 6, "#ae3ec9", 1, [2, 2]);
          D.text(g, "reference circle: x is the shadow", rx, ry + rr + 18, { size: 9, align: "center", color: K.muted });
          D.text(g, `ω = √(k/m) = ${fmt(w0)} rad/s   T = ${fmt((2 * Math.PI) / w0)} s`, 20, 340, { size: 13, bold: true, color: K.a });
        };
      }
      const tmax = Math.max(T * (p.b ? 6 : 2), 1);
      return {
        tmax, loop: !p.b, speed: T > 4 ? T / 3 : T < 0.4 ? 0.3 : 1,
        draw(g, t) { drawObj(g, t); D.bars(g, 440, 120, 190, 200, [{ label: "K", value: Kf(t), color: K.K }, { label: "U", value: Uf(t), color: K.U }, { label: "E", value: Kf(t) + Uf(t), color: "#495057" }], Emax, "Energy (J)"); },
        readouts: (t) => [["t", t.toFixed(2), "s"], [label, xf(t), unit], [mode.includes("pend") || mode === "physical" ? "ω_angular (dθ/dt)" : "v", vf(t), unit + "/s"], ["acceleration", af(t), unit + "/s²"], ["ω (angular freq.)", w, "rad/s"], ["period T", T, "s", true], ["frequency f", 1 / T, "Hz"], ["K", Kf(t), "J"], ["U", Uf(t), "J"], ["max speed Aω", (mode.includes("pend") || mode === "physical" ? rad(p.A) : p.A) * w, unit + "/s", true]],
        graphs: [{ title: `${label}(t) = A cos(ωt + φ)`, ylabel: unit, series: [{ f: xf, color: K.ink }] }, { title: "velocity vs t", ylabel: `${unit}/s`, series: [{ f: vf, color: K.v }] }, { title: "energy vs t", ylabel: "J", series: [{ f: Kf, color: K.K, name: "K" }, { f: Uf, color: K.U, name: "U" }] }],
      };
    },
    explain: (p) => ((p.mode || "").includes("pend") ? ["For small angles the restoring torque is proportional to θ, so the motion is SHM.", "The period doesn't depend on the mass or (for small swings) the amplitude.", "Physical pendulum: T = 2π√(I/mgd) — I is about the pivot (use the parallel-axis theorem)."] : ["The restoring force F = −kx always points back toward equilibrium, so a ∝ −x.", "x, v and a are sinusoids, each a quarter-cycle apart: v is max at x = 0, a is max at the ends.", "Energy sloshes between K and U while E = ½kA² stays constant (if b = 0)."]),
  };
})();
