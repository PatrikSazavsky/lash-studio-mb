/**
 * Lash & PMU Studio Mladá Boleslav
 * Production Frontend Application Script
 * Compliant with Modern Web Guidance (Dialog, Navbar, Performance, Accessibility)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sticky Header, Scroll Progress & Back-to-Top ---
  const header = document.querySelector('.site-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (scrollProgress) {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / scrollTotal) * 100));
        scrollProgress.style.inlineSize = `${progress}%`;
      }
    }

    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. Scrollspy Navigation ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  const updateActiveNavLink = () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.setAttribute('aria-current', 'page');
          } else if (link.getAttribute('href')?.startsWith('#')) {
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --- 3. Mobile Popover Menu Handling ---
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.querySelector('.menu-toggle');

  if (mobileMenu && menuToggle) {
    // Close mobile menu when a nav link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.hidePopover) {
          mobileMenu.hidePopover();
        } else {
          mobileMenu.removeAttribute('open');
        }
      });
    });
  }

  // --- 4. Native <dialog> Management & Fallbacks (Modern Web Guidance) ---
  const setupModalDialog = (dialog) => {
    if (!dialog) return;

    // Check pointer click outside dialog boundaries
    const isClickOutside = (e, dlg) => {
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = isClickOutside(e, dialog);
    });

    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && isClickOutside(e, dialog)) {
        dialog.close();
      }
      pressedOutside = false;
    });

    // Close buttons inside dialog
    dialog.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        dialog.close();
      });
    });
  };

  const bookingModal = document.getElementById('booking-modal');
  const galleryLightbox = document.getElementById('gallery-lightbox');
  const gdprModal = document.getElementById('gdpr-modal');

  setupModalDialog(bookingModal);
  setupModalDialog(galleryLightbox);
  setupModalDialog(gdprModal);

  // --- 5. Open Booking Modal Buttons ---
  document.querySelectorAll('.open-booking-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || '';
      if (bookingModal && typeof bookingModal.showModal === 'function') {
        if (serviceName) {
          const serviceSelect = bookingModal.querySelector('#modal-service-select');
          if (serviceSelect) {
            for (let option of serviceSelect.options) {
              if (option.value === serviceName || option.text.toLowerCase().includes(serviceName.toLowerCase())) {
                option.selected = true;
                break;
              }
            }
          }
        }
        bookingModal.showModal();
      } else if (bookingModal) {
        bookingModal.setAttribute('open', '');
      }
    });
  });

  // --- 6. Open GDPR Modal Buttons ---
  document.querySelectorAll('.open-gdpr-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (gdprModal && typeof gdprModal.showModal === 'function') {
        gdprModal.showModal();
      } else if (gdprModal) {
        gdprModal.setAttribute('open', '');
      }
    });
  });

  // --- 7. Gallery Filter & Lightbox with Desktop Carousel Navigation ---
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  let visibleCards = [...galleryCards];
  let currentCardIndex = 0;

  const updateVisibleCards = (filterValue) => {
    visibleCards = [];
    galleryCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
        card.style.display = 'block';
        visibleCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter') || 'all';
      updateVisibleCards(filterValue);
    });
  });

  const displayLightboxImage = (index) => {
    if (!galleryLightbox || visibleCards.length === 0) return;
    if (index < 0) index = visibleCards.length - 1;
    if (index >= visibleCards.length) index = 0;
    currentCardIndex = index;

    const card = visibleCards[currentCardIndex];
    const img = card.querySelector('.gallery-card-img');
    const title = card.querySelector('.gallery-card-title')?.textContent || '';
    const tag = card.querySelector('.gallery-card-tag')?.textContent || '';

    const lbImg = galleryLightbox.querySelector('#lightbox-img');
    const lbTitle = galleryLightbox.querySelector('#lightbox-title');
    const lbTag = galleryLightbox.querySelector('#lightbox-tag');
    const lbCounter = galleryLightbox.querySelector('#lightbox-counter');

    if (lbImg && img) {
      lbImg.src = img.src;
      lbImg.alt = img.alt || title;
    }
    if (lbTitle) lbTitle.textContent = title;
    if (lbTag) lbTag.textContent = tag;
    if (lbCounter) lbCounter.textContent = `${currentCardIndex + 1} / ${visibleCards.length}`;
  };

  // Lightbox opening on click
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = visibleCards.indexOf(card);
      if (idx !== -1) {
        displayLightboxImage(idx);
        if (typeof galleryLightbox.showModal === 'function') {
          galleryLightbox.showModal();
        } else {
          galleryLightbox.setAttribute('open', '');
        }
      }
    });
  });

  // Next / Prev buttons in lightbox
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      displayLightboxImage(currentCardIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      displayLightboxImage(currentCardIndex + 1);
    });
  }

  // Keyboard navigation for Lightbox (ArrowLeft, ArrowRight)
  window.addEventListener('keydown', (e) => {
    if (galleryLightbox && galleryLightbox.open) {
      if (e.key === 'ArrowLeft') {
        displayLightboxImage(currentCardIndex - 1);
      } else if (e.key === 'ArrowRight') {
        displayLightboxImage(currentCardIndex + 1);
      }
    }
  });

  // --- 8. Pricing Tabs Navigation ---
  const pricingTabBtns = document.querySelectorAll('.pricing-tab-btn');
  const pricingTabPanes = document.querySelectorAll('.pricing-tab-pane');

  pricingTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      pricingTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      pricingTabPanes.forEach(pane => pane.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const activePane = document.getElementById(targetId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // --- 8b. Keyboard activation for Price Row items ---
  document.querySelectorAll('.price-row-item[role="button"]').forEach(row => {
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });
  });

  // --- 9. Booking Form Handler (Sanitization, Validation & Anti-Spam) ---
  const handleBookingForm = (formId, statusId) => {
    const form = document.getElementById(formId);
    const statusMsg = document.getElementById(statusId);
    if (!form) return;

    let lastSubmitTime = 0;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Anti-spam Honeypot Check
      const hp = form.querySelector('input[name="studio_hp_check"]');
      if (hp && hp.value.trim() !== '') {
        console.warn('Spam detected via honeypot.');
        return;
      }

      // Rate limit check (minimum 5 seconds between submissions)
      const now = Date.now();
      if (now - lastSubmitTime < 5000) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.textContent = 'Prosím vyčkejte chvíli před odesláním další zprávy.';
        }
        return;
      }

      // Input Sanitization & Validation
      const nameInput = form.querySelector('[name="client_name"]');
      const phoneInput = form.querySelector('[name="client_phone"]');
      const emailInput = form.querySelector('[name="client_email"]');
      const serviceInput = form.querySelector('[name="service_type"]');
      const consentInput = form.querySelector('[name="privacy_consent"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (name.length < 2) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.textContent = 'Prosím zadejte vaše platné jméno a příjmení.';
        }
        nameInput?.focus();
        return;
      }

      // Phone check (allows Czech formats e.g. +420 123 456 789 or 123456789)
      const phoneDigits = phone.replace(/[\s\-\(\)\+]/g, '');
      if (phoneDigits.length < 9) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.textContent = 'Prosím zadejte platné telefonní číslo pro potvrzení termínu.';
        }
        phoneInput?.focus();
        return;
      }

      // Consent check
      if (consentInput && !consentInput.checked) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.textContent = 'Pro odeslání je nutný souhlas se zpracováním osobních údajů pro domluvu termínu.';
        }
        consentInput.focus();
        return;
      }

      lastSubmitTime = now;

      // Visual feedback
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Odesílám poptávku...';
      }

      // Simulated clean backend processing
      setTimeout(() => {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg success';
          statusMsg.innerHTML = `<strong>Děkujeme, paní/slečno ${escapeHtml(name)}!</strong> Vaše poptávka na ${escapeHtml(serviceInput?.value || 'službu')} byla v pořádku zaznamenána. Iveta se vám co nejdříve ozve na číslo ${escapeHtml(phone)} pro upřesnění volného termínu.`;
        }

        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        // Close modal if in modal after 4 seconds
        const parentDialog = form.closest('dialog');
        if (parentDialog) {
          setTimeout(() => {
            parentDialog.close();
            if (statusMsg) statusMsg.style.display = 'none';
          }, 4000);
        }
      }, 700);
    });
  };

  handleBookingForm('main-booking-form', 'main-form-status');
  handleBookingForm('modal-booking-form', 'modal-form-status');

  // --- 10. Accordion status label update ---
  document.querySelectorAll('.accordion-item').forEach(item => {
    const status = item.querySelector('.accordion-trigger-status');
    item.addEventListener('toggle', () => {
      if (status) {
        status.textContent = item.open ? 'Skrýt' : 'Zobrazit';
      }
    });
    if (status && item.open) {
      status.textContent = 'Skrýt';
    }
  });

  // --- 11. Subtle Scroll Reveal (respects prefers-reduced-motion) ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // Utility to prevent XSS in client-rendered messages
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
