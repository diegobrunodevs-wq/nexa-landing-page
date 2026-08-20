document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // SCROLL REVEAL
    // =========================================

    const revealElements = document.querySelectorAll(
        ".features-heading, .feature-card, .results-intro, .result-item, .showcase-heading, .app-showcase, .testimonial-container, .final-cta-content"
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });


    // =========================================
    // RESULTADOS — CONTADORES
    // =========================================

    const resultItems = document.querySelectorAll(".result-item strong");

    const resultsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                const finalValue = element.textContent.trim();

                animateResult(element, finalValue);
                resultsObserver.unobserve(element);
            });
        },
        {
            threshold: 0.6
        }
    );

    resultItems.forEach((element) => {
        resultsObserver.observe(element);
    });

    function animateResult(element, value) {
        const match = value.match(/^([+-]?)([\d.,]+)(.*)$/);

        if (!match) return;

        const sign = match[1];
        const numberText = match[2];
        const suffix = match[3];

        const normalizedNumber = numberText
            .replace(/\./g, "")
            .replace(",", ".");

        const target = Number(normalizedNumber);

        if (Number.isNaN(target)) return;

        const decimals = numberText.includes(",")
            ? numberText.split(",")[1].length
            : 0;

        const duration = 1000;
        const startTime = performance.now();

        function update(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = target * easedProgress;

            let displayValue;

            if (decimals > 0) {
                displayValue = currentValue
                    .toFixed(decimals)
                    .replace(".", ",");
            } else {
                displayValue = Math.floor(currentValue)
                    .toLocaleString("pt-BR");
            }

            element.textContent = `${sign}${displayValue}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = value;
            }
        }

        requestAnimationFrame(update);
    }


    // =========================================
    // MENU MOBILE
    // =========================================

    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("is-open");

            menuToggle.classList.toggle("is-open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );
        });


        // Fechar ao clicar em um link
        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", (event) => {

                event.preventDefault();

                link.classList.add("is-selected");

                const target = link.getAttribute("href");

                setTimeout(() => {

                    navLinks.classList.remove("is-open");
                    menuToggle.classList.remove("is-open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuToggle.setAttribute(
                        "aria-label",
                        "Abrir menu"
                    );

                    link.classList.remove("is-selected");

                    window.location.hash = target;

                }, 300);

            });

        });

        // Fechar ao clicar fora

        document.addEventListener("click", (event) => {

            const clickedInsideMenu =
                navLinks.contains(event.target) ||
                menuToggle.contains(event.target);

            if (
                !clickedInsideMenu &&
                navLinks.classList.contains("is-open")
            ) {

                navLinks.classList.remove("is-open");
                menuToggle.classList.remove("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );

            }

        });

    }


    // =========================================
    // NAVBAR — SCROLL STATE
    // =========================================

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        window.addEventListener("scroll", () => {

            navbar.classList.toggle(
                "scrolled",
                window.scrollY > 20
            );

        });

    }

});



// =========================================
// CTA — TOUCH INTERACTION
// =========================================

const finalCta = document.querySelector(".final-cta");
const finalCtaSymbol = document.querySelector(".final-cta-symbol");
const finalCtaGlow = document.querySelector(".final-cta-glow");

if (finalCta && finalCtaSymbol && finalCtaGlow) {

    let touchStartY = 0;

    finalCta.addEventListener("touchstart", (event) => {

        const touch = event.touches[0];

        touchStartY = touch.clientY;

    }, { passive: true });


    finalCta.addEventListener("touchmove", (event) => {

        const touch = event.touches[0];

        const movement = touch.clientY - touchStartY;

        const limitedMovement = Math.max(
            -8,
            Math.min(8, movement * 0.25)
        );

        finalCtaSymbol.style.transform =
            `translateY(${limitedMovement}px)`;

        finalCtaGlow.style.transform =
            `translateY(${limitedMovement * 1.35}px) scale(1.03)`;

        finalCtaGlow.style.opacity = "1";

    }, { passive: true });


    finalCta.addEventListener("touchend", () => {

        finalCtaSymbol.style.transform = "";
        finalCtaGlow.style.transform = "";
        finalCtaGlow.style.opacity = "";

    }, { passive: true });

}