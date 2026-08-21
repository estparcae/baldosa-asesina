#!/bin/sh
# BALDOSA ASESINA - build: fuente legible -> game.min.js
cd "$(dirname "$0")"
{ echo '(()=>{'; cat src/game.src.js; echo '})();'; } > /tmp/ba_wrap.js
npx --yes esbuild@0.28.2 /tmp/ba_wrap.js --minify --charset=utf8 --target=es2019 --outfile=game.min.js --log-level=error
echo "game.min.js  $(wc -c < game.min.js) bytes"
echo "index.html   $(wc -c < index.html) bytes"
echo "TOTAL        $(( $(wc -c < game.min.js) + $(wc -c < index.html) )) bytes  (limite 50000)"
