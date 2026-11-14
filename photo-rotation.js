"use strict";

document.querySelectorAll("[data-exercise-photos]").forEach((gallery) => {
    const picture = gallery.querySelector("img");
    const photos = [picture.getAttribute("src"), ...gallery.dataset.exercisePhotos.split(",")];
    const controls = gallery.querySelector("[data-photo-controls]");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let timer;
    let playing = !reducedMotion.matches;

    function neighbor(offset) {
        return (index + offset + photos.length) % photos.length;
    }

    function preloadNext() {
        if (playing && !document.hidden) {
            const next = new Image();
            next.src = photos[neighbor(1)];
        }
    }

    async function show(offset, automatic = false) {
        index = neighbor(offset);
        const requestedIndex = index;
        const next = new Image();
        next.src = photos[requestedIndex];
        try {
            await next.decode();
        } catch {
            // Missing image files are temporarily omitted from the slideshow.
            // Continue to the next valid image instead of leaving a broken image.
            if (automatic && index === requestedIndex) {
                const fallbackIndex = neighbor(1);
                index = fallbackIndex;
                if (fallbackIndex !== requestedIndex) show(0, true);
            }
            return;
        }
        if (index === requestedIndex && (!automatic || (playing && !document.hidden))) {
            picture.src = photos[requestedIndex];
            preloadNext();
        }
    }

    function updateTimer() {
        clearInterval(timer);

        if (playing && !document.hidden) {
            preloadNext();
            timer = setInterval(() => show(1, true), 6500);
        }
    }

    function step(offset) {
        show(offset);
        updateTimer();
    }

    controls.querySelector("[data-photo-prev]").addEventListener("click", () => step(-1));
    controls.querySelector("[data-photo-next]").addEventListener("click", () => step(1));

    reducedMotion.addEventListener("change", (event) => {
        if (event.matches) playing = false;
        updateTimer();
    });
    document.addEventListener("visibilitychange", updateTimer);
    controls.hidden = false;
    updateTimer();
});
