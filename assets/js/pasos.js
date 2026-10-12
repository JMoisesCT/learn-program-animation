/* pasos.js — motor de pasos de una lección.

   Marcado esperado (ver lecciones/variables/index.html):

     <div class="leccion" data-leccion="variables">
       <header class="leccion-cabecera"> … .barra-progreso, .leccion-cabecera__contador … </header>
       <main class="leccion-pasos">
         <section class="paso" id="…">                 paso libre: se puede continuar
         <section class="paso" id="…" data-requiere>   hay que interactuar antes de continuar
         <section class="paso" id="…" data-comprobar>  el botón principal dice "Comprobar"
       </main>
       <footer class="leccion-pie"> [data-accion="atras"] [data-accion="continuar"] </footer>
     </div>

   Uso:

     Pasos.iniciar({
       salida: "../../index.html",
       alEntrar:  { "id-del-paso": function (paso, leccion, info) { … } },
       comprobar: { "id-del-paso": function (paso, leccion) { return true / false; } }
     });

   API `leccion` que reciben los callbacks:
     leccion.desbloquear()              habilita "Continuar" en el paso actual
     leccion.listoParaComprobar(bool)   habilita / deshabilita "Comprobar"
     leccion.siguiente(), leccion.anterior()
*/
(function () {
  "use strict";

  var reducirMovimiento = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function iniciar(opciones) {
    opciones = opciones || {};
    var alEntrar = opciones.alEntrar || {};
    var comprobar = opciones.comprobar || {};

    var raiz = document.querySelector(".leccion");
    var id = raiz.getAttribute("data-leccion");
    var pasos = Array.prototype.slice.call(raiz.querySelectorAll(".paso"));
    var total = pasos.length;
    var barra = raiz.querySelector(".barra-progreso");
    var relleno = raiz.querySelector(".barra-progreso__relleno");
    var contador = raiz.querySelector(".leccion-cabecera__contador");
    var btnAtras = raiz.querySelector('[data-accion="atras"]');
    var btnPrincipal = raiz.querySelector('[data-accion="continuar"]');
    var salida = opciones.salida || raiz.querySelector(".leccion-cabecera__cerrar").getAttribute("href");

    var desbloqueados = {};   // índice -> true
    var visitados = {};       // índice -> true
    var listo = false;        // ¿se puede pulsar "Comprobar"?
    var actual = -1;

    // Retomar donde se quedó el alumno
    var guardado = window.Progreso ? Progreso.obtener(id) : null;
    var inicio = 0;
    if (guardado) {
      var maximo = guardado.completada ? total : Math.min(guardado.maximo || 0, total - 1);
      for (var i = 0; i < maximo; i++) desbloqueados[i] = true;
      if (!guardado.completada) inicio = Math.min(guardado.paso || 0, total - 1);
    }

    var leccion = {
      desbloquear: function () {
        desbloqueados[actual] = true;
        actualizarBotones();
      },
      listoParaComprobar: function (valor) {
        listo = !!valor;
        actualizarBotones();
      },
      siguiente: function () { ir(actual + 1); },
      anterior: function () { ir(actual - 1); },
      get indice() { return actual; }
    };

    function necesitaInteraccion(i) {
      var p = pasos[i];
      return (p.hasAttribute("data-requiere") || p.hasAttribute("data-comprobar")) && !desbloqueados[i];
    }

    function modoComprobar() {
      return pasos[actual].hasAttribute("data-comprobar") && !desbloqueados[actual];
    }

    function actualizarBotones() {
      btnAtras.disabled = actual === 0;
      if (modoComprobar()) {
        btnPrincipal.textContent = "Comprobar";
        btnPrincipal.disabled = !listo;
      } else {
        btnPrincipal.textContent = actual === total - 1 ? "Terminar" : "Continuar";
        btnPrincipal.disabled = necesitaInteraccion(actual);
      }
    }

    function actualizarProgreso() {
      var pct = Math.round(((actual + 1) / total) * 100);
      relleno.style.width = pct + "%";
      barra.setAttribute("aria-valuenow", String(pct));
      barra.setAttribute("aria-valuetext", "Paso " + (actual + 1) + " de " + total);
      if (contador) contador.textContent = (actual + 1) + " / " + total;
    }

    function guardar() {
      if (!window.Progreso) return;
      var previo = Progreso.obtener(id) || {};
      var cambios = {
        paso: actual,
        total: total,
        maximo: Math.max(previo.maximo || 0, actual)
      };
      if (actual === total - 1) cambios.completada = true;
      Progreso.guardar(id, cambios);
    }

    function ir(destino, primeraCarga) {
      if (destino < 0 || destino >= total || destino === actual) return;
      var haciaAtras = destino < actual;

      if (actual >= 0) pasos[actual].hidden = true;
      actual = destino;
      listo = false;

      var paso = pasos[actual];
      paso.hidden = false;
      paso.classList.remove("paso--entrando", "paso--entrando-atras");
      if (!primeraCarga && !reducirMovimiento) {
        void paso.offsetWidth; // reinicia la animación
        paso.classList.add(haciaAtras ? "paso--entrando-atras" : "paso--entrando");
      }

      actualizarBotones();
      actualizarProgreso();
      guardar();

      var primeraVez = !visitados[actual];
      visitados[actual] = true;
      var fn = alEntrar[paso.id];
      if (fn) fn(paso, leccion, { primeraVez: primeraVez, desbloqueado: !!desbloqueados[actual] });

      if (!primeraCarga) {
        window.scrollTo(0, 0);
        var titulo = paso.querySelector(".paso__titulo");
        if (titulo) {
          titulo.setAttribute("tabindex", "-1");
          titulo.focus({ preventScroll: true });
        }
      }
    }

    function accionPrincipal() {
      if (btnPrincipal.disabled) return;
      if (modoComprobar()) {
        var fn = comprobar[pasos[actual].id];
        var acierto = fn ? fn(pasos[actual], leccion) : true;
        if (acierto) {
          leccion.desbloquear();
          btnPrincipal.focus();
        } else {
          leccion.listoParaComprobar(false);
        }
        return;
      }
      if (actual === total - 1) {
        window.location.href = salida;
      } else {
        ir(actual + 1);
      }
    }

    btnPrincipal.addEventListener("click", accionPrincipal);
    btnAtras.addEventListener("click", function () { ir(actual - 1); });

    // Enter avanza cuando el foco no está en un control que ya usa Enter
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.defaultPrevented || e.isComposing) return;
      var t = e.target;
      if (t.closest && t.closest("button, a, textarea, select, summary")) return;
      e.preventDefault();
      accionPrincipal();
    });

    pasos.forEach(function (p) { p.hidden = true; });
    ir(inicio, true);
    return leccion;
  }

  /** Muestra un mensaje de feedback amable. tipo: "ok" | "pista". */
  function feedback(el, tipo, texto) {
    el.className = "feedback feedback--" + tipo;
    el.textContent = "";
    var icono = document.createElement("span");
    icono.className = "feedback__icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = tipo === "ok" ? "✓" : "💡";
    var msg = document.createElement("span");
    msg.textContent = texto;
    el.appendChild(icono);
    el.appendChild(msg);
  }

  function limpiarFeedback(el) {
    el.className = "feedback";
    el.textContent = "";
  }

  window.Pasos = {
    iniciar: iniciar,
    feedback: feedback,
    limpiarFeedback: limpiarFeedback,
    reducirMovimiento: reducirMovimiento
  };
})();
