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
function setupInfiniteScroll(containerId, itemClass) {
    const container = document.querySelector(containerId);
    if (!container) return;

    // Only active on mobile/tablet where horiz scroll exists
    if (window.innerWidth > 768) return;

    const originalContent = Array.from(container.children);

    // Duplicate content multiple times to ensure smooth scrolling
    // We append copies to creating the illusion of infinite length
    originalContent.forEach(item => {
        const clone = item.cloneNode(true);
        container.appendChild(clone);
    });
    // Clone again for safety buffer
    originalContent.forEach(item => {
        const clone = item.cloneNode(true);
        container.appendChild(clone);
    });


    // Optional: Auto-scroll logic (gentle movement)
    // If you want user-controlled loop only, we need custom touch handling 
    // or we accept that CSS snap-scroll is "finite" unless managed by JS.
    // Given the request "wapis first wala aa jaye", simple CSS snap doesn't loop automatically.
    // We'll add a scroll listener to reset position efficiently.

    container.addEventListener('scroll', () => {
        const maxScroll = container.scrollWidth - container.clientWidth;

        // Loop to start
        if (container.scrollLeft >= maxScroll - 50) { // Threshold
            // Jump back to start (+ buffer) seamlessly
            // We need to calculate precise width of one set of items
            const singleSetWidth = originalContent.reduce((acc, item) => acc + item.offsetWidth + 20, 0); // 20 is gap
            container.scrollLeft = container.scrollLeft - singleSetWidth;
        }

        // Loop to end (if scrolling back)
        if (container.scrollLeft <= 0) {
            const singleSetWidth = originalContent.reduce((acc, item) => acc + item.offsetWidth + 20, 0);
            container.scrollLeft = container.scrollLeft + singleSetWidth;
        }
    });
}

// Initialize on Load and Resize
window.addEventListener('load', () => {
    setupInfiniteScroll('.process-grid', '.process-card');
    setupInfiniteScroll('.projects-grid', '.project-card');
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Ideally we'd reset/re-init here for robust resizing
        // For now, simpler implementation is acceptable
    }, 250);
});
