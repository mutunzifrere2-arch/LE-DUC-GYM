// ========================================
// LE DUC GYM - JavaScript Frontend
// Pure Frontend - No Backend Required
// Professional Version with LocalStorage
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== HERO SLIDER =====
    const heroSlides = document.querySelectorAll('.hero .slide');
    const heroIndicators = document.querySelectorAll('.slider-indicators span');
    const prevBtn = document.querySelector('.slider-controls .prev-btn');
    const nextBtn = document.querySelector('.slider-controls .next-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        heroIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % heroSlides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
    }

    if (heroSlides.length > 0) {
        // Auto slide
        slideInterval = setInterval(nextSlide, 5000);
        
        // Manual controls
        if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(slideInterval); nextSlide(); slideInterval = setInterval(nextSlide, 5000); });
        if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(slideInterval); prevSlide(); slideInterval = setInterval(nextSlide, 5000); });
        
        // Indicators
        heroIndicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => { clearInterval(slideInterval); showSlide(i); slideInterval = setInterval(nextSlide, 5000); });
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                
                // Close mobile menu if open
                if (navMenu) navMenu.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            }
        });
    });

    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            if (scrollTopBtn) scrollTopBtn.classList.add('visible');
        } else {
            if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== CONTACT FORM HANDLER =====
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const form = event.currentTarget;
            const name = form.elements.name.value.trim();
            const email = form.elements.email.value.trim();
            const phone = form.elements.phone.value.trim();
            const objective = form.elements.objective.value;
            const message = form.elements.message.value.trim();
            const objectiveLabel = objective ? objective.replace(/_/g, ' ') : 'Objectif non précisé';
            const displayName = name || 'membre';

            if (contactSuccess) {
                contactSuccess.textContent = `Merci ${displayName} ! Votre demande a bien été préparée. Nous revenons vers vous rapidement.`;
                contactSuccess.hidden = false;
                contactSuccess.classList.add('visible');
                setTimeout(() => {
                    if (contactSuccess) {
                        contactSuccess.hidden = true;
                        contactSuccess.classList.remove('visible');
                    }
                }, 7000);
            }

            form.reset();
            localStorage.setItem('lastContactRequest', JSON.stringify({ name, email, phone, objective: objectiveLabel, message, date: new Date().toISOString() }));
        });
    }

    // ===== TESTIMONIALS CAROUSEL =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    let currentTestimonialIndex = 0;
    let testimonialsInterval;

    // Create navigation for testimonials
    if (testimonialCards.length > 3) {
        // Create testimonial navigation
        const testimonialNav = document.createElement('div');
        testimonialNav.className = 'testimonial-nav';
        testimonialNav.innerHTML = `
            <button class="testimonial-prev"><i class="fas fa-chevron-left"></i></button>
            <div class="testimonial-dots"></div>
            <button class="testimonial-next"><i class="fas fa-chevron-right"></i></button>
        `;

        // Insert navigation after testimonials grid
        testimonialsGrid.parentNode.insertBefore(testimonialNav, testimonialsGrid.nextSibling);

        // Create dots
        const testimonialDots = testimonialNav.querySelector('.testimonial-dots');
        testimonialCards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => showTestimonial(index));
            testimonialDots.appendChild(dot);
        });

        // Navigation buttons
        const testimonialPrev = testimonialNav.querySelector('.testimonial-prev');
        const testimonialNext = testimonialNav.querySelector('.testimonial-next');

        testimonialPrev.addEventListener('click', () => {
            const newIndex = (currentTestimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(newIndex);
            resetTestimonialsInterval();
        });

        testimonialNext.addEventListener('click', () => {
            const newIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
            showTestimonial(newIndex);
            resetTestimonialsInterval();
        });

        function showTestimonial(index) {
            currentTestimonialIndex = index;

            // Update dots
            document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            // Scroll to show the testimonial (for mobile/small screens)
            if (window.innerWidth <= 768) {
                testimonialCards[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }

        function resetTestimonialsInterval() {
            clearInterval(testimonialsInterval);
            testimonialsInterval = setInterval(() => {
                const newIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
                showTestimonial(newIndex);
            }, 8000);
        }

        // Auto-rotate testimonials
        testimonialsInterval = setInterval(() => {
            const newIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
            showTestimonial(newIndex);
        }, 8000);
    }

    // ===== ANIMATE ON SCROLL (Simple fade-in) =====
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.program-card, .testimonial-card, .pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    console.log('✓ Le Duc Gym - Frontend chargé avec succès!');
});
