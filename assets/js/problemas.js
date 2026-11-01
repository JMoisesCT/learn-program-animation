/* problemas.js — lo común de una página de «Problemas resueltos» (CSS en problemas.css).
   Necesita python.js; progreso.js para guardar que el caso se vio.

   Problemas.iniciar({ id: "problema-vuelto" })
       - las piezas con .aparece entran al llegar a ellas al bajar;
       - el índice del costado (.caso-indice a[href="#…"]) marca la sección que se lee
         y la raya de la cabecera (.caso-avance) crece con lo leído;
       - la idea y el código se señalan entre sí: un paso .idea li[data-idea="2"] ilumina
         las líneas del código con data-idea="2", y una línea ilumina su paso.
   Problemas.codigo(pre, lineas, ideas)
       escribe el código (Python.escribir) y pone data-idea en cada línea: ideas[i] es el
       número del paso de la idea que resuelve (0 o nada: ninguno).
   Problemas.pregunta(el, { opciones: ["6", "5"], correcta: "6", pistas: { "5": "…" },
                            ok: "…", alAcertar })
       una pregunta de opción múltiple dentro de el (.pregunta con su h3).
   Problemas.completar(id)   guarda el caso como visto (lo muestra el catálogo).
   Problemas.reducir         true si se pidió menos movimiento.
*/
(function () {
  "use strict";

  var reducir = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function iniciar(o) {
    o = o || {};
    // Entrar al bajar
    var piezas = document.querySelectorAll(".aparece");
    if (reducir || !window.IntersectionObserver) {
      piezas.forEach(function (p) { p.classList.add("visible"); });
    } else {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -10% 0px" });
      piezas.forEach(function (p) { obs.observe(p); });
    }

    // Índice y avance
    var enlaces = Array.prototype.slice.call(document.querySelectorAll(".caso-indice a[href^='#']"));
    var avance = document.querySelector(".caso-avance");
    var indice = document.querySelector(".caso-indice");
    function alBajar() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      if (avance) avance.style.width = (alto > 0 ? Math.min(100, (window.scrollY / alto) * 100) : 100) + "%";
      var actual = null;
      enlaces.forEach(function (a) {
        var s = document.querySelector(a.getAttribute("href"));
        if (s && s.getBoundingClientRect().top < window.innerHeight * 0.35) actual = a;
      });
      enlaces.forEach(function (a) { a.classList.toggle("activo", a === actual); });
      // El índice se esconde mientras pasa por delante una sección ancha (la ejecución)
      if (indice) {
        var ri = indice.getBoundingClientRect();
        var tapa = false;
        document.querySelectorAll(".caso-ancha .rep").forEach(function (s) {
          var r = s.getBoundingClientRect();
          if (r.top < ri.bottom && r.bottom > ri.top) tapa = true;
        });
        indice.classList.toggle("caso-indice--oculto", tapa);
      }
    }
    window.addEventListener("scroll", alBajar, { passive: true });
    alBajar();

    // La idea y el código, enlazados
    document.querySelectorAll(".idea li[data-idea]").forEach(function (li) {
      li.tabIndex = 0;
      function encender(si) {
        var n = li.getAttribute("data-idea");
        document.querySelectorAll('.codigo .linea[data-idea="' + n + '"]').forEach(function (l) {
          l.classList.toggle("linea--idea", si);
        });
        li.classList.toggle("activa", si);
      }
      li.addEventListener("mouseenter", function () { encender(true); });
      li.addEventListener("mouseleave", function () { encender(false); });
      li.addEventListener("focus", function () { encender(true); });
      li.addEventListener("blur", function () { encender(false); });
    });
    document.querySelectorAll(".codigo-comentado .codigo").forEach(function (pre) {
      pre.addEventListener("mouseover", function (e) {
        var l = e.target.closest(".linea[data-idea]");
        document.querySelectorAll(".idea li").forEach(function (li) {
          li.classList.toggle("activa", !!l && li.getAttribute("data-idea") === l.getAttribute("data-idea"));
        });
        pre.querySelectorAll(".linea").forEach(function (x) {
          x.classList.toggle("linea--idea", !!l && x.getAttribute("data-idea") === l.getAttribute("data-idea"));
        });
      });
      pre.addEventListener("mouseleave", function () {
        document.querySelectorAll(".idea li.activa").forEach(function (li) { li.classList.remove("activa"); });
        pre.querySelectorAll(".linea--idea").forEach(function (x) { x.classList.remove("linea--idea"); });
      });
    });
  }

  function codigo(pre, lineas, ideas) {
    Python.escribir(pre, lineas);
    pre.querySelectorAll(".linea").forEach(function (l, i) {
      if (ideas && ideas[i]) l.setAttribute("data-idea", String(ideas[i]));
    });
  }

  function feedback(el, tipo, html) {
    el.className = "feedback feedback--" + tipo;
    el.innerHTML = '<span class="feedback__icono" aria-hidden="true">' + (tipo === "ok" ? "✓" : "💡") + "</span><span></span>";
    el.lastChild.innerHTML = html;
  }

  function pregunta(el, o) {
    var grupo = document.createElement("div");
    grupo.className = "chips-elegir";
    grupo.setAttribute("role", "group");
    var h = el.querySelector("h3");
    if (h) grupo.setAttribute("aria-label", h.textContent);
    var fb = document.createElement("div");
    fb.className = "feedback";
    fb.setAttribute("role", "status");
    fb.setAttribute("aria-live", "polite");
    o.opciones.forEach(function (op) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = op;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        grupo.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); x.classList.remove("mal"); });
        if (op === o.correcta) {
          feedback(fb, "ok", o.ok || "¡Exacto!");
          el.classList.add("pregunta--ok");
          grupo.querySelectorAll("button").forEach(function (x) { x.disabled = x !== b; });
          if (o.alAcertar) o.alAcertar();
        } else {
          void b.offsetWidth;
          b.classList.add("mal");
          feedback(fb, "pista", (o.pistas && o.pistas[op]) || "Mira otra vez la ejecución: puedes arrastrar la barra hasta ese momento.");
        }
      });
      grupo.appendChild(b);
    });
    el.appendChild(grupo);
    el.appendChild(fb);
  }

  function completar(id) {
    if (window.Progreso) Progreso.guardar(id, { completada: true });
  }

  window.Problemas = { iniciar: iniciar, codigo: codigo, pregunta: pregunta, completar: completar, reducir: reducir };
})();
