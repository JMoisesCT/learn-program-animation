/* conjunto.js — un conjunto (set) de Python como una bolsa con fichas sueltas.
   Hermano de la lista (lista.js): aquí no hay casilleros ni números, porque un conjunto
   no tiene orden, y un valor repetido no entra. Necesita lista.js (para escribir los
   valores) y codigo.js (para los vuelos).

     var c = Conjunto.crear(el, ["rojo", "azul"], {
       nombres: ["colores"],   (opcional) etiquetas que apuntan al conjunto
       llaves: true            { y } a los lados de la bolsa, como se escribe en Python
     });

   Las fichas van en el orden en que Python las imprimiría (Conjunto.orden): los números de
   menor a mayor y los textos en un orden fijo que no es el alfabético ni el de llegada, como
   en Python. No pedir al alumno que adivine ese orden: para imprimirlo en orden, sorted().

   c.valores([…])            repinta con otros valores (los repetidos se juntan), sin animación
   c.lista                   los valores, en el orden de print
   c.largo                   cuántos hay (len)
   c.tiene(v)                true si v está (v in c)
   c.agregar(v, origen)      .add(v): si no estaba, nace su ficha (en su lugar, no al final) y
                             el valor llega volando desde origen o desde la línea activa;
                             devuelve true. Si ya estaba, la copia vuela hasta la ficha que ya
                             estaba, que se sacude en naranja («ya estaba»); devuelve false
   c.quitar(v)               .remove(v) / .discard(v): la ficha sube y se va. Devuelve el
                             rectángulo donde estaba, o null si no estaba (remove: KeyError)
   c.marcar(v)               resalta la ficha de v y la devuelve (null si no está);
                             c.marcar(null) quita la marca
   c.clases(fn)              fn(v) devuelve una clase extra para cada ficha
                             ("conjunto__ficha--igual", "--distinta", "--apagada"), o ""
   c.ficha(v)                la ficha de v, o null
   c.rechazar()              la bolsa se sacude en rojo: colores[0] da TypeError (no hay índices)
   c.nombres([…])            cambia las etiquetas de arriba
   c.el                      el contenedor .conjunto

   var v = Conjunto.venn(el, ["Ana", "Luis", "Eva"], ["Eva", "Rosa"], {
     nombres: ["futbol", "ajedrez"]
   });
                             dos bolsas que se cruzan: a la izquierda los que solo están en a,
                             en el medio los que están en los dos y a la derecha los de b
   v.valores(a, b)           repinta con otros conjuntos
   v.resaltar(op)            ilumina las zonas de una operación y apaga las demás: "|" (unión),
                             "&" (intersección), "-" (a - b) o "b-a" (b - a); null quita el
                             resaltado. Devuelve los valores del resultado, en el orden de print
   v.ficha(valor)            la ficha de ese valor (origen de un vuelo hacia el resultado)
   v.zona("a" | "ambos" | "b") el elemento de una zona
   v.marcar(valor)           resalta una ficha (null quita la marca)
   v.el

   Conjunto.orden(valores)   sin repetidos y en el orden de print
   Conjunto.python(valores)  cómo lo imprime print: {'azul', 'rojo'} o set() si está vacío
   Conjunto.texto(valores)   cómo se escribe en el código: {"azul", "rojo"} o set()
*/
(function () {
  "use strict";

  function reducir() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function span(clase, contenido) {
    var s = document.createElement("span");
    s.className = clase;
    if (contenido !== undefined) s.textContent = contenido;
    return s;
  }

  function texto(v) { return Lista.texto(v); }

  // Un número fijo para cada texto: decide su lugar en la bolsa y al imprimir
  function hash(t) {
    var h = 5381;
    for (var i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
    return h;
  }

  function igual(a, b) { return a === b; }

  function sinRepetidos(valores) {
    var r = [];
    (valores || []).forEach(function (v) {
      if (!r.some(function (x) { return igual(x, v); })) r.push(v);
    });
    return r;
  }

  function orden(valores) {
    return sinRepetidos(valores).sort(function (a, b) {
      var na = typeof a === "number";
      var nb = typeof b === "number";
      if (na && nb) return a - b;
      if (na !== nb) return na ? -1 : 1;
      return (hash(String(a)) % 997) - (hash(String(b)) % 997) || (String(a) < String(b) ? -1 : 1);
    });
  }

  function escribir(valores, f) {
    var v = orden(valores);
    return v.length ? "{" + v.map(f).join(", ") + "}" : "set()";
  }

  // Cada ficha se ve un poco movida y girada (siempre igual para el mismo valor): una bolsa, no una fila
  function desordenar(ficha, v) {
    var h = hash(texto(v));
    ficha.style.setProperty("--dx", ((h % 7) - 3) * 0.06 + "rem");
    ficha.style.setProperty("--dy", (((h >> 3) % 7) - 3) * 0.08 + "rem");
    ficha.style.setProperty("--giro", (((h >> 6) % 9) - 4) * 1.1 + "deg");
  }

  function nuevaFicha(v) {
    var f = span("conjunto__ficha" + (typeof v === "string" ? " conjunto__ficha--texto" : ""), texto(v));
    f.setAttribute("data-valor", texto(v));
    desordenar(f, v);
    return f;
  }

  function medir(fichas) {
    var m = new Map();
    fichas.forEach(function (c) { m.set(c, c.getBoundingClientRect()); });
    return m;
  }

  function deslizar(fichas, previas) {
    if (reducir() || !document.body.animate) return;
    fichas.forEach(function (c) {
      var a = previas.get(c);
      if (!a) return;
      var b = c.getBoundingClientRect();
      var dx = a.left - b.left;
      var dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      c.animate([
        { translate: dx + "px " + dy + "px" },
        { translate: "0 0" }
      ], { duration: 420, easing: "cubic-bezier(0.34, 1.3, 0.64, 1)" });
    });
  }

  function fantasmaQueSale(elemento) {
    if (reducir() || !document.body.animate || !elemento.offsetParent) return;
    var r = elemento.getBoundingClientRect();
    var copia = elemento.cloneNode(true);
    copia.classList.add("conjunto__sale");
    copia.style.left = r.left + "px";
    copia.style.top = r.top + "px";
    copia.style.width = r.width + "px";
    copia.style.height = r.height + "px";
    document.body.appendChild(copia);
    var a = copia.animate([
      { transform: "none", opacity: 1 },
      { transform: "translateY(-2.5rem) rotate(-10deg) scale(0.9)", opacity: 0 }
    ], { duration: 480, easing: "ease-in" });
    a.onfinish = a.oncancel = function () { copia.remove(); };
  }

  function sacudir(el, clase) {
    el.classList.remove(clase);
    void el.offsetWidth;
    el.classList.add(clase);
    setTimeout(function () { el.classList.remove(clase); }, 900);
  }

  function etiquetas(el) {
    var caja = null;
    return function (lista, inicial) {
      if (!caja) {
        caja = span("lista__nombres conjunto__nombres");
        el.insertBefore(caja, el.firstChild);
      }
      var previos = {};
      Array.prototype.forEach.call(caja.children, function (n) { previos[n.textContent] = true; });
      caja.textContent = "";
      lista.forEach(function (nombre) {
        caja.appendChild(span("lista__nombre" + (previos[nombre] || inicial ? "" : " lista__nombre--nuevo"), nombre));
      });
      caja.hidden = !lista.length;
    };
  }

  /* ---------- Una bolsa ---------- */
  function crear(el, valoresIniciales, opciones) {
    opciones = opciones || {};
    var valores = [];
    var bolsa = null;
    var dentro = null;
    var nombres = etiquetas(el);

    el.classList.add("conjunto");
    el.classList.toggle("conjunto--sin-llaves", opciones.llaves === false);
    el.setAttribute("aria-hidden", "true");

    function fichas() {
      return Array.prototype.slice.call(dentro.querySelectorAll(".conjunto__ficha"));
    }

    function ficha(v) {
      var k = valores.findIndex(function (x) { return igual(x, v); });
      return k === -1 ? null : fichas()[k];
    }

    function vacia() {
      var aviso = dentro.querySelector(".conjunto__vacio");
      if (!valores.length && !aviso) dentro.appendChild(span("conjunto__vacio", "vacío"));
      if (valores.length && aviso) aviso.remove();
    }

    function pintar(nuevos) {
      valores = orden(nuevos);
      if (bolsa) bolsa.remove();
      bolsa = span("conjunto__bolsa");
      bolsa.appendChild(span("conjunto__llave", "{"));
      dentro = span("conjunto__dentro");
      valores.forEach(function (v) { dentro.appendChild(nuevaFicha(v)); });
      bolsa.appendChild(dentro);
      bolsa.appendChild(span("conjunto__llave", "}"));
      el.appendChild(bolsa);
      vacia();
    }

    function quitarMarca() {
      dentro.querySelectorAll(".conjunto__ficha--marcada").forEach(function (f) { f.classList.remove("conjunto__ficha--marcada"); });
    }

    function marcar(v) {
      quitarMarca();
      if (v === null || v === undefined) return null;
      var f = ficha(v);
      if (f) {
        void f.offsetWidth;
        f.classList.add("conjunto__ficha--marcada");
      }
      return f;
    }

    function agregar(v, origen) {
      quitarMarca();
      var t = texto(v);
      var ya = ficha(v);
      if (ya) {
        // Ya estaba: la copia llega hasta ella y no entra otra
        var avisar = function () { sacudir(ya, "conjunto__ficha--repetida"); };
        if (window.Codigo && origen) Codigo.volar(origen, ya, t, "conjunto__ficha conjunto__vuelo", avisar);
        else if (window.Codigo) Codigo.volarDesdeLinea(el, ya, t, "conjunto__ficha conjunto__vuelo", avisar);
        else avisar();
        return false;
      }
      var previas = medir(fichas());
      var nuevos = orden(valores.concat([v]));
      var k = nuevos.findIndex(function (x) { return igual(x, v); });
      var f = nuevaFicha(v);
      dentro.insertBefore(f, fichas()[k] || null);
      valores = nuevos;
      vacia();
      deslizar(fichas(), previas);
      if (!reducir()) f.classList.add("conjunto__ficha--entra");
      function pulso() { f.classList.add("conjunto__pulso"); }
      if (window.Codigo && origen) Codigo.volar(origen, f, t, "conjunto__ficha conjunto__vuelo", pulso);
      else if (window.Codigo) Codigo.volarDesdeLinea(el, f, t, "conjunto__ficha conjunto__vuelo", pulso);
      return true;
    }

    function quitar(v) {
      quitarMarca();
      var f = ficha(v);
      if (!f) return null;
      var rect = f.getBoundingClientRect();
      fantasmaQueSale(f);
      var previas = medir(fichas());
      f.remove();
      valores = valores.filter(function (x) { return !igual(x, v); });
      vacia();
      deslizar(fichas(), previas);
      return rect;
    }

    function clases(fn) {
      fichas().forEach(function (f, i) {
        var previa = f.getAttribute("data-clase");
        if (previa) f.classList.remove(previa);
        var nueva = fn ? fn(valores[i]) : "";
        if (nueva) {
          f.classList.add(nueva);
          f.setAttribute("data-clase", nueva);
        } else {
          f.removeAttribute("data-clase");
        }
      });
    }

    pintar(valoresIniciales);
    if (opciones.nombres) nombres(opciones.nombres, true);

    return {
      el: el,
      valores: pintar,
      get lista() { return valores.slice(); },
      get largo() { return valores.length; },
      tiene: function (v) { return !!ficha(v); },
      agregar: agregar,
      quitar: quitar,
      marcar: marcar,
      clases: clases,
      ficha: ficha,
      rechazar: function () { sacudir(bolsa, "conjunto__bolsa--rechaza"); },
      nombres: function (lista) { nombres(lista); }
    };
  }

  /* ---------- Dos bolsas que se cruzan ---------- */
  var cuantos = 0;

  function venn(el, a0, b0, opciones) {
    opciones = opciones || {};
    var a = [];
    var b = [];
    var zonas = {};
    var rotulos = [];

    el.classList.add("venn");
    el.setAttribute("aria-hidden", "true");
    el.textContent = "";
    var marco = span("venn__marco");
    // Las dos bolsas en SVG: así la zona del medio (las dos a la vez) se puede pintar sola
    var id = "venn-corte-" + (++cuantos);
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "venn__dibujo");
    svg.setAttribute("viewBox", "0 0 300 180");
    svg.innerHTML =
      '<defs><clipPath id="' + id + '"><circle cx="190" cy="90" r="82"/></clipPath></defs>' +
      '<circle class="venn__circulo venn__circulo--a" cx="110" cy="90" r="82"/>' +
      '<circle class="venn__circulo venn__circulo--b" cx="190" cy="90" r="82"/>' +
      '<circle class="venn__cruce" cx="110" cy="90" r="82" clip-path="url(#' + id + ')"/>' +
      '<circle class="venn__borde venn__borde--a" cx="110" cy="90" r="82"/>' +
      '<circle class="venn__borde venn__borde--b" cx="190" cy="90" r="82"/>';
    var fila = span("venn__nombres");
    var nombres = opciones.nombres || ["a", "b"];
    rotulos = nombres.map(function (n, i) {
      var r = span("venn__nombre venn__nombre--" + (i ? "b" : "a"), n);
      fila.appendChild(r);
      return r;
    });
    var lienzo = span("venn__lienzo");
    lienzo.appendChild(svg);
    ["a", "ambos", "b"].forEach(function (z) {
      zonas[z] = span("venn__zona venn__zona--" + z);
      lienzo.appendChild(zonas[z]);
    });
    marco.appendChild(fila);
    marco.appendChild(lienzo);
    el.appendChild(marco);

    function esta(lista, v) { return lista.some(function (x) { return igual(x, v); }); }

    function zonaDe(v) {
      var enA = esta(a, v);
      var enB = esta(b, v);
      return enA && enB ? "ambos" : enA ? "a" : "b";
    }

    function pintar(na, nb) {
      a = orden(na);
      b = orden(nb);
      Object.keys(zonas).forEach(function (z) { zonas[z].textContent = ""; });
      orden(a.concat(b)).forEach(function (v) { zonas[zonaDe(v)].appendChild(nuevaFicha(v)); });
      resaltar(null);
    }

    function ficha(v) {
      return el.querySelector('.conjunto__ficha[data-valor="' + texto(v).replace(/"/g, '\\"') + '"]');
    }

    function resaltar(op) {
      var dentro = {
        "|": ["a", "ambos", "b"],
        "&": ["ambos"],
        "-": ["a"],
        "b-a": ["b"]
      }[op] || null;
      el.classList.toggle("venn--resaltado", !!dentro);
      ["a", "ambos", "b"].forEach(function (z) {
        var si = !!dentro && dentro.indexOf(z) !== -1;
        zonas[z].classList.toggle("venn__zona--dentro", si);
        zonas[z].classList.toggle("venn__zona--fuera", !!dentro && !si);
      });
      // Las bolsas se tiñen según la operación (CSS: .venn[data-op="&"] …)
      el.setAttribute("data-op", op ? { "|": "union", "&": "cruce", "-": "a", "b-a": "b" }[op] : "");
      if (!dentro) return [];
      return orden(a.concat(b)).filter(function (v) { return dentro.indexOf(zonaDe(v)) !== -1; });
    }

    pintar(a0, b0);

    return {
      el: el,
      valores: pintar,
      resaltar: resaltar,
      ficha: ficha,
      zona: function (z) { return zonas[z]; },
      marcar: function (v) {
        el.querySelectorAll(".conjunto__ficha--marcada").forEach(function (f) { f.classList.remove("conjunto__ficha--marcada"); });
        var f = v === null || v === undefined ? null : ficha(v);
        if (f) f.classList.add("conjunto__ficha--marcada");
        return f;
      },
      nombres: function (lista) { lista.forEach(function (n, i) { if (rotulos[i]) rotulos[i].textContent = n; }); }
    };
  }

  window.Conjunto = {
    crear: crear,
    venn: venn,
    orden: orden,
    python: function (valores) { return escribir(valores, Lista.python); },
    texto: function (valores) { return escribir(valores, Lista.texto); }
  };
})();
