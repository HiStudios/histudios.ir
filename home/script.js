(function(){
  'use strict';

  // --- In-App Browser Detection ---
  function detectInApp() {
    const ua = navigator.userAgent || "";
    // A comprehensive regex to detect in-app browsers
    const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger|SNC|Snapchat)/i;
    return inAppTokens.test(ua) || /Android.*(wv|Version\/)/i.test(ua);
  }

  // Run all scripts after the document is fully loaded
  document.addEventListener('DOMContentLoaded', () => {

    // --- Modal Logic ---
    if (detectInApp()) {
      const modal = document.getElementById('inAppBrowserModal');
      const closeBtn = document.getElementById('closeModalBtn');

      if (modal && closeBtn) {
        modal.style.display = 'flex'; // Make it part of the layout
        setTimeout(() => { // Allow a frame for the display change
            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');
        }, 20);

        closeBtn.addEventListener('click', () => {
          modal.classList.remove('visible');
          modal.setAttribute('aria-hidden', 'true');
          // Optional: completely hide after transition
          setTimeout(() => {
              modal.style.display = 'none';
          }, 300); // Should match transition duration
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
