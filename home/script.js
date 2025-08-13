(function(){
  'use strict';

  // --- 1. Theme Management ---
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const themeMeta = document.getElementById('theme-color-meta');
  
  const lightThemeColor = '#f2f4f7';
  const darkThemeColor = '#0c111d';

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

  // Set theme on initial load
  const storedTheme = localStorage.getItem('hi:theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialIsDark = storedTheme ? storedTheme === 'dark' : prefersDark;
  applyTheme(initialIsDark);

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

  // --- 2. Bottom Navigation Active State ---
  const navItems = document.querySelectorAll('.nav-item');
  const currentPagePath = window.location.pathname;

  navItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    // Check if the current page path starts with the nav item's path
    // This correctly handles '/home/' matching the '/home/' link
    if (currentPagePath.startsWith(itemPath)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

})();
