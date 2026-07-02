document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById("splash-screen");
    const splashLogo = document.getElementById("splash-logo-target");
    const destination = document.getElementById("nav-logo-destination");
    const placeholder = destination.querySelector(".logo-placeholder");
    const navbar = document.querySelector(".navbar");

    // محرك ميزة حركية الشعار (Logo Intro Motion Meter)
    setTimeout(() => {
        const logoRect = splashLogo.getBoundingClientRect();
        const placeholderRect = placeholder.getBoundingClientRect();

        // حساب المسافات لنقل الشعار بسلاسة متناهية من نصف الشاشة إلى مكانه في القائمة
        const deltaX = placeholderRect.left - logoRect.left;
        const deltaY = placeholderRect.top - logoRect.top;
        const scale = placeholderRect.width / logoRect.width;

        // إخفاء النص الترحيبي المصاحب للشعار أولاً
        document.querySelector(".splash-text").style.opacity = "0";

        splashLogo.classList.add("move-to-nav");
        splashLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

        setTimeout(() => {
            splashScreen.style.opacity = "0";
            navbar.classList.add("ready");
            
            // تسليم الشعار نهائياً ليدخل المكون الرئيسي في الشجرة بعد إزالة الـ Splash
            splashLogo.style.position = "static";
            splashLogo.style.transform = "none";
            splashLogo.style.width = "40px"; 
            splashLogo.style.height = "auto";
            placeholder.replaceWith(splashLogo);
            splashScreen.remove();
        }, 1200);

    }, 1800); // إبقاء الشعار كبيراً ومضيئاً لمدة 1.8 ثانية بمنتصف الشاشة

    // إدارة القائمة الجانبية للهواتف
    const mobileMenu = document.getElementById("mobileMenu");
    const navLinks = document.getElementById("navLinks");
    mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = mobileMenu.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
    });

    // مراقب التمرير لإضافة تأثير التعتيم الزجاجي المتقدم عند النزول
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // تأثيرات الظهور التدريجي للعناصر أثناء التمرير العشوائي لأسفل
    const revealElements = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // تشغيل العدادات الإحصائية الرقمية عند الوصول لها
    const counters = document.querySelectorAll(".counter");
    const counterBox = document.querySelector(".counters-container");
    const startCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target"));
            const duration = 2000;
            let start = null;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const current = Math.min(Math.floor((progress / duration) * target), target);
                counter.innerText = current;
                if (current < target) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    };
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    if (counterBox) counterObserver.observe(counterBox);

    // نظام تسجيل الإعجاب والمشاركة المحلي التفاعلي الذكي بقاعدة البيانات المؤقتة
    document.querySelectorAll(".achievement-card").forEach(card => {
        const id = card.getAttribute("data-id");
        const likeBtn = card.querySelector(".btn-like");
        const likeIcon = likeBtn.querySelector("i");
        const likeCount = likeBtn.querySelector(".like-count");
        
        let likes = parseInt(localStorage.getItem(`${id}_l`)) || Math.floor(Math.random() * 15) + 8;
        let isLiked = localStorage.getItem(`${id}_i`) === "y";
        likeCount.innerText = likes;
        if (isLiked) likeIcon.className = "fa-solid fa-heart";

        likeBtn.addEventListener("click", () => {
            if (!isLiked) { likes++; isLiked = true; likeIcon.className = "fa-solid fa-heart"; }
            else { likes--; isLiked = false; likeIcon.className = "fa-regular fa-heart"; }
            likeCount.innerText = likes;
            localStorage.setItem(`${id}_l`, likes);
            localStorage.setItem(`${id}_i`, isLiked ? "y" : "n");
        });
    });

    document.querySelectorAll(".btn-share").forEach(btn => {
        btn.addEventListener("click", async () => {
            const title = btn.getAttribute("data-title");
            const text = btn.getAttribute("data-text");
            if (navigator.share) {
                try { await navigator.share({ title, text, url: window.location.href }); } catch {}
            } else {
                navigator.clipboard.writeText(`${title} - ${text}`);
                alert("Lien copié dans le presse-papiers!");
            }
        });
    });
});
