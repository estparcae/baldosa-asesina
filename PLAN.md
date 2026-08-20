# BALDOSA ASESINA
### Cruza Bogotá sin mojarte los zapatos
**Plan de investigación + diseño + ejecución — Platanus Hack 26 Arcade Challenge**
Escrito 2026-08-19 21:35 (Bogotá) · Deadline 23:59 (Bogotá) · **Ventana real: ~2h 20min**

---

## 0. Restricciones del reto (y cómo las cumplimos)

| Requisito | Estrategia |
|---|---|
| Usar **Phaser 3** | `phaser@3.90.0` (última de la rama 3, mayo 2025) vía CDN. La librería NO es "tu código" → no cuenta al presupuesto. |
| **≤ 50kb** de código propio | Fuente legible en `src/game.src.js`, compilada con `./build.sh` a `game.min.js`, que es lo que se sirve. El script reporta el presupuesto en cada build. |
| **Cero assets externos** | Toda la gráfica se dibuja con `Phaser.GameObjects.Graphics` y se hornea con `generateTexture()`. Todo el audio se sintetiza con **Web Audio API** (osciladores + envolventes). Tipografía: fuentes del sistema (`monospace`), cero webfonts. |
| Arcade real (gabinete) | 960×540 con `Scale.FIT` + `CENTER_BOTH` → sirve en 4:3 y 16:9. Input: flechas + WASD + **Gamepad API** (joystick del gabinete) + Enter/Espacio como "start/coin". **Attract mode** que loopea solo si nadie juega 20s (esencial en arcade). |

**Riesgo de interpretación:** "50kb" no aclara si es minificado o gzip. Nos quedamos por debajo de **50.000 bytes exactos** de lo que se sirve (`game.min.js` + `index.html`), que es el umbral más estricto razonable. La fuente legible queda en el repo para que se pueda leer.

---

## 1. Investigación técnica

### Librería
- **Phaser 3.90.0 "Tsugumi"** — CDN: `https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js`
- Phaser 4.x existe (v4.1.0, abril 2026) pero el reto pide **3** explícitamente. No arriesgamos descalificación.
- Física: **Arcade Physics** (no Matter). Más liviana y suficiente para colisiones AABB.

### Gráficas 100% código — técnicas confirmadas
1. **`Graphics` → `generateTexture(key, w, h)`**: dibujas una vez en `create()`, obtienes una textura cacheada. Todo sprite del juego nace así.
2. **Fábrica de texturas por función**: `mkTile()`, `mkBus()`, `mkPerson(paleta)`, `mkUmbrella()`, `mkTower()`. Reutilizamos geometría con parámetros → mucha variedad visual por muy pocos bytes.
3. **Paletas por nivel**: la misma geometría con otra paleta = otro barrio. Es el truco de compresión visual más rentable.
4. **Parallax con `TileSprite`**: cerros orientales, ladrillo, cielo — 3 capas.
5. **Partículas** (`add.particles`) para lluvia, salpicón y palomas. Textura: un cuadrito de 4×4 px generado en código.
6. **Torre Colpatria**: rectángulo negro + grilla de ventanas que ciclan colores con `tweens` → el guiño visual más reconocible de Bogotá de noche, por ~15 líneas.

### Direccion de arte retro (todo procedural)

Cinco reglas, aplicadas a cada textura generada:
1. **Outline de 1px** en todo sprite. Un helper dibuja cada rect expandido 1px en tinta (`#14101c`) y encima el rect real → silueta legible a 3 metros del gabinete. Es la regla que mas hace por el look.
2. **Paleta cerrada por nivel.** Todo color sale de mezclar la paleta del barrio contra la tinta o el blanco. Nada de color libre.
3. **Dithering 2x2** para degradados (cielo, cerros) en vez de gradientes suaves. Es lo que suena a consola de 8 bits.
4. **Luz desde arriba-izquierda**: cada baldosa lleva highlight de 1px arriba/izquierda y sombra de 1px abajo. La cuadricula bogotana se vuelve mosaico.
5. **Pantalla CRT**: scanlines cada 3px + vineta por bordes. Un tilesprite y 14 strokeRect: el cambio mas barato y el que mas grita "arcade".

Ademas: skyline con 4 variantes de fachada de alturas distintas (que se vea el cielo entre edificios), ladrillo procedural para los niveles del norte, ventanas encendidas de noche, y la Torre Colpatria ciclando color por HSV.

### Música: el pasillo bogotano resintetizado

Analicé una grabación de pasillo tradicional con FFT: **132,5 BPM** y melodía en **fa menor natural** (los grados extraídos —0, 3, 5, 7, 8, 10 sobre fa— son fa menor, casi pentatónica menor; el correlador de tonalidad decía fa mayor pero la melodía manda).

Con esos datos escribí el arreglo chiptune, no una transcripción literal: **melodía en onda cuadrada, bajo en triangular al primer tiempo, acordes en el segundo y el tercero** — el *um-pa-pa* del pasillo en 3/4. Progresión i–iv–V–i en fa menor, 16 compases.

Va **suave y con filtro paso-bajo a 1750Hz** para que los efectos interactivos pasen por encima; `[M]` la silencia. La melodía se codifica como una cadena de 96 caracteres en base 36 (un semitono por corchea) y un planificador de 12 líneas la agenda contra el reloj del `AudioContext`, con clamp anti-ráfaga para que el navegador no dispare las notas atrasadas de golpe al volver de segundo plano.

Cero archivos de audio: todo son osciladores.

### Audio 100% código
- `AudioContext` + `OscillatorNode` (`square` para chiptune tipo NES, `triangle` para bajos, ruido blanco vía `BufferSource` para el **splash**).
- Función única `sfx(freq, dur, type, decay)` → salto, salpicón, moneda, torniquete, bus, game over.

### Referencia cultural (el corazón del juego)
- **"Baldosas escupidoras"**: baldosas sueltas que al pisarlas expulsan agua acumulada. Iniciativa ciudadana desde 2023 las marca con **X negra sobre rosado** (~25.200 marcadas). Rosa = inconformismo, protesta visual.
- **Diseño derivado**: las baldosas marcadas con X rosada son las que **sí se ven** (regalo del activista al jugador). Las peligrosas de verdad son las que **nadie marcó todavía** — solo las delata un brillo sutil de agua. Esa es la tensión central del juego y le da alma a la mecánica.
- Otros elementos: TransMilenio articulado rojo, la estación elevada, palomas de la Plaza de Bolívar, ciclistas en el andén, obras eternas con valla naranja, motos parqueadas sobre el andén, la lluvia de las 4pm, ruana, tinto, la Séptima, Monserrate.

---

## 2. Diseño del juego

### Fantasía central
Eres un peatón bogotano. Llueve. Tus zapatos están secos. **Quieres que sigan secos.** La ciudad entera no está de acuerdo.

### Loop de juego (60 segundos)
Vista lateral con andén en **grilla de 4 filas** (el ancho del andén) que avanza hacia la derecha. Cámara sigue al jugador. Saltas de baldosa en baldosa decidiendo dónde pisar, mientras el andén se llena de tráfico peatonal.

```
  ┌─ fila 1: borde de la vía (buses, motos, charcos grandes)
  │   fila 2: andén — carril de corredores
  │   fila 3: anden — obras, motos mal parqueadas, canecas
  └─ fila 4: contra la fachada — lento pero seguro
```

### Las 3 barras (todo el estado en una mirada)
1. **ZAPATOS** (0–100% mojado). Salpicón chico +15, charco +35, bus salpicando +50. Al 100% → *"Llegaste con los pies empapados"* = fin de nivel perdido.
2. **AFÁN** (temporizador). Es Bogotá: si te demoras, pierdes. Empuja al riesgo.
3. **RACHA SECA** (combo). Baldosas seguidas sin mojarte → multiplicador de puntaje. Se rompe con cada salpicón. Es el marcador que hace competitiva la máquina.

### El camino seguro garantizado (y por qué antes había encerrones)

El generador original solo aseguraba que **existiera** una baldosa seca en cada columna. Eso no alcanza: el jugador se mueve una celda por pulsación, así que para llegar a esa baldosa seca puede tener que **cruzar mojadas en vertical**. El resultado eran encerrones donde, sin botas, no había salida — dificultad falsa, de las que se sienten injustas.

Ahora el generador traza primero un **corredor seguro** de punta a punta: una fila por columna que nunca se moja, que se desplaza como máximo una fila entre columnas contiguas. Y protege **las dos filas de la transición** (la de salida y la de llegada), para que el cambio de fila también se pueda hacer en seco. Sobre ese corredor se siembra todo lo demás.

En los dos primeros tramos hay además un **margen de perdón**: las filas vecinas al corredor quedan limpias la mitad de las veces, así que el pasillo seguro es de dos filas de ancho y no exige precisión.

**Esto se verifica, no se supone.** `tools/audit.js` extrae el generador del juego, le corre un BFS sobre la grilla y confirma que exista ruta sin mojarse:

```
tramo  ruta-seca  mojadas  sin-marcar  peor-columna  cerradas
  1        SI        10%       26%          2/4          0
  2        SI        14%       48%          2/4          0
  3        SI        15%       66%          3/4          0
  4        SI        18%       72%          3/4          0
  5        SI        22%       73%          3/4          0
```

### La dificultad de las baldosas también escala

No solo suben los personajes y el ambiente. Tres perillas por tramo:

| Perilla | Qué hace | 1 → 5 |
|---|---|---|
| **densidad** | cuántas baldosas mojan | 10% → 22% de las celdas |
| **sin marcar** | qué fracción de las mojadas es invisible (solo el brillo) | 26% → 73% |
| **zigzag** | cada cuánto cambia de fila el corredor seguro | .15 → .42 (navegación más apretada) |

El tramo 1 es casi todo X rosada visible: enseña *"no pises la marcada"*. Del 3 en adelante la mayoría ya no está marcada, así que el juego deja de ser esquivar y pasa a ser **leer el piso**, que es la habilidad de verdad.

### Enemigos y obstáculos (escalonados por nivel)
| Amenaza | Comportamiento | Contra |
|---|---|---|
| **Baldosa escupidora** (marcada con X rosada) | Visible. Al pisarla, salpica. | Esquivar / botas |
| **Baldosa no marcada** | Invisible; solo un brillo de agua de 3px. La verdadera dificultad. | Leer el brillo / botas |
| **Corredor** | Viene de frente a alta velocidad por su carril. | Cambiar de fila |
| **Obra eterna / valla** | Estatica, ocupa el carril seguro del anden. | Rodear |
| **Moto parqueada en el anden** | Bloquea el paso donde no deberia estar. | Rodear |
| **Caneca** | Obstaculo fijo. | Rodear |
| **Palomas** | Bandada que despega y te empuja una fila. | Timing |
| **Ciclista en el andén** | Rápido, diagonal, impredecible. | Reflejos |
| **Perro callejero** | Te persigue y te obliga a correr sin leer el andén. | Umbral / tinto / pan / el agua |
| **TransMilenio** | En la fila 1 y en los cruces. Toca al pasar = salpicón masivo (o muerte en cruce). | Semáforo / esperar |
| **Lluvia** | Sube el mojado pasivamente cuando arrecia. | Paraguas |

**Nota de diseno:** los obstaculos del anden son **infraestructura**, nunca personas trabajando. El chiste del juego es que la ciudad le falla al peaton — poner al vendedor ambulante como enemigo seria clasista y ademas debilitaria la satira. La gente que te empuja es solo trafico peatonal (todos con afan, como en la vida real).

### Progresión: una regla nueva por nivel

El error de diseño más grave que tenía el plan era pedagógico: metía el perro en el nivel 2 y la inundación en el 3, o sea le exigía al jugador **correr sin poder leer el andén antes de haber aprendido a leerlo**. La curva estaba al revés. Cada nivel introduce exactamente una cosa:

| # | Escenario | La única regla nueva | Consejo que aparece |
|---|---|---|---|
| 1 | **La Candelaria** | Solo baldosas. Ni gente, ni lluvia, ni buses, ni perros. | *"las baldosas con X rosada salpican. las que nadie marcó, solo brillan."* |
| 2 | **Plaza de Bolívar / la Séptima** | La gente con afán te corre de fila. Palomas. | *"la gente va con afán: si te choca, te corre de fila."* |
| 3 | **Av. Jiménez** | Llueve, el articulado salpica, y aparece la primera estación — para que pruebes el TM **sin presión**, antes de necesitarlo. | *"ya llueve. el articulado salpica si vas pegado al sardinel."* |
| 4 | **Chapinero de noche** | El perro. Ahora que sabés leer el andén, te quitan la calma para leerlo. El TM sirve de escape: el perro no pasa el torniquete. | *"perros sueltos: corres sin poder leer el piso. [E] tirale pan."* |
| 5 | **Hora pico, la Caracas** | La inundación. Todos los sistemas se cruzan: perro atrás, agua adelante, y la decisión de las cuatro salidas. | *"hora pico y se inunda: bolardos, botas o TransMilenio."* |

**Antes de cada tramo nuevo hay un briefing con espera forzada.** Una tarjeta con el número y el nombre del tramo, la única regla nueva con su sprite al lado, qué llevás encima (los ítems comprados y las monedas), y un contador de tres segundos antes de habilitar `[ENTER] ARRANCAR`. La espera es deliberada: sin ella la gente salta la pantalla sin leerla y llega al tramo sin saber qué cambió. El tramo 1 no lleva briefing porque la pantalla de LO BÁSICO ya cumple ese papel.

Y como consecuencia directa: **la pantalla de instrucciones se redujo a lo básico** (el objetivo, los tres tipos de baldosa, las dos barras, para qué sirven las monedas, y los controles). Explicar las quince reglas de entrada era exactamente lo abrumante que esta curva evita. El resto lo enseña cada tramo cuando toca.

### Sistema LLUVIA → INUNDACIÓN → TRANSMILENIO

El clima no es decoración: es el generador de terreno. Tres capas encadenadas.

**1. La lluvia sube.** Cada nivel tiene una curva de intensidad (0–100) que crece con el tiempo — el aguacero de las 4pm. Sube el mojado pasivo y, sobre todo, alimenta la capa 2.

**2. La calle se inunda.** Ciertos segmentos del nivel están marcados como **zona inundable** (terreno bajo, como pasa de verdad en la Av. Ciudad de Cali, la 80 o los deprimidos). Al cruzar un umbral de lluvia, transicionan en tres estados visibles:

```
   SECO  ──lluvia 40%──►  CHARCO  ──lluvia 70%──►  INUNDADA
   andén normal           salpica al pisar          no hay baldosa seca: el andén desapareció
```

El telegrafiado es sagrado: **nunca se inunda por sorpresa.** Los sumideros empiezan a burbujear, el agua sube con una superficie animada por seno, las baldosas se oscurecen. El jugador ve venir la inundación con ~8 segundos de anticipación y decide su ruta *antes*.

**3. La estación es el piso seco.** Una zona INUNDADA no se puede caminar. No es una pared invisible: es agua, y el jugador tiene cuatro respuestas.

### Las 4 formas de cruzar una inundación

| Opción | Costo | Riesgo | Puntos |
|---|---|---|---|
| **Vía alta** (bolardos, jardineras, tapas, andén alto) | gratis | exige habilidad y timing | **máximos** (racha intacta + bonus) |
| **Botas de caucho** + vadear | $$ una vez, reutilizable | lento (come AFÁN), +mojado leve, basura flotando | medios |
| **TransMilenio** | **gratis** — pero te cuesta 7,5s de AFAN y te rompe la racha | seguro para los zapatos; adentro va lleno y te empujan | **cero** |
| **Meterse así no más** | gratis | **–1 vida**, +60 de mojado | cero |

Esa tabla es todo el juego: **tiempo vs. zapatos vs. habilidad.** Es la decisión que uno toma de verdad parado en una esquina de Bogotá cuando está lloviendo.

### Cómo el TransMilenio NO se come el juego

Cinco frenos, en orden de importancia:

1. **El puntaje sale de caminar, no de viajar.** Los puntos vienen de la RACHA SECA de baldosas. Ir en el articulado te da **cero** puntos y te rompe la racha. El TM te salva la vida y te cuesta el marcador. En el leaderboard del gabinete gana quien menos TM usó → **los mejores jugadores nunca se montan.** Este es el freno que hace todo el trabajo.
2. **Cuesta plata de verdad.** Pasaje $3.200; las monedas del piso son de $500. Un viaje son ~7 monedas. Cada pasaje que pagas es un par de botas que no compraste → quedas frágil en todo lo demás.
3. **Solo existe donde hay estación.** La troncal es fija y las estaciones son escasas (una cada segmento y medio). No podés TM-earte todos los problemas; caminar es el estado por defecto.
4. **El bus no es seguro, es distinto.** Adentro hay cosecha propia de amenazas: va lleno y te empujan, el que te roba el celular, y te podés pasar de estación. Cambiás un riesgo por otro.
5. **La fila.** Entrar cuesta AFÁN. Con el reloj corriendo, el atajo a veces es más lento que la vía alta.

### El TransMilenio como sistema (tres verbos, no un botón)

**ENTRAR** — Llegás a la estación, aparece el prompt y pasás el torniquete con `[ENTER]`. **Gratis, siempre.** Lo que se paga es el reloj: **−7,5s de AFÁN** y la racha en cero.

**VIAJAR** — No es un fundido a negro, y no es un premio gratis: es una **prueba de habilidad con consecuencias**. Tres frenones, cada uno con la flecha que hay que aguantar:

| Resultado | Qué pasa |
|---|---|
| **3 de 3** | Bajás con los zapatos **en cero** y +250 puntos. El viaje perfecto es un reset completo de la barra. |
| 1 o 2 | Secás parcialmente. Cada frenón que fallás te moja y te quita el secado. |
| **0 de 3** | **Te sacan en la estación equivocada:** bajás cinco columnas después de donde subiste, o sea perdés el atajo completo. |

Eso resuelve el problema de que el TM fuera una curación gratis: el jugador malo no cobra el beneficio, y el bueno se gana un reset que se siente. Además refuerza el freno anti-dominancia — el TM sigue sin dar racha ni puntos por caminar.

Adentro, además:
- El articulado va **lleno**: mantené tu posición o te empujan a la puerta equivocada.
- **Aca se secan los zapatos.** El mojado baja mientras viajás. El TM es la estación de curación del juego — y eso justifica su costo sin darle puntos.
- Frenadas: aguantá el equilibrio.

**SALIR** — Elegís en qué estación te bajás. Bajarte temprano es más barato pero te toca caminar más; bajarte lejos cuesta más saldo. Ahí está la decisión de ruta.

### El mapa entre niveles: el pronóstico del IDEAM

La pantalla de mapa (plano de troncal estilo metro) muestra el **pronóstico de lluvia por segmento** del siguiente nivel. Eso convierte la tienda en una decisión informada y no en una compra a ciegas:

> *"Tramo 2: 80% de lluvia. Tramo 3: zona inundable."*
> → ¿Compro botas para vadear, o me aguanto el reloj y me monto al TM?

**La tienda de la esquina** — con lo que recogiste:

| Ítem | Precio | Efecto |
|---|---|---|
| **Tinto** | $ | Dash rápido, 3 usos. Sirve para la vía alta. |
| **Botas de caucho** | $$ | Permiten **vadear** inundaciones. Absorben 2 salpicones. |
| **Paraguas** | $$ | Anula la lluvia pasiva 20s y **retrasa** la inundación. |
| **Ruana** | $$ | Escudo: 1 empujón de gente gratis (sirve dentro del bus). |
| **Bolsa de pan** | $500 | `[E]` se lo tiras al perro y te deja en paz |

### Vidas

**3 vidas = 3 pares de medias secas.** La barra de ZAPATOS al 100% cuesta una vida y te devuelve al último **paradero** (checkpoint). Meterse a una inundación sin botas cuesta una vida directa.

### RUSH: el perro callejero

La mecánica central del juego es **leer el andén con calma** — buscar el brillo de agua en la baldosa no marcada. Entonces el mejor antagonista posible es algo que te **quite la calma**. Eso es el perro.

**Disparo:** ladrido (señal de audio antes que visual), y el perro aparece detrás. Guionizado en puntos fijos + aleatorio desde el nivel 2.

**Qué cambia al entrar en RUSH:**
- **Contador de permanencia:** si te quedás más de ~0,4s en una baldosa, el perro se acerca. El juego pasa de *saltar deliberado* a *saltar continuo*.
- No hay tiempo de leer el brillo → **vas a pisar escupidoras.** El perro convierte tu habilidad de lectura en instinto y memoria. Aceptás mojarte para escapar.
- Cámara acelera, viñeta roja en los bordes, respiración/latido en el audio.

**Por qué el jugador experto QUIERE al perro:** durante el RUSH el multiplicador de RACHA se **duplica (x2 PÁNICO)** y el rastro de monedas es el más denso del juego. El perro no es castigo, es una apuesta.

**Cómo se sale:**
| Salida | Cómo |
|---|---|
| Llegar a un umbral | Un portón, una tienda, la esquina. El perro se queda ladrando. |
| **Tinto** (dash) | Le sacás ventaja. Le da un segundo uso al ítem. |
| **Pan** ($500) | Se lo tiras y lo distraes. |
| Aguantar | A los ~20 saltos el perro se aburre. Muy Bogotá. |
| **El agua** | El perro **no se mete a la inundación.** |

**Y acá se cierra el sistema completo.** El perro no entra al agua y **no pasa el torniquete**. O sea: el perro te *empuja* hacia la inundación y hacia la estación. Deja de ser una decisión tranquila de ruta y se vuelve una decisión de pánico:

```
   perro atrás  +  inundación adelante
        │
        ├── ¿tenés botas?     → vadeás, el perro se queda en la orilla
        ├── ¿tenés saldo?     → torniquete, el perro se queda afuera
        ├── ¿tenés puntería?  → vía alta por los bolardos, máximo puntaje
        └── ¿no tenés nada?   → te metés al agua y pagás una vida
```

Esa es la escena que la gente va a estar gritando alrededor del gabinete. Es el clímax del juego y sale de combinar tres sistemas que ya existen, sin código nuevo de peso.

**Bonus (si sobra tiempo):** con el pan podes **darle de comer** en vez de tirárselo lejos → el perro te adopta y te acompaña el resto del nivel espantando a la gente con afán. El perro que te adopta en Bogotá es una experiencia nacional.

### Meta-juego arcade
- **Leaderboard local** (`localStorage`) con iniciales de 3 letras estilo arcade. Es lo que hace que la gente vuelva a la máquina en el hackathon.
- **Attract mode**: demo automática + tabla de records en loop.
- Puntaje = baldosas secas × multiplicador de racha + bonus por zapatos secos al final.

---

## 3. Arquitectura

```
buscaminas-rolo/
├── index.html      ~1kb   canvas + CDN Phaser + boot
├── game.js        ~44kb   TODO el juego (una sola pasada, sin build)
│   ├── PAL         paletas por nivel
│   ├── TX()        fábrica de texturas procedurales (generateTexture)
│   ├── SFX()       síntesis Web Audio
│   ├── LV[]        data de los 5 niveles (spawns, ritmo, clima)
│   ├── Boot        genera todas las texturas una vez
│   ├── Title       attract mode + records
│   ├── Play        el loop de juego
│   ├── Map         mapa TM + tienda
│   └── Over        game over + captura de iniciales
├── PLAN.md         este documento
└── README.md       cómo correrlo en el gabinete
```

**Presupuesto de bytes** (crudo, sin minificar):
| Módulo | kb |
|---|---|
| Texturas procedurales (`TX`) | 12 |
| Escena Play (movimiento, colisiones, spawns) | 14 |
| Mapa TM + tienda + economía | 7 |
| Título/attract/game over/leaderboard | 5 |
| Audio sintetizado | 4 |
| Data de niveles + paletas | 3 |
| **Total** | **~45kb** (5kb de margen) |

---

## 4. Estado de ejecución

| Bloque | Estado |
|---|---|
| Scaffold + fábrica de texturas procedurales | ✅ `index.html` + Phaser 3.90 local con fallback a CDN |
| Core loop: grilla de andén, saltar, escupidoras, ZAPATOS, AFÁN, vidas, racha | ✅ jugable |
| Cadena lluvia → charco → inundación, vía alta de bolardos, vadear con botas | ✅ verificado en navegador |
| RUSH del perro (x2 pánico, rastro de monedas, salidas) | ✅ |
| TransMilenio: estación, torniquete gratis, viaje con secado y empujones | ✅ |
| Tienda + pronóstico IDEAM + economía de 5 ítems | ✅ |
| 5 niveles con paletas propias, audio sintetizado, partículas, screen shake | ✅ |
| Shell de arcade: título, marcador local con iniciales, gamepad, `Scale.FIT` | ✅ |
| Pantalla **CÓMO SE JUEGA**: explica cada mecánica con los sprites reales | ✅ |
| **Home** con marquesina, logo a dos tonos, cerros, andén animado y paneles de récords | ✅ |
| **Música**: pasillo bogotano en chiptune, suave, con mute en `[M]` | ✅ |
| Pase de arte retro: outlines, dithering, skyline, CRT | ✅ |
| **Tamaño** | **49,5kb de 50kb** (`game.min.js` + `index.html`) |

**Sobre el empaquetado:** el detalle de arte que pedía la referencia 16 bits no cabía en 50kb de fuente cruda, así que la fuente legible vive en `src/game.src.js` y `./build.sh` la compila a `game.min.js`, que es lo que se sirve. Para que cupiera hubo que trabajar el presupuesto byte a byte: alias de las llamadas de dibujo más repetidas (`fillStyle`/`fillRect` aparecían 358 veces), consts para los colores repetidos, y recortes de props de bajo valor visual.

Pendiente al cierre: balance fino de dificultad jugándolo con gente, el perro que te adopta con el pan, y elegir estación de salida.

---

## 4b. Trampa técnica que costó un congelamiento

Phaser **reutiliza la misma instancia de escena** entre tramos: al arrancar un nivel nuevo, `create()` corre otra vez y el motor destruye todos los objetos gráficos — pero las propiedades de la instancia siguen apuntando a esos objetos muertos.

El juego cacheaba tres cosas por rendimiento (el contenedor del viaje en TransMilenio, el sprite del perro con su sombra, y la viñeta roja del rush) con el patrón `if(!this.ov){...crear...}`. Del segundo tramo en adelante ese `if` daba falso, se saltaba la creación, y el primer método sobre el objeto destruido lanzaba una excepción que **mataba el bucle de render**: la pantalla quedaba congelada con el último frame y el prompt del torniquete pegado.

Síntoma engañoso porque solo aparecía **lejos** — jugando el tramo 3, 4 o 5 y montándose al bus, nunca en el primero. Las pruebas del nivel 1 pasaban siempre.

La cura es una línea en `create()` que suelta todo lo cacheado (`this.ov=this.dogS=this.dogSh=this.vg=this.bf=null`). La lección para el resto del código: **en Phaser, cualquier `this.X` que sobreviva a un `scene.start` es una referencia colgante.**

## 5. Estrategia para los dos premios

- **1er lugar (jurado):** cumplimiento literal de las 3 restricciones + una mecánica original que no es un clon. La lectura del "brillo de agua" en baldosas no marcadas es una mecánica de percepción propia, no un re-skin de Frogger.
- **Más popular (voto de la gente):** es donde gana el tema. Cualquier bogotano entiende el chiste en 2 segundos sin leer instrucciones — y la barra de ZAPATOS provoca risa colectiva alrededor del gabinete. Refuerzos: nombres reales (la Séptima, el articulado, el afán), mensajes de muerte cómicos (*"tocó devolverse a cambiarse de medias"*), y el leaderboard con iniciales para que la gente compita entre sí toda la noche.

---

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| **Solo hay 2h20** | Scope congelado a las 23:20; niveles 4–5 son data, no código nuevo. |
| Pasarse de 50kb | Presupuesto por módulo desde el minuto 0 + `esbuild --minify` de respaldo. |
| Audio bloqueado por autoplay policy | `AudioContext` se crea en el primer input del jugador ("presiona START"). |
| Gabinete con resolución rara | `Scale.FIT` + `CENTER_BOTH` desde el arranque. |
| Sin internet en el gabinete | Guardar copia local de `phaser.min.js` como fallback junto al `index.html`. |
