/* =============================================
   index.js — Happy Paws / Furry Care
   ============================================= */

/* ---- 1. VIDEO PLAY / PAUSE ---- */
window.playVideo = function () {
  const video = document.getElementById('myVideo');
  const btn   = document.querySelector('.play-video');
  if (!video) return;

  if (video.paused || video.ended) {
    video.play().then(() => {
      if (btn) btn.textContent = 'Pause Video';
    }).catch(err => {
      console.warn('Video play failed:', err);
    });
  } else {
    video.pause();
    if (btn) btn.textContent = 'Play Video';
  }
};


/* ---- 2. ANIMATED COUNTERS ---- */
function animateCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.textContent.replace(/\d/g, '').trim();
    let current  = 0;
    const step   = Math.ceil(target / 80);
    const isPercent = suffix.includes('%');

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      counter.textContent = current.toLocaleString() + suffix;
    }, 20);
  });
}

/* Trigger counters when the statistics section scrolls into view */
const statsSection = document.querySelector('.statistics');
if (statsSection) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(statsSection);
}


/* ---- 3. ACTIVE NAV LINK ON SCROLL ---- */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['hero', 'Services', 'doctor', 'footer', 'shop']
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveNav() {
  const scrollY = window.scrollY + 120;

  sections.forEach((section, i) => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(a => a.removeAttribute('id'));
      if (navLinks[i]) navLinks[i].id = 'active';
    }
  });
}

window.addEventListener('scroll', setActiveNav);


/* ---- 4. STICKY HEADER SHADOW ON SCROLL ---- */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)';
  } else {
    header.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
  }
});


/* ---- 5. SMOOTH SCROLL FOR ALL ANCHOR LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---- 6. EMAIL SIGN-UP BUTTON ---- */
const signUpBtn = document.querySelector('.health-section .sign-up');
const emailInput = document.querySelector('.health-section input[type="email"]');

if (signUpBtn && emailInput) {
  signUpBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailInput.style.borderColor = '#e24b4a';
      emailInput.placeholder = 'Please enter a valid email';
      setTimeout(() => {
        emailInput.style.borderColor = '';
        emailInput.placeholder = 'Enter your email';
      }, 2500);
      return;
    }
    signUpBtn.textContent  = '✓ Subscribed!';
    signUpBtn.style.background = '#1a5a3f';
    emailInput.value = '';
    setTimeout(() => {
      signUpBtn.textContent = 'Sign Up';
      signUpBtn.style.background = '';
    }, 3000);
  });
}


/* ---- 7. REGISTER CTA BUTTON ---- */
const registerBtn = document.querySelector('.registerCta .btn1');
if (registerBtn) {
  registerBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });
}


/* ---- 8. SHOP NOW & BOOK APPOINTMENT BUTTONS ---- */
document.querySelectorAll('.callToAction .btn1').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (i === 0) {
      const shopSection = document.getElementById('shop');
      if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      const docSection = document.getElementById('doctor');
      if (docSection) docSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ---- 9. CARD HOVER RIPPLE (services & profile cards) ---- */
document.querySelectorAll('.card, .profile').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.25s ease, box-shadow 0.25s ease';
  });
});


/* ---- 10. MOBILE NAV TOGGLE (adds hamburger if viewport is small) ---- */
function addMobileNav() {
  if (window.innerWidth > 768) return;
  if (document.querySelector('.hamburger')) return;

  const nav = document.querySelector('nav');
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  hamburger.style.cssText = `
    background: none; border: none; font-size: 1.4rem;
    cursor: pointer; color: var(--green-dark); order: -1;
    display: block;
  `;

  nav.prepend(hamburger);

  const navLinks = nav.querySelector('.nav-links');
  navLinks.style.display = 'none';
  navLinks.style.flexDirection = 'column';
  navLinks.style.width = '100%';
  navLinks.style.gap = '0.25rem';

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.style.display = 'none';
    });
  });
}

window.addEventListener('load',   addMobileNav);
window.addEventListener('resize', addMobileNav);
