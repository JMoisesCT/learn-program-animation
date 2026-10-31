/* python.js — escribe código Python coloreado en un bloque .codigo.

   Python.escribir(pre, ["edad = int(input())", "print(edad + 1)"], { huecos: ["h1"] })
       llena el <pre class="codigo"> con una .linea por línea (respeta la sangría).
       Un ▢ en el código es un espacio en blanco para completar: se ve como «?» y toma,
       en orden, los ids de huecos (para poner ahí lo que elija el alumno).
   Python.colorear("print(nombre)")
       el HTML coloreado de una línea (tk-palabra, tk-numero, tk-texto, tk-variable,
       tk-funcion, tk-comentario y tk-excepcion para ValueError, TypeError…).
   Python.linea(pre, i)
       el elemento .linea número i (desde 0).

   Los textos pueden ir con comillas dobles o simples ('Ana', f"Hola {n}").
   Reemplaza los coloreadores que cada lección traía en su página.
*/
(function () {
  "use strict";

  var PALABRAS = /^(def|return|if|elif|else|for|in|while|True|False|None|break|continue|and|or|not|import|from|as|try|except|finally|pass|del|is|raise|global|lambda|with)$/;
  var EXCEPCION = /^(\w*Error|Exception|KeyboardInterrupt|Traceback)$/;

  var TOKEN = /([fF]?"(?:[^"\\]|\\.)*"?|[fF]?'(?:[^'\\]|\\.)*'?)|(#.*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_áéíóúñÁÉÍÓÚÑ]\w*)(\s*\()?|(▢)/g;

  function escapar(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function span(clase, texto) { return '<span class="' + clase + '">' + escapar(texto) + "</span>"; }

  function colorear(linea, huecos) {
    var html = "";
    var desde = 0;
    var m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(linea)) !== null) {
      html += escapar(linea.slice(desde, m.index));
      desde = TOKEN.lastIndex;
      if (m[1]) html += span("tk-texto", m[1]);
      else if (m[2]) html += span("tk-comentario", m[2]);
      else if (m[3]) html += span("tk-numero", m[3]);
      else if (m[6]) {
        var id = huecos && huecos.length ? huecos.shift() : null;
        html += '<span class="hueco"' + (id ? ' id="' + id + '"' : "") + ">?</span>";
      } else {
        var nombre = m[4];
        var par = m[5] || "";
        if (PALABRAS.test(nombre)) html += span("tk-palabra", nombre) + escapar(par);
        else if (EXCEPCION.test(nombre)) html += span("tk-excepcion", nombre) + escapar(par);
        else if (par) html += span("tk-funcion", nombre) + escapar(par);
        else html += span("tk-variable", nombre);
      }
    }
    return html + escapar(linea.slice(desde));
  }

  function escribir(pre, lineas, opciones) {
    var huecos = opciones && opciones.huecos ? opciones.huecos.slice() : null;
    pre.innerHTML = "<code>" + lineas.map(function (l) {
      return '<span class="linea">' + (colorear(l, huecos) || " ") + "</span>";
    }).join("") + "</code>";
  }

  function linea(pre, i) { return pre.querySelectorAll(".linea")[i] || null; }

  window.Python = { escribir: escribir, colorear: colorear, linea: linea, escapar: escapar };
})();
