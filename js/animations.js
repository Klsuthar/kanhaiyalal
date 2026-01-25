// Scroll Reveal Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => observer.observe(el));

// Infinite Horizontal Scroll (Marquee Effect) for Mobile
// Infinite scroll logic removed to ensure smooth, native touch scrolling on mobile devices.
// Complex JS-based scrolling often conflicts with CSS Scroll Snap and touch momentum.
// We will rely on robust CSS-only horizontal scrolling for the best user experience.
