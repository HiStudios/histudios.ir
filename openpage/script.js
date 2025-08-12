document.addEventListener('DOMContentLoaded', () => {
  // گرفتن URL اصلی از پارامتر 'destination'
  const params = new URLSearchParams(window.location.search);
  const REAL_TARGET = params.get('destination') || '/home/';
  
  // اکنون از تابع /open امنیتی برای ریدایرکت استفاده می‌کنیم
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
        const targetHost = new URL(REAL_TARGET).host;
        const intentUrl = `intent://${targetHost}/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(REAL_TARGET)};end`;
        window.location.href = intentUrl;
      } catch {
        window.open(REAL_TARGET, '_blank');
      }
    } else {
      window.open(REAL_TARGET, '_blank');
    }
  });

  skipBtn.addEventListener('click', () => {
    interstitial.setAttribute('aria-hidden','true');
    fallback.setAttribute('aria-hidden','false');
    window.location.replace(REAL_TARGET);
  });
});
