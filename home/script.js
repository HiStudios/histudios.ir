// --- Start of home/script.js ---

// A function to attempt opening the current URL in an external browser
function openInExternalBrowser() {
  const ua = navigator.userAgent || "";
  const currentUrl = window.location.href;

  // For Android, use a Chrome Intent for a reliable result
  if (/Android/i.test(ua)) {
    const intentUrl = `intent://${currentUrl.substring(8)}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
    window.location.href = intentUrl;
  } 
  // For iOS, a direct command is not available, so we guide the user
  else {
    alert("در آیفون، لطفاً از منوی اشتراک‌گذاری (Share) گزینه 'Open in Safari' را انتخاب کنید.");
  }
}

// All scripts run after the DOM is fully loaded to ensure elements are available
document.addEventListener('DOMContentLoaded', () => {

  // --- Modal Logic using detect-inapp library ---
  // First, check if the InApp library was loaded successfully
  if (typeof InApp === 'function') {
    const ia = new InApp(navigator.userAgent || window.navigator.vendor || window.opera);
    
    // If the library detects any in-app browser
    if (ia.isInApp) {
      console.log(`In-app browser detected: ${ia.browser}`); // For debugging
      
      const modal = document.getElementById('inAppBrowserModal');
      const openBtn = document.getElementById('openInBrowserBtn');
      const continueBtn = document.getElementById('continueInAppBtn');
      
      if (modal && openBtn && continueBtn) {
        // Show the modal with a smooth animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');
        }, 50);

        // Assign actions to the modal buttons
        openBtn.addEventListener('click', openInExternalBrowser);
        continueBtn.addEventListener('click', () => {
          modal.classList.remove('visible');
          modal.setAttribute('aria-hidden', 'true');
          setTimeout(() => {
              modal.style.display = 'none';
          }, 450); // Match CSS transition duration
        });
      }
    }
  }

  // --- Theme & UI Logic ---
  
  // 1. Element Definitions
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  
  const lightThemeColor = '#f2f4f7';
  const darkThemeColor = '#0c111d';

  // 2. Core function to apply the theme
  function applyTheme(isDark) {
    root.classList.toggle('dark', isDark);
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? darkThemeColor : lightThemeColor);
    }
    if (themeIconSun && themeIconMoon) {
      themeIconSun.style.display = isDark ? 'none' : 'inline-block';
      themeIconMoon.style.display = isDark ? 'inline-block' : 'none';
    }
  }

  // 3. Ripple effect for buttons
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

  // Sync with browser/OS theme changes if no preference is saved
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('hi:theme')) {
      applyTheme(e.matches);
    }
  });

  // Attach ripple effect to all relevant buttons
  const rippleButtons = document.querySelectorAll('.toggle-btn, .social');
  rippleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      createRipple(button, e);
    });
  });

  // 5. Correctly set the initial state of the theme toggle icon
  // The theme itself is already set by the inline script in <head>
  applyTheme(root.classList.contains('dark'));

}); // End of DOMContentLoaded
