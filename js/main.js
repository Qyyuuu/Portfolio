(() => {
  "use strict";

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = $("#siteHeader");
  const scrollBar = $("#scrollBar");
  const toTop = $("#toTop");

  const nav = $("#primaryNav");
  const navToggle = $("#navToggle");
  const navBackdrop = $("#navBackdrop");
  const navLinks = new Map(
    $$(".nav__link").map((link) => [link.getAttribute("href").slice(1), link])
  );
  const sections = $$("main section[id]");

  function updateActiveNav() {
    const offset = (header?.offsetHeight || 72) + 120;
    let current = "";
    for (const section of sections) {
      if (section.offsetTop <= window.scrollY + offset) current = section.id;
    }
    if (
      document.documentElement.scrollHeight > window.innerHeight + 200 &&
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60
    ) {
      current = "contact";
    }
    navLinks.forEach((link, id) => link.classList.toggle("is-active", id === current));
  }

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollBar) {
      scrollBar.style.width = `${max > 0 ? Math.min((y / max) * 100, 100) : 0}%`;
    }

    if (toTop) toTop.classList.toggle("is-visible", y > 480);
    updateActiveNav();
  };

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        onScroll();
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  // Mobile navigation
  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu navigasi");
    document.body.classList.remove("nav-open");
    if (navBackdrop) navBackdrop.classList.remove("is-open");
  };

  const openNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Tutup menu navigasi");
    document.body.classList.add("nav-open");
    if (navBackdrop) navBackdrop.classList.add("is-open");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.contains("is-open") ? closeNav() : openNav();
    });

    if (navBackdrop) navBackdrop.addEventListener("click", closeNav);

    $$(".nav__link", nav).forEach((link) => link.addEventListener("click", closeNav));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeNav();
    });
  }

  // Toast notification
  const toast = $("#toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  // Copy email button
  $$(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy;
      if (!text) return;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const temp = document.createElement("textarea");
          temp.value = text;
          temp.setAttribute("readonly", "");
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }
        showToast("Email disalin ke clipboard.");
      } catch {
        showToast("Gagal menyalin. Silakan salin email secara manual.");
      }
    });
  });

  // Contact form validation & mailto handoff
  const form = $("#contactForm");
  if (form) {
    const summary = $("#formSummary", form);
    const submitBtn = $("#submitBtn", form);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const setError = (input, message) => {
      const field = input.closest(".field");
      const errorEl = field?.querySelector("[data-error-for]");
      if (field) field.classList.toggle("has-error", Boolean(message));
      if (errorEl) errorEl.textContent = message || "";
      input.setAttribute("aria-invalid", message ? "true" : "false");
    };

    const validate = () => {
      const name = $("#name", form);
      const email = $("#email", form);
      const subject = $("#subject", form);
      const message = $("#message", form);

      const checks = [
        [name, name.value.trim().length >= 2, "Nama minimal 2 karakter."],
        [email, emailPattern.test(email.value.trim()), "Masukkan alamat email yang valid."],
        [subject, subject.value.trim().length >= 3, "Subjek minimal 3 karakter."],
        [message, message.value.trim().length >= 10, "Pesan minimal 10 karakter."],
      ];

      let errorCount = 0;
      let firstInvalid = null;

      checks.forEach(([input, valid, errorText]) => {
        setError(input, valid ? "" : errorText);
        if (!valid) {
          errorCount++;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (summary) {
        if (errorCount > 0) {
          summary.textContent = `Ditemukan ${errorCount} kolom yang perlu diperbaiki sebelum mengirim pesan.`;
          summary.hidden = false;
        } else {
          summary.textContent = "";
          summary.hidden = true;
        }
      }

      return firstInvalid;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const firstInvalid = validate();

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        showToast("Mohon lengkapi data yang ditandai.");
        return;
      }

      const name = $("#name", form).value.trim();
      const email = $("#email", form).value.trim();
      const subject = $("#subject", form).value.trim();
      const message = $("#message", form).value.trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Membuka aplikasi email...";
      }

      const body = `Halo Rifqy,\n\n${message}\n\nDari: ${name} (${email})`;
      const mailto = `mailto:rifqykurniawanftthillah42@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      showToast("Membuka aplikasi email Anda.");

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Kirim Pesan via Email";
        }
      }, 1500);
    });

    $$("input, textarea", form).forEach((input) => {
      input.addEventListener("input", () => {
        if (input.closest(".field")?.classList.contains("has-error")) {
          setError(input, "");
        }
        if (summary && !summary.hidden && form.querySelectorAll('[aria-invalid="true"]').length === 0) {
          summary.textContent = "";
          summary.hidden = true;
        }
      });
    });
  }

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  onScroll();
})();
