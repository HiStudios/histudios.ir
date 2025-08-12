document.addEventListener('DOMContentLoaded', () => {
  // گرفتن URL اصلی از پارامتر 'destination'
  const params = new URLSearchParams(window.location.search);
  const REAL_TARGET = params.get('destination');

  // اگر پارامتر مقصد وجود نداشت (برای اطمینان)، به صفحه اصلی برو
  if (!REAL_TARGET) {
    window.location.replace('/home/');
    return;
  }
  
  // اکنون از تابع /open امنیتی برای ریدایرکت استفاده می‌کنیم
  const DESTINATION = "/open?u=" + encodeURIComponent(REAL_TARGET);

  const interstitial = document.getElementById('interstitial');
  const fallback = document.getElementById('fallback');
  const openBtn = document.getElementById('open-btn');
  const skipBtn = document.getElementById('skip-btn');

  // چون این صفحه فقط از طریق middleware برای مرورگرهای داخلی باز می‌شود،
  // دیگر نیازی به تابع detectInApp در اینجا نیست.
  
  interstitial.setAttribute('aria-hidden','false');

  openBtn.addEventListener('click', e => {
    e.preventDefault();
    const ua = navigator.userAgent || '';
    
    // بقیه کد برای اندروید و iOS بدون تغییر باقی می‌ماند، 
    // چون متغیر DESTINATION اکنون داینامیک است.

    if(/Android/i.test(ua)){
      const intentUrl = `intent://${new URL(REAL_TARGET).host}${new URL(DESTINATION).pathname}${new URL(DESTINATION).search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(REAL_TARGET)};end`;
      window.location.href = intentUrl;
    } else if(/iPhone|iPad|iPod/i.test(ua)){
      // برای iOS، مستقیما لینک مقصد را در یک تب جدید باز می‌کنیم
      // چون تلاش برای باز کردن اسکیم‌های دیگر قابل اعتماد نیست.
      window.open(DESTINATION, '_blank', 'noopener');
    } else {
      window.open(DESTINATION, '_blank', 'noopener');
    }
  });

  skipBtn.addEventListener('click', () => {
    interstitial.setAttribute('aria-hidden','true');
    fallback.setAttribute('aria-hidden','false');
    window.location.replace(DESTINATION);
  });
});
 
