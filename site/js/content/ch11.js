/* Chapter 11 — Rolling, Torque, and Angular Momentum */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180;
  const SH = { hoop: { b: 1, n: "thin hoop", I: "MR^2" }, disk: { b: 0.5, n: "solid cylinder", I: "\\tfrac12MR^2" }, sphere: { b: 0.4, n: "solid sphere", I: "\\tfrac25MR^2" }, shell: { b: 2 / 3, n: "hollow sphere", I: "\\tfrac23MR^2" } };

  article("11-1", T`
<p>A rolling wheel combines two motions: its center moves in a straight line, and the wheel spins about its center. If it rolls <b>without slipping</b>, the contact point is momentarily at rest, which links the two:</p>
<div class="eq">$v_{cm} = R\omega \qquad a_{cm} = R\alpha \qquad \Delta x_{cm} = R\Delta\theta$</div>
<p>(The last one is on your equation sheet.) The top of the wheel moves at $2v_{cm}$; the bottom at zero.</p>
<h2>Kinetic energy of rolling</h2>
<div class="eq">$K = \tfrac12Mv_{cm}^2 + \tfrac12I_{cm}\omega^2 = \tfrac12Mv_{cm}^2\left(1 + \dfrac{I_{cm}}{MR^2}\right)$</div>
<h2>Rolling down an incline</h2>
<p>Energy conservation from height $h$ (static friction does no work when there's no slipping):</p>
<div class="eq">$v = \sqrt{\dfrac{2gh}{1 + I_{cm}/MR^2}} \qquad a = \dfrac{g\sin\theta}{1 + I_{cm}/MR^2}$</div>
<p>Only the shape factor $\beta = I_{cm}/MR^2$ matters — not mass or radius. Solid sphere ($\beta = 0.4$) beats solid cylinder ($0.5$) beats hollow sphere ($0.67$) beats hoop ($1$).</p>
<div class="callout key"><b class="t">Friction's role</b>Static friction at the contact point provides the torque that spins the object up. It points up the slope, does no work, and is at most $\mu_sF_N$ — if the slope is too steep the object slips.</div>
<div class="worked"><div class="wt">Yo-yo</div>A yo-yo unwinding from a string is "rolling" down the string: $a = \dfrac{g}{1 + I_{cm}/MR_0^2}$ with $R_0$ the axle radius — much smaller than $g$.</div>`);

  article("11-2", T`
<p>Torque in Chapter 10 was a number about a fixed axis. In general it's a vector defined about a <b>point</b>:</p>
<div class="eq">$\vec\tau = \vec r\times\vec F$</div>
<h2>Angular momentum of a particle</h2>
<div class="eq">$\vec L = \vec r\times\vec p = m(\vec r\times\vec v) \qquad |\vec L| = mvr_\perp$</div>
<p>$r_\perp$ is the perpendicular distance from the reference point to the particle's line of motion. Surprise: a particle moving in a <i>straight line</i> has constant, nonzero angular momentum about any point not on that line.</p>
<h2>Newton's second law, angular form</h2>
<div class="eq">$\vec\tau_{net} = \dfrac{d\vec L}{dt} \qquad \Delta L = \int\tau\,dt$</div>
<p>The second equation (on your sheet) is the <b>angular impulse</b> — the rotational twin of $J = \int F\,dt$.</p>
<div class="worked"><div class="wt">Worked example</div>A 2.0 kg puck slides at 3.0 m/s along the line $y = 4.0\ \text{m}$. About the origin: $L = mvr_\perp = (2.0)(3.0)(4.0) = 24\ \text{kg·m}^2/\text{s}$, directed along $-z$ (clockwise as seen from $+z$) if it moves in $+x$.</div>
<div class="callout key"><b class="t">Rigid body</b>For a body rotating about a fixed axis, $L = I\omega$ (also on your sheet).</div>`);

  article("11-3", T`
<p>If the net external torque on a system is zero, its angular momentum is constant:</p>
<div class="eq">$L_i = L_f \quad\Longleftrightarrow\quad I_i\omega_i = I_f\omega_f$</div>
<p>This is the rotational version of momentum conservation and it explains a lot: a skater pulling in her arms spins faster, a diver tucks to flip, a collapsing star becomes a fast-spinning pulsar.</p>
<h2>Rotational "collisions"</h2>
<ul><li><b>Disk dropped onto a spinning disk:</b> $I_1\omega_1 = (I_1 + I_2)\omega_f$.</li><li><b>Clay hits a pivoted rod and sticks:</b> before, the clay's $L = mvr_\perp$; after, $(I_{rod} + mr^2)\omega$.</li><li><b>Person walks on a turntable:</b> person + turntable $L$ is constant.</li></ul>
<div class="callout warn"><b class="t">Energy isn't conserved</b>These are like inelastic collisions — kinetic energy changes. For the skater, $K_f/K_i = I_i/I_f > 1$: she does work with her arms. For sticking collisions, $K$ is lost.</div>
<div class="worked"><div class="wt">Worked example</div>A 0.050 kg wad of clay at 8.0 m/s hits the end of a 1.2 m, 0.60 kg rod pivoted at its center and sticks.<br>$L = (0.050)(8.0)(0.60) = 0.24\ \text{kg·m}^2/\text{s}$; $I = \frac1{12}(0.60)(1.2)^2 + 0.050(0.60)^2 = 0.090\ \text{kg·m}^2$; $\omega = 2.7\ \text{rad/s}$.</div>
<div class="callout key"><b class="t">Which point?</b>Take angular momentum about the pivot — the pivot's force then exerts no torque, so $L$ about it is conserved even though linear momentum isn't.</div>`);

  // ---------- 11-1 ----------
  problem("11-1", "speed", {
    title: "Speed at the bottom of an incline (rolling)", level: 2,
    gen(r) {
      const k = r.pick(Object.keys(SH)), h = r.num(0.3, 5, 0.1), th = r.pick([15, 20, 30, 37]), S = SH[k];
      const v = Math.sqrt((2 * g * h) / (1 + S.b));
      return { q: T`<p>A ${S.n} ($I = ${S.I}$) rolls without slipping from rest down a ramp, dropping a height of $${h}\ \text{m}$. What is the speed of its center at the bottom?</p>`,
        answer: v, unit: "m/s",
        hints: [T`$Mgh = \tfrac12Mv^2 + \tfrac12I\omega^2$ with $\omega = v/R$.`, T`$Mgh = \tfrac12Mv^2(1 + ${sig(S.b, 3)})$`],
        solution: [T`$v = \sqrt{\frac{2gh}{1 + I/MR^2}} = \sqrt{\frac{2(9.8)(${h})}{${sig(1 + S.b, 3)}}} = ${sig(v)}\ \text{m/s}$`, T`(A frictionless sliding block would reach $\sqrt{2gh} = ${sig(Math.sqrt(2 * g * h))}$ m/s.)`],
        model: { type: "rolling", h, theta: th, shapes: [k, ...["sphere", "disk", "hoop"].filter((x) => x !== k)].slice(0, 3), highlight: k } };
    },
  });
  problem("11-1", "accel", {
    title: "Acceleration of a rolling object", level: 2,
    gen(r) {
      const k = r.pick(Object.keys(SH)), th = r.pick([10, 15, 20, 25, 30, 37]), S = SH[k];
      const a = (g * Math.sin(rad(th))) / (1 + S.b);
      return { q: T`<p>A ${S.n} rolls without slipping down a $${th}^\circ$ incline. What is the acceleration of its center of mass?</p>`,
        answer: a, unit: "m/s²",
        hints: [T`Newton: $Mg\sin\theta - f = Ma$ and $fR = I\alpha = I a/R$.`, T`$a = \frac{g\sin\theta}{1 + I/MR^2}$`],
        solution: [T`$a = \frac{9.8\sin${th}^\circ}{1 + ${sig(S.b, 3)}} = ${sig(a)}\ \text{m/s}^2$`],
        model: { type: "rolling", h: 1, theta: th, shapes: [k, "slide"], highlight: k } };
    },
  });
  problem("11-1", "race", {
    title: "Which wins the rolling race?", level: 1,
    gen(r) {
      const Q = r.pick([
        { q: "A solid sphere, a solid cylinder, and a hoop are released together from the top of a ramp and roll without slipping. Which reaches the bottom first?", right: "The solid sphere", wrong: ["The hoop", "The solid cylinder", "They tie"], shapes: ["sphere", "disk", "hoop"] },
        { q: "A heavy solid cylinder and a light solid cylinder of the same radius race down a ramp, rolling without slipping. Which wins?", right: "They tie", wrong: ["The heavy one", "The light one", "It depends on the ramp angle"], shapes: ["disk", "disk"] },
        { q: "For a rolling hoop, what fraction of its kinetic energy is rotational?", right: "1/2", wrong: ["1/3", "2/7", "0"], shapes: ["hoop", "sphere"] },
      ]);
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0, hints: [T`$a = g\sin\theta/(1 + I/MR^2)$ depends only on the shape factor.`], solution: [Q.right + " — smaller I/MR² means less energy tied up in spinning."], model: { type: "rolling", h: 1.5, theta: 25, shapes: Q.shapes, highlight: Q.shapes[0] } };
    },
  });
  problem("11-1", "fraction", {
    title: "Rotational share of kinetic energy", level: 2,
    gen(r) {
      const k = r.pick(Object.keys(SH)), S = SH[k], m = r.num(0.5, 5, 0.5), v = r.num(1, 6, 0.5);
      const Kt = 0.5 * m * v * v, Kr = S.b * Kt, wantTotal = r.bool();
      return { q: T`<p>A $${m}\ \text{kg}$ ${S.n} rolls without slipping at $${v}\ \text{m/s}$. What is its ${wantTotal ? "total kinetic energy" : "rotational kinetic energy"}?</p>`,
        answer: wantTotal ? Kt + Kr : Kr, unit: "J",
        hints: [T`$K_{rot} = \tfrac12I\omega^2 = \tfrac12(${S.I})(v/R)^2 = ${sig(S.b, 3)}\cdot\tfrac12Mv^2$`],
        solution: [T`$K_{trans} = ${sig(Kt)}\ \text{J}$`, T`$K_{rot} = ${sig(S.b, 3)}\times${sig(Kt)} = ${sig(Kr)}\ \text{J}$`, T`Total $= ${sig(Kt + Kr)}\ \text{J}$`],
        model: { type: "rolling", h: (v * v * (1 + S.b)) / (2 * g), theta: 20, shapes: [k], highlight: k, M: m } };
    },
  });
  // ---------- 11-2 ----------
  problem("11-2", "particleL", {
    title: "Angular momentum of a particle in a straight line", level: 2,
    gen(r) {
      const m = r.num(0.5, 5, 0.5), v = r.num(1, 8, 0.5), d = r.num(0.5, 6, 0.5), x = r.num(-4, 4, 1);
      const L = m * v * d;
      return { q: T`<p>A $${m}\ \text{kg}$ particle moves in the $+x$ direction at $${v}\ \text{m/s}$ along the line $y = ${d}\ \text{m}$. What is the magnitude of its angular momentum about the origin when it is at $x = ${x}\ \text{m}$?</p>`,
        answer: L, unit: "kg·m²/s",
        hints: [T`$L = mvr_\perp$ where $r_\perp$ is the perpendicular distance from the origin to the line of motion.`, "It doesn't depend on x!"],
        solution: [T`$r_\perp = ${d}\ \text{m}$`, T`$L = (${m})(${v})(${d}) = ${sig(L)}\ \text{kg·m}^2/\text{s}$ (direction $-\hat k$)`],
        model: { type: "vectors", vecs: [{ x, y: d, label: "r" }, { x: m * v, y: 0, label: "p" }], product: "cross", title: "L = r × p: the parallelogram area is |L|" } };
    },
  });
  problem("11-2", "disk", {
    title: "Angular momentum of a spinning body", level: 1,
    gen(r) {
      const k = r.pick(["disk", "sphere", "hoop"]), M = r.num(0.5, 20, 0.5), R = r.num(0.1, 1, 0.05), rpm = r.int(20, 1200);
      const I = SH[k].b * M * R * R, w = (rpm * 2 * Math.PI) / 60, L = I * w;
      return { q: T`<p>A ${SH[k].n} (mass $${M}\ \text{kg}$, radius $${R}\ \text{m}$, $I = ${SH[k].I}$) spins about its central axis at $${rpm}\ \text{rpm}$. What is the magnitude of its angular momentum?</p>`,
        answer: L, unit: "kg·m²/s",
        hints: [T`$L = I\omega$ with ω in rad/s.`],
        solution: [T`$I = ${sig(I)}\ \text{kg·m}^2$, $\omega = ${sig(w)}\ \text{rad/s}$`, T`$L = ${sig(L)}\ \text{kg·m}^2/\text{s}$`],
        model: { type: "rotation", w0: Math.min(w, 15), alpha: 0, I, tmax: 4, notes: [`L = Iω = ${sig(L)} kg·m²/s`] } };
    },
  });
  problem("11-2", "dLdt", {
    title: "Torque as dL/dt", level: 2,
    gen(r) {
      const A = r.num(0.5, 4, 0.5), B = r.num(0.5, 3, 0.5), t1 = r.num(0.5, 4, 0.5), I = r.num(0.5, 3, 0.5);
      const tau = 2 * A * t1 + B;
      return { q: T`<p>The angular momentum of a flywheel ($I = ${I}\ \text{kg·m}^2$) about its axle is $L(t) = ${A}t^2 + ${B}t$ (kg·m²/s). What net torque acts on it at $t = ${t1}\ \text{s}$?</p>`,
        answer: tau, unit: "N·m",
        hints: [T`$\tau_{net} = dL/dt$`],
        solution: [T`$\tau = ${2 * A}t + ${B}$`, T`$\tau(${t1}) = ${sig(tau)}\ \text{N·m}$`],
        model: { type: "rotation", thf: (t) => (A * t ** 3 / 3 + (B * t * t) / 2) / I, wf: (t) => (A * t * t + B * t) / I, alf: (t) => (2 * A * t + B) / I, I, tmax: t1 + 0.5 } };
    },
  });
  // ---------- 11-3 ----------
  problem("11-3", "skater", {
    title: "Skater pulls in her arms", level: 1,
    gen(r) {
      const I1 = r.num(2, 6, 0.1), I2 = r.num(0.8, I1 - 0.5, 0.1), w1 = r.num(1, 6, 0.5), wantK = r.bool();
      const w2 = (I1 * w1) / I2;
      return { q: T`<p>A figure skater spins at $${w1}\ \text{rad/s}$ with her arms out ($I = ${I1}\ \text{kg·m}^2$). She pulls her arms in, reducing her rotational inertia to $${I2}\ \text{kg·m}^2$. ${wantK ? "By what factor does her kinetic energy increase ($K_f/K_i$)?" : "What is her new angular speed?"}</p>`,
        answer: wantK ? I1 / I2 : w2, unit: wantK ? "" : "rad/s",
        hints: ["No external torque about her spin axis (ice is nearly frictionless).", T`$I_1\omega_1 = I_2\omega_2$`],
        solution: [T`$\omega_2 = \frac{I_1}{I_2}\omega_1 = ${sig(w2)}\ \text{rad/s}$`, T`$\frac{K_f}{K_i} = \frac{\frac12I_2\omega_2^2}{\frac12I_1\omega_1^2} = \frac{I_1}{I_2} = ${sig(I1 / I2)}$ — her muscles did work.`],
        model: { type: "angmom", mode: "skater", I1, w1, I2 } };
    },
  });
  problem("11-3", "drop", {
    title: "Disk dropped onto a spinning disk", level: 2,
    gen(r) {
      const M1 = r.num(1, 6, 0.5), M2 = r.num(0.5, 6, 0.5), R1 = r.num(0.1, 0.5, 0.05), R2 = r.num(0.1, 0.5, 0.05), w1 = r.int(5, 40), wantLost = r.bool();
      const I1 = 0.5 * M1 * R1 * R1, I2 = 0.5 * M2 * R2 * R2, w = (I1 * w1) / (I1 + I2), lost = 0.5 * I1 * w1 * w1 - 0.5 * (I1 + I2) * w * w;
      return { q: T`<p>A uniform disk ($${M1}\ \text{kg}$, radius $${R1}\ \text{m}$) spins at $${w1}\ \text{rad/s}$ on a frictionless axle. A second uniform disk ($${M2}\ \text{kg}$, radius $${R2}\ \text{m}$), initially not spinning, is dropped onto it, centered on the same axle, and they stick. ${wantLost ? "How much kinetic energy is lost?" : "What is their final angular speed?"}</p>`,
        answer: wantLost ? lost : w, unit: wantLost ? "J" : "rad/s",
        hints: [T`$I = \tfrac12MR^2$ for each disk.`, T`$I_1\omega_1 = (I_1 + I_2)\omega_f$`],
        solution: [T`$I_1 = ${sig(I1)}$, $I_2 = ${sig(I2)}\ \text{kg·m}^2$`, T`$\omega_f = ${sig(w)}\ \text{rad/s}$`, T`$\Delta K = ${sig(-lost)}\ \text{J}$ (lost to friction between the disks)`],
        model: { type: "angmom", mode: "drop", I1, w1: Math.min(w1, 15), I2 } };
    },
  });
  problem("11-3", "clay", {
    title: "Clay strikes a pivoted rod", level: 3,
    gen(r) {
      const m = r.num(0.02, 0.3, 0.01), v = r.num(2, 15, 0.5), Mr = r.num(0.2, 2, 0.1), L = r.num(0.4, 2, 0.1), pivot = r.pick(["center", "end"]);
      const d = pivot === "center" ? L / 2 : L, Irod = pivot === "center" ? (Mr * L * L) / 12 : (Mr * L * L) / 3, w = (m * v * d) / (Irod + m * d * d);
      return { q: T`<p>A uniform rod ($${Mr}\ \text{kg}$, $${L}\ \text{m}$) lies on a frictionless table, pivoted at ${pivot === "center" ? "its center" : "one end"}. A $${m}\ \text{kg}$ lump of clay moving at $${v}\ \text{m/s}$ perpendicular to the rod hits the ${pivot === "center" ? "end of the rod" : "free end"} and sticks. What is the angular speed of the rod afterward?</p>`,
        answer: w, unit: "rad/s",
        hints: ["Conserve angular momentum about the pivot (the pivot force exerts no torque there).", T`Before: $L = mvd$. After: $(I_{rod} + md^2)\omega$ with $I_{rod} = ${pivot === "center" ? "\\frac1{12}" : "\\frac13"}ML^2$.`],
        solution: [T`$L = (${m})(${v})(${sig(d)}) = ${sig(m * v * d)}\ \text{kg·m}^2/\text{s}$`, T`$I_f = ${sig(Irod)} + ${m}(${sig(d)})^2 = ${sig(Irod + m * d * d)}\ \text{kg·m}^2$`, T`$\omega = ${sig(w)}\ \text{rad/s}$`],
        model: { type: "angmom", mode: "clay", m, v, d, Mr, L, pivot } };
    },
  });
})();
