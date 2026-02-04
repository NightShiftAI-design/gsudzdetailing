/* =========================
   GSUDZ DETAILING — V2 APP (Performance / Track)
   - Gallery render + filters + lightbox
   - Form tabs (book/quote)
   - Presets (exterior/interior/full)
   - Formspree submit UX + honeypot
   - Hero floating bubbles (lightweight)
   - Cursor ripple bubbles (hero-only, rate-limited)
   ========================= */

(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const rand = (min, max) => Math.random() * (max - min) + min;

  const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61561183088796";

  // ---------------------------------------------------------
  // Gallery (placeholders for now)
  // Replace later with /assets/img/*
  // ---------------------------------------------------------
  const galleryItems = [
    { id: "g1", cat: "cars",      src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=60", alt: "Glossy car paint" },
    { id: "g2", cat: "trucks",    src: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1400&q=60", alt: "Truck exterior" },
    { id: "g3", cat: "interiors", src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1400&q=60", alt: "Interior cleaned" },
    { id: "g4", cat: "rvmarine",  src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=60", alt: "Boat / marine scene" },
    { id: "g5", cat: "cars",      src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=60", alt: "Performance car detail" },
    { id: "g6", cat: "bikes",     src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=60", alt: "Motorcycle detailed" },
    { id: "g7", cat: "trucks",    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=60", alt: "Clean car exterior" },
    { id: "g8", cat: "interiors", src: "https://images.unsplash.com/photo-1503377988381-1bfae7e3d1b1?auto=format&fit=crop&w=1400&q=60", alt: "Interior detail" },
    { id: "g9", cat: "rvmarine",  src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1400&q=60", alt: "RV / camper vibe" },
    { id: "g10",cat: "cars",      src: "https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?auto=format&fit=crop&w=1400&q=60", alt: "Car wash foam" },
    { id: "g11",cat: "bikes",     src: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=60", alt: "Motorcycle close-up" },
    { id: "g12",cat: "trucks",    src: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1400&q=60", alt: "Detailing work (placeholder)" },
  ];

  const galleryGrid = $("#galleryGrid");

  function renderGallery(filter = "all") {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = "";

    const items = (filter === "all") ? galleryItems : galleryItems.filter(i => i.cat === filter);

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item";
      btn.dataset.cat = item.cat;
      btn.setAttribute("aria-label", `Open image: ${item.alt}`);

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";

      btn.appendChild(img);
      btn.addEventListener("click", () => openLightbox(item.src, item.alt));

      galleryGrid.appendChild(btn);
    });
  }

  // ---------------------------------------------------------
  // Lightbox (better UX)
  // ---------------------------------------------------------
  let lightboxEl = null;
  let lastFocusedEl = null;

  function openLightbox(src, alt) {
    closeLightbox();

    lastFocusedEl = document.activeElement;

    lightboxEl = document.createElement("div");
    lightboxEl.setAttribute("role", "dialog");
    lightboxEl.setAttribute("aria-modal", "true");
    lightboxEl.style.position = "fixed";
    lightboxEl.style.inset = "0";
    lightboxEl.style.zIndex = "999";
    lightboxEl.style.background = "rgba(0,0,0,0.72)";
    lightboxEl.style.display = "grid";
    lightboxEl.style.placeItems = "center";
    lightboxEl.style.padding = "20px";

    const inner = document.createElement("div");
    inner.style.maxWidth = "1040px";
    inner.style.width = "100%";
    inner.style.borderRadius = "16px";
    inner.style.overflow = "hidden";
    inner.style.border = "1px solid rgba(255,255,255,0.12)";
    inner.style.background = "rgba(10,12,18,0.92)";
    inner.style.backdropFilter = "blur(12px)";
    inner.style.boxShadow = "0 18px 60px rgba(0,0,0,0.70)";

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
    bar.style.borderTop = "1px solid rgba(255,255,255,0.12)";
    bar.style.color = "rgba(242,245,255,0.72)";
    bar.style.fontSize = "13px";

    const cap = document.createElement("div");
    cap.textContent = alt;

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Close";
    close.style.cursor = "pointer";
    close.style.border = "1px solid rgba(255,255,255,0.12)";
    close.style.background = "rgba(255,255,255,0.06)";
    close.style.color = "#F2F5FF";
    close.style.padding = "8px 12px";
    close.style.borderRadius = "999px";

    close.addEventListener("click", closeLightbox);

    lightboxEl.addEventListener("click", (e) => {
      if (e.target === lightboxEl) closeLightbox();
    });

    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);

    // store to cleanup
    lightboxEl._cleanup = () => document.removeEventListener("keydown", onKey);

    bar.appendChild(cap);
    bar.appendChild(close);

    inner.appendChild(img);
    inner.appendChild(bar);
    lightboxEl.appendChild(inner);
    document.body.appendChild(lightboxEl);

    close.focus();
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    if (typeof lightboxEl._cleanup === "function") lightboxEl._cleanup();
    lightboxEl.remove();
    lightboxEl = null;
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
    lastFocusedEl = null;
  }

  // Filter chips
  const chips = $$(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      renderGallery(chip.dataset.filter || "all");
    });
  });

  renderGallery("all");

  // ---------------------------------------------------------
  // Form Tabs + behavior
  // ---------------------------------------------------------
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

    if (quoteBox) quoteBox.hidden = (mode !== "quote");
    if (addonsBox) addonsBox.style.display = (mode === "quote") ? "none" : "block";

    const vehicleType = leadForm?.querySelector('select[name="vehicleType"]');
    const service = leadForm?.querySelector('select[name="service"]');

    if (vehicleType) vehicleType.required = (mode === "book");
    if (service) service.required = (mode === "book");
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => setTab(t.dataset.tab || "book"));
  });

  // Click elements with data-tab to switch
  $$("[data-tab]").forEach((el) => {
    el.addEventListener("click", () => {
      const mode = el.getAttribute("data-tab");
      if (mode === "quote" || mode === "book") setTab(mode);
    });
  });

  // Presets
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

      setTimeout(() => leadForm?.querySelector('input[name="name"]')?.focus(), 150);
    });
  });

  setTab("book");

  // ---------------------------------------------------------
  // Formspree submit UX
  // ---------------------------------------------------------
  const statusEl = $("#formStatus");
  const honeypot = $("#website");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!leadForm) return;

    // honeypot
    if (honeypot && honeypot.value.trim().length > 0) {
      if (statusEl) statusEl.textContent = "✅ Thanks — we’ll text you shortly.";
      leadForm.reset();
      return;
    }

    const action = leadForm.getAttribute("action") || "";
    if (!action || action.includes("FORMSPREE_ENDPOINT")) {
      if (statusEl) statusEl.textContent = "Form isn’t connected yet. Replace FORMSPREE_ENDPOINT with your Formspree link.";
      return;
    }

    const formData = new FormData(leadForm);
    const addons = formData.getAll("addons");
    if (addons.length) formData.set("addonsSummary", addons.join(", "));

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
    } catch {
      if (statusEl) statusEl.textContent = "Network error. Please text or call instead.";
    }
  }

  if (leadForm) leadForm.addEventListener("submit", handleSubmit);

  // ---------------------------------------------------------
  // Hero floating bubbles (always-on, lightweight)
  // ---------------------------------------------------------
  function initBubbles() {
    if (prefersReducedMotion) return;
    const holder = $(".hero__bubbles");
    if (!holder) return;

    // avoid duplicates if hot reloaded
    if (holder.dataset.bubblesInit === "1") return;
    holder.dataset.bubblesInit = "1";

    const count = 12;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "bubble";

      const size = rand(10, 28);
      const left = rand(0, 100);
      const delay = rand(0, 6);
      const dur = rand(16, 30);
      const blur = rand(0, 4);
      const op = rand(0.07, 0.16);
      const drift = rand(-18, 18);

      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${left}%`;
      b.style.animationDelay = `${delay}s`;
      b.style.animationDuration = `${dur}s`;
      b.style.filter = `blur(${blur}px)`;
      b.style.opacity = `${op}`;
      b.style.setProperty("--drift", `${drift}px`);

      holder.appendChild(b);
    }

    // Inject bubble CSS once
    if (!$("#__bubbleStyle")) {
      const style = document.createElement("style");
      style.id = "__bubbleStyle";
      style.textContent = `
        .bubble{
          position:absolute;
          bottom:-40px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.16);
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.02));
          animation: floatUp linear infinite;
          transform: translateZ(0);
          pointer-events:none;
        }
        @keyframes floatUp{
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(var(--drift, 0px), -900px, 0) scale(1.10); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---------------------------------------------------------
  // Cursor ripple bubbles (Hero only, rate-limited)
  // ---------------------------------------------------------
  function initCursorRipples() {
    if (prefersReducedMotion) return;

    const hero = $(".hero");
    const holder = $(".hero__bubbles");
    if (!hero || !holder) return;

    let lastTime = 0;
    const rateLimitMs = 333; // ~3/sec
    const maxOnScreen = 18;

    function spawnRipple(clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const b = document.createElement("div");
      b.className = "ripple-bubble";

      const size = rand(14, 32);
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${(x / rect.width) * 100}%`;
      b.style.top = `${(y / rect.height) * 100}%`;

      holder.appendChild(b);
      setTimeout(() => b.remove(), 950);

      const ripples = $$(".ripple-bubble", holder);
      if (ripples.length > maxOnScreen) {
        ripples.slice(0, ripples.length - maxOnScreen).forEach(n => n.remove());
      }
    }

    hero.addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - lastTime < rateLimitMs) return;
      lastTime = now;
      spawnRipple(e.clientX, e.clientY);
    });

    hero.addEventListener("touchstart", (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      spawnRipple(t.clientX, t.clientY);
    }, { passive: true });
  }

  initBubbles();
  initCursorRipples();

  // ---------------------------------------------------------
  // Convenience: any “More Work on Facebook” buttons can use this
  // ---------------------------------------------------------
  $$('[data-open-facebook]').forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(FACEBOOK_URL, "_blank", "noopener,noreferrer");
    });
  });
})();
