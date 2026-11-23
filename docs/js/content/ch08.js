/* Chapter 8 — Potential Energy and Conservation of Energy */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180;

  article("8-1", T`
<p>Some forces "store" the work they do and give it back. Lift a book and gravity does negative work; let it fall and gravity does the same amount of positive work. Forces like this are <b>conservative</b>, and we can assign them a <b>potential energy</b>.</p>
<h2>Conservative forces</h2>
<p>A force is conservative if the work it does between two points is independent of the path — equivalently, zero around any closed loop. Gravity and ideal springs are conservative; friction and drag are not (they always take energy out as heat).</p>
<h2>Potential energy from force</h2>
<div class="eq">$\Delta U = -\int_a^b\vec F_{cf}(r)\cdot d\vec r$</div>
<p>Applying this to the two forces we know:</p>
<div class="eq">$\Delta U_g = mg\Delta y \qquad U_s = \tfrac12k(\Delta x)^2$</div>
<h2>Force from potential energy</h2>
<p>Run the relation backwards (one dimension):</p>
<div class="eq">$F_x = -\dfrac{dU(x)}{dx}$</div>
<p>The force points "downhill" on a graph of $U(x)$ — toward lower potential energy.</p>
<div class="worked"><div class="wt">Worked example</div>$U(x) = 4x^2 - x^3$ J. Then $F = -(8x - 3x^2)$. At $x = 1\ \text{m}$: $F = -5\ \text{N}$.</div>
<div class="callout key"><b class="t">Only differences matter</b>You may choose where $U = 0$. Changing that choice adds a constant to every $U$, which never changes $\Delta U$ or the force.</div>`);

  article("8-2", T`
<p>If only conservative forces do work, the sum of kinetic and potential energy — the <b>mechanical energy</b> — never changes:</p>
<div class="eq">$K_1 + U_1 = K_2 + U_2$</div>
<p>This one equation replaces a whole page of kinematics whenever you need a speed at a position.</p>
<h2>Recipe</h2>
<ol><li>Choose the system and check no non-conservative force does work (frictionless, no air resistance).</li><li>Pick two moments ("before" and "after") and a zero for $U$.</li><li>Write $\tfrac12mv_1^2 + mgy_1 + \tfrac12kx_1^2 = \tfrac12mv_2^2 + mgy_2 + \tfrac12kx_2^2$.</li><li>Solve for the unknown.</li></ol>
<div class="worked"><div class="wt">Worked example — pendulum</div>A pendulum of length 1.2 m is released from 40°. It drops $h = L(1 - \cos40^\circ) = 0.281\ \text{m}$, so at the bottom $v = \sqrt{2gh} = 2.35\ \text{m/s}$ — no forces or angles needed during the swing.</div>
<div class="worked"><div class="wt">Worked example — dropping onto a spring</div>A 2.0 kg block falls 0.50 m onto a spring with $k = 400\ \text{N/m}$. At maximum compression $x$, all energy is in the spring: $mg(0.50 + x) = \tfrac12kx^2$. Solving the quadratic gives $x = 0.27\ \text{m}$.</div>
<div class="callout warn"><b class="t">Speed, not direction</b>Energy is a scalar: a ball thrown at any angle from a cliff lands with the same speed (same height drop). Energy can't tell you directions or times.</div>`);

  article("8-3", T`
<p>A graph of $U(x)$ is a map of everything a particle can do in one dimension. Draw a horizontal line at the total mechanical energy $E$.</p>
<ul><li><b>Allowed regions:</b> where $U(x) \le E$ (since $K = E - U \ge 0$).</li><li><b>Turning points:</b> where $U(x) = E$ — the particle stops and reverses.</li><li><b>Kinetic energy:</b> the vertical gap between the $E$ line and the curve.</li><li><b>Force:</b> $F = -dU/dx$, the negative slope. Steeper curve → bigger force.</li></ul>
<h2>Equilibrium points</h2>
<p>Where $dU/dx = 0$ the force is zero.</p>
<ul><li><b>Stable</b> at a minimum of $U$: nudge it and the force pushes it back.</li><li><b>Unstable</b> at a maximum: nudge it and it runs away.</li><li><b>Neutral</b> where $U$ is flat.</li></ul>
<div class="worked"><div class="wt">Worked example</div>$U(x) = x^3 - 3x$ (J). $dU/dx = 3x^2 - 3 = 0$ at $x = \pm1$. Second derivative $6x$: positive at $x = 1$ (minimum, stable), negative at $x = -1$ (maximum, unstable).</div>
<div class="callout key"><b class="t">Ball-on-a-track intuition</b>Imagine a marble rolling along the $U(x)$ curve with "height" $E$ of water in it — it rolls back and forth between the walls where the curve rises to meet the water line.</div>`);

  article("8-4", T`
<p>Real systems have friction, and outside agents push and pull. Energy is still conserved — it just shows up in more forms.</p>
<h2>Friction makes thermal energy</h2>
<p>Kinetic friction converts mechanical energy into thermal energy (the surfaces warm up):</p>
<div class="eq">$\Delta E_{th} = f_kd$</div>
<h2>The full energy statement</h2>
<p>The work done on a system by external forces equals the change in its total energy:</p>
<div class="eq">$W_{ext} = \Delta K + \Delta U + \Delta E_{th}$</div>
<p>With no external work: $K_1 + U_1 = K_2 + U_2 + f_kd$ — the mechanical energy lost is exactly the heat produced.</p>
<div class="worked"><div class="wt">Worked example</div>A block slides from rest down a frictionless ramp of height 2.0 m and then across a floor with $\mu_k = 0.25$. It stops when all $mgh$ has become heat: $mgh = \mu_kmgd \Rightarrow d = h/\mu_k = 8.0\ \text{m}$.</div>
<div class="callout key"><b class="t">Choose your system</b>If Earth is in the system, gravity's effect is $\Delta U_g$; if not, it's external work $W_g$. Don't count it twice!</div>`);

  // ---------- 8-1 ----------
  problem("8-1", "fromU", {
    title: "Force from U(x)", level: 2,
    gen(r) {
      const A = r.num(0.5, 5, 0.5), B = r.num(0.2, 2, 0.2), x = r.num(0.5, 3, 0.5);
      const U = (xx) => A * xx * xx - B * xx ** 3, F = -(2 * A * x - 3 * B * x * x);
      return { q: T`<p>A particle moves along the $x$-axis with potential energy $U(x) = ${A}x^2 - ${B}x^3$ (J, $x$ in m). What is the force on it at $x = ${x}\ \text{m}$? (Give the sign.)</p>`,
        answer: F, unit: "N", absTol: 0.05,
        hints: [T`$F_x = -\frac{dU}{dx}$`, T`$\frac{dU}{dx} = ${2 * A}x - ${sig(3 * B, 3)}x^2$`],
        solution: [T`$F = -(${2 * A}x - ${sig(3 * B, 3)}x^2)$`, T`At $x = ${x}$: $F = ${sig(F)}\ \text{N}$`],
        model: { type: "forcegraph", mode: "ucurve", U, xr: [-0.5, Math.max(3.5, x + 0.5)], x0: x, E: U(x) + 0.5, m: 1, Emin: Math.min(-5, U(x) - 2), Emax: U(x) + 15 } };
    },
  });
  problem("8-1", "Ufrom F", {
    title: "Potential energy from F(x)", level: 3,
    gen(r) {
      const c = r.num(0.5, 6, 0.5), x = r.num(0.5, 2.5, 0.5);
      const dU = (c * x ** 4) / 4;
      return { q: T`<p>A conservative force $F(x) = -${c}x^3$ (N) acts on a particle. Taking $U(0) = 0$, what is $U$ at $x = ${x}\ \text{m}$?</p>`,
        answer: dU, unit: "J",
        hints: [T`$\Delta U = -\int_0^{x}F\,dx$`, T`$-\int_0^x(-${c}x'^3)dx' = \frac{${c}}{4}x^4$`],
        solution: [T`$U(x) = \frac{${c}}{4}x^4$`, T`$U(${x}) = ${sig(dU)}\ \text{J}$`],
        model: { type: "forcegraph", mode: "ucurve", U: (xx) => (c * xx ** 4) / 4, xr: [-x - 0.5, x + 0.5], x0: x, E: dU, m: 1, Emin: 0, Emax: dU * 2 + 1 } };
    },
  });
  problem("8-1", "conservative", {
    title: "Conservative vs. non-conservative", level: 1,
    gen(r) {
      const Q = r.pick([
        { q: "A crate is pushed around a closed loop on a rough floor, returning to its start. The total work done by friction is…", right: "negative.", wrong: ["zero, because the path is closed.", "positive.", "zero, because friction is conservative."] },
        { q: "Which force is conservative?", right: "The force of an ideal spring", wrong: ["Kinetic friction", "Air drag", "The push of your hand"] },
        { q: "A ball is carried up a staircase and then lowered back to the floor along a ramp. The total work done by gravity is…", right: "zero.", wrong: ["mgh.", "−mgh.", "It depends on the length of the ramp."] },
      ]);
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0, hints: ["Conservative forces do zero net work around any closed path."], solution: [Q.right] };
    },
  });
  // ---------- 8-2 ----------
  problem("8-2", "coaster", {
    title: "Roller-coaster speed from height", level: 1,
    gen(r) {
      const h = r.int(8, 60), v0 = r.pick([0.5, 1, 2, 3, 4]);
      const v = Math.sqrt(v0 * v0 + 2 * g * h);
      return { q: T`<p>A roller coaster crests a hill moving at $${v0}\ \text{m/s}$. It then drops to the lowest point of the track, $${h}\ \text{m}$ below. Ignoring friction, how fast is it moving there?</p>`,
        answer: v, unit: "m/s",
        hints: [T`$\tfrac12mv_0^2 + mgh = \tfrac12mv^2$ — mass cancels.`],
        solution: [T`$v = \sqrt{v_0^2 + 2gh} = \sqrt{${v0}^2 + 2(9.8)(${h})} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "energy", scene: "track", m: 500, h, v0 } };
    },
  });
  problem("8-2", "pendulum", {
    title: "Pendulum speed at the bottom", level: 1,
    gen(r) {
      const L = r.num(0.3, 4, 0.1), th = r.int(10, 80), m = r.num(0.1, 5, 0.1);
      const h = L * (1 - Math.cos(rad(th))), v = Math.sqrt(2 * g * h);
      return { q: T`<p>A pendulum bob ($${m}\ \text{kg}$) on a $${L}\ \text{m}$ string is pulled back to $${th}^\circ$ from vertical and released from rest. What is its speed at the lowest point?</p>`,
        answer: v, unit: "m/s",
        hints: [T`Height drop: $h = L(1 - \cos\theta)$`, T`$mgh = \tfrac12mv^2$`],
        solution: [T`$h = ${L}(1 - \cos${th}^\circ) = ${sig(h)}\ \text{m}$`, T`$v = \sqrt{2gh} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "energy", scene: "pendulum", m, L, angle0: th } };
    },
  });
  problem("8-2", "springdrop", {
    title: "Maximum compression of a spring hit from above", level: 3,
    gen(r) {
      const m = r.num(0.5, 5, 0.5), h = r.num(0.2, 2, 0.1), k = r.int(100, 2000);
      const x = (m * g + Math.sqrt((m * g) ** 2 + 2 * k * m * g * h)) / k;
      return { q: T`<p>A $${m}\ \text{kg}$ block is dropped from rest $${h}\ \text{m}$ above the top of a vertical spring ($k = ${k}\ \text{N/m}$). What is the maximum compression of the spring?</p>`,
        answer: x, unit: "m",
        hints: ["Before: at rest at the top. After: at rest at max compression. Total drop = h + x!", T`$mg(h + x) = \tfrac12kx^2$ → quadratic in x.`],
        solution: [T`$\tfrac12(${k})x^2 - ${sig(m * g)}x - ${sig(m * g * h)} = 0$`, T`$x = \frac{mg + \sqrt{(mg)^2 + 2kmgh}}{k} = ${sig(x)}\ \text{m}$`],
        model: { type: "energy", scene: "vspring", m, h, k } };
    },
  });
  problem("8-2", "anyangle", {
    title: "Landing speed is independent of angle", level: 2,
    gen(r) {
      const v0 = r.int(5, 25), h = r.int(5, 50), th = r.pick([0, 20, 30, 45, 60, -20]);
      const v = Math.sqrt(v0 * v0 + 2 * g * h);
      return { q: T`<p>A ball is thrown from the roof of a building $${h}\ \text{m}$ tall with speed $${v0}\ \text{m/s}$ at $${th}^\circ$ ${th >= 0 ? "above" : "below"} the horizontal. With what speed does it hit the ground? (No air resistance.)</p>`.replace(`${th}^\\circ below`, `${Math.abs(th)}^\\circ below`),
        answer: v, unit: "m/s",
        hints: ["Energy is a scalar — the direction of launch doesn't matter.", T`$\tfrac12mv_0^2 + mgh = \tfrac12mv^2$`],
        solution: [T`$v = \sqrt{${v0}^2 + 2(9.8)(${h})} = ${sig(v)}\ \text{m/s}$ for any launch angle.`],
        model: { type: "projectile", v0, angle: th, h0: h } };
    },
  });
  // ---------- 8-3 ----------
  problem("8-3", "equil", {
    title: "Stable and unstable equilibrium", level: 2,
    gen(r) {
      const c = r.int(1, 3), A = r.num(0.5, 2, 0.5);
      const U = (x) => A * (x ** 3 / 3 - c * c * x);
      return { q: T`<p>A particle has potential energy $U(x) = ${A}\left(\frac{x^3}{3} - ${c * c}x\right)$ (J). Which statement is correct?</p>`,
        choices: [T`$x = ${c}$ m is a stable equilibrium and $x = -${c}$ m is unstable.`, T`$x = -${c}$ m is stable and $x = ${c}$ m is unstable.`, T`Both $x = \pm${c}$ m are stable.`, T`The only equilibrium is $x = 0$.`], correct: 0,
        hints: [T`Equilibrium: $dU/dx = ${A}(x^2 - ${c * c}) = 0$`, "Stable = minimum of U (second derivative > 0)."],
        solution: [T`$dU/dx = 0$ at $x = \pm${c}$`, T`$d^2U/dx^2 = ${2 * A}x$: positive at $+${c}$ (min → stable), negative at $-${c}$ (max → unstable).`],
        model: { type: "forcegraph", mode: "ucurve", U, xr: [-c - 2, c + 2], x0: c + 0.6, E: U(c) + 0.6 * A, m: 1, Emin: U(c) - 1, Emax: U(-c) + 2 } };
    },
  });
  problem("8-3", "turning", {
    title: "Turning points from a potential-energy curve", level: 2,
    gen(r) {
      const k = r.int(10, 200), E = r.num(0.5, 10, 0.5), m = r.num(0.2, 3, 0.1), want = r.bool();
      const xt = Math.sqrt((2 * E) / k), vmax = Math.sqrt((2 * E) / m);
      return { q: T`<p>A $${m}\ \text{kg}$ particle moves in the potential $U(x) = \tfrac12(${k})x^2$ (J) with total mechanical energy $${E}\ \text{J}$. What is ${want ? "the positive turning point" : "its maximum speed"}?</p>`,
        answer: want ? xt : vmax, unit: want ? "m" : "m/s",
        hints: [want ? "Turning point: K = 0, so U(x) = E." : "Max speed where U is smallest (x = 0): K = E."],
        solution: [T`Turning point: $\tfrac12(${k})x^2 = ${E} \Rightarrow x = ${sig(xt)}\ \text{m}$`, T`Max speed: $\tfrac12mv^2 = ${E} \Rightarrow v = ${sig(vmax)}\ \text{m/s}$`],
        model: { type: "forcegraph", mode: "ucurve", U: (x) => 0.5 * k * x * x, xr: [-xt * 1.6, xt * 1.6], x0: xt * 0.999, E, m, Emin: 0, Emax: E * 3 } };
    },
  });
  problem("8-3", "speedmin", {
    title: "Speed at the bottom of a potential well", level: 3,
    gen(r) {
      const A = r.num(1, 5, 0.5), B = r.num(2, 8, 1), m = r.num(0.5, 4, 0.5), x0 = 0;
      const xm = B / (2 * A), Umin = A * xm * xm - B * xm, E = r.num(0.5, 5, 0.5), v = Math.sqrt((2 * (E - Umin)) / m);
      return { q: T`<p>A $${m}\ \text{kg}$ particle moves with $U(x) = ${A}x^2 - ${B}x$ (J). Its total mechanical energy is $${E}\ \text{J}$. What is its speed when it passes the minimum of $U$?</p>`,
        answer: v, unit: "m/s",
        hints: [T`Minimum where $dU/dx = ${2 * A}x - ${B} = 0$.`, T`$K = E - U_{min}$`],
        solution: [T`$x_{min} = ${sig(xm)}\ \text{m}$, $U_{min} = ${sig(Umin)}\ \text{J}$`, T`$K = ${E} - (${sig(Umin)}) = ${sig(E - Umin)}\ \text{J}$`, T`$v = \sqrt{2K/m} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "forcegraph", mode: "ucurve", U: (x) => A * x * x - B * x, xr: [xm - Math.sqrt((E - Umin) / A) * 1.5, xm + Math.sqrt((E - Umin) / A) * 1.5], x0: xm, E, m, Emin: Umin, Emax: E + 10 } };
      void x0;
    },
  });
  // ---------- 8-4 ----------
  problem("8-4", "rampfloor", {
    title: "Ramp, then a rough floor", level: 1,
    gen(r) {
      const h = r.num(0.5, 5, 0.5), muk = r.num(0.1, 0.6, 0.05), m = r.num(0.5, 10, 0.5), th = r.pick([20, 30, 37, 45]);
      const d = h / muk;
      return { q: T`<p>A $${m}\ \text{kg}$ block slides from rest down a frictionless ramp from a height of $${h}\ \text{m}$, then across a level floor with $\mu_k = ${muk}$. How far along the floor does it slide before stopping?</p>`,
        answer: d, unit: "m",
        hints: ["All the initial potential energy becomes thermal energy.", T`$mgh = \mu_kmgd$`],
        solution: [T`$mgh = \mu_kmgd \Rightarrow d = h/\mu_k = ${h}/${muk} = ${sig(d)}\ \text{m}$`, "Mass and ramp angle don't matter."],
        model: { type: "energy", scene: "ramp", m, h, theta: th, muk } };
    },
  });
  problem("8-4", "roughramp", {
    title: "Speed at the bottom of a rough ramp", level: 2,
    gen(r) {
      const m = r.num(1, 10, 0.5), L = r.num(1, 8, 0.5), th = r.pick([30, 37, 45, 53]), mu = r.num(0.05, 0.35, 0.05), want = r.bool();
      const h = L * Math.sin(rad(th)), Eth = mu * m * g * Math.cos(rad(th)) * L, v = Math.sqrt(Math.max(0, 2 * (m * g * h - Eth) / m));
      return { q: T`<p>A $${m}\ \text{kg}$ box slides from rest $${L}\ \text{m}$ down a ramp inclined at $${th}^\circ$; $\mu_k = ${mu}$. ${want ? "How much thermal energy is produced?" : "What is its speed at the bottom?"}</p>`,
        answer: want ? Eth : v, unit: want ? "J" : "m/s",
        hints: [T`$\Delta E_{th} = f_kL = \mu_kmg\cos\theta\,L$`, T`$mgh = \tfrac12mv^2 + \Delta E_{th}$ with $h = L\sin\theta$`],
        solution: [T`$h = ${sig(h)}\ \text{m}$, $mgh = ${sig(m * g * h)}\ \text{J}$`, T`$\Delta E_{th} = ${sig(Eth)}\ \text{J}$`, T`$\tfrac12mv^2 = ${sig(m * g * h - Eth)}\ \text{J} \Rightarrow v = ${sig(v)}\ \text{m/s}$`],
        model: { type: "energy", scene: "ramp", m, h, theta: th, muk: 0, mukRamp: mu, floor: 0.5 } };
    },
  });
  problem("8-4", "pushup", {
    title: "Work to push a crate up a rough ramp", level: 3,
    gen(r) {
      const m = r.int(5, 40), L = r.num(1, 6, 0.5), th = r.pick([15, 20, 30, 37]), mu = r.num(0.1, 0.4, 0.05);
      const dU = m * g * L * Math.sin(rad(th)), Eth = mu * m * g * Math.cos(rad(th)) * L, W = dU + Eth;
      return { q: T`<p>You push a $${m}\ \text{kg}$ crate at constant speed $${L}\ \text{m}$ up a ramp inclined at $${th}^\circ$ with $\mu_k = ${mu}$ (your push is parallel to the ramp). How much work do you do?</p>`,
        answer: W, unit: "J",
        hints: [T`Constant speed: $\Delta K = 0$, so $W_{you} = \Delta U + \Delta E_{th}$.`],
        solution: [T`$\Delta U = mgL\sin\theta = ${sig(dU)}\ \text{J}$`, T`$\Delta E_{th} = \mu_kmg\cos\theta\,L = ${sig(Eth)}\ \text{J}$`, T`$W = ${sig(W)}\ \text{J}$`],
        model: { type: "forces", setup: "incline", m, theta: th, F: m * g * (Math.sin(rad(th)) + mu * Math.cos(rad(th))), Fang: 0, mus: mu, muk: mu, v0: 0.5 } };
    },
  });
})();
