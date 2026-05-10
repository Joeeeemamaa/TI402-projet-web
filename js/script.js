    /* ==========================================================
   EFREI Computer Science Department — script.js
   Global interactive features for all pages
   ========================================================== */

"use strict";

/* ==========================================================
   1. MOBILE NAV TOGGLE
   ========================================================== */

(function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav    = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close nav when a link is clicked (single-page nav feel)
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close nav on outside click
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();


/* ==========================================================
   2. ACTIVE NAV LINK — highlights the current page
   ========================================================== */

(function setActiveNavLink() {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(link => {
    const linkFile = link.getAttribute("href").split("/").pop();
    if (linkFile === currentFile) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
})();


/* ==========================================================
   3. SCROLL REVEAL ANIMATION
   Cards and sections fade + slide up when entering the viewport
   ========================================================== */

(function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".program-card, .intro-card, .overview-section, .faculty-card, .opportunity-card, .skill-card"
  );
  if (!targets.length) return;

  // Set initial hidden state
  targets.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 400ms ease ${i * 60}ms, transform 400ms ease ${i * 60}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


/* ==========================================================
   4. HOME PAGE CAROUSEL / HERO SLIDER
   Expects: .carousel, .carousel-track, .carousel-slide,
            .carousel-btn-prev, .carousel-btn-next, .carousel-dots
   ========================================================== */

(function initCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const track   = carousel.querySelector(".carousel-track");
  const slides  = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prevBtn = carousel.querySelector(".carousel-btn-prev");
  const nextBtn = carousel.querySelector(".carousel-btn-next");
  const dotsContainer = carousel.querySelector(".carousel-dots");

  if (!track || !slides.length) return;

  let current   = 0;
  let autoTimer = null;

  // Build dot indicators
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.classList.toggle("active", i === 0);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(index) {
    slides[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }

    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  slides[0]?.classList.add("active");
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

  // Swipe support for mobile
  let touchStartX = 0;
  carousel.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener("touchend",   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Pause on hover
  carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
  carousel.addEventListener("mouseleave", resetAuto);

  resetAuto();
})();


/* ==========================================================
   5. FORM VALIDATION — contact / about page
   Expects a <form class="efrei-form"> with inputs carrying
   data-required and data-type attributes
   ========================================================== */

(function initFormValidation() {
  const form = document.querySelector(".efrei-form");
  if (!form) return;

  const rules = {
    text:  { test: v => v.trim().length >= 2,
             msg: "This field must contain at least 2 characters." },
    email: { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
             msg: "Please enter a valid email address." },
    tel:   { test: v => /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()),
             msg: "Please enter a valid phone number." },
    textarea: { test: v => v.trim().length >= 10,
                msg: "Please write at least 10 characters." },
  };

  function getError(field) {
    return form.querySelector(`[data-error-for="${field.name}"]`);
  }

  function validateField(field) {
    const type  = field.dataset.type || field.type || "text";
    const rule  = rules[type];
    const error = getError(field);
    if (!rule || !field.dataset.required) return true;

    const valid = rule.test(field.value);
    field.classList.toggle("input-error", !valid);
    field.setAttribute("aria-invalid", !valid);
    if (error) {
      error.textContent = valid ? "" : rule.msg;
      error.classList.toggle("visible", !valid);
    }
    return valid;
  }

  // Live validation on blur
  form.querySelectorAll("[data-required]").forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("input-error")) validateField(field);
    });
  });

  // Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = Array.from(form.querySelectorAll("[data-required]"));
    const allValid = fields.map(validateField).every(Boolean);

    if (allValid) {
      showFormSuccess(form);
    } else {
      // Focus first invalid field
      const firstInvalid = form.querySelector(".input-error");
      if (firstInvalid) firstInvalid.focus();
    }
  });

  function showFormSuccess(form) {
    form.innerHTML = `
      <div class="form-success" role="alert" aria-live="polite">
        <span class="form-success-icon">▶</span>
        <h3>Message sent!</h3>
        <p>Thank you for contacting the EFREI Computer Science Department.
           We will get back to you shortly.</p>
      </div>`;
  }
})();


/* ==========================================================
   6. TABS — for Skills / Background page
   Expects: .tabs-nav with [data-tab] buttons,
            .tab-panel with matching [data-panel] ids
   ========================================================== */

(function initTabs() {
  const tabsNavs = document.querySelectorAll(".tabs-nav");
  if (!tabsNavs.length) return;

  tabsNavs.forEach(nav => {
    const buttons = Array.from(nav.querySelectorAll("[data-tab]"));
    const container = nav.closest(".tabs-container") || document;
    const panels = Array.from(container.querySelectorAll(".tab-panel"));

    function activateTab(btn) {
      const target = btn.dataset.tab;
      buttons.forEach(b => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn);
      });
      panels.forEach(p => {
        const active = p.dataset.panel === target;
        p.classList.toggle("active", active);
        p.hidden = !active;
      });
    }

    // Keyboard navigation: arrow keys
    nav.addEventListener("keydown", (e) => {
      const idx = buttons.indexOf(document.activeElement);
      if (idx === -1) return;
      if (e.key === "ArrowRight") buttons[(idx + 1) % buttons.length].focus();
      if (e.key === "ArrowLeft")  buttons[(idx - 1 + buttons.length) % buttons.length].focus();
    });

    buttons.forEach(btn => {
      btn.addEventListener("click", () => activateTab(btn));
    });

    // Activate first tab by default
    if (buttons[0]) activateTab(buttons[0]);
  });
})();


/* ==========================================================
   7. ACCORDION — expandable content blocks (courses details)
   Expects: .accordion with .accordion-item children
            each containing .accordion-trigger and .accordion-panel
   ========================================================== */

(function initAccordion() {
  const accordions = document.querySelectorAll(".accordion");
  if (!accordions.length) return;

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll(".accordion-item");

    items.forEach(item => {
      const trigger = item.querySelector(".accordion-trigger");
      const panel   = item.querySelector(".accordion-panel");
      if (!trigger || !panel) return;

      // Set initial ARIA state
      const panelId = `panel-${Math.random().toString(36).slice(2, 7)}`;
      panel.id = panelId;
      trigger.setAttribute("aria-controls", panelId);
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = true;

      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        // Close all others in this accordion
        items.forEach(other => {
          if (other !== item) {
            other.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
            const otherPanel = other.querySelector(".accordion-panel");
            if (otherPanel) otherPanel.hidden = true;
            other.classList.remove("is-open");
          }
        });

        trigger.setAttribute("aria-expanded", !isOpen);
        panel.hidden = isOpen;
        item.classList.toggle("is-open", !isOpen);
      });
    });
  });
})();


/* ==========================================================
   8. SMOOTH SCROLL for anchor links
   ========================================================== */

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
    });
  });
})();


/* ==========================================================
   9. BACK TO TOP BUTTON
   Expects: <button class="back-to-top" aria-label="Back to top">
   ========================================================== */

(function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


/* ==========================================================
   10. OFFICE HOURS TABLE — Faculty page
   Dynamically highlights the current day's column
   ========================================================== */

(function highlightCurrentDay() {
  const table = document.querySelector(".office-hours-table");
  if (!table) return;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];

  table.querySelectorAll("th").forEach((th, i) => {
    if (th.textContent.trim() === today) {
      th.classList.add("today");
      table.querySelectorAll(`tr td:nth-child(${i + 1})`).forEach(td => {
        td.classList.add("today");
      });
    }
  });
})();


/* ==========================================================
   11. DYNAMIC YEAR IN FOOTER
   ========================================================== */

(function setFooterYear() {
  const yearEl = document.querySelector(".footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();