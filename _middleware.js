function detectInApp(userAgent) {
  const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger)/i;
  return inAppTokens.test(userAgent);
}

export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // لیست مسیرهایی که نباید بررسی شوند
  const EXCLUDED_PATHS = [
    '/openpage',
    '/open',
    '/home',
    '/assets'
  ];
  
  // اگر مسیر در لیست استثناهاست، عبور بده
  if (EXCLUDED_PATHS.some(path => url.pathname.startsWith(path))) {
    return next();
  }

  // اگر مرورگر داخلی است
  if (detectInApp(userAgent)) {
    const originalUrl = url.href;
    const interstitialUrl = new URL('/openpage/index.html', url.origin);
    interstitialUrl.searchParams.set('destination', originalUrl);
    return context.rewrite(interstitialUrl.href);
  }

  return next();
}
