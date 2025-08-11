(function() {
    // --- Configuration ---
    // آدرس مقصد نهایی که کاربران به آن هدایت می‌شوند.
    const destinationURL = "https://histudios.ir/home/";

    // --- Logic ---
    // با یک عبارت باقاعده (Regex) بررسی می‌کنیم که آیا کاربر در مرورگر داخلی اپلیکیشن‌هاست یا نه.
    const isInAppBrowser = /FBAN|FBAV|Instagram|Telegram|Twitter/i.test(navigator.userAgent);
    
    // اگر کاربر در مرورگر داخلی *نبود*، بلافاصله او را به صورت عادی به مقصد هدایت می‌کنیم.
    if (!isInAppBrowser) {
        window.location.href = destinationURL;
        return;
    }

    // اگر کاربر در مرورگر داخلی بود، تلاش می‌کنیم با استفاده از ترفند Intent اندروید، مرورگر پیش‌فرض را باز کنیم.
    window.location.href = "intent://" + destinationURL.replace("https://", "") + "#Intent;scheme=https;end";

    // به عنوان یک راه‌حل جایگزین، یک تایمر تنظیم می‌کنیم.
    // اگر ترفند Intent بعد از ۱.۵ ثانیه کار نکرد (مثلاً در iOS یا اپ‌های محدودکننده)،
    // کاربر را به صورت عادی در همان مرورگر داخلی به مقصد هدایت می‌کنیم تا معطل نماند.
    setTimeout(function() {
        window.location.href = destinationURL;
    }, 1500);
})();
