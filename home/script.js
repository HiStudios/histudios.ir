/**
 * Hi Studios - Optimized JavaScript
 * =====================================
 * Modern, clean, and performant implementation
 */

'use strict';

/**
 * Configuration object for application settings
 */
const CONFIG = {
  STORAGE_KEYS: {
    THEME: 'hi:theme'
  },
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  COLORS: {
    LIGHT: '#f2f4f7',
    DARK: '#0c111d'
  },
  ANIMATION: {
    MODAL_DELAY: 50,
    MODAL_TRANSITION: 450,
    RIPPLE_DURATION: 500
  }
};

/**
 * Utility functions
 */
const Utils = {
  /**
   * Initializes modal elements
   */
  init() {
  /**
   * Initializes theme elements and sets initial state
   */
  init() {
    this.elements = {
      root: document.documentElement,
      themeButton: document.getElementById('themeBtn'),
      sunIcon: document.getElementById('themeIconSun'),
      moonIcon: document.getElementById('themeIconMoon'),
      themeMeta: document.querySelector('meta[name="theme-color"]')
    };

    this.setInitialTheme();
    this.bindEvents();
  },

  /**
   * Determines and sets the initial theme
   */
  setInitialTheme() {
    const savedTheme = Utils.getStorageItem(CONFIG.STORAGE_KEYS.THEME);
    const prefersDark = Utils.prefersDarkScheme();
    const shouldUseDark = savedTheme === CONFIG.THEMES.DARK || 
                         (!savedTheme && prefersDark);

    this.applyTheme(shouldUseDark);
  },

  /**
   * Applies the specified theme with enhanced animations
   * @param {boolean} isDark - Whether to apply dark theme
   */
  applyTheme(isDark) {
    const { root, sunIcon, moonIcon, themeMeta } = this.elements;
    
    this.currentTheme = isDark ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
    
    // Apply theme class with transition
    root.style.transition = 'all 0.3s ease';
    root.classList.toggle('dark', isDark);
    
    // Update theme color meta tag
    if (themeMeta) {
      const themeColor = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
      themeMeta.setAttribute('content', themeColor);
    }
    
    // Animate theme icons
    this.animateThemeIcons(isDark);
    
    // Dispatch theme change event
    this.dispatchThemeChange(isDark);
  },

  /**
   * Animates theme icon transitions
   * @param {boolean} isDark - Current theme state
   */
  animateThemeIcons(isDark) {
    const { sunIcon, moonIcon } = this.elements;
    
    if (!sunIcon || !moonIcon) return;

    // Fade out current icon
    const currentIcon = isDark ? sunIcon : moonIcon;
    const nextIcon = isDark ? moonIcon : sunIcon;
    
    currentIcon.style.transform = 'scale(0) rotate(180deg)';
    currentIcon.style.opacity = '0';
    
    setTimeout(() => {
      currentIcon.style.display = 'none';
      nextIcon.style.display = 'inline-block';
      nextIcon.style.transform = 'scale(0) rotate(-180deg)';
      nextIcon.style.opacity = '0';
      
      requestAnimationFrame(() => {
        nextIcon.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        nextIcon.style.transform = 'scale(1) rotate(0deg)';
        nextIcon.style.opacity = '1';
      });
    }, 150);
  },

  /**
   * Toggles between light and dark themes
   */
  toggle() {
    const isDark = !this.elements.root.classList.contains('dark');
    this.applyTheme(isDark);
    Utils.setStorageItem(CONFIG.STORAGE_KEYS.THEME, this.currentTheme);
  },

  /**
   * Dispatches a custom theme change event
   * @param {boolean} isDark - New theme state
   */
  dispatchThemeChange(isDark) {
    const event = new CustomEvent('themeChange', {
      detail: { isDark, theme: this.currentTheme }
    });
    document.dispatchEvent(event);
  },

  /**
   * Sets up event listeners for theme interactions
   */
  bindEvents() {
    const { themeButton } = this.elements;
    
    if (themeButton) {
      themeButton.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (event) => {
      if (!Utils.getStorageItem(CONFIG.STORAGE_KEYS.THEME)) {
        this.applyTheme(event.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
};

/**
 * Performance monitoring and optimization module
 */
const PerformanceManager = {
  metrics: {},

  /**
   * Initializes performance monitoring
   */
  init() {
    this.measureLoadTime();
    this.setupIntersectionObserver();
    this.optimizeAnimations();
  },

  /**
   * Measures page load performance
   */
  measureLoadTime() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        this.metrics.loadTime = loadTime;
        console.log(`Hi Studios loaded in ${loadTime}ms`);
      });
    }
  },

  /**
   * Sets up intersection observer for scroll animations
   */
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1 });

      // Observe animated elements
      const animatedElements = document.querySelectorAll('.card, .social, .founder-section');
      animatedElements.forEach(el => observer.observe(el));
    }
  },

  /**
   * Optimizes animations based on user preferences
   */
  optimizeAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--transition-fast', '0.01ms');
      document.documentElement.style.setProperty('--transition-normal', '0.01ms');
      document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
  }
};

/**
 * Enhanced modal management module
 */
const ModalManager = {
  elements: {},

  /**
   * Initializes modal elements
   */
  init() {
    this.elements = {
      modal: document.getElementById('inAppBrowserModal'),
      openButton: document.getElementById('openInBrowserBtn'),
      continueButton: document.getElementById('continueInAppBtn')
    };

    this.bindEvents();
  },

  /**
   * Shows the modal with enhanced animation
   */
  show() {
    const { modal } = this.elements;
    if (!modal) return;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  },

  /**
   * Hides the modal with enhanced animation
   */
  hide() {
    const { modal } = this.elements;
    if (!modal) return;

    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, CONFIG.ANIMATION.MODAL_TRANSITION);
  },

  /**
   * Sets up event listeners for modal interactions
   */
  bindEvents() {
    const { openButton, continueButton } = this.elements;
    
    if (openButton) {
      openButton.addEventListener('click', () => {
        InAppDetector.openInExternalBrowser();
      });
    }
    
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        this.hide();
      });
    }

    // Enhanced keyboard handling
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hide();
      }
    });
  }
};

/**
 * In-app browser detection module (enhanced)
 */
const InAppDetector = {
  /**
   * Detects if the application is running inside an in-app browser
   * @returns {boolean} True if running in an in-app browser
   */
  isRunningInApp() {
    if (window.Telegram?.WebApp) {
      console.log('Detection Method: Telegram WebApp Object');
      return true;
    }

    const userAgent = navigator.userAgent || '';
    const inAppTokens = [
      'FBAN', 'FBAV', 'Instagram', 'WebView', '(wv)',
      'Twitter', 'WhatsApp', 'WeChat', 'Line', 'Snapchat'
    ];

    const isInApp = inAppTokens.some(token => userAgent.includes(token));
    
    if (isInApp) {
      console.log('Detection Method: User Agent Analysis');
      return true;
    }

    return false;
  },

  /**
   * Attempts to open current URL in external browser
   */
  openInExternalBrowser() {
    const userAgent = navigator.userAgent || '';
    const currentUrl = window.location.href;

    if (/Android/i.test(userAgent)) {
      const baseUrl = currentUrl.substring(8);
      const intentUrl = `intent://${baseUrl}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
      
      try {
        window.location.href = intentUrl;
      } catch (error) {
        console.warn('Failed to open in external browser:', error);
        window.open(currentUrl, '_blank');
      }
    } else {
      this.showBrowserGuidance();
    }
  },

  /**
   * Shows guidance for opening in external browser
   */
  showBrowserGuidance() {
    const message = 'در آیفون، لطفاً از منوی اشتراک‌گذاری (Share) گزینه "Open in Safari" را انتخاب کنید.';
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hi Studios', { body: message, icon: '/favicon.ico' });
    } else {
      alert(message);
    }
  }
};

/**
 * Application initialization and main controller
 */
const App = {
  /**
   * Initializes the application with enhanced features
   */
  init() {
    try {
      // Initialize performance monitoring first
      PerformanceManager.init();
      
      // Initialize core modules
      ThemeManager.init();
      RippleEffect.init();
      BottomNavigation.init();
      HamburgerMenu.init();
      
      // Handle in-app browser detection
      if (InAppDetector.isRunningInApp()) {
        ModalManager.init();
        ModalManager.show();
      }

      // Setup global event listeners
      this.setupGlobalEvents();
      
      // Initialize accessibility features
      this.initAccessibility();

      console.log('Hi Studios application initialized successfully with enhanced features');
    } catch (error) {
      console.error('Failed to initialize Hi Studios application:', error);
    }
  },

  /**
   * Sets up global event listeners
   */
  setupGlobalEvents() {
    // Listen for custom events
    document.addEventListener('sectionChange', (event) => {
      console.log('Section changed to:', event.detail.section);
    });

    document.addEventListener('themeChange', (event) => {
      console.log('Theme changed to:', event.detail.theme);
    });

    // Handle resize events
    window.addEventListener('resize', Utils.throttle(() => {
      this.handleResize();
    }, 250));

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Hi Studios tab hidden');
      } else {
        console.log('Hi Studios tab visible');
      }
    });
  },

  /**
   * Handles window resize events
   */
  handleResize() {
    // Update any responsive calculations here
    const width = window.innerWidth;
    console.log('Window resized to:', width);
  },

  /**
   * Initializes accessibility features
   */
  initAccessibility() {
    // Skip links for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--card);
      color: var(--text);
      padding: 8px;
      text-decoration: none;
      transition: top 0.3s;
      z-index: 1000;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  },

  /**
   * Handles application cleanup
   */
  destroy() {
    // Clean up event listeners and resources
    console.log('Hi Studios application cleaned up');
  }
};

/**
 * Initialize application when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

/**
 * Handle page unload for cleanup
 */
window.addEventListener('beforeunload', App.destroy);
      modal: document.getElementById('inAppBrowserModal'),
      openButton: document.getElementById('openInBrowserBtn'),
      continueButton: document.getElementById('continueInAppBtn')
    };
  },

  /**
   * Shows the modal with smooth animation
   */
  show() {
    const { modal } = this.elements;
    if (!modal) return;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    
    setTimeout(() => {
      modal.classList.add('visible');
    }, CONFIG.ANIMATION.MODAL_DELAY);
  },

  /**
   * Hides the modal with smooth animation
   */
  hide() {
    const { modal } = this.elements;
    if (!modal) return;

    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, CONFIG.ANIMATION.MODAL_TRANSITION);
  },

  /**
   * Sets up event listeners for modal interactions
   */
  bindEvents() {
    const { openButton, continueButton } = this.elements;
    
    if (openButton) {
      openButton.addEventListener('click', () => {
        InAppDetector.openInExternalBrowser();
      });
    }
    
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        this.hide();
      });
    }

    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hide();
      }
    });
  }
};

/**
 * Theme management module
 */
const ThemeManager = {
  elements: {},
  currentTheme: null,

  /**
   * Initializes theme elements and sets initial state
   */
  init() {
    this.elements = {
      root: document.documentElement,
      themeButton: document.getElementById('themeBtn'),
      sunIcon: document.getElementById('themeIconSun'),
      moonIcon: document.getElementById('themeIconMoon'),
      themeMeta: document.querySelector('meta[name="theme-color"]')
    };

    this.setInitialTheme();
    this.bindEvents();
  },

  /**
   * Determines and sets the initial theme
   */
  setInitialTheme() {
    const savedTheme = Utils.getStorageItem(CONFIG.STORAGE_KEYS.THEME);
    const prefersDark = Utils.prefersDarkScheme();
    const shouldUseDark = savedTheme === CONFIG.THEMES.DARK || 
                         (!savedTheme && prefersDark);

    this.applyTheme(shouldUseDark);
  },

  /**
   * Applies the specified theme
   * @param {boolean} isDark - Whether to apply dark theme
   */
  applyTheme(isDark) {
    const { root, sunIcon, moonIcon, themeMeta } = this.elements;
    
    this.currentTheme = isDark ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
    
    // Apply theme class
    root.classList.toggle('dark', isDark);
    
    // Update theme color meta tag
    if (themeMeta) {
      const themeColor = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
      themeMeta.setAttribute('content', themeColor);
    }
    
    // Update theme icons
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isDark ? 'none' : 'inline-block';
      moonIcon.style.display = isDark ? 'inline-block' : 'none';
    }
  },

  /**
   * Toggles between light and dark themes
   */
  toggle() {
    const isDark = !this.elements.root.classList.contains('dark');
    this.applyTheme(isDark);
    Utils.setStorageItem(CONFIG.STORAGE_KEYS.THEME, this.currentTheme);
  },

  /**
   * Sets up event listeners for theme interactions
   */
  bindEvents() {
    const { themeButton } = this.elements;
    
    if (themeButton) {
      themeButton.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (event) => {
      // Only respond to system theme changes if no user preference is saved
      if (!Utils.getStorageItem(CONFIG.STORAGE_KEYS.THEME)) {
        this.applyTheme(event.matches);
      }
    };

    // Use the newer addEventListener if available, otherwise fallback to addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
};

/**
 * Ripple effect module
 */
const RippleEffect = {
  /**
   * Creates a ripple effect on the specified element
   * @param {HTMLElement} element - The target element
   * @param {Event} event - The triggering event
   */
  create(element, event) {
    if (!element || !event) return;

    // Remove existing ripples
    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    // Create new ripple element
    const ripple = document.createElement('span');
    const elementRect = element.getBoundingClientRect();
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    // Position the ripple
    ripple.style.width = `${diameter}px`;
    ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - elementRect.left - radius}px`;
    ripple.style.top = `${event.clientY - elementRect.top - radius}px`;
    ripple.classList.add('ripple');

    // Add ripple to element
    element.appendChild(ripple);

    // Remove ripple after animation completes
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, CONFIG.ANIMATION.RIPPLE_DURATION);
  },

  /**
   * Initializes ripple effects for specified elements
   */
  init() {
    const rippleElements = document.querySelectorAll('.toggle-btn, .social');
    
    rippleElements.forEach(element => {
      element.addEventListener('click', (event) => {
        this.create(element, event);
      });
    });
  }
};

/**
 * Application initialization and main controller
 */
const App = {
  /**
   * Initializes the application
   */
  init() {
    try {
      // Initialize all modules
      ThemeManager.init();
      RippleEffect.init();
      
      // Handle in-app browser detection and modal
      if (InAppDetector.isRunningInApp()) {
        ModalManager.init();
        ModalManager.bindEvents();
        ModalManager.show();
      }

      console.log('Hi Studios application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Hi Studios application:', error);
    }
  },

  /**
   * Handles application cleanup if needed
   */
  destroy() {
    // Clean up any event listeners or resources if needed
    console.log('Hi Studios application cleaned up');
  }
};

/**
 * Initialize application when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

/**
 * Handle page unload for cleanup
 */
window.addEventListener('beforeunload', App.destroy); Safely gets a value from localStorage
   * @param {string} key - The storage key
   * @returns {string|null} The stored value or null
   */
  getStorageItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to read from localStorage: ${error.message}`);
      return null;
    }
  },

  /**
   * Safely sets a value in localStorage
   * @param {string} key - The storage key
   * @param {string} value - The value to store
   */
  setStorageItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to write to localStorage: ${error.message}`);
    }
  },

  /**
   * Checks if device prefers dark color scheme
   * @returns {boolean} True if dark mode is preferred
   */
  prefersDarkScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  /**
   * Debounces a function call
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

/**
 * In-app browser detection module
 */
const InAppDetector = {
  /**
   * Detects if the application is running inside an in-app browser
   * @returns {boolean} True if running in an in-app browser
   */
  isRunningInApp() {
    // Primary detection: Check for Telegram WebApp object
    if (window.Telegram?.WebApp) {
      console.log('Detection Method: Telegram WebApp Object');
      return true;
    }

    // Secondary detection: User Agent analysis
    const userAgent = navigator.userAgent || '';
    const inAppTokens = [
      'FBAN', 'FBAV',    // Facebook
      'Instagram',       // Instagram
      'WebView',         // Android WebView
      '(wv)',           // Android WebView indicator
      'Twitter',         // Twitter
      'WhatsApp',        // WhatsApp
      'WeChat'          // WeChat
    ];

    const isInApp = inAppTokens.some(token => userAgent.includes(token));
    
    if (isInApp) {
      console.log('Detection Method: User Agent Analysis');
      return true;
    }

    console.log('Standard browser detected');
    return false;
  },

  /**
   * Attempts to open current URL in external browser
   */
  openInExternalBrowser() {
    const userAgent = navigator.userAgent || '';
    const currentUrl = window.location.href;

    if (/Android/i.test(userAgent)) {
      // Android: Use Chrome intent with fallback
      const baseUrl = currentUrl.substring(8); // Remove 'https://'
      const intentUrl = `intent://${baseUrl}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
      
      try {
        window.location.href = intentUrl;
      } catch (error) {
        console.warn('Failed to open in external browser:', error);
        // Fallback: Try direct URL
        window.open(currentUrl, '_blank');
      }
    } else {
      // iOS and other platforms
      this.showBrowserGuidance();
    }
  },

  /**
   * Shows guidance for opening in external browser on iOS
   */
  showBrowserGuidance() {
    const message = 'در آیفون، لطفاً از منوی اشتراک‌گذاری (Share) گزینه "Open in Safari" را انتخاب کنید.';
    
    // Try to use a more user-friendly notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hi Studios', { body: message, icon: '/favicon.ico' });
    } else {
      alert(message);
    }
  }
};

/**
 * Modal management module
 */
const ModalManager = {
  elements: {},

  /**
    
