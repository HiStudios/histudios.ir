document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Theme Management ---
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const lightThemeColor = '#f2f4f7';
  const darkThemeColor = '#0c111d';

  function applyTheme(isDark) {
    root.classList.toggle('dark', isDark);
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? darkThemeColor : lightThemeColor);
    }
  }

  // Set theme on initial load from localStorage or OS preference
  const storedTheme = localStorage.getItem('hi:theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme ? storedTheme === 'dark' : prefersDark);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = !root.classList.contains('dark');
      localStorage.setItem('hi:theme', isDark ? 'dark' : 'light');
      applyTheme(isDark);
    });
  }
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('hi:theme')) { applyTheme(e.matches); }
  });

  // --- 2. Bottom Navigation Active State ---
  const navItems = document.querySelectorAll('.nav-item');
  const currentPagePath = window.location.pathname;
  navItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    if (currentPagePath.startsWith(itemPath)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // --- 3. Entry Animations on Scroll ---
  const animatedElements = document.querySelectorAll('.anim-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

  animatedElements.forEach(el => observer.observe(el));
});
