// Custom Cursor
const cursorOuter = document.querySelector('.cursor-outer');
const cursorInner = document.querySelector('.cursor-inner');
const cursorTrail = document.querySelector('.cursor-trail');

// Cursor movement variables
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let trailX = 0;
let trailY = 0;
let isMoving = false;
let moveTimeout;

// Smoothing factors (lower = smoother)
const cursorSmoothing = 0.12; // Main cursor smoothing (reduced from 0.15)
const trailSmoothing = 0.06; // Trail smoothing (reduced from 0.08)

// Linear interpolation function
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Smooth cursor movement
function updateCursor() {
    // Calculate distance between current position and target position
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    // Apply easing with lerp
    cursorX = lerp(cursorX, mouseX, cursorSmoothing);
    cursorY = lerp(cursorY, mouseY, cursorSmoothing);
    
    // Update trail position with more easing
    trailX = lerp(trailX, cursorX, trailSmoothing);
    trailY = lerp(trailY, cursorY, trailSmoothing);
    
    // Calculate velocity for dynamic effects
    const velocity = Math.sqrt(dx * dx + dy * dy);
    
    // Apply positions with transform
    cursorOuter.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorInner.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
    
    // Dynamic trail opacity based on movement speed
    if (velocity > 0.1) {
        cursorTrail.style.opacity = Math.min(velocity * 1.5, 0.8); // Reduced max opacity
    } else {
        cursorTrail.style.opacity = 0;
    }
    
    requestAnimationFrame(updateCursor);
}

// Track mouse movement with throttling
let lastMouseMove = 0;
const throttleDelay = 1000 / 60; // 60fps

document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastMouseMove < throttleDelay) return;
    lastMouseMove = now;
    
    // Update mouse position
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show trail when moving
    if (!isMoving) {
        isMoving = true;
    }
    
    // Reset the timeout on each move
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
        isMoving = false;
    }, 150); // Increased timeout for smoother trail
});

// Handle cursor visibility on mouse leave/enter
document.addEventListener('mouseleave', () => {
    cursorOuter.style.opacity = '0';
    cursorInner.style.opacity = '0';
    cursorTrail.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorOuter.style.opacity = '1';
    cursorInner.style.opacity = '1';
});

// Start cursor animation
updateCursor();

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');
const links = document.querySelectorAll('.nav-links li');

function toggleMobileMenu() {
    navLinks.classList.toggle('nav-active');
    hamburger.classList.toggle('toggle');
    navOverlay.classList.toggle('active');
    document.body.classList.toggle('nav-open');
    
    // Animate Links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
}

function closeMobileMenu() {
    navLinks.classList.remove('nav-active');
    hamburger.classList.remove('toggle');
    navOverlay.classList.remove('active');
    document.body.classList.remove('nav-open');
    
    // Reset animations
    links.forEach(l => l.style.animation = '');
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on overlay
    navOverlay.addEventListener('click', closeMobileMenu);

    // Close mobile menu when clicking on a link
    links.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('nav-active')) {
                closeMobileMenu();
            }
        }
    });
});

// Active Navigation Link
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', setActiveNavLink);

// Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Add staggered animation to portfolio items
            if (entry.target.classList.contains('portfolio-grid')) {
                const portfolioItems = entry.target.querySelectorAll('.portfolio-item');
                portfolioItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = `portfolioSlideIn 0.8s ease-out forwards`;
                    }, index * 150);
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Portfolio grid observer
const portfolioGrid = document.querySelector('.portfolio-grid');
if (portfolioGrid) {
    observer.observe(portfolioGrid);
}

// Form Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Header Scroll Effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Mobile menu CSS is now handled in styles.css 