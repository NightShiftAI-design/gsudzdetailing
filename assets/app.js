/* =========================
   GSUDZ DETAILING — V1 APP
   - Gallery render + filters
   - Form tabs (book/quote)
   - Presets (exterior/interior/full)
   - Formspree submit UX
   - Light bubble effect (safe)
   ========================= */

(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Gallery (placeholders for now) ----------
  // Replace src later with real images in /assets/img/*
  const galleryItems = [
    { id: "g1", cat: "cars",      src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=60", alt: "Clean car exterior" },
    { id: "g2", cat: "trucks",    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60", alt: "Detailed performance car" },
    { id: "g3", cat: "interiors", src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=60", alt: "Interior cleaned" },
    { id: "g4", cat: "rvmarine",  src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60", alt: "Boat / marine scene" },
    { id: "g5", cat: "cars",      src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=60", alt: "Glossy car paint" },
    { id: "g6", cat: "bikes",     src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=60", alt: "Motorcycle detailed" },
    { id: "g7", cat: "trucks",    src: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=60", alt: "Truck exterior" },
    { id: "g8", cat: "interiors", src: "https://images.unsplash.com/photo-1503377988381-1bfae7e3d1b1?auto=format&fit=crop&w=1200&q=60", alt: "Interior detail" },
    { id: "g9", cat: "rvmarine",  src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=60", alt: "RV / camper vibe" },
    { id: "g10",cat: "cars",      src: "https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?auto=format&fit=crop&w=1200&q=60", alt: "Car wash foam" },
    { id: "g11",cat: "bikes",     src: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60", alt: "Motorcycle close-up" },
    { id: "g12",cat: "trucks",    src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=60", alt: "Detailing work (placeholder)" },
  ];

  const galleryGrid = $("#galleryGrid");

  function renderGallery(filter = "all") {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = "";

    const items = filter === "all"
      ? galleryItems
      : galleryItems.filter(i => i.cat === filter);

    items.forEach((item) => {
      const a = document.createElement("button");
      a.type = "button";
      a.className = "gallery-item";
      a.dataset.cat = item.cat;
      a.setAttribute("aria-label", `Open image: ${item.alt}`);

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";

      a.appendChild(img);
      a.addEventListener("click", () => openLightbox(item.src, item.alt));

      galleryGrid.appendChild(a);
    });
  }

  // Simple lightbox (no dependency)
  let lightboxEl = null;

  function openLightbox(src, alt) {
    if (lightboxEl) lightboxEl.remove();

    lightboxEl = document.createElement("div");
    lightboxEl.style.position = "fixed";
    lightboxEl.style.inset = "0";
    lightboxEl.style.zIndex = "999";
    lightboxEl.style.background = "rgba(0,0,0,0.7)";
    lightboxEl.style.display = "grid";
    lightboxEl.style.placeItems = "center";
    lightboxEl.style.padding = "20px";

    const inner = document.createElement("div");
    inner.style.maxWidth = "1000px";
    inner.style.width = "100%";
    inner.style.borderRadius = "16px";
    inner.style.overflow = "hidden";
    inner.style.border = "1px solid rgba(215, 222, 232, 0.16)";
    inner.style.background = "rgba(5,10,20,0.9)";
    inner.style.backdropFilter = "blur(12px)";
    inner.style.boxShadow = "0 18px 60px rgba(0,0,0,0.6)";

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";

    const bar = document.createElement("div");
    bar.style.display = "flex";
    bar.style.justifyContent = "space-between";
    bar.style.alignItems = "center";
    bar.style.gap = "12px";
    bar.style.padding = "12px 14px";
    bar.style.borderTop = "1px solid rgba(215, 222, 232, 0.16)";
    bar.style.color = "#A9B2C3";
    bar.style.fontSize = "13px";

    const cap = document.createElement("div");
    cap.textContent = alt;

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Close";
    close.style.cursor = "pointer";
    close.style.border = "1px solid rgba(215, 222, 232, 0.16)";
    close.style.background = "rgba(255,255,255,0.06)";
    close.style.color = "#E9EEF7";
    close.style.padding = "8px 12px";
    close.style.borderRadius = "999px";

    close.addEventListener("click", () => lightboxEl?.remove());
    lightboxEl.addEventListener("click", (e) => {
      if (e.target === lightboxEl) lightboxEl.remove();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lightboxEl?.remove();
    }, { once: true });

    bar.appendChild(cap);
    bar.appendChild(close);

    inner.appendChild(img);
    inner.appendChild(bar);
    lightboxEl.appendChild(inner);
    document.body.appendChild(lightboxEl);
  }

  // Gallery filter chips
  const chips = $$(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      renderGallery(chip.dataset.filter || "all");
    });
  });

  // initial gallery
  renderGallery("all");

  // ---------- Form Tabs + behavior ----------
  const tabs = $$(".tab");
  const leadForm = $("#leadForm");
  const formTypeInput = $("#formType");
  const quoteBox = $("#quoteBox");
  const addonsBox = $("#addonsBox");

  function setTab(mode) {
    tabs.forEach(t => {
      const isActive = t.dataset.tab === mode;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (formTypeInput) formTypeInput.value = mode;

    // show/hide quote fields
    if (quoteBox) quoteBox.hidden = (mode !== "quote");
    if (addonsBox) addonsBox.style.display = (mode === "quote") ? "none" : "block";

    // make some fields required only in book mode
    const vehicleType = leadForm?.querySelector('select[name="vehicleType"]');
    const service = leadForm?.querySelector('select[name="service"]');

    if (vehicleType) vehicleType.required = (mode === "book");
    if (service) service.required = (mode === "book");
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      const mode = t.dataset.tab || "book";
      setTab(mode);
    });
  });

  // If any element links to #book with data-tab, switch
  $$('[data-tab]').forEach((el) => {
    el.addEventListener("click", () => {
      const mode = el.getAttribute("data-tab");
      if (mode === "quote" || mode === "book") setTab(mode);
    });
  });

  // Preset buttons for packages
  // data-preset: exterior / interior / full
  $$("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTab("book");
      const preset = btn.dataset.preset;
      const service = leadForm?.querySelector('select[name="service"]');
      if (service) {
        if (preset === "exterior") service.value = "Premium Exterior Wash";
        if (preset === "interior") service.value = "Extensive Interior Detail";
        if (preset === "full") service.value = "Full Detail";
      }
      // scroll soft focus into view
      setTimeout(() => leadForm?.querySelector('input[name="name"]')?.focus(), 200);
    });
  });

  // Initialize default tab
  setTab("book");

  // ---------- Formspree submit UX ----------
  const statusEl = $("#formStatus");
  const honeypot = $("#website");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!leadForm) return;

    // simple honeypot spam filter
    if (honeypot && honeypot.value.trim().length > 0) {
      // pretend success
      if (statusEl) statusEl.textContent = "Thanks — we’ll text you shortly.";
      leadForm.reset();
      return;
    }

    const action = leadForm.getAttribute("action") || "";
    if (!action || action.includes("FORMSPREE_ENDPOINT")) {
      if (statusEl) {
        statusEl.textContent = "Form isn’t connected yet. Replace FORMSPREE_ENDPOINT with your Formspree link.";
      }
      return;
    }

    const formData = new FormData(leadForm);

    // Make addons readable: FormData sends multiples fine, but we can also add a combined string
    const addons = formData.getAll("addons");
    if (addons.length) formData.set("addonsSummary", addons.join(", "));

    // Send JSON-ish? Formspree accepts standard form posts.
    try {
      if (statusEl) statusEl.textContent = "Sending…";

      const res = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        if (statusEl) statusEl.textContent = "✅ Thanks — we’ll text you shortly.";
        leadForm.reset();
        setTab("book");
      } else {
        if (statusEl) statusEl.textContent = "Something went wrong. Please text or call instead.";
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = "Network error. Please text or call instead.";
    }
  }

  if (leadForm) leadForm.addEventListener("submit", handleSubmit);

  // ---------- Lightweight bubble animation (hero) ----------
  // Generates floating bubbles inside .hero__bubbles using CSS variables.
  function initBubbles() {
    if (prefersReducedMotion) return;
    const holder = $(".hero__bubbles");
    if (!holder) return;

    // Clear background (we keep the subtle CSS gradient, but add animated bubbles as divs)
    // We'll add 12 bubbles max.
    const count = 12;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "bubble";
      const size = rand(10, 28);
      const left = rand(0, 100);
      const delay = rand(0, 6);
      const dur = rand(10, 22);
      const blur = rand(0, 4);
      const op = rand(0.08, 0.18);

      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${left}%`;
      b.style.animationDelay = `${delay}s`;
      b.style.animationDuration = `${dur}s`;
      b.style.filter = `blur(${blur}px)`;
      b.style.opacity = `${op}`;

      holder.appendChild(b);
    }

    // Inject minimal CSS for bubbles (keeps everything in one file)
    const style = document.createElement("style");
    style.textContent = `
      .bubble{
        position:absolute;
        bottom:-40px;
        border-radius:999px;
        border:1px solid rgba(215,222,232,0.22);
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.02));
        animation: floatUp linear infinite;
        transform: translateZ(0);
        pointer-events:none;
      }
      @keyframes floatUp{
        0%   { transform: translate3d(0, 0, 0) scale(1); }
        100% { transform: translate3d(${rand(-30, 30)}px, -900px, 0) scale(1.1); }
      }
    `;
    document.head.appendChild(style);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  initBubbles();
})();
