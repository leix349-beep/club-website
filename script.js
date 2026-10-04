const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(pointer: fine)');
document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const closeMenu = () => {
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
};
menuButton.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#site-nav a').forEach(link => link.addEventListener('click', closeMenu));
addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

if (!motionQuery.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.06, rootMargin: '0px 0px 35px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  requestAnimationFrame(() => requestAnimationFrame(() =>
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'))
  ));
}
motionQuery.addEventListener('change', () => {
  if (motionQuery.matches) document.documentElement.classList.remove('motion-ready');
});

const count = el => {
  const target = Number(el.dataset.count);
  if (motionQuery.matches) { el.textContent = target; return; }
  const began = performance.now();
  const tick = now => {
    const progress = Math.min((now - began) / 900, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { count(entry.target); observer.unobserve(entry.target); }
  }), { threshold: .3 });
  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
} else document.querySelectorAll('[data-count]').forEach(count);

let scrollFrame = 0;
const cancelScroll = () => cancelAnimationFrame(scrollFrame);
addEventListener('wheel', cancelScroll, { passive: true });
addEventListener('touchstart', cancelScroll, { passive: true });
addEventListener('keydown', cancelScroll);
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const destination = document.querySelector(link.getAttribute('href'));
  if (!destination) return;
  event.preventDefault();
  cancelScroll();
  const headerHeight = document.querySelector('.site-header').offsetHeight;
  const target = Math.min(Math.max(0, destination.getBoundingClientRect().top + scrollY - headerHeight - 24),
    document.documentElement.scrollHeight - innerHeight);
  const finish = () => {
    history.replaceState(null, '', link.getAttribute('href'));
    if (link.classList.contains('skip-link')) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    }
  };
  if (motionQuery.matches) { scrollTo(0, target); finish(); return; }
  const start = scrollY, began = performance.now(), duration = 650;
  const tick = now => {
    const progress = Math.min((now - began) / duration, 1);
    scrollTo(0, start + (target - start) * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) scrollFrame = requestAnimationFrame(tick);
    else finish();
  };
  scrollFrame = requestAnimationFrame(tick);
}));
