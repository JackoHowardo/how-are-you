/* How Are You? — interactions (no dependencies) */
(function () {
  var body = document.body;
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Studio / Services toggle */
  function setSide(side, push) {
    if (side !== 'studio' && side !== 'services') side = 'studio';
    body.setAttribute('data-side', side);
    if (side === 'services' && window.__hayReset) window.__hayReset();
    if (push && history.replaceState) history.replaceState(null, '', '#' + side);
    if (push) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (body.hasAttribute('data-side')) {
    var initial = (location.hash || '').replace('#', '');
    if (initial === 'studio' || initial === 'services') setSide(initial, false);
    document.querySelectorAll('[data-side-to]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); setSide(a.getAttribute('data-side-to'), true); });
    });
    window.addEventListener('hashchange', function () {
      var h = (location.hash || '').replace('#', '');
      if (h === 'studio' || h === 'services') setSide(h, false);
    });
  }

  /* reveal on scroll */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'none'; io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = 0; el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1)';
      io.observe(el);
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* film: click poster to load the player */
  document.querySelectorAll('.filmfull[data-video]').forEach(function (el) {
    el.addEventListener('click', function () {
      var u = el.getAttribute('data-video');
      el.innerHTML = '<iframe src="' + u + '" title="Film" allow="autoplay; fullscreen" allowfullscreen style="width:100%;height:100%;border:0;display:block"></iframe>';
    });
  });

  /* contact form -> opens email (no backend needed) */
  var cform = document.getElementById('contact-form');
  if (cform) cform.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (id) { var el = cform.querySelector('#' + id); return el ? el.value : ''; };
    var n = g('name'), em = g('email'), msg = g('message');
    var bd = encodeURIComponent(msg + '\n\n— ' + n + (em ? ' (' + em + ')' : ''));
    window.location.href = 'mailto:jack.howard1993@gmail.com?subject=' + encodeURIComponent('Hello from ' + (n || 'your website')) + '&body=' + bd;
  });

  /* cheeky toast + do-not-press */
  var toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast);
  var tmr;
  window.__hay_toast = function (msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(tmr); tmr = setTimeout(function () { toast.classList.remove('show'); }, 2600); };
  var pressed = 0;
  var dontLines = ['you were told not to press that.', 'still? alright then.', 'this does nothing. how are you, though?', 'okay, last one. (it is not.)'];
  document.querySelectorAll('[data-dont]').forEach(function (b) {
    b.addEventListener('click', function () { window.__hay_toast(dontLines[Math.min(pressed, dontLines.length - 1)]); pressed++; });
  });

  /* brand-mark colour cycle (shared) */
  function startCycle() {
    var b = document.querySelector('.brand .bmark'); if (!b) return null;
    var cs = getComputedStyle(document.body);
    var pal = [cs.getPropertyValue('--red').trim() || '#B83A2B', cs.getPropertyValue('--yellow').trim() || '#E4A200', cs.getPropertyValue('--blue').trim() || '#2E3E8C'];
    var anims = ['a-red', 'a-yellow', 'a-blue'], i = 0;
    function st() { if (window.__hayInPlay) return; b.style.background = pal[i % 3]; b.classList.remove('a-red', 'a-yellow', 'a-blue'); void b.offsetWidth; b.classList.add(anims[i % 3]); i++; }
    st(); return setInterval(st, 1900);
  }

  if (reduce || !fine) { startCycle(); return; }

  /* ===================================================================
     Playful layer — cursor, flecks, throwable dot
     =================================================================== */
  var cssv = getComputedStyle(document.body);
  var PAL = [
    (cssv.getPropertyValue('--red').trim() || '#B83A2B'),
    (cssv.getPropertyValue('--yellow').trim() || '#E4A200'),
    (cssv.getPropertyValue('--blue').trim() || '#2E3E8C')
  ];

  /* ---- directional arrow cursor (tip = hotspot, points at nearest content) ---- */
  var cursorCol = PAL[(Math.random() * 3) | 0];
  var cdot = document.createElement('div'); cdot.className = 'cursor-dot';
  cdot.innerHTML = '<span class="arrow"><svg viewBox="0 0 30 24" fill="none" stroke="' + cursorCol + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 Q15 11 26.5 12"/><path d="M20 6.5 Q24.5 9.5 27 12 Q24.5 14.5 20 17.6"/></svg></span>';
  document.body.appendChild(cdot);
  var arrowEl = cdot.querySelector('.arrow');
  var TARGET_SEL = 'h1, h2, .wcard, .photo, .filmfull, .shop, .offer .o, .intro p, .field, figure, .p-title, .filmnote a';
  var targets = [];
  function refreshTargets() { targets = [].slice.call(document.querySelectorAll(TARGET_SEL)); }
  refreshTargets();
  window.addEventListener('resize', refreshTargets);
  document.querySelectorAll('[data-side-to]').forEach(function (a) { a.addEventListener('click', function () { setTimeout(refreshTargets, 50); }); });

  function aimArrow(mx, my) {
    var best = null, bd = Infinity, H = window.innerHeight, W = window.innerWidth;
    for (var i = 0; i < targets.length; i++) {
      var r = targets[i].getBoundingClientRect();
      if (r.width === 0 || r.bottom < -40 || r.top > H + 40) continue;
      var cx = Math.max(r.left, Math.min(mx, r.right));
      var cy = Math.max(r.top, Math.min(my, r.bottom));   // nearest point on the element
      var dx = cx - mx, dy = cy - my, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }; }
    }
    if (best) {
      var ang = Math.atan2(best.y - my, best.x - mx) * 180 / Math.PI;
      arrowEl.style.setProperty('--rot', ang.toFixed(1) + 'deg');
    }
  }

  // hide arrow + restore real cursor over the grabbable brand dot
  var bm = document.querySelector('.brand .bmark');
  if (bm) {
    bm.addEventListener('mouseenter', function () { cdot.style.display = 'none'; });
    bm.addEventListener('mouseleave', function () { cdot.style.display = ''; });
  }

  /* ---- smiley faces popping from the studio portrait on hover ---- */
  function smileySVG(col) {
    return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="' + col + '"/><circle cx="8.5" cy="10" r="1.6" fill="#22211F"/><circle cx="15.5" cy="10" r="1.6" fill="#22211F"/><path d="M7.5 14 Q12 18 16.5 14" fill="none" stroke="#22211F" stroke-width="1.8" stroke-linecap="round"/></svg>';
  }
  (function () {
    var photo = document.querySelector('.side-studio .photo'); if (!photo) return;
    var timer = null;
    function spawn() {
      var r = photo.getBoundingClientRect();
      var side = (Math.random() * 4) | 0, x, y, dirx, diry;
      if (side === 0) { x = r.left; y = r.top + Math.random() * r.height; dirx = -1; diry = (Math.random() - 0.5); }
      else if (side === 1) { x = r.right; y = r.top + Math.random() * r.height; dirx = 1; diry = (Math.random() - 0.5); }
      else if (side === 2) { x = r.left + Math.random() * r.width; y = r.top; dirx = (Math.random() - 0.5); diry = -1; }
      else { x = r.left + Math.random() * r.width; y = r.bottom; dirx = (Math.random() - 0.5); diry = 1; }
      var s = document.createElement('div'); s.className = 'hay-smiley';
      s.innerHTML = smileySVG(PAL[(Math.random() * 3) | 0]);
      s.style.left = x + 'px'; s.style.top = y + 'px';
      document.body.appendChild(s);
      var dist = 40 + Math.random() * 50, rot = (Math.random() - 0.5) * 160;
      s.animate([
        { transform: 'translate(-50%,-50%) scale(.2) rotate(0deg)', opacity: 0 },
        { transform: 'translate(' + (-50 + dirx * 30) + '%,' + (-50 + diry * 30) + '%) scale(1) rotate(' + (rot / 2) + 'deg)', opacity: 1, offset: 0.3 },
        { transform: 'translate(calc(-50% + ' + (dirx * dist) + 'px),calc(-50% + ' + (diry * dist) + 'px)) scale(.7) rotate(' + rot + 'deg)', opacity: 0 }
      ], { duration: 1100, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = function () { s.remove(); };
    }
    photo.addEventListener('mouseenter', function () { if (timer) return; spawn(); timer = setInterval(spawn, 230); });
    photo.addEventListener('mouseleave', function () { clearInterval(timer); timer = null; });
  })();

  function mk(z) {
    var c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:' + z + ';';
    document.body.appendChild(c); return c;
  }
  var fleckC = mk(0), trailC = mk(9989), dotC = mk(9990);
  var fxc = fleckC.getContext('2d'), txc = trailC.getContext('2d'), dxc = dotC.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W, H, docH;
  function size() {
    W = window.innerWidth; H = window.innerHeight; docH = Math.max(document.documentElement.scrollHeight, H);
    [fleckC, trailC, dotC].forEach(function (c) { c.width = W * dpr; c.height = H * dpr; });
    [fxc, txc, dxc].forEach(function (g) { g.setTransform(dpr, 0, 0, dpr, 0, 0); });
  }
  size();

  /* flecks — page-positioned, drift when the cursor moves through them */
  var flecks = [];
  var FK = 0.012, FD = 0.9, FINF = 30, FIMP = 1.9, FCLAMP = 46;
  function buildFlecks() {
    flecks = [];
    var n = Math.min(2200, Math.round(W * docH / 8200));
    for (var i = 0; i < n; i++) flecks.push({ x: Math.random() * W, y: Math.random() * docH, c: PAL[(Math.random() * 3) | 0], ox: 0, oy: 0, vx: 0, vy: 0 });
  }
  buildFlecks();

  /* throwable dots — PAGE coordinates */
  var dots = [], trails = [];
  var R = 7, G = 0.5, EW = 0.6, EF = 0.45, MAXD = 34, MAXT = 2600;
  var pointer = { x: -999, y: -999 };
  var raf = null, lastInput = 0, dragging = false, held = null;
  var brandLink = document.querySelector('a.brand');
  var bmDown = false, moved = false;
  window.__hayInPlay = false;
  var cycle = startCycle();

  function curColour() { var c = getComputedStyle(bm).backgroundColor; return (c && c !== 'rgba(0, 0, 0, 0)') ? c : PAL[0]; }
  function addDot(x, y, c, isHeld, fromHeader) {
    var d = { x: x, y: y, vx: 0, vy: 0, c: c, held: !!isHeld, header: !!fromHeader, low: 0, notified: false };
    dots.push(d);
    if (dots.length > MAXD) { for (var i = 0; i < dots.length; i++) if (!dots[i].held) { dots.splice(i, 1); break; } }
    return d;
  }
  function hitDot(px, py) { for (var i = dots.length - 1; i >= 0; i--) { var d = dots[i]; var dx = d.x - px, dy = d.y - py; if (dx * dx + dy * dy <= (R + 3) * (R + 3)) return d; } return null; }

  if (bm) {
    bm.addEventListener('mousedown', function (e) {
      e.preventDefault(); e.stopPropagation();
      var r = bm.getBoundingClientRect();
      held = addDot(r.left + r.width / 2, r.top + r.height / 2 + window.scrollY, curColour(), true, true);
      dragging = true; moved = false; window.__hayInPlay = true; bmDown = true;
      bm.style.visibility = 'hidden';
      pointer.x = e.clientX; pointer.y = e.clientY; lastInput = performance.now(); start();
    });
    brandLink.addEventListener('click', function (e) { if (bmDown) { e.preventDefault(); bmDown = false; } });
  }
  dotC.addEventListener('mousedown', function (e) {
    var d = hitDot(e.clientX, e.clientY + window.scrollY);
    if (d) { e.preventDefault(); held = d; d.held = true; dragging = true; moved = true; lastInput = performance.now(); start(); }
  });

  window.addEventListener('mousemove', function (e) {
    pointer.x = e.clientX; pointer.y = e.clientY; lastInput = performance.now();
    cdot.style.left = e.clientX + 'px'; cdot.style.top = e.clientY + 'px';
    aimArrow(e.clientX, e.clientY);
    var scy = window.scrollY;
    for (var i = 0; i < flecks.length; i++) {
      var f = flecks[i], sy = f.y - scy + f.oy, sx = f.x + f.ox;
      var dx = sx - e.clientX, dy = sy - e.clientY, d2 = dx * dx + dy * dy;
      if (d2 < FINF * FINF && d2 > 0.01) { var dist = Math.sqrt(d2), s = (1 - dist / FINF) * FIMP; f.vx += (dx / dist) * s; f.vy += (dy / dist) * s; }
    }
    if (!dragging) { var hv = hitDot(e.clientX, e.clientY + window.scrollY); dotC.style.pointerEvents = hv ? 'auto' : 'none'; }
    start();
  });
  window.addEventListener('mouseup', function () { if (dragging && held) { held.held = false; held = null; dragging = false; dotC.style.pointerEvents = 'none'; } });
  window.addEventListener('scroll', function () { lastInput = performance.now(); start(); }, { passive: true });
  window.addEventListener('resize', function () { size(); buildFlecks(); start(); });

  window.__hayReset = function () {
    dots = []; trails = []; held = null; dragging = false; window.__hayInPlay = false;
    txc.clearRect(0, 0, W, H); dxc.clearRect(0, 0, W, H);
    if (bm) bm.style.visibility = 'visible';
  };
  function respawn() { if (!bm) return; window.__hayInPlay = false; bm.style.visibility = 'visible'; bm.classList.remove('a-pop'); void bm.offsetWidth; bm.classList.add('a-pop'); }

  function step() {
    docH = Math.max(document.documentElement.scrollHeight, H);
    var floor = docH - R, scy = window.scrollY, moving = false;
    for (var i = 0; i < flecks.length; i++) {
      var f = flecks[i];
      f.vx = (f.vx - f.ox * FK) * FD; f.vy = (f.vy - f.oy * FK) * FD;
      f.ox += f.vx; f.oy += f.vy;
      if (f.ox > FCLAMP) f.ox = FCLAMP; else if (f.ox < -FCLAMP) f.ox = -FCLAMP;
      if (f.oy > FCLAMP) f.oy = FCLAMP; else if (f.oy < -FCLAMP) f.oy = -FCLAMP;
      if (Math.abs(f.vx) > 0.02 || Math.abs(f.vy) > 0.02 || Math.abs(f.ox) > 0.4 || Math.abs(f.oy) > 0.4) moving = true;
    }
    for (var k = 0; k < dots.length; k++) {
      var d = dots[k];
      if (d.held) { var nx = pointer.x, ny = pointer.y + scy; d.vx = nx - d.x; d.vy = ny - d.y; d.x = nx; d.y = ny; continue; }
      var ox = d.x, oy = d.y;
      d.vy += G; d.x += d.vx; d.y += d.vy;
      if (d.x < R) { d.x = R; d.vx = -d.vx * EW; } else if (d.x > W - R) { d.x = W - R; d.vx = -d.vx * EW; }
      if (d.y < R) { d.y = R; d.vy = -d.vy * EW; } else if (d.y > floor) { d.y = floor; d.vy = -d.vy * EF; d.vx *= 0.9; }
      var spd = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      if (spd > 1.2) { trails.push({ x1: ox, y1: oy, x2: d.x, y2: d.y, c: d.c, a: 0.5 }); if (trails.length > MAXT) trails.shift(); }
      if (spd > 0.4) { moving = true; d.low = 0; } else { d.low++; if (d.low > 18 && d.header && !d.notified && window.__hayInPlay) { d.notified = true; respawn(); } }
    }
    for (var a = 0; a < dots.length; a++) for (var b = a + 1; b < dots.length; b++) {
      var p = dots[a], q = dots[b], dxx = q.x - p.x, dyy = q.y - p.y, dd = Math.sqrt(dxx * dxx + dyy * dyy), mn = R * 2;
      if (dd > 0 && dd < mn) {
        var nx2 = dxx / dd, ny2 = dyy / dd, ov = mn - dd;
        if (!p.held) { p.x -= nx2 * ov / 2; p.y -= ny2 * ov / 2; }
        if (!q.held) { q.x += nx2 * ov / 2; q.y += ny2 * ov / 2; }
        var rvx = q.vx - p.vx, rvy = q.vy - p.vy, vn = rvx * nx2 + rvy * ny2;
        if (vn < 0) { var imp = -vn * 0.5; if (!p.held) { p.vx -= imp * nx2; p.vy -= imp * ny2; } if (!q.held) { q.vx += imp * nx2; q.vy += imp * ny2; } moving = true; }
      }
    }
    for (var t = trails.length - 1; t >= 0; t--) { trails[t].a *= 0.997; if (trails[t].a < 0.03) trails.splice(t, 1); }
    return moving;
  }
  function draw() {
    var scy = window.scrollY;
    fxc.clearRect(0, 0, W, H); fxc.globalAlpha = 0.5;
    for (var i = 0; i < flecks.length; i++) {
      var f = flecks[i], y = f.y - scy + f.oy; if (y < -8 || y > H + 8) continue;
      fxc.fillStyle = f.c; fxc.beginPath(); fxc.arc(f.x + f.ox, y, 1.8, 0, 6.2832); fxc.fill();
    }
    fxc.globalAlpha = 1;
    txc.clearRect(0, 0, W, H); txc.lineWidth = 2.4; txc.lineCap = 'round';
    for (var t = 0; t < trails.length; t++) {
      var s = trails[t], y1 = s.y1 - scy, y2 = s.y2 - scy;
      if ((y1 < -10 && y2 < -10) || (y1 > H + 10 && y2 > H + 10)) continue;
      txc.globalAlpha = s.a; txc.strokeStyle = s.c; txc.beginPath(); txc.moveTo(s.x1, y1); txc.lineTo(s.x2, y2); txc.stroke();
    }
    txc.globalAlpha = 1;
    dxc.clearRect(0, 0, W, H);
    for (var k = 0; k < dots.length; k++) {
      var d = dots[k], dy = d.y - scy; if (dy < -20 || dy > H + 20) continue;
      dxc.fillStyle = d.c; dxc.beginPath(); dxc.arc(d.x, dy, R, 0, 6.2832); dxc.fill();
      dxc.lineWidth = 1.5; dxc.strokeStyle = 'rgba(34,33,31,.85)'; dxc.stroke();
    }
  }
  function frame() {
    var moving = step(); draw();
    var active = moving || dragging || (performance.now() - lastInput < 200);
    if (active) raf = requestAnimationFrame(frame); else raf = null;
  }
  function start() { if (!raf) raf = requestAnimationFrame(frame); }
  start();
})();
