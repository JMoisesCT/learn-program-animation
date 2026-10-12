/* traza.js — ejecuta un bloque de código "línea a línea" con botones.
   Necesita codigo.js.

   var t = Traza.crear({
     codigo: preEl,              bloque .codigo con sus .linea
     explicacion: el,            (opcional) qué está pasando, admite HTML
     consola: el,                (opcional) salida acumulada de print()
     ejecutar: btn,              "Ejecutar línea ▸": avanza un paso
     reproducir: btn,            (opcional) avanza solo; se convierte en "⏸ Pausa"
     reiniciar: btn,             (opcional)
     generar: function () {      devuelve la lista de pasos que ejecuta Python
       return [{ linea: 0, texto: "…", salida: "…", estado: { … } }, …];
     },
     alPaso: function (paso, i) { … },   pinta el estado (cajas, chips…)
     alReiniciar: function () { … },
     alTerminar: function () { … },
     intervalo: 800                       ms entre pasos al reproducir
   });

   t.reiniciar()   vuelve a generar la traza y empieza desde cero
   t.detener()     pausa la reproducción
*/
(function () {
  "use strict";

  var INICIO = "Pulsa «Ejecutar línea» para empezar.";

  function crear(o) {
    var pasos = [];
    var i = 0;
    var timer = null;
    var intervalo = o.intervalo || 800;
    var textoReproducir = o.reproducir ? o.reproducir.textContent : "";

    function terminado() { return i >= pasos.length; }

    function detener() {
      if (timer) clearInterval(timer);
      timer = null;
      if (o.reproducir) {
        o.reproducir.textContent = textoReproducir;
        o.reproducir.setAttribute("aria-pressed", "false");
      }
    }

    function reiniciar() {
      detener();
      pasos = o.generar();
      i = 0;
      Codigo.limpiar(o.codigo);
      if (o.consola) Codigo.consola(o.consola, []);
      if (o.explicacion) o.explicacion.textContent = INICIO;
      o.ejecutar.disabled = false;
      if (o.reproducir) o.reproducir.disabled = false;
      if (o.alReiniciar) o.alReiniciar();
    }

    function avanzar() {
      if (terminado()) return;
      var paso = pasos[i];
      i++;
      Codigo.marcar(o.codigo, { activas: [paso.linea] });
      if (o.explicacion) o.explicacion.innerHTML = paso.texto;
      if (o.consola && paso.salida !== undefined) Codigo.agregar(o.consola, String(paso.salida));
      if (o.alPaso) o.alPaso(paso, i - 1);
      if (terminado()) {
        detener();
        o.ejecutar.disabled = true;
        if (o.reproducir) o.reproducir.disabled = true;
        if (o.reiniciar) o.reiniciar.focus();
        if (o.alTerminar) o.alTerminar();
      }
    }

    function alternar() {
      if (timer) { detener(); return; }
      o.reproducir.textContent = "⏸ Pausa";
      o.reproducir.setAttribute("aria-pressed", "true");
      avanzar();
      if (!terminado()) timer = setInterval(avanzar, intervalo);
    }

    o.ejecutar.addEventListener("click", function () { detener(); avanzar(); });
    if (o.reproducir) o.reproducir.addEventListener("click", alternar);
    if (o.reiniciar) o.reiniciar.addEventListener("click", reiniciar);

    reiniciar();
    return { reiniciar: reiniciar, detener: detener };
  }

  window.Traza = { crear: crear };
})();
