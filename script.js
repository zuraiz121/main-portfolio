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
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('nav-active');
    
    // Animate Links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Hamburger Animation
    hamburger.classList.toggle('toggle');
});

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
            if (navLinks.classList.contains('nav-active')) {
                hamburger.click();
            }
        }
    });
});

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
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

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

// Add CSS for mobile menu animation
const style = document.createElement('style');
style.textContent = `
    .nav-links {
        display: flex;
    }

    @media screen and (max-width: 768px) {
        .nav-links {
            position: fixed;
            right: 0;
            height: 100vh;
            top: 0;
            background-color: var(--dark-bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            width: 50%;
            transform: translateX(100%);
            transition: transform 0.5s ease-in;
            z-index: 999;
        }

        .nav-links li {
            opacity: 0;
        }

        .nav-active {
            transform: translateX(0%);
        }

        .toggle span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

        .toggle span:nth-child(2) {
            opacity: 0;
        }

        .toggle span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }

    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .scroll-down {
        transform: translateY(-100%);
        transition: transform 0.3s ease-in-out;
    }

    .scroll-up {
        transform: translateY(0);
        transition: transform 0.3s ease-in-out;
    }
`;

document.head.appendChild(style); 