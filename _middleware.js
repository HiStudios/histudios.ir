function detectInApp(userAgent) {
  const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger)/i;
  return inAppTokens.test(userAgent);
}

export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // لیست مسیرهای استثنا
  const EXCLUDED_PATHS = [
    '/openpage',
    '/open',
    '/home',
    '/assets',
    '/sitemap.xml',
    '/favicon.ico'
  ];

  // اگر مسیر در لیست استثناهاست، عبور بده
  if (EXCLUDED_PATHS.some(path => url.pathname.startsWith(path))) {
    return next();
  }

  // اگر مرورگر داخلی است
  if (detectInApp(userAgent)) {
    // برای روت، مقصد را به '/' تنظیم کن
    const originalUrl = url.pathname === '/' ? '/' : url.href;
    
    // ساخت URL صفحه انتقال
    const interstitialUrl = new URL('/openpage/index.html', url.origin);
    interstitialUrl.searchParams.set('destination', originalUrl);
    
    return Response.redirect(interstitialUrl.href, 302);
  }

  // برای مرورگرهای عادی، روت را به /home ریدایرکت کن
  if (url.pathname === '/') {
    return Response.redirect(new URL('/home/', url.origin).href, 302);
  }

  return next();
} 
