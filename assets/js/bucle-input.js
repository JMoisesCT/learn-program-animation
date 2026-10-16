/* bucle-input.js — consola que pide un dato en cada vuelta de un bucle
   (un input() dentro de un for o de un while). Necesita codigo.js y pasos.js.

   Los elementos se buscan por id, con un prefijo común (p. ej. "ap"):
     ap-codigo       (opcional) bloque .codigo del programa
     ap-explicacion  (opcional) qué está pasando (admite HTML)
     ap-registro     dentro de la .consola: lo que se escribe y lo que se imprime
     ap-fila         .entrada con la etiqueta, ap-campo y ap-enviar
     ap-otra         botón para empezar de nuevo (oculto hasta el final)
     ap-vuelta       indicador: "Vuelta 2 de 5"
     ap-fb           feedback

   BucleInput.crear({
     prefijo: "ap",
     vueltas: 5,            vueltas del for; null si no hay un número fijo (while + break)
     rotulo: "Vuelta",      (opcional) palabra del indicador: "Intento 3"
     pregunta: "Nota:",     texto del input() que queda escrito en la consola
     lineaInput: 2,         línea del input() (desde 0)
     siguiente: "…",        (opcional) explicación al pedir otro dato; por defecto "Escribe el siguiente."
     validar: function (texto) { return "pista" o null; },
     alEmpezar: function () { return "explicación inicial"; },
     alDato: function (texto) {          texto: lo escrito, sin espacios a los lados
       return { texto: "…", camino: { activas: […], saltadas: […] }, salida: ["…"], fin: true };
     },                                  fin: true sale del bucle (un break)
     alFinal: function () { return { linea, texto, salida }; },   (opcional) al salir del bucle
     alTerminar: function () { … }
   });
   Devuelve { empezar }.
*/
(function () {
  "use strict";

  function crear(o) {
    function $(sufijo) { return document.getElementById(o.prefijo + "-" + sufijo); }
    var registro = $("registro");
    var fila = $("fila");
    var campo = $("campo");
    var otra = $("otra");
    var fb = $("fb");
    var explicacion = $("explicacion");
    var codigo = $("codigo");
    var indicador = $("vuelta");
    var rotulo = o.rotulo || "Vuelta";
    var vuelta = 0;

    function marcar(camino) { if (codigo) Codigo.marcar(codigo, camino); }
    function explicar(html) { if (explicacion) explicacion.innerHTML = html; }

    function anotar(respuesta) {
      var l = document.createElement("span");
      l.className = "consola__linea";
      l.innerHTML = '<span class="registro__pregunta"></span> <span class="registro__respuesta"></span>';
      l.children[0].textContent = o.pregunta;
      l.children[1].textContent = respuesta;
      registro.appendChild(l);
    }

    function pedir(previo) {
      campo.value = "";
      indicador.innerHTML = rotulo + " <strong>" + (vuelta + 1) + "</strong>" + (o.vueltas ? " de " + o.vueltas : "");
      explicar(previo + (vuelta === 0 ? " <code>input()</code> espera el primer dato." : " " + (o.siguiente || "Escribe el siguiente.")));
    }

    function empezar() {
      vuelta = 0;
      registro.textContent = "";
      fila.hidden = false;
      otra.hidden = true;
      Pasos.limpiarFeedback(fb);
      marcar({ activas: [o.lineaInput] });
      pedir(o.alEmpezar());
    }

    function enviar() {
      var valor = campo.value.trim();
      var pista = o.validar(valor);
      if (pista) {
        Pasos.feedback(fb, "pista", pista);
        return;
      }
      Pasos.limpiarFeedback(fb);
      anotar(valor);
      var r = o.alDato(valor);
      // Queda marcado el camino que acaba de recorrer esta vuelta
      marcar(r.camino);
      (r.salida || []).forEach(function (s) { Codigo.agregar(registro, s); });
      vuelta++;
      if (!r.fin && (!o.vueltas || vuelta < o.vueltas)) {
        pedir(r.texto);
        campo.focus();
        return;
      }
      var f = o.alFinal ? o.alFinal() : {};
      if (f.linea !== undefined) marcar({ activas: [f.linea] });
      explicar(r.texto + (f.texto ? " " + f.texto : ""));
      indicador.textContent = "Fin del bucle";
      if (f.salida !== undefined) Codigo.agregar(registro, f.salida);
      fila.hidden = true;
      otra.hidden = false;
      otra.focus();
      o.alTerminar();
    }

    $("enviar").addEventListener("click", enviar);
    // Enter en el campo envía el dato (en vez de pulsar "Continuar")
    campo.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.isComposing) return;
      e.preventDefault();
      enviar();
    });
    otra.addEventListener("click", function () {
      empezar();
      campo.focus();
    });
    empezar();
    return { empezar: empezar };
  }

  window.BucleInput = { crear: crear };
})();
