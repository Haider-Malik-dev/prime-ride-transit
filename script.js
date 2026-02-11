// ========================================
// PRIME RIDE TRANSIT - JAVASCRIPT
// Interactive functionality and animations
// ========================================

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initNavigation();
    initScrollAnimations();
    initFAQ();
    initForm();
    initSmoothScroll();
    
});

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // ✅ MULTI-PAGE ACTIVE NAV (no scroll spy)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Remove all actives first
    navLinks.forEach(link => link.classList.remove('active'));

    // Set active based on file name
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Only match page links like index.html/about.html
        if (!href.startsWith('#') && href === currentPage) {
            link.classList.add('active');
        }
    });

    // If homepage is served as "/" on hosting
    if (window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        const homeLink = document.querySelector('.nav-link[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with reveal-on-scroll class
    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// FAQ ACCORDION
// ========================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ========================================
// MULTI-STEP FORM
// ========================================

let currentStep = 1;
const totalSteps = 3;

function nextStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    
    // Validate current step
    const inputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545';
            
            // Reset border color after 2 seconds
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
        
        // Special validation for radio buttons
        if (input.type === 'radio') {
            const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
            }
        }
    });
    
    if (!isValid) {
        // Show error message
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Move to next step
    if (currentStep < totalSteps) {
        currentStepElement.classList.remove('active');
        currentStep++;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        
        // Scroll to top of form
        document.querySelector('.ride-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        currentStep--;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        
        // Scroll to top of form
        document.querySelector('.ride-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function resetForm() {
    const form = document.getElementById('rideForm');
    const formSuccess = document.getElementById('formSuccess');
    
    form.reset();
    formSuccess.classList.remove('active');
    form.style.display = 'block';
    
    // Reset to first step
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    currentStep = 1;
    document.querySelector('.form-step[data-step="1"]').classList.add('active');
}

function initForm() {
    const form = document.getElementById('rideForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log('Form submitted with data:', data);
            
            // Show success message
            form.style.display = 'none';
            document.getElementById('formSuccess').classList.add('active');
            
            // Scroll to success message
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // In production, send data to backend
            // Example:
            // fetch('/api/ride-request', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        });
    }
    
    // Set minimum date to today for date input
    const dateInput = document.getElementById('rideDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty anchors or anchors that are just "#"
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'error' ? '#dc3545' : '#28A745',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        fontFamily: 'var(--font-display)',
        fontWeight: '600',
        fontSize: '15px'
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// ADDITIONAL INTERACTIVE FEATURES
// ========================================

// Lazy load images when available
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Handle external links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Print current year in footer (if needed)
const currentYear = new Date().getFullYear();
document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = currentYear;
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Debounce function for scroll events
function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle window resize
window.addEventListener('resize', throttle(function() {
    // Add any resize handling here
    console.log('Window resized');
}, 250));

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Focus trap for mobile menu
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
        
        // Close on Escape key
        if (e.key === 'Escape') {
            element.classList.remove('active');
        }
    });
}

// Apply focus trap to mobile menu
const navMenu = document.getElementById('navMenu');
if (navMenu) {
    trapFocus(navMenu);
}

// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================

console.log(
    '%cPrime Ride Transit LLC',
    'color: #2B5797; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cSafe, Reliable Medical Transportation',
    'color: #28A745; font-size: 16px;'
);
console.log(
    '%cWebsite developed with accessibility and performance in mind.',
    'color: #6C757D; font-size: 12px;'
);
