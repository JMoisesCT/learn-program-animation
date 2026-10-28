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
   Codigo.salto(preEl, desde, hasta, tipo)
       dibuja una flecha curva a la derecha del código, de la línea `desde` a la línea
       `hasta` (índices desde 0): la ejecución vuelve arriba (bucle) o salta (llamada).
       tipo "ida" (una llamada) o "vuelta" (volver de ella) le da su color; con tipo, si
       las dos líneas son la misma (una llamada recursiva vuelve a la línea de la de abajo),
       la flecha da una vuelta pequeña y entra en la misma línea.
   Codigo.quitarSalto(preEl)
       borra la flecha (Codigo.limpiar también la borra).
   Codigo.pausas(preEl, [{ linea: 5, texto: "n=3", clave: "1" }, …])
       pone fichas debajo de una línea: las llamadas que esperan pausadas en ella
       (pila.js las pinta solas con la opción codigo). Las fichas que ya no están en la
       lista se van flotando; las nuevas aparecen. Codigo.limpiar también las quita.
       Con columna: 15 (en caracteres, contando la sangría), la ficha va debajo de esa
       columna y no al principio: p. ej. bajo una de las dos llamadas de una misma línea.
       En una línea, o todas sus fichas llevan columna o ninguna.
   Codigo.valores(preEl, { linea: 4, partes: ["   return ", ["fibonacci(3)", "activa"], …] })
       una fila debajo de la línea con sus valores puestos (cómo la ve la llamada que la
       ejecuta). Las partes se escriben una tras otra, con espacios para alinearlas con el
       código; [texto, "activa"] resalta lo que se está haciendo, [texto, "recibe"] un valor
       que acaba de llegar y [texto, "quien"] dice de quién son los valores (n=4).
       Codigo.valores(preEl, null) la quita; Codigo.limpiar también.
   Codigo.volarDesdeLinea(el, destinoEl, texto, clase, alLlegar)
       una copia de `texto` sale de la línea que se ejecuta (la línea activa del código
       del paso de `el`) y vuela hasta destinoEl, que queda oculto hasta que llega.
       Si la línea tiene una pieza con ese mismo texto (un 12, un "Ana"), sale de ahí.
   Codigo.volar(origen, destinoEl, texto, clase, alLlegar)
       lo mismo, pero sale de `origen` (un elemento o un rectángulo de getBoundingClientRect).
   Codigo.piezaEnLinea(lineaEl, ["5", "precio"])
       rectángulo de la primera pieza de la línea con uno de esos textos (o de todo su texto):
       un origen para Codigo.volar o Caja.poner, p. ej. el argumento de la llamada.
   Codigo.reservarAlto(el, estados, pintar)
       fija el alto mínimo de el al mayor que alcanza al pasar por todos los estados, para
       que lo de debajo (los botones) no salte de un paso a otro. pintar(copia, estado) deja
       una copia invisible de el en ese estado; se vuelve a medir cuando el aparece o cambia
       de ancho. Traza lo hace con la explicación; Pila, con el código (fichas) y el rótulo.
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
    pre.querySelectorAll(".pausas, .valores").forEach(function (el) { el.remove(); });
  }

  var SVG = "http://www.w3.org/2000/svg";

  function svg(tag, atributos) {
    var el = document.createElementNS(SVG, tag);
    for (var k in atributos) el.setAttribute(k, atributos[k]);
    return el;
  }

  /* El texto de un elemento, sin la fila de valores ni las fichas de pausa que pueda tener debajo */
  function rangoDeTexto(el) {
    var r = document.createRange();
    r.selectNodeContents(el);
    var fichas = el.querySelector(":scope > .valores, :scope > .pausas");
    if (fichas) r.setEndBefore(fichas);
    return r;
  }

  /* Dónde acaba el texto de una línea, en px desde el borde izquierdo del contenido del bloque */
  function finDeTexto(pre, linea) {
    var caja = rangoDeTexto(linea).getBoundingClientRect();
    if (!caja.width) return linea.offsetLeft + parseFloat(getComputedStyle(linea).paddingLeft);
    return caja.right - pre.getBoundingClientRect().left - pre.clientLeft + pre.scrollLeft;
  }

  // Alto de la primera fila de una línea (debajo puede tener valores y fichas de pausa)
  function altoFila(linea) {
    return Math.min(linea.offsetHeight, parseFloat(getComputedStyle(linea).lineHeight) || linea.offsetHeight);
  }

  function quitarSalto(pre) {
    pre.querySelectorAll(".codigo__salto").forEach(function (el) { el.remove(); });
  }

  function salto(pre, desde, hasta, tipo) {
    quitarSalto(pre);
    var ls = lineas(pre);
    var a = ls[desde];
    var b = ls[hasta];
    if (!a || !b || (desde === hasta && !tipo)) return;
    if (desde === hasta) { rizo(pre, a, tipo); return; }

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
    var y1 = a.offsetTop + altoFila(a) / 2;
    var y2 = b.offsetTop + altoFila(b) / 2;

    var dibujo = svg("svg", {
      "class": "codigo__salto" + (tipo ? " codigo__salto--" + tipo : ""),
      width: ancho,
      height: pre.scrollHeight,
      "aria-hidden": "true",
      focusable: "false"
    });
    dibujo.appendChild(svg("circle", { "class": "codigo__salto-inicio", cx: x1, cy: y1, r: 3.5 }));
    // Sale a la derecha, baja (o sube) por fuera de las líneas de en medio y entra: esquinas redondeadas
    var r = Math.min(14, Math.abs(y2 - y1) / 2, xc - Math.max(x1, x2));
    var dir = y2 > y1 ? 1 : -1;
    dibujo.appendChild(svg("path", {
      "class": "codigo__salto-trazo",
      pathLength: 1,
      d: "M" + x1 + " " + y1 + " L" + (xc - r) + " " + y1 + " Q" + xc + " " + y1 + " " + xc + " " + (y1 + dir * r) +
        " L" + xc + " " + (y2 - dir * r) + " Q" + xc + " " + y2 + " " + (xc - r) + " " + y2 + " L" + x2 + " " + y2
    }));
    dibujo.appendChild(svg("path", {
      "class": "codigo__salto-punta",
      d: "M" + (x2 + 8) + " " + (y2 - 6) + " L" + x2 + " " + y2 + " L" + (x2 + 8) + " " + (y2 + 6)
    }));
    pre.appendChild(dibujo);
  }

  // Vuelve a la misma línea: sale por arriba, da una vuelta a la derecha y entra por abajo
  function rizo(pre, linea, tipo) {
    var x = finDeTexto(pre, linea) + 8;
    var xc = Math.min(x + 26, pre.scrollLeft + pre.clientWidth - 6);
    x = Math.min(x, xc - 12);
    var y = linea.offsetTop + altoFila(linea) / 2;
    var h = Math.min(9, altoFila(linea) / 2);
    var dibujo = svg("svg", {
      "class": "codigo__salto codigo__salto--" + tipo,
      width: pre.scrollWidth,
      height: pre.scrollHeight,
      "aria-hidden": "true",
      focusable: "false"
    });
    dibujo.appendChild(svg("circle", { "class": "codigo__salto-inicio", cx: x, cy: y - h, r: 3.5 }));
    dibujo.appendChild(svg("path", {
      "class": "codigo__salto-trazo",
      pathLength: 1,
      d: "M" + x + " " + (y - h) + " C" + (xc + 4) + " " + (y - h - 8) + " " + (xc + 4) + " " + (y + h + 8) + " " + x + " " + (y + h)
    }));
    dibujo.appendChild(svg("path", {
      "class": "codigo__salto-punta",
      d: "M" + (x + 8) + " " + (y + h - 6) + " L" + x + " " + (y + h) + " L" + (x + 7) + " " + (y + h + 6)
    }));
    pre.appendChild(dibujo);
  }

  /* ---------- Fichas de las llamadas pausadas en una línea ---------- */
  function columnaDe(f) { return f.columna === undefined ? null : String(f.columna); }

  function pausas(pre, lista) {
    var ls = lineas(pre);
    var quedan = {};
    lista.forEach(function (f) { quedan[f.clave] = f; });
    // Las que se van salen de la línea (no ocupan lugar) y suben desvaneciéndose
    pre.querySelectorAll(".pausa").forEach(function (ficha) {
      var f = quedan[ficha.getAttribute("data-clave")];
      if (f && ficha.textContent === f.texto && ficha.closest(".linea") === ls[f.linea] &&
        ficha.getAttribute("data-columna") === columnaDe(f)) return;
      var grupo = ficha.parentNode;
      if (!reducir() && pre.isConnected && ficha.offsetParent) {
        var a = ficha.getBoundingClientRect();
        var b = pre.getBoundingClientRect();
        var fantasma = ficha.cloneNode(true);
        fantasma.classList.add("pausa--sale");
        fantasma.style.left = (a.left - b.left - pre.clientLeft + pre.scrollLeft) + "px";
        fantasma.style.top = (a.top - b.top - pre.clientTop + pre.scrollTop) + "px";
        pre.appendChild(fantasma);
        setTimeout(function () { fantasma.remove(); }, 500);
      }
      ficha.remove();
      // Sin fichas, se va su columna y, si se queda vacía, la fila
      while (grupo && !grupo.children.length && grupo.classList.contains("pausas__grupo")) {
        var fila = grupo.parentNode;
        grupo.remove();
        grupo = fila;
      }
      if (grupo && !grupo.children.length && grupo.classList.contains("pausas")) grupo.remove();
    });
    lista.forEach(function (f) {
      var linea = ls[f.linea];
      if (!linea || pre.querySelector('.linea .pausa[data-clave="' + f.clave + '"]')) return;
      var grupo = linea.querySelector(".pausas");
      if (!grupo) {
        grupo = document.createElement("span");
        grupo.className = "pausas" + (f.columna !== undefined ? " pausas--columnas" : "");
        grupo.setAttribute("aria-hidden", "true");
        // Alineada con el código de la línea, no con su sangría
        grupo.style.setProperty("--sangria", /^ */.exec(linea.textContent)[0].length + "ch");
        linea.appendChild(grupo);
      }
      var ficha = document.createElement("span");
      ficha.className = "pausa";
      ficha.setAttribute("data-clave", f.clave);
      ficha.textContent = f.texto;
      if (f.columna !== undefined) {
        ficha.setAttribute("data-columna", columnaDe(f));
        var fila = grupo;
        grupo = fila.querySelector('.pausas__grupo[data-columna="' + f.columna + '"]');
        if (!grupo) {
          grupo = document.createElement("span");
          grupo.className = "pausas__grupo";
          grupo.setAttribute("data-columna", columnaDe(f));
          grupo.style.setProperty("--columna", f.columna + "ch");
          fila.appendChild(grupo);
        }
      }
      grupo.appendChild(ficha);
    });
  }

  // La fila con los valores puestos va justo debajo de su línea, antes de las fichas
  function valores(pre, v) {
    var vieja = pre.querySelector(".valores");
    var clave = v ? v.linea + "|" + JSON.stringify(v.partes) : "";
    if (vieja && vieja.getAttribute("data-clave") === clave) return;
    if (vieja) vieja.remove();
    var linea = v && lineas(pre)[v.linea];
    if (!linea) return;
    var fila = document.createElement("span");
    fila.className = "valores";
    fila.setAttribute("data-clave", clave);
    v.partes.forEach(function (p) {
      if (typeof p === "string") { fila.appendChild(document.createTextNode(p)); return; }
      var pieza = document.createElement("span");
      pieza.className = "valores__" + p[1];
      pieza.textContent = p[0];
      fila.appendChild(pieza);
    });
    linea.insertBefore(fila, linea.querySelector(".pausas"));
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

  /* ---------- Vuelo de un valor ---------- */
  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Rectángulo que ocupa solo el texto de un elemento (una línea es más ancha que su texto)
  function rectDeTexto(el) {
    var caja = rangoDeTexto(el).getBoundingClientRect();
    return caja.width ? caja : el.getBoundingClientRect();
  }

  // La pieza de una línea con alguno de esos textos (se busca desde el final), o todo su texto
  function piezaEnLinea(linea, textos) {
    textos = [].concat(textos);
    var piezas = linea.querySelectorAll("span");
    for (var t = 0; t < textos.length; t++) {
      for (var k = piezas.length - 1; k >= 0; k--) {
        if (piezas[k].closest(".valores, .pausas")) continue;
        if (!piezas[k].children.length && piezas[k].textContent.trim() === String(textos[t])) return piezas[k].getBoundingClientRect();
      }
    }
    return rectDeTexto(linea);
  }

  function origenEnLinea(el, texto) {
    var paso = el.closest(".paso") || document;
    var linea = paso.querySelector(".codigo .linea--activa");
    return linea ? piezaEnLinea(linea, texto) : null;
  }

  function volarDesdeLinea(el, destino, texto, clase, alLlegar) {
    volar(reducir() || !document.body.animate ? null : origenEnLinea(el, texto), destino, texto, clase, alLlegar);
  }

  function volar(origen, destino, texto, clase, alLlegar) {
    function llegar() {
      destino.classList.remove("vuelo-destino");
      if (alLlegar) alLlegar();
    }
    // Una línea de consola ocupa todo el ancho: se mide solo su texto
    function medir() { return destino.matches(".consola__linea") ? rectDeTexto(destino) : destino.getBoundingClientRect(); }
    var a = reducir() || !document.body.animate || !origen ? null :
      origen.getBoundingClientRect ? origen.getBoundingClientRect() : origen;
    // Si el destino acaba de entrar con una animación (p. ej. una línea de consola que sube),
    // se mide ya en su lugar final: el vuelo hace de entrada
    if (a && destino.getAnimations) destino.getAnimations().forEach(function (an) { an.finish(); });
    var b = medir();
    if (!a || !b.width || (a.bottom < 0 && b.bottom < 0)) { llegar(); return; }

    destino.classList.add("vuelo-destino");
    var copia = document.createElement("span");
    copia.className = "vuelo " + (clase || "");
    copia.setAttribute("aria-hidden", "true");
    copia.textContent = texto;
    // Con el tamaño exacto del destino, aunque su clase (p. ej. caja__valor) traiga otros límites
    copia.style.minWidth = "0";
    copia.style.maxWidth = "none";
    document.body.appendChild(copia);

    // Sale pequeño de la línea, sube en arco y aterriza con su tamaño. El destino se vuelve a
    // medir en cada cuadro: si se mueve mientras tanto (aparece otra caja al lado, se oculta un
    // chip encima), el valor lo sigue y aterriza donde está, no donde estaba al salir.
    var ax = a.left + a.width / 2;
    var ay = a.top + a.height / 2;
    var arco = Math.min(60, 20 + Math.abs(ax - (b.left + b.width / 2)) / 6);
    var inicio = null;
    function cuadro(ahora) {
      if (inicio === null) inicio = ahora;
      var t = Math.max(0, Math.min(1, (ahora - inicio) / 560));
      var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2;
      var ahoraB = destino.isConnected ? medir() : null;
      // El destino se fue o se ocultó (p. ej. cambió el paso): el vuelo acaba ahí
      if (!ahoraB || !ahoraB.width) { copia.remove(); llegar(); return; }
      b = ahoraB;
      var dx = (ax - (b.left + b.width / 2)) * (1 - e);
      var dy = (ay - (b.top + b.height / 2)) * (1 - e) - arco * 4 * e * (1 - e);
      copia.style.left = b.left + "px";
      copia.style.top = b.top + "px";
      copia.style.width = b.width + "px";
      copia.style.height = b.height + "px";
      copia.style.opacity = String(Math.min(1, 0.3 + 1.4 * e));
      copia.style.transform = t < 1 ? "translate(" + dx + "px, " + dy + "px) scale(" + (0.55 + 0.45 * e) + ")" : "none";
      if (t < 1) { requestAnimationFrame(cuadro); return; }
      copia.remove();
      llegar();
    }
    cuadro(performance.now());
  }

  /* ---------- Alto reservado ---------- */
  function reservarAlto(el, estados, pintar) {
    var r = el._reserva;
    if (!r) {
      r = el._reserva = {};
      r.medir = function () {
        // Oculto (otro paso) no se puede medir: se hace al aparecer
        if (!el.offsetParent || el.offsetWidth === r.ancho) return;
        r.ancho = el.offsetWidth;
        // La copia conserva los id (hay estilos por id) mientras se mide: dura un instante
        var copia = el.cloneNode(true);
        copia.removeAttribute("aria-live");
        copia.setAttribute("aria-hidden", "true");
        copia.style.cssText = "position: absolute; visibility: hidden; pointer-events: none; min-height: 0; width: " + r.ancho + "px";
        el.parentNode.insertBefore(copia, el);
        var alto = 0;
        r.estados.forEach(function (e) {
          r.pintar(copia, e);
          alto = Math.max(alto, copia.offsetHeight);
        });
        copia.remove();
        el.style.minHeight = alto ? alto + "px" : "";
      };
      // Al cambiar el alto (el propio min-height) no se repite: solo si cambia el ancho
      if (window.ResizeObserver) new ResizeObserver(function () { r.medir(); }).observe(el);
      else window.addEventListener("resize", function () { r.medir(); });
    }
    r.estados = estados;
    r.pintar = pintar;
    r.ancho = -1;
    r.medir();
  }

  window.Codigo = {
    marcar: marcar, limpiar: limpiar, consola: consola, agregar: agregar, booleano: booleano,
    salto: salto, quitarSalto: quitarSalto, pausas: pausas, valores: valores, volarDesdeLinea: volarDesdeLinea, volar: volar,
    piezaEnLinea: piezaEnLinea, reservarAlto: reservarAlto
  };
})();
