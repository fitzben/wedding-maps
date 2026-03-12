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
          musicControl?.classList.remove('muted');
        })
        .catch(() => {
          // Autoplay blocked by browser
          isMusicPlaying = false;
          musicControl?.classList.add('muted');

          // Wait for first user interaction
          const startMusic = () => {
            bgMusic.play();
            isMusicPlaying = true;
            musicControl?.classList.remove('muted');

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
  } else {
    bgMusic.play();
    musicControl?.classList.remove('muted');
  }

  isMusicPlaying = !isMusicPlaying;
}

// Event listener for music control button
musicControl?.addEventListener('click', toggleMusic);

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
// INITIALIZE ON DOM LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMusic();
  createParticles();
  initScrollAnimations();
  initSmoothScroll();
  initGlowEffect();

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
