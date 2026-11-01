/* probar-caso.js — prueba un caso de «Problemas resueltos» en el navegador (Playwright).
   No es parte del sitio: es una herramienta para quien lo edita.

   Uso (desde cualquier carpeta; Playwright ya está en el entorno de la nube):
     node herramientas/probar-caso.js cuenta            un caso: problemas/cuenta/
     node herramientas/probar-caso.js cuenta reducir    lo mismo con movimiento reducido
     node herramientas/probar-caso.js catalogo          el catálogo y sus filtros

   Revisa a 1366×657, 1280×800 y 390×844:
   - cada bloque (.panel) cabe en la pantalla (alto ≤ ventana − cabecera) y nada se corta
     dentro de una tarjeta (.concepto, .hoja-enunciado, la escena…);
   - no hay desborde horizontal ni errores de JavaScript o de consola;
   - ninguna línea del código del reproductor llega a las barras del mapa de calor;
   - el reproductor llega al final con cada dato de entrada (imprime la consola, para
     compararla con python3) y se puede saltar atrás y adelante;
   - el botón que recorre el diagrama de flujo funciona.
   Guarda capturas en capturas/<caso>-<ancho>-<bloque>.png (carpeta ignorada por git):
   mirarlas siempre; la prueba no ve lo que se ve mal.
*/
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const RAIZ = path.resolve(__dirname, "..");
const CAPTURAS = path.join(RAIZ, "capturas");
fs.mkdirSync(CAPTURAS, { recursive: true });
const caso = process.argv[2];
const reducir = process.argv[3] === "reducir";
const TAMANOS = [[1366, 657], [1280, 800], [390, 844]];
const CABECERA = 48; // --cab: 3rem

if (!caso) {
  console.log("Uso: node herramientas/probar-caso.js <carpeta-del-caso | catalogo> [reducir]");
  process.exit(1);
}

function url(rel) { return "file://" + path.join(RAIZ, "problemas", rel); }

async function probarCatalogo(b) {
  for (const [w, h] of [[1366, 657], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errores = [];
    p.on("pageerror", (e) => errores.push(e.message));
    p.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
    await p.goto(url("index.html"));
    await p.screenshot({ path: path.join(CAPTURAS, `catalogo-${w}.png`), fullPage: true });
    const visibles = () => p.$$eval(".caso-tarjeta", (ts) => ts.filter((t) => t.offsetParent).map((t) => t.querySelector("h3").textContent + " (" + t.dataset.nivel + ")"));
    console.log(`${w}: todos →`, (await visibles()).join(" · "));
    for (const n of ["1", "2", "3", "4", "5"]) {
      await p.click(`[data-filtro="nivel"] [data-nivel="${n}"]`);
      const v = await visibles();
      const vacio = await p.$eval("#casos-vacio", (e) => !e.hidden);
      console.log(`${w}: ${"★".repeat(Number(n))} →`, v.length ? v.join(" · ") : "(ninguno)", vacio ? "· aviso de vacío" : "");
    }
    const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
    console.log(`${w}: ancho ${ancho}${ancho > w ? " ← DESBORDA" : ""}`, errores.length ? "ERRORES: " + errores.join(" | ") : "sin errores");
    await p.close();
  }
}

async function probarCaso(b) {
  for (const [w, h] of TAMANOS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reducir ? "reduce" : "no-preference" });
    const p = await ctx.newPage();
    const errores = [];
    p.on("pageerror", (e) => errores.push("pageerror: " + e.message));
    p.on("console", (m) => { if (m.type() === "error") errores.push("console: " + m.text()); });
    await p.goto(url(caso + "/index.html"));
    await p.waitForTimeout(400);
    const sufijo = reducir ? "-r" : "";

    // Cada bloque, a la vista
    const ids = await p.$$eval(".panel", (ps) => ps.map((x) => x.id));
    for (const id of ids) {
      await p.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
      await p.waitForTimeout(900);
      const info = await p.evaluate((id) => {
        const el = document.getElementById(id);
        const cortes = [];
        el.querySelectorAll(".concepto, .rep__escena, .rep__lado, .hoja-enunciado, .mas__dibujo").forEach((c) => {
          const st = getComputedStyle(c);
          if (st.display === "none") return;
          if (c.scrollHeight > c.clientHeight + 2 && st.overflowY !== "visible") cortes.push(c.className.split(" ")[0] + " " + c.scrollHeight + ">" + c.clientHeight);
        });
        return { alto: Math.round(el.getBoundingClientRect().height), ancho: document.documentElement.scrollWidth, cortes };
      }, id);
      const disponible = h - CABECERA;
      const mal = info.alto > disponible + 1 || info.ancho > w || info.cortes.length;
      console.log(`${w}x${h} ${id}: alto ${info.alto}/${disponible}` + (info.ancho > w ? ` DESBORDA ${info.ancho}` : "") +
        (info.cortes.length ? " CORTA " + info.cortes.join(" | ") : "") + (mal ? "  ← REVISAR" : ""));
      await p.screenshot({ path: path.join(CAPTURAS, `${caso}-${w}-${id}${sufijo}.png`) });
    }

    // El código del reproductor no debe llegar a las barras del mapa de calor
    await p.evaluate(() => document.getElementById("ejecucion").scrollIntoView());
    if (w < 1024) { await p.click(".rep__pestana:has-text('Código')"); await p.waitForTimeout(300); }
    const tocan = await p.evaluate(() => {
      const r = [];
      const calores = document.querySelectorAll(".rep__calor");
      document.querySelectorAll(".rep__codigo .linea").forEach((l, i) => {
        const rango = document.createRange();
        rango.selectNodeContents(l);
        const fin = rango.getBoundingClientRect().right;
        const barra = calores[i] && calores[i].getBoundingClientRect().left;
        if (barra && fin > barra - 2) r.push((i + 1) + ": " + l.textContent.trim());
      });
      return r;
    });
    if (tocan.length) console.log(`  ${w}: líneas que llegan al mapa de calor ← REVISAR\n    ` + tocan.join("\n    "));

    // Cada dato de entrada, paso a paso hasta el final
    const chips = await p.$$(".rep__chip");
    for (let k = 0; k < chips.length; k++) {
      await chips[k].click();
      const total = await p.$eval(".rep__barra", (x) => Number(x.max) + 1);
      for (let s = 0; s < total; s++) { await p.click(".rep__btn--paso"); await p.waitForTimeout(w < 1024 ? 120 : 220); }
      await p.waitForTimeout(1200);
      const fin = await p.evaluate(() => ({
        nombre: document.querySelector(".rep__chip--activo").textContent,
        salida: [...document.querySelectorAll(".rep__salida-linea")].map((x) => x.textContent),
        restos: document.querySelectorAll("body > .vuelo, body > [class*='vuela']").length
      }));
      console.log(`  ${fin.nombre}: ${fin.salida.join(" | ")}` + (fin.restos ? `  (quedaron ${fin.restos} vuelos) ← REVISAR` : ""));
      if (w >= 1024) await p.screenshot({ path: path.join(CAPTURAS, `${caso}-${w}-rep${k}${sufijo}.png`) });
      // Rebobinar y saltar no debe romper la escena
      await p.$eval(".rep__barra", (x) => { x.value = "2"; x.dispatchEvent(new Event("input")); });
      await p.$eval(".rep__barra", (x) => { x.value = x.max; x.dispatchEvent(new Event("input")); });
    }
    if (w < 1024) {
      for (const [n, v] of [[1, "escena"], [2, "codigo"], [3, "lado"]]) {
        const b2 = await p.$(`.rep__pestana:nth-child(${n})`);
        if (!b2) continue;
        await b2.click();
        await p.waitForTimeout(300);
        await p.screenshot({ path: path.join(CAPTURAS, `${caso}-${w}-rep-${v}${sufijo}.png`) });
      }
    }

    // El recorrido del diagrama de flujo
    if (await p.$("#recorrer")) {
      await p.evaluate(() => document.getElementById("idea").scrollIntoView());
      await p.waitForTimeout(500);
      await p.click("#recorrer");
      await p.waitForTimeout(2500);
      console.log("  recorrido:", await p.$eval("#recorrido-nota", (x) => x.textContent || "(sin nota)"));
    }
    console.log(errores.length ? "  ERRORES:\n  " + errores.join("\n  ") : "  sin errores");
    await ctx.close();
  }
}

(async () => {
  const b = await chromium.launch();
  try {
    if (caso === "catalogo") await probarCatalogo(b);
    else await probarCaso(b);
  } finally {
    await b.close();
  }
})();
