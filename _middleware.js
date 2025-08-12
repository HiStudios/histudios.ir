// تابع تشخیص مرورگر داخلی را می‌توانیم مستقیماً اینجا قرار دهیم
function detectInApp(userAgent) {
  const inAppTokens = /(FBAN|FBAV|Instagram|Telegram|Twitter|Line|WhatsApp|WebView|wv|FB_IAB|MicroMessenger)/i;
  return inAppTokens.test(userAgent);
}

export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get("user-agent") || "";

  // اگر در مرورگر داخلی نیست، به سادگی به درخواست بعدی برو
  if (!detectInApp(userAgent)) {
    return next();
  }
  
  // اگر کاربر از قبل در صفحه openpage است، کاری انجام نده تا از لوپ جلوگیری شود
  const url = new URL(request.url);
  if (url.pathname.startsWith('/openpage')) {
    return next();
  }

  // کاربر در مرورگر داخلی است. او را به صفحه openpage هدایت (rewrite) می‌کنیم
  // و URL اصلی که می‌خواست ببیند را به عنوان پارامتر به آن می‌دهیم.
  const originalUrl = url.href;
  const interstitialUrl = new URL('/openpage/', url.origin); // به صفحه openpage در همین دامنه برو
  interstitialUrl.searchParams.set('destination', originalUrl);

  // context.rewrite به صورت داخلی محتوای صفحه openpage را نمایش می‌دهد بدون تغییر URL در مرورگر کاربر
  return context.rewrite(interstitialUrl.href);
}
