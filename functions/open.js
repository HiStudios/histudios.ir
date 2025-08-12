export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const targetParam = url.searchParams.get("u");
    
    // اگر پارامتر u وجود ندارد
    if (!targetParam) {
      return Response.redirect(new URL('/home/', context.request.url).href, 302);
    }

    let target;
    try {
      // ساخت URL از پارامتر
      target = new URL(targetParam);
    } catch {
      return Response.redirect(new URL('/home/', context.request.url).href, 302);
    }

    // لیست سفید دامنه‌ها
    const WHITELIST = [
      "histudios.ir",
      "www.histudios.ir",
      "cdn.histudios.ir",
      "*.histudios.ir"
    ];

    const hostname = target.hostname.toLowerCase();
    const isAllowed = WHITELIST.some(domain => {
      if (domain.startsWith('*.')) {
        return hostname.endsWith(domain.slice(2));
      }
      return hostname === domain;
    });

    if (!isAllowed) {
      return Response.redirect(new URL('/home/', context.request.url).href, 302);
    }

    // ریدایرکت امن
    return Response.redirect(target.toString(), 302);
  } catch (err) {
    return Response.redirect(new URL('/home/', context.request.url).href, 302);
  }
} 
