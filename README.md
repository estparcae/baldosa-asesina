# BALDOSA ASESINA
### Cruza Bogotá sin mojarte los zapatos

Juego de arcade para **Platanus Hack 26**. Vos sos un peatón bogotano, está lloviendo,
y tus zapatos están secos. La ciudad entera no está de acuerdo.

## Correrlo

```sh
./run.sh              # abre http://localhost:8899 en el navegador
```

Para reconstruir después de editar la fuente:

```sh
./build.sh            # src/game.src.js  ->  game.min.js  (y reporta el peso)
```

o a mano:

```sh
python3 -m http.server 8899
# abrir http://localhost:8899
```

No necesita build, ni npm install, ni internet. `phaser.min.js` viene local y si falta,
`index.html` cae al CDN automáticamente.

## Controles

| Tecla | Acción |
|---|---|
| **Flechas / WASD** | saltar de baldosa en baldosa |
| **ENTER** | montarte al TransMilenio (en la estación) |
| **ESPACIO** | abrir el paraguas |
| **SHIFT** | tomarte el tinto (te mueves más rápido) |
| **E** | tirarle el pan al perro |
| **M** | silenciar la música |

En la pantalla de récords podés **escribir tus iniciales con el teclado** (o con las flechas,
que es lo que sirve en el gabinete, donde no hay teclado).

La primera pantalla después del título es **LO BÁSICO**: el objetivo, los tres tipos de baldosa,
las dos barras y para qué sirven las monedas. El resto no se explica de entrada — **cada tramo
introduce una sola regla nueva**, y antes de empezarlo hay un **briefing con espera de tres
segundos** que muestra qué cambia y qué llevás encima, para que nadie lo salte sin leer.

Soporta gamepad (el joystick del gabinete) y `Scale.FIT` para cualquier resolución.

## Balance

El generador traza un **corredor seguro garantizado** de punta a punta antes de sembrar los
peligros: siempre existe una ruta sin mojarse, incluso sin botas. Y no es una promesa —
`node tools/audit.js` extrae el generador del juego, le corre un BFS y lo verifica:

```
tramo  ruta-seca  mojadas  sin-marcar  peor-columna  cerradas
  1        SI        10%       26%          2/4          0
  2        SI        14%       48%          2/4          0
  3        SI        15%       66%          3/4          0
  4        SI        18%       72%          3/4          0
  5        SI        22%       73%          3/4          0
```

Las baldosas escalan con tres perillas por tramo: **densidad** (10% → 22%), **cuántas van sin
marcar** (26% → 73%) y **cuánto zigzaguea** el corredor. El tramo 1 es casi todo X rosada
visible; del 3 en adelante el juego deja de ser esquivar y pasa a ser leer el piso.

## La curva

| Tramo | La única regla nueva |
|---|---|
| 1 · La Candelaria | solo baldosas: ni gente, ni lluvia, ni buses, ni perros |
| 2 · Plaza de Bolívar | la gente con afán te corre de fila |
| 3 · Av. Jiménez | llueve, el articulado salpica, y aparece la primera estación |
| 4 · Chapinero de noche | el perro: te quita la calma para leer el andén |
| 5 · Hora pico | la inundación, y todo cruzándose a la vez |

## Cómo se juega

Tres barras cuentan todo: **ZAPATOS** (qué tan mojado vas), **AFÁN** (el reloj) y
**RACHA SECA** (el multiplicador de puntaje).

- Las **baldosas escupidoras marcadas con X rosada** las ves venir — son el regalo del
  activista que las pintó. Las peligrosas de verdad son las que **nadie marcó**: solo las
  delata un destello de agua. Aprender a leer el andén *es* el juego.
- Cuando la lluvia sube, ciertas zonas se **inundan** y el andén desaparece. Cuatro salidas:
  saltar por los **bolardos** (máximo puntaje), **vadear con botas**, **montarte al TM**
  (gratis, pero te cuesta 7,5s de afán y la racha), o meterte al agua y perder una vida.
- El **perro callejero** te obliga a correr sin poder leer las baldosas. Pero durante el
  rush el multiplicador se **duplica** y sale el rastro de monedas más denso del juego.
  El perro no es castigo: es una apuesta.
- En el **TransMilenio se te secan los zapatos**, pero no da puntos y hay que ganárselo:
  son tres frenones y hay que aguantar el equilibrio. Los tres bien y bajás con la barra en
  cero más 250 puntos; los tres mal y **te sacan en la estación equivocada**. El leaderboard
  premia a quien camina: los mejores jugadores nunca se montan.

## Restricciones del reto

| Requisito | Cumplimiento |
|---|---|
| Phaser 3 | `phaser@3.90.0` — la última de la rama 3 |
| Código ≤ 50kb | **49,5kb** (`game.min.js` + `index.html`). La fuente legible vive en `src/game.src.js` y se compila con `./build.sh` |
| Cero assets externos | Toda la gráfica con `Graphics.generateTexture()`, toda la música y los efectos con osciladores de Web Audio, tipografía del sistema |

```sh
./build.sh                      # compila y reporta el presupuesto
```

### La música

Es un **pasillo bogotano resintetizado en chiptune**. Analicé una grabación de pasillo
tradicional (132,5 BPM, melodía en fa menor natural) y con esos datos escribí el arreglo:
melodía en onda cuadrada, bajo en triangular al primer tiempo y acordes en el segundo y
tercero — el *um-pa-pa* del pasillo en 3/4. Va suave y con filtro paso-bajo para que los
efectos interactivos pasen por encima. `[M]` la silencia.

Todo son osciladores en código: no viaja ni un archivo de audio.

## Estructura

```
index.html          canvas + carga de Phaser (local con fallback a CDN)
game.min.js         lo que se sirve: el juego completo, 49kb
src/game.src.js     la fuente legible (no se sirve)
build.sh            src -> game.min.js, reporta el presupuesto
phaser.min.js       la librería (no cuenta al presupuesto)
PLAN.md             investigación, diseño y decisiones
```

Seis escenas: `Boot` genera todas las texturas una vez, `Title` es el atract,
`Help` es el cómo se juega, `Play` es el loop, `Shop` es la tienda con el pronóstico del
IDEAM, y `Over` guarda el marcador en `localStorage`.

### Dirección de arte

Todo procedural, con cinco reglas: **outline de 1px** en cada sprite (legibilidad a tres
metros del gabinete), **paleta cerrada** por barrio, **dithering 2×2** en cielo y cerros,
luz desde arriba-izquierda, y **scanlines CRT con viñeta** encima de todo.

Las baldosas son el corazón visual: seis variantes por nivel, cada losa desplazada y con
canto visible, tierra en las juntas, musgo, grietas y hojarasca — inspiradas en las
baldosas sueltas reales de los andenes bogotanos. Los sprites de personajes se dibujan
desde strings de píxeles, que es la única forma de meter caras y pliegues de ruana en
tan pocos bytes.

## Miniatura

`miniatura.png` es arte promocional de **Crafter Station** para la portada del envío y el
preview del link. **El juego nunca la carga** — es un archivo suelto del repo, así que la
regla de cero assets sigue intacta: `game.min.js` no referencia ninguna imagen.

## Publicarlo

Es estático: sirve cualquier host de archivos. Con GitHub Pages:

```sh
git init && git add -A && git commit -m "baldosa asesina"
gh repo create baldosa-asesina --public --source=. --push
# Settings -> Pages -> branch main / root
```

Para el voto popular, **itch.io** también sirve bien: subís un zip con `index.html`,
`game.min.js` y `phaser.min.js` y queda jugable desde el celular.

## Contribuir

Los PRs son bienvenidos. Una sola regla: **`game.min.js` es generado, no lo
edites a mano** — la fuente es `src/game.src.js` y se compila con `./build.sh`.
El CI lo verifica byte a byte en cada PR, junto con el presupuesto de 50kb y la
auditoría de balance. Los detalles están en [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

MIT — ver [LICENSE](LICENSE). El juego, la fuente y `miniatura.png` son obra
original de Crafter Station.

`phaser.min.js` es Phaser 3.90.0, redistribuido bajo su propia licencia MIT
(© 2024 Richard Davey, Phaser Studio Inc.). El aviso completo está en
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
