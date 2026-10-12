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

  function limpiar(pre) { marcar(pre, {}); }

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

  window.Codigo = { marcar: marcar, limpiar: limpiar, consola: consola, agregar: agregar, booleano: booleano };
})();
