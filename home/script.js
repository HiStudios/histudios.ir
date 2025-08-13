(function(){
  'use strict';

  /**
   * Tries to detect if the page is loaded inside an in-app browser.
   * This is not 100% reliable as some apps disguise their user agent.
   * @returns {boolean}
   */
  function isRunningInApp() {
    const ua = navigator.userAgent || "";
    
    // Most reliable check for Telegram Web App environment
    if (window.Telegram && window.Telegram.WebApp) {
      return true;
    }

    // Fallback to User Agent sniffing for other apps like Instagram, etc.
    const inAppTokens = /(FBAN|FBAV|Instagram|WebView|wv)/i;
    return inAppTokens.test(ua);
  }

  /**
   * Attempts to open the current URL in an external browser.
   * Works reliably on Android; shows guidance on iOS.
   */
  function openInExternalBrowser() {
    const ua = navigator.userAgent || "";
    const currentUrl = window.location.href;

    // For Android, use a Chrome Intent to force opening in the external browser
    if (/Android/i.test(ua)) {
      // This special URL format tells Android to open the link in Chrome
      // If Chrome is not available, it will fall back to the original URL
      const intentUrl = `intent://${currentUrl.substring(8)}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
      window.location.href = intentUrl;
    } 
    // For iOS and others, a direct "open in browser" command is not reliably available
    else {
      alert("برای باز کردن در مرورگر، لطفاً از منوی اشتراک‌گذاری یا تنظیمات مرورگر داخلی، گزینه 'Open in Safari' یا 'Open in Browser' را انتخاب کنید.");
    }
  }

  // Run all scripts after the document is fully loaded
  document.addEventListener('DOMContentLoaded', () => {

    // --- Modal Logic ---
    // Check if we are in an in-app browser
    if (isRunningInApp()) {
      const modal = document.getElementById('inAppBrowserModal');
      const openBtn = document.getElementById('openInBrowserBtn');
      const continueBtn = document.getElementById('continueInAppBtn');
      
      // Ensure all required elements exist
      if (modal && openBtn && continueBtn) {
        
        // Show the modal with a smooth animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');
        }, 50); // Small delay to ensure CSS transition triggers

        // Add event listeners for the buttons
        openBtn.addEventListener('click', openInExternalBrowser);

        continueBtn.addEventListener('click', () => {
          modal.classList.remove('visible');
          modal.setAttribute('aria-hidden', 'true');
          // Wait for animation to finish before hiding the element completely
          setTimeout(() => {
              modal.style.display = 'none';
          }, 400); // Should match CSS transition duration
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
