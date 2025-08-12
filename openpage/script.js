document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  let REAL_TARGET = params.get('destination') || '/home/';
  
  // اگر مقصد '/' است، آن را به '/home/' تغییر بده
  if (REAL_TARGET === '/') {
    REAL_TARGET = '/home/';
  }
  
  const DESTINATION = "/open?u=" + encodeURIComponent(REAL_TARGET);

  const interstitial = document.getElementById('interstitial');
  const fallback = document.getElementById('fallback');
  const openBtn = document.getElementById('open-btn');
  const skipBtn = document.getElementById('skip-btn');

  interstitial.setAttribute('aria-hidden','false');

  openBtn.addEventListener('click', e => {
    e.preventDefault();
    const ua = navigator.userAgent || '';
    
    if(/Android/i.test(ua)){
      try {
        // ساخت لینک با در نظر گرفتن مسیر صحیح
        const targetUrl = new URL(REAL_TARGET, window.location.origin);
        const intentUrl = `intent://${targetUrl.host}/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(REAL_TARGET)};end`;
        window.location.href = intentUrl;
      } catch {
        window.location.href = REAL_TARGET;
      }
    } else {
      // برای iOS و سایر دستگاه‌ها
      window.location.href = REAL_TARGET;
    }
  });

  skipBtn.addEventListener('click', () => {
    interstitial.setAttribute('aria-hidden','true');
    fallback.setAttribute('aria-hidden','false');
    window.location.href = REAL_TARGET;
  });
});
