/* Chapter 5 — Force and Motion I */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

  article("5-1", T`
<p>Chapters 2–4 described motion. Now we ask <i>why</i> things move the way they do. Newton's answer: forces cause changes in velocity.</p>
<h2>Newton's first law</h2>
<p>If the net force on a body is zero, its velocity does not change — it stays at rest or keeps moving in a straight line at constant speed. Frames in which this holds are <b>inertial frames</b>; the AP exam assumes you're in one unless told otherwise.</p>
<h2>Newton's second law</h2>
<div class="eq">$\vec a_{sys} = \dfrac{\sum\vec F}{m_{sys}} = \dfrac{\vec F_{net}}{m_{sys}}$</div>
<p>This is the form on your equation sheet. It's a vector equation, so it holds separately in each direction: $\sum F_x = ma_x$, $\sum F_y = ma_y$. The SI unit of force is the newton: $1\ \text{N} = 1\ \text{kg·m/s}^2$.</p>
<div class="callout key"><b class="t">"Net" means "add them all"</b>Only the vector sum of all forces determines the acceleration. A body can have huge forces on it and zero acceleration if they cancel.</div>
<div class="worked"><div class="wt">Worked example</div>Two horizontal forces act on a 2.0 kg puck: 6.0 N east and 8.0 N north. $F_{net} = \sqrt{6^2 + 8^2} = 10\ \text{N}$ at 53° north of east, so $a = 10/2.0 = 5.0\ \text{m/s}^2$ in that direction.</div>
<div class="callout warn"><b class="t">Misconception</b>Motion does not require a force; <i>changes</i> in motion do. A hockey puck gliding at constant velocity has zero net force on it.</div>`);

  article("5-2", T`
<p>A handful of forces show up again and again. Learn to recognize them and to draw them on a <b>free-body diagram</b> (FBD): the object as a dot, with every force acting <i>on</i> it drawn as an arrow from the dot.</p>
<h2>The usual suspects</h2>
<ul>
<li><b>Gravitational force (weight)</b> $F_g = mg$, straight down. Near Earth $g = 9.8\ \text{N/kg}$.</li>
<li><b>Normal force</b> $F_N$: a surface pushes perpendicular to itself. It is <i>not</i> always $mg$ — it's whatever is needed to stop the object from sinking into the surface.</li>
<li><b>Tension</b> $T$: a rope pulls along its length, away from the object. An ideal (massless) rope has the same tension throughout.</li>
<li><b>Friction</b> (Chapter 6): parallel to the surface.</li>
</ul>
<h2>Apparent weight</h2>
<p>A scale reads the normal force, not your weight. In an elevator accelerating upward at $a$: $F_N - mg = ma \Rightarrow F_N = m(g + a)$. You feel heavier; accelerating downward you feel lighter.</p>
<div class="worked"><div class="wt">Worked example — pushing at an angle</div>You push a 20 kg crate with 150 N directed 30° <i>below</i> the horizontal. Vertically: $F_N - mg - 150\sin30^\circ = 0$, so $F_N = 196 + 75 = 271\ \text{N}$ — more than the weight.</div>
<div class="callout warn"><b class="t">FBD rules</b>Only forces acting <i>on</i> the object. No "ma" arrow, no "centripetal force" arrow, no velocity arrows. Every force must have an agent (Earth, the floor, the rope…).</div>`);

  article("5-3", T`
<p>Solving a Newton's-laws problem is a routine you can practice until it's automatic.</p>
<ol><li>Draw a free-body diagram for each object.</li><li>Choose axes — for inclines, tilt them so $x$ runs along the slope.</li><li>Write $\sum F_x = ma_x$ and $\sum F_y = ma_y$ for each object.</li><li>Add constraints (e.g., masses tied by a string share the same acceleration magnitude).</li><li>Solve, then check limiting cases.</li></ol>
<h2>Inclines</h2>
<p>On a frictionless incline of angle $\theta$, gravity splits into $mg\sin\theta$ down the slope and $mg\cos\theta$ into the surface. So $a = g\sin\theta$ and $F_N = mg\cos\theta$.</p>
<h2>Connected objects and pulleys</h2>
<p>For an <b>Atwood machine</b> (two masses over a pulley), treat both masses as one system:</p>
<div class="eq">$a = \dfrac{(m_2 - m_1)g}{m_1 + m_2}$</div>
<p>Then use one mass's FBD to find the tension, e.g. $T = m_1(g + a)$.</p>
<h2>Newton's third law</h2>
<p>When A pushes on B, B pushes on A with a force of equal size and opposite direction. Third-law pairs act on <b>different</b> objects, so they never cancel on a single FBD. If you push two blocks in contact, the force between them is $F_{12} = \dfrac{m_2}{m_1 + m_2}F$.</p>
<div class="callout key"><b class="t">Check limits</b>Atwood with $m_1 = m_2$: $a = 0$ ✓. With $m_1 = 0$: $a = g$ ✓. Limits catch algebra mistakes fast.</div>`);

  problem("5-1", "twoforces", {
    title: "Acceleration from two forces", level: 2,
    gen(r) {
      const m = r.num(1, 10, 0.5), F1 = r.int(5, 30), F2 = r.int(5, 30), th2 = r.pick([37, 53, 60, 90, 120, 135]);
      const Fx = F1 + F2 * Math.cos(rad(th2)), Fy = F2 * Math.sin(rad(th2)), Fn = Math.hypot(Fx, Fy), a = Fn / m;
      return { q: T`<p>Two forces act on a $${m}\ \text{kg}$ box on frictionless ice: $${F1}\ \text{N}$ along $+x$ and $${F2}\ \text{N}$ at $${th2}^\circ$ from $+x$. What is the magnitude of the box's acceleration?</p>`,
        answer: a, unit: "m/s²",
        hints: ["Add the forces as vectors (components!), then divide by mass.", T`$F_x = ${F1} + ${F2}\cos${th2}^\circ$, $F_y = ${F2}\sin${th2}^\circ$`],
        solution: [T`$F_x = ${sig(Fx)}\ \text{N}$, $F_y = ${sig(Fy)}\ \text{N}$`, T`$F_{net} = ${sig(Fn)}\ \text{N}$`, T`$a = F_{net}/m = ${sig(a)}\ \text{m/s}^2$`],
        model: { type: "vectors", vecs: [{ x: F1, y: 0, label: "F₁" }, { x: F2 * Math.cos(rad(th2)), y: F2 * Math.sin(rad(th2)), label: "F₂" }], sumLabel: "F_net", unit: "N", title: "Forces add as vectors — the net force sets the acceleration" } };
    },
  });
  problem("5-1", "netforce", {
    title: "Net force on an accelerating car", level: 1,
    gen(r) {
      const m = r.int(800, 2200), v0 = r.int(0, 15), v = v0 + r.int(5, 20), t = r.num(2, 10, 0.5);
      const a = (v - v0) / t, F = m * a;
      return { q: T`<p>A $${m}\ \text{kg}$ car speeds up uniformly from $${v0}\ \text{m/s}$ to $${v}\ \text{m/s}$ in $${t}\ \text{s}$ on a straight road. What is the magnitude of the net force on it?</p>`,
        answer: F, unit: "N",
        hints: [T`$a = \Delta v/\Delta t$`, T`$F_{net} = ma$`],
        solution: [T`$a = (${v} - ${v0})/${t} = ${sig(a)}\ \text{m/s}^2$`, T`$F_{net} = ${m}\times${sig(a)} = ${sig(F)}\ \text{N}$`],
        model: { type: "motion1d", x0: 0, v0, a, tmax: t, obj: "car", facts: [["F_net = ma", `${sig(F)} N`]] } };
    },
  });
  problem("5-1", "first", {
    title: "Newton's first law concepts", level: 1,
    gen(r) {
      const Q = r.pick([
        { q: "A spacecraft far from all stars coasts with its engines off. What happens to its velocity?", right: "It stays constant.", wrong: ["It gradually decreases to zero.", "It increases.", "It changes direction slowly."] },
        { q: "A crate slides across a floor at constant velocity while you push it. Which is true?", right: "The net force on the crate is zero.", wrong: ["Your push is larger than the friction force.", "There is a net force in the direction of motion.", "The crate has no forces on it."] },
        { q: "A ball hangs at rest from a string. Which forces form a Newton's-third-law pair?", right: "Earth pulls the ball down; the ball pulls Earth up.", wrong: ["Earth pulls the ball down; the string pulls the ball up.", "The string pulls the ball up; the ball's weight pulls down.", "There are no third-law pairs when at rest."] },
      ]);
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0, hints: ["Constant velocity ⇔ zero net force. Third-law pairs act on different objects."], solution: [Q.right] };
    },
  });
  problem("5-2", "elevator", {
    title: "Apparent weight in an elevator", level: 1,
    gen(r) {
      const m = r.int(45, 95), a = r.sign() * r.num(0.5, 3.5, 0.5);
      const N = m * (g + a);
      return { q: T`<p>A $${m}\ \text{kg}$ student stands on a bathroom scale in an elevator that is accelerating ${a > 0 ? "upward" : "downward"} at $${Math.abs(a)}\ \text{m/s}^2$. What does the scale read (in newtons)?</p>`,
        answer: N, unit: "N",
        hints: ["The scale reads the normal force.", T`Up = +: $F_N - mg = ma$ with $a = ${a}$.`],
        solution: [T`$F_N = m(g + a) = ${m}(9.8 ${a > 0 ? "+" : "-"} ${Math.abs(a)}) = ${sig(N)}\ \text{N}$`, T`Compare true weight $mg = ${sig(m * g)}\ \text{N}$.`],
        model: { type: "forces", setup: "elevator", m, a } };
    },
  });
  problem("5-2", "pushangle", {
    title: "Normal force when pushing at an angle", level: 2,
    gen(r) {
      const m = r.int(5, 40), F = r.int(20, 150), th = r.pick([20, 30, 37, 45, 53]), down = r.bool();
      const N = m * g + (down ? 1 : -1) * F * Math.sin(rad(th));
      return { q: T`<p>You ${down ? "push" : "pull"} a $${m}\ \text{kg}$ box across a floor with a force of $${F}\ \text{N}$ directed $${th}^\circ$ ${down ? "below" : "above"} the horizontal. The box stays on the floor. What is the normal force on the box?</p>`,
        answer: N, unit: "N",
        hints: ["The box doesn't accelerate vertically, so ΣF_y = 0.", T`The vertical part of your force is $${F}\sin${th}^\circ = ${sig(F * Math.sin(rad(th)))}\ \text{N}$, ${down ? "pressing down" : "lifting up"}.`],
        solution: [T`$F_N ${down ? "-" : "+"} F\sin\theta - mg = 0$`, T`$F_N = ${sig(m * g)} ${down ? "+" : "-"} ${sig(F * Math.sin(rad(th)))} = ${sig(N)}\ \text{N}$`],
        model: { type: "forces", setup: "flat", m, F, Fang: down ? -th : th, mus: 0, muk: 0 } };
    },
  });
  problem("5-2", "ropes", {
    title: "Tension in two supporting ropes", level: 3,
    gen(r) {
      const m = r.int(2, 30), t1 = r.pick([30, 37, 45, 53, 60]), t2 = r.pick([30, 37, 45, 53, 60]), wantLeft = r.bool();
      const W = m * g, T1 = (W * Math.cos(rad(t2))) / Math.sin(rad(t1 + t2)), T2 = (W * Math.cos(rad(t1))) / Math.sin(rad(t1 + t2));
      return { q: T`<p>A $${m}\ \text{kg}$ sign hangs from two ropes. The left rope makes $${t1}^\circ$ with the horizontal ceiling and the right rope makes $${t2}^\circ$. What is the tension in the <b>${wantLeft ? "left" : "right"}</b> rope?</p>`,
        answer: wantLeft ? T1 : T2, unit: "N",
        hints: ["The knot is in equilibrium: ΣF_x = 0 and ΣF_y = 0.", T`x: $T_1\cos${t1}^\circ = T_2\cos${t2}^\circ$; y: $T_1\sin${t1}^\circ + T_2\sin${t2}^\circ = mg$`],
        solution: [T`From x: $T_2 = T_1\cos${t1}^\circ/\cos${t2}^\circ$`, T`Substitute into y and solve: $T_1 = \frac{mg\cos${t2}^\circ}{\sin(${t1}^\circ + ${t2}^\circ)} = ${sig(T1)}\ \text{N}$`, T`$T_2 = ${sig(T2)}\ \text{N}$`],
        model: { type: "forces", setup: "hanging", m, th1: t1, th2: t2 } };
    },
  });
  problem("5-3", "atwood", {
    title: "Atwood machine", level: 2,
    gen(r) {
      const m1 = r.num(0.5, 5, 0.5); let m2 = r.num(0.5, 5, 0.5); if (m2 === m1) m2 += 0.5;
      const a = (Math.abs(m2 - m1) * g) / (m1 + m2), wantT = r.bool(), Tn = (2 * m1 * m2 * g) / (m1 + m2);
      return { q: T`<p>Masses $m_1 = ${m1}\ \text{kg}$ and $m_2 = ${m2}\ \text{kg}$ hang on either side of a light, frictionless pulley. What is the ${wantT ? "tension in the string" : "magnitude of the acceleration of the masses"}?</p>`,
        answer: wantT ? Tn : a, unit: wantT ? "N" : "m/s²",
        hints: ["As a system: net force = (heavier − lighter)g; total mass = m₁ + m₂.", "For tension, apply ΣF = ma to just one mass."],
        solution: [T`$a = \frac{|m_2 - m_1|g}{m_1 + m_2} = ${sig(a)}\ \text{m/s}^2$`, T`For the lighter mass: $T - m_{light}g = m_{light}a \Rightarrow T = ${sig(Tn)}\ \text{N}$`],
        model: { type: "atwood", setup: "atwood", m1, m2 } };
    },
  });
  problem("5-3", "incline", {
    title: "Block on a frictionless incline", level: 1,
    gen(r) {
      const m = r.num(1, 20, 0.5), th = r.pick([15, 20, 25, 30, 37, 45, 53]), wantN = r.bool();
      return { q: T`<p>A $${m}\ \text{kg}$ block slides down a frictionless ramp inclined at $${th}^\circ$. What is ${wantN ? "the normal force on the block" : "the block's acceleration"}?</p>`,
        answer: wantN ? m * g * Math.cos(rad(th)) : g * Math.sin(rad(th)), unit: wantN ? "N" : "m/s²",
        hints: ["Tilt your axes: x down the slope, y perpendicular.", wantN ? T`No acceleration perpendicular to the ramp: $F_N = mg\cos\theta$.` : T`Along the slope only $mg\sin\theta$ acts: $a = g\sin\theta$.`],
        solution: [T`$a = g\sin${th}^\circ = ${sig(g * Math.sin(rad(th)))}\ \text{m/s}^2$ (independent of mass)`, T`$F_N = mg\cos${th}^\circ = ${sig(m * g * Math.cos(rad(th)))}\ \text{N}$`],
        model: { type: "forces", setup: "incline", m, theta: th, mus: 0, muk: 0 } };
    },
  });
  problem("5-3", "table", {
    title: "Block on a table pulled by a hanging mass", level: 2,
    gen(r) {
      const m1 = r.num(1, 8, 0.5), m2 = r.num(0.5, 5, 0.5), wantT = r.bool();
      const a = (m2 * g) / (m1 + m2), Tn = m1 * a;
      return { q: T`<p>A $${m1}\ \text{kg}$ cart on a frictionless table is tied by a string over a light pulley to a hanging $${m2}\ \text{kg}$ mass. What is the ${wantT ? "tension in the string" : "acceleration of the cart"}?</p>`,
        answer: wantT ? Tn : a, unit: wantT ? "N" : "m/s²",
        hints: ["The only unbalanced external force on the system is m₂g.", T`System: $a = \frac{m_2g}{m_1 + m_2}$. Cart alone: $T = m_1a$.`],
        solution: [T`$a = \frac{${m2}(9.8)}{${m1} + ${m2}} = ${sig(a)}\ \text{m/s}^2$`, T`$T = m_1a = ${sig(Tn)}\ \text{N}$ — less than $m_2g = ${sig(m2 * g)}$ N, because m₂ accelerates downward.`],
        model: { type: "atwood", setup: "table", m1, m2, muk: 0 } };
    },
  });
  problem("5-3", "contact", {
    title: "Two blocks pushed together (third law)", level: 2,
    gen(r) {
      const m1 = r.num(1, 10, 0.5), m2 = r.num(1, 10, 0.5), F = r.int(5, 60);
      const a = F / (m1 + m2), F12 = m2 * a;
      return { q: T`<p>Two blocks sit side by side on a frictionless floor: $m_1 = ${m1}\ \text{kg}$ on the left and $m_2 = ${m2}\ \text{kg}$ on the right. You push $m_1$ to the right with $${F}\ \text{N}$. What force does $m_1$ exert on $m_2$?</p>`,
        answer: F12, unit: "N",
        hints: ["Both blocks share the same acceleration: a = F/(m₁+m₂).", "The only horizontal force on m₂ is the push from m₁."],
        solution: [T`$a = ${F}/(${m1} + ${m2}) = ${sig(a)}\ \text{m/s}^2$`, T`$F_{12} = m_2a = ${sig(F12)}\ \text{N}$`, T`By the third law, m₂ pushes back on m₁ with ${sig(F12)} N to the left.`],
        model: { type: "forces", setup: "flat", m: m1 + m2, F, Fang: 0, mus: 0, muk: 0 } };
    },
  });
})();
