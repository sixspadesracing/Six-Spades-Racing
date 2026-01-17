document.addEventListener("DOMContentLoaded", () => {

  // Scroll reveal animation
  const revealElements = document.querySelectorAll(".reveal, .revealOnScroll");

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 120;

      if (elementTop < windowHeight - revealPoint) {

        el.classList.add("active");

      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);


  // Card click transition + home page countdown
  // Event delegation: catches clicks anywhere inside a .spade-card
  if (document.body.classList.contains("page-home")){

  // ✅ Set your target date/time here (local time on the user's computer)
  // Example: 2026-03-15 09:00
  const target = new Date("2026-02-24T09:00:00");

  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");
  const elSub = document.getElementById("cd-subtext");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    const diff = target - now; // milliseconds

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      elSub.textContent = "We’re racing today. Let’s go.";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);

    // Nice readable line below
    elSub.textContent = `Target: ${target.toLocaleString()}`;
  }

  tick();
  setInterval(tick, 1000);

    document.querySelectorAll(".spade-card").forEach(card => {
      card.addEventListener("click", () => {
        const link = card.getAttribute("data-link");
        if (!link) return;

        document.querySelectorAll(".spade-card").forEach(other => {
          if (other !== card) other.style.opacity = "0.3";
        });

        card.classList.add("exit");

        setTimeout(() => {
          window.location.href = link;
        }, 700);
      });
    });
  }

  // hamburger
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks){
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-links a").forEach(link =>{
      if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
      }
  });


  //Bio button
  if (document.body.classList.contains("page-team")){
    document.querySelectorAll(".bio-toggle").forEach(button => {
      button.addEventListener("click", () =>{
        const card = button.closest(".team-card");

        document.querySelectorAll(".team-card").forEach(other => {
          if (other !== card){
            other.classList.remove("active");
            const btn = other.querySelector(".bio-toggle");
            if (btn) btn.textContent = "View bio";
          }
        });

        const isOpen = card.classList.contains("active");
        card.classList.toggle("active");

        button.textContent = isOpen ? "View bio" : "Hide bio";
      });
    });
  }
});

// =========================
// TEAM PAGE: stagger + bio
// =========================
if (document.body.classList.contains("page-team")) {

  // Stagger on scroll (IntersectionObserver)
  const cards = document.querySelectorAll(".team-card");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  cards.forEach((card, i) => {
    // stagger delay
    card.style.transitionDelay = `${i * 0.08}s`;
    io.observe(card);
  });

  // Bio toggle (expand/collapse)
  document.querySelectorAll(".bio-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const card = btn.closest(".team-card");
      const isOpen = card.classList.contains("bio-open");

      // close others (optional, feels cleaner)
      document.querySelectorAll(".team-card.bio-open").forEach(openCard => {
        if (openCard !== card) {
          openCard.classList.remove("bio-open");
          const openBtn = openCard.querySelector(".bio-toggle");
          if (openBtn) openBtn.textContent = "View bio";
        }
      });

      card.classList.toggle("bio-open");
      btn.textContent = isOpen ? "View bio" : "Hide bio";
    });
  });
}
