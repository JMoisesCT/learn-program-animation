/* cinta.js — un texto en casillas, una por carácter, con su posición (índice).

     var c = Cinta.crear(el, "mango", {
       indices: true,      número de cada casilla encima (palabra[0], palabra[1]…)
       negativos: false,   número negativo debajo (palabra[-1] es la última)
       cortes: false       números en los cortes entre letras, en vez de en las casillas
                           (rebanadas: palabra[1:4] corta en el 1 y en el 4); con negativos,
                           el número negativo de cada corte va debajo (palabra[-3:])
     });

   c.texto("otro")           repinta con otro texto
   c.mostrar({ negativos: true, cortes: false… })   cambia qué números se ven
   c.marcar(i)               resalta la casilla i (admite negativos) y la devuelve. Si i se
                             sale del texto, aparece una casilla vacía con su número, marcada
                             como error, y devuelve null. c.marcar(null) quita la marca.
   c.rango(a, b)             resalta de la casilla a hasta la b, sin incluirla (texto[a:b]);
                             c.rango(null) lo quita
   c.marcarCortes([a, b])    resalta los números de esos cortes (los de una rebanada)
   c.clases(fn)              fn(i, caracter) devuelve una clase extra para cada casilla
                             (p. ej. "cinta__casilla--cambio"), o "" para ninguna
   c.casilla(i)              la casilla i (admite negativos), o null
   c.letra(i)                el cuadro con el carácter de la casilla i (para hacer volar
                             un valor desde ahí con Codigo.volar)
   c.corte(k)                dónde está el corte k (de 0 a len), en px desde el borde
                             izquierdo de la cinta
   c.el                      el contenedor .cinta

   El tamaño de las casillas se adapta al ancho disponible, como el lienzo.
*/
(function () {
  "use strict";

  function crear(el, texto, opciones) {
    opciones = opciones || {};
    var vista = {
      indices: opciones.indices !== false,
      negativos: !!opciones.negativos,
      cortes: !!opciones.cortes
    };
    var caracteres = [];
    var fila = null;
    var fantasma = null;
    var marcada = null;

    el.classList.add("cinta");
    el.setAttribute("aria-hidden", "true");

    function aplicarVista() {
      el.classList.toggle("cinta--sin-indices", !vista.indices || vista.cortes);
      el.classList.toggle("cinta--negativos", vista.negativos);
      el.classList.toggle("cinta--cortes", vista.cortes);
    }

    function span(clase, contenido) {
      var s = document.createElement("span");
      s.className = clase;
      if (contenido !== undefined) s.textContent = contenido;
      return s;
    }

    function nuevaCasilla(c, i, n) {
      var casilla = span("cinta__casilla");
      casilla.appendChild(span("cinta__indice", String(i)));
      var letra = span("cinta__letra" + (c === " " ? " cinta__letra--espacio" : ""), c === " " ? "␣" : c);
      casilla.appendChild(letra);
      casilla.appendChild(span("cinta__indice cinta__indice--neg", String(i - n)));
      casilla.appendChild(span("cinta__corte", String(i)));
      casilla.appendChild(span("cinta__corte cinta__corte--neg", String(i - n)));
      if (i === n - 1) casilla.appendChild(span("cinta__corte cinta__corte--fin", String(n)));
      return casilla;
    }

    function pintar(nuevo) {
      caracteres = Array.from(nuevo);
      el.textContent = "";
      fantasma = null;
      marcada = null;
      el.style.setProperty("--cinta-n", String(Math.max(caracteres.length + 1, 4)));
      fila = span("cinta__fila");
      var n = caracteres.length;
      if (!n) fila.appendChild(span("cinta__vacia", '"" (vacío)'));
      caracteres.forEach(function (c, i) { fila.appendChild(nuevaCasilla(c, i, n)); });
      el.appendChild(fila);
      aplicarVista();
    }

    function normal(i) {
      var n = caracteres.length;
      if (i === null || i === undefined || isNaN(i)) return null;
      if (i < 0) i += n;
      return i >= 0 && i < n ? i : null;
    }

    function casilla(i) {
      var k = normal(i);
      return k === null ? null : fila.children[k];
    }

    function quitarFantasma() {
      if (fantasma) fantasma.remove();
      fantasma = null;
    }

    function marcar(i) {
      if (marcada) marcada.classList.remove("cinta__casilla--marcada");
      marcada = null;
      quitarFantasma();
      if (i === null || i === undefined) return null;
      var c = casilla(i);
      if (c) {
        marcada = c;
        // Reinicia la animación aunque sea la misma casilla
        void c.offsetWidth;
        c.classList.add("cinta__casilla--marcada");
        return c;
      }
      // Fuera del texto: una casilla vacía en el lado por el que se salió
      var n = caracteres.length;
      fantasma = span("cinta__casilla cinta__casilla--fuera");
      fantasma.appendChild(span("cinta__indice", String(i)));
      fantasma.appendChild(span("cinta__letra", "?"));
      fantasma.appendChild(span("cinta__indice cinta__indice--neg", String(i)));
      if (i < 0) {
        fantasma.querySelector(".cinta__indice").textContent = "";
        fila.insertBefore(fantasma, fila.firstChild);
      } else {
        fantasma.querySelector(".cinta__indice--neg").textContent = "";
        fila.appendChild(fantasma);
      }
      if (!n) fantasma.remove();
      return null;
    }

    function rango(a, b) {
      Array.prototype.forEach.call(fila.querySelectorAll(".cinta__casilla--rango"), function (c) {
        c.classList.remove("cinta__casilla--rango");
        c.style.removeProperty("--cinta-retraso");
      });
      if (a === null || a === undefined) return;
      for (var k = a; k < b; k++) {
        var c = fila.children[k];
        if (!c || c.classList.contains("cinta__casilla--fuera")) continue;
        c.style.setProperty("--cinta-retraso", ((k - a) * 45) + "ms");
        c.classList.add("cinta__casilla--rango");
      }
    }

    function marcarCortes(lista) {
      Array.prototype.forEach.call(fila.querySelectorAll(".cinta__corte"), function (c) {
        var casilla = c.parentNode;
        var k = Array.prototype.indexOf.call(fila.children, casilla) + (c.classList.contains("cinta__corte--fin") ? 1 : 0);
        c.classList.toggle("cinta__corte--marcado", !!lista && lista.indexOf(k) !== -1);
      });
    }

    function clases(fn) {
      Array.prototype.forEach.call(fila.querySelectorAll(".cinta__casilla:not(.cinta__casilla--fuera)"), function (c, i) {
        var previa = c.getAttribute("data-clase");
        if (previa) c.classList.remove(previa);
        var nueva = fn ? fn(i, caracteres[i]) : "";
        if (nueva) {
          c.classList.add(nueva);
          c.setAttribute("data-clase", nueva);
        } else {
          c.removeAttribute("data-clase");
        }
      });
    }

    function corte(k) {
      var n = caracteres.length;
      if (!n) return 0;
      var base = el.getBoundingClientRect().left;
      var cajas = fila.querySelectorAll(".cinta__casilla:not(.cinta__casilla--fuera) .cinta__letra");
      if (k <= 0) return cajas[0].getBoundingClientRect().left - base - hueco() / 2;
      if (k >= n) return cajas[n - 1].getBoundingClientRect().right - base + hueco() / 2;
      return (cajas[k - 1].getBoundingClientRect().right + cajas[k].getBoundingClientRect().left) / 2 - base;
    }

    function hueco() {
      return parseFloat(getComputedStyle(fila).columnGap) || 0;
    }

    pintar(texto);

    return {
      el: el,
      texto: pintar,
      mostrar: function (cambios) {
        for (var k in cambios) vista[k] = !!cambios[k];
        aplicarVista();
      },
      marcar: marcar,
      rango: rango,
      marcarCortes: marcarCortes,
      clases: clases,
      casilla: casilla,
      letra: function (i) {
        var c = casilla(i);
        return c ? c.querySelector(".cinta__letra") : null;
      },
      corte: corte,
      get largo() { return caracteres.length; }
    };
  }

  window.Cinta = { crear: crear };
})();
