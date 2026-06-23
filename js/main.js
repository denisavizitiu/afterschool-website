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
    const lightboxControls = document.createElement('div');
    lightboxControls.className = 'lightbox-controls';
    lightboxControls.innerHTML = `
      <button class="lightbox-button prev" type="button" aria-label="Previous image">‹</button>
      <button class="lightbox-button next" type="button" aria-label="Next image">›</button>
    `;
    document.body.appendChild(lightboxControls);

    const prevButton = lightboxControls.querySelector('.prev');
    const nextButton = lightboxControls.querySelector('.next');

    let currentZoomedImage = null;
    let currentGalleryGroup = [];
    let currentIndex = -1;

    const getGalleryGroup = img => {
      const container = img.closest('.gallery-summer, .gallery-grid');
      return container ? Array.from(container.querySelectorAll('img')) : [img];
    };

    const updateLightboxControls = () => {
      if (!currentZoomedImage) return;
      prevButton.disabled = currentIndex <= 0;
      nextButton.disabled = currentIndex >= currentGalleryGroup.length - 1;
    };

    const closeZoom = () => {
      document.body.classList.remove('zoom-active');
      galleryImages.forEach(img => img.classList.remove('zoomed'));
      currentZoomedImage = null;
      currentGalleryGroup = [];
      currentIndex = -1;
      updateLightboxControls();
    };

    const showImageAt = index => {
      if (index < 0 || index >= currentGalleryGroup.length) return;
      if (currentZoomedImage) currentZoomedImage.classList.remove('zoomed');
      currentZoomedImage = currentGalleryGroup[index];
      currentZoomedImage.classList.add('zoomed');
      currentIndex = index;
      document.body.classList.add('zoom-active');
      updateLightboxControls();
    };

    const openZoom = img => {
      currentGalleryGroup = getGalleryGroup(img);
      currentIndex = currentGalleryGroup.indexOf(img);
      currentZoomedImage = img;
      document.body.classList.add('zoom-active');
      galleryImages.forEach(otherImg => otherImg.classList.remove('zoomed'));
      img.classList.add('zoomed');
      updateLightboxControls();
    };

    galleryImages.forEach(img => {
      img.addEventListener('click', event => {
        const willZoom = !img.classList.contains('zoomed');

        if (willZoom) {
          openZoom(img);
        } else {
          closeZoom();
        }

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

    prevButton.addEventListener('click', event => {
      event.stopPropagation();
      showImageAt(currentIndex - 1);
    });

    nextButton.addEventListener('click', event => {
      event.stopPropagation();
      showImageAt(currentIndex + 1);
    });

    document.addEventListener('click', event => {
      if (event.target.closest('.lightbox-controls')) return;
      if (!event.target.closest('.gallery-summer') && !event.target.closest('.gallery-grid')) {
        closeZoom();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeZoom();
      }

      if (!document.body.classList.contains('zoom-active')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showImageAt(currentIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showImageAt(currentIndex + 1);
      }
    });
  }

});
