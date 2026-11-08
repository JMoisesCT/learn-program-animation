/* recorrer-leccion.js — recorre una lección paso a paso en el navegador (Playwright).
   No es parte del sitio: es una herramienta para quien lo edita.

   Uso (desde cualquier carpeta):
     node herramientas/recorrer-leccion.js variables              lecciones/variables/index.html
     node herramientas/recorrer-leccion.js variables/formulas     una sublección
     node herramientas/recorrer-leccion.js variables tocar        además toca los botones de cada paso
     node herramientas/recorrer-leccion.js variables tocar 3      solo el paso 3 (desde 0)
     node herramientas/recorrer-leccion.js portada                la portada (index.html)

   Abre cada paso directamente (guarda en localStorage que el alumno llegó hasta ahí) a
   1366×657 y 390×844 y revisa:
   - si el paso cabe en la pantalla (escritorio; en el móvil solo informa el alto);
   - desborde horizontal de la página y elementos que se salen de su tarjeta;
   - errores de JavaScript o de consola.
   Con «tocar», toca uno a uno los botones visibles del paso (no los de navegación),
   espera a que terminen las animaciones y saca otra captura: así se ve dónde termina
   cada animación. Con movimiento reducido: añade «reducir».
   Capturas en capturas/lecciones/<lección>/<ancho>-<paso>[-tocado].png (ignorada por git):
   mirarlas siempre; la prueba no ve lo que se ve mal.
*/
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const RAIZ = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const leccion = args[0];
const tocar = args.includes("tocar");
const reducir = args.includes("reducir");
const soloPaso = args.find((a) => /^\d+$/.test(a));
if (!leccion) {
  console.log("Uso: node herramientas/recorrer-leccion.js <tema[/sublección] | portada> [tocar] [reducir] [paso]");
  process.exit(1);
}
const archivo = leccion === "portada" ? path.join(RAIZ, "index.html") : path.join(RAIZ, "lecciones", leccion, "index.html");
const nombre = leccion.replace(/\//g, "-");
const CAPTURAS = path.join(RAIZ, "capturas", "lecciones", nombre);
fs.mkdirSync(CAPTURAS, { recursive: true });
const TAMANOS = [[1366, 657], [390, 844]];

async function revisar(p, w, h) {
  return p.evaluate(([w, h]) => {
    const r = { ancho: document.documentElement.scrollWidth, salidas: [] };
    const paso = document.querySelector(".paso:not([hidden])");
    if (paso) {
      const pie = document.querySelector(".leccion-pie");
      const cab = document.querySelector(".leccion-cabecera");
      const disponible = h - (pie ? pie.offsetHeight : 0) - (cab ? cab.offsetHeight : 0);
      r.alto = Math.round(paso.getBoundingClientRect().height);
      r.disponible = disponible;
      r.titulo = (paso.querySelector(".paso__titulo") || {}).textContent || paso.id;
      // Elementos visibles que se salen del paso o de la pantalla, y cajas cuyo texto se
      // sale de ellas (scrollWidth > clientWidth sin barra de desplazamiento)
      const bp = paso.getBoundingClientRect();
      const nombreDe = (e) => (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : e.tagName.toLowerCase());
      paso.querySelectorAll("*").forEach((e) => {
        if (!e.offsetParent || e.closest("svg")) return;
        const be = e.getBoundingClientRect();
        if (be.width === 0 || be.height === 0) return;
        let dentroDeScroll = false;
        for (let a = e.parentElement; a && a !== paso; a = a.parentElement) {
          if (/(auto|scroll|hidden)/.test(getComputedStyle(a).overflowX)) { dentroDeScroll = true; break; }
        }
        if (dentroDeScroll) return;
        if (be.right > Math.min(bp.right, w) + 2 || be.left < Math.max(bp.left, 0) - 2) {
          r.salidas.push(nombreDe(e) + " «" + (e.textContent || "").trim().slice(0, 30) + "» " + Math.round(be.left) + "–" + Math.round(be.right));
        }
        const cs = getComputedStyle(e);
        if (e.children.length === 0 && cs.overflowX === "visible" && cs.display !== "inline" && e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 3 &&
            (cs.borderStyle !== "none" || cs.backgroundColor !== "rgba(0, 0, 0, 0)")) {
          r.salidas.push("texto fuera de " + nombreDe(e) + " «" + (e.textContent || "").trim().slice(0, 30) + "» " + e.scrollWidth + "/" + e.clientWidth);
        }
      });
      r.salidas = [...new Set(r.salidas)].slice(0, 6);
    }
    return r;
  }, [w, h]);
}

(async () => {
  const b = await chromium.launch();
  const html = fs.readFileSync(archivo, "utf8");
  const id = (html.match(/data-leccion="([^"]+)"/) || [])[1];
  for (const [w, h] of TAMANOS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reducir ? "reduce" : "no-preference" });
    const p = await ctx.newPage();
    const errores = [];
    p.on("pageerror", (e) => errores.push(e.message));
    p.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
    const url = "file://" + archivo;
    if (leccion === "portada") {
      await p.goto(url);
      await p.waitForTimeout(800);
      await p.screenshot({ path: path.join(CAPTURAS, `${w}-portada.png`), fullPage: true });
      const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
      console.log(`${w}: ancho ${ancho}${ancho > w ? " ← DESBORDA" : ""}`, errores.length ? "ERRORES: " + errores.join(" | ") : "sin errores");
      await ctx.close();
      continue;
    }
    await p.goto(url);
    const total = await p.$$eval(".paso", (ps) => ps.length);
    const ids = await p.$$eval(".paso", (ps) => ps.map((x) => x.id));
    for (let i = 0; i < total; i++) {
      if (soloPaso !== undefined && i !== +soloPaso) continue;
      errores.length = 0;
      if (i < total - 1) {
        await p.evaluate(([id, i, total]) => {
          localStorage.setItem("lpa:progreso", JSON.stringify({ [id]: { paso: i, maximo: total - 1, total } }));
        }, [id, i, total]);
        await p.goto(url);
      } else {
        await p.evaluate(([id, total]) => {
          localStorage.setItem("lpa:progreso", JSON.stringify({ [id]: { paso: total - 2, maximo: total - 1, total } }));
        }, [id, total]);
        await p.goto(url);
        await p.click('[data-accion="continuar"]', { force: true });
      }
      await p.waitForTimeout(1200);
      const r = await revisar(p, w, h);
      await p.screenshot({ path: path.join(CAPTURAS, `${w}-${String(i).padStart(2, "0")}.png`), fullPage: w < 600 });
      const cabe = w >= 1024 ? (r.alto > r.disponible ? ` ← NO CABE (${r.alto}/${r.disponible})` : "") : ` (alto ${r.alto})`;
      console.log(`${w} paso ${i} #${ids[i]} «${(r.titulo || "").trim().slice(0, 40)}»${cabe}${r.ancho > w ? " ← DESBORDA " + r.ancho : ""}`);
      r.salidas.forEach((s) => console.log("    se sale: " + s));
      if (tocar) {
        // Toca el primer botón visible que se haya tocado menos de 3 veces (un «Siguiente
        // paso ▸» se toca varias veces seguidas), hasta 8 toques en total
        const veces = {};
        let k = 0;
        for (let intento = 0; intento < 20 && k < 8; intento++) {
          const botones = await p.$$(".paso:not([hidden]) button:not([disabled]):not([data-accion]), .paso:not([hidden]) [role=button]");
          let bt = null, txt = "";
          for (const c of botones) {
            if (!(await c.isVisible())) continue;
            const t = ((await c.textContent()) || "").trim().slice(0, 30);
            if (/repetir|reiniciar|↺|volver a empezar/i.test(t)) continue;
            if ((veces[t] || 0) < 3) { bt = c; txt = t; break; }
          }
          if (!bt) break;
          veces[txt] = (veces[txt] || 0) + 1;
          try { await bt.click({ timeout: 1500 }); } catch (e) { continue; }
          await p.waitForTimeout(1600);
          k++;
          await p.screenshot({ path: path.join(CAPTURAS, `${w}-${String(i).padStart(2, "0")}-tocado${k}.png`), fullPage: w < 600 });
          const r2 = await revisar(p, w, h);
          const cabe2 = w >= 1024 && r2.alto > r2.disponible ? ` ← NO CABE (${r2.alto}/${r2.disponible})` : "";
          console.log(`    tocó «${txt}» → captura ${k}${cabe2}${r2.ancho > w ? " ← DESBORDA " + r2.ancho : ""}`);
          r2.salidas.forEach((s) => console.log("      se sale: " + s));
          if (k >= 8) break;
        }
      }
      if (errores.length) console.log("    ERRORES: " + errores.join(" | "));
    }
    await ctx.close();
  }
  await b.close();
})();
