/**
 * Theme toggle functionality for Modern UI website
 * Enables switching between light and dark modes with smooth transitions
 */

document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    console.log('Theme toggle initialized');
});

/**
 * Initialize theme toggle functionality
 * Checks for saved preferences and sets up event listeners
 */
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Toggle theme when button is clicked
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply the theme change with animation
            animateThemeChange(newTheme);
            
            // Save preference to localStorage
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Also check for preferred color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkMode.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
        }
    });
}

/**
 * Set the current theme
 * @param {string} theme - The theme to apply ('light' or 'dark')
 */
function setTheme(theme) {
    const body = document.body;
    body.setAttribute('data-theme', theme);
    
    // Update theme button icons
    updateThemeButtonIcons(theme);
}

/**
 * Update theme button icons based on current theme
 * @param {string} theme - The current theme ('light' or 'dark')
 */
function updateThemeButtonIcons(theme) {
    const sunIcon = document.querySelector('#theme-switch .fa-sun');
    const moonIcon = document.querySelector('#theme-switch .fa-moon');
    
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'scale(1)';
            moonIcon.style.opacity = '0';
            moonIcon.style.transform = 'scale(0)';
        } else {
            sunIcon.style.opacity = '0';
            sunIcon.style.transform = 'scale(0)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'scale(1)';
        }
    }
}

/**
 * Animate the theme change with smooth transitions
 * @param {string} newTheme - The theme to transition to
 */
function animateThemeChange(newTheme) {
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');
    
    // Create a ripple effect from the button
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.position = 'fixed';
    ripple.style.top = '0';
    ripple.style.left = '0';
    ripple.style.width = '100vw';
    ripple.style.height = '100vh';
    ripple.style.backgroundColor = newTheme === 'dark' ? '#121212' : '#f8f9fc';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '0';
    ripple.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
    
    body.appendChild(ripple);
    
    // Get button position for ripple center
    const buttonRect = themeSwitch.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Set ripple position and trigger animation
    ripple.style.transformOrigin = `${buttonCenterX}px ${buttonCenterY}px`;
    
    // Force reflow
    ripple.offsetWidth;
    
    // Start animation
    ripple.style.transform = 'scale(3)';
    ripple.style.opacity = '1';
    
    // Apply theme change and update UI elements
    setTimeout(() => {
        setTheme(newTheme);
        
        // Animate 3D objects if they exist
        animateTheme3DObjects(newTheme);
        
        // Fade out ripple
        ripple.style.opacity = '0';
        
        // Remove ripple element after animation
        setTimeout(() => {
            if (ripple.parentNode === body) {
                body.removeChild(ripple);
            }
        }, 800);
    }, 400);
    
    // Animate the toggle button
    gsap.to(themeSwitch, {
        rotate: 360,
        duration: 0.5,
        ease: 'power2.out'
    });
    
    // Create ambient light flicker effect during transition
    createAmbientLightEffect(newTheme);
}

/**
 * Create an ambient light effect during theme transition
 * @param {string} newTheme - The theme being transitioned to
 */
function createAmbientLightEffect(newTheme) {
    const elements = document.querySelectorAll('.glass-card, .feature-icon, .value-icon, .team-image');
    
    // Create subtle light flicker effect
    elements.forEach((element, index) => {
        const delay = index * 0.05;
        
        gsap.to(element, {
            boxShadow: newTheme === 'dark' 
                ? '0 8px 32px rgba(134, 119, 222, 0.3)' 
                : '0 8px 32px rgba(106, 90, 205, 0.2)',
            duration: 0.4,
            delay: delay,
            yoyo: true,
            repeat: 1
        });
    });
    
    // Animate background shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const delay = index * 0.1;
        
        gsap.to(shape, {
            opacity: 0.3,
            scale: 1.2,
            duration: 0.5,
            delay: delay,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
}

/**
 * Animate 3D objects based on theme change
 * @param {string} newTheme - The new theme being applied
 */
function animateTheme3DObjects(newTheme) {
    const hero3DScene = document.getElementById('hero-3d-scene');
    const about3DScene = document.getElementById('about-3d-scene');
    
    // Scale effect for 3D scenes if they exist
    if (hero3DScene) {
        gsap.fromTo(hero3DScene, 
            { scale: 0.8, opacity: 0.5 },
            { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
        );
    }
    
    if (about3DScene) {
        gsap.fromTo(about3DScene, 
            { scale: 0.8, opacity: 0.5 },
            { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
        );
    }
    
    // Notify 3D scripts about theme change if available
    if (typeof updateTheme3DScenes === 'function') {
        updateTheme3DScenes(newTheme);
    }
}

/**
 * Detect system preference for dark mode
 * @returns {boolean} True if system prefers dark mode
 */
function detectSystemDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Watch for system theme changes and update if not overridden by user
 */
function watchSystemThemeChanges() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', e => {
            // Only apply if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Initialize theme watcher when page loads
document.addEventListener('DOMContentLoaded', watchSystemThemeChanges);
