const SCROLL_THRESHOLDS = {
    HEADER_SCROLL: 50,
    MOTTO_ANIMATION: 260,
    NAVIGATION_OFFSET: 100
};

const PARALLAX_MULTIPLIERS = {
    HERO_CONTENT_Y: 0.3,
    BIG_PLANET_Y: 1.8,
    BIG_PLANET_X: 0.2,
    PLANETS_Y: 0.8,
    PLANETS_X: 0.06,
    SATURN_Y: 1.5,
    SATURN_X: 0.15,
    ROCKET_Y: 1.0,
    ROCKET_X: 0.4,
    COMET_Y: 1.7,
    COMET_X: 0.8
};

const FOOTER_PARALLAX_MULTIPLIERS = {
    ALIEN_X: 0.2,
    ALIEN_Y: 0.15,
    COMET_X: 0.05,
    COMET_Y: 0.03
};

const ANIMATION_TIMINGS = {
    CHAR_DELAY_BASE: 300,
    COLUMN_DELAY: 1500,
    HOVER_DURATION: 1000,
    SPEED_MULTIPLIERS: [1, 1.5, 3]
};

const RESPONSIVE_BREAKPOINTS = {
    TABLET_MAX: 1024,
    MOBILE_MAX: 768,
    MOBILE_SMALL_MAX: 480
};

const INTERSECTION_OBSERVER_CONFIG = {
    THRESHOLD: 0.5,
    ROOT_MARGIN: '0px 0px 0px 0px'
};

const navToggle = document.querySelector('.header__toggle');
const navMenu = document.querySelector('.header__menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

const navLinks = document.querySelectorAll('.header__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


const header = document.querySelector('.header');

function updateHeaderOnScroll() {
    const scrolled = window.pageYOffset;
    
    if (scrolled > SCROLL_THRESHOLDS.HEADER_SCROLL) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
    
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.header__link');
let currentSelectedSection = '';

function updateActiveNavItem() {
    const scrollPosition = window.scrollY + SCROLL_THRESHOLDS.NAVIGATION_OFFSET;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSelectedSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSelectedSection}`) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    updateHeaderOnScroll();
    updateActiveNavItem();
});
window.addEventListener('load', () => {
    updateHeaderOnScroll();
    updateActiveNavItem();
});

const windowContainer = document.querySelector('.hero__window');
const heroContent = document.querySelector('.hero__content');
const bigPlanetImage = document.querySelector('.hero__parallax--big-planet');
const planetsImage = document.querySelector('.hero__parallax--planets');
const saturnImage = document.querySelector('.hero__parallax--saturn');
const rocketImage = document.querySelector('.hero__parallax--rocket');
const cometImage = document.querySelector('.hero__parallax--comet');

function updateWindowBackground() {

    if (!windowContainer) return;
    if(currentSelectedSection !== 'home') return;
    
    const scrolled = window.pageYOffset;
    
    if (scrolled >= SCROLL_THRESHOLDS.MOTTO_ANIMATION && !mottoAnimationStarted) {
        mottoAnimationStarted = true;
        initMottoAnimation();
    }
    
    
    if (heroContent) {
    const contentY = -(scrolled * PARALLAX_MULTIPLIERS.HERO_CONTENT_Y);
        heroContent.style.transform = `translateY(${contentY}px)`;
    }
    
    if (bigPlanetImage) {
    const bigPlanetY = -(scrolled * PARALLAX_MULTIPLIERS.BIG_PLANET_Y);
    const bigPlanetX = scrolled * PARALLAX_MULTIPLIERS.BIG_PLANET_X;
        bigPlanetImage.style.transform = `translate(${bigPlanetX}px, ${bigPlanetY}px)`;
    }
    
    if (planetsImage) {
    const planetsY = -(scrolled * PARALLAX_MULTIPLIERS.PLANETS_Y);
    const planetsX = -(scrolled * PARALLAX_MULTIPLIERS.PLANETS_X);
        planetsImage.style.transform = `translate(${planetsX}px, ${planetsY}px)`;
    }
    
    if (saturnImage) {
    const saturnY = -(scrolled * PARALLAX_MULTIPLIERS.SATURN_Y);
    const saturnX = -(scrolled * PARALLAX_MULTIPLIERS.SATURN_X);
        saturnImage.style.transform = `translate(${saturnX}px, ${saturnY}px)`;
    }
    
    if (rocketImage) {
    const rocketY = -(scrolled * PARALLAX_MULTIPLIERS.ROCKET_Y);
    const rocketX = scrolled * PARALLAX_MULTIPLIERS.ROCKET_X;
        rocketImage.style.transform = `translate(${rocketX}px, ${rocketY}px)`;
    }

    if (cometImage) {
        const cometY = -(scrolled * PARALLAX_MULTIPLIERS.COMET_Y);
        const cometX = -(scrolled * PARALLAX_MULTIPLIERS.COMET_X);
        cometImage.style.transform = `translate(${cometX}px, ${cometY}px)`;
    }


}

let windowScrollTicking = false;
function requestWindowScrollTick() {
    if (!windowScrollTicking) {
        requestAnimationFrame(() => {
            updateWindowBackground();
            windowScrollTicking = false;
        });
        windowScrollTicking = true;
    }
}

window.addEventListener('scroll', requestWindowScrollTick, { passive: true });

function initMottoAnimation() {
    const mottoContainer = document.querySelector('.hero__motto-jp');
    const translationContainer = document.querySelector('.hero__motto-translation');
    const buttonsContainer = document.querySelector('.hero__buttons');
    const mottoTexts = document.querySelectorAll('.hero__motto-text');
    const translationSpans = document.querySelectorAll('.hero__motto-line');
    
    mottoContainer.style.opacity = '1';
    translationContainer.style.opacity = '1';
    
    mottoTexts.forEach((textElement, columnIndex) => {
        const text = textElement.textContent;
        textElement.innerHTML = '';
        
        text.split('').forEach((char, charIndex) => {
            const span = document.createElement('span');
            span.className = 'hero__motto-char';
            span.textContent = char;
            textElement.appendChild(span);
        });
    });
    
    mottoTexts.forEach((textElement, columnIndex) => {
        const chars = textElement.querySelectorAll('.hero__motto-char');
        const correspondingTranslation = translationSpans[columnIndex];
        
        const speedMultiplier = ANIMATION_TIMINGS.SPEED_MULTIPLIERS[columnIndex] || 1;
        const charDelay = Math.round(ANIMATION_TIMINGS.CHAR_DELAY_BASE / speedMultiplier);
        
        setTimeout(() => {
            if (correspondingTranslation) {
                correspondingTranslation.classList.add('visible');
            }
            
            chars.forEach((char, charIndex) => {
                setTimeout(() => {
                    char.classList.add('visible');
                }, charIndex * charDelay);
            });
        }, columnIndex * ANIMATION_TIMINGS.COLUMN_DELAY);
    });
    
    if (buttonsContainer && areButtonsVisibleWithoutScrolling() && !buttonsAnimationStarted) {
        buttonsAnimationStarted = true;
        buttonsContainer.classList.add('visible');
    }
}

let mottoAnimationStarted = false;
let buttonsAnimationStarted = false;

const buttonsContainer = document.querySelector('.hero__buttons');

const buttonsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !buttonsAnimationStarted) {
            buttonsAnimationStarted = true;
            if (buttonsContainer) {
                buttonsContainer.classList.add('visible');
            }
        }
    });
}, {
    threshold: INTERSECTION_OBSERVER_CONFIG.THRESHOLD,
    rootMargin: INTERSECTION_OBSERVER_CONFIG.ROOT_MARGIN
});

function areButtonsVisibleWithoutScrolling() {
    if (!buttonsContainer) return false;
    
    const rect = buttonsContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    return rect.top >= 0 && rect.top <= windowHeight && 
           rect.bottom >= 0 && rect.bottom <= windowHeight;
}

if (buttonsContainer) {
    if (areButtonsVisibleWithoutScrolling()) {
        //Buttons visible without scrolling - will trigger with motto
    } else {
        buttonsObserver.observe(buttonsContainer);
    }
    buttonsContainer.addEventListener('animationend', function(event) {

        if(window.innerWidth > RESPONSIVE_BREAKPOINTS.TABLET_MAX) return;

        if (event.animationName === 'fadeInFromLeft' || event.animationName === 'fadeInFromRight') {
            const blobButtons = buttonsContainer.querySelectorAll('.hero__button--blob');
            blobButtons.forEach(button => {
                button.classList.add('hover');
            });
            
            setTimeout(() => {
                blobButtons.forEach(button => {
                    button.classList.remove('hover');
                });
            }, ANIMATION_TIMINGS.HOVER_DURATION);
        }
    });
}

const footerCometImage = document.querySelector('.footer__parallax--comet');
const footerAlienImage = document.querySelector('.footer__parallax--alien');

function updateFooterParallax() {
    const scrolled = window.pageYOffset;
    const footerSection = document.getElementById('footer');
    
    if (!footerSection) return;
    
    const footerRect = footerSection.getBoundingClientRect();
    const footerTop = footerRect.top + scrolled;
    
    if (scrolled >= footerTop - window.innerHeight) {
        const footerScroll = Math.max(0, scrolled - (footerTop - window.innerHeight));
        
        if (footerAlienImage) {
            const alienX = footerScroll * FOOTER_PARALLAX_MULTIPLIERS.ALIEN_X;
            const alienY = footerScroll * FOOTER_PARALLAX_MULTIPLIERS.ALIEN_Y;
            footerAlienImage.style.transform = `translate(${alienX}px, ${alienY}px)`;
        }
        
        if (footerCometImage) {
            const cometX = -(footerScroll * FOOTER_PARALLAX_MULTIPLIERS.COMET_X);
            const cometY = -(footerScroll * FOOTER_PARALLAX_MULTIPLIERS.COMET_Y);
            footerCometImage.style.transform = `translate(${cometX}px, ${cometY}px)`;
        }
    } else {
        if (footerAlienImage) {
            footerAlienImage.style.transform = `translate(0px, 0px)`;
        }
        if (footerCometImage) {
            footerCometImage.style.transform = `translate(0px, 0px)`;
        }
    }
}

let footerScrollTicking = false;
function requestFooterScrollTick() {
    if (!footerScrollTicking) {
        requestAnimationFrame(() => {
            updateFooterParallax();
            footerScrollTicking = false;
        });
        footerScrollTicking = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateWindowBackground();
    updateFooterParallax();
});

window.addEventListener('scroll', requestFooterScrollTick, { passive: true });


document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > RESPONSIVE_BREAKPOINTS.MOBILE_MAX) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});


