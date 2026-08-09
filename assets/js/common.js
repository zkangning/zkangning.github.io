$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 100,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });

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
});
