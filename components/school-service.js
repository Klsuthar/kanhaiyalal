// School Service Component JavaScript

// Load school service component
async function loadSchoolService() {
    const placeholder = document.getElementById('school-service-placeholder');
    if (!placeholder) return;

    try {
        const response = await fetch('components/school-service.html');
        const html = await response.text();
        placeholder.innerHTML = html;
    } catch (error) {
        console.error('Error loading school service:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadSchoolService);

// Custom interactions for school service
document.addEventListener('click', (e) => {
    if (e.target.closest('#school-service .service-cta')) {
        // Add custom tracking or behavior here
        console.log('School service CTA clicked');
    }
});
