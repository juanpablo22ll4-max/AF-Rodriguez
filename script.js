/* =====================================================
   ALFREDO RODRÍGUEZ
   OFFICIAL MUSIC WEBSITE

   JAVASCRIPT V2.0
   FR CREATIVE STUDIOS
===================================================== */

"use strict";


/* =====================================================
   01. ELEMENTOS PRINCIPALES
===================================================== */

const siteHeader = document.getElementById("siteHeader");

const menuButton = document.getElementById("menuButton");

const navigation = document.getElementById("navigation");

const navLinks = document.querySelectorAll(".nav-link");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =====================================================
   02. MENÚ RESPONSIVE
===================================================== */

function closeMobileMenu() {

    if (!navigation || !menuButton) return;

    navigation.classList.remove("open");

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.setAttribute("aria-label", "Abrir menú");

    menuButton.innerHTML = `
        <i class="fa-solid fa-bars"></i>
    `;

}


function toggleMobileMenu() {

    if (!navigation || !menuButton) return;

    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
    );

    menuButton.innerHTML = isOpen
        ? `<i class="fa-solid fa-xmark"></i>`
        : `<i class="fa-solid fa-bars"></i>`;

}


if (menuButton && navigation) {

    menuButton.addEventListener("click", toggleMobileMenu);

    navLinks.forEach(link => {

        link.addEventListener("click", closeMobileMenu);

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeMobileMenu();

        }

    });

    document.addEventListener("click", event => {

        const clickedInsideMenu = navigation.contains(
            event.target
        );

        const clickedMenuButton = menuButton.contains(
            event.target
        );

        if (!clickedInsideMenu && !clickedMenuButton) {

            closeMobileMenu();

        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            closeMobileMenu();

        }

    });

}


/* =====================================================
   03. HEADER AL HACER SCROLL
===================================================== */

function updateHeader() {

    if (!siteHeader) return;

    siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 50
    );

}


window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =====================================================
   04. NAVEGACIÓN SUAVE
===================================================== */

const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
);


internalLinks.forEach(link => {

    link.addEventListener("click", event => {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.getElementById(
            targetId.substring(1)
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({

            behavior: prefersReducedMotion
                ? "auto"
                : "smooth",

            block: "start"

        });

        history.replaceState(null, "", targetId);

        closeMobileMenu();

    });

});


/* =====================================================
   05. ENLACE ACTIVO DEL MENÚ
===================================================== */

const sections = document.querySelectorAll(
    "main section[id]"
);


function updateActiveNavigation() {

    let currentSection = "inicio";

    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {

        if (section.offsetTop <= scrollPosition) {

            currentSection = section.id;

        }

    });

    navLinks.forEach(link => {

        const isActive = (
            link.getAttribute("href") ===
            `#${currentSection}`
        );

        link.classList.toggle("active", isActive);

        if (isActive) {

            link.setAttribute("aria-current", "location");

        } else {

            link.removeAttribute("aria-current");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* =====================================================
   06. REPRODUCTOR MUSICAL
===================================================== */

const audioPlayer = document.getElementById("audioPlayer");

const musicPlayer = document.getElementById("musicPlayer");

const playerTitle = document.getElementById("playerTitle");

const playerToggle = document.getElementById("playerToggle");

const trackButtons = document.querySelectorAll(".track-play");

let activeTrackButton = null;


/* ICONOS */

const playIcon = `
    <i class="fa-solid fa-play"></i>
`;

const pauseIcon = `
    <i class="fa-solid fa-pause"></i>
`;


/* ACTUALIZAR BOTONES */

function updateTrackButtons() {

    if (!audioPlayer) return;

    trackButtons.forEach(button => {

        const isPlaying = (
            button === activeTrackButton &&
            !audioPlayer.paused
        );

        button.innerHTML = isPlaying
            ? pauseIcon
            : playIcon;

        button.setAttribute(
            "aria-pressed",
            String(isPlaying)
        );

    });

    if (playerToggle) {

        playerToggle.innerHTML = audioPlayer.paused
            ? playIcon
            : pauseIcon;

        playerToggle.setAttribute(
            "aria-label",
            audioPlayer.paused
                ? "Reproducir canción"
                : "Pausar canción"
        );

    }

}


/* REPRODUCIR CANCIÓN */

async function playSelectedTrack(button) {

    if (!audioPlayer || !musicPlayer) return;

    const songSource = button.dataset.src;

    const songTitle = button.dataset.title;

    if (!songSource) {

        console.warn("Esta canción no tiene archivo MP3.");

        return;

    }


    /* SI ES LA MISMA CANCIÓN */

    if (activeTrackButton === button) {

        if (audioPlayer.paused) {

            try {

                await audioPlayer.play();

            } catch (error) {

                console.error(
                    "No se pudo reproducir la canción:",
                    error
                );

            }

        } else {

            audioPlayer.pause();

        }

        updateTrackButtons();

        return;

    }


    /* SI SELECCIONA OTRA CANCIÓN */

    audioPlayer.pause();

    activeTrackButton = button;

    audioPlayer.src = songSource;

    audioPlayer.load();

    if (playerTitle) {

        playerTitle.textContent =
            songTitle || "Canción de Alfredo Rodríguez";

    }

    musicPlayer.classList.add("active");

    updateTrackButtons();


    try {

        await audioPlayer.play();

    } catch (error) {

        console.error(
            "No se pudo iniciar la reproducción:",
            error
        );

    }

    updateTrackButtons();

}


/* EVENTOS DE LAS TARJETAS */

trackButtons.forEach(button => {

    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {

        playSelectedTrack(button);

    });

});


/* BOTÓN DEL REPRODUCTOR INFERIOR */

if (playerToggle && audioPlayer) {

    playerToggle.addEventListener("click", async () => {

        if (!audioPlayer.src) return;

        if (audioPlayer.paused) {

            try {

                await audioPlayer.play();

            } catch (error) {

                console.error(
                    "Error al reproducir:",
                    error
                );

            }

        } else {

            audioPlayer.pause();

        }

        updateTrackButtons();

    });

}


/* EVENTOS DEL AUDIO */

if (audioPlayer) {

    audioPlayer.addEventListener(
        "play",
        updateTrackButtons
    );

    audioPlayer.addEventListener(
        "pause",
        updateTrackButtons
    );

    audioPlayer.addEventListener("ended", () => {

        updateTrackButtons();

    });

    audioPlayer.addEventListener("error", () => {

        console.error(
            "No se pudo cargar el archivo de audio. " +
            "Verifica que el MP3 exista en la carpeta music."
        );

        updateTrackButtons();

    });

}


/* =====================================================
   07. ANIMACIONES AL DESPLAZARSE
===================================================== */

const revealElements = document.querySelectorAll(".reveal");


if (
    !prefersReducedMotion &&
    "IntersectionObserver" in window
) {

    const revealObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        }

    );

    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(element => {

        element.classList.add("visible");

    });

}


/* =====================================================
   08. EFECTO EN LAS TARJETAS MUSICALES
===================================================== */

const trackCards = document.querySelectorAll(".track-card");


trackCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        if (prefersReducedMotion) return;

        card.style.transition =
            "transform 0.35s ease, box-shadow 0.35s ease";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transition =
            "transform 0.35s ease, box-shadow 0.35s ease";

    });

});


/* =====================================================
   09. AÑO AUTOMÁTICO
===================================================== */

const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* =====================================================
   10. INICIALIZACIÓN
===================================================== */

console.log("====================================");

console.log("ALFREDO RODRÍGUEZ");

console.log("Official Music Website");

console.log("Website initialized successfully");

console.log("====================================");


/* =====================================================
   END OF JAVASCRIPT
===================================================== */