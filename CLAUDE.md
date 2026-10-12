# learn-program-animation

Páginas interactivas para que alumnos aprendan conceptos de programación (variables, condicionales, bucles, funciones, listas, etc.). Todo el contenido visible va **en español**.

## Formato técnico
- Cada lección es una página HTML autocontenida: HTML, CSS y JavaScript puros. **Sin build, sin npm, sin frameworks.** Debe funcionar abriendo el archivo con doble clic y publicarse tal cual en GitHub Pages.
- No cargar recursos externos (CDN, fuentes web) salvo que sea imprescindible; preferir fuentes del sistema y SVG/CSS inline.
- Estructura:
  - `index.html`: portada con el listado de lecciones y el progreso.
  - `assets/css/base.css`: tokens de diseño y componentes compartidos.
  - `assets/js/`: utilidades compartidas (motor de pasos, progreso en `localStorage`).
  - `lecciones/<tema>/index.html`: una carpeta por tema (`variables/`, `condicionales/`, `bucles/`, …).
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
- Mostrar el código real (JavaScript o pseudocódigo en español) junto a la visualización, resaltando la línea que se ejecuta.
- Los retos tienen respuesta verificable en el navegador, sin servidor.

## Convenciones de trabajo
- Reutilizar `base.css` y las utilidades de `assets/js/` antes de crear estilos o scripts nuevos.
- Una lección nueva = su carpeta + una tarjeta en `index.html`.
- Probar cada página en el navegador (escritorio y ancho móvil) antes de dar la tarea por terminada.
- Commits pequeños y descriptivos, en español o inglés pero consistentes.
- Autoría: commits y PRs solo a nombre de Moisés Cumpa <moises.cumpa@gmail.com>. No añadir `Co-Authored-By` de Claude, enlaces de sesión ni firmas tipo "Generated with Claude Code".
