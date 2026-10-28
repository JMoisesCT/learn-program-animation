/* arbol.js — el árbol de llamadas de una función recursiva (componente .arbol-llamadas de base.css).
   Cada nodo es una llamada; sus hijos, las llamadas que hace. Las hojas se reparten de
   izquierda a derecha y cada padre queda sobre el centro de sus hijos.

   1. Armar el árbol (sin dibujarlo):

     var raiz = Arbol.armar({ n: 4, texto: "4" }, function (d) {
       return d.n >= 2 ? [{ n: d.n - 1, texto: String(d.n - 1) }, { n: d.n - 2, texto: String(d.n - 2) }] : [];
     }, function (nodo) { … });       (opcional) se llama al volver de cada nodo, después
                                      de sus hijos: p. ej. para calcular lo que devuelve

   Cada nodo lleva los datos que se le dieron y además: id, padre, hijos, prof (piso,
   desde 0), pre (orden en que se llama), post (orden en que vuelve) y x (en hojas).
   raiz.nodos es la lista de todos, en el orden en que se llaman.
   Una rama podada (una llamada que un if no deja hacer): el hijo trae podada: true.
   Se dibuja apagada, con unas tijeras en su arista; lo que cuelga de ella (si hijos()
   devuelve algo para él) también se ve apagado y aparece de una vez, cuando se corta.
   Las podadas no vuelven nunca (post: Infinity).

   2. Dibujarlo:

     var a = Arbol.crear(el, raiz, {
       etiqueta: "Árbol de llamadas de fibonacci(4)",   aria-label del dibujo
       texto: function (nodo) { … },     lo que va en el círculo (por defecto nodo.texto o nodo.n)
       arista: function (nodo) { … },    (opcional) la elección que lleva la arista que baja
                                         a ese nodo («C», «S»), en una etiqueta en su mitad;
                                         por defecto nodo.eleccion
       pisos: function (prof) { … },     (opcional) rótulo a la izquierda de cada piso («n=3»)
       pildora: function (nodo, visible, listo) { … },   texto bajo el círculo o null
                                         (por defecto, al volver, String(nodo.valor))
       tocar: function (nodo) { … },     (opcional) cada nodo es un botón (Enter o espacio)
       nombre: "fibonacci",              aria-label de cada nodo: nombre(n); o
       titulo: function (nodo) { … },    el aria-label completo
       hoja: 38, piso: 78, radio: 15,    separación entre hojas y entre pisos, y radio
       letra: 13,                        (opcional) tamaño del texto del círculo, en px; sin
                                         letra, se achica solo si el texto es largo
       clase: "arbol-llamadas--monedas"  clase extra del dibujo, para estilos de la lección
     });

   a.pintar({ llamadas: 3, devueltos: 1, actual: id, puede: false, quieto: false })
       se ven los nodos ya llamados (pre < llamadas) y los que ya volvieron (post < devueltos)
       llevan su píldora. En vez de contar, vistos: [ids] y listos: [ids] dicen cuáles
       (p. ej. cuando el alumno elige el camino). actual: la llamada que corre; las de su
       camino hacia arriba esperan (punteadas, como sus tarjetas en la pila). puede: true
       pone un anillo que late en la actual (el alumno la tiene que tocar). quieto: true,
       sin animaciones de entrada. Sin llamadas ni vistos, se ve todo.
   a.marcar([nodos], conRamas)   resalta unos nodos (y lo que cuelga de ellos)
   a.sacudir(nodo)               un no amable
   a.clase(nodo, "nodo--x", si)  pone o quita una clase en un nodo (estilos de la lección)
   a.nodos, a.raiz

   Los nodos sin hijos llevan la clase nodo--hoja; los podados, nodo--podado.
*/
(function () {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";
  var MARGEN = 6, PILDORA = 16, ROTULO = 34;

  function svg(tag, atributos, clase) {
    var el = document.createElementNS(SVG, tag);
    for (var k in atributos) el.setAttribute(k, atributos[k]);
    if (clase) el.setAttribute("class", clase);
    return el;
  }

  /* ---------- Armar ---------- */
  function armar(datos, hijos, alVolver) {
    var nodos = [];
    var pre = 0, post = 0, hojas = 0, pisos = 0;
    function visitar(d, padre, prof, apagada) {
      var nodo = {};
      for (var c in d) nodo[c] = d[c];
      nodo.id = nodos.length;
      nodo.padre = padre;
      nodo.prof = prof;
      nodo.hijos = [];
      // Lo que cuelga de una rama podada aparece con ella, de una vez
      nodo.podada = !!d.podada || apagada;
      nodo.corte = !!d.podada && !apagada;
      nodo.pre = apagada ? padre.pre : pre++;
      nodos.push(nodo);
      pisos = Math.max(pisos, prof + 1);
      var lista = hijos(d, nodo) || [];
      lista.forEach(function (h) { nodo.hijos.push(visitar(h, nodo, prof + 1, nodo.podada)); });
      if (nodo.hijos.length) nodo.x = (nodo.hijos[0].x + nodo.hijos[nodo.hijos.length - 1].x) / 2;
      else nodo.x = hojas++;
      if (alVolver && !nodo.podada) alVolver(nodo);
      nodo.post = nodo.podada ? Infinity : post++;
      return nodo;
    }
    var raiz = visitar(datos, null, 0, false);
    raiz.nodos = nodos;
    raiz.hojas = hojas;
    raiz.pisos = pisos;
    return raiz;
  }

  /* ---------- Dibujar ---------- */
  function crear(cont, raiz, opciones) {
    opciones = opciones || {};
    var nodos = raiz.nodos;
    var HOJA = opciones.hoja || 38, PISO = opciones.piso || 78, R = opciones.radio || 15;
    var izq = opciones.pisos ? ROTULO : 0;
    var ancho = izq + 2 * (MARGEN + R) + (raiz.hojas - 1) * HOJA;
    var alto = 2 * MARGEN + 2 * R + PILDORA + 4 + (raiz.pisos - 1) * PISO;
    var dibujo = svg("svg", { viewBox: "0 0 " + ancho + " " + alto, role: "img", "aria-label": opciones.etiqueta || "Árbol de llamadas" },
      "arbol-llamadas" + (opciones.clase ? " " + opciones.clase : ""));
    dibujo.style.maxWidth = Math.round(ancho * 1.3) + "px";
    var aristas = dibujo.appendChild(svg("g"));
    var elecciones = dibujo.appendChild(svg("g"));
    var capa = dibujo.appendChild(svg("g"));
    function px(nodo) { return izq + MARGEN + R + nodo.x * HOJA; }
    function py(nodo) { return MARGEN + R + nodo.prof * PISO; }

    var textoDe = opciones.texto || function (nodo) { return String(nodo.texto !== undefined ? nodo.texto : nodo.n); };
    var aristaDe = opciones.arista || function (nodo) { return nodo.eleccion; };

    if (opciones.pisos) {
      for (var p = 0; p < raiz.pisos; p++) {
        var rotulo = opciones.pisos(p);
        if (rotulo === null || rotulo === undefined) continue;
        dibujo.insertBefore(svg("text", { x: MARGEN, y: MARGEN + R + p * PISO }, "arbol__piso"), aristas).textContent = String(rotulo);
      }
    }

    nodos.forEach(function (nodo) {
      var x = px(nodo), y = py(nodo);
      if (nodo.padre) {
        var pa = nodo.padre;
        var x1 = px(pa), y1 = py(pa) + R, x2 = x, y2 = y - R;
        var eleccion = aristaDe(nodo);
        nodo.arista = aristas.appendChild(svg("path", {
          d: "M" + x1 + " " + y1 + " L" + x2 + " " + y2, pathLength: 1
        }, "arbol__arista" + (nodo.podada ? " arbol__arista--podada" : "")));
        if (eleccion !== undefined && eleccion !== null) {
          var e = svg("g", { transform: "translate(" + (x1 + x2) / 2 + " " + (y1 + y2) / 2 + ")" },
            "arbol__eleccion" + (nodo.podada ? " arbol__eleccion--podada" : ""));
          var largo = Array.from(String(eleccion).replace(/\uFE0F/g, "")).length;
          var w = Math.max(15, 6 + 7.5 * largo);
          e.appendChild(svg("rect", { x: -w / 2, y: -8, width: w, height: 16, rx: 5 }));
          e.appendChild(svg("text", {})).textContent = String(eleccion);
          nodo.etiquetaArista = elecciones.appendChild(e);
        }
        if (nodo.corte) {
          // Las tijeras, cerca del hijo: ahí se corta la rama
          var t = 0.78;
          nodo.tijera = elecciones.appendChild(svg("text", { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t }, "arbol__tijera"));
          nodo.tijera.textContent = "✂";
        }
      }
      var g = svg("g", { transform: "translate(" + x + " " + y + ")" }, "nodo" +
        (!nodo.hijos.length ? " nodo--hoja" : "") + (nodo.podada ? " nodo--podado" : ""));
      var cuerpo = g.appendChild(svg("g", {}, "nodo__cuerpo"));
      cuerpo.appendChild(svg("circle", { r: R + 5 }, "nodo__anillo"));
      cuerpo.appendChild(svg("circle", { r: R }, "nodo__circulo"));
      var texto = textoDe(nodo);
      var n = cuerpo.appendChild(svg("text", {}, "nodo__n"));
      n.textContent = texto;
      var letras = Array.from(texto.replace(/\uFE0F/g, "")).length;
      if (opciones.letra) n.style.fontSize = opciones.letra + "px";
      else if (letras >= 3) n.style.fontSize = Math.min(14, Math.floor((2 * R - 5) / (0.62 * letras))) + "px";
      var pildora = cuerpo.appendChild(svg("g", {}, "nodo__pildora"));
      pildora.appendChild(svg("rect", { x: -16, y: R + 3, width: 32, height: PILDORA, rx: 8 }));
      nodo.textoPildora = pildora.appendChild(svg("text", { x: 0, y: R + 3 + PILDORA / 2 }));
      if (opciones.tocar) {
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", opciones.titulo ? opciones.titulo(nodo) : opciones.nombre + "(" + nodo.n + ")");
        g.classList.add("nodo--tocable");
        g.addEventListener("click", function () { opciones.tocar(nodo); });
        g.addEventListener("keydown", function (ev) {
          if (ev.key !== "Enter" && ev.key !== " ") return;
          ev.preventDefault();
          opciones.tocar(nodo);
        });
      }
      nodo.g = g;
      capa.appendChild(g);
    });
    cont.textContent = "";
    cont.appendChild(dibujo);

    var pildoraDe = opciones.pildora || function (nodo, visible, listo) { return listo ? String(nodo.valor) : null; };

    function conjunto(lista) {
      var s = {};
      (lista || []).forEach(function (id) { s[typeof id === "object" ? id.id : id] = true; });
      return s;
    }

    function pintar(e) {
      var vistos = e.vistos ? conjunto(e.vistos) : null;
      var listos = e.listos ? conjunto(e.listos) : null;
      var llamadas = e.llamadas === undefined ? nodos.length : e.llamadas;
      var devueltos = e.devueltos === undefined ? nodos.length : e.devueltos;
      // El camino de la que corre hasta arriba: las que esperan
      var camino = {};
      for (var m = e.actual !== undefined ? nodos[e.actual] : null; m; m = m.padre) camino[m.id] = true;
      nodos.forEach(function (nodo) {
        var visible = vistos ? !!vistos[nodo.id] : nodo.pre < llamadas;
        var listo = !nodo.podada && (listos ? !!listos[nodo.id] : nodo.post < devueltos);
        var actual = nodo.id === e.actual;
        var enCamino = !!camino[nodo.id] && !listo;
        var g = nodo.g;
        var antes = !g.classList.contains("nodo--oculto");
        g.classList.toggle("nodo--oculto", !visible);
        g.classList.toggle("nodo--activo", visible && actual && !listo);
        g.classList.toggle("nodo--devuelve", visible && actual && listo);
        g.classList.toggle("nodo--espera", visible && !actual && enCamino);
        g.classList.toggle("nodo--listo", visible && listo);
        g.classList.toggle("nodo--nuevo", visible && !antes && !e.quieto);
        g.classList.toggle("nodo--puede", visible && actual && !!e.puede);
        var texto = visible && !nodo.podada ? pildoraDe(nodo, visible, listo) : null;
        var tenia = g.classList.contains("nodo--con-pildora");
        g.classList.toggle("nodo--con-pildora", texto !== null);
        g.classList.toggle("nodo--pildora-nueva", texto !== null && !tenia && !e.quieto);
        if (texto !== null) nodo.textoPildora.textContent = texto;
        if (nodo.arista) {
          var a = nodo.arista;
          var veia = a.style.visibility !== "hidden";
          a.style.visibility = visible ? "" : "hidden";
          a.classList.toggle("arbol__arista--camino", visible && enCamino);
          a.classList.toggle("arbol__arista--nueva", visible && !veia && !e.quieto);
          if (nodo.etiquetaArista) {
            nodo.etiquetaArista.style.visibility = visible ? "" : "hidden";
            nodo.etiquetaArista.classList.toggle("arbol__eleccion--camino", visible && enCamino);
          }
          if (nodo.tijera) nodo.tijera.style.visibility = visible ? "" : "hidden";
        }
      });
    }

    // Resalta unos nodos (y, si se pide, todo lo que cuelga de ellos)
    function marcar(lista, conRamas) {
      var marcados = {}, sombra = {};
      lista.forEach(function (nodo) {
        marcados[nodo.id] = true;
        if (!conRamas) return;
        (function bajar(m) {
          m.hijos.forEach(function (h) { sombra[h.id] = true; bajar(h); });
        })(nodo);
      });
      nodos.forEach(function (nodo) {
        nodo.g.classList.toggle("nodo--marcado", !!marcados[nodo.id]);
        nodo.g.classList.toggle("nodo--sombra", !!sombra[nodo.id] && !marcados[nodo.id]);
        if (nodo.arista) nodo.arista.classList.toggle("arbol__arista--marcada", !!sombra[nodo.id]);
      });
    }

    function sacudir(nodo) {
      nodo.g.classList.remove("nodo--error");
      void nodo.g.getBoundingClientRect();
      nodo.g.classList.add("nodo--error");
    }

    function clase(nodo, nombre, si) { nodo.g.classList.toggle(nombre, si === undefined ? true : !!si); }

    return { raiz: raiz, nodos: nodos, pintar: pintar, marcar: marcar, sacudir: sacudir, clase: clase, dibujo: dibujo };
  }

  window.Arbol = { armar: armar, crear: crear };
})();
