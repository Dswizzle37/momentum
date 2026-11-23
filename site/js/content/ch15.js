/* Chapter 15 — Oscillations */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;

  article("15-1", T`
<p>Any motion that repeats is periodic. The simplest and most important kind is <b>simple harmonic motion</b> (SHM): it happens whenever the restoring force is proportional to the displacement.</p>
<h2>The defining equation</h2>
<p>For a block on a spring, $F = -kx$, so Newton's second law gives</p>
<div class="eq">$m\dfrac{d^2x}{dt^2} = -kx \quad\Rightarrow\quad \dfrac{d^2x}{dt^2} = -\omega^2x, \quad \omega = \sqrt{\dfrac km}$</div>
<p>The solution (on your equation sheet):</p>
<div class="eq">$x = x_{max}\cos(\omega t + \phi)$</div>
<p>$x_{max}$ (also written $A$) is the amplitude, $\omega$ the angular frequency, $\phi$ the phase constant set by the starting conditions.</p>
<h2>Period and frequency</h2>
<div class="eq">$T = \dfrac{2\pi}{\omega} = \dfrac1f \qquad T_s = 2\pi\sqrt{\dfrac mk}$</div>
<p>The period doesn't depend on the amplitude — a defining feature of SHM.</p>
<h2>Velocity and acceleration</h2>
<div class="eq">$v = -A\omega\sin(\omega t + \phi) \qquad a = -A\omega^2\cos(\omega t + \phi) = -\omega^2x$</div>
<p>Maximum speed $A\omega$ occurs at equilibrium; maximum acceleration $A\omega^2$ occurs at the turning points.</p>
<div class="callout key"><b class="t">Recognizing SHM on the exam</b>If you can write $\ddot x = -(\text{positive constant})\,x$, it's SHM and $\omega = \sqrt{\text{that constant}}$. This is how you'll find periods of new systems.</div>
<div class="callout warn"><b class="t">Vertical springs</b>Hanging a mass shifts the equilibrium down by $mg/k$, but the period is still $2\pi\sqrt{m/k}$.</div>`);

  article("15-2", T`
<p>In SHM, energy sloshes back and forth between kinetic and potential, but the total is constant (no friction):</p>
<div class="eq">$E = \tfrac12mv^2 + \tfrac12kx^2 = \tfrac12kA^2$</div>
<ul><li>At the turning points ($x = \pm A$): all potential, $v = 0$.</li><li>At equilibrium ($x = 0$): all kinetic, $v_{max} = A\sqrt{k/m} = A\omega$.</li></ul>
<h2>Speed at any position</h2>
<p>Solving the energy equation for $v$:</p>
<div class="eq">$v = \omega\sqrt{A^2 - x^2}$</div>
<div class="worked"><div class="wt">Worked example</div>A 0.50 kg block on a spring ($k = 200\ \text{N/m}$) oscillates with $A = 0.10\ \text{m}$. $E = \tfrac12(200)(0.10)^2 = 1.0\ \text{J}$. At $x = 0.06\ \text{m}$: $v = 20\sqrt{0.01 - 0.0036} = 1.6\ \text{m/s}$.</div>
<div class="callout key"><b class="t">Where is K = U?</b>When $\tfrac12kx^2 = \tfrac12E$, i.e. $x = A/\sqrt2 \approx 0.71A$ — not at half the amplitude.</div>`);

  article("15-3", T`
<p>A pendulum isn't automatically SHM — but for small angles it is.</p>
<h2>Simple pendulum</h2>
<p>For a point mass on a string of length $\ell$, the restoring torque is $-mg\ell\sin\theta \approx -mg\ell\theta$ for small $\theta$ (in radians). With $I = m\ell^2$:</p>
<div class="eq">$\ddot\theta = -\dfrac g\ell\theta \quad\Rightarrow\quad T_p = 2\pi\sqrt{\dfrac\ell g}$</div>
<p>Independent of mass and (for small swings) of amplitude.</p>
<h2>Physical pendulum</h2>
<p>Any rigid object swinging about a pivot a distance $d$ from its center of mass:</p>
<div class="eq">$T_{phys} = 2\pi\sqrt{\dfrac{I}{mgd}}$</div>
<p>$I$ is about the <b>pivot</b> — use the parallel-axis theorem. A uniform rod pivoted at its end: $I = \tfrac13ML^2$, $d = L/2$, so $T = 2\pi\sqrt{2L/3g}$.</p>
<div class="worked"><div class="wt">Worked example</div>A grandfather-clock pendulum with $T = 2.0\ \text{s}$ needs $\ell = g\left(\frac T{2\pi}\right)^2 = 0.99\ \text{m}$.</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>$T_s = 2\pi\sqrt{m/k}$, $T_p = 2\pi\sqrt{\ell/g}$, $T_{phys} = 2\pi\sqrt{I/mgd}$.</div>`);

  article("15-4", T`
<p>Real oscillators lose energy. This lesson is enrichment from your textbook — useful intuition, lightly tested on the AP exam.</p>
<h2>Damped oscillations</h2>
<p>Add a drag force $-bv$: $m\ddot x = -kx - b\dot x$. For light damping the solution is a cosine inside a shrinking exponential envelope:</p>
<div class="eq">$x(t) = Ae^{-bt/2m}\cos(\omega't + \phi), \qquad \omega' = \sqrt{\dfrac km - \dfrac{b^2}{4m^2}}$</div>
<p>The amplitude decays by a factor $e$ every $2m/b$ seconds; the energy (∝ amplitude²) decays twice as fast.</p>
<h2>Forced oscillations and resonance</h2>
<p>Drive an oscillator with a periodic force at frequency $\omega_d$. After transients die away it oscillates at $\omega_d$, with an amplitude that becomes very large when $\omega_d$ is near the natural frequency $\omega$ — <b>resonance</b>. Less damping → taller, sharper peak.</p>
<div class="callout key"><b class="t">Real world</b>Pushing a swing at the right moments, a wine glass shattered by a singer, and the tuned mass damper in Taipei 101 (which absorbs sway at the building's resonant frequency) are all resonance effects.</div>`);

  // ---------- 15-1 ----------
  problem("15-1", "period", {
    title: "Period of a mass–spring system", level: 1,
    gen(r) {
      const m = r.num(0.1, 5, 0.1), k = r.int(10, 800), wantF = r.bool();
      const Tp = 2 * Math.PI * Math.sqrt(m / k);
      return { q: T`<p>A $${m}\ \text{kg}$ block on a spring with $k = ${k}\ \text{N/m}$ oscillates on a frictionless surface. What is its ${wantF ? "frequency" : "period"}?</p>`,
        answer: wantF ? 1 / Tp : Tp, unit: wantF ? "Hz" : "s",
        hints: [T`$T = 2\pi\sqrt{m/k}$, $f = 1/T$`],
        solution: [T`$T = 2\pi\sqrt{${m}/${k}} = ${sig(Tp)}\ \text{s}$`, T`$f = ${sig(1 / Tp)}\ \text{Hz}$`],
        model: { type: "shm", mode: "spring", m, k, A: 0.1 } };
    },
  });
  problem("15-1", "position", {
    title: "Position and velocity from x(t)", level: 2,
    gen(r) {
      const A = r.num(0.02, 0.3, 0.01), w = r.num(1, 12, 0.5), t = r.num(0.1, 2, 0.05), wantV = r.bool();
      const x = A * Math.cos(w * t), v = -A * w * Math.sin(w * t);
      return { q: T`<p>An oscillator's position is $x(t) = ${A}\cos(${w}t)$ (m, s). What is its ${wantV ? "velocity" : "position"} at $t = ${t}\ \text{s}$?</p>`,
        answer: wantV ? v : x, unit: wantV ? "m/s" : "m", absTol: 0.001,
        hints: ["Calculator in RADIAN mode!", ...(wantV ? [T`$v = \frac{dx}{dt} = -${A}(${w})\sin(${w}t)$`] : [])],
        solution: [T`$x = ${A}\cos(${sig(w * t, 4)}\ \text{rad}) = ${sig(x)}\ \text{m}$`, T`$v = -${sig(A * w)}\sin(${sig(w * t, 4)}) = ${sig(v)}\ \text{m/s}$`],
        model: { type: "shm", mode: "spring", m: 1, k: w * w, A } };
    },
  });
  problem("15-1", "maxes", {
    title: "Maximum speed and acceleration", level: 1,
    gen(r) {
      const m = r.num(0.2, 4, 0.1), k = r.int(20, 600), A = r.num(0.02, 0.3, 0.01), wantA = r.bool();
      const w = Math.sqrt(k / m);
      return { q: T`<p>A $${m}\ \text{kg}$ mass on a spring ($k = ${k}\ \text{N/m}$) oscillates with amplitude $${A}\ \text{m}$. What is its maximum ${wantA ? "acceleration" : "speed"}?</p>`,
        answer: wantA ? A * w * w : A * w, unit: wantA ? "m/s²" : "m/s",
        hints: [T`$\omega = \sqrt{k/m}$`, wantA ? T`$a_{max} = A\omega^2$ (at the turning points)` : T`$v_{max} = A\omega$ (at equilibrium)`],
        solution: [T`$\omega = ${sig(w)}\ \text{rad/s}$`, T`$v_{max} = ${sig(A * w)}\ \text{m/s}$, $a_{max} = ${sig(A * w * w)}\ \text{m/s}^2$`],
        model: { type: "shm", mode: "spring", m, k, A } };
    },
  });
  problem("15-1", "findk", {
    title: "Find the spring constant from a period", level: 2,
    gen(r) {
      const m = r.num(0.1, 3, 0.1), Tp = r.num(0.2, 2.5, 0.05);
      const k = (4 * Math.PI * Math.PI * m) / (Tp * Tp);
      return { q: T`<p>A $${m}\ \text{kg}$ mass hanging from a spring bobs up and down with a period of $${Tp}\ \text{s}$. What is the spring constant?</p>`,
        answer: k, unit: "N/m",
        hints: ["The vertical spring has the same period formula.", T`$k = \frac{4\pi^2m}{T^2}$`],
        solution: [T`$k = \frac{4\pi^2(${m})}{(${Tp})^2} = ${sig(k)}\ \text{N/m}$`],
        model: { type: "shm", mode: "vertical", m, k, A: 0.08 } };
    },
  });
  // ---------- 15-2 ----------
  problem("15-2", "energy", {
    title: "Total energy of an oscillator", level: 1,
    gen(r) {
      const k = r.int(20, 900), A = r.num(0.02, 0.4, 0.01), m = r.num(0.1, 3, 0.1);
      const E = 0.5 * k * A * A;
      return { q: T`<p>A block ($${m}\ \text{kg}$) on a spring ($k = ${k}\ \text{N/m}$) oscillates with amplitude $${A}\ \text{m}$. What is the total mechanical energy?</p>`,
        answer: E, unit: "J",
        hints: ["At a turning point the energy is all potential.", T`$E = \tfrac12kA^2$`],
        solution: [T`$E = \tfrac12(${k})(${A})^2 = ${sig(E)}\ \text{J}$ (mass doesn't matter)`],
        model: { type: "shm", mode: "spring", m, k, A } };
    },
  });
  problem("15-2", "speedat", {
    title: "Speed at a given displacement", level: 2,
    gen(r) {
      const k = r.int(20, 900), m = r.num(0.1, 3, 0.1), A = r.num(0.05, 0.4, 0.01), x = +(A * r.pick([0.2, 0.3, 0.5, 0.6, 0.8])).toFixed(3);
      const v = Math.sqrt(k / m) * Math.sqrt(A * A - x * x);
      return { q: T`<p>A $${m}\ \text{kg}$ block on a spring ($k = ${k}\ \text{N/m}$) oscillates with amplitude $${A}\ \text{m}$. How fast is it moving when it is $${x}\ \text{m}$ from equilibrium?</p>`,
        answer: v, unit: "m/s",
        hints: [T`$\tfrac12kA^2 = \tfrac12mv^2 + \tfrac12kx^2$`, T`$v = \omega\sqrt{A^2 - x^2}$`],
        solution: [T`$\omega = ${sig(Math.sqrt(k / m))}\ \text{rad/s}$`, T`$v = ${sig(Math.sqrt(k / m))}\sqrt{${A}^2 - ${x}^2} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "shm", mode: "spring", m, k, A } };
    },
  });
  problem("15-2", "kequ", {
    title: "Where is K = U?", level: 2,
    gen(r) {
      const A = r.num(0.05, 0.5, 0.01), frac = r.pick([0.5, 0.25, 0.75]);
      const x = A * Math.sqrt(frac);
      return { q: T`<p>An object in SHM has amplitude $${A}\ \text{m}$. At what distance from equilibrium is its potential energy ${frac === 0.5 ? "equal to its kinetic energy" : `${frac * 100}% of the total energy`}?</p>`,
        answer: x, unit: "m",
        hints: [T`$\tfrac12kx^2 = ${frac}\times\tfrac12kA^2$`],
        solution: [T`$x = A\sqrt{${frac}} = ${sig(x)}\ \text{m}$`],
        model: { type: "shm", mode: "spring", m: 1, k: 40, A } };
    },
  });
  // ---------- 15-3 ----------
  problem("15-3", "simple", {
    title: "Simple pendulum period / length", level: 1,
    gen(r) {
      const wantL = r.bool(), L = r.num(0.1, 5, 0.05), Tp = r.num(0.5, 4, 0.1);
      return wantL ? { q: T`<p>What length of simple pendulum has a period of $${Tp}\ \text{s}$ on Earth?</p>`, answer: g * (Tp / (2 * Math.PI)) ** 2, unit: "m",
          hints: [T`$T = 2\pi\sqrt{\ell/g} \Rightarrow \ell = g\left(\frac T{2\pi}\right)^2$`], solution: [T`$\ell = 9.8\left(\frac{${Tp}}{2\pi}\right)^2 = ${sig(g * (Tp / (2 * Math.PI)) ** 2)}\ \text{m}$`],
          model: { type: "shm", mode: "pendulum", L: g * (Tp / (2 * Math.PI)) ** 2, A: 10, m: 1 } }
        : { q: T`<p>What is the period of a simple pendulum $${L}\ \text{m}$ long (small swings)?</p>`, answer: 2 * Math.PI * Math.sqrt(L / g), unit: "s",
          hints: [T`$T = 2\pi\sqrt{\ell/g}$`], solution: [T`$T = 2\pi\sqrt{${L}/9.8} = ${sig(2 * Math.PI * Math.sqrt(L / g))}\ \text{s}$`],
          model: { type: "shm", mode: "pendulum", L, A: 10, m: 1 } };
    },
  });
  problem("15-3", "physical", {
    title: "Physical pendulum: rod pivoted at its end", level: 2,
    gen(r) {
      const L = r.num(0.2, 2, 0.05), M = r.num(0.2, 3, 0.1);
      const Tp = 2 * Math.PI * Math.sqrt((2 * L) / (3 * g));
      return { q: T`<p>A uniform meter-stick-like rod ($${M}\ \text{kg}$, $${L}\ \text{m}$) swings with small amplitude about a pivot at one end. What is its period?</p>`,
        answer: Tp, unit: "s",
        hints: [T`$T = 2\pi\sqrt{I/mgd}$ with $I = \frac13ML^2$ and $d = L/2$.`],
        solution: [T`$T = 2\pi\sqrt{\frac{\frac13ML^2}{Mg(L/2)}} = 2\pi\sqrt{\frac{2L}{3g}} = ${sig(Tp)}\ \text{s}$`, T`(A simple pendulum of the same length: $${sig(2 * Math.PI * Math.sqrt(L / g))}$ s.)`],
        model: { type: "shm", mode: "physical", Mb: M, d: L / 2, I: (M * L * L) / 3, Lrod: L, A: 10 } };
    },
  });
  problem("15-3", "pivot", {
    title: "Physical pendulum: pivot off-center", level: 3,
    gen(r) {
      const L = r.num(0.4, 2, 0.1), M = r.num(0.2, 3, 0.1), d = +(L * r.pick([0.1, 0.2, 0.25, 0.3, 0.4])).toFixed(3);
      const I = (M * L * L) / 12 + M * d * d, Tp = 2 * Math.PI * Math.sqrt(I / (M * g * d));
      return { q: T`<p>A uniform rod ($${M}\ \text{kg}$, $${L}\ \text{m}$) is pivoted at a point $${d}\ \text{m}$ from its center and swings with small amplitude. What is its period?</p>`,
        answer: Tp, unit: "s",
        hints: [T`Parallel axis: $I = \frac1{12}ML^2 + Md^2$`, T`$T = 2\pi\sqrt{I/(Mgd)}$`],
        solution: [T`$I = ${sig(I)}\ \text{kg·m}^2$`, T`$T = 2\pi\sqrt{\frac{${sig(I)}}{${M}(9.8)(${d})}} = ${sig(Tp)}\ \text{s}$`],
        model: { type: "shm", mode: "physical", Mb: M, d, I, Lrod: L / 2 + d, A: 10 } };
    },
  });
  // ---------- 15-4 ----------
  problem("15-4", "decay", {
    title: "Amplitude of a damped oscillator", level: 2,
    gen(r) {
      const m = r.num(0.2, 3, 0.1), b = r.num(0.02, 0.5, 0.01), A0 = r.num(0.05, 0.3, 0.01), t = r.int(2, 30), wantHalf = r.bool();
      const A = A0 * Math.exp((-b * t) / (2 * m)), th = (2 * m * Math.log(2)) / b;
      return { q: wantHalf ? T`<p>A $${m}\ \text{kg}$ oscillator has damping constant $b = ${b}\ \text{kg/s}$. How long does it take for its amplitude to fall to half its initial value?</p>` : T`<p>A $${m}\ \text{kg}$ oscillator with damping constant $b = ${b}\ \text{kg/s}$ starts with amplitude $${A0}\ \text{m}$. What is its amplitude after $${t}\ \text{s}$?</p>`,
        answer: wantHalf ? th : A, unit: wantHalf ? "s" : "m",
        hints: [T`Amplitude envelope: $A(t) = A_0e^{-bt/2m}$`],
        solution: wantHalf ? [T`$\tfrac12 = e^{-bt/2m} \Rightarrow t = \frac{2m\ln2}{b} = ${sig(th)}\ \text{s}$`] : [T`$A = ${A0}e^{-${b}(${t})/(2\cdot${m})} = ${sig(A)}\ \text{m}$`],
        model: { type: "shm", mode: "spring", m, k: 40 * m, A: A0, b: Math.min(2, b) } };
    },
  });
  problem("15-4", "resonance", {
    title: "Resonance concepts", level: 1,
    gen(r) {
      const Q = r.pick([
        { q: "A driven oscillator has the largest amplitude when the driving frequency is…", right: "close to the oscillator's natural frequency.", wrong: ["much higher than the natural frequency.", "much lower than the natural frequency.", "zero."] },
        { q: "Increasing the damping of a driven oscillator makes its resonance peak…", right: "lower and wider.", wrong: ["taller and narrower.", "shift to a much higher frequency.", "disappear entirely for any damping."] },
        { q: "For a lightly damped oscillator, the mechanical energy decays…", right: "exponentially, twice as fast as the amplitude.", wrong: ["linearly to zero.", "exponentially, at the same rate as the amplitude.", "not at all."] },
      ]);
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0, hints: ["Energy ∝ amplitude²."], solution: [Q.right], model: { type: "shm", mode: "spring", m: 0.5, k: 20, A: 0.15, b: 0.15 } };
    },
  });
})();
