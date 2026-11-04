/* matriz.js — una matriz de Python (una lista de listas) como tabla de casillas, con el
   número de cada fila a la izquierda y el de cada columna encima. Prima de la cuadrícula
   de lista.js, pensada para matrices de números de cualquier tamaño (filas × columnas) y
   para calcular con ellas: recorrerlas con dos dedos, sumar por filas y por columnas,
   mirar la diagonal o los vecinos. Necesita codigo.js para los vuelos.

     var m = Matriz.crear(el, [[14, 9, 17], [11, 16, 8]], {
       nombre: "notas",                (opcional) etiqueta encima, como en lista.js
       indices: true,                  número de cada fila (izquierda) y columna (arriba)
       rotulosFilas: ["Ana", "Luis"],  (opcional) un rótulo junto a cada fila (quién es)
       rotulosColumnas: ["Mate", "Leng", "Arte"],   (opcional) uno encima de cada columna
       comillas: true,                 los textos con comillas ("X"); false: solo la letra
       dedos: { fila: "f", columna: "c" },   nombres de los dedos (ver m.dedos)
       reservarDedos: false,           true: deja desde el principio el lugar de los dedos
                                       (si no, se abre la primera vez que se usan)
       maximo: 3.2                     (rem) el lado más grande de una casilla
     });

   Las casillas se achican para que la matriz quepa a lo ancho (en el móvil, una sala de
   8 columnas cabe en 390 px) y la letra, según lo largo de los valores.

   m.valores([[…], …])        repinta con otros valores, sin animación
   m.matriz                   copia de los valores actuales
   m.filas, m.columnas        cuántas filas y columnas tiene (columnas: las de la fila 0)
   m.celda([f, c])            la casilla (.matriz__celda), o null
   m.valor([f, c])            el cuadro con su valor (origen o destino de un vuelo), o null
   m.filaEl(f)                el elemento de la fila f (para darle una clase propia)

   m.marcar([f, c])           resalta la casilla y los números de su fila y su columna.
                              Si se sale (f o c fuera de la matriz), aparece una casilla
                              vacía con borde rojo donde estaría (IndexError) y devuelve null.
                              m.marcar(null) quita la marca. Admite negativos, como Python.
   m.marcarFila(f)            ilumina la fila entera (notas[f]); null la apaga
   m.marcarColumna(c)         ilumina la columna entera (una columna no es una lista: se
                              recorre con c fijo); null la apaga
   m.clases(fn)               fn([f, c], valor) devuelve una clase extra para cada casilla, o "":
                              "matriz__celda--hecha" (ya pasó el dedo), "--ok", "--pista",
                              "--azul", "--morado", "--apagada", "--mal". m.clases(null) las quita.

   m.dedos({ fila: 1, columna: 2 })
                              dos fichas que señalan: la de la fila, a la izquierda de su
                              número, y la de la columna, encima del suyo. Se deslizan al
                              cambiar (el bucle de afuera mueve f; el de adentro, c). Un dedo
                              puede quedar fuera (-1 o len): se ve punteado. null en uno lo
                              quita; m.dedos(null), los dos. Otros nombres para esta llamada:
                              { fila: 2, columna: 2, nombres: { fila: "i", columna: "i" } }.

   m.cambiar([f, c], v, origen)  el valor viejo sale volando y el nuevo llega: desde origen
                              (elemento o rectángulo) o, si no se da, desde la línea activa
   m.agregarFila(valores, origen)   matriz.append(fila): una fila nueva nace abajo; si se da
                              origen (p. ej. la lista fila de al lado), cada valor vuela desde
                              ahí a su casilla. Devuelve el elemento de la fila.
   m.quitarFila(f)            la fila sube y se va (pop). Devuelve el rectángulo donde estaba.

   m.totales({ filas: [..] | null, columnas: [..] | null,
               rotuloFilas: "suma", rotuloColumnas: "suma" })
                              una columna a la derecha (un valor por fila) y una fila abajo
                              (uno por columna), al margen de la matriz y en otro color: lo
                              que se calcula, no lo que se guarda. "" deja el lugar vacío.
                              null quita esa parte; m.totales(null), las dos.
   m.total("fila" | "columna", i, v, origen)
                              pone un total con un vuelo desde origen o desde la línea activa
                              (como m.cambiar). Devuelve el elemento del total.
   m.marcarTotal("fila" | "columna", i)   resalta un total (el menor, el mayor); null lo apaga
   m.el                       el contenedor .matriz

   Matriz.python(v)           cómo lo imprime print: [[14, 9], [17, 11]]
   Matriz.texto(v)            un valor como se escribe en el código: "X", 14, True
   Matriz.codigo(nombre, v)   las líneas para escribir la matriz en el código, una fila
                              por línea (para Python.escribir):
                                notas = [
                                    [14, 9, 17],
                                    [11, 16, 8],
                                ]

   Con prefers-reduced-motion no hay vuelos ni deslizamientos: todo cambia de golpe.
*/
(function () {
  "use strict";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function span(clase, contenido) {
    var s = document.createElement("span");
    s.className = clase;
    if (contenido !== undefined && contenido !== null) s.textContent = contenido;
    return s;
  }

  /* ---------- Cómo se escribe un valor ---------- */
  function texto(v, comillas) {
    if (v === null || v === undefined) return "None";
    if (v === true) return "True";
    if (v === false) return "False";
    if (typeof v === "string") return comillas === false ? v : '"' + v + '"';
    if (Array.isArray(v)) return "[" + v.map(function (x) { return texto(x); }).join(", ") + "]";
    return String(v);
  }

  function python(v) {
    if (typeof v === "string") return "'" + v + "'";
    if (Array.isArray(v)) return "[" + v.map(python).join(", ") + "]";
    return texto(v);
  }

  function codigo(nombre, m) {
    var lineas = [nombre + " = ["];
    m.forEach(function (fila) { lineas.push("    " + texto(fila) + ","); });
    lineas.push("]");
    return lineas;
  }

  function copiar(m) { return m.map(function (f) { return Array.isArray(f) ? f.slice() : f; }); }

  function normal(i, n) {
    if (i === null || i === undefined || isNaN(i)) return null;
    if (i < 0) i += n;
    return i >= 0 && i < n ? i : null;
  }

  function crear(el, valoresIniciales, opciones) {
    opciones = opciones || {};
    var comillas = opciones.comillas !== false;
    var nombresDedos = { fila: "f", columna: "c" };
    if (opciones.dedos) for (var k in opciones.dedos) nombresDedos[k] = opciones.dedos[k];
    var maximo = opciones.maximo || 3.2;

    var valores = [];
    var tabla = null;
    var cabecera = null;      // fila con los números de columna
    var filaRotulos = null;   // fila con los rótulos de columna
    var filaTotales = null;   // fila de abajo con los totales por columna
    var filasEls = [];
    var fantasma = null;
    var capaDedos = null;
    var dedosActuales = {};
    var tot = { filas: null, columnas: null, rotuloFilas: "", rotuloColumnas: "" };
    var columnasN = 0;

    el.classList.add("matriz");
    el.setAttribute("aria-hidden", "true");

    var etiqueta = null;
    if (opciones.nombre) {
      etiqueta = span("matriz__nombre", opciones.nombre);
      el.appendChild(etiqueta);
    }

    /* ---------- Armar la tabla ---------- */
    function nuevoValor(v) {
      var s = span("matriz__valor" + (typeof v === "string" ? " matriz__valor--texto" : ""), texto(v, comillas));
      if (typeof v === "boolean") s.classList.add("matriz__valor--booleano");
      return s;
    }

    function nuevaCelda(f, c, v) {
      var d = span("matriz__celda");
      d.setAttribute("data-f", String(f));
      d.setAttribute("data-c", String(c));
      d.style.gridColumn = String(c + 3);
      d.appendChild(nuevoValor(v));
      return d;
    }

    function nuevaFila(f, fila) {
      var r = span("matriz__fila");
      r.setAttribute("data-f", String(f));
      var rot = span("matriz__rotulo matriz__rotulo--fila", opciones.rotulosFilas ? (opciones.rotulosFilas[f] || "") : "");
      rot.style.gridColumn = "1";
      r.appendChild(rot);
      var ind = span("matriz__indice matriz__indice--fila", String(f));
      ind.style.gridColumn = "2";
      r.appendChild(ind);
      fila.forEach(function (v, c) { r.appendChild(nuevaCelda(f, c, v)); });
      var t = span("matriz__total matriz__total--fila");
      t.style.gridColumn = String(columnasN + 3);
      r.appendChild(t);
      return r;
    }

    function pintar(nuevos) {
      valores = copiar(nuevos || []);
      columnasN = valores.reduce(function (m, f) { return Math.max(m, f.length); }, 0);
      if (tabla) tabla.remove();
      fantasma = null;
      tabla = span("matriz__tabla");
      tabla.style.setProperty("--cols", String(Math.max(columnasN, 1)));
      // Columnas: [rótulo] [número de fila] [casillas…] [total]
      tabla.style.gridTemplateColumns = "auto auto repeat(" + Math.max(columnasN, 1) + ", var(--c)) auto";

      filaRotulos = null;
      if (opciones.rotulosColumnas) {
        filaRotulos = span("matriz__fila matriz__fila--rotulos");
        for (var c = 0; c < columnasN; c++) {
          var r = span("matriz__rotulo matriz__rotulo--columna", opciones.rotulosColumnas[c] || "");
          r.style.gridColumn = String(c + 3);
          filaRotulos.appendChild(r);
        }
        tabla.appendChild(filaRotulos);
      }

      cabecera = span("matriz__fila matriz__fila--cabecera");
      for (var j = 0; j < columnasN; j++) {
        var ic = span("matriz__indice matriz__indice--columna", String(j));
        ic.style.gridColumn = String(j + 3);
        ic.setAttribute("data-c", String(j));
        cabecera.appendChild(ic);
      }
      var rt = span("matriz__rotulo matriz__rotulo--total");
      rt.style.gridColumn = String(columnasN + 3);
      cabecera.appendChild(rt);
      tabla.appendChild(cabecera);

      filasEls = valores.map(function (fila, f) {
        var r = nuevaFila(f, fila);
        tabla.appendChild(r);
        return r;
      });

      filaTotales = span("matriz__fila matriz__fila--totales");
      var rf = span("matriz__rotulo matriz__rotulo--fila");
      rf.style.gridColumn = "1 / span 2";
      filaTotales.appendChild(rf);
      for (var q = 0; q < columnasN; q++) {
        var t = span("matriz__total matriz__total--columna");
        t.style.gridColumn = String(q + 3);
        filaTotales.appendChild(t);
      }
      tabla.appendChild(filaTotales);

      var vacia = span("matriz__vacia", "[ ]  vacía");
      tabla.appendChild(vacia);

      el.appendChild(tabla);
      if (capaDedos) tabla.appendChild(capaDedos);
      el.classList.toggle("matriz--sin-indices", opciones.indices === false);
      el.classList.toggle("matriz--rotulos-filas", !!opciones.rotulosFilas);
      el.classList.toggle("matriz--vacia", !valores.length);
      pintarTotales();
      medirTamano();
      ubicarDedos();
    }

    /* ---------- Tamaño de las casillas ---------- */
    function largoMayor() {
      var n = 1;
      valores.forEach(function (f) { f.forEach(function (v) { n = Math.max(n, texto(v, comillas).length); }); });
      return n;
    }

    function medirTamano() {
      var ancho = el.clientWidth;
      if (!ancho || !tabla) return;   // oculta (otro paso): se mide al aparecer
      var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      var cols = Math.max(columnasN, 1);
      // Lo que no son casillas (rótulos, números de fila, el dedo, los totales) mide lo que
      // mide la tabla menos sus casillas
      var una = tabla.querySelector(".matriz__fila:not(.matriz__fila--cabecera) .matriz__celda") ||
        tabla.querySelector(".matriz__indice--columna");
      // offsetWidth, no getBoundingClientRect: una fila que entra está achicada (scale)
      var actual = una ? una.offsetWidth : 0;
      var fijo = actual ? Math.max(0, tabla.offsetWidth - actual * cols) : 3 * rem;
      var lado = Math.max(1.7 * rem, Math.min(maximo * rem, (ancho - fijo - 2) / cols));
      el.style.setProperty("--c", (lado / rem).toFixed(3) + "rem");
      // La letra, según lo largo del valor más largo ("Ana", 17.5)
      var largo = largoMayor();
      var letra = Math.min(0.42, 0.95 / Math.max(2.1, largo * 0.62 + 0.5));
      el.style.setProperty("--matriz-letra", letra.toFixed(3));
    }

    /* ---------- Buscar casillas ---------- */
    function celda(i) {
      if (!Array.isArray(i)) return null;
      var f = normal(i[0], valores.length);
      if (f === null) return null;
      var c = normal(i[1], valores[f].length);
      if (c === null) return null;
      return filasEls[f].querySelector('.matriz__celda[data-c="' + c + '"]');
    }

    function indiceColumna(c) { return cabecera ? cabecera.querySelector('.matriz__indice[data-c="' + c + '"]') : null; }

    /* ---------- Marcas ---------- */
    function quitarMarca() {
      el.querySelectorAll(".matriz__celda--marcada").forEach(function (c) { c.classList.remove("matriz__celda--marcada"); });
      el.querySelectorAll(".matriz__indice--marcado").forEach(function (c) { c.classList.remove("matriz__indice--marcado"); });
      if (fantasma) fantasma.remove();
      fantasma = null;
    }

    function marcar(i) {
      quitarMarca();
      if (i === null || i === undefined) return null;
      var d = celda(i);
      var f = normal(i[0], valores.length);
      if (f !== null) filasEls[f].querySelector(".matriz__indice--fila").classList.add("matriz__indice--marcado");
      if (d) {
        void d.offsetWidth;
        d.classList.add("matriz__celda--marcada");
        var c = Number(d.getAttribute("data-c"));
        var ic = indiceColumna(c);
        if (ic) ic.classList.add("matriz__indice--marcado");
        return d;
      }
      // Fuera: una casilla vacía con borde rojo donde estaría
      fantasma = span("matriz__celda matriz__celda--fuera");
      fantasma.appendChild(span("matriz__valor", "?"));
      if (f !== null) {
        // La fila existe y la columna no: al final de la fila (o al principio, con un negativo)
        fantasma.style.gridColumn = String(i[1] < 0 ? 1 : columnasN + 3);
        filasEls[f].appendChild(fantasma);
      } else {
        // La fila no existe: una fila fantasma debajo (o encima, con un negativo)
        var fila = span("matriz__fila matriz__fila--fuera");
        var ind = span("matriz__indice matriz__indice--fila matriz__indice--error", String(i[0]));
        ind.style.gridColumn = "2";
        fila.appendChild(ind);
        var col = normal(i[1], columnasN);
        fantasma.style.gridColumn = String((col === null ? 0 : col) + 3);
        fila.appendChild(fantasma);
        tabla.insertBefore(fila, i[0] < 0 ? (filasEls[0] || filaTotales) : filaTotales);
        fantasma = fila;
      }
      return null;
    }

    function marcarFila(f) {
      filasEls.forEach(function (r) { r.classList.remove("matriz__fila--marcada"); });
      var k = normal(f, valores.length);
      if (k === null) return null;
      void filasEls[k].offsetWidth;
      filasEls[k].classList.add("matriz__fila--marcada");
      return filasEls[k];
    }

    function marcarColumna(c) {
      el.querySelectorAll(".matriz__celda--columna").forEach(function (d) { d.classList.remove("matriz__celda--columna"); });
      el.querySelectorAll(".matriz__indice--columna-marcada").forEach(function (d) { d.classList.remove("matriz__indice--columna-marcada"); });
      var k = normal(c, columnasN);
      if (k === null) return null;
      el.querySelectorAll('.matriz__celda[data-c="' + k + '"]').forEach(function (d, n) {
        d.style.setProperty("--matriz-retraso", (n * 45) + "ms");
        d.classList.add("matriz__celda--columna");
      });
      var ic = indiceColumna(k);
      if (ic) ic.classList.add("matriz__indice--columna-marcada");
      return ic;
    }

    function clases(fn) {
      el.querySelectorAll(".matriz__fila:not(.matriz__fila--fuera) .matriz__celda").forEach(function (d) {
        var previa = d.getAttribute("data-clase");
        if (previa) d.classList.remove(previa);
        var f = Number(d.getAttribute("data-f"));
        var c = Number(d.getAttribute("data-c"));
        var nueva = fn ? fn([f, c], valores[f][c]) : "";
        if (nueva) { d.classList.add(nueva); d.setAttribute("data-clase", nueva); }
        else d.removeAttribute("data-clase");
      });
    }

    /* ---------- Dedos: f y c ---------- */
    function crearCapa() {
      if (capaDedos) return;
      capaDedos = span("matriz__dedos");
      tabla.appendChild(capaDedos);
      el.classList.add("matriz--con-dedos");
      medirTamano();
    }

    // Dónde va un dedo: su centro respecto de la tabla, extrapolando si se sale
    function posicion(eje, i) {
      var base = tabla.getBoundingClientRect();
      var refs = eje === "fila"
        ? filasEls.map(function (r) { return r.querySelector(".matriz__indice--fila"); })
        : Array.prototype.slice.call(cabecera.querySelectorAll(".matriz__indice--columna"));
      if (!refs.length) return null;
      function centro(r) {
        var b = r.getBoundingClientRect();
        return eje === "fila" ? b.top + b.height / 2 - base.top : b.left + b.width / 2 - base.left;
      }
      if (i >= 0 && i < refs.length) return centro(refs[i]);
      var paso = refs.length > 1 ? centro(refs[1]) - centro(refs[0]) : (eje === "fila" ? refs[0].offsetHeight : refs[0].offsetWidth) + 6;
      return i < 0 ? centro(refs[0]) + i * paso : centro(refs[refs.length - 1]) + (i - refs.length + 1) * paso;
    }

    function ubicarDedos() {
      if (!capaDedos) return;
      ["fila", "columna"].forEach(function (eje) {
        var d = capaDedos.querySelector('[data-eje="' + eje + '"]');
        var dato = dedosActuales[eje];
        if (dato === undefined) { if (d) d.remove(); return; }
        if (!d) {
          d = span("matriz__dedo matriz__dedo--" + eje + (reducir() ? "" : " matriz__dedo--nuevo"));
          d.setAttribute("data-eje", eje);
          capaDedos.appendChild(d);
        }
        d.textContent = dato.nombre;
        var x = posicion(eje, dato.i);
        if (x === null) { d.hidden = true; return; }
        d.hidden = false;
        var n = eje === "fila" ? valores.length : columnasN;
        d.classList.toggle("matriz__dedo--fuera", dato.i < 0 || dato.i >= n);
        if (eje === "fila") d.style.top = x + "px";
        else d.style.left = x + "px";
      });
    }

    function dedos(mapa) {
      crearCapa();
      if (mapa === null) { dedosActuales = {}; ubicarDedos(); return; }
      var nombres = mapa.nombres || {};
      ["fila", "columna"].forEach(function (eje) {
        if (!(eje in mapa)) return;
        if (mapa[eje] === null || mapa[eje] === undefined) { delete dedosActuales[eje]; return; }
        var previo = dedosActuales[eje];
        var nuevo = { i: mapa[eje], nombre: nombres[eje] || (previo && !mapa.nombres ? previo.nombre : nombresDedos[eje]) };
        var d = capaDedos.querySelector('[data-eje="' + eje + '"]');
        if (d && previo && previo.i !== nuevo.i && !reducir()) {
          d.classList.remove("matriz__dedo--salta");
          void d.offsetWidth;
          d.classList.add("matriz__dedo--salta");
        }
        dedosActuales[eje] = nuevo;
      });
      ubicarDedos();
    }

    /* ---------- Totales al margen ---------- */
    function pintarTotales() {
      if (!tabla) return;
      el.classList.toggle("matriz--totales-filas", !!tot.filas);
      el.classList.toggle("matriz--totales-columnas", !!tot.columnas);
      cabecera.querySelector(".matriz__rotulo--total").textContent = tot.filas ? (tot.rotuloFilas || "") : "";
      filaTotales.querySelector(".matriz__rotulo--fila").textContent = tot.columnas ? (tot.rotuloColumnas || "") : "";
      filasEls.forEach(function (r, f) {
        var t = r.querySelector(".matriz__total--fila");
        var v = tot.filas ? tot.filas[f] : "";
        t.textContent = v === undefined || v === null ? "" : String(v);
        t.classList.toggle("matriz__total--vacio", t.textContent === "");
      });
      Array.prototype.forEach.call(filaTotales.querySelectorAll(".matriz__total--columna"), function (t, c) {
        var v = tot.columnas ? tot.columnas[c] : "";
        t.textContent = v === undefined || v === null ? "" : String(v);
        t.classList.toggle("matriz__total--vacio", t.textContent === "");
      });
    }

    function totales(o) {
      if (o === null) tot = { filas: null, columnas: null, rotuloFilas: "", rotuloColumnas: "" };
      else {
        if ("filas" in o) tot.filas = o.filas ? o.filas.slice() : null;
        if ("columnas" in o) tot.columnas = o.columnas ? o.columnas.slice() : null;
        if ("rotuloFilas" in o) tot.rotuloFilas = o.rotuloFilas;
        if ("rotuloColumnas" in o) tot.rotuloColumnas = o.rotuloColumnas;
      }
      pintarTotales();
      medirTamano();
      ubicarDedos();
    }

    function totalEl(eje, i) {
      if (eje === "fila") {
        var f = normal(i, valores.length);
        return f === null ? null : filasEls[f].querySelector(".matriz__total--fila");
      }
      var c = normal(i, columnasN);
      return c === null ? null : filaTotales.querySelectorAll(".matriz__total--columna")[c];
    }

    function total(eje, i, v, origen) {
      var lista = eje === "fila" ? "filas" : "columnas";
      if (!tot[lista]) tot[lista] = (eje === "fila" ? valores : valores[0] || []).map(function () { return ""; });
      var k = normal(i, eje === "fila" ? valores.length : columnasN);
      if (k === null) return null;
      tot[lista][k] = v;
      pintarTotales();
      var t = totalEl(eje, k);
      llegar(t, String(v), origen, "matriz__total--pulso");
      return t;
    }

    function marcarTotal(eje, i) {
      el.querySelectorAll(".matriz__total--marcado").forEach(function (t) { t.classList.remove("matriz__total--marcado"); });
      if (i === null || i === undefined) return null;
      var t = totalEl(eje, i);
      if (t) t.classList.add("matriz__total--marcado");
      return t;
    }

    /* ---------- Animaciones ---------- */
    function fantasmaQueSale(elemento) {
      if (reducir() || !document.body.animate || !elemento.offsetParent) return;
      var r = elemento.getBoundingClientRect();
      var copia = elemento.cloneNode(true);
      copia.classList.add("matriz__sale");
      copia.style.left = r.left + "px";
      copia.style.top = r.top + "px";
      copia.style.width = r.width + "px";
      copia.style.height = r.height + "px";
      // La copia no hereda las variables del contenedor: se las pasamos
      copia.style.setProperty("--c", getComputedStyle(el).getPropertyValue("--c"));
      copia.style.setProperty("--matriz-letra", getComputedStyle(el).getPropertyValue("--matriz-letra"));
      document.body.appendChild(copia);
      var a = copia.animate([
        { transform: "none", opacity: 1 },
        { transform: "translateY(-2.2rem) rotate(-8deg) scale(0.9)", opacity: 0 }
      ], { duration: 480, easing: "ease-in" });
      a.onfinish = a.oncancel = function () { copia.remove(); };
    }

    function llegar(destino, t, origen, clasePulso) {
      clasePulso = clasePulso || "matriz__valor--pulso";
      function pulso() {
        destino.classList.remove(clasePulso);
        void destino.offsetWidth;
        destino.classList.add(clasePulso);
      }
      var clase = "matriz__vuelo";
      if (window.Codigo && origen) Codigo.volar(origen, destino, t, clase, pulso);
      else if (window.Codigo && origen !== false) Codigo.volarDesdeLinea(el, destino, t, clase, pulso);
      else pulso();
    }

    function cambiar(i, v, origen) {
      quitarMarca();
      var d = celda(i);
      if (!d) return null;
      var viejo = d.querySelector(".matriz__valor");
      fantasmaQueSale(viejo);
      var nuevo = nuevoValor(v);
      d.replaceChild(nuevo, viejo);
      var f = normal(i[0], valores.length);
      valores[f][normal(i[1], valores[f].length)] = v;
      var antes = el.style.getPropertyValue("--matriz-letra");
      medirTamano();
      if (antes !== el.style.getPropertyValue("--matriz-letra")) ubicarDedos();
      llegar(nuevo, texto(v, comillas), origen);
      return d;
    }

    function agregarFila(fila, origen) {
      quitarMarca();
      var nueva = fila.slice();
      if (!valores.length || nueva.length !== columnasN) {
        // Primera fila (o de otro largo): se arma la tabla otra vez, con la fila nueva
        var todos = copiar(valores);
        todos.push(nueva);
        pintar(todos);
      } else {
        valores.push(nueva);
        var r = nuevaFila(valores.length - 1, nueva);
        tabla.insertBefore(r, filaTotales);
        filasEls.push(r);
        el.classList.remove("matriz--vacia");
        pintarTotales();
      }
      var el2 = filasEls[filasEls.length - 1];
      if (!reducir()) {
        el2.classList.add("matriz__fila--entra");
        setTimeout(function () { el2.classList.remove("matriz__fila--entra"); }, 600);
      }
      if (origen) {
        el2.querySelectorAll(".matriz__celda > .matriz__valor").forEach(function (v, c) {
          var o = typeof origen === "function" ? origen(c) : origen;
          if (o && window.Codigo) Codigo.volar(o, v, texto(nueva[c], comillas), "matriz__vuelo", null);
        });
      }
      ubicarDedos();
      return el2;
    }

    function quitarFila(f) {
      quitarMarca();
      var k = normal(f, valores.length);
      if (k === null) return null;
      var r = filasEls[k];
      var rect = r.getBoundingClientRect();
      fantasmaQueSale(r);
      var todos = copiar(valores);
      todos.splice(k, 1);
      var totF = tot.filas;
      if (totF) { totF = totF.slice(); totF.splice(k, 1); tot.filas = totF; }
      pintar(todos);
      return rect;
    }

    pintar(valoresIniciales || []);
    if (opciones.reservarDedos) crearCapa();
    // El tamaño depende del ancho: se vuelve a medir cuando la matriz aparece o cambia de ancho
    if (window.ResizeObserver) {
      var anchoPrevio = 0;
      new ResizeObserver(function () {
        if (el.clientWidth === anchoPrevio) return;
        anchoPrevio = el.clientWidth;
        medirTamano();
        ubicarDedos();
      }).observe(el);
    }

    return {
      el: el,
      valores: pintar,
      get matriz() { return copiar(valores); },
      get filas() { return valores.length; },
      get columnas() { return valores.length ? valores[0].length : 0; },
      celda: celda,
      valor: function (i) {
        var d = celda(i);
        return d ? d.querySelector(".matriz__valor") : null;
      },
      filaEl: function (f) {
        var k = normal(f, valores.length);
        return k === null ? null : filasEls[k];
      },
      marcar: marcar,
      marcarFila: marcarFila,
      marcarColumna: marcarColumna,
      clases: clases,
      dedos: dedos,
      cambiar: cambiar,
      agregarFila: agregarFila,
      quitarFila: quitarFila,
      totales: totales,
      total: total,
      totalEl: totalEl,
      marcarTotal: marcarTotal
    };
  }

  window.Matriz = { crear: crear, python: python, texto: texto, codigo: codigo };
})();
