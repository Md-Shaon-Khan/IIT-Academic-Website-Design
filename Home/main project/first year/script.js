// -------- utilities --------
  function fixImagePaths(el, batchFile) {
    const basePath = batchFile.substring(0, batchFile.lastIndexOf("/") + 1);
    el.querySelectorAll("img").forEach(img => {
      const oldSrc = img.getAttribute("src");
      if (oldSrc && !oldSrc.startsWith("http") && !oldSrc.startsWith("/")) {
        img.src = basePath + oldSrc;
      }
      // prevent layout shift: ensure width/height attributes if missing (optional)
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      img.decoding = "async";
    });
  }

  // remove IDs inside cloned content to avoid duplicate-id bugs
  function stripIds(root) {
    if (root.nodeType !== 1) return;
    if (root.hasAttribute && root.hasAttribute("id")) root.removeAttribute("id");
    root.querySelectorAll?.("[id]").forEach(n => n.removeAttribute("id"));
  }

  // wait for images inside an element (helps compute precise width if needed)
  function waitForImages(el) {
    const imgs = Array.from(el.querySelectorAll("img"));
    if (imgs.length === 0) return Promise.resolve();
    return Promise.allSettled(
      imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => {
        img.addEventListener("load", res, { once: true });
        img.addEventListener("error", res, { once: true });
      }))
    ).then(() => {});
  }

  // compute the width of the first set (including gaps) robustly
  function measureFirstSetWidth(track, count) {
    if (count === 0) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0"); // Safari uses columnGap sometimes
    const first = track.children[0];
    const lastOfFirstSet = track.children[count - 1];
    const rect1 = first.getBoundingClientRect();
    const rectN = lastOfFirstSet.getBoundingClientRect();
    // distance from left edge of first to right edge of last + one gap at the end
    const diff = (rectN.right - rect1.left) + gap;
    return Math.max(0, Math.round(diff));
  }

  // init marquee: set --travel and --duration based on content width
  function setupMarquee(containerEl, trackEl, firstSetCount) {
    const travel = measureFirstSetWidth(trackEl, firstSetCount);
    containerEl.style.setProperty("--travel", travel + "px");

    // speed = pixels per second (read from CSS variable to keep single source of truth)
    const speed = parseFloat(getComputedStyle(containerEl).getPropertyValue("--speed-px-per-sec")) || 100;
    const duration = travel > 0 ? (travel / speed) : 30; // sane fallback
    containerEl.style.setProperty("--duration", duration + "s");
  }

  // duplicate first set once to make a seamless loop (total = 2x)
  function duplicateFirstSet(trackEl, firstSetCount) {
    const originals = Array.from(trackEl.children).slice(0, firstSetCount);
    originals.forEach(node => {
      const clone = node.cloneNode(true);
      stripIds(clone);
      trackEl.appendChild(clone);
    });
  }

  // debounce for resize recalculation
  function debounce(fn, ms = 150) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // -------- main loader --------
  document.addEventListener("DOMContentLoaded", () => {
      const batchList = [
        { file: "Batch-52/index.html", container: "batch-52-projects", dir: 1 },
        { file: "Batch-51/index.html", container: "batch-51-projects", dir: -1 },
        { file: "Batch-50/index.html", container: "batch-50-projects", dir: 1 },
      ];

    batchList.forEach(b => {
      loadBatchProjects(b.file, b.container, b.dir);
    });

  });
  function loadBatchProjects(batchFile, containerId, direction = 1) {
    fetch(batchFile)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const cards = doc.querySelectorAll(".project-card");
        const container = document.getElementById(containerId);
        if (!container) return;

        // build inner track
        container.innerHTML = "";
        const track = document.createElement("div");
        track.className = "marquee-track";
        container.appendChild(track);

        // add FIRST set (cloned) with fixed image paths + safe IDs
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          fixImagePaths(clone, batchFile);
          stripIds(clone);
          track.appendChild(clone);
        });

        const firstSetCount = track.children.length;
        if (firstSetCount === 0) return; // no cards, nothing to animate

        // add SECOND set (duplicates) so loop is seamless
        duplicateFirstSet(track, firstSetCount);

        // compute sizes after images are (mostly) ready
        waitForImages(track).then(() => {
          setupMarquee(container, track, firstSetCount);
          container.style.setProperty("--direction", direction); // <-- set direction
        });

        // recompute on resize (layout or responsive card width changes)
        const recalc = debounce(() => setupMarquee(container, track, firstSetCount), 200);
        window.addEventListener("resize", recalc);

      })
      .catch(err => console.error("Error loading batch:", err));
  }

  window.addEventListener("pageshow", () => {
    document.querySelectorAll(".scroll-row .marquee-track").forEach(track => {
      const container = track.parentElement;
      const firstSetCount = track.children.length / 2;
      setupMarquee(container, track, firstSetCount);
    });
  });

  