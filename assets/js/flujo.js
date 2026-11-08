/* flujo.js — un diagrama de flujo que se dibuja solo. CSS en problemas.css («Diagrama de flujo»).

   var f = Flujo.crear(el, {
     nodos: [
       { id: "ini", tipo: "inicio", texto: "Inicio", col: 1, fila: 0 },
       { id: "calc", tipo: "proceso", texto: "vuelto = pago − precio", col: 1, fila: 1, idea: 1 },
       { id: "hay", tipo: "decision", texto: "¿Quedan valores?", col: 1, fila: 2, idea: 2 },
       { id: "fin", tipo: "fin", texto: "Fin", col: 2, fila: 2 },
       …                                tipos: inicio, fin (píldora), proceso (rectángulo),
                                        clase: "…" (opcional) una clase propia para el nodo
     ],                                 decision (rombo), datos (paralelogramo: lo que se
                                        imprime o se lee). idea: el color de su paso de la idea
     flechas: [
       { de: "ini", a: "calc" },
       { de: "hay", a: "fin", texto: "no" },
       { de: "resta", a: "hay", por: "izquierda", carril: 0 },   vuelve arriba rodeando por un
                                                                 lado; clase: "…" (opcional) en el grupo
       …                                                         lado (carril: más afuera)
     ],
     fila: 72,                          alto mínimo de cada fila (px; crece si un texto ocupa más)
     columnas: [0.4, 1.6, 1],           (opcional) ancho relativo de cada columna; por defecto, iguales
     anchoNodo: 210                     ancho máximo de un nodo (px)
   });

   f.dibujar()             los nodos aparecen uno a uno y las flechas se trazan (sin movimiento: de golpe)
   f.activar("hay")        ilumina un nodo (o una lista de ids); f.activar(null) apaga todo
   f.recorrer([{ nodo: "calc", nota: "vuelto = 87" }, …], { intervalo: 900, alPaso(p, i), alTerminar })
                           una ficha recorre el diagrama: cada paso ilumina su nodo y la flecha
                           por la que llegó. Devuelve { detener }.
   Los nodos con idea llevan data-idea (problemas.js los enlaza con los pasos de la idea).
*/
(function () {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function svg(tag, at) {
    var e = document.createElementNS(SVG, tag);
    for (var k in at) e.setAttribute(k, at[k]);
    return e;
  }

  function crear(el, o) {
    el.classList.add("flujo");
    el.setAttribute("role", "img");
    var lienzo = svg("svg", { "class": "flujo__lineas", "aria-hidden": "true" });
    var defs = svg("defs", {});
    var marca = svg("marker", { id: "flujo-punta-" + Math.random().toString(36).slice(2, 8), viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    marca.appendChild(svg("path", { d: "M0 0 L10 5 L0 10 z", "class": "flujo__punta" }));
    defs.appendChild(marca);
    lienzo.appendChild(defs);
    el.appendChild(lienzo);

    var porId = {};
    var cols = 1, filas = 1;
    (o.nodos || []).forEach(function (n, k) {
      var d = document.createElement("div");
      d.className = "flujo__nodo flujo__nodo--" + (n.tipo || "proceso") + (n.clase ? " " + n.clase : "");
      var t = document.createElement("span");
      t.className = "flujo__texto";
      t.innerHTML = n.texto;
      d.appendChild(t);
      if (n.idea) { d.setAttribute("data-idea", String(n.idea)); d.tabIndex = 0; }
      d.style.setProperty("--orden", String(k));
      el.appendChild(d);
      porId[n.id] = { n: n, el: d };
      cols = Math.max(cols, n.col + 1);
      filas = Math.max(filas, n.fila + 1);
    });
    var flechas = (o.flechas || []).map(function (f, k) {
      var g = svg("g", { "class": "flujo__flecha" + (f.clase ? " " + f.clase : "") });
      g.style.setProperty("--orden", String(k));
      var p = svg("path", { pathLength: "1", "marker-end": "url(#" + marca.id + ")" });
      g.appendChild(p);
      var etiqueta = null;
      if (f.texto) {
        etiqueta = svg("text", { "class": "flujo__etiqueta" });
        etiqueta.textContent = f.texto;
        g.appendChild(etiqueta);
      }
      lienzo.appendChild(g);
      return { f: f, g: g, p: p, etiqueta: etiqueta };
    });
    el.setAttribute("aria-label", "Diagrama de flujo: " + (o.nodos || []).map(function (n) {
      return n.texto.replace(/<[^>]+>/g, "");
    }).join(", "));

    var altoFila = o.fila || 72;

    function caja(id) {
      var x = porId[id];
      var w = x.el.offsetWidth, h = x.el.offsetHeight;
      var cx = x.cx, cy = x.cy;
      return { cx: cx, cy: cy, izq: cx - w / 2, der: cx + w / 2, arr: cy - h / 2, aba: cy + h / 2, col: x.n.col, fila: x.n.fila };
    }

    // Ancho relativo de cada columna (opción columnas: [0.4, 1.6, 1]); por defecto, iguales
    var pesos = [];
    for (var c = 0; c < cols; c++) pesos.push(o.columnas && o.columnas[c] !== undefined ? o.columnas[c] : 1);
    var sumaPesos = pesos.reduce(function (a, b) { return a + b; }, 0);

    function medir() {
      var ancho = el.clientWidth;
      var inicioCol = [], anchoDe = [];
      var x0 = 0;
      pesos.forEach(function (p, c) { inicioCol[c] = x0; anchoDe[c] = ancho * p / sumaPesos; x0 += anchoDe[c]; });
      var altos = [];
      for (var f = 0; f < filas; f++) altos.push(altoFila);
      Object.keys(porId).forEach(function (id) {
        var x = porId[id];
        var anchoCol = anchoDe[x.n.col];
        var maxAncho = Math.min(anchoCol - 14, o.anchoNodo || 210);
        if (x.n.tipo === "decision") maxAncho = Math.min(anchoCol - 6, (o.anchoNodo || 210) * 1.15);
        x.el.style.maxWidth = maxAncho + "px";
        if (x.n.tipo === "decision") rombo(x.el, maxAncho);
        x.cx = inicioCol[x.n.col] + anchoCol / 2;
        // Si un texto se parte en varias líneas (pantalla angosta), su fila crece
        altos[x.n.fila] = Math.max(altos[x.n.fila], x.el.offsetHeight + 20);
      });
      var tope = [], y = 0;
      altos.forEach(function (h, f) { tope[f] = y; y += h; });
      el.style.height = y + "px";
      lienzo.setAttribute("width", ancho);
      lienzo.setAttribute("height", y);
      Object.keys(porId).forEach(function (id) {
        var x = porId[id];
        x.cy = tope[x.n.fila] + altos[x.n.fila] / 2;
        x.el.style.left = x.cx + "px";
        x.el.style.top = x.cy + "px";
      });
      flechas.forEach(function (fl) {
        var a = caja(fl.f.de), b = caja(fl.f.a);
        var pts;
        var sep = 18 + 16 * (fl.f.carril || 0);
        if (fl.f.por === "izquierda" || fl.f.por === "derecha") {
          var izq = fl.f.por === "izquierda";
          var xo = izq ? Math.min(a.izq, b.izq) - sep : Math.max(a.der, b.der) + sep;
          var ax = izq ? a.izq : a.der, bx = izq ? b.izq : b.der;
          pts = [[ax, a.cy], [xo, a.cy], [xo, b.cy], [bx, b.cy]];
        } else if (a.fila === b.fila) {
          var der = b.cx > a.cx;
          pts = [[der ? a.der : a.izq, a.cy], [der ? b.izq : b.der, b.cy]];
        } else if (a.col === b.col && b.fila > a.fila) {
          pts = [[a.cx, a.aba], [b.cx, b.arr]];
        } else if (b.fila > a.fila) {
          var ym = a.aba + Math.min(18, (b.arr - a.aba) / 2);
          pts = [[a.cx, a.aba], [a.cx, ym], [b.cx, ym], [b.cx, b.arr]];
        } else {
          var xr = Math.max(a.der, b.der) + sep;
          pts = [[a.der, a.cy], [xr, a.cy], [xr, b.cy], [b.der, b.cy]];
        }
        fl.p.setAttribute("d", redondear(pts, 10));
        if (fl.etiqueta) {
          var p0 = pts[0], p1 = pts[1];
          var vertical = Math.abs(p1[0] - p0[0]) < 1;
          fl.etiqueta.setAttribute("x", p0[0] + (vertical ? 7 : (p1[0] > p0[0] ? 8 : -8)));
          fl.etiqueta.setAttribute("y", p0[1] + (vertical ? (p1[1] - p0[1]) / 2 + 4 : -6));
          fl.etiqueta.setAttribute("text-anchor", vertical ? "start" : (p1[0] > p0[0] ? "start" : "end"));
        }
      });
    }

    // El texto de un rombo cabe entero dentro de él si (ancho del texto / ancho del rombo)
    // + (alto del texto / alto del rombo) <= 1. Se ensancha el rombo hacia ese ancho, sin
    // pasar de 1.5 veces el texto ni comerse el lugar de la flecha de al lado.
    function rombo(nodo, maxAncho) {
      var t = nodo.firstChild;
      nodo.style.padding = "";
      var cs = getComputedStyle(nodo);
      var py = parseFloat(cs.paddingTop) || 12, pxCss = parseFloat(cs.paddingLeft) || 16;
      t.style.display = "inline-block";
      var w = t.offsetWidth, h = t.offsetHeight;
      var ideal = w / Math.max(0.2, 1 - h / (h + 2 * py)) + 4;
      var ancho = Math.min(ideal, w * 1.5 + 8, maxAncho - 28);
      var px = Math.max(pxCss, (ancho - w) / 2);
      nodo.style.padding = py + "px " + px + "px";
    }

    // Camino con esquinas redondeadas
    function redondear(pts, r) {
      var d = "M" + pts[0][0] + " " + pts[0][1];
      for (var k = 1; k < pts.length - 1; k++) {
        var p = pts[k], a = pts[k - 1], b = pts[k + 1];
        var d1 = Math.hypot(p[0] - a[0], p[1] - a[1]), d2 = Math.hypot(b[0] - p[0], b[1] - p[1]);
        var rr = Math.min(r, d1 / 2, d2 / 2);
        var s = [p[0] - (p[0] - a[0]) / d1 * rr, p[1] - (p[1] - a[1]) / d1 * rr];
        var e = [p[0] + (b[0] - p[0]) / d2 * rr, p[1] + (b[1] - p[1]) / d2 * rr];
        d += " L" + s[0] + " " + s[1] + " Q" + p[0] + " " + p[1] + " " + e[0] + " " + e[1];
      }
      var u = pts[pts.length - 1];
      return d + " L" + u[0] + " " + u[1];
    }

    medir();
    if (window.ResizeObserver) new ResizeObserver(function () { medir(); }).observe(el);
    else window.addEventListener("resize", medir);

    function dibujar() {
      el.classList.remove("flujo--dibuja");
      if (reducir()) { el.classList.add("flujo--listo"); return; }
      void el.offsetWidth;
      el.classList.add("flujo--dibuja");
    }

    function activar(ids) {
      ids = ids === null || ids === undefined ? [] : [].concat(ids);
      Object.keys(porId).forEach(function (id) {
        porId[id].el.classList.toggle("flujo__nodo--activo", ids.indexOf(id) !== -1);
      });
    }

    function flechaEntre(de, a) {
      for (var k = 0; k < flechas.length; k++) if (flechas[k].f.de === de && flechas[k].f.a === a) return flechas[k];
      return null;
    }

    function recorrer(pasos, op) {
      op = op || {};
      var k = 0, timer = null, previo = null;
      function uno() {
        flechas.forEach(function (fl) { fl.g.classList.remove("flujo__flecha--activa"); });
        if (k >= pasos.length) { timer = null; activar(null); if (op.alTerminar) op.alTerminar(); return; }
        var p = pasos[k];
        activar(p.nodo);
        var fl = previo ? flechaEntre(previo, p.nodo) : null;
        if (fl) { void fl.g.getBBox(); fl.g.classList.add("flujo__flecha--activa"); }
        if (op.alPaso) op.alPaso(p, k);
        previo = p.nodo;
        k++;
        timer = setTimeout(uno, op.intervalo || 900);
      }
      uno();
      return { detener: function () { if (timer) clearTimeout(timer); timer = null; activar(null); flechas.forEach(function (fl) { fl.g.classList.remove("flujo__flecha--activa"); }); } };
    }

    return { dibujar: dibujar, activar: activar, recorrer: recorrer, medir: medir, el: el };
  }

  window.Flujo = { crear: crear };
})();
