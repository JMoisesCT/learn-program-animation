/* responder-retos.js — responde los pasos con «Comprobar» de una lección y mide si el paso
   sigue cabiendo después de responder (Playwright). No es parte del sitio.

   Uso:
     node herramientas/responder-retos.js bucles/patrones            1366×657, 1280×800, 1024×700 y 390×844
     node herramientas/responder-retos.js en/loops/patterns          el curso en inglés
     node herramientas/responder-retos.js bucles/patrones 1366x657   solo ese tamaño
     node herramientas/responder-retos.js bucles/patrones todas      también las respuestas malas

   En cada paso con data-comprobar prueba las combinaciones de opciones (un grupo de
   radios por fieldset; hasta 64), toca «Comprobar» y espera a las animaciones. Una
   respuesta es buena si aparece un .feedback--ok. Mide:
   - escritorio (≥1024): el alto del paso frente a lo que deja la pantalla entre la
     cabecera y el pie (como recorrer-leccion.js);
   - móvil: desde la primera opción visible hasta lo último visible de la tarjeta (el
     mensaje, «Probar otra opción»): lo que el alumno tiene que ver junto después de
     responder, frente al alto de la pantalla.
   Con la buena, siempre; con «todas», también cada mala (la peor de cada paso).
   Capturas de la buena en capturas/retos/<lección>/<ancho>-<paso>.png.
*/
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const RAIZ = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const leccion = args[0];
const todas = args.includes("todas");
if (!leccion) {
  console.log("Uso: node herramientas/responder-retos.js <tema[/sublección]> [WxH…] [todas]");
  process.exit(1);
}
const archivo = /^en\//.test(leccion) ? path.join(RAIZ, "en", "lessons", leccion.slice(3), "index.html")
  : path.join(RAIZ, "lecciones", leccion, "index.html");
const CAPTURAS = path.join(RAIZ, "capturas", "retos", leccion.replace(/\//g, "-"));
fs.mkdirSync(CAPTURAS, { recursive: true });
const tamArg = args.filter((a) => /^\d+x\d+$/.test(a)).map((a) => a.split("x").map(Number));
const TAMANOS = tamArg.length ? tamArg : [[1366, 657], [1280, 800], [1024, 700], [390, 844]];

function medir(p, w, h) {
  return p.evaluate(([w, h]) => {
    const paso = document.querySelector(".paso:not([hidden])");
    const pie = document.querySelector(".leccion-pie");
    const cab = document.querySelector(".leccion-cabecera");
    const disponible = h - (pie ? pie.offsetHeight : 0) - (cab ? cab.offsetHeight : 0);
    const ok = !!paso.querySelector(".feedback--ok");
    if (w >= 1024) return { ok, alto: Math.round(paso.getBoundingClientRect().height), disponible };
    // Móvil: de la primera opción visible a lo último visible de la tarjeta
    const visible = (e) => e.offsetParent && e.getBoundingClientRect().height > 0;
    const opcion = [...paso.querySelectorAll(".opcion")].find(visible);
    const tarjeta = (opcion && opcion.closest(".tarjeta")) || paso;
    let fin = 0;
    tarjeta.querySelectorAll("*").forEach((e) => { if (visible(e)) fin = Math.max(fin, e.getBoundingClientRect().bottom); });
    const inicio = opcion ? opcion.getBoundingClientRect().top : tarjeta.getBoundingClientRect().top;
    return { ok, alto: Math.round(fin - inicio), disponible };
  }, [w, h]);
}

(async () => {
  const b = await chromium.launch();
  const html = fs.readFileSync(archivo, "utf8");
  const id = (html.match(/data-leccion="([^"]+)"/) || [])[1];
  const url = "file://" + archivo;
  let avisos = 0;
  for (const [w, h] of TAMANOS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, locale: /^en\//.test(leccion) ? "en-US" : "es-PE" });
    const p = await ctx.newPage();
    const errores = [];
    p.on("pageerror", (e) => errores.push(e.message));
    await p.goto(url);
    const pasos = await p.$$eval(".paso", (ps) => ps.map((x, i) => ({ i, id: x.id, comprobar: x.hasAttribute("data-comprobar") })));
    const total = pasos.length;
    const abrir = async (i) => {
      await p.evaluate(([id, i, total]) => {
        localStorage.setItem("lpa:progreso", JSON.stringify({ [id]: { paso: i, maximo: i, total } }));
      }, [id, i, total]);
      await p.goto(url);
      await p.waitForTimeout(900);
    };
    for (const paso of pasos.filter((x) => x.comprobar)) {
      await abrir(paso.i);
      // Grupos de radios del paso (por name), con sus valores
      const grupos = await p.$$eval(".paso:not([hidden]) input[type=radio]", (rs) => {
        const g = {};
        rs.forEach((r) => { (g[r.name] = g[r.name] || []).push(r.value); });
        return Object.entries(g);
      });
      if (!grupos.length) { console.log(`${w} #${paso.id}: sin opciones de radio, no se responde`); continue; }
      let combos = [[]];
      grupos.forEach(([n, vs]) => { combos = combos.flatMap((c) => vs.map((v) => c.concat([[n, v]]))); });
      combos = combos.slice(0, 64);
      let buena = null, peor = null;
      for (const c of combos) {
        await abrir(paso.i);
        for (const [n, v] of c) {
          await p.click(`.paso:not([hidden]) input[name="${n}"][value="${v}"]`, { force: true });
        }
        await p.waitForTimeout(150);
        await p.click('[data-accion="continuar"]');
        await p.waitForTimeout(2200);
        const m = await medir(p, w, h);
        m.combo = c.map(([, v]) => v).join(" + ");
        if (m.ok) {
          buena = m;
          await p.screenshot({ path: path.join(CAPTURAS, `${w}-${String(paso.i).padStart(2, "0")}.png`), fullPage: w < 600 });
          if (!todas) break;
        } else if (!peor || m.alto > peor.alto) peor = m;
      }
      const linea = (rot, m) => {
        const mal = m.alto > m.disponible;
        if (mal) avisos++;
        return `${rot} «${m.combo}» ${m.alto}/${m.disponible}${mal ? " ← NO CABE (+" + (m.alto - m.disponible) + ")" : ""}`;
      };
      console.log(`${w} #${paso.id}: ` + (buena ? linea("buena", buena) : "NINGUNA COMBINACIÓN ACIERTA") +
        (todas && peor ? " · " + linea("peor mala", peor) : ""));
    }
    if (errores.length) console.log("  ERRORES: " + [...new Set(errores)].join(" | "));
    await ctx.close();
  }
  await b.close();
  console.log(avisos ? `${avisos} aviso(s)` : "todo cabe");
})();
