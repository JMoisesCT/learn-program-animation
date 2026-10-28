/* pila.js — la pila de llamadas: una tarjeta por llamada (componente .pila de base.css).

     <div class="pila" id="mi-pila"></div>

   var p = Pila.crear(el, { codigo: preEl, rotulo: true });   ver «fichas» y «rótulo» abajo
   p.pintar({ pila: [Pila.programa([["nota", 15.5]]),
                     Pila.llamada("promedio(14, 17)", [["a", 14], ["b", 17]], "15.5")],
              leer: [nivel, "nombre"] });
   p.vaciar();                       solo queda la tarjeta del programa
   p.reservar(estados);              (con codigo) el código y el rótulo guardan el mayor alto que
                                     alcanzan en esos estados: los botones de debajo no saltan.
                                     Traza lo hace sola si recibe la pila (opción pila).

   Cada estado trae la pila completa, de abajo arriba. La tarjeta de arriba es la que
   trabaja; las de abajo esperan. Si trae devuelve, está terminando y lo muestra
   («↩ devuelve 15.5»); con termina: true, termina sin devolver nada («↩ termina»).
   Las tarjetas que desaparecen de la pila salen volando hacia arriba.
   leer resalta la variable que se está leyendo en la tarjeta de ese nivel.

   Para que se vea dónde se quedó cada llamada (sobre todo en la recursión, donde todas
   son la misma función), una tarjeta puede traer:
     linea: 5        índice desde 0 de la línea de la llamada en la que está esperando:
                     «‖ pausada en la línea 6» (sin linea: «esperando a suma()»)
     falta: "…"      lo que le queda por hacer al volver («le falta: print("Cierro…")»);
                     "" muestra «no le falta nada»
     sigue: true     acaba de volver la de arriba y esta retoma: «▶ sigue en la línea 6»
     recibe: "6"     (con sigue) el valor que le devolvió la de arriba, dentro de falta
                     («return 4 * 6»): sale volando del «↩ devuelve 6» de la tarjeta que se va.
                     Si falta tiene un ▢, el valor cae ahí («return ▢ + fibonacci(1)» con
                     recibe: "1", se ve «return 1 + fibonacci(1)»); si no, en su última aparición
     espera: "…"     la llamada de falta que está esperando: se ve como una ficha con «↑» (la
                     tarjeta de encima) y, con recibe, el valor cae en su lugar
                     («return fibonacci(2) + fibonacci(1)» con espera: "fibonacci(2)" y
                     recibe: "1" → «return 1 + fibonacci(1)»). Así se lee a quién espera.
   Con la opción codigo, cada tarjeta pausada pone además una ficha («n=3») al final de su
   línea en el código (Codigo.pausas): se ve cuántas llamadas esperan en esa misma línea,
   y al volver se va la ficha de la que retoma. ficha: "e=2" cambia el texto de la ficha
   (por defecto, sus variables). columna: 15 la pone bajo esa columna de la línea, p. ej.
   bajo la llamada de la izquierda o la de la derecha cuando una línea hace dos.
   El estado puede traer además valores: { linea, partes } (ver Codigo.valores): la línea
   con los valores de la llamada que la ejecuta, debajo de ella.
   Con rotulo: true (y codigo), encima del código se lee qué llamada lo está ejecutando:
   «Ahora corre: abrir(2) n 2», la tarjeta de arriba. Cambia al llamar y al volver.

   Para que el alumno haga la vuelta él mismo: con la opción alTocar(nivel, arriba), tocar
   una tarjeta la llama con su nivel (0 = programa) y si es la de arriba. Si el estado trae
   tocable: "👆 Tócala", la de arriba se ve como un botón (anillo, cursor, Enter o espacio)
   con ese aviso; p.tope() da su elemento, para darle el foco.
*/
(function () {
  "use strict";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function programa(vars) { return { titulo: "Programa", vars: vars || [] }; }
  function llamada(titulo, vars, devuelve) { return { titulo: titulo, vars: vars || [], devuelve: devuelve }; }

  function nombreFuncion(titulo) { return titulo.slice(0, titulo.indexOf("(")); }

  function crearMarco(datos, nivel) {
    var raiz = crear("div", "marco marco--entra" + (nivel === 0 ? " marco--programa" : ""));
    var cab = crear("div", "marco__cabecera");
    var titulo = crear("p", "marco__titulo");
    if (nivel === 0) titulo.textContent = datos.titulo;
    else titulo.appendChild(crear("code", "", datos.titulo));
    var estado = crear("span", "marco__estado");
    var vars = crear("div", "marco__vars");
    var vacia = crear("span", "marco__vacia", "sin variables todavía");
    var falta = crear("p", "marco__falta");
    falta.hidden = true;
    vars.appendChild(vacia);
    cab.appendChild(titulo);
    cab.appendChild(estado);
    var toca = crear("p", "marco__toca");
    toca.hidden = true;
    raiz.appendChild(cab);
    raiz.appendChild(vars);
    raiz.appendChild(falta);
    raiz.appendChild(toca);
    return { titulo: datos.titulo, raiz: raiz, estado: estado, vars: vars, vacia: vacia, falta: falta, toca: toca, chips: {} };
  }

  // «le falta: …»: lo que la llamada hará cuando vuelva la de arriba
  function pintarFalta(marco, falta, recibe, espera) {
    var el = marco.falta;
    el.hidden = falta === undefined;
    var clave = falta + "|" + recibe + "|" + espera;
    if (falta === undefined || el.getAttribute("data-falta") === clave) return;
    el.setAttribute("data-falta", clave);
    el.textContent = "";
    if (falta === "") { el.textContent = "no le falta nada"; return; }
    el.appendChild(document.createTextNode("le falta: "));
    var code = el.appendChild(crear("code"));
    // Dónde va la pieza: la llamada que espera, el ▢ o el valor recibido
    var k = -1, largo = 0;
    if (espera !== undefined && falta.indexOf(espera) !== -1) {
      k = falta.indexOf(espera);
      largo = espera.length;
    } else if (recibe !== undefined) {
      k = falta.indexOf("▢");
      largo = 1;
      if (k === -1) {
        k = falta.lastIndexOf(recibe);
        largo = recibe.length;
      }
    }
    if (k === -1) { code.textContent = falta; return; }
    // El valor recibido va aparte: es donde aterriza al volar
    var pieza = recibe !== undefined ? crear("span", "marco__recibido", recibe) : crear("span", "marco__espera", espera);
    code.appendChild(document.createTextNode(falta.slice(0, k)));
    code.appendChild(pieza);
    code.appendChild(document.createTextNode(falta.slice(k + largo)));
  }

  function pintarVars(marco, lista, leer) {
    var quedan = {};
    lista.forEach(function (par) {
      var nombre = par[0];
      var valor = String(par[1]);
      var c = marco.chips[nombre];
      if (!c) {
        c = marco.chips[nombre] = crear("span", "var");
        c.appendChild(crear("code", "var__nombre", nombre));
        c.appendChild(crear("code", "var__valor", valor));
        marco.vars.appendChild(c);
      } else if (c.lastChild.textContent !== valor) {
        c.lastChild.textContent = valor;
        c.classList.remove("var--cambio");
        void c.offsetWidth;
        c.classList.add("var--cambio");
      }
      c.classList.toggle("var--leida", leer === nombre);
      quedan[nombre] = true;
    });
    Object.keys(marco.chips).forEach(function (n) {
      if (quedan[n]) return;
      marco.chips[n].remove();
      delete marco.chips[n];
    });
    marco.vacia.hidden = lista.length > 0;
  }

  // A quién espera una tarjeta: «esperando a suma()»; si es la misma función (recursión),
  // a la tarjeta de encima
  function esperando(titulo, arriba) {
    var nombre = nombreFuncion(arriba);
    return nombre === nombreFuncion(titulo) ? "esperando a la de arriba" : "esperando a " + nombre + "()";
  }

  /* ---------- Rótulo: qué llamada ejecuta el código ahora ---------- */
  function crearRotulo(pre) {
    var raiz = crear("p", "rotulo");
    raiz.appendChild(crear("span", "rotulo__etiqueta", "Ahora corre:"));
    var cuerpo = crear("span", "rotulo__cuerpo");
    raiz.appendChild(cuerpo);
    pre.parentNode.insertBefore(raiz, pre);
    return { raiz: raiz, cuerpo: cuerpo, nivel: -1, clave: null };
  }

  function llenarRotulo(cuerpo, pila) {
    var nivel = pila.length - 1;
    var datos = pila[nivel];
    cuerpo.textContent = "";
    if (nivel === 0) cuerpo.appendChild(crear("span", "rotulo__programa", "el programa"));
    else cuerpo.appendChild(crear("code", "rotulo__llamada", datos.titulo));
    datos.vars.forEach(function (par) {
      var c = crear("span", "var");
      c.appendChild(crear("code", "var__nombre", par[0]));
      c.appendChild(crear("code", "var__valor", String(par[1])));
      cuerpo.appendChild(c);
    });
  }

  function pintarRotulo(r, pila) {
    var nivel = pila.length - 1;
    var datos = pila[nivel];
    var clave = nivel + "|" + datos.titulo + "|" + JSON.stringify(datos.vars);
    if (clave === r.clave) return;
    var otra = nivel !== r.nivel || r.clave === null || r.clave.split("|")[1] !== datos.titulo;
    r.clave = clave;
    llenarRotulo(r.cuerpo, pila);
    // Al llamar entra desde arriba, como la tarjeta nueva; al volver, desde abajo
    if (otra) {
      r.raiz.classList.remove("rotulo--sube", "rotulo--baja");
      if (r.nivel !== -1) {
        void r.raiz.offsetWidth;
        r.raiz.classList.add(nivel >= r.nivel ? "rotulo--sube" : "rotulo--baja");
      }
    }
    r.nivel = nivel;
  }

  function crearPila(el, opciones) {
    var codigo = opciones && opciones.codigo;
    var alTocar = opciones && opciones.alTocar;
    var rotulo = codigo && opciones.rotulo ? crearRotulo(codigo) : null;
    var titulo = crear("p", "pila__titulo");
    var cont = crear("div", "pila__marcos");
    el.appendChild(titulo);
    el.appendChild(cont);
    var marcos = [];
    var saliendo = [];

    function quitarSaliendo() {
      saliendo.forEach(function (m) { m.remove(); });
      saliendo = [];
    }

    function retirar(marco) {
      if (reducir()) { marco.raiz.remove(); return; }
      marco.raiz.classList.remove("marco--entra", "marco--sigue");
      marco.raiz.classList.add("marco--sale");
      saliendo.push(marco.raiz);
      setTimeout(function () {
        marco.raiz.remove();
        saliendo = saliendo.filter(function (m) { return m !== marco.raiz; });
      }, 650);
    }

    function pintar(e) {
      var pila = e.pila;
      // Hasta dónde coincide con lo que ya se ve; lo de encima se retira
      var k = 0;
      while (k < marcos.length && k < pila.length && marcos[k].titulo === pila[k].titulo) k++;
      // Si se va una tarjeta que devolvía un valor, el valor baja a la que retoma
      var tope = marcos[marcos.length - 1];
      var baja = k < marcos.length && tope.devuelve !== undefined
        ? { desde: tope.estado.getBoundingClientRect(), valor: tope.devuelve } : null;
      for (var i = marcos.length - 1; i >= k; i--) retirar(marcos[i]);
      marcos.length = k;
      if (pila.length > k) quitarSaliendo();
      for (i = k; i < pila.length; i++) {
        var m = crearMarco(pila[i], i);
        cont.appendChild(m.raiz);
        marcos.push(m);
      }
      pila.forEach(function (datos, nivel) {
        var m = marcos[nivel];
        var arriba = nivel === pila.length - 1;
        var termina = datos.devuelve !== undefined || datos.termina;
        m.raiz.classList.toggle("marco--activo", arriba);
        m.raiz.classList.toggle("marco--esperando", !arriba);
        var linea = datos.linea !== undefined ? " en la línea " + (datos.linea + 1) : "";
        var pausada = !arriba && datos.linea !== undefined;
        var sigue = arriba && datos.sigue && !termina;
        var estado = "";
        if (datos.devuelve !== undefined) estado = "↩ devuelve " + datos.devuelve;
        else if (datos.termina) estado = "↩ termina";
        else if (pausada) estado = "‖ pausada" + linea;
        else if (!arriba) estado = esperando(datos.titulo, pila[nivel + 1].titulo);
        else if (sigue) estado = "▶ sigue" + linea;
        else if (nivel > 0) estado = "trabajando";
        if (m.estado.textContent !== estado) m.estado.textContent = estado;
        m.estado.className = "marco__estado" + (termina ? " marco__estado--devuelve" : pausada ? " marco__estado--pausada" :
          sigue ? " marco__estado--sigue" : "");
        // Al retomar, la tarjeta se ilumina una vez
        if (sigue && !m.raiz.classList.contains("marco--sigue")) {
          void m.raiz.offsetWidth;
          m.raiz.classList.add("marco--sigue");
        } else if (!sigue) m.raiz.classList.remove("marco--sigue");
        pintarVars(m, datos.vars, e.leer && e.leer[0] === nivel ? e.leer[1] : null);
        pintarFalta(m, pausada || sigue ? datos.falta : undefined, sigue ? datos.recibe : undefined, datos.espera);
        pintarToca(m, arriba && e.tocable ? e.tocable : "");
        m.devuelve = datos.devuelve;
      });
      titulo.textContent = "Pila de llamadas · " + pila.length + (pila.length === 1 ? " tarjeta" : " tarjetas");
      var recibido = marcos[pila.length - 1].falta.querySelector(".marco__recibido");
      if (baja && recibido && window.Codigo) Codigo.volar(baja.desde, recibido, String(baja.valor), "vuelo--salida");
      if (codigo) {
        Codigo.pausas(codigo, fichas(pila));
        Codigo.valores(codigo, e.valores || null);
      }
      if (rotulo) pintarRotulo(rotulo, pila);
    }

    // La tarjeta de arriba, cuando el alumno la tiene que tocar, es un botón
    function pintarToca(m, aviso) {
      var r = m.raiz;
      r.classList.toggle("marco--tocable", !!aviso);
      m.toca.hidden = !aviso;
      m.toca.textContent = aviso;
      if (aviso) {
        r.setAttribute("role", "button");
        r.setAttribute("tabindex", "0");
        r.setAttribute("aria-label", m.titulo + ": " + aviso.replace(/^\W+/, ""));
      } else {
        r.removeAttribute("role");
        r.removeAttribute("tabindex");
        r.removeAttribute("aria-label");
      }
    }

    function tocar(ev) {
      if (!alTocar) return;
      var raiz = ev.target.closest(".marco");
      for (var i = 0; i < marcos.length; i++) {
        if (marcos[i].raiz === raiz) { alTocar(i, i === marcos.length - 1); return; }
      }
    }
    cont.addEventListener("click", tocar);
    cont.addEventListener("keydown", function (ev) {
      if ((ev.key === "Enter" || ev.key === " ") && ev.target.classList.contains("marco--tocable")) {
        ev.preventDefault();
        tocar(ev);
      }
    });

    // Una ficha por tarjeta pausada, de abajo arriba, en la línea donde espera
    function fichas(pila) {
      var lista = [];
      pila.forEach(function (datos, nivel) {
        if (nivel === pila.length - 1 || datos.linea === undefined) return;
        var texto = datos.ficha || datos.vars.map(function (par) { return par[0] + "=" + par[1]; }).join(" ");
        lista.push({ linea: datos.linea, texto: texto, clave: String(nivel), columna: datos.columna });
      });
      return lista;
    }

    function vaciar() {
      quitarSaliendo();
      cont.textContent = "";
      marcos = [];
      pintar({ pila: [programa()] });
    }

    // El código (con sus fichas) y el rótulo guardan el alto que alcanzan en la traza
    function reservar(estados) {
      if (codigo) Codigo.reservarAlto(codigo, estados, function (copia, e) {
        copia.querySelectorAll(".pausas, .valores, .codigo__salto").forEach(function (x) { x.remove(); });
        Codigo.pausas(copia, fichas(e.pila));
        Codigo.valores(copia, e.valores || null);
      });
      if (rotulo) Codigo.reservarAlto(rotulo.raiz, estados, function (copia, e) {
        llenarRotulo(copia.querySelector(".rotulo__cuerpo"), e.pila);
      });
    }

    function marcoDeArriba() { return marcos[marcos.length - 1].raiz; }

    vaciar();
    return { pintar: pintar, vaciar: vaciar, reservar: reservar, tope: marcoDeArriba };
  }

  window.Pila = { crear: crearPila, programa: programa, llamada: llamada };
})();
