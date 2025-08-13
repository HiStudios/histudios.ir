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
   * Safely gets a value from localStorage
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
