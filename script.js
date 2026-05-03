// ============== FIREWORKS ==============
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'fireworks-canvas';
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PALETTES = [
    ['#ff6b9d','#ff8fab','#ffb3c6','#ffc8dd'],
    ['#f5d97a','#ffe99a','#fff3c0','#ffd700'],
    ['#a8edea','#88d8c0','#6ec6b8','#4fc3f7'],
    ['#d4a8ff','#c084fc','#e879f9','#f0abfc'],
    ['#ff9a3c','#ffb347','#ffd700','#ffe066'],
    ['#ff5c5c','#ff8080','#ffaaaa','#ffd6d6'],
    ['#80ff80','#aaffaa','#d4ffb2','#b3f590'],
    ['#ffffff','#f5f5f5','#e0e0e0','#ffe0e0'],
  ];

  class Spark {
    constructor(x, y, palette) {
      this.x = x; this.y = y;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      const angle = Math.random() * Math.PI * 2;
      const spd   = 1 + Math.random() * 4;
      this.vx = Math.cos(angle) * spd;
      this.vy = Math.sin(angle) * spd - 0.5;
      this.alpha   = 1;
      this.decay   = 0.008 + Math.random() * 0.014;
      this.gravity = 0.055;
      this.len     = 3 + Math.random() * 5;
    }
    update() {
      this.vy += this.gravity;
      this.vx *= 0.985;
      this.x  += this.vx;
      this.y  += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.strokeStyle = this.color;
      ctx.lineWidth   = 1;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 4;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * this.len, this.y - this.vy * this.len);
      ctx.stroke();
      ctx.restore();
    }
    isDead() { return this.alpha <= 0; }
  }

  let sparks = [];

  function burst(x, y) {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const count   = 70 + Math.floor(Math.random() * 50);
    for (let i = 0; i < count; i++) sparks.push(new Spark(x, y, palette));
  }

  function scheduleNext() {
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      burst(
        canvas.width  * (0.1 + Math.random() * 0.8),
        canvas.height * (0.05 + Math.random() * 0.5)
      );
      scheduleNext();
    }, delay);
  }

  burst(canvas.width * 0.25, canvas.height * 0.2);
  burst(canvas.width * 0.72, canvas.height * 0.15);
  setTimeout(scheduleNext, 600);

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks = sparks.filter(s => { s.update(); s.draw(); return !s.isDead(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ============== COUNTDOWN ==============
const WEDDING_DATE = new Date("2026-06-01T00:00:00+07:00").getTime();

const countdownEls = {
  days: document.querySelector('[data-unit="days"]'),
  hours: document.querySelector('[data-unit="hours"]'),
  minutes: document.querySelector('[data-unit="minutes"]'),
  seconds: document.querySelector('[data-unit="seconds"]'),
};

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function updateCountdown() {
  const distance = WEDDING_DATE - Date.now();

  if (distance <= 0) {
    Object.values(countdownEls).forEach((el) => el && (el.textContent = "0"));
    const cd = document.getElementById("countdown");
    return false;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  if (countdownEls.days) countdownEls.days.textContent = pad(days);
  if (countdownEls.hours) countdownEls.hours.textContent = pad(hours);
  if (countdownEls.minutes) countdownEls.minutes.textContent = pad(minutes);
  if (countdownEls.seconds) countdownEls.seconds.textContent = pad(seconds);
  return true;
}

if (updateCountdown()) {
  setInterval(updateCountdown, 1000);
}

// ============== NAV ==============
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
  backToTop.classList.toggle("visible", window.scrollY > 400);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Scroll indicator: scroll chính xác đến cuối hero section
const scrollIndicatorEl = document.querySelector('.scroll-indicator');
if (scrollIndicatorEl) {
  scrollIndicatorEl.addEventListener('click', (e) => {
    e.preventDefault();
    const hero = document.getElementById('hero');
    if (hero) window.scrollTo({ top: hero.offsetHeight, behavior: 'smooth' });
  });
}

// ============== BACKGROUND MUSIC ==============
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

if (bgMusic && musicToggle) {
  bgMusic.volume = 0.5;
  bgMusic.muted = false;

  const playMusic = () =>
    bgMusic.play().then(() => musicToggle.classList.add("playing")).catch(() => {});

  const pauseMusic = () => {
    bgMusic.pause();
    musicToggle.classList.remove("playing");
  };

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) playMusic();
    else pauseMusic();
  });

  bgMusic.addEventListener("play", () => musicToggle.classList.add("playing"));
  bgMusic.addEventListener("pause", () => musicToggle.classList.remove("playing"));

  const INTERACTION_EVENTS = [
    "click", "touchstart", "touchend", "keydown",
    "scroll", "wheel", "pointerdown", "mousemove",
  ];

  const cleanup = () => {
    INTERACTION_EVENTS.forEach((ev) =>
      document.removeEventListener(ev, tryAutoplayOnInteraction, { passive: true })
    );
  };

  const tryAutoplayOnInteraction = (e) => {
    if (e.target && e.target.closest && e.target.closest("#musicToggle")) {
      cleanup();
      return;
    }
    if (bgMusic.paused) playMusic();
    cleanup();
  };

  const armInteractionListeners = () => {
    INTERACTION_EVENTS.forEach((ev) =>
      document.addEventListener(ev, tryAutoplayOnInteraction, { passive: true })
    );
  };

  const attemptAutoplay = () => {
    bgMusic.play().then(() => {
      musicToggle.classList.add("playing");
    }).catch(() => {
      armInteractionListeners();
    });
  };

  if (bgMusic.readyState >= 2) {
    attemptAutoplay();
  } else {
    bgMusic.addEventListener("canplay", attemptAutoplay, { once: true });
    armInteractionListeners();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && bgMusic.paused && musicToggle.classList.contains("was-playing")) {
      playMusic();
    } else if (document.visibilityState === "hidden" && !bgMusic.paused) {
      musicToggle.classList.add("was-playing");
    }
  });
}

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

// Active section highlight
const sections = document.querySelectorAll("section[id]");
const navAnchors = navLinks.querySelectorAll("a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
);
sections.forEach((s) => observer.observe(s));

// ============== LIGHTBOX ==============
const galleryItems = Array.from(document.querySelectorAll(".gallery-item img"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");

let currentIndex = 0;

function showLightbox(idx) {
  currentIndex = (idx + galleryItems.length) % galleryItems.length;
  const img = galleryItems[currentIndex];
  const src = img.currentSrc || img.src || img.dataset.src || '';
  lightboxImg.src = src;
  lightboxImg.alt = img.alt;
  lightboxCounter.textContent = currentIndex + 1 + " / " + galleryItems.length;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

galleryItems.forEach((img, idx) => {
  const item = img.closest('.gallery-item') || img.parentElement;
  item.addEventListener("click", () => showLightbox(idx));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showLightbox(currentIndex - 1));
lightboxNext.addEventListener("click", () => showLightbox(currentIndex + 1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showLightbox(currentIndex - 1);
  if (e.key === "ArrowRight") showLightbox(currentIndex + 1);
});

// ============== SCROLL REVEAL ==============
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = +(entry.target.dataset.delay || 0);
          if (delay) {
            setTimeout(() => entry.target.classList.add('revealed'), delay);
          } else {
            entry.target.classList.add('revealed');
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// Touch swipe on lightbox
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) {
    showLightbox(currentIndex + (dx < 0 ? 1 : -1));
  }
}, { passive: true });
