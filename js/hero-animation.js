/* ============================================
   HERO PARTICLE ANIMATION SYSTEM
   Floating tech nodes with parallax interaction
   ============================================ */

(function() {
    'use strict';

    console.log('🎨 Hero Animation System Loading...');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion detected - animations disabled');
        return;
    }

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error('❌ Canvas element not found!');
        return;
    }
    
    console.log('✅ Canvas found, initializing...');

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;
    let ripples = [];
    let trailParticles = [];
    let magneticForce = 1;

    // Canvas setup
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // Particle class - tech nodes
    class Particle {
        constructor(x, y, burst = false) {
            if (burst) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 4 + 2;
                this.speedX = (Math.random() - 0.5) * 8;
                this.speedY = (Math.random() - 0.5) * 8;
                this.opacity = 1;
                this.life = 1;
                this.isBurst = true;
            } else {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.isBurst = false;
            }
            this.color = this.getColor();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.life = 1;
        }

        getColor() {
            // Enhanced tech blue palette with more variety
            const colors = [
                'rgba(59, 130, 246, ',  // blue-500
                'rgba(96, 165, 250, ',  // blue-400
                'rgba(147, 197, 253, ', // blue-300
                'rgba(37, 99, 235, ',   // blue-600
                'rgba(191, 219, 254, ', // blue-200
                'rgba(30, 64, 175, '    // blue-800
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            if (this.isBurst) {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedX *= 0.95;
                this.speedY *= 0.95;
                this.life -= 0.02;
                this.opacity = this.life;
                return this.life > 0;
            }

            this.y += this.speedY;
            this.x += this.speedX;

            // Enhanced magnetic attraction
            if (isMouseActive) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    // Magnetic pull towards cursor
                    this.x += (dx / distance) * force * magneticForce;
                    this.y += (dy / distance) * force * magneticForce;
                    // Glow effect when near cursor
                    this.opacity = Math.min(0.9, this.opacity + force * 0.3);
                } else {
                    this.opacity = Math.max(0.2, this.opacity - 0.01);
                }
            }

            if (this.y > canvas.height + 10) this.reset();
            if (this.x < -10 || this.x > canvas.width + 10) this.x = Math.random() * canvas.width;
            return true;
        }

        draw() {
            // Enhanced glow effect for particles near cursor
            if (isMouseActive && !this.isBurst) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    const glowSize = this.size * 4;
                    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
                    gradient.addColorStop(0, this.color + (this.opacity * 0.8) + ')');
                    gradient.addColorStop(0.5, this.color + (this.opacity * 0.4) + ')');
                    gradient.addColorStop(1, this.color + '0)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Main particle with subtle glow
            const mainGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 1.5);
            mainGradient.addColorStop(0, this.color + this.opacity + ')');
            mainGradient.addColorStop(0.7, this.color + (this.opacity * 0.6) + ')');
            mainGradient.addColorStop(1, this.color + '0)');
            ctx.fillStyle = mainGradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Core particle
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Ripple effect class
    class Ripple {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = 150;
            this.opacity = 0.6;
        }

        update() {
            this.radius += 4;
            this.opacity -= 0.015;
            return this.opacity > 0;
        }

        draw() {
            ctx.strokeStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner ripple for depth
            if (this.radius > 20) {
                ctx.strokeStyle = `rgba(147, 197, 253, ${this.opacity * 0.6})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80); // More particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw ripples
        ripples = ripples.filter(ripple => {
            const alive = ripple.update();
            if (alive) ripple.draw();
            return alive;
        });

        // Update and draw trail particles
        trailParticles = trailParticles.filter(particle => {
            const alive = particle.update();
            if (alive) particle.draw();
            return alive;
        });

        // Update and draw main particles
        particles = particles.filter(particle => {
            const alive = particle.update();
            if (alive) particle.draw();
            return alive;
        });

        // Maintain particle count
        while (particles.filter(p => !p.isBurst).length < Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80)) {
            particles.push(new Particle());
        }

        drawConnections();
        requestAnimationFrame(animate);
    }

    // Draw enhanced connection lines between close particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            if (particles[i].isBurst) continue;
            
            for (let j = i + 1; j < particles.length; j++) {
                if (particles[j].isBurst) continue;
                
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 140) {
                    const opacity = 0.2 * (1 - distance / 140);
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(147, 197, 253, ${opacity * 1.2})`);
                    gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse/Touch tracking with trail effect
    let lastTrailTime = 0;
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseActive = true;
        magneticForce = 1.5;

        // Create trail particles
        const now = Date.now();
        if (now - lastTrailTime > 50) {
            trailParticles.push(new Particle(mouseX, mouseY, true));
            lastTrailTime = now;
        }
    }

    function handleMouseLeave() {
        isMouseActive = false;
        magneticForce = 1;
    }

    // Click/Touch burst effect
    function handleInteraction(e) {
        // Don't trigger on button/link clicks
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!x || !y) return;
        
        const clickX = x - rect.left;
        const clickY = y - rect.top;

        // Create multiple ripples for depth
        ripples.push(new Ripple(clickX, clickY));
        setTimeout(() => ripples.push(new Ripple(clickX, clickY)), 100);

        // Create enhanced burst particles
        for (let i = 0; i < 25; i++) {
            particles.push(new Particle(clickX, clickY, true));
        }
    }

    // Touch move handler
    function handleTouchMove(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        isMouseActive = true;
        magneticForce = 2;

        const now = Date.now();
        if (now - lastTrailTime > 30) {
            trailParticles.push(new Particle(mouseX, mouseY, true));
            lastTrailTime = now;
        }
    }

    function handleTouchEnd() {
        isMouseActive = false;
        magneticForce = 1;
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // Canvas direct events
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleInteraction);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleInteraction, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    // Also listen on hero section for full coverage
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', handleMouseMove);
        heroSection.addEventListener('click', handleInteraction);
        heroSection.addEventListener('touchstart', handleInteraction, { passive: false });
        heroSection.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    // Initialize
    resizeCanvas();
    initParticles();
    animate();
    
    console.log('🚀 Hero Animation System Active!');
    console.log('💡 Try: Move mouse, click anywhere, or drag on mobile');

})();
