# learn-program-animation

Páginas interactivas para que alumnos aprendan conceptos de programación (variables, condicionales, bucles, funciones, listas, etc.). Todo el contenido visible va **en español**.

## Formato técnico
- Cada lección es una página HTML autocontenida: HTML, CSS y JavaScript puros. **Sin build, sin npm, sin frameworks.** Debe funcionar abriendo el archivo con doble clic y publicarse tal cual en GitHub Pages.
- No cargar recursos externos (CDN, fuentes web) salvo que sea imprescindible; preferir fuentes del sistema y SVG/CSS inline.
- Estructura:
  - `index.html`: portada con una tarjeta por tema y el progreso. Un tema con sublecciones (`tarjeta-tema`) lista sus lecciones dentro, como un camino numerado.
  - `assets/css/base.css`: tokens de diseño y componentes compartidos (código con líneas resaltadas, chips `True`/`False`, `expresion`, `regla` con zonas True, cajas de variable, consola, `lienzo` y `vueltas` para bucles anidados, opciones, feedback, tarjeta `lab`).
  - `assets/js/`: utilidades compartidas (motor de pasos, progreso en `localStorage`).
  - `lecciones/<tema>/index.html`: una carpeta por tema (`variables/`, `condicionales/`, `bucles/`, …).
  - `lecciones/<tema>/<sublección>/index.html`: sublecciones que profundizan un tema (p. ej. `variables/formulas/`, `condicionales/logicos/`). Las rutas a `assets/` suben un nivel más (`../../../`).
- Orden actual de lecciones: Variables → Fórmulas → Reúso → Texto y números → Mensajes con f-strings → Condicionales (if, else y elif) → Combinar condiciones → Comparar textos → Condiciones anidadas → Proyecto: la taquilla → Bucles (for, range y while) → Contar y acumular → Decidir en cada vuelta → Recorrer un texto → Salir antes: break y continue → Bucles anidados → Dibujar patrones → Proyecto: adivina el número → Funciones (def, parámetros y return) → Funciones de Python → Varios parámetros → Funciones que deciden → Variables locales → Funciones que usan funciones → Proyecto: piedra, papel o tijera → Recursión (una función que se llama a sí misma) → Recursión que devuelve valores → Árbol de llamadas → Proyecto: Torres de Hanói → Texto a fondo (cada letra en su lugar) → Rebanadas → Métodos que transforman → Buscar en un texto → (Proyecto: el ahorcado, Errores y Listas, próximamente).
- La pantalla en casillas donde `print()` dibuja patrones (cursor, espacios visibles, comparar con un objetivo) está en `assets/js/lienzo.js` (`Lienzo.crear`).
- La pila de llamadas (una tarjeta por llamada con sus variables; cada llamada apila una y cada vuelta quita la de arriba) está en `assets/js/pila.js` (`Pila.crear`). La usan Funciones que usan funciones y las lecciones de Recursión. Una tarjeta que espera puede decir en qué línea se quedó (`linea`) y qué le falta al volver (`falta`); con `sigue: true`, la que retoma muestra «▶ sigue en la línea N», y con `recibe` el valor que devolvió la de arriba baja volando a su cuenta (`return 4 * 6`); si `falta` tiene un `▢`, cae ahí (`return ▢ + fibonacci(1)`, útil cuando una línea hace dos llamadas). Con `Pila.crear(el, { codigo: pre })`, cada tarjeta pausada pone además una ficha (`n=3`) debajo de su línea en el código (`Codigo.pausas`), y al volver se va la de la que retoma. Con `rotulo: true`, encima del código se lee qué llamada lo ejecuta («Ahora corre: `abrir(2)` n 2»). Usarlo en la recursión: todas las tarjetas son la misma función.
- La cinta de casillas de un texto (un carácter por casilla, con su índice encima y el negativo debajo, o con los números en los cortes entre letras para las rebanadas) está en `assets/js/cinta.js` (`Cinta.crear`). La usan las lecciones de Texto a fondo.
- La consola que pide un dato en cada vuelta de un bucle (`input()` dentro de un `for` o de un `while True` con `break`) está en `assets/js/bucle-input.js` (`BucleInput.crear`).
- Al ejecutar línea a línea (`Traza`), la flecha de salto (`Codigo.salto`) se dibuja sola cuando la ejecución vuelve arriba (otra vuelta, una llamada); en un paso de la traza, `flecha: true / false` la fuerza o la evita (p. ej. `true` al volver de una función).
- `Caja.poner` hace viajar el valor desde la línea activa del paso hasta la caja, y `Traza` hace lo mismo con la salida de `print` hacia la consola (`Codigo.volarDesdeLinea`): basta con marcar la línea antes de poner el valor.
- Las opciones que son código (`.opciones--codigo`, `.version__codigo`) se colorean y marcan lo que cambia entre ellas con `assets/js/opciones-codigo.js`; incluirlo en la lección.
- `Pasos` lanza confeti al acertar un «Comprobar», al desbloquear un paso «Reto» y en el resumen final (`Pasos.confeti(el)` para otros casos).
- Ejemplos con notas: escala de 0 a 20, se aprueba con 11 o más.
- Rutas relativas siempre (el sitio vive bajo `/learn-program-animation/` en GitHub Pages).
- Accesible: contraste suficiente, navegable con teclado, `prefers-reduced-motion` respetado, funciona en móvil.

## Estilo visual (inspirado en Brilliant)
- Fondo claro y limpio, mucho espacio en blanco, una sola idea por pantalla.
- Tipografía grande y legible; paleta sobria con un color de acento vivo (verde/azul) y colores semánticos para correcto/incorrecto.
- Tarjetas redondeadas, sombras suaves, botón primario grande ("Continuar", "Comprobar").
- Lección dividida en **pasos cortos** con barra de progreso arriba; cada paso es una mini-interacción, no un muro de texto.
- Feedback inmediato y amable tras cada respuesta (animación de acierto, pista si falla, nunca castigar).
- Animaciones con propósito: mostrar cómo cambia el estado (una variable que se llena, una condición que se ilumina, un bucle que avanza).

## Pedagogía
- Enseñar **haciendo**: manipular antes de leer. Sliders, arrastrar y soltar, botones "paso a paso", código editable con resultado en vivo.
- Orden de cada lección: intuición visual → interacción guiada → pequeño reto → resumen de una línea.
- Texto mínimo, frases cortas, vocabulario simple. Analogías cotidianas (cajas, semáforos, repetir una tarea).
- Español neutro latinoamericano: tú (nunca vosotros), pretérito simple («dijiste», no «has dicho»), «computadora» y «la PC», «toca» para botones (no «pulsa»), «lugar» (no «sitio»), «cuenta regresiva», «espacio en blanco» para lo que el alumno completa en un ejercicio (no «hueco»).
- El lenguaje que se enseña es **Python**: mostrar el código real en Python junto a la visualización, resaltando la línea que se ejecuta. (La lógica de las páginas sigue siendo JavaScript; la ejecución de Python se simula.)
- Los retos tienen respuesta verificable en el navegador, sin servidor.
- Usar solo lo que el alumno ya vio en lecciones anteriores. En particular, **nada de listas** (ni `[...]`, ni `for x in lista`, ni `random.choice`, ni `max`/`min`/`sum` sobre una lista, ni `return a, b`) hasta la lección de Listas.

## Plan: sublecciones de Funciones
Tema de 7 lecciones (`Funciones 1/7` … `7/7`), en `lecciones/funciones/<sublección>/`, sin listas:
1. **Funciones** (`funciones`, ya publicada): `def`, llamar, saltar y volver, parámetro, `return`.
2. **Ya las usabas: funciones de Python** (`funciones-python`, carpeta `python/`): `print`, `input`, `len`, `int`, `str`, `round`, `abs`, `max(a, b)`, `random.randint` como funciones con argumentos y valor devuelto. Una «máquina» por función: predecir qué sale antes de ejecutar.
3. **Varios parámetros** (`funciones-parametros`, carpeta `parametros/`): el orden importa (`restar(10, 3)` vs `restar(3, 10)`), argumentos por nombre y valores por defecto. Flechas de cada argumento a su caja de parámetro.
4. **Funciones que deciden** (`funciones-return`, carpeta `return/`): `return` dentro de `if`/`elif`, funciones que devuelven `True`/`False` (`aprobado(nota)`), `return` termina la función, sin `return` se devuelve `None`, `print` vs `return`. Slider de nota que ilumina qué `return` se ejecuta.
5. **Variables locales** (`funciones-ambito`, carpeta `ambito/`): las variables de la función nacen al llamarla y desaparecen al volver; mismo nombre dentro y fuera son cajas distintas. Zona de cajas «programa» y zona «dentro de la función» que aparece y se borra.
6. **Funciones que usan funciones** (`funciones-componer`, carpeta `componer/`): una función llama a otra (`promedio` usa `suma`), funciones con bucles dentro (contar vocales, factorial con `for`) y la pila de llamadas, con tarjetas que se apilan y se quitan en cada `return`.
7. **Proyecto: piedra, papel o tijera** (`funciones-proyecto`, carpeta `proyecto/`): `jugada_pc()` con `random.randint(1, 3)` y una función que traduce el número a texto, `quien_gana(a, b)` con `if`/`elif`, `while True` con `break` y marcador (reutilizar `BucleInput`).
Fuera de alcance por ahora: `lambda`, `*args`, docstrings.

## Plan: Recursión
Tema de 4 lecciones (`Recursión 1/4` … `4/4`) después de Funciones, en `lecciones/recursion/`, sin listas. La visualización central es la pila de llamadas (`Pila.crear`): cada llamada apila una tarjeta con su propia `n` y cada vuelta la quita. En la traza, marcar `flecha: true` en el paso que vuelve a la línea de la llamada (la vuelta es la mitad de la historia).
1. **Una función que se llama a sí misma** (`recursion`, carpeta `recursion/`): cajas dentro de cajas, `cuenta_regresiva(n)`, caso base y llamada con un problema más pequeño, qué pasa sin caso base (la pila crece hasta que Python la corta con `RecursionError`), y lo que se hace antes de la llamada (a la ida) frente a lo que se hace después (a la vuelta).
2. **Recursión que devuelve valores** (`recursion-valores`, carpeta `valores/`): `factorial(n)`, `potencia(b, e)` y `suma_digitos(n)` con `%` y `//`. Lo que devuelve cada tarjeta baja a la de abajo y completa su cuenta (`4 * factorial(3)` → `4 * 6`). Comparar con el `factorial` con `for` de Funciones que usan funciones.
3. **Árbol de llamadas** (`recursion-arbol`, carpeta `arbol/`): una función que se llama dos veces (`fibonacci(n)`), el árbol de llamadas que crece, las llamadas repetidas resaltadas y cuántas llamadas hace en total.
4. **Proyecto: Torres de Hanói** (`recursion-proyecto`, carpeta `proyecto/`): mover los discos a mano primero, descubrir la idea (mover `n - 1` discos al auxiliar, el grande al destino y los `n - 1` encima) y `hanoi(n, origen, destino, auxiliar)`, que imprime los movimientos mientras los discos se mueven solos. Los discos los maneja JavaScript; el Python no usa listas.
Fuera de alcance: memoización, `sys.setrecursionlimit`, recursión sobre listas.

## Plan: Texto a fondo
Tema de 5 lecciones (`Texto a fondo 1/5` … `5/5`) después de Recursión, en `lecciones/texto/`, sin listas (ni `.split()`, que devuelve una lista). Ya vistos: `for letra in texto`, `len()`, `.lower()`, `in` y `==` entre textos. La visualización central es la cinta de casillas (`Cinta.crear`, en `assets/js/cinta.js`): una casilla por carácter con su número encima y, si hace falta, el negativo debajo o los números en los cortes entre letras. Todo lo que se aprende aquí se traslada a las listas.
1. **Cada letra en su lugar** (`texto`, carpeta `texto/`): `palabra[0]`, se cuenta desde 0, la última es `palabra[len(palabra) - 1]`, pasarse da `IndexError`, índices negativos (`palabra[-1]`), `for i in range(len(palabra))` con la posición y la letra, y un reto: `es_palindromo` con `palabra[-1 - i]`. Un control mueve el índice por la cinta y la letra vuela a la consola.
2. **Rebanadas** (`texto-rebanadas`, carpeta `rebanadas/`): `texto[1:4]` con unas tijeras que se arrastran por los cortes entre letras, el final no se incluye (la parte mide `fin - inicio`), `[:3]` y `[3:]`, negativos (`archivo[-3:]`), una rebanada que se pasa no da error, y un uso real: sacar el día, el mes y el año de `"21/10/2026"`.
3. **Métodos que transforman** (`texto-metodos`, carpeta `metodos/`): «máquinas» `.upper()`, `.lower()`, `.title()`, `.strip()` y `.replace(viejo, nuevo)`, que muestran qué letras cambian; **el texto no cambia** (`nombre.upper()` solo no hace nada: hay que guardarlo con `nombre = nombre.upper()`) y encadenar (`input().strip().lower()`), donde el orden importa.
4. **Buscar en un texto** (`texto-buscar`, carpeta `buscar/`): `.count()`, `.find()` (y el `-1` cuando no está), `.startswith()` / `.endswith()` e `.isdigit()` para revisar un dato antes de `int()`, en un `while True` que vuelve a preguntar.
5. **Proyecto: el ahorcado** (`texto-proyecto`, carpeta `proyecto/`): la palabra oculta (`_ a _ a _`) se arma con un `for` y `in` sobre un texto con las letras dichas (`dichas += letra`, sin listas), vidas, `.strip().lower()` a la entrada y ganar cuando `"_" not in oculta`. Reutilizar `BucleInput`.
Fuera de alcance: `.split()`, `.join()`, rebanadas con paso (`[::2]`, `[::-1]`), `.format()`.

## Después de Texto a fondo, antes de Listas
- **Errores**: leer un mensaje de error (`NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`, `IndentationError`, `IndexError`) y `try`/`except` para volver a pedir un dato inválido.
Planear aquí sus sublecciones antes de escribirlas, como las de Funciones, Recursión y Texto a fondo.

## Convenciones de trabajo
- Al empezar una sesión, leer `PENDIENTES.md` (qué quedó por hacer y registro de cambios); al terminar, apuntar ahí lo hecho y lo que convendría continuar.
- Reutilizar `base.css` y las utilidades de `assets/js/` antes de crear estilos o scripts nuevos.
- Tarjetas interactivas: `<div class="tarjeta lab">` con hasta tres grupos: `lab__principal` (código y controles), `lab__visual` (cajas, escenas) y `lab__resultado` (salida, notas, feedback). En escritorio (≥1024px) se reparten en dos columnas; en móvil se apilan en el orden del HTML, así que ese orden debe ser el que se quiere ver en el móvil.
- Una lección nueva = su carpeta + su entrada en `index.html`, en su lugar según el orden de lecciones: una tarjeta si es un tema nuevo, o un `<li data-leccion>` dentro de la lista `sublecciones` de su tema si es una sublección. Si un tema de una sola lección gana su primera sublección, su tarjeta pasa a ser `tarjeta-tema` y la lección original queda como la 1.
- La etiqueta del primer paso de cada lección de un tema con sublecciones indica su posición: `Variables 2/4 · Fórmulas`. Al añadir una sublección, actualizar el total en todas las del tema.
- `data-leccion` (en la lección y en su entrada de la portada) es la clave del progreso: el nombre del tema, o `<tema>-<sublección>` en las sublecciones (p. ej. `variables-reuso`). No cambiarla una vez publicada o se pierde el avance guardado.
- El resumen final enlaza a la lección siguiente con un botón «Siguiente: <Lección> →»; al añadir una lección, actualizar también el enlace de la anterior.
- Probar cada página en el navegador (escritorio y ancho móvil) antes de dar la tarea por terminada.
- Las capturas de prueba se guardan en `capturas/` (ignorada por git), nunca en la raíz ni en el commit.
- Commits pequeños y descriptivos, en español o inglés pero consistentes.
- Autoría: commits y PRs solo a nombre de Moisés Cumpa <moises.cumpa@gmail.com>. No añadir `Co-Authored-By` de Claude, enlaces de sesión ni firmas tipo "Generated with Claude Code".
- Publicación: cada cambio va en una rama → PR → fusión inmediata a `main` (GitHub Pages publica desde `main`). No hacer push directo a `main`.
- Ramas con nombre descriptivo: `leccion/<tema>` para lecciones nuevas, `mejora/<tema>` o `arreglo/<tema>` para el resto (p. ej. `leccion/funciones`, `arreglo/progreso-portada`). No usar la rama aleatoria que asigna la sesión.
- Títulos de PR cortos y en frase nominal, como los escribiría una persona (p. ej. «Lección de Bucles», «Resaltado de líneas en el reto»).
