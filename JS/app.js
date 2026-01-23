function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
}

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    // Detailed Element Animation (Cards, Items)
    const revealElements = document.querySelectorAll(
        '#about .grid > div, ' +
        '#services .grid > div, ' +
        '#projects article, ' +
        '#stats .grid > div, ' +
        '#testimonials .grid > div, ' +
        '#faq .border'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
        
        // Calculate delay based on index within its container to create a stagger effect
        const parent = el.parentElement;
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(el);
        
        // Add a small delay (e.g., 0ms, 100ms, 200ms...)
        el.style.transitionDelay = `${index * 100}ms`;
        
        observer.observe(el);
    });


    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/\D/g, ''); // Remove non-digits if starting slightly above 0 or just cleaner
                
                const inc = target / speed;

                const updateCount = () => {
                    const current = +counter.innerText.replace(/\D/g, '');
                    const suffix = counter.innerText.replace(/[0-9]/g, ''); // Keep specific suffix like % or +
                    
                    // Since we replaced innerText with '0+' in HTML, the first clean parsable might be 0.
                    // Let's rely on a variable instead of reading back from DOM for smoother animation.
                };

                // Let's rewrite the logic inside to be cleaner
                let currentCount = 0;
                const originalText = counter.innerText;
                const suffix = originalText.replace(/[0-9]/g, ''); // Extract + or %
                
                const updateCounter = () => {
                    const increment = target / 100; // Adjust speed factor here
                    
                    if(currentCount < target) {
                        currentCount = Math.ceil(currentCount + increment);
                        if(currentCount > target) currentCount = target;
                        counter.innerText = currentCount + suffix;
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // FAQ Accordion
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('svg');
            
            // Toggle Content
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                // Close other open FAQs (optional, but good UX)
                document.querySelectorAll('.faq-content').forEach(el => el.style.maxHeight = null);
                document.querySelectorAll('.faq-btn svg').forEach(el => el.style.transform = 'rotate(0deg)');

                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show-scroll');
        } else {
            backToTopBtn.classList.remove('show-scroll');
        }
    });

    if(backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Active Link Highlighting (Scroll Spy)
    const navLinks = document.querySelectorAll('.desktop-menu-text, .mobile-menu-bg a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // 150px offset to trigger slightly before the section hits top
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-text');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-text');
            }
        });
    });
    // Loader: Hide when page is ready
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        });
    }

    // Contact Form: Custom Thank You Message
    const contactForm = document.getElementById('contact-form');
    const thankYouMsg = document.getElementById('thank-you-message');
    if (contactForm && thankYouMsg) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            // If honeypot is filled, silently fail
            if (formData.get('_gotcha')) return;
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.classList.add('hidden');
                    thankYouMsg.classList.remove('hidden');
                } else {
                    alert('Sorry, there was a problem sending your message. Please try again later.');
                }
            })
            .catch(() => {
                alert('Sorry, there was a problem sending your message. Please try again later.');
            });
        });
    }
});