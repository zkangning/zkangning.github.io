document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".publication-preview-zoom").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const media = button.closest(".publication-card-media");
      const image = media ? media.querySelector("img[data-zoomable]") : null;

      if (!image) {
        return;
      }

      if (window.medium_zoom && typeof window.medium_zoom.open === "function") {
        window.medium_zoom.open({ target: image });
        return;
      }

      image.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    });
  });
});
