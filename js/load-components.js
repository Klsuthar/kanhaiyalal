// Load school service component
fetch('components/school-service.html')
    .then(response => response.text())
    .then(html => {
        const placeholder = document.getElementById('school-service-placeholder');
        if (placeholder) {
            placeholder.innerHTML = html;
            
            // Initialize tab functionality after component loads
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.dataset.tab;
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    btn.classList.add('active');
                    document.getElementById(tab + '-tab').classList.add('active');
                });
            });
        }
    })
    .catch(error => console.error('Error loading school service:', error));
