/**
 * Main JavaScript file for the Modern UI website
 * Contains core functionality and initialization
 */

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initRevealAnimations();
    setupMicroInteractions();
    
    // Log that initialization is complete
    console.log('All core components initialized');
});

/**
 * Initialize reveal animations for elements with the reveal-element class
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    // Set up the IntersectionObserver
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get any delay attribute
                const delay = entry.target.dataset.delay || 0;
                
                // Add a timeout for the delay
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay * 1000);
                
                // Once revealed, no need to observe anymore
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // 10% of the element must be visible
        rootMargin: '0px 0px -50px 0px' // Adjust the trigger point
    });
    
    // Start observing all reveal elements
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * Setup micro-interactions for buttons and interactive elements
 */
function setupMicroInteractions() {
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
        
        button.addEventListener('mouseleave', (e) => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
        
        // Add click effect
        button.addEventListener('mousedown', (e) => {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1
            });
        });
        
        button.addEventListener('mouseup', (e) => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.1
            });
        });
    });
    
    // Add effects for cards
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            // Create a subtle glow effect
            gsap.to(card, {
                boxShadow: '0 15px 40px 0 var(--card-shadow)',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', (e) => {
            gsap.to(card, {
                boxShadow: '0 8px 32px 0 var(--card-shadow)',
                duration: 0.3
            });
        });
    });
    
    // Form field interactions
    const formFields = document.querySelectorAll('.form-control');
    
    formFields.forEach(field => {
        field.addEventListener('focus', (e) => {
            const parent = field.parentElement;
            const focusEffect = parent.querySelector('.form-focus-effect');
            
            if (focusEffect) {
                gsap.to(focusEffect, {
                    width: '100%',
                    duration: 0.3,
                    ease: 'power1.out'
                });
            }
        });
        
        field.addEventListener('blur', (e) => {
            const parent = field.parentElement;
            const focusEffect = parent.querySelector('.form-focus-effect');
            
            if (focusEffect && !field.value) {
                gsap.to(focusEffect, {
                    width: '0%',
                    duration: 0.3,
                    ease: 'power1.out'
                });
            }
        });
    });
}

/**
 * Initialize contact form with validation and animations
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate form
            const isValid = validateForm(contactForm);
            
            if (isValid) {
                // Show success animation
                const submitBtn = contactForm.querySelector('.submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnIcon = submitBtn.querySelector('.btn-icon');
                
                // Animate button to show progress/success
                gsap.to(btnText, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        btnText.textContent = 'Sent Successfully';
                        gsap.to(btnText, {
                            opacity: 1,
                            duration: 0.3
                        });
                    }
                });
                
                gsap.to(btnIcon, {
                    rotation: 360,
                    duration: 0.5,
                    onComplete: () => {
                        btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                    }
                });
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    
                    // Reset button text and icon
                    setTimeout(() => {
                        gsap.to(btnText, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                btnText.textContent = 'Send Message';
                                gsap.to(btnText, {
                                    opacity: 1,
                                    duration: 0.3
                                });
                            }
                        });
                        
                        gsap.to(btnIcon, {
                            rotation: 0,
                            duration: 0.5,
                            onComplete: () => {
                                btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                            }
                        });
                    }, 2000);
                }, 1500);
            }
        });
    }
}

/**
 * Validate form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightInvalidField(field);
        } else {
            // Additional validation for email fields
            if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                highlightInvalidField(field);
            } else {
                removeInvalidHighlight(field);
            }
        }
    });
    
    return isValid;
}

/**
 * Highlight an invalid form field with animation
 * @param {HTMLElement} field - The field to highlight
 */
function highlightInvalidField(field) {
    field.classList.add('is-invalid');
    
    // Shake animation
    gsap.fromTo(field, 
        { x: -5 },
        { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)', clearProps: 'x' }
    );
    
    // Add red glow
    gsap.to(field, {
        boxShadow: '0 0 0 3px rgba(255, 0, 0, 0.2)',
        borderColor: '#ff6b6b',
        duration: 0.3
    });
}

/**
 * Remove invalid highlighting from a form field
 * @param {HTMLElement} field - The field to update
 */
function removeInvalidHighlight(field) {
    field.classList.remove('is-invalid');
    
    // Restore original styling
    gsap.to(field, {
        boxShadow: '0 0 0 3px rgba(106, 90, 205, 0.2)',
        borderColor: 'var(--primary-color)',
        duration: 0.3
    });
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Initialize project filtering functionality
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterBtns.length && projectItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get filter value
                const filterValue = btn.getAttribute('data-filter');
                
                // Filter projects
                projectItems.forEach(item => {
                    const categories = item.getAttribute('data-categories');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        // Show the item with animation
                        gsap.to(item, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.4,
                            ease: 'power1.out',
                            clearProps: 'scale'
                        });
                        item.style.display = 'block';
                    } else {
                        // Hide the item with animation
                        gsap.to(item, {
                            opacity: 0,
                            scale: 0.8,
                            duration: 0.4,
                            ease: 'power1.out',
                            onComplete: () => {
                                item.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }
}

/**
 * Initialize project modal functionality
 */
function initProjectModals() {
    const projectViewBtns = document.querySelectorAll('.project-view-btn');
    const modalWrapper = document.querySelector('.project-modal-wrapper');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    
    if (projectViewBtns.length && modalWrapper) {
        // Sample project details (in a real app, this would come from your backend)
        const projectDetails = [
            {
                title: 'Modern UI Design',
                image: 'https://placehold.co/1200x800?text=UI+Design+Project',
                tags: ['UI/UX', 'Animation', 'Web Design'],
                description: 'A comprehensive UI redesign project focusing on modern design principles, fluid animations, and responsive layouts. The project involved creating a cohesive design system, implementing micro-interactions, and optimizing the user experience across all devices.'
            },
            {
                title: '3D Interactive Experience',
                image: 'https://placehold.co/1200x800?text=3D+Interactive+Project',
                tags: ['3D', 'Interactive', 'WebGL'],
                description: 'An immersive 3D web experience utilizing Three.js and WebGL. This project pushes the boundaries of web-based 3D rendering with interactive elements, custom shaders, and optimized performance across devices.'
            },
            {
                title: 'Motion Graphics',
                image: 'https://placehold.co/1200x800?text=Motion+Graphics+Project',
                tags: ['Animation', 'GSAP', 'SVG'],
                description: 'A collection of animated graphics and transitions created for a modern web application. Using GSAP and SVG animations, we developed a library of reusable animations that enhance the user experience while maintaining performance.'
            },
            {
                title: 'Responsive Frameworks',
                image: 'https://placehold.co/1200x800?text=Responsive+Framework+Project',
                tags: ['Responsive', 'CSS', 'Bootstrap'],
                description: 'A custom responsive framework built on top of Bootstrap to provide more flexibility and modern design components. The framework includes custom grid systems, component libraries, and utility classes optimized for performance.'
            }
        ];
        
        // Open modal when view button is clicked
        projectViewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = parseInt(btn.getAttribute('data-project-id')) - 1;
                const project = projectDetails[projectId];
                
                // Populate modal content
                const modalImage = modalWrapper.querySelector('.modal-image');
                const modalTitle = modalWrapper.querySelector('.modal-title');
                const modalTags = modalWrapper.querySelector('.modal-tags');
                const modalDescription = modalWrapper.querySelector('.modal-description');
                
                modalImage.src = project.image;
                modalTitle.textContent = project.title;
                
                // Clear and add tags
                modalTags.innerHTML = '';
                project.tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'project-tag';
                    tagEl.textContent = tag;
                    modalTags.appendChild(tagEl);
                });
                
                modalDescription.textContent = project.description;
                
                // Show modal with animation
                modalWrapper.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });
        
        // Close modal when close button is clicked
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                modalWrapper.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close modal when clicking outside
        modalWrapper.addEventListener('click', (event) => {
            if (event.target === modalWrapper) {
                modalWrapper.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}
