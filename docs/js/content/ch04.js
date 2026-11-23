/* Chapter 4 — Motion in Two and Three Dimensions */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

  article("4-1", T`
<p>In two or three dimensions, position, velocity and acceleration become vectors. The good news: each component behaves like its own Chapter 2 problem.</p>
<div class="eq">$\vec r = x\hat i + y\hat j + z\hat k \qquad \vec v = \dfrac{d\vec r}{dt} \qquad \vec a = \dfrac{d\vec v}{dt}$</div>
<p>Differentiate component by component: $v_x = dx/dt$, $v_y = dy/dt$, and so on.</p>
<h2>Averages</h2>
<div class="eq">$\vec v_{avg} = \dfrac{\Delta\vec r}{\Delta t} \qquad \vec a_{avg} = \dfrac{\Delta\vec v}{\Delta t}$</div>
<div class="worked"><div class="wt">Worked example</div>$\vec r(t) = (2t^2 - 3t)\hat i + (5t + 1)\hat j$ m.<br>$\vec v = (4t - 3)\hat i + 5\hat j$ m/s, and $\vec a = 4\hat i$ m/s² (constant).<br>At $t = 2\ \text{s}$: $\vec v = 5\hat i + 5\hat j$, speed $7.1\ \text{m/s}$ at 45°.</div>
<div class="callout key"><b class="t">Direction of velocity</b>The velocity vector is always tangent to the path. Acceleration can point anywhere: its component along $\vec v$ changes the speed; its component perpendicular to $\vec v$ bends the path.</div>`);

  article("4-2", T`
<p>A projectile is anything launched and then left to gravity (no air resistance). The key insight, which Galileo noticed: <b>horizontal and vertical motions are independent</b>, linked only by time.</p>
<div class="eq">$a_x = 0 \qquad a_y = -g$</div>
<p>So horizontally the speed is constant; vertically it's Chapter 2 free fall. With launch speed $v_0$ at angle $\theta_0$:</p>
<div class="eq">$x = (v_0\cos\theta_0)t \qquad y = (v_0\sin\theta_0)t - \tfrac12gt^2$</div>
<div class="eq">$v_x = v_0\cos\theta_0 \qquad v_y = v_0\sin\theta_0 - gt$</div>
<h2>Level-ground results</h2>
<p>When launch and landing heights are equal, the range is $R = \dfrac{v_0^2\sin 2\theta_0}{g}$, largest at 45°, and the max height is $H = \dfrac{(v_0\sin\theta_0)^2}{2g}$. These are derived results — not on the equation sheet — so be ready to rebuild them from the component equations, and don't use the range formula when heights differ.</p>
<div class="worked"><div class="wt">Worked example — horizontal launch</div>A ball rolls off a 1.25 m table at 3.0 m/s. Vertical: $1.25 = \tfrac12(9.8)t^2 \Rightarrow t = 0.505\ \text{s}$. Horizontal: $x = 3.0(0.505) = 1.5\ \text{m}$.</div>
<div class="callout warn"><b class="t">Common mistakes</b>Using $v_0$ instead of its components; forgetting that $v_x$ never changes; thinking the velocity is zero at the top (only $v_y$ is).</div>`);

  article("4-3", T`
<p>An object moving in a circle at constant speed is still accelerating, because its velocity keeps changing direction. That acceleration always points toward the center — it is called <b>centripetal</b> ("center-seeking").</p>
<div class="eq">$a_c = \dfrac{v^2}{r} = r\omega^2$</div>
<p>The time for one revolution is the period:</p>
<div class="eq">$T = \dfrac{2\pi r}{v} = \dfrac{2\pi}{\omega} = \dfrac1f$</div>
<div class="worked"><div class="wt">Worked example</div>A centrifuge spins a sample at radius 0.12 m with period 5.0 ms.<br>$v = 2\pi(0.12)/0.005 = 151\ \text{m/s}$; $a_c = v^2/r = 1.9\times10^5\ \text{m/s}^2 \approx 19{,}000\,g$.</div>
<div class="callout key"><b class="t">Picture it</b>The velocity is tangent to the circle and the acceleration points inward — they're perpendicular, so the speed doesn't change, only the direction.</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>$a_c = v^2/r = r\omega^2$ and $T = 2\pi/\omega = 1/f$.</div>`);

  article("4-4", T`
<p>Velocity depends on who is measuring it. A passenger walking down the aisle of a train has one velocity relative to the train and another relative to the ground.</p>
<div class="eq">$\vec v_{PA} = \vec v_{PB} + \vec v_{BA}$</div>
<p>Read it as: (velocity of P relative to A) = (velocity of P relative to B) + (velocity of B relative to A). The inner subscripts "cancel" like a chain.</p>
<h2>River crossings and crosswinds</h2>
<p>A boat's velocity relative to the ground is its velocity relative to the water plus the water's velocity relative to the ground. Split into components:</p>
<ul><li>The across-river component alone determines the crossing time: $t = w / v_{\perp}$.</li><li>The along-river component times that time gives the drift.</li><li>To land directly across, aim upstream at $\sin\theta = v_{river}/v_{boat}$ (only possible if the boat is faster than the river).</li></ul>
<div class="worked"><div class="wt">Worked example</div>A boat (3.0 m/s in still water) points straight across a 60 m river flowing at 1.5 m/s.<br>$t = 60/3.0 = 20\ \text{s}$; drift $= 1.5(20) = 30\ \text{m}$; ground speed $= \sqrt{3.0^2 + 1.5^2} = 3.4\ \text{m/s}$.</div>
<div class="callout key"><b class="t">Accelerations agree</b>Observers moving at constant velocity relative to each other measure the same acceleration — that's why Newton's laws work in every inertial frame.</div>`);

  problem("4-1", "rt", {
    title: "Velocity vector from r(t)", level: 2,
    gen(r) {
      const A = r.num(0.5, 3, 0.5), B = r.int(1, 6), C = r.int(1, 8), D = r.num(0.5, 2, 0.5), t1 = r.int(1, 4), want = r.pick(["speed", "vx", "vy"]);
      const vx = 2 * A * t1 - B, vy = C - 2 * D * t1, sp = Math.hypot(vx, vy);
      return { q: T`<p>A drone's position is $\vec r(t) = (${A}t^2 - ${B}t)\hat i + (${C}t - ${D}t^2)\hat j$ (m, s). At $t = ${t1}\ \text{s}$, what is ${want === "speed" ? "its speed" : want === "vx" ? "$v_x$" : "$v_y$"}?</p>`,
        answer: want === "speed" ? sp : want === "vx" ? vx : vy, unit: "m/s", absTol: 0.05,
        hints: [T`Differentiate each component: $v_x = dx/dt$, $v_y = dy/dt$.`, T`$\vec v = (${2 * A}t - ${B})\hat i + (${C} - ${2 * D}t)\hat j$`],
        solution: [T`$\vec v(t) = (${2 * A}t - ${B})\hat i + (${C} - ${2 * D}t)\hat j$`, T`At $t=${t1}$: $v_x = ${sig(vx)}$, $v_y = ${sig(vy)}$ m/s`, T`Speed $= \sqrt{v_x^2 + v_y^2} = ${sig(sp)}\ \text{m/s}$`],
        model: { type: "vectors", vecs: [{ x: vx, y: 0, label: "vₓ" }, { x: 0, y: vy, label: "vᵧ" }], sumLabel: "v", unit: "m/s", title: "Velocity components add to the velocity vector" } };
    },
  });
  problem("4-1", "avgv", {
    title: "Average velocity between two positions", level: 1,
    gen(r) {
      const x1 = r.int(-5, 5), y1 = r.int(-5, 5), x2 = r.int(-10, 10), y2 = r.int(-10, 10), dt = r.int(2, 8);
      const vx = (x2 - x1) / dt, vy = (y2 - y1) / dt, mag = Math.hypot(vx, vy);
      return { q: T`<p>A puck moves from $\vec r_1 = (${x1}\hat i + ${y1}\hat j)\ \text{m}$ to $\vec r_2 = (${x2}\hat i + ${y2}\hat j)\ \text{m}$ in $${dt}\ \text{s}$. What is the magnitude of its average velocity?</p>`,
        answer: mag, unit: "m/s", absTol: 0.02,
        hints: [T`$\vec v_{avg} = \Delta\vec r/\Delta t$`],
        solution: [T`$\Delta\vec r = (${x2 - x1})\hat i + (${y2 - y1})\hat j$ m`, T`$|\vec v_{avg}| = \frac{\sqrt{${x2 - x1}^2 + ${y2 - y1}^2}}{${dt}} = ${sig(mag)}\ \text{m/s}$`],
        model: { type: "vectors", vecs: [{ x: x1, y: y1, label: "r₁", color: "#868e96" }, { x: x2 - x1, y: y2 - y1, label: "Δr" }], sumLabel: "r₂", unit: "m" } };
    },
  });
  problem("4-2", "level", {
    title: "Projectile on level ground", level: 1,
    gen(r) {
      const v0 = r.int(10, 35), th = r.pick([20, 30, 37, 45, 53, 60, 70]), want = r.pick(["R", "H", "t"]);
      const vx = v0 * Math.cos(rad(th)), vy = v0 * Math.sin(rad(th)), tf = (2 * vy) / g, R = vx * tf, H = (vy * vy) / (2 * g);
      const ask = { R: "how far away does it land (range)", H: "what maximum height does it reach", t: "how long is it in the air" }[want];
      return { q: T`<p>A soccer ball is kicked from the ground at $${v0}\ \text{m/s}$, $${th}^\circ$ above the horizontal, and lands on level ground. Ignoring air resistance, ${ask}?</p>`,
        answer: { R, H, t: tf }[want], unit: want === "t" ? "s" : "m",
        hints: [T`Components: $v_{0x} = ${v0}\cos${th}^\circ = ${sig(vx)}$, $v_{0y} = ${v0}\sin${th}^\circ = ${sig(vy)}$ m/s.`, want === "H" ? T`At the top $v_y = 0$: $v_{0y}^2 = 2gH$.` : T`Time of flight from $0 = v_{0y}t - \tfrac12gt^2$ → $t = 2v_{0y}/g$.`],
        solution: [T`$v_{0x} = ${sig(vx)}\ \text{m/s}$, $v_{0y} = ${sig(vy)}\ \text{m/s}$`, T`$t = 2v_{0y}/g = ${sig(tf)}\ \text{s}$`, T`$R = v_{0x}t = ${sig(R)}\ \text{m}$`, T`$H = v_{0y}^2/2g = ${sig(H)}\ \text{m}$`],
        model: { type: "projectile", v0, angle: th, h0: 0 } };
    },
  });
  problem("4-2", "horiz", {
    title: "Horizontal launch from a height", level: 1,
    gen(r) {
      const v0 = r.num(2, 15, 0.5), h = r.num(1, 40, 0.5), want = r.pick(["x", "t", "v"]);
      const t = Math.sqrt((2 * h) / g), x = v0 * t, v = Math.hypot(v0, g * t);
      return { q: T`<p>A ball rolls off a horizontal ledge at $${v0}\ \text{m/s}$. The ledge is $${h}\ \text{m}$ above the floor. ${want === "x" ? "How far from the base of the ledge does it land?" : want === "t" ? "How long does it take to reach the floor?" : "What is its speed just before it hits the floor?"}</p>`,
        answer: { x, t, v }[want], unit: want === "t" ? "s" : want === "x" ? "m" : "m/s",
        hints: ["The vertical motion starts from v_y = 0 — it's just like dropping the ball.", T`$h = \tfrac12gt^2 \Rightarrow t = \sqrt{2h/g}$`],
        solution: [T`$t = \sqrt{2(${h})/9.8} = ${sig(t)}\ \text{s}$`, T`$x = v_0t = ${sig(x)}\ \text{m}$`, T`$v_y = gt = ${sig(g * t)}\ \text{m/s}$, so speed $= \sqrt{${v0}^2 + ${sig(g * t)}^2} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "projectile", v0, angle: 0, h0: h } };
    },
  });
  problem("4-2", "height", {
    title: "Launch at an angle from a height", level: 3,
    gen(r) {
      const v0 = r.int(8, 25), th = r.pick([25, 30, 37, 45, 53]), h = r.int(5, 40);
      const vx = v0 * Math.cos(rad(th)), vy = v0 * Math.sin(rad(th)), t = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g, x = vx * t;
      return { q: T`<p>A stone is thrown from the top of a $${h}\ \text{m}$ cliff at $${v0}\ \text{m/s}$, $${th}^\circ$ above the horizontal. How far from the base of the cliff does it land?</p>`,
        answer: x, unit: "m",
        hints: ["The landing height differs from the launch height, so the level-ground range formula does NOT apply.", T`Vertical: $-${h} = ${sig(vy)}t - 4.9t^2$ → solve the quadratic for t.`],
        solution: [T`$v_{0x} = ${sig(vx)}$, $v_{0y} = ${sig(vy)}$ m/s`, T`$4.9t^2 - ${sig(vy)}t - ${h} = 0 \Rightarrow t = ${sig(t)}\ \text{s}$`, T`$x = v_{0x}t = ${sig(x)}\ \text{m}$`],
        model: { type: "projectile", v0, angle: th, h0: h } };
    },
  });
  problem("4-2", "concept", {
    title: "Projectile concepts", level: 1,
    gen(r) {
      const which = r.pick([0, 1, 2]);
      const Q = [
        { q: "At the highest point of a projectile's path (no air resistance), which statement is true?", right: "The velocity is horizontal and the acceleration is g downward.", wrong: ["The velocity and the acceleration are both zero.", "The velocity is zero but the acceleration is g downward.", "The acceleration is zero but the velocity is horizontal."] },
        { q: "Two balls leave a table at the same instant: one is dropped, the other is launched horizontally. Which hits the floor first?", right: "They land at the same time.", wrong: ["The dropped ball.", "The launched ball.", "It depends on the launch speed."] },
        { q: "On level ground, which launch angle gives the same range as 30° (same speed)?", right: "60°", wrong: ["45°", "15°", "90°"] },
      ][which];
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0,
        hints: ["Treat x and y independently."],
        solution: [which === 0 ? "Only vᵧ is zero at the top; vₓ is unchanged and gravity still acts." : which === 1 ? "Vertical motion is identical (both start with vᵧ = 0), so the fall time is identical." : "Range ∝ sin 2θ and sin 60° = sin 120°, so complementary angles (30° and 60°) give equal ranges."],
        model: { type: "projectile", v0: 15, angle: which === 2 ? 30 : which === 1 ? 0 : 50, h0: which === 1 ? 5 : 0 } };
    },
  });
  problem("4-3", "ac", {
    title: "Centripetal acceleration", level: 1,
    gen(r) {
      const R = r.num(0.5, 60, 0.5), mode = r.pick(["v", "T"]);
      if (mode === "v") {
        const v = r.num(2, 30, 0.5), ac = (v * v) / R;
        return { q: T`<p>A car drives around a circular track of radius $${R}\ \text{m}$ at a constant $${v}\ \text{m/s}$. What is the magnitude of its acceleration?</p>`, answer: ac, unit: "m/s²",
          hints: ["Constant speed in a circle still means acceleration — toward the center.", T`$a_c = v^2/r$`],
          solution: [T`$a_c = \frac{${v}^2}{${R}} = ${sig(ac)}\ \text{m/s}^2$`, "Direction: toward the center of the circle."],
          model: { type: "circular", mode: "flat", r: R, v } };
      }
      const Tp = r.num(0.5, 20, 0.5), v = (2 * Math.PI * R) / Tp, ac = (4 * Math.PI * Math.PI * R) / (Tp * Tp);
      return { q: T`<p>A carnival ride spins riders in a horizontal circle of radius $${R}\ \text{m}$, completing one revolution every $${Tp}\ \text{s}$. What is a rider's centripetal acceleration?</p>`, answer: ac, unit: "m/s²",
        hints: [T`First find the speed: $v = 2\pi r/T$.`, T`Then $a_c = v^2/r$ (or $a_c = 4\pi^2r/T^2$).`],
        solution: [T`$v = 2\pi(${R})/${Tp} = ${sig(v)}\ \text{m/s}$`, T`$a_c = v^2/r = ${sig(ac)}\ \text{m/s}^2$ (that's ${sig(ac / g, 2)} g)`],
        model: { type: "circular", mode: "flat", r: R, v } };
    },
  });
  problem("4-3", "period", {
    title: "Speed and period from centripetal acceleration", level: 2,
    gen(r) {
      const R = r.num(2, 15, 0.5), ng = r.num(0.5, 5, 0.5), ac = ng * g, v = Math.sqrt(ac * R), Tp = (2 * Math.PI * R) / v;
      return { q: T`<p>An astronaut training centrifuge has an arm of length $${R}\ \text{m}$. What period of rotation gives the astronaut a centripetal acceleration of $${ng}g$?</p>`, answer: Tp, unit: "s",
        hints: [T`$a_c = ${ng}(9.8) = ${sig(ac)}\ \text{m/s}^2$`, T`$v = \sqrt{a_c r}$, then $T = 2\pi r/v$.`],
        solution: [T`$v = \sqrt{${sig(ac)}\times${R}} = ${sig(v)}\ \text{m/s}$`, T`$T = \frac{2\pi(${R})}{${sig(v)}} = ${sig(Tp)}\ \text{s}$`],
        model: { type: "circular", mode: "flat", r: R, v } };
    },
  });
  problem("4-4", "river", {
    title: "Boat crossing a river", level: 2,
    gen(r) {
      const vb = r.num(2, 6, 0.5), vr = r.num(0.5, 3, 0.5), w = r.int(40, 200), want = r.pick(["t", "drift", "speed"]);
      const t = w / vb, drift = vr * t, sp = Math.hypot(vb, vr);
      return { q: T`<p>A boat that moves at $${vb}\ \text{m/s}$ in still water heads straight across a river $${w}\ \text{m}$ wide. The current flows at $${vr}\ \text{m/s}$. ${want === "t" ? "How long does the crossing take?" : want === "drift" ? "How far downstream does the boat land?" : "What is the boat's speed relative to the shore?"}</p>`,
        answer: { t, drift, speed: sp }[want], unit: want === "t" ? "s" : want === "drift" ? "m" : "m/s",
        hints: [T`$\vec v_{boat,shore} = \vec v_{boat,water} + \vec v_{water,shore}$`, "Only the across-river velocity carries it across."],
        solution: [T`$t = ${w}/${vb} = ${sig(t)}\ \text{s}$`, T`drift $= ${vr}\times${sig(t)} = ${sig(drift)}\ \text{m}$`, T`speed $= \sqrt{${vb}^2 + ${vr}^2} = ${sig(sp)}\ \text{m/s}$`],
        model: { type: "relative", vb, vr, w, heading: 0 } };
    },
  });
  problem("4-4", "aim", {
    title: "Aiming upstream to go straight across", level: 3,
    gen(r) {
      const vb = r.num(3, 8, 0.5), vr = r.num(0.5, vb - 1, 0.5), w = r.int(50, 300), wantT = r.bool();
      const th = deg(Math.asin(vr / vb)), vy = Math.sqrt(vb * vb - vr * vr), t = w / vy;
      return { q: T`<p>A kayaker paddles at $${vb}\ \text{m/s}$ relative to the water in a river flowing at $${vr}\ \text{m/s}$. She wants to land directly across from her start, $${w}\ \text{m}$ away. ${wantT ? "How long will the crossing take?" : "At what angle upstream of straight across must she aim?"}</p>`,
        answer: wantT ? t : th, unit: wantT ? "s" : "°",
        hints: ["Her upstream velocity component must cancel the current exactly.", T`$v_b\sin\theta = v_r$`],
        solution: [T`$\sin\theta = ${vr}/${vb} \Rightarrow \theta = ${sig(th)}^\circ$ upstream`, T`Across component: $v_b\cos\theta = ${sig(vy)}\ \text{m/s}$`, T`$t = ${w}/${sig(vy)} = ${sig(t)}\ \text{s}$`],
        model: { type: "relative", vb, vr, w, heading: th } };
    },
  });
})();
