/* reproductor.js — la ejecución de un problema resuelto, como un video que se puede
   adelantar y rebobinar. Necesita codigo.js y python.js. CSS en assets/css/problemas.css.

   var r = Reproductor.crear(el, {
     entradas: [                          datos de entrada ya preparados (el alumno elige uno)
       { nombre: "Pagó 100 · costó 13", datos: { … } }, …
     ],
     codigo: function (datos) { return ["precio = 13", …]; },   el programa con esos datos
     lineasDatos: [0, 1],                 (opcional) las líneas que cambian con los datos:
                                          llevan la marca «datos» y se iluminan al cambiar
     variables: ["vuelto", "valor"],      las cajas, en orden (aparecen cuando nacen)
     generar: function (datos) {          la ejecución completa: un paso por línea ejecutada
       return [{
         linea: 4,                        índice desde 0 de la línea que se ejecuta
         vars: { vuelto: 87, valor: 50 }, TODAS las variables vivas después de la línea
         salida: "1 de 50",               (opcional) lo que imprime esta línea
         nota: "…",                       qué está pasando (admite HTML)
         lee: ["vuelto"], escribe: "cantidad",   (opcional) se iluminan / el valor vuela a su caja
         capitulo: "Billete de 50",       (opcional) empieza un capítulo: marca en la barra
         pausa: true,                     (opcional) momento clave: al reproducir, se detiene aquí
         flecha: true / false,            (opcional) fuerza o evita la flecha de salto
         …                                lo que necesite la escena (su estado completo)
       }, …];
     },
     escena: {                            (opcional) el dibujo propio del problema
       crear: function (contenedor) { … },
       pintar: function (paso, opciones) { … }   paso es null antes de empezar; opciones:
     },                                   { animar: true si se avanzó un solo paso hacia adelante,
                                            datos, i, pasos }. Con animar: false, dibujar el
                                            estado de golpe (se llegó saltando o rebobinando).
     formato: function (nombre, valor) {} (opcional) cómo se escribe un valor en su caja
     intervalo: 1000                      ms por paso a velocidad 1×
   });

   r.ir(i)        salta al paso i (-1 = antes de empezar)
   r.entrada(k)   elige los datos k
   r.pasos()      la ejecución actual (p. ej. para las preguntas de la página)

   Lo que muestra, además del código, la escena, las cajas y la consola:
   - una barra de tiempo con los capítulos marcados (se arrastra adelante y atrás),
   - el rastro de cada variable (sus valores anteriores, tachados),
   - el mapa de calor: cuántas veces se ejecutó cada línea hasta ahora,
   - la nota del paso, y en los momentos clave la reproducción se pausa sola.
   Teclado (con el foco dentro): espacio reproduce o pausa, ← → paso a paso, Inicio / Fin.
*/
(function () {
  "use strict";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function nuevo(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function boton(clase, texto, etiqueta) {
    var b = nuevo("button", "rep__btn " + clase, texto);
    b.type = "button";
    if (etiqueta) { b.setAttribute("aria-label", etiqueta); b.title = etiqueta; }
    return b;
  }

  /* Cómo escribe Python un valor */
  function python(v) {
    if (v === null || v === undefined) return "None";
    if (v === true) return "True";
    if (v === false) return "False";
    if (typeof v === "string") return "'" + v + "'";
    if (Array.isArray(v)) return "[" + v.map(python).join(", ") + "]";
    if (typeof v === "number" && !Number.isInteger(v)) return String(Math.round(v * 1000) / 1000);
    return String(v);
  }

  var VELOCIDADES = [0.5, 1, 2, 4];

  function crear(el, o) {
    var raiz = nuevo("div", "rep");
    raiz.tabIndex = -1;

    /* ---------- Datos de entrada ---------- */
    var cabecera = nuevo("div", "rep__entradas");
    cabecera.appendChild(nuevo("span", "rep__entradas-titulo", "Datos de entrada"));
    var grupo = nuevo("div", "rep__chips");
    grupo.setAttribute("role", "radiogroup");
    grupo.setAttribute("aria-label", "Datos de entrada");
    cabecera.appendChild(grupo);
    var chips = (o.entradas || []).map(function (e, k) {
      var b = nuevo("button", "rep__chip", e.nombre);
      b.type = "button";
      b.setAttribute("role", "radio");
      b.addEventListener("click", function () { entrada(k); });
      grupo.appendChild(b);
      return b;
    });
    if (o.lineasDatos && o.lineasDatos.length) {
      cabecera.appendChild(nuevo("p", "rep__entradas-ayuda", "Las líneas con raya amarilla cambian con los datos que elijas."));
    }
    raiz.appendChild(cabecera);

    // La nota va arriba, junto a los datos: se lee sin dejar de ver el código
    var nota = nuevo("div", "rep__nota");
    nota.setAttribute("aria-live", "polite");
    raiz.appendChild(nota);

    /* ---------- Cuerpo: código, escena, cajas y consola ---------- */
    var cuerpo = nuevo("div", "rep__cuerpo");
    var colCodigo = nuevo("div", "rep__codigo");
    var pre = nuevo("pre", "codigo");
    pre.setAttribute("aria-label", "Código del programa");
    colCodigo.appendChild(pre);
    var calores = nuevo("div", "rep__calores");
    calores.setAttribute("aria-hidden", "true");
    colCodigo.appendChild(calores);
    var leyendaCalor = nuevo("p", "rep__leyenda", "La barra a la derecha de cada línea crece cada vez que se ejecuta.");
    colCodigo.appendChild(leyendaCalor);

    var colEscena = nuevo("div", "rep__escena");
    if (o.escena && o.escena.crear) o.escena.crear(colEscena);
    else colEscena.hidden = true;

    var colLado = nuevo("div", "rep__lado");
    colLado.appendChild(nuevo("p", "rep__rotulo", "Variables"));
    var cajas = nuevo("div", "rep__vars");
    colLado.appendChild(cajas);
    var consola = nuevo("div", "rep__consola");
    consola.appendChild(nuevo("p", "rep__rotulo", "Consola"));
    var salidaEl = nuevo("div", "rep__salida");
    salidaEl.setAttribute("aria-live", "polite");
    consola.appendChild(salidaEl);
    colLado.appendChild(consola);

    cuerpo.appendChild(colEscena);
    cuerpo.appendChild(colCodigo);
    cuerpo.appendChild(colLado);
    raiz.appendChild(cuerpo);

    /* ---------- Controles ---------- */
    var controles = nuevo("div", "rep__controles");
    var bInicio = boton("rep__btn--chico", "⏮", "Volver al inicio");
    var bAtras = boton("rep__btn--chico", "◀", "Paso anterior");
    var bPlay = boton("rep__btn--play", "▶", "Reproducir");
    var bAdelante = boton("rep__btn--chico", "▶", "Paso siguiente");
    bAdelante.classList.add("rep__btn--paso");
    var bCapitulo = boton("rep__btn--chico", "⏭", "Siguiente capítulo");
    var tiempo = nuevo("div", "rep__tiempo");
    var barra = document.createElement("input");
    barra.type = "range";
    barra.className = "rep__barra";
    barra.setAttribute("aria-label", "Línea de tiempo de la ejecución");
    var marcas = nuevo("div", "rep__marcas");
    tiempo.appendChild(marcas);
    tiempo.appendChild(barra);
    var contador = nuevo("span", "rep__contador");
    var bVel = boton("rep__vel", "1×", "Velocidad");
    [bInicio, bAtras, bPlay, bAdelante, bCapitulo].forEach(function (b) { controles.appendChild(b); });
    controles.appendChild(tiempo);
    controles.appendChild(contador);
    controles.appendChild(bVel);
    raiz.appendChild(controles);

    el.appendChild(raiz);

    /* ---------- Estado ---------- */
    var k = -1;           // entrada elegida
    var datos = null;
    var pasos = [];
    var i = -1;           // paso que se ve
    var timer = null;
    var vel = 1;
    var vistas = {};      // nombre -> elementos de su caja

    function lineas() { return pre.querySelectorAll(".linea"); }

    function formato(nombre, v) { return o.formato ? o.formato(nombre, v) : python(v); }

    /* ---------- Mapa de calor ---------- */
    function medirCalores() {
      var ls = lineas();
      calores.textContent = "";
      calores.style.height = pre.offsetHeight + "px";
      ls.forEach(function (l, n) {
        var c = nuevo("span", "rep__calor");
        c.style.top = (pre.offsetTop + l.offsetTop + 4) + "px";
        c.style.height = Math.max(6, l.offsetHeight - 8) + "px";
        c.setAttribute("data-linea", String(n));
        c.appendChild(nuevo("span", "rep__calor-num"));
        calores.appendChild(c);
      });
      pintarCalores();
    }

    function pintarCalores() {
      var cuenta = {};
      var max = 1;
      for (var n = 0; n <= i; n++) {
        var l = pasos[n].linea;
        cuenta[l] = (cuenta[l] || 0) + 1;
        if (cuenta[l] > max) max = cuenta[l];
      }
      calores.querySelectorAll(".rep__calor").forEach(function (c) {
        var veces = cuenta[c.getAttribute("data-linea")] || 0;
        c.style.setProperty("--calor", String(veces / max));
        c.classList.toggle("rep__calor--cero", !veces);
        c.firstChild.textContent = veces ? "×" + veces : "";
      });
    }

    /* ---------- Variables con su rastro ---------- */
    function caja(nombre) {
      if (vistas[nombre]) return vistas[nombre];
      var c = nuevo("div", "rep__var");
      var nom = nuevo("code", "rep__var-nombre", nombre);
      var val = nuevo("span", "rep__var-valor");
      var rastro = nuevo("span", "rep__var-rastro");
      c.appendChild(nom);
      c.appendChild(val);
      c.appendChild(rastro);
      cajas.appendChild(c);
      vistas[nombre] = { caja: c, valor: val, rastro: rastro };
      return vistas[nombre];
    }

    function historia(nombre) {
      var h = [];
      for (var n = 0; n <= i; n++) {
        var vs = pasos[n].vars || {};
        if (!(nombre in vs)) continue;
        var t = formato(nombre, vs[nombre]);
        if (h[h.length - 1] !== t) h.push(t);
      }
      return h;
    }

    function pintarVars(animar) {
      var paso = pasos[i] || null;
      var vs = paso ? paso.vars || {} : {};
      var nombres = o.variables || Object.keys(vs);
      cajas.textContent = "";
      vistas = {};
      var hay = false;
      nombres.forEach(function (nombre) {
        if (!(nombre in vs)) return;
        hay = true;
        var v = caja(nombre);
        var h = historia(nombre);
        v.valor.textContent = h[h.length - 1];
        h.slice(Math.max(0, h.length - 4), -1).forEach(function (t) {
          v.rastro.appendChild(nuevo("s", null, t));
        });
        if (paso.lee && paso.lee.indexOf(nombre) !== -1) v.caja.classList.add("rep__var--lee");
        if (paso.escribe === nombre) {
          v.caja.classList.add("rep__var--escribe");
          if (animar) {
            var linea = lineas()[paso.linea];
            if (linea) Codigo.volar(Codigo.piezaEnLinea(linea, []), v.valor, v.valor.textContent, "vuelo--salida");
          }
        }
      });
      if (!hay) cajas.appendChild(nuevo("p", "rep__vacio", "Todavía no hay variables."));
    }

    /* ---------- Consola ---------- */
    function pintarSalida(animar) {
      salidaEl.textContent = "";
      var hay = false;
      for (var n = 0; n <= i; n++) {
        if (pasos[n].salida === undefined) continue;
        hay = true;
        var l = nuevo("span", "rep__salida-linea", String(pasos[n].salida));
        salidaEl.appendChild(l);
        if (animar && n === i) {
          var linea = lineas()[pasos[n].linea];
          if (linea) Codigo.volar(Codigo.piezaEnLinea(linea, []), l, l.textContent, "vuelo--salida");
        }
      }
      if (!hay) salidaEl.appendChild(nuevo("span", "rep__vacio", "(sin salida)"));
      salidaEl.scrollTop = salidaEl.scrollHeight;
    }

    /* ---------- Un paso ---------- */
    function capituloDe(n) {
      for (var m = n; m >= 0; m--) if (pasos[m].capitulo) return pasos[m].capitulo;
      return null;
    }

    function pintar(animar) {
      var paso = pasos[i] || null;
      var anterior = i > 0 ? pasos[i - 1] : null;
      Codigo.marcar(pre, { activas: paso ? [paso.linea] : [] });
      Codigo.quitarSalto(pre);
      if (paso && animar && anterior) {
        var salta = paso.flecha !== undefined ? paso.flecha : paso.linea < anterior.linea;
        if (salta) Codigo.salto(pre, anterior.linea, paso.linea);
      }
      // La línea activa, a la vista dentro del código (si el código se desplaza)
      var activa = paso ? lineas()[paso.linea] : null;
      if (activa && colCodigo.scrollHeight > colCodigo.clientHeight) {
        var arriba = activa.offsetTop - colCodigo.clientHeight / 2;
        colCodigo.scrollTo({ top: arriba, behavior: animar && !reducir() ? "smooth" : "auto" });
      }
      pintarVars(animar);
      pintarSalida(animar);
      pintarCalores();
      if (o.escena && o.escena.pintar) o.escena.pintar(paso, { animar: animar && !reducir(), datos: datos, i: i, pasos: pasos });

      nota.classList.toggle("rep__nota--clave", !!(paso && paso.pausa));
      nota.innerHTML = "";
      var cap = paso ? capituloDe(i) : null;
      if (cap) nota.appendChild(nuevo("span", "rep__nota-cap", cap));
      if (paso && paso.pausa) nota.appendChild(nuevo("span", "rep__nota-clave", "⏸ Momento clave"));
      var texto = nuevo("span", "rep__nota-texto");
      texto.innerHTML = paso ? paso.nota || "" :
        "Toca <strong>▶</strong> para ver el programa correr, o arrastra la barra para ir a cualquier momento.";
      nota.appendChild(texto);

      barra.value = String(i);
      barra.setAttribute("aria-valuetext", i < 0 ? "Antes de empezar" : "Paso " + (i + 1) + " de " + pasos.length);
      contador.textContent = i < 0 ? "0 / " + pasos.length : (i + 1) + " / " + pasos.length;
      marcas.querySelectorAll(".rep__marca").forEach(function (m) {
        m.classList.toggle("rep__marca--pasada", Number(m.getAttribute("data-i")) <= i);
      });
      bInicio.disabled = bAtras.disabled = i < 0;
      bAdelante.disabled = bCapitulo.disabled = i >= pasos.length - 1;
      if (i >= pasos.length - 1) { detener(); raiz.classList.add("rep--fin"); }
      else raiz.classList.remove("rep--fin");
      bPlay.textContent = timer ? "⏸" : (i >= pasos.length - 1 ? "↺" : "▶");
      bPlay.setAttribute("aria-label", timer ? "Pausa" : (i >= pasos.length - 1 ? "Ver otra vez" : "Reproducir"));
      bPlay.title = bPlay.getAttribute("aria-label");
    }

    function ir(n, animar) {
      i = Math.max(-1, Math.min(pasos.length - 1, n));
      pintar(!!animar);
      if (o.alCambiar) o.alCambiar(i, pasos);
    }

    /* ---------- Reproducir ---------- */
    function detener() {
      if (timer) clearTimeout(timer);
      timer = null;
      raiz.classList.remove("rep--corriendo");
    }

    function tic() {
      if (i >= pasos.length - 1) { detener(); pintar(false); return; }
      ir(i + 1, true);
      if (pasos[i].pausa || i >= pasos.length - 1) { detener(); pintar(false); return; }
      timer = setTimeout(tic, (o.intervalo || 1000) / vel);
    }

    function reproducir() {
      if (timer) { detener(); pintar(false); return; }
      if (i >= pasos.length - 1) ir(-1);
      timer = setTimeout(tic, 60);
      raiz.classList.add("rep--corriendo");
      pintar(false);
    }

    /* ---------- Capítulos ---------- */
    function pintarMarcas() {
      marcas.textContent = "";
      var n = pasos.length;
      pasos.forEach(function (p, m) {
        if (!p.capitulo) return;
        var b = nuevo("button", "rep__marca");
        b.type = "button";
        b.setAttribute("data-i", String(m));
        b.style.left = (n > 1 ? ((m + 1) / n) * 100 : 0) + "%";
        b.setAttribute("aria-label", "Ir al capítulo: " + p.capitulo);
        b.title = p.capitulo;
        b.addEventListener("click", function () { detener(); ir(m); });
        marcas.appendChild(b);
      });
    }

    function siguienteCapitulo() {
      for (var m = i + 1; m < pasos.length; m++) if (pasos[m].capitulo) return m;
      return pasos.length - 1;
    }

    /* ---------- Datos de entrada ---------- */
    function entrada(n) {
      detener();
      var cambia = k !== -1 && k !== n;
      k = n;
      datos = o.entradas[k].datos;
      chips.forEach(function (c, m) {
        c.setAttribute("aria-checked", String(m === k));
        c.classList.toggle("rep__chip--activo", m === k);
      });
      Python.escribir(pre, o.codigo(datos));
      (o.lineasDatos || []).forEach(function (m) {
        var l = lineas()[m];
        if (!l) return;
        l.classList.add("linea--datos");
        if (cambia && !reducir()) { void l.offsetWidth; l.classList.add("linea--datos-cambia"); }
      });
      pasos = o.generar(datos);
      barra.min = "-1";
      barra.max = String(pasos.length - 1);
      pintarMarcas();
      if (o.escena && o.escena.reiniciar) o.escena.reiniciar(datos);
      ir(-1);
      requestAnimationFrame(medirCalores);
    }

    /* ---------- Eventos ---------- */
    bPlay.addEventListener("click", reproducir);
    bAdelante.addEventListener("click", function () { detener(); ir(i + 1, true); });
    bAtras.addEventListener("click", function () { detener(); ir(i - 1); });
    bInicio.addEventListener("click", function () { detener(); ir(-1); });
    bCapitulo.addEventListener("click", function () { detener(); ir(siguienteCapitulo()); });
    barra.addEventListener("input", function () { detener(); ir(Number(barra.value)); });
    bVel.addEventListener("click", function () {
      vel = VELOCIDADES[(VELOCIDADES.indexOf(vel) + 1) % VELOCIDADES.length];
      bVel.textContent = String(vel).replace(".", ",") + "×";
      bVel.setAttribute("aria-label", "Velocidad " + bVel.textContent);
    });
    raiz.addEventListener("keydown", function (e) {
      if (e.target === barra || e.target.closest(".rep__chips")) return;
      if (e.key === " " && !e.target.closest("button")) { e.preventDefault(); reproducir(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); detener(); ir(i + 1, true); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); detener(); ir(i - 1); }
      else if (e.key === "Home") { e.preventDefault(); detener(); ir(-1); }
      else if (e.key === "End") { e.preventDefault(); detener(); ir(pasos.length - 1); }
    });
    var esperaMedir;
    window.addEventListener("resize", function () {
      clearTimeout(esperaMedir);
      esperaMedir = setTimeout(medirCalores, 150);
    });

    entrada(0);

    return {
      ir: function (n) { detener(); ir(n); },
      entrada: entrada,
      pasos: function () { return pasos; },
      datos: function () { return datos; },
      detener: detener,
      el: raiz
    };
  }

  window.Reproductor = { crear: crear, python: python };
})();
