/* Chapter 13 — Gravitation */
(function () {
  const { problem, article, sig, tex } = window.Phys;
  const T = String.raw, G = 6.67e-11;
  const BODIES = [
    { n: "Earth", M: 5.97e24, R: 6.37e6 },
    { n: "the Moon", M: 7.35e22, R: 1.74e6 },
    { n: "Mars", M: 6.42e23, R: 3.39e6 },
    { n: "Jupiter", M: 1.9e27, R: 6.99e7 },
  ];

  article("13-1", T`
<p>Every pair of masses attracts with a force along the line joining them:</p>
<div class="eq">$|\vec F_g| = G\dfrac{m_1m_2}{r^2} \qquad G = 6.67\times10^{-11}\ \text{N·m}^2/\text{kg}^2$</div>
<p>It's an inverse-square law: double the distance, one-quarter the force. For spheres (planets, uniform balls), $r$ is measured center to center.</p>
<h2>Superposition</h2>
<p>With several masses, the net gravitational force on one is the <b>vector sum</b> of the individual forces. Compute each with the formula, give it a direction, add components.</p>
<div class="worked"><div class="wt">Worked example — the neutral point</div>Between Earth and the Moon ($D = 3.84\times10^8\ \text{m}$) the pulls cancel where $\frac{M_E}{x^2} = \frac{M_M}{(D-x)^2}$, giving $x = \frac{D}{1 + \sqrt{M_M/M_E}} = 3.46\times10^8\ \text{m}$ from Earth — about 90% of the way.</div>
<div class="callout key"><b class="t">Shell theorem</b>A uniform spherical shell attracts outside particles as if all its mass were at its center — which is why planets act like point masses.</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>$G$ and $|\vec F_g| = Gm_1m_2/r^2$.</div>`);

  article("13-2", T`
<p>Near a planet of mass $M$ and radius $R$, the gravitational field strength (acceleration of free fall) at distance $r$ from the center is</p>
<div class="eq">$g(r) = \dfrac{GM}{r^2}\qquad (r \ge R)$</div>
<p>At the surface $g = GM/R^2$ — 9.8 N/kg for Earth. At altitude $h$, $g = GM/(R+h)^2$: at the ISS (400 km up) it's still about 8.7 m/s². Astronauts float because they're in free fall, not because gravity is gone.</p>
<h2>Inside a uniform planet</h2>
<p>By the shell theorem, the shell outside radius $r$ exerts no net force. Only the mass inside, $M\frac{r^3}{R^3}$, counts:</p>
<div class="eq">$g(r) = \dfrac{GM}{R^3}r \qquad (r < R)$</div>
<p>So $g$ grows linearly from zero at the center to its surface value, then falls as $1/r^2$. A tunnel through a uniform planet would produce simple harmonic motion!</p>
<div class="worked"><div class="wt">Worked example</div>Mars: $g = \frac{(6.67\times10^{-11})(6.42\times10^{23})}{(3.39\times10^6)^2} = 3.7\ \text{m/s}^2$ — a 60 kg person weighs 224 N there.</div>`);

  article("13-3", T`
<p>For gravity far from Earth, $mgh$ no longer works because $g$ changes. Using $\Delta U = -\int F\,dr$ with $F = -GMm/r^2$ and choosing $U = 0$ at infinity:</p>
<div class="eq">$U_G = -\dfrac{Gm_1m_2}{r}$</div>
<p>It's negative everywhere and rises toward zero as $r\to\infty$. Moving outward always increases $U$.</p>
<h2>Escape speed</h2>
<p>To escape, the total energy must be at least zero: $\tfrac12mv^2 - \frac{GMm}{R} \ge 0$.</p>
<div class="eq">$v_{esc} = \sqrt{\dfrac{2GM}{R}}$</div>
<p>Earth: 11.2 km/s. It doesn't depend on the mass of the escaping object or the launch direction.</p>
<div class="worked"><div class="wt">Worked example — how high?</div>A probe is launched straight up from Earth at 5.0 km/s. Energy: $\tfrac12v_0^2 - \frac{GM}{R} = -\frac{GM}{r_{max}}$ gives $r_{max} = 8.0\times10^6\ \text{m}$, i.e. 1600 km above the surface — far higher than $v_0^2/2g = 1300$ km would predict.</div>
<div class="callout warn"><b class="t">mgh vs. −GMm/r</b>Use $mg\Delta y$ only when the height change is tiny compared with $R$.</div>`);

  article("13-4", T`
<p>Kepler found three rules for planetary motion from observation; Newton explained them with gravity.</p>
<ol><li><b>Law of orbits:</b> planets move in ellipses with the Sun at one focus.</li><li><b>Law of areas:</b> the line from Sun to planet sweeps out equal areas in equal times. This is conservation of angular momentum — gravity is a central force, so it exerts no torque about the Sun. Consequence: $r_pv_p = r_av_a$; planets are fastest at perihelion.</li><li><b>Law of periods:</b> $T^2 = \left(\dfrac{4\pi^2}{GM}\right)a^3$, where $a$ is the semi-major axis.</li></ol>
<h2>Deriving the third law (circular orbit)</h2>
<p>Gravity provides the centripetal force: $\frac{GMm}{r^2} = m\frac{v^2}{r}$ with $v = \frac{2\pi r}{T}$. Rearranging: $T^2 = \frac{4\pi^2}{GM}r^3$. The satellite's mass cancels.</p>
<div class="worked"><div class="wt">Worked example — weighing a planet</div>A moon orbits at $r = 4.2\times10^8\ \text{m}$ with $T = 1.5\times10^6\ \text{s}$. $M = \frac{4\pi^2r^3}{GT^2} = 1.3\times10^{26}\ \text{kg}$.</div>
<div class="callout key"><b class="t">Geostationary orbit</b>$T = 24\ \text{h}$ gives $r = 4.22\times10^7\ \text{m}$ — about 36,000 km above the equator.</div>`);

  article("13-5", T`
<p>For a satellite in a circular orbit of radius $r$:</p>
<div class="eq">$v = \sqrt{\dfrac{GM}{r}} \qquad K = \dfrac{GMm}{2r} \qquad U = -\dfrac{GMm}{r} \qquad E = K + U = -\dfrac{GMm}{2r}$</div>
<p>Notice $K = -E$ and $U = 2E$. A bound orbit always has negative total energy.</p>
<h2>Changing orbits</h2>
<p>To move to a larger orbit you must <i>add</i> energy (E becomes less negative), yet the satellite ends up <i>slower</i>. The energy needed is $\Delta E = \frac{GMm}{2}\left(\frac1{r_1} - \frac1{r_2}\right)$.</p>
<h2>Elliptical orbits</h2>
<p>Energy depends only on the semi-major axis: $E = -\frac{GMm}{2a}$. Combine energy and angular momentum conservation to relate speeds at the closest and farthest points: $r_pv_p = r_av_a$.</p>
<div class="worked"><div class="wt">Worked example</div>The ISS orbits at $r = 6.77\times10^6\ \text{m}$: $v = \sqrt{GM_E/r} = 7.67\ \text{km/s}$, period $= 2\pi r/v = 92\ \text{min}$.</div>
<div class="callout warn"><b class="t">Drag paradox</b>Air drag on a low satellite removes energy, so it drops to a lower orbit — and speeds up!</div>`);

  const pickBody = (r) => r.pick(BODIES);
  problem("13-1", "force", {
    title: "Gravitational force between two masses", level: 1,
    gen(r) {
      const mode = r.pick(["lab", "planet"]);
      if (mode === "lab") {
        const m1 = r.num(1, 200, 1), m2 = r.num(0.1, 50, 0.1), d = r.num(0.1, 2, 0.05), F = (G * m1 * m2) / (d * d);
        return { q: T`<p>Two lead spheres, $${m1}\ \text{kg}$ and $${m2}\ \text{kg}$, have their centers $${d}\ \text{m}$ apart. What is the gravitational force between them?</p>`, answer: F, unit: "N",
          hints: [T`$F = Gm_1m_2/r^2$ with $G = 6.67\times10^{-11}$`], solution: [T`$F = \frac{(6.67\times10^{-11})(${m1})(${m2})}{(${d})^2} = ${tex(F)}\ \text{N}$ — tiny!`],
          model: { type: "vectors", vecs: [{ x: 1, y: 0, label: "F on 2 (by 1)" }, { x: -1, y: 0, label: "F on 1 (by 2)" }], sum: false, title: `Equal and opposite: both forces are ${sig(F)} N` } };
      }
      const B = pickBody(r), m = r.int(50, 1000), h = r.num(0, 3, 0.25) * B.R, F = (G * B.M * m) / (B.R + h) ** 2;
      return { q: T`<p>What gravitational force does ${B.n} ($M = ${tex(B.M)}\ \text{kg}$, $R = ${tex(B.R)}\ \text{m}$) exert on a $${m}\ \text{kg}$ probe ${h ? T`at an altitude of $${tex(h)}\ \text{m}$` : "on its surface"}?</p>`, answer: F, unit: "N",
        hints: ["r is measured from the planet's center: r = R + h."], solution: [T`$r = ${tex(B.R + h)}\ \text{m}$`, T`$F = \frac{GMm}{r^2} = ${tex(F)}\ \text{N}$`],
        model: { type: "orbit", mode: "field", M: B.M, R: B.R } };
    },
  });
  problem("13-1", "superpos", {
    title: "Net force from two masses (superposition)", level: 2,
    gen(r) {
      const mA = r.int(10, 100), mB = r.int(10, 100), m = r.num(1, 10, 0.5), dA = r.num(0.2, 1, 0.1), dB = r.num(0.2, 1, 0.1);
      const FA = (G * mA * m) / (dA * dA), FB = (G * mB * m) / (dB * dB), net = FB - FA;
      return { q: T`<p>A $${m}\ \text{kg}$ sphere sits on a line between a $${mA}\ \text{kg}$ sphere $${dA}\ \text{m}$ to its left and a $${mB}\ \text{kg}$ sphere $${dB}\ \text{m}$ to its right (center to center). What is the net gravitational force on it? (Right = +.)</p>`,
        answer: net, unit: "N", tol: 0.03,
        hints: ["Find each force separately, give it a sign (each pulls toward its source), then add."],
        solution: [T`Left pull: $${tex(FA)}\ \text{N}$ (−); right pull: $${tex(FB)}\ \text{N}$ (+)`, T`Net $= ${tex(net)}\ \text{N}$`],
        model: { type: "vectors", vecs: [{ x: -FA / Math.max(FA, FB), y: 0, label: "F_A" }, { x: FB / Math.max(FA, FB), y: 0, label: "F_B" }], sumLabel: "F_net (scaled)", title: "Superposition: add the pulls as vectors" } };
    },
  });
  problem("13-1", "neutral", {
    title: "Where do the pulls cancel?", level: 3,
    gen(r) {
      const M1 = r.int(4, 100), M2 = r.int(1, 30), D = r.num(1, 10, 0.5);
      const x = D / (1 + Math.sqrt(M2 / M1));
      return { q: T`<p>Two stars of masses $${M1}M_\odot$ and $${M2}M_\odot$ are separated by $${D}$ AU. How far from the ${M1}-solar-mass star (in AU) along the line between them is the net gravitational force on a third body zero?</p>`,
        answer: x, unit: "AU",
        hints: [T`Set $\frac{GM_1m}{x^2} = \frac{GM_2m}{(D - x)^2}$`, T`Take square roots: $\frac{D - x}{x} = \sqrt{M_2/M_1}$`],
        solution: [T`$x = \frac{D}{1 + \sqrt{M_2/M_1}} = \frac{${D}}{1 + \sqrt{${M2}/${M1}}} = ${sig(x)}\ \text{AU}$`, "Closer to the lighter star, as expected."],
        model: { type: "forcegraph", mode: "ucurve", U: (xx) => -M1 / xx - M2 / (D - xx), xr: [D * 0.15, D * 0.9], x0: x + 0.001, E: -M1 / x - M2 / (D - x) + 0.001, m: 1, Emin: -M1 / x - M2 / (D - x) - 20, Emax: -M1 / x - M2 / (D - x) + 5 } };
    },
  });
  problem("13-2", "altitude", {
    title: "g at altitude", level: 1,
    gen(r) {
      const B = BODIES[0], h = r.pick([200, 400, 1000, 2000, 6370, 20000, 35800]) * 1000, gh = (G * B.M) / (B.R + h) ** 2;
      return { q: T`<p>What is the gravitational acceleration $${h / 1000}\ \text{km}$ above Earth's surface? ($M_E = 5.97\times10^{24}\ \text{kg}$, $R_E = 6.37\times10^6\ \text{m}$)</p>`,
        answer: gh, unit: "m/s²",
        hints: [T`$g = \frac{GM}{(R + h)^2}$`],
        solution: [T`$r = ${tex(B.R + h)}\ \text{m}$`, T`$g = ${sig(gh)}\ \text{m/s}^2$ (${sig((100 * gh) / 9.81, 3)}% of the surface value)`],
        model: { type: "orbit", mode: "field", M: B.M, R: B.R } };
    },
  });
  problem("13-2", "inside", {
    title: "g inside a uniform planet", level: 2,
    gen(r) {
      const f = r.pick([0.25, 0.5, 0.75, 0.9, 0.1]), gs = r.pick([9.8, 3.7, 1.62, 24.8]);
      return { q: T`<p>A planet of uniform density has surface gravity $${gs}\ \text{m/s}^2$. What would $g$ be at a depth where the distance from the center is $${f}R$?</p>`,
        answer: gs * f, unit: "m/s²",
        hints: ["Only the mass inside radius r pulls you (shell theorem): M_inside = M(r/R)³.", T`$g(r) = \frac{GM}{R^3}r = g_s\frac rR$`],
        solution: [T`$g = ${gs}\times${f} = ${sig(gs * f)}\ \text{m/s}^2$ — linear inside, not $1/r^2$!`],
        model: { type: "orbit", mode: "field", M: 5.97e24, R: 6.37e6 } };
    },
  });
  problem("13-2", "otherplanet", {
    title: "Weight on another planet", level: 2,
    gen(r) {
      const kM = r.num(0.1, 10, 0.1), kR = r.num(0.3, 3, 0.1), W = r.int(400, 900);
      const W2 = (W * kM) / (kR * kR);
      return { q: T`<p>A planet has $${kM}$ times Earth's mass and $${kR}$ times Earth's radius. An astronaut weighs $${W}\ \text{N}$ on Earth. What does she weigh on that planet?</p>`,
        answer: W2, unit: "N",
        hints: [T`$g \propto M/R^2$, so $g_{planet} = g_E\cdot\frac{${kM}}{${kR}^2}$`],
        solution: [T`$W' = ${W}\times\frac{${kM}}{(${kR})^2} = ${sig(W2)}\ \text{N}$`],
        model: { type: "orbit", mode: "field", M: 5.97e24 * kM, R: 6.37e6 * kR } };
    },
  });
  problem("13-3", "escape", {
    title: "Escape speed", level: 1,
    gen(r) {
      const B = pickBody(r), v = Math.sqrt((2 * G * B.M) / B.R);
      return { q: T`<p>What is the escape speed from the surface of ${B.n}? ($M = ${tex(B.M)}\ \text{kg}$, $R = ${tex(B.R)}\ \text{m}$)</p>`,
        answer: v, unit: "m/s",
        hints: ["Escape: total energy = 0.", T`$\tfrac12mv^2 = \frac{GMm}{R}$`],
        solution: [T`$v_{esc} = \sqrt{2GM/R} = ${sig(v)}\ \text{m/s}$ (${sig(v / 1000)} km/s)`],
        model: { type: "orbit", mode: "escape", M: B.M, R: B.R, frac: 1.0 } };
    },
  });
  problem("13-3", "maxh", {
    title: "Maximum height of a fast vertical launch", level: 3,
    gen(r) {
      const B = BODIES[0], frac = r.num(0.3, 0.85, 0.05), vesc = Math.sqrt((2 * G * B.M) / B.R), v0 = Math.round((frac * vesc) / 100) * 100;
      const rmax = 1 / (1 / B.R - (v0 * v0) / (2 * G * B.M)), h = rmax - B.R;
      return { q: T`<p>A projectile is launched straight up from Earth's surface at $${v0}\ \text{m/s}$ (ignore air and Earth's rotation). How high above the surface does it rise? ($M_E = 5.97\times10^{24}\ \text{kg}$, $R_E = 6.37\times10^6\ \text{m}$)</p>`,
        answer: h, unit: "m",
        hints: [T`$g$ changes a lot over this height — use $U = -GMm/r$, not $mgh$.`, T`$\tfrac12v_0^2 - \frac{GM}{R} = -\frac{GM}{r_{max}}$`],
        solution: [T`$\frac1{r_{max}} = \frac1R - \frac{v_0^2}{2GM}$ → $r_{max} = ${tex(rmax)}\ \text{m}$`, T`$h = r_{max} - R = ${tex(h)}\ \text{m}$ (vs. $v_0^2/2g = ${tex((v0 * v0) / (2 * 9.8))}$ m with constant g)`],
        model: { type: "orbit", mode: "escape", M: B.M, R: B.R, frac: v0 / vesc } };
    },
  });
  problem("13-3", "liftenergy", {
    title: "Energy to raise a payload", level: 2,
    gen(r) {
      const B = BODIES[0], m = r.int(100, 5000), h = r.pick([500, 1000, 3000, 6370, 20000]) * 1000;
      const dU = G * B.M * m * (1 / B.R - 1 / (B.R + h));
      return { q: T`<p>How much does the gravitational potential energy of a $${m}\ \text{kg}$ payload increase when it is raised from Earth's surface to an altitude of $${h / 1000}\ \text{km}$? ($M_E = 5.97\times10^{24}\ \text{kg}$, $R_E = 6.37\times10^6\ \text{m}$)</p>`,
        answer: dU, unit: "J",
        hints: [T`$\Delta U = -\frac{GMm}{R + h} - \left(-\frac{GMm}{R}\right)$`],
        solution: [T`$\Delta U = GMm\left(\frac1R - \frac1{R + h}\right) = ${tex(dU)}\ \text{J}$`, T`($mgh$ would give $${tex(m * 9.8 * h)}$ J — too big.)`],
        model: { type: "orbit", mode: "circular", M: B.M, R: B.R, r: B.R + h, m } };
    },
  });
  problem("13-4", "period", {
    title: "Orbital period from radius", level: 1,
    gen(r) {
      const B = r.pick([BODIES[0], BODIES[2], BODIES[3]]), f = r.num(1.05, 8, 0.05), rr = f * B.R;
      const Tp = 2 * Math.PI * Math.sqrt(rr ** 3 / (G * B.M));
      return { q: T`<p>A satellite circles ${B.n} ($M = ${tex(B.M)}\ \text{kg}$) at an orbital radius of $${tex(rr)}\ \text{m}$. What is its orbital period (in seconds)?</p>`,
        answer: Tp, unit: "s",
        hints: [T`$T^2 = \frac{4\pi^2}{GM}r^3$`],
        solution: [T`$T = 2\pi\sqrt{\frac{r^3}{GM}} = ${tex(Tp)}\ \text{s}$ (${sig(Tp / 3600)} h)`],
        model: { type: "orbit", mode: "circular", M: B.M, R: B.R, r: rr, planet: B.n.replace("the ", "") } };
    },
  });
  problem("13-4", "mass", {
    title: "Weigh a planet from its moon's orbit", level: 2,
    gen(r) {
      const rr = r.num(1, 20, 0.5) * 1e8, Td = r.num(1, 30, 0.5), Ts = Td * 86400;
      const M = (4 * Math.PI ** 2 * rr ** 3) / (G * Ts * Ts);
      return { q: T`<p>A moon orbits a distant planet in a circle of radius $${tex(rr)}\ \text{m}$ with a period of $${Td}$ days. What is the planet's mass?</p>`,
        answer: M, unit: "kg",
        hints: [T`$M = \frac{4\pi^2r^3}{GT^2}$ — convert days to seconds first.`],
        solution: [T`$T = ${tex(Ts)}\ \text{s}$`, T`$M = ${tex(M)}\ \text{kg}$`],
        model: { type: "orbit", mode: "circular", M, R: rr / 15, r: rr, planet: "planet" } };
    },
  });
  problem("13-4", "ratio", {
    title: "Kepler's third law ratio", level: 2,
    gen(r) {
      const k = r.pick([2, 3, 4, 9, 0.25]), T1 = r.num(1, 20, 0.5);
      const T2 = T1 * k ** 1.5;
      return { q: T`<p>Planet B orbits the same star as planet A, at ${k} times A's orbital radius. Planet A's year is $${T1}$ Earth-years. How long is planet B's year?</p>`,
        answer: T2, unit: "years",
        hints: [T`$T \propto r^{3/2}$`],
        solution: [T`$T_B = T_A\left(\frac{r_B}{r_A}\right)^{3/2} = ${T1}\times${k}^{1.5} = ${sig(T2)}$ years`],
        model: { type: "orbit", mode: "ellipse", M: 1.99e30, R: 7e8, rp: 1.5e11, e: 0.2, m: 6e24 } };
    },
  });
  problem("13-5", "speed", {
    title: "Orbital speed and energy", level: 1,
    gen(r) {
      const B = BODIES[0], h = r.pick([300, 400, 800, 2000, 10000, 35800]) * 1000, m = r.int(200, 5000), wantE = r.bool();
      const rr = B.R + h, v = Math.sqrt((G * B.M) / rr), E = (-G * B.M * m) / (2 * rr);
      return { q: T`<p>A $${m}\ \text{kg}$ satellite orbits Earth in a circle at an altitude of $${h / 1000}\ \text{km}$. What is its ${wantE ? "total mechanical energy" : "orbital speed"}? ($M_E = 5.97\times10^{24}\ \text{kg}$, $R_E = 6.37\times10^6\ \text{m}$)</p>`,
        answer: wantE ? E : v, unit: wantE ? "J" : "m/s",
        hints: [T`$\frac{GMm}{r^2} = \frac{mv^2}{r} \Rightarrow v = \sqrt{GM/r}$`, T`$E = K + U = -\frac{GMm}{2r}$`],
        solution: [T`$r = ${tex(rr)}\ \text{m}$`, T`$v = ${sig(v)}\ \text{m/s}$`, T`$E = ${tex(E)}\ \text{J}$`],
        model: { type: "orbit", mode: "circular", M: B.M, R: B.R, r: rr, m, planet: "Earth" } };
    },
  });
  problem("13-5", "transfer", {
    title: "Energy to change orbits", level: 3,
    gen(r) {
      const B = BODIES[0], m = r.int(100, 3000), h1 = r.pick([300, 400, 600]) * 1000, h2 = r.pick([1000, 2000, 5000, 20000]) * 1000;
      const dE = ((G * B.M * m) / 2) * (1 / (B.R + h1) - 1 / (B.R + h2));
      return { q: T`<p>How much energy must be added to move a $${m}\ \text{kg}$ satellite from a circular orbit at $${h1 / 1000}\ \text{km}$ altitude to one at $${h2 / 1000}\ \text{km}$? ($M_E = 5.97\times10^{24}\ \text{kg}$, $R_E = 6.37\times10^6\ \text{m}$)</p>`,
        answer: dE, unit: "J",
        hints: [T`$E = -\frac{GMm}{2r}$ for a circular orbit.`, T`$\Delta E = \frac{GMm}{2}\left(\frac1{r_1} - \frac1{r_2}\right)$`],
        solution: [T`$r_1 = ${tex(B.R + h1)}$, $r_2 = ${tex(B.R + h2)}\ \text{m}$`, T`$\Delta E = ${tex(dE)}\ \text{J}$`, "The satellite ends up slower even though energy was added!"],
        model: { type: "orbit", mode: "circular", M: B.M, R: B.R, r: B.R + h2, m, planet: "Earth" } };
    },
  });
  problem("13-5", "aphelion", {
    title: "Speeds at perihelion and aphelion", level: 2,
    gen(r) {
      const rp = r.num(0.5, 2, 0.1), ra = rp + r.num(0.5, 5, 0.1), vp = r.num(20, 60, 1);
      const va = (vp * rp) / ra;
      return { q: T`<p>A comet's closest approach to the Sun is $${rp}$ AU, where it moves at $${vp}\ \text{km/s}$. Its farthest point is $${sig(ra)}$ AU. How fast is it moving at the farthest point?</p>`,
        answer: va, unit: "km/s",
        hints: ["Gravity exerts no torque about the Sun: angular momentum is conserved.", T`At both points $\vec v\perp\vec r$: $r_pv_p = r_av_a$`],
        solution: [T`$v_a = \frac{r_pv_p}{r_a} = \frac{${rp}(${vp})}{${sig(ra)}} = ${sig(va)}\ \text{km/s}$`],
        model: { type: "orbit", mode: "ellipse", M: 1.99e30, R: 7e8, rp: rp * 1.496e11, e: (ra - rp) / (ra + rp), m: 1e12 } };
    },
  });
})();
