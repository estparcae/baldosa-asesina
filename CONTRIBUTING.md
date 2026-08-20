# Cómo contribuir

Gracias por pasar. Esto es un juego de arcade de un solo archivo, así que las
reglas son cortas.

## La regla que importa: no edites `game.min.js`

`game.min.js` es **generado**. La fuente real es `src/game.src.js`.

```sh
# editás la fuente
vim src/game.src.js

# y recompilás
./build.sh
```

Un PR que modifique `game.min.js` a mano se rechaza sin revisión. No es
burocracia: revisar un diff dentro de 49kb de JavaScript minificado es
imposible en la práctica, y ese es exactamente el lugar donde se puede colar
código que nadie ve. El CI verifica en cada PR que `game.min.js` sea byte a
byte lo que sale de compilar `src/game.src.js`.

Si tu PR toca la fuente, incluí el `game.min.js` recompilado en el mismo
commit — el CI compara los dos y falla si no coinciden.

## Lo que el CI verifica

Cada PR corre `.github/workflows/verify-build.yml`, que chequea tres cosas:

1. **Build reproducible** — `./build.sh` produce exactamente el `game.min.js`
   commiteado. Requiere `esbuild@0.28.2` (fijado en `build.sh`); versiones
   anteriores a 0.27 generan un archivo distinto.
2. **Presupuesto de 50kb** — `game.min.js` + `index.html` ≤ 50.000 bytes. Es la
   restricción del reto y no se negocia.
3. **Balance jugable** — `node tools/audit.js` corre un BFS sobre el generador y
   falla si algún tramo se queda sin ruta seca de punta a punta.

Corré los tres en local antes de abrir el PR:

```sh
./build.sh && node tools/audit.js
```

## Cero assets externos

El juego no carga ni una imagen ni un archivo de audio: toda la gráfica sale de
`Graphics.generateTexture()` y todo el sonido de osciladores de Web Audio. Un PR
que agregue un asset, una webfont o una llamada de red rompe la restricción
central del proyecto. Si necesitás algo nuevo en pantalla, se dibuja con código.

`miniatura.png` es la excepción y no cuenta: es arte de portada del repo, el
juego nunca la referencia.

## Estilo

Seguí lo que ya está: sin dependencias, sin build step más allá de `build.sh`,
nombres cortos en las zonas calientes (el presupuesto de bytes es real) y
comentarios en español cuando expliquen una decisión, no lo obvio.

## Licencia

Al abrir un PR aceptás que tu contribución quede bajo la licencia MIT del
archivo `LICENSE`.
