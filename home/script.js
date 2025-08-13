(function(){
  'use strict';

  /**
   * Attempts to open the current URL in an external browser.
   * Works reliably on Android; shows guidance on iOS.
   */
  function openInExternalBrowser() {
    const ua = navigator.userAgent || "";
    const currentUrl = window.location.href;

    // For Android, use a Chrome Intent to force opening in the external browser
    if (/Android/i.test(ua)) {
      const intentUrl = `intent://${currentUrl.substring(8)}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
      window.location.href = intentUrl;
    } 
    // For iOS and others, a direct "open in browser" command is not reliably available
    else {
      alert("در آیفون، لطفاً از منوی اشتراک‌گذاری (Share) گزینه 'Open in Safari' را انتخاب کنید.");
    }
  }

  // Run all scripts after the document is fully loaded
  document.addEventListener('DOMContentLoaded', () => {

    // --- Modal Logic using inapp-spy library ---
    // Check if the InAppSpy library is loaded
    if (typeof InAppSpy === 'function') {
      const spy = InAppSpy();
      // Check if we are in any in-app browser
      if (spy.isInApp) {
        console.log(`In-app browser detected: ${spy.appName}`); // For debugging
        
        const modal = document.getElementById('inAppBrowserModal');
        const openBtn = document.getElementById('openInBrowserBtn');
        const continueBtn = document.getElementById('continueInAppBtn');
        
        // Ensure all required modal elements exist
        if (modal && openBtn && continueBtn) {
          
          // Show the modal with a smooth animation
          modal.style.display = 'flex';
          setTimeout(() => {
              modal.classList.add('visible');
              modal.setAttribute('aria-hidden', 'false');
          }, 50);

          // Add event listeners for the buttons
          openBtn.addEventListener('click', openInExternalBrowser);

          continueBtn.addEventListener('click', () => {
            modal.classList.remove('visible');
            modal.setAttribute('aria-hidden', 'true');
            // Wait for animation to finish before hiding the element
            setTimeout(() => {
                modal.style.display = 'none';
            }, 450); // Should match CSS transition duration
          });
        }
      }
    }

    // --- Original Theme & Ripple Logic ---

    // 1. Element Definitions
    const root = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    const themeIconSun = document.getElementById('themeIconSun');
    const themeIconMoon = document.getElementById('themeIconMoon');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    
    const lightThemeColor = '#f2f4f7';
    const darkThemeColor = '#0c111d';

    // 2. Core Functions for theme switching
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

    // 3. Animation Logic for ripple effect
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

    // 4. Event Listeners for theme and ripples
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = !root.classList.contains('dark');
        localStorage.setItem('hi:theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
      });
    }

    // Sync with browser/OS theme changes if no preference is saved
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

    // The initial theme is now set by the inline script in the <head>.
    // We just need to make sure the toggle button icon is correct on load.
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    if (themeIconSun && themeIconMoon) {
        themeIconSun.style.display = isCurrentlyDark ? 'none' : 'inline-block';
        themeIconMoon.style.display = isCurrentlyDark ? 'inline-block' : 'none';
    }

  }); // End of DOMContentLoaded

})();
