(function(){
  'use strict';

  // --- 1. Theme Management ---
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');

  // Set theme on initial load
  function applyInitialTheme() {
    const storedTheme = localStorage.getItem('hi:theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    if (isDark) { 
      root.classList.add('dark'); 
    }
  }

  // Handle theme toggle button click
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      root.classList.toggle('dark');
      localStorage.setItem('hi:theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // Sync with OS theme changes if no preference is saved
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('hi:theme')) {
      if (e.matches) { root.classList.add('dark'); }
      else { root.classList.remove('dark'); }
    }
  });

  applyInitialTheme();


  // --- 2. Animation Logic ---

  // Function to detect if it's a touch device
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // A. Ripple animation for buttons (runs on all devices on click)
  const rippleButtons = document.querySelectorAll('.toggle-btn, .social');
  rippleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const ripple = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
      ripple.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
      ripple.classList.add("ripple");
      
      const existingRipple = button.querySelector(".ripple");
      if(existingRipple) existingRipple.remove();

      button.appendChild(ripple);
      
      setTimeout(() => { if (ripple) ripple.remove(); }, 500);
    });
  });

  // B. Click-based "fire-and-forget" animations for TOUCH devices ONLY
  if (isTouchDevice()) {
    // Lift animation for buttons
    const liftButtons = document.querySelectorAll('.toggle-btn, .social');
    liftButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.add('animate-lift');
        button.addEventListener('animationend', () => {
          button.classList.remove('animate-lift');
        }, { once: true });
      });
    });

    // Color flash animation for the founder link
    const founderLink = document.querySelector('.founder-link');
    if (founderLink) {
      founderLink.addEventListener('click', () => {
        founderLink.classList.add('animate-link-color');
        founderLink.addEventListener('animationend', () => {
          founderLink.classList.remove('animate-link-color');
        }, { once: true });
      });
    }
  }
  
})();
