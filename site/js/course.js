/* Course map: chapters of Fundamentals of Physics (12e) that the AP Physics C: Mechanics exam covers. */
window.COURSE = window.COURSE || { chapters: [], lessons: {}, problems: {}, articles: {} };
(function () {
  const C = window.COURSE;
  const chapters = [
    { n: 1, title: "Measurement", pages: "1–12", ap: "Foundations", color: "#0c7f99", icon: "ruler",
      blurb: "SI units, prefixes, unit conversion and dimensional analysis — the language every later chapter is written in.",
      lessons: [
        ["1-1", "Units, prefixes & conversions", "1.1", "1"],
        ["1-2", "Significant figures, time, mass & density", "1.2–1.3", "5"],
      ] },
    { n: 2, title: "Motion Along a Straight Line", pages: "13–43", ap: "AP Unit 1 · Kinematics", color: "#1865f2", icon: "line",
      blurb: "Position, velocity and acceleration in one dimension, the constant-acceleration equations, free fall, and calculus-based kinematics.",
      lessons: [
        ["2-1", "Position, displacement & average velocity", "2.1", "13"],
        ["2-2", "Instantaneous velocity & acceleration (derivatives)", "2.2–2.3", "18"],
        ["2-3", "Constant acceleration", "2.4", "23"],
        ["2-4", "Free-fall acceleration", "2.5", "28"],
        ["2-5", "Integrals & motion graphs", "2.6", "30"],
      ] },
    { n: 3, title: "Vectors", pages: "44–66", ap: "AP Unit 1 · Kinematics", color: "#7854f7", icon: "vector",
      blurb: "Components, unit-vector notation, adding vectors, and the dot and cross products used all year.",
      lessons: [
        ["3-1", "Vectors & their components", "3.1", "44"],
        ["3-2", "Unit vectors & adding by components", "3.2", "50"],
        ["3-3", "Dot & cross products", "3.3", "52"],
      ] },
    { n: 4, title: "Motion in Two and Three Dimensions", pages: "67–100", ap: "AP Unit 1 · Kinematics", color: "#1865f2", icon: "parabola",
      blurb: "Vector kinematics, projectile motion, uniform circular motion and relative motion.",
      lessons: [
        ["4-1", "Position, velocity & acceleration vectors", "4.1–4.3", "67"],
        ["4-2", "Projectile motion", "4.4", "75"],
        ["4-3", "Uniform circular motion", "4.5", "82"],
        ["4-4", "Relative motion", "4.6–4.7", "84"],
      ] },
    { n: 5, title: "Force and Motion — I", pages: "101–131", ap: "AP Unit 2 · Force & Translational Dynamics", color: "#e35c2a", icon: "force",
      blurb: "Newton's three laws, free-body diagrams, weight, normal force and tension, and multi-body systems.",
      lessons: [
        ["5-1", "Newton's first & second laws", "5.1", "101"],
        ["5-2", "Particular forces & free-body diagrams", "5.2", "109"],
        ["5-3", "Applying Newton's laws (inclines, pulleys, 3rd law)", "5.3", "113"],
      ] },
    { n: 6, title: "Force and Motion — II", pages: "132–155", ap: "AP Unit 2 · Force & Translational Dynamics", color: "#e35c2a", icon: "friction",
      blurb: "Static and kinetic friction, drag and terminal speed (with the AP C differential equation), and circular-motion dynamics.",
      lessons: [
        ["6-1", "Friction", "6.1", "132"],
        ["6-2", "Drag force & terminal speed", "6.2", "138"],
        ["6-3", "Dynamics of uniform circular motion", "6.3", "140"],
      ] },
    { n: 7, title: "Kinetic Energy and Work", pages: "156–185", ap: "AP Unit 3 · Work, Energy & Power", color: "#00a60e", icon: "energy",
      blurb: "Kinetic energy, the work–kinetic energy theorem, work by gravity, springs and variable forces, and power.",
      lessons: [
        ["7-1", "Kinetic energy & the work–KE theorem", "7.1–7.2", "156"],
        ["7-2", "Work done by gravity", "7.3", "163"],
        ["7-3", "Work done by a spring", "7.4", "167"],
        ["7-4", "Work by a variable force", "7.5", "170"],
        ["7-5", "Power", "7.6", "174"],
      ] },
    { n: 8, title: "Potential Energy and Conservation of Energy", pages: "186–224", ap: "AP Unit 3 · Work, Energy & Power", color: "#00a60e", icon: "coaster",
      blurb: "Conservative forces, F = −dU/dx, conservation of mechanical energy, potential-energy curves, and friction/thermal energy.",
      lessons: [
        ["8-1", "Potential energy & conservative forces", "8.1", "186"],
        ["8-2", "Conservation of mechanical energy", "8.2", "193"],
        ["8-3", "Reading a potential-energy curve", "8.3", "196"],
        ["8-4", "External work, friction & total energy", "8.4–8.5", "201"],
      ] },
    { n: 9, title: "Center of Mass and Linear Momentum", pages: "225–269", ap: "AP Unit 4 · Linear Momentum", color: "#d92916", icon: "collide",
      blurb: "Center of mass (including continuous objects), momentum, impulse, conservation of momentum and collisions in 1D and 2D.",
      lessons: [
        ["9-1", "Center of mass", "9.1–9.2", "225"],
        ["9-2", "Momentum & impulse", "9.3–9.4", "234"],
        ["9-3", "Conservation of momentum & inelastic collisions", "9.5–9.6", "240"],
        ["9-4", "Elastic collisions in one dimension", "9.7", "247"],
        ["9-5", "Collisions in two dimensions", "9.8", "251"],
      ] },
    { n: 10, title: "Rotation", pages: "270–309", ap: "AP Unit 5 · Torque & Rotational Dynamics", color: "#9059ff", icon: "rotate",
      blurb: "Angular variables, constant angular acceleration, rotational inertia, torque and Newton's second law for rotation.",
      lessons: [
        ["10-1", "Rotational variables", "10.1", "270"],
        ["10-2", "Constant α & linking linear/angular", "10.2–10.3", "279"],
        ["10-3", "Rotational inertia & rotational KE", "10.4–10.5", "285"],
        ["10-4", "Torque & Newton's 2nd law for rotation", "10.6–10.7", "291"],
        ["10-5", "Work & rotational kinetic energy", "10.8", "296"],
      ] },
    { n: 11, title: "Rolling, Torque, and Angular Momentum", pages: "310–343", ap: "AP Unit 6 · Energy & Momentum of Rotating Systems", color: "#9059ff", icon: "roll",
      blurb: "Rolling without slipping, the torque vector, angular momentum and its conservation.",
      lessons: [
        ["11-1", "Rolling (translation + rotation)", "11.1–11.3", "310"],
        ["11-2", "Torque revisited & angular momentum", "11.4–11.6", "317"],
        ["11-3", "Angular momentum of rigid bodies & its conservation", "11.7–11.8", "325"],
      ] },
    { n: 12, title: "Equilibrium and Elasticity", pages: "344–371", ap: "AP Unit 5 · Torque & Rotational Dynamics", color: "#b5651d", icon: "beam",
      blurb: "The two conditions for static equilibrium and how to solve beam, ladder and strut problems.",
      lessons: [
        ["12-1", "Conditions for equilibrium", "12.1", "344"],
        ["12-2", "Static equilibrium problems (beams & ladders)", "12.2", "349"],
      ] },
    { n: 13, title: "Gravitation", pages: "372–405", ap: "AP Units 2, 3 & 6 · Gravitation & Orbits", color: "#14bf96", icon: "orbit",
      blurb: "Newton's law of gravitation, g inside and outside a planet, gravitational potential energy, escape speed, Kepler's laws and orbital energy.",
      lessons: [
        ["13-1", "Newton's law of gravitation & superposition", "13.1–13.2", "372"],
        ["13-2", "Gravity near & inside Earth", "13.3–13.4", "377"],
        ["13-3", "Gravitational potential energy & escape speed", "13.5", "383"],
        ["13-4", "Kepler's laws", "13.6", "387"],
        ["13-5", "Satellites: orbits & energy", "13.7", "390"],
      ] },
    { n: 15, title: "Oscillations", pages: "436–467", ap: "AP Unit 7 · Oscillations", color: "#ca337c", icon: "wave",
      blurb: "Simple harmonic motion, its energy, simple and physical pendulums, and (enrichment) damping and resonance.",
      lessons: [
        ["15-1", "Simple harmonic motion", "15.1", "436"],
        ["15-2", "Energy in SHM", "15.2", "444"],
        ["15-3", "Pendulums (simple & physical)", "15.3–15.4", "446"],
        ["15-4", "Damped & forced oscillations", "15.5–15.6", "453"],
      ] },
  ];
  C.chapters = chapters.map((ch) => {
    ch.lessons = ch.lessons.map(([id, title, modules, page]) => {
      const L = { id, title, modules, page, chapter: ch.n };
      C.lessons[id] = L;
      return L;
    });
    return ch;
  });
  C.chapter = (n) => C.chapters.find((c) => c.n === +n);
})();
