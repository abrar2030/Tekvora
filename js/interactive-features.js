// Animations and Interactive Features
document.addEventListener('DOMContentLoaded', function() {
  // Initialize loading screen
  initLoadingScreen();
  
  // Initialize custom cursor
  initCustomCursor();
  
  // Initialize navigation and scroll effects
  initNavigation();
  
  // Initialize typewriter effect
  initTypewriter();
  
  // Initialize skill progress bars
  initSkillBars();
  
  // Initialize statistics counter
  initStatCounter();
  
  // Initialize project cards
  initProjectCards();
  
  // Initialize voice commands
  initVoiceCommands();
  
  // Initialize AI assistant
  initAIAssistant();
  
  // Initialize theme toggle
  initThemeToggle();
  
  // Initialize scroll animations
  initScrollAnimations();
});

// Loading Screen Animation
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.querySelector('.progress-bar');
  const loaderInfo = document.querySelector('.loader-info');
  
  let progress = 0;
  const totalAssets = 10; // Approximate number of assets to load
  let loadedAssets = 0;
  
  // Simulate asset loading
  const assetTypes = [
    'Loading 3D environment...',
    'Initializing particle systems...',
    'Loading shaders...',
    'Preparing holographic effects...',
    'Configuring voice recognition...',
    'Initializing AI assistant...',
    'Loading skill data...',
    'Preparing project information...',
    'Configuring interactive elements...',
    'Finalizing experience...'
  ];
  
  const loadingInterval = setInterval(() => {
    loadedAssets++;
    progress = (loadedAssets / totalAssets) * 100;
    
    progressBar.style.width = `${progress}%`;
    loaderInfo.textContent = assetTypes[loadedAssets - 1] || 'Almost ready...';
    
    if (loadedAssets >= totalAssets) {
      clearInterval(loadingInterval);
      
      // Fade out loading screen using standard JavaScript instead of gsap
      setTimeout(() => {
        // Create fade out effect
        let opacity = 1;
        const fadeEffect = setInterval(() => {
          if (opacity > 0) {
            opacity -= 0.1;
            loadingScreen.style.opacity = opacity;
          } else {
            clearInterval(fadeEffect);
            loadingScreen.style.display = 'none';
            
            // Trigger entrance animations
            triggerEntranceAnimations();
          }
        }, 50);
      }, 500);
    }
  }, 400);
}

// Trigger entrance animations after loading
function triggerEntranceAnimations() {
  // Use standard JavaScript animations instead of gsap
  const animateElement = (selector, delay) => {
    setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    }, delay);
  };
  
  // Set initial styles for elements to be animated
  const elementsToAnimate = [
    '.hero-name', 
    '.hero-title', 
    '.hero-subtitle', 
    '.hero-cta', 
    '.social-links', 
    '.scroll-indicator'
  ];
  
  elementsToAnimate.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.transform = 'translateY(30px)';
      el.style.opacity = '0';
      el.style.transition = 'transform 1s ease, opacity 1s ease';
    });
  });
  
  // Animate elements with delays
  animateElement('.hero-name', 100);
  animateElement('.hero-title', 400);
  animateElement('.hero-subtitle', 700);
  
  // Start typewriter effect after entrance animation
  setTimeout(() => {
    if (typeof startTypewriter === 'function') {
      startTypewriter();
    }
  }, 1000);
  
  animateElement('.hero-cta', 1000);
  animateElement('.social-links', 1300);
  
  // Animate scroll indicator with continuous effect
  setTimeout(() => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = '1';
      
      // Add pulsing animation
      scrollIndicator.style.animation = 'pulse 2s infinite';
      
      // Add keyframes for pulse animation if not already in CSS
      if (!document.querySelector('#pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = `
          @keyframes pulse {
            0% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(10px); opacity: 0.7; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, 1600);
}

// Custom Cursor
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (!cursor || !cursorFollower) return;
  
  document.addEventListener('mousemove', (e) => {
    // Use standard JS instead of gsap
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    // Add transition for follower for smooth movement
    cursorFollower.style.transition = 'transform 0.3s ease';
    cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
  
  // Change cursor style on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .nav-link, .project-card, .social-icon, .cta-button');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '15px';
      cursor.style.height = '15px';
      cursor.style.background = 'var(--tertiary-color)';
      
      cursorFollower.style.width = '40px';
      cursorFollower.style.height = '40px';
      cursorFollower.style.borderColor = 'var(--tertiary-color)';
      cursorFollower.style.transform = `translate(${parseInt(cursorFollower.style.transform.split('(')[1])}px, ${parseInt(cursorFollower.style.transform.split(',')[1])}px) scale(1.5)`;
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursor.style.background = 'var(--secondary-color)';
      
      cursorFollower.style.width = '30px';
      cursorFollower.style.height = '30px';
      cursorFollower.style.borderColor = 'var(--secondary-color)';
      cursorFollower.style.transform = `translate(${parseInt(cursorFollower.style.transform.split('(')[1])}px, ${parseInt(cursorFollower.style.transform.split(',')[1])}px) scale(1)`;
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
      cursor.style.opacity = '0';
      cursorFollower.style.opacity = '0';
    }
  });
  
  document.addEventListener('mouseover', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
}

// Navigation and Scroll Effects
function initNavigation() {
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
  
  // Smooth scroll to sections
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        if (nav.classList.contains('active')) {
          menuToggle.classList.remove('active');
          nav.classList.remove('active');
        }
        
        // Smooth scroll to section
        window.scrollTo({
          top: targetSection.offsetTop - header.offsetHeight,
          behavior: 'smooth'
        });
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
  
  // Update active nav link on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = `#${section.id}`;
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  });
  
  // CTA buttons scroll
  const exploreBtn = document.querySelector('.explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        window.scrollTo({
          top: aboutSection.offsetTop - header.offsetHeight,
          behavior: 'smooth'
        });
      }
    });
  }
  
  const contactBtn = document.querySelector('.contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const aiAssistantSection = document.getElementById('ai-assistant');
      if (aiAssistantSection) {
        window.scrollTo({
          top: aiAssistantSection.offsetTop - header.offsetHeight,
          behavior: 'smooth'
        });
      }
    });
  }
}

// Typewriter Effect
function initTypewriter() {
  const typingTextElement = document.querySelector('.typing-text');
  if (!typingTextElement) return;
  
  const phrases = [
    'DevOps Engineer',
    'Cloud Infrastructure Specialist',
    'Full-Stack Developer',
    'Software Architect',
    'Automation Expert'
  ];
  
  let currentPhraseIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  window.startTypewriter = function() {
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
      // Deleting text
      typingTextElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      typingSpeed = 50;
    } else {
      // Typing text
      typingTextElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
      currentCharIndex++;
      typingSpeed = 100;
    }
    
    // Check if word is complete
    if (!isDeleting && currentCharIndex === currentPhrase.length) {
      // Pause at the end of the word
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && currentCharIndex === 0) {
      // Move to next word
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }
    
    setTimeout(startTypewriter, typingSpeed);
  };
  
  // Typewriter will be started after entrance animations
}

// Skill Progress Bars
function initSkillBars() {
  // Implementation remains the same
}

// Statistics Counter
function initStatCounter() {
  // Implementation remains the same
}

// Project Cards
function initProjectCards() {
  // Implementation remains the same
}

// Voice Commands
function initVoiceCommands() {
  // Implementation remains the same
}

// AI Assistant
function initAIAssistant() {
  // Implementation remains the same
}

// Theme Toggle
function initThemeToggle() {
  // Implementation remains the same
}

// Scroll Animations
function initScrollAnimations() {
  // Use Intersection Observer instead of GSAP
  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  };
  
  const observer = new IntersectionObserver(animateOnScroll, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  });
  
  // Add animation classes to elements
  const animatedElements = document.querySelectorAll('.section-title, .about-text, .about-stats, .contact-info, .skill-item, .project-card');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
  
  // Add CSS for the animation
  if (!document.querySelector('#scroll-animations')) {
    const style = document.createElement('style');
    style.id = 'scroll-animations';
    style.textContent = `
      .animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
}
