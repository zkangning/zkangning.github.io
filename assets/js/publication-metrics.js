(function () {
  const metricLinks = Array.from(document.querySelectorAll("[data-github-repo]"));

  if (!metricLinks.length) {
    return;
  }

  const cacheDuration = 6 * 60 * 60 * 1000;
  const numberFormatter = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  function formatCount(value) {
    return numberFormatter.format(Number(value) || 0);
  }

  function setCount(link, count, isLive) {
    const countElement = link.querySelector("[data-github-stars]");

    if (!countElement) {
      return;
    }

    countElement.textContent = formatCount(count);
    link.dataset.metricState = isLive ? "live" : "cached";
    link.title = isLive ? "Live GitHub star count" : "GitHub star count (cached fallback)";
  }

  function readCache(repo) {
    try {
      const cached = JSON.parse(window.localStorage.getItem(`github-stars:${repo}`));
      if (cached && Date.now() - cached.updatedAt < cacheDuration) {
        return cached.count;
      }
    } catch (_error) {
      return null;
    }

    return null;
  }

  function writeCache(repo, count) {
    try {
      window.localStorage.setItem(
        `github-stars:${repo}`,
        JSON.stringify({ count: count, updatedAt: Date.now() }),
      );
    } catch (_error) {
      // Static values rendered by Jekyll remain available when storage is disabled.
    }
  }

  metricLinks.forEach(function (link) {
    const repo = link.dataset.githubRepo;
    const fallbackCount = link.querySelector("[data-github-stars]")?.textContent;
    const cachedCount = readCache(repo);

    setCount(link, cachedCount === null ? fallbackCount : cachedCount, false);

    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(`GitHub metrics request failed with ${response.status}`);
        }
        return response.json();
      })
      .then(function (data) {
        if (typeof data.stargazers_count !== "number") {
          return;
        }
        setCount(link, data.stargazers_count, true);
        writeCache(repo, data.stargazers_count);
      })
      .catch(function () {
        link.dataset.metricState = "fallback";
      });
  });
})();
