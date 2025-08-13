// --- کد موقت برای دیباگ ---

(function(){
  'use strict';

  // تابع تشخیص مرورگر داخلی
  function detectInApp() {
    const ua = navigator.userAgent || "";
    const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger|SNC|Snapchat)/i;
    return inAppTokens.test(ua) || /Android.*(wv|Version\/)/i.test(ua);
  }

  // اجرای منطق اصلی بعد از بارگذاری کامل صفحه
  document.addEventListener('DOMContentLoaded', () => {
    
    alert('مرحله ۱: صفحه بارگذاری شد. اسکریپت در حال اجراست.');
    
    alert('مرحله ۲: مشخصات مرورگر شما (User Agent) این است:\n\n' + navigator.userAgent);

    // اگر مرورگر داخلی بود، پاپ‌آپ را نمایش بده
    if (detectInApp()) {
      
      alert('مرحله ۳: مرورگر داخلی تشخیص داده شد!');

      const modal = document.getElementById('inAppBrowserModal');
      const closeBtn = document.getElementById('closeModalBtn');

      if (modal && closeBtn) {
        
        alert('مرحله ۴: پاپ‌آپ پیدا شد و در حال نمایش است.');
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');
        }, 20);

        closeBtn.addEventListener('click', () => {
          modal.classList.remove('visible');
          modal.setAttribute('aria-hidden', 'true');
          setTimeout(() => {
              modal.style.display = 'none';
          }, 300);
        });
      } else {
        alert('خطا: پاپ‌آپ در صفحه پیدا نشد!');
      }
    } else {
      alert('مرحله ۳: مرورگر داخلی تشخیص داده نشد. (مرورگر عادی)');
    }
  });

})();
 
