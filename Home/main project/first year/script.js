// -------- utilities --------

// Fix relative image paths and lazy-load images
function fixImagePaths(el, batchFile) {
  const basePath = batchFile.substring(0, batchFile.lastIndexOf("/") + 1);
  el.querySelectorAll("img").forEach(img => {
    const oldSrc = img.getAttribute("src");
    if (oldSrc && !oldSrc.startsWith("http") && !oldSrc.startsWith("/")) {
      img.src = basePath + oldSrc;
    }
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
    img.decoding = "async";
  });
}

// Remove IDs from cloned nodes to avoid duplicates
function stripIds(root) {
  if (root.nodeType !== 1) return;
  if (root.hasAttribute && root.hasAttribute("id")) root.removeAttribute("id");
  root.querySelectorAll?.("[id]").forEach(n => n.removeAttribute("id"));
}

// Wait until all images inside an element are loaded
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

// Measure width of first set of cards (for travel distance)
function measureFirstSetWidth(track, count) {
  if (count === 0) return 0;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.columnGap || style.gap || "0");
  const first = track.children[0];
  const lastOfFirstSet = track.children[count - 1];
  const rect1 = first.getBoundingClientRect();
  const rectN = lastOfFirstSet.getBoundingClientRect();
  const diff = (rectN.right - rect1.left) + gap;
  return Math.max(0, Math.round(diff));
}

// Set CSS variables for animation
function setupMarquee(containerEl, trackEl, firstSetCount) {
  const travel = measureFirstSetWidth(trackEl, firstSetCount);
  containerEl.style.setProperty("--travel", travel + "px");

  const speed = parseFloat(getComputedStyle(containerEl).getPropertyValue("--speed-px-per-sec")) || 100;
  const duration = travel > 0 ? (travel / speed) : 30;
  containerEl.style.setProperty("--duration", duration + "s");
}

// Duplicate first set of cards for seamless loop
function duplicateFirstSet(trackEl, firstSetCount) {
  const originals = Array.from(trackEl.children).slice(0, firstSetCount);
  originals.forEach(node => {
    const clone = node.cloneNode(true);
    stripIds(clone);
    trackEl.appendChild(clone);
  });
}

// Debounce utility
function debounce(fn, ms = 150) {
  let t; 
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
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

      container.innerHTML = "";
      const track = document.createElement("div");
      track.className = "marquee-track";
      container.appendChild(track);

      // Preload cards + images before appending
      const cardPromises = Array.from(cards).map(card => {
        const clone = card.cloneNode(true);
        fixImagePaths(clone, batchFile);
        stripIds(clone);
        return waitForImages(clone).then(() => track.appendChild(clone));
      });

      Promise.all(cardPromises).then(() => {
        const firstSetCount = track.children.length;

        // Duplicate first set for infinite scroll
        duplicateFirstSet(track, firstSetCount);

        // Set direction and setup animation
        container.style.setProperty("--direction", direction);
        setupMarquee(container, track, firstSetCount);

        // Recalculate on window resize
        const recalc = debounce(() => setupMarquee(container, track, firstSetCount), 200);
        window.addEventListener("resize", recalc);
      });
    })
    .catch(err => console.error("Error loading batch:", err));
}

// Recalculate marquee on pageshow (after reload/back)
window.addEventListener("pageshow", () => {
  document.querySelectorAll(".scroll-row .marquee-track").forEach(track => {
    const container = track.parentElement;
    const firstSetCount = track.children.length / 2;
    waitForImages(track).then(() => setupMarquee(container, track, firstSetCount));
  });
});
