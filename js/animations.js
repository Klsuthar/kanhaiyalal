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

    // Only active on mobile/tablet
    if (window.innerWidth > 768) return;

    // 1. Get accurate gap from CSS
    const style = window.getComputedStyle(container);
    const gap = parseInt(style.getPropertyValue('gap') || '20'); // Default to 20 if missing

    // 2. Measure single set width BEFORE cloning
    const originalChildren = Array.from(container.children);
    let singleSetWidth = 0;
    originalChildren.forEach(item => {
        singleSetWidth += item.offsetWidth + gap;
    });

    // 3. Clone items to create buffer (x4 for smoothness)
    // We need enough buffer so we never see blank space during the "jump"
    for (let i = 0; i < 2; i++) {
        originalChildren.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); // Accessibility
            container.appendChild(clone);
        });
    }

    // 4. Auto-Scroll Logic
    let isPaused = false;
    let scrollPos = 0;
    const speed = 0.5; // slow smooth speed

    function animate() {
        if (!isPaused) {
            scrollPos += speed;

            // Seamless Reset (The Loop)
            if (scrollPos >= singleSetWidth) {
                scrollPos -= singleSetWidth;
            }
            container.scrollLeft = scrollPos;
        } else {
            // If paused (user is touching), verify we track their manual scroll
            // so we don't jump when resuming
            scrollPos = container.scrollLeft;
        }
        requestAnimationFrame(animate);
    }

    // 5. Touch Interaction Handlers
    container.addEventListener('touchstart', () => {
        isPaused = true;
        // Optional: Disable scroll snap while dragging for smoother feel? 
        // container.style.scrollSnapType = 'none';
    });

    container.addEventListener('touchend', () => {
        // Resume after a short delay
        setTimeout(() => {
            isPaused = false;
            // container.style.scrollSnapType = 'x mandatory';
        }, 1000);
    });

    // Start Animation
    requestAnimationFrame(animate);
}

// Initialize on Load and Resize
window.addEventListener('load', () => {
    // Small delay to ensure layout is final
    setTimeout(() => {
        setupInfiniteScroll('.process-grid', '.process-card');
        setupInfiniteScroll('.projects-grid', '.project-card');
    }, 100);
});

// Handle Resize (Simple Reload to reset logic)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth <= 768) {
            // Reloading is safest/easiest way to recalculate widths/clones
            // forcing a clean slate for the js logic
            // location.reload(); // Optional: might be too aggressive, but effective
        }
    }, 500);
});
