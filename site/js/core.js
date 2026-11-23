/* Core utilities: random numbers, formatting, answer checking, storage, registry. */
(function () {
  const G = 9.8;

  // ---------- seeded RNG ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) {
    const rnd = mulberry32(seed == null ? (Math.random() * 1e9) | 0 : seed);
    const r = {
      seed,
      random: rnd,
      int: (a, b) => a + Math.floor(rnd() * (b - a + 1)),
      // float in [a,b] rounded to step
      num: (a, b, step = 1) => {
        const n = Math.round((b - a) / step);
        return +(a + step * Math.floor(rnd() * (n + 1))).toFixed(6);
      },
      pick: (arr) => arr[Math.floor(rnd() * arr.length)],
      bool: () => rnd() < 0.5,
      sign: () => (rnd() < 0.5 ? -1 : 1),
      shuffle: (arr) => {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
      },
    };
    return r;
  }

  // ---------- formatting ----------
  function sig(x, n = 3) {
    if (!isFinite(x)) return String(x);
    if (x === 0) return "0";
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      const e = Math.floor(Math.log10(ax));
      const m = x / Math.pow(10, e);
      return `${(+m.toPrecision(n)).toString()} × 10^${e}`;
    }
    return (+x.toPrecision(n)).toString();
  }
  // TeX version of sig
  function tex(x, n = 3) {
    const s = sig(x, n);
    return s.replace(/ × 10\^(-?\d+)/, (m, e) => ` \\times 10^{${e}}`);
  }
  const fix = (x, d = 2) => (+x.toFixed(d)).toString();
  const deg = (r) => (r * 180) / Math.PI;
  const rad = (d) => (d * Math.PI) / 180;

  // ---------- answer parsing ----------
  function parseAnswer(str) {
    if (str == null) return NaN;
    let s = String(str).trim().toLowerCase();
    if (!s) return NaN;
    s = s.replace(/,/g, "")
      .replace(/−/g, "-")
      .replace(/[x×·]\s*10\s*\^\s*\(?\s*([-+]?\d+)\s*\)?/g, "e$1")
      .replace(/\*\s*10\s*\^\s*\(?\s*([-+]?\d+)\s*\)?/g, "e$1")
      .replace(/π|pi/g, "(" + Math.PI + ")")
      .replace(/sqrt/g, "Math.sqrt")
      .replace(/\^/g, "**");
    if (!/^[0-9eE+\-*/(). Mathsqrt]*$/.test(s)) return NaN;
    try {
      // eslint-disable-next-line no-new-func
      const v = Function('"use strict";return (' + s + ")")();
      return typeof v === "number" ? v : NaN;
    } catch (e) { return NaN; }
  }
  function checkNumeric(input, answer, tol = 0.02, absTol) {
    const v = parseAnswer(input);
    if (!isFinite(v)) return { ok: false, invalid: true };
    const err = Math.abs(v - answer);
    const allowed = Math.max(Math.abs(answer) * tol, absTol != null ? absTol : 1e-9);
    return { ok: err <= allowed, value: v };
  }

  // ---------- storage ----------
  const KEY = "momentum-physics-v1";
  const store = {
    data: (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })(),
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) {} },
    get(k, d) { return this.data[k] === undefined ? d : this.data[k]; },
    set(k, v) { this.data[k] = v; this.save(); },
  };
  // mastery levels per lesson skill: 0 none, 1 attempted, 2 familiar, 3 proficient, 4 mastered
  const LEVELS = ["Not started", "Attempted", "Familiar", "Proficient", "Mastered"];
  const LEVEL_PTS = [0, 0, 50, 80, 100];
  function getLevel(lessonId) { return (store.get("mastery", {})[lessonId]) || 0; }
  function setLevel(lessonId, lvl, force) {
    const m = store.get("mastery", {});
    const cur = m[lessonId] || 0;
    m[lessonId] = force ? lvl : Math.max(cur, lvl);
    store.set("mastery", m);
  }
  // result of a practice set: correct of total
  function applyPractice(lessonId, correct, total) {
    const cur = getLevel(lessonId);
    let lvl = 1;
    if (correct === total) lvl = cur >= 3 ? 4 : 3;
    else if (correct >= total - 1) lvl = 2;
    if (lvl < cur && correct >= total - 1) lvl = cur; // don't drop on a near-perfect set
    if (correct < total - 1 && cur >= 3) lvl = cur - 1; // slip one level when struggling
    setLevel(lessonId, Math.max(lvl, 1), true);
    return lvl;
  }
  function applyTestResult(lessonId, correct) {
    const cur = getLevel(lessonId);
    if (correct) setLevel(lessonId, cur >= 3 ? 4 : Math.max(cur + 1, 2), true);
    else setLevel(lessonId, Math.max(1, cur >= 3 ? cur - 1 : cur), true);
  }

  function logActivity(entry) {
    const a = store.get("activity", []);
    a.unshift({ ...entry, at: Date.now() });
    store.set("activity", a.slice(0, 60));
  }

  // ---------- registry ----------
  const COURSE = window.COURSE || { chapters: [], lessons: {}, problems: {}, articles: {} };
  function problem(lessonId, id, def) {
    def.id = id; def.lesson = lessonId;
    (COURSE.problems[lessonId] = COURSE.problems[lessonId] || []).push(def);
  }
  function article(lessonId, html) { COURSE.articles[lessonId] = html; }

  // Instantiate a problem generator with a seed
  function instantiate(def, seed) {
    const r = makeRng(seed);
    const p = def.gen(r);
    p.def = def; p.seed = seed; p.lesson = def.lesson; p.id = def.id;
    p.title = def.title;
    if (p.choices) {
      const order = r.shuffle(p.choices.map((_, i) => i));
      p.choices = order.map((i) => p.choices[i]);
      p.correct = order.indexOf(p.correct || 0);
    }
    return p;
  }

  window.Phys = { G, makeRng, sig, tex, fix, deg, rad, parseAnswer, checkNumeric, store, LEVELS, LEVEL_PTS, getLevel, setLevel, applyPractice, applyTestResult, logActivity, problem, article, instantiate, COURSE };
  window.COURSE = COURSE;
})();
