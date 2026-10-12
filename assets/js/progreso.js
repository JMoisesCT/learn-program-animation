/* progreso.js — guarda el avance de cada lección en localStorage.
   Si el navegador bloquea el almacenamiento, todo sigue funcionando (sin guardar). */
(function () {
  "use strict";

  var CLAVE = "lpa:progreso";

  function leerTodo() {
    try {
      var datos = JSON.parse(localStorage.getItem(CLAVE));
      return datos && typeof datos === "object" ? datos : {};
    } catch (e) {
      return {};
    }
  }

  function escribirTodo(datos) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datos));
    } catch (e) {
      /* Almacenamiento no disponible: se ignora. */
    }
  }

  window.Progreso = {
    /** Devuelve { paso, maximo, total, completada } o null si no hay datos. */
    obtener: function (id) {
      return leerTodo()[id] || null;
    },

    /** Mezcla los campos dados con lo que ya hay guardado para esa lección. */
    guardar: function (id, cambios) {
      var datos = leerTodo();
      var actual = datos[id] || {};
      for (var k in cambios) actual[k] = cambios[k];
      datos[id] = actual;
      escribirTodo(datos);
      return actual;
    },

    borrar: function (id) {
      var datos = leerTodo();
      delete datos[id];
      escribirTodo(datos);
    }
  };
})();
