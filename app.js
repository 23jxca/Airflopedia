(function () {
  "use strict";

  var ARTICLES = window.ARTICLES || [];
  var bySlug = {};
  ARTICLES.forEach(function (a) { bySlug[a.slug] = a; });

  var view = document.getElementById("view");
  var form = document.getElementById("search-form");
  var input = document.getElementById("q");
  var list = document.getElementById("suggest");

  var SITE = "Wolnopedia";
  var MAX_SUGGESTIONS = 6;
  var current = [];   // aktualne podpowiedzi
  var active = -1;    // zaznaczona podpowiedź

  /* ---------- wyszukiwanie ---------- */

  // małe litery, bez polskich znaków (długość tekstu się nie zmienia)
  function norm(s) {
    return s.toLowerCase()
      .replace(/ł/g, "l")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function search(query, limit) {
    var nq = norm(query.trim());
    if (!nq) return [];
    var found = [];
    ARTICLES.forEach(function (a) {
      var t = norm(a.title), score = null;
      if (t.indexOf(nq) === 0) score = 0;
      else if (t.split(/\s+/).some(function (w) { return w.indexOf(nq) === 0; })) score = 1;
      else if (t.indexOf(nq) > -1) score = 2;
      else if ((a.tags || []).some(function (k) { return norm(k).indexOf(nq) > -1; })) score = 3;
      else if (norm(a.summary).indexOf(nq) > -1) score = 4;
      if (score !== null) found.push({ a: a, s: score });
    });
    found.sort(function (x, y) {
      return x.s - y.s || x.a.title.localeCompare(y.a.title, "pl");
    });
    var out = found.map(function (f) { return f.a; });
    return limit ? out.slice(0, limit) : out;
  }

  /* ---------- podpowiedzi ---------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // tytuł z wyróżnionym fragmentem pasującym do wpisanego tekstu
  function highlighted(title, query) {
    var box = el("span", "t");
    var nq = norm(query.trim());
    var i = nq ? norm(title).indexOf(nq) : -1;
    if (i < 0) { box.textContent = title; return box; }
    box.appendChild(document.createTextNode(title.slice(0, i)));
    box.appendChild(el("mark", null, title.slice(i, i + nq.length)));
    box.appendChild(document.createTextNode(title.slice(i + nq.length)));
    return box;
  }

  function renderSuggestions() {
    var q = input.value;
    current = search(q, MAX_SUGGESTIONS);
    active = -1;
    list.textContent = "";

    if (!q.trim()) return closeList();

    if (!current.length) {
      var none = el("li", "none", "Brak podpowiedzi. Naciśnij Enter, aby szukać.");
      none.setAttribute("role", "presentation");
      list.appendChild(none);
    }

    current.forEach(function (a, i) {
      var li = el("li");
      li.id = "opt-" + i;
      li.setAttribute("role", "option");
      li.appendChild(highlighted(a.title, q));
      li.appendChild(el("span", "d", a.summary));
      // mousedown, żeby kliknięcie zadziałało przed utratą fokusu
      li.addEventListener("mousedown", function (e) {
        e.preventDefault();
        go("#/a/" + a.slug);
      });
      list.appendChild(li);
    });
    openList();
  }

  function openList() {
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function closeList() {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }

  function setActive(i) {
    var items = list.querySelectorAll("[role=option]");
    if (!items.length) return;
    active = (i + items.length) % items.length;
    items.forEach(function (n, k) {
      n.classList.toggle("on", k === active);
      n.setAttribute("aria-selected", k === active ? "true" : "false");
    });
    input.setAttribute("aria-activedescendant", "opt-" + active);
    items[active].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", renderSuggestions);
  input.addEventListener("focus", function () { if (input.value.trim()) renderSuggestions(); });
  input.addEventListener("blur", closeList);
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (list.hidden) renderSuggestions(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Escape") { closeList(); }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    if (active > -1 && current[active]) return go("#/a/" + current[active].slug);
    var exact = ARTICLES.filter(function (a) { return norm(a.title) === norm(q); })[0];
    go(exact ? "#/a/" + exact.slug : "#/szukaj/" + encodeURIComponent(q));
  });

  function go(hash) {
    closeList();
    input.blur();
    if (location.hash === hash) route(); else location.hash = hash;
  }

  /* ---------- widoki ---------- */

  // [[slug]] i [[slug|tekst]] zamieniane na linki
  function links(html) {
    return html.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, function (m, slug, text) {
      var a = bySlug[slug];
      if (!a) return text || slug;
      return '<a href="#/a/' + slug + '">' + (text || a.title) + "</a>";
    });
  }

  function setTitle(t) {
    document.title = t ? t + " – " + SITE : SITE;
  }

  function showHome() {
    setTitle("");
    var items = ARTICLES.slice().sort(function (a, b) {
      return a.title.localeCompare(b.title, "pl");
    });
    var h = "<h1>Strona główna</h1>" +
      "<p>Witaj w Airflopedii. Zacznij pisać w polu wyszukiwania, aby znaleźć artykuł albo wybierz z listy.</p><ul>";
    items.forEach(function (a) {
      h += '<li><a href="#/a/' + a.slug + '">' + a.title + "</a> – " + a.summary + "</li>";
    });
    view.innerHTML = h + "</ul>";
  }

  function showArticle(slug) {
    var a = bySlug[slug];
    if (!a) return showMissing(slug);
    setTitle(a.title);
    var h = "<h1>" + a.title + "</h1>";
    if (a.info && a.info.length) {
      h += '<table class="infobox"><caption>' + a.title + "</caption>";
      a.info.forEach(function (r) { h += "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; });
      h += "</table>";
    }
    view.innerHTML = h + links(a.html);
  }

  function showResults(q) {
    setTitle("Wyniki: " + q);
    var res = search(q);
    var h = "<h1>Wyniki wyszukiwania</h1>";
    var safe = document.createElement("div");
    safe.textContent = q;
    if (!res.length) {
      h += "<p>Brak artykułów dla frazy „<strong>" + safe.innerHTML + "</strong>”. Spróbuj krótszego słowa, np. nazwy potrawy.</p>";
    } else {
      h += "<p>Znaleziono " + res.length + " dla frazy „<strong>" + safe.innerHTML + "</strong>”:</p><ul>";
      res.forEach(function (a) {
        h += '<li><a href="#/a/' + a.slug + '">' + a.title + "</a> – " + a.summary + "</li>";
      });
      h += "</ul>";
    }
    view.innerHTML = h;
  }

  function showMissing() {
    setTitle("Nie znaleziono");
    view.innerHTML = "<h1>Nie znaleziono strony</h1><p>Taki artykuł nie istnieje. Wróć na <a href=\"#/\">stronę główną</a> lub skorzystaj z wyszukiwarki.</p>";
  }

  /* ---------- router ---------- */

  function route() {
    var parts = location.hash.replace(/^#\/?/, "").split("/");
    if (parts[0] === "a" && parts[1]) showArticle(parts[1]);
    else if (parts[0] === "szukaj" && parts[1]) showResults(decodeURIComponent(parts.slice(1).join("/")));
    else showHome();
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();
})();
