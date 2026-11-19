/* idioma.js — el curso en español (la raíz) y el curso en inglés (en/).

   Se carga en el <head> de las dos portadas:
     <script src="assets/js/idioma.js"></script>
     <script>Idioma.redirigir("en/index.html");</script>   (solo en la portada en español)

   - La primera vez que alguien abre la portada en español, si el navegador prefiere otro
     idioma, va a la portada en inglés (que es el curso «general»). El primer idioma de
     navigator.languages que sea español o inglés decide; si no hay ninguno, inglés.
   - Los enlaces con data-idioma="es" | "en" (el selector «Español · English») guardan la
     elección en localStorage: desde entonces no se vuelve a redirigir.
   Si el navegador bloquea el almacenamiento, se redirige cada vez según el navegador, y
   el enlace del selector sigue funcionando. */
(function () {
  "use strict";

  var CLAVE = "lpa:idioma";

  function leer() {
    try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
  }

  function guardar(v) {
    try { localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento */ }
  }

  function delNavegador() {
    var lista = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < lista.length; i++) {
      if (/^es/i.test(lista[i])) return "es";
      if (/^en/i.test(lista[i])) return "en";
    }
    return "en";
  }

  window.Idioma = {
    elegido: leer,
    delNavegador: delNavegador,
    /* Desde la portada en español: va al curso en inglés si nadie eligió y el navegador no prefiere español */
    redirigir: function (destino) {
      var elegido = leer();
      if (elegido === "es") return;
      if (elegido === "en" || delNavegador() === "en") window.location.replace(destino);
    }
  };

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-idioma]");
    if (a) guardar(a.getAttribute("data-idioma"));
  });
})();
