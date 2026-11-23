/* Chapter 2 — Motion Along a Straight Line */
(function () {
  const { problem, article, sig, tex } = window.Phys;
  const T = String.raw, g = 9.8;
  // piecewise constant-velocity legs
  function legs(L) {
    const ts = [0]; const xs = [0];
    L.forEach((l) => { ts.push(ts[ts.length - 1] + l.dur); xs.push(xs[xs.length - 1] + l.v * l.dur); });
    const idx = (t) => { for (let i = 0; i < L.length; i++) if (t < ts[i + 1]) return i; return L.length - 1; };
    return { xf: (t) => { const i = idx(t); return xs[i] + L[i].v * (Math.min(t, ts[ts.length - 1]) - ts[i]); }, vf: (t) => L[idx(t)].v, af: () => 0, tmax: ts[ts.length - 1] };
  }

  article("2-1", T`
<p>Kinematics describes motion without asking what causes it. In one dimension the motion happens along a line, so we pick an axis, an origin, and a positive direction — and then every position, velocity and acceleration is a signed number.</p>
<h2>Position and displacement</h2>
<p><b>Position</b> $x$ tells where the object is. <b>Displacement</b> is the change in position:</p>
<div class="eq">$\Delta x = x_2 - x_1$</div>
<p>Displacement can be negative (motion in the −x direction) and it ignores the path taken. If you walk 5 m east and 5 m back, your displacement is zero even though you walked 10 m.</p>
<h2>Average velocity vs. average speed</h2>
<div class="eq">$v_{avg} = \dfrac{\Delta x}{\Delta t} \qquad s_{avg} = \dfrac{\text{total distance}}{\Delta t}$</div>
<p>Average velocity is a vector (has a sign); average speed is always positive and uses the total path length. On an $x$–$t$ graph, the average velocity between two times is the <b>slope of the straight line</b> (the secant) connecting those two points.</p>
<div class="worked"><div class="wt">Worked example</div>You jog 400 m east in 160 s, then walk 100 m west in 100 s.<br>Displacement $= 400 - 100 = 300\ \text{m}$; time $= 260\ \text{s}$; $v_{avg} = 300/260 = 1.15\ \text{m/s}$ east.<br>Distance $= 500\ \text{m}$, so $s_{avg} = 500/260 = 1.92\ \text{m/s}$.</div>
<div class="callout warn"><b class="t">Common mistake</b>Averaging the two speeds. The average velocity is <i>not</i> $(v_1+v_2)/2$ unless the two legs take equal <i>times</i>. Always go back to total displacement ÷ total time.</div>`);

  article("2-2", T`
<p>An average velocity smears out the details. The <b>instantaneous velocity</b> is what a speedometer shows: the velocity at one instant. Calculus gives the exact definition.</p>
<h2>Velocity is the derivative of position</h2>
<div class="eq">$v = \lim_{\Delta t\to0}\dfrac{\Delta x}{\Delta t} = \dfrac{dx}{dt}$</div>
<p>Graphically, $v$ is the <b>slope of the tangent line</b> to the $x$–$t$ curve. Speed is the magnitude $|v|$.</p>
<h2>Acceleration is the derivative of velocity</h2>
<div class="eq">$a = \dfrac{dv}{dt} = \dfrac{d^2x}{dt^2}$</div>
<p>Acceleration is the slope of the $v$–$t$ graph. Its units are m/s².</p>
<div class="worked"><div class="wt">Worked example</div>A particle moves as $x(t) = 2t^3 - 9t^2 + 12t$ (m, s).<br>$v = \frac{dx}{dt} = 6t^2 - 18t + 12$ and $a = \frac{dv}{dt} = 12t - 18$.<br>It is momentarily at rest when $v = 0$: $6(t^2 - 3t + 2) = 0 \Rightarrow t = 1\ \text{s}$ or $t = 2\ \text{s}$. At $t=1\ \text{s}$, $a = -6\ \text{m/s}^2$.</div>
<div class="callout key"><b class="t">Speeding up or slowing down?</b>An object speeds up when $v$ and $a$ have the <b>same sign</b> and slows down when they have <b>opposite signs</b>. A negative acceleration does not automatically mean "slowing down".</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>The calculus section lists $\frac{d}{dx}x^n = nx^{n-1}$ — that's the only rule you need for polynomial positions.</div>`);

  article("2-3", T`
<p>When the acceleration is constant, the derivatives and integrals can be done once and for all. The result is the set of "big three" kinematic equations — all on your equation sheet.</p>
<div class="eq">$v_x = v_{x0} + a_x t$</div>
<div class="eq">$x = x_0 + v_{x0}t + \tfrac12 a_x t^2$</div>
<div class="eq">$v_x^2 = v_{x0}^2 + 2a_x(x - x_0)$</div>
<p>Each equation leaves out one variable. Pick the one that leaves out the quantity you neither know nor want:</p>
<ul><li>No displacement → $v = v_0 + at$</li><li>No final velocity → $x = x_0 + v_0t + \frac12at^2$</li><li>No time → $v^2 = v_0^2 + 2a\Delta x$</li></ul>
<div class="worked"><div class="wt">Worked example — braking distance</div>A car moving at 25 m/s brakes with $a = -6.0\ \text{m/s}^2$. How far does it travel before stopping?<br>No time involved: $0 = 25^2 + 2(-6.0)\Delta x \Rightarrow \Delta x = 52\ \text{m}$.<br>Notice the distance grows with the <i>square</i> of the speed — double the speed, four times the stopping distance.</div>
<h2>Strategy</h2>
<ol><li>Sketch the situation and choose a positive direction.</li><li>List knowns with signs ($v_0$, $v$, $a$, $\Delta x$, $t$). You need three.</li><li>Choose the equation that contains your three knowns and the unknown.</li><li>Check the sign and size of the answer.</li></ol>
<div class="callout warn"><b class="t">Only for constant acceleration</b>If $a$ changes with time (e.g. $a = 4t$), these equations are wrong — go back to calculus (Lesson 2.5).</div>`);

  article("2-4", T`
<p>Near Earth's surface, and ignoring air resistance, every object falls with the same constant acceleration, $g = 9.8\ \text{m/s}^2$ downward — regardless of its mass. That makes free fall a special case of constant acceleration.</p>
<h2>Set up the axis</h2>
<p>Choose $+y$ upward. Then $a_y = -g = -9.8\ \text{m/s}^2$ for the entire flight — on the way up, at the top, and on the way down.</p>
<div class="eq">$v_y = v_{y0} - gt \qquad y = y_0 + v_{y0}t - \tfrac12 gt^2 \qquad v_y^2 = v_{y0}^2 - 2g(y - y_0)$</div>
<div class="callout key"><b class="t">At the top</b>The velocity is zero for an instant, but the acceleration is still $-9.8\ \text{m/s}^2$. If $a$ were zero there, the ball would just hover!</div>
<div class="worked"><div class="wt">Worked example</div>A ball is thrown straight up at 14.7 m/s.<br>Time to the top: $0 = 14.7 - 9.8t \Rightarrow t = 1.5\ \text{s}$.<br>Max height: $0 = 14.7^2 - 2(9.8)h \Rightarrow h = 11\ \text{m}$.<br>By symmetry it returns to the launch height after $3.0\ \text{s}$ with speed 14.7 m/s downward.</div>
<p>When an object is thrown from a cliff and lands below the launch point, the time comes from a quadratic — keep the positive root.</p>
<div class="callout sheet"><b class="t">On your equation sheet</b>$g = 9.8\ \text{m/s}^2$ is given. Use exactly that value unless a problem says otherwise.</div>`);

  article("2-5", T`
<p>If you know how the acceleration or velocity changes with time, you can recover the motion by integrating — the reverse of differentiating. AP Physics C expects you to do this both with functions and with graphs.</p>
<h2>Integrals undo derivatives</h2>
<div class="eq">$\Delta v_x = \int a_x(t)\,dt \qquad \Delta x = \int v_x(t)\,dt$</div>
<p>Both are on your equation sheet. Remember the constant: if $v_0 \ne 0$ at $t=0$, then $v(t) = v_0 + \int_0^t a\,dt'$.</p>
<div class="worked"><div class="wt">Worked example</div>A rocket sled starts from rest at $x=0$ with $a(t) = 3t\ \text{m/s}^2$.<br>$v(t) = \int_0^t 3t'\,dt' = \tfrac32 t^2$, and $x(t) = \int_0^t \tfrac32t'^2\,dt' = \tfrac12t^3$.<br>At $t = 4\ \text{s}$: $v = 24\ \text{m/s}$, $x = 32\ \text{m}$.</div>
<h2>Area under the curve</h2>
<p>Graphically, the integral is the <b>signed area</b>:</p>
<ul><li>Area under an $a$–$t$ graph = change in velocity.</li><li>Area under a $v$–$t$ graph = displacement (areas below the axis count as negative).</li></ul>
<p>For a $v$–$t$ graph made of straight segments, break the area into rectangles and triangles.</p>
<div class="callout key"><b class="t">Graph chain</b>Slopes go down the chain ($x \to v \to a$); areas go up the chain ($a \to v \to x$).</div>`);

  // ---------------- 2-1 ----------------
  problem("2-1", "twolegs", {
    title: "Average velocity of a two-part trip", level: 1,
    gen(r) {
      const d1 = r.int(2, 9) * 100, v1 = r.num(1.5, 4, 0.5), d2 = r.int(2, 9) * 100, v2 = r.num(4, 9, 0.5);
      const t1 = d1 / v1, t2 = d2 / v2, va = (d1 + d2) / (t1 + t2);
      const L = legs([{ v: v1, dur: t1 }, { v: v2, dur: t2 }]);
      return { q: T`<p>A cyclist rides $${d1}\ \text{m}$ east at a steady $${v1}\ \text{m/s}$, then $${d2}\ \text{m}$ farther east at $${v2}\ \text{m/s}$. What is her average velocity for the whole trip?</p>`,
        answer: va, unit: "m/s",
        hints: ["Average velocity = total displacement ÷ total time. It is NOT the average of the two speeds.", T`Time for each leg: $t = d/v$.`],
        solution: [T`$t_1 = ${d1}/${v1} = ${sig(t1)}\ \text{s}$, $t_2 = ${d2}/${v2} = ${sig(t2)}\ \text{s}$`, T`$\Delta x = ${d1 + d2}\ \text{m}$, $\Delta t = ${sig(t1 + t2)}\ \text{s}$`, T`$v_{avg} = ${sig(va)}\ \text{m/s}$ east (compare: the average of the speeds would be ${sig((v1 + v2) / 2)} m/s — wrong).`],
        model: { type: "motion1d", xf: L.xf, vf: L.vf, af: L.af, tmax: L.tmax, obj: "car", title: "Two legs at constant velocity", facts: [["average velocity", `${sig(va)} m/s`]] } };
    },
  });
  problem("2-1", "backforth", {
    title: "Average speed vs. average velocity (there and back)", level: 2,
    gen(r) {
      const d1 = r.int(30, 90) * 10, t1 = r.int(100, 300), d2 = r.int(10, 25) * 10, t2 = r.int(60, 200);
      const askSpeed = r.bool();
      const vavg = (d1 - d2) / (t1 + t2), savg = (d1 + d2) / (t1 + t2);
      const L = legs([{ v: d1 / t1, dur: t1 }, { v: -d2 / t2, dur: t2 }]);
      return { q: T`<p>A dog runs $${d1}\ \text{m}$ in the $+x$ direction in $${t1}\ \text{s}$, then turns and runs $${d2}\ \text{m}$ in the $-x$ direction in $${t2}\ \text{s}$. What is its average <b>${askSpeed ? "speed" : "velocity"}</b> for the whole run?</p>`,
        answer: askSpeed ? savg : vavg, unit: "m/s",
        hints: [askSpeed ? "Average speed uses total distance (always positive)." : "Average velocity uses displacement: the backward run subtracts.", T`Total time $= ${t1 + t2}\ \text{s}$.`],
        solution: [T`Displacement $= ${d1} - ${d2} = ${d1 - d2}\ \text{m}$; distance $= ${d1 + d2}\ \text{m}$; time $= ${t1 + t2}\ \text{s}$.`, T`$v_{avg} = ${sig(vavg)}\ \text{m/s}$, $s_{avg} = ${sig(savg)}\ \text{m/s}$.`],
        model: { type: "motion1d", xf: L.xf, vf: L.vf, af: L.af, tmax: L.tmax, obj: "ball", title: "Out and back", facts: [["avg velocity", `${sig(vavg)} m/s`], ["avg speed", `${sig(savg)} m/s`]] } };
    },
  });

  // ---------------- 2-2 ----------------
  function poly(r) { const A = r.num(0.5, 2, 0.5), B = r.int(2, 6), C = r.int(1, 8); return { A, B, C, xf: (t) => A * t ** 3 - B * t * t + C * t, vf: (t) => 3 * A * t * t - 2 * B * t + C, af: (t) => 6 * A * t - 2 * B }; }
  problem("2-2", "deriv-v", {
    title: "Velocity from x(t) by differentiating", level: 2,
    gen(r) {
      const P = poly(r), t1 = r.num(1, 4, 0.5);
      return { q: T`<p>A particle's position is $x(t) = ${P.A}t^3 - ${P.B}t^2 + ${P.C}t$, with $x$ in meters and $t$ in seconds. What is its velocity at $t = ${t1}\ \text{s}$?</p>`,
        answer: P.vf(t1), unit: "m/s", absTol: 0.05,
        hints: [T`$v = \frac{dx}{dt}$. Use $\frac{d}{dt}t^n = nt^{n-1}$ term by term.`, T`$v(t) = ${3 * P.A}t^2 - ${2 * P.B}t + ${P.C}$`],
        solution: [T`$v(t) = \frac{dx}{dt} = ${3 * P.A}t^2 - ${2 * P.B}t + ${P.C}$`, T`$v(${t1}) = ${sig(P.vf(t1))}\ \text{m/s}$`],
        model: { type: "motion1d", xf: P.xf, vf: P.vf, af: P.af, tmax: Math.max(4.5, t1 + 0.5), obj: "ball", title: "Position given by a polynomial", marks: [] } };
    },
  });
  problem("2-2", "deriv-a", {
    title: "Acceleration from x(t)", level: 2,
    gen(r) {
      const P = poly(r), t1 = r.num(0.5, 4, 0.5);
      return { q: T`<p>The position of an elevator car is $x(t) = ${P.A}t^3 - ${P.B}t^2 + ${P.C}t$ (m, s). What is its acceleration at $t = ${t1}\ \text{s}$?</p>`,
        answer: P.af(t1), unit: "m/s²", absTol: 0.05,
        hints: ["Differentiate twice: a = d²x/dt².", T`$a(t) = ${6 * P.A}t - ${2 * P.B}$`],
        solution: [T`$v = ${3 * P.A}t^2 - ${2 * P.B}t + ${P.C}$`, T`$a = \frac{dv}{dt} = ${6 * P.A}t - ${2 * P.B}$`, T`$a(${t1}) = ${sig(P.af(t1))}\ \text{m/s}^2$`],
        model: { type: "motion1d", xf: P.xf, vf: P.vf, af: P.af, tmax: Math.max(4.5, t1 + 0.5), obj: "ball" } };
    },
  });
  problem("2-2", "rest", {
    title: "When is the particle momentarily at rest?", level: 2,
    gen(r) {
      const c = r.int(3, 12), d = r.num(0.5, 2, 0.5), x0 = r.int(0, 5);
      const ts = (2 * c) / (3 * d);
      const xf = (t) => x0 + c * t * t - d * t ** 3, vf = (t) => 2 * c * t - 3 * d * t * t, af = (t) => 2 * c - 6 * d * t;
      return { q: T`<p>A bead slides along a wire with $x(t) = ${x0} + ${c}t^2 - ${d}t^3$ (m, s). At what time $t > 0$ is it momentarily at rest?</p>`,
        answer: ts, unit: "s",
        hints: ["Momentarily at rest means v = 0.", T`$v = ${2 * c}t - ${3 * d}t^2 = t(${2 * c} - ${3 * d}t)$`],
        solution: [T`$v = \frac{dx}{dt} = ${2 * c}t - ${3 * d}t^2$`, T`Set $v = 0$: $t = 0$ or $t = ${2 * c}/${3 * d} = ${sig(ts)}\ \text{s}$`, "That's where the x–t graph has a horizontal tangent (a turning point)."],
        model: { type: "motion1d", xf, vf, af, tmax: ts * 1.6, obj: "ball", facts: [["v = 0 at", `${sig(ts)} s`]] } };
    },
  });

  // ---------------- 2-3 ----------------
  problem("2-3", "brake", {
    title: "Stopping distance", level: 1,
    gen(r) {
      const v0 = r.int(12, 35), a = r.num(3, 8, 0.5), d = (v0 * v0) / (2 * a);
      return { q: T`<p>A driver moving at $${v0}\ \text{m/s}$ slams on the brakes, giving a constant deceleration of magnitude $${a}\ \text{m/s}^2$. How far does the car travel while stopping?</p>`,
        answer: d, unit: "m",
        hints: ["Time isn't given or asked for — use the equation without t.", T`$v^2 = v_0^2 + 2a\Delta x$ with $v = 0$ and $a = -${a}$.`],
        solution: [T`$0 = ${v0}^2 + 2(-${a})\Delta x$`, T`$\Delta x = \frac{${v0}^2}{2(${a})} = ${sig(d)}\ \text{m}$`],
        model: { type: "motion1d", x0: 0, v0, a: -a, tmax: v0 / a, obj: "car", marks: [{ x: d, label: "stops" }] } };
    },
  });
  problem("2-3", "accel", {
    title: "Acceleration from speed and distance", level: 1,
    gen(r) {
      const v = r.int(20, 80), d = r.int(200, 1500), a = (v * v) / (2 * d), t = (2 * d) / v;
      const askT = r.bool();
      return { q: T`<p>A jet starts from rest and reaches its takeoff speed of $${v}\ \text{m/s}$ after rolling $${d}\ \text{m}$ down the runway with constant acceleration. ${askT ? "How long does the takeoff roll take?" : "What is its acceleration?"}</p>`,
        answer: askT ? t : a, unit: askT ? "s" : "m/s²",
        hints: askT ? [T`For constant acceleration from rest, $\Delta x = \frac{v_0+v}{2}t$.`] : [T`$v^2 = v_0^2 + 2a\Delta x$ with $v_0 = 0$.`],
        solution: askT ? [T`Average velocity $= (0 + ${v})/2 = ${v / 2}\ \text{m/s}$`, T`$t = ${d}/${v / 2} = ${sig(t)}\ \text{s}$`] : [T`$a = \frac{v^2}{2\Delta x} = \frac{${v}^2}{2(${d})} = ${sig(a)}\ \text{m/s}^2$`],
        model: { type: "motion1d", x0: 0, v0: 0, a, tmax: t, obj: "car", facts: [["a", `${sig(a)} m/s²`], ["t", `${sig(t)} s`]] } };
    },
  });
  problem("2-3", "quad", {
    title: "Time to cover a distance (quadratic)", level: 2,
    gen(r) {
      const v0 = r.int(2, 12), a = r.num(1, 4, 0.5), d = r.int(20, 120);
      const t = (-v0 + Math.sqrt(v0 * v0 + 2 * a * d)) / a;
      return { q: T`<p>A skier passes a marker at $${v0}\ \text{m/s}$ and accelerates down a straight slope at a constant $${a}\ \text{m/s}^2$. How long after passing the marker is she $${d}\ \text{m}$ farther down the slope?</p>`,
        answer: t, unit: "s",
        hints: [T`$\Delta x = v_0t + \frac12at^2$ is quadratic in t.`, T`$${a / 2}t^2 + ${v0}t - ${d} = 0$ → use the quadratic formula and keep the positive root.`],
        solution: [T`$${d} = ${v0}t + \tfrac12(${a})t^2$`, T`$t = \frac{-${v0} + \sqrt{${v0}^2 + 2(${a})(${d})}}{${a}} = ${sig(t)}\ \text{s}$`],
        model: { type: "motion1d", x0: 0, v0, a, tmax: t, obj: "ball", marks: [{ x: d, label: `${d} m` }] } };
    },
  });

  // ---------------- 2-4 ----------------
  problem("2-4", "maxh", {
    title: "Maximum height of a ball thrown upward", level: 1,
    gen(r) {
      const v0 = r.num(5, 30, 0.5), h = (v0 * v0) / (2 * g), tu = v0 / g;
      const askT = r.bool();
      return { q: T`<p>A ball is thrown straight up with a speed of $${v0}\ \text{m/s}$. ${askT ? "How long does it take to reach its highest point?" : "How high above the launch point does it rise?"}</p>`,
        answer: askT ? tu : h, unit: askT ? "s" : "m",
        hints: ["At the highest point the velocity is momentarily zero — but a is still −9.8 m/s².", askT ? T`$0 = v_0 - gt$` : T`$0 = v_0^2 - 2gh$`],
        solution: askT ? [T`$t = v_0/g = ${v0}/9.8 = ${sig(tu)}\ \text{s}$`] : [T`$h = \frac{v_0^2}{2g} = \frac{${v0}^2}{2(9.8)} = ${sig(h)}\ \text{m}$`],
        model: { type: "motion1d", axis: "y", orient: "v", x0: 0, v0, a: -g, tmax: 2 * tu, ground: 0, title: "Thrown straight up (up = +)" } };
    },
  });
  problem("2-4", "cliff", {
    title: "Thrown upward from a cliff", level: 2,
    gen(r) {
      const v0 = r.num(4, 15, 0.5), h = r.int(15, 60);
      const t = (v0 + Math.sqrt(v0 * v0 + 2 * g * h)) / g, vimp = Math.sqrt(v0 * v0 + 2 * g * h);
      const askV = r.bool();
      return { q: T`<p>A stone is thrown straight up at $${v0}\ \text{m/s}$ from the edge of a cliff $${h}\ \text{m}$ above the beach below. It misses the cliff on the way down. ${askV ? "With what speed does it hit the beach?" : "How long after launch does it hit the beach?"}</p>`,
        answer: askV ? vimp : t, unit: askV ? "m/s" : "s",
        hints: ["Take up as + and the launch point as y = 0, so the beach is at y = −" + h + " m.", askV ? T`$v^2 = v_0^2 - 2g\Delta y$ with $\Delta y = -${h}$.` : T`$-${h} = ${v0}t - 4.9t^2$ → quadratic.`],
        solution: askV ? [T`$v^2 = ${v0}^2 - 2(9.8)(-${h}) = ${sig(vimp * vimp, 4)}$`, T`$|v| = ${sig(vimp)}\ \text{m/s}$ — the same as if it had been thrown straight down at ${v0} m/s!`] : [T`$4.9t^2 - ${v0}t - ${h} = 0$`, T`$t = \frac{${v0} + \sqrt{${v0}^2 + 4(4.9)(${h})}}{9.8} = ${sig(t)}\ \text{s}$`],
        model: { type: "motion1d", axis: "y", orient: "v", x0: 0, v0, a: -g, tmax: t, ground: -h, title: "Launch from a cliff (y = 0 at the cliff top)" } };
    },
  });
  problem("2-4", "drop", {
    title: "Dropped object", level: 1,
    gen(r) {
      const h = r.int(5, 80), t = Math.sqrt((2 * h) / g), v = g * t, askV = r.bool();
      return { q: T`<p>A phone slips out of a window and falls from rest a distance of $${h}\ \text{m}$ to the ground. ${askV ? "How fast is it moving when it lands?" : "How long is it in the air?"}</p>`,
        answer: askV ? v : t, unit: askV ? "m/s" : "s",
        hints: [askV ? T`$v^2 = 2gh$` : T`$h = \tfrac12gt^2$`],
        solution: askV ? [T`$v = \sqrt{2gh} = \sqrt{2(9.8)(${h})} = ${sig(v)}\ \text{m/s}$`] : [T`$t = \sqrt{2h/g} = \sqrt{2(${h})/9.8} = ${sig(t)}\ \text{s}$`],
        model: { type: "motion1d", axis: "y", orient: "v", x0: h, v0: 0, a: -g, tmax: t, ground: 0, title: "Dropped from rest" } };
    },
  });

  // ---------------- 2-5 ----------------
  problem("2-5", "integ-a", {
    title: "Velocity and position from a(t) = kt", level: 2,
    gen(r) {
      const k = r.num(0.5, 4, 0.5), t1 = r.int(2, 6), v0 = r.int(0, 4), askX = r.bool();
      const vf = (t) => v0 + 0.5 * k * t * t, xf = (t) => v0 * t + (k * t ** 3) / 6, af = (t) => k * t;
      return { q: T`<p>A drag racer starts at $x = 0$ with velocity $${v0}\ \text{m/s}$ and has acceleration $a(t) = ${k}t$ (m/s², with $t$ in s). What is its ${askX ? "position" : "velocity"} at $t = ${t1}\ \text{s}$?</p>`,
        answer: askX ? xf(t1) : vf(t1), unit: askX ? "m" : "m/s",
        hints: [T`$v(t) = v_0 + \int_0^t a\,dt'$ — the acceleration is NOT constant, so the big-three equations don't apply.`, T`$v(t) = ${v0} + ${k / 2}t^2$${askX ? T`, then $x(t) = \int_0^t v\,dt' = ${v0}t + ${sig(k / 6, 3)}t^3$` : ""}`],
        solution: [T`$v(t) = ${v0} + \int_0^t ${k}t'\,dt' = ${v0} + ${k / 2}t^2$`, ...(askX ? [T`$x(t) = \int_0^t (${v0} + ${k / 2}t'^2)dt' = ${v0}t + \frac{${k}}{6}t^3$`] : []), T`At $t = ${t1}$: ${askX ? T`$x = ${sig(xf(t1))}\ \text{m}$` : T`$v = ${sig(vf(t1))}\ \text{m/s}$`}`],
        model: { type: "motion1d", xf, vf, af, tmax: t1, obj: "car", title: "Acceleration growing linearly with time" } };
    },
  });
  problem("2-5", "integ-v", {
    title: "Displacement from v(t)", level: 2,
    gen(r) {
      const A = r.int(4, 20), B = r.num(0.5, 3, 0.5), t1 = r.int(2, 5);
      const vf = (t) => A - B * t * t, xf = (t) => A * t - (B * t ** 3) / 3, af = (t) => -2 * B * t;
      return { q: T`<p>An object moves with $v(t) = ${A} - ${B}t^2$ (m/s). What is its displacement from $t = 0$ to $t = ${t1}\ \text{s}$?</p>`,
        answer: xf(t1), unit: "m", absTol: 0.05,
        hints: [T`$\Delta x = \int_0^{${t1}} v\,dt$`, T`$\int (${A} - ${B}t^2)dt = ${A}t - \frac{${B}}{3}t^3$`],
        solution: [T`$\Delta x = \left[${A}t - \tfrac{${B}}{3}t^3\right]_0^{${t1}}$`, T`$= ${A * t1} - ${sig((B * t1 ** 3) / 3, 4)} = ${sig(xf(t1))}\ \text{m}$`],
        model: { type: "motion1d", xf, vf, af, tmax: t1, obj: "ball" } };
    },
  });
  problem("2-5", "vtgraph", {
    title: "Displacement as area under a v–t graph", level: 1,
    gen(r) {
      const vm = r.int(4, 20), t1 = r.int(2, 6), t2 = t1 + r.int(2, 8), t3 = t2 + r.int(2, 6);
      const disp = 0.5 * vm * t1 + vm * (t2 - t1) + 0.5 * vm * (t3 - t2);
      const vf = (t) => (t < t1 ? (vm * t) / t1 : t < t2 ? vm : Math.max(0, vm * (1 - (t - t2) / (t3 - t2))));
      const af = (t) => (t < t1 ? vm / t1 : t < t2 ? 0 : -vm / (t3 - t2));
      const xf = (t) => { if (t < t1) return (0.5 * vm * t * t) / t1; const x1 = 0.5 * vm * t1; if (t < t2) return x1 + vm * (t - t1); const u = Math.min(t, t3) - t2; return x1 + vm * (t2 - t1) + vm * u - (0.5 * vm * u * u) / (t3 - t2); };
      return { q: T`<p>A train's velocity rises uniformly from 0 to $${vm}\ \text{m/s}$ in the first $${t1}\ \text{s}$, stays at $${vm}\ \text{m/s}$ until $t = ${t2}\ \text{s}$, then drops uniformly to 0 at $t = ${t3}\ \text{s}$. How far does it travel?</p>`,
        answer: disp, unit: "m",
        hints: ["Sketch v vs t — it's a trapezoid.", "Area = triangle + rectangle + triangle."],
        solution: [T`Triangle: $\tfrac12(${t1})(${vm}) = ${0.5 * vm * t1}\ \text{m}$`, T`Rectangle: $(${t2 - t1})(${vm}) = ${vm * (t2 - t1)}\ \text{m}$`, T`Triangle: $\tfrac12(${t3 - t2})(${vm}) = ${0.5 * vm * (t3 - t2)}\ \text{m}$`, T`Total $= ${sig(disp)}\ \text{m}$`],
        model: { type: "motion1d", xf, vf, af, tmax: t3, obj: "car", title: "Speed up, cruise, slow down" } };
    },
  });
})();
