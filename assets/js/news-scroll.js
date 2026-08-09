document.querySelectorAll(".news-scroll[data-visible-items]").forEach(function (container) {
  const table = container.querySelector("table");
  const visibleItems = Number.parseInt(container.dataset.visibleItems, 10);

  if (!table || !Number.isFinite(visibleItems) || visibleItems < 1) {
    return;
  }

  const resizeNews = function () {
    const rows = Array.from(table.querySelectorAll("tr"));

    if (rows.length <= visibleItems) {
      container.style.removeProperty("max-height");
      return;
    }

    const containerTop = container.getBoundingClientRect().top;
    const nextRowTop = rows[visibleItems].getBoundingClientRect().top;
    const maxHeight = `${Math.ceil(nextRowTop - containerTop)}px`;

    if (container.style.maxHeight !== maxHeight) {
      container.style.maxHeight = maxHeight;
    }
  };

  resizeNews();

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resizeNews);
    observer.observe(table);
  } else {
    window.addEventListener("resize", resizeNews);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(resizeNews);
  }
});
