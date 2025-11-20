// Main JavaScript for SANTA CLAUS site

// Ensure script is loaded
console.log('SANTA CLAUS script loaded');

// Theme Management
function initTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('santa-theme') || 'dark';
    const body = document.body;
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
    
    // Set snowflakes canvas opacity
    const canvas = document.getElementById('snowflakesCanvas');
    if (canvas) {
        canvas.style.opacity = '0.6';
    }
    
    // Theme toggle button
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            body.classList.toggle('light-theme');
            
                // Save theme preference
                const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
                localStorage.setItem('santa-theme', currentTheme);
                
                // Update snowflakes canvas opacity for light theme
                const canvas = document.getElementById('snowflakesCanvas');
                if (canvas) {
                    canvas.style.opacity = '0.6';
                    // Force redraw snowflakes with new colors
                    if (window.location) {
                        // Trigger a redraw by dispatching a resize event
                        window.dispatchEvent(new Event('resize'));
                    }
                }
        });
    }
}

// Wait for DOM to be ready
function init() {
    console.log('DOM ready, initializing...');
    try {
        initTheme(); // Initialize theme first
        // initNavigation(); // DISABLED - handled by inline script in HTML
        initButtons();
        initScrollEffects();
        initScrollAnimations();
        initHeaderScroll();
        console.log('All initialization complete (navigation disabled)');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Try multiple ways to ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already ready
    init();
}

// Navigation is handled by inline script in HTML - no fallback needed

// Navigation functionality - DISABLED (handled by inline script in HTML)
function initNavigation() {
    console.log('Navigation disabled - handled by inline script');
    // Only update active state on scroll, don't add click handlers
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 100);
    });
    updateActiveNav(); // Initial call
}

// Update active navigation based on scroll position
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item, .nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const sidebar = document.querySelector('.sidebar-nav');
    const sidebarHeight = sidebar ? sidebar.offsetHeight : 0;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const offset = 200;

    let currentSection = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // Check if section is in viewport with offset
        if (scrollPos + offset >= sectionTop && scrollPos + offset < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    // Update active link
    if (currentSection) {
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Initialize buttons
function initButtons() {
    // Buy Now Button (sidebar)
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const howToBuySection = document.querySelector('#how-to-buy');
            if (howToBuySection) {
                const sectionTop = howToBuySection.offsetTop - 100;
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Buy Now Button (hero)
    const buyNowBtnHero = document.getElementById('buyNowBtnHero');
    if (buyNowBtnHero) {
        buyNowBtnHero.addEventListener('click', function(e) {
            e.preventDefault();
            const howToBuySection = document.querySelector('#how-to-buy');
            if (howToBuySection) {
                const sectionTop = howToBuySection.offsetTop - 100;
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Explore Button - scroll to Hall of Fame section
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const hallOfFameSection = document.querySelector('#hall-of-fame');
            if (hallOfFameSection) {
                const sectionTop = hallOfFameSection.offsetTop - 100;
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
                
                // Update active nav item
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#hall-of-fame') {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Live on Solana Button - отключена (не кликабельна)
    const liveSolanaBtn = document.getElementById('liveSolanaBtn');
    if (liveSolanaBtn) {
        // Кнопка не кликабельна - обработчик клика удален
        liveSolanaBtn.style.cursor = 'default';
        liveSolanaBtn.style.pointerEvents = 'none';
    }

    // Step buttons in How to Buy section
    const stepButtons = document.querySelectorAll('.step-btn');
    stepButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Connect Wallet') {
                alert('Connecting wallet...\nPlease install Phantom or Solflare wallet extension.');
            } else if (buttonText === 'Buy SOL') {
                const binanceUrl = (typeof CONFIG !== 'undefined' && CONFIG.EXTERNAL && CONFIG.EXTERNAL.BINANCE_SOL) 
                    ? CONFIG.EXTERNAL.BINANCE_SOL 
                    : 'https://www.binance.com/en/trade/SOL_USDT';
                window.open(binanceUrl, '_blank');
            } else if (buttonText === 'Buy Now') {
                const howToBuySection = document.querySelector('#how-to-buy');
                if (howToBuySection) {
                    howToBuySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                alert('Redirecting to purchase page...');
            }
        });
    });

    // Copy contract address button
    const copyContractBtn = document.getElementById('copyContractBtn');
    if (copyContractBtn) {
        copyContractBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contractCode = document.getElementById('contractCode');
            if (contractCode) {
                const text = contractCode.textContent;
                
                // Copy to clipboard
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        showCopySuccess(this);
                    }).catch(() => {
                        fallbackCopy(text, this);
                    });
            } else {
                    fallbackCopy(text, this);
                }
            }
        });
    }

    // Social links - allow normal navigation (don't prevent default)
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        // Don't prevent default - let links work normally
        link.addEventListener('click', function(e) {
            const text = this.textContent.trim();
            const href = this.getAttribute('href');
            console.log(`${text} clicked, opening: ${href}`);
            // Link will open normally via href
        });
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                const section = document.querySelector(target);
                if (section) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const sectionTop = section.offsetTop - headerHeight;
                    window.scrollTo({
                        top: sectionTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Copy to clipboard with fallback
function fallbackCopy(text, button) {
            const textArea = document.createElement('textarea');
    textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
    
            try {
                document.execCommand('copy');
        showCopySuccess(button);
            } catch (err) {
                console.error('Failed to copy:', err);
        alert('Failed to copy. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 2000);
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for emblem
    window.addEventListener('scroll', function() {
        const emblem = document.querySelector('.emblem-circle');
        if (emblem) {
            const scrollY = window.pageYOffset;
            const parallaxSpeed = 0.3;
            const maxScroll = 500;
            
            if (scrollY < maxScroll) {
                emblem.style.transform = `translateY(${scrollY * parallaxSpeed}px) scale(1)`;
            }
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe cards and items
    const animatedElements = document.querySelectorAll('.fame-card, .step-card, .timeline-item, .stat-box');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Add hover effects to crypto items
document.addEventListener('DOMContentLoaded', function() {
    const cryptoItems = document.querySelectorAll('.crypto-item');
    
    cryptoItems.forEach(item => {
        item.addEventListener('click', function() {
            const cryptoName = this.querySelector('.crypto-name').textContent;
            console.log('Crypto item clicked:', cryptoName);
        });
    });
});

// Smooth scroll for logo
document.addEventListener('DOMContentLoaded', function() {
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Update active nav
            document.querySelectorAll('.nav-item, .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            const homeLink = document.querySelector('.nav-item[href="#home"], .nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        });
    }
});

