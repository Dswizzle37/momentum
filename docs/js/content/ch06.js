/* Chapter 6 — Force and Motion II */
(function () {
  const { problem, article, sig } = window.Phys;
  const T = String.raw, g = 9.8;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

  article("6-1", T`
<p>Friction is the force a surface exerts parallel to itself, opposing sliding (or the tendency to slide). There are two kinds.</p>
<h2>Static friction</h2>
<p>While the surfaces are not sliding, static friction adjusts to whatever value is needed — up to a maximum:</p>
<div class="eq">$f_s \le \mu_s F_N$</div>
<h2>Kinetic friction</h2>
<p>Once sliding, the friction force has a fixed size (for our purposes):</p>
<div class="eq">$f_k = \mu_k F_N$</div>
<p>Usually $\mu_k < \mu_s$ — it's harder to start a crate moving than to keep it moving. Your equation sheet combines both as $|\vec F_f| \le |\mu\vec F_N|$.</p>
<div class="callout key"><b class="t">The decision</b>First ask: "Is it sliding?" If not, find the friction needed for equilibrium and check it's ≤ $\mu_sF_N$. If the needed friction is bigger, it slips and $f = \mu_kF_N$.</div>
<div class="worked"><div class="wt">Worked example — the slip angle</div>A block on a ramp is about to slip when $mg\sin\theta = \mu_s mg\cos\theta$, so $\tan\theta_{max} = \mu_s$. For $\mu_s = 0.40$ that's $21.8^\circ$ — independent of mass.</div>
<div class="callout warn"><b class="t">Normal force isn't always mg</b>On a ramp $F_N = mg\cos\theta$; with an angled pull it changes again. Always get $F_N$ from the perpendicular equation first.</div>`);

  article("6-2", T`
<p>When an object moves through air or water, the fluid pushes back with a <b>drag force</b> opposing the velocity. AP Physics C uses a simple model where drag is proportional to speed (good for small, slow objects):</p>
<div class="eq">$\vec F_{drag} = -b\vec v$</div>
<h2>Falling with drag — the differential equation</h2>
<p>Take down as positive. Newton's second law gives</p>
<div class="eq">$m\dfrac{dv}{dt} = mg - bv$</div>
<p>As $v$ grows, the drag grows until it balances gravity. Then $a = 0$ and the object falls at <b>terminal speed</b>:</p>
<div class="eq">$v_T = \dfrac{mg}{b}$</div>
<p>Separating variables and integrating (starting from rest):</p>
<div class="eq">$v(t) = v_T\left(1 - e^{-t/\tau}\right), \qquad \tau = \dfrac mb$</div>
<p>After one time constant $\tau$ the object reaches 63% of $v_T$; after $5\tau$, over 99%. The acceleration decays as $a(t) = g\,e^{-t/\tau}$.</p>
<div class="callout key"><b class="t">AP skill</b>You may be asked to <i>derive</i> $v(t)$: separate as $\frac{dv}{v_T - v} = \frac{dt}{\tau}$, integrate both sides ($-\ln(v_T - v) = t/\tau + C$), and apply $v(0) = 0$.</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>$\int \frac{dx}{x+a} = \ln|x+a|$ and $\frac{d}{dx}e^{ax} = ae^{ax}$ — exactly the tools for this derivation.</div>
<p>(Your textbook also covers drag $\propto v^2$ for fast, large objects: $D = \tfrac12C\rho Av^2$, giving $v_T = \sqrt{2F_g/C\rho A}$.)</p>`);

  article("6-3", T`
<p>In Chapter 4 we found that circular motion at constant speed needs a centripetal acceleration $v^2/r$. Newton's second law says some real force (or combination) must provide it:</p>
<div class="eq">$\sum F_{toward\ center} = m\dfrac{v^2}{r}$</div>
<p>"Centripetal force" is not a new kind of force — it's a <i>role</i> played by tension, friction, the normal force, gravity, or a mix.</p>
<h2>Classic setups</h2>
<ul>
<li><b>Flat curve:</b> static friction provides it: $\mu_s mg \ge mv^2/r \Rightarrow v_{max} = \sqrt{\mu_s gr}$.</li>
<li><b>Banked curve, no friction:</b> the horizontal part of the normal force provides it: $\tan\theta = v^2/(rg)$.</li>
<li><b>Vertical loop:</b> at the top, $F_N + mg = mv^2/r$. The minimum speed (when $F_N \to 0$) is $v = \sqrt{gr}$.</li>
<li><b>Conical pendulum:</b> $T\cos\theta = mg$ and $T\sin\theta = mv^2/r$.</li>
</ul>
<div class="worked"><div class="wt">Worked example — over a hill</div>A 1200 kg car crests a hill of radius 40 m at 15 m/s. Toward the center (down): $mg - F_N = mv^2/r$, so $F_N = 1200(9.8 - 5.6) = 5.0\times10^3\ \text{N}$ — the riders feel lighter.</div>
<div class="callout warn"><b class="t">Don't draw "F_c"</b>On a free-body diagram, draw only real forces. Then set the sum of their inward components equal to $mv^2/r$.</div>`);

  problem("6-1", "slipangle", {
    title: "Will the block slip? (incline)", level: 2,
    gen(r) {
      const mus = r.num(0.2, 0.8, 0.05), m = r.num(1, 10, 0.5), mode = r.pick(["angle", "f"]);
      if (mode === "angle") {
        const th = deg(Math.atan(mus));
        return { q: T`<p>A $${m}\ \text{kg}$ book rests on a board. The coefficient of static friction is $${mus}$. You slowly tilt the board. At what angle does the book start to slide?</p>`,
          answer: th, unit: "°",
          hints: ["At the point of slipping, static friction is at its maximum μsF_N.", T`$mg\sin\theta = \mu_s mg\cos\theta \Rightarrow \tan\theta = \mu_s$`],
          solution: [T`$\tan\theta = ${mus}$`, T`$\theta = \tan^{-1}(${mus}) = ${sig(th)}^\circ$ (mass doesn't matter)`],
          model: { type: "forces", setup: "incline", m, theta: Math.round(th), mus, muk: mus * 0.8 } };
      }
      const th = r.int(5, Math.max(6, Math.floor(deg(Math.atan(mus))) - 2)), f = m * g * Math.sin(rad(th));
      return { q: T`<p>A $${m}\ \text{kg}$ crate sits at rest on a ramp inclined at $${th}^\circ$; $\mu_s = ${mus}$. What is the magnitude of the static friction force on the crate?</p>`,
        answer: f, unit: "N",
        hints: [T`It's at rest, so static friction is only as large as needed — not necessarily $\mu_sF_N$.`, T`$f_s = mg\sin\theta$`],
        solution: [T`$f_s = mg\sin${th}^\circ = ${sig(f)}\ \text{N}$`, T`Check: max possible $= \mu_smg\cos\theta = ${sig(mus * m * g * Math.cos(rad(th)))}\ \text{N}$ — bigger, so it holds.`],
        model: { type: "forces", setup: "incline", m, theta: th, mus, muk: mus * 0.8 } };
    },
  });
  problem("6-1", "pull", {
    title: "Pulling a crate with a rope at an angle", level: 3,
    gen(r) {
      const m = r.int(10, 50), F = r.int(60, 250), th = r.pick([20, 25, 30, 37, 45]), muk = r.num(0.1, 0.5, 0.05);
      const N = m * g - F * Math.sin(rad(th)), a = (F * Math.cos(rad(th)) - muk * N) / m;
      if (N <= 0 || a <= 0) return this.gen(r);
      return { q: T`<p>A worker drags a $${m}\ \text{kg}$ crate across the floor with a rope pulled at $${F}\ \text{N}$, $${th}^\circ$ above the horizontal. The coefficient of kinetic friction is $${muk}$. What is the crate's acceleration?</p>`,
        answer: a, unit: "m/s²",
        hints: [T`Vertical first: $F_N = mg - F\sin\theta$ (the rope lifts a little).`, T`Horizontal: $F\cos\theta - \mu_kF_N = ma$`],
        solution: [T`$F_N = ${sig(m * g)} - ${sig(F * Math.sin(rad(th)))} = ${sig(N)}\ \text{N}$`, T`$f_k = ${muk}\times${sig(N)} = ${sig(muk * N)}\ \text{N}$`, T`$a = \frac{${sig(F * Math.cos(rad(th)))} - ${sig(muk * N)}}{${m}} = ${sig(a)}\ \text{m/s}^2$`],
        model: { type: "forces", setup: "flat", m, F, Fang: th, mus: muk, muk, v0: 0.01 } };
    },
  });
  problem("6-1", "skid", {
    title: "Sliding to a stop", level: 1,
    gen(r) {
      const v0 = r.num(2, 12, 0.5), muk = r.num(0.1, 0.6, 0.05), m = r.num(0.5, 5, 0.5), wantT = r.bool();
      const a = muk * g, d = (v0 * v0) / (2 * a), t = v0 / a;
      return { q: T`<p>A hockey puck ($${m}\ \text{kg}$) slides onto a rough patch at $${v0}\ \text{m/s}$; $\mu_k = ${muk}$. ${wantT ? "How long does it take to stop?" : "How far does it slide before stopping?"}</p>`,
        answer: wantT ? t : d, unit: wantT ? "s" : "m",
        hints: [T`Friction is the net force: $\mu_kmg = ma \Rightarrow a = \mu_kg$ (mass cancels).`, wantT ? T`$0 = v_0 - at$` : T`$0 = v_0^2 - 2ad$`],
        solution: [T`$a = ${muk}(9.8) = ${sig(a)}\ \text{m/s}^2$ (deceleration)`, wantT ? T`$t = v_0/a = ${sig(t)}\ \text{s}$` : T`$d = \frac{v_0^2}{2a} = ${sig(d)}\ \text{m}$`],
        model: { type: "forces", setup: "flat", m, F: 0, mus: muk, muk, v0 } };
    },
  });
  problem("6-1", "slide", {
    title: "Sliding down a rough incline", level: 2,
    gen(r) {
      const th = r.pick([30, 35, 37, 40, 45, 53]), muk = r.num(0.1, Math.min(0.5, Math.tan(rad(th)) - 0.15), 0.05), m = r.num(1, 10, 0.5);
      const a = g * (Math.sin(rad(th)) - muk * Math.cos(rad(th)));
      return { q: T`<p>A $${m}\ \text{kg}$ sled slides down a $${th}^\circ$ snowy slope with $\mu_k = ${muk}$. What is its acceleration?</p>`,
        answer: a, unit: "m/s²",
        hints: [T`Down the slope: $mg\sin\theta - \mu_kmg\cos\theta = ma$`],
        solution: [T`$a = g(\sin${th}^\circ - ${muk}\cos${th}^\circ) = ${sig(a)}\ \text{m/s}^2$`],
        model: { type: "forces", setup: "incline", m, theta: th, mus: muk, muk, v0: -0.01 } };
    },
  });
  problem("6-2", "vt", {
    title: "Terminal speed with linear drag", level: 1,
    gen(r) {
      const m = r.num(0.01, 2, 0.01), b = r.num(0.05, 2, 0.05);
      return { q: T`<p>A small object of mass $${m}\ \text{kg}$ falls through a fluid that exerts a drag force $F = -bv$ with $b = ${b}\ \text{kg/s}$. What is its terminal speed?</p>`,
        answer: (m * g) / b, unit: "m/s",
        hints: ["At terminal speed the acceleration is zero: drag balances weight.", T`$bv_T = mg$`],
        solution: [T`$v_T = \frac{mg}{b} = \frac{${m}(9.8)}{${b}} = ${sig((m * g) / b)}\ \text{m/s}$`],
        model: { type: "drag", m, b } };
    },
  });
  problem("6-2", "vtime", {
    title: "Speed at a given time (exponential approach)", level: 3,
    gen(r) {
      const m = r.num(0.05, 1, 0.05), b = r.num(0.05, 1, 0.05), tau = m / b, t = +(tau * r.num(0.3, 3, 0.1)).toFixed(2), vT = (m * g) / b;
      const v = vT * (1 - Math.exp(-t / tau)), wantT = r.bool();
      const f = r.pick([0.5, 0.75, 0.9, 0.95]), tf = -tau * Math.log(1 - f);
      return { q: wantT ? T`<p>An object (mass $${m}\ \text{kg}$) is released from rest in a fluid with linear drag $b = ${b}\ \text{kg/s}$. How long does it take to reach ${f * 100}% of its terminal speed?</p>` : T`<p>An object (mass $${m}\ \text{kg}$) is released from rest in a fluid with linear drag $b = ${b}\ \text{kg/s}$, so $v(t) = v_T(1 - e^{-bt/m})$. What is its speed at $t = ${t}\ \text{s}$?</p>`,
        answer: wantT ? tf : v, unit: wantT ? "s" : "m/s",
        hints: [T`$v_T = mg/b = ${sig(vT)}\ \text{m/s}$ and $\tau = m/b = ${sig(tau)}\ \text{s}$`, wantT ? T`Solve $${f} = 1 - e^{-t/\tau}$ for t: $t = -\tau\ln(1 - ${f})$.` : T`$v = v_T(1 - e^{-t/\tau})$`],
        solution: wantT ? [T`$t = -\tau\ln(${sig(1 - f, 3)}) = ${sig(tf)}\ \text{s}$`] : [T`$v = ${sig(vT)}(1 - e^{-${t}/${sig(tau)}}) = ${sig(v)}\ \text{m/s}$`],
        model: { type: "drag", m, b } };
    },
  });
  problem("6-2", "dragconcept", {
    title: "Drag concepts", level: 2,
    gen(r) {
      const Q = r.pick([
        { q: "An object is released from rest and falls with linear drag. Which describes its acceleration?", right: "It starts at g and decreases exponentially toward zero.", wrong: ["It is constant at g.", "It starts at zero and increases to g.", "It decreases linearly to zero at t = τ."] },
        { q: "If the mass of a falling object doubles (same b), its terminal speed…", right: "doubles.", wrong: ["is unchanged.", "halves.", "increases by √2."] },
        { q: "For linear drag F = −bv, what are the units of b?", right: "kg/s", wrong: ["N·s²/m", "kg·m/s", "N/s"] },
      ]);
      return { q: `<p>${Q.q}</p>`, choices: [Q.right, ...Q.wrong], correct: 0, hints: [T`$v_T = mg/b$, $a = g - (b/m)v$`], solution: [Q.right], model: { type: "drag", m: 0.5, b: 0.4 } };
    },
  });
  problem("6-3", "flatcurve", {
    title: "Maximum speed on a flat curve", level: 1,
    gen(r) {
      const R = r.int(20, 200), mus = r.num(0.3, 1, 0.05), m = r.int(900, 2000);
      const v = Math.sqrt(mus * g * R);
      return { q: T`<p>A $${m}\ \text{kg}$ car rounds a flat curve of radius $${R}\ \text{m}$. The coefficient of static friction between tires and road is $${mus}$. What is the maximum speed at which it can take the curve without skidding?</p>`,
        answer: v, unit: "m/s",
        hints: ["Static friction is the only horizontal force; it provides mv²/r.", T`$\mu_smg = mv^2/r$`],
        solution: [T`$v_{max} = \sqrt{\mu_sgr} = \sqrt{${mus}(9.8)(${R})} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "circular", mode: "banked", r: R, theta: 0, mu: mus, v, m } };
    },
  });
  problem("6-3", "banked", {
    title: "Banked curve design speed", level: 2,
    gen(r) {
      const R = r.int(50, 400), th = r.int(5, 35), wantAng = r.bool();
      const v = Math.sqrt(R * g * Math.tan(rad(th)));
      const vv = r.int(15, 35), ang = deg(Math.atan((vv * vv) / (R * g)));
      return { q: wantAng ? T`<p>Engineers want cars to round a curve of radius $${R}\ \text{m}$ at $${vv}\ \text{m/s}$ with no help from friction. At what angle should the road be banked?</p>` : T`<p>A curve of radius $${R}\ \text{m}$ is banked at $${th}^\circ$. At what speed can a car round it with no friction needed?</p>`,
        answer: wantAng ? ang : v, unit: wantAng ? "°" : "m/s",
        hints: [T`Vertical: $F_N\cos\theta = mg$. Horizontal: $F_N\sin\theta = mv^2/r$.`, T`Divide: $\tan\theta = \frac{v^2}{rg}$`],
        solution: wantAng ? [T`$\tan\theta = \frac{${vv}^2}{${R}(9.8)} = ${sig((vv * vv) / (R * g))}$`, T`$\theta = ${sig(ang)}^\circ$`] : [T`$v = \sqrt{rg\tan\theta} = \sqrt{${R}(9.8)\tan${th}^\circ} = ${sig(v)}\ \text{m/s}$`],
        model: { type: "circular", mode: "banked", r: R, theta: wantAng ? Math.round(ang) : th, mu: 0, v: wantAng ? vv : v, m: 1000 } };
    },
  });
  problem("6-3", "loop", {
    title: "Vertical circle: top and bottom", level: 3,
    gen(r) {
      const R = r.num(2, 15, 0.5), m = r.num(0.5, 80, 0.5), mode = r.pick(["min", "Ntop", "Nbot"]);
      const v = mode === "min" ? Math.sqrt(g * R) : r.num(Math.ceil(Math.sqrt(g * R)) + 1, Math.ceil(Math.sqrt(g * R)) + 10, 0.5);
      const Ntop = (m * v * v) / R - m * g, Nbot = (m * v * v) / R + m * g;
      const q = mode === "min" ? T`<p>A roller-coaster car goes around a vertical loop of radius $${R}\ \text{m}$. What is the minimum speed at the top for the car to stay on the track?</p>`
        : mode === "Ntop" ? T`<p>A $${m}\ \text{kg}$ rider goes over the top of a vertical loop of radius $${R}\ \text{m}$ (riding on the inside, upside down) at $${v}\ \text{m/s}$. What is the normal force from the seat on the rider?</p>`
        : T`<p>A $${m}\ \text{kg}$ rider passes through the bottom of a circular dip of radius $${R}\ \text{m}$ at $${v}\ \text{m/s}$. What normal force does the seat exert?</p>`;
      return { q, answer: mode === "min" ? Math.sqrt(g * R) : mode === "Ntop" ? Ntop : Nbot, unit: mode === "min" ? "m/s" : "N",
        hints: [mode === "Nbot" ? T`At the bottom the center is up: $F_N - mg = mv^2/r$.` : T`At the top both $F_N$ and $mg$ point down, toward the center: $F_N + mg = mv^2/r$.`, ...(mode === "min" ? ["Minimum speed: the track barely touches, F_N = 0."] : [])],
        solution: mode === "min" ? [T`$mg = mv^2/r \Rightarrow v_{min} = \sqrt{gr} = ${sig(Math.sqrt(g * R))}\ \text{m/s}$`] : mode === "Ntop" ? [T`$F_N = \frac{mv^2}{r} - mg = ${sig((m * v * v) / R)} - ${sig(m * g)} = ${sig(Ntop)}\ \text{N}$`] : [T`$F_N = \frac{mv^2}{r} + mg = ${sig((m * v * v) / R)} + ${sig(m * g)} = ${sig(Nbot)}\ \text{N}$`],
        model: { type: "circular", mode: "vertical", constSpeed: true, r: R, v, m } };
    },
  });
  problem("6-3", "conical", {
    title: "Conical pendulum", level: 3,
    gen(r) {
      const L = r.num(0.5, 3, 0.1), th = r.pick([20, 30, 37, 45, 53, 60]), m = r.num(0.2, 3, 0.1), want = r.pick(["T", "v", "P"]);
      const rr = L * Math.sin(rad(th)), Tn = (m * g) / Math.cos(rad(th)), v = Math.sqrt(g * rr * Math.tan(rad(th))), P = 2 * Math.PI * Math.sqrt((L * Math.cos(rad(th))) / g);
      return { q: T`<p>A $${m}\ \text{kg}$ ball on a $${L}\ \text{m}$ string swings in a horizontal circle with the string at $${th}^\circ$ from vertical. What is ${want === "T" ? "the tension in the string" : want === "v" ? "the ball's speed" : "the period of its motion"}?</p>`,
        answer: { T: Tn, v, P }[want], unit: want === "T" ? "N" : want === "v" ? "m/s" : "s",
        hints: [T`Vertical: $T\cos\theta = mg$. Horizontal: $T\sin\theta = mv^2/r$ with $r = L\sin\theta$.`],
        solution: [T`$T = mg/\cos\theta = ${sig(Tn)}\ \text{N}$`, T`$r = ${sig(rr)}\ \text{m}$, $v = \sqrt{gr\tan\theta} = ${sig(v)}\ \text{m/s}$`, T`Period $= 2\pi r/v = ${sig(P)}\ \text{s}$`],
        model: { type: "circular", mode: "conical", L, theta: th, m } };
    },
  });
})();
