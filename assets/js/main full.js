/**
 * KROFFT - Meble na Wymiar
 * Main JavaScript Engine (Vanilla JS, No external dependencies)
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initContactModal();
  initHeroSlider();
  initNumberCounters();
  initLanguageSelector();
});

/* ----------------------------------------------------
 * 1. Navbar Scrolled State & Active Links
 * ---------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector("header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Highlight current page link
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkUrl = new URL(link.getAttribute("href"), window.location.href);
    const linkPath = linkUrl.pathname.replace(/\/+$/, "") || "/";
    if (!linkUrl.hash && linkPath === currentPath) {
      link.classList.add(
        "text-brand-gold",
        "border-b",
        "border-brand-gold",
        "pb-1",
      );
      link.classList.remove("text-gray-300");
    }
  });
}

/* ----------------------------------------------------
 * 2. Mobile Menu Drawer
 * ---------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (!toggleBtn || !menu) return;

  const openMenu = () => {
    menu.classList.remove("closed");
    menu.classList.add("open");
    document.body.style.overflow = "hidden";
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.setAttribute("aria-label", "Zamknij menu");
  };

  const closeMenu = () => {
    menu.classList.remove("open");
    menu.classList.add("closed");
    document.body.style.overflow = "";
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-label", "Otwórz menu");
  };

  toggleBtn.addEventListener("click", () => {
    if (menu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking mobile links
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      closeMenu();
    }
  });
}

/* ----------------------------------------------------
 * 3. Scroll Reveal Animation (Intersection Observer)
 * ---------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-item");
  if (!revealElements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("revealed"));
  }
}

/* ----------------------------------------------------
 * 4. Contact Modal ("Porozmawiajmy")
 * ---------------------------------------------------- */
function initContactModal() {
  const modal = document.getElementById("contact-dialog");
  const openButtons = document.querySelectorAll("[data-open-contact-modal]");
  const closeButtons = document.querySelectorAll("[data-close-contact-modal]");

  if (!modal) return;

  openButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof modal.showModal === "function") {
        modal.showModal();
        document.body.style.overflow = "hidden";
      } else {
        modal.setAttribute("open", "");
      }
    });
  });

  const closeModal = () => {
    if (typeof modal.close === "function") {
      modal.close();
      document.body.style.overflow = "";
    } else {
      modal.removeAttribute("open");
    }
  };

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  // Click outside dialog to close
  modal.addEventListener("click", (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeModal();
    }
  });

  modal.addEventListener("close", () => {
    document.body.style.overflow = "";
  });

  // Handle contact form submission
  const form = document.getElementById("contact-form");
  const formSuccess = document.getElementById("contact-form-success");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Wysyłanie...
        `;
      }

      setTimeout(() => {
        if (formSuccess) {
          form.classList.add("hidden");
          formSuccess.classList.remove("hidden");
        }
      }, 700);
    });
  }
}

/* ----------------------------------------------------
 * 5. Hero Carousel (01 / 04)
 * ---------------------------------------------------- */
function initHeroSlider() {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const counterCurrent = document.getElementById("hero-counter-current");
  const btnPrev = document.getElementById("hero-prev");
  const btnNext = document.getElementById("hero-next");

  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;

  const updateSlide = (newIndex) => {
    slides[currentIndex].classList.remove("opacity-100", "z-10");
    slides[currentIndex].classList.add("opacity-0", "z-0");

    currentIndex = (newIndex + slides.length) % slides.length;

    slides[currentIndex].classList.remove("opacity-0", "z-0");
    slides[currentIndex].classList.add("opacity-100", "z-10");

    if (counterCurrent) {
      counterCurrent.textContent = String(currentIndex + 1).padStart(2, "0");
    }
  };

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      resetTimer();
      updateSlide(currentIndex - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      resetTimer();
      updateSlide(currentIndex + 1);
    });
  }

  const startTimer = () => {
    timer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 6000);
  };

  const resetTimer = () => {
    clearInterval(timer);
    startTimer();
  };

  startTimer();

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", () => startTimer());
}

/* ----------------------------------------------------
 * 6. Number Counter Animation
 * ---------------------------------------------------- */
function initNumberCounters() {
  const counters = document.querySelectorAll(".counter-animate");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(
            entry.target.getAttribute("data-target") || "0",
            10,
          );
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * target);
            entry.target.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              entry.target.textContent = target;
            }
          };

          requestAnimationFrame(update);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
}

/* ----------------------------------------------------
 * 7. Language Selector
 * ---------------------------------------------------- */
function initLanguageSelector() {
  const langToggle = document.getElementById("lang-toggle");
  const langMenu = document.getElementById("lang-menu");

  if (!langToggle || !langMenu) return;

  langToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    langMenu.classList.add("hidden");
  });
}
