/* mensaje-error.js — el mensaje de error de Python (Traceback), el programa que se corta
   y la red de try / except. Necesita codigo.js (y python.js para colorear el código del
   mensaje). CSS en base.css, bajo «Mensaje de error».

   ---------- El mensaje ----------

     var m = MensajeError.crear(el, {
       tipo: "NameError",
       mensaje: "name 'nmbre' is not defined",
       sugerencia: "nombre",           (opcional) «. Did you mean: 'nombre'?» (Python 3.10+)
       traduccion: "El nombre <code>nmbre</code> no existe…",   (opcional, admite HTML)
       marcos: [                       una entrada por llamada, de la más vieja a la última
         { linea: 3, codigo: "print(nmbre)", marca: "nmbre", funcion: "<module>" },
         …                             marca: el texto que señalan los ^^^ (o [desde, hasta]
       ],                              en columnas del código, sin la sangría); sin marca, no hay ^
       archivo: "programa.py",
       sintaxis: true,                 (opcional) error de escritura (SyntaxError, IndentationError):
                                       sin «Traceback (most recent call last):» ni «, in <module>»
       partes: true,                   (opcional) rótulos al costado: «dónde», «qué línea», «qué pasó»
       codigo: pre,                    (opcional) el bloque .codigo del programa: la línea N del
       desfase: 0,                     mensaje es su .linea N - 1 + desfase. Al resaltar o tocar
                                       la parte «linea», esa línea del código se ilumina.
       alTocar: function (parte, i) {} (opcional) las partes se vuelven botones: "archivo",
                                       "linea", "codigo", "tipo" o "mensaje"; i es el marco
     });

     m.mostrar(alTerminar)   aparece renglón a renglón y el último se sacude (sin movimiento:
                             de golpe); el mensaje empieza oculto
     m.ocultar()
     m.resaltar("tipo", i)   ilumina una parte (y la línea del código si es "linea");
                             m.resaltar(null) apaga todo
     m.marcar("tipo", "ok" | "mal" | null)   pinta una parte tocada como acierto o error
     m.el                    el elemento .traceback
     m.parte("tipo", i)      el elemento de esa parte (p. ej. destino de MensajeError.lanzar)

   ---------- El programa que se corta ----------

     MensajeError.romper(pre, 2, { marca: "nmbre", cortadas: [3, 4] })
         la línea 2 (desde 0) se pone roja y se sacude, el texto de marca se subraya con una
         onda roja y las líneas cortadas (por defecto, todas las de abajo) se apagan con
         «no se ejecuta». Codigo.limpiar(pre) lo borra todo (y MensajeError.limpiar(pre)).

   ---------- try / except ----------

     MensajeError.zona(pre, { proteger: [1, 3], atrapar: [4, 5] })
         marca las líneas del try (raya azul a la izquierda: la zona protegida) y las del
         except (raya naranja). Queda puesta: Codigo.limpiar no la borra; zona(pre, null) sí.
     MensajeError.lanzar(pre, 2, "ValueError", destino, { atrapa: true, alLlegar })
         una ficha roja con el tipo sale de la línea 2, se sacude y vuela a destino: un número
         de línea (el except, que se ilumina si atrapa) o un elemento (p. ej. m.parte("tipo")).
         Con atrapa: false, la ficha llega al except, rebota («no es su tipo») y cae; si se
         pasa además siguiente: elemento, después sigue volando hasta él y llama a alSeguir.
*/
(function () {
  "use strict";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function nuevo(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function lineas(pre) { return pre.querySelectorAll(".linea"); }

  function colorear(texto) {
    return window.Python ? Python.colorear(texto) : String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  var ROTULOS = { donde: "dónde", codigo: "qué línea", final: "qué pasó" };

  /* ---------- El mensaje ---------- */
  function crear(el, o) {
    var raiz = nuevo("div", "traceback");
    raiz.setAttribute("role", "group");
    raiz.setAttribute("aria-label", "Mensaje de error de Python");
    raiz.hidden = true;
    var tocables = [];
    var conPartes = !!o.partes;

    function parteEl(nombre, texto, i, html) {
      var s = nuevo("span", "traceback__parte traceback__" + nombre);
      if (html) s.innerHTML = html; else s.textContent = texto;
      s.setAttribute("data-parte", nombre);
      if (i !== undefined) s.setAttribute("data-marco", String(i));
      if (o.alTocar) {
        s.classList.add("traceback__parte--tocable");
        s.setAttribute("role", "button");
        s.tabIndex = 0;
        tocables.push(s);
      }
      return s;
    }

    function renglon(clase, rotulo) {
      var r = nuevo("div", "traceback__renglon " + clase);
      if (conPartes && rotulo) {
        r.appendChild(nuevo("span", "traceback__rotulo", rotulo));
      }
      return r;
    }

    // Un error de escritura (SyntaxError, IndentationError) no trae la cabecera ni «in <module>»:
    // Python lo encuentra al leer el programa, antes de ejecutar nada
    if (!o.sintaxis) {
      var cab = renglon("traceback__cabecera");
      cab.insertBefore(document.createTextNode("Traceback (most recent call last):"), cab.firstChild);
      raiz.appendChild(cab);
    }

    var archivo = o.archivo || "programa.py";
    (o.marcos || []).forEach(function (mc, i) {
      var donde = renglon("traceback__donde", i === 0 ? ROTULOS.donde : null);
      var cuerpo = nuevo("span", "traceback__texto");
      cuerpo.appendChild(document.createTextNode("  File \""));
      cuerpo.appendChild(parteEl("archivo", archivo, i));
      cuerpo.appendChild(document.createTextNode("\", "));
      var ln = parteEl("linea", "line " + mc.linea, i);
      ln.setAttribute("aria-label", "line " + mc.linea + ": la línea " + mc.linea + " del programa");
      cuerpo.appendChild(ln);
      if (!o.sintaxis) cuerpo.appendChild(document.createTextNode(", in " + (mc.funcion || "<module>")));
      donde.insertBefore(cuerpo, donde.firstChild);
      raiz.appendChild(donde);

      var cod = renglon("traceback__linea-codigo", i === 0 ? ROTULOS.codigo : null);
      var texto = String(mc.codigo).replace(/^\s+/, "");
      var cc = nuevo("span", "traceback__texto");
      cc.appendChild(document.createTextNode("    "));
      cc.appendChild(parteEl("codigo", texto, i, colorear(texto)));
      cod.insertBefore(cc, cod.firstChild);
      raiz.appendChild(cod);

      var rango = null;
      if (Array.isArray(mc.marca)) rango = mc.marca;
      else if (mc.marca) {
        var k = texto.indexOf(mc.marca);
        if (k !== -1) rango = [k, k + mc.marca.length];
      }
      if (rango) {
        var marca = renglon("traceback__marca");
        marca.insertBefore(nuevo("span", "traceback__texto",
          "    " + " ".repeat(rango[0]) + "^".repeat(Math.max(1, rango[1] - rango[0]))), marca.firstChild);
        raiz.appendChild(marca);
      }
    });

    var fin = renglon("traceback__fin", ROTULOS.final);
    var cf = nuevo("span", "traceback__texto");
    cf.appendChild(parteEl("tipo", o.tipo));
    var msj = o.mensaje || "";
    if (o.sugerencia) msj += ". Did you mean: '" + o.sugerencia + "'?";
    if (msj) {
      cf.appendChild(document.createTextNode(": "));
      cf.appendChild(parteEl("mensaje", msj));
    }
    fin.insertBefore(cf, fin.firstChild);
    raiz.appendChild(fin);

    var trad = null;
    if (o.traduccion) {
      trad = nuevo("p", "traceback__traduccion");
      trad.innerHTML = '<span class="traceback__es">En español</span> ' + o.traduccion;
      raiz.appendChild(trad);
    }

    tocables.forEach(function (s) {
      function tocar() {
        o.alTocar(s.getAttribute("data-parte"), s.hasAttribute("data-marco") ? Number(s.getAttribute("data-marco")) : null);
      }
      s.addEventListener("click", tocar);
      s.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tocar(); }
      });
    });

    el.appendChild(raiz);

    var timers = [];
    function cortar() { timers.forEach(clearTimeout); timers = []; }

    function mostrar(alTerminar) {
      cortar();
      raiz.hidden = false;
      var rs = raiz.querySelectorAll(".traceback__renglon, .traceback__traduccion");
      raiz.classList.remove("traceback--sacude");
      if (reducir()) {
        rs.forEach(function (r) { r.classList.remove("traceback__renglon--oculto"); });
        if (alTerminar) alTerminar();
        return;
      }
      rs.forEach(function (r) { r.classList.add("traceback__renglon--oculto"); });
      rs.forEach(function (r, k) {
        timers.push(setTimeout(function () { r.classList.remove("traceback__renglon--oculto"); }, 120 + k * 140));
      });
      timers.push(setTimeout(function () {
        void raiz.offsetWidth;
        raiz.classList.add("traceback--sacude");
        if (alTerminar) alTerminar();
      }, 120 + rs.length * 140));
    }

    function ocultar() { cortar(); raiz.hidden = true; resaltar(null); }

    function parte(nombre, i) {
      var sel = '[data-parte="' + nombre + '"]' + (i !== undefined && i !== null ? '[data-marco="' + i + '"]' : "");
      var todas = raiz.querySelectorAll(sel);
      return todas.length ? todas[todas.length - 1] : null;
    }

    function lineaCodigo(i) {
      if (!o.codigo || !o.marcos || !o.marcos.length) return null;
      var mc = o.marcos[i === undefined || i === null ? o.marcos.length - 1 : i];
      return lineas(o.codigo)[mc.linea - 1 + (o.desfase || 0)] || null;
    }

    function resaltar(nombre, i) {
      raiz.querySelectorAll(".traceback__parte--resaltada").forEach(function (s) { s.classList.remove("traceback__parte--resaltada"); });
      if (o.codigo) lineas(o.codigo).forEach(function (l) { l.classList.remove("linea--senalada"); });
      if (!nombre) return;
      var s = parte(nombre, i);
      if (s) s.classList.add("traceback__parte--resaltada");
      if (nombre === "linea") {
        var l = lineaCodigo(i);
        if (l) { void l.offsetWidth; l.classList.add("linea--senalada"); }
      }
    }

    function marcar(nombre, estado, i) {
      var s = parte(nombre, i);
      if (!s) return;
      s.classList.remove("traceback__parte--ok", "traceback__parte--mal");
      if (estado) { void s.offsetWidth; s.classList.add("traceback__parte--" + estado); }
    }

    return { el: raiz, mostrar: mostrar, ocultar: ocultar, resaltar: resaltar, marcar: marcar, parte: parte };
  }

  /* ---------- El programa que se corta ---------- */
  function limpiar(pre) {
    pre.querySelectorAll(".linea--error, .linea--no-corre, .linea--atrapa, .linea--rebota, .linea--senalada").forEach(function (l) {
      l.classList.remove("linea--error", "linea--no-corre", "linea--atrapa", "linea--rebota", "linea--senalada");
    });
    pre.querySelectorAll(".pieza--error").forEach(function (s) { s.outerHTML = s.innerHTML; });
  }

  // Envuelve la primera aparición de texto en la línea (sin romper el coloreado: se recorre
  // el texto de sus nodos) en un <span class="pieza--error">
  function subrayar(l, texto) {
    var completo = l.textContent;
    var k = completo.indexOf(texto);
    if (k === -1 || !document.createRange) return;
    var nodos = [];
    var w = document.createTreeWalker(l, NodeFilter.SHOW_TEXT, null);
    while (w.nextNode()) nodos.push(w.currentNode);
    var pos = 0, ini = null, fin = null;
    nodos.forEach(function (n) {
      var largo = n.nodeValue.length;
      if (ini === null && k < pos + largo) ini = [n, k - pos];
      if (fin === null && k + texto.length <= pos + largo) fin = [n, k + texto.length - pos];
      pos += largo;
    });
    if (!ini || !fin) return;
    var r = document.createRange();
    r.setStart(ini[0], ini[1]);
    r.setEnd(fin[0], fin[1]);
    var s = nuevo("span", "pieza--error");
    try { s.appendChild(r.extractContents()); r.insertNode(s); } catch (e) { /* rango raro: sin subrayado */ }
  }

  function romper(pre, i, opciones) {
    opciones = opciones || {};
    limpiar(pre);
    var ls = lineas(pre);
    var l = ls[i];
    if (!l) return;
    void l.offsetWidth;
    l.classList.add("linea--error");
    if (opciones.marca) subrayar(l, opciones.marca);
    var cortadas = opciones.cortadas;
    if (!cortadas) {
      cortadas = [];
      for (var k = i + 1; k < ls.length; k++) cortadas.push(k);
    }
    cortadas.forEach(function (k, n) {
      if (!ls[k] || !ls[k].textContent.trim()) return;
      ls[k].classList.add("linea--no-corre");
      ls[k].style.setProperty("--retraso", (reducir() ? 0 : 250 + n * 90) + "ms");
    });
  }

  /* ---------- try / except ---------- */
  function zona(pre, z) {
    lineas(pre).forEach(function (l) { l.classList.remove("linea--protegida", "linea--except"); });
    if (!z) return;
    var ls = lineas(pre);
    function poner(rango, clase) {
      if (!rango) return;
      for (var k = rango[0]; k <= rango[1]; k++) if (ls[k]) ls[k].classList.add(clase);
    }
    poner(z.proteger, "linea--protegida");
    [].concat(z.atrapar && typeof z.atrapar[0] === "number" ? [z.atrapar] : (z.atrapar || [])).forEach(function (r) {
      poner(r, "linea--except");
    });
  }

  function rect(el) { return el.getBoundingClientRect(); }

  // Rectángulo del texto de una línea (sin el número)
  function rectTexto(l) {
    var r = document.createRange();
    r.selectNodeContents(l);
    var c = r.getBoundingClientRect();
    return c.width ? c : rect(l);
  }

  function lanzar(pre, i, tipo, destino, opciones) {
    opciones = opciones || {};
    var atrapa = opciones.atrapa !== false;
    var ls = lineas(pre);
    var origen = ls[i];
    var lineaDestino = typeof destino === "number" ? ls[destino] : null;
    var destinoEl = lineaDestino || destino;
    function llegar() {
      if (lineaDestino) {
        lineaDestino.classList.remove("linea--atrapa", "linea--rebota");
        void lineaDestino.offsetWidth;
        lineaDestino.classList.add(atrapa ? "linea--atrapa" : "linea--rebota");
      }
      if (opciones.alLlegar) opciones.alLlegar();
    }
    if (!origen || !destinoEl || reducir() || !document.body.animate) {
      llegar();
      if (!atrapa && opciones.siguiente && opciones.alSeguir) opciones.alSeguir();
      return;
    }
    var ficha = nuevo("span", "vuelo vuelo--error", tipo);
    ficha.setAttribute("aria-hidden", "true");
    document.body.appendChild(ficha);
    var a = rectTexto(origen);
    var fw = ficha.offsetWidth, fh = ficha.offsetHeight;
    var x0 = Math.min(a.right + 8, window.innerWidth - fw - 8), y0 = a.top + a.height / 2 - fh / 2;
    ficha.style.left = "0px";
    ficha.style.top = "0px";

    function centro(el) {
      var b = el === lineaDestino ? rectTexto(el) : rect(el);
      var x = el === lineaDestino ? Math.min(b.right + 8, window.innerWidth - fw - 8) : b.left + b.width / 2 - fw / 2;
      return [x, b.top + b.height / 2 - fh / 2];
    }
    function t(x, y, s, r) { return "translate(" + x + "px, " + y + "px) scale(" + (s || 1) + ") rotate(" + (r || 0) + "deg)"; }

    // 1) aparece en la línea y se sacude
    var salir = ficha.animate([
      { transform: t(x0, y0, 0.4), opacity: 0 },
      { transform: t(x0, y0, 1.1), opacity: 1, offset: 0.35 },
      { transform: t(x0 - 6, y0), offset: 0.5 },
      { transform: t(x0 + 6, y0), offset: 0.65 },
      { transform: t(x0 - 4, y0), offset: 0.8 },
      { transform: t(x0, y0), opacity: 1 }
    ], { duration: 520, easing: "ease-out", fill: "forwards" });

    salir.onfinish = function () {
      // 2) vuela al destino
      var b = centro(destinoEl);
      var medio = [(x0 + b[0]) / 2 + 24, Math.min(y0, b[1]) - 30];
      var viaje = ficha.animate([
        { transform: t(x0, y0) },
        { transform: t(medio[0], medio[1], 1.05), offset: 0.5 },
        { transform: t(b[0], b[1]) }
      ], { duration: 620, easing: "ease-in-out", fill: "forwards" });
      viaje.onfinish = function () {
        llegar();
        if (atrapa) {
          var cae = ficha.animate([
            { transform: t(b[0], b[1]), opacity: 1 },
            { transform: t(b[0], b[1] + 4, 0.8), opacity: 0 }
          ], { duration: 380, easing: "ease-in", fill: "forwards" });
          cae.onfinish = function () { ficha.remove(); };
          return;
        }
        // 3) no es su tipo: rebota y cae; con siguiente, sigue hasta él
        var sig = opciones.siguiente;
        var rebote = ficha.animate([
          { transform: t(b[0], b[1]) },
          { transform: t(b[0] + 30, b[1] - 18, 1, 12), offset: 0.4 },
          { transform: t(b[0] + 40, b[1] + 6, 1, 18) }
        ], { duration: 420, easing: "ease-out", fill: "forwards" });
        rebote.onfinish = function () {
          if (!sig) {
            var cae2 = ficha.animate([
              { transform: t(b[0] + 40, b[1] + 6, 1, 18), opacity: 1 },
              { transform: t(b[0] + 50, b[1] + 80, 0.9, 40), opacity: 0 }
            ], { duration: 520, easing: "ease-in", fill: "forwards" });
            cae2.onfinish = function () { ficha.remove(); };
            return;
          }
          var c = centro(sig);
          var fin = ficha.animate([
            { transform: t(b[0] + 40, b[1] + 6, 1, 18) },
            { transform: t(c[0], c[1], 1, 0) }
          ], { duration: 640, easing: "ease-in-out", fill: "forwards" });
          fin.onfinish = function () {
            ficha.remove();
            if (opciones.alSeguir) opciones.alSeguir();
          };
        };
      };
    };
  }

  window.MensajeError = { crear: crear, romper: romper, limpiar: limpiar, zona: zona, lanzar: lanzar };
})();
