# Pendientes y registro de cambios

Notas para retomar el trabajo en la siguiente sesión. Lo más reciente, arriba.

## Para la siguiente sesión

Por orden de prioridad:

1. **Revisar con alumnos las mejoras de animación** (ver el registro de abajo) y recoger qué ayuda y qué distrae. Lo que aún no se ha probado:
   - con `prefers-reduced-motion` activado en el sistema: no debe haber vuelos ni confeti, y la flecha y los puntos de corriente quedan quietos;
   - en un móvil de verdad (las pruebas fueron con el navegador a 390 px).
2. **Lección de Listas** (la siguiente del orden, «próximamente» en la portada). Antes de escribirla, planear sus sublecciones en CLAUDE.md, como se hizo con Funciones (`Listas 1/N`…), y decidir qué se levanta de la regla «nada de listas». Usar desde el principio las utilidades nuevas: `Traza` con flecha de salto, `Caja.poner` con vuelo, `opciones-codigo.js` y confeti.
3. **Flecha de vuelta en las otras lecciones de Funciones.** Solo Funciones 1/7 marca `flecha: true` al volver de una función. En Varios parámetros, Funciones que deciden, Variables locales y Funciones que usan funciones, la flecha sale al llamar (sube al `def`), pero no al volver con `return` (baja a la llamada). Basta con añadir `flecha: true` al paso de la traza que vuelve a la línea de la llamada.
4. **Origen del vuelo en los parámetros.** Cuando un parámetro recibe su valor, la línea activa es la del `def`, así que el valor sale de ahí y no del argumento de la llamada. Se podría permitir indicar el origen (p. ej. un elemento opcional en `Caja.poner`) para que salga del argumento.
5. **Proyectos: armar el programa en vez de elegirlo.** Ideas que quedaron de la revisión, sin hacer:
   - arrastrar y soltar líneas para ordenarlas (CLAUDE.md lo pide en Pedagogía; hoy solo «Texto y números» usa arrastrar);
   - un panel «Tu programa» que crece con cada parte resuelta y que al final se ejecuta.
6. **Detalles menores vistos al probar:**
   - en móvil, si una línea es más ancha que la pantalla, la flecha de salto pasa por encima del texto de esa línea;
   - la copia que vuela a la consola es pequeña (tamaño de código, escalada); podría salir algo más grande;
   - la portada no tiene animación (p. ej. el camino de sublecciones se podría ir rellenando).

### Cómo se probó

Con Playwright, que ya está en el entorno de la nube (`/opt/node-tools/node_modules/playwright`, Chromium en `/opt/pw-browsers`), sin instalar nada en el repo. Unos scripts sueltos recorren cada lección: marcan todo el progreso en `localStorage` (`lpa:progreso`), pulsan «Ejecutar línea» en cada paso, comprueban que no haya errores de JavaScript ni restos de animaciones, y sacan capturas en escritorio (1280 px) y móvil (390 px) en `capturas/`.

## Registro de cambios

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
