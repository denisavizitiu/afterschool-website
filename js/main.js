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
     LOAD HEADER
     + INIT MOBILE NAV
  ========================= */
  const header = document.getElementById("header");

  if (header) {
    fetch("/partials/header.html")
      .then(res => res.text())
      .then(html => {
        header.innerHTML = html;

        // ✅ NOW the elements exist
        const hamburger = header.querySelector(".hamburger");
        const navLinks = header.querySelector(".nav-links");

        if (hamburger && navLinks) {
          hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("open");
          });

          // Close menu when a link is clicked
          navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
              navLinks.classList.remove("open");
            });
          });
        }
      })
      .catch(err => console.error("Header load error:", err));
  }

  /* =========================
     LOAD FOOTER
  ========================= */
  const footer = document.getElementById("footer");

  if (footer) {
    fetch("/partials/footer.html")
      .then(res => res.text())
      .then(html => {
        footer.innerHTML = html;
      })
      .catch(err => console.error("Footer load error:", err));
  }

});
