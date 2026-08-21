# Avisos de terceros

Este repositorio redistribuye software de terceros. Abajo están sus avisos de
licencia, tal como exigen sus términos.

El código propio del juego (`src/game.src.js`, `game.min.js`, `index.html`,
`tools/`, `build.sh`, `run.sh`) está bajo la licencia MIT del archivo `LICENSE`.
`miniatura.png` es arte original de Crafter Station, incluido con su permiso y
cubierto por ese mismo `LICENSE`.

---

## Phaser 3.90.0

- Archivo redistribuido: `phaser.min.js`
- Verificado byte a byte contra `phaser@3.90.0/dist/phaser.min.js` del registro
  de npm (sha256 `e92ddef111ba42e92d316979c732311757093688ea1810591cb7aa2858eba7a7`)
- Proyecto: https://phaser.io

```
The MIT License (MIT)

Copyright (c) 2024 Richard Davey, Phaser Studio Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## esbuild

No se redistribuye: `build.sh` lo descarga de npm al momento de compilar
(`esbuild@0.28.2`, licencia MIT). No forma parte de este repositorio.
