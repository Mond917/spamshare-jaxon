/**
 * Animations script for Modern UI website
 * Contains GSAP animations and effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations
    initGSAPAnimations();
    
    // Set up ScrollTrigger for parallax and scroll-based animations
    setupScrollTrigger();
    
    console.log('Animations initialized');
});

/**
 * Initialize GSAP animations
 */
function initGSAPAnimations() {
    // Register ScrollTrigger plugin if it exists
    if (gsap && gsap.registerPlugin && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Hero section animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.from(heroContent.querySelector('h1'), {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
        
        gsap.from(heroContent.querySelector('p'), {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from(heroContent.querySelector('.hero-buttons'), {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.6,
            ease: 'power3.out'
        });
    }
    
    // Animate background shapes
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length) {
        shapes.forEach(shape => {
            gsap.to(shape, {
                x: 'random(-20, 20)',
                y: 'random(-20, 20)',
                duration: 'random(15, 25)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    }
    
    // Animate cards on hover
    setupCardHoverEffects();
}

/**
 * Setup card hover effects with GSAP
 */
function setupCardHoverEffects() {
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        
        card.addEventListener('mouseenter', () => {
            if (icon) {
                gsap.to(icon, {
                    y: -10,
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                gsap.to(icon, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            }
        });
    });
    
    // Team cards hover effect
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const image = card.querySelector('.team-image');
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                gsap.to(image, {
                    y: -10,
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                    duration: 0.3
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                gsap.to(image, {
                    y: 0,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    duration: 0.3
                });
            }
        });
    });
    
    // Contact form inputs
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });
}

/**
 * Setup ScrollTrigger for parallax and scroll-based animations
 */
function setupScrollTrigger() {
    // Setup parallax sections
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    if (parallaxSections.length && gsap && ScrollTrigger) {
        parallaxSections.forEach(section => {
            const speed = section.getAttribute('data-speed') || 0.1;
            
            gsap.to(section, {
                y: () => ScrollTrigger.maxScroll(window) * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }
    
    // Animate stats counting on scroll
    const statsItems = document.querySelectorAll('.counter');
    
    if (statsItems.length && gsap && ScrollTrigger) {
        statsItems.forEach(item => {
            const target = parseInt(item.textContent);
            
            // Reset to zero initially
            gsap.set(item, { innerText: '0' });
            
            ScrollTrigger.create({
                trigger: item,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(item, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 },
                        ease: 'power1.inOut'
                    });
                },
                once: true
            });
        });
    }
    
    // Animate section headers on scroll
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    if (sectionHeaders.length && gsap && ScrollTrigger) {
        sectionHeaders.forEach(header => {
            const title = header.querySelector('h2');
            const subtitle = header.querySelector('p');
            
            if (title && subtitle) {
                ScrollTrigger.create({
                    trigger: header,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.from(title, {
                            y: 50,
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power3.out'
                        });
                        
                        gsap.from(subtitle, {
                            y: 30,
                            opacity: 0,
                            duration: 0.8,
                            delay: 0.2,
                            ease: 'power3.out'
                        });
                    },
                    once: true
                });
            }
        });
    }
}

/**
 * Creates a staggered animation for multiple elements
 * @param {NodeList} elements - The elements to animate
 * @param {Object} fromVars - The starting animation variables
 * @param {Object} options - Additional animation options
 */
function createStaggerAnimation(elements, fromVars, options = {}) {
    const defaults = {
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            start: 'top 80%',
            once: true
        }
    };
    
    const config = { ...defaults, ...options };
    
    if (elements.length && gsap) {
        if (config.scrollTrigger && ScrollTrigger) {
            ScrollTrigger.batch(elements, {
                start: config.scrollTrigger.start,
                onEnter: batch => {
                    gsap.from(batch, {
                        ...fromVars,
                        stagger: config.stagger,
                        duration: config.duration,
                        ease: config.ease
                    });
                },
                once: config.scrollTrigger.once
            });
        } else {
            gsap.from(elements, {
                ...fromVars,
                stagger: config.stagger,
                duration: config.duration,
                ease: config.ease
            });
        }
    }
}
