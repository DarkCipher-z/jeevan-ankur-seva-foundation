/* ============================================
   Jeevan Ankur Seva Foundation — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initCounterAnimation();
  initTestimonialCarousel();
  initGalleryLightbox();
  initGalleryFilter();
  initContactForm();
  initBackToTop();
  initAccordions();
  highlightActiveNav();
});

/* --- Navigation --- */
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const nav = document.querySelector('.nav-container');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll-based nav styling
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    });
  }
}

/* --- Highlight Active Nav Link --- */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Scroll Animations (IntersectionObserver) --- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements
    animatedElements.forEach(el => el.classList.add('visible'));
  }
}

/* --- Counter Animation --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'), 10);
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(eased * target);

    element.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --- Testimonial Carousel --- */
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (!track || dots.length === 0) return;

  let currentIndex = 0;
  const totalSlides = dots.length;
  let autoplayInterval;

  function goToSlide(index) {
    currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoplay();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let galleryImages = [];
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    galleryImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden) img'));
    if (galleryImages.length === 0) return;

    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (galleryImages[currentLightboxIndex]) {
      lightboxImg.src = galleryImages[currentLightboxIndex].src;
      if (lightboxCaption) {
        lightboxCaption.textContent = galleryImages[currentLightboxIndex].alt || '';
      }
    }
  }

  // Delegate click events for gallery items
  document.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item');
    if (galleryItem) {
      const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      const index = visibleItems.indexOf(galleryItem);
      if (index !== -1) openLightbox(index);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
      updateLightboxImage();
    });
  }

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* --- Gallery Filter --- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          item.classList.add('hidden');
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --- Contact Form Validation --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.classList.remove('error');
    });
    form.querySelectorAll('.form-error').forEach(err => {
      err.style.display = 'none';
    });

    // Validate required fields
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    if (name && name.value.trim() === '') {
      showError(name, 'Please enter your name');
      isValid = false;
    }

    if (email) {
      if (email.value.trim() === '') {
        showError(email, 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
    }

    if (message && message.value.trim() === '') {
      showError(message, 'Please enter your message');
      isValid = false;
    }

    if (isValid) {
      // Show success (in production, submit to backend)
      const successMsg = document.getElementById('form-success');
      if (successMsg) {
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    }
  });
}

function showError(input, message) {
  input.classList.add('error');
  const errorEl = input.parentElement.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --- Back to Top Button --- */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Accordions --- */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('active');

      // Close all other accordions in the same group
      const group = header.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-header').forEach(h => {
          h.classList.remove('active');
          if (h.nextElementSibling) h.nextElementSibling.classList.remove('open');
        });
      }

      if (!isOpen) {
        header.classList.add('active');
        if (body) body.classList.add('open');
      }
    });
  });
}
