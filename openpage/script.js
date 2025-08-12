document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const REAL_TARGET = params.get('destination') || '/home/';
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
        const targetUrl = new URL(REAL_TARGET);
        const intentUrl = `intent://${targetUrl.host}/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(DESTINATION)};end`;
        window.location.href = intentUrl;
      } catch {
        window.open(DESTINATION, '_blank');
      }
    } else {
      window.open(DESTINATION, '_blank');
    }
  });

  skipBtn.addEventListener('click', () => {
    interstitial.setAttribute('aria-hidden','true');
    fallback.setAttribute('aria-hidden','false');
    window.location.replace(REAL_TARGET);
  });
}); 
