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
     leccion.reiniciar()                borra el avance y empieza la lección desde cero

   Confeti: al acertar un paso con data-comprobar, al desbloquear por primera vez un
   reto con data-requiere (etiqueta «Reto», como el juego final de un proyecto) y al
   llegar al resumen final. Pasos.confeti(el) lanza uno desde cualquier elemento.

   Un paso con data-comprobar ya resuelto se puede volver a intentar: si el alumno
   elige otra respuesta (listoParaComprobar(true)), el botón vuelve a decir "Comprobar".
   Cualquier botón con data-accion="reiniciar" reinicia la lección, y abrir la página
   con #reiniciar (p. ej. desde la portada) también.
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

    // Empezar de nuevo si se pidió desde la portada
    if (window.location.hash === "#reiniciar") {
      borrarAvance();
      if (window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }

    // Retomar donde se quedó el alumno (si la terminó, repasa desde el principio)
    var guardado = window.Progreso ? Progreso.obtener(id) : null;
    var inicio = 0;
    if (guardado) {
      var maximo = Math.min(guardado.maximo || 0, total - 1);
      for (var i = 0; i < maximo; i++) desbloqueados[i] = true;
      var paso = Math.min(guardado.paso || 0, total - 1);
      inicio = paso === total - 1 ? 0 : paso;
    }

    /* Vuelve al paso 0 sin perder la marca de "completada" en la portada */
    function borrarAvance() {
      if (window.Progreso) Progreso.guardar(id, { paso: 0, maximo: 0 });
    }

    function esReto(i) {
      var etiqueta = pasos[i].querySelector(".paso__etiqueta");
      return !!etiqueta && etiqueta.textContent.trim() === "Reto";
    }

    var leccion = {
      desbloquear: function () {
        var primeraVez = !desbloqueados[actual];
        desbloqueados[actual] = true;
        actualizarBotones();
        if (primeraVez && esReto(actual) && !pasos[actual].hasAttribute("data-comprobar")) {
          confeti(pasos[actual].querySelector(".feedback--ok") || btnPrincipal);
        }
      },
      listoParaComprobar: function (valor) {
        listo = !!valor;
        actualizarBotones();
      },
      siguiente: function () { ir(actual + 1); },
      anterior: function () { ir(actual - 1); },
      reiniciar: function () {
        borrarAvance();
        window.location.reload();
      },
      get indice() { return actual; }
    };

    function necesitaInteraccion(i) {
      var p = pasos[i];
      return (p.hasAttribute("data-requiere") || p.hasAttribute("data-comprobar")) && !desbloqueados[i];
    }

    function modoComprobar() {
      return pasos[actual].hasAttribute("data-comprobar") && (!desbloqueados[actual] || listo);
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

      // Fin de la lección: lluvia de confeti desde la celebración
      if (actual === total - 1 && !primeraCarga) {
        var fiesta = paso.querySelector(".celebracion") || paso.querySelector(".paso__titulo");
        setTimeout(function () { confeti(fiesta, 70); }, 250);
      }

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
          listo = false;
          leccion.desbloquear();
          btnPrincipal.focus();
          confeti(pasos[actual].querySelector(".feedback--ok") || btnPrincipal);
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
    raiz.querySelectorAll('[data-accion="reiniciar"]').forEach(function (b) {
      b.addEventListener("click", leccion.reiniciar);
    });

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

  /** Lanza confeti desde el centro de un elemento (nada con movimiento reducido). */
  var COLORES = ["#0b7a3e", "#1f5fd6", "#f2b705", "#e8579a", "#5fb3ff", "#3cc47c"];

  function confeti(origen, cuantos) {
    if (reducirMovimiento || !origen || !document.body.animate) return;
    var r = origen.getBoundingClientRect();
    if (!r.width && !r.height) return;
    var x = r.left + r.width / 2;
    var y = r.top + Math.min(r.height / 2, 40);
    cuantos = cuantos || 32;
    for (var k = 0; k < cuantos; k++) {
      var pieza = document.createElement("span");
      pieza.className = "confeti" + (k % 3 === 0 ? " confeti--redondo" : "");
      pieza.setAttribute("aria-hidden", "true");
      pieza.style.left = x + "px";
      pieza.style.top = y + "px";
      pieza.style.background = COLORES[k % COLORES.length];
      document.body.appendChild(pieza);

      // Sale hacia arriba en abanico y cae girando
      var angulo = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
      var fuerza = 110 + Math.random() * 170;
      var dx = Math.cos(angulo) * fuerza;
      var dy = Math.sin(angulo) * fuerza;
      var giro = (Math.random() - 0.5) * 900;
      var vuelo = pieza.animate([
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + dx + "px, " + dy + "px) rotate(" + giro / 2 + "deg)", opacity: 1, offset: 0.4 },
        { transform: "translate(" + dx * 1.35 + "px, " + (dy + 240) + "px) rotate(" + giro + "deg)", opacity: 0 }
      ], { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(0.15, 0.7, 0.4, 1)" });
      vuelo.onfinish = vuelo.oncancel = quitar(pieza);
    }
  }

  function quitar(el) { return function () { el.remove(); }; }

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
    confeti: confeti,
    reducirMovimiento: reducirMovimiento
  };
})();
