document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     COOKIE BANNER
  ========================= */
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const closeBtn = document.getElementById("close-cookies");

  const hideCookieBanner = () => {
    if (banner) {
      banner.style.display = "none";
      localStorage.setItem("cookiesAccepted", "true");
    }
  };

  if (banner) {
    if (localStorage.getItem("cookiesAccepted")) {
      banner.style.display = "none";
    } else {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          hideCookieBanner();
        }
      });
    }
  }

  if (banner && acceptBtn) {
    acceptBtn.addEventListener("click", hideCookieBanner);
  }

  if (banner && closeBtn) {
    closeBtn.addEventListener("click", hideCookieBanner);
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
    fetch("partials/header.html")
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
    fetch("partials/footer.html")
      .then(res => res.text())
      .then(html => {
        footer.innerHTML = html;
      })
      .catch(err => console.error("Footer load error:", err));
  }

 /* =========================
   SCROLL ANIMATIONS
========================= */

const animatedElements = document.querySelectorAll(
  '.program-card, .program-info, .image-box, .info-features li, .info-list li, .info-section'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
  if (entry.isIntersecting) {
  entry.target.classList.add('show');
  observer.unobserve(entry.target); // animates only once ✅
}

  });
}, {
  threshold: 0.15
});

animatedElements.forEach(el => {
  observer.observe(el);
});

    /* =========================
      GALLERY ZOOM (gallery-summer + gallery-grid)
    ========================= */
    // select both gallery types across pages so galerie.html images also work
    const galleryImages = document.querySelectorAll('.gallery-summer img, .gallery-grid img');

  if (galleryImages.length) {
    galleryImages.forEach(img => {
      img.addEventListener('click', event => {
        galleryImages.forEach(otherImg => {
          if (otherImg !== img) {
            otherImg.classList.remove('zoomed');
          }
        });

        const willZoom = !img.classList.contains('zoomed');
        img.classList.toggle('zoomed', willZoom);
        document.body.classList.toggle('zoom-active', willZoom);
        event.stopPropagation();
      });

      // ensure keyboard accessibility
      if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0');
      img.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          img.click();
        }
      });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.gallery-summer') && !event.target.closest('.gallery-grid')) {
        document.body.classList.remove('zoom-active');
        galleryImages.forEach(img => img.classList.remove('zoomed'));
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        document.body.classList.remove('zoom-active');
        galleryImages.forEach(img => img.classList.remove('zoomed'));
      }
    });
  }

});
