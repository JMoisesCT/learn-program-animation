/* llenar-consola.js — llena las consolas que crecen y mide si la página tuvo que bajar.
   No es parte del sitio: es una herramienta para quien lo edita.

   Uso:
     node herramientas/llenar-consola.js              los casos de abajo, en español, en 5 tamaños
     node herramientas/llenar-consola.js en           los mismos, en el curso en inglés
     node herramientas/llenar-consola.js 1366x657     solo ese tamaño

   recorrer-leccion.js y seguir-consola.js no escriben datos en una consola que los pide
   (BucleInput). Esta herramienta sí: en cada caso de CASOS escribe los datos uno por uno
   (o adivina el número buscando a la mitad, o ejecuta toda la traza) y al final mide si la
   página bajó (scrollY) y si el paso se pasa del pie. Para probar otra lección, añadir su
   caso a CASOS: la ruta, su data-leccion, el número del paso (desde 0), el prefijo de los
   ids de su BucleInput (pre-campo, pre-enviar, pre-registro) y los datos, o traza: el
   prefijo de su botón «Ejecutar todo». Capturas en capturas/llenar-*.png.
*/
const path = require("path");
const { chromium } = require("playwright");
const RAIZ = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const en = args.includes("en");
const tam = args.filter((a) => /^\d+x\d+$/.test(a)).map((a) => a.split("x").map(Number));
const TAMANOS = tam.length ? tam : [[1366, 657], [1390, 790], [1460, 860], [1640, 900], [1680, 895]];
const CASOS = [
  { l: en ? "en/lessons/loops/conditions" : "lecciones/bucles/condiciones", id: "bucles-condiciones", paso: 3, pre: "rc", datos: ["30", "40", "10", "50"] },
  { l: en ? "en/lessons/loops/conditions" : "lecciones/bucles/condiciones", id: "bucles-condiciones", paso: 2, pre: "ap", datos: ["12", "8", "15", "11", "20"] },
  { l: en ? "en/lessons/loops/break" : "lecciones/bucles/break", id: "bucles-break", paso: 2, pre: "s", datos: ["hola", "MOISES", "tengo", "sueño", "otra", "mas", "y mas", "uno", "dos", "tres", en ? "quit" : "salir"] },
  { l: en ? "en/lessons/loops/nested" : "lecciones/bucles/anidados", id: "bucles-anidados", paso: 1, traza: "tb" },
  { l: en ? "en/lessons/loops/project" : "lecciones/bucles/proyecto", id: "bucles-proyecto", paso: 5, pre: "t", adivinar: true },
  { l: en ? "en/lessons/loops/project" : "lecciones/bucles/proyecto", id: "bucles-proyecto", paso: 0, pre: "d", adivinar: true },
];
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of TAMANOS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, locale: en ? "en-US" : "es-PE" });
    const p = await ctx.newPage();
    const errores = [];
    p.on("pageerror", (e) => errores.push(e.message));
    for (const c of CASOS) {
      const url = "file://" + path.join(RAIZ, c.l, "index.html");
      await p.goto(url);
      await p.evaluate(([id, i]) => localStorage.setItem("lpa:progreso", JSON.stringify({ [id]: { paso: i, maximo: i, total: 9 } })), [c.id, c.paso]);
      await p.goto(url);
      await p.waitForTimeout(900);
      if (c.traza) {
        const rep = await p.$("#" + c.traza + "-reproducir");
        if (rep) { await rep.click(); }
        for (let k = 0; k < 120; k++) {
          await p.waitForTimeout(500);
          const listo = await p.evaluate((t) => document.querySelector("#" + t + "-ejecutar").disabled, c.traza);
          if (listo) break;
        }
        await p.waitForTimeout(1500);
      } else if (c.adivinar) {
        let lo = 1, hi = 50;
        for (let k = 0; k < 12; k++) {
          if (!(await p.isVisible("#" + c.pre + "-campo"))) break;
          const g = Math.floor((lo + hi) / 2);
          await p.fill("#" + c.pre + "-campo", String(g));
          await p.click("#" + c.pre + "-enviar");
          await p.waitForTimeout(700);
          const ult = await p.evaluate((pre) => { const r = document.querySelector("#" + pre + "-registro"); return r.lastElementChild ? r.lastElementChild.textContent : ""; }, c.pre);
          if (/alto|Higher/i.test(ult)) lo = g + 1; else if (/bajo|Lower/i.test(ult)) hi = g - 1; else break;
        }
        await p.waitForTimeout(1200);
      } else {
        for (const d of c.datos) {
          if (!(await p.isVisible("#" + c.pre + "-campo"))) break;
          await p.fill("#" + c.pre + "-campo", d);
          await p.click("#" + c.pre + "-enviar");
          await p.waitForTimeout(600);
        }
        await p.waitForTimeout(1200);
      }
      const r = await p.evaluate(() => {
        const paso = document.querySelector(".paso:not([hidden])");
        const pie = document.querySelector(".leccion-pie");
        const lim = window.innerHeight - pie.offsetHeight;
        // lo último visible de la salida
        const res = paso.querySelector(".lab__resultado");
        let fin = 0;
        res.querySelectorAll("*").forEach((e) => { if (e.offsetParent && e.getBoundingClientRect().height) fin = Math.max(fin, e.getBoundingClientRect().bottom); });
        return { scroll: Math.round(window.scrollY), pasoFin: Math.round(paso.getBoundingClientRect().bottom), finSalida: Math.round(fin), lim };
      });
      const mal = r.scroll > 0 || r.pasoFin > r.lim + 1;
      console.log(`${w}x${h} ${c.l.split("/").pop()} paso ${c.paso}: bajó ${r.scroll} px, fin del paso ${r.pasoFin}, fin de la salida ${r.finSalida}, pie en ${r.lim}${mal ? "  ← SE SALE" : ""}`);
      await p.screenshot({ path: `${RAIZ}/capturas/llenar-${en ? "en-" : ""}${c.l.split("/").pop()}-${c.paso}-${w}.png` });
    }
    if (errores.length) console.log("ERRORES", errores);
    await ctx.close();
  }
  await b.close();
})();
