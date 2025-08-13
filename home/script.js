// کد نهایی و کامل برای فایل home/script.js

(function(){
  'use strict';

  // --- تابع تشخیص مرورگر داخلی (نسخه بهبود یافته) ---
  function detectInApp() {
    const ua = navigator.userAgent || "";
    // لیست جامع‌تری از شناسه‌های مرورگرهای داخلی
    const inAppTokens = /(FB_IAB|FB4A|FBAN|FBIOS|FBSS|trill|tango|snapchat|swiftkey|Pinterest|LINE|wv|WebView|Instagram|Telegram|Twitter)/i;
    // برخی مرورگرهای داخلی در اندروید خود را مانند کروم جا می‌زنند اما کلمه "wv" را در گذشته داشتند
    // یا ممکن است هیچ نشانه‌ای نداشته باشند. این یک مشکل شناخته‌شده است.
    return inAppTokens.test(ua);
  }

  // اجرای تمام اسکریپت‌ها پس از بارگذاری کامل صفحه
  document.addEventListener('DOMContentLoaded', () => {

    // --- منطق نمایش پاپ‌آپ ---
    if (detectInApp()) {
      const modal = document.getElementById('inAppBrowserModal');
      const closeBtn = document.getElementById('closeModalBtn');

      if (modal && closeBtn) {
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
      }
    }

    // --- کدهای اصلی شما برای تم و انیمیشن‌ها ---

    // 1. Element Definitions
    const root = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    const themeIconSun = document.getElementById('themeIconSun');
    const themeIconMoon = document.getElementById('themeIconMoon');
    const themeMeta = document.getElementById('theme-color-meta');
    
    const lightThemeColor = '#f2f4f7';
    const darkThemeColor = '#0c111d';

    // 2. Core Functions
    function applyTheme(isDark) {
      if (isDark) {
        root.classList.add('dark');
        if (themeMeta) themeMeta.setAttribute('content', darkThemeColor);
      } else {
        root.classList.remove('dark');
        if (themeMeta) themeMeta.setAttribute('content', lightThemeColor);
      }
      if (themeIconSun && themeIconMoon) {
          themeIconSun.style.display = isDark ? 'none' : 'inline-block';
          themeIconMoon.style.display = isDark ? 'inline-block' : 'none';
      }
    }

    // 3. Animation Logic
    function createRipple(button, event) {.
      const ripple = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
      ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
      ripple.classList.add("ripple");
      
      const existingRipple = button.querySelector(".ripple");
      if(existingRipple) existingRipple.remove();
      
      button.appendChild(ripple);
    }

    // 4. Event Listeners
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = !root.classList.contains('dark');
        localStorage.setItem('hi:theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
      });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('hi:theme')) {
        applyTheme(e.matches);
      }
    });

    const rippleButtons = document.querySelectorAll('.toggle-btn, .social');
    rippleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        createRipple(button, e);
      });
    });

    // 5. Initial Load
    const storedTheme = localStorage.getItem('hi:theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialIsDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    applyTheme(initialIsDark);

  });

})();
 
