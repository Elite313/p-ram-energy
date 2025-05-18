// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced Parallax effect for sections
const parallaxSections = document.querySelectorAll('.parallax-section');
const parallaxImages = document.querySelectorAll('.parallax-scroll');

function handleParallax() {
    parallaxSections.forEach(section => {
        const distance = window.pageYOffset - section.offsetTop;
        const overlay = section.querySelector('.parallax-overlay');
        const bg = section.querySelector('.parallax-bg');
        
        if (overlay) {
            overlay.style.transform = `translateY(${distance * 0.5}px)`;
        }
        if (bg) {
            bg.style.transform = `translateY(${distance * 0.4}px)`;
        }
    });

    parallaxImages.forEach(image => {
        const rect = image.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
            image.style.transform = `translateY(${scrollPercent * 50}px)`;
        }
    });
}

window.addEventListener('scroll', handleParallax);
window.addEventListener('resize', handleParallax);

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stat-card')) {
                animateStats();
            }
        }
    });
}, observerOptions);

// Observe all elements with fade-in classes
document.querySelectorAll('.parallax-fade-in, .solution-card, .stat-card, .timeline-item, .highlight-item').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Mobile menu toggle with smooth animation
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');

if (!document.querySelector('.mobile-menu-btn')) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    navbar.insertBefore(mobileMenuBtn, navLinks);

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Enhanced Statistics animation
const statsSection = document.querySelector('.agriculture-stats');
let animated = false;

const animateStats = () => {
    if (animated) return;
    
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const step = duration / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.round(current) + (stat.textContent.includes('%') ? '%' : '+');
                requestAnimationFrame(() => setTimeout(updateCounter, step));
            } else {
                stat.textContent = target + (stat.textContent.includes('%') ? '%' : '+');
            }
        };
        
        updateCounter();
    });
    
    animated = true;
};

// Add scroll-based parallax for overview image
const overviewImage = document.querySelector('.overview-image');
if (overviewImage) {
    window.addEventListener('scroll', () => {
        const rect = overviewImage.getBoundingClientRect();
        const scrollPercent = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
        overviewImage.style.transform = `scale(${1 + scrollPercent * 0.1})`;
    });
}

// Process Carousel Functionality
function initProcessCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = track.querySelectorAll('.process-card');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // Including gap
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        updateDots();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        goToSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        goToSlide(currentIndex);
    }
    
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Auto-advance carousel
    let autoAdvance = setInterval(nextSlide, 5000);
    
    // Pause auto-advance on hover
    track.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    track.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(nextSlide, 5000);
    });
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initProcessCarousel();
    
    // Existing initialization code...
    handleParallax();
    
    // Add smooth reveal for sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px'
    });

    sections.forEach(section => {
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
    });
});
