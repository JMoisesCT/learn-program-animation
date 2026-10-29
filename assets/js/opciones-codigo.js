/* opciones-codigo.js — opciones de respuesta que son trozos de código Python.

   Al cargar, en cada grupo .opciones--codigo (y en cada .version__codigo):
     - colorea el código como en los bloques oscuros, con colores para fondo claro;
     - si las opciones tienen varias líneas, atenúa las que son iguales en todas: lo que
       queda con color es lo que cambia. (Se marcan igual en todas las opciones, para
       no delatar cuál es la buena.)
     - si todas tienen 3 líneas o más y ninguna es larga, marca el grupo con
       .opciones--bloques: en escritorio van de dos en dos.

   No cambia el texto (textContent sigue igual), así que copiar una opción al
   hueco del código o compararla sigue funcionando. Las opciones que ya traen
   marcas propias (elementos dentro) se dejan como están.
*/
(function () {
  "use strict";

  var PALABRAS = /^(def|return|if|elif|else|for|in|while|True|False|None|break|continue|and|or|not|import)$/;
  var PIEZA = /(f?"[^"\n]*"?)|(#.*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(\s*\()?/g;

  function escapar(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function tk(clase, texto) { return '<b class="tk-' + clase + '">' + escapar(texto) + "</b>"; }

  function colorear(linea) {
    var html = "";
    var desde = 0;
    linea.replace(PIEZA, function (todo, texto, comentario, numero, nombre, parentesis, pos) {
      html += escapar(linea.slice(desde, pos));
      desde = pos + todo.length;
      if (texto) html += tk("texto", texto);
      else if (comentario) html += tk("comentario", comentario);
      else if (numero) html += tk("numero", numero);
      else if (PALABRAS.test(nombre)) html += tk("palabra", nombre) + escapar(parentesis || "");
      else if (parentesis) html += tk("funcion", nombre) + escapar(parentesis);
      else html += escapar(nombre);
      return todo;
    });
    return html + escapar(linea.slice(desde));
  }

  function preparar(grupo, piezas) {
    piezas = piezas.filter(function (el) { return !el.children.length; });
    if (!piezas.length) return;
    var lineas = piezas.map(function (el) { return el.textContent.split("\n"); });

    // En cuántas opciones está cada línea (igual y con la misma sangría)
    var cuantas = {};
    lineas.forEach(function (ls) {
      ls.filter(function (l, i) { return ls.indexOf(l) === i; }).forEach(function (l) {
        cuantas[l] = (cuantas[l] || 0) + 1;
      });
    });
    var esComun = function (l) { return l.trim() && cuantas[l] === piezas.length; };
    var marcar = piezas.length > 1 &&
      lineas.every(function (ls) { return ls.length > 1; }) &&
      lineas[0].some(esComun);

    piezas.forEach(function (el, k) {
      el.innerHTML = lineas[k].map(function (l) {
        var clase = "op-linea";
        if (marcar && l.trim()) clase += esComun(l) ? " op-linea--comun" : " op-linea--cambia";
        return '<code class="' + clase + '">' + colorear(l) + "</code>";
      }).join("\n");
    });

    // Bloques de varias líneas cortas: en escritorio caben de dos en dos (base.css)
    var bloques = lineas.every(function (ls) { return ls.length >= 3; }) &&
      lineas.every(function (ls) { return ls.every(function (l) { return l.length <= 40; }); });
    if (bloques && grupo.classList.contains("opciones--codigo")) grupo.classList.add("opciones--bloques");

    var antes = grupo.previousElementSibling;
    if (marcar && !(antes && antes.classList.contains("op-leyenda"))) {
      var leyenda = document.createElement("p");
      leyenda.className = "op-leyenda";
      leyenda.innerHTML = "En gris, lo que es igual en todas las opciones. Fíjate en las líneas con <b>raya</b>: ahí cambian.";
      grupo.parentNode.insertBefore(leyenda, grupo);
    }
  }

  document.querySelectorAll(".opciones--codigo").forEach(function (grupo) {
    var piezas = Array.prototype.slice.call(grupo.querySelectorAll(".opcion > span"));
    var versiones = Array.prototype.slice.call(grupo.querySelectorAll(".version__codigo"));
    preparar(grupo, versiones.length ? versiones : piezas);
  });
  document.querySelectorAll(".opciones:not(.opciones--codigo)").forEach(function (grupo) {
    var versiones = Array.prototype.slice.call(grupo.querySelectorAll(".version__codigo"));
    if (versiones.length) preparar(grupo, versiones);
  });
})();
