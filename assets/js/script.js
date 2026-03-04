// ===============================
// CARGAR JSON
// ===============================
let invitationData = null;

async function loadInvitation() {
  try {
    const res = await fetch("assets/data.json?v=" + Date.now());

    if (!res.ok) throw new Error("No se pudo cargar data.json");

    invitationData = await res.json();

    const data = invitationData;

    // HERO
    const title = document.getElementById("pageTitle");
    const monogram = document.getElementById("monogram");
    const names = document.getElementById("names");

    if (title)
      title.textContent = `${data.evento.novio} & ${data.evento.novia}`;
    if (monogram) monogram.textContent = data.evento.monograma;
    if (names)
      names.textContent = `${data.evento.novio} y ${data.evento.novia}`;

    // FAMILIA
    const parents = document.getElementById("parents");
    const godparents = document.getElementById("godparents");

    if (parents) parents.innerHTML = data.familia.padres.join("<br>");
    if (godparents) godparents.innerHTML = data.familia.padrinos.join("<br>");

    // FECHA
    const d = data.evento.fecha;
    const dateEl = document.getElementById("eventDate");

    if (dateEl) {
      dateEl.innerHTML = `
        ${d.dia_semana} <span>|</span> ${d.dia} <span>|</span> ${d.mes}
        <br>${d.anio}
      `;
    }

    // LUGARES
    const c = data.lugares.ceremonia;
    const r = data.lugares.recepcion;

    const ceremonyImg = document.getElementById("ceremonyImg");
    if (ceremonyImg) ceremonyImg.src = c.imagen;

    const ceremonyPlace = document.getElementById("ceremonyPlace");
    if (ceremonyPlace) ceremonyPlace.textContent = c.lugar;

    const ceremonyAddress = document.getElementById("ceremonyAddress");
    if (ceremonyAddress) ceremonyAddress.innerHTML = c.direccion_html;

    const ceremonyTime = document.getElementById("ceremonyTime");
    if (ceremonyTime) ceremonyTime.textContent = c.hora;

    const ceremonyMap = document.getElementById("ceremonyMap");
    if (ceremonyMap) ceremonyMap.href = c.mapa_url;

    // FOTO FINAL
    const final = data.fotos.final;
    const finalImg = document.getElementById("finalPhoto");

    if (finalImg) {
      finalImg.src = final.src;
      finalImg.alt = final.alt || "";
    }

    // VESTIMENTA
    const dress = data.vestimenta;

    document.getElementById("dressType").textContent = dress.tipo;
    document.getElementById("dressImg").src = dress.imagen;
    document.getElementById("dressNote").textContent = dress.nota;

    // ITINERARIO
    const timeline = document.getElementById("timelineContainer");

    if (timeline) {
      timeline.innerHTML = "";

      data.itinerario.forEach((item) => {
        const html = `
        <div class="timeline-item">
          <div class="icon">
            <img src="${item.icono}">
          </div>
          <div class="dot"></div>
          <div class="content">
            <p class="time reveal">${item.hora}</p>
            <p>${item.evento}</p>
          </div>
        </div>
        `;

        timeline.insertAdjacentHTML("beforeend", html);
      });
    }

    // REGALOS
    const giftContainer = document.getElementById("giftOptions");
    const giftIntro = document.querySelector(".gift-main");

    if (giftIntro) giftIntro.textContent = data.regalos.intro;

    if (giftContainer) {
      giftContainer.innerHTML = "";

      data.regalos.opciones.forEach((g) => {
        const button = g.boton
          ? `<a href="${g.url || "#"}"
        class="btn btn-primary ${g.tipo === "modal" ? "btn-modal" : ""}">
        ${g.boton}
      </a>`
          : "";

        const html = `
    <div class="gift-item reveal">
      <img src="${g.icono}" class="gift-icon-top">
      <h3>${g.titulo}</h3>
      <p class="gift-secondary">${g.descripcion}</p>
      ${button}
    </div>
  `;

        giftContainer.insertAdjacentHTML("beforeend", html);
      });

      // Después activamos la animación reveal
      const newItems = giftContainer.querySelectorAll(".gift-item");
      newItems.forEach((el) => el.classList.add("visible"));
    }

    // GALERIA
    const gallery = document.getElementById("galleryTrack");

    if (gallery) {
      gallery.innerHTML = "";

      data.galeria.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;

        gallery.appendChild(img);
      });
    }

    // RSVP TEXTO
    const rsvp = document.getElementById("rsvpText");

    if (rsvp) {
      rsvp.innerHTML = `
      Por favor confirma tu asistencia<br>
      antes del <strong>${data.rsvp.fecha_limite}</strong>.
      `;
    }
    // FECHA PARA COUNTDOWN
    targetDate = new Date(data.contador.fecha_evento).getTime();
  } catch (err) {
    console.error("Error cargando invitación:", err);
  }
}
// ===============================
// COUNTDOWN
// ===============================

let targetDate = null;

const countdownInterval = setInterval(function () {
  if (!targetDate) return;

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
  loadInvitation();
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

  const currentTimeEl = document.getElementById("currentTime");
  const remainingTimeEl = document.getElementById("remainingTime");

  if (music) {
    // ===============================
    // ESTADO INICIAL
    // ===============================

    playIcon?.classList.remove("hidden");
    pauseIcon?.classList.add("hidden");

    // ===============================
    // PLAY / PAUSE
    // ===============================

    btn?.addEventListener("click", async () => {
      try {
        if (music.paused) {
          await music.play();

          playIcon?.classList.add("hidden");
          pauseIcon?.classList.remove("hidden");

          vinyl?.classList.remove("slow-stop");
          vinyl?.classList.add("spin");
        } else {
          music.pause();

          pauseIcon?.classList.add("hidden");
          playIcon?.classList.remove("hidden");

          vinyl?.classList.remove("spin");
          vinyl?.classList.add("slow-stop");
        }
      } catch (err) {
        console.log("Autoplay bloqueado por el navegador");
      }
    });

    // ===============================
    // BARRA DE PROGRESO
    // ===============================
    function formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return "0:00";

      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);

      return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    // cuando el navegador conoce la duración
    music.addEventListener("loadedmetadata", () => {
      if (remainingTimeEl) {
        remainingTimeEl.textContent = "-" + formatTime(music.duration);
      }
    });

    // actualización mientras reproduce
    music.addEventListener("timeupdate", () => {
      if (!music.duration) return;

      const percent = (music.currentTime / music.duration) * 100;

      progress.value = percent;
      progress.style.setProperty("--progress", percent + "%");

      // tiempo actual
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(music.currentTime);
      }

      // tiempo restante
      if (remainingTimeEl) {
        const remaining = music.duration - music.currentTime;
        remainingTimeEl.textContent = "-" + formatTime(remaining);
      }
    });
    // ===============================
    // CONTROL MANUAL DE LA BARRA
    // ===============================

    progress?.addEventListener("input", () => {
      if (!music.duration) return;

      const newTime = (progress.value / 100) * music.duration;
      music.currentTime = newTime;
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

            vinyl?.classList.remove("slow-stop");
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

// ===============================
// MODAL TRANSFERENCIA
// ===============================

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-modal")) {
    e.preventDefault();

    const modal = document.getElementById("bankModal");
    if (modal) modal.classList.add("active");
  }

  if (
    e.target.id === "closeBankModal" ||
    e.target.classList.contains("modal-overlay")
  ) {
    const modal = document.getElementById("bankModal");
    if (modal) modal.classList.remove("active");
  }
});
