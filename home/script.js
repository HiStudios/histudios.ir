/* ---------- Preloader ---------- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.style.display = 'none', 500);
  }
});

/* ---------- Theme toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
const userTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (userTheme === 'dark' || (!userTheme && systemDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

/* Update theme if system changes */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});

/* ---------- In-App Browser detection ---------- */
function isRunningInApp() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    ua.includes('FBAN') || ua.includes('FBAV') || ua.includes('Instagram') || ua.includes('Line') || ua.includes('Messenger')
  );
}

function openInExternalBrowser() {
  const url = window.location.href;
  window.open(url, '_blank');
}

/* Always show modal when in-app detected */
(function inAppModalFlow(){
  const modal = document.getElementById('inAppBrowserModal');
  const openBtn = document.getElementById('openInBrowserBtn');
  const continueBtn = document.getElementById('continueInAppBtn');

  try {
    if (isRunningInApp() && modal && openBtn && continueBtn) {
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
