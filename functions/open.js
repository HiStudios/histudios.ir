// functions/open.js
export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const targetParam = url.searchParams.get("u");
    if (!targetParam) {
      return new Response("❌ پارامتر u الزامی است.", { status: 400 });
    }

    let target;
    try {
      target = new URL(targetParam);
    } catch {
      return new Response("❌ آدرس نامعتبر.", { status: 400 });
    }

    // ✅ لیست سفید دامنه‌ها
    const WHITELIST = [
      "histudios.ir",
      "www.histudios.ir",
      "cdn.histudios.ir"
    ];

    if (!WHITELIST.includes(target.hostname.toLowerCase())) {
      return new Response("❌ مقصد در لیست سفید نیست.", { status: 400 });
    }

    // ✅ Redirect امن
    return Response.redirect(target.toString(), 302);
  } catch (err) {
    return new Response("خطای سرور", { status: 500 });
  }
}
