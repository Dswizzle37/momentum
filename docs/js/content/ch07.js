/* Chapter 7 — Kinetic Energy and Work */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180;

  article("7-1", T`
<p>Forces and accelerations are vectors and can get messy. Energy is a scalar bookkeeping system that often gives answers much faster — especially when you only care about speeds and positions, not times.</p>
<h2>Kinetic energy</h2>
<div class="eq">$K = \tfrac12mv^2$</div>
<p>Measured in joules: $1\ \text{J} = 1\ \text{kg·m}^2/\text{s}^2 = 1\ \text{N·m}$. Note it depends on speed squared and is never negative.</p>
<h2>Work</h2>
<p>A force does work on an object when the object moves with a component of displacement along the force:</p>
<div class="eq">$W = \int_a^b\vec F\cdot d\vec r \quad\xrightarrow{\text{constant }F}\quad W = Fd\cos\phi$</div>
<p>Work is positive if the force has a component along the motion, negative if opposite, and zero if perpendicular (like the normal force on a sliding block, or the centripetal force in circular motion).</p>
<h2>The work–kinetic energy theorem</h2>
<div class="eq">$\Delta K = W_{net} = \sum W_i$</div>
<p>The <b>net</b> work done by all forces equals the change in kinetic energy. This is just Newton's second law integrated over distance.</p>
<div class="worked"><div class="wt">Worked example</div>A 4.0 kg block starts from rest on a frictionless floor and is pushed 3.0 m by a 12 N horizontal force.<br>$W = (12)(3.0) = 36\ \text{J} = \tfrac12(4.0)v^2 \Rightarrow v = 4.2\ \text{m/s}$.</div>
<div class="callout warn"><b class="t">Common mistake</b>Using a single force's work in the theorem when several forces act. ΔK equals the work done by <i>all</i> of them (including friction's negative work).</div>`);

  article("7-2", T`
<p>Gravity is a constant force $m\vec g$ near Earth, so its work depends only on the vertical displacement:</p>
<div class="eq">$W_g = mgd\cos\phi = -mg\Delta y$</div>
<p>Going down ($\Delta y < 0$), gravity does positive work; going up, negative work. The path doesn't matter — sliding down a long gentle ramp or dropping straight down the same height gives the same $W_g$.</p>
<h2>Lifting and lowering</h2>
<p>If you lift an object and it starts and ends at rest, $\Delta K = 0$, so your work exactly cancels gravity's:</p>
<div class="eq">$W_{you} = -W_g = mg\Delta y$</div>
<p>If the object speeds up on the way, you do extra work equal to the gain in kinetic energy.</p>
<div class="worked"><div class="wt">Worked example — a ramp</div>A 15 kg box slides 4.0 m down a 30° ramp. $\Delta y = -4.0\sin30^\circ = -2.0\ \text{m}$, so $W_g = -(15)(9.8)(-2.0) = +294\ \text{J}$.</div>
<div class="callout key"><b class="t">Why it's path-independent</b>On a ramp only the component $mg\sin\theta$ does work, over length $L$: $mg\sin\theta\cdot L = mg\cdot h$. That's the first hint that gravity is a <i>conservative</i> force (Chapter 8).</div>`);

  article("7-3", T`
<p>An ideal spring exerts a force proportional to how far it's stretched or compressed from its relaxed length — Hooke's law (on your equation sheet):</p>
<div class="eq">$\vec F_s = -k\Delta\vec x$</div>
<p>The minus sign means the force always points back toward the relaxed position. $k$ (N/m) is the spring constant: a stiff spring has a large $k$.</p>
<h2>Work done by a spring</h2>
<p>Because the force changes with position, integrate:</p>
<div class="eq">$W_s = \int_{x_i}^{x_f}(-kx)\,dx = \tfrac12kx_i^2 - \tfrac12kx_f^2$</div>
<p>Graphically this is the (signed) area of a triangle under the $F$–$x$ line. A spring does positive work when it returns toward its relaxed length and negative work when it's being stretched or compressed further.</p>
<div class="worked"><div class="wt">Worked example — spring launcher</div>A 0.20 kg block is pressed 0.10 m into a spring with $k = 500\ \text{N/m}$ and released on a frictionless floor.<br>$W_s = \tfrac12(500)(0.10)^2 = 2.5\ \text{J} = \tfrac12(0.20)v^2 \Rightarrow v = 5.0\ \text{m/s}$.</div>
<div class="callout warn"><b class="t">Measure from relaxed length</b>$x$ in Hooke's law is the displacement from the spring's <i>natural</i> length, not from wherever the block happens to start.</div>`);

  article("7-4", T`
<p>When a force changes with position, $W = Fd$ fails. Go back to the definition:</p>
<div class="eq">$W = \int_{x_i}^{x_f}F_x(x)\,dx$</div>
<p>This is the <b>area under the $F$–$x$ curve</b> between the starting and ending positions (negative where the curve is below the axis).</p>
<h2>Two ways the AP exam asks it</h2>
<ul><li><b>Function given:</b> integrate. E.g. $F = 3x^2$ N from 0 to 2 m: $W = [x^3]_0^2 = 8\ \text{J}$.</li><li><b>Graph given:</b> add up rectangles, triangles and trapezoids.</li></ul>
<p>Then apply the work–kinetic energy theorem to get speeds: $\tfrac12mv_f^2 = \tfrac12mv_i^2 + W$.</p>
<div class="callout sheet"><b class="t">On your equation sheet</b>$W = \int_a^b\vec F\cdot d\vec r$ and $\int x^n dx = \frac{x^{n+1}}{n+1}$.</div>
<div class="callout key"><b class="t">In 3D</b>$W = \int(F_xdx + F_ydy + F_zdz)$ — integrate each component over its own coordinate.</div>`);

  article("7-5", T`
<p>Power is the <b>rate</b> of doing work (or transferring energy). Two engines can do the same work, but the more powerful one does it faster.</p>
<div class="eq">$P_{avg} = \dfrac{W}{\Delta t} = \dfrac{\Delta E}{\Delta t} \qquad P_{inst} = \dfrac{dW}{dt}$</div>
<p>The unit is the watt: $1\ \text{W} = 1\ \text{J/s}$. (1 horsepower ≈ 746 W.)</p>
<h2>Power and velocity</h2>
<p>For a force acting on a moving object, $dW = \vec F\cdot d\vec r$, so</p>
<div class="eq">$P = \vec F\cdot\vec v = Fv\cos\phi$</div>
<div class="worked"><div class="wt">Worked example</div>A car cruises at 30 m/s against 600 N of air drag and rolling friction. The engine must supply $P = Fv = 600 \times 30 = 18\ \text{kW}$ (24 hp).</div>
<div class="callout warn"><b class="t">Constant force, growing power</b>If a constant force accelerates an object from rest, $v$ grows, so the power $Fv$ grows too — power is not constant just because force is.</div>`);

  // ---------- 7-1 ----------
  problem("7-1", "push", {
    title: "Final speed from work done", level: 1,
    gen(r) {
      const m = r.num(1, 10, 0.5), F = r.int(5, 60), d = r.num(1, 10, 0.5), vi = r.pick([0, 0, r.num(1, 4, 0.5)]);
      const W = F * d, v = Math.sqrt(vi * vi + (2 * W) / m);
      return { q: T`<p>A $${m}\ \text{kg}$ cart ${vi ? T`moving at $${vi}\ \text{m/s}$` : "initially at rest"} on a frictionless track is pushed by a constant $${F}\ \text{N}$ force (along the track) for $${d}\ \text{m}$. What is its final speed?</p>`,
        answer: v, unit: "m/s",
        hints: [T`Work: $W = Fd$.`, T`Work–KE theorem: $\tfrac12mv_f^2 = \tfrac12mv_i^2 + W$`],
        solution: [T`$W = ${F}\times${d} = ${sig(W)}\ \text{J}$`, T`$\tfrac12(${m})v_f^2 = ${sig(0.5 * m * vi * vi)} + ${sig(W)}$`, T`$v_f = ${sig(v)}\ \text{m/s}$`],
        model: { type: "forcegraph", F: () => F, x1: 0, x2: d, xr: [0, d * 1.15], m, vi } };
    },
  });
  problem("7-1", "angle", {
    title: "Work by a force at an angle", level: 1,
    gen(r) {
      const F = r.int(10, 120), d = r.num(1, 20, 0.5), th = r.pick([0, 25, 30, 37, 45, 53, 60, 90, 120, 150]);
      const W = F * d * Math.cos(rad(th));
      return { q: T`<p>A child pulls a sled $${d}\ \text{m}$ across level snow with a rope that makes $${th}^\circ$ with the direction of motion. The rope tension is $${F}\ \text{N}$. How much work does the rope do on the sled?</p>`,
        answer: W, unit: "J", absTol: 0.5,
        hints: [T`$W = Fd\cos\phi$ — only the component along the motion does work.`],
        solution: [T`$W = (${F})(${d})\cos${th}^\circ = ${sig(W)}\ \text{J}$`, th === 90 ? "Perpendicular force: no work." : th > 90 ? "The force opposes the motion, so the work is negative." : "Positive: the force has a component along the motion."],
        model: { type: "forcegraph", F: () => F * Math.cos(rad(th)), x1: 0, x2: d, xr: [0, d * 1.15], fu: "N (along motion)" } };
    },
  });
  problem("7-1", "network", {
    title: "Net work with friction", level: 2,
    gen(r) {
      const m = r.int(2, 20), F = r.int(20, 120), muk = r.num(0.1, 0.4, 0.05), d = r.num(1, 8, 0.5);
      const f = muk * m * g; if (F <= f) return this.gen(r);
      const Wn = (F - f) * d, v = Math.sqrt((2 * Wn) / m), want = r.bool();
      return { q: T`<p>A $${m}\ \text{kg}$ crate starts from rest and is pushed $${d}\ \text{m}$ across a floor by a horizontal $${F}\ \text{N}$ force. The coefficient of kinetic friction is $${muk}$. What is ${want ? "the net work done on the crate" : "the crate's final speed"}?</p>`,
        answer: want ? Wn : v, unit: want ? "J" : "m/s",
        hints: [T`Friction does negative work: $W_f = -\mu_kmgd$.`, T`$W_{net} = (F - \mu_kmg)d = \Delta K$`],
        solution: [T`$W_F = ${sig(F * d)}\ \text{J}$, $W_f = -${sig(f * d)}\ \text{J}$, $W_{N} = W_g = 0$`, T`$W_{net} = ${sig(Wn)}\ \text{J}$`, T`$v = \sqrt{2W_{net}/m} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "forcegraph", F: () => F - f, x1: 0, x2: d, xr: [0, d * 1.15], m, vi: 0, fu: "N (net)" } };
    },
  });
  // ---------- 7-2 ----------
  problem("7-2", "ramp", {
    title: "Work done by gravity on a ramp", level: 1,
    gen(r) {
      const m = r.num(1, 30, 0.5), L = r.num(1, 10, 0.5), th = r.pick([15, 20, 30, 37, 45, 53]), down = r.bool();
      const h = L * Math.sin(rad(th)), W = (down ? 1 : -1) * m * g * h;
      return { q: T`<p>A $${m}\ \text{kg}$ box is ${down ? "slides down" : "pushed up"} a ramp a distance of $${L}\ \text{m}$ along a $${th}^\circ$ incline. How much work does gravity do on the box?</p>`.replace("is slides", "slides"),
        answer: W, unit: "J",
        hints: [T`Only the height change matters: $W_g = -mg\Delta y$.`, T`$\Delta y = ${down ? "-" : "+"}L\sin\theta$`],
        solution: [T`$|\Delta y| = ${L}\sin${th}^\circ = ${sig(h)}\ \text{m}$`, T`$W_g = ${down ? "+" : "-"}mg|\Delta y| = ${sig(W)}\ \text{J}$`],
        model: { type: "energy", scene: "ramp", m, h, theta: th, muk: 0, floor: 1 } };
    },
  });
  problem("7-2", "lift", {
    title: "Lifting with an accelerating cable", level: 2,
    gen(r) {
      const m = r.int(50, 800), a = r.num(0.2, 2, 0.1), h = r.int(2, 20), want = r.pick(["WT", "Wg", "K"]);
      const Tn = m * (g + a), WT = Tn * h, Wg = -m * g * h, K = WT + Wg;
      return { q: T`<p>A crane lifts a $${m}\ \text{kg}$ crate from rest straight up through $${h}\ \text{m}$ with a constant upward acceleration of $${a}\ \text{m/s}^2$. ${want === "WT" ? "How much work does the cable tension do?" : want === "Wg" ? "How much work does gravity do?" : "What is the crate's kinetic energy at the end?"}</p>`,
        answer: { WT, Wg, K }[want], unit: "J",
        hints: [T`Tension: $T - mg = ma \Rightarrow T = m(g + a)$.`, T`$W_T = Th$, $W_g = -mgh$, and $\Delta K = W_T + W_g$.`],
        solution: [T`$T = ${m}(9.8 + ${a}) = ${sig(Tn)}\ \text{N}$, $W_T = ${sig(WT)}\ \text{J}$`, T`$W_g = -${sig(m * g * h)}\ \text{J}$`, T`$K_f = W_T + W_g = ${sig(K)}\ \text{J}$ (check: $mah = ${sig(m * a * h)}$ J)`],
        model: { type: "motion1d", axis: "y", orient: "v", x0: 0, v0: 0, a, tmax: Math.sqrt((2 * h) / a), ground: 0, facts: [["W by cable", `${sig(WT)} J`], ["W by gravity", `${sig(Wg)} J`]] } };
    },
  });
  // ---------- 7-3 ----------
  problem("7-3", "springwork", {
    title: "Work done by a spring between two positions", level: 2,
    gen(r) {
      const k = r.int(50, 800), x1 = r.num(0, 0.3, 0.02), x2 = r.num(0.02, 0.4, 0.02);
      const W = 0.5 * k * (x1 * x1 - x2 * x2);
      return { q: T`<p>A spring with $k = ${k}\ \text{N/m}$ is stretched from $x_i = ${x1}\ \text{m}$ to $x_f = ${x2}\ \text{m}$ (measured from its relaxed length). How much work does the <b>spring</b> do?</p>`,
        answer: W, unit: "J", absTol: 0.005,
        hints: [T`$W_s = \tfrac12kx_i^2 - \tfrac12kx_f^2$`, "Stretching further → the spring does negative work."],
        solution: [T`$W_s = \tfrac12(${k})(${x1}^2 - ${x2}^2) = ${sig(W)}\ \text{J}$`],
        model: { type: "forcegraph", F: (x) => -k * x, x1, x2, xr: [Math.min(0, x1, x2) - 0.05, Math.max(x1, x2) + 0.05] } };
    },
  });
  problem("7-3", "launch", {
    title: "Spring launcher speed", level: 1,
    gen(r) {
      const k = r.int(100, 1500), x = r.num(0.03, 0.25, 0.01), m = r.num(0.05, 2, 0.05);
      const v = x * Math.sqrt(k / m);
      return { q: T`<p>A $${m}\ \text{kg}$ block is pushed against a spring ($k = ${k}\ \text{N/m}$), compressing it $${x}\ \text{m}$, and released on a frictionless surface. What is the block's speed after it leaves the spring?</p>`,
        answer: v, unit: "m/s",
        hints: [T`The spring's work becomes kinetic energy: $\tfrac12kx^2 = \tfrac12mv^2$.`],
        solution: [T`$W_s = \tfrac12(${k})(${x})^2 = ${sig(0.5 * k * x * x)}\ \text{J}$`, T`$v = x\sqrt{k/m} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "energy", scene: "spring", m, k, x0: x, muk: 0 } };
    },
  });
  problem("7-3", "findk", {
    title: "Find k, then the stored work", level: 2,
    gen(r) {
      const F = r.int(5, 80), s = r.num(0.02, 0.2, 0.01), x = r.num(0.05, 0.4, 0.01);
      const k = F / s, W = 0.5 * k * x * x;
      return { q: T`<p>A force of $${F}\ \text{N}$ stretches a spring by $${s}\ \text{m}$. How much work must you do to stretch it from its relaxed length to $${x}\ \text{m}$?</p>`,
        answer: W, unit: "J",
        hints: [T`$k = F/x$ from the first measurement.`, T`$W_{you} = \tfrac12kx^2$`],
        solution: [T`$k = ${F}/${s} = ${sig(k)}\ \text{N/m}$`, T`$W = \tfrac12(${sig(k)})(${x})^2 = ${sig(W)}\ \text{J}$`],
        model: { type: "forcegraph", F: (xx) => k * xx, x1: 0, x2: x, xr: [0, x * 1.15], fu: "N (your force)" } };
    },
  });
  // ---------- 7-4 ----------
  problem("7-4", "cx2", {
    title: "Work by F(x) = cxⁿ", level: 2,
    gen(r) {
      const c = r.num(0.5, 6, 0.5), n = r.pick([2, 3]), a = r.num(0, 1, 0.5), b = a + r.num(1, 3, 0.5);
      const W = (c / (n + 1)) * (b ** (n + 1) - a ** (n + 1));
      return { q: T`<p>A force $F(x) = ${c}x^${n}$ (N, with $x$ in m) acts along the $x$-axis on a particle that moves from $x = ${a}\ \text{m}$ to $x = ${b}\ \text{m}$. How much work does the force do?</p>`,
        answer: W, unit: "J",
        hints: [T`$W = \int_{${a}}^{${b}} ${c}x^${n}\,dx$`, T`$\int x^n dx = \frac{x^{n+1}}{n+1}$`],
        solution: [T`$W = \frac{${c}}{${n + 1}}\left[x^{${n + 1}}\right]_{${a}}^{${b}} = \frac{${c}}{${n + 1}}(${sig(b ** (n + 1), 4)} - ${sig(a ** (n + 1), 4)})$`, T`$W = ${sig(W)}\ \text{J}$`],
        model: { type: "forcegraph", F: (x) => c * x ** n, x1: a, x2: b, xr: [0, b * 1.1] } };
    },
  });
  problem("7-4", "linear", {
    title: "Variable force and final speed", level: 3,
    gen(r) {
      const A = r.int(10, 40), B = r.int(2, 10), m = r.num(0.5, 5, 0.5), d = r.num(1, A / B, 0.5);
      const W = A * d - 0.5 * B * d * d, v = Math.sqrt((2 * W) / m);
      return { q: T`<p>A $${m}\ \text{kg}$ object starts from rest at $x = 0$ and is acted on by a net force $F(x) = ${A} - ${B}x$ (N, $x$ in m). What is its speed at $x = ${d}\ \text{m}$?</p>`,
        answer: v, unit: "m/s",
        hints: [T`$W = \int_0^{${d}}(${A} - ${B}x)dx$`, T`Then $\tfrac12mv^2 = W$.`],
        solution: [T`$W = ${A}(${d}) - \tfrac{${B}}{2}(${d})^2 = ${sig(W)}\ \text{J}$`, T`$v = \sqrt{2W/m} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "forcegraph", F: (x) => A - B * x, x1: 0, x2: d, xr: [0, Math.max(d * 1.2, A / B * 1.1)], m, vi: 0 } };
    },
  });
  problem("7-4", "graph", {
    title: "Work from a piecewise F–x graph", level: 1,
    gen(r) {
      const F0 = r.int(4, 20), x1 = r.int(1, 4), x2 = x1 + r.int(1, 4), x3 = x2 + r.int(1, 3);
      const W = 0.5 * F0 * x1 + F0 * (x2 - x1) + 0.5 * F0 * (x3 - x2);
      const F = (x) => (x < 0 ? 0 : x < x1 ? (F0 * x) / x1 : x < x2 ? F0 : x < x3 ? F0 * (1 - (x - x2) / (x3 - x2)) : 0);
      return { q: T`<p>The force on a particle rises linearly from 0 at $x = 0$ to $${F0}\ \text{N}$ at $x = ${x1}\ \text{m}$, stays at $${F0}\ \text{N}$ until $x = ${x2}\ \text{m}$, then falls linearly to 0 at $x = ${x3}\ \text{m}$. How much work does it do from $x = 0$ to $x = ${x3}\ \text{m}$?</p>`,
        answer: W, unit: "J",
        hints: ["Work = area under the F–x graph: triangle + rectangle + triangle."],
        solution: [T`$\tfrac12(${x1})(${F0}) + (${x2 - x1})(${F0}) + \tfrac12(${x3 - x2})(${F0}) = ${sig(W)}\ \text{J}$`],
        model: { type: "forcegraph", F, x1: 0, x2: x3, xr: [0, x3 + 1] } };
    },
  });
  // ---------- 7-5 ----------
  problem("7-5", "lift", {
    title: "Average power to lift", level: 1,
    gen(r) {
      const m = r.int(40, 900), h = r.int(3, 40), t = r.int(4, 60);
      const P = (m * g * h) / t;
      return { q: T`<p>An elevator motor raises a $${m}\ \text{kg}$ car at constant speed through $${h}\ \text{m}$ in $${t}\ \text{s}$. What average power does the motor deliver?</p>`,
        answer: P, unit: "W",
        hints: [T`Constant speed: motor work = mgh.`, T`$P = W/\Delta t$`],
        solution: [T`$W = mgh = ${sig(m * g * h)}\ \text{J}$`, T`$P = ${sig(m * g * h)}/${t} = ${sig(P)}\ \text{W}$`],
        model: { type: "motion1d", axis: "y", orient: "v", x0: 0, v0: h / t, a: 0, tmax: t, ground: 0, facts: [["power = mgv", `${sig(P)} W`]] } };
    },
  });
  problem("7-5", "fv", {
    title: "Power at constant speed (P = Fv)", level: 1,
    gen(r) {
      const F = r.int(200, 3000), v = r.int(5, 35), askF = r.bool(), P = F * v;
      return { q: askF ? T`<p>A truck's engine delivers $${sig(P / 1000, 4)}\ \text{kW}$ to the wheels while the truck cruises at a steady $${v}\ \text{m/s}$. What is the total resistive force on the truck?</p>` : T`<p>A cyclist rides at a steady $${v}\ \text{m/s}$ against a total resistive force of $${F}\ \text{N}$. What power must she supply?</p>`,
        answer: askF ? F : P, unit: askF ? "N" : "W",
        hints: ["Constant speed: driving force = resistive force.", T`$P = Fv$`],
        solution: askF ? [T`$F = P/v = ${P}/${v} = ${F}\ \text{N}$`] : [T`$P = Fv = ${F}\times${v} = ${sig(P)}\ \text{W}$`],
        model: { type: "motion1d", x0: 0, v0: v, a: 0, tmax: 4, obj: "car", facts: [["P = Fv", `${sig(P)} W`]] } };
    },
  });
  problem("7-5", "inst", {
    title: "Instantaneous power of a constant force", level: 3,
    gen(r) {
      const m = r.num(1, 20, 0.5), F = r.int(5, 60), t = r.num(1, 6, 0.5);
      const a = F / m, v = a * t, P = F * v;
      return { q: T`<p>A constant net force of $${F}\ \text{N}$ accelerates a $${m}\ \text{kg}$ object from rest. What is the instantaneous power delivered by the force at $t = ${t}\ \text{s}$?</p>`,
        answer: P, unit: "W",
        hints: [T`$v(t) = (F/m)t$`, T`$P = Fv$ — it grows linearly with time.`],
        solution: [T`$a = ${sig(a)}\ \text{m/s}^2$, $v = at = ${sig(v)}\ \text{m/s}$`, T`$P = Fv = ${sig(P)}\ \text{W}$`],
        model: { type: "motion1d", x0: 0, v0: 0, a, tmax: t, obj: "car", facts: [["P at the end", `${sig(P)} W`]] } };
    },
  });
})();
