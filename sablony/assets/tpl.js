/* Ukázkové weby · menu, animace, karusel s fyzikou, filtr, ukázkový formulář */
(function () {
  var root = document.documentElement, body = document.body;
  if (window.self !== window.top) root.classList.add('in-frame');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu: one toggle, works for every template */
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu'); }
    if (menu) menu.setAttribute('aria-hidden', !open);
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Header state after scrolling */
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none';
  body.prepend(sentinel);
  new IntersectionObserver(function (en) { body.classList.toggle('scrolled', !en[0].isIntersecting); }).observe(sentinel);

  /* Reveal */
  var rv = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('.rv').forEach(function (el) { rv.observe(el); });

  /* Spring: response (s) + damping ratio, Apple style. Interruptible, carries velocity. */
  function Spring(onUpdate) {
    this.x = 0; this.v = 0; this.target = 0; this.raf = 0; this.onUpdate = onUpdate;
  }
  Spring.prototype.to = function (target, opts) {
    opts = opts || {};
    var self = this, response = opts.response || 0.4, damping = opts.damping == null ? 1 : opts.damping;
    if (opts.velocity != null) this.v = opts.velocity;
    this.target = target;
    cancelAnimationFrame(this.raf);
    if (reduce) { this.x = target; this.v = 0; this.onUpdate(this.x); return; }
    var k = Math.pow(2 * Math.PI / response, 2), c = 4 * Math.PI * damping / response, last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000); last = now;
      var steps = 4, h = dt / steps;
      for (var i = 0; i < steps; i++) {
        var a = -k * (self.x - self.target) - c * self.v;
        self.v += a * h; self.x += self.v * h;
      }
      self.onUpdate(self.x);
      if (Math.abs(self.v) < 2 && Math.abs(self.x - self.target) < 0.5) { self.x = self.target; self.v = 0; self.onUpdate(self.x); return; }
      self.raf = requestAnimationFrame(step);
    }
    this.raf = requestAnimationFrame(step);
  };
  Spring.prototype.stop = function () { cancelAnimationFrame(this.raf); };

  function project(v, d) { d = d || 0.998; return (v / 1000) * d / (1 - d); }
  function rubber(over, dim) { var c = 0.55; return (over * dim * c) / (dim + c * Math.abs(over)); }

  /* Draggable carousel with momentum projection and rubber banding */
  document.querySelectorAll('[data-car]').forEach(function (car) {
    var track = car.querySelector('.car-track'), items = [].slice.call(track.children);
    var prev = document.querySelector('[data-car-prev="' + car.id + '"]'), next = document.querySelector('[data-car-next="' + car.id + '"]');
    var spring = new Spring(function (x) { track.style.transform = 'translate3d(' + x + 'px,0,0)'; });
    var min = 0, snaps = [0], idx = 0;
    function measure() {
      var maxScroll = Math.max(0, track.scrollWidth - car.clientWidth);
      min = -maxScroll;
      snaps = items.map(function (it) { return Math.max(min, -it.offsetLeft); });
      snaps = snaps.filter(function (s, i) { return i === 0 || s !== snaps[i - 1]; });
      update();
    }
    function nearest(x) { var b = 0; snaps.forEach(function (s, i) { if (Math.abs(s - x) < Math.abs(snaps[b] - x)) b = i; }); return b; }
    function update() {
      if (prev) prev.disabled = idx <= 0;
      if (next) next.disabled = idx >= snaps.length - 1;
    }
    function go(i, vel) { idx = Math.max(0, Math.min(snaps.length - 1, i)); spring.to(snaps[idx], { velocity: vel || 0, damping: vel ? 0.86 : 1, response: 0.45 }); update(); }
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });

    var dragging = false, startX = 0, startPos = 0, hist = [], moved = false;
    car.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      spring.stop();
      dragging = true; moved = false; startX = e.clientX; startPos = spring.x; hist = [{ x: e.clientX, t: e.timeStamp }];
    });
    car.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 8) return;
      if (!moved) { moved = true; car.setPointerCapture(e.pointerId); car.classList.add('dragging'); }
      var x = startPos + dx;
      if (x > 0) x = rubber(x, car.clientWidth);
      else if (x < min) x = min + rubber(x - min, car.clientWidth);
      spring.x = x; spring.v = 0; spring.onUpdate(x);
      hist.push({ x: e.clientX, t: e.timeStamp }); if (hist.length > 6) hist.shift();
    });
    function end(e) {
      if (!dragging) return;
      dragging = false; car.classList.remove('dragging');
      if (!moved) return;
      var a = hist[0], b = hist[hist.length - 1], dt = (b.t - a.t) || 16;
      var v = (b.x - a.x) / dt * 1000;
      if (e && e.timeStamp - b.t > 80) v = 0;
      go(nearest(spring.x + project(v)), v);
    }
    car.addEventListener('pointerup', end);
    car.addEventListener('pointercancel', end);
    car.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    car.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });
    window.addEventListener('resize', function () { measure(); spring.x = snaps[Math.min(idx, snaps.length - 1)]; spring.onUpdate(spring.x); });
    window.addEventListener('load', measure);
    measure();
  });

  /* Filters / segmented controls */
  document.querySelectorAll('[data-filter]').forEach(function (group) {
    var btns = group.querySelectorAll('button'), scope = document.getElementById(group.getAttribute('data-filter'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        group.style.setProperty('--i', [].indexOf.call(btns, b));
        scope.querySelectorAll('[data-cat]').forEach(function (c) { c.hidden = f !== 'vse' && c.getAttribute('data-cat') !== f; });
      });
    });
  });

  /* Running ticker: duplicate content once for a seamless loop */
  document.querySelectorAll('[data-marquee]').forEach(function (m) { m.innerHTML += m.innerHTML; });

  /* Demo form */
  var form = document.getElementById('demoForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (i) {
        var v = i.value.trim();
        var bad = !v || (i.type === 'tel' && !/^\+?[\d\s]{9,16}$/.test(v)) || (i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
        var f = i.closest('.field') || i.parentElement; f.classList.toggle('invalid', bad);
        if (bad && ok) { i.focus(); ok = false; }
      });
      if (!ok) return;
      document.getElementById('formMsg').classList.add('show');
      form.reset();
    });
  }
})();
