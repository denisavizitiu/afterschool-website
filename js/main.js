/* =========================
   LOAD CMS CONTENT
========================= */

// Homepage content
fetch("/content/home.json")
  .then(res => res.json())
  .then(data => {
    const heroTitle = document.querySelector(".hero h1");
    const heroSubtitle = document.querySelector(".hero p");
    const ctaButton = document.querySelector(".cta .btn");

    if (heroTitle) heroTitle.textContent = data.hero_title;
    if (heroSubtitle) heroSubtitle.textContent = data.hero_subtitle;
    if (ctaButton) ctaButton.textContent = data.cta_text;
  });

// Contact page content
fetch("/content/contact.json")
  .then(res => res.json())
  .then(data => {
    const emailEl = document.querySelector(".contact-email");
    const phoneEl = document.querySelector(".contact-phone");

    if (emailEl) emailEl.textContent = data.email;
    if (phoneEl) phoneEl.textContent = data.phone;
  });
  
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     COOKIE BANNER
  ========================= */
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  if (banner && acceptBtn) {
    if (localStorage.getItem("cookiesAccepted")) {
      banner.style.display = "none";
    }

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      banner.style.display = "none";
    });
  }

  /* =========================
     GO TO TOP BUTTON
  ========================= */
  const goTopBtn = document.getElementById("goTopBtn");

  if (goTopBtn) {
    window.addEventListener("scroll", () => {
      goTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
    });

    goTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* =========================
     LOAD HEADER & FOOTER
  ========================= */
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  if (header) {
    fetch("/partials/header.html")
      .then(res => res.text())
      .then(data => {
        header.innerHTML = data;
      })
      .catch(err => console.error("Header load error:", err));
  }

  if (footer) {
    fetch("/partials/footer.html")
      .then(res => res.text())
      .then(data => {
        footer.innerHTML = data;
      })
      .catch(err => console.error("Footer load error:", err));
  }
});
