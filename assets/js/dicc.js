/* dicc.js — un diccionario de Python como fila de casilleros con una clave encima.
   Hermano de la lista (lista.js): en la lista cada casillero tiene un número (0, 1, 2…);
   en el diccionario, una clave que elige quien escribe el código ("Ana", "Luis"…).
   Necesita lista.js (para escribir los valores) y codigo.js (para los vuelos).

     var d = Dicc.crear(el, [["Ana", 14], ["Luis", 9]], {
       nombres: ["notas"],   (opcional) etiquetas que apuntan al diccionario
       llaves: true,         { y } en los extremos, como se escribe en Python
       vertical: false,      un par por fila (clave: valor), para valores largos (listas)
       capacidad: 4          (opcional) el tamaño se calcula para al menos tantos pares
     });

   Los pares también se pueden dar como objeto: { Ana: 14, Luis: 9 }. Las claves se ven
   como en el código ("Ana" con comillas, 3 sin ellas). Un valor puede ser una lista o un
   diccionario: se escribe entero dentro del casillero ([14, 17]).

   d.valores(pares)          repinta con otros pares, sin animación
   d.pares                   copia de los pares actuales: [["Ana", 14], …]
   d.largo                   cuántos pares hay (len)
   d.tiene(clave)            true si la clave está (clave in d)
   d.obtener(clave)          el valor, o undefined
   d.marcar(clave, parte)    resalta el par ("clave" o "valor": solo esa parte) y lo devuelve.
                             Si la clave no está, aparece un casillero vacío con esa clave en
                             rojo (KeyError) y devuelve null. d.marcar(null) quita la marca
   d.clases(fn)              fn(clave, valor) devuelve una clase extra para cada par
                             ("dicc__par--igual", "--distinta", "--apagada", "--cambio"), o ""
   d.par(clave)              el elemento del par, o null
   d.valor(clave)            el cuadro con el valor (origen o destino de un vuelo)
   d.clave(clave)            la etiqueta con la clave
   d.poner(clave, v, origen, origenClave)
                             d[clave] = v: si la clave ya estaba, el valor viejo sale volando
                             y entra el nuevo; si no, nace un par al final (los demás no se
                             mueven). El valor llega desde origen (elemento o rectángulo) o,
                             si no se da, desde la línea de código activa; con origenClave,
                             la clave también llega volando. Devuelve el par
   d.quitar(clave)           del d[clave] / .pop(clave): el par sube y se va, los de la
                             derecha se corren. Devuelve el rectángulo donde estaba el valor
   d.nombres([…])            cambia las etiquetas de arriba
   d.el                      el contenedor .dicc

   Dicc.python(pares)        cómo lo imprime print: {'Ana': 14, 'Luis': 9}
   Dicc.texto(pares)         cómo se escribe en el código: {"Ana": 14, "Luis": 9}
*/
(function () {
  "use strict";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function span(clase, contenido) {
    var s = document.createElement("span");
    s.className = clase;
    if (contenido !== undefined) s.textContent = contenido;
    return s;
  }

  function texto(v) { return Lista.texto(v); }

  function comoPares(pares) {
    if (!pares) return [];
    if (Array.isArray(pares)) return pares.map(function (p) { return [p[0], copiar(p[1])]; });
    return Object.keys(pares).map(function (k) { return [k, copiar(pares[k])]; });
  }

  // Copia en profundidad (la de lista.js conserva la marca de tupla)
  function copiar(v) { return Lista.copiar(v); }

  function escribir(pares, f) {
    return "{" + comoPares(pares).map(function (p) { return f(p[0]) + ": " + f(p[1]); }).join(", ") + "}";
  }

  function crear(el, paresIniciales, opciones) {
    opciones = opciones || {};
    var vertical = !!opciones.vertical;
    var pares = [];
    var nombres = [];
    var fila = null;
    var cajaNombres = null;
    var fantasma = null;

    el.classList.add("dicc");
    el.classList.toggle("dicc--vertical", vertical);
    el.classList.toggle("dicc--sin-llaves", opciones.llaves === false);
    el.setAttribute("aria-hidden", "true");

    function indice(clave) {
      for (var i = 0; i < pares.length; i++) if (pares[i][0] === clave) return i;
      return -1;
    }

    /* ---------- Pares ---------- */
    function nuevoValor(v) {
      var s = span("dicc__valor" + (typeof v === "string" ? " dicc__valor--texto" : ""), texto(v));
      if (v !== null && typeof v === "object") s.classList.add("dicc__valor--largo");
      return s;
    }

    function nuevoPar(clave, v) {
      var p = span("dicc__par");
      p.setAttribute("data-clave", texto(clave));
      p.appendChild(span("dicc__clave" + (typeof clave === "string" ? " dicc__clave--texto" : ""), texto(clave)));
      if (vertical) p.appendChild(span("dicc__dos-puntos", ":"));
      p.appendChild(nuevoValor(v));
      return p;
    }

    function lugares() {
      return Array.prototype.filter.call(fila.children, function (c) {
        return c.classList.contains("dicc__par") && !c.classList.contains("dicc__par--fuera");
      });
    }

    function medida() {
      var cs = lugares();
      // Un par largo («Valentina» o [14, 17, 12]) cuenta por más de uno: así se achican a tiempo
      var peso = pares.reduce(function (t, p) {
        // La etiqueta de la clave lleva su agujero y su margen: unos 1.7 caracteres más
        var clave = 0.21 * (texto(p[0]).length + 1.7) + 0.1;
        return t + Math.max(1, clave, 0.26 * texto(p[1]).length + 0.3);
      }, 0);
      el.style.setProperty("--dicc-n", String(Math.round(Math.max(peso + 1, opciones.capacidad || 4) * 10) / 10));
      var vacia = fila.querySelector(".dicc__vacia");
      if (!cs.length && !vacia) fila.insertBefore(span("dicc__vacia", "vacío"), fila.lastChild);
      if (cs.length && vacia) vacia.remove();
    }

    function pintarNombres() {
      if (!cajaNombres) {
        cajaNombres = span("lista__nombres dicc__nombres");
        el.insertBefore(cajaNombres, el.firstChild);
      }
      var previos = {};
      Array.prototype.forEach.call(cajaNombres.children, function (n) { previos[n.textContent] = true; });
      cajaNombres.textContent = "";
      nombres.forEach(function (nombre) {
        cajaNombres.appendChild(span("lista__nombre" + (previos[nombre] ? "" : " lista__nombre--nuevo"), nombre));
      });
      cajaNombres.hidden = !nombres.length;
    }

    function pintar(nuevos) {
      pares = comoPares(nuevos);
      if (fila) fila.remove();
      fantasma = null;
      fila = span("dicc__fila");
      fila.appendChild(span("dicc__llave", "{"));
      pares.forEach(function (p) { fila.appendChild(nuevoPar(p[0], p[1])); });
      fila.appendChild(span("dicc__llave", "}"));
      el.appendChild(fila);
      medida();
    }

    function par(clave) {
      var i = indice(clave);
      return i === -1 ? null : lugares()[i];
    }

    /* ---------- Marcar ---------- */
    function quitarFantasma() {
      if (fantasma) fantasma.remove();
      fantasma = null;
    }

    function quitarMarca() {
      el.querySelectorAll(".dicc__par--marcado, .dicc__par--marca-clave, .dicc__par--marca-valor").forEach(function (c) {
        c.classList.remove("dicc__par--marcado", "dicc__par--marca-clave", "dicc__par--marca-valor");
      });
      quitarFantasma();
    }

    function marcar(clave, parte) {
      quitarMarca();
      if (clave === null || clave === undefined) return null;
      var p = par(clave);
      if (p) {
        void p.offsetWidth;
        p.classList.add(parte === "clave" ? "dicc__par--marca-clave" : parte === "valor" ? "dicc__par--marca-valor" : "dicc__par--marcado");
        return p;
      }
      // No está: un casillero vacío con la clave en rojo (KeyError)
      fantasma = span("dicc__par dicc__par--fuera");
      fantasma.appendChild(span("dicc__clave" + (typeof clave === "string" ? " dicc__clave--texto" : ""), texto(clave)));
      if (vertical) fantasma.appendChild(span("dicc__dos-puntos", ":"));
      fantasma.appendChild(span("dicc__valor", "?"));
      fila.insertBefore(fantasma, fila.lastChild);
      var vacia = fila.querySelector(".dicc__vacia");
      if (vacia) vacia.hidden = true;
      return null;
    }

    function clases(fn) {
      lugares().forEach(function (c, i) {
        var previa = c.getAttribute("data-clase");
        if (previa) c.classList.remove(previa);
        var nueva = fn ? fn(pares[i][0], pares[i][1]) : "";
        if (nueva) {
          c.classList.add(nueva);
          c.setAttribute("data-clase", nueva);
        } else {
          c.removeAttribute("data-clase");
        }
      });
    }

    /* ---------- Animaciones ---------- */
    function medir() {
      var m = new Map();
      lugares().forEach(function (c) { m.set(c, c.getBoundingClientRect()); });
      return m;
    }

    function deslizar(previas) {
      if (reducir() || !document.body.animate) return;
      lugares().forEach(function (c) {
        var a = previas.get(c);
        if (!a) return;
        var b = c.getBoundingClientRect();
        var dx = a.left - b.left;
        var dy = a.top - b.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        c.animate([
          { transform: "translate(" + dx + "px, " + dy + "px)" },
          { transform: "none" }
        ], { duration: 420, easing: "cubic-bezier(0.34, 1.3, 0.64, 1)" });
      });
    }

    function fantasmaQueSale(elemento, clase) {
      if (reducir() || !document.body.animate || !elemento.offsetParent) return;
      var r = elemento.getBoundingClientRect();
      var copia = elemento.cloneNode(true);
      copia.classList.add("dicc__sale");
      if (clase) copia.classList.add(clase);
      copia.style.left = r.left + "px";
      copia.style.top = r.top + "px";
      copia.style.width = r.width + "px";
      copia.style.height = r.height + "px";
      // La copia vive fuera del diccionario: lleva su tamaño de casillero
      copia.style.setProperty("--c", getComputedStyle(fila).getPropertyValue("--c"));
      document.body.appendChild(copia);
      var a = copia.animate([
        { transform: "none", opacity: 1 },
        { transform: "translateY(-2.5rem) rotate(-8deg) scale(0.9)", opacity: 0 }
      ], { duration: 480, easing: "ease-in" });
      a.onfinish = a.oncancel = function () { copia.remove(); };
    }

    function llegar(destino, t, origen, clase) {
      function pulso() { destino.classList.add("dicc__pulso"); }
      destino.classList.remove("dicc__pulso");
      if (window.Codigo && origen) Codigo.volar(origen, destino, t, clase, pulso);
      else if (window.Codigo) Codigo.volarDesdeLinea(el, destino, t, clase, pulso);
      else pulso();
    }

    function poner(clave, v, origen, origenClave) {
      quitarMarca();
      var i = indice(clave);
      var p;
      if (i !== -1) {
        p = lugares()[i];
        var viejo = p.querySelector(".dicc__valor");
        fantasmaQueSale(viejo);
        var nuevo = nuevoValor(v);
        p.replaceChild(nuevo, viejo);
        pares[i][1] = copiar(v);
        medida();
        llegar(nuevo, texto(v), origen, "dicc__valor dicc__vuelo");
        return p;
      }
      var previas = medir();
      p = nuevoPar(clave, v);
      fila.insertBefore(p, fila.lastChild);
      pares.push([clave, copiar(v)]);
      medida();
      deslizar(previas);
      if (!reducir()) p.classList.add("dicc__par--entra");
      if (origenClave && window.Codigo) Codigo.volar(origenClave, p.querySelector(".dicc__clave"), texto(clave), "dicc__clave dicc__vuelo dicc__vuelo--clave");
      llegar(p.querySelector(".dicc__valor"), texto(v), origen, "dicc__valor dicc__vuelo");
      return p;
    }

    function quitar(clave) {
      quitarMarca();
      var i = indice(clave);
      if (i === -1) return null;
      var p = lugares()[i];
      var rect = p.querySelector(".dicc__valor").getBoundingClientRect();
      fantasmaQueSale(p, "dicc__sale--par");
      var previas = medir();
      p.remove();
      pares.splice(i, 1);
      medida();
      deslizar(previas);
      return rect;
    }

    pintar(paresIniciales);
    if (opciones.nombres) {
      nombres = opciones.nombres.slice();
      pintarNombres();
      cajaNombres.querySelectorAll(".lista__nombre--nuevo").forEach(function (n) { n.classList.remove("lista__nombre--nuevo"); });
    }

    return {
      el: el,
      valores: pintar,
      get pares() { return comoPares(pares); },
      get largo() { return pares.length; },
      tiene: function (clave) { return indice(clave) !== -1; },
      obtener: function (clave) {
        var i = indice(clave);
        return i === -1 ? undefined : copiar(pares[i][1]);
      },
      marcar: marcar,
      clases: clases,
      par: par,
      valor: function (clave) {
        var p = par(clave);
        return p ? p.querySelector(".dicc__valor") : null;
      },
      clave: function (clave) {
        var p = par(clave);
        return p ? p.querySelector(".dicc__clave") : null;
      },
      poner: poner,
      quitar: quitar,
      nombres: function (lista) {
        nombres = lista.slice();
        pintarNombres();
      }
    };
  }

  window.Dicc = {
    crear: crear,
    python: function (pares) { return escribir(pares, Lista.python); },
    texto: function (pares) { return escribir(pares, Lista.texto); }
  };
})();
