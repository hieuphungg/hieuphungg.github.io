// ============== COUNTDOWN ==============
const WEDDING_DATE = new Date("2026-06-01T10:00:00+07:00").getTime();

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
    Object.values(countdownEls).forEach((el) => el && (el.textContent = "00"));
    const cd = document.getElementById("countdown");
    if (cd) cd.innerHTML = '<p style="color:#fff;font-size:20px;margin:auto;">Hôm nay là ngày cưới!</p>';
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
  lightboxImg.src = img.currentSrc || img.src;
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
  img.parentElement.addEventListener("click", () => showLightbox(idx));
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
