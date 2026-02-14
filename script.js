// Star Wars Datapad Navigation System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize timestamp
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
    
    // Add typing effect to initial load
    addLoadingEffect();
});

// Navigation System
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding section
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Play activation sound effect (simulated with visual feedback)
                playActivationEffect(this);
            }
        });
    });
}

// Visual feedback for button activation
function playActivationEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// Update timestamp in footer
function updateTimestamp() {
    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timestampElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// Add loading effect on initial page load
function addLoadingEffect() {
    const container = document.querySelector('.datapad-container');
    if (container) {
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.transition = 'opacity 0.5s ease-out';
            container.style.opacity = '1';
        }, 100);
    }
}

// Add hover sound effect simulation (visual feedback)
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.nav-button, .info-box, .mj-card')) {
        e.target.closest('.nav-button, .info-box, .mj-card').style.transition = 'all 0.2s ease';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    const navButtons = document.querySelectorAll('.nav-button');
    const activeButton = document.querySelector('.nav-button.active');
    const currentIndex = Array.from(navButtons).indexOf(activeButton);
    
    let newIndex = currentIndex;
    
    // Arrow key navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % navButtons.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + navButtons.length) % navButtons.length;
    }
    
    // Activate new button if index changed
    if (newIndex !== currentIndex) {
        navButtons[newIndex].click();
    }
});

// Add glitch effect on hover (optional enhancement)
function addGlitchEffect(element) {
    element.style.textShadow = '2px 2px #00d9ff, -2px -2px #ff3366';
    setTimeout(() => {
        element.style.textShadow = '';
    }, 50);
}

// Enhanced panel interactions
document.querySelectorAll('.mj-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add click feedback
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Add scanline effect to sections
function addScanlineEffect() {
    const sections = document.querySelectorAll('.content-section.active');
    sections.forEach(section => {
        section.style.position = 'relative';
    });
}

// Initialize additional effects
setTimeout(addScanlineEffect, 500);
