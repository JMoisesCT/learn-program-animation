/* lienzo.js — la pantalla donde print() va dejando caracteres, como papel cuadriculado.
   Cada carácter ocupa una casilla; las casillas sin escribir se ven como guías tenues.
   Un cursor marca dónde caerá el siguiente print(…, end=""). Estilos: .lienzo en base.css.

   var lz = Lienzo.crear(el, {
     columnas: 4,                              ancho mínimo en casillas (crece si hace falta)
     filas: 3,                                 filas mínimas (las que faltan se ven como guías)
     etiquetas: function (f) { return "i = " + f; },   (opcional) texto a la izquierda de cada fila
     cabecera: function (c) { return c; },    (opcional) texto encima de cada columna
     cabeceraNombre: "j =",                    (opcional, con etiquetas) texto en la esquina de la cabecera
     cursor: true                              (opcional, por defecto true)
   });

   lz.limpiar()                         borra todo y deja el cursor arriba a la izquierda
   lz.escribir("*", { nota: 2, clase: "lienzo__celda--j" })
                                        escribe en el cursor y lo avanza; nota: número pequeño en la esquina
   lz.saltar()                          print(): el cursor baja a la línea siguiente
   lz.mostrar(["*", "**"], { animar: true, notas: function (f, c) { … } })
                                        pinta una salida completa (las casillas entran en orden)
   lz.comparar(["*", "**"], ["*", "***"])
                                        pinta la salida junto a un patrón objetivo:
                                        bien (coincide), sobra (no coincide con el objetivo) y falta (hueco del objetivo).
                                        Con la salida vacía, [] , se ve solo el objetivo en gris.
                                        Leyenda: <ul class="lienzo-leyenda"> en base.css.
   lz.resaltar(f)                       ilumina la fila f (null: ninguna)
   lz.espacios(visibles)                false: los espacios se ven en blanco, como en la consola real
   lz.configurar({ columnas, filas, … })  cambia las opciones y repinta
*/
(function () {
  "use strict";

  function crear(raiz, opciones) {
    var o = {};
    var lineas = [[]];          // cada línea: lista de { c, nota, clase }
    var cursor = { fila: 0, col: 0 };
    var activa = null;
    var modo = null;            // null o { objetivo: [...] } al comparar
    var animar = {};            // "f,c" -> retraso en ms de las casillas recién escritas

    raiz.classList.add("lienzo");
    raiz.setAttribute("role", "img");

    function configurar(nuevas) {
      for (var k in nuevas) o[k] = nuevas[k];
      if (o.cursor === undefined) o.cursor = true;
      pintar();
    }

    function texto(linea) { return linea.map(function (x) { return x.c; }).join(""); }

    function describir() {
      var visibles = lineas.slice();
      if (!visibles[visibles.length - 1].length) visibles.pop();
      raiz.setAttribute("aria-label", visibles.length
        ? "Pantalla: " + visibles.map(function (l) { return l.length ? "«" + texto(l) + "»" : "línea vacía"; }).join(", ")
        : "Pantalla vacía");
    }

    function casilla(clase, contenido) {
      var s = document.createElement("span");
      s.className = "lienzo__celda " + clase;
      if (contenido !== undefined) s.textContent = contenido;
      return s;
    }

    function claseDe(c) {
      if (c === " ") return "lienzo__celda--espacio";
      if (c === "*") return "lienzo__celda--estrella";
      return "lienzo__celda--texto";
    }

    function pintar() {
      var objetivo = modo ? modo.objetivo : null;
      // La última línea solo se dibuja si ya tiene algo (o cabe en las filas mínimas)
      var usadas = lineas[lineas.length - 1].length ? lineas.length : lineas.length - 1;
      var nFilas = Math.max(o.filas || 1, usadas);
      if (objetivo) nFilas = Math.max(nFilas, objetivo.length);
      var nCols = o.columnas || 1;
      lineas.forEach(function (l) { nCols = Math.max(nCols, l.length); });
      if (objetivo) objetivo.forEach(function (t) { nCols = Math.max(nCols, t.length); });
      if (o.cursor && !objetivo) nCols = Math.max(nCols, cursor.col + 1);

      raiz.textContent = "";
      raiz.style.setProperty("--lz-cols", nCols);
      raiz.classList.toggle("lienzo--etiquetas", !!o.etiquetas);

      if (o.cabecera) {
        var cab = document.createElement("div");
        cab.className = "lienzo__fila lienzo__fila--cabecera";
        if (o.etiquetas) {
          var esquina = document.createElement("span");
          esquina.className = "lienzo__etiqueta lienzo__etiqueta--cab";
          esquina.textContent = o.cabeceraNombre || "";
          cab.appendChild(esquina);
        }
        for (var c = 0; c < nCols; c++) {
          var h = document.createElement("span");
          h.className = "lienzo__cab";
          h.textContent = o.cabecera(c);
          cab.appendChild(h);
        }
        raiz.appendChild(cab);
      }

      for (var f = 0; f < nFilas; f++) {
        var fila = document.createElement("div");
        var linea = lineas[f] || [];
        fila.className = "lienzo__fila" + (f === activa ? " lienzo__fila--activa" : "") +
          (!objetivo && f > cursor.fila ? " lienzo__fila--pendiente" : "");
        if (o.etiquetas) {
          var et = document.createElement("span");
          et.className = "lienzo__etiqueta";
          et.textContent = o.etiquetas(f);
          fila.appendChild(et);
        }
        for (var k = 0; k < nCols; k++) {
          var x = linea[k];
          var el;
          if (objetivo) {
            var t = (objetivo[f] || "").charAt(k) || " ";
            var sale = x ? x.c : " ";
            if (sale !== " " && sale === t) el = casilla(claseDe(sale) + " lienzo__celda--bien", sale);
            else if (sale !== " ") el = casilla(claseDe(sale) + " lienzo__celda--sobra", sale);
            else if (t !== " ") el = casilla("lienzo__celda--falta", t);
            else el = x ? casilla(claseDe(" "), "·") : casilla("lienzo__celda--guia");
          } else if (x) {
            el = casilla(claseDe(x.c) + (x.clase ? " " + x.clase : ""), x.c === " " ? "·" : x.c);
            if (x.nota !== undefined) {
              var n = document.createElement("small");
              n.className = "lienzo__nota";
              n.textContent = x.nota;
              el.appendChild(n);
            }
          } else {
            el = casilla("lienzo__celda--guia");
          }
          if (!objetivo && o.cursor && f === cursor.fila && k === cursor.col) el.classList.add("lienzo__celda--cursor");
          var retraso = animar[f + "," + k];
          if (retraso !== undefined) {
            el.classList.add("lienzo__celda--nueva");
            el.style.animationDelay = retraso + "ms";
          }
          fila.appendChild(el);
        }
        raiz.appendChild(fila);
      }
      animar = {};
      describir();
    }

    function limpiar() {
      lineas = [[]];
      cursor = { fila: 0, col: 0 };
      activa = null;
      modo = null;
      raiz.classList.remove("lienzo--solo-objetivo");
      pintar();
    }

    function escribir(c, extra) {
      extra = extra || {};
      modo = null;
      lineas[cursor.fila].push({ c: String(c), nota: extra.nota, clase: extra.clase });
      animar[cursor.fila + "," + cursor.col] = 0;
      cursor.col++;
      pintar();
    }

    function saltar() {
      modo = null;
      lineas.push([]);
      cursor = { fila: cursor.fila + 1, col: 0 };
      pintar();
    }

    function cargar(salida, notas) {
      lineas = salida.map(function (t, f) {
        return t.split("").map(function (c, k) {
          return { c: c, nota: notas ? notas(f, k) : undefined };
        });
      });
      lineas.push([]);
      cursor = { fila: salida.length, col: 0 };
    }

    function mostrar(salida, extra) {
      extra = extra || {};
      modo = null;
      raiz.classList.remove("lienzo--solo-objetivo");
      cargar(salida, extra.notas);
      if (extra.animar !== false) {
        var total = salida.join("").length;
        var paso = Math.min(70, 1400 / Math.max(1, total));
        var n = 0;
        salida.forEach(function (t, f) {
          for (var k = 0; k < t.length; k++) animar[f + "," + k] = Math.round(n++ * paso);
        });
      }
      pintar();
    }

    function comparar(salida, objetivo) {
      cargar(salida);
      modo = { objetivo: objetivo };
      pintar();
      raiz.classList.toggle("lienzo--solo-objetivo", !salida.length);
    }

    function resaltar(f) {
      activa = f === null || f === undefined ? null : f;
      raiz.querySelectorAll(".lienzo__fila:not(.lienzo__fila--cabecera)").forEach(function (el, i) {
        el.classList.toggle("lienzo__fila--activa", i === activa);
      });
    }

    function espacios(visibles) { raiz.classList.toggle("lienzo--sin-espacios", !visibles); }

    configurar(opciones || {});
    return {
      limpiar: limpiar, escribir: escribir, saltar: saltar, mostrar: mostrar,
      comparar: comparar, resaltar: resaltar, espacios: espacios, configurar: configurar
    };
  }

  window.Lienzo = { crear: crear };
})();
