(function(){
  'use strict';

  // --- In-App Browser Utilities ---
  function detectInApp() {
    const ua = navigator.userAgent || "";
    // First, check for Telegram's specific JS object, which is the most reliable method
    if (window.Telegram && window.Telegram.WebApp) {
      return true;
    }
    // Fallback to User Agent sniffing for other apps like Instagram
    const inAppTokens = /(FBAN|FBAV|Instagram|WebView|wv)/i;
    return inAppTokens.test(ua);
  }

  function openInBrowser() {
    const ua = navigator.userAgent || "";
    const currentUrl = window.location.href;

    // For Android, use a Chrome Intent to force opening in the external browser
    if (/Android/i.test(ua)) {
      const intentUrl = `intent://${currentUrl.substring(8)}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
      window.location.href = intentUrl;
    } 
    // For iOS and other OS, there's no reliable way to force open the browser.
    // The pop-up text will guide the user.
    else {
      // You can optionally try window.open as a last resort, but it might open in the same webview
      // window.open(currentUrl, '_blank'); 
      alert("برای باز کردن در مرورگر، لطفاً از منوی اشتراک‌گذاری یا تنظیمات مرورگر داخلی، گزینه 'Open in Safari' یا 'Open in Browser' را انتخاب کنید.");
    }
  }

  // Run all scripts after the document is fully loaded
  document.addEventListener('DOMContentLoaded', () => {

    // --- Modal Logic ---
    if (detectInApp()) {
      const modal = document.getElementById('inAppBrowserModal');
      const openBtn = document.getElementById('openInBrowserBtn');
      const continueBtn = document.getElementById('continueInAppBtn');
      
      if (modal && openBtn && continueBtn) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');
        }, 50); // Small delay to ensure transition triggers

        openBtn.addEventListener('click', openInBrowser);

        continueBtn.addEventListener('click', () => {
          modal.classList.remove('visible');
          modal.setAttribute('aria-hidden', 'true');
          setTimeout(() => {
              modal.style.display = 'none';
          }, 350); // Match CSS transition duration
        });
      }
    }

    // --- Original Theme & Ripple Logic ---

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
    function createRipple(button, event) {
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

  }); // End of DOMContentLoaded

})();
