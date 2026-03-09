// ===== SCRIPT.JS: Futuristic Interactions & Animations =====

// Global scroll function for inline onclick handlers
function scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const headerOffset = 80;
        const elementPosition = aboutSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Canvas Particle Background System ---
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const colors = [
        'rgba(0, 243, 255, 0.8)', // Neon Blue
        'rgba(188, 19, 254, 0.8)', // Neon Purple
        'rgba(0, 255, 102, 0.6)'  // Neon Green
    ];

    // Resize canvas
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasDimensions();

    window.addEventListener("resize", () => {
        setCanvasDimensions();
        initParticles();
    });

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Re-spawn if out of bounds
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize Particles
    function initParticles() {
        particlesArray = [];
        const numParticles = (canvas.width * canvas.height) / 10000; // Density

        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Animate Particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Connect nearby particles
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    // Fading line based on distance
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        } // end loop

        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // --- 2. Scroll Reveal Animations ---
    const reveals = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing after reveal if you only want it to happen once
                // observer.unobserve(entry.target); 
            } else {
                // Remove class if you want animation to trigger every time it comes into view
                entry.target.classList.remove("active");
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });

    // --- 3. Navbar Scroll Effect ---
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(7, 9, 15, 0.95)";
            navbar.style.boxShadow = "0 2px 20px rgba(0, 243, 255, 0.2)";
        } else {
            navbar.style.background = "rgba(7, 9, 15, 0.8)";
            navbar.style.boxShadow = "none";
        }
    });

    // --- 4. Smooth Scrolling Logic ---
    // (Handled partially by CSS scroll-behavior, but ensuring nav links offset)
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 5. Mouse move interactive glow effect on cards ---
    const cards = document.querySelectorAll('.theme-card, .coord-card, .req-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set variables dynamically for radial gradient glow
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 6. Typewriter Animation on Scroll ---
    // Select all headings and paragraphs for typing effect
    const typeTargets = document.querySelectorAll(
        '.section-title, .subtitle, .hero-content .description, ' +
        '.about-section p, .detail-label, .detail-value, ' +
        '.prize-place, .prize-amount, .certificate-note p, ' +
        '.cta-title, .cta-content p, .coord-card h4, .coord-card p, ' +
        '.coordinator-category h3, .req-text, .theme-card h3'
    );

    // Store original text, wrap chars for multiline elements
    // This function recursively walks child nodes, preserving element tags
    function wrapTextChars(node) {
        const fragment = document.createDocumentFragment();
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                // Wrap each character of text nodes
                for (let i = 0; i < child.textContent.length; i++) {
                    const span = document.createElement('span');
                    span.classList.add('type-char');
                    span.textContent = child.textContent[i];
                    fragment.appendChild(span);
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                // Clone the element, clear it, and recursively wrap its children
                const clone = child.cloneNode(false); // shallow clone (keeps tag + classes)
                const innerWrapped = wrapTextChars(child);
                clone.appendChild(innerWrapped);
                fragment.appendChild(clone);
            }
        });
        return fragment;
    }

    typeTargets.forEach(el => {
        if (el.dataset.typeReady) return; // Avoid double-init
        el.dataset.typeReady = 'true';

        // Wrap each character in a span, preserving inner HTML structure
        el.classList.add('typewriter-multiline');

        const wrapped = wrapTextChars(el);
        el.innerHTML = '';
        el.appendChild(wrapped);
    });

    // Intersection Observer to trigger typing effect
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                entry.target.dataset.typed = 'true';
                const chars = entry.target.querySelectorAll('.type-char');
                chars.forEach((char, index) => {
                    setTimeout(() => {
                        char.classList.add('visible');
                    }, index * 30); // 30ms per character
                });
            }
        });
    }, {
        root: null,
        threshold: 0.2,
        rootMargin: "0px 0px -30px 0px"
    });

    typeTargets.forEach(el => {
        typeObserver.observe(el);
    });

    // Hero title special typewriter (JS char-by-char, triggers on load)
    const heroTitle = document.querySelector('.glowing-text');
    if (heroTitle && !heroTitle.classList.contains('typewriter-multiline')) {
        // Wrap hero title chars
        heroTitle.classList.add('typewriter-multiline');
        const wrapped = wrapTextChars(heroTitle);
        heroTitle.innerHTML = '';
        heroTitle.appendChild(wrapped);

        // Add a blinking cursor element at the end
        const cursor = document.createElement('span');
        cursor.classList.add('hero-cursor');
        heroTitle.appendChild(cursor);

        // Reveal chars one by one after a short delay
        const heroChars = heroTitle.querySelectorAll('.type-char');
        setTimeout(() => {
            heroChars.forEach((char, index) => {
                setTimeout(() => {
                    char.classList.add('visible');
                }, index * 60); // 60ms per char for dramatic effect
            });
        }, 400);
    }

    // --- Scroll Down Button ---
    const scrollDownBtn = document.getElementById('scroll-down-btn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const headerOffset = 80;
                const elementPosition = aboutSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- Scroll Down Button Function ---
    function scrollToAbout() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const headerOffset = 80;
            const elementPosition = aboutSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});
