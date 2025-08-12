// تابع تشخیص مرورگر داخلی اپلیکیشن‌ها
function detectInApp(userAgent) {
  const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger)/i;
  return inAppTokens.test(userAgent);
}

export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // --- بخش اول: منطق برای مرورگرهای داخلی ---
  if (detectInApp(userAgent)) {
    // اگر از قبل در صفحه openpage هستیم، کاری نکن تا از لوپ بی‌نهایت جلوگیری شود
    if (url.pathname.startsWith('/openpage')) {
      return next();
    }
    
    // در غیر این صورت، کاربر را به صفحه openpage منتقل کن و آدرس اصلی را به عنوان پارامتر بفرست
    const originalUrl = url.href;
    const interstitialUrl = new URL('/openpage/', url.origin);
    interstitialUrl.searchParams.set('destination', originalUrl);
    return context.rewrite(interstitialUrl.href);
  }

  // --- بخش دوم: منطق برای مرورگرهای عادی ---

  // اگر کاربر با مرورگر عادی به صفحه اصلی (/) آمده، او را به /home منتقل کن
  if (url.pathname === '/') {
    const homeUrl = new URL('/home/', url.origin);
    return Response.redirect(homeUrl.href, 302);
  }

  // برای تمام صفحات دیگر در مرورگر عادی، اجازه بده صفحه بارگذاری شود
  return next();
}
