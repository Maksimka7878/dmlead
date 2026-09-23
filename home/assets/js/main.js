/* =========================================================
   DM.LEADS — interactions
   GSAP + ScrollTrigger + Lenis (optional: the page works without them)
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var TAU = Math.PI * 2, DEG = Math.PI / 180;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var G = window.gsap, ST = window.ScrollTrigger;
  var HAS_GSAP = !!(G && ST);
  if (HAS_GSAP) {
    G.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
  }
  root.classList.add('js');
  if (REDUCE) root.classList.add('reduced');

  var NBSP = ' ';
  function fmtNum(n) { return Math.round(n).toLocaleString('ru-RU').replace(/[\s ]/g, NBSP); }
  function fmtRub(n) { return fmtNum(n) + NBSP + '₽'; }
  function plural(n, one, few, many) {
    var n10 = n % 10, n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few;
    return many;
  }
  function safe(name, fn) { try { return fn(); } catch (e) { if (window.console) console.warn('[dmleads] ' + name, e); } }

  /* ---------- Toast + clipboard ---------- */
  var toastTimer = 0;
  function toast(msg) {
    var t = $('.toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
    requestAnimationFrame(function () { t.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove('is-on');
      setTimeout(function () { t.hidden = true; }, 450);
    }, 2800);
  }
  function copyText(text) {
    var fallback = function () {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0'; ta.style.top = '0';
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand('copy'); ta.remove(); return ok;
      } catch (e) { return false; }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
      }
    } catch (e) { /* fall through */ }
    return Promise.resolve(fallback());
  }

  /* ---------- Rolling nav labels ---------- */
  function wrapRoll(el) {
    if (el.querySelector('.roll')) return;
    var text = el.textContent.trim();
    if (!text) return;
    el.setAttribute('aria-label', text);
    var roll = document.createElement('span'); roll.className = 'roll'; roll.setAttribute('aria-hidden', 'true');
    var inner = document.createElement('span'); inner.textContent = text; inner.setAttribute('data-t', text);
    roll.appendChild(inner);
    el.textContent = '';
    el.appendChild(roll);
  }
  if (FINE && !REDUCE) $$('[data-roll]').forEach(wrapRoll);

  /* ---------- Text splitting ---------- */
  function splitInto(el, mode) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/([ \t\n\r]+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^[ \t\n\r]+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            if (mode === 'mask') {
              var o = document.createElement('span'); o.className = 'wm';
              var i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
              o.appendChild(i); frag.appendChild(o); out.push(i);
            } else {
              var w = document.createElement('span'); w.className = 'w'; w.textContent = p;
              frag.appendChild(w); out.push(w);
            }
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains('sr-only')) {
          walk(child);
        }
      });
    })(el);
    return out;
  }

  /* ---------- Odometer ---------- */
  function odoSet(el, text, instant) {
    if (!el) return;
    if (!el._odo) {
      var initial = el.textContent.trim();
      el.textContent = '';
      var sr = document.createElement('span'); sr.className = 'sr-only';
      var vis = document.createElement('span'); vis.className = 'odo'; vis.setAttribute('aria-hidden', 'true');
      el.appendChild(sr); el.appendChild(vis);
      el._odo = { sr: sr, vis: vis, value: null, pattern: null, cols: [] };
      if (text == null) text = initial;
      instant = true;
    }
    var o = el._odo;
    if (o.value === text) return;
    o.sr.textContent = text;
    var chars = Array.from(text);
    var pattern = chars.map(function (c) { return /\d/.test(c) ? '0' : c; }).join('');
    if (o.pattern !== pattern) {
      o.vis.textContent = '';
      o.cols = [];
      chars.forEach(function (c) {
        if (/\d/.test(c)) {
          var d = document.createElement('span'); d.className = 'odo__d';
          var col = document.createElement('span'); col.className = 'odo__col';
          for (var k = 0; k < 10; k++) { var s = document.createElement('span'); s.textContent = k; col.appendChild(s); }
          d.appendChild(col); o.vis.appendChild(d); o.cols.push(col);
        } else {
          var sp = document.createElement('span'); sp.className = 'odo__s'; sp.textContent = c; o.vis.appendChild(sp);
        }
      });
      o.pattern = pattern;
      o.vis.offsetHeight; // eslint-disable-line no-unused-expressions
    }
    var j = 0;
    var digits = chars.filter(function (c) { return /\d/.test(c); });
    o.cols.forEach(function (col) { if (instant || REDUCE) col.style.transition = 'none'; });
    digits.forEach(function (c) {
      var col = o.cols[j];
      col.style.transitionDelay = (instant || REDUCE) ? '0s' : (j * 0.04) + 's';
      col.style.transform = 'translateY(' + (-Number(c) * 10) + '%)';
      j++;
    });
    if (instant || REDUCE) {
      o.vis.offsetHeight; // eslint-disable-line no-unused-expressions
      o.cols.forEach(function (col) { col.style.transition = ''; });
    }
    o.value = text;
  }

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */
  var lenis = null;
  safe('lenis', function () {
    if (REDUCE || !window.Lenis) return;
    lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    if (HAS_GSAP) {
      lenis.on('scroll', ST.update);
      G.ticker.add(function (t) { lenis.raf(t * 1000); });
      G.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  });
  function onScrollY(cb) {
    if (lenis) lenis.on('scroll', function (e) { cb(e.scroll); });
    else window.addEventListener('scroll', function () { cb(window.scrollY); }, { passive: true });
    cb(window.scrollY);
  }
  function scrollToEl(target) {
    if (lenis) { lenis.scrollTo(target, { duration: 1.2, offset: target === 0 ? 0 : -8 }); return; }
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: REDUCE ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var t = document.getElementById(id.slice(1));
    if (!t) return;
    e.preventDefault();
    if (window.__closeMenu) window.__closeMenu();
    scrollToEl(id === '#top' ? 0 : t);
    if (id === '#main') { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  });

  /* =========================================================
     NAV + MENU + DOCK + ACTIVE SECTION
     ========================================================= */
  safe('nav', function () {
    var nav = $('[data-nav]'); if (!nav) return;
    var burger = $('.burger'), menu = $('#menu'), dock = $('.dock');
    var last = 0, open = false, ctaVisible = false;
    if ('IntersectionObserver' in window && dock) {
      var seen = new Set();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
        ctaVisible = seen.size > 0;
        dock.classList.toggle('is-on', !ctaVisible && last > window.innerHeight * 0.85);
      }, { threshold: 0 });
      [$('.contact'), $('.footer'), $('.offer'), $('.hero__cta')].forEach(function (el) { if (el) io.observe(el); });
    }
    onScrollY(function (y) {
      nav.classList.toggle('is-compact', y > 40);
      if (!open) {
        if (y > last + 4 && y > window.innerHeight * 0.9) nav.classList.add('is-hidden');
        else if (y < last - 4 || y < 60) nav.classList.remove('is-hidden');
      }
      last = y;
      if (dock) dock.classList.toggle('is-on', !ctaVisible && y > window.innerHeight * 0.85);
    });

    // active link
    var links = $$('.nav__links a[href^="#"]');
    if ('IntersectionObserver' in window && links.length) {
      var map = {};
      links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var a = map[en.target.id];
          if (!a) return;
          if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l === a); });
          else a.classList.remove('is-active');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
      var hero = $('.hero');
      if (hero) new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) links.forEach(function (l) { l.classList.remove('is-active'); });
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }

    if (!burger || !menu) return;
    function setOpen(v) {
      open = v;
      burger.setAttribute('aria-expanded', String(v));
      burger.setAttribute('aria-label', v ? 'Закрыть меню' : 'Открыть меню');
      menu.hidden = !v;
      nav.classList.remove('is-hidden');
      if (lenis) { if (v) lenis.stop(); else lenis.start(); }
      root.style.overflow = v ? 'hidden' : '';
      if (v && HAS_GSAP && !REDUCE) {
        G.fromTo($$('.menu__links a'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.035, ease: 'power3.out' });
      }
    }
    burger.addEventListener('click', function () { setOpen(!open); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { setOpen(false); burger.focus(); } });
    window.__closeMenu = function () { if (open) setOpen(false); };
  });

  /* =========================================================
     PHONE — lock screen + incoming leads
     ========================================================= */
  var phone = safe('phone', function () {
    var screen = $('.phone__screen'), list = $('[data-notifs]');
    if (!screen || !list) return null;
    var clock = $('[data-clock]'), date = $('[data-date]');
    function tick() {
      var d = new Date();
      if (clock) clock.textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
      if (date) {
        var s = d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
        date.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      }
    }
    tick(); setInterval(tick, 15000);

    var MAX = 3;
    var ages = $$('.notif', list).map(function (el, i) { return i === 0 ? 0 : 3; });
    function label(m) { return m === 0 ? 'сейчас' : m + NBSP + 'мин назад'; }
    function build(L) {
      var el = document.createElement('div');
      el.className = 'notif';
      el.innerHTML = '<span class="notif__icon" aria-hidden="true"><i></i></span><div class="notif__body"><p class="notif__top"><b></b><time>сейчас</time></p><p class="notif__text"></p></div>';
      el.querySelector('b').textContent = L.title;
      el.querySelector('.notif__text').textContent = L.text;
      return el;
    }
    function push(L) {
      var items = $$('.notif', list).filter(function (n) { return !n.classList.contains('is-leaving'); });
      var first = items.map(function (n) { return n.getBoundingClientRect().top; });
      var el = build(L);
      list.insertBefore(el, list.firstChild);
      ages = [0].concat(ages.map(function (a) { return a + 1 + Math.floor(Math.random() * 3); }));
      var all = $$('.notif', list).filter(function (n) { return !n.classList.contains('is-leaving'); });
      all.forEach(function (n, i) { var t = n.querySelector('time'); if (t) t.textContent = label(ages[i] || 0); });
      if (!REDUCE && el.animate) {
        items.forEach(function (n, i) {
          var dy = first[i] - n.getBoundingClientRect().top;
          if (dy) n.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2, 1, .3, 1)' });
        });
        el.classList.add('is-new');
      }
      while (all.length > MAX) {
        var old = all.pop();
        ages.pop();
        old.classList.add('is-leaving');
        if (old.animate && !REDUCE) {
          old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' });
          setTimeout((function (o) { return function () { o.remove(); }; })(old), 380);
        } else old.remove();
      }
    }
    function target() {
      var r = list.getBoundingClientRect();
      return { x: r.left + r.width * 0.5, y: r.top + 24 };
    }
    return { push: push, target: target };
  });

  /* =========================================================
     HERO MAP (WebGL) — Moscow rings, sweep, leads fly into the phone
     ========================================================= */
  var radar = safe('radar', function () {
    var hero = $('.hero'), canvas = $('.hero__gl'), overlay = $('.hero__overlay');
    var phoneEl = $('.phone'), copyEl = $('.hero__copy');
    if (!hero || !canvas || !overlay) return null;
    var gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance' }) ||
           canvas.getContext('experimental-webgl');
    } catch (e) { gl = null; }
    if (!gl) return null;

    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision highp float;',
      'uniform vec2 uRes;uniform vec2 uCenter;uniform float uScale;uniform float uTime;uniform float uSweep;',
      'uniform float uReveal;uniform float uFade;uniform float uPx;',
      'uniform vec2 uDirs[12];uniform vec4 uBlips[6];',
      'const float TAU=6.28318530718;',
      'const vec3 WHITE=vec3(1.);const vec3 INK=vec3(.059,.090,.165);',
      'const vec3 ROYAL=vec3(.145,.388,.922);const vec3 IND=vec3(.388,.400,.945);',
      'const vec3 VIO=vec3(.545,.361,.965);const vec3 SLATE=vec3(.580,.639,.722);',
      'const vec3 SKYT=vec3(.875,.922,1.);const vec3 LAVT=vec3(.941,.922,1.);',
      'float wob(float a){return .55*sin(2.*a+.7)+.30*sin(3.*a+2.1)+.15*sin(5.*a+4.);}',
      'float aa(float d,float w){return 1.-smoothstep(w,w+uPx*1.3,d);}',
      'void main(){',
      '  vec2 frag=gl_FragCoord.xy;',
      '  vec2 uv=frag/uRes;',
      '  float b1=exp(-2.3*length((uv-vec2(.98,1.05))*vec2(1.,1.2)));',
      '  float b2=exp(-3.*length((uv-vec2(.66,.3))*vec2(1.,1.25)));',
      '  vec3 BG=mix(WHITE,SKYT,b1*.95);BG=mix(BG,LAVT,b2*.8);',
      '  vec2 p=(frag-uCenter)/uScale;',
      '  float r=length(p); float a=atan(p.y,p.x);',
      '  float k=1.+.055*wob(a)+.01*sin(4.*a+uTime*.2+r*5.);',
      '  float rr=r*k;',
      '  float s=.06;',
      '  float minor=aa(abs(fract(rr/s+.5)-.5)*s,uPx*.45)*.12*(1.-smoothstep(.9,2.4,rr));',
      '  float major=0.;',
      '  major=max(major,aa(abs(rr-.085),uPx*.7)*.7);',
      '  major=max(major,aa(abs(rr-.155),uPx*.9));',
      '  major=max(major,aa(abs(rr-.33),uPx*.9));',
      '  major=max(major,aa(abs(rr-1.),uPx*1.1));',
      '  major=max(major,aa(abs(rr-1.018),uPx*.5)*.4);',
      '  float roads=0.;',
      '  for(int i=0;i<12;i++){',
      '    vec2 dir=uDirs[i];',
      '    float along=dot(p,dir); float dist=abs(p.x*dir.y-p.y*dir.x);',
      '    float on=smoothstep(.07,.1,along)*(1.-smoothstep(1.3,2.3,along));',
      '    float dash=smoothstep(.3,.5,fract(along*18.+uTime*.25));',
      '    roads=max(roads,aa(dist,uPx*.5)*on*(.16+.3*dash));',
      '  }',
      '  float sa=mod(a-uSweep,TAU);',
      '  float trail=exp(-sa*1.9);',
      '  float inR=1.-smoothstep(1.02,1.4,r);',
      '  float beam=aa(sa*max(r,.0001),uPx*.6)*inR*step(sa,3.);',
      '  float wedge=exp(-sa*6.)*inR;',
      '  float lines=max(max(minor,major),roads);',
      '  vec3 ACC=mix(mix(ROYAL,IND,smoothstep(0.,.9,sa)),VIO,smoothstep(.9,2.6,sa));',
      '  vec3 lc=mix(INK,ACC,clamp(trail*1.3,0.,1.));',
      '  vec3 col=BG;',
      '  col=mix(col,lc,clamp(lines*(.34+.66*trail)*.62,0.,1.));',
      '  col=mix(col,ACC,clamp(wedge*.12,0.,1.));',
      '  col=mix(col,ROYAL,clamp(beam*.55,0.,1.));',
      '  for(int i=0;i<6;i++){',
      '    vec4 b=uBlips[i];',
      '    float d=length(p-b.xy);',
      '    vec3 bc=mix(SLATE,ROYAL,b.w);',
      '    float core=aa(d,uPx*2.6);',
      '    float halo=exp(-d/(uPx*16.))*.4;',
      '    float ping=aa(abs(d-(1.-b.z)*.08),uPx*.6)*b.z;',
      '    float base=.28*b.w+.12;',
      '    col=mix(col,bc,clamp(core*(base+.9*b.z)+halo*b.z+ping*.7,0.,1.));',
      '  }',
      '  float R=uReveal*1.9;',
      '  col=mix(BG,col,1.-smoothstep(R-.3,R,r));',
      '  float vig=1.-smoothstep(.55,1.6,length((frag-uCenter)/uRes.y));',
      '  col=mix(BG,col,.3+.7*vig);',
      '  col=mix(col,BG,uFade);',
      '  gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aLoc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uCenter', 'uScale', 'uTime', 'uSweep', 'uReveal', 'uFade', 'uPx', 'uDirs', 'uBlips']
      .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    hero.classList.add('has-gl');

    var ROADS = new Float32Array(24);
    [120, 95, 75, 40, 10, -15, -35, -70, -95, -120, -170, 150].forEach(function (d, i) { ROADS[i * 2] = Math.cos(d * DEG); ROADS[i * 2 + 1] = Math.sin(d * DEG); });
    var RINGS = [{ r: .155, name: 'Садовое кольцо' }, { r: .33, name: 'ТТК' }, { r: 1.0, name: 'МКАД' }];
    var LEADS = [
      { a: 35, r: .52, kind: 1, title: 'Новый лид · Премиум-запрос', text: 'Вячеслав, 90–100 млн ₽. Динамо, Тверской — в пределах Садового кольца.' },
      { a: 5, r: .42, kind: 0 },
      { a: -28, r: .55, kind: 1, title: 'Новый лид · Инвест-решение', text: 'Максим, до 40 млн ₽ за лот. Евро-двушки в ЗАО, СЗАО, САО. 100% наличные.' },
      { a: -55, r: .62, kind: 0 },
      { a: 205, r: .6, kind: 1, title: 'Новый лид · Сохранение капитала', text: 'Виктор, до 70 млн ₽. Пул из 2–3 квартир на старте продаж, наличные.' },
      { a: 150, r: .58, kind: 1, title: 'Новый лид · Клубный формат', text: 'Ольга, 125–130 млн ₽. 1-спальная, 70 м², Центральный район. Готова к сделке сразу.' }
    ];
    var ringEls = RINGS.map(function (R) {
      var el = document.createElement('span'); el.className = 'ring-label'; el.textContent = R.name; el.style.opacity = '0';
      overlay.appendChild(el); return el;
    });

    var W = 1, H = 1, dpr = 1, cx = 0, cy = 0, scale = 1, phoneBox = null, copyBox = null, mobile = false;
    function rel(el) {
      var x = 0, y = 0, n = el;
      while (n && n !== hero) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      var w = el.offsetWidth, h = el.offsetHeight;
      return { l: x, t: y, r: x + w, b: y + h, w: w, h: h };
    }
    function wob(a) { return 0.55 * Math.sin(2 * a + 0.7) + 0.30 * Math.sin(3 * a + 2.1) + 0.15 * Math.sin(5 * a + 4.0); }
    function inBox(x, y, b, pad) { return b && x > b.l - pad && x < b.r + pad && y > b.t - pad && y < b.b + pad; }
    function placeLabels() {
      var cands = [-14, 14, -34, 34, -52, 196, 164, 214];
      RINGS.forEach(function (R, i) {
        var el = ringEls[i], placed = false;
        var tw = el.offsetWidth || 90;
        for (var c = 0; c < cands.length && !placed; c++) {
          var la = cands[c] * DEG;
          var rr = (R.r / (1 + 0.055 * wob(la))) * scale;
          var x = cx + Math.cos(la) * rr + 8, y = cy - Math.sin(la) * rr - 14;
          var ok = x > 12 && x + tw < W - 12 && y > 90 && y < H - 30 &&
                   !inBox(x, y, phoneBox, 14) && !inBox(x + tw, y, phoneBox, 14) &&
                   !inBox(x, y, copyBox, 18) && !inBox(x + tw, y, copyBox, 18);
          if (ok) { el.style.setProperty('--x', x + 'px'); el.style.setProperty('--y', y + 'px'); placed = true; }
        }
        el.dataset.placed = placed ? '1' : '0';
      });
    }
    function layout() {
      var r = hero.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      mobile = W < 900;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2fv(U.uDirs, ROADS);
      phoneBox = phoneEl ? rel(phoneEl) : null;
      copyBox = copyEl ? rel(copyEl) : null;
      if (phoneBox && phoneBox.w > 0) {
        cx = phoneBox.l + phoneBox.w / 2; cy = phoneBox.t + phoneBox.h / 2;
        scale = phoneBox.h * (mobile ? 0.82 : 0.95);
      } else { cx = W * 0.7; cy = H * 0.5; scale = H * 0.6; }
      placeLabels();
    }

    var state = { reveal: REDUCE ? 1 : 0 };
    var visible = true, raf = 0, t0 = performance.now(), last = t0, sweep = 2.2;
    var blipArr = new Float32Array(24), pingAt = LEADS.map(function () { return -1e9; });
    var SPEED = 0.62;

    function fly(i) {
      if (!phone) return;
      var L = LEADS[i];
      var a = L.a * DEG;
      var x0 = cx + Math.cos(a) * L.r * scale, y0 = cy - Math.sin(a) * L.r * scale;
      var hr = hero.getBoundingClientRect();
      var tg = phone.target();
      var x1 = tg.x - hr.left, y1 = tg.y - hr.top;
      var hidden = inBox(x0, y0, phoneBox, 0) || x0 < 0 || x0 > W || y0 < 0 || y0 > H;
      if (REDUCE || hidden || !document.body.animate) { phone.push(L); return; }
      var dot = document.createElement('i');
      dot.className = 'fly';
      hero.appendChild(dot);
      var mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 60;
      var anim = dot.animate([
        { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.6)', opacity: 0 },
        { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(1.2)', opacity: 1, offset: .15 },
        { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1)', opacity: 1, offset: .6 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.5)', opacity: 0 }
      ], { duration: 900, easing: 'cubic-bezier(.5, 0, .3, 1)' });
      anim.onfinish = function () { dot.remove(); phone.push(L); };
    }

    var AUTOMATED = !!navigator.webdriver, lastDraw = 0;
    function draw(now) {
      var dt = Math.min(AUTOMATED ? 0.6 : 0.05, (now - last) / 1000); last = now;
      var time = (now - t0) / 1000;
      var rect = hero.getBoundingClientRect();
      var prog = clamp(-rect.top / Math.max(1, rect.height), 0, 1);
      var s = scale * (1 + prog * 0.4);
      var prev = sweep;
      if (!REDUCE) sweep -= SPEED * dt;
      for (var i = 0; i < LEADS.length; i++) {
        var L = LEADS[i], a = L.a * DEG;
        if (!REDUCE && state.reveal > 0.6) {
          var d0 = mod(a - prev, TAU), d1 = mod(a - sweep, TAU);
          if (d1 < d0) { pingAt[i] = time; if (L.kind && prog < 0.6) fly(i); }
        }
        var age = time - pingAt[i];
        var inten = REDUCE ? (L.kind ? 0.7 : 0.3) : (age >= 0 ? Math.exp(-age / (L.kind ? 2.4 : 1.2)) : 0);
        blipArr[i * 4] = L.r * Math.cos(a);
        blipArr[i * 4 + 1] = L.r * Math.sin(a);
        blipArr[i * 4 + 2] = inten * state.reveal;
        blipArr[i * 4 + 3] = L.kind;
      }
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform2f(U.uCenter, cx * dpr, (H - (cy - prog * H * 0.1)) * dpr);
      gl.uniform1f(U.uScale, s * dpr);
      gl.uniform1f(U.uPx, 1 / (s * dpr));
      gl.uniform1f(U.uTime, time);
      gl.uniform1f(U.uSweep, sweep);
      gl.uniform1f(U.uReveal, state.reveal);
      gl.uniform1f(U.uFade, prog * 0.9);
      gl.uniform4fv(U.uBlips, blipArr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      var lo = clamp(state.reveal * 1.5 - 0.5, 0, 1) * (1 - prog * 2);
      for (var q = 0; q < ringEls.length; q++) ringEls[q].style.opacity = ringEls[q].dataset.placed === '1' ? String(clamp(lo, 0, 1)) : '0';
    }
    function frame(now) {
      raf = 0;
      if (!AUTOMATED || now - lastDraw > 450) { draw(now); lastDraw = now; }
      if (visible && !REDUCE) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    layout();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(hero);
    }
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(); kick(); if (REDUCE) draw(performance.now()); }, 120); });
    if (REDUCE) draw(performance.now()); else kick();
    return { state: state, kick: kick, layout: layout };
  });

  /* =========================================================
     HERO INTRO
     ========================================================= */
  safe('hero', function () {
    if (!HAS_GSAP || REDUCE) { if (radar) radar.state.reveal = 1; return; }
    var tl = G.timeline({ defaults: { ease: 'power3.out' }, delay: 0.05, onComplete: function () { if (radar) radar.layout(); } });
    if (radar) tl.to(radar.state, { reveal: 1, duration: 2.2, ease: 'power2.out' }, 0);
    tl.from('.hero__title .line > span', { yPercent: 115, duration: 1.1, stagger: 0.08, ease: 'expo.out' }, 0.05)
      .from('.nav__in', { y: -16, autoAlpha: 0, duration: 0.9 }, 0.1)
      .from('.hero__who', { y: 12, autoAlpha: 0, duration: 0.8 }, 0.15)
      .from('.hero__lead, .hero__cta, .hero__facts', { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.3)
      .from('.phone', { y: 50, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.2);
    G.to('.hero__copy', {
      yPercent: -8, autoAlpha: 0.3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* =========================================================
     TEXT REVEALS
     ========================================================= */
  safe('splits', function () {
    $$('[data-split]').forEach(function (el) {
      var words = splitInto(el, 'mask');
      if (!HAS_GSAP || REDUCE) return;
      G.from(words, {
        yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.03,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  });

  safe('words', function () {
    $$('[data-words]').forEach(function (el) {
      var words = splitInto(el, 'plain');
      if (!HAS_GSAP || REDUCE) return;
      G.fromTo(words, { opacity: 0.2 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: 0.4 }
      });
    });
  });

  /* ---------- Accent words: one gradient across each accent phrase ---------- */
  var tint = safe('accents', function () {
    var ems = $$('.h2 em, .contact__title em');
    function run() {
      // layout metrics (offset*), not getBoundingClientRect: the colour zones are scaled while they
      // grow in, and a scaled measurement would leave the end of the phrase without gradient
      ems.forEach(function (em) {
        var ws = $$('.wi', em);
        if (!ws.length) return;
        var L = Infinity, R = -Infinity;
        var xs = ws.map(function (w) { var x = w.offsetLeft; L = Math.min(L, x); R = Math.max(R, x + w.offsetWidth); return x; });
        var W = Math.max(1, R - L);
        ws.forEach(function (w, i) {
          w.style.setProperty('--gw', W + 'px');
          w.style.setProperty('--gx', (L - xs[i]) + 'px');
        });
      });
    }
    run();
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(run, 150); });
    return run;
  });

  safe('reveal', function () {
    if (!HAS_GSAP || REDUCE) return;
    var items = $$('[data-reveal]');
    G.set(items, { y: 28, autoAlpha: 0 });
    ST.batch(items, {
      start: 'top 92%', once: true,
      onEnter: function (batch) { G.to(batch, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true }); }
    });
  });

  /* =========================================================
     DOSSIER — qualification runs with the scroll (pinned on desktop)
     ========================================================= */
  safe('dossier', function () {
    var sec = $('.dossier'); if (!sec) return;
    var items = $$('.checklist li', sec);
    var rows = $$('[data-decrypt]', sec);
    var chip = $('[data-state]', sec);
    var bar = $('.lead-card__bar i', sec);
    var GLYPHS = 'абвгдежзиклмнопрстуфхцчшэюя0123456789';
    var data = rows.map(function (dd) {
      var full = dd.textContent.trim();
      dd.textContent = '';
      var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = full;
      var real = document.createElement('span'); real.className = 'dec-real'; real.setAttribute('aria-hidden', 'true'); real.textContent = full;
      var vis = document.createElement('span'); vis.className = 'dec-vis'; vis.setAttribute('aria-hidden', 'true'); vis.textContent = full;
      dd.appendChild(sr); dd.appendChild(real); dd.appendChild(vis);
      return { full: full, vis: vis, row: dd.parentElement, t: -1 };
    });
    function decrypt(d, t) {
      if (t === d.t && (t <= 0 || t >= 1)) return;
      d.t = t;
      var n = d.full.length, k = Math.floor(n * t), out = d.full.slice(0, k);
      for (var i = k; i < n; i++) {
        var ch = d.full[i];
        out += (ch === ' ' || ch === NBSP) ? ch : (t <= 0 ? '·' : GLYPHS[(Math.random() * GLYPHS.length) | 0]);
      }
      d.vis.textContent = out;
      d.row.classList.toggle('is-done', t >= 1);
    }
    var STOPS = [0.16, 0.36, 0.56, 0.74];
    var lastDone = -1;
    function update(p) {
      var q = clamp((p - 0.04) / 0.72, 0, 1);
      var done = Math.min(items.length, Math.floor(q * items.length + 0.0001));
      if (done !== lastDone) {
        items.forEach(function (li, i) {
          li.classList.toggle('is-done', i < done);
          li.classList.toggle('is-active', i === done && done < items.length);
        });
        lastDone = done;
      }
      data.forEach(function (d, i) {
        var start = i === 0 ? 0.03 : STOPS[i - 1];
        decrypt(d, clamp((p - start) / (STOPS[i] - start), 0, 1));
      });
      var ok = done >= items.length;
      chip.textContent = ok ? 'Квалифицирован' : 'Квалификация ' + done + '/10';
      chip.classList.toggle('is-ok', ok);
      sec.classList.toggle('is-sent', p > 0.86);
      if (bar) bar.style.transform = 'scaleX(' + clamp((p - 0.78) / 0.14, 0, 1) + ')';
    }
    if (REDUCE || !HAS_GSAP) { sec.classList.add('is-sent'); return; } // static, fully qualified card
    sec.classList.add('is-ready');
    update(0);
    var pin = $('.dossier__pin', sec);
    var grid = $('.dossier__grid', sec);
    // the pinned block must fit one screen: on short laptop screens scale it down a bit
    function fit() {
      var cs = getComputedStyle(pin);
      var avail = window.innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      var s = Math.min(1, avail / Math.max(1, grid.offsetHeight));
      sec.classList.toggle('is-fit', s < 1);
      sec.style.setProperty('--fit', s < 1 ? s.toFixed(4) : '1');
    }
    var mm = G.matchMedia();
    // desktop: the block is pinned, qualification runs with the scroll
    mm.add('(min-width: 1101px) and (min-height: 600px)', function () {
      fit();
      ST.addEventListener('refreshInit', fit);
      ST.create({
        trigger: pin, start: 'top top', end: '+=220%', pin: pin, scrub: true,
        anticipatePin: 1, refreshPriority: 1,
        onUpdate: function (s) { update(s.progress); }
      });
      return function () {
        ST.removeEventListener('refreshInit', fit);
        sec.classList.remove('is-fit');
        update(0);
      };
    });
    // tablets and phones: the block is taller than the screen, so it just plays once
    mm.add('(max-width: 1100px), (max-height: 599px)', function () {
      var obj = { p: 0 };
      var tw = G.to(obj, { p: 1, duration: 4.6, ease: 'none', paused: true, onUpdate: function () { update(obj.p); } });
      ST.create({ trigger: '.lead-card', start: 'top 72%', once: true, onEnter: function () { tw.play(); } });
      return function () { tw.kill(); };
    });
  });

  /* =========================================================
     CASES — soft stacking on desktop
     ========================================================= */
  safe('cases', function () {
    if (!HAS_GSAP || REDUCE) return;
    var cards = $$('.case');
    G.matchMedia().add('(min-width: 901px)', function () {
      cards.forEach(function (card, i) {
        var next = cards[i + 1];
        if (!next) return;
        G.to(card, {
          scale: 0.96, '--dim': 0.45, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true }
        });
      });
    });
  });

  /* =========================================================
     SOURCES — noise → signal flow
     ========================================================= */
  safe('flow', function () {
    var cv = $('.flow__canvas'); if (!cv) return;
    var ctx = cv.getContext('2d'); if (!ctx) return;
    var W = 1, H = 1, dpr = 1, parts = [], visible = false, raf = 0, last = performance.now(), t = 0;
    // Трафик → AI-проверка → колл-центр → ручная проверка → лид
    var GATES = [0.24, 0.45, 0.66, 0.86], PASS = [0.5, 0.55, 0.8, 1], LAST = GATES.length;
    var PULL = [0, 0.35, 1, 2, 4], FOCUS = [0, 0, 0.45, 0.75, 0.95];
    function spawn(p, anywhere) {
      p.x = anywhere ? Math.random() * W : -Math.random() * 60 - 6;
      p.y = H * (0.2 + Math.random() * 0.68);
      p.vx = 42 + Math.random() * 40;
      p.vy = 0; p.stage = 0; p.dead = false; p.a = 1;
      p.seed = Math.random() * 100;
      if (anywhere) {
        for (var g = 0; g < GATES.length; g++) {
          if (p.x > GATES[g] * W) {
            if (Math.random() < PASS[g]) p.stage = g + 1;
            else { p.x = Math.random() * GATES[g] * W; break; }
          }
        }
        if (p.stage >= 2) p.y = lerp(p.y, H * 0.56, FOCUS[p.stage]);
      }
    }
    function resize() {
      var r = cv.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(clamp(W / 4.4, 70, 280));
      parts = [];
      for (var i = 0; i < n; i++) { var p = {}; spawn(p, true); parts.push(p); }
    }
    function step(dt) {
      t += dt;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      GATES.forEach(function (g, i) {
        var x = Math.round(g * W) + 0.5;
        ctx.strokeStyle = i === LAST - 1 ? 'rgba(99,102,241,.55)' : 'rgba(15,23,42,.16)';
        ctx.setLineDash(i === LAST - 1 ? [] : [2, 5]);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      });
      ctx.setLineDash([]);
      var nx = W * 0.955, ny = H * 0.56, pulse = 0.5 + 0.5 * Math.sin(t * 3);
      var grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 46);
      grd.addColorStop(0, 'rgba(59,130,246,' + (0.32 + pulse * 0.18) + ')'); grd.addColorStop(1, 'rgba(99,102,241,0)');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(nx, ny, 46, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2563EB'; ctx.beginPath(); ctx.arc(nx, ny, 4.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(37,99,235,.45)'; ctx.beginPath(); ctx.arc(nx, ny, 12 + pulse * 6, 0, TAU); ctx.stroke();
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (!p.dead) {
          var targetVy = Math.sin(t * 1.4 + p.seed) * (p.stage >= 2 ? 4 : 14);
          targetVy += (ny - p.y) * PULL[p.stage];
          p.vy += (targetVy - p.vy) * Math.min(1, dt * 3);
          p.x += p.vx * dt * (p.stage === LAST ? 1.6 : 1);
          p.y += p.vy * dt;
          if (p.stage < LAST && p.x >= GATES[p.stage] * W) {
            if (Math.random() < PASS[p.stage]) p.stage++;
            else { p.dead = true; p.vy = 10 + Math.random() * 30; p.vx *= 0.35; }
          }
          if (p.stage === LAST && p.x >= nx - 3) { spawn(p, false); continue; }
        } else {
          p.vy += 140 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.a -= dt * 1.5;
        }
        if (p.x > W + 12 || p.y > H + 12 || p.a <= 0) { spawn(p, false); continue; }
        var len, col, lw = 1;
        if (p.dead) { col = 'rgba(148,163,184,' + (0.6 * p.a).toFixed(3) + ')'; len = 4; }
        else if (p.stage === LAST) { col = 'rgba(37,99,235,1)'; len = 26; lw = 2; }
        else if (p.stage === 3) { col = 'rgba(15,23,42,.88)'; len = 21; lw = 1.6; }
        else if (p.stage === 2) { col = 'rgba(15,23,42,.8)'; len = 17; lw = 1.4; }
        else if (p.stage === 1) { col = 'rgba(71,85,105,.72)'; len = 12; lw = 1.2; }
        else { col = 'rgba(100,116,139,.55)'; len = 8; lw = 1.1; }
        ctx.strokeStyle = col; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(p.x - len, p.y - p.vy * 0.03); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
    }
    function loop(now) {
      raf = 0;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      step(dt);
      if (visible) raf = requestAnimationFrame(loop);
    }
    resize();
    if (REDUCE) { for (var k = 0; k < 90; k++) step(1 / 30); }
    if ('IntersectionObserver' in window && !REDUCE) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
      }).observe(cv);
    } else if (!REDUCE) { visible = true; raf = requestAnimationFrame(loop); }
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { resize(); if (REDUCE) for (var k2 = 0; k2 < 90; k2++) step(1 / 30); }, 150); });
  });

  /* =========================================================
     COLOR ZONES — light and brand cards grow in
     ========================================================= */
  safe('zones', function () {
    if (!HAS_GSAP || REDUCE) return;
    $$('.light, .brand').forEach(function (el) {
      G.fromTo(el, { scale: 0.94, y: 50 }, {
        scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: true }
      });
    });
  });

  /* =========================================================
     PRICING
     ========================================================= */
  var PRICE = { comfort: [3600, 0.5], business: [7700, 0.25], premium: [11600, 0.25], deluxe: [17000, 0.25], office: [7700, 0.25], retail: [7700, 0.25] };
  function priceOf(key, repl) { var p = PRICE[key]; return repl ? p[0] : Math.round(p[0] * (1 - p[1])); }

  safe('pricing', function () {
    var sec = $('.pricing'); if (!sec) return;
    var sw = $('.switch', sec), btns = $$('.switch button', sec), note = $('[data-note]', sec);
    var MAX = 17000, TOP = 0.84, repl = true, shown = !(HAS_GSAP && !REDUCE);
    $$('[data-odo]', sec).forEach(function (el) { odoSet(el); });
    function bars() {
      $$('.stairs__col', sec).forEach(function (col) {
        var k = col.getAttribute('data-class');
        col.style.setProperty('--h0', (PRICE[k][0] / MAX * TOP * 100).toFixed(2) + '%');
        col.style.setProperty('--h', shown ? (priceOf(k, repl) / MAX * TOP * 100).toFixed(2) + '%' : '0%');
        odoSet($('[data-odo]', col), fmtRub(priceOf(k, repl)));
      });
      $$('.tier', sec).forEach(function (tr) {
        odoSet($('b[data-odo]', tr), fmtRub(priceOf(tr.getAttribute('data-class'), repl)));
      });
    }
    function set(v) {
      repl = v;
      sec.classList.toggle('is-off', !v);
      sw.classList.toggle('is-off', !v);
      btns.forEach(function (b) {
        var on = (b.getAttribute('data-repl') === '1') === v;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      note.textContent = v
        ? 'Нецелевые лиды бесплатно заменяем в течение 5' + NBSP + 'дней по' + NBSP + '4' + NBSP + 'гарантиям.'
        : 'Комфорт дешевле на' + NBSP + '50%, остальные классы' + NBSP + '— на' + NBSP + '25%: нецелевые лиды не' + NBSP + 'заменяем.';
      bars();
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-repl') === '1'); }); });
    sw.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) < 0) return;
      e.preventDefault(); set(!repl); (repl ? btns[0] : btns[1]).focus();
    });
    set(true);
    if (!shown) {
      ST.create({ trigger: '.stairs', start: 'top 84%', once: true, onEnter: function () { shown = true; bars(); } });
    }
  });

  /* =========================================================
     CALCULATOR
     ========================================================= */
  safe('calc', function () {
    var form = $('#calc-form'); if (!form) return;
    var box = $('[data-group="class"]', form);
    var qtyIn = $('#qty', form);
    var replIn = $('#calc-repl', form);
    var nudge = $('[data-nudge]', form);
    var presets = $$('.presets button', form);
    var orders = $$('[data-order]');
    var CLASSES = {
      'new': [['comfort', 'Комфорт', 'до 500 000 ₽/м²'], ['business', 'Бизнес', 'до 800 000 ₽/м²'], ['premium', 'Премиум', 'до 1 200 000 ₽/м²'], ['deluxe', 'De Luxe', 'от 1 200 000 ₽/м²']],
      'commercial': [['office', 'Офисы', 'Классы А, Б'], ['retail', 'Ритейл', 'Торговые помещения']]
    };
    var TIERS = [[30, 0.1], [50, 0.15], [75, 0.175], [100, 0.2]];
    // 0.175 → «17,5%»
    function pct(d) { return String(Math.round(d * 1000) / 10).replace('.', ',') + '%'; }
    var MIN = 10, MAX = 1000;
    var packBox = $('[data-pack]', form), packList = $('[data-pack-list]', form), packAdd = $('[data-pack-add]', form);
    // Составной пакет: несколько позиций (сегмент + количество). Шаги 1–3 правят активную позицию,
    // замена нецелевых — общая. Скидка за объём считается по каждому сегменту отдельно.
    var st = { repl: true, items: [{ type: 'new', cls: 'business', qty: 10 }], active: 0, touched: false, fresh: -1 };
    var calc = { summary: '', total: '', orderText: '' };
    window.__dmCalc = function () { return { touched: st.touched, summary: calc.summary, total: calc.total, orderText: calc.orderText }; };

    function cur() { return st.items[st.active]; }
    function disc(q) { var d = 0; TIERS.forEach(function (t) { if (q >= t[0]) d = t[1]; }); return d; }
    function leads(n) { return n + NBSP + plural(n, 'лид', 'лида', 'лидов'); }
    function clsName(it) { return CLASSES[it.type].filter(function (c) { return c[0] === it.cls; })[0][1]; }
    function typeName(t) { return t === 'new' ? 'Новостройки' : 'Коммерция'; }
    function takenBy(cls) { for (var i = 0; i < st.items.length; i++) if (i !== st.active && st.items[i].cls === cls) return i; return -1; }
    function freeCls(type) { var f = CLASSES[type].filter(function (c) { return !st.items.some(function (it) { return it.cls === c[0]; }); })[0]; return f ? f[0] : null; }
    function lineOf(it) {
      var base = priceOf(it.cls, st.repl), d = disc(it.qty), lead = Math.round(base * (1 - d));
      return { base: base, d: d, lead: lead, total: lead * it.qty, save: (base - lead) * it.qty };
    }
    function renderChips() {
      var it = cur();
      box.textContent = '';
      var list = CLASSES[it.type];
      if (!list.some(function (c) { return c[0] === it.cls; }) || takenBy(it.cls) >= 0) it.cls = freeCls(it.type) || list[0][0];
      list.forEach(function (c) {
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'radio'; input.name = 'cls'; input.id = 'cls-' + c[0]; input.value = c[0];
        input.checked = c[0] === it.cls;
        var taken = takenBy(c[0]) >= 0;
        input.disabled = taken;
        var span = document.createElement('span');
        var b = document.createElement('b'); b.textContent = c[1];
        var strong = document.createElement('strong'); strong.setAttribute('data-chip-price', c[0]);
        var small = document.createElement('small'); small.textContent = c[2].replace(/ (?=\d{3})/g, NBSP);
        span.appendChild(b); span.appendChild(strong); span.appendChild(small);
        if (taken) { var tag = document.createElement('i'); tag.textContent = 'уже в пакете'; span.appendChild(tag); }
        label.appendChild(input); label.appendChild(span);
        box.appendChild(label);
      });
      $$('input[name="type"]', form).forEach(function (r) {
        r.checked = r.value === it.type;
        // тип без свободных сегментов выбрать нельзя
        r.disabled = r.value !== it.type && !freeCls(r.value);
      });
      qtyIn.value = String(it.qty);
    }
    function renderPack() {
      var multi = st.items.length > 1;
      packBox.hidden = !multi;
      packList.textContent = '';
      st.items.forEach(function (it, i) {
        var d = disc(it.qty);
        var wrap = document.createElement('span');
        wrap.className = 'pack__item' + (i === st.active ? ' is-on' : '') + (i === st.fresh ? ' is-new' : '');
        var pick = document.createElement('button');
        pick.type = 'button'; pick.className = 'pack__pick'; pick.setAttribute('role', 'tab');
        pick.setAttribute('aria-selected', String(i === st.active)); pick.setAttribute('data-pack-pick', i);
        pick.textContent = clsName(it) + ' · ' + it.qty;
        if (d > 0) { var sm = document.createElement('small'); sm.textContent = '−' + pct(d); pick.appendChild(sm); }
        var del = document.createElement('button');
        del.type = 'button'; del.className = 'pack__del'; del.setAttribute('data-pack-del', i);
        del.setAttribute('aria-label', 'Убрать ' + clsName(it) + ' из пакета'); del.textContent = '×';
        wrap.appendChild(pick); wrap.appendChild(del);
        packList.appendChild(wrap);
      });
      packAdd.hidden = !freeCls('new') && !freeCls('commercial');
      $('b', packAdd).textContent = multi ? 'Добавить ещё сегмент' : 'Собрать составной пакет';
    }
    function update() {
      var it = cur(), multi = st.items.length > 1;
      var ln = lineOf(it);
      var lines = st.items.map(lineOf);
      var total = 0, save = 0, qty = 0;
      lines.forEach(function (l, i) { total += l.total; save += l.save; qty += st.items[i].qty; });

      $$('[data-chip-price]', box).forEach(function (el) { el.textContent = fmtRub(priceOf(el.getAttribute('data-chip-price'), st.repl)); });
      $$('[data-r-single]').forEach(function (el) { el.hidden = multi; });
      var linesEl = $('[data-r-lines]');
      linesEl.hidden = !multi;
      linesEl.textContent = '';
      if (multi) {
        st.items.forEach(function (x, i) {
          var l = lines[i];
          var li = document.createElement('li');
          if (i === st.fresh) li.className = 'is-new';
          var left = document.createElement('span');
          var b = document.createElement('b'); b.textContent = typeName(x.type) + ' · ' + clsName(x);
          var sm = document.createElement('small');
          sm.textContent = leads(x.qty) + ' × ' + fmtRub(l.lead);
          if (l.d > 0) { var em = document.createElement('em'); em.textContent = ' · −' + pct(l.d); sm.appendChild(em); }
          left.appendChild(b); left.appendChild(sm);
          var right = document.createElement('strong'); right.textContent = fmtRub(l.total);
          li.appendChild(left); li.appendChild(right);
          linesEl.appendChild(li);
        });
      } else {
        odoSet($('[data-r-lead]'), fmtRub(ln.lead));
        var baseEl = $('[data-r-base]');
        if (ln.d > 0) { baseEl.hidden = false; baseEl.textContent = fmtRub(ln.base); } else { baseEl.hidden = true; }
        $('[data-r-disc]').textContent = ln.d > 0 ? '−' + pct(ln.d) : '—';
      }
      $('[data-r-save]').textContent = save > 0 ? fmtRub(save) : '—';
      odoSet($('[data-r-total]'), fmtRub(total));
      $('[data-r-tariff]').textContent = st.repl ? 'С заменами' : 'Без замен';
      var summary = multi
        ? 'Составной пакет · ' + leads(qty)
        : typeName(it.type) + ' · ' + clsName(it) + ' · ' + leads(it.qty);
      $('[data-r-summary]').textContent = summary;
      $$('[data-bar-total]').forEach(function (el) { el.textContent = fmtRub(total); });
      $$('[data-bar-lead]').forEach(function (el) {
        el.textContent = multi ? leads(qty) + ' · ' + st.items.length + ' ' + plural(st.items.length, 'сегмент', 'сегмента', 'сегментов')
          : fmtRub(ln.lead) + ' за лид' + (ln.d > 0 ? ' · −' + pct(ln.d) : '');
      });
      presets.forEach(function (b) { b.classList.toggle('is-on', Number(b.getAttribute('data-qty')) === it.qty); });
      // next volume discount — для активной позиции
      var next = TIERS.filter(function (t) { return it.qty < t[0]; })[0];
      var scope = multi ? 'на ' + clsName(it) : 'на весь пакет';
      if (next) {
        var need = next[0] - it.qty;
        nudge.innerHTML = '';
        nudge.appendChild(document.createTextNode('Ещё ' + leads(need) + ' — и скидка ' + pct(next[1]) + ' ' + scope + '.'));
        var add = document.createElement('button'); add.type = 'button'; add.setAttribute('data-qty-to', next[0]);
        add.textContent = 'Добавить ' + need; nudge.appendChild(add);
      } else {
        nudge.textContent = 'Максимальная скидка за объём — 20% ' + scope + '.';
      }
      $('[data-repl-title]').textContent = st.repl ? 'С заменами' : 'Без замен';
      $('[data-repl-note]').textContent = st.repl
        ? 'Бесплатно заменяем нецелевые лиды в течение 5 дней.'
        : 'Цена за лид ниже на 25–50%, но нецелевые лиды не заменяются.';
      renderPack();
      st.fresh = -1; // анимация появления — только у только что добавленной позиции

      var tariff = st.repl ? 'с заменами' : 'без замен';
      calc.summary = summary + ' · ' + tariff;
      calc.total = fmtRub(total);
      calc.orderText = multi
        ? 'Здравствуйте! Хочу обсудить составной пакет лидов (' + tariff + '):\n' +
          st.items.map(function (x, i) {
            var l = lines[i];
            return '— ' + typeName(x.type) + ', ' + clsName(x) + ': ' + x.qty + ' шт. × ' + fmtRub(l.lead) + (l.d > 0 ? ' (−' + pct(l.d) + ')' : '') + ' = ' + fmtRub(l.total);
          }).join('\n') + '\nИтого — ' + fmtRub(total) + '.'
        : 'Здравствуйте! Хочу обсудить пакет лидов: ' + typeName(it.type) + ', ' + clsName(it) + ', ' + it.qty + ' шт., ' +
          tariff + '. Цена за лид — ' + fmtRub(ln.lead) + ', итого — ' + fmtRub(total) + '.';
    }
    function setQty(q, keepInput) {
      q = Math.round(Number(q));
      if (!isFinite(q)) q = MIN;
      cur().qty = clamp(q, MIN, MAX);
      if (!keepInput) qtyIn.value = String(cur().qty);
      st.touched = true;
      update();
    }
    function select(i) { st.active = i; renderChips(); update(); }
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'type') { cur().type = t.value; renderChips(); }
      else if (t.name === 'cls') { cur().cls = t.value; }
      else if (t.name === 'repl') { st.repl = t.checked; }
      else if (t === qtyIn) { setQty(qtyIn.value); return; }
      st.touched = true;
      update();
    });
    qtyIn.addEventListener('input', function () {
      var v = Number(qtyIn.value);
      if (qtyIn.value !== '' && v >= MIN && v <= MAX) setQty(v, true);
    });
    qtyIn.addEventListener('blur', function () { setQty(qtyIn.value); });
    qtyIn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); setQty(qtyIn.value); qtyIn.blur(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setQty(cur().qty + (e.key === 'ArrowUp' ? 1 : -1)); }
    });
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step], [data-qty], [data-qty-to], [data-pack-add], [data-pack-pick], [data-pack-del]');
      if (!b) return;
      if (b.hasAttribute('data-step')) setQty(cur().qty + Number(b.getAttribute('data-step')));
      else if (b.hasAttribute('data-qty')) setQty(b.getAttribute('data-qty'));
      else if (b.hasAttribute('data-qty-to')) setQty(b.getAttribute('data-qty-to'));
      else if (b.hasAttribute('data-pack-add')) {
        // новая позиция: следующий свободный сегмент того же типа (после бизнеса — премиум)
        var type = cur().type, cls = freeCls(type);
        if (!cls) { type = type === 'new' ? 'commercial' : 'new'; cls = freeCls(type); }
        if (!cls) return;
        var list = CLASSES[type].map(function (c) { return c[0]; });
        var after = list.slice(list.indexOf(cur().cls) + 1).filter(function (c) { return !st.items.some(function (it) { return it.cls === c; }); })[0];
        st.items.push({ type: type, cls: after || cls, qty: MIN });
        st.fresh = st.items.length - 1;
        st.touched = true;
        select(st.items.length - 1);
      }
      else if (b.hasAttribute('data-pack-pick')) select(Number(b.getAttribute('data-pack-pick')));
      else {
        var i = Number(b.getAttribute('data-pack-del'));
        st.items.splice(i, 1);
        select(Math.min(st.active > i ? st.active - 1 : st.active, st.items.length - 1));
      }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    orders.forEach(function (o) {
      o.addEventListener('click', function () {
        copyText(calc.orderText).then(function (ok) {
          toast(ok ? 'Расчёт скопирован — вставьте его в чат' : 'Откройте чат @DMitryLeads и опишите пакет');
        });
      });
    });
    // phones/tablets: hide the floating CTA while the calculator (with its own total bar) is on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { document.documentElement.classList.toggle('in-calc', en[0].isIntersecting); }, { rootMargin: '0px 0px -30% 0px' }).observe(form);
    }
    renderChips();
    update();
  });

  /* =========================================================
     DIRECTIONS — tabs + counter
     ========================================================= */
  safe('tabs', function () {
    var tabs = $$('.tabs [role="tab"]'); if (!tabs.length) return;
    var rt = 0;
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus();
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (HAS_GSAP && !REDUCE && panel) {
        G.fromTo($$('a', panel), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.035 });
      }
      if (HAS_GSAP) { clearTimeout(rt); rt = setTimeout(function () { ST.refresh(); }, 60); }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var k = null;
        if (e.key === 'ArrowRight') k = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') k = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') k = tabs[0];
        else if (e.key === 'End') k = tabs[tabs.length - 1];
        if (k) { e.preventDefault(); select(k, true); }
      });
    });
  });

  safe('counter', function () {
    var el = $('[data-count]'); if (!el) return;
    var target = el.textContent.trim();
    odoSet(el, target);
    if (!HAS_GSAP || REDUCE) return;
    odoSet(el, '000', true);
    ST.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () { odoSet(el, target); } });
  });

  /* =========================================================
     CONTACT + FOOTER
     ========================================================= */
  safe('copy', function () {
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        copyText(b.getAttribute('data-copy')).then(function (ok) { toast(ok ? 'Ник скопирован: @DMitryLeads' : 'Telegram: @DMitryLeads'); });
      });
    });
  });

  var fitMark = safe('footer', function () {
    var mark = $('.footer__mark'), span = mark && mark.querySelector('span');
    if (!span) return null;
    function fit() {
      var cs = getComputedStyle(mark);
      var avail = mark.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      mark.style.fontSize = '200px';
      var w = span.getBoundingClientRect().width || 1;
      mark.style.fontSize = Math.min(560, Math.floor(200 * avail / w)) + 'px';
    }
    fit();
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fit, 120); });
    if (HAS_GSAP && !REDUCE) {
      var chars = [];
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var frag = document.createDocumentFragment();
            Array.from(c.textContent).forEach(function (ch) {
              var s = document.createElement('span'); s.textContent = ch; s.style.display = 'inline-block'; frag.appendChild(s); chars.push(s);
            });
            c.parentNode.replaceChild(frag, c);
          } else if (c.nodeType === 1) walk(c);
        });
      })(span);
      span.style.overflow = 'hidden';
      span.style.verticalAlign = 'top';
      G.from(chars, {
        yPercent: 100, duration: 1.1, ease: 'expo.out', stagger: 0.04,
        scrollTrigger: { trigger: mark, start: 'top 96%', once: true }
      });
    }
    return fit;
  });

  /* ---------- Telegram widget (bottom right) ---------- */
  safe('tgw', function () {
    var w = $('[data-tgw]'); if (!w) return;
    var KEY = 'dm-tgw';
    function get() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } }
    function put(v) { try { sessionStorage.setItem(KEY, v); } catch (e) { /* private mode */ } }
    w.hidden = false;
    var shown = false;
    var small = window.matchMedia ? matchMedia('(max-width: 640px)') : { matches: false };
    function sync() { root.classList.toggle('tgw-open', w.classList.contains('is-in') && !w.classList.contains('is-min')); }
    function collapse() { w.classList.add('is-min'); put('min'); sync(); }
    function show() {
      if (shown) return;
      shown = true;
      if (get() === 'min') w.classList.add('is-min');
      requestAnimationFrame(function () { w.classList.add('is-in'); sync(); });
      // phones: the card takes the place of the bottom button for a few seconds, then gives it back
      if (small.matches && get() !== 'min') setTimeout(function () { if (!w.classList.contains('is-min')) collapse(); }, 10000);
    }
    var timer = setTimeout(show, 7000);
    function onScroll() { if (window.scrollY > window.innerHeight * 0.7) { clearTimeout(timer); show(); window.removeEventListener('scroll', onScroll); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    $('[data-tgw-close]', w).addEventListener('click', collapse);
    // step aside where it would cover the demo, or where the page already shows the same contact
    if ('IntersectionObserver' in window) {
      var away = {};
      [['.dossier', '-35% 0px -35% 0px'], ['.contact', '0px 0px -40% 0px'], ['.footer', '0px']].forEach(function (z) {
        var el = $(z[0]); if (!el) return;
        new IntersectionObserver(function (en) {
          away[z[0]] = en[0].isIntersecting;
          root.classList.toggle('tgw-away', Object.keys(away).some(function (k) { return away[k]; }));
        }, { rootMargin: z[1] }).observe(el);
      });
    }
    $('[data-tgw-open]', w).addEventListener('click', function () { w.classList.remove('is-min'); put('open'); sync(); });
  });

  /* ---------- Exit intent: offer a calculation before the visitor leaves ---------- */
  safe('exit', function () {
    var dlg = $('[data-exit]');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var KEY = 'dm-exit', t0 = Date.now(), wrote = false;
    function seen() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
    function mark() { try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* private mode */ } }
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a[href*="t.me/"]')) wrote = true; }, true);
    function open() {
      if (dlg.open || wrote || seen() || Date.now() - t0 < 8000) return;
      var menu = $('#menu'); if (menu && !menu.hidden) return;
      var c = window.__dmCalc ? window.__dmCalc() : null;
      var box = $('[data-exit-calc]', dlg);
      if (c && c.touched) {
        box.hidden = false;
        $('[data-exit-summary]', dlg).textContent = c.summary;
        $('[data-exit-total]', dlg).textContent = c.total;
      } else box.hidden = true;
      mark();
      root.classList.add('exit-open');
      if (window.__lenis) window.__lenis.stop();
      dlg.showModal();
    }
    function close() { if (dlg.open) dlg.close(); }
    dlg.addEventListener('close', function () { root.classList.remove('exit-open'); if (window.__lenis) window.__lenis.start(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    $$('[data-exit-close]', dlg).forEach(function (b) { b.addEventListener('click', close); });
    $('[data-exit-go]', dlg).addEventListener('click', function () {
      var c = window.__dmCalc ? window.__dmCalc() : null;
      var text = c && c.touched ? c.orderText : 'Здравствуйте! Хочу получить расчёт стоимости лидов.';
      copyText(text).then(function (ok) { if (ok) toast('Текст скопирован — вставьте его в чат'); });
      setTimeout(close, 200);
    });
    // desktop: the pointer leaves the page through the top edge (to the tabs / close button)
    document.addEventListener('mouseout', function (e) {
      if (e.relatedTarget || e.clientY > 12) return;
      open();
    });
    // touch: a fast flick back up after reading a good part of the page
    if (window.matchMedia && matchMedia('(hover: none)').matches) {
      var lastY = window.scrollY, lastT = performance.now(), maxY = 0;
      window.addEventListener('scroll', function () {
        var y = window.scrollY, t = performance.now();
        maxY = Math.max(maxY, y);
        var v = (lastY - y) / Math.max(1, t - lastT);
        if (v > 2.2 && maxY > document.documentElement.scrollHeight * 0.35 && Date.now() - t0 > 20000) open();
        lastY = y; lastT = t;
      }, { passive: true });
    }
  });

  /* ---------- Refresh after fonts ---------- */
  function refreshAll() {
    if (fitMark) fitMark();
    if (tint) tint();
    if (radar) radar.layout();
    if (HAS_GSAP) ST.refresh();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshAll);
  window.addEventListener('load', refreshAll);
})();
