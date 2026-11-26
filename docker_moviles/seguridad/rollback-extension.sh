#!/usr/bin/env bash
# Desactiva vexora-rls: elimina la carpeta del volumen de extensiones y
# reinicia solo el API. Los datos no se tocan. La fila de settings creada por
# Directus en directus_extensions queda inerte hasta una reinstalacion.
set -euo pipefail

cd "$(dirname "$0")/.."

CONTAINER="moviles-api"
DEST="/directus/extensions/vexora-rls"
API="http://localhost:8000"
PW="${VEXORA_PW:-}"

echo "== Eliminando extension del volumen =="
MSYS_NO_PATHCONV=1 docker exec -u 0 "$CONTAINER" rm -rf "$DEST"

echo "== Reiniciando ${CONTAINER} =="
docker restart "$CONTAINER" >/dev/null

for _ in $(seq 1 60); do
  if [ "$(curl -g -sS -o /dev/null -w '%{http_code}' "${API}/server/ping" 2>/dev/null)" = "200" ]; then
    echo "OK: API saludable."
    break
  fi
  sleep 1
done

[ "$(curl -g -sS -o /dev/null -w '%{http_code}' "${API}/server/ping" 2>/dev/null)" = "200" ] || { echo "ERROR: el API no responde" >&2; exit 1; }

if [ -n "$PW" ]; then
  TOKEN="$(curl -g -fsS -X POST "${API}/auth/login" -H 'Content-Type: application/json' \
    -d "{\"email\":\"client@vexora.dev\",\"password\":\"$PW\"}" | node -e \
    'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).data.access_token)}catch(e){console.log("")}})')"
  if [ -n "$TOKEN" ]; then
    N="$(curl -g -sS -H "Authorization: Bearer $TOKEN" "${API}/users?aggregate[count]=*&limit=-1" | node -e \
      'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).data[0].count)}catch(e){console.log("ERR")}})')"
    echo "usuarios visibles para client tras rollback: ${N} (esperado 5)"
  fi
fi

echo "Rollback completado. Recuerde: S2/S3 vuelven a estar expuestas."
