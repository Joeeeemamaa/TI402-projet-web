/**
 * ===========================================================
 * EFREI Computer Science Department — script.js
 * "Because even code deserves a little personality"
 * ===========================================================
 * 
 * This file holds all the interactive magic that makes our
 * website feel alive. From the hamburger menu that confuses 
 * everyone's grandma, to the smooth scroll that makes 
 * navigation feel like butter.
 * 
 * All functions are wrapped in IIFEs (Immediately Invoked 
 * Function Expressions) to keep our variables local and 
 * prevent them from cluttering the global namespace. 
 * Think of it as tidying up after yourself — mom would be proud.
 */

"use strict";


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 0: CONSOLE WELCOME MESSAGE — ASCII art easter egg
 * ═══════════════════════════════════════════════════════════
 * 
 * A fun ASCII art welcome message for developers who open
 * the browser console. Because debugging should be delightful.
 */

(function initConsoleWelcome() {
  console.log(`
%c    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║   ████████╗███████╗███╗   ███╗██████╗ ██╗███╗   ██╗███████╗   ║
    ║   ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║████╗  ██║██╔════╝   ║
    ║      ██║   █████╗  ██╔████╔██║██████╔╝██║██╔██╗ ██║█████╗     ║
    ║      ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║██║╚██╗██║██╔══╝     ║
    ║      ██║   ███████╗██║ ╚═╝ ██║██║     ██║██║ ╚████║███████╗   ║
    ║      ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝   ║
    ║                     WEB TEAM                       ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝

%c🎓 Welcome to the EFREI Computer Science Department website!
🔍 Found a bug? We've already fixed it... in our dreams.
💡 Pro tip: Press the ? key to discover keyboard shortcuts!

Built with ☕, determination, and just enough sleep deprivation.
  `,
    'color: #81ECEC; font-weight: bold; font-size: 14px;',
    'color: #FDCB6E; font-size: 12px;',
    'color: #81ECEC; font-size: 11px;'
  );
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 1: MOBILE NAVIGATION TOGGLE
 * ═══════════════════════════════════════════════════════════
 * 
 * The hamburger menu — humanity's most confusing icon.
 * This function makes it work: tap it, nav appears, tap again, 
 * nav hides. We also close the menu when clicking a link 
 * (so you don't have to close it manually afterward) and 
 * when clicking anywhere outside the nav (because nobody 
 * likes a menu that stays open like a chatty neighbor).
 */

(function initMobileNav() {
  // Grab the toggle button and the nav itself
  // If either is missing (unlikely but possible), we bail out early
  const toggleButton = document.querySelector(".nav-toggle");
  const navigationMenu = document.querySelector(".main-nav");
  
  if (!toggleButton || !navigationMenu) return;

  // Toggle the nav open/closed and update aria-expanded
  // so screen readers know what's happening
  toggleButton.addEventListener("click", () => {
    const isMenuOpen = navigationMenu.classList.toggle("is-open");
    toggleButton.setAttribute("aria-expanded", isMenuOpen);
  });

  // Close the nav when a link is clicked — one less thing to annoy users
  navigationMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigationMenu.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
    });
  });

  // If the user clicks somewhere random on the page (not the nav or toggle),
  // we close the menu because apparently we read minds
  document.addEventListener("click", (clickEvent) => {
    const clickedInsideNav = navigationMenu.contains(clickEvent.target);
    const clickedToggleBtn = toggleButton.contains(clickEvent.target);
    
    if (!clickedInsideNav && !clickedToggleBtn) {
      navigationMenu.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
    }
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 2: ACTIVE NAV LINK HIGHLIGHTER
 * ═══════════════════════════════════════════════════════════
 * 
 * This function looks at the current page URL and automatically
 * highlights the nav link that matches. Because we're nice
 * and we want users to always know where they are.
 * 
 * It uses aria-current="page" for accessibility — because
 * screen readers need love too.
 */

(function highlightCurrentPageLink() {
  // Get just the filename from the current URL, defaulting to index.html
  // This way we avoid breaking if someone bookmarks a deep link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
  document.querySelectorAll(".main-nav a").forEach(link => {
    const linkDestination = link.getAttribute("href").split("/").pop();
    
    if (linkDestination === currentPage) {
      // This is our current page — mark it so screen readers know
      link.setAttribute("aria-current", "page");
    } else {
      // Remove the marker from any other links (belt and suspenders approach)
      link.removeAttribute("aria-current");
    }
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 3: SCROLL REVEAL ANIMATIONS
 * ═══════════════════════════════════════════════════════════
 * 
 * Remember when websites just appeared? No? Yeah, neither do we.
 * This function watches for elements entering the viewport and
 * gives them a subtle fade-in + slide-up animation. It's like
 * a red carpet entrance for content cards.
 * 
 * The staggered delay (i * 60ms) creates a cascade effect
 * when multiple cards are visible — very elegant, very impressive,
 * definitely not necessary but we did it anyway.
 */

(function initScrollReveal() {
  // Find all elements that deserve a dramatic entrance
  const animatedElements = document.querySelectorAll(
    ".program-card, .intro-card, .overview-section, .faculty-card, .opportunity-card, .skill-card, .area-group, .career-item, .staff-member"
  );
  
  if (!animatedElements.length) return;

  // IntersectionObserver is like a spy — it watches and reports
  // when elements enter the viewport. Much better than scroll events.
  const visibilityWatcher = new IntersectionObserver((observedEntries) => {
    observedEntries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the visible class to trigger CSS animation
        entry.target.classList.add("visible");
        // We only want this to happen once — no encores
        visibilityWatcher.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }); // Trigger when 12% of the element is visible

  // Start watching all the elements that want their moment
  animatedElements.forEach(element => visibilityWatcher.observe(element));
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 4: HERO CAROUSEL / SLIDER
 * ═══════════════════════════════════════════════════════════
 * 
 * The showstopper. The headline act. The thing that makes
 * visitors think "wow, this website is actually alive!"
 * 
 * This bad boy handles:
 * - Auto-advancing slides (every 5 seconds, unless you're hovering)
 * - Manual prev/next buttons (for when auto-play isn't fast enough)
 * - Dot indicators (so users know how many slides there are)
 * - Touch/swipe support for mobile users (because we care about everyone)
 * 
 * Requirements: .carousel, .carousel-track, .carousel-slide,
 *               .carousel-btn-prev, .carousel-btn-next, .carousel-dots
 */

(function initCarousel() {
  const carouselContainer = document.querySelector(".carousel");
  if (!carouselContainer) return;

  // Grab all the pieces we need for the carousel to function
  const trackElement = carouselContainer.querySelector(".carousel-track");
  const allSlides = Array.from(carouselContainer.querySelectorAll(".carousel-slide"));
  const previousButton = carouselContainer.querySelector(".carousel-btn-prev");
  const nextButton = carouselContainer.querySelector(".carousel-btn-next");
  const dotsContainer = carouselContainer.querySelector(".carousel-dots");

  if (!trackElement || !allSlides.length) return;

  // State variables — keeping track of where we are in the carousel
  let currentSlideIndex = 0;
  let autoPlayInterval = null;

  // Build the dot indicators dynamically
  // (because hardcoding dots is so 2010)
  if (dotsContainer) {
    allSlides.forEach((_, slideNumber) => {
      const dotButton = document.createElement("button");
      dotButton.setAttribute("aria-label", `Jump to slide ${slideNumber + 1}`);
      dotButton.classList.toggle("active", slideNumber === 0);
      dotButton.addEventListener("click", () => navigateToSlide(slideNumber));
      dotsContainer.appendChild(dotButton);
    });
  }

  /**
   * Navigate to a specific slide (with wraparound goodness)
   * @param {number} targetIndex - The slide to jump to
   */
  function navigateToSlide(targetIndex) {
    // Remove active class from current slide
    allSlides[currentSlideIndex].classList.remove("active");
    
    // Wrap around using modulo (fancy math term: the cake is a lie)
    currentSlideIndex = (targetIndex + allSlides.length) % allSlides.length;
    
    // Activate the new slide
    allSlides[currentSlideIndex].classList.add("active");
    
    // Move the track to show the correct slide
    trackElement.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    // Update the dot indicators to match
    if (dotsContainer) {
      const allDots = dotsContainer.querySelectorAll("button");
      allDots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlideIndex);
      });
    }

    // Reset the auto-play timer — don't want to interrupt someone's viewing
    restartAutoPlay();
  }

  /**
   * Restart the auto-play timer
   * This is called after manual navigation so the timer doesn't
   * interfere with the user's control
   */
  function restartAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => navigateToSlide(currentSlideIndex + 1), 5000);
  }

  // Initialize the first slide
  allSlides[0]?.classList.add("active");

  // Wire up the prev/next buttons
  if (previousButton) {
    previousButton.addEventListener("click", () => navigateToSlide(currentSlideIndex - 1));
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => navigateToSlide(currentSlideIndex + 1));
  }

  // ═══════════════════════════════════════════════════════════
  // TOUCH / SWIPE SUPPORT — because mobile users are people too
  // ═══════════════════════════════════════════════════════════
  let touchStartX = 0;
  
  carouselContainer.addEventListener("touchstart", (touchEvent) => { 
    touchStartX = touchEvent.touches[0].clientX; 
  }, { passive: true }); // passive: true for better scroll performance
  
  carouselContainer.addEventListener("touchend", (touchEvent) => {
    const swipeDistance = touchStartX - touchEvent.changedTouches[0].clientX;
    // Only register as a swipe if it's more than 50px (prevents accidental swipes)
    if (Math.abs(swipeDistance) > 50) {
      // Swipe left = next, Swipe right = prev
      navigateToSlide(swipeDistance > 0 ? currentSlideIndex + 1 : currentSlideIndex - 1);
    }
  });

  // ═══════════════════════════════════════════════════════════
  // PAUSE ON HOVER — the carousel is polite and knows when to stop
  // ═══════════════════════════════════════════════════════════
  carouselContainer.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
  carouselContainer.addEventListener("mouseleave", restartAutoPlay);

  // Start the auto-play party
  restartAutoPlay();
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 5: FORM VALIDATION (Contact / About page)
 * ═══════════════════════════════════════════════════════════
 * 
 * Forms are like promises — they need validation to be trusted.
 * This function validates form fields as users type/blur,
 * and shows friendly error messages when things go wrong.
 * 
 * The validation rules check:
 * - text fields: must have at least 2 characters (we're not greedy)
 * - email: must look like a real email (you know, the thing with the @)
 * - phone: must have at least 7 digits (even with all the dashes and spaces)
 * - textarea: must have at least 10 characters (give us something to work with!)
 * 
 * Requirements: <form class="efrei-form"> with inputs that have
 *               data-required and data-type attributes
 */

(function initFormValidation() {
  const contactForm = document.querySelector(".efrei-form");
  if (!contactForm) return;

  // The rulebook — each field type has its own criteria
  const validationRules = {
    text:  { 
      test: inputValue => inputValue.trim().length >= 2,
      // We ask for 2 characters minimum because empty feels rude
      message: "That name looks a bit short — could you give us at least 2 characters?" 
    },
    email: { 
      test: inputValue => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.trim()),
      message: "Hmm, that doesn't look quite right — need something like you@example.com" 
    },
    tel:   { 
      test: inputValue => /^[\d\s\+\-\(\)]{7,}$/.test(inputValue.trim()),
      message: "That phone number looks a bit funny — got 7+ digits for us?" 
    },
    textarea: { 
      test: inputValue => inputValue.trim().length >= 10,
      message: "A message of at least 10 characters, please? Pretty please?" 
    },
  };

  /**
   * Find the error message element for a specific form field
   * Each field has a matching <span class="form-error" data-error-for="fieldName">
   * @param {HTMLElement} fieldElement - The form field element
   * @returns {HTMLElement|null} The error message element
   */
  function findErrorElement(fieldElement) {
    return contactForm.querySelector(`[data-error-for="${fieldElement.name}"]`);
  }

  /**
   * Validate a single form field against its rules
   * @param {HTMLElement} fieldElement - The form field to validate
   * @returns {boolean} true if valid, false if not
   */
  function validateField(fieldElement) {
    const fieldType = fieldElement.dataset.type || fieldElement.type || "text";
    const validationRule = validationRules[fieldType];
    const errorElement = findErrorElement(fieldElement);
    
    // Skip validation if no rule exists or field isn't marked as required
    if (!validationRule || !fieldElement.dataset.required) return true;

    const isValid = validationRule.test(fieldElement.value);
    
    // Toggle error styling and aria-invalid attribute
    fieldElement.classList.toggle("input-error", !isValid);
    fieldElement.setAttribute("aria-invalid", !isValid);
    
    // Update the error message (or hide it if everything's fine)
    if (errorElement) {
      errorElement.textContent = isValid ? "" : validationRule.message;
      errorElement.classList.toggle("visible", !isValid);
    }
    
    return isValid;
  }

  // ═══════════════════════════════════════════════════════════
  // LIVE VALIDATION — we validate as you go, like a supportive friend
  // ═══════════════════════════════════════════════════════════
  contactForm.querySelectorAll("[data-required]").forEach(formField => {
    // Validate on blur (when you leave a field)
    formField.addEventListener("blur", () => validateField(formField));
    
    // Also validate on input if the field already has an error
    // (so you can fix it in real-time)
    formField.addEventListener("input", () => {
      if (formField.classList.contains("input-error")) {
        validateField(formField);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // FORM SUBMISSION — the grand finale
  // ═══════════════════════════════════════════════════════════
  contactForm.addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault(); // We handle submission ourselves, thanks
    
    // Get all required fields and validate them all
    const allRequiredFields = Array.from(contactForm.querySelectorAll("[data-required]"));
    const everyFieldIsValid = allRequiredFields.map(validateField).every(Boolean);

    if (everyFieldIsValid) {
      // Success! Show loading state first, then success message
      displayLoadingThenSuccess(contactForm);
    } else {
      // Find the first problematic field and give it focus
      // (so the user doesn't have to hunt for the error)
      const firstProblemField = contactForm.querySelector(".input-error");
      if (firstProblemField) firstProblemField.focus();
    }
  });

  /**
   * Show loading state, then replace form with success message
   * @param {HTMLElement} formElement - The form to animate
   */
  function displayLoadingThenSuccess(formElement) {
    const submitButton = formElement.querySelector('button[type="submit"]');
    
    // Add loading state to button
    submitButton.classList.add("btn-loading");
    submitButton.disabled = true;
    
    // Simulate processing delay (in a real app, this would be the actual API call)
    setTimeout(() => {
      displaySuccessMessage(formElement);
    }, 1500);
  }

  /**
   * Replace the form with a friendly success message
   * @param {HTMLElement} formElement - The form to replace
   */
  function displaySuccessMessage(formElement) {
    formElement.innerHTML = `
      <div class="form-success" role="alert" aria-live="polite">
        <span class="form-success-icon">&#9986;</span>
        <h3>Message sent!</h3>
        <p>Thank you for reaching out to the EFREI Computer Science Department.
           We'll get back to you faster than you can say "bug-free code".</p>
      </div>`;
  }
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 6: TAB SYSTEM (Skills / Background page)
 * ═══════════════════════════════════════════════════════════
 * 
 * Tabs: because nobody likes scrolling through a mile of content
 * just to find what they're looking for. This function sets up
 * a keyboard-accessible tab interface that plays nice with
 * screen readers.
 * 
 * Requirements: .tabs-nav with [data-tab] buttons, and
 *               .tab-panel with matching [data-panel] ids
 */

(function initTabInterface() {
  const allTabNavigations = document.querySelectorAll(".tabs-nav");
  if (!allTabNavigations.length) return;

  allTabNavigations.forEach(tabNav => {
    const tabButtons = Array.from(tabNav.querySelectorAll("[data-tab]"));
    // Find the parent .tabs-container (or fall back to document)
    const containerElement = tabNav.closest(".tabs-container") || document;
    const tabPanels = Array.from(containerElement.querySelectorAll(".tab-panel"));

    /**
     * Activate a specific tab and show its panel
     * @param {HTMLElement} clickedButton - The tab button that was clicked
     */
    function activateTab(clickedButton) {
      const targetPanelId = clickedButton.dataset.tab;

      // Update button states — active or not
      tabButtons.forEach(button => {
        const isSelected = button === clickedButton;
        button.classList.toggle("active", isSelected);
        button.setAttribute("aria-selected", isSelected);
      });

      // Show/hide the corresponding panels
      tabPanels.forEach(panel => {
        const shouldShow = panel.dataset.panel === targetPanelId;
        panel.classList.toggle("active", shouldShow);
        panel.hidden = !shouldShow; // hidden attribute for accessibility
      });
    }

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD NAVIGATION — because not everyone uses a mouse
    // ═══════════════════════════════════════════════════════════
    tabNav.addEventListener("keydown", (keyboardEvent) => {
      const currentButtonIndex = tabButtons.indexOf(document.activeElement);
      
      // Skip if the focused element isn't one of our tabs
      if (currentButtonIndex === -1) return;
      
      // Arrow keys cycle through tabs — classic accessibility pattern
      if (keyboardEvent.key === "ArrowRight") {
        keyboardEvent.preventDefault();
        tabButtons[(currentButtonIndex + 1) % tabButtons.length].focus();
      }
      if (keyboardEvent.key === "ArrowLeft") {
        keyboardEvent.preventDefault();
        const prevIndex = (currentButtonIndex - 1 + tabButtons.length) % tabButtons.length;
        tabButtons[prevIndex].focus();
      }
    });

    // Attach click handlers to all buttons
    tabButtons.forEach(button => {
      button.addEventListener("click", () => activateTab(button));
    });

    // Activate the first tab by default — everyone's a leader
    if (tabButtons[0]) activateTab(tabButtons[0]);
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 7: ACCORDION (Expandable Content Blocks)
 * ═══════════════════════════════════════════════════════════
 * 
 * Accordions are great for内容量 content without overwhelming
 * the user. Click a header, content expands. Click again, it
 * collapses. Simple, elegant, satisfying.
 * 
 * This version closes other panels when opening a new one
 * (only one open at a time) — like a well-behaved accordion.
 * 
 * Requirements: .accordion with .accordion-item children,
 *               each containing .accordion-trigger and .accordion-panel
 */

(function initAccordion() {
  const accordionContainers = document.querySelectorAll(".accordion");
  if (!accordionContainers.length) return;

  accordionContainers.forEach(accordion => {
    const accordionItems = accordion.querySelectorAll(".accordion-item");

    accordionItems.forEach(item => {
      const triggerButton = item.querySelector(".accordion-trigger");
      const contentPanel = item.querySelector(".accordion-panel");
      
      if (!triggerButton || !contentPanel) return;

      // Generate a unique ID for the panel (so aria-controls can work)
      // We use a slice of random characters — good enough for our purposes
      const panelUniqueId = `panel-${Math.random().toString(36).slice(2, 7)}`;
      contentPanel.id = panelUniqueId;
      triggerButton.setAttribute("aria-controls", panelUniqueId);
      triggerButton.setAttribute("aria-expanded", "false");
      contentPanel.hidden = true; // Start collapsed

      triggerButton.addEventListener("click", () => {
        const isCurrentlyOpen = triggerButton.getAttribute("aria-expanded") === "true";

        // Close all OTHER accordion items in this group
        // We're focused on one at a time
        accordionItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
            const otherPanel = otherItem.querySelector(".accordion-panel");
            if (otherPanel) otherPanel.hidden = true;
            otherItem.classList.remove("is-open");
          }
        });

        // Toggle the clicked item
        triggerButton.setAttribute("aria-expanded", !isCurrentlyOpen);
        contentPanel.hidden = isCurrentlyOpen; // If it was open, hide it; if closed, show it
        item.classList.toggle("is-open", !isCurrentlyOpen);
      });
    });
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 8: SMOOTH SCROLL FOR ANCHOR LINKS
 * ═══════════════════════════════════════════════════════════
 * 
 * When you click a link that goes to #some-section,
 * this makes the page scroll smoothly to that section
 * instead of teleporting. Much nicer for the user.
 * 
 * We also focus the target element (without scrolling)
 * so keyboard users can continue from where they landed.
 */

(function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchorLink => {
    anchorLink.addEventListener("click", (clickEvent) => {
      const targetId = anchorLink.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      if (!targetSection) return; // No target? No problem (literally)
      
      clickEvent.preventDefault();
      
      // The smooth scroll itself
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      
      // Focus the target without scrolling again — accessibility win
      targetSection.focus({ preventScroll: true });
    });
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 9: BACK TO TOP BUTTON
 * ═══════════════════════════════════════════════════════════
 * 
 * That little ▲ button in the corner that appears when you've
 * scrolled down a bit. Saves users from having to scroll all
 * the way back up like some kind of medieval pilgrim.
 * 
 * We show it after scrolling 400px (not immediately) so it
 * doesn't distract from content. And we use passive event
 * listeners for scroll performance.
 * 
 * Requirements: <button class="back-to-top" aria-label="Back to top">
 */

(function initBackToTopButton() {
  const backToTopButton = document.querySelector(".back-to-top");
  if (!backToTopButton) return;

  // Show/hide based on scroll position
  window.addEventListener("scroll", () => {
    backToTopButton.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  // Smooth scroll to top when clicked
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 10: OFFICE HOURS TABLE — AUTO-HIGHLIGHT TODAY
 * ═══════════════════════════════════════════════════════════
 * 
 * This nifty function looks at the office hours table on the
 * Faculty page and highlights today's column. Because
 * remembering which day it is is hard enough without
 * squinting at a table.
 * 
 * It only runs on pages that actually have an office hours table
 * so it won't throw errors on other pages.
 */

(function highlightTodaysColumn() {
  const officeHoursTable = document.querySelector(".office-hours-table");
  if (!officeHoursTable) return;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = new Date().getDay();
  const todaysName = daysOfWeek[todayIndex];

  // Find the column header that matches today and give it the "today" class
  officeHoursTable.querySelectorAll("th").forEach((headerCell, columnIndex) => {
    if (headerCell.textContent.trim() === todaysName) {
      // Mark the header
      headerCell.classList.add("today");
      
      // Mark all the data cells in this column
      officeHoursTable.querySelectorAll(`tr td:nth-child(${columnIndex + 1})`).forEach(dataCell => {
        dataCell.classList.add("today");
      });
    }
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 11: DYNAMIC YEAR IN FOOTER
 * ═══════════════════════════════════════════════════════════
 * 
 * Nothing fancy here — just automatically updates the year
 * in the footer copyright notice. Because manually updating
 * it every year is tedious and error-prone.
 * 
 * This runs once on page load and sets the text content of
 * any element with the class "footer-year".
 */

(function updateFooterYear() {
  const yearDisplay = document.querySelector(".footer-year");
  if (yearDisplay) {
    yearDisplay.textContent = new Date().getFullYear();
  }
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 12: KEYBOARD SHORTCUTS HELP MODAL
 * ═══════════════════════════════════════════════════════════
 * 
 * Press ? to open a modal showing available keyboard shortcuts.
 * This helps power users navigate faster.
 */

(function initKeyboardShortcuts() {
  // Create the keyboard hint element
  const keyboardHint = document.createElement("div");
  keyboardHint.className = "keyboard-hint";
  keyboardHint.innerHTML = `Press <kbd>?</kbd> for shortcuts`;
  keyboardHint.setAttribute("aria-hidden", "true");
  document.body.appendChild(keyboardHint);

  // Create the modal
  const modal = document.createElement("div");
  modal.className = "shortcuts-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="shortcuts-modal-content" role="dialog" aria-labelledby="shortcuts-title">
      <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
      <ul>
        <li><span>Open this help</span> <kbd>?</kbd></li>
        <li><span>Go to homepage</span> <kbd>G</kbd> then <kbd>H</kbd></li>
        <li><span>Go to courses</span> <kbd>G</kbd> then <kbd>C</kbd></li>
        <li><span>Go to faculty</span> <kbd>G</kbd> then <kbd>F</kbd></li>
        <li><span>Scroll to top</span> <kbd>T</kbd></li>
        <li><span>Close modal</span> <kbd>Esc</kbd></li>
      </ul>
      <button class="btn btn-secondary shortcuts-modal-close" aria-label="Close shortcuts help">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  const modalContent = modal.querySelector(".shortcuts-modal-content");
  const closeButton = modal.querySelector(".shortcuts-modal-close");

  // Open modal
  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    closeButton.focus();
  }

  // Close modal
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  // Toggle modal
  document.addEventListener("keydown", (keyboardEvent) => {
    // Check if user is typing in an input/textarea
    const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(keyboardEvent.target.tagName);

    // Press ? to open shortcuts (when not typing)
    if (keyboardEvent.key === "?" && !isTyping) {
      keyboardEvent.preventDefault();
      openModal();
    }

    // Press Escape to close modal
    if (keyboardEvent.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Click outside to close
  modal.addEventListener("click", (clickEvent) => {
    if (clickEvent.target === modal) {
      closeModal();
    }
  });

  // Close button click
  closeButton.addEventListener("click", closeModal);

  // G then H/F/C navigation
  let gKeyPressed = false;
  let gTimeout = null;

  document.addEventListener("keydown", (keyboardEvent) => {
    const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(keyboardEvent.target.tagName);
    if (isTyping) return;

    if (keyboardEvent.key === "g" && !gKeyPressed) {
      gKeyPressed = true;
      clearTimeout(gTimeout);
      gTimeout = setTimeout(() => { gKeyPressed = false; }, 1000);
    } else if (gKeyPressed) {
      clearTimeout(gTimeout);
      if (keyboardEvent.key === "h") {
        window.location.href = "index.html";
      } else if (keyboardEvent.key === "c") {
        window.location.href = "courses.html";
      } else if (keyboardEvent.key === "f") {
        window.location.href = "faculty.html";
      }
      gKeyPressed = false;
    }

    // T = scroll to top
    if (keyboardEvent.key === "t" && !isTyping) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 13: FUN FACT ROTATING BANNER
 * ═══════════════════════════════════════════════════════════
 * 
 * A subtle banner that rotates through interesting facts
 * about the department. Keeps visitors engaged while
 * teaching them something useful.
 */

(function initFunFactBanner() {
  // Fun facts about the department
  const funFacts = [
    { label: "Did you know?", text: "Our students have shipped over 200 production projects" },
    { label: "By the numbers", text: "500+ students, 40+ industry partners, 5 campuses" },
    { label: "Alumni spotlight", text: "Our graduates work at Google, Meta, Amazon, and CERN" },
    { label: "Research power", text: "15+ active research collaborations with industry partners" },
    { label: "Global reach", text: "Students from 35+ countries call EFREI home" },
    { label: "Innovation hub", text: "3 spin-off startups launched from our labs last year" }
  ];

  // Create the banner
  const banner = document.createElement("div");
  banner.className = "fun-fact-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Fun fact about the department");
  
  let currentFactIndex = 0;
  
  function updateBanner() {
    const fact = funFacts[currentFactIndex];
    banner.innerHTML = `
      <div class="fun-fact-content">
        <span class="fun-fact-icon" aria-hidden="true">&#9733;</span>
        <span class="fun-fact-label">${fact.label}:</span>
        <span class="fun-fact-text">${fact.text}</span>
      </div>
    `;
  }
  
  updateBanner();
  
  // Insert after the first section or at the top of main
  const firstSection = document.querySelector("main > section:first-of-type");
  if (firstSection) {
    firstSection.parentNode.insertBefore(banner, firstSection.nextSibling);
  } else {
    document.querySelector("main")?.prepend(banner);
  }

  // Rotate facts every 8 seconds
  setInterval(() => {
    currentFactIndex = (currentFactIndex + 1) % funFacts.length;
    updateBanner();
  }, 8000);
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 14: PARALLAX EFFECT ON HERO SECTIONS
 * ═══════════════════════════════════════════════════════════
 * 
 * A subtle parallax effect on hero backgrounds that creates
 * depth when scrolling. Lightweight, GPU-accelerated.
 */

(function initParallax() {
  const heroImages = document.querySelectorAll(".hero-image");
  
  if (!heroImages.length) return;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  // Use requestAnimationFrame for smooth performance
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    
    heroImages.forEach(heroImage => {
      const parent = heroImage.closest(".page-hero");
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      
      if (isVisible) {
        // Calculate parallax offset based on scroll position relative to element
        const offset = (rect.top / window.innerHeight) * 20;
        heroImage.style.transform = `translateY(${offset}px)`;
      }
    });
    
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 15: STATS COUNTER ANIMATION
 * ═══════════════════════════════════════════════════════════
 * 
 * Animates the stat numbers on the home page, counting up
 * from 0 to the target value when they become visible.
 */

(function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  
  if (!statNumbers.length) return;

  const animateCounter = (element) => {
    const target = parseInt(element.dataset.target, 10);
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * target);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }
    
    requestAnimationFrame(update);
  };

  // Use IntersectionObserver to trigger when stats section is visible
  const statsSection = document.querySelector(".stats-section");
  if (!statsSection) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbersInView = entry.target.querySelectorAll(".stat-number[data-target]");
        statNumbersInView.forEach(stat => animateCounter(stat));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statsObserver.observe(statsSection);
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 16: DARK MODE TOGGLE
 * ═══════════════════════════════════════════════════════════
 * 
 * Toggle between light and dark theme with preference stored
 * in localStorage. Respects prefers-color-scheme as default.
 */

(function initDarkModeToggle() {
  const themeToggleBtn = document.querySelector(".theme-toggle");
  if (!themeToggleBtn) return;

  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 17: EASTER EGG — LOGO SPIN ON 5 CLICKS
 * ═══════════════════════════════════════════════════════════
 * 
 * Click the EFREI logo 5 times to trigger a spin animation
 * and a toast message!
 */

(function initLogoEasterEgg() {
  const logo = document.querySelector(".logo");
  if (!logo) return;

  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener("click", (e) => {
    e.preventDefault(); // Don't navigate on these clicks
    
    clickCount++;
    
    if (clickTimer) clearTimeout(clickTimer);
    
    if (clickCount >= 5) {
      clickCount = 0;
      logo.style.animation = "spin 0.5s ease-in-out";
      showToast("🏆 Logo champion! You found the secret click easter egg!");
      setTimeout(() => {
        logo.style.animation = "";
      }, 500);
    } else {
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1000);
    }
  });
})();


/**
 * ═══════════════════════════════════════════════════════════
 * FEATURE 18: EASTER EGG — KONAMI CODE
 * ═══════════════════════════════════════════════════════════
 * 
 * ↑↑↓↓←→←→BA triggers rainbow mode + toast message!
 */

(function initKonamiCode() {
  const konamiCode = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "KeyB", "KeyA"
  ];
  
  let currentIndex = 0;
  let rainbowTimeout = null;

  document.addEventListener("keydown", (e) => {
    if (e.code === konamiCode[currentIndex]) {
      currentIndex++;
      
      if (currentIndex === konamiCode.length) {
        currentIndex = 0;
        activateRainbowMode();
      }
    } else {
      currentIndex = 0;
    }
  });

  function activateRainbowMode() {
    document.body.classList.add("rainbow-mode");
    showToast("🌈🌈🌈 KONAMI CODE ACTIVATED! 🌈🌈🌈 Rainbow mode unlocked! You are a true gamer!");
    
    clearTimeout(rainbowTimeout);
    rainbowTimeout = setTimeout(() => {
      document.body.classList.remove("rainbow-mode");
      showToast("Rainbow mode has faded... but your glory remains!");
    }, 10000);
  }
})();


/**
 * ═══════════════════════════════════════════════════════════
 * HELPER: SHOW TOAST NOTIFICATION
 * ═══════════════════════════════════════════════════════════
 */

function showToast(message) {
  let container = document.querySelector(".toast-container");
  
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}