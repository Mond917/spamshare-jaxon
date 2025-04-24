/**
 * Parallax effects for Modern UI website
 * Adds depth and interactivity based on scroll position
 */

document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffects();
    
    console.log('Parallax effects initialized');
});

/**
 * Initialize parallax effects on page elements
 */
function initParallaxEffects() {
    // Basic parallax sections (using GSAP ScrollTrigger if available)
    if (typeof gsap !== 'undefined' && gsap.registerPlugin && ScrollTrigger) {
        // Already initialized in animations.js
        console.log('Using GSAP for parallax effects');
    } else {
        // Fallback to basic parallax
        setupBasicParallax();
    }
    
    // Setup mouse-based parallax for certain elements
    setupMouseParallax();
}

/**
 * Set up basic parallax effect for elements with data-speed attribute
 */
function setupBasicParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    // Check if we have sections to apply parallax to
    if (!parallaxSections.length) return;
    
    // Function to update parallax positions
    function updateParallaxPositions() {
        const scrollTop = window.pageYOffset;
        
        parallaxSections.forEach(section => {
            const speed = parseFloat(section.getAttribute('data-speed') || 0.5);
            const yOffset = scrollTop * speed;
            
            section.style.transform = `translateY(${yOffset}px)`;
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', updateParallaxPositions);
    
    // Initialize positions
    updateParallaxPositions();
}

/**
 * Setup mouse movement parallax effects
 */
function setupMouseParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    if (!heroSection) return;
    
    // Get elements that will move with mouse
    const heroContent = heroSection.querySelector('.hero-content');
    const floatingElements = document.querySelectorAll('.shape');
    
    if (!heroContent && !floatingElements.length) return;
    
    // Variables to track mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // Track the mouse position
    document.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to the center of the window
        mouseX = (e.clientX - window.innerWidth / 2) / 50;
        mouseY = (e.clientY - window.innerHeight / 2) / 50;
        
        // Apply movement to hero content if it exists
        if (heroContent) {
            gsap.to(heroContent, {
                x: -mouseX * 0.5,
                y: -mouseY * 0.5,
                duration: 1,
                ease: 'power2.out'
            });
        }
        
        // Apply movement to floating shapes
        floatingElements.forEach((shape, index) => {
            const depth = index % 4 + 1; // Create different depths
            
            gsap.to(shape, {
                x: -mouseX * (0.1 * depth),
                y: -mouseY * (0.1 * depth),
                duration: 1,
                ease: 'power2.out'
            });
        });
    });
    
    // Handle tilt effect for cards
    setupCardTiltEffect();
}

/**
 * Set up a 3D tilt effect for cards
 */
function setupCardTiltEffect() {
    const glassCards = document.querySelectorAll('.glass-card:not(.cta-card)');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Calculate the position of the mouse relative to the card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the card
            const y = e.clientY - rect.top;  // y position within the card
            
            // Calculate the tilt rotation (maximum 10 degrees)
            const tiltX = ((y / rect.height) - 0.5) * 10;
            const tiltY = ((x / rect.width) - 0.5) * -10;
            
            // Apply the tilt effect
            gsap.to(card, {
                rotationX: tiltX,
                rotationY: tiltY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformOrigin: 'center center'
            });
            
            // Create a highlight effect to follow the mouse
            const shineElement = card.querySelector('.card-shine') || createShineElement(card);
            
            // Position the shine effect based on mouse position
            const percentX = x / rect.width * 100;
            const percentY = y / rect.height * 100;
            
            shineElement.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%)`;
        });
        
        // Reset the card when mouse leaves
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            // Remove or fade out the shine effect
            const shineElement = card.querySelector('.card-shine');
            if (shineElement) {
                gsap.to(shineElement, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        if (shineElement.parentNode === card) {
                            card.removeChild(shineElement);
                        }
                    }
                });
            }
        });
    });
}

/**
 * Create a shine element for the card tilt effect
 * @param {HTMLElement} card - The card element to add the shine to
 * @returns {HTMLElement} The created shine element
 */
function createShineElement(card) {
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    shine.style.position = 'absolute';
    shine.style.top = '0';
    shine.style.left = '0';
    shine.style.width = '100%';
    shine.style.height = '100%';
    shine.style.borderRadius = 'inherit';
    shine.style.pointerEvents = 'none';
    shine.style.zIndex = '1';
    shine.style.opacity = '0';
    
    card.appendChild(shine);
    
    // Fade in the shine
    gsap.to(shine, {
        opacity: 1,
        duration: 0.5
    });
    
    return shine;
}
