/* particion.js — una lista que se parte en pedazos, piso por piso (quicksort, mergesort).
   Componente .particion de base.css. Necesita codigo.js solo si se hacen volar valores.

   La lista original ocupa n columnas. Cada pedazo («trozo») es una fila corta de casilleros
   que va en un piso y ocupa las columnas desde..desde+ancho: así cada valor queda bajo el
   lugar de la lista de donde salió, y los pisos de abajo muestran cómo se partió.

     var p = Particion.crear(el, {
       n: 8,                     columnas (lo que mide la lista original)
       etiqueta: "Cómo se parte [38, 27, 43, 3]",   aria-label del dibujo
       max: 2.6                  (opcional) tamaño máximo de un casillero, en rem
     });

     p.trozo({
       id: "izq",                nombre del trozo (para cambiarlo después)
       piso: 1,                  fila, desde 0 (arriba)
       desde: 0,                 primera columna
       valores: [38, 27],        lo que guarda; [] se ve como «[ ]»
       ancho: 2,                 (opcional) columnas que ocupa; por defecto, valores.length
                                 (mínimo 1). Un trozo vacío necesita su propia columna
       padre: "todo",            (opcional) id del trozo del que sale, o [id, id] si junta
                                 dos (la mezcla de mergesort): una raya los une
       rotulo: "izquierda",      (opcional) píldora debajo
       clase: "particion__trozo--listo"   (opcional) clase extra
     });                         aparece bajando desde arriba; devuelve el elemento

   p.valores(id, [...])          cambia lo que guarda (sin animación; para que un valor llegue
                                 volando: p.celda(id, i) es el destino de Codigo.volar)
   p.celda(id, i)                el casillero i del trozo (origen o destino de un vuelo)
   p.clases(id, fn)              fn(i, valor) da una clase extra para cada casillero:
                                 "particion__celda--pivote", "--menor", "--mayor", "--tomada",
                                 "--marcada", "--apagada", o ""
   p.estado(id, e)               "activo" (el que trabaja ahora: borde verde), "espera"
                                 (punteado, como una tarjeta pausada), "listo" (ya ordenado:
                                 verde), "apagado" o null
   p.rotulo(id, texto)           cambia la píldora (null la quita)
   p.quitar(id)                  borra un trozo (y sus rayas)
   p.vaciar()                    borra todo
   p.trozos                      { id: elemento }
   p.el                          el contenedor .particion

   Las rayas se recalculan solas al cambiar el tamaño. Sin movimiento, todo aparece de golpe.
*/
(function () {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";

  function span(clase, contenido) {
    var s = document.createElement("span");
    s.className = clase;
    if (contenido !== undefined) s.textContent = contenido;
    return s;
  }

  function texto(v) {
    if (typeof v === "string") return '"' + v + '"';
    return String(v);
  }

  function crear(el, opciones) {
    opciones = opciones || {};
    var n = Math.max(1, opciones.n || 8);
    var trozos = {};
    var datos = {};

    el.classList.add("particion");
    el.textContent = "";
    el.style.setProperty("--n", n);
    if (opciones.max) el.style.setProperty("--particion-max", opciones.max + "rem");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", opciones.etiqueta || "Una lista que se parte en pedazos");

    var rejilla = el.appendChild(span("particion__rejilla"));
    var dibujo = document.createElementNS(SVG, "svg");
    dibujo.setAttribute("class", "particion__rayas");
    dibujo.setAttribute("aria-hidden", "true");
    el.insertBefore(dibujo, rejilla);

    function pintarCeldas(t, valores) {
      var fila = t.querySelector(".particion__celdas");
      fila.textContent = "";
      t.classList.toggle("particion__trozo--vacio", !valores.length);
      if (!valores.length) {
        fila.appendChild(span("particion__vacio", "[ ]"));
        return;
      }
      valores.forEach(function (v) {
        fila.appendChild(span("particion__celda" + (typeof v === "string" ? " particion__celda--texto" : ""), texto(v)));
      });
    }

    function ponerRotulo(t, r) {
      var viejo = t.querySelector(".particion__rotulo");
      if (viejo) viejo.remove();
      if (r === null || r === undefined || r === "") return;
      t.appendChild(span("particion__rotulo", String(r)));
    }

    function trozo(d) {
      if (trozos[d.id]) quitar(d.id);
      var valores = (d.valores || []).slice();
      var ancho = Math.max(1, d.ancho || valores.length);
      var t = span("particion__trozo" + (d.clase ? " " + d.clase : ""));
      t.style.gridRow = String((d.piso || 0) + 1);
      t.style.gridColumn = ((d.desde || 0) + 1) + " / span " + ancho;
      t.appendChild(span("particion__celdas"));
      pintarCeldas(t, valores);
      ponerRotulo(t, d.rotulo);
      t.classList.add("particion__trozo--entra");
      t.addEventListener("animationend", function fin() {
        t.classList.remove("particion__trozo--entra");
        t.removeEventListener("animationend", fin);
      });
      rejilla.appendChild(t);
      trozos[d.id] = t;
      datos[d.id] = { valores: valores, padre: d.padre === undefined ? null : d.padre };
      rayas();
      return t;
    }

    function valores(id, v) {
      if (!trozos[id]) return;
      datos[id].valores = v.slice();
      pintarCeldas(trozos[id], datos[id].valores);
      rayas();
    }

    function celda(id, i) {
      if (!trozos[id]) return null;
      return trozos[id].querySelectorAll(".particion__celda")[i] || null;
    }

    function clases(id, fn) {
      if (!trozos[id]) return;
      trozos[id].querySelectorAll(".particion__celda").forEach(function (c, i) {
        var previa = c.getAttribute("data-clase");
        if (previa) c.classList.remove(previa);
        var nueva = fn ? fn(i, datos[id].valores[i]) : "";
        if (nueva) { c.classList.add(nueva); c.setAttribute("data-clase", nueva); }
        else c.removeAttribute("data-clase");
      });
    }

    var ESTADOS = ["activo", "espera", "listo", "apagado"];
    function estado(id, e) {
      if (!trozos[id]) return;
      ESTADOS.forEach(function (x) { trozos[id].classList.toggle("particion__trozo--" + x, x === e); });
      rayas();
    }

    function rotulo(id, r) {
      if (!trozos[id]) return;
      ponerRotulo(trozos[id], r);
      rayas();
    }

    function quitar(id) {
      if (!trozos[id]) return;
      trozos[id].remove();
      delete trozos[id];
      delete datos[id];
      rayas();
    }

    function vaciar() {
      Object.keys(trozos).forEach(function (id) { trozos[id].remove(); });
      trozos = {};
      datos = {};
      api.trozos = trozos;
      rayas();
    }

    /* Una raya de la parte de abajo del padre (sin la píldora) a la de arriba del hijo.
       Se mide con offsetLeft/offsetTop: no cambian mientras el trozo baja animado. */
    function caja(t) {
      // El trozo va posicionado (base.css): las celdas se miden desde él, y él desde la rejilla
      var c = t.querySelector(".particion__celdas");
      var x0 = rejilla.offsetLeft + t.offsetLeft, y0 = rejilla.offsetTop + t.offsetTop;
      return {
        x: x0 + c.offsetLeft + c.offsetWidth / 2,
        arriba: y0 + c.offsetTop,
        abajo: y0 + c.offsetTop + c.offsetHeight
      };
    }

    function rayas() {
      dibujo.textContent = "";
      dibujo.setAttribute("width", el.clientWidth);
      dibujo.setAttribute("height", el.clientHeight);
      Object.keys(datos).forEach(function (id) {
        var padres = datos[id].padre;
        if (padres === null) return;
        if (!Array.isArray(padres)) padres = [padres];
        var hijo = caja(trozos[id]);
        padres.forEach(function (pid) {
          if (!trozos[pid]) return;
          var pa = caja(trozos[pid]);
          // El padre puede estar abajo (la mezcla sube) o arriba (la partición baja)
          var y1 = pa.abajo <= hijo.arriba ? pa.abajo : pa.arriba;
          var y2 = pa.abajo <= hijo.arriba ? hijo.arriba : hijo.abajo;
          var raya = document.createElementNS(SVG, "path");
          raya.setAttribute("d", "M" + pa.x + " " + (y1 + 2) + " L" + hijo.x + " " + (y2 - 2));
          raya.setAttribute("class", "particion__raya" + (trozos[id].classList.contains("particion__trozo--apagado") ? " particion__raya--apagada" : ""));
          dibujo.appendChild(raya);
        });
      });
    }

    if (window.ResizeObserver) new ResizeObserver(rayas).observe(el);

    var api = {
      el: el,
      trozos: trozos,
      trozo: trozo,
      valores: valores,
      celda: celda,
      clases: clases,
      estado: estado,
      rotulo: rotulo,
      quitar: quitar,
      vaciar: vaciar,
      rayas: rayas
    };
    return api;
  }

  window.Particion = { crear: crear };
})();
