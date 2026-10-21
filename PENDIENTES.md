# Pendientes y registro de cambios

Notas para retomar el trabajo en la siguiente sesión. Lo más reciente, arriba.

## Para la siguiente sesión

Por orden de prioridad:

1. **Revisar con alumnos las mejoras de animación** (ver el registro de abajo) y recoger qué ayuda y qué distrae. Lo que aún no se ha probado:
   - con `prefers-reduced-motion` activado en el sistema: no debe haber vuelos ni confeti, y la flecha y los puntos de corriente quedan quietos;
   - en un móvil de verdad (las pruebas fueron con el navegador a 390 px).
2. **Recursión 3/4 y 4/4** (plan en CLAUDE.md): Árbol de llamadas (`arbol/`) y Proyecto: Torres de Hanói (`proyecto/`). Al publicar cada una: su `<li data-leccion>` en la tarjeta de Recursión de la portada y el botón «Siguiente» en el resumen de la anterior (Recursión 2/4 aún no tiene). Usar `Pila.crear(el, { codigo, rotulo: true })`, tarjetas con `linea`/`falta`/`sigue`/`recibe` y `flecha: true` al volver. En el árbol de fibonacci, una llamada hace **dos** llamadas en la misma línea: la tarjeta que espera tendrá que decir cuál de las dos espera (p. ej. `falta: "return 3 + ▢"` tras la primera).
   **Probar con alumnos** si la vuelta se entiende ahora (tarjeta «pausada/sigue», fichas bajo la línea y rótulo «Ahora corre»), y si las fichas o el rótulo distraen.
   Después, antes de Listas: **Texto a fondo** y **Errores** (ideas en CLAUDE.md; planear sus sublecciones allí). Y luego **Listas**, decidiendo qué se levanta de la regla «nada de listas».
3. **Pila con «pausada en la línea N» en Funciones que usan funciones**: hoy sus tarjetas dicen «esperando a suma()». Podría usar `linea`, `falta`, `recibe` y `codigo`/`rotulo` como la Recursión (`total = ▢` → `total = 31`).
4. **Flecha de vuelta en las otras lecciones de Funciones.** Solo Funciones 1/7 marca `flecha: true` al volver de una función. En Varios parámetros, Funciones que deciden, Variables locales y Funciones que usan funciones, la flecha sale al llamar (sube al `def`), pero no al volver con `return` (baja a la llamada). Basta con añadir `flecha: true` al paso de la traza que vuelve a la línea de la llamada.
5. **Origen del vuelo en los parámetros.** Cuando un parámetro recibe su valor, la línea activa es la del `def`, así que el valor sale de ahí y no del argumento de la llamada. Se podría permitir indicar el origen (p. ej. un elemento opcional en `Caja.poner`) para que salga del argumento.
6. **Proyectos: armar el programa en vez de elegirlo.** Ideas que quedaron de la revisión, sin hacer:
   - arrastrar y soltar líneas para ordenarlas (CLAUDE.md lo pide en Pedagogía; hoy solo «Texto y números» usa arrastrar);
   - un panel «Tu programa» que crece con cada parte resuelta y que al final se ejecuta.
7. **Detalles menores vistos al probar:**
   - en móvil, si una línea es más ancha que la pantalla, la flecha de salto pasa por encima del texto de esa línea;
   - la copia que vuela a la consola es pequeña (tamaño de código, escalada); podría salir algo más grande;
   - la portada no tiene animación (p. ej. el camino de sublecciones se podría ir rellenando).

8. **Español neutro: casos dudosos que quedaron sin tocar** (decidir con alumnos o con otra persona de Perú):
   - «bombilla» en Combinar condiciones (circuitos de `and`/`or`) → ¿«foco»? (es lo habitual en Perú y México, pero «foco» también significa otra cosa);
   - «Entradas del zoo» en Condiciones anidadas → ¿«zoológico»?;
   - «Ojo:» (6 veces, en Bucles, Salir antes, Recorrer un texto y Condicionales) → ¿«Cuidado:»?;
   - «meter» («Si metes un if…», «Metemos caramelos», «lo que quieras meter en el texto») → ¿«poner»?;
   - «slider» en Funciones que usan funciones («Mueve el slider…»): en el resto de lecciones se dice «control».

### Cómo se probó

Con Playwright, que ya está en el entorno de la nube (`/opt/node-tools/node_modules/playwright`, Chromium en `/opt/pw-browsers`), sin instalar nada en el repo. Unos scripts sueltos recorren cada lección: marcan todo el progreso en `localStorage` (`lpa:progreso`), pulsan «Ejecutar línea» en cada paso, comprueban que no haya errores de JavaScript ni restos de animaciones, y sacan capturas en escritorio (1280 px) y móvil (390 px) en `capturas/`.

## Registro de cambios

### 2026-10-21 · La vuelta en la pila y Recursión 2/4 (PRs #55–#58)

La pregunta de partida: al volver de una llamada recursiva, ¿cómo ve el alumno que sigue **en la misma función**, en la llamada que estaba esperando? Tres mejoras, cada una en su PR, y la lección nueva:

| PR | Cambio | Dónde |
|---|---|---|
| #55 | Tarjeta que espera: «‖ pausada en la línea 6» y «le falta: `print("Cierro la caja 3")`» (o «no le falta nada»); la que retoma, «▶ sigue en la línea 6», y se ilumina. Campos `linea`, `falta`, `sigue`. | `pila.js`, `base.css`, Recursión 1/4 |
| #56 | Fichas en el código: debajo de la línea donde esperan, una ficha por llamada (`‖ n=3 n=2 n=1`); al volver se va la de la que retoma. `Codigo.pausas`, `Pila.crear(el, { codigo })`. La flecha de salto se dibuja después de pintar el paso, mide solo el texto de la línea y rodea las líneas de en medio con esquinas (antes las cortaba en curva). | `codigo.js`, `pila.js`, `traza.js`, `base.css` |
| #57 | Rótulo «Ahora corre: `abrir(2)` n 2» encima del código; entra desde arriba al llamar y desde abajo al volver. `rotulo: true`. | `pila.js`, `base.css` |
| #58 | **Recursión 2/4: Recursión que devuelve valores** (`lecciones/recursion/valores/`, `data-leccion="recursion-valores"`). Campo `recibe`: el valor devuelto sale volando del «↩ devuelve 6» de la tarjeta que se va y cae en la cuenta de la de abajo (`return 4 * 6`). `Codigo.volar` (vuelo desde cualquier elemento). | lección nueva, `pila.js`, `codigo.js`, portada, Recursión 1/4 |

La lección, en 7 pasos: la fila del cine (preguntas hacia adelante, respuestas hacia atrás sumando 1) → `factorial(n)` con la pila y un control de 1 a 5 → for contra recursión (predecir cuál multiplica primero; dos cintas que avanzan a la vez) → completar `potencia(b, e)` con dos espacios en blanco y tres pruebas → `suma_digitos(472)` con `%` y `//`, predicción antes de ejecutar → reto: cuál de cuatro `factorial` calcula bien (sin `return` da `None` y luego `TypeError`; con `factorial(n)`, `RecursionError`; con caso base 0, siempre 0) → resumen. Recursión 1/4 enlaza a ella.

Probado con Playwright en 1280 y 390 px, reanudando en cada paso y con movimiento reducido; también Funciones que usan funciones (usa la misma pila) y la flecha en Funciones 1/7. Sin errores.

### 2026-10-21 · Recursión 1/4: una función que se llama a sí misma

- **Plan**: CLAUDE.md recoge el tema Recursión (4 lecciones, después de Funciones) y lo que conviene ver antes de Listas (Texto a fondo, Errores). La recursión sale de «fuera de alcance».
- **Pila compartida**: la pila de llamadas de Funciones que usan funciones pasó a `assets/js/pila.js` (`Pila.crear`, `Pila.programa`, `Pila.llamada`) y sus estilos a `base.css`. Novedades: `termina: true` para una llamada que acaba sin devolver nada («↩ termina») y, cuando la tarjeta de encima es la misma función, «esperando a la de arriba». Funciones que usan funciones se ve igual que antes.
- **Lección** `lecciones/recursion/` (`data-leccion="recursion"`), 6 pasos: cajas dentro de cajas (instrucciones que se usan a sí mismas) → `cuenta_regresiva(n)` con la pila y un control de 1 a 5 → sin caso base: la pila crece hasta 999 llamadas e imprime de 3 a -995 antes del `RecursionError` (comprobado con Python 3.13) → `abrir(n)` con «Abro» a la ida y «Cierro» a la vuelta, predicción antes de ejecutar y las cajas que se abren y se cierran → reto: qué versión de `subir(n)` imprime 0 1 2 3 → resumen.
- **Portada**: tarjeta de tema Recursión (🎁) con su primera lección; «Empezar · 1 lección» en singular. El proyecto de Funciones enlaza a Recursión.
- Probado con Playwright en 1280 y 390 px, reanudando en cada paso y con movimiento reducido: sin errores.

### 2026-10-20 · Reanudar el proyecto de Funciones en la Parte 3

Al volver a «Proyecto: piedra, papel o tijera» con el avance guardado en el paso `paso-gana` (Parte 3), la página lanzaba `TypeError: Cannot read properties of undefined (reading 'listoParaComprobar')` y el alumno quedaba atascado: «Comprobar» no se habilitaba nunca, ni siquiera al elegir las tres reglas.

Causa: `entrarGana()` usaba la variable de fuera `var leccion = Pasos.iniciar({…})`, pero al reanudar `Pasos.iniciar` llama al `alEntrar` del paso guardado antes de devolver, así que `leccion` aún era `undefined` (y, como el error cortaba `Pasos.iniciar`, se quedaba así). Ahora `entrarGana(paso, leccion)` usa el argumento que recibe, como el resto de callbacks. El `change` de los `<select data-regla>` sigue usando la variable de fuera: corre después, cuando ya tiene valor.

Se revisaron las demás lecciones: todos los `alEntrar` que llaman a `leccion.desbloquear()` o `leccion.listoParaComprobar()` usan ya el argumento. Un barrido con Playwright que abre las 25 lecciones reanudadas en cada uno de sus pasos (172 en total) no da ningún error.

**Regla para lecciones nuevas:** dentro de una función usada como `alEntrar`, usar siempre el `leccion` que llega como argumento, nunca el que devuelve `Pasos.iniciar`.

### 2026-10-20 · Español neutro en todas las lecciones

Revisión del texto visible (portada, 25 lecciones y `assets/js/`) para quitar rasgos del español de España:
- vosotros y tiempos: «sois» → «son», «Has dicho» → «Dijiste» (también en el código Python de Salir antes), «Lo hemos detenido» → «Lo detuvimos», «Lo que has usado» → «Lo que usaste»…;
- vocabulario: «ordenador» → «computadora», «el PC» → «la PC» (se mantiene «PC» porque va con `pc` y `jugada_pc` en el código), «Pulsa» → «Toca» (como ya decía la portada), «a por» → «por», «cuenta atrás» → «cuenta regresiva», «sitio» → «lugar», «Vale, sin postre» → «Bueno, sin postre», «Gafas» → «Lentes», «Prueba a…» → «Intenta…», «trozo» → «parte» (también la variable `trozo` del ejemplo de `in`);
- «patata» → «papaya» en el reto de Recorrer un texto: también tiene 6 letras y 3 «a» y termina en «a», así que las pistas («Sale 6», «Sale 1», «Sale 0») siguen valiendo;
- «hueco»: en los ejercicios → «espacio en blanco» (en Dibujar patrones, «Elige qué va en cada ?», porque allí «espacios» son los que se imprimen); en f-strings se habla de «las llaves»; «cuadrado hueco» → «cuadrado vacío». Los nombres internos (`.hueco`, `p5-hueco`…) no se cambiaron.

CLAUDE.md recoge la regla de español neutro en Pedagogía.

### 2026-10-19 · Más animación en las lecciones (PRs #44–#50)

Tras revisar las 25 lecciones buscando dónde faltaba «juice»:

| PR | Cambio | Dónde |
|---|---|---|
| #44 | **Flecha de salto**: curva amarilla a la derecha del código cuando la ejecución vuelve arriba (otra vuelta, una llamada). `Codigo.salto`; `Traza` la dibuja sola y cada paso puede forzarla o evitarla con `flecha: true / false`. | `codigo.js`, `traza.js`, `base.css` |
| #45 | **Funciones 1/7**: la receta se ilumina por instrucciones con un sello por llamada (paso 1), y un mapa «programa principal / dentro de saludar()» con la marca «🔖 volverá aquí» (paso 2). | `lecciones/funciones/` |
| #46 | **Valores que viajan**: el valor sale de la línea que se ejecuta y llega en arco a su caja; lo que imprime `print` se desliza a la consola. `Codigo.volarDesdeLinea`, usado por `Caja.poner` y `Traza`. | `codigo.js`, `caja.js`, `traza.js`, `base.css` |
| #47 | **Opciones de código**: colores de sintaxis para fondo claro; las líneas iguales en todas las opciones van en gris y las que cambian llevan una raya. Se marca igual en todas para no delatar la correcta. | nuevo `opciones-codigo.js`, 12 lecciones |
| #48 | **Confeti** al acertar un «Comprobar», al cumplir el reto final de un proyecto y en el resumen. `Pasos.confeti(el)`. | `pasos.js`, `base.css` |
| #49 | **Corriente** en los circuitos de `and`/`or`: puntos que recorren los cables encendidos y los interruptores cerrados. | `lecciones/condicionales/logicos/` |
| #50 | CLAUDE.md documenta estas utilidades. | `CLAUDE.md` |

Todas respetan `prefers-reduced-motion`.

Una decisión que conviene recordar: en las opciones de código se probó primero resaltar «lo que solo tiene esa opción», pero la correcta casi siempre quedaba sin marcas y delataba la respuesta. Por eso se marca con la misma regla en todas.
