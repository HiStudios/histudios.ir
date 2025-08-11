(function(){
  'use strict';

  // --- 1. Element Definitions ---
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const themeMeta = document.getElementById('theme-color-meta');
  
  const lightThemeColor = '#FFC300';
  const darkThemeColor = '#FFC300';

  // --- 2. Core Functions ---

  /**
   * Applies the theme (dark/light) to the entire page.
   * @param {boolean} isDark - True if dark mode should be enabled.
   */
  function applyTheme(isDark) {
    if (isDark) {
      root.classList.add('dark');
      if (themeMeta) themeMeta.setAttribute('content', darkThemeColor);
    } else {
      root.classList.remove('dark');
      if (themeMeta) themeMeta.setAttribute('content', lightThemeColor);
    }
    // Toggle icon visibility based on theme
    if (themeIconSun && themeIconMoon) {
        themeIconSun.style.display = isDark ? 'none' : 'inline-block';
        themeIconMoon.style.display = isDark ? 'inline-block' : 'none';
    }
  }

  // --- 3. Animation Logic ---

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

  // --- 4. Event Listeners ---

  // Handle theme toggle button click
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = !root.classList.contains('dark');
      localStorage.setItem('hi:theme', isDark ? 'dark' : 'light');
      applyTheme(isDark);
    });
  }

  // Sync with OS theme changes if no preference is saved
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('hi:theme')) {
      applyTheme(e.matches);
    }
  });

  // Attach ripple effect to all buttons
  const rippleButtons = document.querySelectorAll('.toggle-btn, .social');
  rippleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      createRipple(button, e);
    });
  });

  // --- 5. Initial Load ---

  // Set theme on initial page load
  const storedTheme = localStorage.getItem('hi:theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialIsDark = storedTheme ? storedTheme === 'dark' : prefersDark;
  applyTheme(initialIsDark);

})();
 
