#!/usr/bin/env bash
# Instala la extension local vexora-rls en el volumen de Directus y verifica
# que el aislamiento este activo. Si la verificacion falla, restaura el estado
# anterior (elimina la carpeta y reinicia) para no dejar el API sin proteccion.
#
# Uso:
#   VEXORA_PW=<clave roles> VEXORA_ADMIN_PW=<clave admin> bash seguridad/instalar-extension.sh
set -euo pipefail

cd "$(dirname "$0")/.."

CONTAINER="moviles-api"
EXT_NAME="vexora-rls"
SRC="directus/extensions/${EXT_NAME}"
DEST="/directus/extensions/${EXT_NAME}"
API="http://localhost:8000"
PW="${VEXORA_PW:-}"
APW="${VEXORA_ADMIN_PW:-}"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

echo "== Preflight =="
[ -f "${SRC}/index.js" ] || fail "no existe ${SRC}/index.js"
[ -f "${SRC}/package.json" ] || fail "no existe ${SRC}/package.json"
docker inspect -f '{{.State.Running}}' "$CONTAINER" | grep -q true || fail "${CONTAINER} no esta en ejecucion"

wait_health() {
  # /server/ping es publico; /server/health exige token de administrador.
  for _ in $(seq 1 60); do
    if [ "$(curl -g -sS -o /dev/null -w '%{http_code}' "${API}/server/ping" 2>/dev/null)" = "200" ]; then
      return 0
    fi
    sleep 1
  done
  return 1
}

# -g desactiva el globbing de curl (los corchetes de los parametros).
login() {
  curl -g -fsS -X POST "${API}/auth/login" -H 'Content-Type: application/json' \
    -d "{\"email\":\"$1\",\"password\":\"$2\"}" | node -e \
    'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).data.access_token)}catch(e){console.log("")}})'
}

count_users() {
  curl -g -sS -H "Authorization: Bearer $1" "${API}/users?aggregate[count]=*&limit=-1" 2>/dev/null | node -e \
    'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).data[0].count)}catch(e){console.log("ERR")}})'
}

restore() {
  echo "== Restaurando estado anterior ==" >&2
  # Los archivos copiados pertenecen a root; se eliminan como root.
  MSYS_NO_PATHCONV=1 docker exec -u 0 "$CONTAINER" rm -rf "$DEST" || true
  docker restart "$CONTAINER" >/dev/null || true
  wait_health || true
}

echo "== Copiando extension al volumen =="
MSYS_NO_PATHCONV=1 docker cp "${SRC}" "${CONTAINER}:/directus/extensions/"
MSYS_NO_PATHCONV=1 docker exec -u 0 "$CONTAINER" chown -R node:node "$DEST"
MSYS_NO_PATHCONV=1 docker exec "$CONTAINER" test -f "${DEST}/index.js" || { restore; fail "copia incompleta"; }

echo "== Reiniciando ${CONTAINER} =="
docker restart "$CONTAINER" >/dev/null

if ! wait_health; then
  docker logs --tail 40 "$CONTAINER" >&2 || true
  restore
  fail "el API no respondio tras el reinicio"
fi

# El hook debe haberse cargado; si no, no hay proteccion real.
# Se evita `docker logs | grep -q` porque con pipefail el SIGPIPE de grep
# hace fallar la tuberia aunque la linea exista.
STARTUP_LOG="$(docker logs --since 3m "$CONTAINER" 2>&1 || true)"
case "$STARTUP_LOG" in
  *"Loaded extensions:"*"${EXT_NAME}"*) ;;
  *)
    printf '%s\n' "$STARTUP_LOG" | tail -40 >&2
    restore
    fail "${EXT_NAME} no aparece como extension cargada"
    ;;
esac

echo "== Verificando aislamiento =="

if [ -z "$PW" ] || [ -z "$APW" ]; then
  echo "AVISO: VEXORA_PW / VEXORA_ADMIN_PW no definidos; se omite la prueba de humo."
  echo "Instalacion copiada. Verifique con: node seguridad/verify.js"
  exit 0
fi

ADMIN_TOKEN="$(login 'admin@vexora.dev' "$APW")"
CLIENT_TOKEN="$(login 'client@vexora.dev' "$PW")"
ASSISTANT_TOKEN="$(login 'assistant@vexora.dev' "$PW")"

[ -n "$ADMIN_TOKEN" ] || { restore; fail "login admin fallido"; }

ADMIN_USERS="$(count_users "$ADMIN_TOKEN")"
CLIENT_USERS="$(count_users "$CLIENT_TOKEN")"
ASSISTANT_USERS="$(count_users "$ASSISTANT_TOKEN")"

echo "usuarios visibles: admin=${ADMIN_USERS} client=${CLIENT_USERS} assistant=${ASSISTANT_USERS}"

if [ "$ADMIN_USERS" != "5" ] || [ "$CLIENT_USERS" != "1" ] || [ "$ASSISTANT_USERS" != "5" ]; then
  restore
  fail "el aislamiento no quedo activo (admin=5 client=1 assistant=5 esperados)"
fi

echo "OK: vexora-rls activo (client ve 1 usuario, admin y assistant conservan 5)."
