/* Chapter 9 — Center of Mass and Linear Momentum */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

  article("9-1", T`
<p>A system of many particles — or a solid object — moves as if all its mass were concentrated at one special point: the <b>center of mass</b> (CM).</p>
<h2>Particles</h2>
<div class="eq">$x_{cm} = \dfrac{\sum m_ix_i}{\sum m_i} \qquad y_{cm} = \dfrac{\sum m_iy_i}{\sum m_i}$</div>
<p>It's a mass-weighted average position, so it sits closer to the heavier masses.</p>
<h2>Continuous objects (AP C favorite)</h2>
<p>Replace the sum by an integral. For a rod along $x$ with linear mass density $\lambda(x) = dm/dx$:</p>
<div class="eq">$x_{cm} = \dfrac{\int x\,dm}{\int dm} = \dfrac{\int_0^L x\lambda(x)\,dx}{\int_0^L\lambda(x)\,dx}$</div>
<div class="worked"><div class="wt">Worked example</div>A rod of length $L$ has $\lambda = cx$ (denser toward $x = L$).<br>$M = \int_0^L cx\,dx = \tfrac12cL^2$, $\int_0^L x(cx)dx = \tfrac13cL^3$, so $x_{cm} = \tfrac23L$ — shifted toward the heavy end, as expected.</div>
<h2>Newton's second law for a system</h2>
<div class="eq">$\vec F_{net,ext} = M\vec a_{cm}$</div>
<p>Internal forces cancel in pairs (third law). So if no external force acts, the CM moves at constant velocity — even if the parts fly around or explode.</p>
<div class="callout key"><b class="t">Boat problem</b>A person walks along a boat floating on still water. No external horizontal force, so the CM stays put: the boat slides backward by $\Delta x_{boat} = -\frac{m}{m+M}d$.</div>`);

  article("9-2", T`
<p>Momentum combines mass and velocity into one vector:</p>
<div class="eq">$\vec p = m\vec v$</div>
<p>Newton actually wrote his second law in terms of momentum, and that's the form on your equation sheet:</p>
<div class="eq">$\vec F_{net} = \dfrac{d\vec p}{dt}$</div>
<h2>Impulse</h2>
<p>Integrate over the time a force acts and you get the <b>impulse</b>:</p>
<div class="eq">$\vec J = \int_{t_1}^{t_2}\vec F_{net}(t)\,dt = \Delta\vec p$</div>
<p>Impulse is the area under a force–time graph. For a short collision we often use the average force: $J = F_{avg}\Delta t$.</p>
<div class="worked"><div class="wt">Worked example — bounce</div>A 0.16 kg ball hits a wall at 20 m/s and rebounds at 15 m/s; contact lasts 4.0 ms. Taking the rebound direction as +: $\Delta p = 0.16(15 - (-20)) = 5.6\ \text{kg·m/s}$, so $F_{avg} = 5.6/0.004 = 1400\ \text{N}$.</div>
<div class="callout warn"><b class="t">Watch the signs</b>A rebound reverses the velocity, so $|\Delta p|$ is the <i>sum</i> of the speeds times $m$, not the difference.</div>
<div class="callout key"><b class="t">Why airbags work</b>For a fixed $\Delta p$, stretching out $\Delta t$ lowers the average force.</div>`);

  article("9-3", T`
<p>If the net external force on a system is zero, its total momentum is constant:</p>
<div class="eq">$\vec P_i = \vec P_f \quad\Longleftrightarrow\quad m_1\vec v_{1i} + m_2\vec v_{2i} = m_1\vec v_{1f} + m_2\vec v_{2f}$</div>
<p>During a short collision or explosion the internal forces are huge compared with any external forces (gravity, friction), so momentum is conserved to excellent accuracy.</p>
<h2>Inelastic collisions</h2>
<p>Kinetic energy is <b>not</b> conserved in most collisions — some goes to heat, sound, and deformation. In a <b>perfectly inelastic</b> collision the objects stick together:</p>
<div class="eq">$v_f = \dfrac{m_1v_{1i} + m_2v_{2i}}{m_1 + m_2}$</div>
<p>This loses the maximum kinetic energy allowed by momentum conservation.</p>
<div class="worked"><div class="wt">Ballistic pendulum</div>A bullet ($m$) embeds in a hanging block ($M$), which swings up a height $h$. Two stages:<br>1) Collision — momentum: $mv = (m+M)V$.<br>2) Swing — energy: $\tfrac12(m+M)V^2 = (m+M)gh$.<br>So $v = \frac{m+M}{m}\sqrt{2gh}$. Don't use energy conservation through the collision!</div>
<div class="callout key"><b class="t">Explosions</b>Start at rest ⇒ total momentum stays zero: the pieces fly apart with $m_1v_1 = -m_2v_2$.</div>`);

  article("9-4", T`
<p>In an <b>elastic</b> collision, kinetic energy is conserved as well as momentum. (Hard steel balls and air-track gliders with magnets come close.)</p>
<div class="eq">$m_1v_{1i} + m_2v_{2i} = m_1v_{1f} + m_2v_{2f}$</div>
<div class="eq">$\tfrac12m_1v_{1i}^2 + \tfrac12m_2v_{2i}^2 = \tfrac12m_1v_{1f}^2 + \tfrac12m_2v_{2f}^2$</div>
<p>Solving these together for a target initially at rest ($v_{2i} = 0$):</p>
<div class="eq">$v_{1f} = \dfrac{m_1 - m_2}{m_1 + m_2}v_{1i} \qquad v_{2f} = \dfrac{2m_1}{m_1 + m_2}v_{1i}$</div>
<p>A handy shortcut that always holds for 1D elastic collisions: the relative velocity reverses, $v_{1i} - v_{2i} = -(v_{1f} - v_{2f})$.</p>
<h2>Special cases</h2>
<ul><li>Equal masses: they swap velocities (Newton's cradle).</li><li>Heavy hits light ($m_1 \gg m_2$): the light one leaves at about $2v_{1i}$.</li><li>Light hits heavy: the light one bounces back at about its original speed.</li></ul>
<div class="callout warn"><b class="t">Exam tip</b>These formulas are not on the equation sheet — derive them from the two conservation laws, or use the relative-velocity trick with momentum.</div>`);

  article("9-5", T`
<p>Momentum is a vector, so in two dimensions it's conserved <b>separately in each direction</b>:</p>
<div class="eq">$\sum p_x\ \text{before} = \sum p_x\ \text{after} \qquad \sum p_y\ \text{before} = \sum p_y\ \text{after}$</div>
<h2>Strategy</h2>
<ol><li>Pick axes (often along one incoming velocity).</li><li>Write every momentum in components.</li><li>Write one equation for x and one for y.</li><li>Solve; then combine components into a magnitude and angle.</li></ol>
<div class="worked"><div class="wt">Worked example — intersection crash</div>A 1500 kg car going east at 20 m/s collides with a 2500 kg van going north at 12 m/s; they lock together.<br>$p_x = 30{,}000$, $p_y = 30{,}000$ kg·m/s, so $V = \frac{\sqrt{30000^2 + 30000^2}}{4000} = 10.6\ \text{m/s}$ at 45° north of east.</div>
<div class="callout key"><b class="t">Elastic glancing collision</b>When equal masses collide elastically with one at rest, they leave at 90° to each other — a nice check in billiards.</div>`);

  // ---------- 9-1 ----------
  problem("9-1", "particles", {
    title: "CM of three particles", level: 1,
    gen(r) {
      const ms = [0, 1, 2].map(() => ({ m: r.int(1, 8), x: r.int(-4, 6), y: r.int(-3, 5) })), wantY = r.bool();
      ms.forEach((q, i) => (q.label = ["A", "B", "C"][i]));
      const M = ms.reduce((s, q) => s + q.m, 0), xc = ms.reduce((s, q) => s + q.m * q.x, 0) / M, yc = ms.reduce((s, q) => s + q.m * q.y, 0) / M;
      return { q: T`<p>Three particles: $${ms[0].m}\ \text{kg}$ at $(${ms[0].x}, ${ms[0].y})$, $${ms[1].m}\ \text{kg}$ at $(${ms[1].x}, ${ms[1].y})$, and $${ms[2].m}\ \text{kg}$ at $(${ms[2].x}, ${ms[2].y})$ (coordinates in m). What is the ${wantY ? "$y$" : "$x$"}-coordinate of their center of mass?</p>`,
        answer: wantY ? yc : xc, unit: "m", absTol: 0.02,
        hints: [T`$${wantY ? "y" : "x"}_{cm} = \frac{\sum m_i${wantY ? "y" : "x"}_i}{\sum m_i}$`],
        solution: [T`$\sum m = ${M}\ \text{kg}$`, T`$x_{cm} = ${sig(ms.reduce((s, q) => s + q.m * q.x, 0))}/${M} = ${sig(xc)}\ \text{m}$`, T`$y_{cm} = ${sig(ms.reduce((s, q) => s + q.m * q.y, 0))}/${M} = ${sig(yc)}\ \text{m}$`],
        model: { type: "com", masses: ms, twoD: true } };
    },
  });
  problem("9-1", "rod", {
    title: "CM of a non-uniform rod (integral)", level: 3,
    gen(r) {
      const L = r.num(0.5, 3, 0.5), a = r.num(0, 3, 0.5), b = r.num(0.5, 4, 0.5);
      const M = a * L + (b * L * L) / 2, Mx = (a * L * L) / 2 + (b * L ** 3) / 3, xc = Mx / M;
      return { q: T`<p>A thin rod lies along the $x$-axis from $x = 0$ to $x = ${L}\ \text{m}$. Its linear mass density is $\lambda(x) = ${a} + ${b}x$ (kg/m). Where is its center of mass?</p>`,
        answer: xc, unit: "m",
        hints: [T`$M = \int_0^L\lambda\,dx$ and $x_{cm} = \frac1M\int_0^Lx\lambda\,dx$`, T`$\int_0^L x(${a} + ${b}x)dx = \frac{${a}L^2}{2} + \frac{${b}L^3}{3}$`],
        solution: [T`$M = ${a}(${L}) + \tfrac{${b}}{2}(${L})^2 = ${sig(M)}\ \text{kg}$`, T`$\int x\lambda\,dx = ${sig(Mx)}\ \text{kg·m}$`, T`$x_{cm} = ${sig(Mx)}/${sig(M)} = ${sig(xc)}\ \text{m}$ (uniform would be ${L / 2} m)`],
        model: { type: "com", rod: { L, lam: (x) => a + b * x, lamText: `${a} + ${b}x kg/m` } } };
    },
  });
  problem("9-1", "boat", {
    title: "Walking on a boat (CM stays put)", level: 2,
    gen(r) {
      const m = r.int(40, 90), M = r.int(60, 400), d = r.num(1, 6, 0.5);
      const db = (m * d) / (m + M);
      return { q: T`<p>A $${m}\ \text{kg}$ person stands at one end of a $${M}\ \text{kg}$ boat floating at rest on calm water. She walks $${d}\ \text{m}$ toward the other end (relative to the boat). Ignoring water drag, how far does the boat move relative to the water?</p>`,
        answer: db, unit: "m",
        hints: ["No external horizontal force: the CM of person + boat cannot move.", T`If the boat moves $D$ backward, the person moves $d - D$ forward: $m(d - D) = MD$.`],
        solution: [T`$m(d - D) = MD \Rightarrow D = \frac{md}{m + M}$`, T`$D = \frac{${m}(${d})}{${m + M}} = ${sig(db)}\ \text{m}$ opposite to her walk`],
        model: { type: "com", masses: [{ m, x: d - db, label: "person" }, { m: M, x: -db + d / 2, label: "boat CM" }] } };
    },
  });
  // ---------- 9-2 ----------
  problem("9-2", "bounce", {
    title: "Average force during a bounce", level: 2,
    gen(r) {
      const m = r.num(0.05, 0.6, 0.01), vi = r.int(5, 40), vf = r.int(2, 35), dt = r.num(1, 20, 1) / 1000;
      const J = m * (vf + vi), F = J / dt, wantJ = r.bool();
      return { q: T`<p>A $${m}\ \text{kg}$ ball moving at $${vi}\ \text{m/s}$ hits a wall head-on and rebounds at $${vf}\ \text{m/s}$. The contact lasts $${sig(dt * 1000)}\ \text{ms}$. What is the ${wantJ ? "magnitude of the impulse on the ball" : "magnitude of the average force the wall exerts"}?</p>`,
        answer: wantJ ? J : F, unit: wantJ ? "N·s" : "N",
        hints: ["Choose the rebound direction as +, so the incoming velocity is negative.", T`$J = \Delta p = m(v_f - v_i)$, $F_{avg} = J/\Delta t$`],
        solution: [T`$J = ${m}(${vf} - (-${vi})) = ${sig(J)}\ \text{N·s}$`, T`$F_{avg} = ${sig(J)}/${dt} = ${sig(F)}\ \text{N}$`],
        model: { type: "impulse", m, vi: vi, vf: -vf, dt, shape: "sine" } };
    },
  });
  problem("9-2", "triangle", {
    title: "Impulse from a force–time graph", level: 2,
    gen(r) {
      const m = r.num(0.5, 5, 0.5), Fm = r.int(50, 2000), dt = r.num(2, 30, 1) / 1000, vi = r.int(0, 6);
      const J = 0.5 * Fm * dt, vf = vi + J / m;
      return { q: T`<p>A $${m}\ \text{kg}$ puck moving at $${vi}\ \text{m/s}$ is struck in its direction of motion. The force rises linearly from 0 to $${Fm}\ \text{N}$ and back to 0 over $${sig(dt * 1000)}\ \text{ms}$ (a triangle on an F–t graph). What is the puck's speed afterward?</p>`,
        answer: vf, unit: "m/s",
        hints: ["Impulse = area under the F–t graph = ½·base·height.", T`$v_f = v_i + J/m$`],
        solution: [T`$J = \tfrac12(${Fm})(${dt}) = ${sig(J)}\ \text{N·s}$`, T`$v_f = ${vi} + ${sig(J)}/${m} = ${sig(vf)}\ \text{m/s}$`],
        model: { type: "impulse", m, vi: -vi, vf: -vf, dt, shape: "tri" } };
    },
  });
  problem("9-2", "dpdt", {
    title: "Force as dp/dt", level: 2,
    gen(r) {
      const A = r.num(0.5, 4, 0.5), B = r.int(1, 10), t1 = r.num(1, 5, 0.5), m = r.num(1, 5, 0.5);
      const F = 2 * A * t1;
      return { q: T`<p>The momentum of a $${m}\ \text{kg}$ object is $p(t) = ${A}t^2 + ${B}$ (kg·m/s, $t$ in s). What is the net force on it at $t = ${t1}\ \text{s}$?</p>`,
        answer: F, unit: "N",
        hints: [T`$F_{net} = \frac{dp}{dt}$`],
        solution: [T`$F = \frac{d}{dt}(${A}t^2 + ${B}) = ${2 * A}t$`, T`At $t = ${t1}$: $F = ${sig(F)}\ \text{N}$`],
        model: { type: "motion1d", xf: (t) => ((A * t ** 3) / 3 + B * t) / m, vf: (t) => (A * t * t + B) / m, af: (t) => (2 * A * t) / m, tmax: t1 + 1, obj: "ball", facts: [["F = dp/dt", `${sig(F)} N`]] } };
    },
  });
  // ---------- 9-3 ----------
  problem("9-3", "stick", {
    title: "Perfectly inelastic collision", level: 1,
    gen(r) {
      const m1 = r.num(0.5, 8, 0.5), m2 = r.num(0.5, 8, 0.5), v1 = r.num(1, 10, 0.5), v2 = r.pick([0, 0, -r.num(0.5, 4, 0.5), r.num(0.5, 3, 0.5)]), want = r.bool();
      const vf = (m1 * v1 + m2 * v2) / (m1 + m2), Ki = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2, Kf = 0.5 * (m1 + m2) * vf * vf;
      return { q: T`<p>A $${m1}\ \text{kg}$ cart moving at $${v1}\ \text{m/s}$ collides with a $${m2}\ \text{kg}$ cart ${v2 === 0 ? "at rest" : `moving at $${v2}\\ \\text{m/s}$`} on the same track, and they stick together. ${want ? "What is their common velocity right after?" : "How much kinetic energy is lost?"}</p>`,
        answer: want ? vf : Ki - Kf, unit: want ? "m/s" : "J",
        hints: ["Momentum is conserved; kinetic energy is not.", T`$v_f = \frac{m_1v_1 + m_2v_2}{m_1 + m_2}$`],
        solution: [T`$v_f = \frac{${m1}(${v1}) + ${m2}(${v2})}{${m1 + m2}} = ${sig(vf)}\ \text{m/s}$`, T`$K_i = ${sig(Ki)}\ \text{J}$, $K_f = ${sig(Kf)}\ \text{J}$, lost $= ${sig(Ki - Kf)}\ \text{J}$`],
        model: { type: "collision", kind: "inelastic", m1, v1, m2, v2 } };
    },
  });
  problem("9-3", "ballistic", {
    title: "Ballistic pendulum", level: 3,
    gen(r) {
      const m = r.num(5, 30, 1) / 1000, M = r.num(1, 6, 0.5), h = r.num(2, 20, 0.5) / 100;
      const V = Math.sqrt(2 * g * h), v = ((m + M) / m) * V;
      return { q: T`<p>A $${sig(m * 1000)}\ \text{g}$ bullet is fired into a $${M}\ \text{kg}$ wooden block hanging from strings. The bullet embeds and the block swings up $${sig(h * 100)}\ \text{cm}$. What was the bullet's speed?</p>`,
        answer: v, unit: "m/s",
        hints: ["Two stages! Energy after the collision gives the block's speed V.", T`Then momentum through the collision: $mv = (m + M)V$.`],
        solution: [T`Swing: $V = \sqrt{2gh} = ${sig(V)}\ \text{m/s}$`, T`Collision: $v = \frac{m + M}{m}V = ${sig(v)}\ \text{m/s}$`, "Energy is NOT conserved in the collision — most of the bullet's KE becomes heat."],
        model: { type: "collision", kind: "inelastic", m1: m, v1: v, m2: M, v2: 0 } };
    },
  });
  problem("9-3", "recoil", {
    title: "Recoil / explosion from rest", level: 1,
    gen(r) {
      const m1 = r.num(0.5, 20, 0.5), m2 = r.num(40, 200, 5), v1 = r.num(1, 15, 0.5);
      const v2 = (m1 * v1) / m2;
      return { q: T`<p>An astronaut ($${m2}\ \text{kg}$ with suit) floating at rest throws a $${m1}\ \text{kg}$ tool away at $${v1}\ \text{m/s}$. With what speed does she recoil?</p>`,
        answer: v2, unit: "m/s",
        hints: ["Total momentum starts at zero and stays zero.", T`$0 = m_1v_1 + m_2v_2$`],
        solution: [T`$v_2 = -\frac{m_1v_1}{m_2} = -\frac{${m1}(${v1})}{${m2}}$`, T`speed $= ${sig(v2)}\ \text{m/s}$ in the opposite direction`],
        model: { type: "collision", kind: "partial", m1, v1: 0, m2, v2: 0, v1f: -v1 } };
    },
  });
  // ---------- 9-4 ----------
  problem("9-4", "elastic", {
    title: "Elastic collision with a target at rest", level: 2,
    gen(r) {
      const m1 = r.num(0.5, 6, 0.5), m2 = r.num(0.5, 6, 0.5), v1 = r.num(1, 10, 0.5), want2 = r.bool();
      const v1f = ((m1 - m2) / (m1 + m2)) * v1, v2f = ((2 * m1) / (m1 + m2)) * v1;
      return { q: T`<p>A $${m1}\ \text{kg}$ glider moving at $${v1}\ \text{m/s}$ collides elastically with a $${m2}\ \text{kg}$ glider at rest on a frictionless air track. What is the velocity of the ${want2 ? "second (target)" : "first (incoming)"} glider afterward? (Positive = original direction.)</p>`,
        answer: want2 ? v2f : v1f, unit: "m/s", absTol: 0.02,
        hints: ["Conserve momentum AND kinetic energy.", T`Results: $v_{1f} = \frac{m_1 - m_2}{m_1 + m_2}v_1$, $v_{2f} = \frac{2m_1}{m_1 + m_2}v_1$`],
        solution: [T`$v_{1f} = \frac{${m1} - ${m2}}{${m1 + m2}}(${v1}) = ${sig(v1f)}\ \text{m/s}$`, T`$v_{2f} = \frac{2(${m1})}{${m1 + m2}}(${v1}) = ${sig(v2f)}\ \text{m/s}$`, T`Check: relative velocity reversed (${v1} → ${sig(v1f - v2f)}) ✓`],
        model: { type: "collision", kind: "elastic", m1, v1, m2, v2: 0 } };
    },
  });
  problem("9-4", "both", {
    title: "Elastic collision, both moving", level: 3,
    gen(r) {
      const m1 = r.num(1, 5, 0.5), m2 = r.num(1, 5, 0.5), v1 = r.num(2, 8, 0.5), v2 = -r.num(1, 6, 0.5);
      const v1f = ((m1 - m2) / (m1 + m2)) * v1 + ((2 * m2) / (m1 + m2)) * v2, v2f = ((2 * m1) / (m1 + m2)) * v1 + ((m2 - m1) / (m1 + m2)) * v2;
      return { q: T`<p>Ball 1 ($${m1}\ \text{kg}$) moves right at $${v1}\ \text{m/s}$; ball 2 ($${m2}\ \text{kg}$) moves left at $${-v2}\ \text{m/s}$. They collide head-on and elastically. What is ball 2's velocity afterward (right = +)?</p>`,
        answer: v2f, unit: "m/s", absTol: 0.02,
        hints: [T`Momentum: $${m1}(${v1}) + ${m2}(${v2}) = ${m1}v_{1f} + ${m2}v_{2f}$`, T`Elastic shortcut: $v_{1f} - v_{2f} = -(v_{1i} - v_{2i}) = ${-(v1 - v2)}$`],
        solution: [T`Solve the two linear equations: $v_{2f} = ${sig(v2f)}\ \text{m/s}$, $v_{1f} = ${sig(v1f)}\ \text{m/s}$`],
        model: { type: "collision", kind: "elastic", m1, v1, m2, v2 } };
    },
  });
  problem("9-4", "concept", {
    title: "Elastic collision special cases", level: 1,
    gen(r) {
      const Q = r.pick([
        { q: "A billiard ball hits an identical ball at rest head-on, elastically. Afterward…", right: "the first ball stops and the second moves off with the first's original velocity.", wrong: ["both move forward at half the original speed.", "the first ball bounces back at its original speed.", "both stop."], m1: 1, m2: 1 },
        { q: "A ping-pong ball hits a bowling ball at rest head-on, elastically. The ping-pong ball…", right: "bounces back with nearly its original speed.", wrong: ["stops.", "continues forward slowly.", "sticks to the bowling ball."], m1: 0.3, m2: 7 },
        { q: "In an elastic collision, which quantities are conserved?", right: "Both total momentum and total kinetic energy.", wrong: ["Only total momentum.", "Only total kinetic energy.", "Neither, because forces act."], m1: 2, m2: 1 },
      ]);
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0, hints: ["Try the formulas with the given masses."], solution: [Q.right], model: { type: "collision", kind: "elastic", m1: Q.m1, v1: 4, m2: Q.m2, v2: 0 } };
    },
  });
  // ---------- 9-5 ----------
  problem("9-5", "crash", {
    title: "Intersection collision (stick together)", level: 2,
    gen(r) {
      const m1 = r.int(800, 2000), v1 = r.int(8, 25), m2 = r.int(800, 3000), v2 = r.int(5, 20), wantAng = r.bool();
      const Px = m1 * v1, Py = m2 * v2, V = Math.hypot(Px, Py) / (m1 + m2), ang = deg(Math.atan2(Py, Px));
      return { q: T`<p>A $${m1}\ \text{kg}$ car traveling east at $${v1}\ \text{m/s}$ collides with a $${m2}\ \text{kg}$ truck traveling north at $${v2}\ \text{m/s}$. They lock together. ${wantAng ? "At what angle north of east does the wreck move?" : "How fast does the wreck move just after the collision?"}</p>`,
        answer: wantAng ? ang : V, unit: wantAng ? "°" : "m/s",
        hints: ["Conserve p_x and p_y separately.", T`$p_x = ${m1}(${v1})$, $p_y = ${m2}(${v2})$`],
        solution: [T`$p_x = ${Px}$, $p_y = ${Py}$ kg·m/s`, T`$V = \frac{\sqrt{p_x^2 + p_y^2}}{${m1 + m2}} = ${sig(V)}\ \text{m/s}$`, T`$\theta = \tan^{-1}(p_y/p_x) = ${sig(ang)}^\circ$ north of east`],
        model: { type: "collision", dim: 2, stick: true, m1: m1 / 1000, v1: [v1, 0], m2: m2 / 1000, v2: [0, v2] } };
    },
  });
  problem("9-5", "glance", {
    title: "Glancing collision: find the target's velocity", level: 3,
    gen(r) {
      const m1 = r.num(0.1, 1, 0.1), m2 = r.num(0.1, 1, 0.1), v1 = r.num(2, 8, 0.5), v1f = r.num(0.5, v1 - 0.5, 0.5), th1 = r.pick([20, 30, 37, 45, 53, 60]);
      const v1fx = v1f * Math.cos(rad(th1)), v1fy = v1f * Math.sin(rad(th1));
      const v2fx = (m1 * v1 - m1 * v1fx) / m2, v2fy = -(m1 * v1fy) / m2, sp = Math.hypot(v2fx, v2fy);
      return { q: T`<p>A $${m1}\ \text{kg}$ puck moving along $+x$ at $${v1}\ \text{m/s}$ strikes a $${m2}\ \text{kg}$ puck at rest. Afterward the first puck moves at $${v1f}\ \text{m/s}$ at $${th1}^\circ$ above the $+x$ axis. What is the speed of the second puck?</p>`,
        answer: sp, unit: "m/s",
        hints: ["x: m₁v₁ = m₁v₁′cosθ₁ + m₂v₂ₓ′.  y: 0 = m₁v₁′sinθ₁ + m₂v₂ᵧ′."],
        solution: [T`$v_{2x}' = \frac{${m1}(${v1}) - ${m1}(${sig(v1fx)})}{${m2}} = ${sig(v2fx)}\ \text{m/s}$`, T`$v_{2y}' = -\frac{${m1}(${sig(v1fy)})}{${m2}} = ${sig(v2fy)}\ \text{m/s}$`, T`speed $= ${sig(sp)}\ \text{m/s}$ at $${sig(deg(Math.atan2(v2fy, v2fx)))}^\circ$`],
        model: { type: "collision", dim: 2, m1, v1: [v1, 0], m2, v2: [0, 0], v1f: [v1fx, v1fy] } };
    },
  });
})();
