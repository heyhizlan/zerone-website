// ZerOne — White Lab landing page interactions.
// Browser-native only: IntersectionObserver reveals, one rAF scroll loop, pointer tilt on fine pointers.

window.__zerone = true;

const root = document.documentElement;
const mq = (query) => window.matchMedia(query);
const reducedMotion = mq('(prefers-reduced-motion: reduce)');
const finePointer = mq('(hover: hover) and (pointer: fine)');
const stackedDeck = mq('(max-width: 900px)');
const mobileNav = mq('(max-width: 760px)');

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Opening sequence — wait for fonts so the headline does not reflow mid-animation. */
let loaded = false;
const markLoaded = () => {
  if (loaded) return;
  loaded = true;
  root.classList.add('is-loaded');
};
if (document.fonts?.ready) document.fonts.ready.then(() => requestAnimationFrame(markLoaded));
setTimeout(markLoaded, 900);

/* Scroll reveals */
const revealTargets = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-in'));
}

/* Scroll-linked motion: header state, parallax, card spread, mobile dealer dock */
const header = document.querySelector('[data-header]');
const parallaxLayers = [...document.querySelectorAll('[data-parallax]')];
const spread = document.querySelector('[data-spread]');
const hero = document.querySelector('.hero');
const dealer = document.querySelector('#dealer');
const dock = document.querySelector('[data-dock]');

let viewportH = window.innerHeight;
let queued = false;

function update() {
  queued = false;
  const motion = !reducedMotion.matches;

  header.classList.toggle('is-compact', window.scrollY > 24);

  // Smaller screens get a fraction of the desktop parallax distance.
  const depth = stackedDeck.matches ? 0.35 : 1;
  for (const layer of parallaxLayers) {
    if (!motion) {
      layer.style.removeProperty('--py');
      continue;
    }
    const box = layer.parentElement.getBoundingClientRect();
    if (box.bottom < -viewportH || box.top > viewportH * 2) continue;
    const offset = box.top + box.height / 2 - viewportH / 2;
    layer.style.setProperty('--py', `${(-offset * Number(layer.dataset.parallax) * depth).toFixed(1)}px`);
  }

  if (spread) {
    let progress = 1;
    if (motion && !stackedDeck.matches) {
      const box = spread.getBoundingClientRect();
      const travel = Math.max(1, box.height - viewportH);
      progress = easeInOut(clamp((-box.top / travel - 0.04) / 0.7));
    }
    spread.style.setProperty('--p', progress.toFixed(4));
  }

  if (dock) {
    const pastHero = hero.getBoundingClientRect().bottom < viewportH * 0.3;
    const atDealer = dealer.getBoundingClientRect().top < viewportH * 0.92;
    const on = pastHero && !atDealer && !root.classList.contains('menu-open');
    dock.classList.toggle('is-on', on);
    dock.inert = !on;
  }
}

const queueUpdate = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(update);
};

window.addEventListener('scroll', queueUpdate, { passive: true });
window.addEventListener('resize', () => {
  viewportH = window.innerHeight;
  queueUpdate();
});
[reducedMotion, stackedDeck].forEach((m) => m.addEventListener('change', queueUpdate));
update();

/* Pointer depth — fine pointers only; touch keeps the CSS :active press response instead. */
document.querySelectorAll('[data-tilt]').forEach((el) => {
  el.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty('--mx', x.toFixed(3));
    el.style.setProperty('--my', y.toFixed(3));
  });
  el.addEventListener('pointerleave', () => {
    ['--rx', '--ry', '--mx', '--my'].forEach((prop) => el.style.removeProperty(prop));
  });
});

// iOS only applies :active to touched elements when a touch listener exists.
document.addEventListener('touchstart', () => {}, { passive: true });

/* Mobile menu */
const menuToggle = document.querySelector('[data-menu-toggle]');
const menuLabel = document.querySelector('[data-menu-label]');
const menu = document.getElementById('menu');

function setMenu(open) {
  menu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuLabel.textContent = open ? 'Close' : 'Menu';
  root.classList.toggle('menu-open', open);
  if (open) menu.querySelector('a')?.focus();
  queueUpdate();
}

menuToggle.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || menu.hidden) return;
  setMenu(false);
  menuToggle.focus();
});
mobileNav.addEventListener('change', (m) => {
  if (!m.matches && !menu.hidden) setMenu(false);
});
