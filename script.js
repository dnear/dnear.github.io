/* =========================================================
   DENKA NEAR — SPACE PORTFOLIO
   script.js
========================================================= */


/* =========================================================
   01. ELEMENTS
========================================================= */

const body = document.body;

const navbar = document.querySelector(".navbar");

const cursorGlow = document.querySelector(".cursor-glow");

const mobileMenu = document.querySelector(".mobile-menu");

const desktopNavLinks = document.querySelectorAll(".nav-link");

const sideLinks = document.querySelectorAll(".side-link");

const sections = document.querySelectorAll(
    ".section-target"
);

const revealElements = document.querySelectorAll(
    ".reveal"
);

const projectCard = document.querySelector(
    ".tilt-card"
);


/* =========================================================
   02. MOUSE STATE
========================================================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let targetMouseX = mouseX;
let targetMouseY = mouseY;


/* =========================================================
   03. MOUSE TRACKING
========================================================= */

window.addEventListener(
    "mousemove",
    (event) => {

        targetMouseX = event.clientX;
        targetMouseY = event.clientY;

    },
    { passive: true }
);


/* =========================================================
   04. SMOOTH MOUSE PARALLAX
========================================================= */

function animateSpace() {

    mouseX +=
        (targetMouseX - mouseX) * 0.06;

    mouseY +=
        (targetMouseY - mouseY) * 0.06;


    const x =
        mouseX / window.innerWidth - 0.5;

    const y =
        mouseY / window.innerHeight - 0.5;


    /*
     * Different layers move at different speeds.
     * This creates the illusion of depth.
     */


    const starLayer1 =
        document.querySelector(
            ".stars-layer-1"
        );

    const starLayer2 =
        document.querySelector(
            ".stars-layer-2"
        );

    const starLayer3 =
        document.querySelector(
            ".stars-layer-3"
        );

    const galaxy =
        document.querySelector(
            ".galaxy"
        );

    const planetMain =
        document.querySelector(
            ".planet-main"
        );

    const planetSmall =
        document.querySelector(
            ".planet-small"
        );


    if (starLayer1) {

        starLayer1.style.transform =
            `translate(
                ${x * -8}px,
                ${y * -8}px
            )`;

    }


    if (starLayer2) {

        starLayer2.style.transform =
            `translate(
                ${x * -18}px,
                ${y * -18}px
            )`;

    }


    if (starLayer3) {

        starLayer3.style.transform =
            `translate(
                ${x * -32}px,
                ${y * -32}px
            )`;

    }


    if (galaxy) {

        galaxy.style.transform =
            `translate(
                ${x * -35}px,
                ${y * -25}px
            )
            rotate(-24deg)`;

    }


    if (planetMain) {

        planetMain.style.transform =
            `translate(
                ${x * -45}px,
                ${y * -45}px
            )`;

    }


    if (planetSmall) {

        planetSmall.style.transform =
            `translate(
                ${x * -75}px,
                ${y * -75}px
            )`;

    }


    /*
     * Asteroids
     */

    const asteroids =
        document.querySelectorAll(
            ".asteroid"
        );


    asteroids.forEach(
        (asteroid, index) => {

            const depth =
                (index + 1) * 8;

            const rotate =
                x * (index % 2 === 0 ? 8 : -8);

            asteroid.style.transform =
                `translate(
                    ${x * depth}px,
                    ${y * depth}px
                )
                rotate(${rotate}deg)`;

        }
    );


    /*
     * Cursor glow
     */

    if (cursorGlow) {

        cursorGlow.style.left =
            `${mouseX}px`;

        cursorGlow.style.top =
            `${mouseY}px`;

    }


    requestAnimationFrame(
        animateSpace
    );

}


animateSpace();


/* =========================================================
   05. NAVBAR SCROLL EFFECT
========================================================= */

function updateNavbar() {

    if (window.scrollY > 40) {

        navbar.classList.add(
            "scrolled"
        );

    } else {

        navbar.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
);


updateNavbar();


/* =========================================================
   06. SCROLL REVEAL
========================================================= */

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   07. ACTIVE NAVIGATION
========================================================= */

const navigationObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        const id =
                            entry.target.id;


                        /*
                         * Desktop navigation
                         */

                        desktopNavLinks.forEach(
                            (link) => {

                                link.classList.remove(
                                    "active"
                                );


                                if (
                                    link.getAttribute(
                                        "href"
                                    ) === `#${id}`
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );


                        /*
                         * Side navigation
                         */

                        sideLinks.forEach(
                            (link) => {

                                link.classList.remove(
                                    "active"
                                );


                                if (
                                    link.getAttribute(
                                        "href"
                                    ) === `#${id}`
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );

                    }

                }
            );

        },
        {
            rootMargin:
                "-35% 0px -55% 0px"
        }
    );


sections.forEach(
    (section) => {

        navigationObserver.observe(
            section
        );

    }
);


/* =========================================================
   08. SMOOTH NAVIGATION
========================================================= */

const allNavigationLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


allNavigationLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {

                    return;

                }


                event.preventDefault();


                const navbarHeight =
                    navbar.offsetHeight;


                const targetPosition =
                    target.getBoundingClientRect()
                        .top
                    +
                    window.scrollY
                    -
                    navbarHeight;


                window.scrollTo({

                    top:
                        targetPosition,

                    behavior:
                        "smooth"

                });


                /*
                 * Close mobile menu
                 */

                navbar.classList.remove(
                    "menu-open"
                );

            }
        );

    }
);


/* =========================================================
   09. MOBILE MENU
========================================================= */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            navbar.classList.toggle(
                "menu-open"
            );

        }
    );

}


/* =========================================================
   10. CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    (event) => {

        if (
            !navbar.contains(
                event.target
            )
        ) {

            navbar.classList.remove(
                "menu-open"
            );

        }

    }
);


/* =========================================================
   11. PROJECT CARD 3D TILT
========================================================= */

if (
    projectCard &&
    window.matchMedia(
        "(pointer: fine)"
    ).matches
) {

    projectCard.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                projectCard.getBoundingClientRect();


            const centerX =
                rect.left +
                rect.width / 2;


            const centerY =
                rect.top +
                rect.height / 2;


            const rotateX =
                (event.clientY - centerY)
                /
                rect.height
                *
                -5;


            const rotateY =
                (event.clientX - centerX)
                /
                rect.width
                *
                7;


            projectCard.style.transform =
                `
                perspective(1200px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-3px)
                `;

        }
    );


    projectCard.addEventListener(
        "mouseleave",
        () => {

            projectCard.style.transform =
                `
                perspective(1200px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
                `;

        }
    );

}


/* =========================================================
   12. PARALLAX ON SCROLL
========================================================= */

let ticking = false;


function updateScrollParallax() {

    const scrollY =
        window.scrollY;


    const galaxy =
        document.querySelector(
            ".galaxy"
        );


    const planetMain =
        document.querySelector(
            ".planet-main"
        );


    const planetSmall =
        document.querySelector(
            ".planet-small"
        );


    if (galaxy) {

        galaxy.style.marginTop =
            `${scrollY * 0.04}px`;

    }


    if (planetMain) {

        planetMain.style.marginTop =
            `${scrollY * 0.025}px`;

    }


    if (planetSmall) {

        planetSmall.style.marginTop =
            `${scrollY * 0.06}px`;

    }


    ticking = false;

}


window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                updateScrollParallax
            );

            ticking = true;

        }

    },
    { passive: true }
);


/* =========================================================
   13. RANDOM STAR TWINKLE
========================================================= */

function createTwinkleStars() {

    const background =
        document.querySelector(
            ".space-background"
        );


    if (!background) {

        return;

    }


    const starContainer =
        document.createElement(
            "div"
        );


    starContainer.className =
        "twinkle-stars";


    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const star =
            document.createElement(
                "span"
            );


        const size =
            Math.random() * 2 + 1;


        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.animationDelay =
            `${Math.random() * 5}s`;

        star.style.animationDuration =
            `${2 + Math.random() * 4}s`;


        starContainer.appendChild(
            star
        );

    }


    background.appendChild(
        starContainer
    );

}


createTwinkleStars();


/* =========================================================
   14. DYNAMIC YEAR
========================================================= */

const footerYear =
    document.querySelector(
        ".footer span"
    );


if (footerYear) {

    footerYear.textContent =
        `© ${new Date().getFullYear()} DENKA NEAR`;

}


/* =========================================================
   15. PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "loaded"
        );

    }
);

/* =========================================================
   D-FINANCE 3D SCREENSHOT CAROUSEL
   ========================================================= */

const financeCarousel = document.getElementById("financeCarousel");

if (financeCarousel) {

    const slides = [
        ...financeCarousel.querySelectorAll(".carousel-slide")
    ];

    const dots = [
        ...financeCarousel.querySelectorAll(".carousel-dot")
    ];

    const prevButton =
        financeCarousel.querySelector(".carousel-prev");

    const nextButton =
        financeCarousel.querySelector(".carousel-next");


    let currentSlide = 0;

    let carouselTimer = null;


    /* -----------------------------------------------------
       UPDATE CAROUSEL
       ----------------------------------------------------- */

    function updateFinanceCarousel(index) {

        currentSlide =
            (index + slides.length) % slides.length;


        slides.forEach((slide, i) => {

            slide.classList.remove(
                "active",
                "left",
                "right",
                "hidden-left",
                "hidden-right"
            );


            if (i === currentSlide) {

                slide.classList.add("active");

            } else if (
                i ===
                (currentSlide - 1 + slides.length) %
                    slides.length
            ) {

                slide.classList.add("left");

            } else if (
                i ===
                (currentSlide + 1) %
                    slides.length
            ) {

                slide.classList.add("right");

            } else {

                /*
                 * Menentukan posisi tersembunyi
                 */

                const distance =
                    (i - currentSlide + slides.length) %
                    slides.length;

                if (
                    distance <
                    slides.length / 2
                ) {

                    slide.classList.add(
                        "hidden-right"
                    );

                } else {

                    slide.classList.add(
                        "hidden-left"
                    );
                }
            }
        });


        /* Update dots */

        dots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentSlide
            );

        });
    }


    /* -----------------------------------------------------
       NEXT
       ----------------------------------------------------- */

    function nextFinanceSlide() {

        updateFinanceCarousel(
            currentSlide + 1
        );
    }


    /* -----------------------------------------------------
       PREVIOUS
       ----------------------------------------------------- */

    function previousFinanceSlide() {

        updateFinanceCarousel(
            currentSlide - 1
        );
    }


    /* -----------------------------------------------------
       AUTO PLAY
       ----------------------------------------------------- */

    function startFinanceCarousel() {

        stopFinanceCarousel();

        carouselTimer = setInterval(() => {

            nextFinanceSlide();

        }, 2000);
    }


    function stopFinanceCarousel() {

        if (carouselTimer) {

            clearInterval(carouselTimer);

            carouselTimer = null;
        }
    }


    /* -----------------------------------------------------
       BUTTON EVENTS
       ----------------------------------------------------- */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                nextFinanceSlide();

                startFinanceCarousel();
            }
        );
    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            () => {

                previousFinanceSlide();

                startFinanceCarousel();
            }
        );
    }


    /* -----------------------------------------------------
       DOT EVENTS
       ----------------------------------------------------- */

    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                updateFinanceCarousel(index);

                startFinanceCarousel();
            }
        );
    });


    /* -----------------------------------------------------
       PAUSE WHEN HOVER
       ----------------------------------------------------- */

    financeCarousel.addEventListener(
        "mouseenter",
        () => {

            stopFinanceCarousel();
        }
    );


    financeCarousel.addEventListener(
        "mouseleave",
        () => {

            startFinanceCarousel();
        }
    );


    /* -----------------------------------------------------
       INITIAL STATE
       ----------------------------------------------------- */

    updateFinanceCarousel(0);

    startFinanceCarousel();
}