// enhancedCelebration_snow_safe.js

// 1. Set the exact date/time when effects should start:
//    June 27, 2025 at 12:00:00 PM (local time)
const targetDate = new Date(2024, 10, 21, 17, 36, 0, 0); // month is zero-based (5 = June)

(function() {
  // Guard: exit early if not running in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // This prevents the "ReferenceError: document is not defined" when run in Node.
    // If you want a Node-compatible simulation, tell me and I will produce one.
    /* eslint-disable no-console */
    console.error('enhancedCelebration_snow_safe.js: window/document not found. This script must run in a browser.');
    return;
  }

  // 2. Wait until the page’s DOM is fully loaded
  function scheduleEffects() {
    const now = new Date();
    const delay = targetDate.getTime() - now.getTime();

    if (delay <= 0) {
      // If the target time has already passed (or is right now), start immediately
      startEffects();
    } else {
      // Otherwise, wait until the target time
      setTimeout(startEffects, delay);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleEffects);
  } else {
    // DOM already ready
    scheduleEffects();
  }

  // 3. This function injects all CSS/HTML/JS needed for the celebration (snow)
  function startEffects() {
    // Prevent accidental multiple starts
    if (startEffects._started) return;
    startEffects._started = true;

    // --- A. Inject CSS for animations and styling ---
    const style = document.createElement('style');
    style.innerHTML = `
      /* === FULLSCREEN OVERLAY === */
      .decor-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none; /* Let clicks pass through */
        overflow: hidden;
        z-index: 10000;
      }

      /* === RADIAL SPOTLIGHTS (CIRCULAR CENTER) === */
      .spotlight {
        position: absolute;
        width: 30vw;
        height: 30vw;
        border-radius: 50%;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(92, 201, 59, 0.5) 0%,
          transparent 60%
        );
        filter: blur(20px);
        animation: moveSpotlight 5s infinite ease-in-out;
      }
      .spotlight.blue {
        background: radial-gradient(
          circle at 50% 50%,
          rgba(65, 147, 201, 0.5) 0%,
          transparent 60%
        );
        animation-direction: alternate;
      }
      @keyframes moveSpotlight {
        0%   { transform: translate(-30vw, -30vw); }
        25%  { transform: translate(120vw, -30vw); }
        50%  { transform: translate(120vw, 120vw); }
        75%  { transform: translate(-30vw, 120vw); }
        100% { transform: translate(-30vw, -30vw); }
      }

      /* === FLASH EFFECT (STROBE WITH COLOR VARIATION) === */
      .flash {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.08s ease-in-out;
      }

      /* === TWINKLING STARS === */
      .star {
        position: absolute;
        background: #dedede;
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
        animation: twinkle 2s infinite ease-in-out;
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0; }
        50%      { opacity: 1; }
      }

      /* === CANVAS FOR SNOW === */
      .snow-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10003;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // --- B. Create the overlay container that holds everything ---
    const container = document.createElement('div');
    container.className = 'decor-overlay';
    document.body.appendChild(container);

    // --- C. ADD RADIAL SPOTLIGHTS ---
    const spotlight1 = document.createElement('div');
    spotlight1.className = 'spotlight';
    container.appendChild(spotlight1);

    const spotlight2 = document.createElement('div');
    spotlight2.className = 'spotlight blue';
    container.appendChild(spotlight2);

    // --- D. ADD FLASH (STROBE) ELEMENT WITH COLOR VARIATION ---
    const flashEl = document.createElement('div');
    flashEl.className = 'flash';
    container.appendChild(flashEl);
    // Every 1.5 seconds, show a quick flash in either white, green, or blue
    setInterval(() => {
      const rand = Math.random();
      if (rand < 0.33) {
        flashEl.style.background = '#ffffff';
      } else if (rand < 0.66) {
        flashEl.style.background = 'rgba(92, 201, 59, 0.8)';
      } else {
        flashEl.style.background = 'rgba(65, 147, 201, 0.8)';
      }
      flashEl.style.opacity = '0.8';
      setTimeout(() => { flashEl.style.opacity = '0'; }, 80);
    }, 1500);

    // --- E. ADD TWINKLING STARS ===
    const starCount = 40;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 2; // 2px–5px
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + 'vw';
      star.style.top = Math.random() * 100 + 'vh';
      star.style.animationDelay = (Math.random() * 2) + 's';
      container.appendChild(star);
    }

    // --- F. CREATE SNOW CANVAS AND ANIMATION (snowflakes + snowballs) ---
    const canvas = document.createElement('canvas');
    canvas.className = 'snow-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const MAX_PARTICLES = 250; // combined flakes + balls

    // Utility: random between min and max
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Create a new particle (flake or ball)
    function createParticle() {
      // Decide type: flake is more common, ball rarer
      const type = Math.random() < 0.85 ? 'flake' : 'ball';

      if (type === 'flake') {
        const size = rand(1.2, 4.0); // small
        return {
          type: 'flake',
          x: rand(0, canvas.width),
          y: rand(-50, -10),
          size,
          speed: rand(0.6, 2.2), // downward speed
          drift: rand(-0.6, 0.6), // horizontal constant drift
          swayAmp: rand(6, 20), // horizontal sway amplitude
          swayFreq: rand(0.002, 0.008), // sway frequency
          rotation: rand(0, Math.PI * 2),
          rotationSpeed: rand(-0.02, 0.02),
          alpha: rand(0.7, 1)
        };
      } else {
        // snowball: larger, falls faster, minimal sway
        const size = rand(8, 18);
        return {
          type: 'ball',
          x: rand(0, canvas.width),
          y: rand(-100, -20),
          size,
          speed: rand(1.8, 4.0),
          drift: rand(-0.3, 0.3),
          swayAmp: rand(0, 6),
          swayFreq: rand(0.001, 0.004),
          rotation: 0,
          rotationSpeed: 0,
          alpha: rand(0.85, 1)
        };
      }
    }

    // Pre-fill some particles
    for (let i = 0; i < 80; i++) {
      particles.push(createParticle());
    }

    let lastTime = performance.now();

    function updateAndDraw(now) {
      const dt = (now - lastTime) / 16.6667; // normalized to ~60fps tick
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // occasionally spawn new particles until max
      if (particles.length < MAX_PARTICLES && Math.random() < 0.6) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // vertical movement
        p.y += p.speed * dt;

        // horizontal: drift + sway
        p.x += p.drift * dt + Math.sin((p.y + now * 0.05) * p.swayFreq) * p.swayAmp * (dt * 0.6);

        // rotation for flakes
        p.rotation += p.rotationSpeed * dt;

        // Draw
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        if (p.type === 'flake') {
          // draw simple white flake as small 6-point star using lines
          ctx.rotate(p.rotation);
          const r = p.size;
          ctx.lineWidth = Math.max(1, r * 0.18);
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          // simple cross + x to look like a flake
          ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
          ctx.moveTo(0, -r); ctx.lineTo(0, r);
          ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, r * 0.7);
          ctx.moveTo(r * 0.7, -r * 0.7); ctx.lineTo(-r * 0.7, r * 0.7);
          ctx.stroke();
        } else {
          // snowball: filled white circle (no color)
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Remove if off-screen (past bottom or far left/right)
        if (p.y - p.size > canvas.height + 50 || p.x < -100 || p.x > canvas.width + 100) {
          // replace with a new particle starting above
          particles.splice(i, 1);
          if (particles.length < MAX_PARTICLES) {
            particles.push(createParticle());
          }
        }
      }

      requestAnimationFrame(updateAndDraw);
    }

    requestAnimationFrame(updateAndDraw);

    // Keep canvas sized to viewport also on zoom/resize (already handled)
    // Nothing here creates images or moving logos.
    // All effects are non-interactive and pointer-events remain none.
  }
})();