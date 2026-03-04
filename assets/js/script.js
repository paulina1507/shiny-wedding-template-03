// ===============================
// COUNTDOWN
// ===============================

const targetDate = new Date("April 4, 2026 16:00:00").getTime();

const countdownInterval = setInterval(function () {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    clearInterval(countdownInterval);

    document.getElementById("days").innerHTML = "0";
    document.getElementById("hours").innerHTML = "0";
    document.getElementById("minutes").innerHTML = "0";
    document.getElementById("seconds").innerHTML = "0";

    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;
}, 1000);

// ===============================
// REVEAL ANIMATION
// ===============================

const reveals = document.querySelectorAll(".reveal");

if (reveals.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${index * 0.15}s`;
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  reveals.forEach((el) => observer.observe(el));
}

// ===============================
// ITINERARIO PROGRESS
// ===============================

function updateTimeline() {
  const timeline = document.querySelector(".timeline");
  const progress = document.querySelector(".timeline-progress");
  const baseLine = document.querySelector(".timeline-line");

  if (!timeline || !progress || !baseLine) return;

  const lastDot = timeline.querySelector(".timeline-item:last-child .dot");
  if (!lastDot) return;

  const timelineRect = timeline.getBoundingClientRect();
  const lastRect = lastDot.getBoundingClientRect();

  const maxHeight = lastRect.top - timelineRect.top + lastDot.offsetHeight / 2;

  baseLine.style.height = maxHeight + "px";

  const windowHeight = window.innerHeight;
  const trigger = windowHeight * 0.75;

  let currentHeight = trigger - timelineRect.top;

  currentHeight = Math.max(0, Math.min(currentHeight, maxHeight));

  progress.style.height = currentHeight + "px";

  const items = document.querySelectorAll(".timeline-item");

  items.forEach((item) => {
    const dot = item.querySelector(".dot");
    if (!dot) return;

    const dotRect = dot.getBoundingClientRect();
    const dotCenter = dotRect.top - timelineRect.top + dot.offsetHeight / 2;

    if (currentHeight >= dotCenter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", updateTimeline);
window.addEventListener("resize", updateTimeline);

updateTimeline();

// ===============================
// RSVP
// ===============================

function enviarConfirmacion() {
  const nombreInput = document.getElementById("nombreInvitado");
  const mensajeInput = document.getElementById("mensajeInvitado");
  const error = document.getElementById("rsvpError");
  const btn = document.getElementById("rsvpBtn");

  if (!nombreInput || !mensajeInput || !error || !btn) return;

  const nombre = nombreInput.value.trim();
  const mensajeExtra = mensajeInput.value.trim();

  error.classList.remove("visible");
  nombreInput.style.borderColor = "#ccc";

  if (!nombre) {
    error.textContent = "Por favor escribe tu nombre para confirmar ✨";
    error.classList.add("visible");

    nombreInput.style.borderColor = "#5b0f1b";
    nombreInput.focus();

    return;
  }

  btn.classList.add("loading");

  const telefono = "522212576641";

  let mensaje = `Hola, confirmo mi asistencia al evento.\n\nNombre: ${nombre}`;

  if (mensajeExtra) {
    mensaje += `\n\nMensaje de felicitación:\n${mensajeExtra}`;
  }

  mensaje += `\n\n¡Nos vemos pronto!`;

  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  setTimeout(() => {
    window.open(url, "_blank");
    btn.classList.remove("loading");
  }, 700);
}

// ===============================
// CONTROL MENU DESKTOP
// ===============================

function controlMenuVisibility() {
  const invitation = document.getElementById("invitation");
  const menu = document.getElementById("floatingMenu");
  const firstSection = document.querySelector(".hero-envelope");

  if (!menu || !firstSection || !invitation) return;

  if (window.innerWidth <= 768) return;

  if (!invitation.classList.contains("open")) {
    menu.classList.remove("visible");
    return;
  }

  const sectionBottom = firstSection.getBoundingClientRect().bottom;

  if (sectionBottom <= 0) {
    menu.classList.add("visible");
  } else {
    menu.classList.remove("visible");
  }
}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  const menu = document.getElementById("floatingMenu");
  const toggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("menuOverlay");
  const icon = document.getElementById("menuIcon");
  const seal = document.getElementById("seal");
  const invitation = document.getElementById("invitation");

  // ===============================
  // MUSIC PLAYER
  // ===============================

  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");

  const playIcon = document.getElementById("iconPlay");
  const pauseIcon = document.getElementById("iconPause");
  const vinyl = document.getElementById("vinyl");

  const progress = document.getElementById("musicProgress");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (music) {
    // ===============================
    // ESTADO INICIAL
    // ===============================

    playIcon?.classList.remove("hidden");
    pauseIcon?.classList.add("hidden");

    // ===============================
    // PLAY / PAUSE
    // ===============================

    btn?.addEventListener("click", () => {
      if (music.paused) {
        music.play();

        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");

        vinyl?.classList.add("spin");
      } else {
        music.pause();

        pauseIcon.classList.add("hidden");
        playIcon.classList.remove("hidden");

        vinyl?.classList.remove("spin");
      }
    });

    // ===============================
    // BARRA DE PROGRESO
    // ===============================

    music.addEventListener("timeupdate", () => {
      if (!music.duration) return;

      const percent = (music.currentTime / music.duration) * 100;

      progress.value = percent;
      progress.style.setProperty("--progress", percent + "%");
    });

    progress?.addEventListener("input", () => {
      const time = (progress.value / 100) * music.duration;

      music.currentTime = time;
    });

    // ===============================
    // BOTONES PREV / NEXT
    // ===============================

    prevBtn?.addEventListener("click", () => {
      music.currentTime = 0;
    });

    nextBtn?.addEventListener("click", () => {
      music.currentTime = music.duration - 0.1;
    });

    // ===============================
    // CUANDO TERMINA LA CANCIÓN
    // ===============================

    music.addEventListener("ended", () => {
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");

      vinyl?.classList.remove("spin");

      progress.value = 0;
      progress.style.setProperty("--progress", "0%");
    });
  }

  // ===============================
  // MOBILE MENU
  // ===============================

  if (toggle && menu && overlay && icon) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("mobile-open");
      overlay.classList.toggle("active");

      if (menu.classList.contains("mobile-open")) {
        icon.textContent = "✕";
        document.body.style.overflow = "hidden";
      } else {
        icon.textContent = "☰";
        document.body.style.overflow = "";
      }
    });

    overlay.addEventListener("click", function () {
      menu.classList.remove("mobile-open");
      overlay.classList.remove("active");

      icon.textContent = "☰";
      document.body.style.overflow = "";
    });
  }

  // ===============================
  // ABRIR SOBRE
  // ===============================

  if (seal && invitation) {
    seal.addEventListener("click", () => {
      invitation.classList.remove("sealed");
      invitation.classList.add("open");

      if (music) {
        music
          .play()
          .then(() => {
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");

            vinyl?.classList.add("spin");
          })
          .catch(() => {});
      }

      document.body.classList.remove("locked");
    });
  }

  window.addEventListener("scroll", controlMenuVisibility);
  window.addEventListener("resize", controlMenuVisibility);

  controlMenuVisibility();
});
