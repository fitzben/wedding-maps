// ============================================
// WEDDING WEBSITE - Main JavaScript
// ============================================

// DOM Elements
const musicControl = document.getElementById('musicControl') as HTMLButtonElement;
const bgMusic = document.getElementById('bgMusic') as HTMLAudioElement;
const particlesContainer = document.getElementById('particles') as HTMLDivElement;

// ============================================
// MUSIC CONTROL
// ============================================

let isMusicPlaying = false;
let userWantsMusic = true;
let pausedByBackground = false;

// Initialize music
// function initMusic(): void {
//   if (bgMusic) {
//     bgMusic.volume = 0.3; // Set default volume (0-1)

//     // Try to autoplay (note: most browsers block autoplay)
//     const playPromise = bgMusic.play();

//     if (playPromise !== undefined) {
//       playPromise
//         .then(() => {
//           isMusicPlaying = true;
//           musicControl?.classList.remove('muted');
//         })
//         .catch(() => {
//           // Autoplay was prevented, wait for user interaction
//           isMusicPlaying = false;
//           musicControl?.classList.add('muted');
//         });
//     }
//   }
// }

function initMusic(): void {
  if (bgMusic) {
    bgMusic.volume = 0.3;

    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          userWantsMusic = true;
          musicControl?.classList.remove('muted');
        })
        .catch(() => {
          // Autoplay blocked by browser
          isMusicPlaying = false;
          musicControl?.classList.add('muted');

          // Wait for first user interaction
          const startMusic = () => {
            if (!userWantsMusic) return;
            bgMusic
              .play()
              .then(() => {
                isMusicPlaying = true;
                musicControl?.classList.remove('muted');
              })
              .catch(() => {
                isMusicPlaying = false;
                musicControl?.classList.add('muted');
              });

            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
          };

          document.addEventListener('click', startMusic);
          document.addEventListener('touchstart', startMusic);
        });
    }
  }
}

// Toggle music on/off
function toggleMusic(): void {
  if (!bgMusic) return;

  if (isMusicPlaying) {
    bgMusic.pause();
    musicControl?.classList.add('muted');
    userWantsMusic = false;
  } else {
    userWantsMusic = true;
    bgMusic
      .play()
      .then(() => {
        isMusicPlaying = true;
        musicControl?.classList.remove('muted');
      })
      .catch(() => {
        isMusicPlaying = false;
        musicControl?.classList.add('muted');
      });
  }

  if (userWantsMusic === false) {
    isMusicPlaying = false;
  }
}

// Event listener for music control button
musicControl?.addEventListener('click', toggleMusic);

function pauseForBackground(): void {
  if (!bgMusic) return;
  if (bgMusic.paused) return;

  pausedByBackground = true;
  bgMusic.pause();
  isMusicPlaying = false;
  musicControl?.classList.add('muted');
}

function resumeFromBackground(): void {
  if (!bgMusic) return;
  if (!pausedByBackground) return;
  pausedByBackground = false;

  if (!userWantsMusic) return;

  bgMusic
    .play()
    .then(() => {
      isMusicPlaying = true;
      musicControl?.classList.remove('muted');
    })
    .catch(() => {
      isMusicPlaying = false;
      musicControl?.classList.add('muted');
    });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseForBackground();
  } else {
    resumeFromBackground();
  }
});

// Extra coverage for mobile/desktop cases where visibilitychange isn't enough
window.addEventListener('pagehide', pauseForBackground);
window.addEventListener('blur', pauseForBackground);
window.addEventListener('focus', resumeFromBackground);

// ============================================
// FLOATING PARTICLES
// ============================================

function createParticles(): void {
  if (!particlesContainer) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 3; // 3-7px
    const left = Math.random() * 100; // 0-100%
    const delay = Math.random() * 15; // 0-15s delay
    const duration = Math.random() * 10 + 12; // 12-22s duration
    const opacity = Math.random() * 0.4 + 0.2; // 0.2-0.6 opacity

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      --particle-opacity: ${opacity};
    `;

    particlesContainer.appendChild(particle);
  }
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================

function initScrollAnimations(): void {
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll('.slide-up, .fade-in-up');
  for (const el of animatedElements) {
    observer.observe(el);
  }
}

// ============================================
// SMOOTH SCROLL FOR INTERNAL LINKS
// ============================================

function initSmoothScroll(): void {
  const links = document.querySelectorAll('a[href^="#"]');

  for (const link of links) {
    link.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const href = (link as HTMLAnchorElement).getAttribute('href');
      if (!href) return;

      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}

// ============================================
// LIGHT GLOW EFFECT ON MOUSE MOVE
// ============================================

function initGlowEffect(): void {
  const hero = document.querySelector('.hero') as HTMLElement;
  if (!hero) return;

  // Create glow element
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(201, 169, 98, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener('mousemove', (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  // Smooth follow animation
  function animateGlow(): void {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

// ============================================
// WELCOME TEXT ANIMATION (staggered reveal)
// ============================================

function enhanceWelcomeAnimation(): void {
  const el = document.querySelector('.welcome-guide') as HTMLElement | null;
  if (!el) return;

  const raw = (el.textContent ?? '').trim();
  if (!raw) return;

  // Avoid double-processing (e.g. hot reload)
  if (el.dataset.enhanced === 'true') return;
  el.dataset.enhanced = 'true';

  el.classList.add('welcome-guide--split');
  el.textContent = '';

  const words = raw.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = document.createElement('span');
    word.className = 'welcome-word';
    word.textContent = words[i];
    word.style.setProperty('--d', `${i * 55}ms`);
    el.appendChild(word);

    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }
  }
}

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMusic();
  createParticles();
  initScrollAnimations();
  initSmoothScroll();
  initGlowEffect();
  enhanceWelcomeAnimation();

  // Add loaded class for any initial animations
  document.body.classList.add('loaded');
});

// ============================================
// CONFIGURATION NOTES
// ============================================
/*
 * TO CUSTOMIZE THIS WEBSITE:
 *
 * 1. NAMES: Edit the HTML to change "Benjamin & Angelin"
 *    and the "BA" monogram letters
 *
 * 2. DATE: Edit the date in the HTML hero section
 *
 * 3. ADDRESSES: Edit the address content in each event card
 *
 * 4. MAPS LINKS: Update the href in map-button links
 *    Format: https://maps.google.com/?q=Your+Address+Here
 *
 * 5. MUSIC: Replace the audio source in index.html
 *    <source src="./your-music-file.mp3" type="audio/mpeg">
 *
 * 6. COLORS: Edit CSS variables in style.css :root section
 *
 * 7. EVENT TIMES: Edit the time spans in each event card
 */
