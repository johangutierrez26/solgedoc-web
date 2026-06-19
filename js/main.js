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

/* ── FORM SUBMIT — envío real vía FormSubmit a solgedoc@gmail.com ── */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/solgedoc@gmail.com';
const contactForm   = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn          = contactForm.querySelector('.btn-form');
    const originalText  = btn.textContent;
    const originalBg     = btn.style.background;

    // honeypot anti-spam: si el campo oculto viene lleno, es un bot — no enviar
    const honey = contactForm.querySelector('input[name="_honey"]');
    if (honey && honey.value) return;

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        btn.textContent = '✅ ¡Solicitud enviada! Te contactamos pronto';
        btn.style.background = 'linear-gradient(135deg, #1d7a2e, #0d5c1e)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = originalBg;
          btn.disabled = false;
        }, 5000);
      } else {
        throw new Error('Respuesta no OK del servidor');
      }
    } catch (err) {
      btn.textContent = '⚠️ No se pudo enviar — intenta de nuevo';
      btn.style.background = 'linear-gradient(135deg, #b02a2a, #7a1c1c)';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = originalBg;
      }, 4000);
      console.error('Error al enviar formulario:', err);
    }
  });
}