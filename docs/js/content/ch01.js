/* Chapter 1 — Measurement */
(function () {
  const { problem, article, sig, tex } = window.Phys;
  const T = String.raw;

  article("1-1", T`
<p>Every number in physics comes with a unit, and almost every mistake on a long problem starts with a unit that was ignored. The International System (SI) gives us three base units for mechanics: the <b>meter</b> (length), the <b>kilogram</b> (mass) and the <b>second</b> (time). Everything else — newtons, joules, watts — is built out of these.</p>
<h2>Prefixes are just powers of ten</h2>
<p>A prefix replaces a power of ten so we don't have to write long strings of zeros. The ones you'll meet all year are on your equation sheet:</p>
<div class="eq">$\text{T}=10^{12},\ \text{G}=10^{9},\ \text{M}=10^{6},\ \text{k}=10^{3},\ \text{c}=10^{-2},\ \text{m}=10^{-3},\ \mu=10^{-6},\ \text{n}=10^{-9},\ \text{p}=10^{-12}$</div>
<p>So $4.7\ \text{ms} = 4.7\times10^{-3}\ \text{s}$ and $2.3\ \text{GW} = 2.3\times10^{9}\ \text{W}$.</p>
<div class="callout key"><b class="t">Key idea</b>Going to a <i>smaller</i> unit makes the <i>number</i> bigger. 1 km is 1000 m: the meter is smaller, so you need more of them.</div>
<h2>Chain-link conversion</h2>
<p>To convert, multiply by fractions that equal 1, arranged so the unwanted unit cancels. For example, a highway speed of 90 km/h in m/s:</p>
<div class="eq">$90\ \frac{\text{km}}{\text{h}}\times\frac{1000\ \text{m}}{1\ \text{km}}\times\frac{1\ \text{h}}{3600\ \text{s}} = 25\ \text{m/s}$</div>
<p>Each fraction is "1" because the top and bottom are the same physical amount. The km cancels top-and-bottom, so does the hour, leaving m/s.</p>
<h2>Squared and cubed units</h2>
<p>If a unit is squared or cubed, the conversion factor must be squared or cubed too. Since $1\ \text{cm} = 10^{-2}\ \text{m}$:</p>
<div class="eq">$1\ \text{cm}^3 = (10^{-2}\ \text{m})^3 = 10^{-6}\ \text{m}^3$</div>
<div class="callout warn"><b class="t">Common mistake</b>Writing $1\ \text{cm}^2 = 10^{-2}\ \text{m}^2$. It's $10^{-4}\ \text{m}^2$ — you need the conversion factor once for each power.</div>
<div class="worked"><div class="wt">Worked example</div>A water tank holds $2.5\times10^{5}\ \text{cm}^3$. How many cubic meters is that?<br>$2.5\times10^{5}\ \text{cm}^3 \times \left(\frac{1\ \text{m}}{100\ \text{cm}}\right)^3 = 2.5\times10^{5}\times10^{-6}\ \text{m}^3 = 0.25\ \text{m}^3$.</div>
<div class="callout sheet"><b class="t">On your equation sheet</b>The prefix table and the unit symbols (N, J, W, Hz…) are given — you don't need to memorize them, but you do need to use them fluently.</div>`);

  article("1-2", T`
<p>Physics answers are only as precise as the measurements that produced them. This lesson covers how to report numbers honestly (significant figures and scientific notation), how time and mass are defined, and density — the first "derived" quantity you'll compute.</p>
<h2>Scientific notation and significant figures</h2>
<p>Write numbers as $a\times10^{n}$ with $1\le a<10$. The digits in $a$ are the <b>significant figures</b>. When you multiply or divide, keep as many significant figures as the <i>least</i> precise input. When you add or subtract, keep the decimal place of the least precise input.</p>
<div class="worked"><div class="wt">Example</div>$3.2\ \text{m}\times 4.715\ \text{m} = 15.088\ \text{m}^2 \to 15\ \text{m}^2$ (two sig figs, because 3.2 has two).</div>
<h2>Time and mass</h2>
<p>The second is defined by a cesium atomic clock (a specific number of oscillations of light from cesium-133). The kilogram is now defined by fixing Planck's constant. You won't be tested on these definitions on the AP exam, but you should know that every unit traces back to a reproducible standard.</p>
<h2>Density</h2>
<div class="eq">$\rho = \dfrac{m}{V}$</div>
<p>Density tells you how much mass is packed into each cubic meter. Water is about $1000\ \text{kg/m}^3 = 1\ \text{g/cm}^3$. Note the factor of 1000 between those units: $1\ \text{g/cm}^3 = \frac{10^{-3}\ \text{kg}}{10^{-6}\ \text{m}^3} = 10^{3}\ \text{kg/m}^3$.</p>
<h2>Dimensional analysis</h2>
<p>Both sides of a correct equation must have the same units. That lets you <i>check</i> an answer before you trust it. For instance $\sqrt{2h/g}$ has units $\sqrt{\text{m}/(\text{m/s}^2)} = \sqrt{\text{s}^2} = \text{s}$ — so it can be a time. You will also see this as "linearization" questions on the AP exam, where you must figure out what to graph to get a straight line.</p>
<div class="callout warn"><b class="t">Common mistake</b>Reporting a calculator answer like 15.0880 m² when the data only justify 15 m². On the AP exam, 2–4 significant figures is always safe.</div>`);

  // ---------- problems ----------
  const PRE = [["T", 12], ["G", 9], ["M", 6], ["k", 3], ["", 0], ["c", -2], ["m", -3], ["µ", -6], ["n", -9]];
  problem("1-1", "prefix", {
    title: "Convert between metric prefixes", level: 1,
    gen(r) {
      const unit = r.pick(["m", "g", "s", "W", "J"]);
      let a = r.pick(PRE), b = r.pick(PRE); while (a === b || Math.abs(a[1] - b[1]) > 12) b = r.pick(PRE);
      const v = r.num(1.2, 9.8, 0.1) * Math.pow(10, r.int(0, 2));
      const ans = v * Math.pow(10, a[1] - b[1]);
      const ua = (a[0] || "") + unit, ub = (b[0] || "") + unit;
      return {
        q: T`<p>Convert $${sig(v, 3)}\ \text{${ua.replace("µ", "\\mu ")}}$ to $\text{${ub.replace("µ", "\\mu ")}}$.</p>`,
        answer: ans, unit: ub, tol: 0.01,
        hints: [T`Write both prefixes as powers of ten: ${a[0] || "(no prefix)"} = $10^{${a[1]}}$, ${b[0] || "(no prefix)"} = $10^{${b[1]}}$.`, T`Multiply by $10^{${a[1]}-(${b[1]})} = 10^{${a[1] - b[1]}}$.`],
        solution: [T`${a[0] || "base"} $= 10^{${a[1]}}$ and ${b[0] || "base"} $= 10^{${b[1]}}$.`, T`Factor: $10^{${a[1]} - (${b[1]})} = 10^{${a[1] - b[1]}}$.`, T`$${sig(v, 3)}\times10^{${a[1] - b[1]}} = ${tex(ans, 3)}$ ${ub}.`],
        model: { type: "units", value: +sig(v, 3), unit, fromE: a[1], toE: b[1] },
      };
    },
  });
  problem("1-1", "speed", {
    title: "Convert a speed (km/h, mi/h, m/s)", level: 1,
    gen(r) {
      const mode = r.pick(["kmh", "mph", "back"]);
      if (mode === "kmh") {
        const v = r.int(30, 140);
        return { q: T`<p>A car travels at $${v}\ \text{km/h}$. What is its speed in m/s?</p>`, answer: v / 3.6, unit: "m/s",
          hints: ["1 km = 1000 m and 1 h = 3600 s.", T`Multiply by $\frac{1000\ \text{m}}{1\ \text{km}}$ and by $\frac{1\ \text{h}}{3600\ \text{s}}$.`],
          solution: [T`$${v}\ \frac{\text{km}}{\text{h}}\times\frac{1000\ \text{m}}{1\ \text{km}}\times\frac{1\ \text{h}}{3600\ \text{s}}$`, T`$= ${sig(v / 3.6, 3)}\ \text{m/s}$ (dividing by 3.6 is a handy shortcut).`],
          model: { type: "units", chain: [{ num: "1000 m", den: "1 km", factor: 1000 }, { num: "1 h", den: "3600 s", factor: 1 / 3600 }], value: v, startUnit: "km/h", endUnit: "m/s" } };
      }
      if (mode === "mph") {
        const v = r.int(20, 90);
        return { q: T`<p>A pitcher's fastball is clocked at $${v}\ \text{mi/h}$. Express this in m/s. ($1\ \text{mi} = 1609\ \text{m}$)</p>`, answer: (v * 1609) / 3600, unit: "m/s",
          hints: ["Convert miles to meters and hours to seconds."],
          solution: [T`$${v}\ \frac{\text{mi}}{\text{h}}\times\frac{1609\ \text{m}}{1\ \text{mi}}\times\frac{1\ \text{h}}{3600\ \text{s}} = ${sig((v * 1609) / 3600, 3)}\ \text{m/s}$`],
          model: { type: "units", chain: [{ num: "1609 m", den: "1 mi", factor: 1609 }, { num: "1 h", den: "3600 s", factor: 1 / 3600 }], value: v, startUnit: "mi/h", endUnit: "m/s" } };
      }
      const v = r.num(5, 40, 0.5);
      return { q: T`<p>A sprinter's top speed is $${v}\ \text{m/s}$. What is this in km/h?</p>`, answer: v * 3.6, unit: "km/h",
        hints: ["Now meters go on the bottom of a factor and seconds go on the top of another."],
        solution: [T`$${v}\ \frac{\text{m}}{\text{s}}\times\frac{1\ \text{km}}{1000\ \text{m}}\times\frac{3600\ \text{s}}{1\ \text{h}} = ${sig(v * 3.6, 3)}\ \text{km/h}$`],
        model: { type: "units", chain: [{ num: "1 km", den: "1000 m", factor: 1 / 1000 }, { num: "3600 s", den: "1 h", factor: 3600 }], value: v, startUnit: "m/s", endUnit: "km/h" } };
    },
  });
  problem("1-1", "cubed", {
    title: "Convert areas and volumes", level: 2,
    gen(r) {
      const area = r.bool();
      if (area) {
        const v = r.int(120, 950);
        return { q: T`<p>A sheet of paper has an area of $${v}\ \text{cm}^2$. What is its area in $\text{m}^2$?</p>`, answer: v * 1e-4, unit: "m²",
          hints: [T`$1\ \text{cm} = 10^{-2}\ \text{m}$, so $1\ \text{cm}^2 = (10^{-2})^2\ \text{m}^2$.`],
          solution: [T`$1\ \text{cm}^2 = 10^{-4}\ \text{m}^2$`, T`$${v}\times10^{-4} = ${tex(v * 1e-4)}\ \text{m}^2$`],
          model: { type: "units", chain: [{ num: "1 m", den: "100 cm", factor: 0.01 }, { num: "1 m", den: "100 cm", factor: 0.01 }], value: v, startUnit: "cm²", endUnit: "m²" } };
      }
      const v = r.num(1.5, 9.5, 0.5);
      return { q: T`<p>An engine's cylinders displace $${v}\ \text{L}$ in total. Express this in $\text{m}^3$. ($1\ \text{L} = 1000\ \text{cm}^3$)</p>`, answer: v * 1e-3, unit: "m³",
        hints: [T`First convert to cm³, then use $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$.`],
        solution: [T`$${v}\ \text{L} = ${v * 1000}\ \text{cm}^3$`, T`$${v * 1000}\times10^{-6}\ \text{m}^3 = ${tex(v * 1e-3)}\ \text{m}^3$`],
        model: { type: "units", chain: [{ num: "1000 cm³", den: "1 L", factor: 1000 }, { num: "1 m", den: "100 cm", factor: 0.01 }, { num: "1 m", den: "100 cm", factor: 0.01 }, { num: "1 m", den: "100 cm", factor: 0.01 }], value: v, startUnit: "L", endUnit: "m³" } };
    },
  });
  problem("1-2", "density", {
    title: "Density of a block", level: 1,
    gen(r) {
      const a = r.num(2, 8, 0.5), b = r.num(2, 8, 0.5), c = r.num(1, 5, 0.5), rho = r.pick([2.7, 7.9, 8.9, 11.3, 0.9, 19.3]);
      const V = a * b * c, m = rho * V;
      return { q: T`<p>A rectangular block measures $${a}\ \text{cm}\times${b}\ \text{cm}\times${c}\ \text{cm}$ and has a mass of $${sig(m, 3)}\ \text{g}$. What is its density in $\text{kg/m}^3$?</p>`,
        answer: (m / V) * 1000, unit: "kg/m³",
        hints: [T`Volume first: $V = ${a}\times${b}\times${c}\ \text{cm}^3$.`, T`$\rho = m/V$ in g/cm³, then $1\ \text{g/cm}^3 = 1000\ \text{kg/m}^3$.`],
        solution: [T`$V = ${sig(V, 4)}\ \text{cm}^3$`, T`$\rho = ${sig(m, 3)}/${sig(V, 4)} = ${sig(m / V, 3)}\ \text{g/cm}^3$`, T`$\times1000 \Rightarrow ${sig((m / V) * 1000, 3)}\ \text{kg/m}^3$`],
        model: { type: "units", chain: [{ num: "1 kg", den: "1000 g", factor: 0.001 }, { num: "10⁶ cm³", den: "1 m³", factor: 1e6 }], value: +sig(m / V, 3), startUnit: "g/cm³", endUnit: "kg/m³" } };
    },
  });
  problem("1-2", "dims", {
    title: "Dimensional analysis", level: 2,
    gen(r) {
      const which = r.pick(["time", "speed", "energy"]);
      const sets = {
        time: { want: "time (s)", right: T`$\sqrt{2h/g}$`, wrong: [T`$\sqrt{2gh}$`, T`$2h/g$`, T`$g/h$`], why: T`$\sqrt{\text{m}/(\text{m/s}^2)} = \sqrt{\text{s}^2} = \text{s}$` },
        speed: { want: "speed (m/s)", right: T`$\sqrt{2gh}$`, wrong: [T`$\sqrt{2h/g}$`, T`$gh$`, T`$h/g$`], why: T`$\sqrt{(\text{m/s}^2)(\text{m})} = \sqrt{\text{m}^2/\text{s}^2} = \text{m/s}$` },
        energy: { want: "energy (J = kg·m²/s²)", right: T`$\tfrac12 kx^2$ ($k$ in N/m, $x$ in m)`, wrong: [T`$kx$`, T`$mgh/v$`, T`$mv$`], why: T`$(\text{N/m})(\text{m}^2) = \text{N·m} = \text{J}$` },
      }[which];
      return { q: T`<p>Here $h$ is a height (m), $g$ is 9.8 m/s², $m$ a mass, $v$ a speed. Which expression has units of <b>${sets.want}</b>?</p>`,
        choices: [sets.right, ...sets.wrong], correct: 0,
        hints: ["Replace each symbol by its units and simplify."],
        solution: [T`Check the correct one: ${sets.why}.`, "The other choices simplify to different units."] };
    },
  });
  problem("1-2", "sigfig", {
    title: "Significant figures in a calculation", level: 1,
    gen(r) {
      const a = r.num(1.1, 9.9, 0.1), b = r.num(10.01, 99.99, 0.01);
      const p = a * b, s2 = sig(p, 2);
      return { q: T`<p>A rectangle is measured as $${a}\ \text{m}$ by $${b.toFixed(2)}\ \text{m}$. Which correctly reports its area?</p>`,
        choices: [T`$${s2}\ \text{m}^2$`, T`$${p.toFixed(4)}\ \text{m}^2$`, T`$${sig(p, 4)}\ \text{m}^2$`, T`$${sig(p, 1)}\ \text{m}^2$`].filter((x, i, arr) => arr.indexOf(x) === i), correct: 0,
        hints: ["For multiplication, keep the number of sig figs of the least precise factor."],
        solution: [T`$${a}$ has 2 significant figures; $${b.toFixed(2)}$ has 4.`, T`Product $= ${p.toFixed(4)}$, rounded to 2 sig figs: $${s2}\ \text{m}^2$.`] };
    },
  });
})();
