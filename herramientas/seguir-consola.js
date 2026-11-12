/* seguir-consola.js — revisa que la consola no cambie de lugar mientras corre el código.
   No es parte del sitio: es una herramienta para quien lo edita.

   Uso (desde cualquier carpeta):
     node herramientas/seguir-consola.js                      todas las lecciones
     node herramientas/seguir-consola.js recursion/valores    una lección
     node herramientas/seguir-consola.js bucles 3             solo el paso 3 (desde 0)
     node herramientas/seguir-consola.js bucles 1366x657      solo en ese tamaño
     node herramientas/seguir-consola.js bucles detalle       además, qué cambió de alto en cada toque

   Abre cada paso (como recorrer-leccion.js) en varios tamaños y ejecuta el código: toca
   «Ejecutar línea ▸» hasta el final (o «Siguiente …», o «▶ Ejecutar»; si los botones
   esperan una respuesta, elige la primera opción; si hay un campo de la consola, escribe
   datos). Tras cada toque mide dónde quedó cada consola (.consola) y avisa cuando:
   - cambió de lado o de columna (su borde izquierdo se movió);
   - subió o bajó sin que la página se haya desplazado.
   Que la consola crezca hacia abajo al llenarse no cuenta: se mide su borde de arriba.
   Con «detalle» dice qué pieza de la tarjeta cambió de alto en ese toque (la causa).
   El resumen queda en capturas/consola/resumen.json (ignorada por git).
*/
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const RAIZ = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const detalle = args.includes("detalle");
const soloPaso = args.find((a) => /^\d+$/.test(a));
const tamArg = args.filter((a) => /^\d+x\d+$/.test(a)).map((a) => a.split("x").map(Number));
const TAMANOS = tamArg.length ? tamArg : [[1366, 657], [1440, 800], [1920, 950], [390, 844]];
const pedidas = args.filter((a) => !/^\d+$/.test(a) && !/^\d+x\d+$/.test(a) && a !== "detalle");
const UMBRAL = 3;       // px: menos que esto no se nota
const MAX_TOQUES = 90;
const DATOS = ["7", "12", "hola", "3", "20", "Ana", "15", "fin"];

function todas() {
  const r = [];
  (function bajar(dir, rel) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      if (e.isDirectory()) bajar(path.join(dir, e.name), rel ? rel + "/" + e.name : e.name);
      else if (e.name === "index.html" && rel) r.push(rel);
    });
  })(path.join(RAIZ, "lecciones"), "");
  return r.sort();
}
const lecciones = pedidas.length ? pedidas : todas();

// Lo que se mide en la página tras cada toque
function medir() {
  const paso = document.querySelector(".paso:not([hidden])");
  if (!paso) return null;
  const sy = window.scrollY;
  const caja = (e) => {
    const b = e.getBoundingClientRect();
    return { top: Math.round(b.top + sy), left: Math.round(b.left), alto: Math.round(b.height), ancho: Math.round(b.width) };
  };
  const consolas = [];
  paso.querySelectorAll(".consola").forEach((c, k) => {
    if (!c.offsetParent) return;
    const m = caja(c);
    m.k = k;
    // ¿Está pegada (sticky) ella o algo que la contiene? Entonces su lugar depende del desplazamiento
    let fija = false;
    for (let a = c; a && a !== paso.parentElement; a = a.parentElement) {
      if (/sticky|fixed/.test(getComputedStyle(a).position)) { fija = true; break; }
    }
    m.fija = fija;
    consolas.push(m);
  });
  // Alto de las piezas de la tarjeta, para saber qué empujó a la consola
  const piezas = {};
  const nombre = (e) => (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : e.tagName.toLowerCase()) + (e.id ? "#" + e.id : "");
  paso.querySelectorAll(".paso__intro, .lab__principal, .lab__visual, .lab__resultado, .lab > *, .lab__principal > *, .lab__visual > *, .lab__resultado > *, .tarjeta > *").forEach((e) => {
    if (!e.offsetParent) { piezas[nombre(e)] = 0; return; }
    piezas[nombre(e)] = Math.round(e.getBoundingClientRect().height);
  });
  return {
    paso: paso.id,
    sy: Math.round(sy),
    clases: paso.className.replace(/\bpaso\b|paso--entrando(-atras)?/g, "").trim(),
    consolas, piezas
  };
}

// Qué botón toca ahora: primero el de ejecutar paso a paso
function elegirBoton(usados) {
  const paso = document.querySelector(".paso:not([hidden])");
  const visibles = Array.from(paso.querySelectorAll("button, [role=button]")).filter((b) =>
    b.offsetParent && !b.disabled && b.getAttribute("aria-disabled") !== "true" && !b.hasAttribute("data-accion"));
  const texto = (b) => (b.textContent || "").trim();
  const marca = (b, tipo) => { b.setAttribute("data-toca", "1"); return { tipo, texto: texto(b).slice(0, 40) }; };
  paso.querySelectorAll("[data-toca]").forEach((b) => b.removeAttribute("data-toca"));
  const no = /↺|reiniciar|repetir|otra vez|de nuevo|ver la respuesta|pausa/i;
  let b = visibles.find((x) => /Ejecutar línea/.test(texto(x)));
  if (b) return marca(b, "linea");
  b = visibles.find((x) => /^Siguiente|▸/.test(texto(x)) && !no.test(texto(x)));
  if (b) return marca(b, "linea");
  b = visibles.find((x) => /▶/.test(texto(x)) && !no.test(texto(x)) && (usados[texto(x)] || 0) < 2);
  if (b) return marca(b, "todo");
  // Un campo de la consola: se escribe un dato
  const campo = Array.from(paso.querySelectorAll("input[type=text], input:not([type])")).find((c) => c.offsetParent && !c.disabled);
  if (campo && (usados["«campo»"] || 0) < 8) { campo.setAttribute("data-toca", "1"); return { tipo: "campo", texto: "«campo»" }; }
  // Opciones (predecir antes de ejecutar) y otros botones: cada uno, una vez
  b = visibles.find((x) => !no.test(texto(x)) && !/Enviar/.test(texto(x)) && !(usados[texto(x)] || 0));
  if (b) return marca(b, "otro");
  return null;
}

async function recorrerPaso(p, w, h) {
  const muestras = [];
  const usados = {};
  let m = await p.evaluate(medir);
  if (!m) return { muestras, avisos: [] };
  m.toque = "al entrar";
  muestras.push(m);
  let toques = 0, otros = 0, otroPaso = false;
  while (toques < MAX_TOQUES && !otroPaso) {
    const b = await p.evaluate(elegirBoton, usados);
    if (!b) break;
    if (b.tipo === "otro" && ++otros > 12) break;
    usados[b.texto] = (usados[b.texto] || 0) + 1;
    const vez = usados[b.texto];
    if (b.tipo === "campo") {
      const dato = DATOS[(usados[b.texto] - 1) % DATOS.length];
      // Se escribe el dato y se toca «Enviar» (Enter en un campo suelto pasaría de paso)
      await p.evaluate((dato) => {
        const c = document.querySelector("[data-toca]");
        c.focus();
        c.value = dato;
        c.dispatchEvent(new Event("input", { bubbles: true }));
        c.dispatchEvent(new Event("change", { bubbles: true }));
        const paso = document.querySelector(".paso:not([hidden])");
        const enviar = Array.from(paso.querySelectorAll("button")).find((x) => /Enviar/.test(x.textContent) && x.offsetParent && !x.disabled);
        if (enviar) enviar.click();
      }, dato);
      b.texto = "escribe «" + dato + "»";
    } else {
      // Con el.click() la página no se desplaza para buscar el botón: lo que se mueva, lo movió la lección
      await p.evaluate(() => document.querySelector("[data-toca]").click());
    }
    toques++;
    const esperas = b.tipo === "todo" ? 40 : 1;
    for (let e = 0; e < esperas; e++) {
      await p.waitForTimeout(b.tipo === "todo" ? 400 : 450);
      m = await p.evaluate(medir);
      if (!m || m.paso !== muestras[0].paso) { otroPaso = true; break; }
      m.toque = b.texto + (b.tipo === "todo" ? " +" + (e + 1) * 0.4 + " s" : " (" + vez + ")");
      muestras.push(m);
      if (b.tipo === "todo") {
        const sigue = await p.evaluate(() => !!Array.from(document.querySelectorAll(".paso:not([hidden]) button")).find((x) => /Pausa/.test(x.textContent) && x.offsetParent));
        if (!sigue && e >= 2) break;
      }
    }
  }
  // Un rato después del último toque (lo que se decide con retraso)
  await p.waitForTimeout(700);
  m = await p.evaluate(medir);
  if (m && m.paso === muestras[0].paso) { m.toque = "al terminar"; muestras.push(m); }

  const avisos = [];
  for (let i = 1; i < muestras.length; i++) {
    const a = muestras[i - 1], c = muestras[i];
    c.consolas.forEach((cc) => {
      const ca = a.consolas.find((x) => x.k === cc.k);
      if (!ca) return;
      const dx = cc.left - ca.left, dy = cc.top - ca.top;
      // Pegada y la página se desplazó: se mira dónde quedó en la pantalla
      const dsy = c.sy - a.sy;
      let dyVista = cc.fija ? dy - dsy : dy;
      // Pegada, la página bajó y ella subió en la pantalla, pero menos que la página: aún no
      // había llegado a su tope y se desplazó con todo lo demás. No es un salto
      if (cc.fija && dsy !== 0 && dyVista * dsy <= 0 && Math.abs(dyVista) <= Math.abs(dsy)) dyVista = 0;
      const lado = Math.abs(dx) > UMBRAL || Math.abs(cc.ancho - ca.ancho) > 40;
      if (!lado && Math.abs(dyVista) <= UMBRAL) return;
      const causa = [];
      Object.keys(c.piezas).forEach((n) => {
        const d = c.piezas[n] - (a.piezas[n] || 0);
        if (Math.abs(d) > UMBRAL) causa.push(n + " " + (d > 0 ? "+" : "") + d);
      });
      avisos.push({
        i, toque: c.toque, consola: cc.k, lado, dx, dy: dyVista,
        clases: a.clases === c.clases ? "" : "«" + a.clases + "» → «" + c.clases + "»",
        causa: causa.slice(0, 8)
      });
    });
  }
  return { muestras, avisos, toques };
}

async function revisarLeccion(b, leccion) {
  const archivo = path.join(RAIZ, "lecciones", leccion, "index.html");
  const html = fs.readFileSync(archivo, "utf8");
  const id = (html.match(/data-leccion="([^"]+)"/) || [])[1];
  const url = "file://" + archivo;
  const salida = [];
  const resumen = [];
  for (const [w, h] of TAMANOS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const errores = [];
    p.on("pageerror", (e) => errores.push(e.message));
    p.on("dialog", (d) => d.dismiss().catch(() => {}));
    await p.goto(url);
    const ids = await p.$$eval(".paso", (ps) => ps.map((x) => x.id));
    const total = ids.length;
    for (let i = 0; i < total - 1; i++) {   // el último paso es el resumen
      if (soloPaso !== undefined && i !== +soloPaso) continue;
      errores.length = 0;
      await p.evaluate(([id, i, total]) => {
        localStorage.setItem("lpa:progreso", JSON.stringify({ [id]: { paso: i, maximo: total - 1, total } }));
      }, [id, i, total]);
      await p.goto(url);
      await p.waitForTimeout(900);
      const hay = await p.evaluate(() => !!document.querySelector(".paso:not([hidden]) .consola"));
      if (!hay) continue;
      let r;
      try { r = await recorrerPaso(p, w, h); } catch (e) { salida.push(`${leccion} ${w}×${h} paso ${i}: no se pudo recorrer (${e.message.split("\n")[0]})`); continue; }
      const lados = r.avisos.filter((a) => a.lado);
      const saltos = r.avisos.filter((a) => !a.lado);
      resumen.push({ leccion, tam: w + "x" + h, paso: i, id: ids[i], toques: r.toques, lados: lados.length, saltos: saltos.length,
        mayor: saltos.reduce((mx, a) => Math.max(mx, Math.abs(a.dy)), 0), avisos: r.avisos });
      if (r.avisos.length || errores.length) {
        salida.push(`${leccion} ${w}×${h} paso ${i} #${ids[i]} (${r.toques} toques): ` +
          (lados.length ? `CAMBIA DE LADO ×${lados.length} ` : "") +
          (saltos.length ? `se mueve ×${saltos.length} (hasta ${saltos.reduce((mx, a) => Math.max(mx, Math.abs(a.dy)), 0)} px)` : "") +
          (errores.length ? " ERRORES: " + errores.join(" | ") : ""));
        if (detalle) r.avisos.forEach((a) => salida.push(`    toque ${a.i} «${a.toque}» consola ${a.consola}: ${a.lado ? "lado dx " + a.dx + " " : ""}dy ${a.dy}${a.clases ? " " + a.clases : ""}${a.causa.length ? " · " + a.causa.join(", ") : ""}`));
      }
    }
    await ctx.close();
  }
  return { salida, resumen };
}

(async () => {
  const b = await chromium.launch();
  const cola = lecciones.slice();
  const resumen = [];
  let conAvisos = 0;
  async function obrero() {
    while (cola.length) {
      const l = cola.shift();
      try {
        const r = await revisarLeccion(b, l);
        r.salida.forEach((s) => console.log(s));
        if (!r.salida.length) console.log(`${l}: la consola no se mueve`);
        else conAvisos++;
        r.resumen.forEach((x) => resumen.push(x));
      } catch (e) { console.log(`${l}: ERROR ${e.message.split("\n")[0]}`); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(6, lecciones.length) }, obrero));
  await b.close();
  // El resumen, solo al revisarlas todas (varias pruebas a la vez no se lo pisan)
  if (!pedidas.length) {
    const dir = path.join(RAIZ, "capturas", "consola");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "resumen.json"), JSON.stringify(resumen, null, 1));
  }
  console.log(`\n${lecciones.length} lecciones, ${conAvisos} con avisos.` + (pedidas.length ? "" : " Resumen en capturas/consola/resumen.json"));
})();
