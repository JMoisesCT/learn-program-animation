# Cómo armar un caso de «Problemas resueltos»

Guía para escribir un caso nuevo, desde el enunciado hasta publicarlo. Resume lo aprendido con los primeros casos (la cuenta, buses, el final, el reloj, el vuelto y el laberinto; después, los tres de Condicionales). El formato técnico está en `CLAUDE.md` («Problemas resueltos»); aquí va el **cómo**: qué elegir, qué escribir, qué probar.

La mejor plantilla es un caso ya hecho: `problemas/cuenta/index.html` (básico, sin bucles) y `problemas/vuelto/index.html` (con `for` e `if`). Se copia uno y se cambia todo lo propio.

---

## 1. Qué hace un buen caso

- **Un problema de la vida diaria** del alumno (soles y céntimos, notas de 0 a 20, el salón, el bus, la cafetería), contado en dos párrafos, con un objeto que se pueda mostrar: un ticket, una libreta, un boleto.
- **Una sola idea central** que se pueda nombrar en una frase: «el billete más grande que cabe», «sumar 11 antes de dividir», «despejar la fórmula», «las vueltas no importan».
- **Algo que se pueda dibujar y animar**: dinero que se reparte, alumnos que suben a buses, una aguja que gira, una cuadrícula. Si el problema no tiene un dibujo claro, buscar otro o una metáfora antes de escribir código.
- **Un giro al final** (bloque 6): un caso donde la idea falla, se queda corta o se puede llevar más lejos, y que deje con ganas del tema siguiente. Ejemplos: «¿Siempre cierra la cuenta?» (los céntimos), «¿Y si sale más de 20?» (hace falta un `if`), «¿Siempre funciona?» (monedas raras), «¿Es el camino más corto?».
- **Datos de entrada que cuenten una historia**: el caso normal, uno exacto o de borde, y uno que sorprende o sale mal.

## 2. Elegir el tema y la dificultad

**El tema es la última lección que hace falta para leer el programa.** Decide la sección del catálogo y el rótulo («Caso de Variables»). Si el programa usa una tupla, aunque sea de recursión, va en Otras estructuras (pasó con el laberinto). Si un detalle sube el tema sin aportar, cambiarlo (p. ej. una lista de dos valores por dos variables).

Lo que se puede usar en cada sección (cada una suma lo de las anteriores; ver «Orden actual de lecciones» y los planes en `CLAUDE.md`):

| Sección | Se puede usar | No se puede |
|---|---|---|
| Variables y fórmulas | variables, `+ - * /`, `//`, `%`, `int()`, `str()`, `input()`, f-strings con `:.2f` | `if`, bucles, listas, `round()`, `abs()`, `max()` |
| Condicionales | `if`/`elif`/`else`, `and`/`or`/`not`, comparar textos, condiciones anidadas | bucles |
| Bucles | `for` con `range`, `while`, contar y acumular, `break`/`continue`, `for letra in texto`, `print(..., end="")` | listas, `texto[i]` |
| Funciones | `def`, parámetros, `return`, `round`, `abs`, `max(a, b)`, `random.randint` | listas |
| Recursión | funciones que se llaman a sí mismas | listas, `texto[i]` |
| Texto a fondo | `texto[i]`, rebanadas, `.upper()`, `.strip()`, `.replace()`, `.find()`, `.count()`, `.isdigit()` | `.split()`, `.join()`, listas |
| Listas | listas, `.append()`, `sum`/`max`/`min`, `sorted()`, `.split()`, `.join()`, listas de listas | tuplas, diccionarios, `enumerate`, `zip` |
| Otras estructuras | tuplas y desempaquetar, diccionarios, conjuntos | comprensiones, `key=` |
| Búsquedas, Ordenar | búsqueda lineal y binaria, burbuja, quicksort, mergesort | `bisect`, `lambda` |
| Errores | `try`/`except`, tipos de error | `raise`, `finally` |

Las secciones del catálogo hoy son Variables y fórmulas, Condicionales, Texto a fondo, Listas, Otras estructuras y Ordenar. Para un caso de otro tema (Bucles, Funciones, Recursión, Búsquedas, Errores) se agrega su sección en su lugar del curso (ver §8).

**Dificultad de 1 a 5 estrellas**, comparando con todo el catálogo (no solo con la sección):

| Nivel | Qué pide | Ejemplos |
|---|---|---|
| ★ | fórmulas directas, una tras otra | La cuenta del restaurante |
| ★★ | un truco o una idea nueva con lo básico (redondear hacia arriba, despejar, `%` que da la vuelta) | buses, el final, el reloj |
| ★★★ | combinar dos o tres temas en un algoritmo (bucle + decisión + lista) | El vuelto, el mensaje secreto |
| ★★★★ | varias estructuras o un algoritmo de varias partes | El torneo del salón |
| ★★★★★ | recursión que prueba y vuelve atrás, o algo igual de abstracto | El laberinto |

Dentro de su sección, el caso va ordenado de menos a más estrellas (a igual nivel, el que se entiende con menos cosas va antes).

## 3. El enunciado

Si el autor manda un enunciado, primero ubicarlo (§2): qué tema necesita, si cabe en un nivel razonable, qué dibujo tendría y cuál sería el giro final. Si necesita algo fuera del curso, proponer una versión que no lo use. **Proponer el diseño en pocas líneas y esperar el visto bueno antes de construir.**

El bloque 1 («El caso») tiene dos partes:

- **La historia** (`.historia`): 2 párrafos cortos con nombres (Ana, Beto, Lucía, Tomás…), números concretos y la pregunta en una nota al margen (`.nota-margen`). Debajo, un objeto: `.ticket` con 3 filas (la cuenta de la pollería, el boleto del bus, la libreta de notas, la reserva de la excursión).
- **La hoja** (`.hoja-enunciado`), como en un problema de olimpiada:
  - **Problema**: una o dos frases: «Escribe un programa que, dado…, diga…».
  - **Entrada**: cada variable con su tipo y su rango (`asientos`: entero mayor que 0). Las condiciones que el programa no revisa (p. ej. `personas` mayor que 0) se dicen aquí, y el bloque 5 muestra qué pasa si no se cumplen.
  - **Salida**: el formato exacto de cada línea (`Cada uno paga S/ …`, con dos decimales).
  - **Ejemplos** (`.hoja-enunciado--ejemplos`): dos, en una tabla Entrada | Salida, copiados de lo que da python3.

Las frases de la salida no deben mentir con ningún dato: «En el último bus van 11» es falso si el último va lleno, y arreglarlo pediría un `if`. Mejor una frase que valga siempre («Alumnos que sobran: 0»).

## 4. Los bloques, uno por uno

Siete `.panel`; **cada uno cabe en una pantalla** (1366×657, 1280×800 y 390×844).

0. **Portada**: «Caso de <Tema>» (`.caso-num`), título, bajada de una línea, estrellas (`.caso-dificultad` con `.estrellas__llenas`), los temas que usa con enlace a su lección (`.caso-temas`) e ilustración SVG propia.
1. **El caso**: historia y hoja (§3). En el móvil es un carrusel.
2. **Lo que necesitas saber**: tres tarjetas `.concepto`, cada una con **una mini demo que se toca** (un control deslizante, chips, un botón) y una cuenta grande que cambia. Son las tres ideas que el alumno necesita para entender el programa; si una ya se vio en una lección, enlazarla.
3. **La idea**: diagrama de flujo (`Flujo.crear`) junto a la lista de **hasta 4 pasos** (`.idea li[data-idea]`, un color por paso). Un botón «▶ Seguir el diagrama con …» lo recorre con el primer ejemplo (`f.recorrer`, una nota por nodo). Sin bucles, el diagrama es una línea recta; si no entra en altura, en zigzag (el final lo hace en 3×3 y pasa a una columna en el móvil).
4. **El código en acción**: el reproductor (§5 y §6).
5. **Detalles del algoritmo**: tres tarjetas que se entienden sin volver al código, cada una con algo interactivo. Tres preguntas que siempre sirven: **¿cuánto trabajo hace?** (con datos chicos y grandes), **¿por qué funciona?** (o una versión que parece igual y falla: `alumnos // asientos + 1`, sin paréntesis) y **casos borde** (cero, el dato que no cumple la entrada, el error que da Python, copiado de python3 3.12).
6. **La enseñanza final** (§1, el giro), con una demo y, si sirve, un botón que lleva a ese dato en la ejecución (`rep.entrada(k)` y bajar a `#ejecucion`). Al pie, `.caso-fin`: «← Todos los casos», el caso anterior y el siguiente del catálogo (con `<span class="largo">Caso anterior: </span>`), y el sello «Caso visto».

## 5. El programa

- **Primero los datos** (una variable por línea; son las `lineasDatos`, con raya amarilla), después las cuentas y al final los `print`.
- **Líneas de 36 caracteres o menos**: en el móvil, una línea más larga llega a las barras del mapa de calor. Si no alcanza, partir la cuenta en dos variables con buen nombre (`extra = asientos - 1`) o acortar el texto del `print`.
- **Nombres en español, claros y cortos** (`propina`, `porcentaje`, `cada_uno`, `vueltas`). Que el nombre diga lo que guarda: `porcentaje = 10` y `propina = consumo * porcentaje / 100`, no `propina = 10` y `monto_propina`.
- **Cada línea con el color de su paso de la idea** (`ideas: [1, 1, 2, 3, …]`).
- **Verificar con python3** cada salida de cada dato de entrada, y cada número que aparezca en la página (demos, tablas, detalles). Los mensajes de error, copiados de lo que imprime python3 (con sus `~~~^^^`).
- **Los decimales como los escribe Python**: un `float` entero se escribe `100.0`; una división inexacta, `33.333333333333336`; `45.9 + 4.59` da `50.489999999999995`. Usar la opción `formato` del reproductor (ver `py(v, esFloat)` en la cuenta). JavaScript da los mismos números si las cuentas se hacen en el mismo orden.

## 6. La ejecución: datos y escena

- **4 datos de entrada** con nombres cortos para los chips («47 alumnos · buses de 12», «48 justos», «9 + 3: ¿las 0?»): el normal, el exacto, el de borde y el que sorprende. El último suele terminar con una pausa que lo explica.
- **Pausas** (`pausa: true`) solo en los momentos clave: la primera vez que aparece la idea central y el final. **Capítulos** (`capitulo`) para cada parte: «Los datos», «La propina», «El reparto», «Fin».
- **La nota de cada paso** dice qué pasó con los números de ese paso (`<code>151.25 / 5</code> da <strong>30.25</strong>`). La del final cierra la historia.
- **La escena** (`escena: { crear, reiniciar, pintar }`): cada paso de `generar` trae el estado completo que la escena necesita (p. ej. `p.est = { consumo, monto, total, cada }`), para poder saltar a cualquier paso. Con `op.animar`, animar desde el paso anterior (vuelos, cortes, giros); sin él, dibujar el estado de golpe. Los vuelos van en `position: fixed` y se quitan al terminar. Con movimiento reducido, nada vuela.
- **Lo que la escena muestra** es la idea, no el código: la barra que se corta en partes iguales, el bus que llega a medio llenar, la aguja que da las vueltas. Un rótulo con la cuenta del paso (`137.5 * 10 / 100 = 13.75`) ayuda a unir escena y código.
- Si el código es ancho o hay muchas variables, ajustar las columnas del reproductor en la página (`.rep__cuerpo { grid-template-columns: … }` desde 1180px), como la cuenta.

## 7. Texto y estilo

- Español neutro latinoamericano (ver `CLAUDE.md`): tú, pretérito simple, «computadora», «toca», «lugar», «espacio en blanco».
- Frases cortas; una idea por tarjeta. Los textos de tarjetas y notas, de una a tres frases.
- El estilo de cuaderno ya está en `problemas.css`: resaltador (`.resalta`) para la frase clave del bloque, nota al margen en lápiz para la pregunta o la conclusión. El CSS propio de la escena va en el `<style>` de la página.

## 8. Publicarlo

1. La carpeta `problemas/<caso>/index.html` y la clave `problema-<caso>` (en `Problemas.iniciar({ id })` y en la tarjeta del catálogo, `data-caso`). No cambiarla después.
2. **En el catálogo** (`problemas/index.html`): la tarjeta en su sección y en su lugar por dificultad, con su dibujo SVG, `data-nivel`, las estrellas, una descripción de una frase y 2 o 3 etiquetas. Si su tema no tiene sección, agregarla (`.casos-grupo` con `data-tema`, título y «Para después de …») en el orden del curso, y su botón en el filtro de tema. Si reemplaza a un «Próximamente», quitar ese.
3. **El pie de los vecinos**: el caso anterior y el siguiente en el orden del catálogo enlazan al nuevo.
4. **`CLAUDE.md`** («Casos publicados») y **`PENDIENTES.md`** (registro y lo que falta probar).
5. Rama `leccion/<algo>`, PR y fusión, como el resto (ver «Convenciones de trabajo»).

## 9. Probarlo

```bash
node herramientas/probar-caso.js <caso>
```
```bash
node herramientas/probar-caso.js <caso> reducir
```
```bash
node herramientas/probar-caso.js catalogo
```

La prueba revisa que cada bloque quepa, que no haya desborde ni errores, que el código no llegue al mapa de calor, que cada dato de entrada llegue al final (imprime la consola: compararla con python3) y que el diagrama se recorra. Deja capturas en `capturas/`: **mirarlas siempre** (la prueba no ve un texto encimado, una escena vacía o un color que no se lee). Para mirar varias juntas, pegarlas en una sola imagen con Python (PIL).

Cuando algo no cabe, lo que suele funcionar: achicar el texto de las tarjetas, poner una parte en un carrusel en el móvil (`.carrusel-movil`), esconder detalles en el móvil (`.largo`) o mover un contenido a otra tarjeta. No reducir la letra del cuerpo por debajo de lo que usa `problemas.css`.

## 10. Banco de ideas

Para proponer al autor. Cada una con su tema, nivel, idea central, escena posible y giro final.

**Variables y fórmulas** (sin `if` ni bucles)
- **El cronómetro de la maratón** ★: 9384 segundos → `2 h 36 min 24 s` con `//` y `%` encadenados. Escena: segundos que se agrupan de a 60 en minutos y los minutos en horas. Giro: al revés (de `h min s` a segundos) y ¿qué pasa con más de 24 horas?
- **El número al revés** ★★: 472 → 274, separando cifras con `//` y `%`. Escena: el número se rompe en tres fichas que cambian de lugar. Giro: con 120 sale 21 (el cero se pierde) y con `str()` sale `"021"`.
- **La pizza del salón** ★: 30 alumnos, pizzas de 8 porciones: cuántas pizzas, cuántas porciones sobran y cuánto paga cada uno. Giro: ¿y si cada uno come 2 porciones?
- **El cambio de moneda** ★: soles a dólares con un tipo de cambio y comisión, con `:.2f`. Giro: cambiar y volver a cambiar no devuelve lo mismo.

**Condicionales**
- **La taquilla del cine** ★★: precio según edad y día (niño, adulto, mayor; martes a mitad de precio). Escena: la fila con su entrada. Giro: el orden de los `elif` importa. (Se parece al proyecto de Condicionales, la taquilla: cambiarle el giro si se hace.)
- Ya publicados: ¿Es año bisiesto? ★★, El podio de la carrera ★★★ y El estacionamiento ★★★.
- **¿Qué plan de celular me conviene?** ★★★: el costo de tres planes (uno por tramos) y el menor sin `min()`. Escena: las tres rectas de costo según los GB. Giro: en qué GB conviene cambiar de plan (los cruces).
- **El día de mañana** ★★★★: dada una fecha, la de mañana (meses de 30 y 31, febrero con bisiesto, fin de año). Escena: un calendario de taco que arranca la hoja. Giro: ¿y si la fecha no existe (31/04)?
- **¿Se puede armar el triángulo?** ★★★: tres palos, la suma de dos lados mayor que el tercero, y qué tipo es (y si es rectángulo, `a*a + b*b == c*c`). Escena: los palos que se cierran o no. Giro: con 2, 3 y 5 se aplana: `>` o `>=`.

**Bucles**
- **La alcancía** ★★: ahorrar cada semana hasta llegar a una meta, con un `while`. Giro: ¿y si cada semana ahorra un sol más?
- **La conjetura de Collatz** ★★★: par → mitad, impar → triple más uno, hasta llegar a 1. Escena: una montaña rusa de números. Giro: nadie ha probado que siempre llegue a 1.
- **El dígito verificador del DNI** ★★★: pesos por cifra con `//` y `%` en un bucle. Giro: un dígito cambiado se detecta; dos cambiados, no siempre.
- **Los números primos** ★★★: probar divisores hasta la raíz. Giro: cuántas pruebas se ahorran al parar en la raíz.

**Funciones y Recursión**
- **El cajero automático** ★★★: funciones `retirar`, `depositar`, `saldo` con un menú. Giro: una función que no devuelve nada (`None`).
- **Las Torres de Hanói** ★★★★: la lección guardada en `lecciones/recursion/proyecto/`. Giro: cuántos movimientos (2ⁿ − 1).

**Texto a fondo**
- **El mensaje secreto** ★★★ (en el catálogo como «Próximamente»): cifrado César con un alfabeto en un texto, `.find()` y `%`. Giro: descifrar probando las 26 claves.
- **La contraseña segura** ★★: largo, una mayúscula, un número. Giro: qué hace segura una contraseña de verdad.

**Listas y Otras estructuras**
- **Los asientos del cine** ★★★: una lista de listas con libres y ocupados, buscar dos asientos juntos. Giro: el mejor asiento (más cerca del centro).
- **Las palabras más usadas** ★★★: contar con un diccionario y ordenar. Giro: las palabras que no dicen nada («de», «la»).
- **El torneo del salón** ★★★★ (en el catálogo, sección Ordenar): resultados de partidos, puntos en un diccionario y la tabla ordenada. Giro: el desempate.

Ideas para un caso de Búsquedas (la biblioteca: encontrar un libro por su código) o de Errores (el formulario que no se rompe) también encajan.
