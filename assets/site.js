/* nikolasbekera.cz · sdílený skript: menu, animace, cookies */
(function () {
  var body = document.body, burger = document.getElementById('burger'), overlay = document.getElementById('overlay'), nav = document.getElementById('nav');

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    overlay.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && overlay) {
    burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:120px;pointer-events:none';
  body.prepend(sentinel);
  if (nav) new IntersectionObserver(function (en) { nav.classList.toggle('is-scrolled', !en[0].isIntersecting); }).observe(sentinel);

  var rv = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('.rv').forEach(function (el) { rv.observe(el); });

  document.querySelectorAll('.live').forEach(function (el) {
    var f = el.querySelector('iframe'), w = +el.getAttribute('data-w') || 1440;
    if (!f || !window.ResizeObserver) return;
    new ResizeObserver(function () { f.style.transform = 'scale(' + el.clientWidth / w + ')'; }).observe(el);
  });

  var GA_ID = 'G-LQ87FJETDW';
  function loadGA() {
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  }
  function getC() { try { return localStorage.getItem('cookie_consent'); } catch (x) { return null; } }
  function setC(v) { try { if (v === null) localStorage.removeItem('cookie_consent'); else localStorage.setItem('cookie_consent', v); } catch (x) {} }
  var banner = document.getElementById('cookieBanner'), consent = getC();
  if (consent === 'accepted') loadGA();
  else if (banner && consent !== 'declined') {
    banner.style.display = 'flex';
    document.getElementById('cookieAccept').addEventListener('click', function () { setC('accepted'); banner.style.display = 'none'; loadGA(); });
    document.getElementById('cookieDecline').addEventListener('click', function () { setC('declined'); banner.style.display = 'none'; });
  }
  var reset = document.getElementById('cookieReset');
  if (reset) reset.addEventListener('click', function () { setC(null); location.reload(); });
})();
