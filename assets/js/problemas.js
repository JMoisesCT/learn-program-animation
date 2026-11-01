/* problemas.js — lo común de una página de «Problemas resueltos» (CSS en problemas.css).
   Necesita python.js; progreso.js para guardar que el caso se vio.

   Problemas.iniciar({ id: "problema-vuelto" })
       - las piezas con .aparece entran al llegar a ellas;
       - los puntos del costado (.caso-indice a[href="#…"]) marcan el bloque que se ve y la
         raya de la cabecera (.caso-avance) crece con lo leído;
       - la idea, el diagrama y el código se señalan entre sí: todo lo que lleva el mismo
         data-idea (.idea li, .flujo__nodo, .codigo .linea) se ilumina junto;
       - al llegar al último bloque (.caso-fin), el caso queda visto (Progreso) y aparece
         el sello .visto.
   Problemas.alVer(el, fn)   llama a fn una vez, cuando el se ve en la pantalla (p. ej. para
                             dibujar un diagrama o empezar una demo).
   Problemas.codigo(pre, lineas, ideas)
       escribe el código (Python.escribir) y pone data-idea en cada línea: ideas[i] es el
       número del paso de la idea que resuelve (0 o nada: ninguno).
   Problemas.pregunta(el, { opciones, correcta, pistas, ok, alAcertar })
       una pregunta de opción múltiple dentro de el.
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
    function alBajar() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      if (avance) avance.style.width = (alto > 0 ? Math.min(100, (window.scrollY / alto) * 100) : 100) + "%";
      var actual = null;
      enlaces.forEach(function (a) {
        var s = document.querySelector(a.getAttribute("href"));
        if (s && s.getBoundingClientRect().top < window.innerHeight * 0.35) actual = a;
      });
      enlaces.forEach(function (a) { a.classList.toggle("activo", a === actual); });
    }
    window.addEventListener("scroll", alBajar, { passive: true });
    alBajar();

    // La idea, el diagrama y el código, enlazados por data-idea
    var SEL = ".idea li[data-idea], .flujo__nodo[data-idea], .codigo .linea[data-idea]";
    function encender(n) {
      document.querySelectorAll(SEL).forEach(function (x) {
        var si = n !== null && x.getAttribute("data-idea") === n;
        x.classList.toggle(x.classList.contains("linea") ? "linea--idea" : "activa", si);
      });
    }
    document.addEventListener("mouseover", function (e) {
      var x = e.target.closest && e.target.closest(SEL);
      encender(x ? x.getAttribute("data-idea") : null);
    });
    document.addEventListener("focusin", function (e) {
      var x = e.target.closest && e.target.closest(".idea li[data-idea], .flujo__nodo[data-idea]");
      encender(x ? x.getAttribute("data-idea") : null);
    });
    document.querySelectorAll(".idea li[data-idea]").forEach(function (li) { li.tabIndex = 0; });

    // Visto al llegar al final
    var fin = document.querySelector(".caso-fin");
    if (fin && o.id) {
      alVer(fin, function () {
        completar(o.id);
        var sello = document.querySelector(".visto");
        if (sello) sello.classList.add("visto--puesto");
      });
      if (window.Progreso && (Progreso.obtener(o.id) || {}).completada) {
        var s0 = document.querySelector(".visto");
        if (s0) s0.classList.add("visto--puesto");
      }
    }
  }

  function alVer(el, fn) {
    if (!window.IntersectionObserver) { fn(); return; }
    var obs = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      obs.disconnect();
      fn();
    }, { threshold: 0.35 });
    obs.observe(el);
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

  window.Problemas = { iniciar: iniciar, alVer: alVer, codigo: codigo, pregunta: pregunta, completar: completar, reducir: reducir };
})();
