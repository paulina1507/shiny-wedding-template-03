(function () {
  let initialized = false;

  function initRSVP() {
    if (initialized) return;
    initialized = true;

    const formBox = document.getElementById("rsvp-form");
    const finalBox = document.getElementById("rsvp-final");
    const section = document.getElementById("rsvp");

    if (!formBox || !finalBox || !section) return;

    const btnYes = formBox.querySelector(".rsvp-btn.yes");
    const btnNo = formBox.querySelector(".rsvp-btn.no");

    const titleEl = document.getElementById("rsvp-final-title");
    const textEl = document.getElementById("rsvp-final-text");
    const namesEl = document.getElementById("rsvp-names");

    const data = window.__EVENT_DATA__;
    if (!data?.rsvp?.final) return;

    function showFinal() {
      formBox.classList.add("hidden");
      section.classList.add("completed");

      // 🔹 mostrar pase y mesa SOLO al confirmar
      const passInfo = section.querySelector(".rsvp-pass-info");
      if (passInfo) passInfo.classList.remove("hidden");

      titleEl.textContent = data.rsvp.final.titulo || "";
      textEl.innerHTML = data.rsvp.final.texto || "";
      namesEl.textContent = data.rsvp.final.firma || "";

      finalBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    btnYes?.addEventListener("click", showFinal);
    btnNo?.addEventListener("click", showFinal);
  }

  // 1️⃣ Escuchar el evento normal
  document.addEventListener("event:data:ready", initRSVP);

  // 2️⃣ Fallback: si el evento ya ocurrió
  if (window.__EVENT_DATA__) {
    initRSVP();
  }
})();
