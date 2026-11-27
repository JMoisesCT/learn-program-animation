# Traducir una lección al inglés (instrucciones para un agente)

Cómo se tradujeron Recursión, Texto a fondo, Listas, Otras estructuras, Búsquedas, Ordenar y Errores (ver «Curso en inglés» en `CLAUDE.md`):

1. Rama `mejora/ingles-<tema>` desde `main`.
2. Medir los retos del tema en español: `node herramientas/responder-retos.js <tema>/<lección>` para cada lección (en segundo plano; tarda).
3. Revisar las piezas compartidas que usa el tema (`assets/js/*.js`) y darles su texto en inglés con `lang="en"`.
4. Copiar este archivo a la carpeta temporal, completar la sección **«Topic»** del final (títulos, carpetas, nombres de Python y glosario del tema) y lanzar **un agente por lección** en paralelo con: «Read the brief at <ruta> and follow it exactly. Your lesson: …» más lo propio de la lección (qué palabras importan, qué juego probar).
5. Mientras traducen: la tarjeta del tema en `en/index.html` (antes de la de aviso), el «Next: <Tema> →» de la última lección traducida, `CLAUDE.md`.
6. Desde Otras estructuras, el arreglo de los retos lo hace cada agente en su lección, en los dos idiomas: añadir al encargo una sección «Phase 2» con las medidas en español (ver el registro del 2026-11-24 en `PENDIENTES.md`). Al terminar cada agente: arreglar en los dos idiomas los retos que no caben al responder (ver «También después de responder» en `CLAUDE.md`), probar con `seguir-consola.js`, `PENDIENTES.md`, PR y fusión.

Los agentes no deben hacer commit ni tocar otros archivos: el coordinador sube todo. Lo de abajo va en inglés porque es lo que lee el agente.

---

# Translating one lesson to English

Repo: the current working directory (static HTML/CSS/JS course, no build). Read `CLAUDE.md` first, especially the section «Curso en inglés» (how to translate a lesson, glossary, folder layout, tests) and the «Plan» of this topic. The Spanish course is in `lecciones/`, the English one in `en/`. Look at an already translated lesson of the previous topic and its Spanish original to see the style and depth of a finished translation.

## Your job
Translate exactly ONE lesson (given at the end): copy the Spanish file to its English path and translate everything visible, the comments, and the Python code. Then test it. Do not edit any other file: not the Spanish lesson, not `assets/`, not `en/index.html`, not other English lessons, not CLAUDE.md / PENDIENTES.md. Do not commit or push. If a shared piece (`assets/js/*.js`, `base.css`) still shows Spanish text in your lesson, do NOT fix it: report it (file, line, the string) in your final answer.

## Rules (from CLAUDE.md, summarized)
- `<html lang="en">`, `<title>… · Learn to program</title>`, translated meta description, keep `<meta name="author" content="Moisés C.">`.
- Asset paths go up one more level than in Spanish: topic index `en/lessons/<topic>/index.html` uses `../../../assets/`; sublessons `en/lessons/<topic>/<folder>/index.html` use `../../../../assets/`. The × (close) link and any link to the home page go to `en/index.html` (count the `../` correctly).
- Same `data-leccion`, same step ids, same number of steps, same classes and logic. Only text, Python code and whatever depends on them change.
- Python code in English: names (`cuenta_regresiva` → `countdown`, `nota` → `grade`…) and strings inside the code (`"Hola"` → `"Hello"`). Then **recalculate** everything that depends on them: what is printed, `len()`, the answers the JS checks, the **columns** where chips/tokens/marks fall (`columna:`, `Codigo.pausas`, `Codigo.valores`, `Codigo.piezaEnLinea` texts, `espera:` texts, `falta:` with `▢`, `recibe`), highlighted pieces, the `huecos` of `Python.escribir`, option texts compared in JS, regexes that look for Spanish words, etc. Search the JS for every Spanish string and every number that is a column/index into a code line.
- Keep grades 0–20 (pass with 11), people names exactly as in Spanish, accents included (Ana, Luis, Sofía, Iván: skip them in the Spanish-text check), and exercise numbers. Money in `$`.
- US English, simple, short sentences, second person. Glossary: Run ▸ / Run line ▸ / ▶ Run all / ⏸ Pause / ↺ Reset / ↺ Try another option / ↺ Repeat the lesson / Next: X → / Back / Continue / Check / Finish / End of program / Send; Reto → Challenge; vuelta (loop) → round; ¡Lección completada! → Lesson complete!; Consola → Console; Salida → Output; caja → box; toca → tap; espacio en blanco → blank; pila de llamadas → call stack; tarjeta → card; «…» → “…”.
- **Choosing English words**: prefer (1) a word/name that is the same in English; (2) an English word with the same length and the same property the exercise relies on (same number of words in a sentence, same repeated word, same alphabetical order relations — `sorted()` of words changes with different words! —, same letters for `list("hola")`, a 4-letter word); (3) otherwise a different one and recalculate every number and option. Write down for each exercise which property it relies on before replacing. Verify every printed output, sorted order, index and error against real Python with a tiny `python3` script.

## Topic (fill in for each topic)
- Glossary of the topic (Spanish → English), on top of the one in `CLAUDE.md`.
- Python names shared across the topic's lessons (so all lessons match), e.g. for Lists: `notas` → `grades`, `nombres` → `names`, `tablero` → `board`, «fin» → `"done"`. Never a builtin (`sum`, `list`, `open`, `max`…) or a reserved word as a name.
- Lesson titles and folders in English, for the first-step label `<Topic> N/M · <Title>`, the `<title>` and the «Next» links; the last lesson's final button is «Back to the course →» to `en/index.html`.
- Shared pieces of the topic already in English with `lang="en"`.
- The scratchpad is shared with the other translators working in parallel: name your scratch files with your lesson's folder as a prefix.

## Tests (required)
Run, for your lesson (`<path>` is e.g. `en/lists/change`; the Spanish one is `listas/cambiar`):
- `node herramientas/recorrer-leccion.js <path> tocar` and the same for the Spanish original; compare: anything that only the English version reports (NO CABE, se sale, JS errors) comes from your translation and must be fixed (often a longer English line or text: shorten it).
- `node herramientas/seguir-consola.js <path> detalle` and the Spanish one; the console must not move in English if it doesn't in Spanish.
- `node herramientas/responder-retos.js <path>` (answers every «Check» until right, measures after answering); compare with Spanish `node herramientas/responder-retos.js listas/<folder>` — differences that only English has must be fixed.
- A quick Playwright pass (Chromium is preinstalled: `require('playwright')`) going through every step, answering challenges right and wrong, checking there are no page errors and no Spanish text visible (search the rendered text for á é í ó ú ñ ¿ ¡ and common Spanish words like « la », « el », « de », «Toca», «línea», «vuelve», «espera», «sigue»). Screenshots go in `capturas/<your-lesson>/` (git-ignored). The scratchpad is shared with other translators working in parallel: name your scratch files with your lesson's folder as a prefix (e.g. `lists-change-pw.js`) so nobody overwrites them.
- Check the `<head>` of your file: exactly one `<style>` and one `</style>`. A doubled `<style>` line (easy to get with a copy-and-replace script) turns into text inside the CSS and silently cancels the first rule after it (in Errors 1/7 the buttons of the summary lost their centering; in the tic-tac-toe, the color of the O).
These tools take minutes; run them in the background if useful.

## Final answer
Short report: file written; the English words and Python names you chose, and for each changed word which property it keeps; adaptations (anything recalculated or changed for English, texts shortened to fit); test results compared with Spanish (what differs and why); any Spanish left in shared pieces (file:line). Do not paste the file.
