#!/bin/sh
# BALDOSA ASESINA - servidor local
cd "$(dirname "$0")"
echo "abriendo http://localhost:8899 ..."
(command -v open >/dev/null && sleep 1 && open "http://localhost:8899/index.html" &)
python3 -m http.server 8899
