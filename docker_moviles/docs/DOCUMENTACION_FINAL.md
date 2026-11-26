# VEXORA — Documentación final

Sistema de gestión de talleres mecánicos. Frontend Ionic/Angular, backend Directus 12.6.0 sobre MariaDB, orquestado con Docker Compose.

> Documento generado en el cierre funcional. No sustituye a `README.md` ni a `ESTADO_VEXORA.md`; los complementa.

---

## 1. Arquitectura

```
Navegador
   │  (HTTP/JSON)
   ├──► Frontend Ionic/Angular  ·  contenedor moviles-ionic  ·  http://localhost:8100
   │
   └──► API Directus 12.6.0     ·  contenedor moviles-api    ·  http://localhost:8000
             │
             └──► MariaDB 11.8  ·  contenedor moviles-db     ·  base `workshop` (red interna)

Servicios auxiliares: moviles-swagger (:8081) y moviles-cloudbeaver (:8978).
```

El frontend habla **directamente** con Directus usando el token de sesión (`Authorization: Bearer …`). No existe capa intermedia propia: las reglas de acceso dependen de las políticas de Directus y de los filtros que envía el cliente.

### Tecnologías

| Capa | Tecnología |
|---|---|
| UI | Ionic 8 + Angular (standalone modules por página), SCSS |
| Estado/servicios | RxJS `Observable` + `axios`, un servicio por colección en `src/app/services` |
| Backend | Directus 12.6.0 (REST `/items`, `/users`, `/auth`, `/permissions`) |
| Base de datos | MariaDB, esquema `workshop`, claves foráneas reales |
| Contenedores | Docker Compose (`docker_moviles/docker-compose.yml`) |
| Build | Angular CLI, configuración `production` |

### Estructura relevante

```
docker_moviles/
├── docker-compose.yml
├── mobile/src/app/
│   ├── constants/            # VIEW_ACCESS (rutas por rol) y ROLE_ACTIONS (acciones por rol)
│   ├── guard/                # auth-guard + guard de vista por rol
│   ├── services/<colección>  # acceso a Directus (list/detail/create/update/delete/total)
│   ├── components/           # toolbar, searchbar, pagination compartidos
│   ├── pages/<módulo>/       # list / detail / form
│   └── tabs/                 # tab bar dinámica según rol
├── directus/extensions/vexora-rls/  # extension local: aislamiento por fila S2 y /users S3 (sin licencia)
├── seguridad/                # respaldo de permisos, scripts S1, instalacion/rollback de la extension
└── pruebas/                  # E2E reversible (PRU-TEST-CIERRE) + suite de seguridad S2/S3
```

---

## 2. Roles y distribución funcional

| Rol | Pestañas / acceso | Menú administrativo |
|---|---|---|
| **Administrator** | Órdenes, Citas, Vehículos, Pagos, Perfil | Catálogos (Colores, Marcas, Modelos, Combustibles, Refacciones, Servicios, Métodos de pago), Diagnóstico, Evidencias, Usuarios, Historial, Cotizaciones |
| **client** | Órdenes, Citas, Vehículos, Pagos, Perfil | No |
| **mechanic** | Órdenes, Perfil | No (accede a diagnóstico/evidencia desde el detalle de su orden) |
| **assistant** | Órdenes, Perfil | No (diagnóstico/evidencia desde el detalle) |

`VIEW_ACCESS` (páginas) y `ROLE_ACTIONS` (botones) son la fuente de verdad del frontend; `directus_permissions` es la del backend.

### Matriz de acciones por rol (frontend)

| Acción | Administrator | client | mechanic | assistant |
|---|---|---|---|---|
| Citas: crear / editar | — (solo confirmar) | ✔ | — | — |
| Citas: confirmar | ✔ | — | — | — |
| Citas: cancelar | ✔ | ✔ | — | — |
| Órdenes: crear | ✔ | — | — | — |
| Órdenes: editar | ✔ | — | ✔ | — |
| Diagnóstico / evidencia | ✔ | — | ✔ | ✔ |
| Cotización: crear | ✔ | — | ✔ | — |
| Cotización: aprobar / rechazar | — | ✔ | — | — |
| Vehículos: crear / editar | — | ✔ | — | — |
| Pagos: registrar | — | ✔ | — | — |
| Usuarios / catálogos | ✔ | — | — | — |
| Perfil: editar / contraseña | ✔ | ✔ | ✔ | ✔ |

### Matriz de permisos Directus (estado actual)

Todas las filas tienen `permissions = NULL` (sin filtro por fila) porque la instancia es **Core** y `custom_permission_rules_enabled = false`. Las lecturas públicas se retiraron (S1).

| Colección | Público | client | mechanic | assistant |
|---|---|---|---|---|
| vehicles | — | read, create, update | read | read |
| appointments | — | read, create, update | — | — |
| workorders | — | read | read, update | read |
| payment | — | read, create | — | — |
| quotes | — | read, update | read, create, update | read |
| quoteitems / quoteparts | — | read, update | read, create, update | read |
| diagnoses | — | read | read, create, update | read, create, update |
| evidence | — | read | read, create, update | read, create, update |
| history | — | read | read | read |
| brands / models / colors / fuels / methods / parts / services / status | — | read | read | read |
| directus_users (`/users`) | — | read | read | read |
| directus_permissions / policies | — | read | read | read |

Administrator usa la política con `admin_access = 1` (sin restricciones).

> **Limitación conocida:** al no haber filtros por fila, el aislamiento por registro depende de los filtros que envía el frontend, no del backend. Ver §9.

---

## 3. Módulos (18)

| # | Módulo | Ruta | Colección | Alcance |
|---|---|---|---|---|
| 1 | Login / registro | `/login`, `/register` | `auth`, `users/register` | Todos |
| 2 | Perfil | `/profile` | `users/me` | Todos |
| 3 | Usuarios | `/users/*` | `/users` | Administrator |
| 4 | Marcas | `/brands/*` | `brands` | Administrator |
| 5 | Modelos | `/models/*` | `models` | Administrator |
| 6 | Colores | `/colors/*` | `colors` | Administrator |
| 7 | Combustibles | `/fuels/*` | `fuels` | Administrator |
| 8 | Métodos de pago | `/methods/*` | `methods` | Administrator |
| 9 | Servicios | `/services/*` | `services` | Administrator |
| 10 | Refacciones | `/parts/*` | `parts` | Administrator |
| 11 | Vehículos | `/vehicles/*` | `vehicles` | Administrator, client |
| 12 | Citas | `/appointments/*` | `appointments` | Administrator, client |
| 13 | Órdenes | `/workorders/*` | `workorders` | Todos |
| 14 | Cotizaciones | `/quotes/*` | `quotes`, `quoteitems`, `quoteparts` | Administrator (lista), detalle todos |
| 15 | Diagnósticos | `/diagnoses/*` | `diagnoses` | Administrator (lista), alta desde orden |
| 16 | Evidencias | `/evidences/*` | `evidence` | Administrator (lista), alta desde orden |
| 17 | Historial | `/history/*` | `history` | Administrator |
| 18 | Pagos | `/payment/*` | `payment` | Administrator, client |

### Relaciones (claves foráneas reales)

```
vehicles.user_id        → directus_users.id      vehicles.model_id   → models.id
vehicles.fuel_id        → fuels.id               vehicles.color_id   → colors.id
appointments.vehicle_id → vehicles.id            appointments.status_id → status.id
workorders.vehicle_id   → vehicles.id            workorders.mechanic_id → directus_users.id
workorders.status_id    → status.id
quotes.workorder_id     → workorders.id          quotes.user_id      → directus_users.id
quoteitems.quote_id     → quotes.id              quoteitems.service_id → services.id
quoteparts.quote_id     → quotes.id              quoteparts.part_id  → parts.id
diagnoses.workorder_id  → workorders.id
evidence.workorder_id   → workorders.id
history.workorder_id    → workorders.id          history.vehicle_id  → vehicles.id
payment.quote_id        → quotes.id              payment.user_id     → directus_users.id
payment.method_id       → methods.id
directus_users.role     → directus_roles.id
```

### Estados

`workorders.status_id`: 4 Recibida · 5 Diagnóstico · 6 Reparación · 7 Lista · 8 Entregada
`appointments.status_id`: 1 Pendiente · 2 Confirmada · 3 Cancelada
`quotes.status_id`: 9 Pendiente · 10 Aprobada · 11 Rechazada

---

## 4. Flujos de negocio

1. **Alta de vehículo (client)** → `POST /items/vehicles` con `user_id` del propio cliente. Editable por su dueño.
2. **Cita (client)** → `POST /items/appointments` con `status_id = 1`. Editable/cancelable solo mientras está pendiente.
3. **Confirmar cita (Administrator)** → el modal pide mecánico y kilometraje: crea la orden (`status_id = 4`) y luego marca la cita como `2`. Si la orden falla, no se confirma la cita.
4. **Orden** → el mecánico asignado actualiza el estado (4→5→6→7→8).
5. **Cotización (mechanic)** → `quotes` con `status_id = 9` + conceptos en `quoteitems` / `quoteparts`; totales = subtotal + 16 % IVA.
6. **Aprobación (client)** → marca conceptos (`is_approved`), recalcula totales y cambia la cotización a `10`; redirige al formulario de pago. Rechazo → `11`.
7. **Pago (client)** → solo si la cotización está aprobada; `amount` = total de la cotización; luego detalle del pago.
8. **Diagnóstico (mechanic/assistant)** → `POST /items/diagnoses` vinculado a la orden.
9. **Evidencia** → `POST /files` (multipart, `directus_files`) y después `POST /items/evidence` con `path` (UUID del archivo), `format` y `size`; el detalle la muestra con `GET /assets/{uuid}` autenticado.
10. **Historial** → colección `history` (vacía en el entorno actual).

---

## 5. Endpoints relevantes

| Uso | Endpoint |
|---|---|
| Login / refresh / logout | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Perfil y permisos | `GET /users/me`, `GET /permissions/me` |
| Colecciones | `GET/POST /items/<colección>`, `GET/PATCH/DELETE /items/<colección>/<id>` |
| Agregados (contadores) | `GET /items/<colección>?aggregate[count]=*` |
| Búsqueda | `GET /items/<colección>?filter={"…":"_icontains"}` (un único parámetro `filter`) |
| Usuarios (gestión) | `GET /users`, `POST /users`, `PATCH /users/<id>` |

Convención importante: el filtro de rol y el de búsqueda viajan **juntos** en un solo `filter` con `_and`; Directus descarta la búsqueda si llega además por query string.

---

## 6. Ejecución

Requisitos: Docker Desktop con Compose.

```bash
cd docker_moviles
docker compose up -d          # levanta db, api, frontend, swagger y cloudbeaver
```

- Frontend: http://localhost:8100
- API Directus: http://localhost:8000
- Swagger: http://localhost:8081 · CloudBeaver: http://localhost:8978

Credenciales y secretos viven en el `.env` del proyecto (no versionado aquí). El correo del administrador se define con `DIRECTUS_ADMIN_EMAIL`.

Compilación de producción:

```bash
docker exec -w /app moviles-ionic ./node_modules/.bin/ng build --configuration production
```

---

## 7. Pruebas realizadas

| Prueba | Cómo | Resultado |
|---|---|---|
| Buscadores (10) — API | peticiones con los mismos filtros de la app | exacto, parcial, mayúsculas, sin resultados y limpieza correctos |
| Buscadores — interfaz (10/10) | navegador real, navegación SPA: Marcas `toy`→1; Órdenes `reparacion`→1; Citas `PRU-2026-A`→1 y `zzzz`→vacío; Colores `roj`→Rojo (10→1→10); Modelos `coro`→Corolla; Refacciones `filtro`→3 (10→3→10); Servicios `aceite`→1 (10→1→10); Vehículos `PRU-2026`→3 (4→3→4); Métodos de pago `tarjeta`→2 (5→2→5); Cotizaciones `2`→2, `abc`→vacío (4→2→4) | correctos, contadores, estado vacío y limpieza sincronizados |
| Carga real de evidencias | `POST /files` (multipart) → `POST /items/evidence` → `GET /assets/{id}` con token | 200, `image/png`, archivo presente en el volumen `directus_uploads`; anónimo 403 y `client` 200; limpieza total verificada |
| Rutas restringidas por rol | acceso directo por URL en las 4 cuentas | Administrator: todas 200; client/mechanic/assistant: redirección a `/forbidden` en cada módulo fuera de su matriz; pestañas propias accesibles |
| Permisos por rol | peticiones con token de cada cuenta | 200/403 según matriz; sin error 400/500 |
| Acceso anónimo | `GET` sin token a colecciones | 403 en todas (S1) |
| Flujo completo | `docker_moviles/pruebas/cierre-e2e.js` | **41 comprobaciones OK / 0 FAIL**, con limpieza y conteos idénticos antes/después |
| Consola del navegador | sesión completa de Administrator | sin errores; XHR 200 y preflight 204 |
| Build producción | `ng build --configuration production` | exit 0, hash `c0f166fd27aa3c08` |
| Validación final API (`seguridad/verify.js`) | 5 cuentas + anónimo, solo lecturas | anónimo 403 en todas las colecciones; admin 200 en 15 colecciones y `/users`; mechanic 403 en citas/pagos; conteos y búsquedas por rol coherentes; sin 500 |

La prueba E2E crea y elimina fixtures con prefijo `PRU-TEST-CIERRE` (marca, servicio, vehículo, cita, orden, diagnóstico, evidencia, cotización, ítems, pago) y verifica al final que todos los conteos vuelven a su valor inicial.

---

## 8. Instrucciones de uso rápido

1. Entrar con una cuenta existente (Administrator o los roles de prueba).
2. **Administrator**: menú lateral → Catálogos / Diagnóstico / Evidencias / Usuarios / Historial. Confirmar citas desde Citas con el botón correspondiente.
3. **client**: pestañas Órdenes, Citas, Vehículos, Pagos, Perfil. Aprobar/rechazar cotizaciones desde el detalle de la orden; pagar desde el detalle de la cotización aprobada.
4. **mechanic**: Órdenes → detalle → cambiar estado, añadir diagnóstico/evidencia, crear cotización.
5. **assistant**: Órdenes en curso → detalle → añadir diagnóstico/evidencia.
6. Cerrar sesión: botón de salida en la barra superior (una sola pulsación).

---

## 9. Limitaciones conocidas

1. **S2/S3 — CORREGIDAS sin licencia** con la extension local `vexora-rls` (ver §10). Residuales fuera de este turno: `/assets/:uuid` sigue dependiendo del permiso `directus_files`; `client` conserva lectura de `directus_permissions`, `directus_policies` y `directus_roles` (la necesita `/permissions/me`); MariaDB sigue accesible por CloudBeaver en `:8978` dentro del entorno local. Son cambios P2/licencia y no se abordaron.
2. **Evidencias — carga real IMPLEMENTADA.** El formulario sube el archivo a `directus_files` (multipart), crea el registro en `evidence` y el detalle lo muestra con `GET /assets/{uuid}` autenticado (blob + objectURL revocado al salir). Formatos JPEG/JPG/PNG/HEIC/HEIF, máximo 10 MB. El volumen `directus_uploads` ya existía en `docker-compose.yml`, por lo que no hubo cambio de infraestructura. `evidence.path` guarda el UUID del archivo: la colección no tiene columna para el nombre original, así que el nombre visible es el de la orden.
3. **Diagnósticos, evidencias e historial** están vacíos en el entorno actual; sus pantallas funcionan pero no hay datos reales que mostrar.
4. **Administrator sin nombre ni apellido** (`NULL`): requiere decisión de negocio; no se inventó información.
5. **Registros de prueba preexistentes** (`PRU-2026-A/B/C`, `PRU-T01`, marca `PRU-TEST MARCA EDIT`) se conservan: no se pudo demostrar que fueran desechables.
6. El registro público (`/users/register`) no se probó para no crear cuentas.

---

## 10. Seguridad — resumen

| ID | Descripción | Estado |
|---|---|---|
| S1 | Lectura anónima de vehículos, órdenes, citas y pagos | **CORREGIDA** (permisos públicos retirados, 403 verificado) |
| S2 | Sin filtros por fila (client/mechanic/assistant) | **CORREGIDA** con extension local `vexora-rls` (verificado: `prutest01` ve 0 vehículos, 0 órdenes, 0 citas, 0 cotizaciones y 0 pagos; un vehículo ajeno por ID responde 403) |
| S3 | `client` puede listar usuarios | **CORREGIDA** (`GET /users` de client → 1 fila, solo su correo; `fields=*` sin `token`, `tfa_secret` ni `auth_data`; ficha ajena por ID → 403) |

### S2/S3: extension local `vexora-rls` (sin licencia)

- **Mecanismo:** hook in-process de Directus (`docker_moviles/directus/extensions/vexora-rls/`) que inyecta el filtro obligatorio en `items.query` y `users.query` antes de construir la consulta SQL. Cubre REST, GraphQL, filtros manipulados, agregaciones y consultas masivas. El filtro del cliente se combina con `_and`, por lo que no puede eliminar ni reemplazar el obligatorio (un filtro no reconocible se rechaza con 403).
- **Filtros:** client → `vehicles.user_id`, y por cadena `appointments/workorders → vehicles`, `quotes → workorders`, `quoteitems/quoteparts/payment → quotes`, `diagnoses/evidence/history → workorders`; mechanic → `workorders.mechanic_id` (y `vehicles` solo los de sus órdenes); assistant y Administrator sin filtros. `directus_users` para client → `{id: {_eq: usuario}}`.
- **Escrituras:** se validan `items.create/update/delete` y `users.update/delete` contra la BD (claves individuales y masivas). client solo escribe sobre su propia cadena vehículo→orden→cotización→pago y no puede transferir un vehículo; mechanic solo sobre sus órdenes/cotizaciones y no puede reasignarlas. assistant y Administrator no se restringen.
- **Saneo de campos:** client nunca recibe correo ni datos privados de otros usuarios: `users.*` se limita a una lista blanca y las expansiones `mechanic_id.*`, `user_id.*`, `user_id.email`, etc. se recortan a `id, first_name, last_name` (y `role.id/name`).
- **Fallo seguro:** rol desconocido → 403; error interno del hook → 503. Nunca se ejecuta una consulta sin filtro.
- **Operacion:** `VEXORA_PW=... VEXORA_ADMIN_PW=... bash seguridad/instalar-extension.sh` copia la extension al volumen `vexora_directus_extensions`, reinicia solo `moviles-api`, comprueba la carga y el aislamiento, y revierte automaticamente si algo falla. `bash seguridad/rollback-extension.sh` la desactiva.
- **Pruebas:** `node pruebas/seguridad-s2s3.js` (166 comprobaciones: REST, GraphQL, filtros manipulados, agregados, masivas, fixtures de aislamiento entre clientes y entre mecanicos, `/users/me`, los 4 roles y snapshot de integridad).
- `seguridad/apply.js` y `rollback.js` (reglas por fila de Directus) quedan como referencia historica: requieren licencia y no se usan.

Respaldo y revision de permisos: `docker_moviles/seguridad/backup_permissions.json` (+ `backup_policies/access/roles.json`). Verificacion: `verify.js` (incluye ahora las comprobaciones S2/S3).
