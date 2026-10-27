/* lista.js — una lista de Python como fila de casilleros, uno por elemento, con su índice.
   Hermana de la cinta (cinta.js): la cinta guarda un carácter por casilla; la lista, un valor
   entero por casillero (un número, un texto, otra lista). Necesita codigo.js para los vuelos.

     var l = Lista.crear(el, [14, 9, 17], {
       indices: true,       número de cada casillero encima (notas[0], notas[1]…)
       negativos: false,    número negativo debajo (notas[-1] es el último)
       nombres: ["notas"],  (opcional) etiquetas que apuntan a la lista (dos nombres, una lista)
       corchetes: true      [ y ] en los extremos, como se escribe en Python
     });

   Los textos se ven con comillas ("Ana") y los números sin ellas. Una lista de listas
   (p. ej. un tablero de 3×3) se ve como cuadrícula: una fila por elemento, con su índice
   a la izquierda y el de cada columna encima. En la cuadrícula, i puede ser [fila, columna].

   l.valores([…])            repinta con otros valores, sin animación
   l.lista                   copia de los valores actuales
   l.marcar(i)               resalta el casillero i (admite negativos) y lo devuelve. Si i se
                             sale, aparece un casillero vacío con su número, marcado como
                             error (IndexError), y devuelve null. l.marcar(null) quita la marca.
   l.rango(a, b)             resalta de a hasta b, sin incluirlo (notas[a:b]); l.rango(null) lo quita
   l.clases(fn)              fn(i, valor) devuelve una clase extra para cada casillero
                             ("lista__casilla--igual", "--distinta", "--apagada", "--cambio"), o "".
                             En la cuadrícula: fn([f, c], valor)
   l.casilla(i)              el casillero i, o null
   l.valor(i)                el cuadro con el valor del casillero i (origen o destino de un vuelo)
   l.cambiar(i, v, origen)   el valor viejo sale volando y el nuevo entra: llega desde origen
                             (elemento o rectángulo) o, si no se da, desde la línea de código activa
   l.agregar(v, origen)      .append(v): un casillero nuevo al final; el valor llega volando
   l.insertar(i, v, origen)  .insert(i, v): los de la derecha se corren para hacerle lugar
   l.quitar(i)               .pop(i) / .remove(): el casillero sube y se va, los de la derecha se
                             corren a la izquierda. Devuelve el rectángulo donde estaba su valor
                             (para hacerlo volar a una caja o a la consola con Codigo.volar)
   l.reordenar(orden)        .sort(): orden dice, para cada lugar nuevo, de qué índice viene el
                             valor (p. ej. [2, 0, 1]); cada casillero viaja a su lugar nuevo
   l.nombres([…])            cambia las etiquetas: las nuevas aparecen con un salto
   l.el                      el contenedor .lista

   Lista.python(v)           cómo lo imprime print: [14, 9, 'Ana'] (comillas simples, como Python)
   Lista.texto(v)            cómo se escribe en el código: "Ana", 14, [1, 2]

   Al cambiar la lista (agregar, insertar, quitar, reordenar), los casilleros que se quedan
   se deslizan desde su lugar viejo y los índices se renumeran. Sin movimiento, todo es de golpe.
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

  /* ---------- Cómo se escribe un valor ---------- */
  function numero(v) { return String(v); }

  function texto(v) {
    if (Array.isArray(v)) return "[" + v.map(texto).join(", ") + "]";
    if (typeof v === "string") return '"' + v + '"';
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null || v === undefined) return "None";
    return numero(v);
  }

  function python(v) {
    if (Array.isArray(v)) return "[" + v.map(python).join(", ") + "]";
    if (typeof v === "string") return v.indexOf("'") !== -1 ? '"' + v + '"' : "'" + v + "'";
    return texto(v);
  }

  function crear(el, valoresIniciales, opciones) {
    opciones = opciones || {};
    var vista = {
      indices: opciones.indices !== false,
      negativos: !!opciones.negativos,
      corchetes: opciones.corchetes !== false
    };
    var valores = [];
    var nombres = [];
    var fila = null;
    var cajaNombres = null;
    var fantasma = null;
    var marcada = null;
    var cuadricula = false;

    el.classList.add("lista");
    el.setAttribute("aria-hidden", "true");

    function aplicarVista() {
      el.classList.toggle("lista--sin-indices", !vista.indices);
      el.classList.toggle("lista--negativos", vista.negativos);
      el.classList.toggle("lista--sin-corchetes", !vista.corchetes);
      el.classList.toggle("lista--cuadricula", cuadricula);
    }

    /* ---------- Casilleros ---------- */
    function nuevoValor(v) {
      var s = span("lista__valor" + (typeof v === "string" ? " lista__valor--texto" : ""), texto(v));
      if (typeof v === "string" && v.trim() === "") s.classList.add("lista__valor--espacio");
      return s;
    }

    function nuevaCasilla(v) {
      var c = span("lista__casilla");
      c.appendChild(span("lista__indice"));
      c.appendChild(nuevoValor(v));
      c.appendChild(span("lista__indice lista__indice--neg"));
      return c;
    }

    // Una fila de la cuadrícula: su índice a la izquierda y sus casilleros
    function nuevaFila(v) {
      var f = span("lista__casilla lista__casilla--fila");
      f.appendChild(span("lista__indice lista__indice--fila"));
      var dentro = span("lista__interna");
      v.forEach(function (x) { dentro.appendChild(nuevaCasilla(x)); });
      f.appendChild(dentro);
      return f;
    }

    function casillas() {
      return Array.prototype.filter.call(fila.children, function (c) {
        return c.classList.contains("lista__casilla") && !c.classList.contains("lista__casilla--fuera");
      });
    }

    function renumerar() {
      var cs = casillas();
      var n = cs.length;
      el.style.setProperty("--lista-n", String(Math.max(n + 1, 4)));
      cs.forEach(function (c, i) {
        if (cuadricula) {
          c.classList.toggle("lista__casilla--primera", i === 0);
          c.querySelector(".lista__indice--fila").textContent = String(i);
          Array.prototype.forEach.call(c.querySelectorAll(".lista__interna > .lista__casilla"), function (d, j, todas) {
            d.children[0].textContent = String(j);
            d.children[2].textContent = String(j - todas.length);
          });
          return;
        }
        c.children[0].textContent = String(i);
        c.children[2].textContent = String(i - n);
      });
      var vacia = fila.querySelector(".lista__vacia");
      if (!n && !vacia) fila.insertBefore(span("lista__vacia", "vacía"), fila.lastChild);
      if (n && vacia) vacia.remove();
    }

    function pintarNombres() {
      if (!cajaNombres) {
        cajaNombres = span("lista__nombres");
        el.insertBefore(cajaNombres, el.firstChild);
      }
      var previos = {};
      Array.prototype.forEach.call(cajaNombres.children, function (n) { previos[n.textContent] = true; });
      cajaNombres.textContent = "";
      nombres.forEach(function (nombre) {
        var n = span("lista__nombre" + (previos[nombre] ? "" : " lista__nombre--nuevo"), nombre);
        cajaNombres.appendChild(n);
      });
      cajaNombres.hidden = !nombres.length;
    }

    function pintar(nuevos) {
      valores = nuevos.slice();
      cuadricula = valores.length > 0 && valores.every(Array.isArray);
      if (fila) fila.remove();
      fantasma = null;
      marcada = null;
      fila = span("lista__fila");
      fila.appendChild(span("lista__corchete", "["));
      valores.forEach(function (v) { fila.appendChild(cuadricula ? nuevaFila(v) : nuevaCasilla(v)); });
      fila.appendChild(span("lista__corchete", "]"));
      el.appendChild(fila);
      aplicarVista();
      renumerar();
    }

    /* ---------- Índices ---------- */
    function normal(i, n) {
      if (i === null || i === undefined || isNaN(i)) return null;
      if (i < 0) i += n;
      return i >= 0 && i < n ? i : null;
    }

    function casilla(i) {
      if (Array.isArray(i)) {
        var f = casilla(i[0]);
        if (!f || !cuadricula) return null;
        var internas = f.querySelectorAll(".lista__interna > .lista__casilla");
        var k = normal(i[1], internas.length);
        return k === null ? null : internas[k];
      }
      var cs = casillas();
      var j = normal(i, cs.length);
      return j === null ? null : cs[j];
    }

    function quitarFantasma() {
      if (fantasma) fantasma.remove();
      fantasma = null;
    }

    function quitarMarca() {
      el.querySelectorAll(".lista__casilla--marcada").forEach(function (c) { c.classList.remove("lista__casilla--marcada"); });
      el.querySelectorAll(".lista__indice--marcado").forEach(function (c) { c.classList.remove("lista__indice--marcado"); });
      marcada = null;
      quitarFantasma();
    }

    function marcar(i) {
      quitarMarca();
      if (i === null || i === undefined) return null;
      var c = casilla(i);
      if (c) {
        marcada = c;
        void c.offsetWidth;
        c.classList.add("lista__casilla--marcada");
        // En la cuadrícula, también su fila y el número de su columna (en la primera fila)
        if (Array.isArray(i)) {
          casilla(i[0]).classList.add("lista__casilla--marcada");
          casilla([0, i[1]]).children[0].classList.add("lista__indice--marcado");
        }
        return c;
      }
      if (Array.isArray(i) || cuadricula) return null;
      // Fuera de la lista: un casillero vacío en el lado por el que se salió
      var n = valores.length;
      fantasma = span("lista__casilla lista__casilla--fuera");
      fantasma.appendChild(span("lista__indice", i >= 0 ? String(i) : ""));
      fantasma.appendChild(span("lista__valor", "?"));
      fantasma.appendChild(span("lista__indice lista__indice--neg", i < 0 ? String(i) : ""));
      if (i < 0) fila.insertBefore(fantasma, fila.children[1]);
      else fila.insertBefore(fantasma, fila.lastChild);
      return null;
    }

    function rango(a, b) {
      el.querySelectorAll(".lista__casilla--rango").forEach(function (c) {
        c.classList.remove("lista__casilla--rango");
        c.style.removeProperty("--lista-retraso");
      });
      if (a === null || a === undefined) return;
      var cs = casillas();
      for (var k = Math.max(0, a); k < Math.min(b, cs.length); k++) {
        cs[k].style.setProperty("--lista-retraso", ((k - a) * 45) + "ms");
        cs[k].classList.add("lista__casilla--rango");
      }
    }

    function clases(fn) {
      function aplicar(c, clave, v) {
        var previa = c.getAttribute("data-clase");
        if (previa) c.classList.remove(previa);
        var nueva = fn ? fn(clave, v) : "";
        if (nueva) {
          c.classList.add(nueva);
          c.setAttribute("data-clase", nueva);
        } else {
          c.removeAttribute("data-clase");
        }
      }
      casillas().forEach(function (c, i) {
        if (!cuadricula) { aplicar(c, i, valores[i]); return; }
        c.querySelectorAll(".lista__interna > .lista__casilla").forEach(function (d, j) { aplicar(d, [i, j], valores[i][j]); });
      });
    }

    /* ---------- Animaciones ---------- */
    // FLIP: se mide dónde estaba cada casillero, se cambia la fila y cada uno se desliza desde ahí
    function medir() {
      var m = new Map();
      casillas().forEach(function (c) { m.set(c, c.getBoundingClientRect()); });
      return m;
    }

    function deslizar(previas) {
      if (reducir() || !document.body.animate) return;
      casillas().forEach(function (c) {
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

    // Una copia de el (en su lugar de la pantalla) que sube y se desvanece
    function fantasmaQueSale(elemento, clase) {
      if (reducir() || !document.body.animate || !elemento.offsetParent) return;
      var r = elemento.getBoundingClientRect();
      var copia = elemento.cloneNode(true);
      copia.classList.add("lista__sale");
      if (clase) copia.classList.add(clase);
      copia.style.left = r.left + "px";
      copia.style.top = r.top + "px";
      copia.style.width = r.width + "px";
      copia.style.height = r.height + "px";
      document.body.appendChild(copia);
      var a = copia.animate([
        { transform: "none", opacity: 1 },
        { transform: "translateY(-2.5rem) rotate(-8deg) scale(0.9)", opacity: 0 }
      ], { duration: 480, easing: "ease-in" });
      a.onfinish = a.oncancel = function () { copia.remove(); };
    }

    // El valor llega volando a su casillero: desde origen o desde la línea activa del código
    function llegar(valorEl, v, origen) {
      var t = texto(v);
      function pulso() { valorEl.classList.add("lista__valor--pulso"); }
      if (window.Codigo && origen) Codigo.volar(origen, valorEl, t, "lista__valor lista__vuelo", pulso);
      else if (window.Codigo) Codigo.volarDesdeLinea(el, valorEl, t, "lista__valor lista__vuelo", pulso);
      else pulso();
    }

    function cambiar(i, v, origen) {
      quitarFantasma();
      var c = casilla(i);
      if (!c) return null;
      var viejo = c.querySelector(":scope > .lista__valor");
      fantasmaQueSale(viejo);
      var nuevo = nuevoValor(v);
      c.replaceChild(nuevo, viejo);
      if (Array.isArray(i)) {
        var f = normal(i[0], valores.length);
        valores[f][normal(i[1], valores[f].length)] = v;
      }
      else valores[normal(i, valores.length)] = v;
      llegar(nuevo, v, origen);
      return c;
    }

    function insertar(i, v, origen) {
      quitarMarca();
      var n = valores.length;
      // Como Python: un índice que se pasa pone el valor en el extremo
      if (i < 0) i = Math.max(0, n + i);
      i = Math.min(i, n);
      var previas = medir();
      var c = nuevaCasilla(v);
      var cs = casillas();
      fila.insertBefore(c, i < n ? cs[i] : fila.lastChild);
      valores.splice(i, 0, v);
      renumerar();
      deslizar(previas);
      if (!reducir()) c.classList.add("lista__casilla--entra");
      llegar(c.querySelector(".lista__valor"), v, origen);
      return c;
    }

    function agregar(v, origen) { return insertar(valores.length, v, origen); }

    function quitar(i) {
      quitarMarca();
      var c = casilla(i);
      if (!c) return null;
      var k = casillas().indexOf(c);
      var rect = c.querySelector(".lista__valor").getBoundingClientRect();
      fantasmaQueSale(c, "lista__sale--casilla");
      var previas = medir();
      c.remove();
      valores.splice(k, 1);
      renumerar();
      deslizar(previas);
      return rect;
    }

    function reordenar(orden) {
      quitarMarca();
      var previas = medir();
      var cs = casillas();
      var nuevos = orden.map(function (k) { return valores[k]; });
      orden.forEach(function (k) { fila.insertBefore(cs[k], fila.lastChild); });
      valores = nuevos;
      renumerar();
      deslizar(previas);
    }

    pintar(valoresIniciales || []);
    if (opciones.nombres) {
      nombres = opciones.nombres.slice();
      pintarNombres();
      cajaNombres.querySelectorAll(".lista__nombre--nuevo").forEach(function (n) { n.classList.remove("lista__nombre--nuevo"); });
    }

    return {
      el: el,
      valores: pintar,
      get lista() { return JSON.parse(JSON.stringify(valores)); },
      get largo() { return valores.length; },
      mostrar: function (cambios) {
        for (var k in cambios) vista[k] = !!cambios[k];
        aplicarVista();
      },
      marcar: marcar,
      rango: rango,
      clases: clases,
      casilla: casilla,
      valor: function (i) {
        var c = casilla(i);
        return c ? c.querySelector(":scope > .lista__valor") : null;
      },
      cambiar: cambiar,
      agregar: agregar,
      insertar: insertar,
      quitar: quitar,
      reordenar: reordenar,
      nombres: function (lista) {
        nombres = lista.slice();
        pintarNombres();
      }
    };
  }

  window.Lista = { crear: crear, python: python, texto: texto };
})();
