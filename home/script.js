// --- script.js (Updated & enhanced) ---

/* Utility: reduced motion */
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- In-App Detection (improved) ---------- */
function isRunningInApp() {
  try {
    if (window.Telegram && window.Telegram.WebApp) {
      // Telegram WebApp object present
      return true;
    }
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const tokens = ['FBAN','FBAV','Instagram','Line','WQBrowser','MicroMessenger','wv)','WebView','Twitter','WhatsApp','Pinterest'];
    for (let t of tokens) {
      if (ua.indexOf(t) !== -1) return true;
    }
    return false;
  } catch(err) {
    return false;
  }
}

/* ---------- Open in external browser (Android intent or iOS instructions) ---------- */
function openInExternalBrowser() {
  const ua = navigator.userAgent || '';
  const currentUrl = window.location.href;
  if (/Android/i.test(ua)) {
    // Use Android intent URL (best-effort)
    const urlNoProtocol = currentUrl.replace(/^https?:\/\//,'');
    const intentUrl = `intent://${urlNoProtocol}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
    window.location.href = intentUrl;
  } else {
    // For iOS show a short guidance
    alert("در آیفون: از منوی اشتراک‌گذاری گزینهٔ 'Open in Safari' یا 'Open in Browser' را انتخاب کنید.");
  }
}

/* ---------- Theme handling (sync with browser; saved to localStorage) ---------- */
(function themeInit() {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const bottomThemeBtn = document.getElementById('bottomThemeBtn');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const saved = localStorage.getItem('hi:theme'); // 'dark' | 'light' or null

  const apply = (isDark) => {
    root.classList.toggle('dark', !!isDark);
    if (metaThemeColor) metaThemeColor.setAttribute('content', isDark ? '#0c111d' : '#f2f4f7');
    const sun = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    if (sun && moon) {
      sun.style.display = isDark ? 'none' : 'inline-block';
      moon.style.display = isDark ? 'inline-block' : 'none';
    }
    if (themeBtn) themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  };

  // initial
  if (saved === 'dark') apply(true);
  else if (saved === 'light') apply(false);
  else {
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(prefers);
  }

  // toggle function
  function toggleAndSave() {
    const isDark = root.classList.contains('dark');
    const next = !isDark;
    localStorage.setItem('hi:theme', next ? 'dark' : 'light');
    apply(next);
  }

  // listeners
  if (themeBtn) themeBtn.addEventListener('click', (e) => {
    if (!prefersReducedMotion && window.gsap) {
      gsap.fromTo(themeBtn, {scale:1},{scale:0.94,duration:0.12,yoyo:true,repeat:1,clearProps:"scale"});
    }
    toggleAndSave();
  });
  if (bottomThemeBtn) bottomThemeBtn.addEventListener('click', toggleAndSave);

  // if user hasn't explicitly chosen, follow browser changes
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener && mq.addEventListener('change', (e) => {
      if (!localStorage.getItem('hi:theme')) {
        apply(e.matches);
      }
    });
  }
})();

/* ---------- Preloader & entrance animations ---------- */
(function preloaderAndEntrances(){
  const preloader = document.getElementById('preloader');
  const preloaderInner = document.querySelector('#preloader .preloader-inner');
  const mainCard = document.querySelector('.card');

  function hidePreloader() {
    if (!preloader) return;
    if (prefersReducedMotion || !window.gsap) {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden','true');
      if (mainCard) mainCard.style.opacity = 1;
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(preloaderInner, { duration: 0.8, scale: 1.04, yoyo: true, repeat: 1 });
    tl.to(preloader, { duration: 0.7, opacity: 0, delay: 0.12, onComplete: () => {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden','true');
    }});
    if (mainCard) {
      gsap.from(mainCard, { duration: 0.9, y: 18, opacity: 0, ease: "power3.out", delay: 0.12 });
    }
  }

  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 300);
  });

  setTimeout(() => {
    if (preloader && preloader.style.display !== 'none') hidePreloader();
  }, 4500);
})();

/* ---------- Ripple effect for buttons ---------- */
(function setupRipples(){
  function createRipple(button, event) {
    const rect = button.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height) * 1.2;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = `${d}px`;
    const x = (event.clientX || (rect.left + rect.width/2)) - rect.left - d/2;
    const y = (event.clientY || (rect.top + rect.height/2)) - rect.top - d/2;
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.style.background = getComputedStyle(document.documentElement).getPropertyValue('--ripple-color') || 'rgba(0,0,0,0.08)';
    button.appendChild(span);
    setTimeout(()=> span.remove(), 650);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-btn, .social, .bottom-item, .modal-button, .bottom-theme-btn');
    if (btn) createRipple(btn, e);
  }, {passive:true});
})();

/* ---------- Bottom nav behavior: hide on scroll down, show on up ---------- */
(function bottomNavScroll(){
  const bottomNav = document.getElementById('bottomNav');
  if (!bottomNav) return;
  let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (prefersReducedMotion) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      if (Math.abs(current - lastScroll) < 10) {
        ticking = false; return;
      }
      if (current > lastScroll && current > 120) {
        bottomNav.style.transform = 'translateX(-50%) translateY(64px)';
        bottomNav.style.opacity = '0';
      } else {
        bottomNav.style.transform = 'translateX(-50%) translateY(0)';
        bottomNav.style.opacity = '1';
      }
      lastScroll = current;
      ticking = false;
    });
  }, {passive:true});

  bottomNav.addEventListener('focusin', () => {
    bottomNav.style.transform = 'translateX(-50%) translateY(-6px)';
  });
  bottomNav.addEventListener('focusout', () => {
    bottomNav.style.transform = 'translateX(-50%) translateY(0)';
  });
})();

/* ---------- In-App modal logic (show every time in-app detected) ---------- */
(function inAppModalFlow(){
  const modal = document.getElementById('inAppBrowserModal');
  const openBtn = document.getElementById('openInBrowserBtn');
  const continueBtn = document.getElementById('continueInAppBtn');

  try {
    if (isRunningInApp() && modal && openBtn && continueBtn) {
      // Always show modal when in-app detected (every page load)
      modal.style.display = 'flex';
      requestAnimationFrame(() => modal.classList.add('visible'));
      modal.setAttribute('aria-hidden','false');

      openBtn.addEventListener('click', () => {
        openInExternalBrowser();
      });

      continueBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden','true');
        setTimeout(()=> { modal.style.display = 'none'; }, 420);
      });
    }
  } catch(e) {
    console.error(e);
  }
})();

/* ---------- Accessibility live region for theme changes ---------- */
(function accessibilityAnnounce(){
  const live = document.createElement('div');
  live.setAttribute('aria-live','polite');
  live.style.position = 'absolute';
  live.style.left = '-9999px';
  document.body.appendChild(live);

  const obs = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        live.textContent = isDark ? 'حالت تیره فعال شد' : 'حالت روشن فعال شد';
      }
    });
  });
  obs.observe(document.documentElement, { attributes: true });
})();
