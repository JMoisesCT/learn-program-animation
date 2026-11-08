# Pendientes y registro de cambios

Notas para retomar el trabajo en la siguiente sesión. Lo más reciente, arriba.

## Para la siguiente sesión

Por orden de prioridad:

1. **Matrices, completo (6/6)** (ver el registro del 2026-11-04, «Matrices»). Es el último tema publicado: su proyecto termina en «Volver a la portada».
   **Probar con alumnos** en un móvil de verdad, sobre todo:
   - si los dedos `f` y `c` que se deslizan por los bordes ayudan a seguir los dos `for` (y «`c` da toda la vuelta en cada `f`, como el minutero»);
   - la trampa de `fila = []` afuera (Armar una matriz): si los colores «cada color, una lista» se entienden;
   - si los totales al margen (en naranja) se leen como «lo que se calcula», no como parte de la matriz;
   - el proyecto en el móvil: la sala va antes que el código (31 líneas) con `order` de CSS.
   **Para unificar en `matriz.js`** (cada lección lo resolvió en su página): casillas tocables con teclado (Recorridos, Transformar y el proyecto escribieron su propio `tocable`: quitar el `aria-hidden`, `role="button"`, flechas; propuesta `m.tocable(fn, etiqueta)` que sobreviva a `valores()`), `rechazar([f, c])` (sacudir en rojo; el proyecto usa `celda--sacude`), dos filas que son la misma lista (Armar una matriz: colores por lista y `cambiar` que se reparte; propuesta `m.compartir([[0, 1]])` y `m.crecerFila(f, v, origen)`), una transformación animada con cambio de forma (Transformar, paso 8; propuesta `m.transformar(nueva, origen)`), varias marcas a la vez (vecinos, un par de asientos), un dedo en `len` con lugar debajo (`reservarFuera`), `reservarDedos: "fila" | "columna"`, que las clases de `agregarFila` sobrevivan al repintar, `m.mostrar({ indices })`, `Matriz.codigo` con comentarios por fila, y `maximo` según el alto de la pantalla (tres lecciones eligen 2.35–2.45 rem con `matchMedia` en escritorios de 720 px o menos; mejor una variable de CSS). Fuera de `matriz.js`: la consola por trozos para `print(..., end=" ")` (tres copias), `.codigo--largo` en `base.css` (también en Burbuja y Búsqueda binaria) y `opciones-codigo.js` dentro de `.elegir`.
   **No cabe a 1366×657**: el resumen de Filas y columnas (77 px), los pasos 4 y 7 y el reto de Sumar (45–60 px) y casi todo el proyecto (partes 60–250 px, el reto 300–450 px). Transformar, Recorridos y Armar caben.
   **Desvíos de las convenciones**: Filas y columnas y Recorridos ponen la consola o el mensaje de error dentro de `lab__visual` o `lab__principal` para caber; Armar una matriz pone el dibujo antes de los botones en el HTML; Sumar escribe `# notas: la libreta de al lado` en vez de la matriz completa; Recorridos parte la condición de la orilla en `dentro_f` / `dentro_c` (en una línea no cabía en el móvil).
2. **Revisar con alumnos las mejoras de animación** (ver el registro de abajo) y recoger qué ayuda y qué distrae. Lo que aún no se ha probado:
   - con `prefers-reduced-motion` activado en el sistema: no debe haber vuelos ni confeti, y la flecha y los puntos de corriente quedan quietos;
   - en un móvil de verdad (las pruebas fueron con el navegador a 390 px).
3. **Errores, completo (7/7)** (ver el registro del 2026-11-01, «Errores»). Su proyecto enlaza a Matrices.
   **Probar con alumnos** en un móvil de verdad, sobre todo:
   - si el mensaje en inglés con su línea «En español» se lee, y si los rótulos «dónde / qué línea / qué pasó» ayudan a leerlo de abajo arriba;
   - si la ficha roja del error que vuela al `except` (y rebota si no es su tipo) se entiende como «la red atrapa solo su tipo»;
   - el escáner de Errores al escribir: si se entiende que con un error de escritura no corre ni la primera línea.
   **Python 3.12 frente a 3.13**: los mensajes siguen a 3.12, como dice el plan. 3.13 cambia algunas marcas (`~~~^^^` en las llamadas, sin `^` bajo `x = int(input())`); la última línea del mensaje es igual.
   **Para unificar** (cada lección lo resolvió en su página): el subrayado con `~` (`subrayado` ya está en `mensaje-error.js`; Tipos, Traza, try y el proyecto aún reescriben ese renglón a mano), «Did you forget to import» (Leer un mensaje lo arma a mano), `romper` con un rango `[desde, hasta]` en vez del texto (cae en la primera aparición), los `^` en su propio span tocable, marcar una segunda línea que nombra el mensaje («on line 2», Errores al escribir usa `.linea--mira`), un estado «explotó aquí» en `pila.js` (Traza usa `marco--explota`), `lanzar` con una lista de `except` en orden y que se pueda cancelar, crear el mensaje reservado (invisible) para que la ficha vuele hasta él, la etiqueta «no se ejecuta» que se encima en líneas largas, el escáner de dos fases (Errores al escribir) y la consola con campo, misiones y la emulación de `int()` (Volver a pedir y el proyecto). En `bucle-input.js`: no recortar los espacios del dato (el mensaje debería decir `' veinte'`), cambiar la pregunta entre vueltas, terminar cuando el programa se corta por un error y esperar a las animaciones antes de pedir otro dato.
   **No cabe a 1366×657**: casi todos los pasos piden bajar entre 30 y 200 px tras mostrar un mensaje; el reto de Volver a pedir y el del proyecto (26 líneas), más.
   **Desvíos de las convenciones**: Leer un mensaje usa un cuarto grupo `lab__arreglo` (opciones bajo el código en escritorio, después del mensaje en el móvil).
4. **Problemas resueltos: piloto con 2 casos** (ver el registro del 2026-11-01, «Problemas resueltos» y la sección en CLAUDE.md). **Probar con alumnos** antes de escribir más casos:
   - si la página larga que se lee bajando (caso → conceptos → idea → código → ejecución → preguntas) se sigue, o si prefieren la ejecución antes;
   - si usan la barra de tiempo para rebobinar, los rombos de capítulos y los datos de entrada preparados, o solo tocan ▶;
   - si el rastro de las variables (valores tachados) y el mapa de calor de las líneas ayudan o distraen;
   - en el móvil, el escenario es largo (escena, código, variables y consola apilados) y los controles quedan fijos abajo.
   - con los casos básicos (03 y 04): si un alumno que recién vio Variables sigue el caso entero, y si «¿Siempre cierra la cuenta?» y «¿Y si sale más de 20?» se entienden como el motivo para aprender `if`.
   Siguientes casos básicos (propuestos al autor, sin condicionales ni bucles): el cronómetro de la maratón y el número al revés. Más grandes («Próximamente» en el catálogo): el torneo del salón y el mensaje secreto; también los asientos del cine, el dígito verificador del DNI y las Torres de Hanói.
   **En el móvil, el código del reproductor no se desplaza de lado**: una línea de más de unos 38 caracteres llega a las barras del mapa de calor. Los casos 03 y 04 acortaron sus líneas (y el 04 achica la letra en su página); conviene una solución en `problemas.css` (desplazar el código de lado o angostar la columna del mapa de calor).
5. **Otras estructuras, completo (7/7)** (ver el registro del 2026-10-31, «Otras estructuras»). Va entre Listas y Búsquedas: el tres en raya enlaza a Tuplas y el proyecto de la votación, a Búsquedas.
   **Probar con alumnos** en un móvil de verdad, sobre todo:
   - si la clave colgada encima del casillero (en vez del número) se entiende como «buscar por nombre»;
   - si la bolsa de fichas sueltas transmite «sin orden» y el rebote de un repetido se ve;
   - en el proyecto, el programa completo (37 líneas) con dos preguntas por vuelta.
   **Para unificar** (cada lección lo resolvió dentro de su página): una caja para textos con comillas (`.caja__valor` corta `"Luis"` a `"Lu…`; Recorrer, Contar y Tuplas usan cajas más chicas o anchas), `marcar` de `dicc.js` sin error para `.get()` (Diccionarios pinta el casillero gris a mano) e iluminar todas las claves («`in` mira las claves»), un diccionario vacío que no se vea igual que un conjunto vacío (los dos muestran `{ vacío }`), una lista de diccionarios vertical (Estructuras juntas la arma con `.ldicc*`), `indices: false` en `lista.js` que aún guarda el alto de los índices (Contar lo arregla en la página), y las zonas «Programa / Dentro de la función», las predicciones y los retos de dos espacios en blanco, copiados otra vez.
   **`pasos.js`**: decide si la salida va bajo el código solo al entrar al paso; cuando la salida crece después (al terminar una ejecución o al comprobar), varios pasos se pasan de la pantalla. Recalcularlo entonces ayudaría a todas las lecciones.
   **No cabe a 1366×657**: casi todos los pasos piden bajar entre 50 y 250 px (el programa completo del proyecto, más), como en Listas.
   **Ordenar, completo (7/7)** (ver el registro del 2026-10-31, «Ordenar»). Lo siguiente: planear **Errores** en CLAUDE.md (sus sublecciones) y escribirlo; al publicarlo, añadir «Siguiente» en el Proyecto: la tabla de posiciones y pasar su tarjeta «Próximamente» de la portada a lección.
   **Probar con alumnos** Ordenar en un móvil de verdad, sobre todo:
   - si la lista que se parte en pedazos (`particion.js`) se sigue en quicksort y mergesort, y si las rayas y los estados (trabaja ahora / espera / ya ordenada) ayudan;
   - el código de burbuja en móvil va a 0,68rem para que el segundo `for` quepa: ver si se lee;
   - en ¿Cuál ordena más rápido?, si «un millón de comparaciones por segundo» (burbuja con un millón: unos 6 días; mergesort: unos 19 segundos) convence, y si el paso de `sorted()` (tramos ya ordenados que se mezclan, un modelo simplificado de Timsort) se entiende o sobra.
   **Desvíos de las convenciones**: en Mergesort, pasos 1 a 3, el dibujo va antes de los botones en el móvil con `order` de CSS (`lab--visual-primero`), no por el orden del HTML. En el proyecto, la condición del empate se partió en `menor` y `empate`, y el programa admite como mucho 8 alumnos.
   **No cabe a 1366×657**: las trazas largas (Quicksort 3 a 6, Mergesort 4 y 5, Mezclar 3 a 6), el paso 4 y el reto del proyecto, y algunos retos tras «Comprobar».
   **Para unificar (Ordenar suma más copias)**: las siete lecciones traen su propio contador en pastilla, y varias un coloreador de Python (el código se escribe tal cual y se convierte en `.linea`), una tabla vertical con filas que se intercambian (proyecto) y la ayuda para tocar casilleros con el teclado. Ideas para `lista.js`: `marcar([a, b])` para el par que se compara, y reservar el lugar de los punteros aunque estén ocultos. Para `traza.js`: pausar en un paso y esperar la respuesta del alumno (Mezclar lo hace a mano). Para `opciones-codigo.js`: no atenuar lo común cuando lo que cambia es el orden de las líneas (Intercambiar vecinos, paso 7). `Pasos.feedback` solo acepta texto plano.
   **Revisar** (aviso del agente del proyecto, sin comprobar): en `lecciones/busquedas/proyecto/`, las opciones de varias líneas podrían salir con sangría doble en el espacio en blanco (el `.hueco` es `inline-block` y además se le suma la sangría).
   **Búsquedas, completo (7/7)** (ver el registro del 2026-10-31).
   **Probar con alumnos** Búsquedas en un móvil de verdad, sobre todo:
   - si los punteros `inicio`, `medio` y `fin` bajo la lista se siguen al deslizarse, y si los casilleros tapados se entienden como «la PC no ve hasta comparar»;
   - en ¿Cuál es más rápida?, si el costo de `sorted` (contado con el `sort` de JavaScript, «unas N comparaciones») convence o confunde;
   - en el proyecto, que `preguntas += 1` va antes del `input`: una respuesta inválida también cuenta como pregunta.
   **Para unificar** (cada lección lo resolvió dentro de su página): el contador de comparaciones (pastilla con salto), un coloreador de Python para escribir el código en JS en vez de los `<span>` a mano, la tabla de seguimiento (Búsqueda binaria y Recursión que devuelve valores), la regla 1–N que se encoge (Partir a la mitad y el proyecto, copiada de Bucles) y tocar casilleros con el teclado (Buscar uno por uno y Partir a la mitad; `lista.js` pone `aria-hidden` en la lista). Pasarlos a `assets/` cuando una lección más los necesite.
   **No cabe a 1366×657**: los pasos con el código completo de la binaria (14 líneas) más la tabla, la pila de la recursiva (13 líneas) y el reto del proyecto (20 líneas y consola) piden bajar entre 100 y 300 px, como las lecciones de Recursión.
   **Listas, completo (8/8).**
   **Probar con alumnos** las lecciones de Listas en un móvil de verdad, sobre todo:
   - si los casilleros que se corren al insertar y quitar (Agregar y quitar) se siguen con la vista;
   - si «dos etiquetas, una lista» (Dos nombres, una lista) se entiende o hace falta otra imagen (p. ej. flechas);
   - el tres en raya: tocar el tablero y escribir fila y columna en la consola (el programa del reto tiene 48 líneas).
   **Detalles vistos**: en móvil, las cintas de frases largas (De texto a lista) usan casillas de 1.3rem y se leen pequeñas; en la cuadrícula, el casillero marcado sube 4 px (en las pruebas parece una lista partida en dos filas).
   **Texto a fondo, completo (5/5).**
   **Probar con alumnos** el ahorcado en un móvil de verdad (en el reto, el tablero y las misiones van antes que el programa, que tiene 31 líneas) y si se entiende que repetir una letra que no está quita otra vida (el programa no lo revisa; podría ser una mejora con `if nueva in dichas:` y `continue`).
   **Probar con alumnos** si se entiende el `-1` de `.find()` (paso «Antes y después de la @»: sin @, `correo[:-1]` corta la última letra sin dar error).
   **Probar con alumnos** las tijeras de Rebanadas en un móvil de verdad (arrastrar y tocar la cinta; usan `touch-action: none`, así que sobre la cinta la página no se desplaza) y si «los números van en los cortes» se entiende.
   **Detalle visto**: en móvil, las líneas largas se desplazan en vez de caber (la de `print(▢)` en el reto de Métodos, con la cadena elegida dentro; las opciones sí se parten en dos líneas).
   **Recursión, completa (7/7).** Se añadieron Dígitos y bases, Imprimir combinaciones, A practicar y Proyecto: el candado (ver el registro del 2026-10-28). Para afinar con el autor y con alumnos:
   - **Dígitos y bases** tiene 10 pasos; si se hace larga, el paso de las luces (3) se puede quitar o juntar con el 4. El control de la base llega a 10 para ver que `a_base(n, 10)` devuelve el mismo número.
   - **Imprimir combinaciones**: los emojis del árbol de piedra, papel o tijera miden unos 11 px a 390 px; ver si se leen en un móvil de verdad. En móvil, la flecha de salto tapa el final de las líneas largas de la poda y del reto (el detalle de abajo).
   - **A practicar**: si los 12 ejercicios son demasiados o pocos, y si el balance «¿Cómo te fue?» ayuda. Guarda los resultados en `lpa:progreso` (`resultados` dentro de `recursion-practica`).
   - **El candado** lee `secreta`, una variable de afuera de la función (`return clave == secreta`); Variables locales no lo cuenta. Ver si se entiende o si conviene pasarla como parámetro.
   **Probar con alumnos** el paso «Una función que se llama dos veces» (Árbol de llamadas) tras la mejora del 2026-10-28: si la fila de valores bajo la línea 5, las fichas bajo cada llamada y la llamada con «↑» en las tarjetas ayudan a seguir quién llama a quién, o si hay demasiado bajo la línea 5. Si funciona, llevar `espera` a Recursión que devuelve valores y a Funciones que usan funciones.
   **Probar con alumnos** si la vuelta se entiende ahora (tarjeta «pausada/sigue», fichas bajo la línea y rótulo «Ahora corre»), y si las fichas o el rótulo distraen.
   **Torres de Hanói, guardada**: ya no es el proyecto de Recursión (lo es el candado). Sigue en `lecciones/recursion/proyecto/`, intacta y con su clave `recursion-proyecto`, pero no está en la portada ni la enlaza ninguna lección; queda para otro ejemplo (un extra o un reto). Su etiqueta aún dice «Recursión 4/4 · Proyecto»: cambiarla cuando se le dé su nuevo lugar.
3. **Probar con alumnos las mejoras de la vuelta en Recursión** (ver el registro del 2026-10-27):
   - si los colores de ida (naranja, punteado) y de vuelta (azul) se distinguen y se entienden, también con daltonismo (la raya de la consola cambia de forma, no solo de color);
   - si la cuenta que crece y se encoge (Recursión 2/4) se lee bien en el móvil cuando ocupa dos líneas (con `factorial(5)`);
   - si la tabla de seguimiento se usa luego para trazar en papel (se podría pedir que la llenen ellos en un reto);
   - si «Ahora la vuelta la haces tú» en el Árbol de llamadas es demasiado largo (4 vueltas) o demasiado fácil (las hojas vuelven solas).
4. **Pila con «pausada en la línea N» en Funciones que usan funciones**: hoy sus tarjetas dicen «esperando a suma()». Podría usar `linea`, `falta`, `recibe` y `codigo`/`rotulo` como la Recursión (`total = ▢` → `total = 31`).
5. **Flecha de vuelta en las otras lecciones de Funciones.** Solo Funciones 1/7 marca `flecha: true` al volver de una función. Variables locales ya también. En Varios parámetros, Funciones que deciden y Funciones que usan funciones, la flecha sale al llamar (sube al `def`), pero no al volver con `return` (baja a la llamada). Basta con añadir `flecha: true` al paso de la traza que vuelve a la línea de la llamada.
6. **Proyectos: armar el programa en vez de elegirlo.** Ideas que quedaron de la revisión, sin hacer:
   - arrastrar y soltar líneas para ordenarlas (CLAUDE.md lo pide en Pedagogía; hoy solo arrastran «Texto y números» y los discos de las Torres de Hanói);
   - un panel «Tu programa» que crece con cada parte resuelta y que al final se ejecuta.
7. **Escritorio en una pantalla** (ver el registro del 2026-10-29): revisar en una PC de verdad si el nuevo reparto se entiende (enunciado arriba a la izquierda, animación a la derecha) y seguir con lo que aún no cabe a 1366×657.
8. **Detalles menores vistos al probar:**
   - en móvil, si una línea es más ancha que la pantalla, la flecha de salto pasa por encima del texto de esa línea;
   - la copia que vuela a la consola es pequeña (tamaño de código, escalada); podría salir algo más grande;
   - la portada no tiene animación (p. ej. el camino de sublecciones se podría ir rellenando).

9. **Español neutro: casos dudosos que quedaron sin tocar** (decidir con alumnos o con otra persona de Perú):
   - «bombilla» en Combinar condiciones (circuitos de `and`/`or`) → ¿«foco»? (es lo habitual en Perú y México, pero «foco» también significa otra cosa);
   - «Entradas del zoo» en Condiciones anidadas → ¿«zoológico»?;
   - «Ojo:» (6 veces, en Bucles, Salir antes, Recorrer un texto y Condicionales) → ¿«Cuidado:»?;
   - «meter» («Si metes un if…», «Metemos caramelos», «lo que quieras meter en el texto») → ¿«poner»?;
   - «slider» en Funciones que usan funciones («Mueve el slider…»): en el resto de lecciones se dice «control».

### Cómo se probó

Con Playwright, que ya está en el entorno de la nube (`/opt/node-tools/node_modules/playwright`, Chromium en `/opt/pw-browsers`), sin instalar nada en el repo. Para los casos de Problemas resueltos, la prueba ya está en el repositorio: `node herramientas/probar-caso.js <caso>` (y `catalogo`). Para las lecciones, unos scripts sueltos (no guardados) recorren cada lección: marcan todo el progreso en `localStorage` (`lpa:progreso`), pulsan «Ejecutar línea» en cada paso, comprueban que no haya errores de JavaScript ni restos de animaciones, y sacan capturas en escritorio (1280 px) y móvil (390 px) en `capturas/`.

## Registro de cambios

### 2026-11-08 · Problemas resueltos: revisión visual de los casos de Bucles

Revisión de las animaciones y de lo que se veía raro en los cuatro casos de Bucles (con capturas a 1366×657, 1280×800, 1100×760 y 390×844, y cuadros sacados mientras corre el reproductor). Lo que se arregló sirve para todos los casos:
- **Diagrama de flujo (`flujo.js`, `problemas.css`)**: el texto de los rombos tocaba o cruzaba los bordes inclinados (`¿ahorro < meta?`, `¿quedan d de 2 a n − 1?`). Ahora `flujo.js` calcula el relleno de los lados de cada rombo para que el texto quepa dentro (texto/ancho + alto/alto ≤ 1), sin pasar de 1.5 veces el texto ni comerse el lugar de la flecha de al lado, y sin partir el texto en otra línea (respeta el relleno de arriba y abajo que fija cada página). El paralelogramo de datos tenía una inclinación del 10 % del ancho, mayor que su relleno en los nodos anchos (`anota la meta, lo semanal y el ahorro`): ahora la inclinación es fija (`--inclina`, 0.8em; 0.55em en el móvil) y el relleno la deja libre. Revisados los 16 diagramas, antes y después: todos caben en su bloque.
- **Cajas de variables (`reproductor.js`, `problemas.css`)**: un valor de más de 11 caracteres (el `grosor` de la Luna) baja bajo el nombre (`rep__var--largo`) en vez de partirse en dos renglones; su rastro va más chico.
- **Reproductor entre 1024 y 1179 px**: el rótulo «Variables» ocupaba un tercio de la fila y la consola, por un `flex` que la pisaba, se quedaba con casi todo: las cajas medían 78 px (`43980 / 46511 / 10.4`). Ahora el rótulo toma lo justo y cajas y consola se reparten el resto.
- **La sombra del reproductor** (60 px hacia abajo) se metía en el bloque siguiente y dejaba una mancha gris bajo la cabecera en «Detalles del algoritmo». Ahora es más corta.
- **¿Es primo?**: con las 91 sillas «sin acomodar», la que quedaba sola en la última fila iba a la izquierda y parecía «la que sobra» antes de probar nada; ahora la última fila va centrada.
- **La alcancía**: en «Contar las vueltas», «¿Por qué < y no <=?» y «Casos borde», el texto de abajo tocaba las casillas o los botones de arriba (un margen que pisaba `.concepto p`).
- Probado con `herramientas/probar-caso.js` (alcancía, papel, primo, Collatz, la cuenta y el bisiesto): cada bloque cabe, sin errores ni desborde, y cada dato llega al final con la misma salida.
- **Visto y no cambiado**: en el móvil, en el triángulo, la caja «No se puede armar» se sale un poco de su columna por la izquierda y, en ¿Es primo?, «primo» toca los bordes de su paralelogramo (la columna es muy angosta); en la escalera del papel, el cartel «≈ 439 805 km» tapa el número 40 de la escala; en Collatz, la etiqueta «no» de `¿n > mayor?` queda sobre la flecha que vuelve de `mayor = n`.

### 2026-11-04 · Problemas resueltos: cuatro casos de Bucles

- **Sección nueva del catálogo, Bucles** (entre Condicionales y Texto a fondo, con su botón en el filtro de tema; «Para después de Proyecto: adivina el número»), con cuatro casos elegidos por el autor entre ocho propuestas (las otras cuatro quedan en el banco de ideas de la guía). Escritos por agentes en paralelo y revisados. Orden: mañana → alcancía → papel → primo → Collatz → El vuelto.
  - **La alcancía** ★★ (`problemas/alcancia/`): `while ahorro < meta` que suma `semanal` y cuenta semanas. 4 datos: 100 de a 15 (7 semanas, sobran 5), 90 justos (6, sobran 0), ya tenía 30 (5) y ya tenía 120 (0 vueltas, ×0 en el cuerpo). Escena: el frasco por capas, la raya de la meta y lo que sobra rayado en rojo. Detalles: vueltas = `(meta + semanal - 1) // semanal` (enlace a buses), `<` frente a `<=` con 90, y `semanal = 0` o `-5` sin fin con «Ctrl + C» y su `KeyboardInterrupt`. Enseñanza: «¿Y si cada semana pone un sol más?» (100: 6 en vez de 7; 500: 21 en vez de 34; 1000: 33 en vez de 67).
  - **El papel hasta la Luna** ★★ (`problemas/papel/`): `grosor = grosor * 2` en mm. 4 datos: tu altura (14 dobleces), un edificio (19), el Everest (27) y la Luna (42, 439804651110.4 mm). Escena: escalera logarítmica de 10 referencias (de la hoja a la Luna), un peldaño por doblez, y la pila de capas. Detalles: meta al doble = un doblez más, el grosor final nunca pasa del doble de la meta, `grosor = 0` sin fin. Enseñanza: «¿Sumar o duplicar?» (3 844 000 000 000 hojas contra 42 dobleces; Britney Gallivan, la primera en doblar un papel 12 veces, en 2002).
  - **¿Es primo?** ★★★ (`problemas/primo/`): `for d in range(2, n)` con `break` y el centinela `menor = 0` (no se usan `True`/`False` en variables: no se vieron como bandera); `mayor = n // menor` en otra línea para no pasar de 36 caracteres. 4 datos: 91 (`91 = 7 * 13`, 6 pruebas), 97 (95 pruebas), 15 y 2 (`range(2, 2)` vacío). Escena: las sillas en `d` filas frente al escenario, las que sobran en naranja; con `d` grande, las filas pasan a columnas. Detalles: barras de pruebas de 2 a 200, el `else` dentro del `for` («91 es primo» 5 veces) y sin `break` (`91 = 13 * 7`), y n = 1 o 0. Enseñanza: «¿Hace falta probar todos?» (parejas de divisores; 97: 8 pruebas, 7919: 87, 1 000 003: 999).
  - **La conjetura de Collatz** ★★★ (`problemas/collatz/`): `while n != 1`, par o impar, `pasos` y `mayor`, `print(n, end=" ")`. 4 datos: 6 (8 pasos), 7 (16), 27 (111 pasos, cima 9232; 688 pasos de traza) y 1 (0 vueltas, `print()` da una línea vacía). Escena: la montaña rusa (bajadas pares en verde azulado, subidas impares en naranja), el carrito y la raya del mayor; dibuja cualquier paso de golpe. Detalles: horizonte de pasos de 1 a 100, `/` en vez de `//` (`3.0 10.0 …`) y `pasos` dentro del `else`, 0 y −5 sin fin. Enseñanza: «¿Siempre llega a 1?» (Collatz, 1937; comprobado hasta 2^68 en 2020) con una montaña para cualquier número hasta 100 000.
- El día de mañana y El vuelto enlazan a la sección nueva en su pie. `CLAUDE.md` («Casos publicados») y el banco de ideas de la guía, al día.
- Probado con `herramientas/probar-caso.js` (también `reducir`) a 1366×657, 1280×800 y 390×844: cada bloque cabe, sin errores ni desborde, y cada dato llega al final con la salida de python3. La prueba de Collatz tarda unos 10 minutos (toca los 688 pasos del 27).
- **Para revisar**: la consola de Collatz muestra `end=" "` con líneas en fila (CSS propio de la página): si otro caso lo necesita, llevarlo a `reproductor.js` (una opción de salida sin salto de línea). ~~Con la Luna, el valor de `grosor` (`439804651110.4`) se parte en dos renglones en su caja.~~ (arreglado el 2026-11-08). El agente de ¿Es primo? midió que, con el CSS actual, una línea de 35 o 36 caracteres puede tocar el mapa de calor por pocos píxeles (en el vuelto, a 390 y a 1280 px); su página agranda la columna del código y achica la letra en el móvil. Conviene resolverlo en `problemas.css` (va con el punto del código que no se desplaza de lado, arriba). **Probar con alumnos** si el ×95 y el ×0 del mapa de calor se leen como «cuántas vueltas dio».

### 2026-11-04 · Matrices: 6 lecciones

Tema nuevo después de Errores (el plan está en CLAUDE.md, «Plan: Matrices»): matrices de números de cualquier tamaño, a partir de la cuadrícula de 3×3 de Listas dentro de listas. Primero la pieza compartida:
- **`assets/js/matriz.js`** (`Matriz.crear`, CSS en `base.css` bajo `.matriz`): una tabla en CSS grid con `subgrid` (cada fila es un elemento), el número de fila a la izquierda y el de columna encima, rótulos opcionales (alumnos y cursos), casillas que se achican para caber a lo ancho (8 columnas en 390 px; se mide con `offsetWidth` porque una fila que entra está escalada), `marcar` con casilla fantasma roja si se sale, `marcarFila`, `marcarColumna`, `clases`, dedos `f` y `c` que se deslizan (pueden quedar fuera, punteados), `cambiar` con vuelo, `agregarFila` / `quitarFila` y totales al margen (`totales`, `total`, `marcarTotal`). `Matriz.python` y `Matriz.codigo`.

Luego las seis lecciones se escribieron en paralelo, una por agente, con las salidas comprobadas con `python3`:
- **1/6 · Filas y columnas** (`matrices`, 10 pasos): la libreta de 4 × 3 (tocar un alumno ilumina su fila y su línea del código; un curso, su columna), `notas[f][c]` con tres misiones, `len` de filas y columnas, cambiar `f` y `c` de lugar (otra nota sin aviso o `IndexError`), los dos dedos que recorren (`print` corre 12 veces), imprimir como tabla con `end=" "`, sin índices, ¿hace falta la posición? y un reto de 3 × 5.
- **2/6 · Armar una matriz** (`matrices-crear`, 10 pasos): armarla a mano con tres botones de código (cada lista con su color), con dos `for`, del tamaño que quieras, la trampa de `fila = []` afuera, `[[0] * 4] * 3`, ¿tres listas o una?, la tabla de multiplicar, leer la libreta con `BucleInput` y el reto de la identidad.
- **3/6 · Sumar por filas y por columnas** (`matrices-sumas`, 9 pasos): una fila es una lista (`sum`), el promedio de cada alumno, una columna con `c` fijo, el promedio de cada curso, el total, la más alta y dónde está (`return mejor_f, mejor_c`), aprobados por curso (¿qué `for` va afuera?) y el reto del curso más difícil, probado en tres libretas.
- **4/6 · Diagonales y vecinos** (`matrices-recorridos`, 11 pasos): tocar la diagonal del cuadrado mágico de Durero, un solo `for`, la otra diagonal, por columnas, los cuatro vecinos, más arriba de la fila 0 (`-1` mira la otra orilla sin error), más abajo de la última (`IndexError`), revisar antes de mirar, las cimas de un mapa (con una meseta de dos 5) y el reto de contarlas (las 27 combinaciones comprobadas).
- **5/6 · Transformar una matriz** (`matrices-transformar`, 10 pasos): dos puntos para todos (tocar cada nota), fila por fila, sin pasar de 20 (`min`), parcial + final, ¿y si no son del mismo tamaño?, el espejo de una F de 0 y 1, las filas se vuelven columnas (el alumno toca dónde cae `t[c][f]`), girar el dibujo con `transpuesta` y `espejo` y el reto de la transpuesta.
- **6/6 · Proyecto: la sala de cine** (`matrices-proyecto`, 8 pasos): vender entradas tocando la sala, cinco partes (dibujar con `"ABCDE"[f]`, `reservar`, ¿ese asiento existe? con `try`, libres, dos juntos) y la taquilla completa (31 líneas) con `BucleInput` y cinco misiones; su salida coincide con python3.12 en 5 juegos de entradas.

Después, en `matriz.js` y `base.css`: la casilla fantasma de una columna que se sale ya no queda angosta en la columna de los totales, la casilla marcada se ve aunque tenga una clase, los totales largos (`12.5`) achican su letra y un dedo con nombre largo abre más lugar a la izquierda. Portada con la tarjeta del tema y «Siguiente: Matrices →» en el proyecto de Errores. Probado con Playwright a 1366×657, 1280×800 y 390×844 (también con movimiento reducido): sin errores de JavaScript ni desborde horizontal.

### 2026-11-02 · Problemas resueltos: tres casos más de Condicionales y textos revisados

- **Textos revisados** en bisiesto, podio y estacionamiento (pedido por el autor: buen sentido gramatical y nada que se preste a malinterpretarse). El bisiesto dice la regla en tres pasos numerados con «divisible entre 4 / 100 / 400», sin «salvo… salvo» ni «excepciones»; el podio quitó una doble negación; el estacionamiento explica «hora o fracción adicional» y su nota del pago concuerda con 1, 2 o más horas. La guía suma esas reglas en «Texto y estilo».
- **Tres casos nuevos** en la sección Condicionales (orden: bisiesto → podio → triángulo → celular → estacionamiento → mañana → El vuelto):
  - **¿Se puede armar el triángulo?** ★★★ (`problemas/triangulo/`): lados de menor a mayor, `a + b <= c`, tipo con `and`/`or` y rectángulo con Pitágoras. Detalles: por qué basta una comparación y no hace falta `a == c` (con datos desordenados, 8, 2, 3 da «Triángulo escaleno»). Enseñanza: «¿Y con decimales?» (0.5, 1.2, 1.3 y la tolerancia; la línea del arreglo mide 38 caracteres, fuera del reproductor).
  - **¿Qué plan de celular me conviene?** ★★★ (`problemas/celular/`): el mejor hasta ahora con `<` (empate: gana el primero del folleto). La salida dice «Conviene el plan …» (con «Te conviene» pasaba de 36 caracteres). `elif plan_c < costo` no falla con estos precios: el detalle muestra comparar C con `plan_a` (falla de 14 a 20 GB). Enseñanza: el más barato cambia tres veces (C hasta 4, A de 5 a 9, C de 10 a 13, B desde 14).
  - **El día de mañana** ★★★★ (`problemas/manana/`): 27 líneas; nudillos y `% 2`, el bisiesto resumido en un nodo del diagrama. Detalles: 353 / 11 / 1 días en 2026; `30 + mes % 2` para todos falla en 5 días y `>=` en 12. Enseñanza: fechas imposibles y la revisión con `or` (el código del arreglo se muestra resumido).
- **`problemas.css`**: en el móvil, el carrusel del bloque 1 no dejaba pasar de la historia a la hoja del enunciado (las hojas están en `.enunciado__hojas`, con `display: contents`, sin punto de imán). Arreglado para todos los casos.
- **Para revisar**: a 1366×657 el código del reproductor se desplaza en celular (21 líneas) y mañana (27), como en el podio. En el móvil, en el diagrama del celular la etiqueta «no» entre dos rombos seguidos roza el borde.

### 2026-11-01 · Problemas resueltos: tres casos de Condicionales

- **Sección nueva del catálogo, Condicionales** (entre Variables y fórmulas y Texto a fondo, con su botón en el filtro de tema), con tres casos elegidos por el autor entre seis propuestas:
  - **¿Es año bisiesto?** ★★ (`problemas/bisiesto/`): `elif` de lo particular a lo general (400, 100, 4). Escena: el año cae por tres filtros y la hoja de febrero de ese año gana o pierde el 29. Detalles: cuántas preguntas en 400 años (1 / 3 / 96 / 300), el orden al revés falla con 1900 y 2100, y la versión en una línea (con `de4`, `de100`, `de400`: sin paréntesis dice que 2026 es bisiesto; con `anio % 4 == 0 and (…)` los paréntesis no cambian nada, por eso no se usó). Enseñanza: «¿Por qué tantas reglas?», el desfase en siglos.
  - **El podio de la carrera** ★★★ (`problemas/podio/`): tres tiempos ordenados con `and` e `if` anidados (32 líneas). Escena: el árbol de decisiones de 6 hojas, con el `and` que se corta, y el podio. Detalles: siempre 3 o 4 comparaciones; decidir primero y último por separado falla con tres empates (Lucía desaparece); los empates. Enseñanza: «¿Y con cuatro corredores?» (24 hojas; adelanto con `sorted()`).
  - **El estacionamiento** ★★★ (`problemas/estacionamiento/`): 15 minutos gratis, hora o fracción con `(minutos + 59) // 60`, tope con `if` y la medianoche con `% 1440`. La salida dice `Estuviste N min` (con «minutos», la línea pasaba de 36 caracteres). Escena: el ticket con dos relojes, la barra de horas y el tubo de monedas con la raya del tope. Detalles: la gráfica escalonada, `minutos // 60 + 1` cobra de más en 60 y 120, y casos borde (15 justos, misma hora, 25 horas cobran como 1). Enseñanza: «¿Conviene salir y volver a entrar?» (partir 3 horas en tramos; con tramos de menos de 15 minutos sale gratis, y la regla de la placa lo arregla).
- **`reproductor.js`**: al terminar, el mapa de calor escribe ×0 (en gris) en las líneas con código que no corrieron: las ramas que no se tomaron. El podio además marca ×0 durante la ejecución, en cuanto una rama queda descartada.
- Pie de los vecinos: El reloj → bisiesto → podio → estacionamiento → El vuelto. `CLAUDE.md` y el banco de ideas de la guía, al día (quedan el plan de celular, el día de mañana y el triángulo).
- **Para revisar**: a 1366×657 el código del reproductor se desplaza en los tres (17, 32 y 16 líneas; sigue a la línea activa); a 1280×800 caben bisiesto y estacionamiento. En el móvil, el bisiesto angosta la columna de números del código en su página (la línea 16 llegaba al mapa de calor): si otro caso lo necesita, pasarlo a `problemas.css`. El árbol del podio en el móvil usa iniciales y se ve chico. **Probar con alumnos** si el ×0 se entiende como «esta rama no corrió».

### 2026-11-01 · Problemas resueltos: guía para armar casos y prueba guardada

- **`problemas/COMO-ARMAR-UN-CASO.md`**: lo aprendido con los seis primeros casos, para escribir más (pedido por el autor). Qué hace un buen caso (problema cotidiano, una idea central, algo que se pueda dibujar, un giro final), cómo elegir el tema (la última lección que hace falta) y la dificultad (de 1 a 5, con ejemplos), una tabla de lo que se puede usar en cada sección, la plantilla del enunciado (historia + Problema, Entrada, Salida y Ejemplos), qué va en cada bloque, reglas del programa (líneas de 36 caracteres o menos, datos primero, verificar con python3, decimales como los escribe Python), los datos de entrada y la escena, cómo publicarlo (catálogo, vecinos, documentos) y cómo probarlo. Al final, un banco de ideas por tema con nivel, escena y giro final.
- **`herramientas/probar-caso.js`**: la prueba con Playwright que se usó para los casos, ahora guardada (antes vivía en `/tmp` y se perdía con la sesión). Revisa que cada bloque quepa a 1366×657, 1280×800 y 390×844, desborde, errores, que el código no llegue al mapa de calor, cada dato de entrada hasta el final (imprime la consola) y el recorrido del diagrama; con `reducir`, lo mismo con movimiento reducido; con `catalogo`, los filtros del catálogo. Deja capturas en `capturas/`.
- `CLAUDE.md` apunta a la guía (en «Problemas resueltos» y en «Convenciones de trabajo»).

### 2026-11-01 · Problemas resueltos: buses, reloj y el catálogo por tema

- **La excursión en buses** (`problemas/buses/`, `problema-buses`, ★★, escrita por un agente): 47 alumnos en buses de 12. `llenos` y `sobran` con `//` y `%`, `buses = (alumnos + extra) // asientos` con `extra = asientos - 1` (redondear hacia arriba sin `if`) y los asientos libres. Escena: la fila de alumnos que suben a la cochera; los «de mentira» del `+ 11` como círculos vacíos. 4 datos: 47, 48 justos (el +11 no agrega un bus), 49 (un alumno solo en el último) y 30 en un bus de 40. Detalles: por qué funciona el +11, `alumnos // asientos + 1` falla con 48, y los casos borde (`ZeroDivisionError`). Enseñanza: «¿Un bus con un solo alumno?», repartir parejo con `//` y `%`.
- **El reloj que da la vuelta** (`problemas/reloj/`, `problema-reloj`, ★★, escrito por un agente): son las 9 y pasan 30 horas. `total`, `vueltas = total // 12`, `nueva = total % 12`. Escena: el reloj de agujas que da sus vueltas, con un contador, y la tira del total partida en bloques de 12. 4 datos: 9 + 30, 9 + 5, 10 + 100 y 9 + 3 (`Serán las 0`: el reloj marca 12). Detalles: mil horas con el mismo trabajo, el arreglo `(total - 1) % 12 + 1` y hacia atrás (`(9 - 15) % 12 = 6`). Enseñanza: «Todo lo que da vueltas» (días con `% 7`, minutos con `% 60`, reloj de 24 horas).
- **Sin números de caso** (pedido por el autor): «Caso 03» pasó a «Caso de Variables» (el tema que hace falta para leerlo) en la página, la cabecera y el título. El progreso no cambia (la clave es el nombre del caso).
- **Catálogo por tema**: una sección por tema en el orden del curso (Variables y fórmulas, Texto a fondo, Listas, Otras estructuras, Ordenar), cada una con «Para después de …», y dentro de cada una del más fácil al más difícil. Lo «Próximamente» va en su sección.
- **Dificultad de 1 a 5 estrellas** (las llenas en ámbar) y **filtro por dificultad**, que se combina con el de tema; si no queda ningún caso, «Todavía no hay casos con ese filtro». Niveles: la cuenta 1; buses, final y reloj 2; el vuelto 3; el torneo (pronto) 4; el laberinto 5; el mensaje secreto (pronto) 3.
- **Pie de cada caso** en el orden del catálogo: cuenta → buses → final → reloj → vuelto → laberinto. En el móvil se esconden «Caso anterior:» y «Siguiente caso:» (`.caso-fin .largo`, ahora en `problemas.css`). La cabecera no se parte en dos líneas en el móvil (el sello se recorta con «…» si no cabe).
- Probado con Playwright a 1366×657, 1280×800 y 390×844: cada bloque de los seis casos cabe en la pantalla, sin errores ni desborde; los filtros del catálogo combinados (p. ej. Listas + ★★ deja el aviso de vacío).

### 2026-11-01 · Problemas resueltos: dos casos básicos (03 y 04)

Casos que solo usan lo de Variables → Mensajes con f-strings (sin `if`, bucles ni listas), pedidos por el autor para empezar por lo básico. En el catálogo, un filtro nuevo «Variables»; el orden de lectura queda 03 → 04 → 01 → 02 (enlaces al pie de cada caso).
- **Caso 03 · La cuenta del restaurante** (`problemas/cuenta/`, `problema-cuenta`, ★☆☆): cinco amigos en una pollería, 137.50 de consumo y 10% de propina. `propina = consumo * porcentaje / 100`, `total`, `cada_uno = total / personas` y tres `print` con `:.2f`. Conceptos: un porcentaje con una cuadrícula de 100, el orden de las líneas (cambiadas dan `NameError`) y `:.2f`. La escena es la mesa: el ticket se llena, una barra consumo + propina se corta en partes iguales que vuelan a cada persona, y al final «5 × 30.25 = 151.25 ✓ cierra». 4 datos: la pollería, una pizza con 15%, un menú de 45.90 (el total guarda `50.489999999999995`: por qué el dinero va con `:.2f`) y 100 entre 3 (falta un céntimo). Detalles: siempre el mismo trabajo (tabla con dos controles), repartir antes o después da lo mismo, y `personas = 0` (`ZeroDivisionError`). Enseñanza: «¿Siempre cierra la cuenta?»: con `:.2f` entre 3 falta un céntimo y entre 6 sobran dos; en céntimos, con `//` y `%`, algunos pagan un céntimo más y cierra.
- **Caso 04 · ¿Cuánto necesito en el final?** (`problemas/final/`, `problema-final`, ★★☆, escrito por un agente): con prácticas 9 y 12, el final que vale doble y 11 para aprobar: `puntos = aprobar * 4`, `faltan = puntos - p1 - p2`, `final = faltan / 2` y la comprobación con la fórmula del promedio. Conceptos: un promedio con pesos, deshacer una cuenta (al revés, en orden inverso) y `/` siempre da decimales. Diagrama en zigzag de 3×3 (una columna en el móvil). La escena es una barra de puntos de 4 partes con la meta en 44 y una regla de 0 a 20. 4 datos: 9 y 12, 14 y 16, 5 y 6, y 2 y 0 (necesita 21.0: imposible, y el programa no se da cuenta). Detalles: por qué el final vale el doble, los paréntesis importan (sin ellos da 29.0) y notas enteras (`(faltan + 1) // 2`). Enseñanza: «¿Y si sale más de 20?», con el `if` que haría falta y el enlace a Condicionales.
- En `problemas.css`, una caja de variable con un valor largo (`33.333333333333336`) ya no se sale de su columna: el valor se parte.
- Probado con Playwright a 1366×657, 1280×800 y 390×844 (también con movimiento reducido): cada bloque cabe en la pantalla, sin errores de JavaScript ni desborde horizontal, y las cuatro entradas de cada caso llegan al final con la salida que da python3.

### 2026-11-01 · Problemas resueltos: bloques de una pantalla y diagrama de flujo

Ajustes pedidos por el autor a los dos casos:
- **Cada bloque cabe en una pantalla** (`.panel`, con imán al bajar y puntos al costado), medido con Playwright a 1366×657, 1280×800 y 390×844. En el móvil, lo que va lado a lado se vuelve carrusel y el reproductor muestra una parte a la vez con pestañas (Dibujo / Código / Variables); el código largo se desplaza solo, siguiendo la línea activa.
- **El caso con el enunciado completo**: la historia y una hoja con Problema, Entrada, Salida y Ejemplos.
- **La idea como diagrama de flujo**: `assets/js/flujo.js` (nodos de inicio/fin, proceso, decisión y datos, flechas que vuelven rodeando, filas que crecen en el móvil, `recorrer` para que una ficha lo siga con un ejemplo). En el laberinto, el diagrama es el cuerpo de `buscar(f, c)` con el nodo «buscar(vecino) ↺ la misma función».
- **Código y ejecución en un solo bloque**: el reproductor colorea cada línea con su paso de la idea (`ideas`).
- **«¿Lo entendiste?» pasó a «Detalles del algoritmo»**: tres tarjetas que se entienden sin volver al código. Vuelto: siempre 6 vueltas (tabla con un control), el orden de la lista (5 piezas frente a 87) y qué pasa si paga menos. Laberinto: cuántas llamadas como mucho (`1 + 4 × L`), qué pasa sin la miga (`RecursionError`) y cómo el orden de las direcciones cambia el camino.
- **La enseñanza final** se mantiene («¿Siempre funciona?», «¿Es el camino más corto?»). El caso queda «visto» al llegar al final (el catálogo dice «✓ Visto»).

### 2026-11-01 · Problemas resueltos: la zona y un piloto con dos casos

Una zona nueva, aparte de las lecciones y con su propio estilo (ver «Problemas resueltos» en CLAUDE.md): el alumno no programa; lee un caso más grande, entiende las ideas y al final ve el programa terminado correr con animaciones.
- **Estilo de cuaderno** (`assets/css/problemas.css`): papel crema con renglones, títulos con serifa, tinta azul, notas al margen en lápiz rojo y un escenario oscuro para la ejecución. Página larga que se lee bajando, con índice al costado y raya de avance (`assets/js/problemas.js`).
- **`assets/js/reproductor.js`**: la ejecución como un video: datos de entrada preparados (las líneas que cambian llevan raya amarilla), barra de tiempo para ir adelante y atrás, capítulos con rombos, momentos clave que pausan solos, velocidad, rastro de cada variable, mapa de calor de las líneas, nota de cada paso, consola y la escena propia del caso. Teclado: espacio, flechas, Inicio y Fin.
- **Catálogo** `problemas/index.html` (fichas con dibujo, dificultad, temas, filtro y «✓ Resuelto») y una banda en la portada.
- **Caso 02 · El laberinto** (`problemas/laberinto/`, `problema-laberinto`, escrito por un agente): `lab[f][c]` tocando casillas, los cuatro vecinos con `for df, dc in [...]`, «dejar una miga y volver por ella» con la pila; la idea en 4 pasos; la escena es la cuadrícula con el ratón, migas, callejones tachados, una pila compacta, contadores y una cámara que sigue al ratón (botón «Seguir al ratón»; sin zoom con movimiento reducido); 4 laberintos (sencillo, con callejones, sin salida y dos caminos), comprobados contra python3; 3 preguntas y «¿Es el camino más corto?» con una ola de búsqueda a lo ancho. Las llamadas que vuelven enseguida (pared, miga o `x`) se agrupan en un paso (`ejecuta: [...]`).
- Al juntarlos, en las piezas compartidas: `ejecuta` en `reproductor.js` (un paso con varias líneas suma todas en el mapa de calor), la escena recibe la velocidad, el código largo se desplaza dentro de su columna en escritorio, los textos del reproductor ya no se agrandan con los de la página y el índice se esconde detrás de la portada, del código ancho y de la ejecución.
- **Caso 01 · El vuelto de la cafetería** (`problemas/vuelto/`, `problema-vuelto`): `//` y `%` con una tira que se parte, recorrer la lista de valores, lo que falta se achica; la idea voraz en 4 pasos; la escena es una caja registradora (la pantalla «FALTA», el cajón con su ranura iluminada y los billetes que vuelan a la bandeja); 4 datos de entrada (87, 188, vuelto 0 y monedas raras 4, 3 y 1, donde la estrategia voraz no da lo mejor); 3 preguntas y «¿Siempre funciona?».

### 2026-11-01 · Errores: 7 lecciones

Tema nuevo después de Ordenar (el plan está en CLAUDE.md): leer un mensaje de error sin miedo y atrapar errores con `try`/`except`. Primero se hicieron las piezas compartidas:
- **`assets/js/mensaje-error.js`**: el `Traceback` como lo imprime Python 3.12 (`MensajeError.crear`: marcos, `^^^` o `subrayado` con `~`, «Did you mean», línea «En español», rótulos «dónde / qué línea / qué pasó», partes tocables que iluminan su línea en el código), el programa que se corta (`romper`: la línea roja con la pieza subrayada en onda y las de abajo apagadas con «no se ejecuta»; `sintaxis: true` apaga también las de arriba) y `try`/`except` (`zona`: raya azul en la zona protegida y naranja en la red; `lanzar`: una ficha roja con el tipo vuela de la línea que falla al `except`, que se ilumina, o rebota si no es su tipo). CSS en `base.css`, «Mensaje de error».
- **`assets/js/python.js`**: el coloreador de Python compartido (`Python.escribir`, `Python.colorear`, comillas simples, `tk-excepcion`), para no copiar uno en cada página.
- **`pasos.js`**: la salida se vuelve a repartir cuando lo que se ve o la salida cambian de alto (`ResizeObserver`; lo pedía la nota de Otras estructuras), y `Pasos.feedback` admite `{ html }` y conserva las clases propias del elemento. **`opciones-codigo.js`** colorea `try`, `except` y demás palabras clave. `Codigo.limpiar` borra también las marcas de error.

Luego las siete lecciones se escribieron en paralelo, una por agente, con todos los mensajes copiados de ejecutar los programas de verdad con `python3.12`/`3.13`:
- **1/7 · Leer un mensaje de error** (`errores`, 9 pasos): el programa se corta en la línea 4 («Hola» queda, «Fin» no sale), qué queda en la consola, las partes del mensaje, leerlo de abajo arriba, «Did you mean» (calculado con el algoritmo de CPython), dónde se corta, por qué no existe un nombre y un reto con dos errores.
- **2/7 · Errores al escribir** (`errores-sintaxis`, 10 pasos): un escáner lee todo antes de correr; falta `:`, paréntesis sin cerrar (tocar las parejas), texto sin cerrar, `=` en vez de `==`, la sangría con botones (16 combinaciones reales), ¿qué error da? y un reto con tres errores que se destapan uno a uno.
- **3/7 · Cada error con su nombre** (`errores-tipos`, 9 pasos): una colección de fichas (TypeError, ValueError, ZeroDivisionError, IndexError, KeyError, AttributeError), predecir, emparejar mensajes y causas, la máquina `int()` con dos puertas (tipo y valor), clasificar, el mismo programa con otro dato y el detective.
- **4/7 · El error viene de una función** (`errores-traza`, 8 pasos): un mensaje con dos lugares, la traza con la pila congelada en el error, dónde se arregla, tres niveles, leer de abajo arriba, el dato malo que vino de afuera y un reto con `.split()`.
- **5/7 · try y except** (`errores-try`, 9 pasos): el trapecista con y sin red, dos caminos, ¿qué imprime?, cada red atrapa su tipo (el `ZeroDivisionError` rebota), dos `except`, un `try` corto, la trampa de `except:` sin tipo y armar la red.
- **6/7 · Volver a pedir un dato** (`errores-pedir`, 9 pasos): un dato malo lo corta todo, `while True` con `try` y `break` (`BucleInput`), `isdigit` frente a `int`, el 25 que se cuela, dos filtros con `continue`, sin el primer `continue` (`NameError`), `pedir_nota` y un reto con cuatro misiones.
- **7/7 · Proyecto: la calculadora que no se rompe** (`errores-proyecto`, 8 pasos): romperla de cuatro formas, cinco partes (partir y desempaquetar, convertir, operador desconocido, un `except` para cada error, «fin») y el programa completo (26 líneas) con seis misiones; su salida coincide con python3 en 29 entradas.

Portada con la tarjeta del tema y «Siguiente: Errores →» en el proyecto de Ordenar. Probado con Playwright a 1280×800, 1366×657 y 390×844 (también con movimiento reducido): sin errores de JavaScript ni desborde horizontal.

### 2026-10-31 · Conjuntos: el código de «Sacar una ficha» se acumula

Al tocar `remove` o `discard`, el código se reemplazaba por esa sola línea y se perdía `colores = {"rojo", "azul", "verde"}`. Ahora la definición se queda arriba y cada acción se suma debajo (hasta 4, con el alto reservado); una línea que da `KeyError` se muestra, pero no queda en el programa. Se revisó con un script el resto del tema: los demás cambios de código son a propósito (otra versión, otra frase, completar el espacio en blanco).

### 2026-10-31 · Otras estructuras: 7 lecciones

Tema nuevo después de Listas y antes de Búsquedas: tuplas, diccionarios y conjuntos (el plan está en CLAUDE.md). Primero se hicieron las piezas visuales, hermanas de los casilleros: la tupla en `lista.js` (`tupla: true`: paréntesis y candado; `rechazar(i)` sacude lo que no se puede cambiar; `Lista.tupla` y los objetos simples se imprimen como tupla y diccionario), el diccionario en `assets/js/dicc.js` (casilleros con una clave colgada encima; `poner`, `quitar`, `marcar` con `KeyError`, vista vertical) y el conjunto en `assets/js/conjunto.js` (una bolsa con fichas sueltas; un repetido rebota; `Conjunto.venn` con dos bolsas que se cruzan y la zona del resultado iluminada). Luego las siete lecciones se escribieron en paralelo, una por agente.
- **1/7 · Una lista que no cambia** (`estructuras`, 10 pasos): tuplas, se leen como una lista, el `TypeError` del candado, `.append()` no existe, desempaquetar (y el `ValueError` si no coincide), `a, b = b, a`, `return menor, mayor` y un reto de minutos a horas.
- **2/7 · Cada valor con su nombre** (`estructuras-diccionarios`, 10 pasos): de dos listas en el mismo orden a un diccionario, pedir por clave, `KeyError`, `len` e `in`, agregar y cambiar, `del`, `.get()` y el total de una compra.
- **3/7 · Recorrer un diccionario** (`estructuras-recorrer`, 9 pasos): `for` sobre las claves, `.items()`, `.values()` (y las trampas `max(notas)` y `sum(notas)`), aprobados, la mejor nota con su nombre y un diccionario nuevo.
- **4/7 · Contar con un diccionario** (`estructuras-contar`, 9 pasos): palitos a mano, `if x in conteo`, letras de «banana», el `KeyError` sin revisar, `.get(x, 0) + 1`, palabras de una frase y quién ganó.
- **5/7 · Conjuntos** (`estructuras-conjuntos`, 9 pasos): `.add()` con repetidos, `remove` y `discard`, sin índices ni orden, `set(lista)`, `{}` frente a `set()`, `|`, `&` y `-` con las dos bolsas, y las letras en común.
- **6/7 · Estructuras juntas** (`estructuras-juntas`, 10 pasos): diccionario de listas, lista de diccionarios, lista de tuplas y cuál conviene en cinco situaciones.
- **7/7 · Proyecto: la votación del salón** (`estructuras-proyecto`, 9 pasos): jugar sin código, cinco partes (¿es candidato?, nadie vota dos veces, contar, `ganador` que devuelve dos valores, empates), el programa completo con `BucleInput` y misiones, y quiénes faltan votar.

Portada con la tarjeta del tema; el tres en raya enlaza ahora a Otras estructuras. Probado con Playwright a 1280×800, 1366×657 y 390×844 (también con movimiento reducido): sin errores de JavaScript ni desborde horizontal.

### 2026-10-31 · Ordenar: 7 lecciones

Tema nuevo después de Búsquedas (el plan está en CLAUDE.md), con burbuja, quicksort y mergesort. Primero se fijó en el plan un código Python común a las siete (para que las comparaciones coincidan entre lecciones: con las 8 notas de la carrera, burbuja 28, quicksort 14, mergesort 17) y se añadió **`assets/js/particion.js`**: una lista que se parte en pedazos, piso por piso, cada trozo bajo las columnas de donde salió y unido a su padre (CSS `.particion` en `base.css`). Luego las lecciones se escribieron en paralelo, una por agente, y se juntaron en `leccion/ordenar`.
- **1/7 · Intercambiar vecinos** (`ordenar`, 9 pasos): ordenar a mano tocando vecinos, `a = b` y `b = a` pierde un valor, la tercera caja `aux`, dos vecinos de una lista, una pasada decidida por el alumno, cuántas pasadas, el orden de las tres líneas y un reto («Haz de PC»).
- **2/7 · Ordenamiento de burbuja** (`ordenar-burbuja`, 10 pasos): traza con `i`, `j`, `aux` y la parte verde que crece, la PC eres tú, `burbuja` devuelve `None`, por qué `- 1` (IndexError) y `- i` (comparaciones de más), cuántas comparaciones (×2 → ×4), `hubo_cambio`, de mayor a menor y un reto.
- **3/7 · Quicksort** (`ordenar-quicksort`, 10 pasos): repartir alrededor del pivote, cada lado igual con `Particion`, el reparto en Python, la traza completa (pila compacta, fichas y partición), sin caso base (`IndexError`: la lista llega a `[]`), dos notas iguales con `elif`, una línea cambiada, la lista original no cambia y un reto.
- **4/7 · Mezclar dos listas ordenadas** (`ordenar-mezclar`, 10 pasos): dos montones tapados, por qué basta mirar la primera, la traza con los dedos `i` y `j`, decidir cada `if`, olvidar lo que sobra, `or` en vez de `and`, cuántas comparaciones, un adelanto de mergesort y un reto.
- **5/7 · Mergesort** (`ordenar-mergesort`, 9 pasos): partir y mezclar con `Particion`, la última mezcla a mano, partir 7 en 3 y 4, la traza con la pila, en qué orden pasa todo, cuántos pisos (frente a burbuja), tres trampas y un reto.
- **6/7 · ¿Cuál ordena más rápido?** (`ordenar-comparar`, 9 pasos): carrera en tres carriles, duplicar hasta 256, un millón de valores, listas ya ordenadas y al revés, por qué se atasca quicksort, mil valores en cuatro casos, la idea de `sorted()` y un reto con cinco casos.
- **7/7 · Proyecto: la tabla de posiciones** (`ordenar-proyecto`, 8 pasos): ordenar una tabla a mano, cinco partes (leer, de mayor a menor, mover las dos listas, empates, puestos) y el programa completo con `BucleInput` y cuatro misiones.

Portada con la tarjeta del tema y «Siguiente: Ordenar →» en el proyecto de Búsquedas. Probado con Playwright a 1280×800, 1366×657 y 390×844 (también con movimiento reducido): sin errores de JavaScript ni desborde horizontal. Al probar, el plan decía que quicksort sin caso base da `RecursionError`; con este código da `IndexError` (se corrigió en CLAUDE.md).


### 2026-10-31 · Búsquedas: 7 lecciones

Tema nuevo después de Listas (el plan está en CLAUDE.md). Primero se añadieron a `lista.js` las dos piezas del tema: casilleros **tapados** (`tapar`, `destapar`: buscar sin ver, como la PC) y **punteros** con nombre bajo la lista (`punteros({ inicio, medio, fin })`, que se deslizan y bajan un piso si chocan). Luego las siete lecciones se escribieron en paralelo, una por agente, y se juntaron en `leccion/busquedas`. En todas, un contador de comparaciones.
- **1/7 · Buscar uno por uno** (`busquedas`, 8 pasos): destapar hasta encontrar el 17, `buscar(lista, x)` línea a línea, la PC eres tú (True/False en cada comparación), mejor y peor caso, el `-1` en un `else` (falla tras una comparación), `in` e `.index()` por dentro y un reto.
- **2/7 · Buscar con condiciones** (`busquedas-condiciones`, 8 pasos): el primer desaprobado, dos listas paralelas, todas las posiciones, el último con `range(len - 1, -1, -1)`, un salón 3×3 con dos `for` y el reto `primero_con_20`.
- **3/7 · Partir a la mitad** (`busquedas-mitad`, 10 pasos): adivinar del 1 al 100, siempre el del medio, cuántas preguntas bastan (7 y 10), un diccionario de papel, casilleros ordenados que se apagan, qué pasa si no está ordenada y un adelanto del código.
- **4/7 · Búsqueda binaria** (`busquedas-binaria`, 9 pasos): el código con punteros y cajas del mismo color, decidir qué línea sigue, la tabla de seguimiento, cuando no está, los errores `inicio = medio` (bucle sin fin, cortado) y `<` en vez de `<=`, con nombres y un reto.
- **5/7 · Búsqueda binaria con recursión** (`busquedas-recursiva`, 8 pasos): la pila con `inicio` y `fin` en cada tarjeta, la vuelta hecha por el alumno, el caso base, `while` frente a recursión (mismas tablas), la trampa de la rebanada y un reto.
- **6/7 · ¿Cuál es más rápida?** (`busquedas-comparar`, 9 pasos): una carrera en dos carriles, el peor caso, duplicar la lista (×2 frente a +1), `mitades(n)` y `binario`, un millón de valores, la lista desordenada (ordenar cuesta) y buscar muchas veces.
- **7/7 · Proyecto: la PC adivina tu número** (`busquedas-proyecto`, 7 pasos): jugar sin código, cuatro partes (el medio, descartar la mitad, contar preguntas, detectar la trampa) y el programa completo con `BucleInput` y misiones (del 1 al 1000 cambiando una línea).

Portada con la tarjeta del tema y «Siguiente: Búsquedas →» en el tres en raya. Probado con Playwright a 1280×800, 1366×657 y 390×844 (también con movimiento reducido): sin errores de JavaScript ni desborde horizontal.

### 2026-10-29 · Escritorio: cada paso en una sola pantalla

En una PC casi todos los pasos obligaban a bajar: el título y el enunciado empujaban la animación hacia abajo y los retos iban en una columna de 40rem con los lados vacíos. Medido con Playwright en todas las lecciones (344 pasos), pasos que caben sin bajar:

| Pantalla (área visible) | Antes | Después |
|---|---|---|
| 1366×657 (laptop) | 51 | 177 |
| 1536×730 (laptop con escala 125 %) | 119 | 251 |
| 1920×960 (Full HD) | 295 | 328 |

- **Paso con `.lab`**: el paso entero es la tarjeta, en dos columnas: enunciado y código a la izquierda; lo que se ve y la salida a la derecha, desde arriba. Si la derecha queda mucho más alta, la salida pasa bajo el código (`paso--salida-abajo`, lo decide `pasos.js` al entrar al paso y al cambiar el tamaño de la ventana).
- **Paso con otra tarjeta** (retos, predicciones): el enunciado en una columna a la izquierda (fija al bajar) y la tarjeta a la derecha. Las opciones de código de varias líneas cortas van de dos en dos (`opciones--bloques`, desde 1280px).
- **Más ancho y más alto**: hasta 90rem de ancho; cabecera y pie más bajos; títulos de paso algo más chicos en escritorio.
- **Tras «Comprobar»**, si el mensaje queda bajo el pie, la página baja sola hasta él.
- El móvil no cambia (capturas a 390 px comparadas píxel a píxel antes y después).

**Lo que aún no cabe a 1366×657**: los programas completos de los proyectos (`paso-jugar`, hasta 48 líneas), la pila llena de Recursión (5 tarjetas), los resúmenes finales con código largo y algunos retos con objetivo + código + opciones. Ideas: que el código largo se desplace dentro de su caja siguiendo la línea activa, o que la columna derecha (tablero y consola) quede fija al bajar.

### 2026-10-28 · Recursión: más ejemplos para practicar y un proyecto nuevo

Recursión pasa de 4 a 7 lecciones; el plan está en CLAUDE.md. Las cuatro nuevas se escribieron en paralelo, una por agente, y se revisaron con capturas a 1280 y 390 px.
- **3/7 · Dígitos y bases** (`bases/`, `recursion-bases`, 10 pasos): `contar_digitos`, los restos de dividir entre 2, `binario` con el `print` antes (al revés) y después de la llamada (en orden), la versión que devuelve un texto, `a_base(n, b)` con controles y un reto para completar `a_base`.
- **5/7 · Imprimir combinaciones** (`combinaciones/`, `recursion-combinaciones`, 9 pasos): `lanzar(n, tiros)` con monedas, el árbol de decisiones, cuántas salen, piedra, papel o tijera en 2 rondas, podar ramas con `ultima` y el reto de la escalera (`escalera(falta, camino)`, 5 caminos). El árbol pasó a `assets/js/arbol.js` (CSS en `base.css`, `.arbol-llamadas`); Árbol de llamadas lo usa y se ve idéntica (capturas comparadas píxel a píxel).
- **6/7 · A practicar** (`practica/`, `recursion-practica`, 12 ejercicios): «¿Qué imprime?», «Completa el espacio en blanco», «Encuentra el error» y «Traza en la tabla», y un balance por tipo al final.
- **7/7 · Proyecto: el candado** (`candado/`, `recursion-candado`, 9 pasos): abrirlo a mano, `probar(n, clave)` genera las 27 claves, parar al encontrarla (el `True` baja por la pila), una pista que poda ramas y un reto con un candado de 4 ruedas y un tope de intentos.
- **Hanói escondida**: fuera de la portada y sin enlaces (ver arriba). Las etiquetas pasan a `/7` y los «Siguiente» van Valores → Bases → Árbol → Combinaciones → Práctica → Candado → Texto a fondo.

### 2026-10-28 · Árbol de llamadas: quién llama a quién en fibonacci

En el paso «Una función que se llama dos veces» costaba seguir las llamadas: todas las tarjetas decían «pausada en la línea 5», las fichas se amontonaban bajo la misma línea y el `▢` no decía quién lo iba a llenar.
- **La llamada pendiente con su nombre**: la tarjeta que espera muestra `return [fibonacci(3) ↑] + fibonacci(2)` (la de encima) y, al volver, el valor cae en su lugar (`return 2 + fibonacci(2)`). Lo mismo el programa: `print([fibonacci(4) ↑])`. En `pila.js`, `espera`.
- **La línea 5 con los números puestos**: debajo de la línea, `n=4  return fibonacci(3)     + fibonacci(2)`, cada parte bajo su llamada, con la que se hace resaltada en verde y el valor que llega en azul (`Codigo.valores`, o `valores` en el estado de la pila).
- **Fichas bajo su llamada**: la ficha `n=4` va bajo `fibonacci(n - 1)` o bajo `fibonacci(n - 2)`, según cuál espere (`columna` en `Codigo.pausas` y en la tarjeta).
- **Menos pasos**: «nace n» y el `if` van en un solo paso, y la llamada se anuncia en la tarjeta que llama (la nueva aparece después). Con `fibonacci(4)`, de 46 a 37 pasos. Botón nuevo «Siguiente salto ▸▸» (`saltar` en `Traza`, pasos con `parada: true`): avanza deprisa hasta la siguiente llamada o vuelta (18 saltos con `fibonacci(4)`).

### 2026-10-27 · Listas: cómo se hizo

Las lecciones 2 a 8 se escribieron en paralelo, una por agente (cada uno en su copia del repositorio y su rama), a partir de Listas 1/8 y `lista.js`; luego se revisaron con capturas a 390 px, se fusionaron en orden y se ajustó `lista.js` con lo que encontraron (tamaño de los casilleros según lo largo de los valores, `capacidad`, copia en profundidad, fila marcada en la cuadrícula). Scripts de prueba: recorrer todos los pasos desbloqueados (`maximo` en `lpa:progreso`) con capturas, y buscar listas partidas en dos filas.

### 2026-10-27 · Listas 8/8: Proyecto: tres en raya (michi)

**Lección** `lecciones/listas/proyecto/` (`data-leccion="listas-proyecto"`), 7 pasos:
1. Jugar una partida sin código, tocando el tablero (contra la PC o con otra persona), con la lista `tablero` al lado.
2. Parte 1 · Poner una ficha: `tablero[f][c] = turno` (trampas: al revés, `tablero[f] = turno` y `==`).
3. Parte 2 · Leer la fila y la columna: `dato.isdigit() and int(dato) <= 2` (trampas: sin `isdigit`, con `or` y solo `isdigit`).
4. Parte 3 · ¿Hay tres en línea?: las casillas de la columna k en `gano` (`t[0][k], t[1][k], t[2][k]`).
5. Parte 4 · Ahora le toca al otro: cambiar el turno con `if`/`else` (trampas: dos `if` separados, solo un `print` y `turno = "O"`).
6. Reto: el programa completo (48 líneas) con `BucleInput` y cuatro misiones: ganar con una columna, con una diagonal, intentar una casilla ocupada y llegar a un empate.
7. Resumen con el programa completo.

Portada y botón «Siguiente» en la lección anterior. Probado con Playwright a 1280 y 390 px (respuestas equivocadas y movimiento reducido incluidos): sin errores de JavaScript ni desborde horizontal.

### 2026-10-27 · Listas 7/8: Listas dentro de listas

**Lección** `lecciones/listas/anidadas/` (`data-leccion="listas-anidadas"`), 8 pasos:
1. Un tablero en tres filas: de `fila0`, `fila1` y `fila2` a `tablero = [[…], …]`; cada casilla vuela a la cuadrícula.
2. Cada casillero es una fila: `print(tablero[i])` imprime una lista entera.
3. Primero la fila, luego la columna: dos controles para `tablero[f][c]`, con la expresión resuelta paso a paso; hay que encontrar las tres X.
4. ¿Qué da cada una?: predecir `len(tablero)` (trampa: 9), `tablero[2][0]` y `tablero[3][0]` (IndexError).
5. Tu jugada: `tablero[f][c] = "O"` en una casilla vacía.
6. Fila a fila, casilla a casilla: dos `for` que dibujan el tablero en la consola, y una versión con `" | ".join(fila)`.
7. Reto: ¿dónde puedo jugar? (`tablero[f][c]` en el `if`; trampas `tablero[c][f]`, `tablero[f]` y `tablero[0][c]`).
8. Resumen.

Portada y botón «Siguiente» en la lección anterior. Probado con Playwright a 1280 y 390 px (respuestas equivocadas y movimiento reducido incluidos): sin errores de JavaScript ni desborde horizontal.

### 2026-10-27 · Listas 6/8: Dos nombres, una lista

**Lección** `lecciones/listas/referencias/` (`data-leccion="listas-referencias"`), 8 pasos:
1. Con números, dos cajas: `b = a` copia el 5 y cambiar `b` no toca `a`.
2. ¿Y con una lista?: predecir qué imprime `print(a)` tras `b = a` y `b.append(20)`; aparece una segunda etiqueta sobre la misma fila.
3. Una lista, dos etiquetas: cambiar con un nombre y mirar con el otro, en los dos sentidos.
4. Si quieres otra lista, cópiala: `b = a.copy()` hace una fila nueva y cada una cambia por su lado.
5. ¿Otro nombre u otra lista?: predecir tres programas (`y = x`, `x.copy()`, `x[:]`).
6. Una lista que entra en una función: `agregar_nota(notas, 15)` cambia la lista de afuera; `sumar_uno(x)` con un número, no.
7. Reto: guardar las notas originales con `notas.copy()` antes de corregirlas; trampas `notas`, `notas[1]` y `notas.sort()`.
8. Resumen.

Portada y botón «Siguiente» en la lección anterior. Probado con Playwright a 1280 y 390 px (respuestas equivocadas y movimiento reducido incluidos): sin errores de JavaScript ni desborde horizontal.

### 2026-10-27 · Listas 5/8: De texto a lista y de vuelta

**Lección** `lecciones/listas/texto/` (`data-leccion="listas-texto"`), 8 pasos:
1. Cortar una frase en palabras: `frase.split()` sobre una frase que el alumno cambia; cada palabra vuela de la cinta a su casillero, también con varios espacios seguidos.
2. ¿Letras o palabras?: predecir `len(frase)`, `len(frase.split())`, `frase.split()[-1]` y `list("sol")`.
3. Cortar en otro lugar: `"pan, té, ají"` con `.split()`, `.split(",")` y `.split(", ")`.
4. Limpiar cada pedazo: `cosas[i] = cosas[i].strip()` en un `for i in range(len(cosas))`.
5. De vuelta a un texto: `sep.join(partes)` con varios separadores, y el `TypeError` con números.
6. Varios números en una línea: `input().split()` y `notas.append(int(p))`, con la suma al final.
7. Reto: el día, el mes y el año de `"21/10/2026"` con `fecha.split("/")`; trampas `split()`, `list(fecha)` y `"/".join(fecha)`.
8. Resumen.

Portada y botón «Siguiente» en la lección anterior. Probado con Playwright a 1280 y 390 px (respuestas equivocadas y movimiento reducido incluidos): sin errores de JavaScript ni desborde horizontal.

### 2026-10-27 · Listas 4/8: Ordenar y buscar

**Lección** `lecciones/listas/ordenar/` (`data-leccion="listas-ordenar"`), 8 pasos:
1. De menor a mayor: `ordenadas = sorted(notas)`; aparece otra fila y la original no cambia.
2. Ordenar la misma lista: `notas.sort()` (los casilleros viajan a su lugar) frente a `notas = notas.sort()` (`None`).
3. Al revés, y también textos: `sorted(…, reverse=True)` con notas y con nombres (las mayúsculas van antes).
4. El podio: qué rebanada de `ranking` va en el espacio en blanco (`[:3]`; trampas `[3:]`, `[-3:]` y `[1:3]`).
5. ¿Dónde está? ¿Cuántas veces?: `.index()` y `.count()`, y el `ValueError` de `.index()` frente al `-1` de `.find()`.
6. ¿Quién expone hoy?: `random.choice(alumnos)` como una ruleta.
7. Reto: `mejor(alumnos, notas)` devuelve `alumnos[notas.index(max(notas))]`, con tres juegos de datos.
8. Resumen.

Portada y botón «Siguiente» en la lección anterior. Probado con Playwright a 1280 y 390 px (respuestas equivocadas y movimiento reducido incluidos): sin errores de JavaScript ni desborde horizontal.

### 2026-10-27 · Listas 3/8: Recorrer y acumular

**Lección** `lecciones/listas/recorrer/` (`data-leccion="listas-recorrer"`), 8 pasos:
1. Sumar todas las notas: `total = total + nota` línea a línea; cada nota vuela del casillero a la caja y `total` crece.
2. ¿Cuántos aprobaron?: predecir qué imprime (2, 3 o 5) y ejecutar; los casilleros se pintan verde o naranja y `cuantos` sube con los verdes.
3. La mayor hasta ahora: en cada vuelta el alumno decide si `mayor` cambia (la trampa: `12 > 12` en la primera vuelta).
4. Python ya lo sabe hacer: `sum`, `max`, `min` y `len` comparados con lo hecho a mano, y el promedio `sum(notas) / len(notas)` (trampas: 57 y 14.25).
5. Una lista solo con los aprobados: `aprobados = []` y `aprobados.append(nota)` dentro del `if`; la segunda lista crece.
6. ¿De quién es la nota?: `for i in range(len(notas))` con `alumnos` y `notas` en el mismo orden; se marca el mismo casillero en las dos.
7. Reto: ¿quién sacó la mayor nota? (`mejor` guarda un índice: `mejor = i`); trampas: `notas[i]` (IndexError), `mejor + 1` e `i + 1`, con tres pruebas.
8. Resumen.

Portada y botón «Siguiente» en la lección anterior. Probado con Playwright a 1280 y 390 px (respuestas equivocadas y movimiento reducido incluidos): sin errores de JavaScript ni desborde horizontal.

### 2026-10-27 · Listas 2/8: Agregar y quitar

**Lección** `lecciones/listas/cambiar/` (`data-leccion="listas-cambiar"`), 8 pasos:
1. Una lista que crece: `compras = []` y botones que agregan cosas con `.append()`; cada valor vuela a un casillero al final. Hay que agregar 3.
2. Meterse en la fila: `fila.insert(i, "Iván")` con un control de posición; los casilleros de la derecha se corren y su índice sube 1. Hay que probar al principio y en medio.
3. Sacar a alguien de la fila: `atendido = fila.pop()` frente a `fila.pop(0)`; el casillero se va y su valor vuela a la caja `atendido`.
4. Quitar por lo que es: `compras.remove("pan")` quita solo el primero de dos; `remove("queso")` da `ValueError` y con `if "queso" in compras:` no.
5. ¿Hay que guardarlo?: predecir qué imprime `notas = notas.append(15)`; la lista pierde su nombre y `notas` queda con `None`.
6. Llenar la lista tú mismo: `while True` con `input()`, `break` con «fin» y `notas.append(int(dato))` (`BucleInput`); cada nota vuela a un casillero.
7. Reto, la fila del cine: qué tres líneas dejan `["Eva", "Luis", "Sofía", "Iván"]`; las trampas: `pop()` en vez de `pop(0)`, el orden de `insert` y `pop(0)`, y `fila = fila.append(...)` (`None` y `AttributeError`).
8. Resumen.

Portada y botón «Siguiente» en la lección anterior. Probado con Playwright a 1280 y 390 px (respuestas equivocadas y movimiento reducido incluidos): sin errores de JavaScript ni desborde horizontal.

### 2026-10-27 · Listas 1/8: Muchos valores en una variable

**`assets/js/lista.js`** (`Lista.crear`) y sus estilos (`.lista` en `base.css`): la lista como fila de casilleros con el índice encima (y el negativo debajo, opcional), corchetes en los bordes de la fila (nunca quedan solos en otra fila) y etiquetas con el nombre. Los textos se ven con comillas y en verde. Anima `cambiar`, `agregar`, `insertar`, `quitar` y `reordenar` (los casilleros que se quedan se deslizan a su lugar nuevo); una lista de listas se ve como cuadrícula. `Lista.python` da lo que imprime `print`.

**Lección** `lecciones/listas/` (`data-leccion="listas"`), 8 pasos:
1. Cinco notas, cinco variables: cinco cajas `nota1` … `nota5`; con «Juntar en una lista», el código pasa a `notas = [14, 9, 17, 11, 6]` y cada nota vuela de su caja a su casillero.
2. Cada casillero tiene su número: un control mueve el índice de `print(notas[i])`; hay que encontrar la primera y la última.
3. Lo mismo que en un texto: sin los números a la vista, predecir `len(notas)`, `notas[-1]` y `notas[5]` (IndexError).
4. Un nombre entero en cada casillero: `palabra[1]` en la cinta de `"Ana"` frente a `alumnos[1]` y `len(alumnos)` en la lista (la trampa: 12 letras).
5. Cambiar un casillero: `notas[1] = 12` (el 9 sale y entra el 12) frente a `palabra[0] = "M"` (TypeError). Hay que probar los dos.
6. Una por una: `for nota in notas` con la caja `nota` y `17 in notas`, línea a línea.
7. Reto: corregir la nota de Sofía con dos listas en el mismo orden (`notas[2] = 18`); las trampas: `notas[3]` (contar desde 1), `notas[17]` (la nota en vez del índice) y `notas = 18` (se pierde la lista).
8. Resumen.

Portada: Listas pasa a `tarjeta-tema` con su primera lección, y una tarjeta «Próximamente» para Errores. Botón «Siguiente: Listas» en el Proyecto: el ahorcado. Probado con Playwright a 1280 y 390 px: sin errores de JavaScript.

### 2026-10-27 · Plan de Listas

Plan del tema en CLAUDE.md, 8 lecciones en `lecciones/listas/`: Muchos valores en una variable, Agregar y quitar, Recorrer y acumular, Ordenar y buscar, De texto a lista y de vuelta, Dos nombres, una lista, Listas dentro de listas y Proyecto: tres en raya (michi). La visualización central será una fila de casilleros (`Lista.crear`, por hacer). Listas va antes que Errores (antes era al revés).

### 2026-10-27 · Recursión: la vuelta, mejor explicada

Las cuatro ideas que quedaban para explicar la vuelta de la recursión:

- **Colores de ida y de vuelta.** `Traza` acepta `fase: "ida"` / `"vuelta"` en un paso: la flecha de salto sale naranja al llamar y azul al volver, y si vuelve a la misma línea (la llamada recursiva de `factorial` vuelve a la línea 5 de la de abajo) da una vuelta pequeña en vez de no dibujarse (`Codigo.salto(pre, desde, hasta, tipo)`). En una consola con `consola--fases`, lo que se imprime a la ida lleva una raya punteada naranja y lo de la vuelta una continua azul, con la leyenda `leyenda-fases`. Todas las trazas de Recursión marcan sus fases; la consola de colores está en Recursión 1/4 (`cuenta_regresiva` y `abrir`).
- **¿Termina en el caso base?** y **deshacer la pila en Recursión 1/4**: paso nuevo «Ahora la vuelta la haces tú» (la lección pasa de 6 a 7 pasos; la clave `recursion` no cambia). La pila de `abrir(3)` empieza llena justo después de «¡Un caramelo!»: primero hay que responder si el programa termina ahí (no: las de abajo siguen esperando); luego se toca la tarjeta de arriba y se elige qué imprime al seguir («Cierro la caja 1», con pistas para «Abro…», otra caja y «Nada»). Cada «Cierro» cierra su caja de regalo y sale en azul en la consola; al final se toca el programa. La pila no se mueve en todo el recorrido (pregunta, opciones y explicación reservan su alto).
- **La cuenta que crece y se encoge** (Recursión 2/4, `factorial`): encima de la pila, `factorial(4)` → `4 * factorial(3)` → `4 * (3 * (2 * factorial(1)))` a la ida (borde naranja punteado) y `4 * (3 * (2 * 1))` → `4 * (3 * 2)` → `4 * 6` → `24` a la vuelta (borde azul), con la parte que cambia resaltada.
- **Tabla de seguimiento** (Recursión 2/4, `suma_digitos`): llamada | espera | devuelve. Las filas se llenan hacia abajo a la ida (`2 + ▢`, `caso base`) y la columna «devuelve», hacia arriba a la vuelta; el valor vuela de «devuelve» al ▢ de la fila de arriba. Una nota dice que así se traza en papel.
- **Deshacer la pila en el Árbol de llamadas**: paso nuevo «Ahora la vuelta la haces tú» (la lección pasa de 7 a 8 pasos; la clave `recursion-arbol` no cambia). Python baja solo por el árbol de `fibonacci(4)` y las hojas vuelven solas; cuando una llamada tiene sus dos partes, se detiene: hay que tocarla (anillo que late; tocar una punteada da una pista) y elegir qué devuelve (pistas para la primera parte, la segunda, su n, +1 y el producto).

Probado con Playwright a 1280 y 390 px (respuestas y toques equivocados incluidos): la pila y el árbol no se mueven durante la vuelta, el botón «Ejecutar línea» tampoco en las trazas con cuenta y tabla, y sin errores de JavaScript en ninguna lección.

### 2026-10-27 · Recursión 2/4: el alumno deshace la pila

**Paso nuevo** «Ahora la vuelta la haces tú» en `lecciones/recursion/valores/` (después de «Cada llamada devuelve su parte»; la lección pasa de 7 a 8 pasos, la clave `recursion-valores` no cambia):
- La pila empieza llena: programa, `factorial(4)`, `(3)` y `(2)` pausadas en la línea 5 con su `return n * ▢`, y `factorial(1)` arriba. Solo se puede tocar la de arriba (anillo que late, «👆 Tócala: es la única que puede volver»); tocar otra da una pista: está pausada y espera a la de encima.
- Al tocarla, se elige qué devuelve entre cuatro números (`¿Qué devuelve factorial(3)?` con `return 3 * 2`). Cada respuesta equivocada tiene su pista: lo que recibió (2), la suma (5), el total de todo (24) o su n. Las pistas van en la explicación, que en el móvil queda justo encima de las opciones.
- Al acertar, la tarjeta muestra «↩ devuelve 6», se va y el valor vuela al ▢ de la de abajo, que retoma («▶ sigue en la línea 5») y pasa a ser la de arriba. Al final se toca el programa, que imprime 24.
- `Pila.crear(el, { alTocar })` y `tocable` en el estado (tarjeta de arriba como botón, con Enter o espacio; `p.tope()` para darle el foco). El código, el rótulo, la explicación y las opciones reservan su lugar: la tarjeta de arriba no se mueve en todo el recorrido.

Probado con Playwright a 1280 y 390 px (toques y respuestas equivocadas, teclado, «Llenar la pila otra vez»): sin errores de JavaScript.

### 2026-10-27 · Recursión: el código y los botones ya no saltan

**Problema**: en las trazas de Recursión, al tocar «Ejecutar línea» el código y los botones de debajo se movían de un paso a otro (hasta 165 px), así que el botón se escapaba del dedo o del ratón. Tres causas:
- las fichas de las llamadas pausadas (`n=3`) añaden filas debajo de la línea de la llamada, y el bloque de código crecía y se encogía;
- el rótulo «Ahora corre» se partía en dos o tres líneas cuando la llamada tenía varias variables (Torres de Hanói) y empujaba el código;
- la explicación de cada paso tiene un largo distinto (en el móvil, de 1 a 5 líneas).

**Arreglo**:
- `Codigo.reservarAlto(el, estados, pintar)`: mide una copia invisible de `el` en cada estado y le fija el mayor alto como `min-height`; vuelve a medir cuando aparece o cambia de ancho (`ResizeObserver`).
- `Traza` reserva el alto de la explicación más larga, y con la opción nueva `pila` (la `Pila.crear` que pinta `paso.estado`) llama a `pila.reservar(estados)`: el código guarda el alto con todas las fichas y el rótulo, el de su llamada más larga. Las 6 trazas de Recursión pasan `pila`.
- CSS: la explicación queda centrada en su espacio (`align-content: center`); el rótulo se pega al código y su cuerpo va al lado de «Ahora corre:» si hay lugar (en Hanói ocupa dos líneas en vez de tres).

La reserva de la explicación vale para todas las lecciones con `Traza`. Probado con Playwright a 1280 y 390 px: en las 6 trazas de Recursión el botón «Ejecutar línea» se mueve 0–1 px durante toda la ejecución (antes, 55–165 px), y sin errores de JavaScript en ninguna lección.

### 2026-10-23 · Arreglo de los vuelos de valores (Variables locales y el resto)

**Problema** (visto en Funciones 5/7 · Variables locales): al llamar a `total(5, 3)`, el 5 y el 3 volaban a lugares distintos de sus cajas y luego saltaban a ellas. Dos causas:
- las cajas se creaban una a una y el texto «Recién abierta: aún no hay cajas.» seguía ocupando lugar al lanzar el vuelo, así que cada valor apuntaba adonde estaba su caja antes de que llegaran las demás (el 5 aterrizaba 214 px a la izquierda);
- en general, `Codigo.volar` medía el destino solo al salir: si algo se movía durante el vuelo (se ocultaba el chip True/False de encima, la línea de consola entraba subiendo 8 px, se quitaba una tarjeta de la pila), el valor aterrizaba en el lugar viejo y luego saltaba. Pasaba también en Recorrer un texto, Salir antes, Decidir en cada vuelta, Funciones 1/7, Recursión que devuelve valores y Torres de Hanói.

**Arreglo**:
- `Codigo.volar` vuelve a medir el destino en cada cuadro: el valor lo sigue y aterriza donde está. La copia toma el tamaño exacto del destino (antes una `caja__valor` pequeña volaba con el `min-width` de la grande) y, si el destino entra con una animación, se mide ya en su lugar final.
- `Caja.poner(caja, valor, origen)` acepta un origen (elemento o rectángulo) y `Codigo.piezaEnLinea(linea, textos)` da la pieza de una línea con ese texto. Los parámetros ahora salen de su argumento en la llamada, no de la línea del `def`: Variables locales (`desde` en el estado del paso), Funciones 1/7 (`doble(4)`, `saludar("Ana")`), Varios parámetros (de la ficha de cada argumento; el valor por defecto sigue saliendo del `def`) y Funciones que deciden (`aprobado(15)`, `doble(5)`).
- Variables locales: primero se crean todas las cajas de un paso y después se ponen los valores; la caja que nace ya no se escala (solo su nombre da un salto), para que el valor no vuele a una caja que está cambiando de tamaño; la copia que vuela a una caja verde va en verde; flecha de vuelta (`flecha: true`) al volver de la función.
- Variables locales, pasos «Desde fuera no se ven» y «Sacar un valor con return»: la consola se vacía al empezar cada ejecución y al cambiar de versión (antes quedaba el `NameError` de `print(suma)` encima del 15 de `print(pagar)`).

Probado con Playwright en todas las lecciones a 1280 y 390 px con un detector que compara dónde aterriza cada copia con su destino: sin errores de JavaScript.

### 2026-10-22 · Texto a fondo 5/5: Proyecto: el ahorcado

**Lección** `lecciones/texto/proyecto/` (`data-leccion="texto-proyecto"`), 7 pasos:
1. Jugar una partida (sin código): la consola pide letras (`BucleInput`); el tablero muestra 6 corazones que se apagan, la palabra con las letras ya descubiertas y la cinta de `dichas`, adonde vuela cada letra nueva (verde si está en la palabra, naranja si no). Solo acepta una letra.
2. Parte 1 · La palabra oculta: qué código arma `p a p a _ a` con `dichas = "ap"` (trampas: `oculta = ""` dentro del `for`, `letra in secreta` y `dichas in letra`), probado con `dichas` = `""`, `"a"` y `"ap"`. Al acertar, el `for` se anima letra a letra sobre las cintas de `secreta` y `dichas`.
3. Parte 2 · Leer una letra: `input().strip().lower()` frente a sin nada, solo `.lower()` y `.strip().upper()`, con «a», «␣A» y «P␣».
4. Parte 3 · ¿Está o no está?: `nueva in secreta` frente a `find(nueva) > 0` (falla con la «p», que está en la casilla 0), `count(nueva) == 1` y `nueva == secreta`, con a, p, y, x y las vidas que van quedando.
5. Parte 4 · ¿Ganaste?: `"_" not in oculta` frente a `"_" in oculta` (gana al empezar), `oculta == secreta` (los espacios) y `len(dichas) == len(secreta)` (las letras repetidas).
6. Reto: el programa completo (31 líneas, con `elegir_palabra()` y `random.randint(1, 3)` para elegir entre papaya, cereza y mango, sin listas), con las líneas de cada vuelta resaltadas y tres misiones: recibir un «¡Bien!», perder una vida y ganar una partida. En el móvil, el tablero y las misiones van antes que el programa.
7. Resumen con lo que se usó y el programa completo.

Portada y botón «Siguiente» en Buscar en un texto. Probado con Playwright en 1280 y 390 px (ganando y perdiendo partidas), reanudando en cada paso y con movimiento reducido: sin errores.

### 2026-10-22 · Texto a fondo 4/5: Buscar en un texto

**Lección** `lecciones/texto/buscar/` (`data-leccion="texto-buscar"`), 8 pasos:
1. `.count()` sobre «banana»: cada aparición se ilumina por turnos (verde y azul, alternados) y el contador sube con ella. Hay que contar algo que aparezca varias veces y algo que no esté. Con «ana» explica que no se solapan (cuenta 1) y con «A», que las mayúsculas cuentan.
2. `.find()` sobre «ana@web.pe»: la casilla azul revisa de izquierda a derecha hasta encontrar el pedazo (sube en verde) o llega al final y todo se apaga con `-1`. Hay que buscar algo que esté y algo que no.
3. Antes y después de la @: predecir qué guarda `usuario`, y línea a línea `arroba`, `usuario = correo[:arroba]` y `dominio = correo[arroba + 1:]` caen en sus cajas mientras la cinta marca cada parte. Con «Probar un correo sin @», `.find()` da `-1` y `correo[:-1]` corta la última letra sin error: hay que revisar antes con `in`.
4. `.startswith()` / `.endswith()` sobre «playa.jpg»: se comparan solo las casillas del principio o del final (verde si coinciden, naranja si no) y sale un chip `True`/`False`. Con «ya» (está, pero en el medio) remite a `in`; con «.JPG», a las mayúsculas.
5. `.isdigit()` antes de `int()`: una consola pide la edad; dígitos en verde y lo demás en naranja. Explica el espacio, el signo «-», el punto y el `ValueError` que daría `int()` sin el `if`.
6. Volver a preguntar: `while True` con `input().strip()`, `.isdigit()` y `break` (con `BucleInput`). Hay que ver al menos un rechazo antes del número.
7. Reto: qué condición acepta solo celulares de 9 dígitos que empiezan con 9. Cuatro pruebas con el chip de cada parte del `and`; las trampas: sin `len`, sin `.isdigit()` y `find("9") != -1` en vez de `.startswith("9")`.
8. Resumen.

Portada y botón «Siguiente» en Métodos que transforman. Probado con Playwright en 1280 y 390 px, reanudando en cada paso y con movimiento reducido: sin errores.

### 2026-10-21 · Texto a fondo 3/5: Métodos que transforman

**Lección** `lecciones/texto/metodos/` (`data-leccion="texto-metodos"`), 7 pasos:
1. Máquinas de texto: `.upper()`, `.lower()` y `.title()` sobre un texto que el alumno puede cambiar; la cinta de antes, la máquina y la de después, con las letras que cambian en azul y en cascada.
2. `.strip()` con `input()`: nombres con espacios en los bordes (en naranja, los que se van) y con un espacio en el medio, que se queda. `print(f"[{limpio}]")` deja ver los bordes.
3. `.replace(viejo, nuevo)` con dos campos: algo que aparece varias veces (la «e», y la «é» no cuenta) y algo que no está (sale igual, sin error).
4. El texto no cambia: predecir qué imprime `nombre.upper()` sin guardar; línea a línea, «"ANA"» cae en una caja «sin nombre» y sale volando, y se imprime «ana». Con «Guardar el texto nuevo» la línea pasa a `nombre = nombre.upper()`.
5. En cadena: `texto.strip().lower()` con una respuesta que el alumno escribe; tres cintas muestran cada paso.
6. Reto: el orden importa. Qué cadena convierte `"  hola mundo  "` en `"HOLA_MUNDO"` (las trampas: `replace` antes de `strip`, cambiar el espacio por nada y terminar en `.lower()`); la cinta de lo que sale se compara con la de lo que queremos.
7. Resumen.

La cinta pasa a otra fila si un texto largo no cabe ni con casillas pequeñas (mínimo 1.7rem). Portada y botón «Siguiente» en Rebanadas. Probado con Playwright en 1280 y 390 px, reanudando en cada paso y con movimiento reducido; también las lecciones 1/5 y 2/5 con el cambio de la cinta. Sin errores.

### 2026-10-21 · Texto a fondo 2/5: Rebanadas

**Lección** `lecciones/texto/rebanadas/` (`data-leccion="texto-rebanadas"`), 7 pasos:
1. Corta un pedazo: unas tijeras (dos cortes, inicio y fin) se arrastran por los cortes de «girasol», o se tocan y se mueven con las flechas; tocar la cinta lleva el corte más cercano. Hay que sacar «sol» y «gira».
2. El final no entra: predecir `palabra[2:6]` («raso», mide 6 - 2), `palabra[3:3]` (texto vacío) y `palabra[5:50]` («ol», sin error, a diferencia de un índice).
3. Quitar el inicio o el fin: el corte queda fijo en el borde, en gris, y el código pasa a `palabra[:4]` o `palabra[4:]`.
4. Las últimas letras: qué rebanada da la extensión de «foto.png», «tarea.pdf» y «cancion.mp3» (`[5:]`, `[-4:]` o `[-3:]`); la cinta muestra el número negativo de cada corte.
5. Partir `"21/10/2026"`: el alumno corta el mes y luego el año, que caen en sus cajas, y se imprime la frase.
6. Reto: qué imprime `palabra[3:] + palabra[:3]` con «programa» (las trampas: contar desde 1 y que el fin entre).
7. Resumen.

Las tijeras son de la lección (`crearTijeras`), sobre la cinta en modo cortes. `cinta.js` gana `marcarCortes` y el número negativo de cada corte (con `cortes` y `negativos`). Portada y botón «Siguiente» en Texto a fondo 1/5. Probado con Playwright en 1280 y 390 px (con teclado, arrastrando y tocando), reanudando en cada paso y con movimiento reducido: sin errores.

### 2026-10-21 · Texto a fondo 1/5: Cada letra en su lugar

- **Plan**: CLAUDE.md recoge el tema Texto a fondo (5 lecciones: índices, rebanadas, métodos que transforman, buscar en un texto y el ahorcado) y deja Errores como lo siguiente por planear.
- **Cinta compartida** `assets/js/cinta.js` (`Cinta.crear`) y sus estilos en `base.css`: un texto en casillas con el índice encima y, si se pide, el negativo debajo (en morado) o los números en los cortes entre letras (para las rebanadas). `marcar(i)` resalta una casilla (o pone una casilla vacía con el número en rojo si se sale del texto), `rango(a, b)` sube las casillas de una rebanada, `clases(fn)` colorea cada casilla y `letra(i)` sirve de origen para `Codigo.volar`.
- **Lección** `lecciones/texto/` (`data-leccion="texto"`), 7 pasos: un control mueve el índice por «mango» y la letra vuela a la consola (hay que encontrar la primera y la última) → predecir qué pasa con `palabra[5]` (casilla vacía en rojo e `IndexError`) y luego `palabra[len(palabra) - 1]` resuelto por partes → índices negativos, con otra palabra a elegir → predecir tres índices de «Cusco» con los números ocultos (el último, `ciudad[len(ciudad)]`, da error) → `for i in range(len(palabra))` línea a línea, con la casilla que sigue a `i` → reto: el índice de la pareja en `es_palindromo` (`-1 - i`; las trampas `-i`, `len(palabra) - i` e `i - 1`), con tres pruebas y las parejas de «radar» que se iluminan → resumen.
- **Portada**: tarjeta de tema Texto a fondo (🔤) con su primera lección; Torres de Hanói enlaza a ella.
- Probado con Playwright en 1280 y 390 px, reanudando en cada paso y con movimiento reducido: sin errores.

### 2026-10-21 · Recursión 4/4: Proyecto: Torres de Hanói

**Lección** `lecciones/recursion/proyecto/` (`data-leccion="recursion-proyecto"`), 8 pasos:
1. El juego a mano con 3 discos: tocar una torre y luego otra, o arrastrar el disco. Un movimiento que rompe las reglas sacude el disco y explica por qué. Se desbloquea al llevar la torre a C (con el mínimo, 7, o con más).
2. Parte 1 · El disco grande: ¿dónde tienen que estar el 1 y el 2 antes de mover el 3? (En B, la auxiliar). Al acertar, la solución se mueve sola en tres fases.
3. Parte 2 · Tres pasos grandes con 4 discos: tres botones (los 3 de arriba a B, el 4 a C, los 3 a C) que el alumno ordena; cada uno mueve sus discos y resalta su línea en la receta.
4. Parte 3 · La función `hanoi`: elegir las torres de las dos llamadas recursivas (selects debajo del código; lo elegido se ve en su espacio en blanco). Al comprobar, cada `print` mueve un disco; si una llamada está mal, se para en el primer movimiento imposible (en rojo en la salida) con una pista.
5. El programa completo con la pila (control de 1 a 4 discos): cada `print` mueve un disco, las tarjetas dicen en qué línea esperan (5 o 7) y qué les falta.
6. ¿Cuántos movimientos? Tabla 1, 3, 7, 15 y el alumno escribe el de 5 discos (31). Al acertar, la leyenda de los 64 discos.
7. Reto: 4 discos a mano en 15 movimientos, con 💡 Pista (el siguiente movimiento de una solución mínima desde donde esté) y aviso cuando ya no alcanza para 15.
8. Resumen.

Las torres las dibuja la propia lección (`crearTorres`): los discos son elementos con posición en %, y cada movimiento sube, cruza y baja (Web Animations). Mientras un disco vuela no recibe toques, para que un toque rápido sobre otra torre vaya a esa torre; si se vuelve a mover antes de aterrizar, el vuelo nuevo sale de donde iba.

Portada y botón «Siguiente» en Árbol de llamadas. Probado con Playwright en 1280 y 390 px (tocando, arrastrando y con toques rápidos), reanudando en cada paso y con movimiento reducido: sin errores. En móvil, las líneas largas de `hanoi` (5 y 7) son más anchas que la pantalla y se desplazan.

### 2026-10-21 · Recursión 3/4: Árbol de llamadas

**Lección** `lecciones/recursion/arbol/` (`data-leccion="recursion-arbol"`), 7 pasos:
1. La serie: cada número suma los dos anteriores; los dos de antes vuelan a la casilla nueva y el último (13) lo predice el alumno.
2. `fibonacci(n)` con la pila (control de 1 a 4): la tarjeta espera **dos veces en la misma línea**, primero con `return ▢ + fibonacci(1)` y luego con `return 1 + ▢`; cada valor que vuelve cae en su espacio en blanco.
3. El árbol de llamadas que crece (control de 1 a 5): un círculo por llamada, los que esperan punteados (son la pila: el camino desde la raíz), la píldora con lo que devolvió y un contador de llamadas. El árbol es un SVG que dibuja la propia lección (`crearArbol`).
4. Lo mismo, otra vez: en el árbol de `fibonacci(5)` el alumno toca las 3 copias de `fibonacci(2)`; se resaltan con todo lo que cuelga de ellas. Luego puede resaltar las copias de cualquier otra llamada.
5. ¿Cuántas llamadas? Predicción para `fibonacci(20)` (21 891) y un control de 1 a 30: valor, llamadas en total y cuánto tardarías haciendo una por segundo (con 30, unos 31 días).
6. Reto: qué imprime `ramas(3)`, que imprime al empezar y se llama dos veces (3 2 1 0 1). Las trampas: por pisos (3 2 1 1 0), a la vuelta (1 0 2 1 3) y olvidar la segunda rama. Al acertar, el árbol se dibuja con el orden en que imprime cada llamada.
7. Resumen.

`pila.js`: si `falta` tiene un `▢`, el valor que llega con `recibe` cae ahí (antes, siempre en la última aparición del valor, que en `return 1 + fibonacci(1)` era el 1 de `fibonacci(1)`). Las lecciones que ya lo usaban se ven igual.

Portada y botón «Siguiente» en Recursión 2/4. Probado con Playwright en 1280 y 390 px, reanudando en cada paso y con movimiento reducido; también Recursión 2/4 y Funciones que usan funciones (usan la misma pila). Sin errores. Queda lo ya sabido: en móvil la línea 5 de `fibonacci` es más ancha que la pantalla y la flecha de salto pasa por encima de su final.

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
