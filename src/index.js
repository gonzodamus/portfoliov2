// =====================================
// Modern Portfolio JavaScript
// =====================================

class Portfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupTestimonialsCarousel();
    this.setupSmoothScrolling();
    this.setupFormEnhancements();
    this.setupScrollAnimations();
    this.setupAccessibility();
  }

  // =====================================
  // Mobile Menu Functionality
  // =====================================
  setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuToggle || !navLinks) return;

    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      
      // Toggle menu state
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking on a nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.focus();
      }
    });
  }

  // =====================================
  // Testimonials Carousel
  // =====================================
  setupTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!testimonials.length || !indicators.length) return;

    let currentIndex = 0;
    let intervalId;

    const showTestimonial = (index) => {
      // Remove active class from all testimonials and indicators
      testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
      });
      
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
        indicator.setAttribute('aria-selected', i === index);
      });

      currentIndex = index;
    };

    const nextTestimonial = () => {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(nextIndex);
    };

    const startAutoplay = () => {
      intervalId = setInterval(nextTestimonial, 6000);
    };

    const stopAutoplay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Add click handlers for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showTestimonial(index);
        stopAutoplay();
        setTimeout(startAutoplay, 3000); // Restart autoplay after 3 seconds
      });
    });

    // Pause autoplay on hover
    const testimonialContainer = document.querySelector('.testimonials-carousel');
    if (testimonialContainer) {
      testimonialContainer.addEventListener('mouseenter', stopAutoplay);
      testimonialContainer.addEventListener('mouseleave', startAutoplay);
    }

    // Keyboard navigation for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('keydown', (e) => {
        let newIndex = index;
        
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            newIndex = index > 0 ? index - 1 : indicators.length - 1;
            break;
          case 'ArrowRight':
            e.preventDefault();
            newIndex = index < indicators.length - 1 ? index + 1 : 0;
            break;
          case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            newIndex = indicators.length - 1;
            break;
          default:
            return;
        }
        
        indicators[newIndex].focus();
        showTestimonial(newIndex);
      });
    });

    // Start autoplay
    startAutoplay();

    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // =====================================
  // Smooth Scrolling
  // =====================================
  setupSmoothScrolling() {
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // =====================================
  // Form Enhancements
  // =====================================
  setupFormEnhancements() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Add form validation feedback
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        // Clear error state on input
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      });
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      let isValid = true;
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    if (!isValid) {
      field.classList.add('error');
      const errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.textContent = errorMessage;
      errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
      field.parentNode.appendChild(errorElement);
    }

    return isValid;
  }

  // =====================================
  // Scroll Animations
  // =====================================
  setupScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Add fade-in effect to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.cssText = 'opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease;';
      observer.observe(section);
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    if (header) {
      const handleScroll = () => {
        const scrolled = window.scrollY > 50;
        header.style.background = scrolled 
          ? 'rgba(255, 255, 255, 0.98)' 
          : 'rgba(255, 255, 255, 0.95)';
      };

      // Throttle scroll events
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  // =====================================
  // Accessibility Enhancements
  // =====================================
  setupAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#main-content');
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Add focus management for project cards
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
      const links = project.querySelectorAll('a');
      if (links.length > 0) {
        project.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            links[0].click();
          }
        });
      }
    });

    // Announce dynamic content changes to screen readers
    this.createLiveRegion();
  }

  createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);

    // Use this to announce testimonial changes
    const testimonialObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList.contains('testimonial') && target.classList.contains('active')) {
            const cite = target.querySelector('cite');
            if (cite) {
              liveRegion.textContent = `Now showing testimonial from ${cite.textContent}`;
            }
          }
        }
      });
    });

    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
      testimonialObserver.observe(testimonial, { attributes: true });
    });
  }

  // =====================================
  // Utility Methods
  // =====================================
  
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

// =====================================
// Initialize Portfolio
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  // Check if all required elements exist before initializing
  const requiredElements = ['.hero', '.navbar'];
  const elementsExist = requiredElements.every(selector => document.querySelector(selector));
  
  if (elementsExist) {
    new Portfolio();
  } else {
    console.warn('Portfolio: Required elements not found. Initialization skipped.');
  }
});

// =====================================
// Error Handling
// =====================================
window.addEventListener('error', (e) => {
  console.error('Portfolio error:', e.error);
});

// =====================================
// Service Worker Registration (if available)
// =====================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // You can add service worker registration here for PWA functionality
    // navigator.serviceWorker.register('/sw.js');
  });
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Portfolio;
}
