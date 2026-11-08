/* traza.js — ejecuta un bloque de código "línea a línea" con botones.
   Necesita codigo.js.

   var t = Traza.crear({
     codigo: preEl,              bloque .codigo con sus .linea
     explicacion: el,            (opcional) qué está pasando, admite HTML
     consola: el,                (opcional) salida acumulada de print()
     ejecutar: btn,              "Ejecutar línea ▸": avanza un paso
     reproducir: btn,            (opcional) "▶ Ejecutar todo": avanza solo; se convierte en "⏸ Pausa"
     saltar: btn,                (opcional) "Siguiente salto ▸▸": avanza deprisa hasta el siguiente
                                 paso marcado con parada: true (p. ej. una llamada o una vuelta)
     reiniciar: btn,             (opcional) se oculta hasta que termina la primera ejecución
     generar: function () {      devuelve la lista de pasos que ejecuta Python
       return [{ linea: 0, texto: "…", salida: "…", estado: { … } }, …];
     },                          (opcional) flecha: true / false en un paso fuerza o evita la
                                 flecha de salto desde la línea anterior; si no se indica, se
                                 dibuja cuando la ejecución vuelve arriba (otra vuelta, una llamada).
                                 fase: "ida" / "vuelta" (recursión) colorea la flecha del paso:
                                 a la ida (una llamada) o a la vuelta (volver de ella); en una
                                 consola con la clase consola--fases, también lo que imprime.
                                 error: true pone la salida del paso en rojo (un mensaje de error),
                                 también mientras vuela a la consola
     alPaso: function (paso, i) { … },   pinta el estado (cajas, chips…)
     pila: p,                             (opcional) la Pila.crear que pinta paso.estado: su código
                                          y su rótulo reservan el alto que alcanzan en la traza
     alReiniciar: function () { … },
     alTerminar: function () { … },
     intervalo: 800,                      ms entre pasos al reproducir
     intervaloSaltar: 300,                ms entre pasos con el botón saltar
     repetible: false                     true: al terminar, los botones siguen activos y
                                          vuelven a ejecutar el código sin borrar la consola
   });

   La explicación reserva el alto del texto más largo de la traza, para que los botones
   de debajo no salten de un paso a otro. El texto inicial («Toca «Ejecutar línea»…») se
   acorta si no cabe en ese alto, en vez de reservar un renglón más en todos los pasos.

   t.reiniciar()   vuelve a generar la traza y empieza desde cero
   t.reproducir()  empieza a avanzar solo (como pulsar el botón de reproducir)
   t.detener()     pausa la reproducción
   t.cancelar()    (repetible) corta la ejecución en curso; la siguiente empieza de nuevo
*/
(function () {
  "use strict";

  function crear(o) {
    var pasos = [];
    var i = 0;
    var previa = null;      // línea del paso anterior, para la flecha de salto
    var timer = null;
    var intervalo = o.intervalo || 800;
    var textoReproducir = o.reproducir ? o.reproducir.textContent : "";
    var nombreReproducir = textoReproducir.replace(/^[^\p{L}]+/u, "");
    // El texto inicial, de más largo a más corto: se muestra el más largo que quepa en el alto
    // de los pasos, así no reserva un renglón de más en todos los pasos de la traza
    var inicios = o.reproducir
      ? ["Toca «Ejecutar línea» para ir paso a paso, o «" + nombreReproducir + "» para verlo seguido.",
        "Toca «Ejecutar línea» o «" + nombreReproducir + "».",
        "Toca «Ejecutar línea»."]
      : ["Toca «Ejecutar línea» para empezar.", "Toca «Ejecutar línea»."];
    var inicio = inicios[0];
    var enInicio = true;    // la explicación muestra el texto inicial

    function terminado() { return i >= pasos.length; }

    function reservar() {
      if (o.pila) o.pila.reservar(pasos.map(function (p) { return p.estado; }));
      if (!o.explicacion) return;
      // En una traza repetible los pasos se generan al ejecutar: el texto inicial largo sí
      // cuenta, para que el alto no cambie al empezar. En las demás cuenta el más corto.
      var textos = [o.repetible || !pasos.length ? inicios[0] : inicios[inicios.length - 1]]
        .concat(pasos.map(function (p) { return p.texto || ""; }));
      Codigo.reservarAlto(o.explicacion, textos, function (copia, texto) { copia.innerHTML = texto; }, function (alto, medir) {
        inicio = inicios[inicios.length - 1];
        for (var k = 0; k < inicios.length - 1; k++) {
          if (medir(inicios[k]) <= alto) { inicio = inicios[k]; break; }
        }
        // Solo si muestra uno de los textos iniciales (la lección puede haber puesto el suyo)
        if (enInicio && inicios.indexOf(o.explicacion.textContent) !== -1) o.explicacion.textContent = inicio;
      });
    }

    function detener() {
      if (timer) clearInterval(timer);
      timer = null;
      if (o.reproducir) {
        o.reproducir.textContent = textoReproducir;
        o.reproducir.setAttribute("aria-pressed", "false");
      }
    }

    // En modo repetible la traza se genera al empezar cada ejecución,
    // así recoge los valores que el alumno haya cambiado entre medias.
    function cancelar() {
      detener();
      pasos = o.repetible ? [] : o.generar();
      i = 0;
      previa = null;
      Codigo.limpiar(o.codigo);
      enInicio = true;
      if (o.explicacion) o.explicacion.textContent = inicio;
      reservar();
    }

    function reiniciar() {
      cancelar();
      if (o.consola) Codigo.consola(o.consola, []);
      o.ejecutar.disabled = false;
      if (o.reproducir) o.reproducir.disabled = false;
      if (o.saltar) o.saltar.disabled = false;
      if (o.reiniciar) o.reiniciar.hidden = true;
      if (o.alReiniciar) o.alReiniciar();
    }

    function avanzar() {
      if (terminado()) {
        if (!o.repetible) return;
        pasos = o.generar();
        i = 0;
        previa = null;
        reservar();
      }
      var paso = pasos[i];
      i++;
      Codigo.marcar(o.codigo, { activas: [paso.linea] });
      var desde = previa;
      previa = paso.linea;
      enInicio = false;
      if (o.explicacion) o.explicacion.innerHTML = paso.texto;
      if (o.consola && paso.salida !== undefined) {
        // Lo que imprime print viaja de la línea a la consola
        var texto = String(paso.salida);
        Codigo.agregar(o.consola, texto);
        if (paso.fase && o.consola.classList.contains("consola--fases")) o.consola.lastElementChild.classList.add("consola__linea--" + paso.fase);
        if (paso.error) o.consola.lastElementChild.classList.add("consola__linea--error");
        Codigo.volarDesdeLinea(o.codigo, o.consola.lastElementChild, texto, "vuelo--salida");
      }
      if (o.alPaso) o.alPaso(paso, i - 1);
      // La flecha, después de pintar el paso: así mide las líneas como quedan (p. ej. sin la
      // ficha de la llamada que retoma)
      var salta = paso.flecha !== undefined ? paso.flecha : desde !== null && paso.linea < desde;
      if (salta && desde !== null) Codigo.salto(o.codigo, desde, paso.linea, paso.fase);
      else Codigo.quitarSalto(o.codigo);
      if (terminado()) {
        detener();
        if (o.reiniciar) o.reiniciar.hidden = false;
        if (!o.repetible) {
          o.ejecutar.disabled = true;
          if (o.reproducir) o.reproducir.disabled = true;
          if (o.saltar) o.saltar.disabled = true;
          if (o.reiniciar) o.reiniciar.focus();
        }
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

    // Pasos seguidos, deprisa, hasta uno con parada (incluido) o hasta el final
    function saltar() {
      detener();
      function uno() {
        if (!terminado()) avanzar();
        if (terminado() || pasos[i - 1].parada) detener();
      }
      uno();
      if (!terminado() && !pasos[i - 1].parada) timer = setInterval(uno, o.intervaloSaltar || 300);
    }

    function reproducir() {
      if (o.reproducir && !timer && !o.reproducir.disabled) alternar();
    }

    o.ejecutar.addEventListener("click", function () { detener(); avanzar(); });
    if (o.reproducir) o.reproducir.addEventListener("click", alternar);
    if (o.saltar) o.saltar.addEventListener("click", saltar);
    // El botón se oculta al reiniciar: el foco pasa a "Ejecutar línea"
    if (o.reiniciar) o.reiniciar.addEventListener("click", function () {
      reiniciar();
      o.ejecutar.focus();
    });

    reiniciar();
    return { reiniciar: reiniciar, reproducir: reproducir, detener: detener, cancelar: cancelar };
  }

  window.Traza = { crear: crear };
})();
