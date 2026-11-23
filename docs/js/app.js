/* App: routing + pages (course, unit, lesson, exercise player, tests, test prep, formula sheet). */
(function () {
  const P = window.Phys, C = window.COURSE, V = window.VIDEOS || { lessons: {}, book: {} };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const app = $("#app");
  let activeModels = [];
  let cleanup = [];

  // ---------- icons ----------
  const I = {
    video: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4.5v11l9-5.5z"/></svg>',
    article: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="2.5" width="12" height="15" rx="1.5"/><path d="M7 7h6M7 10h6M7 13h4"/></svg>',
    practice: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13.5 3.5l3 3L8 15H5v-3z"/><path d="M11.5 5.5l3 3"/></svg>',
    quiz: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M11 2L4 11.5h5L8 18l7-9.5h-5z"/></svg>',
    test: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l2.4 5 5.4.7-4 3.8 1 5.4L10 14.3 5.2 16.9l1-5.4-4-3.8 5.4-.7z"/></svg>',
    model: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M10 2.5l6.5 3.7v7.6L10 17.5l-6.5-3.7V6.2z"/><path d="M3.5 6.2L10 10l6.5-3.8M10 10v7.5"/></svg>',
    book: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 4.5c2.5-1 5-1 7 .5 2-1.5 4.5-1.5 7-.5v11c-2.5-1-5-1-7 .5-2-1.5-4.5-1.5-7-.5z"/><path d="M10 5v11"/></svg>',
    search: '<svg viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="2"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4.5 4.5"/></svg>',
    check: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M4 10.5l4 4 8-9"/></svg>',
    x: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 5l10 10M15 5L5 15"/></svg>',
    prep: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="12" height="15" rx="1.5"/><path d="M7.5 3V1.8h5V3M7 8l1.5 1.5L11 7M7 13l1.5 1.5L11 12M13 8.5h.01M13 13.5h.01"/></svg>',
    sheet: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M6 7h3M7.5 5.5v3M11.5 7h3M6 13h3M11.5 12l3 3M14.5 12l-3 3"/></svg>',
    chev: '<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7.5l5 5 5-5"/></svg>',
  };
  const LOGO = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#14bf96"/><path d="M9 27c4-12 10-16 22-17" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M26 6.5l5.5 3.4-4.2 4.9" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="27" r="3.2" fill="#0b2149"/></svg>';

  // ---------- helpers ----------
  function math(el) {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false });
      } catch (e) { /* ignore */ }
    }
  }
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }
  function teardown() {
    activeModels.forEach((m) => m && m.destroy && m.destroy()); activeModels = [];
    cleanup.forEach((f) => f()); cleanup = [];
  }
  const vids = (lid) => V.lessons[lid] || [];
  const probs = (lid) => C.problems[lid] || [];
  const chapterOf = (lid) => C.chapter(C.lessons[lid].chapter);
  const unitLabel = (ch) => `Chapter ${ch.n}`;
  function chapterMastery(ch) {
    const ls = ch.lessons; if (!ls.length) return 0;
    return Math.round(ls.reduce((s, l) => s + P.LEVEL_PTS[P.getLevel(l.id)], 0) / ls.length);
  }
  function courseMastery() {
    const all = C.chapters.flatMap((c) => c.lessons);
    return Math.round(all.reduce((s, l) => s + P.LEVEL_PTS[P.getLevel(l.id)], 0) / all.length);
  }
  const sq = (lvl, extra = "") => `<span class="sq l${lvl} ${extra}" title="${P.LEVELS[lvl]}"></span>`;
  const fmtLen = (l) => l || "";
  function seedNow() { return (Date.now() % 1e9) + Math.floor(Math.random() * 1e6); }
  function isDone(key) { return !!P.store.get("done", {})[key]; }
  function markDone(key) { const d = P.store.get("done", {}); d[key] = 1; P.store.set("done", d); }

  // ---------- header ----------
  function header() {
    const top = $("#top");
    top.innerHTML = `
      <div class="left">
        <button class="nav-btn" id="exploreBtn">Explore ${I.chev}</button>
        <div class="search">${I.search}<input id="q" placeholder="Search" autocomplete="off"><div class="search-results hidden" id="qres"></div></div>
      </div>
      <a class="brand" href="#/">${LOGO}<span>Momentum</span></a>
      <div class="right">
        <a class="nav-btn" href="#/formulas">${I.sheet.replace("<svg", '<svg width="18" height="18"')} Equation sheet</a>
        <a class="nav-btn primary" href="#/prep">${I.prep.replace("<svg", '<svg width="18" height="18"')} Prepare me for my test</a>
      </div>
      <div class="explore-menu hidden" id="exploreMenu">
        <div class="head">AP Physics C: Mechanics — chapters</div>
        ${C.chapters.map((c) => `<a href="#/ch/${c.n}">Ch. ${c.n}: ${esc(c.title)}</a>`).join("")}
        <div class="head" style="margin-top:8px">Tests</div>
        <a href="#/final">Final exam (all chapters)</a><a href="#/prep">Prepare me for my test</a>
      </div>`;
    const menu = $("#exploreMenu");
    $("#exploreBtn").onclick = (e) => { e.stopPropagation(); menu.classList.toggle("hidden"); };
    document.addEventListener("click", (e) => { if (!menu.contains(e.target)) menu.classList.add("hidden"); if (!$(".search").contains(e.target)) $("#qres").classList.add("hidden"); });
    const q = $("#q"), res = $("#qres");
    q.addEventListener("input", () => {
      const s = q.value.trim().toLowerCase();
      if (s.length < 2) { res.classList.add("hidden"); return; }
      const out = [];
      C.chapters.forEach((ch) => {
        if (ch.title.toLowerCase().includes(s)) out.push({ h: `#/ch/${ch.n}`, t: `Chapter ${ch.n}: ${ch.title}`, k: "Chapter" });
        ch.lessons.forEach((l) => {
          const art = (C.articles[l.id] || "").replace(/<[^>]+>/g, " ").toLowerCase();
          if (l.title.toLowerCase().includes(s)) out.push({ h: `#/ch/${ch.n}/l/${l.id}`, t: l.title, k: `Lesson · Ch. ${ch.n}` });
          else if (art.includes(s)) out.push({ h: `#/ch/${ch.n}/l/${l.id}/article`, t: l.title, k: `Article mentions “${s}” · Ch. ${ch.n}` });
          vids(l.id).forEach((v, i) => { if (v.title.toLowerCase().includes(s)) out.push({ h: `#/ch/${ch.n}/l/${l.id}/video/${i}`, t: v.title, k: `Video · ${v.channel}` }); });
        });
      });
      res.innerHTML = out.slice(0, 25).map((o) => `<a href="${o.h}">${esc(o.t)}<span class="k">${esc(o.k)}</span></a>`).join("") || '<a>No results</a>';
      res.classList.remove("hidden");
    });
    res.addEventListener("click", () => { res.classList.add("hidden"); q.value = ""; });
  }

  // ---------- sidebars ----------
  function courseSide(activeN) {
    return `<div class="course-card"><div class="ic">${LOGO}</div><div><b>AP Physics C: Mechanics</b><span>${C.chapters.length} chapters · Fundamentals of Physics 12e</span></div></div>
      ${C.chapters.map((c) => `<a class="side-unit ${c.n == activeN ? "active" : ""}" href="#/ch/${c.n}"><div class="u">Chapter ${c.n}</div><div class="t">${esc(c.title)}</div></a>`).join("")}
      <div class="side-box"><h4>${I.test.replace("<svg", '<svg width="14" height="14"')} Final exam</h4><p>Test yourself on every chapter in the course.</p><a href="#/final">Start final exam</a></div>
      <div class="side-box"><h4>${I.prep.replace("<svg", '<svg width="14" height="14"')} Test prep</h4><p>Make a practice test for any chapter or mix.</p><a href="#/prep">Prepare me for my test</a></div>`;
  }
  function lessonItems(lid) {
    const ch = chapterOf(lid);
    const items = [];
    vids(lid).forEach((v, i) => items.push({ key: `video/${i}`, kind: "video", title: v.title, meta: `${v.channel} · ${fmtLen(v.length)}`, done: isDone(`v:${v.id}`) }));
    if (C.articles[lid]) items.push({ key: "article", kind: "article", title: `Article: ${C.lessons[lid].title}`, meta: `Book module ${C.lessons[lid].modules}`, done: isDone(`a:${lid}`) });
    if (probs(lid).length) {
      items.push({ key: "practice", kind: "practice", title: `Practice: ${C.lessons[lid].title}`, meta: "Get 3 of 4 questions to level up!", lvl: P.getLevel(lid) });
      items.push({ key: "models", kind: "model", title: "Model lab", meta: `${probs(lid).length} interactive models`, done: isDone(`m:${lid}`) });
    }
    return { ch, items };
  }
  function lessonSide(lid, activeKey) {
    const { ch, items } = lessonItems(lid);
    const L = C.lessons[lid];
    const ico = (it) => {
      if (it.kind === "practice") return `<span class="ico" style="border:0">${sq(it.lvl, "")}</span>`;
      return `<span class="ico ${it.done ? "done" : ""}">${it.done ? I.check : I[it.kind]}</span>`;
    };
    const grp = (k) => items.filter((i) => (k === "learn" ? ["video", "article"].includes(i.kind) : !["video", "article"].includes(i.kind)));
    const row = (it) => `<a class="lsn-item ${it.key === activeKey ? "active" : ""}" href="#/ch/${ch.n}/l/${lid}/${it.key}">${ico(it)}<div><div>${esc(it.title)}</div><div class="meta">${esc(it.meta || "")}</div></div></a>`;
    const others = ch.lessons.map((l) => `<a class="lsn-item ${l.id === lid ? "active" : ""}" href="#/ch/${ch.n}/l/${l.id}"><span class="ico" style="border:0">${sq(P.getLevel(l.id))}</span><div>${esc(l.title)}</div></a>`).join("");
    return `<div class="lsn-head"><div class="u"><a href="#/ch/${ch.n}">Chapter ${ch.n}: ${esc(ch.title)}</a></div><div class="t">${esc(L.title)}</div></div>
      <div class="lsn-group">Learn</div>${grp("learn").map(row).join("")}
      <div class="lsn-group">Practice & models</div>${grp("practice").map(row).join("")}
      <a class="lsn-item" href="#/ch/${ch.n}/book"><span class="ico">${I.book}</span><div><div>Textbook problem walkthroughs</div><div class="meta">Chapter ${ch.n} video solutions</div></div></a>
      <div class="lsn-group">Lessons in this chapter</div>${others}
      <div class="lsn-group">Chapter tests</div>
      <a class="lsn-item" href="#/ch/${ch.n}/quiz"><span class="ico">${I.quiz}</span><div>Chapter ${ch.n} quiz</div></a>
      <a class="lsn-item" href="#/ch/${ch.n}/test"><span class="ico">${I.test}</span><div>Chapter ${ch.n} unit test</div></a>`;
  }
  function layout(side, main, gray) {
    app.innerHTML = `<div class="shell"><aside class="side">${side}</aside><main class="main ${gray ? "gray" : ""}"><div class="wrap">${main}</div></main></div>`;
    math(app);
    window.scrollTo(0, 0);
  }

  // ---------- pages: course home ----------
  function pageHome() {
    const nV = Object.values(V.lessons).reduce((s, a) => s + a.length, 0) + Object.values(V.book).reduce((s, a) => s + a.length, 0);
    const nP = Object.values(C.problems).reduce((s, a) => s + a.length, 0);
    const nL = C.chapters.reduce((s, c) => s + c.lessons.length, 0);
    const cm = courseMastery();
    const legend = `<div class="legend"><span>${sq(4)} Mastered</span><span>${sq(3)} Proficient</span><span>${sq(2)} Familiar</span><span>${sq(1)} Attempted</span><span>${sq(0)} Not started</span><span><span class="sq ico">${I.quiz.replace("<svg", '<svg width="13"')}</span> Quiz</span><span><span class="sq ico">${I.test.replace("<svg", '<svg width="13"')}</span> Unit test</span></div>`;
    const grid = C.chapters.map((c) => `<div class="mrow"><a class="lbl" href="#/ch/${c.n}">Chapter ${c.n}</a><div class="sqs">${c.lessons.map((l) => `<a href="#/ch/${c.n}/l/${l.id}/practice" title="${esc(l.title)} — ${P.LEVELS[P.getLevel(l.id)]}">${sq(P.getLevel(l.id))}</a>`).join("")}<a href="#/ch/${c.n}/quiz" title="Quiz" class="sq ico">${I.quiz.replace("<svg", '<svg width="13"')}</a><a href="#/ch/${c.n}/test" title="Unit test" class="sq ico">${I.test.replace("<svg", '<svg width="13"')}</a></div></div>`).join("");
    const units = C.chapters.map((c) => {
      const half = Math.ceil(c.lessons.length / 2);
      const col = (ls) => ls.map((l) => `<div class="lesson-mini"><h3><a href="#/ch/${c.n}/l/${l.id}">${esc(l.title)}</a></h3>
          ${vids(l.id).slice(0, 2).map((v, i) => `<a class="ilink" href="#/ch/${c.n}/l/${l.id}/video/${i}">${I.video}<span>${esc(v.title)}</span></a>`).join("")}
          ${C.articles[l.id] ? `<a class="ilink" href="#/ch/${c.n}/l/${l.id}/article">${I.article}<span>Article: ${esc(l.title)}</span></a>` : ""}
          ${probs(l.id).length ? `<a class="ilink" href="#/ch/${c.n}/l/${l.id}/practice">${I.practice}<span>Practice: ${esc(l.title)}</span></a>` : ""}
        </div>`).join("");
      return `<div class="card unit-card"><h2><a href="#/ch/${c.n}">Chapter ${c.n}: ${esc(c.title)}</a><span class="um">Unit mastery: ${chapterMastery(c)}%</span></h2>
        <div class="muted small">${esc(c.ap)} · Book pp. ${c.pages}</div>
        <div class="cols"><div>${col(c.lessons.slice(0, half))}</div><div>${col(c.lessons.slice(half))}</div></div></div>`;
    }).join("");
    const main = `<div class="hero"><div><div class="small" style="opacity:.8;text-transform:uppercase;letter-spacing:.6px">Course</div><h1>AP Physics C: Mechanics</h1>
        <p>Built around <i>Fundamentals of Physics</i> (12th ed.) and the 2024 AP equation sheet. Watch, read, practice with fresh numbers every time, and open a live model of any problem you get stuck on.</p>
        <div class="stat-row"><div><b>${C.chapters.length}</b><span>chapters</span></div><div><b>${nL}</b><span>skills</span></div><div><b>${nV}</b><span>videos</span></div><div><b>${nP}</b><span>problem types (∞ versions)</span></div><div><b>${cm}%</b><span>course mastery</span></div></div></div>
        <svg class="art" viewBox="0 0 220 130"><path d="M10 120 Q 110 -40 210 120" stroke="#14bf96" stroke-width="3" fill="none" stroke-dasharray="6 6"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => { const x = 10 + i * 33.3, t = (x - 10) / 200, y = 120 - 160 * t * (1 - t) * 1.0; return `<circle cx="${x}" cy="${y}" r="6" fill="#fff" opacity="${0.35 + i * 0.1}"/>`; }).join("")}<path d="M110 40 l26 -2" stroke="#ffb100" stroke-width="3" marker-end="url(#ah)"/><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#ffb100"/></marker></defs></svg></div>
      <h2>Course mastery</h2><div class="pct-bar" style="max-width:420px"><i style="width:${cm}%"></i></div>
      ${legend}<div class="mgrid">${grid}</div>
      <div class="cols" style="margin-bottom:24px">
        <div class="test-tile"><div class="big-ic" style="color:var(--blue)">${I.test}</div><div class="info"><b>Final exam</b><span class="muted small">Every chapter, AP-style mix, optional timer.</span></div><a class="btn" href="#/final">Start</a></div>
        <div class="test-tile"><div class="big-ic" style="color:var(--blue)">${I.prep}</div><div class="info"><b>Prepare me for my test</b><span class="muted small">“Make me a practice test for chapter 7.”</span></div><a class="btn secondary" href="#/prep">Build</a></div>
      </div>
      ${units}`;
    layout(courseSide(null), main, false);
  }

  // ---------- pages: chapter (unit) ----------
  function pageChapter(n) {
    const ch = C.chapter(n); if (!ch) return notFound();
    const m = chapterMastery(ch);
    const photos = (window.PHOTOS || {})[ch.n] || [];
    const lessons = ch.lessons.map((l, idx) => {
      const vs = vids(l.id);
      const lvl = P.getLevel(l.id);
      return `<div class="lesson-block"><div class="lb-head"><h3><a href="#/ch/${ch.n}/l/${l.id}">${idx + 1}. ${esc(l.title)}</a></h3><span class="book-ref">${I.book.replace("<svg", '<svg width="14" height="14"')} Book module ${l.modules} · p. ${l.page}</span></div>
        <div class="lb-body"><div class="lb-learn"><div class="lb-label">Learn</div>
          ${vs.slice(0, 4).map((v, i) => `<a class="ilink" href="#/ch/${ch.n}/l/${l.id}/video/${i}">${I.video}<span>${esc(v.title)} <span class="muted tiny">· ${esc(v.channel)} · ${esc(v.length)}</span></span></a>`).join("")}
          ${vs.length > 4 ? `<a class="ilink muted" href="#/ch/${ch.n}/l/${l.id}/video/4">${I.video}<span>+ ${vs.length - 4} more videos</span></a>` : ""}
          ${C.articles[l.id] ? `<a class="ilink" href="#/ch/${ch.n}/l/${l.id}/article">${I.article}<span>Article: ${esc(l.title)}</span></a>` : ""}
        </div><div class="lb-practice"><div class="lb-label">Practice</div>
          <div class="practice-tile">${sq(lvl)}<div class="info"><b>${esc(l.title)}</b><span>${P.LEVELS[lvl]} · Get 3 of 4 questions to level up!</span></div><a class="btn sm" href="#/ch/${ch.n}/l/${l.id}/practice">${lvl ? "Practice" : "Start"}</a></div>
          <a class="ilink" href="#/ch/${ch.n}/l/${l.id}/models">${I.model}<span><b>Model lab</b> — ${probs(l.id).length} interactive models with live numbers</span></a>
        </div></div></div>`;
    }).join("");
    const book = (V.book[ch.n] || []);
    const main = `<div class="crumbs"><a href="#/">AP Physics C: Mechanics</a> › Chapter ${ch.n}</div>
      <div class="unit-banner" style="background:${ch.color}"><div><div class="u">Chapter ${ch.n} · ${esc(ch.ap)}</div><h1>${esc(ch.title)}</h1><p>${esc(ch.blurb)}</p><p class="small" style="opacity:.85">Textbook pages ${ch.pages}</p></div>
        <div class="mast"><div class="small"><b>Unit mastery: ${m}%</b></div><div class="pct-bar" style="margin:8px 0"><i style="width:${m}%"></i></div><div class="sqs" style="display:flex;gap:4px">${ch.lessons.map((l) => sq(P.getLevel(l.id))).join("")}</div></div></div>
      ${lessons}
      <h2 style="margin-top:28px">Check your understanding</h2>
      <div class="test-tile"><div class="big-ic" style="color:#f08c00;background:#fff4e5">${I.quiz}</div><div class="info"><b>Chapter ${ch.n} quiz</b><span class="muted small">6 questions · level up the skills you get right</span></div><a class="btn secondary" href="#/ch/${ch.n}/quiz">Start quiz</a></div>
      <div class="test-tile"><div class="big-ic" style="color:var(--blue)">${I.test}</div><div class="info"><b>Chapter ${ch.n} unit test</b><span class="muted small">12 questions across every lesson · optional timer · full review with models</span></div><a class="btn" href="#/ch/${ch.n}/test">Start unit test</a></div>
      <div class="test-tile"><div class="big-ic" style="color:var(--green);background:var(--green-l)">${I.prep}</div><div class="info"><b>Practice test for Chapter ${ch.n}</b><span class="muted small">Build a custom-length test — printable or interactive</span></div><a class="btn secondary" href="#/prep/ch${ch.n}">Build</a></div>
      ${book.length ? `<h2 style="margin-top:28px">Textbook problem walkthroughs</h2><p class="muted">Video solutions to end-of-chapter problems from <i>Fundamentals of Physics</i> Chapter ${ch.n} (various editions — problem numbers can differ between editions).</p>
        <div class="video-list">${book.map((v) => thumb(v, `#/ch/${ch.n}/book/${v.id}`)).join("")}</div>` : ""}
      ${photos.length ? `<h2 style="margin-top:28px">Physics in the real world</h2><div class="cols">${photos.map(photoCard).join("")}</div>` : ""}`;
    layout(courseSide(ch.n), main, false);
  }
  function photoCard(p) {
    return `<div class="photo-card"><img loading="lazy" src="${esc(p.src)}" alt="${esc(p.title)}"><div class="pc"><b>${esc(p.title)}</b>${esc(p.artist || "Unknown")} · ${esc(p.license)} · <a href="${esc(p.page)}" target="_blank" rel="noopener">Wikimedia Commons</a></div></div>`;
  }
  function thumb(v, href, now) {
    return `<a class="vthumb ${now ? "now" : ""}" href="${href}"><div class="img" style="background-image:url(https://i.ytimg.com/vi/${v.id}/mqdefault.jpg)"><span class="len">${esc(v.length)}</span></div><div class="cap"><b>${esc(v.title)}</b><span>${esc(v.channel)}</span></div></a>`;
  }
  function embed(v) {
    return `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1" title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  }

  function pageBook(n, vid) {
    const ch = C.chapter(n); if (!ch) return notFound();
    const book = V.book[ch.n] || [];
    const v = book.find((x) => x.id === vid) || book[0];
    const main = `<div class="crumbs"><a href="#/">Course</a> › <a href="#/ch/${ch.n}">Chapter ${ch.n}</a> › Textbook walkthroughs</div>
      <h1>Chapter ${ch.n} textbook problem walkthroughs</h1>
      <p class="muted">Worked solutions to end-of-chapter problems from <i>Fundamentals of Physics</i>. Editions renumber problems, so match the physics, not just the number.</p>
      ${v ? embed(v) + `<div class="video-meta"><div><b>${esc(v.title)}</b><div class="muted small">${esc(v.channel)} · ${esc(v.length)}</div></div><a class="btn secondary sm" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${v.id}">Open on YouTube</a></div>` : "<p>No walkthrough videos found for this chapter.</p>"}
      <div class="video-list">${book.map((x) => thumb(x, `#/ch/${ch.n}/book/${x.id}`, v && x.id === v.id)).join("")}</div>`;
    layout(courseSide(ch.n), main);
    if (v) markDone(`v:${v.id}`);
  }

  // ---------- pages: lesson ----------
  function pageLesson(n, lid, kind, arg) {
    const L = C.lessons[lid]; if (!L) return notFound();
    const ch = chapterOf(lid);
    if (!kind) kind = vids(lid).length ? "video" : "article";
    if (kind === "practice") return pagePractice(lid);
    const key = kind === "video" ? `video/${arg || 0}` : kind;
    let main = `<div class="crumbs"><a href="#/">Course</a> › <a href="#/ch/${ch.n}">Chapter ${ch.n}: ${esc(ch.title)}</a> › ${esc(L.title)}</div>`;
    const { items } = lessonItems(lid);
    const idx = items.findIndex((i) => i.key === key);
    const nextIt = items[idx + 1];
    const nextBtn = nextIt ? `<a class="btn" href="#/ch/${ch.n}/l/${lid}/${nextIt.key}">Up next: ${esc(nextIt.kind === "video" ? "video" : nextIt.kind)} →</a>` : nextLessonBtn(lid);
    if (kind === "video") {
      const vs = vids(lid); const v = vs[+arg || 0];
      if (!v) { main += "<p>No video.</p>"; }
      else {
        main += `<h1 style="font-size:24px">${esc(v.title)}</h1>${embed(v)}
          <div class="video-meta"><div class="muted small">${esc(v.channel)} · ${esc(v.length)} · Supports book module ${L.modules}</div><div style="display:flex;gap:8px"><a class="btn secondary sm" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${v.id}">Open on YouTube</a>${nextBtn}</div></div>
          <div class="callout"><b class="t">While you watch</b>Pause before each worked example and try it yourself, then check against the article and the <a href="#/ch/${ch.n}/l/${lid}/practice">practice set</a>. Stuck? Open the <a href="#/ch/${ch.n}/l/${lid}/models">Model lab</a> to see the situation move with real numbers.</div>
          <h3>More videos for this lesson</h3><div class="video-list">${vs.map((x, i) => thumb(x, `#/ch/${ch.n}/l/${lid}/video/${i}`, i === (+arg || 0))).join("")}</div>`;
        markDone(`v:${v.id}`);
      }
    } else if (kind === "article") {
      main += `<div class="article"><h1>${esc(L.title)}</h1><p><span class="book-ref">${I.book.replace("<svg", '<svg width="14" height="14"')} Read with: <i>Fundamentals of Physics</i> module ${L.modules}, starting p. ${L.page}</span></p>${C.articles[lid] || "<p>Article coming soon.</p>"}
        <div style="display:flex;gap:10px;margin-top:30px;flex-wrap:wrap"><a class="btn" href="#/ch/${ch.n}/l/${lid}/practice">Practice this skill</a><a class="btn secondary" href="#/ch/${ch.n}/l/${lid}/models">Open the model lab</a></div></div>`;
      markDone(`a:${lid}`);
    } else if (kind === "models") {
      main += `<h1 style="font-size:26px">Model lab: ${esc(L.title)}</h1><p class="muted">Every practice-problem type in this lesson has a live model. Drag the sliders to ask “what if?” — the numbers, vectors and graphs update instantly.</p>
        <div class="field"><label>Choose a situation</label><select id="labPick">${probs(lid).map((d, i) => `<option value="${i}">${esc(d.title)}</option>`).join("")}</select> <button class="btn ghost sm" id="labNew">New numbers</button></div>
        <div id="labQ" class="qcard" style="margin-bottom:12px"></div><div id="labModel"></div>`;
      markDone(`m:${lid}`);
    }
    layout(lessonSide(lid, key), main);
    if (kind === "models") {
      let seed = 1234;
      const show = () => {
        teardownModels();
        const def = probs(lid)[+$("#labPick").value];
        const p = P.instantiate(def, seed);
        $("#labQ").innerHTML = `<div class="small muted" style="margin-bottom:6px">Example situation</div><div class="qtext">${p.q}</div>`;
        math($("#labQ"));
        if (p.model) activeModels.push(window.Models.mount($("#labModel"), p.model, { chapter: ch.n, steps: p.solution }));
        else $("#labModel").innerHTML = '<p class="muted">This problem type is conceptual — no model.</p>';
      };
      $("#labPick").onchange = show; $("#labNew").onclick = () => { seed = seedNow(); show(); };
      show();
    }
  }
  function teardownModels() { activeModels.forEach((m) => m && m.destroy && m.destroy()); activeModels = []; }
  function nextLessonBtn(lid) {
    const all = C.chapters.flatMap((c) => c.lessons); const i = all.findIndex((l) => l.id === lid);
    const nx = all[i + 1];
    return nx ? `<a class="btn" href="#/ch/${nx.chapter}/l/${nx.id}">Next lesson →</a>` : "";
  }

  // ---------- exercise engine ----------
  /* opts: {mode:'practice'|'quiz'|'test', problems:[...], title, onFinish(results), timeLimit(min), side(bool), backHref} */
  function runSet(host, opts) {
    const st = { i: 0, results: opts.problems.map(() => null), answers: opts.problems.map(() => null), hints: 0, tries: 0, phase: "answer", sel: null };
    const practice = opts.mode === "practice";
    let timerId = null, endsAt = null;
    host.innerHTML = `<div class="ex-wrap"><div class="ex-head"><div><div class="small muted">${esc(opts.kicker || "")}</div><h1>${esc(opts.title)}</h1></div><div id="exTimer"></div></div><div id="exBody"></div></div>`;
    const bar = document.createElement("div");
    bar.className = "bottom-bar" + (opts.fullWidth ? " full" : "");
    document.body.appendChild(bar);
    cleanup.push(() => { bar.remove(); if (timerId) clearInterval(timerId); });
    if (opts.timeLimit) {
      endsAt = Date.now() + opts.timeLimit * 60000;
      const tick = () => {
        const left = Math.max(0, endsAt - Date.now());
        const el = $("#exTimer"); if (el) el.innerHTML = `<span class="timer">${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, "0")} left</span>`;
        if (left <= 0) { clearInterval(timerId); toast("Time's up!"); finish(); }
      };
      tick(); timerId = setInterval(tick, 1000);
    }
    function dots() {
      return `<div class="pdots">${opts.problems.map((_, k) => { const r = st.results[k]; return `<i class="${r === true ? "ok" : r === false ? "no" : r === "skip" ? "skip" : k === st.i ? "cur" : ""}"></i>`; }).join("")}</div>`;
    }
    function renderBar() {
      const p = opts.problems[st.i];
      const total = opts.problems.length;
      const left = practice ? `<button class="btn ghost" id="bHelp" ${p.hints && p.hints.length && st.phase === "answer" ? "" : "disabled"}>Get help</button>` : `<span class="small muted">Question ${st.i + 1} of ${total}</span>`;
      let right = "";
      if (st.phase === "answer") right = `${practice || opts.mode !== "test" ? `<button class="btn ghost" id="bSkip">Skip</button>` : `<button class="btn ghost" id="bSkip">Skip</button>`}<button class="btn" id="bCheck">Check</button>`;
      else right = `<button class="btn" id="bNext">${st.i === total - 1 ? "Show summary" : "Next question"}</button>`;
      if (practice && st.phase === "retry") right = `<button class="btn ghost" id="bSol">Show solution</button><button class="btn" id="bCheck">Check again</button>`;
      bar.innerHTML = `${left}<div class="prog">${practice ? `Do ${total} problems` : ""} ${dots()}</div>${right}`;
      const b = (id, f) => { const e = $("#" + id, bar); if (e) e.onclick = f; };
      b("bHelp", showHint); b("bCheck", check); b("bNext", next); b("bSkip", skip); b("bSol", () => { revealSolution(); st.phase = "done"; renderBar(); });
    }
    function renderQ() {
      teardownModels();
      const p = opts.problems[st.i];
      st.hints = 0; st.tries = 0; st.phase = "answer"; st.sel = null;
      const body = $("#exBody");
      const inp = p.choices
        ? `<div class="choices">${p.choices.map((c, k) => `<button class="choice" data-k="${k}"><span class="dot">${String.fromCharCode(65 + k)}</span><span>${c}</span></button>`).join("")}</div>`
        : `<div class="answer-row"><input id="ans" inputmode="decimal" autocomplete="off" placeholder="Your answer">${p.unit ? `<span class="unit">${p.unit}</span>` : ""}<div class="fmt">Numbers, fractions, scientific notation (2.5e3 or 2.5×10^3), sqrt() and pi all work. Within ${Math.round((p.tol || 0.02) * 100)}% counts as correct.</div></div>`;
      const chTag = C.lessons[p.lesson];
      body.innerHTML = `<div class="qcard"><div class="small muted" style="margin-bottom:8px">${opts.mode !== "practice" ? `<span class="pill">${esc(chTag ? `Ch. ${chTag.chapter} · ${chTag.title}` : "")}</span>` : ""}${p.level === 3 ? ' <span class="pill purple">AP-level</span>' : ""}</div>
        <div class="qtext">${p.q}</div>${inp}<div class="hints" id="hints"></div><div id="fb"></div><div id="sol"></div>
        ${p.model && (practice || opts.showModels) ? `<div class="model-toggle" id="mt"><div><b>${I.model.replace("<svg", '<svg width="16" height="16" style="vertical-align:-3px"')} Struggling? See a model of this problem</b><div class="small muted">An interactive picture of this exact problem — same numbers, live vectors, graphs and readouts.</div></div><span class="btn sm secondary">Show model</span></div><div id="mhost"></div>` : ""}
      </div>`;
      math(body);
      $$(".choice", body).forEach((btn) => btn.onclick = () => {
        if (st.phase !== "answer" && st.phase !== "retry") return;
        $$(".choice", body).forEach((x) => x.classList.remove("sel")); btn.classList.add("sel"); st.sel = +btn.dataset.k;
      });
      const ans = $("#ans", body); if (ans) { ans.focus(); ans.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); if (st.phase === "answer" || st.phase === "retry") check(); else next(); } }; }
      const mt = $("#mt", body);
      if (mt) mt.onclick = () => openModel();
      renderBar();
    }
    function openModel() {
      const p = opts.problems[st.i]; const host = $("#mhost"); const mt = $("#mt");
      if (!host || host.childElementCount) return;
      if (mt) mt.classList.add("hidden");
      activeModels.push(window.Models.mount(host, p.model, { chapter: C.lessons[p.lesson].chapter, steps: st.phase === "answer" && practice ? null : p.solution, hideAnswer: st.phase === "answer" }));
    }
    function showHint() {
      const p = opts.problems[st.i];
      if (!p.hints || st.hints >= p.hints.length) return;
      const h = document.createElement("div"); h.className = "hint";
      h.innerHTML = `<div class="hn">Hint ${st.hints + 1} of ${p.hints.length}</div>${p.hints[st.hints]}`;
      $("#hints").appendChild(h); math(h); st.hints++;
      if (st.results[st.i] == null) st.results[st.i] = false; // hints count as a miss for mastery, like a tutor would
      renderBar();
    }
    function correctText(p) { return p.choices ? `${String.fromCharCode(65 + p.correct)}` : `${P.sig(p.answer, 3)}${p.unit ? " " + p.unit.replace(/\$/g, "") : ""}`; }
    function revealSolution() {
      const p = opts.problems[st.i];
      $("#sol").innerHTML = `<div class="solution"><b>Worked solution</b><ol>${(p.solution || []).map((s) => `<li>${s}</li>`).join("")}</ol><div><b>Answer: </b>${p.choices ? p.choices[p.correct] : correctText(p)}</div></div>`;
      math($("#sol"));
      if (p.choices) $$(".choice").forEach((b) => { if (+b.dataset.k === p.correct) b.classList.add("right"); });
    }
    function check() {
      const p = opts.problems[st.i];
      let ok;
      if (p.choices) {
        if (st.sel == null) { toast("Pick an answer first"); return; }
        ok = st.sel === p.correct; st.answers[st.i] = st.sel;
      } else {
        const r = P.checkNumeric($("#ans").value, p.answer, p.tol || 0.02, p.absTol);
        if (r.invalid) { toast("Enter a number (e.g. 12.5 or 3.2e4)"); return; }
        ok = r.ok; st.answers[st.i] = $("#ans").value;
      }
      st.tries++;
      const fb = $("#fb");
      if (ok) {
        if (st.results[st.i] == null) st.results[st.i] = true;
        fb.innerHTML = `<div class="feedback ok">${I.check.replace("<svg", '<svg width="20"')} ${pickPraise()}${st.results[st.i] === false && practice ? " (this one won't count toward leveling up because you used help or missed the first try)" : ""}</div>`;
        if (p.choices) $$(".choice").forEach((b) => { if (+b.dataset.k === p.correct) b.classList.add("right"); });
        st.phase = "done";
        if (practice) revealSolution();
      } else {
        st.results[st.i] = false;
        if (practice) {
          fb.innerHTML = `<div class="feedback no">${I.x.replace("<svg", '<svg width="18"')} Not quite yet… Try again, use a hint, or open the model below to see what's happening.</div>`;
          if (p.choices) $$(".choice").forEach((b) => { if (+b.dataset.k === st.sel) b.classList.add("wrong"); });
          st.phase = "retry";
          const mt = $("#mt"); if (mt) mt.style.borderColor = "var(--red)";
        } else {
          fb.innerHTML = `<div class="feedback no">${I.x.replace("<svg", '<svg width="18"')} Incorrect. Correct answer: ${correctText(p)}</div>`;
          if (p.choices) $$(".choice").forEach((b) => { if (+b.dataset.k === st.sel) b.classList.add("wrong"); if (+b.dataset.k === p.correct) b.classList.add("right"); });
          st.phase = "done";
        }
      }
      math(fb);
      renderBar();
    }
    function skip() { st.results[st.i] = st.results[st.i] == null ? "skip" : st.results[st.i]; if (practice) { revealSolution(); st.phase = "done"; renderBar(); } else next(); }
    function next() { if (st.i < opts.problems.length - 1) { st.i++; renderQ(); window.scrollTo(0, 0); } else finish(); }
    function finish() {
      teardownModels(); if (timerId) clearInterval(timerId);
      bar.remove();
      opts.onFinish(st.results.map((r) => r === true), st.answers);
    }
    renderQ();
  }
  const praise = ["Nice work!", "Great job!", "Correct!", "You got it!", "Exactly right!", "Keep it up!"];
  const pickPraise = () => praise[Math.floor(Math.random() * praise.length)];

  // pick problems for a lesson set, cycling through generators so types vary
  function pickProblems(lessonIds, n, opts = {}) {
    const out = [];
    const pools = lessonIds.map((id) => ({ id, defs: P.COURSE.problems[id] ? P.COURSE.problems[id].filter((d) => !opts.level || opts.level === "mixed" || (opts.level === "easy" ? (d.level || 2) <= 2 : (d.level || 2) >= 2)) : [] })).filter((p) => p.defs.length);
    if (!pools.length) return out;
    // weights: weak skills first if requested
    let order = [];
    if (opts.weak) {
      const w = pools.map((p) => ({ p, w: 5 - P.getLevel(p.id) }));
      while (order.length < n) { w.sort((a, b) => b.w - a.w + (Math.random() - 0.5)); order.push(w[0].p); w[0].w -= 1.3; }
    } else {
      const sh = (a) => a.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
      while (order.length < n) order = order.concat(sh(pools));
      order = order.slice(0, n);
    }
    const used = {};
    order.forEach((pool) => {
      const defs = pool.defs;
      const u = used[pool.id] = used[pool.id] || [];
      let cand = defs.filter((d) => !u.includes(d.id));
      if (!cand.length) { used[pool.id] = []; cand = defs; }
      const d = cand[Math.floor(Math.random() * cand.length)];
      used[pool.id].push(d.id);
      out.push(P.instantiate(d, seedNow() + out.length * 7919));
    });
    return out;
  }

  function pagePractice(lid) {
    const L = C.lessons[lid]; const ch = chapterOf(lid);
    layout(lessonSide(lid, "practice"), `<div class="crumbs"><a href="#/">Course</a> › <a href="#/ch/${ch.n}">Chapter ${ch.n}</a> › ${esc(L.title)}</div><div id="ex"></div>`);
    const before = P.getLevel(lid);
    const problems = pickProblems([lid], 4);
    if (!problems.length) { $("#ex").innerHTML = "<p>No practice yet.</p>"; return; }
    runSet($("#ex"), {
      mode: "practice", problems, title: L.title, kicker: `Practice · Chapter ${ch.n} · Book module ${L.modules}`,
      onFinish(res) {
        const correct = res.filter(Boolean).length;
        const lvl = P.applyPractice(lid, correct, res.length);
        P.logActivity({ kind: "practice", lesson: lid, score: `${correct}/${res.length}` });
        $("#ex").innerHTML = `<div class="card shadow summary-card"><div class="small muted">Practice complete</div><div class="big">${correct}/${res.length}</div><div>correct on the first try without help</div>
          <div class="lvl-change">${sq(before)} ${P.LEVELS[before]} → ${sq(lvl)} <b>${P.LEVELS[lvl]}</b></div>
          <p class="muted">${correct === res.length ? "Perfect set! Do it again to push toward Mastered, or take the unit test." : correct >= res.length - 1 ? "So close — one more strong set will level you up." : "Watch a video or open the model lab, then try a fresh set (the numbers change every time)."}</p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn" id="again">Try another set</button><a class="btn secondary" href="#/ch/${ch.n}/l/${lid}/models">Model lab</a>${nextLessonBtn(lid).replace('class="btn"', 'class="btn secondary"')}<a class="btn ghost" href="#/ch/${ch.n}">Back to chapter</a></div></div>`;
        $("#again").onclick = () => route();
        // refresh sidebar
        $(".side").innerHTML = lessonSide(lid, "practice");
      },
    });
  }

  // ---------- tests (quiz / unit test / final / prep) ----------
  function testIntro(host, cfg, start) {
    host.innerHTML = `<div class="card shadow" style="max-width:720px;margin:20px auto;padding:32px"><div class="small muted">${esc(cfg.kicker)}</div><h1>${esc(cfg.title)}</h1><p>${cfg.desc}</p>
      <ul class="muted">${cfg.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      <div class="field"><label>Timer</label><div class="seg" id="tseg">${[0, ...cfg.times].map((t) => `<button data-t="${t}" class="${t === cfg.defTime ? "on" : ""}">${t ? t + " min" : "Untimed"}</button>`).join("")}</div></div>
      <label class="small" style="display:flex;gap:8px;align-items:center;margin-bottom:18px"><input type="checkbox" id="showM"> Let me open models during the test (practice mode)</label>
      <button class="btn" id="go">Let's go</button> <a class="btn ghost" href="${cfg.back}">Cancel</a></div>`;
    let t = cfg.defTime;
    $$("#tseg button").forEach((b) => b.onclick = () => { $$("#tseg button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); t = +b.dataset.t; });
    $("#go").onclick = () => start({ time: t, showModels: $("#showM").checked });
  }
  function testResults(host, cfg, problems, res, answers) {
    const correct = res.filter(Boolean).length, total = res.length, pct = Math.round((100 * correct) / total);
    // mastery updates per lesson
    const byLesson = {};
    problems.forEach((p, k) => { (byLesson[p.lesson] = byLesson[p.lesson] || []).push(res[k]); });
    if (cfg.updateMastery) Object.entries(byLesson).forEach(([lid, arr]) => P.applyTestResult(lid, arr.every(Boolean)));
    P.logActivity({ kind: cfg.kind, title: cfg.title, score: `${correct}/${total}` });
    const ap = pct >= 75 ? 5 : pct >= 60 ? 4 : pct >= 45 ? 3 : pct >= 30 ? 2 : 1;
    const ring = `<svg class="score-ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" stroke="#eceef1" stroke-width="12" fill="none"/><circle cx="60" cy="60" r="52" stroke="${pct >= 70 ? "#00a60e" : pct >= 50 ? "#ffb100" : "#d92916"}" stroke-width="12" fill="none" stroke-dasharray="${(pct / 100) * 326.7} 326.7" transform="rotate(-90 60 60)" stroke-linecap="round"/><text x="60" y="66" text-anchor="middle" font-size="26" font-weight="700" fill="#21242c">${pct}%</text></svg>`;
    const rows = Object.entries(byLesson).map(([lid, arr]) => { const L = C.lessons[lid]; const ok = arr.filter(Boolean).length; return `<tr><td>Ch. ${L.chapter}</td><td><a href="#/ch/${L.chapter}/l/${lid}">${esc(L.title)}</a></td><td>${ok}/${arr.length}</td><td>${ok === arr.length ? '<span class="pill green">Solid</span>' : `<a class="pill red" href="#/ch/${L.chapter}/l/${lid}/practice">Review →</a>`}</td></tr>`; }).join("");
    host.innerHTML = `<div class="card shadow" style="display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;padding:28px">${ring}<div><div class="small muted">${esc(cfg.kicker)}</div><h1>${esc(cfg.title)}: ${correct}/${total}</h1>
        <p class="muted">${cfg.kind === "final" || cfg.kind === "prep" ? `Rough AP-style estimate from this set: <b>${ap}</b> (curves vary by year — treat this as a direction, not a prediction).` : pct >= 80 ? "Strong work — the skills you got right moved up a level." : "Review the skills marked below, then retake for a fresh set of numbers."}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="retake">Retake with new numbers</button><a class="btn secondary" href="${cfg.back}">Done</a></div></div></div>
      <h2>Skill breakdown</h2><table class="breakdown card" style="padding:0"><tr><th>Chapter</th><th>Skill</th><th>Score</th><th></th></tr>${rows}</table>
      <h2 style="margin-top:24px">Review every question</h2><p class="muted">Open any question to see the worked solution and its interactive model.</p>
      <div id="review">${problems.map((p, k) => `<div class="review-item"><div class="rh" data-k="${k}"><span class="pill ${res[k] ? "green" : "red"}">${res[k] ? "Correct" : "Missed"}</span><b>Question ${k + 1}</b><span class="muted small">${esc(C.lessons[p.lesson].title)}</span><span style="margin-left:auto">${I.chev}</span></div><div class="rb hidden" id="rb${k}"></div></div>`).join("")}</div>`;
    math(host);
    $("#retake").onclick = () => route();
    $$("#review .rh").forEach((h) => h.onclick = () => {
      const k = +h.dataset.k; const b = $("#rb" + k);
      if (!b.classList.contains("hidden")) { b.classList.add("hidden"); return; }
      b.classList.remove("hidden");
      if (b.dataset.built) return; b.dataset.built = 1;
      const p = problems[k];
      const your = answers[k] == null ? "<i>no answer</i>" : p.choices ? `${String.fromCharCode(65 + answers[k])}. ${p.choices[answers[k]]}` : esc(answers[k]) + " " + (p.unit || "");
      b.innerHTML = `<div class="qtext">${p.q}</div>${p.choices ? `<ol type="A">${p.choices.map((c, i) => `<li style="${i === p.correct ? "color:var(--green);font-weight:700" : ""}">${c}</li>`).join("")}</ol>` : ""}
        <p><b>Your answer:</b> ${your} &nbsp; <b>Correct:</b> ${p.choices ? String.fromCharCode(65 + p.correct) : P.sig(p.answer, 3) + " " + (p.unit || "")}</p>
        <div class="solution"><b>Worked solution</b><ol>${(p.solution || []).map((s) => `<li>${s}</li>`).join("")}</ol></div><div class="mh"></div>`;
      math(b);
      if (p.model) activeModels.push(window.Models.mount($(".mh", b), p.model, { chapter: C.lessons[p.lesson].chapter, steps: p.solution }));
    });
  }
  function runTest(cfg) {
    const host = $("#ex");
    testIntro(host, cfg, ({ time, showModels }) => {
      const problems = cfg.make();
      runSet(host, {
        mode: "test", problems, title: cfg.title, kicker: cfg.kicker, timeLimit: time, showModels, fullWidth: cfg.fullWidth,
        onFinish: (res, answers) => testResults(host, cfg, problems, res, answers),
      });
    });
  }
  function pageChapterTest(n, kind) {
    const ch = C.chapter(n); if (!ch) return notFound();
    const ids = ch.lessons.map((l) => l.id);
    const quiz = kind === "quiz";
    layout(courseSide(ch.n), `<div class="crumbs"><a href="#/">Course</a> › <a href="#/ch/${ch.n}">Chapter ${ch.n}</a> › ${quiz ? "Quiz" : "Unit test"}</div><div id="ex"></div>`);
    runTest({
      kind: quiz ? "quiz" : "unit", updateMastery: true, back: `#/ch/${ch.n}`,
      kicker: `Chapter ${ch.n}: ${ch.title}`, title: quiz ? `Chapter ${ch.n} quiz` : `Chapter ${ch.n} unit test`,
      desc: quiz ? "A quick check across this chapter's lessons." : "A full test over every lesson in this chapter. Each skill you answer correctly levels up; misses send you back to practice.",
      bullets: [`${quiz ? 6 : 12} questions, fresh numbers every attempt`, "Use your AP equation sheet (top bar → Equation sheet)", "Answers are checked as you go; full review with models at the end"],
      times: quiz ? [10, 15] : [20, 30, 45], defTime: 0,
      make: () => pickProblems(ids, quiz ? 6 : 12),
    });
  }
  function pageFinal() {
    layout(courseSide(null), `<div class="crumbs"><a href="#/">Course</a> › Final exam</div><div id="ex"></div>`);
    const all = C.chapters.flatMap((c) => c.lessons.map((l) => l.id));
    let n = 40;
    runTest({
      kind: "final", updateMastery: true, back: "#/", kicker: "AP Physics C: Mechanics", title: "Final exam — all chapters",
      desc: "Covers every chapter in the course with an AP-style mix of calculation and concept questions. A good dress rehearsal for the end-of-year exam.",
      bullets: ["40 questions drawn from all 14 chapters", "Calculus-based items included (derivatives, integrals, differential equations)", "Every skill you get right levels up; your breakdown shows exactly what to review"],
      times: [45, 80], defTime: 80,
      make: () => {
        // guarantee coverage: 2 per chapter first, then fill
        const chosen = [];
        C.chapters.forEach((c) => chosen.push(...pickProblems(c.lessons.map((l) => l.id), 2)));
        const rest = pickProblems(all.filter((id) => !id.startsWith("1-")), n - chosen.length);
        return chosen.concat(rest).sort(() => Math.random() - 0.5).slice(0, n);
      },
    });
  }

  // ---------- test prep ----------
  function parsePrepText(text) {
    const s = text.toLowerCase();
    const chs = new Set();
    if (/\b(everything|all|whole course|entire|final)\b/.test(s) && !/chapter|ch\.?\s*\d|unit/.test(s)) C.chapters.forEach((c) => chs.add(c.n));
    // ranges like 7-9 or 7 to 9 or 7 through 9
    s.replace(/(?:chapters?|ch\.?|chs\.?)\s*([\d\s,&and\-–tohrug]+)/g, (m, list) => {
      list.replace(/(\d+)\s*(?:-|–|to|through|thru)\s*(\d+)/g, (mm, a, b) => { for (let k = +a; k <= +b; k++) chs.add(k); return ""; })
        .replace(/\d+/g, (d) => { chs.add(+d); return ""; });
      return m;
    });
    // AP unit mapping
    const unitMap = { 1: [2, 3, 4], 2: [5, 6, 13], 3: [7, 8], 4: [9], 5: [10, 12], 6: [11, 13], 7: [15] };
    s.replace(/units?\s*([\d\s,&and\-–]+)/g, (m, list) => { list.replace(/\d+/g, (d) => (unitMap[+d] || []).forEach((c) => chs.add(c))); return m; });
    // topic keywords → lessons
    const lessons = new Set();
    const kw = { projectile: ["4-2"], friction: ["6-1"], drag: ["6-2"], "terminal": ["6-2"], circular: ["4-3", "6-3"], spring: ["7-3", "15-1", "15-2"], power: ["7-5"], momentum: ["9-2", "9-3"], collision: ["9-3", "9-4", "9-5"], impulse: ["9-2"], "center of mass": ["9-1"], torque: ["10-4", "11-2"], inertia: ["10-3"], rolling: ["11-1"], "angular momentum": ["11-2", "11-3"], equilibrium: ["12-1", "12-2"], orbit: ["13-4", "13-5"], kepler: ["13-4"], escape: ["13-3"], gravit: ["13-1", "13-2", "13-3"], pendulum: ["15-3"], shm: ["15-1", "15-2"], "harmonic": ["15-1", "15-2"], oscillat: ["15-1", "15-2", "15-3"], vector: ["3-1", "3-2", "3-3"], "free fall": ["2-4"], kinematic: ["2-3", "4-1"], newton: ["5-1", "5-2", "5-3"], incline: ["5-3", "6-1"], "potential energy": ["8-1", "8-3"], energy: ["7-1", "8-2", "8-4"], work: ["7-1", "7-2", "7-4"] };
    Object.entries(kw).forEach(([k, ids]) => { if (s.includes(k)) ids.forEach((i) => lessons.add(i)); });
    const n = (s.match(/(\d+)\s*(?:questions|problems|qs)/) || [])[1];
    const mins = (s.match(/(\d+)\s*(?:min|minutes)/) || [])[1];
    return { chapters: [...chs].filter((c) => C.chapter(c)), lessons: [...lessons], n: n ? +n : null, minutes: mins ? +mins : null, hard: /hard|difficult|challeng|ap[- ]level/.test(s), easy: /easy|basic|intro/.test(s), weak: /weak|struggl|need work/.test(s), print: /print|paper|pdf/.test(s) };
  }
  let prepState = null;
  function pagePrep(preset) {
    const st = prepState || { chapters: [], lessons: [], n: 15, level: "mixed", minutes: 0, format: "interactive", weak: false };
    if (preset && /^ch(\d+)$/.test(preset)) { st.chapters = [+preset.slice(2)]; st.lessons = []; }
    prepState = st;
    const chk = C.chapters.map((c) => `<label><input type="checkbox" data-ch="${c.n}" ${st.chapters.includes(c.n) ? "checked" : ""}> Ch. ${c.n}: ${esc(c.title)}</label>`).join("");
    const main = `<div class="crumbs"><a href="#/">Course</a> › Prepare me for my test</div>
      <h1>Prepare me for my test</h1><p class="muted" style="max-width:720px">Tell me what's on your test and I'll build a practice test from those chapters — new numbers every time, with worked solutions and an interactive model for every question.</p>
      <div class="card shadow"><label class="small" style="font-weight:700">What's on your test?</label>
        <div class="ask-box" style="margin-top:6px"><input id="ask" placeholder="e.g. “Make me a practice test for everything covered in chapter 7”"><button class="btn" id="askGo">Build my test</button></div>
        <div class="chips">${["Make me a practice test for everything covered in chapter 7", "Chapters 9 and 10, 20 questions, 40 minutes", "Hard test on rotation: chapters 10 through 12", "Unit 3 — work, energy and power", "Projectile motion and circular motion", "Focus on my weak skills from chapters 2-6"].map((c) => `<button class="chip">${c}</button>`).join("")}</div>
        <div id="askMsg" class="small" style="margin-top:10px"></div></div>
      <div class="prep-grid"><div class="card"><h3>Chapters</h3><div class="ch-check" id="chk">${chk}</div>
          <div style="margin-top:10px"><button class="btn ghost sm" id="all">Select all</button><button class="btn ghost sm" id="none">Clear</button></div>
          <div id="lessonPick" style="margin-top:12px"></div></div>
        <div class="card"><h3>Test settings</h3>
          <div class="field"><label>Number of questions</label><input type="number" id="nq" min="3" max="60" value="${st.n}"></div>
          <div class="field"><label>Difficulty</label><div class="seg" id="lvl">${["easy", "mixed", "hard"].map((l) => `<button data-v="${l}" class="${st.level === l ? "on" : ""}">${l === "easy" ? "Warm-up" : l === "mixed" ? "Mixed" : "AP-level"}</button>`).join("")}</div></div>
          <div class="field"><label>Time limit</label><div class="seg" id="tm">${[0, 15, 30, 45, 60, 90].map((t) => `<button data-v="${t}" class="${st.minutes === t ? "on" : ""}">${t ? t + "m" : "None"}</button>`).join("")}</div></div>
          <div class="field"><label>Format</label><div class="seg" id="fmt"><button data-v="interactive" class="${st.format === "interactive" ? "on" : ""}">Interactive</button><button data-v="print" class="${st.format === "print" ? "on" : ""}">Printable + answer key</button></div></div>
          <label class="small" style="display:flex;gap:8px;align-items:center;margin-bottom:16px"><input type="checkbox" id="weak" ${st.weak ? "checked" : ""}> Focus on my weakest skills</label>
          <button class="btn" id="build" style="width:100%">Generate practice test</button>
          <div class="small muted" style="margin-top:8px" id="sumLine"></div></div></div>
      <div id="ex"></div>`;
    layout(courseSide(null), main, false);
    const sync = () => {
      st.chapters = $$("#chk input:checked").map((i) => +i.dataset.ch);
      st.n = Math.max(3, Math.min(60, +$("#nq").value || 15)); st.weak = $("#weak").checked;
      const ls = st.chapters.flatMap((n) => C.chapter(n).lessons);
      $("#lessonPick").innerHTML = ls.length ? `<div class="small" style="font-weight:700;margin-bottom:4px">Limit to specific lessons (optional)</div>${ls.map((l) => `<label class="small" style="display:flex;gap:8px;padding:2px 0"><input type="checkbox" data-l="${l.id}" ${st.lessons.includes(l.id) ? "checked" : ""}> ${l.id.replace("-", ".")} ${esc(l.title)}</label>`).join("")}` : "";
      $$("#lessonPick input").forEach((i) => i.onchange = () => { st.lessons = $$("#lessonPick input:checked").map((x) => x.dataset.l); summary(); });
      st.lessons = st.lessons.filter((id) => st.chapters.includes(C.lessons[id].chapter));
      summary();
    };
    const summary = () => { const L = scopeLessons(st); $("#sumLine").textContent = L.length ? `${st.n} questions from ${L.length} skill${L.length > 1 ? "s" : ""} in ${st.chapters.length ? "chapter" + (st.chapters.length > 1 ? "s " : " ") + st.chapters.join(", ") : "your topics"}${st.minutes ? ` · ${st.minutes} min` : ""}` : "Pick at least one chapter."; };
    $$("#chk input").forEach((i) => i.onchange = sync);
    $("#nq").onchange = sync; $("#weak").onchange = sync;
    $("#all").onclick = () => { $$("#chk input").forEach((i) => i.checked = true); sync(); };
    $("#none").onclick = () => { $$("#chk input").forEach((i) => i.checked = false); st.lessons = []; sync(); };
    const seg = (id, key, num) => $$(`#${id} button`).forEach((b) => b.onclick = () => { $$(`#${id} button`).forEach((x) => x.classList.remove("on")); b.classList.add("on"); st[key] = num ? +b.dataset.v : b.dataset.v; summary(); });
    seg("lvl", "level"); seg("tm", "minutes", true); seg("fmt", "format");
    const ask = () => {
      const r = parsePrepText($("#ask").value);
      if (!r.chapters.length && !r.lessons.length) { $("#askMsg").innerHTML = '<span style="color:var(--red)">I couldn\'t find a chapter or topic in that. Try “chapter 7” or “projectile motion”.</span>'; return; }
      st.chapters = r.chapters.length ? r.chapters : [...new Set(r.lessons.map((id) => C.lessons[id].chapter))];
      st.lessons = r.chapters.length ? [] : r.lessons;
      if (r.n) st.n = r.n; if (r.minutes != null) st.minutes = r.minutes; if (r.hard) st.level = "hard"; else if (r.easy) st.level = "easy"; st.weak = r.weak; if (r.print) st.format = "print";
      prepState = st; pagePrep(); build();
    };
    $("#askGo").onclick = ask; $("#ask").onkeydown = (e) => { if (e.key === "Enter") ask(); };
    $$(".chip").forEach((c) => c.onclick = () => { $("#ask").value = c.textContent; ask(); });
    $("#build").onclick = () => { sync(); build(); };
    sync();
  }
  function scopeLessons(st) { return st.lessons.length ? st.lessons : st.chapters.flatMap((n) => C.chapter(n).lessons.map((l) => l.id)); }
  function build() {
    const st = prepState; const ids = scopeLessons(st);
    if (!ids.length) { toast("Pick at least one chapter"); return; }
    const title = `Practice test: ${st.lessons.length ? st.lessons.map((id) => C.lessons[id].title).slice(0, 3).join(", ") + (st.lessons.length > 3 ? "…" : "") : "Chapter" + (st.chapters.length > 1 ? "s " : " ") + st.chapters.join(", ")}`;
    const problems = pickProblems(ids, st.n, { level: st.level, weak: st.weak });
    const host = $("#ex");
    host.scrollIntoView({ behavior: "smooth" });
    if (st.format === "print") {
      host.innerHTML = `<div class="card shadow" style="margin-top:20px"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><h2 style="margin:0">${esc(title)}</h2><div class="muted small">${problems.length} questions${st.minutes ? ` · ${st.minutes} minutes` : ""} · AP Physics C: Mechanics equation sheet allowed</div></div><div class="no-print" style="display:flex;gap:8px"><button class="btn secondary sm" id="key">Show answer key</button><button class="btn sm" onclick="window.print()">Print</button></div></div></div>
        ${problems.map((p, k) => `<div class="test-q"><div class="qn"><span>Question ${k + 1}</span><span>Ch. ${C.lessons[p.lesson].chapter} · ${esc(C.lessons[p.lesson].title)}</span></div><div>${p.q}</div>${p.choices ? `<ol type="A">${p.choices.map((c) => `<li>${c}</li>`).join("")}</ol>` : `<div style="height:70px;border-bottom:1px dashed #ccc;margin-top:8px"></div><div class="small muted">Answer: ________ ${p.unit || ""}</div>`}</div>`).join("")}
        <div id="akey" class="hidden"><h2>Answer key</h2>${problems.map((p, k) => `<div class="test-q"><div class="qn">Question ${k + 1} — ${p.choices ? String.fromCharCode(65 + p.correct) : P.sig(p.answer, 3) + " " + (p.unit || "")}</div><ol>${(p.solution || []).map((s) => `<li>${s}</li>`).join("")}</ol></div>`).join("")}</div>`;
      math(host);
      $("#key").onclick = () => { $("#akey").classList.toggle("hidden"); };
      return;
    }
    host.innerHTML = '<div id="ex2" style="margin-top:20px"></div>';
    const cfg = { kind: "prep", updateMastery: true, back: "#/prep", kicker: "Prepare me for my test", title };
    runSet($("#ex2"), { mode: "test", problems, title, kicker: cfg.kicker, timeLimit: st.minutes, onFinish: (res, ans) => testResults($("#ex2"), cfg, problems, res, ans) });
  }

  // ---------- formula sheet ----------
  function pageFormulas() {
    const S = window.EQUATIONS || [];
    const main = `<div class="crumbs"><a href="#/">Course</a> › Equation sheet</div><h1>AP Physics C: Mechanics equation sheet</h1>
      <p class="muted">The 2024 table of information you may use on the exam, organized by topic, with the chapter where each equation lives. Click a chapter tag to jump to it.</p>
      <div class="card"><b>Constants:</b> $G = 6.67\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}$ &nbsp;·&nbsp; $g = 9.8\\ \\mathrm{m/s^2} = 9.8\\ \\mathrm{N/kg}$ &nbsp;·&nbsp; Assume inertial frames, no air resistance, ideal springs and strings unless stated.
        <div class="small muted" style="margin-top:8px">Common angles: $\\sin 37^\\circ = \\cos 53^\\circ = 3/5$, $\\cos 37^\\circ = \\sin 53^\\circ = 4/5$, $\\tan 37^\\circ = 3/4$, $\\sin 30^\\circ = 1/2$, $\\cos 30^\\circ = \\sqrt3/2$, $\\sin 45^\\circ = \\sqrt2/2$.</div></div>
      <div class="fs-grid">${S.map((g) => `<div class="card"><h3>${esc(g.group)} ${g.ch.map((c) => `<a class="pill blue" href="#/ch/${c}">Ch. ${c}</a>`).join(" ")}</h3><table>${g.eq.map(([e, n]) => `<tr><td>$${e}$</td><td class="n">${esc(n)}</td></tr>`).join("")}</table></div>`).join("")}</div>`;
    layout(courseSide(null), main);
  }

  function notFound() { layout(courseSide(null), `<h1>Page not found</h1><p><a href="#/">Back to the course</a></p>`); }

  // ---------- router ----------
  function route() {
    teardown();
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    try {
      if (!parts.length) return pageHome();
      if (parts[0] === "ch") {
        const n = parts[1];
        if (parts.length === 2) return pageChapter(n);
        if (parts[2] === "l") return pageLesson(n, parts[3], parts[4], parts[5]);
        if (parts[2] === "quiz") return pageChapterTest(n, "quiz");
        if (parts[2] === "test") return pageChapterTest(n, "test");
        if (parts[2] === "book") return pageBook(n, parts[3]);
      }
      if (parts[0] === "final") return pageFinal();
      if (parts[0] === "prep") return pagePrep(parts[1]);
      if (parts[0] === "formulas") return pageFormulas();
      notFound();
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div class="main"><h1>Something went wrong</h1><pre>${esc(e.stack || e)}</pre></div>`;
    }
  }
  header();
  window.addEventListener("hashchange", route);
  route();
  window.App = { route, pickProblems, parsePrepText };
})();
