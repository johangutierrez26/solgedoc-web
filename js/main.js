/* ── CAROUSEL ── */
const track       = document.getElementById('carouselTrack');
const slides      = track ? track.querySelectorAll('.carousel-slide') : [];
const dotsWrap    = document.getElementById('carouselDots');
let current       = 0;
let autoTimer     = null;

function buildDots() {
  if (!dotsWrap) return;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
    d.onclick = () => { clearInterval(autoTimer); goTo(i); startAuto(); };
    dotsWrap.appendChild(d);
  });
}

function goTo(n) {
  current = (n + slides.length) % slides.length;
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  document.querySelectorAll('.carousel-dot').forEach((d, i) =>
    d.classList.toggle('active', i === current)
  );
}

function moveCarousel(dir) {
  clearInterval(autoTimer);
  goTo(current + dir);
  startAuto();
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), 4500);
}

if (slides.length) { buildDots(); startAuto(); }

/* ── REVEAL ON SCROLL ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => revealObs.observe(el));

/* ── STATS COUNTER ── */
function animateCounters() {
  document.querySelectorAll('.stat-card strong').forEach(el => {
    const raw    = el.textContent;
    const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '');
    if (!num) return;
    let val = 0;
    const step = num / 55;
    const t = setInterval(() => {
      val += step;
      if (val >= num) { val = num; clearInterval(t); }
      el.textContent = Math.floor(val) + suffix;
    }, 22);
  });
}
const statsTarget = document.getElementById('nosotros');
if (statsTarget) {
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); statsObs.disconnect(); }
  }, { threshold: 0.3 });
  statsObs.observe(statsTarget);
}

/* ── MOBILE MENU ── */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  if (!links) return;
  const open = links.dataset.open === '1';
  links.dataset.open = open ? '0' : '1';
  if (open) {
    links.removeAttribute('style');
  } else {
    Object.assign(links.style, {
      display: 'flex', flexDirection: 'column',
      position: 'absolute', top: '72px', left: '0', right: '0',
      background: 'rgba(7,22,64,0.98)', padding: '1.2rem 6%', gap: '1rem'
    });
  }
}

/* ── FORM SUBMIT (placeholder — EmailJS se integra aquí después) ── */
function handleSubmit() {
  const btn = document.querySelector('.btn-form');
  if (!btn) return;
  btn.textContent = '✅ ¡Solicitud enviada! Te contactamos pronto';
  btn.style.background = 'linear-gradient(135deg, #1d7a2e, #0d5c1e)';
  btn.disabled = true;
}