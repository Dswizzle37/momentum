/* Chapter 3 — Vectors */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
  const angOf = (x, y) => { let a = deg(Math.atan2(y, x)); if (a < 0) a += 360; return a; };

  article("3-1", T`
<p>A <b>scalar</b> has only a size (mass, time, temperature, speed). A <b>vector</b> has a size and a direction (displacement, velocity, force). In print vectors are bold or carry an arrow: $\vec a$.</p>
<h2>Components</h2>
<p>Any 2D vector can be split into perpendicular pieces along the axes. If $\vec a$ has magnitude $a$ and makes angle $\theta$ with the $+x$ axis (measured counterclockwise):</p>
<div class="eq">$a_x = a\cos\theta \qquad a_y = a\sin\theta$</div>
<p>Going the other way:</p>
<div class="eq">$a = \sqrt{a_x^2 + a_y^2} \qquad \tan\theta = \dfrac{a_y}{a_x}$</div>
<div class="callout warn"><b class="t">The calculator trap</b>$\tan^{-1}$ only returns angles between −90° and 90°. If $a_x < 0$ the vector is in the 2nd or 3rd quadrant, so add 180° to the calculator's answer. Always sketch the vector to check.</div>
<div class="worked"><div class="wt">Worked example</div>A hiker's displacement is 8.0 km at 140° from $+x$.<br>$d_x = 8.0\cos140^\circ = -6.1\ \text{km}$, $d_y = 8.0\sin140^\circ = +5.1\ \text{km}$ — northwest, as the sketch would show.</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>Right-triangle trig ($\sin\theta = a/c$ etc.) and the exact values at 30°, 37°, 45°, 53°, 60° are given. Problems that use 37° and 53° are a hint to use the 3-4-5 triangle.</div>`);

  article("3-2", T`
<p>Unit vectors $\hat i$, $\hat j$, $\hat k$ have length 1 and point along $+x$, $+y$, $+z$. They let us write any vector compactly:</p>
<div class="eq">$\vec a = a_x\hat i + a_y\hat j + a_z\hat k$</div>
<h2>Adding by components</h2>
<p>To add vectors, add their components separately — this is the method you'll use on every AP problem:</p>
<div class="eq">$\vec r = \vec a + \vec b = (a_x + b_x)\hat i + (a_y + b_y)\hat j + (a_z + b_z)\hat k$</div>
<p>Subtraction works the same way: $\vec a - \vec b = \vec a + (-\vec b)$, and $-\vec b$ just flips the sign of each component.</p>
<p>Geometrically this is the <b>tip-to-tail</b> rule: place the tail of $\vec b$ at the tip of $\vec a$; the sum runs from the first tail to the last tip.</p>
<div class="worked"><div class="wt">Worked example</div>$\vec a = 4.0\hat i - 3.0\hat j$ m and $\vec b = -1.0\hat i + 7.0\hat j$ m.<br>$\vec r = 3.0\hat i + 4.0\hat j$ m, so $r = 5.0$ m at $\tan^{-1}(4/3) = 53^\circ$.</div>
<div class="callout key"><b class="t">Why components?</b>Adding magnitudes is wrong unless the vectors are parallel. Components turn a geometry problem into arithmetic.</div>`);

  article("3-3", T`
<p>There are two useful ways to "multiply" two vectors. Both show up constantly later: the dot product gives <b>work</b> and <b>power</b>; the cross product gives <b>torque</b> and <b>angular momentum</b>.</p>
<h2>Dot (scalar) product</h2>
<div class="eq">$\vec a\cdot\vec b = ab\cos\phi = a_xb_x + a_yb_y + a_zb_z$</div>
<p>The result is a number. It measures how much the vectors point the same way: maximum when parallel, zero when perpendicular, negative when more than 90° apart. You can find the angle between two vectors with $\cos\phi = \dfrac{\vec a\cdot\vec b}{ab}$.</p>
<h2>Cross (vector) product</h2>
<div class="eq">$|\vec a\times\vec b| = ab\sin\phi$</div>
<p>The result is a vector perpendicular to both $\vec a$ and $\vec b$, with direction given by the <b>right-hand rule</b>: point your fingers along $\vec a$, curl them toward $\vec b$, and your thumb points along $\vec a\times\vec b$. In components:</p>
<div class="eq">$\vec a\times\vec b = (a_yb_z - a_zb_y)\hat i + (a_zb_x - a_xb_z)\hat j + (a_xb_y - a_yb_x)\hat k$</div>
<div class="callout key"><b class="t">Order matters</b>$\vec b\times\vec a = -\vec a\times\vec b$. Also $\hat i\times\hat j = \hat k$, $\hat j\times\hat k = \hat i$, $\hat k\times\hat i = \hat j$.</div>
<div class="worked"><div class="wt">Worked example</div>$\vec a = 3\hat i + 4\hat j$, $\vec b = 2\hat i - 1\hat j$.<br>$\vec a\cdot\vec b = 6 - 4 = 2$. $\vec a\times\vec b = (3)(-1) - (4)(2) = -11\ \hat k$ — into the page.</div>`);

  problem("3-1", "comp", {
    title: "Find the components of a vector", level: 1,
    gen(r) {
      const a = r.num(3, 25, 0.5), th = r.pick([20, 35, 50, 110, 145, 200, 235, 300, 330]), wantY = r.bool();
      const ax = a * Math.cos(rad(th)), ay = a * Math.sin(rad(th));
      return { q: T`<p>A displacement vector $\vec d$ has magnitude $${a}\ \text{m}$ and points at $${th}^\circ$ counterclockwise from the $+x$ axis. What is its ${wantY ? "$y$" : "$x$"}-component?</p>`,
        answer: wantY ? ay : ax, unit: "m", absTol: 0.05,
        hints: [T`$d_x = d\cos\theta$, $d_y = d\sin\theta$ with θ measured from +x.`, "Sketch it: which quadrant is it in? That tells you the signs."],
        solution: [T`$d_x = ${a}\cos${th}^\circ = ${sig(ax)}\ \text{m}$`, T`$d_y = ${a}\sin${th}^\circ = ${sig(ay)}\ \text{m}$`],
        model: { type: "vectors", vecs: [{ x: ax, y: ay, label: "d" }], sum: false, unit: "m" } };
    },
  });
  problem("3-1", "magdir", {
    title: "Magnitude and direction from components", level: 2,
    gen(r) {
      const ax = r.sign() * r.num(1, 12, 0.5), ay = r.sign() * r.num(1, 12, 0.5), wantAng = r.bool();
      const mag = Math.hypot(ax, ay), ang = angOf(ax, ay);
      return { q: T`<p>A force has components $F_x = ${ax}\ \text{N}$ and $F_y = ${ay}\ \text{N}$. What is its ${wantAng ? "direction, measured counterclockwise from $+x$ (0° to 360°)" : "magnitude"}?</p>`,
        answer: wantAng ? ang : mag, unit: wantAng ? "°" : "N", tol: wantAng ? 0.01 : 0.02,
        hints: [wantAng ? T`$\tan\theta = F_y/F_x$ — but check the quadrant! If $F_x < 0$, add 180°.` : T`$F = \sqrt{F_x^2 + F_y^2}$`],
        solution: [T`$F = \sqrt{(${ax})^2 + (${ay})^2} = ${sig(mag)}\ \text{N}$`, T`$\tan^{-1}(${ay}/${ax}) = ${sig(deg(Math.atan(ay / ax)))}^\circ$; the vector is in quadrant ${ax > 0 ? (ay > 0 ? "I" : "IV") : ay > 0 ? "II" : "III"}, so θ = ${sig(ang)}°.`],
        model: { type: "vectors", vecs: [{ x: ax, y: ay, label: "F" }], sum: false, unit: "N" } };
    },
  });
  problem("3-2", "add", {
    title: "Add vectors in unit-vector notation", level: 1,
    gen(r) {
      const v = () => r.sign() * r.int(1, 9);
      const a = [v(), v()], b = [v(), v()], want = r.pick(["mag", "x", "y"]);
      const R = [a[0] + b[0], a[1] + b[1]], mag = Math.hypot(R[0], R[1]);
      return { q: T`<p>$\vec a = (${a[0]}\ \text{m})\hat i + (${a[1]}\ \text{m})\hat j$ and $\vec b = (${b[0]}\ \text{m})\hat i + (${b[1]}\ \text{m})\hat j$. For $\vec r = \vec a + \vec b$, what is ${want === "mag" ? "the magnitude $r$" : want === "x" ? "$r_x$" : "$r_y$"}?</p>`,
        answer: want === "mag" ? mag : want === "x" ? R[0] : R[1], unit: "m", absTol: 0.05,
        hints: ["Add x-components together and y-components together.", T`$\vec r = (${R[0]})\hat i + (${R[1]})\hat j$ m`],
        solution: [T`$r_x = ${a[0]} + (${b[0]}) = ${R[0]}\ \text{m}$, $r_y = ${a[1]} + (${b[1]}) = ${R[1]}\ \text{m}$`, T`$r = \sqrt{${R[0]}^2 + ${R[1]}^2} = ${sig(mag)}\ \text{m}$`],
        model: { type: "vectors", vecs: [{ x: a[0], y: a[1], label: "a" }, { x: b[0], y: b[1], label: "b" }], sumLabel: "r", unit: "m" } };
    },
  });
  problem("3-2", "walk", {
    title: "Resultant of a multi-leg walk", level: 2,
    gen(r) {
      const d1 = r.num(2, 8, 0.5), d2 = r.num(2, 8, 0.5), th2 = r.pick([30, 37, 45, 53, 60]), d3 = r.num(1, 5, 0.5), wantAng = r.bool();
      const L = [{ x: d1, y: 0, label: "d₁" }, { x: d2 * Math.cos(rad(th2)), y: d2 * Math.sin(rad(th2)), label: "d₂" }, { x: 0, y: -d3, label: "d₃" }];
      const R = L.reduce((s, q) => [s[0] + q.x, s[1] + q.y], [0, 0]), mag = Math.hypot(...R), ang = angOf(R[0], R[1]);
      return { q: T`<p>A robot moves $${d1}\ \text{m}$ east, then $${d2}\ \text{m}$ at $${th2}^\circ$ north of east, then $${d3}\ \text{m}$ south. What is the ${wantAng ? "direction of its net displacement (degrees counterclockwise from east)" : "magnitude of its net displacement"}?</p>`,
        answer: wantAng ? ang : mag, unit: wantAng ? "°" : "m", tol: 0.02,
        hints: ["Take east = +x, north = +y. Find each leg's components.", T`Leg 2: $(${d2}\cos${th2}^\circ, ${d2}\sin${th2}^\circ)$`],
        solution: [T`$R_x = ${d1} + ${sig(L[1].x)} + 0 = ${sig(R[0])}\ \text{m}$`, T`$R_y = 0 + ${sig(L[1].y)} - ${d3} = ${sig(R[1])}\ \text{m}$`, T`$R = ${sig(mag)}\ \text{m}$ at $${sig(ang)}^\circ$`],
        model: { type: "vectors", vecs: L, sumLabel: "R", unit: "m" } };
    },
  });
  problem("3-3", "dot", {
    title: "Dot product and the angle between vectors", level: 2,
    gen(r) {
      const v = () => r.sign() * r.int(1, 6);
      const a = [v(), v(), r.int(-3, 3)], b = [v(), v(), r.int(-3, 3)], wantAng = r.bool();
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], ma = Math.hypot(...a), mb = Math.hypot(...b), ang = deg(Math.acos(Math.max(-1, Math.min(1, dot / (ma * mb)))));
      return { q: T`<p>$\vec a = ${a[0]}\hat i + ${a[1]}\hat j + ${a[2]}\hat k$ and $\vec b = ${b[0]}\hat i + ${b[1]}\hat j + ${b[2]}\hat k$. ${wantAng ? "What is the angle between them (degrees)?" : "What is $\\vec a\\cdot\\vec b$?"}</p>`,
        answer: wantAng ? ang : dot, unit: wantAng ? "°" : "", absTol: 0.05, tol: 0.01,
        hints: [T`$\vec a\cdot\vec b = a_xb_x + a_yb_y + a_zb_z$`, ...(wantAng ? [T`$\cos\phi = \frac{\vec a\cdot\vec b}{ab}$`] : [])],
        solution: [T`$\vec a\cdot\vec b = (${a[0]})(${b[0]}) + (${a[1]})(${b[1]}) + (${a[2]})(${b[2]}) = ${dot}$`, T`$a = ${sig(ma)}$, $b = ${sig(mb)}$, $\phi = \cos^{-1}\frac{${dot}}{${sig(ma)}\cdot${sig(mb)}} = ${sig(ang)}^\circ$`],
        model: { type: "vectors", vecs: [{ x: a[0], y: a[1], z: a[2], label: "A" }, { x: b[0], y: b[1], z: b[2], label: "B" }], product: "dot" } };
    },
  });
  problem("3-3", "cross", {
    title: "Cross product (z-component and direction)", level: 2,
    gen(r) {
      const v = () => r.sign() * r.int(1, 7);
      const a = [v(), v()], b = [v(), v()];
      const z = a[0] * b[1] - a[1] * b[0];
      if (z === 0) b[1] += 1;
      const zz = a[0] * b[1] - a[1] * b[0];
      return { q: T`<p>$\vec r = ${a[0]}\hat i + ${a[1]}\hat j$ (m) and $\vec F = ${b[0]}\hat i + ${b[1]}\hat j$ (N). The torque is $\vec\tau = \vec r\times\vec F$. What is $\tau_z$ (in N·m)? A positive answer means out of the page.</p>`,
        answer: zz, unit: "N·m", absTol: 0.05,
        hints: [T`For vectors in the xy-plane, $\vec a\times\vec b = (a_xb_y - a_yb_x)\hat k$.`],
        solution: [T`$\tau_z = r_xF_y - r_yF_x = (${a[0]})(${b[1]}) - (${a[1]})(${b[0]}) = ${zz}\ \text{N·m}$`, zz > 0 ? "Positive: out of the page (counterclockwise rotation)." : "Negative: into the page (clockwise rotation)."],
        model: { type: "vectors", vecs: [{ x: a[0], y: a[1], label: "A" }, { x: b[0], y: b[1], label: "B" }], product: "cross" } };
    },
  });
  problem("3-3", "dotwork", {
    title: "Which pair of vectors is perpendicular?", level: 1,
    gen(r) {
      const k = r.int(1, 4), m = r.int(1, 4);
      const right = T`$(${k}\hat i + ${m}\hat j)$ and $(${-m}\hat i + ${k}\hat j)$`;
      const wrongs = [T`$(${k}\hat i + ${m}\hat j)$ and $(${m}\hat i + ${k}\hat j)$`, T`$(${k}\hat i)$ and $(${k + m}\hat i + ${m}\hat j)$`, T`$(${m}\hat j)$ and $(${k}\hat i + ${m}\hat j)$`];
      return { q: T`<p>Which pair of vectors is perpendicular?</p>`, choices: [right, ...wrongs], correct: 0,
        hints: ["Perpendicular vectors have a dot product of zero."],
        solution: [T`$(${k})(${-m}) + (${m})(${k}) = 0$, so that pair is perpendicular.`, "The other pairs have nonzero dot products."],
        model: { type: "vectors", vecs: [{ x: k, y: m, label: "A" }, { x: -m, y: k, label: "B" }], product: "dot" } };
    },
  });
})();
