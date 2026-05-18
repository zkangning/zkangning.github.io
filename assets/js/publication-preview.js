document.addEventListener("DOMContentLoaded", function () {
  const previews = document.querySelectorAll(".publication-card-preview");

  if (!previews.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "publication-lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Publication preview");
  lightbox.innerHTML = [
    '<div class="publication-lightbox-panel">',
    '  <button class="publication-lightbox-close" type="button" aria-label="Close preview">',
    '    <i class="fa-solid fa-xmark" aria-hidden="true"></i>',
    "  </button>",
    '  <img class="publication-lightbox-image" alt="">',
    '  <div class="publication-lightbox-title"></div>',
    "</div>",
  ].join("");
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".publication-lightbox-image");
  const lightboxTitle = lightbox.querySelector(".publication-lightbox-title");
  const closeButton = lightbox.querySelector(".publication-lightbox-close");

  function imageFromTrigger(trigger) {
    if (trigger.classList.contains("publication-card-preview")) {
      return trigger;
    }

    const media = trigger.closest(".publication-card-media");
    return media ? media.querySelector(".publication-card-preview") : null;
  }

  function openPreview(image) {
    const title = image.dataset.previewTitle || image.alt || "";

    lightboxImage.src = image.dataset.previewSrc || image.currentSrc || image.src;
    lightboxImage.alt = image.alt || title;
    lightboxTitle.textContent = title;
    lightbox.hidden = false;
    document.body.classList.add("publication-lightbox-lock");

    window.requestAnimationFrame(function () {
      lightbox.classList.add("open");
      closeButton.focus({ preventScroll: true });
    });
  }

  function closePreview() {
    lightbox.classList.remove("open");
    document.body.classList.remove("publication-lightbox-lock");

    window.setTimeout(function () {
      if (!lightbox.classList.contains("open")) {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
      }
    }, 180);
  }

  document.querySelectorAll(".publication-card-preview, .publication-preview-zoom").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      const image = imageFromTrigger(trigger);

      if (!image) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openPreview(image);
    });
  });

  closeButton.addEventListener("click", closePreview);
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closePreview();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
      closePreview();
    }
  });
});
