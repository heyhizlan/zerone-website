/* ==========================================================================
   ZERONE — SITE RUNTIME
   Zero dependencies. Every effect degrades to a static, readable page.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     1. REVEAL — blur-to-sharp on enter, then release the compositor hint
     --------------------------------------------------------------------- */
  function initReveal() {
    var nodes = document.querySelectorAll('[data-anim]');
    if (!nodes.length) return;

    if (reduced || !('IntersectionObserver' in window)) return;  // stays visible

    // Only now commit to hiding anything — see the note in motion.css.
    document.documentElement.classList.add('anim-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.setAttribute('data-inview', 'true');
        io.unobserve(el);
        // Drop will-change + the blur filter once settled, so long pages
        // don't hold hundreds of composited layers alive.
        var ms = parseFloat(getComputedStyle(el).transitionDuration) * 1000 || 1100;
        var delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
        setTimeout(function () { el.setAttribute('data-settled', 'true'); }, ms + delay + 120);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------------------------------------------------------------------
     2. STAGGER — parent [data-stagger="70"] cascades --d onto children
     --------------------------------------------------------------------- */
  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(function (parent) {
      var step = parseInt(parent.getAttribute('data-stagger'), 10) || 70;
      var kids = parent.querySelectorAll(':scope > [data-anim]');
      kids.forEach(function (kid, i) { kid.style.setProperty('--d', (i * step) + 'ms'); });
    });
  }

  /* ---------------------------------------------------------------------
     3. NAV — hide on scroll down, reveal on scroll up, frost once moved
     --------------------------------------------------------------------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var toggle = nav.querySelector('.nav__toggle');
    var drawer = document.querySelector('.nav__drawer');
    var last = window.scrollY;
    var ticking = false;

    function onScroll() {
      var y = window.scrollY;
      nav.setAttribute('data-scrolled', y > 12 ? 'true' : 'false');
      var open = drawer && drawer.getAttribute('data-open') === 'true';
      if (!open && y > 260 && y > last + 4) nav.setAttribute('data-hidden', 'true');
      else if (y < last - 4 || y < 120) nav.setAttribute('data-hidden', 'false');
      last = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    if (toggle && drawer) {
      toggle.addEventListener('click', function () {
        var open = drawer.getAttribute('data-open') === 'true';
        drawer.setAttribute('data-open', open ? 'false' : 'true');
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        document.body.style.overflow = open ? '' : 'hidden';
      });
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          drawer.setAttribute('data-open', 'false');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') toggle.click();
      });
    }
  }

  /* ---------------------------------------------------------------------
     4. SCROLL-VELOCITY BLUR — the motion-blur signature.
        Blur scales with scroll speed, capped, and released the instant
        scrolling stops. Media only; text is never smeared.
     --------------------------------------------------------------------- */
  function initVelocityBlur() {
    var targets = document.querySelectorAll('.blur-on-scroll');
    if (!targets.length || reduced) return;

    var lastY = window.scrollY, lastT = performance.now(), raf = null, idle = null;

    function apply(px) {
      targets.forEach(function (t) { t.style.setProperty('--scroll-blur', px.toFixed(2) + 'px'); });
    }

    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var now = performance.now();
        var dy = Math.abs(window.scrollY - lastY);
        var dt = Math.max(now - lastT, 1);
        var v = dy / dt;                       // px per ms
        var px = Math.min(v * 2.4, 7);         // cap — legibility over spectacle
        apply(px);
        lastY = window.scrollY; lastT = now; raf = null;

        clearTimeout(idle);
        idle = setTimeout(function () { apply(0); }, 110);
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     5. PARALLAX — subtle depth on [data-parallax="0.12"]
     --------------------------------------------------------------------- */
  function initParallax() {
    var layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length || reduced) return;

    var raf = null;
    function frame() {
      var vh = window.innerHeight;
      layers.forEach(function (l) {
        var r = l.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var depth = parseFloat(l.getAttribute('data-parallax')) || 0.1;
        var mid = r.top + r.height / 2 - vh / 2;
        l.style.setProperty('--py', (-mid * depth).toFixed(1) + 'px');
      });
      raf = null;
    }
    window.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    frame();
  }

  /* ---------------------------------------------------------------------
     6. COUNTERS — [data-count-to="32"] rolls up when it enters view
     --------------------------------------------------------------------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.textContent = el.getAttribute('data-count-to'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var to = parseFloat(el.getAttribute('data-count-to')) || 0;
        var pad = (el.getAttribute('data-count-to') || '').trim();
        var width = pad.replace('.', '').length;
        var dur = 1100, t0 = performance.now();
        (function tick(now) {
          var p = Math.min((now - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 4);
          var val = Math.round(to * eased);
          el.textContent = pad.charAt(0) === '0'
            ? String(val).padStart(width, '0')
            : String(val);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { el.textContent = '0'; io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     7. CALLOUT FOCUS — hovering a spec row dims the others
     --------------------------------------------------------------------- */
  function initCallouts() {
    document.querySelectorAll('.callouts').forEach(function (list) {
      var rows = list.querySelectorAll('.callout');
      rows.forEach(function (row) {
        row.addEventListener('mouseenter', function () {
          list.setAttribute('data-focus', 'true');
          rows.forEach(function (r) { r.setAttribute('data-active', String(r === row)); });
          var id = row.getAttribute('data-target');
          if (id) {
            var fig = document.getElementById(id);
            if (fig) fig.setAttribute('data-active', 'true');
          }
        });
      });
      list.addEventListener('mouseleave', function () {
        list.removeAttribute('data-focus');
        rows.forEach(function (r) { r.removeAttribute('data-active'); });
        document.querySelectorAll('[data-hotspot]').forEach(function (h) {
          h.removeAttribute('data-active');
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     8. LIVE CLOCK — the telemetry timestamp in the corner rails
     --------------------------------------------------------------------- */
  function initClock() {
    var els = document.querySelectorAll('[data-clock]');
    if (!els.length) return;
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var d = new Date();
      var s = pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() +
              ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      els.forEach(function (e) { e.textContent = s; });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* --------------------------------------------------------------------- */
  function boot() {
    // Each subsystem is isolated: one throwing must never take down the rest,
    // and must never leave the page in a half-revealed state.
    [initStagger, initReveal, initNav, initVelocityBlur,
     initParallax, initCounters, initCallouts, initClock].forEach(function (fn) {
      try { fn(); }
      catch (err) {
        if (window.console) console.error('[zerone] ' + fn.name + ':', err);
        if (fn === initReveal) document.documentElement.classList.remove('anim-ready');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
