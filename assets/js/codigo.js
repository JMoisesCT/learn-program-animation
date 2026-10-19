/* codigo.js — utilidades para los bloques de código y la consola.

   Codigo.marcar(preEl, { activas: [1, 2], saltadas: [3] })
       resalta líneas (índices desde 0) y atenúa las que no se ejecutan.
   Codigo.limpiar(preEl)
   Codigo.consola(consolaEl, ["línea 1", …])
       muestra la salida de print(); con [] muestra "(sin salida)".
   Codigo.agregar(consolaEl, "texto")
       añade una línea de salida sin repintar las anteriores.
   Codigo.booleano(el, valor)
       pinta un chip True / False con una pequeña animación al cambiar.
   Codigo.salto(preEl, desde, hasta)
       dibuja una flecha curva a la derecha del código, de la línea `desde` a la línea
       `hasta` (índices desde 0): la ejecución vuelve arriba (bucle) o salta (llamada).
   Codigo.quitarSalto(preEl)
       borra la flecha (Codigo.limpiar también la borra).
*/
(function () {
  "use strict";

  function lineas(pre) { return pre.querySelectorAll(".linea"); }

  function marcar(pre, opciones) {
    var activas = opciones.activas || [];
    var saltadas = opciones.saltadas || [];
    lineas(pre).forEach(function (l, i) {
      l.classList.toggle("linea--activa", activas.indexOf(i) !== -1);
      l.classList.toggle("linea--saltada", saltadas.indexOf(i) !== -1);
    });
  }

  function limpiar(pre) {
    marcar(pre, {});
    quitarSalto(pre);
  }

  var SVG = "http://www.w3.org/2000/svg";

  function svg(tag, atributos) {
    var el = document.createElementNS(SVG, tag);
    for (var k in atributos) el.setAttribute(k, atributos[k]);
    return el;
  }

  /* Dónde acaba el texto de una línea, en px desde el borde izquierdo del contenido del bloque */
  function finDeTexto(pre, linea) {
    var r = document.createRange();
    r.selectNodeContents(linea);
    var caja = r.getBoundingClientRect();
    if (!caja.width) return linea.offsetLeft + parseFloat(getComputedStyle(linea).paddingLeft);
    return caja.right - pre.getBoundingClientRect().left - pre.clientLeft + pre.scrollLeft;
  }

  function quitarSalto(pre) {
    pre.querySelectorAll(".codigo__salto").forEach(function (el) { el.remove(); });
  }

  function salto(pre, desde, hasta) {
    quitarSalto(pre);
    var ls = lineas(pre);
    var a = ls[desde];
    var b = ls[hasta];
    if (!a || !b || desde === hasta) return;

    // La curva rodea por la derecha todas las líneas que quedan entre las dos
    var derecha = 0;
    for (var k = Math.min(desde, hasta); k <= Math.max(desde, hasta); k++) {
      derecha = Math.max(derecha, finDeTexto(pre, ls[k]));
    }
    // Siempre dentro de lo visible, aunque el código sea más ancho y haya que desplazarlo
    var ancho = pre.scrollWidth;
    var xc = Math.min(derecha + 30, pre.scrollLeft + pre.clientWidth - 6);
    var x1 = Math.min(finDeTexto(pre, a) + 8, xc - 14);
    var x2 = Math.min(finDeTexto(pre, b) + 8, xc - 14);
    var y1 = a.offsetTop + a.offsetHeight / 2;
    var y2 = b.offsetTop + b.offsetHeight / 2;

    var dibujo = svg("svg", {
      "class": "codigo__salto",
      width: ancho,
      height: pre.scrollHeight,
      "aria-hidden": "true",
      focusable: "false"
    });
    dibujo.appendChild(svg("circle", { "class": "codigo__salto-inicio", cx: x1, cy: y1, r: 3.5 }));
    dibujo.appendChild(svg("path", {
      "class": "codigo__salto-trazo",
      pathLength: 1,
      d: "M" + x1 + " " + y1 + " C" + xc + " " + y1 + " " + xc + " " + y2 + " " + x2 + " " + y2
    }));
    dibujo.appendChild(svg("path", {
      "class": "codigo__salto-punta",
      d: "M" + (x2 + 8) + " " + (y2 - 6) + " L" + x2 + " " + y2 + " L" + (x2 + 8) + " " + (y2 + 6)
    }));
    pre.appendChild(dibujo);
  }

  function consola(el, salida) {
    var titulo = el.querySelector(".consola__titulo");
    el.textContent = "";
    if (titulo) el.appendChild(titulo);
    if (!salida.length) {
      var vacia = document.createElement("span");
      vacia.className = "consola__vacia";
      vacia.textContent = "(sin salida)";
      el.appendChild(vacia);
      return;
    }
    salida.forEach(function (texto) {
      var l = document.createElement("span");
      l.className = "consola__linea";
      l.textContent = texto;
      el.appendChild(l);
    });
  }

  function agregar(el, texto) {
    var vacia = el.querySelector(".consola__vacia");
    if (vacia) vacia.remove();
    var l = document.createElement("span");
    l.className = "consola__linea";
    l.textContent = texto;
    el.appendChild(l);
  }

  function booleano(el, valor) {
    var texto = valor ? "True" : "False";
    var cambia = el.textContent !== texto;
    el.textContent = texto;
    el.className = "booleano booleano--" + (valor ? "true" : "false");
    if (cambia) {
      void el.offsetWidth;
      el.classList.add("booleano--cambio");
    }
  }

  window.Codigo = {
    marcar: marcar, limpiar: limpiar, consola: consola, agregar: agregar, booleano: booleano,
    salto: salto, quitarSalto: quitarSalto
  };
})();
