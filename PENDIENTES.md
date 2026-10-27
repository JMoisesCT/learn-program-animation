# Pendientes y registro de cambios

Notas para retomar el trabajo en la siguiente sesión. Lo más reciente, arriba.

## Para la siguiente sesión

Por orden de prioridad:

1. **Revisar con alumnos las mejoras de animación** (ver el registro de abajo) y recoger qué ayuda y qué distrae. Lo que aún no se ha probado:
   - con `prefers-reduced-motion` activado en el sistema: no debe haber vuelos ni confeti, y la flecha y los puntos de corriente quedan quietos;
   - en un móvil de verdad (las pruebas fueron con el navegador a 390 px).
2. **Texto a fondo, completo (5/5).** Lo siguiente: planear **Errores** en CLAUDE.md (sus sublecciones, como las de Funciones, Recursión y Texto a fondo) y luego **Listas**, decidiendo qué se levanta de la regla «nada de listas». Al publicar Errores, añadir «Siguiente» en el Proyecto: el ahorcado.
   **Probar con alumnos** el ahorcado en un móvil de verdad (en el reto, el tablero y las misiones van antes que el programa, que tiene 31 líneas) y si se entiende que repetir una letra que no está quita otra vida (el programa no lo revisa; podría ser una mejora con `if nueva in dichas:` y `continue`).
   **Probar con alumnos** si se entiende el `-1` de `.find()` (paso «Antes y después de la @»: sin @, `correo[:-1]` corta la última letra sin dar error).
   **Probar con alumnos** las tijeras de Rebanadas en un móvil de verdad (arrastrar y tocar la cinta; usan `touch-action: none`, así que sobre la cinta la página no se desplaza) y si «los números van en los cortes» se entiende.
   **Detalle visto**: en móvil, las líneas largas se desplazan en vez de caber (la de `print(▢)` en el reto de Métodos, con la cadena elegida dentro; las opciones sí se parten en dos líneas).
   **Recursión, completa (4/4).**
   **Probar con alumnos** si la vuelta se entiende ahora (tarjeta «pausada/sigue», fichas bajo la línea y rótulo «Ahora corre»), y si las fichas o el rótulo distraen.
   **Probar con alumnos** las Torres de Hanói en un móvil de verdad: tocar dos torres y arrastrar discos (el arrastre usa `touch-action: none` en los discos, así que sobre un disco la página no se desplaza).
3. **Explicar mejor la vuelta de la recursión** (ideas propuestas, sin hacer; decidir cuáles):
   - **La fila del cine** como intuición antes del código: «¿en qué fila estoy?» se pregunta hacia adelante (ida) y la respuesta vuelve sumando 1 (vuelta).
   - **El alumno deshace la pila**: la pila empieza llena y solo se puede tocar la tarjeta de arriba; al tocarla calcula, devuelve y su valor cae en el ▢ de la de abajo.
   - **Completar el ▢ en cada vuelta**: antes de quitar una tarjeta, elegir qué valor devuelve (`return 4 * ▢`).
   - **La cuenta que crece y se encoge**: `factorial(4)` → `4 * factorial(3)` → `4 * (3 * (2 * 1))` a la ida, y `4 * (3 * 2)` → `4 * 6` → `24` a la vuelta, al lado de la pila.
   - **Tabla de seguimiento** (llamada | n | espera | devuelve): las filas se llenan de arriba abajo a la ida y la columna «devuelve» de abajo arriba a la vuelta; sirve para trazar en papel.
   - **Colores de ida y de vuelta** en la consola y en las flechas, y un paso que pregunte «¿el programa termina al llegar al caso base?» (error común).
4. **Pila con «pausada en la línea N» en Funciones que usan funciones**: hoy sus tarjetas dicen «esperando a suma()». Podría usar `linea`, `falta`, `recibe` y `codigo`/`rotulo` como la Recursión (`total = ▢` → `total = 31`).
5. **Flecha de vuelta en las otras lecciones de Funciones.** Solo Funciones 1/7 marca `flecha: true` al volver de una función. Variables locales ya también. En Varios parámetros, Funciones que deciden y Funciones que usan funciones, la flecha sale al llamar (sube al `def`), pero no al volver con `return` (baja a la llamada). Basta con añadir `flecha: true` al paso de la traza que vuelve a la línea de la llamada.
6. **Proyectos: armar el programa en vez de elegirlo.** Ideas que quedaron de la revisión, sin hacer:
   - arrastrar y soltar líneas para ordenarlas (CLAUDE.md lo pide en Pedagogía; hoy solo arrastran «Texto y números» y los discos de las Torres de Hanói);
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
