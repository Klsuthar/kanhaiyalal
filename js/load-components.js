// Load school service component
fetch('components/school-service.html')
    .then(response => response.text())
    .then(html => {
        const placeholder = document.getElementById('school-service-placeholder');
        if (placeholder) {
            placeholder.innerHTML = html;
        }
    })
    .catch(error => console.error('Error loading school service:', error));
