(function () {
  "use strict";
  var EMAIL = "support@valena.in";

  /* Mobile menu */
  var menuBtn = document.querySelector("[data-menu]");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    var openIcon = menuBtn.innerHTML;
    var closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuBtn.innerHTML = open ? closeIcon : openIcon;
    };
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 832 && nav.classList.contains("open")) setMenu(false); });
  }

  /* Label table cells for stacked phone layout */
  document.querySelectorAll(".stacked table").forEach(function (t) {
    var heads = [].map.call(t.querySelectorAll("thead th"), function (th) { return th.textContent.trim(); });
    t.querySelectorAll("tbody tr").forEach(function (tr) {
      [].forEach.call(tr.children, function (td, i) { if (heads[i]) td.setAttribute("data-label", heads[i]); });
    });
  });

  /* Year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Copy buttons */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var status = btn.parentElement.querySelector("[data-copy-status]");
      var done = function (msg) { if (status) { status.textContent = msg; setTimeout(function () { status.textContent = ""; }, 2500); } };
      var fallback = function () {
        var target = document.getElementById("support-email");
        if (target) { var r = document.createRange(); r.selectNodeContents(target); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
        done("Selected. Press Ctrl+C or ⌘C to copy.");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done("Copied"); }, fallback);
      } else { fallback(); }
    });
  });

  /* Contact form → pre-filled email */
  var form = document.getElementById("contact-form");
  if (form) {
    var fields = {
      name: { el: form.querySelector("#cf-name"), err: form.querySelector("#cf-name-err"), msg: "Enter your name." },
      email: { el: form.querySelector("#cf-email"), err: form.querySelector("#cf-email-err"), msg: "Enter a valid email address, like name@example.com." },
      message: { el: form.querySelector("#cf-msg"), err: form.querySelector("#cf-msg-err"), msg: "Write a short message so we know how to help." }
    };
    var check = function (key) {
      var f = fields[key], v = f.el.value.trim(), ok = v.length > 0;
      if (key === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (key === "message") ok = v.length >= 10;
      f.el.setAttribute("aria-invalid", ok ? "false" : "true");
      f.el.setAttribute("aria-describedby", f.err.id);
      f.err.textContent = ok ? "" : f.msg;
      return ok;
    };
    Object.keys(fields).forEach(function (k) {
      fields[k].el.addEventListener("blur", function () { if (fields[k].el.value) check(k); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = Object.keys(fields).filter(function (k) { return !check(k); });
      var status = document.getElementById("cf-status");
      if (bad.length) { fields[bad[0]].el.focus(); status.hidden = true; return; }
      var topic = form.querySelector("#cf-topic").value;
      var order = form.querySelector("#cf-order").value.trim();
      var subject = "[" + topic + "] " + (order ? "Order " + order : "Message from " + fields.name.el.value.trim());
      var body = "Name: " + fields.name.el.value.trim() + "\nEmail: " + fields.email.el.value.trim() + "\nTopic: " + topic +
        (order ? "\nOrder ID: " + order : "") + "\n\n" + fields.message.el.value.trim() + "\n";
      var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.hidden = false;
      status.innerHTML = "Your email app should now open with the message ready to send. If nothing opened, email <strong>" + EMAIL + "</strong> directly and paste your message.";
      window.location.href = href;
    });
  }

  /* Cashback estimate */
  var calc = document.getElementById("calc");
  if (calc) {
    var amt = calc.querySelector("#calc-amount"), rate = calc.querySelector("#calc-rate"), type = calc.querySelector("#calc-type");
    var out = calc.querySelector("#calc-result"), label = calc.querySelector("#calc-rate-label");
    var inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    var update = function () {
      var a = Math.max(0, parseFloat(amt.value) || 0), r = Math.max(0, parseFloat(rate.value) || 0);
      var flat = type.value === "flat";
      label.textContent = flat ? "Flat amount per order (₹)" : "Rate (%)";
      rate.step = flat ? "1" : "0.1";
      var v = flat ? (a > 0 ? r : 0) : a * Math.min(r, 100) / 100;
      out.textContent = inr.format(v);
    };
    type.addEventListener("change", function () { rate.value = type.value === "flat" ? "120" : "5"; update(); });
    [amt, rate].forEach(function (el) { el.addEventListener("input", update); });
    calc.addEventListener("submit", function (e) { e.preventDefault(); });
    update();
  }

  /* Offers */
  var list = document.getElementById("offer-list");
  if (list) {
    var offers = (window.VALENA_OFFERS || []).filter(function (o) { return o && o.store && o.url && /^https:\/\//.test(o.url); });
    var CATS = ["Fashion", "Electronics", "Travel", "Food & Groceries", "Beauty", "Home", "Other"];
    var chipsWrap = document.getElementById("offer-chips");
    var search = document.getElementById("offer-search");
    var empty = document.getElementById("offer-empty");
    var active = "All";
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

    var used = CATS.filter(function (c) { return offers.some(function (o) { return o.category === c; }); });
    ["All"].concat(used).forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = c;
      b.setAttribute("aria-pressed", c === active ? "true" : "false");
      b.addEventListener("click", function () {
        active = c;
        chipsWrap.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        draw();
      });
      chipsWrap.appendChild(b);
    });

    if (!offers.length) {
      document.getElementById("offer-tools").hidden = true;
      document.getElementById("offer-empty-title").textContent = "No store offers are listed at the moment";
      document.getElementById("offer-empty-text").textContent = "Offers are added here once a store's affiliate programme is active for Valena. Suggest a store you shop at and we'll look into it.";
    }

    var draw = function () {
      var q = (search.value || "").trim().toLowerCase();
      var shown = offers.filter(function (o) {
        return (active === "All" || o.category === active) && (!q || o.store.toLowerCase().indexOf(q) > -1);
      });
      list.innerHTML = shown.map(function (o) {
        var conds = (o.conditions || []).filter(Boolean).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
        return '<article class="offer">' +
          '<div class="offer-top"><h3>' + esc(o.store) + '</h3><span class="tag">' + esc(o.category || "Other") + "</span></div>" +
          '<div class="rate num">' + esc(o.rate) + ' <span class="sr-only">cashback</span></div>' +
          (o.newUsers ? '<span class="tag tag-gold" style="justify-self:start">First order</span>' : "") +
          (o.summary ? "<p>" + esc(o.summary) + "</p>" : "") +
          (conds ? "<ul>" + conds + "</ul>" : "") +
          '<a class="btn btn-plum btn-sm" href="' + esc(o.url) + '" target="_blank" rel="sponsored noopener">Shop at ' + esc(o.store) + "</a>" +
          "</article>";
      }).join("");
      list.hidden = shown.length === 0;
      empty.hidden = shown.length !== 0;
    };
    search.addEventListener("input", draw);
    draw();
  }
})();
