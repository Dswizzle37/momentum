/* Chapter 12 — Equilibrium and Elasticity */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180;

  article("12-1", T`
<p>An object is in <b>static equilibrium</b> when it isn't accelerating or rotating. For an extended body that requires two conditions:</p>
<div class="eq">$\sum\vec F_{ext} = 0 \qquad \sum\vec\tau_{ext} = 0\ \ (\text{about any point})$</div>
<p>The first stops the center of mass from accelerating; the second stops angular acceleration.</p>
<h2>Center of gravity</h2>
<p>Gravity acts on every piece of a body, but for torque purposes you can treat it as a single force $Mg$ acting at the center of mass (in uniform $g$). A uniform beam's weight acts at its middle.</p>
<h2>The seesaw rule</h2>
<p>For a balance about a pivot: $\sum(\text{weight}\times\text{lever arm})$ on one side = the same sum on the other. E.g. a 30 kg child 2.0 m from the pivot balances a 40 kg child at $\frac{30\times2.0}{40} = 1.5\ \text{m}$.</p>
<div class="callout key"><b class="t">Pick a clever pivot</b>Since $\sum\tau = 0$ about <i>every</i> point, choose the point where an unknown force acts — that force drops out of the torque equation.</div>
<div class="callout warn"><b class="t">Signs</b>Pick a direction (usually counterclockwise = +) and stick to it for every torque.</div>`);

  article("12-2", T`
<p>Equilibrium problems all follow the same routine:</p>
<ol><li>Draw the object and <b>every</b> external force, at the point where it acts.</li><li>Write $\sum F_x = 0$ and $\sum F_y = 0$.</li><li>Choose a pivot (where an unknown acts) and write $\sum\tau = 0$.</li><li>Solve the system — usually three equations, three unknowns.</li></ol>
<h2>Beam on two supports</h2>
<p>Torques about support A give support B's force directly; then $\sum F_y = 0$ gives A's.</p>
<h2>Leaning ladder</h2>
<p>Frictionless wall, rough floor, ladder at angle $\theta$ with the floor:</p>
<ul><li>Vertical: $N_{floor} = (M + m)g$.</li><li>Horizontal: $f_{floor} = N_{wall}$.</li><li>Torque about the foot: $N_{wall}L\sin\theta = Mg\frac L2\cos\theta + mgd\cos\theta$.</li></ul>
<p>The ladder slips if the needed friction exceeds $\mu_sN_{floor}$ — climbing higher (larger $d$) makes it worse.</p>
<h2>Boom and cable</h2>
<p>For a hinged horizontal boom held by a cable at angle $\phi$: torques about the hinge give $T\sin\phi\cdot L = Mg\frac L2 + m_{load}gL$; then the hinge components follow from force balance.</p>
<div class="callout key"><b class="t">Elasticity (book 12.3)</b>Stress, strain and Young's modulus are in your textbook but not on the AP Physics C: Mechanics exam.</div>`);

  problem("12-1", "seesaw", {
    title: "Balance a seesaw", level: 1,
    gen(r) {
      const L = r.num(3, 5, 0.5), m1 = r.int(20, 50), d1 = r.num(0.8, L / 2, 0.1); let m2 = r.int(20, 60); if (m2 === m1) m2 += 5;
      const d2 = (m1 * d1) / m2;
      if (d2 > L / 2) return this.gen(r);
      return { q: T`<p>A $${L}\ \text{m}$ uniform seesaw is pivoted at its center. A $${m1}\ \text{kg}$ child sits $${d1}\ \text{m}$ to the left of the pivot. How far to the right of the pivot must a $${m2}\ \text{kg}$ child sit to balance it?</p>`,
        answer: d2, unit: "m",
        hints: ["The seesaw's own weight acts at the pivot — no torque.", T`$m_1gd_1 = m_2gd_2$`],
        solution: [T`$d_2 = \frac{m_1d_1}{m_2} = \frac{${m1}(${d1})}{${m2}} = ${sig(d2)}\ \text{m}$`],
        model: { type: "beam", L, M: 10, supports: [L / 2], loads: [{ x: d2 + L / 2, m: m2, label: `${m2} kg` }, { x: L / 2 - d1, m: m1, label: `${m1} kg` }] } };
    },
  });
  problem("12-1", "forearm", {
    title: "Biceps force holding a ball", level: 2,
    gen(r) {
      const db = r.num(0.03, 0.06, 0.005), dball = r.num(0.3, 0.4, 0.01), dArm = r.num(0.13, 0.18, 0.01), mBall = r.num(1, 10, 0.5), mArm = r.num(1, 2.5, 0.1);
      const Fb = (mBall * g * dball + mArm * g * dArm) / db;
      return { q: T`<p>You hold your forearm horizontal with a $${mBall}\ \text{kg}$ ball in your hand, $${dball}\ \text{m}$ from the elbow. The forearm ($${mArm}\ \text{kg}$) has its center of mass $${dArm}\ \text{m}$ from the elbow. The biceps pulls straight up $${db}\ \text{m}$ from the elbow. What force must the biceps exert?</p>`,
        answer: Fb, unit: "N",
        hints: ["Take torques about the elbow — the unknown joint force drops out.", T`$F_b(${db}) = m_{ball}g(${dball}) + m_{arm}g(${dArm})$`],
        solution: [T`$F_b = \frac{${sig(mBall * g)}(${dball}) + ${sig(mArm * g)}(${dArm})}{${db}} = ${sig(Fb)}\ \text{N}$`, "That's many times the ball's weight — short lever arm, big force."],
        model: { type: "beam", L: dball + 0.03, M: 0, supports: [0, db], loads: [{ x: dball, m: mBall, label: "ball" }, { x: dArm, m: mArm, label: "forearm" }] } };
    },
  });
  problem("12-1", "conditions", {
    title: "Equilibrium concepts", level: 1,
    gen(r) {
      const Q = r.pick([
        { q: "A rigid body has zero net force on it. Which must also be true for it to be in static equilibrium?", right: "The net torque about any point is zero.", wrong: ["Its weight acts at its geometric center.", "The forces are all parallel.", "Nothing else — zero net force is enough."] },
        { q: "When solving for an unknown hinge force, the best point to calculate torques about is…", right: "the hinge itself.", wrong: ["the center of mass.", "the end farthest from the hinge.", "any point — it makes the algebra identical."] },
        { q: "A uniform plank rests on two supports. A person walks from the middle toward support B. The force from support B…", right: "increases.", wrong: ["decreases.", "stays the same.", "becomes zero."] },
      ]);
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0, hints: ["Two conditions: ΣF = 0 and Στ = 0."], solution: [Q.right], model: { type: "beam", L: 4, M: 20, supports: [0.5, 3.5], loads: [{ x: 2.8, m: 60, label: "person" }] } };
    },
  });
  problem("12-2", "beam", {
    title: "Support forces on a beam", level: 2,
    gen(r) {
      const L = r.num(3, 8, 0.5), M = r.int(10, 80), xa = r.pick([0, 0.5]), xb = L - r.pick([0, 0.5, 1]), m = r.int(20, 120), x = r.num(xa + 0.5, xb - 0.5, 0.25), wantA = r.bool();
      const Rb = (m * g * (x - xa) + M * g * (L / 2 - xa)) / (xb - xa), Ra = (m + M) * g - Rb;
      return { q: T`<p>A $${L}\ \text{m}$ uniform beam of mass $${M}\ \text{kg}$ rests on support A at $x = ${xa}\ \text{m}$ and support B at $x = ${xb}\ \text{m}$. A $${m}\ \text{kg}$ crate sits at $x = ${x}\ \text{m}$. What upward force does support <b>${wantA ? "A" : "B"}</b> exert?</p>`,
        answer: wantA ? Ra : Rb, unit: "N",
        hints: ["Torques about A eliminate the force at A.", T`$R_B(${sig(xb - xa)}) = ${m}g(${sig(x - xa)}) + ${M}g(${sig(L / 2 - xa)})$`, "Then ΣF_y = 0 gives R_A."],
        solution: [T`$R_B = \frac{${sig(m * g)}(${sig(x - xa)}) + ${sig(M * g)}(${sig(L / 2 - xa)})}{${sig(xb - xa)}} = ${sig(Rb)}\ \text{N}$`, T`$R_A = (${m} + ${M})g - R_B = ${sig(Ra)}\ \text{N}$`],
        model: { type: "beam", L, M, supports: [xa, xb], loads: [{ x, m, label: "crate" }] } };
    },
  });
  problem("12-2", "ladder", {
    title: "Ladder: minimum coefficient of friction", level: 3,
    gen(r) {
      const L = r.num(3, 8, 0.5), M = r.int(8, 30), th = r.pick([50, 53, 60, 65, 70]), m = r.int(50, 90), d = +(L * r.pick([0.5, 0.6, 0.75, 0.8])).toFixed(2), want = r.pick(["mu", "Nw"]);
      const Nw = ((M * g * (L / 2) + m * g * d) * Math.cos(rad(th))) / (L * Math.sin(rad(th))), Nf = (M + m) * g, mu = Nw / Nf;
      return { q: T`<p>A uniform $${L}\ \text{m}$, $${M}\ \text{kg}$ ladder leans against a frictionless wall at $${th}^\circ$ above the floor. A $${m}\ \text{kg}$ painter stands $${d}\ \text{m}$ up the ladder (measured along it). ${want === "mu" ? "What is the minimum coefficient of static friction at the floor to keep the ladder from slipping?" : "What is the normal force from the wall?"}</p>`,
        answer: want === "mu" ? mu : Nw, unit: want === "mu" ? "" : "N",
        hints: ["Torques about the foot: the floor's normal force and friction drop out.", T`$N_wL\sin\theta = Mg\frac L2\cos\theta + mgd\cos\theta$`, T`Then $f = N_w$ and $N_f = (M + m)g$.`],
        solution: [T`$N_w = \frac{(${sig(M * g * L / 2)} + ${sig(m * g * d)})\cos${th}^\circ}{${L}\sin${th}^\circ} = ${sig(Nw)}\ \text{N}$`, T`$N_f = ${sig(Nf)}\ \text{N}$`, T`$\mu_{min} = f/N_f = ${sig(mu)}$`],
        model: { type: "beam", mode: "ladder", L, M, m, d, theta: th } };
    },
  });
  problem("12-2", "boom", {
    title: "Cable tension on a hinged boom", level: 3,
    gen(r) {
      const L = r.num(1, 4, 0.5), M = r.int(5, 40), mL = r.int(10, 100), phi = r.pick([25, 30, 37, 45, 53]), want = r.pick(["T", "H"]);
      const Tn = (M * g * (L / 2) + mL * g * L) / (L * Math.sin(rad(phi))), Hh = Tn * Math.cos(rad(phi));
      return { q: T`<p>A uniform horizontal boom ($${M}\ \text{kg}$, $${L}\ \text{m}$) is hinged to a wall at one end. A cable from its far end to the wall makes $${phi}^\circ$ with the boom. A $${mL}\ \text{kg}$ load hangs from the far end. What is ${want === "T" ? "the tension in the cable" : "the horizontal force the hinge exerts on the boom"}?</p>`,
        answer: want === "T" ? Tn : Hh, unit: "N",
        hints: ["Torques about the hinge.", T`$T\sin\phi\cdot L = Mg\frac L2 + m g L$`, "Horizontal balance: H = T cos φ."],
        solution: [T`$T = \frac{Mg/2 + mg}{\sin${phi}^\circ} = ${sig(Tn)}\ \text{N}$`, T`$H = T\cos${phi}^\circ = ${sig(Hh)}\ \text{N}$`],
        model: { type: "beam", mode: "boom", L, M, mL, phi } };
    },
  });
})();
