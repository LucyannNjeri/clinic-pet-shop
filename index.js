/* =============================================
   index.js — Happy Paws / Furry Care
   Performance-optimized version
   ============================================= */

/* ---- UTILITY: throttle scroll/resize handlers ---- */
function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) { last = now; fn(...args); }
  };
}

/* ---- UTILITY: run after DOM is ready ---- */
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}


/* ================================================================
   1. IMAGE LAZY LOADING + SKELETON SHIMMER REMOVAL
   All images with loading="lazy" get the .loaded class once
   they finish loading, which removes the shimmer animation.
================================================================ */
ready(() => {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load',  () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded')); /* stop shimmer on broken images too */
    }
  });
});


/* ================================================================
   2. VIDEO PLAY / PAUSE — lazy src swap for faster page load
   The video src is only connected when the user clicks Play,
   so the browser doesn't pre-buffer it on page load.
================================================================ */
ready(() => {
  const video   = document.getElementById('myVideo');
  const btn     = document.querySelector('.play-video');
  const wrapper = video ? video.closest('.video-container') : null;
  if (!video || !wrapper) return;

  /* Store real src, remove it so browser won't preload */
  const source = video.querySelector('source');
  const realSrc = source ? source.getAttribute('src') : null;
  if (source && realSrc) source.removeAttribute('src');

  /* Spinner overlay */
  const spinner = document.createElement('div');
  spinner.className = 'video-spinner';
  spinner.innerHTML = '<div class="spinner-ring"></div><p>Loading…</p>';
  wrapper.style.position = 'relative';
  wrapper.appendChild(spinner);

  const showSpinner = () => { spinner.style.display = 'flex'; };
  const hideSpinner = () => { spinner.style.display = 'none'; };
  hideSpinner();

  video.addEventListener('waiting', showSpinner);
  video.addEventListener('stalled', showSpinner);
  video.addEventListener('canplay', hideSpinner);
  video.addEventListener('playing', hideSpinner);
  video.addEventListener('ended', () => {
    hideSpinner();
    if (btn) btn.textContent = 'Play Video';
  });

  let srcLoaded = false;

  window.playVideo = function () {
    /* First click: inject the src so it starts loading */
    if (!srcLoaded && source && realSrc) {
      source.setAttribute('src', realSrc);
      video.load();
      srcLoaded = true;
    }

    if (video.paused || video.ended) {
      showSpinner();
      video.play()
        .then(() => { if (btn) btn.textContent = 'Pause Video'; })
        .catch(err => { hideSpinner(); console.warn('Playback error:', err); });
    } else {
      video.pause();
      hideSpinner();
      if (btn) btn.textContent = 'Play Video';
    }
  };
});


/* ================================================================
   3. ANIMATED COUNTERS — triggered by IntersectionObserver
================================================================ */
ready(() => {
  const statsSection = document.querySelector('.statistics');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.disconnect();

      document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.textContent.replace(/[\d,]/g, '').trim();
        let current  = 0;
        const step   = Math.ceil(target / 80);

        const tick = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(tick); }
          counter.textContent = current.toLocaleString() + suffix;
        }, 20);
      });
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
});


/* ================================================================
   4. ACTIVE NAV + STICKY HEADER — throttled scroll handler
================================================================ */
ready(() => {
  const navLinks = document.querySelectorAll('.nav-links a');
  const header   = document.querySelector('header');
  const sectionIds = ['hero', 'Services', 'doctor', 'footer', 'shop'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const onScroll = throttle(() => {
    /* Header shadow */
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,0.10)'
        : '0 1px 4px rgba(0,0,0,0.06)';
    }

    /* Active nav */
    const scrollY = window.scrollY + 120;
    sections.forEach((section, i) => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(a => a.removeAttribute('id'));
        if (navLinks[i]) navLinks[i].id = 'active';
      }
    });
  }, 80); /* fire at most every 80ms */

  window.addEventListener('scroll', onScroll, { passive: true });
});


/* ================================================================
   5. SMOOTH SCROLL FOR ANCHOR LINKS
================================================================ */
ready(() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});


/* ================================================================
   6. EMAIL SIGN-UP VALIDATION
================================================================ */
ready(() => {
  const signUpBtn  = document.querySelector('.health-section .sign-up');
  const emailInput = document.querySelector('.health-section input[type="email"]');
  if (!signUpBtn || !emailInput) return;

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
    signUpBtn.textContent = '✓ Subscribed!';
    signUpBtn.style.background = '#1a5a3f';
    emailInput.value = '';
    setTimeout(() => {
      signUpBtn.textContent = 'Sign Up';
      signUpBtn.style.background = '';
    }, 3000);
  });
});


/* ================================================================
   7. BUTTON WIRING
================================================================ */
ready(() => {
  /* Register CTA */
  const registerBtn = document.querySelector('.registerCta .btn1');
  if (registerBtn) registerBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });

  /* Shop Now / Book Appointment */
  document.querySelectorAll('.callToAction .btn1').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(i === 0 ? 'shop' : 'doctor');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});


/* ================================================================
   8. MOBILE NAV HAMBURGER
================================================================ */
function addMobileNav() {
  if (window.innerWidth > 768) return;
  if (document.querySelector('.hamburger')) return;

  const nav       = document.querySelector('nav');
  const navList   = nav.querySelector('.nav-links');
  const hamburger = document.createElement('button');

  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  hamburger.style.cssText = `
    background:none; border:none; font-size:1.4rem;
    cursor:pointer; color:var(--green-dark);
  `;

  nav.prepend(hamburger);
  navList.style.display      = 'none';
  navList.style.flexDirection = 'column';
  navList.style.width         = '100%';

  hamburger.addEventListener('click', () => {
    navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
  });

  navList.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { navList.style.display = 'none'; })
  );
}

ready(addMobileNav);
window.addEventListener('resize', throttle(addMobileNav, 200));
