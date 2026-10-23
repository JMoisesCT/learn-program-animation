/* caja.js — anima la "caja" de una variable (componente .caja de base.css).

     <div class="caja">
       <div class="caja__cuerpo"><span class="caja__valor caja__valor--vacia"></span></div>
       <code class="caja__nombre">edad</code>
     </div>

   Caja.poner(cajaEl, valor, origen)  el valor viejo sale volando y entra el nuevo; si en el paso
                                      hay una línea de código ejecutándose, viaja desde ella
                                      (o desde `origen`, un elemento o rectángulo, si se indica:
                                      p. ej. el argumento de la llamada para un parámetro)
                                      Si se crean varias cajas en el mismo paso, añadirlas todas
                                      antes de poner los valores: el vuelo sigue a la caja si se
                                      mueve, pero así va derecho a su lugar.
   Caja.actualizar(cajaEl, valor)     cambia el valor con un pequeño pulso (para sliders)
   Caja.vaciar(cajaEl)
*/
(function () {
  "use strict";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function cuerpo(caja) { return caja.querySelector(".caja__cuerpo"); }

  function valorActual(caja) {
    return cuerpo(caja).querySelector(".caja__valor:not(.caja__valor--saliendo)");
  }

  function quitarAlTerminar(el) {
    if (reducir()) { el.remove(); return; }
    el.addEventListener("animationend", function () { el.remove(); }, { once: true });
  }

  function poner(caja, valor, origen) {
    var viejo = valorActual(caja);
    if (viejo) {
      if (viejo.classList.contains("caja__valor--vacia")) {
        viejo.remove();
      } else {
        viejo.classList.remove("caja__valor--entrando", "caja__valor--pulso");
        viejo.classList.add("caja__valor--saliendo");
        quitarAlTerminar(viejo);
      }
    }
    var nuevo = document.createElement("span");
    nuevo.className = "caja__valor";
    nuevo.textContent = String(valor);
    cuerpo(caja).appendChild(nuevo);

    function llegar() { nuevo.classList.add("caja__valor--pulso"); }
    // La copia que vuela va fuera de la caja: lleva su color a mano
    var clase = "caja__valor" + (caja.classList.contains("caja--acento") ? " vuelo--acento" : "");
    if (window.Codigo && origen && Codigo.volar) {
      Codigo.volar(origen, nuevo, String(valor), clase, llegar);
    } else if (window.Codigo && Codigo.volarDesdeLinea) {
      Codigo.volarDesdeLinea(caja, nuevo, String(valor), clase, llegar);
    } else {
      nuevo.classList.add("caja__valor--entrando");
    }
  }

  function actualizar(caja, valor) {
    var el = valorActual(caja);
    if (!el || el.classList.contains("caja__valor--vacia")) { poner(caja, valor); return; }
    el.textContent = String(valor);
    el.classList.remove("caja__valor--entrando", "caja__valor--pulso");
    void el.offsetWidth;
    el.classList.add("caja__valor--pulso");
  }

  function vaciar(caja) {
    var c = cuerpo(caja);
    c.textContent = "";
    var vacio = document.createElement("span");
    vacio.className = "caja__valor caja__valor--vacia";
    c.appendChild(vacio);
  }

  window.Caja = { poner: poner, actualizar: actualizar, vaciar: vaciar };
})();
