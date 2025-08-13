(function(){
  'use strict';

  // Run all scripts after the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Management ---
    const root = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    const themeIconSun = document.getElementById('themeIconSun');
    const themeIconMoon = document.getElementById('themeIconMoon');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    
    const lightThemeColor = root.style.getPropertyValue('--bg') || '#f2f4f7';
    const darkThemeColor = root.style.getPropertyValue('--bg') || '#0c111d';

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

    // Initial theme setup needs to know the icon states
    applyTheme(root.classList.contains('dark'));

    // --- 2. Bottom Navigation Active State ---
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = window.location.pathname;

    navItems.forEach(item => {
      const itemPath = item.getAttribute('href');
      if (currentPage.startsWith(itemPath)) {
        // Remove active from all
        navItems.forEach(i => i.classList.remove('active'));
        // Add active to the current one
        item.classList.add('active');
      }
    });

    // --- 3. Entry Animations on Scroll ---
    const animatedElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
      observer.observe(el);
    });

  }); // End of DOMContentLoaded

})();
