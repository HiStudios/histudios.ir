function detectInApp(userAgent) {
  const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger)/i;
  return inAppTokens.test(userAgent);
}

export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // فقط در صورتی که مرورگر داخلی باشد، منطق را اجرا کن
  if (detectInApp(userAgent)) {
    // از لوپ بی‌نهایت جلوگیری کن
    if (url.pathname.startsWith('/openpage')) {
      return next();
    }
    
    // کاربر را به صفحه openpage منتقل کن
    const originalUrl = url.href;
    const interstitialUrl = new URL('/openpage/', url.origin);
    interstitialUrl.searchParams.set('destination', originalUrl);
    return context.rewrite(interstitialUrl.href);
  }

  // برای تمام مرورگرهای عادی، هیچ کاری انجام نده و اجازه بده درخواست عبور کند
  return next();
}
