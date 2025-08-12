// مسیر امن به Worker — مقصد واقعی را فقط از این طریق باز می‌کنیم
const REAL_TARGET = "https://histudios.ir/home/";
const DESTINATION = "/open?u=" + encodeURIComponent(REAL_TARGET);

// دامنه‌های مجاز برای چک کلاینت (چک اصلی سمت سرور انجام میشه)
const LOCAL_WHITELIST = ["histudios.ir", "www.histudios.ir", "cdn.histudios.ir"];

function detectInApp(){
  const ua = navigator.userAgent || "";
  const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger)/i;
  return inAppTokens.test(ua) || /Android.*(wv|Version\/)/i.test(ua);
}

function buildAndroidIntent(target){
  const u = encodeURIComponent(target);
  const packageName = 'com.android.chrome';
  return `intent://${window.location.host + window.location.pathname}#Intent;scheme=https;package=${packageName};S.browser_fallback_url=${u};end`;
}

function tryIOSSchemes(target){
  const schemes = [
    'googlechrome://navigate?url=',
    'googlechromes://navigate?url=',
    'firefox://open-url?url=',
    'edge://open-url?url=',
    'brave://open-url?url='
  ];
  let i = 0;
  function attemptNext(){
    if(i >= schemes.length) return;
    window.location = schemes[i++] + encodeURIComponent(target);
    setTimeout(attemptNext, 800);
  }
  attemptNext();
}

document.addEventListener('DOMContentLoaded', () => {
  const isInApp = detectInApp();
  const interstitial = document.getElementById('interstitial');
  const fallback = document.getElementById('fallback');
  const openBtn = document.getElementById('open-btn');
  const skipBtn = document.getElementById('skip-btn');

  if(!isInApp){
    window.location.replace(DESTINATION);
    return;
  }

  interstitial.setAttribute('aria-hidden','false');

  openBtn.addEventListener('click', e => {
    e.preventDefault();
    const ua = navigator.userAgent || '';

    if(/Android/i.test(ua)){
      const intentUrl = buildAndroidIntent(window.location.origin + DESTINATION);
      window.location = intentUrl;
      setTimeout(() => window.location.replace(DESTINATION), 900);
      return;
    }

    if(/iPhone|iPad|iPod/i.test(ua)){
      tryIOSSchemes(window.location.origin + DESTINATION);
      setTimeout(() => window.open(DESTINATION, '_blank', 'noopener'), 1100);
      return;
    }

    window.open(DESTINATION, '_blank', 'noopener');
  });

  skipBtn.addEventListener('click', () => {
    interstitial.setAttribute('aria-hidden','true');
    fallback.setAttribute('aria-hidden','false');
    window.location.replace(DESTINATION);
  });
});
