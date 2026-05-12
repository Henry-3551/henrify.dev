function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.querySelector('button[onclick="toggleMenu()"]');
    const icon = button.querySelector('svg');
    menu.classList.toggle('open');
    document.body.classList.toggle('menu-open', menu.classList.contains('open'));
    button.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
    // Toggle icon between hamburger and close (X)
    if (menu.classList.contains('open')) {
        // Change to X icon
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    } else {
        // Change to hamburger icon
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    }
}

// Loader: Hide even if some assets stall
const loader = document.getElementById('loader');
if (loader) {
    const hideLoader = () => {
        if (loader.style.display === 'none') return;
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    };

    window.addEventListener('load', hideLoader, { once: true });
    setTimeout(hideLoader, 2500);
}

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = () => {
        if (!mobileMenu || !mobileMenu.classList.contains('open')) return;
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        const toggleButton = document.querySelector('button[onclick="toggleMenu()"]');
        if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', 'false');
            const toggleIcon = toggleButton.querySelector('svg');
            if (toggleIcon) {
                toggleIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            }
        }
    };

    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        const closeButton = mobileMenu.querySelector('.mobile-menu-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeMenu);
        }

        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) {
                closeMenu();
            }
        });
    }
    const nav = document.querySelector('.site-nav');
    const setNavState = () => {
        if (!nav) return;
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    setNavState();
    window.addEventListener('scroll', setNavState, { passive: true });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });


    // Hero sections for slide-up effect
    const heroSections = [
        document.getElementById('about'),
        document.getElementById('services'),
        document.getElementById('projects'),
        document.getElementById('contact')
    ].filter(Boolean);

    heroSections.forEach(section => {
        section.classList.add(section.id, 'reveal');
        observer.observe(section);
    });

    // All other sections (for backward compatibility)
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!heroSections.includes(section)) {
            section.classList.add('reveal');
            observer.observe(section);
        }
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

    // View More Projects button toggles hidden project cards
    const extraProjectCards = document.querySelectorAll('[data-project-card="extra"]');
    const viewMoreProjectsBtn = document.getElementById('view-more-projects');
    if (viewMoreProjectsBtn && extraProjectCards.length) {
        viewMoreProjectsBtn.addEventListener('click', () => {
            extraProjectCards.forEach(card => card.classList.remove('hidden'));
            viewMoreProjectsBtn.classList.add('hidden');
        });
    }


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

    // Back to Top Button (mobile-safe)
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const getScrollPosition = () => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const toggleBackToTop = () => {
            if (getScrollPosition() > 300) {
                backToTopBtn.classList.add('show-scroll');
            } else {
                backToTopBtn.classList.remove('show-scroll');
            }
        };

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();

        backToTopBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
            if (supportsSmoothScroll) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
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
        });

        let found = false;
        navLinks.forEach(link => {
            // Section links use #id, page links use filename
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-text');
                found = true;
            }
        });

        // If no section is active, highlight the nav link for the current page
        if (!found) {
            const page = window.location.pathname.split('/').pop();
            navLinks.forEach(link => {
                if (link.getAttribute('href') === page) {
                    link.classList.add('active-text');
                }
            });
        }
    });
    // Contact Form: API submit + redirect to Thank You page
    const contactForm = document.getElementById('contact-form');
    const contactError = document.getElementById('contact-error');
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const defaultButtonText = submitButton ? submitButton.textContent : 'Submit';

        const resolveContactApiUrl = () => {
            const datasetUrl = (contactForm.dataset.apiUrl || '').trim();
            const actionUrl = (contactForm.getAttribute('action') || '').trim();
            const fallbackUrl = 'https://henrify-dev.onrender.com/api/contact';
            const rawUrl = datasetUrl || actionUrl || fallbackUrl;

            try {
                return new URL(rawUrl, window.location.origin).toString();
            } catch (error) {
                return fallbackUrl;
            }
        };

        const contactApiUrl = resolveContactApiUrl();

        // Warm the Render API in the background so the first user submit is less likely to hit cold start.
        try {
            const healthUrl = new URL('/api/health', contactApiUrl).toString();
            fetch(healthUrl, { method: 'GET', cache: 'no-store', mode: 'cors' }).catch(() => {});
        } catch (error) {
            // No-op: health warmup is best effort.
        }

        const setSubmittingState = (isSubmitting, hintText = 'Sending...') => {
            if (!submitButton) return;

            submitButton.disabled = isSubmitting;
            submitButton.textContent = isSubmitting ? hintText : defaultButtonText;
            submitButton.classList.toggle('opacity-70', isSubmitting);
            submitButton.classList.toggle('cursor-not-allowed', isSubmitting);
        };

        const startedAtInput = contactForm.querySelector('input[name="form_started_at"]');
        if (startedAtInput && !startedAtInput.value) {
            startedAtInput.value = Date.now();
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            if (formData.get('_gotcha')) return;

            if (contactError) contactError.classList.add('hidden');

            const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                _gotcha: formData.get('_gotcha'),
                form_started_at: formData.get('form_started_at')
            };

            setSubmittingState(true);
            const coldStartHintTimer = setTimeout(() => {
                setSubmittingState(true, 'Waking server...');
            }, 3000);

            try {
                const response = await fetch(contactApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    clearTimeout(coldStartHintTimer);
                    setSubmittingState(false);
                    const data = await response.json().catch(() => ({}));
                    const message = data.error || 'Something went wrong. Please try again.';
                    if (contactError) {
                        contactError.textContent = message;
                        contactError.classList.remove('hidden');
                    }
                    return;
                }

                clearTimeout(coldStartHintTimer);
                window.location.href = 'thank-you.html';
            } catch (error) {
                clearTimeout(coldStartHintTimer);
                setSubmittingState(false);
                if (contactError) {
                    contactError.textContent = 'Something went wrong. Please try again.';
                    contactError.classList.remove('hidden');
                }
            }
        });
    }
});