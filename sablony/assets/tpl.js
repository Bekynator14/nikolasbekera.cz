/* Ukázkové weby · menu, animace, filtr portfolia, ukázkový formulář */
(function () {
  if (window.self !== window.top) document.documentElement.classList.add('in-frame');
  var body = document.body, burger = document.getElementById('burger'), overlay = document.getElementById('overlay'), nav = document.getElementById('nav');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    overlay.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }
  var s = document.createElement('div');
  s.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:120px;pointer-events:none';
  body.prepend(s);
  new IntersectionObserver(function (en) { nav.classList.toggle('is-scrolled', !en[0].isIntersecting); }).observe(s);

  var rv = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('.rv').forEach(function (el) { rv.observe(el); });

  var tl = document.getElementById('tagline');
  if (tl) {
    var html = '';
    tl.childNodes.forEach(function (n) {
      var accent = n.nodeType === 1 && n.hasAttribute('data-accent');
      n.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { html += ' '; return; }
        html += '<span class="w' + (accent ? ' accent' : '') + '">' + part + '</span>';
      });
    });
    tl.innerHTML = html;
    var wo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var below = e.boundingClientRect.top > (e.rootBounds ? e.rootBounds.bottom : innerHeight * 0.62);
        e.target.classList.toggle('on', e.isIntersecting || !below);
      });
    }, { rootMargin: '0px 0px -38% 0px', threshold: 1 });
    tl.querySelectorAll('.w').forEach(function (w) { wo.observe(w); });
  }

  var filters = document.querySelectorAll('.filters button');
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      document.querySelectorAll('.work-card').forEach(function (c) {
        c.hidden = f !== 'vse' && c.getAttribute('data-cat') !== f;
      });
    });
  });

  var form = document.getElementById('demoForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (i) {
        var bad = !i.value.trim() || (i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim())) || (i.type === 'tel' && !/^\+?[\d\s]{9,16}$/.test(i.value.trim()));
        i.closest('.field').classList.toggle('invalid', bad);
        if (bad && ok) { i.focus(); ok = false; }
      });
      if (!ok) return;
      document.getElementById('formMsg').classList.add('show');
      form.reset();
    });
  }
})();
