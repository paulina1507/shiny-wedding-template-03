// ===============================
// COUNTDOWN
// ===============================

const targetDate = new Date("April 4, 2026 16:00:00").getTime();

setInterval(function () {

    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
    );

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

}, 1000);

  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${index * 0.15}s`;
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
// ===============================
// ITINERARIO PROGRESS
// ===============================

function updateTimeline() {

    const timeline = document.querySelector('.timeline');
    const progress = document.querySelector('.timeline-progress');
    const baseLine = document.querySelector('.timeline-line');

    const lastDot = timeline.querySelector('.timeline-item:last-child .dot');
    const timelineRect = timeline.getBoundingClientRect();
    const lastRect = lastDot.getBoundingClientRect();

    const maxHeight =
        lastRect.top - timelineRect.top +
        lastDot.offsetHeight / 2;

    baseLine.style.height = maxHeight + "px";

    const windowHeight = window.innerHeight;
    const trigger = windowHeight * 0.75;

    let currentHeight = trigger - timelineRect.top;
    currentHeight = Math.max(0, Math.min(currentHeight, maxHeight));

    progress.style.height = currentHeight + "px";

    const items = document.querySelectorAll('.timeline-item');

    items.forEach(item => {
        const dot = item.querySelector('.dot');
        const dotRect = dot.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();

        const dotCenter =
            dotRect.top - timelineRect.top +
            dot.offsetHeight / 2;

        if (currentHeight >= dotCenter) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateTimeline);
window.addEventListener('resize', updateTimeline);
updateTimeline();
// ===============================
// RSVP
// ===============================

function enviarConfirmacion() {

    const telefono = "52";
    const nombre = document.getElementById("nombreInvitado").value;

    if (nombre.trim() === "") {
        alert("Por favor escribe tu nombre");
        return;
    }

    const mensaje = `¡Hola Miguel y Melisa!

Soy ${nombre} y confirmo mi asistencia a su boda el 4 de abril de 2026.

¡Nos vemos pronto!`;

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
}