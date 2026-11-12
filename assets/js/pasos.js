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

  /* Junta lo que va antes de la tarjeta (etiqueta, título, enunciado) en un
     .paso__intro. En el móvil no cambia nada; en escritorio, base.css lo pone
     junto a la tarjeta para que el paso quepa en una sola pantalla. */
  function envolverIntro(paso) {
    var tarjeta = paso.querySelector(":scope > .tarjeta");
    if (!tarjeta || paso.querySelector(":scope > .celebracion, :scope > .paso__intro")) return;
    var intro = document.createElement("div");
    intro.className = "paso__intro";
    paso.insertBefore(intro, paso.firstElementChild);
    while (intro.nextElementSibling && intro.nextElementSibling !== tarjeta) {
      intro.appendChild(intro.nextElementSibling);
    }
  }

  /* Dónde va la salida (.lab__resultado), para que **no cambie de lugar mientras el
     alumno está en el paso**. El reparto se decide al entrar (y al cambiar el tamaño de
     la ventana), nunca mientras corre el código.

     Lo normal, en escritorio: a la derecha, bajo lo que se ve. Para que lo que se ve
     pueda crecer sin empujarla (aparece un puntero bajo la lista, nace una caja), su
     panel se estira hasta que la salida queda abajo, a la altura del final de la columna
     del código (los botones): lo que aparezca dentro del panel ya tiene su lugar. Si
     llega a llenarlo, la salida baja y ya no vuelve a subir (el panel no se encoge).
     Si el código es más alto que la pantalla (lo normal en una laptop), la columna
     derecha mide lo que se ve de la pantalla y queda fija al bajar (paso--derecha-fija,
     en base.css): lo que se ve, arriba, y la salida, abajo, siguen a la vista junto a los
     botones. data-visual-fija="no" en un paso lo evita.

     Con una pila de llamadas, la salida va arriba (paso--salida-arriba): la pila crece
     hacia abajo todo lo que haga falta y la consola, encima, no se entera. Son los pasos
     con una .pila en lo que se ve, en las lecciones (o pasos) con data-visual-fija; un
     paso lo pide también con data-salida="arriba". En escritorio, la consola y la pila
     quedan fijas al bajar hasta los botones (la pila, con su propio desplazamiento si no
     cabe en la pantalla: arriba está la tarjeta que trabaja) y las notas y el mensaje
     de «Comprobar» pasan bajo el código; si el código cabe en la pantalla, las notas se
     quedan a la derecha, bajo la pila. En el móvil, la consola va entre el código y la
     pila, si el código va primero en el HTML. Para eso, lo que acompaña a la consola en
     la salida se junta en un .lab__notas. */
  var escritorio = window.matchMedia ? window.matchMedia("(min-width: 1024px)") : null;
  var BAJO_CABECERA = 60;   // 3.75rem: donde queda fija la columna derecha (base.css)

  // Lo más alta que puede ser la columna derecha para quedar fija bajo la cabecera sin
  // pasar del final del paso, ni con la página bajada del todo (si pasara, la salida
  // subiría y pisaría lo que se ve)
  function topeFijo(paso) {
    var cs = getComputedStyle(paso);
    var debajo = document.documentElement.scrollHeight - (paso.getBoundingClientRect().bottom + window.scrollY) +
      parseFloat(cs.paddingBottom) + parseFloat(cs.borderBottomWidth);
    return window.innerHeight - BAJO_CABECERA - debajo - 4;
  }

  function partes(paso) {
    var lab = paso.querySelector(":scope > .lab");
    if (!lab) return null;
    var p = {
      lab: lab,
      intro: paso.querySelector(":scope > .paso__intro"),
      principal: lab.querySelector(":scope > .lab__principal"),
      visual: lab.querySelector(":scope > .lab__visual"),
      resultado: lab.querySelector(":scope > .lab__resultado")
    };
    return p.principal && p.visual && p.resultado ? p : null;
  }

  // El espacio entre lo que se ve y la salida (lo ocupa aunque la salida esté vacía)
  function hueco(p) {
    return parseFloat(getComputedStyle(p.resultado).marginTop) || 0;
  }

  // ¿El paso usa el reparto de siempre? Una lección que pone el suyo (otras áreas en la
  // rejilla) se queda como la dejó
  var AREAS = '"intro visual" "principal visual" "principal resultado"';
  function repartoNormal(paso) {
    return getComputedStyle(paso).gridTemplateAreas.replace(/\s+/g, " ") === AREAS;
  }

  /* La salida arriba: se prepara una vez, al cargar. Devuelve la consola, o null si el
     paso no lo pide o su salida no tiene una sola consola suelta. */
  function prepararArriba(paso) {
    var p = partes(paso);
    if (!p) return null;
    var fija = paso.getAttribute("data-visual-fija");
    var pide = paso.getAttribute("data-salida") === "arriba" ||
      (fija !== "no" && (fija !== null || paso.closest("[data-visual-fija]")) && p.visual.querySelector(".pila"));
    var consolas = p.resultado.querySelectorAll(":scope > .consola");
    if (!pide || consolas.length !== 1) return null;
    var consola = consolas[0];
    // Lo demás de la salida (notas, el mensaje de «Comprobar»), junto: en escritorio va
    // bajo el código y en el móvil, después de la pila
    var notas = document.createElement("div");
    notas.className = "lab__notas";
    Array.prototype.slice.call(p.resultado.childNodes).forEach(function (n) {
      if (n !== consola) notas.appendChild(n);
    });
    p.resultado.appendChild(notas);
    paso.classList.add("paso--salida-arriba");
    // En el móvil solo se reordena si el código va antes que lo que se ve
    if (p.principal.compareDocumentPosition(p.visual) & Node.DOCUMENT_POSITION_FOLLOWING) {
      paso.classList.add("paso--codigo-primero");
    }
    paso._consolaArriba = consola;
    return consola;
  }

  // El alto propio de la columna del código (el enunciado y el código con sus botones):
  // si la derecha es más alta, la columna se estira hasta igualarla y no sirve medirla así
  function altoIzquierda(p) {
    p.principal.style.alignSelf = "start";
    var alto = p.principal.offsetHeight +
      (p.intro ? p.intro.offsetHeight + (parseFloat(getComputedStyle(p.intro).marginBottom) || 0) : 0);
    p.principal.style.alignSelf = "";
    return alto;
  }

  /* Con la salida arriba: la pila empieza donde termina la consola (--alto-consola).
     Al entrar se decide dónde van las notas: si el código cabe en la pantalla, a la
     derecha, bajo la pila (paso--notas-derecha; nada queda fijo, no hace falta); si no,
     bajo el código, y la consola y la pila quedan fijas al bajar, sin pasar entre las dos
     de lo que se ve de la pantalla (--tope-visual). */
  function sostenerArriba(paso, decidir) {
    var p = partes(paso);
    var consola = paso._consolaArriba;
    if (!p || !escritorio || !escritorio.matches) {
      paso.classList.remove("paso--notas-derecha");
      ["--alto-consola", "--alto-visual", "--tope-visual"].forEach(function (v) { paso.style.removeProperty(v); });
      if (p) { p.visual.classList.remove("lab__visual--recortada"); p.visual.removeAttribute("tabindex"); }
      return;
    }
    if (decidir) paso.classList.toggle("paso--notas-derecha", altoIzquierda(p) <= topeFijo(paso));
    var alto = consola.offsetHeight;
    paso.style.setProperty("--alto-consola", alto + "px");
    paso.style.setProperty("--alto-visual", p.visual.offsetHeight + "px");
    paso.style.setProperty("--tope-visual", Math.max(topeFijo(paso) - alto - 16, 160) + "px");
    // ¿La pila no cabe y se desplaza por dentro? Se nota con un borde difuminado abajo
    var recortada = p.visual.scrollHeight > p.visual.clientHeight + 4;
    p.visual.classList.toggle("lab__visual--recortada", recortada);
    // Con desplazamiento propio, también se llega con el teclado
    if (recortada) p.visual.setAttribute("tabindex", "0");
    else p.visual.removeAttribute("tabindex");
  }

  function equilibrar(paso) {
    if (paso._consolaArriba) { sostenerArriba(paso, true); return; }
    var p = partes(paso);
    paso.classList.remove("paso--derecha-fija");
    paso.style.removeProperty("--alto-visual");
    if (p) p.visual.style.minHeight = "";
    if (!p || !escritorio || !escritorio.matches || !repartoNormal(paso)) return;
    var izquierda = altoIzquierda(p);
    var alto = p.visual.offsetHeight;
    if (!alto) return;
    var derecha = alto + p.resultado.offsetHeight + hueco(p);
    var tope = topeFijo(paso);
    // No cabe entera en la pantalla: queda como está, a la derecha y sin fijar
    if (derecha > tope) return;
    // El panel de lo que se ve se estira hasta el final de la columna del código, o hasta
    // lo que se ve de la pantalla si el código es más alto. Y no baja de lo que mide ahora
    var objetivo = Math.min(izquierda, tope);
    if (derecha < objetivo) alto += objetivo - derecha;
    p.visual.style.minHeight = alto + "px";
    if (paso.getAttribute("data-visual-fija") !== "no" && izquierda > tope) {
      paso.style.setProperty("--alto-visual", alto + "px");
      paso.classList.add("paso--derecha-fija");
    }
  }

  /* Mientras el alumno está en el paso, el reparto no cambia. Solo se cuida que:
     - lo que se ve no se encoja (si creció y empujó a la salida, que no la haga volver);
     - con la columna derecha fija, la salida siga justo bajo lo que se ve; y si entonces
       ya no cabe fija en la pantalla, se suelta (pisaría lo que se ve al bajar del todo). */
  function sostener(paso) {
    if (paso._consolaArriba) { sostenerArriba(paso); return; }
    var p = partes(paso);
    if (!p) return;
    // También en el móvil: lo que se ve va antes que la salida
    var alto = p.visual.offsetHeight;
    if (alto > (parseFloat(p.visual.style.minHeight) || 0) + 1) p.visual.style.minHeight = alto + "px";
    if (!paso.classList.contains("paso--derecha-fija")) return;
    paso.style.setProperty("--alto-visual", alto + "px");
    if (alto + p.resultado.offsetHeight + hueco(p) > topeFijo(paso) + 4) {
      paso.classList.remove("paso--derecha-fija");
    }
  }

  /* Tras «Comprobar», si el mensaje quedó tapado por el pie o fuera de la
     pantalla, la página baja lo justo para que se lea. */
  function mostrarRespuesta(paso) {
    var fb = paso.querySelector(".feedback:not(:empty)");
    if (fb) aLaVista(fb);
  }

  /* Si un mensaje quedó bajo el pie fijo (la salida creció al terminar una traza), la
     página baja lo justo para verlo */
  var entradaPaso = 0;   // cuándo se entró al paso actual: al entrar no se baja la página
  function aLaVista(fb) {
    if (Date.now() - entradaPaso < 700) return;
    requestAnimationFrame(function () {
      if (!fb.offsetParent) return;
      var pie = document.querySelector(".leccion-pie");
      var limite = window.innerHeight - (pie ? pie.offsetHeight : 0);
      var caja = fb.getBoundingClientRect();
      if (caja.bottom > limite) {
        window.scrollBy({ top: caja.bottom - limite + 16, behavior: reducirMovimiento ? "auto" : "smooth" });
      }
    });
  }

  function iniciar(opciones) {
    opciones = opciones || {};
    var alEntrar = opciones.alEntrar || {};
    var comprobar = opciones.comprobar || {};

    var raiz = document.querySelector(".leccion");
    var id = raiz.getAttribute("data-leccion");
    var pasos = Array.prototype.slice.call(raiz.querySelectorAll(".paso"));
    var total = pasos.length;
    pasos.forEach(envolverIntro);
    pasos.forEach(prepararArriba);
    // «Siguiente: Quicksort →»: en el móvil la flecha quedaba sola en otro renglón. Un
    // espacio que no se parte la deja pegada a la última palabra.
    raiz.querySelectorAll(".btn").forEach(function (b) {
      var t = b.lastChild;
      if (t && t.nodeType === 3 && / [→←]\s*$/.test(t.nodeValue)) t.nodeValue = t.nodeValue.replace(/ ([→←])(\s*)$/, "\u00a0$1$2");
    });
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

      entradaPaso = Date.now();
      var primeraVez = !visitados[actual];
      visitados[actual] = true;
      var fn = alEntrar[paso.id];
      if (fn) fn(paso, leccion, { primeraVez: primeraVez, desbloqueado: !!desbloqueados[actual] });
      paso._tocado = false;
      equilibrar(paso);

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
        mostrarRespuesta(pasos[actual]);
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

    if (escritorio) {
      var esperaEquilibrio;
      window.addEventListener("resize", function () {
        clearTimeout(esperaEquilibrio);
        esperaEquilibrio = setTimeout(function () { equilibrar(pasos[actual]); }, 150);
      });
      // Al entrar, el paso termina de armarse (la explicación reserva su alto, se dibuja
      // lo que se ve): hasta que el alumno toca algo, el reparto se vuelve a decidir con
      // cada cambio de alto. Desde el primer toque ya no cambia: la salida no se mueve
      // mientras corre el código.
      ["pointerdown", "keydown", "click", "input"].forEach(function (tipo) {
        raiz.addEventListener(tipo, function (e) {
          var p = pasos[actual];
          if (p && p.contains(e.target)) p._tocado = true;
        }, true);
      });
      if (window.ResizeObserver) {
        var esperaCrece;
        var observador = new ResizeObserver(function () {
          var p = pasos[actual];
          if (!p) return;
          if (p._tocado) { sostener(p); return; }
          clearTimeout(esperaCrece);
          esperaCrece = setTimeout(function () { if (pasos[actual] === p && !p._tocado) equilibrar(p); }, 60);
        });
        pasos.forEach(function (p) {
          p.querySelectorAll(":scope > .paso__intro, :scope > .lab > .lab__principal, :scope > .lab > .lab__visual, :scope > .lab > .lab__resultado, :scope > .lab > .lab__resultado > .consola, :scope > .lab > .lab__resultado > .lab__notas").forEach(function (el) {
            observador.observe(el);
          });
        });
      }
    }

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
  /* texto: texto plano, o { html: "…" } para poner código (<code>) en el mensaje.
     Las clases propias del elemento se conservan; solo cambia feedback--tipo. */
  function feedback(el, tipo, texto) {
    quitarTipo(el);
    el.classList.add("feedback", "feedback--" + tipo);
    el.textContent = "";
    var icono = document.createElement("span");
    icono.className = "feedback__icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = tipo === "ok" ? "✓" : "💡";
    var msg = document.createElement("span");
    if (texto && typeof texto === "object" && texto.html !== undefined) msg.innerHTML = texto.html;
    else msg.textContent = texto;
    el.appendChild(icono);
    el.appendChild(msg);
    aLaVista(el);
  }

  function quitarTipo(el) {
    Array.prototype.slice.call(el.classList).forEach(function (c) {
      if (c.indexOf("feedback--") === 0) el.classList.remove(c);
    });
  }

  function limpiarFeedback(el) {
    quitarTipo(el);
    el.classList.add("feedback");
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
