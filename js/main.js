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
        const navClose = header.querySelector(".nav-close");

        if (hamburger && navLinks) {
          hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("open");
          });

          if (navClose) {
            navClose.addEventListener("click", () => {
              navLinks.classList.remove("open");
            });
          }

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
      GALLERY LIGHTBOX (gallery-summer + gallery-grid)
    ========================= */
    // select both gallery types across pages so galerie.html images also work
    const galleryImages = document.querySelectorAll('.gallery-summer img, .gallery-grid img');

  if (galleryImages.length) {
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
      <div class="lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Image preview">
        <button class="lightbox-button close" type="button" aria-label="Close preview">×</button>
        <div class="lightbox-inner">
          <button class="lightbox-button prev" type="button" aria-label="Previous image">‹</button>
          <div class="lightbox-frame">
            <img class="lightbox-image" src="" alt="" />
            <div class="lightbox-caption" aria-live="polite">
              <span class="lightbox-counter"></span>
              <span class="lightbox-description"></span>
            </div>
          </div>
          <button class="lightbox-button next" type="button" aria-label="Next image">›</button>
        </div>
      </div>
    `;
    document.body.appendChild(lightboxOverlay);

    const backdrop = lightboxOverlay.querySelector('.lightbox-backdrop');
    const closeButton = lightboxOverlay.querySelector('.lightbox-button.close');
    const prevButton = lightboxOverlay.querySelector('.lightbox-button.prev');
    const nextButton = lightboxOverlay.querySelector('.lightbox-button.next');
    const lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
    const lightboxCounter = lightboxOverlay.querySelector('.lightbox-counter');
    const lightboxDescription = lightboxOverlay.querySelector('.lightbox-description');

    let currentGalleryGroup = [];
    let currentIndex = -1;
    let touchStartX = 0;
    let touchEndX = 0;

    const getGalleryGroup = img => {
      const container = img.closest('.gallery-summer, .gallery-grid');
      return container ? Array.from(container.querySelectorAll('img')) : [img];
    };

    const getImageSrc = img => img.dataset.full || img.src;

    const updateLightboxStatus = () => {
      prevButton.disabled = currentIndex <= 0;
      nextButton.disabled = currentIndex >= currentGalleryGroup.length - 1;
      lightboxCounter.textContent = `${currentIndex + 1} / ${currentGalleryGroup.length}`;
      lightboxDescription.textContent = currentGalleryGroup[currentIndex].alt || '';
    };

    const setLightboxImage = img => {
      const src = getImageSrc(img);
      lightboxImage.classList.remove('visible');
      lightboxImage.addEventListener('load', () => {
        lightboxImage.classList.add('visible');
      }, { once: true });
      lightboxImage.src = src;
      lightboxImage.alt = img.alt || '';
    };

    const openLightbox = img => {
      currentGalleryGroup = getGalleryGroup(img);
      currentIndex = currentGalleryGroup.indexOf(img);
      setLightboxImage(img);
      updateLightboxStatus();
      lightboxOverlay.classList.add('active');
      document.body.classList.add('zoom-active');
    };

    const closeLightbox = () => {
      lightboxOverlay.classList.remove('active');
      document.body.classList.remove('zoom-active');
      currentGalleryGroup = [];
      currentIndex = -1;
      updateLightboxStatus();
    };

    const showImageAt = index => {
      if (index < 0 || index >= currentGalleryGroup.length) return;
      currentIndex = index;
      setLightboxImage(currentGalleryGroup[currentIndex]);
      updateLightboxStatus();
    };

    galleryImages.forEach(img => {
      img.addEventListener('click', event => {
        openLightbox(img);
        event.stopPropagation();
      });

      if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0');
      img.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          img.click();
        }
      });
    });

    closeButton.addEventListener('click', event => {
      event.stopPropagation();
      closeLightbox();
    });

    prevButton.addEventListener('click', event => {
      event.stopPropagation();
      showImageAt(currentIndex - 1);
    });

    nextButton.addEventListener('click', event => {
      event.stopPropagation();
      showImageAt(currentIndex + 1);
    });

    backdrop.addEventListener('click', event => {
      if (event.target === backdrop) {
        closeLightbox();
      }
    });

    lightboxOverlay.addEventListener('touchstart', event => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    lightboxOverlay.addEventListener('touchend', event => {
      touchEndX = event.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      const minDistance = 40;
      if (Math.abs(delta) > minDistance) {
        if (delta > 0) {
          showImageAt(currentIndex - 1);
        } else {
          showImageAt(currentIndex + 1);
        }
      }
    });

    document.addEventListener('keydown', event => {
      if (!document.body.classList.contains('zoom-active')) return;

      if (event.key === 'Escape') {
        closeLightbox();
      }
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
