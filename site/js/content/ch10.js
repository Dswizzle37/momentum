/* Chapter 10 — Rotation */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180;

  article("10-1", T`
<p>A rigid body rotating about a fixed axis needs only one coordinate: the <b>angular position</b> $\theta$ of a reference line, measured in <b>radians</b> (counterclockwise positive).</p>
<div class="eq">$\theta = \dfrac sr \qquad 1\ \text{rev} = 360^\circ = 2\pi\ \text{rad}$</div>
<h2>Angular velocity and acceleration</h2>
<div class="eq">$\omega = \dfrac{d\theta}{dt} \qquad \alpha = \dfrac{d\omega}{dt}$</div>
<p>Units: rad/s and rad/s². These are exactly parallel to $v = dx/dt$ and $a = dv/dt$. Every point of the rigid body shares the same $\theta$, $\omega$, and $\alpha$.</p>
<div class="worked"><div class="wt">Worked example</div>A hard drive spins at 7200 rpm. $\omega = 7200\times\frac{2\pi}{60} = 754\ \text{rad/s}$.</div>
<div class="worked"><div class="wt">Worked example — calculus</div>$\theta(t) = 2t^3 - 4t$ (rad). Then $\omega = 6t^2 - 4$ and $\alpha = 12t$. At $t = 1\ \text{s}$, $\omega = 2\ \text{rad/s}$, $\alpha = 12\ \text{rad/s}^2$.</div>
<div class="callout key"><b class="t">Direction</b>Angular velocity is a vector along the axis, given by the right-hand rule: curl your fingers with the rotation, thumb points along $\vec\omega$.</div>
<div class="callout warn"><b class="t">Radians!</b>Formulas like $v = r\omega$ and $s = r\theta$ only work with radians. Convert rpm and degrees first.</div>`);

  article("10-2", T`
<p>When $\alpha$ is constant, the rotational kinematic equations mirror the linear ones exactly ($x\to\theta$, $v\to\omega$, $a\to\alpha$):</p>
<div class="eq">$\omega = \omega_0 + \alpha t \qquad \theta = \theta_0 + \omega_0t + \tfrac12\alpha t^2 \qquad \omega^2 = \omega_0^2 + 2\alpha(\theta - \theta_0)$</div>
<h2>Linking linear and angular</h2>
<p>A point at distance $r$ from the axis has</p>
<div class="eq">$s = r\theta \qquad v = r\omega \qquad a_T = r\alpha \qquad a_c = \dfrac{v^2}{r} = r\omega^2$</div>
<p>$a_T$ (tangential) changes the point's speed; $a_c$ (radial, toward the axis) changes its direction. The total is $a = \sqrt{a_T^2 + a_c^2}$.</p>
<div class="worked"><div class="wt">Worked example</div>A wheel starts from rest with $\alpha = 3.0\ \text{rad/s}^2$. After 4.0 s: $\omega = 12\ \text{rad/s}$, $\theta = 24\ \text{rad} = 3.8\ \text{rev}$. A point at $r = 0.30\ \text{m}$ has $a_T = 0.90$, $a_c = 43\ \text{m/s}^2$.</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>All three constant-α equations, plus $v = r\omega$, $a_T = r\alpha$ and $a_c = r\omega^2$.</div>`);

  article("10-3", T`
<p>A spinning object has kinetic energy even though its center may not move. Add up $\tfrac12mv^2$ for every piece, with $v_i = r_i\omega$:</p>
<div class="eq">$K_{rot} = \tfrac12I\omega^2 \qquad I = \sum m_ir_i^2$</div>
<p>$I$ is the <b>rotational inertia</b> (moment of inertia), in kg·m². It depends on the mass <i>and how far it is from the axis</i> — so the same object has different $I$ about different axes.</p>
<h2>Continuous bodies</h2>
<div class="eq">$I = \int r^2\,dm$</div>
<p>For a uniform rod about its center, $dm = (M/L)dx$: $I = \int_{-L/2}^{L/2}x^2\frac ML dx = \frac1{12}ML^2$. Other common results (from your textbook's table): hoop $MR^2$, solid disk $\frac12MR^2$, solid sphere $\frac25MR^2$, thin spherical shell $\frac23MR^2$.</p>
<h2>Parallel-axis theorem</h2>
<div class="eq">$I' = I_{cm} + Md^2$</div>
<p>For an axis parallel to one through the CM, at distance $d$. Example: rod about its end, $\frac1{12}ML^2 + M(\frac L2)^2 = \frac13ML^2$.</p>
<div class="callout warn"><b class="t">Smallest at the CM</b>The parallel-axis theorem only adds — $I$ is always smallest about an axis through the center of mass.</div>`);

  article("10-4", T`
<p>A force's ability to rotate an object is its <b>torque</b>:</p>
<div class="eq">$\vec\tau = \vec r\times\vec F \qquad \tau = rF\sin\phi = r_\perp F = rF_\perp$</div>
<p>$\vec r$ runs from the axis to where the force is applied, and $\phi$ is the angle between $\vec r$ and $\vec F$. Push far from the hinge, perpendicular to the door, for maximum torque.</p>
<h2>Newton's second law for rotation</h2>
<div class="eq">$\alpha_{sys} = \dfrac{\sum\tau}{I_{sys}} = \dfrac{\tau_{net}}{I_{sys}}$</div>
<h2>Pulley problems</h2>
<p>A mass $m$ hangs from a string wrapped around a pulley ($I$, radius $R$). Write one equation per object and the constraint:</p>
<ul><li>Mass: $mg - T = ma$</li><li>Pulley: $TR = I\alpha$</li><li>No slipping: $a = R\alpha$</li></ul>
<p>Combining: $a = \dfrac{mg}{m + I/R^2}$. A massive pulley makes the acceleration smaller and makes the tensions on its two sides different.</p>
<div class="worked"><div class="wt">Worked example — falling rod</div>A uniform rod pivoted at one end is released from horizontal. Gravity acts at the center: $\tau = Mg\frac L2$. With $I = \frac13ML^2$: $\alpha = \frac{3g}{2L}$, and the free end initially accelerates at $\frac32g$ — faster than free fall!</div>`);

  article("10-5", T`
<p>Torques do work when they rotate something, just as forces do work when they move something:</p>
<div class="eq">$W = \int\tau\,d\theta \quad\xrightarrow{\text{constant }\tau}\quad W = \tau\Delta\theta$</div>
<p>The rotational work–kinetic energy theorem:</p>
<div class="eq">$W_{net} = \Delta K_{rot} = \tfrac12I\omega_f^2 - \tfrac12I\omega_i^2$</div>
<p>And power: $P = \dfrac{dW}{dt} = \tau\omega$.</p>
<h2>Energy conservation with rotation</h2>
<p>Gravitational potential energy of an extended object uses the height of its CM. For a rod pivoted at one end swinging down from horizontal: $Mg\frac L2 = \frac12\left(\frac13ML^2\right)\omega^2 \Rightarrow \omega = \sqrt{3g/L}$.</p>
<div class="worked"><div class="wt">Worked example</div>A motor applies 12 N·m to a flywheel with $I = 0.80\ \text{kg·m}^2$, starting from rest, for 5.0 revolutions. $W = 12(5.0\times2\pi) = 377\ \text{J} = \tfrac12(0.80)\omega^2 \Rightarrow \omega = 31\ \text{rad/s}$.</div>
<div class="callout key"><b class="t">Linear ↔ rotational</b>$x\leftrightarrow\theta$, $v\leftrightarrow\omega$, $a\leftrightarrow\alpha$, $m\leftrightarrow I$, $F\leftrightarrow\tau$, $\frac12mv^2\leftrightarrow\frac12I\omega^2$, $Fv\leftrightarrow\tau\omega$.</div>`);

  // ---------- 10-1 ----------
  problem("10-1", "rpm", {
    title: "rpm to rad/s and angle turned", level: 1,
    gen(r) {
      const rpm = r.int(30, 3600), t = r.num(0.5, 10, 0.5), wantAng = r.bool();
      const w = (rpm * 2 * Math.PI) / 60, th = w * t;
      return { q: T`<p>A fan blade turns at a steady $${rpm}\ \text{rpm}$. ${wantAng ? `Through what angle (in radians) does it turn in $${t}\\ \\text{s}$?` : "What is its angular speed in rad/s?"}</p>`,
        answer: wantAng ? th : w, unit: wantAng ? "rad" : "rad/s",
        hints: [T`$1\ \text{rev/min} = \frac{2\pi\ \text{rad}}{60\ \text{s}}$`],
        solution: [T`$\omega = ${rpm}\times\frac{2\pi}{60} = ${sig(w)}\ \text{rad/s}$`, T`$\theta = \omega t = ${sig(th)}\ \text{rad}$ (${sig(th / (2 * Math.PI))} rev)`],
        model: { type: "rotation", w0: w > 40 ? 40 : w, alpha: 0, tmax: 4, notes: w > 40 ? ["(animation slowed down)"] : [] } };
    },
  });
  problem("10-1", "calc", {
    title: "ω and α from θ(t)", level: 2,
    gen(r) {
      const a = r.num(0.5, 3, 0.5), b = r.int(1, 8), t1 = r.num(0.5, 3, 0.5), wantA = r.bool();
      const thf = (t) => a * t ** 3 - b * t, wf = (t) => 3 * a * t * t - b, alf = (t) => 6 * a * t;
      return { q: T`<p>The angular position of a spinning top is $\theta(t) = ${a}t^3 - ${b}t$ (rad, $t$ in s). What is its angular ${wantA ? "acceleration" : "velocity"} at $t = ${t1}\ \text{s}$?</p>`,
        answer: wantA ? alf(t1) : wf(t1), unit: wantA ? "rad/s²" : "rad/s", absTol: 0.05,
        hints: [T`$\omega = d\theta/dt$, $\alpha = d\omega/dt$`],
        solution: [T`$\omega = ${3 * a}t^2 - ${b}$`, T`$\alpha = ${6 * a}t$`, T`At $t = ${t1}$: $\omega = ${sig(wf(t1))}\ \text{rad/s}$, $\alpha = ${sig(alf(t1))}\ \text{rad/s}^2$`],
        model: { type: "rotation", thf, wf, alf, tmax: t1 + 0.5 } };
    },
  });
  // ---------- 10-2 ----------
  problem("10-2", "spinup", {
    title: "Revolutions while spinning up", level: 1,
    gen(r) {
      const w = r.int(10, 120), t = r.num(1, 12, 0.5), want = r.pick(["rev", "alpha"]);
      const al = w / t, th = 0.5 * w * t, rev = th / (2 * Math.PI);
      return { q: T`<p>A centrifuge accelerates uniformly from rest to $${w}\ \text{rad/s}$ in $${t}\ \text{s}$. ${want === "rev" ? "How many revolutions does it make during this time?" : "What is its angular acceleration?"}</p>`,
        answer: want === "rev" ? rev : al, unit: want === "rev" ? "rev" : "rad/s²",
        hints: [T`$\alpha = \Delta\omega/\Delta t$`, T`$\theta = \tfrac12(\omega_0 + \omega)t$, then divide by $2\pi$.`],
        solution: [T`$\alpha = ${w}/${t} = ${sig(al)}\ \text{rad/s}^2$`, T`$\theta = \tfrac12(0 + ${w})(${t}) = ${sig(th)}\ \text{rad} = ${sig(rev)}\ \text{rev}$`],
        model: { type: "rotation", w0: 0, alpha: Math.min(al, 10), tmax: Math.min(t, 6), notes: al > 10 ? ["(animation slowed down)"] : [] } };
    },
  });
  problem("10-2", "brake", {
    title: "Braking a spinning wheel", level: 2,
    gen(r) {
      const w0 = r.int(5, 40), al = r.num(0.5, 6, 0.5), want = r.bool();
      const t = w0 / al, th = (w0 * w0) / (2 * al);
      return { q: T`<p>A bicycle wheel spinning at $${w0}\ \text{rad/s}$ is braked with a constant angular deceleration of $${al}\ \text{rad/s}^2$. ${want ? "Through how many radians does it turn before stopping?" : "How long does it take to stop?"}</p>`,
        answer: want ? th : t, unit: want ? "rad" : "s",
        hints: [want ? T`$0 = \omega_0^2 - 2\alpha\theta$` : T`$0 = \omega_0 - \alpha t$`],
        solution: [T`$t = ${w0}/${al} = ${sig(t)}\ \text{s}$`, T`$\theta = \frac{\omega_0^2}{2\alpha} = ${sig(th)}\ \text{rad}$`],
        model: { type: "rotation", w0: Math.min(w0, 20), alpha: -al * Math.min(1, 20 / w0), tmax: Math.min(w0, 20) / (al * Math.min(1, 20 / w0)) } };
    },
  });
  problem("10-2", "pointaccel", {
    title: "Tangential and centripetal acceleration of a point", level: 2,
    gen(r) {
      const al = r.num(0.5, 5, 0.5), t = r.num(1, 4, 0.5), R = r.num(0.1, 0.8, 0.05), want = r.pick(["at", "ac", "a"]);
      const w = al * t, at = R * al, ac = R * w * w, a = Math.hypot(at, ac);
      return { q: T`<p>A disk starts from rest and turns with constant $\alpha = ${al}\ \text{rad/s}^2$. For a point $${R}\ \text{m}$ from the axis, what is the ${want === "at" ? "tangential acceleration" : want === "ac" ? "centripetal (radial) acceleration" : "magnitude of the total acceleration"} at $t = ${t}\ \text{s}$?</p>`,
        answer: { at, ac, a }[want], unit: "m/s²",
        hints: [T`$\omega = \alpha t = ${sig(w)}\ \text{rad/s}$`, T`$a_T = r\alpha$, $a_c = r\omega^2$, $a = \sqrt{a_T^2 + a_c^2}$`],
        solution: [T`$a_T = ${R}(${al}) = ${sig(at)}\ \text{m/s}^2$`, T`$a_c = ${R}(${sig(w)})^2 = ${sig(ac)}\ \text{m/s}^2$`, T`$a = ${sig(a)}\ \text{m/s}^2$`],
        model: { type: "rotation", w0: 0, alpha: al, r: R, R: Math.max(R, 0.5), tmax: t } };
    },
  });
  // ---------- 10-3 ----------
  problem("10-3", "particles", {
    title: "Rotational inertia of point masses", level: 1,
    gen(r) {
      const m1 = r.num(0.5, 4, 0.5), m2 = r.num(0.5, 4, 0.5), L = r.num(0.4, 2, 0.1), axis = r.pick(["center", "end"]);
      const I = axis === "center" ? (m1 + m2) * (L / 2) ** 2 : m2 * L * L;
      return { q: T`<p>Two small balls, $${m1}\ \text{kg}$ and $${m2}\ \text{kg}$, are fixed to the ends of a massless rod $${L}\ \text{m}$ long. What is the rotational inertia about an axis perpendicular to the rod through ${axis === "center" ? "its midpoint" : `the $${m1}\\ \\text{kg}$ ball`}?</p>`,
        answer: I, unit: "kg·m²",
        hints: [T`$I = \sum m_ir_i^2$ where $r_i$ is each mass's distance from the axis.`],
        solution: axis === "center" ? [T`Both at $r = ${L / 2}\ \text{m}$: $I = (${m1} + ${m2})(${L / 2})^2 = ${sig(I)}\ \text{kg·m}^2$`] : [T`The ball on the axis contributes 0; $I = ${m2}(${L})^2 = ${sig(I)}\ \text{kg·m}^2$`],
        model: { type: "rotation", w0: 2, alpha: 0, I, tmax: 4, notes: [`I = Σmr² = ${sig(I)} kg·m²`] } };
    },
  });
  problem("10-3", "parallel", {
    title: "Parallel-axis theorem", level: 2,
    gen(r) {
      const M = r.num(0.5, 6, 0.5), L = r.num(0.5, 3, 0.1), shape = r.pick(["rod", "disk"]), R = r.num(0.1, 0.6, 0.05);
      const d = shape === "rod" ? +(L * r.pick([0.25, 0.5, 0.3])).toFixed(3) : R;
      const Icm = shape === "rod" ? (M * L * L) / 12 : 0.5 * M * R * R, I = Icm + M * d * d;
      return { q: shape === "rod" ? T`<p>A uniform rod (mass $${M}\ \text{kg}$, length $${L}\ \text{m}$) rotates about a perpendicular axis $${d}\ \text{m}$ from its center. What is its rotational inertia? ($I_{cm} = \frac1{12}ML^2$)</p>` : T`<p>A uniform disk (mass $${M}\ \text{kg}$, radius $${R}\ \text{m}$) rotates about an axis perpendicular to its face through a point on its rim. What is its rotational inertia? ($I_{cm} = \frac12MR^2$)</p>`,
        answer: I, unit: "kg·m²",
        hints: [T`$I' = I_{cm} + Md^2$`],
        solution: [T`$I_{cm} = ${sig(Icm)}\ \text{kg·m}^2$`, T`$Md^2 = ${M}(${d})^2 = ${sig(M * d * d)}$`, T`$I' = ${sig(I)}\ \text{kg·m}^2$`],
        model: { type: "rotation", w0: 2, alpha: 0, I, tmax: 4, notes: [`I_cm = ${sig(Icm)}, Md² = ${sig(M * d * d)}`] } };
    },
  });
  problem("10-3", "flywheel", {
    title: "Rotational kinetic energy", level: 1,
    gen(r) {
      const M = r.int(5, 200), R = r.num(0.1, 1, 0.05), rpm = r.int(60, 3000);
      const I = 0.5 * M * R * R, w = (rpm * 2 * Math.PI) / 60, K = 0.5 * I * w * w;
      return { q: T`<p>A solid-disk flywheel ($${M}\ \text{kg}$, radius $${R}\ \text{m}$) spins at $${rpm}\ \text{rpm}$. How much kinetic energy does it store?</p>`,
        answer: K, unit: "J",
        hints: [T`$I = \tfrac12MR^2$ and convert rpm to rad/s.`, T`$K = \tfrac12I\omega^2$`],
        solution: [T`$I = \tfrac12(${M})(${R})^2 = ${sig(I)}\ \text{kg·m}^2$`, T`$\omega = ${sig(w)}\ \text{rad/s}$`, T`$K = \tfrac12I\omega^2 = ${sig(K)}\ \text{J}$`],
        model: { type: "rotation", w0: Math.min(w, 15), alpha: 0, I, tmax: 4, notes: [`K at the real speed = ${sig(K)} J`] } };
    },
  });
  problem("10-3", "integralI", {
    title: "Rotational inertia by integration", level: 3,
    gen(r) {
      const c = r.num(0.5, 4, 0.5), L = r.num(0.5, 2, 0.5);
      const I = (c * L ** 4) / 4;
      return { q: T`<p>A rod of length $${L}\ \text{m}$ pivots about its end at $x = 0$. Its linear density is $\lambda = ${c}x$ (kg/m). What is its rotational inertia about the pivot?</p>`,
        answer: I, unit: "kg·m²",
        hints: [T`$I = \int r^2\,dm = \int_0^L x^2\lambda(x)\,dx$`],
        solution: [T`$I = \int_0^{${L}}x^2(${c}x)dx = \frac{${c}}{4}(${L})^4 = ${sig(I)}\ \text{kg·m}^2$`],
        model: { type: "com", rod: { L, lam: (x) => c * x, lamText: `${c}x kg/m` } } };
    },
  });
  // ---------- 10-4 ----------
  problem("10-4", "wrench", {
    title: "Torque from a force at an angle", level: 1,
    gen(r) {
      const F = r.int(10, 200), rr = r.num(0.1, 0.8, 0.05), phi = r.pick([30, 37, 45, 53, 60, 90, 120, 150]);
      const tau = rr * F * Math.sin(rad(phi));
      return { q: T`<p>A mechanic pushes on a wrench $${rr}\ \text{m}$ from the bolt with a $${F}\ \text{N}$ force at $${phi}^\circ$ to the wrench handle. What is the magnitude of the torque on the bolt?</p>`,
        answer: tau, unit: "N·m",
        hints: [T`$\tau = rF\sin\phi$`],
        solution: [T`$\tau = (${rr})(${F})\sin${phi}^\circ = ${sig(tau)}\ \text{N·m}$`],
        model: { type: "torque", mode: "wrench", F, r: rr, phi } };
    },
  });
  problem("10-4", "pulley", {
    title: "Mass hanging from a massive pulley", level: 3,
    gen(r) {
      const M = r.num(0.5, 8, 0.5), R = r.num(0.05, 0.4, 0.05), m = r.num(0.2, 4, 0.2), want = r.pick(["a", "T", "alpha"]);
      const I = 0.5 * M * R * R, a = (m * g) / (m + I / (R * R)), Tn = m * (g - a);
      return { q: T`<p>A string is wrapped around a solid-disk pulley (mass $${M}\ \text{kg}$, radius $${R}\ \text{m}$) that turns on a frictionless axle. A $${m}\ \text{kg}$ block hangs from the string and is released. What is ${want === "a" ? "the block's acceleration" : want === "T" ? "the tension in the string" : "the pulley's angular acceleration"}?</p>`,
        answer: { a, T: Tn, alpha: a / R }[want], unit: want === "a" ? "m/s²" : want === "T" ? "N" : "rad/s²",
        hints: [T`Block: $mg - T = ma$. Pulley: $TR = I\alpha$ with $I = \tfrac12MR^2$. Link: $a = R\alpha$.`, T`$a = \frac{mg}{m + M/2}$`],
        solution: [T`$a = \frac{mg}{m + I/R^2} = \frac{${sig(m * g)}}{${m} + ${M / 2}} = ${sig(a)}\ \text{m/s}^2$`, T`$T = m(g - a) = ${sig(Tn)}\ \text{N}$`, T`$\alpha = a/R = ${sig(a / R)}\ \text{rad/s}^2$`],
        model: { type: "torque", mode: "pulley", M, R, m, h: 2 } };
    },
  });
  problem("10-4", "rodfall", {
    title: "Rod released from horizontal", level: 2,
    gen(r) {
      const L = r.num(0.4, 2.5, 0.1), M = r.num(0.5, 5, 0.5), wantTip = r.bool();
      const al = (3 * g) / (2 * L);
      return { q: T`<p>A uniform rod ($${M}\ \text{kg}$, $${L}\ \text{m}$) is pivoted at one end and held horizontal, then released. What is ${wantTip ? "the linear acceleration of the free end" : "its angular acceleration"} just after release? ($I_{end} = \frac13ML^2$)</p>`,
        answer: wantTip ? al * L : al, unit: wantTip ? "m/s²" : "rad/s²",
        hints: [T`Gravity acts at the center: $\tau = Mg\frac L2$.`, T`$\alpha = \tau/I = \frac{3g}{2L}$`],
        solution: [T`$\alpha = \frac{Mg(L/2)}{\frac13ML^2} = \frac{3g}{2L} = ${sig(al)}\ \text{rad/s}^2$`, T`Tip: $a_T = L\alpha = \tfrac32g = ${sig(al * L)}\ \text{m/s}^2$ — more than g!`],
        model: { type: "torque", mode: "rod", L, M } };
    },
  });
  // ---------- 10-5 ----------
  problem("10-5", "rodswing", {
    title: "Rod swinging down: energy", level: 2,
    gen(r) {
      const L = r.num(0.4, 2.5, 0.1), M = r.num(0.5, 5, 0.5), wantTip = r.bool();
      const w = Math.sqrt((3 * g) / L);
      return { q: T`<p>A uniform rod ($${M}\ \text{kg}$, $${L}\ \text{m}$) pivoted at one end is released from rest in a horizontal position. When it swings through the vertical, what is ${wantTip ? "the speed of its free end" : "its angular speed"}?</p>`,
        answer: wantTip ? w * L : w, unit: wantTip ? "m/s" : "rad/s",
        hints: [T`The CM falls $L/2$: $Mg\frac L2 = \tfrac12I\omega^2$ with $I = \frac13ML^2$.`],
        solution: [T`$\omega = \sqrt{3g/L} = ${sig(w)}\ \text{rad/s}$`, T`$v_{tip} = L\omega = ${sig(w * L)}\ \text{m/s}$`],
        model: { type: "torque", mode: "rod", L, M } };
    },
  });
  problem("10-5", "torquework", {
    title: "Work done by a constant torque", level: 2,
    gen(r) {
      const tau = r.num(1, 30, 0.5), I = r.num(0.05, 3, 0.05), rev = r.num(1, 10, 0.5);
      const W = tau * rev * 2 * Math.PI, w = Math.sqrt((2 * W) / I);
      return { q: T`<p>A motor applies a constant $${tau}\ \text{N·m}$ torque to a wheel ($I = ${I}\ \text{kg·m}^2$) that starts from rest. What is the wheel's angular speed after $${rev}$ revolutions?</p>`,
        answer: w, unit: "rad/s",
        hints: [T`$W = \tau\Delta\theta$ with $\Delta\theta$ in radians.`, T`$W = \tfrac12I\omega^2$`],
        solution: [T`$\Delta\theta = ${rev}\times2\pi = ${sig(rev * 2 * Math.PI)}\ \text{rad}$`, T`$W = ${sig(W)}\ \text{J}$`, T`$\omega = \sqrt{2W/I} = ${sig(w)}\ \text{rad/s}$`],
        model: { type: "rotation", w0: 0, alpha: Math.min(tau / I, 10), I, tmax: Math.sqrt((2 * rev * 2 * Math.PI) / Math.min(tau / I, 10)) } };
    },
  });
  problem("10-5", "power", {
    title: "Rotational power", level: 1,
    gen(r) {
      const tau = r.int(10, 400), rpm = r.int(500, 6000);
      const w = (rpm * 2 * Math.PI) / 60, P = tau * w;
      return { q: T`<p>A car engine delivers $${tau}\ \text{N·m}$ of torque at $${rpm}\ \text{rpm}$. What power is it producing?</p>`,
        answer: P, unit: "W",
        hints: [T`$P = \tau\omega$ with ω in rad/s.`],
        solution: [T`$\omega = ${sig(w)}\ \text{rad/s}$`, T`$P = ${tau}\times${sig(w)} = ${sig(P)}\ \text{W}$ (${sig(P / 746)} hp)`],
        model: { type: "rotation", w0: 12, alpha: 0, tmax: 4, notes: [`P = τω = ${sig(P)} W`] } };
    },
  });
})();
