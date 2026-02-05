/* =========================
   GSUDZ DETAILING — V4 APP (FULL)
   - Gallery render + filters + lightbox
   - Simplified lead form (no addonsBox/quoteBox)
   - Form tabs still supported (just sets hidden formType)
   - Form presets still supported (fills Service dropdown)
   - Formspree submit UX + honeypot
   - NEW: If Formspree not connected yet -> SMS fallback (prefilled)
   - Hero bubbles + cursor ripples (rate-limited)
   - Smooth-scroll offset for sticky header
   - NEW: Add-ons "Show more/less" toggle per card
   ========================= */

(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Optional: smooth scroll with sticky header offset ----------
  function initAnchorOffsetScroll() {
    const header = $(".topbar");
    const offset = header ? header.offsetHeight + 12 : 76;

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: "smooth" });
        history.pushState(null, "", href);
      });
    });
  }

  // ---------- Add-ons toggle ----------
  function initAddonsToggles() {
    const cards = $$(".card");

    function isOverflowing(el) {
      return el.scrollHeight > el.clientHeight + 2;
    }

    cards.forEach((card) => {
      const addons = $(".addons", card);
      const toggle = $(".addons-toggle", card);

      // Only apply if both exist AND intended to collapse
      if (!addons || !toggle) return;
      if (!addons.classList.contains("addons--collapsed")) return;

      const setOpen = (open) => {
        addons.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.textContent = open ? "Show less" : "Show more";
      };

      // Start closed
      setOpen(false);

      const checkAndHide = () => {
        // Ensure we're measuring in the CLOSED/clamped state
        setOpen(false);

        if (!isOverflowing(addons)) {
          // Not enough content to justify a toggle
          toggle.style.display = "none";
          // Keep it open so it doesn't look artificially constrained
          addons.classList.add("is-open");
        } else {
          toggle.style.display = "inline-flex";
        }
      };

      // Run after layout settles (fonts, responsive wrapping, etc.)
      requestAnimationFrame(checkAndHide);
      window.addEventListener("load", checkAndHide, { once: true });

      // Re-check on resize (wrapping changes can create/remove overflow)
      let rAf = 0;
      window.addEventListener("resize", () => {
        cancelAnimationFrame(rAf);
        rAf = requestAnimationFrame(checkAndHide);
      });

      toggle.addEventListener("click", () => {
        const open = addons.classList.contains("is-open");
        setOpen(!open);
      });
    });
  }

  // ---------- Gallery ----------
  const galleryItems = [
    // --- Cars (exteriors / paint) ---
    { id: "c1",  cat: "cars", src: "assets/gallery/sexycar3.JPG", alt: "Car after detailing" },
    { id: "c2",  cat: "cars", src: "assets/gallery/corvette2after.JPG", alt: "Corvette after detailing" },
    { id: "c3",  cat: "cars", src: "assets/gallery/corolla2after.JPG", alt: "Corolla after detailing" },
    { id: "c4",  cat: "cars", src: "assets/gallery/elantraafter.JPG", alt: "Elantra after detailing" },
    { id: "c5",  cat: "cars", src: "assets/gallery/elantrabefore.JPG", alt: "Elantra before detailing" },
    { id: "c6",  cat: "cars", src: "assets/gallery/gwagensideshotafter.JPG", alt: "G-Wagon after detailing" },
    { id: "c7",  cat: "cars", src: "assets/gallery/gwagensideshotbefore.JPG", alt: "G-Wagon before detailing" },
    { id: "c8",  cat: "cars", src: "assets/gallery/oldschoolafter.JPG", alt: "Classic car after detailing" },
    { id: "c9",  cat: "cars", src: "assets/gallery/oldschoolbefore.JPG", alt: "Classic car before detailing" },
    { id: "c10", cat: "cars", src: "assets/gallery/oldschool2after.JPG", alt: "Classic car after detailing" },
    { id: "c11", cat: "cars", src: "assets/gallery/oldschool2before.JPG", alt: "Classic car before detailing" },
    { id: "c12", cat: "cars", src: "assets/gallery/chevafter.JPG", alt: "Chevy after detailing" },
    { id: "c13", cat: "cars", src: "assets/gallery/chevbefore.JPG", alt: "Chevy before detailing" },
    { id: "c14", cat: "cars", src: "assets/gallery/doorafter.JPG", alt: "Door jamb after detailing" },
    { id: "c15", cat: "cars", src: "assets/gallery/doorbefore.JPG", alt: "Door jamb before detailing" },
    { id: "c16", cat: "cars", src: "assets/gallery/petrolcapafter.JPG", alt: "Fuel door after detailing" },
    { id: "c17", cat: "cars", src: "assets/gallery/petrolcapbefore.JPG", alt: "Fuel door before detailing" },
    { id: "c18", cat: "cars", src: "assets/gallery/sexyycar2after.JPG", alt: "Car after detailing" },
    { id: "c19", cat: "cars", src: "assets/gallery/sexyycar2before.JPG", alt: "Car before detailing" },
    { id: "c20", cat: "cars", src: "assets/gallery/comparison.JPG", alt: "Before and after comparison" },

    // --- Trucks/SUVs ---
    { id: "t1", cat: "trucks", src: "assets/gallery/ramtruck3after.JPG", alt: "RAM truck after detailing" },
    { id: "t2", cat: "trucks", src: "assets/gallery/redbeastfront.JPG", alt: "Truck front detail" },
    { id: "t3", cat: "trucks", src: "assets/gallery/whitetruckexafter.JPG", alt: "White truck after detailing" },
    { id: "t4", cat: "trucks", src: "assets/gallery/whitetruckexbefore.JPG", alt: "White truck before detailing" },

    // --- Interiors ---
    { id: "i1", cat: "interiors", src: "assets/gallery/carinteriorafter.JPG", alt: "Car interior after detailing" },
    { id: "i2", cat: "interiors", src: "assets/gallery/carinteriorbefore.JPG", alt: "Car interior before detailing" },
    { id: "i3", cat: "interiors", src: "assets/gallery/frontinteriorafter.JPG", alt: "Front interior after detailing" },
    { id: "i4", cat: "interiors", src: "assets/gallery/interiorbackseatafter.JPG", alt: "Back seat after detailing" },
    { id: "i5", cat: "interiors", src: "assets/gallery/interiorbackseatbefore.JPG", alt: "Back seat before detailing" },
    { id: "i6", cat: "interiors", src: "assets/gallery/fordinteriorbefore.JPG", alt: "Ford interior before detailing" },

    // --- RV / Marine / Heavy equipment ---
    { id: "rv1", cat: "rvmarine", src: "assets/gallery/rv2after.JPG", alt: "RV after detailing" },
    { id: "rv2", cat: "rvmarine", src: "assets/gallery/rv3after.JPG", alt: "RV after detailing" },
    { id: "rv3", cat: "rvmarine", src: "assets/gallery/rv4after.JPG", alt: "RV after detailing" },
    { id: "rv4", cat: "rvmarine", src: "assets/gallery/rv4before.JPG", alt: "RV before detailing" },
    { id: "rv5", cat: "rvmarine", src: "assets/gallery/forkliftafter.JPG", alt: "Forklift after wash" },
    { id: "rv6", cat: "rvmarine", src: "assets/gallery/forkliftbefore.JPG", alt: "Forklift before wash" },

    // Boats
    { id: "b01", cat: "rvmarine", src: "assets/gallery/boat1after.JPG", alt: "Boat after detailing" },
    { id: "b02", cat: "rvmarine", src: "assets/gallery/boat1before.JPG", alt: "Boat before detailing" },
    { id: "b03", cat: "rvmarine", src: "assets/gallery/boat2after.JPG", alt: "Boat after detailing" },
    { id: "b04", cat: "rvmarine", src: "assets/gallery/boat2before.JPG", alt: "Boat before detailing" },
    { id: "b05", cat: "rvmarine", src: "assets/gallery/boat6after.JPG", alt: "Boat after detailing" },
    { id: "b06", cat: "rvmarine", src: "assets/gallery/boat8after.JPG", alt: "Boat after detailing" },

    // --- Bikes ---
    { id: "bk1", cat: "bikes", src: "assets/gallery/bike1after.JPG", alt: "Bike after detailing" },
    { id: "bk2", cat: "bikes", src: "assets/gallery/bike2after.JPG", alt: "Bike after detailing" },
    { id: "bk3", cat: "bikes", src: "assets/gallery/bike3after.JPG", alt: "Bike after detailing" },
    { id: "bk4", cat: "bikes", src: "assets/gallery/bike5after.JPG", alt: "Bike after detailing" },
    { id: "bk5", cat: "bikes", src: "assets/gallery/bikemidwash.JPG", alt: "Bike mid wash" },
  ];

  const galleryGrid = $("#galleryGrid");

  function renderGallery(filter = "all") {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = "";

    const items = filter === "all" ? galleryItems : galleryItems.filter(i => i.cat === filter);

    items.forEach((item) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "gallery-item";
      el.dataset.cat = item.cat;
      el.setAttribute("aria-label", `Open image: ${item.alt}`);

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";

      el.appendChild(img);
      el.addEventListener("click", () => openLightbox(item.src, item.alt));
      galleryGrid.appendChild(el);
    });
  }

  // ---------- Lightbox ----------
  let lightboxEl = null;

  function closeLightbox() {
    if (lightboxEl) lightboxEl.remove();
    lightboxEl = null;
    document.body.style.overflow = "";
  }

  function openLightbox(src, alt) {
    closeLightbox();

    lightboxEl = document.createElement("div");
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
    document.addEventListener("keydown", onKey, { once: true });

    bar.appendChild(cap);
    bar.appendChild(close);

    inner.appendChild(img);
    inner.appendChild(bar);
    lightboxEl.appendChild(inner);
    document.body.appendChild(lightboxEl);

    document.body.style.overflow = "hidden";
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

  // ---------- Form tabs + presets ----------
  const tabs = $$(".tab");
  const leadForm = $("#leadForm");
  const formTypeInput = $("#formType");

  function setTab(mode) {
    tabs.forEach(t => {
      const isActive = t.dataset.tab === mode;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (formTypeInput) formTypeInput.value = mode;

    // Optional: set helpful defaults when switching
    const service = leadForm?.querySelector('select[name="service"]');
    if (service && mode === "quote") {
      if (!service.value) service.value = "RV / Marine / Motorcycle Quote";
    }
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => setTab(t.dataset.tab || "book"));
  });

  // Any element with data-tab="quote" or "book" can switch the tab
  $$("[data-tab]").forEach((el) => {
    el.addEventListener("click", () => {
      const mode = el.getAttribute("data-tab");
      if (mode === "quote" || mode === "book") setTab(mode);
    });
  });

  // Presets fill the Service dropdown and flip to book
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

  // ---------- Form submit UX (Formspree OR SMS fallback) ----------
  const statusEl = $("#formStatus");
  const honeypot = $("#website");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!leadForm) return;

    // Bot trap
    if (honeypot && honeypot.value.trim().length > 0) {
      if (statusEl) statusEl.textContent = "✅ Thanks — request received.";
      leadForm.reset();
      setTab("book");
      return;
    }

    const action = leadForm.getAttribute("action") || "";

    // Collect values once (used for both Formspree + SMS fallback)
    const name = leadForm.querySelector('[name="name"]')?.value?.trim() || "";
    const phone = leadForm.querySelector('[name="phone"]')?.value?.trim() || "";
    const vehicleType = leadForm.querySelector('[name="vehicleType"]')?.value?.trim() || "";
    const service = leadForm.querySelector('[name="service"]')?.value?.trim() || "";
    const notes = leadForm.querySelector('[name="notes"]')?.value?.trim() || "";
    const formType = formTypeInput?.value || "book";

    // ✅ FALLBACK MODE: if Formspree isn't connected yet, open SMS composer (prefilled)
    if (!action || action.includes("FORMSPREE_ENDPOINT")) {
      const msg =
        `New website request (${formType.toUpperCase()}):\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Vehicle: ${vehicleType}\n` +
        `Service: ${service}\n` +
        (notes ? `Notes: ${notes}\n` : "");

      if (statusEl) statusEl.textContent = "Opening your text app to send the request…";

      const body = encodeURIComponent(msg);
      window.location.href = `sms:+14233941698?&body=${body}`;

      // Optional: don’t reset immediately (user may come back)
      // leadForm.reset();
      // setTab("book");
      return;
    }

    // ✅ NORMAL MODE: Formspree works when action is a real endpoint
    const formData = new FormData(leadForm);

    try {
      if (statusEl) statusEl.textContent = "Sending…";

      const res = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        if (statusEl) statusEl.textContent = "✅ Thanks — we’ll reach out shortly.";
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

  // ---------- Hero bubbles ----------
  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initBubbles() {
    if (prefersReducedMotion) return;
    const holder = $(".hero__bubbles");
    if (!holder) return;

    const count = 12;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "bubble";

      const size = rand(10, 26);
      const left = rand(0, 100);
      const delay = rand(0, 6);
      const dur = rand(16, 30);
      const blur = rand(0, 4);
      const op = rand(0.06, 0.13);

      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${left}%`;
      b.style.animationDelay = `${delay}s`;
      b.style.animationDuration = `${dur}s`;
      b.style.filter = `blur(${blur}px)`;
      b.style.opacity = `${op}`;

      holder.appendChild(b);
    }

    const style = document.createElement("style");
    style.textContent = `
      .bubble{
        position:absolute;
        bottom:-40px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,0.14);
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.02));
        animation: floatUp linear infinite;
        transform: translateZ(0);
        pointer-events:none;
      }
      @keyframes floatUp{
        0%   { transform: translate3d(0, 0, 0) scale(1); }
        100% { transform: translate3d(${rand(-18, 18)}px, -900px, 0) scale(1.08); }
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- Cursor ripple bubbles ----------
  function initCursorRipples() {
    if (prefersReducedMotion) return;

    const hero = $(".hero");
    const holder = $(".hero__bubbles");
    if (!hero || !holder) return;

    let lastTime = 0;
    const rateLimitMs = 333;
    const maxOnScreen = 18;

    function spawnRipple(clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const b = document.createElement("div");
      b.className = "ripple-bubble";

      const size = rand(14, 30);
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

  // init
  initAnchorOffsetScroll();
  initAddonsToggles();
  initBubbles();
  initCursorRipples();
})();
