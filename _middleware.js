// فایل: _middleware.js (برای تست)
export async function onRequest(context) {
  // پاسخ اصلی صفحه را بگیر
  const response = await context.next();

  // یک هدر سفارشی به آن اضافه کن
  response.headers.set('x-middleware-test', 'middleware-is-active');

  // پاسخ تغییر یافته را برگردان
  return response;
}
 
