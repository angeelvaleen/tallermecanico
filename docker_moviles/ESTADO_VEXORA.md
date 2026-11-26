# ESTADO_VEXORA.md — Estado compartido del proyecto

## Información general
- Proyecto: VEXORA
- Ruta: `C:\docker_moviles\docker_moviles\docker_moviles`
- Repositorio base: `angeelvaleen/tallermecanico`
- Commit original: `05294bf`
- Agentes: OpenCode y Freebuff.
- Responsable del último trabajo: Freebuff (turno 2026-11-19: extensión local `vexora-rls` para S2/S3; turnos anteriores: OpenCode 2026-11-17 con 5 requisitos del compañero, flujo Cotización→Aprobación→Pago y Fase D).

## Estado conocido

### Infraestructura
- Docker Compose: proyecto local `vexora`.
- MariaDB 11.8: funcionamiento reportado.
- Directus 12.6.0: funcionamiento reportado.
- Base de datos: `workshop`.
- Volúmenes nuevos: `vexora_*`.
- Volúmenes anteriores: conservar sin modificar.
- **Decisión actual:** conservación temporal del proyecto Docker `vexora` y sus volúmenes `vexora_*`. No se renombrarán ni eliminarán hasta nueva autorización.
- **Compatibilidad Compose con compañero:** pendiente de revisión antes de subir la rama. Los nombres `vexora_*` se conservan en el proyecto local para evitar conflictos con los volúmenes de datos.
- **Fase D (Ionic):** próximas pruebas funcionales de los cuatro roles (Administrator, mechanic, assistant, client) tras levantar el entorno.

### Directus
- 18 tablas de negocio reconstruidas, según informe de OpenCode.
- 24 relaciones reportadas como funcionales.
- Cuatro roles: Administrator, mechanic, assistant y client.
- 84 permisos importados, según informe.
- Catálogos iniciales cargados.
- Usuarios de prueba creados.
- Pruebas API: 25/25 aprobadas según OpenCode.
- El estado debe verificarse nuevamente antes de realizar modificaciones.

### Aplicación Ionic
- `localhost:8100`: aplicación iniciada y accesible (contenedor `moviles-ionic`, `ng serve` con recarga en vivo).

#### Pruebas de API (HTTP, `items/` de Directus) — ya realizadas
- `POST /auth/login` OK para assistant, client y mechanic (devuelve `access_token`).
- `GET /items/...` con token: vehicles ✅, quotes ✅, workorders ✅; payment ⚠️ solo `client` (1 registro); assistant y mechanic reciben `FORBIDDEN`.
- Sin token: `GET /items/quotes` → `FORBIDDEN`.
- Roles Directus: Administrator (pendiente de credenciales), mechanic, assistant, client.

#### Pruebas de INTERFAZ (Ionic, navegador real) — Fase D
> Distinguir de las pruebas de API: aquí se verificó lo que el usuario ve y pulsa en `localhost:8100`.
- **Login UI:** funciona con los 3 roles. Tras iniciar sesión la app aterriza en `/workorders/list` (no en `/tabs/tab1`; ver Hallazgos).
- **Menú lateral ("Abrir menú"):** muestra SIEMPRE los 14 módulos a todos los roles (ver Hallazgos).
- **Assistant:** Citas/Órdenes/Vehiculos/Perfil no aplica (tabs legacy). Lista de Órdenes muestra 3 registros reales (#1,#2,#3 con km y estado). Detalle de Orden #1 con datos reales (vehículo PRU-2026-B, mecánico, estado, km, diagnóstico/evidencias vacíos, Cotización #1 "Aprobada"). Detalle de Cotización #1 abre (Estado "Aceptada", totales $0.00 por falta de ítems). Botones "Agregar" de Diagnósticos y Evidencias presentes y correctos (asistant tiene create en diagnoses/evidence). `/vehicles/list` → `/forbidden` (intencional, `VIEW_ACCESS.vehicles` = Administrator, client).
- **Client:** Lista de Vehículos ✅ con datos reales (PRU-2026-A/B/C, 3 registros) y botón "Nuevo vehiculo" + editar por fila. Lista de Pagos ✅ (Monto $1000.00, 1 registro). Lista de Citas ✅ (4 citas, "Confirmada") y botón "Nueva cita". Detalle de Orden #2: SIN botones "Agregar" (correcto). Detalle de Cotización #4 (Pendiente): botones "Aprobar cotización" y "Rechazar cotización" presentes (correcto, `ROLE_ACTIONS.quotes.approve/reject` = client). Las listas filtran por el cliente (`filter[vehicle_id][user_id][id][_eq]=...`), NO acceso total.
- **Mechanic:** Lista de Órdenes ✅ (filtrada por su `mechanic_id`, 3 registros reales) con botón editar. Detalle de Orden #2: botones "Agregar" en Diagnósticos/Evidencias, SIN botón "Nueva" cotización porque existe la Cotización #4 "Pendiente" (mensaje explicativo mostrado al mecánico). Modal "Nuevo Diagnóstico" abre correctamente con la orden precargada (no se guardó). `/vehicles/list` y `/payment/list` → `/forbidden` (intencional).
- **Logs de red de las pruebas UI:** todas las peticiones XHR del cliente y del mecánico devolvieron **200** (login, permissions/me, users/me, listas filtradas, detalle, diagnoses, evidence, quotes, quoteitems, quoteparts). Sin 403/500 inesperados.
- **Administrator:** Pendiente (requiere credenciales que proporcionará el usuario).

#### Hallazgos y diferencias permisos ↔ interfaz
1. **Menú lateral estático:** `src/app/app.component.ts` define `links` con los 14 módulos y no filtra por rol. Cualquier rol ve todos los enlaces; los no permitidos terminan en `/forbidden` por `VIEW_ACCESS`. Es "navegación original"; queda documentado, NO se modificó.
2. **Barra de pestañas legacy:** `src/app/tabs/tabs.page.html` muestra Citas/Ordenes/Vehiculos/Perfil fijas, sin condición de rol, y la página `/tabs/tab1` ya no es alcanzable desde login ni menú (el login redirige a `/workorders/list`). Queda documentado, NO se modificó.
3. **Corregido (frontend confirmado):** el aviso "Cuando sea aprobada o rechazada podrás crear otra cotización" se mostraba a roles que nunca crean cotizaciones (cliente, administrador). En `pages/workorders/detail/detail.page.html` el `*ngIf` pasó de `!canCreateQuote()` a `canAddQuote && !canCreateQuote()`. Verificado: el cliente ya no lo ve; el mecánico sigue viéndolo; compilación OK.
4. **Cosmético (no corregido):** typos en el menú: "Coutas" (debería Cotizaciones), "Vehiculos", "Metodos", "Diagnosticos" sin tilde.
5. **Menor (no corregido):** `console.log(this.workorder)` de depuración en `pages/workorders/detail/detail.page.ts` (ensucia la consola; no es error).
6. **403 de Pagos en assistant/mechanic:** confirmado como restricción intencional (`VIEW_ACCESS.payment` = Administrator, client), no bug.

#### Cambio de código aplicado (CONSERVAR — aprobado por el usuario)
- **Archivo modificado:** `docker_moviles/mobile/src/app/pages/workorders/detail/detail.page.html` (línea ~395).
- **Cambio:** `*ngIf="!canCreateQuote()"` → `*ngIf="canAddQuote && !canCreateQuote()"` en el aviso de "cotización pendiente".
- **Resultado de compilación** (`docker logs vexora-ionic`): `Build at: 2026-11-16T15:40:11.051Z - Hash: 9ca231a56c6e7968 - Time: 5501ms` → `✔ Compiled successfully.`
- **Verificación funcional:** el cliente ya no ve el aviso; el mecánico sí lo sigue viendo. Sin regresión.

#### NO probado aún — requiere escritura real
- **Formularios CRUD:** se abrieron/verificaron visualmente (modal "Nuevo Diagnóstico", "Nuevo vehiculo", "Nueva cita"), pero **no se guardó ni modificó ningún registro**. Falta alta/edición/borrado reales.
- **Flujo Cotización → Aprobación → Pago → Detalle:** los botones se verificaron presentes ("Aprobar/Rechazar cotización" al cliente), pero **no se ejecutó el flujo con escritura** (crear cotización, aprobar, generar pago, ver detalle).
- **Administrator:** login e interfaz sin probar (faltan credenciales; no buscarlas ni adivinarlas).

- **Notas de comportamiento:** tras login → `/workorders/list`. La sesión vive solo en memoria (no hay localStorage/sessionStorage); recargar la página obliga a iniciar sesión de nuevo. `authGuard` valida sesión + rol + permisos Directus; vistas no permitidas → `/forbidden`.

### Git y Docker
- El repositorio original se clonó desde GitHub.
- OpenCode modificó la configuración Docker para aislar la instalación nueva.
- Los cambios locales actuales deben consultarse mediante `git status` y `git diff`.
- Existe una tarea pendiente sobre compatibilidad de nombres Docker para compartir cambios con el compañero.
- No renombrar ni migrar los volúmenes actuales sin autorización.

## Tarea en curso

**Fase D: validación funcional de Ionic y los cuatro roles.**

### Turno OpenCode (2026-11-16, después del turno de Freebuff)

Responsable: OpenCode. Respaldo pre-escritura: `C:\Users\valen\AppData\Local\Temp\opencode\vexora_backup_prewrites.sql` (209 KB, dump `mariadb-dump` de `workshop` con las 18 tablas + sistema Directus, verificado por `docker cp`).

**Registros PRU-TEST creados (autorizados, ninguno anterior modificado):**
- Vehículo **id=6** `PRU-T01` (vin `PRUTESTVIN0000001`, año 2024, km 12500 tras edición, del client, model/fuel/color 1).
- Cita **id=5** (vehículo 6, 2026-11-27 09:30, motivo `PRU-TEST flujo cotizacion v2`).
- Orden de trabajo **id=4** (vehículo 6, mecánico Mateo, estado 4 "Recibida", km 48000, creada al confirmar la cita #5 desde la UI como Administrator).
- Cotización **id=5** (orden 4, mecánico, estado 10 "Aceptada", subtotal 2380.00, impuesto 380.80, total 2760.80, vigencia 2026-12-31).
  - quoteitems **id=2**: servicio 4 "Frenos delanteros", precio 1800, descuento 10%, importe 1620, `is_approved=1`.
  - quoteparts **id=2**: refacción 4 "Balatas delanteras", cantidad 2, precio 380, importe 760, aprobada.
- Marca **id=12** `PRU-TEST MARCA EDIT` (creada como `PRU-TEST MARCA` y editada desde la UI como Administrator).

**Flujo A completo aprobado (todo desde la UI Ionic, sesiones reales):**
1. Client crea vehículo `PRU-T01` ✅ (POST 200; validación de placa máx. 10 chars funcionó).
2. Client crea cita ✅ (POST 200, select con su vehículo nuevo).
3. Administrator confirma la cita ("Confirmar y crear orden", mecánico + km) ✅ → cita #5 Confirmada + orden #4 creada.
4. Mechanic crea cotización sobre la orden #4 (modal "Nueva cotización" con orden preasignada, servicio con precio del catálogo, refacción con cantidad, totales calculados: descuento = porcentaje, impuesto 16%) ✅ (POST /items/quotes 200 + items).
5. Client ve la cotización en el detalle de la orden, abre `/quotes/detail/5`, marca los `ion-toggle` de servicios/refacciones y aprueba ✅ (PATCH quotes/5 + PATCH items; estado → "Aceptada"; los botones de aprobar/rechazar desaparecen).
6. Tras aprobar la app navega a `/payment/form?quoteId=5`; client registra pago simulado (método 4 Transferencia, referencia `PRU-TEST-PAGO-01`, confirmación previa "¿Desea registrar el pago por $2760.80?") ✅ (POST /items/payment 200).
7. Client verifica `/payment/detail/2` ✅: monto $2760.80, método, referencia, fecha, "Registrado por: Carla Cliente", cotización #5 y orden #4 con totales correctos.

**Pruebas adicionales aprobadas en este turno:**
- Guards: assistant → `/appointments/list` y `/appointments/detail/5` → `/forbidden` (intencional); mechanic sin acceso a citas → `/forbidden`. Al loguear desde `returnUrl` prohibido aterriza en `/forbidden` (correcto).
- Client NO ve "Confirmar cita" en su cita (ROLE_ACTIONS.accept = solo Administrator) pero sí "Editar cita"/"Cancelar cita" ✅.
- Client edita cita #5 (motivo v2) ✅ PATCH 200.
- Administrator crea marca (POST 200) y la edita (PATCH 200, BD `PRU-TEST MARCA EDIT` id=12) ✅.
- Mecánico ve en el detalle de la orden #4 la Cotización #5 con el aviso corregido por Freebuff ("Existe una cotización pendiente..."), y el client ya no lo ve ✅ (conserva la corrección).

**Bug real corregido en este turno (1):**
- **Error original:** editar un vehículo → `PATCH /items/vehicles/:id → 400` ("No fue posible guardar el vehículo"). Reproducido en UI con el client.
- **Causa:** en `mobile/src/app/pages/vehicles/form/form.page.ts` el control `model_id` nace `disabled`; en modo creación `onBrandChange()` lo habilita, pero en modo edición `loadVehicle()` hacía `patchValue` sin habilitarlo → `form.value` omite controles disabled → `Number(undefined)` = `NaN` → JSON `null` → Directus valida `nnull` y rechaza.
- **Fix mínimo:** en `loadVehicle()`, tras `patchValue` + `filterModels()`, habilitar/deshabilitar `model_id` con la misma lógica de `onBrandChange()`. Sin cambios de diseño ni de reglas.
- **Re-verificación:** compilación ✔ (hash `ede11a80a67abcf9`), re-prueba UI → PATCH 200, toast "Vehículo actualizado", BD km=12500.

**Hallazgos nuevos (documentados, NO corregidos):**
7. **Botón Vehículos del tab bar roto:** `tabs.page.html` define `tab="tab3"` con `href="/vehicles/list"`; al pulsar aterriza en `/tabs/tab3` (página starter "Tab 3", no Vehículos). El item "Vehiculos" del menú lateral SÍ funciona (`/vehicles/list`). Reproducible. Requiere decisión del usuario (cambio de código UI).
8. **"Volver al inicio" en `/forbidden` hace `location.back()`** → regresa a la página que causó el 403 y vuelve a `/forbidden` (bucle). Documentado; no corregido.
9. **Cosmético:** contador de registros desactualizado tras crear/editar desde modal ("Página 1 de 1 · 3 registros" con 4 filas; se corrige al re-navegar). Igual: listas/detalles no refrescan tras guardar (se ve el dato viejo hasta re-entrar).
10. **Nota de comportamiento:** el detalle de marca en modo edición abre con input vacío unos instantes (la carga es async); el valor sí aparece. No es bug.

**Sin commit ni push.** El cambio de Freebuff en `detail.page.html` sigue intacto.

Pendiente para el siguiente agente (Freebuff):
1. **Administrator:** completar CRUD del resto de catálogos (Modelos, Colores, Combustibles, Servicios, Refacciones, Métodos) y Usuarios — login admin ya disponible vía el usuario (no guardar la contraseña en archivos).
2. Decidir con el usuario: fix del botón "Vehiculos" del tab bar (hallazgo 7) y del "Volver al inicio" en `/forbidden` (hallazgo 8).
3. Diagnósticos y evidencias: crearlos sobre la orden #4 (PRU-TEST) como mechanic/assistant (no se probaron porque requieren escritura en una orden; usar la #4, no la #3).
4. Compilación de producción Angular + revisión de compatibilidad Compose para subir la rama.
5. Retomar el `ESTADO_VEXORA.md` de esta sección.

Reglas generales del turno:
- Leer ambos documentos (AGENTS.md y ESTADO_VEXORA.md) antes de actuar.
- Inspeccionar el estado real del proyecto; confirmar qué hizo el agente anterior.
- Continuar la Fase D sin reconstruir Directus.
- No modificar menús, pestañas ni diseño visual; no tocar Docker/volúmenes/permisos sin autorización.
- Sin commit ni push.

### Turno OpenCode (2026-11-17): 5 requisitos funcionales del compañero

Responsable: OpenCode. Autorización explícita del usuario para: (a) implementar los 5 requisitos, (b) un permiso mínimo de self-update en Directus (al final NO aplicable, ver abajo), (c) probar desde la UI los 4 roles.

**1) PERFIL — implementado, solo-lectura (limitación de licencia documentada):**
- `pages/profile/*`: muestra Nombre, Apellido, Correo y Rol de `GET /users/me`; nota visible explicando el modo solo-lectura; botón **"Gestionar usuarios" solo para Administrator** (→ `/users/list`).
- Probado en UI los 4 roles: admin (correo + "Administrator" + botón), client "Carla Cliente / client", mechanic "Mateo Mecánico / mechanic", assistant "Ana Asistente / assistant" ✅. Sin botón de usuarios para no-admin ✅.
- **Por qué solo-lectura (bloqueo real de licencia):** la API de Directus 12.6 rechaza crear permisos granulares (`custom_permission_rules_enabled` → `RESOURCE_RESTRICTED`, feature del paquete `@directus/license`). Se probaron inserciones directas en `directus_permissions` (respaldo previo ya existía): filas con `fields` != `*` o con regla custom (`{"id":{"_eq":"$CURRENT_USER"}}`) **son ignoradas por el runtime** (no aparecen en `/permissions`); una fila con `fields='*'` sin regla **sí se aplica**, pero permite al usuario cambiar SU PROPIO rol, correo y contraseña (probado: auto-escalado client→mechanic OK, cambio de contraseña propio OK — Directus NO bloquea el auto-cambio de rol). Riesgo inaceptable ⇒ se eliminaron las filas de prueba (ids 254-258) y quedó **0 permisos update de directus_users para no-admin** (estado original). Opciones futuras: licencia de Directus que habilite permisos granulares, o extensión/custom endpoint.
- Limpieza verificada: `client PATCH /users/me` → 403 de nuevo; rol del client restaurado a `client`, contraseña restaurada a la de prueba, `first_name` "Carla" (todo verificado).
- Nota operativa: se reinició `vexora-api` dos veces para invalidar la caché de permisos (sin tocar nombres/volúmenes). Mapeo REAL de políticas (corrige un dato anterior de este documento): **public=`abf8a154…`, client=`b809c4a1…`, mechanic=`7ac29d7a…`, assistant=`b90f5e38…`, Administrator (admin_access=1)=`a53eb0a1…`**.

**2) GESTIÓN DE USUARIOS (solo Administrator) — implementado y probado:**
- `AuthService` ampliado: `listUsersManaged()`, `listRoles()`, `getUser(id)`, `createUser()`, `updateUser()` (mismo estilo axios/`defer`+`map` existente).
- Páginas `pages/users/list|form|detail` implementadas siguiendo el patrón de brands (app-toolbar, listado con ion-item, form con FormBuilder/Validators/AlertController).
- Acceso: `VIEW_ACCESS.users` = solo Administrator; rutas `users/list|form|detail/:id` con `...viewRoute('users', …)` y `profile` con `...viewRoute('profile','detail')`.
- Probado en UI como admin: lista con los 5 usuarios (rol + estado) ✅; creación `prutest01@vexora.dev` "PRU Test Uno" rol client ✅ (BD id=`5583be99-890c-4f07-9f69-bfed02722e9a`, `status=active`); correo duplicado `client@vexora.dev` → alerta "Usuario duplicado" (pre-chequeo) y **no se creó nada** ✅; edición del apellido → "PRU Test Uno Editado" ✅ (PATCH 200, BD verificado); detalle con todos los campos ✅; la lista refresca al volver (`ionViewWillEnter`) ✅.
- Bug corregido: Ionic reutiliza la instancia de la página (`IonicRouteStrategy`) y al reabrir `users/form?id=…` no re-ejecutaba `ngOnInit` (abría en modo crear con valores viejos). Fix: suscripción a `queryParamMap` en `ngOnInit` + `applyParams()` que reconstruye el form según `?id=`.
- Protecciones verificadas: client/assistant en UI → `/users/list` redirige a `/forbidden` ✅; por API, POST y DELETE de usuarios como client → **403** ✅; `PATCH /users/me` como client/mechanic/assistant → **403** ✅. Los 4 usuarios de prueba originales NO fueron modificados ni eliminados; sin funcionalidad de borrado.
- Observación documentada (preexistente, NO corregida): los 3 roles no-admin pueden LEER `/users` y `/roles` por API (200, permiso read de la config original; lo usa el selector de mecánico). Las escrituras quedan exclusivamente para admin.

**3) TABS POR ROL — implementado y probado:**
- `tabs.page.ts` calcula las pestañas con `AuthService.getRole()`: Administrator/client = Órdenes, Citas, Vehículos, Pagos, Perfil; mechanic/assistant = Órdenes, Perfil. `tabs.page.html` renderiza `*ngFor`.
- `tabs-routing.module.ts`: rutas hijas reales `/tabs/workorders/list`, `/tabs/appointments/list`, `/tabs/vehicles/list`, `/tabs/payment/list`, `/tabs/profile` (lazy, mismas páginas existentes) **con guard** replicando `viewRoute` + `VIEW_ACCESS`.
- Probado: admin/client → 5 tabs y navegación OK a las 5 rutas ✅; mechanic/assistant → solo "Ordenes" y "Perfil" ✅. **Resuelve el hallazgo 7** (botón Vehículos roto a `/tabs/tab3`).

**4) MENÚ DESPLEGABLE EXCLUSIVO DEL ADMINISTRATOR — implementado y probado:**
- `app.component`: `ion-menu` con `*ngIf="isAdmin"`, `ion-accordion "Catálogos"` (Colores, Marcas, Modelos, Combustibles, Refacciones, Servicios, Métodos de pago) + **Diagnóstico** + **Evidencias**. No duplica las pestañas principales.
- `components/toolbar`: `ion-menu-button` con `*ngIf="isAdmin"`.
- Probado: admin abre el menú, contenido exacto (10 etiquetas, sin Órdenes/Citas/etc.) y clic "Marcas" → `/brands/list` ✅; client/mechanic/assistant → **ni `ion-menu-button` ni `ion-menu` en el DOM** ✅.
- Conservado (req. del compañero): assistant abre Orden #4 y ve los botones de Diagnóstico y Evidencias desde la orden ✅.

**5) SUBIDA Y VISUALIZACIÓN DE ARCHIVOS (OPCIONAL) — NO implementado, documentado:**
- Confirmado en UI: el botón "Seleccionar evidencia" del modal de evidencias llama `showPendingMessage()` → "La carga de imágenes se integrará con los archivos de Directus en el siguiente paso". No existe implementación funcional. Se priorizaron los requisitos obligatorios.

**Otros de este turno:**
- Compilación de producción Angular ✔ (final: hash `a0f0dc76f43909db`, sin errores). Compilaciones dev ✔ tras cada cambio.
- Hallazgo 8 (`/forbidden` con `location.back()` en bucle): sigue sin corregir (requiere decisión).
- Registros PRU-TEST nuevos: **usuario `prutest01@vexora.dev`** (única escritura de datos nueva; el resto fueron restaurados tras las pruebas de permisos).
- Sin commit ni push. La corrección de Freebuff en `workorders/detail/detail.page.html` y el fix de `vehicles/form/form.page.ts` siguen intactos.

Pendiente para el siguiente agente (Freebuff): *(obsoleto — resuelto en el turno III de 2026-11-17; ver sección "Turno OpenCode 2026-11-17 (III)": catálogos completos, /forbidden corregido, compatibilidad Compose verificada. Quedan: subida de archivos opcional, Perfil editable bloqueado por licencia, y commit/push pendiente de autorización)*

### Ajuste solicitado por el usuario (2026-11-17, mismo turno)

- **Perfil:** eliminado el aviso informativo inferior (`ion-note` de "solo lectura") de `pages/profile/profile.page.html`. Los campos Nombre/Apellido/Correo/Rol quedan intactos; sin cambios de lógica ni de permisos. Verificado en UI como client: el aviso ya no existe en el DOM y el perfil carga correctamente.
- **Corrección asociada (comportamiento real detectado al re-verificar):** el login sin `returnUrl` aterrizaba en `/workorders/list` (ruta raíz SIN tab bar), dejando a client/mechanic/assistant sin acceso visible a las demás pestañas. En `pages/login/login/login.page.ts` el destino por defecto pasó a `/tabs/workorders/list` (el comportamiento con `returnUrl` no cambia). Verificado: login como client → `/tabs/workorders/list` con las 5 tabs.
- Compilación de producción ✔ (hash `aaa4da76bb6cff87`). Sin commit ni push.

## Último estado
- Fuente: pruebas funcionales reales ejecutadas por OpenCode en este turno (navegador + API + BD), sobre el turno anterior (flujo Cotización→Aprobación→Pago y Fase D de Freebuff).
- **Los 5 requisitos del compañero están implementados y probados desde la UI con los 4 roles**, excepto: (5) subida de archivos — no implementada, documentada; y la edición de datos personales en Perfil — bloqueada por licencia de Directus (documentada con evidencia de por qué el permiso amplio es vulnerable).
- Compilación de producción ✔. Sin commit ni push. Registros de prueba: todos los PRU-TEST previos intactos + usuario `prutest01@vexora.dev`.
- Advertencia: los resultados reportados no sustituyen la verificación del entorno actual.
- Sin commit ni push. No se modificaron Docker Compose, volúmenes ni BD existentes (los permisos de prueba de Directus se eliminaron; estado de permisos = original).

---

# Turno OpenCode 2026-11-17 (III) — Catálogos completos, fix /forbidden, revisión integral

## 1) Los 6 catálogos restantes — implementados y probados (UI admin + BD + API)

Ciclo probado por catálogo: **listado → validación de campos obligatorios (modal vacío) → creación PRU-TEST → edición → verificación en BD → borrado seguro por API admin (solo registros PRU-TEST sin referencias) → restricción FK sobre un registro referenciado → validación server-side (POST vacío)**.

| Catálogo | Campos | Listado | Validación UI | Crear | Editar | Borrar (API) | FK referenciado | POST vacío (API) |
|---|---|---|---|---|---|---|---|---|
| Colores | nombre | ✔ (5/pág + buscador) | "El nombre es obligatorio." | ✔ "Color guardado" | ✔ BD | 204 ✔ | 500, no borra ✔ | 400 ✔ |
| Combustibles | nombre | ✔ (5/pág + buscador + paginación) | "El nombre es obligatorio." | ✔ "Combustible guardado" | ✔ BD | 204 ✔ | 500, no borra ✔ | 400 ✔ |
| Métodos de pago | nombre | ✔ (5/pág + buscador + paginación) | "El nombre es obligatorio." | ✔ "Método guardado" | ✔ BD | 204 ✔ | 500, no borra ✔ (referenciado por `payment`) | 400 ✔ |
| Servicios | nombre/precio/descripción | ✔ (+ buscador) | "El nombre es obligatorio." | ✔ "Servicio guardado" | ✔ BD (nombre+precio) | 204 ✔ | 500, no borra ✔ (referenciado por `quoteitems`) | 400 ✔ |
| Refacciones | nombre/precio/descripción | ✔ (+ buscador **corregido**) | "El nombre es requerido" | ✔ "Refacción guardada" | ✔ BD (nombre+precio) | 204 ✔ | 500, no borra ✔ (referenciado por `quoteparts`) | 400 ✔ |
| Modelos | marca (select) + nombre | ✔ (+ buscador) | "La marca es obligatoria." + "El nombre del modelo es obligatorio." | ✔ "Modelo guardado" (brand `PRU-TEST MARCA EDIT`) | ✔ BD (nombre, marca intacta) | 204 ✔ | 500, no borra ✔ (referenciado por `vehicles`) | 400 ✔ |

Notas:
- **El borrado NO está expuesto en la UI** (comportamiento original del repo; los servicios tienen `delete()` pero ninguna lista muestra botón). No se añadió: se probó por API admin como Administrador.
- La restricción FK responde **500** (error de foreign key de Directus/MariaDB), no 400, pero **nunca elimina el registro**. Verificado para todos los catálogos con FKs: `vehicles.color_id/fuel_id/model_id`, `quoteitems.service_id`, `quoteparts.part_id`, `payment.method_id`, `models.brand_id`.
- **Marcas no se repitió** (probada en turno anterior); su registro PRU-TEST (`PRU-TEST MARCA EDIT`, id 12) sigue intacto y se usó como marca del modelo de prueba.
- Todos los registros PRU-TEST de catálogos fueron **eliminados tras la prueba** (204) y verificados en BD: 0 residuos. No se tocó ningún registro existente.

## 2) Bug corregido: buscador de Refacciones (servicios/parts)

- **Error original (commit `05294bf`, presente en el repo):** `services/parts/parts.ts` → `const text = search.trim` sin paréntesis (los otros 15 servicios tienen `search.trim()`). `text` quedaba como función, `JSON.stringify` omitía la condición y el filtro se enviaba como `{"_or":[{"name":{}},{"description":{}}]}` → la búsqueda nunca filtraba (red verificado: peticiones con filtro vacío).
- **Fix mínimo:** `const text = search.trim();` (1 línea, mismo estilo del resto de servicios).
- **Verificado en UI:** buscar "PRU-TEST" en Refacciones → lista solo `PRU-TEST PART` ✔ (antes mostraba las 5 de la página 1).

## 3) Fix del bucle de /forbidden (hallazgo 8) — corregido y probado con los 4 roles

- **Antes:** `goHome()` hacía `location.back()` → volvía a la ruta prohibida (bucle).
- **Fix mínimo** en `pages/forbidden/forbidden.page.ts`: se inyecta `Router` (se quita `Location`, que quedaba sin uso) y `goHome()` navega a `/tabs/workorders/list` con `replaceUrl: true` — destino seguro común accesible por los 4 roles. No se quitaron guards ni se ampliaron permisos.
- **Probado con los 4 roles** (acceso directo por URL a `/colors/list` como client/mechanic/assistant → `/forbidden`; admin navegando a `/forbidden`):
  - client → "Volver al inicio" → `/tabs/workorders/list` con sus 5 tabs ✔
  - mechanic → igual, 2 tabs (Ordenes, Perfil) ✔
  - assistant → igual, 2 tabs (Ordenes, Perfil) ✔
  - Administrator → igual, 5 tabs ✔
  - Sin bucle; los no-admin **siguen sin poder entrar** a `/colors/list` (guard redirige a `/forbidden`).

## 4) Revisión integral por rol (esta turna; no se repitió el flujo cotización→pago)

- **Administrator:** 5 tabs ✔; menú solo-admin con acordeón Catálogos (7 items) + Diagnóstico + Evidencias ✔; los 6 catálogos CRUD probados (tabla arriba) ✔.
- **client:** 5 tabs ✔; acceso directo a `/colors/list` → `/forbidden` ✔; Perfil sin aviso (turno anterior) ✔; menú de catálogos no visible ✔ (verificado turno anterior).
- **mechanic / assistant:** 2 tabs (Ordenes, Perfil) ✔; `/colors/list` → `/forbidden` ✔; Diagnóstico/Evidencias desde la orden verificado turno anterior.
- Consola del navegador sin errores en todas las sesiones ✔.

## 5) Revisión técnica final

- Compilación dev ✔ tras cada cambio (docker `vexora-ionic`, sin errores TS/Angular/Ionic).
- Compilación de producción ✔ (hash final `0bc3f3d52a043675`).
- Contenedores: `vexora-db (healthy) / api / ionic / swagger / cloudbeaver` todos Up ✔.
- Compatibilidad Compose: `docker-compose.yml` sin cambios funcionales — proyecto `vexora`, servicios `db/api/mobile/cloudbeaver/swagger`, volúmenes nombrados `vexora_*`, red `vexora_net`, `.env` presente y válido (`docker compose config --services` OK). No se reconstruyó nada.
- `git status`: solo los archivos esperados (29 modificados de turnos previos + `forbidden.page.ts` y `services/parts/parts.ts` de este turno + untracked documentados). Sin cambios accidentales.
- Registros PRU-TEST conservados ✔: vehículo #6, cita #5, orden #4, cotización #5 (+quoteitems/quoteparts), pago #2, marca #12, usuario `prutest01@vexora.dev`. Residuos de catálogos: 0.

## Archivos modificados en este turno
1. `mobile/src/app/services/parts/parts.ts` — fix `search.trim()` (bug original del buscador).
2. `mobile/src/app/pages/forbidden/forbidden.page.ts` — `Router` → `/tabs/workorders/list` con `replaceUrl` (fix bucle).

## Pendientes reales
1. **Subida de archivos (opcional, req. 5):** ~~no implementada~~ **IMPLEMENTADA** (ver "Turno 2026-11-24 (III)" y Fase 5): el modal sube el archivo a `/files`, crea la fila en `evidence` y muestra miniaturas autenticadas.
2. **Perfil editable:** la instalación actual no aplica permisos granulares (las reglas custom quedan en `permissions: null`; evidencia previa `RESOURCE_RESTRICTED`). Alternativas seguras: mantener solo lectura, edición por Administrator en `/users/form`, o un endpoint propio en `vexora-rls` con whitelist de `first_name`/`last_name`. NO reintentar permisos amplios (auto-escalado demostrado). Requiere autorización.
3. **Commit/push:** pendiente de autorización del usuario (ronda de revisión primero).
4. Mensajes de validación de forms difieren levemente entre catálogos ("obligatorio." vs "requerido") — texto original del compañero, no se normalizó para no alterar su estilo.
5. Los formularios de edición muestran brevemente el valor vacío antes de cargar el `detail()` (cosmético, original); en pruebas funcionó siempre que se esperara la carga.

---

# Turno Freebuff 2026-11-17 (IV) — Auditoría final y cierre funcional

Responsable: Freebuff. Alcance: diagnóstico, corrección mínima si procedía, validación y documentación. **No se repitieron las pruebas funcionales ya aprobadas** y **no se modificó código de la aplicación** en este turno.

## 1) Diagnóstico (Etapa A)

- **Errores funcionales nuevos: ninguno.** Los pendientes reales siguen siendo los ya documentados (subida de archivos opcional, Perfil editable bloqueado por licencia, commit/push sin autorizar).
- **Cableado de módulos correcto:** las 20 carpetas de `pages/` tienen ruta; `app-routing` conserva sus rutas y `tabs-routing` replica los guards con `VIEW_ACCESS`. El array legado `links` ya no existe (sustituido por `catalogLinks`). Sin `Location` importado sin uso.
- **Servicios:** los 17 servicios tienen al menos 2 importadores; ninguno quedó huérfano (`quoteitems`/`quoteparts` se usan desde quotes).
- **Código muerto identificado (no eliminado):** `tab1/`, `tab2/`, `tab3/` son módulos starter sin ninguna referencia (las tabs reales están en `tabs/`). No se borran sin autorización.
- **Registro público:** el enlace "Crear cuenta" del login es alcanzable y `/users/register` está habilitado (responde 400 de validación a un payload inválido, no 403). Sin bug.
- **Cosmético/deuda ya documentada, no corregida:** contadores de paginación desactualizados tras guardar, `console.log` de depuración en varias páginas (estilo original), mensajes de validación con texto distinto entre catálogos.

## 2) Correcciones (Etapa B)

- **Ninguna necesaria.** No se encontró un error funcional confirmado que justificara tocar código; se conservaron íntegras las correcciones previas (`parts.ts` → `trim()`, `vehicles/form` → `model_id`, `workorders/detail` → aviso de cotización, `forbidden` → `Router`).

## 3) Validación (Etapa C)

- **Compilación de producción:** `npx ng build --configuration production` dentro de `vexora-ionic` (dependencias del host incompletas; no se reinstaló nada) → **EXIT 0**, **0 errores**, `Hash: 0bc3f3d52a043675`, 2026-11-17T19:43:39Z. `www/` regenerado (ignorado por `mobile/.gitignore:/www`).
- **API:** `/server/ping` → 200; contenedores `db (healthy)/api/ionic/swagger/cloudbeaver` Up; app `localhost:8100` → 200.
- **Integridad:** no se ejecutaron escrituras (ni altas, ni ediciones, ni borrados). Los registros PRU-TEST conservados siguen intactos; no se creó ni eliminó ningún dato.
- **No repetido (ya aprobado en turnos previos):** smoke test de los 4 roles, CRUD de catálogos, flujo Cotización→Aprobación→Pago, gestión de usuarios, perfil por rol, guards.

## 4) Git (sin commit ni push)

- `main` en `05294bf`, sincronizada con `origin/main`. 29 modificados (28 con diff real + `directus.config.json`, que es **falso positivo** de índice: `numstat` vacío, `i/lf w/lf`).
- 10 sin seguimiento: `.gitignore`, `AGENTS.md`, `ESTADO_VEXORA.md` y 7 `docs_faseD_*.png`.
- `.env` no rastreado e ignorado por `docker_moviles/.gitignore`; escaneo de secretos en los 39 archivos: **sin credenciales**. `docker-compose.yml` usa solo `${VAR}`.
- **Riesgo abierto:** las credenciales de desarrollo del commit original `05294bf` siguen en el historial (también en `origin/main`). No se reproducen aquí. Rotarlas o confirmar repo privado antes de publicar.
- Capturas `docs_faseD_*.png`: sin credenciales, solo datos de prueba (~396 KB). Recomendado versionarlas (idealmente en `docs/faseD/`).

## 5) Pendientes antes de producción

1. Rotar credenciales históricas o garantizar repo privado.
2. Autorización para commit/push (orden sugerido: infra → auth → users → nav → profile → fixes → docs).
3. No stagear `directus.config.json`.
4. Ampliar `.gitignore` a `.env*`.
5. Subida de archivos (opcional) y Perfil editable (requiere endpoint propio o licencia con permisos granulares; no ampliar permisos).

---

# Turno Freebuff 2026-11-17 (V) — Alineación con el estilo original (commit `05294bf`)

Responsable: Freebuff. Alcance: comparar las funcionalidades nuevas con sus equivalentes del commit `05294bf` y simplificar solo donde había capas, tipos o métodos duplicados. **Sin cambios visuales, de negocio, permisos ni datos.**

## Cambios aplicados

1. `mobile/src/app/services/auth/auth.ts`
   - Se eliminó el tipo `UserManaged`, que duplicaba `User` (solo añadía `status`). Ahora `User` tiene `status?: string` y `role: DirectusRole | null`.
   - `DirectusRole` se declara junto a `User` y se reutiliza en `getProfile`, `listUsers`, `getUser` y `listRoles` (antes el rol estaba duplicado inline).
   - Se eliminó `listUsersManaged()`: repetía `listUsers()`. Se amplió `listUsers()` con `role.id,role.name,status` y `limit: -1` (mismo formato `defer` + `map` del original). `listUsers()` estaba sin uso y ahora es el único listado.
   - Se conservan `listRoles`, `getUser`, `createUser` y `updateUser` (no existían en `05294bf` y son necesarios para la gestión de usuarios).
2. `mobile/src/app/tabs/tabs.page.ts`
   - Se sustituyeron cinco constantes `TAB_*`, la interfaz duplicada y el `if/else` por una sola lista `TABS` con los roles permitidos y un `filter` (mismo criterio que `constants/view_access.ts` y `constants/role_actions.ts`).
   - Se dejó un único hook `ionViewWillEnter` (antes `ngOnInit` y `ionViewWillEnter` hacían lo mismo). Mismo fallback: sin rol, solo Órdenes.
3. `mobile/src/app/pages/users/list/list.page.ts`
   - Se eliminaron `ngOnInit`, `loadedOnce` y `implements OnInit`; el listado carga en `ionViewWillEnter`, igual que `colors/list` y `workorders/list` del original.
   - Usa `User` en lugar de `UserManaged`.
4. `mobile/src/app/pages/profile/profile.page.ts` y `profile.page.html`
   - Se eliminaron `Router` y el método `goUsers()` (envoltorio de una sola navegación). El botón usa `routerLink="/users/list"`, como el resto de enlaces del proyecto.
5. `mobile/src/app/pages/users/detail/detail.page.ts` y `form/form.page.ts`: solo cambio de tipo (`User` en lugar de `UserManaged`) y `listUsers()`.

## Conservado y por qué

- **`queryParamMap` + `applyParams()` en `users/form`:** la página es una ruta (no un modal con `@Input() id` como los catálogos) y Ionic puede reutilizar la instancia al volver a `/users/form`; la suscripción evita formularios con datos obsoletos. Se mantiene aunque añada dos métodos.
- **`findDuplicateEmail()`:** el pre-chequeo de correo es la regla anti-duplicados acordada; no se sustituye por una validación solo de servidor.
- **`describeError()`:** conserva el mensaje real de Directus (correo duplicado) en lugar de un error genérico.
- **Guards `VIEW_ACCESS`, getters `isAdmin`, `canByRole`:** no se tocaron; los permisos siguen verificándose en el servidor.
- **Patrones del original:** `standalone: false`, NgModule por página, `FormBuilder`/`Validators`, `AlertController`, `firstValueFrom`, servicios con `defer` + `map` y `async/await` en auth.

## Verificación

- **Compilación de producción** dentro de `vexora-ionic` (sin reinstalar dependencias): `ng build --configuration production` → **EXIT 0**, 0 errores, `Hash: 7cf3d1d2b058dab3`, `Build at: 2026-11-17T20:27:43Z`. `www/` regenerado (ignorado por `mobile/.gitignore:/www`).
- **Sin referencias huérfanas** a `UserManaged`/`listUsersManaged`.
- **Sin escrituras en base de datos**, sin cambios en Docker/Compose ni en permisos de Directus. No se repitieron las pruebas funcionales ya aprobadas (smoke de 4 roles, CRUD, flujo cotización→pago); este turno es de estilo y solo se validó con la compilación.
- **Git:** sigue sin commit ni push; no se stageó nada.

## Siguiente acción

1. Revisión visual/funcional de Tabs, Menú y Gestión de Usuarios (sin cambios de comportamiento esperados).
2. Autorización para commit/push por grupos, excluyendo `directus.config.json` y sin stagear `.env`.

## Turno Freebuff 2026-11-17 (VI) — Cerrar sesión en Perfil

- **Tarea:** añadir opción de cierre de sesión en la pantalla Perfil para los 4 roles.
- **Archivos modificados:**
  - `mobile/src/app/pages/profile/profile.page.ts`: inyecta `Router`; añade `logout()` que llama a `auth.logout()` y redirige a `/login` con `replaceUrl`.
  - `mobile/src/app/pages/profile/profile.page.html`: botón `Cerrar sesión` (`color="danger"`, disponible para todos los roles).
- **Sin servicios/métodos duplicados:** reutiliza `AuthService.logout()` existente.
- **Verificación:** `ng build --configuration production` dentro de `vexora-ionic` → EXIT 0, 0 errores, Hash `ce67f1604e6f1dde`, Build at `2026-11-17T21:15:54Z`. No se probó visualmente el flujo de logout.
- **Git:** sin commit ni push; sin stagear `.env`.

## Turno OpenCode 2026-11-18 — Rediseño visual, Etapas 1 y 2

- **Alcance autorizado por el usuario:** solo rediseño visual. Etapa 1 (sistema visual global) y Etapa 2 (login). El resto de etapas queda a la espera de su revisión. No se modificaron servicios, consultas, rutas, guards, permisos, validaciones ni datos.

### Archivos modificados

1. `mobile/src/global.scss`
   - `:root` → se añadió `--ion-font-family` con una sola familia del sistema (`Inter`, `Roboto`, `-apple-system`, `Segoe UI`). No se descargaron fuentes.
   - `ion-button.button-solid:not([color])` → acciones principales en naranja `#F97316` (hover `#EA580C`) con texto blanco. No afecta a botones `clear`/`outline` ni a botones con color explícito.
   - `ion-button[fill="primary"]:not([color])` → corrige los botones `+` de los encabezados, que usaban un valor de `fill` inválido y quedaban sin fill. Ahora son naranjas. El botón de cerrar de los modales permanece transparente porque Ionic lo renderiza como `button-clear`.
   - `ion-item` → filas blancas con borde `#E2E8F0`, sin sombra, radio 10px y margen `6px 12px` (antes tarjeta con sombra). Se añadió `ion-item.item { border-radius: 10px; }` porque Ionic fija el radio del host en 0.
   - Título de los items → `color` navy y `font-weight: 700`; se añadió `ion-item.item ion-label h2` porque la etiqueta de Ionic aplica `.sc-ion-label-md-s h2 { font-weight: normal }` (clase, más específica).
2. `mobile/src/app/app.component.scss`
   - Se eliminó el bloque `@font-face` de `Young Serif` (`/assets/font/YoungSerif-Regular.ttf` no existe; provocaba un 404) y su `--ion-font-family`. Se conservaron `--ion-color-personalizado` y `ion-menu { --width: 260px }`.
3. `mobile/src/app/pages/login/login/login.page.html`
   - Estructura visual: contenido fullscreen, contenedor centrado, tarjeta blanca, logo `vexora-logo.png`, título/subtítulo y el enlace "Crear cuenta". El formulario conserva los mismos campos, `formControlName`, validaciones, mensaje y `(ngSubmit)="signin()"`.
4. `mobile/src/app/pages/login/login/login.page.scss` (nuevo)
   - Fondo con `login-background.png` + degradado navy; tarjeta de 380px; inputs claros; botón naranja de 46px. El degradado se aplica en `.login-wrapper` porque en esta versión de Ionic `--background` del `ion-content` no lo pinta (se verificó en el computed style).
   - Sin cambios en `login.page.ts` (autenticación intacta).

### Verificación

- **Implementado:** Etapas 1 y 2 completas según lo anterior.
- **Compilado:** `ng build --configuration production` dentro de `vexora-ionic` → EXIT 0, 0 errores, `Hash: 1ef20a9abe097e97`, Build at `2026-11-18T14:32:36Z`. Dev server de `vexora-ionic` con `Compiled successfully`.
- **Probado visual y funcionalmente (navegador real):**
  - Login: fondo del taller, logo cargado (112px), tarjeta blanca, botón naranja `#F97316`. Login real con `client@vexora.dev` → `/tabs/workorders/list` con 5 tabs y sin menú de administrador.
  - Órdenes (admin): toolbar navy, `+` naranja, filas con radio 10px y borde, títulos en negrita navy (`700`), ojo de detalle transparente, 4 registros y paginación.
  - Marcas (admin): listado con 11 registros, `+` naranja, títulos en negrita, botones de edición visibles; modal "Nueva marca" con cabecera navy, cerrar transparente, campo blanco y "Guardar" naranja.
  - Sesión de administrador: menú hamburguesa y accesos de Catálogos/Diagnóstico/Evidencias presentes.
- **Componentes existentes revisados:** `ion-toolbar`, `ion-item`, `ion-button`, `app-searchbar`, `app-pagination`, `ion-modal`, `ion-tab-bar`. No se detectaron roturas por los estilos globales; quedan detalles de paginación y de botones de fila para la Etapa 3.
- **Datos/servicios:** sin escrituras en base de datos, sin cambios en Directus ni en Docker.
- **Git:** sin commit ni push; sin stagear nada.

### Pendiente

1. Revisión del usuario de las Etapas 1–2 antes de continuar.
2. Etapas 3–15 del plan (componentes compartidos, navegación/tabs, pantallas por dominio, catálogos, diagnóstico, evidencias, responsive).
3. Auditoría final de Git/seguridad en pausa hasta terminar el rediseño.

## Turno OpenCode 2026-11-18 (II) — Rediseño visual, Etapa 3: componentes compartidos

- **Alcance autorizado:** solo los componentes existentes `app-toolbar`, `app-searchbar` y `app-pagination`. Sin tocar servicios, consultas, rutas, guards, permisos ni lógica. Etapas 1–2 conservadas sin cambios.

### Archivos modificados

1. `mobile/src/app/components/searchbar/searchbar.component.html`
   - Se aplicó la clase existente `.searchbar-custom` al `ion-searchbar` (estaba definida en el SCSS pero sin usar). El resto de bindings (`value`, `placeholder`, `debounce`, `ionInput`) quedó igual.
2. `mobile/src/app/components/searchbar/searchbar.component.scss`
   - Se unificó con el sistema aprobado: fondo blanco, texto `#334155`, placeholder `#94A3B8`, iconos `#64748B`, radio 10px y borde de 1px `#E2E8F0` (antes radio 16px y sombra).
   - El anillo de foco dejó de ser índigo ajeno a la marca: ahora naranja `rgba(249, 115, 22, 0.45)` al enfocar.
   - Margen alineado con las filas de los listados (`12px` laterales).
3. `mobile/src/app/components/pagination/pagination.component.html`
   - `Anterior` y `Siguiente`: de `fill="solid"` sin color a `fill="outline" color="primary"` (navegación en navy, coherente con la regla de marca).
   - Páginas: la activa usa `fill="solid"` y las inactivas `fill="outline"`, todas en `color="primary"`; se eliminó el gris `medium` que competía con la paleta. `[disabled]`, `(click)` y los métodos `before()`, `next()`, `changerPage()` no se tocaron.
4. `mobile/src/app/components/pagination/pagination.component.scss`
   - Botones uniformes (`min-width: 40px`, `font-size: 0.85rem`, mismo padding), separación y márgenes alineados a 12px con los listados; el texto "Página X de Y" pasa a 0.8rem y gris `#64748B`.
5. `app-toolbar`: **sin cambios**. Su HTML/SCSS/TS ya cumplía el sistema visual (navbar navy desde `global.scss`, título con peso 700, menú solo para Administrator vía `isAdmin`). No se duplicaron estilos; los botones de acción de las páginas ya reciben la regla global aprobada en la Etapa 1.

### Verificación

- **Compilado:** `ng build --configuration=production` en `vexora-ionic` → EXIT 0, 0 errores, `Hash: 1013f0566e886165`, Build at `2026-11-18T14:51:27Z`. Dev server `Compiled successfully`.
- **Probado en navegador real (admin):**
  - **Marcas:** 11 registros / 3 páginas; buscador con radio 10px y borde 1px; al escribir "Nis" filtró a 1 resultado (Nissan) y ocultó la paginación; al limpiar volvió a 11.
  - **Colores:** 10 registros / 2 páginas; "Siguiente" navegó a la página 2 (filas Plata, Verde, Beige, Naranja, Amarillo) y el número activo quedó sólido navy.
  - **Modelos:** 10 registros / 2 páginas; estilos del buscador y botones de paginación correctos.
  - **Órdenes:** 4 registros / 1 página (paginación oculta correctamente), buscador con el nuevo estilo, `+` naranja y filas intactas.
- **Comportamiento conservado:** búsqueda con `debounce`, `changePage`, `before/next`, totales y visibilidad de la paginación funcionan igual; no se modificaron `.ts` de los componentes ni de las páginas.
- **Capturas:** el motor de capturas del navegador rechazó las imágenes en este turno ("Screenshot needs a visible tab"), por lo que la verificación visual se hizo con estilos calculados y DOM real (valores registrados arriba). Pendiente capturar las 4 pantallas cuando la ventana esté visible.
- **Git:** sin commit ni push; sin stagear nada.

### Pendiente

1. Revisión del usuario de la Etapa 3.
2. Etapa 4 (navegación y Tabs) en adelante.
3. Capturas de Marcas, Colores, Modelos y Órdenes para el informe de la Etapa 3.

## Turno OpenCode 2026-11-18 (III) — Correcciones autorizadas: navegación Administrator y estados de listados

- **Alcance autorizado:** (1) botón "Volver a Órdenes" en `app-toolbar`; (2) estados de carga, error, vacío y listado en Marcas, Colores y Modelos. Sin tocar base de datos, métodos de pago, permisos, guards, rutas ni las etapas 1–3.

### Archivos modificados

1. `mobile/src/app/components/toolbar/toolbar.component.ts` / `.html`
   - `ADMIN_LIST_ROUTES` con los diez listados administrativos y `Router` inyectado; getter `showBackToWorkorders` (exige `isAdmin` y ruta exacta) y `goToWorkorders()` con `router.navigateByUrl('/tabs/workorders/list')`.
   - Botón `arrow-back` (`fill="clear" color="light"`) junto al menú. No se usa `location.back()`.
2. `mobile/src/app/pages/brands|colors|models/list/list.page.ts`
   - `loading` / `loadError`, `retry()`, y `chargerData()` / `changePage()` envueltos en `try/finally`. Sin cambios en el orden de las peticiones ni en los servicios.
3. `mobile/src/app/pages/brands|colors|models/list/list.page.html` / `.scss`
   - Spinner + "Cargando…", error con "Reintentar", vacío real (con y sin búsqueda) y listado con registros. Estilos en `.list-state` dentro del SCSS de cada página.

### Verificación

- **Compilado de producción:** `ng build --configuration production` en `vexora-ionic` → EXIT 0, 0 errores, `Hash: 954616cef5ca525b` (Build at `2026-11-18T15:22:13Z`). Dev server: `Compiled successfully`.
- **Navegación (admin, navegador real):** Órdenes → menú → Marcas/Colores/Modelos/Usuarios muestra el botón; al pulsarlo vuelve a `/tabs/workorders/list` con barra inferior y 4 órdenes. Sin botón visible en `/tabs/*`, `/quotes/list` ni en `/brands/detail/1`. Simulación del rol `client` en memoria: `isAdmin=false` y botón/menú ocultos; al restaurar `Administrator` reaparecen.
- **Estados (Marcas 11, Colores 10, Modelos 10):** carga con spinner y listado/paginación ocultos; error forzado con token inválido en memoria muestra "Reintentar" y recupera los datos; vacío real con búsqueda sin resultados; token restaurado. Sin escrituras en base de datos.
- **Capturas:** no disponibles en este turno (la ventana del navegador no es visible para el capturador); verificación por DOM, estilos calculados y estado de los componentes.
- **Git:** sin commit ni push; sin stagear nada.

### Pendiente

1. Revisión del usuario de estas dos correcciones.
2. Corrección de los nombres `??` de `methods` (aún no autorizada).
3. Etapa 4 en espera de autorización.

## Turno OpenCode 2026-11-18 (IV) — Corrección de nombres en `methods`

- **Alcance autorizado:** solo el campo `name` de los ids 2, 3 y 5 de `methods`, dentro de una transacción. Sin cambios en servicios, formularios, consultas, permisos, relaciones ni otros catálogos.

### Valores antes / después

| id | Antes (HEX) | Después (HEX) |
|---|---|---|
| 2 | `Tarjeta de d??bito` — `5461726A65746120646520643F3F6269746F` | `Tarjeta de débito` — `5461726A6574612064652064C3A96269746F` |
| 3 | `Tarjeta de cr??dito` — `5461726A6574612064652063723F3F6469746F` | `Tarjeta de crédito` — `5461726A657461206465206372C3A96469746F` |
| 5 | `Pago m??vil` — `5061676F206D3F3F76696C` | `Pago móvil` — `5061676F206DC3B376696C` |

### Procedimiento

1. `SELECT` previo: 5 métodos; exactamente 3 coincidencias con los valores diagnosticados; 0 registros adicionales con `0x3F`; columna `varchar(60)` y tabla `utf8mb4_uca1400_ai_ci`.
2. Simulación con `START TRANSACTION` + los tres `UPDATE` + `ROLLBACK`: 1 fila afectada por `id` y HEX correcto antes de revertir.
3. Transacción real: `START TRANSACTION`, tres `UPDATE` con `WHERE id = ... AND name = '<valor anterior>'`, verificación de las 3 filas y `COMMIT`. El SQL se envió con `CONVERT(UNHEX('...') USING utf8mb4)` para no depender de la codificación de la consola.
4. Sin `INSERT` ni `DELETE`. Se conservaron ids, `is_active`, `created_at`, `AUTO_INCREMENT=7`, la FK `fk_payment_method` y los dos pagos existentes (métodos 1 y 4).

### Verificación

- **BD:** 0 registros con `0x3F`; `LENGTH`/`CHAR_LENGTH` = 18/17, 19/18 y 11/10; `SHOW CREATE TABLE` idéntico salvo los nombres.
- **API Directus:** `GET /items/methods` → 200 con los cinco nombres correctos.
- **Aplicación:** `/methods/list` muestra "Tarjeta de débito", "Tarjeta de crédito" y "Pago móvil"; `/payment/form?quoteId=5` carga los cinco métodos correctos; sin `??` en el DOM.
- **Git:** sin commit ni push; sin stagear nada.

### Pendiente

1. Revisión del usuario de la corrección.
2. Revisar el procedimiento de importación que originó los `??` (no incluido en esta autorización).
3. Etapa 4 en espera de autorización.

## Turno OpenCode 2026-11-19 (I) — Etapa 4 completa: Bloques A, B, C y D

- **Alcance autorizado:** Etapa 4 del rediseño visual (tab bar, menú del administrador, títulos/placeholders y ortografía de catálogos y diagnósticos). Sin cambios en base de datos, servicios, consultas, guards, rutas, permisos, roles ni `global.scss`. Sin commit ni push.

### Bloque A — Navegación inferior (aprobado por el usuario)

- **Archivos:** `mobile/src/app/tabs/tabs.page.html`, `.ts`, `.scss`.
- **Cambio clave:** en `@ionic/angular` la navegación usa `tabRootUrl = ${tabsPrefix}/${tab}` (evidencia en `fesm2022/ionic-angular-common.mjs`); el `href` solo aporta query/fragment. Se conserva el subpath completo en `tab` y el resaltado se calcula con `isActive(tab)` sobre `router.url`. Sin cambios de rutas.
- **Compilado:** hash `5bc56669f0ac3494`, EXIT 0.
- **Verificado:** 5 pestañas para Administrator/client y 2 para mechanic/assistant; navegación real por las 5 rutas; activo naranja `rgb(249,115,22)` peso 600, inactivo `#64748B` peso 500; barra blanca, borde `#E2E8F0`, 57 px.

### Bloque B — Menú del administrador (aprobado por el usuario)

- **Archivos:** `mobile/src/app/app.component.html`, `.scss`.
- **Cambio:** `routerLinkActive="menu-item-active"` + `exact` en catálogos, Diagnóstico y Evidencias; `lines="none"`; header `#0F172A` con título blanco 700; content blanco; enlace activo `#F8FAFC` / `#F97316` 600 con borde izquierdo 3 px.
- **Compilado:** hash `04344e86bf47cdf6`, EXIT 0.
- **Verificado:** `client` sin menú ni botón; Administrator con menú abierto (panel 260 px); “Marcas” activo en `/brands/list` y “Diagnóstico” en `/diagnoses/list` con los valores indicados; “Servicios” navega a `/services/list` y mueve el indicador; acordeón con altura 414 px, filas de 50 px y padding 28 px al expandirse.

### Bloque C — Títulos y placeholders

| Archivo | Cambio |
|---|---|
| `pages/workorders/list/list.page.html` | `Ordenes de trabajo` → `Órdenes de trabajo` |
| `pages/vehicles/list/list.page.html` | `Vehiculos` → `Vehículos`; placeholder → `Buscar por placa o VIN` |
| `pages/appointments/list/list.page.html` | placeholder → `Buscar por placa, VIN o cliente` |
| `pages/payment/list/list.page.html` | placeholder → `Buscar por referencia` |

- Los placeholders se ajustaron al filtro real de cada servicio (`vehicles`: placa/VIN; `appointments`: placa/VIN/cliente; `payments`: referencia). Sin cambios de métodos ni eventos.

### Bloque D — Ortografía y tildes (catálogos y diagnósticos)

| Archivo | Cambio |
|---|---|
| `pages/colors/list` | `aria-label="Nuevo couta"` → `Nuevo color` |
| `pages/colors/detail` | `Detalle de color`; `Cargando información...` |
| `pages/brands/list` | `aria-label="Nuevo couta"` → `Nueva marca` |
| `pages/brands/detail` | `Detalle de marca` |
| `pages/models/detail` | `Detalle de modelo` |
| `pages/fuels/detail` | `Detalle de combustible` |
| `pages/parts/list` | `Nueva refacción`; `Buscar refacción` |
| `pages/parts/form` | `Editar/Nueva refacción`; punto final en el mensaje de longitud |
| `pages/parts/detail` | `Detalle de refacción` |
| `pages/services/detail` | `Detalle de servicio` |
| `pages/methods/list` | `Métodos de pago`; `Nuevo método` |
| `pages/methods/detail` | `Detalle de método` |
| `pages/diagnoses/list` | `Diagnósticos`; `Nuevo diagnóstico` |
| `pages/diagnoses/form` | `Editar/Nuevo diagnóstico` |
| `pages/diagnoses/detail` | `Detalle de diagnóstico`; `Orden de trabajo #…` |

- No se modificaron identificadores, rutas, datos almacenados ni etiquetas de campos.

### Compilación (C + D)

- `ng build --configuration production` en `vexora-ionic` → **EXIT 0**, `Hash: fd33266fcf4e712f` (Build at `2026-11-19T04:06:19Z`).
- C y D son cambios de texto, por lo que se validaron en una sola compilación; la verificación en navegador se hizo por bloque.

### Verificación en navegador (dev server, DOM real)

- **Bloque C:** `Órdenes de trabajo` (toolbar), `Vehículos` + placeholder `Buscar por placa o VIN`, Citas `Buscar por placa, VIN o cliente`, Pagos `Buscar por referencia`; los tres placeholders se comprobaron en el `<input>` renderizado dentro de `ion-searchbar`.
- **Bloque D:** títulos `Métodos de pago`, `Diagnósticos`, `Detalle de color/marca/modelo/combustible/refacción/servicio/diagnóstico`; aria-labels `Nuevo color`, `Nueva marca`, `Nuevo método`, `Nuevo diagnóstico`, `Nueva refacción`; formularios `Nuevo diagnóstico` (con “Información del diagnóstico” y “Orden de trabajo”) y `Nueva refacción`.
- **Limitación del entorno:** la ventana del navegador de automatización no está visible; `requestAnimationFrame` no se ejecuta (`raf-timeout`), por lo que Ionic no completa transiciones, Stencil no repinta cambios internos del acordeón y no hay capturas. La verificación se hizo por DOM, atributos renderizados, estilos calculados y estado de los componentes.

### Revisión general de coherencia visual (hallazgos, NO corregidos)

1. **Colores — buscador distinto:** `/colors/list` usa `ion-searchbar` directo (fondo `#F8FAFC`, radio 2 px, 58 px) mientras el resto usa `app-searchbar` (fondo `#FFFFFF`, radio 10 px, 56 px).
2. **Botones de fila inconsistentes:** Órdenes y Citas usan `fill="clear"`; catálogos como Combustibles usan `color="warning"` sin `fill` → botón sólido ámbar (`rgb(245,158,11)`). Diagnósticos usa `color="tertiary"` en lugar de `warning`.
3. **Estados de listado:** solo Marcas, Colores y Modelos tienen spinner/error/vacío; el resto de listados no.
4. **Toolbar `color="dark"`:** Evidencias e Historial lo usan; el resto usa `primary`.
5. **Tildes pendientes fuera de C/D:** `vehicles/list` aria-label `Nuevo vehiculo`; `quotes/list` aria-label `Nuevo couta`; `history/list` y `history/detail` “Vehiculo ID”; `workorders/detail` estado “En Diagnostico”.
6. **Falsos `??` en combustibles (corregido 2026-11-22):** la base y la API almacenan UTF-8 correcto (`Diésel` = `4469C3A973656C`, `Eléctrico` = `456CC3A9...`, `Híbrido` = `48C3AD...`) y la UI los muestra con tilde. El `??` era un artefacto de la salida de consola, no un problema de datos. No requiere cambios.

### Incidencias

- Docker Desktop se detuvo varias veces durante las pruebas; se reinició y se levantó con `docker compose up -d`. Directus respondió `200` en `/server/ping` y login `200`. Sin cambios de datos ni de configuración.
- Sin capturas de pantalla por la limitación de ventana descrita.

### Estado final

- Bloques A, B, C y D **implementados y verificados** en el entorno disponible.
- Etapa 4 **no se declara cerrada**: quedan los hallazgos de la revisión general pendientes de autorización.
- Sin commit, sin push, sin stage.

---

## Turno 2026-11-19 (Freebuff) — S2/S3 corregidas sin licencia

### Resultado
- Extensión local `vexora-rls` (hook in-process de Directus 12.6.0 Core, sin `LICENSE_KEY`).
- S2 (aislamiento por fila) y S3 (`/users` expuesto) **corregidas y verificadas** en REST y GraphQL.
- Sin cambios de permisos, frontend, `.env`, Compose ni infraestructura. Sin commits ni push.

### Archivos
- Nuevos: `directus/extensions/vexora-rls/package.json`, `index.js`, `lib/rules.js`.
- Nuevos: `seguridad/instalar-extension.sh`, `seguridad/rollback-extension.sh`.
- Nuevo: `pruebas/seguridad-s2s3.js` (166 comprobaciones).
- Modificados: `seguridad/verify.js` (filas S2/S3 de solo lectura), `docs/DOCUMENTACION_FINAL.md`, `ESTADO_VEXORA.md`.

### Verificación ejecutada
- `pruebas/seguridad-s2s3.js`: 166/166 OK. Fixtures temporales de aislamiento entre clientes y entre mecánicos, limpieza y snapshot de integridad idéntico antes/después.
- `pruebas/cierre-e2e.js`: 41/41 OK con la extensión activa.
- `seguridad/verify.js`: S2/S3 en valores esperados (prutest01 = 0 en todas las colecciones; client 1 usuario; mechanic y assistant 5; relaciones sin correo; GraphQL acotado).
- Conteos antes/después: vehículos 4, citas 5, órdenes 4, cotizaciones 4, pagos 2, usuarios 5, catálogos sin cambios.

### Operación
- Instalar/actualizar: `VEXORA_PW=... VEXORA_ADMIN_PW=... bash seguridad/instalar-extension.sh` (copia al volumen `vexora_directus_extensions`, reinicia solo `vexora-api`, verifica carga y aislamiento, y revierte si falla).
- Desactivar: `bash seguridad/rollback-extension.sh`.

### Residuales (no abordados)
- `/assets/:uuid` depende del permiso `directus_files`.
- `client` conserva lectura de `directus_permissions/policies/roles` (necesaria para `/permissions/me`).
- MariaDB accesible por CloudBeaver en `:8978` en el entorno local.
- La fila de `directus_extensions` de `vexora-rls` queda inerte tras un rollback; se reutiliza al reinstalar.

---

## Turno 2026-11-20 (OpenCode) — Integración final de cabeceras y depuración

### Resultado
- Integración selectiva de `feature/dis` y `feature/vistas-unificadas` **sin merge, cherry-pick ni checkout**: se portaron solo las mejoras compatibles.
- `showMenu` integrado con `isAdmin` en el toolbar: el menú lateral queda visible únicamente para Administrator.
- **32 páginas `detail`/`form`** unificadas con `<app-toolbar>` (se eliminaron los `ion-header` duplicados) y **30 módulos** actualizados con `ToolbarModule`.
- Menú administrativo con **fuente única** (`constants/admin_menu.ts`): enlaces del menú y `ADMIN_LIST_ROUTES` del toolbar ya no se duplican.
- Roles de las tabs con **fuente única** (`VIEW_ACCESS`): `tabs.page.ts` deriva los roles de la misma matriz que usan los guards.
- `ion-text-wrap` añadido a las 7 listas que faltaban (Diagnósticos, Evidencias, Historial, Refacciones, Pagos, Cotizaciones, Vehículos).
- Rutas de Historial **conservadas** (`history/list|form|detail/:id`).
- No se incorporaron cambios globales de `global.scss` ni el footer "Ver respuesta de la API" de `vistas-unificadas`.

### Archivos
- Nuevo: `mobile/src/app/constants/admin_menu.ts`.
- Modificados: `components/toolbar/toolbar.component.ts|html`, `app.component.ts|html`, `tabs/tabs.page.ts`.
- Modificados: 32 `pages/*/detail|form/*.page.html` y 30 `*.module.ts` (los de Usuarios ya importaban `ToolbarModule`).
- Modificados: 7 `pages/*/list/list.page.html` por `ion-text-wrap`; `pages/history/form/form.page.html` corregido (cabecera duplicada).
- Sin cambios en Perfil, Usuarios (lógica), servicios de auth/evidencias, guards, `VIEW_ACCESS`, Docker, `.env`, base de datos ni permisos de Directus.

### Pruebas ejecutadas
- `npx ng build --configuration production` dentro de `vexora-ionic`: **OK** (`BUILD_EXIT=0`), hash `f0c8c080cad70caf`, 0 errores.
- Servidor de desarrollo: `Compiled successfully` tras los cambios y `HTTP 200` en `http://localhost:8100`.
- Guard real en navegador: `/users/list` sin sesión redirige a `/login?returnUrl=%2Fusers%2Flist`; `/forbidden` renderiza "ERROR 403".
- Verificación de datos de solo lectura contra Directus (login admin 200): vehículos 4, citas 5, órdenes 4, diagnósticos 0, evidencias 1, cotizaciones 4, pagos 2, catálogos 5-11, historial 0; `/files` 200.
- `git diff --check`: sin errores (solo avisos de fin de línea LF/CRLF).
- No se repitieron los logins de UI de los 4 roles: las contraseñas no están en el repositorio (política correcta). La matriz `VIEW_ACCESS` y los valores de tabs se conservaron idénticos.

### Pendientes / bloqueos conocidos
- Pruebas autenticadas de UI para los 4 roles requieren credenciales del usuario.
- Subida/visualización real de evidencias sigue dependiendo de permisos de Directus sobre `/files` (no se tocaron permisos).
- `Historial` conserva su 403 conocido por consulta sin autenticación; fuera de este alcance.

### Git
- Sin stage, commit ni push. Copia de seguridad en `C:\Users\valen\AppData\Local\Temp\opencode\vexora-backup-20261119` (ZIP + patch reversible verificado).

---

## Turno OpenCode 2026-11-21/22 — scroll de Nueva cotización y validaciones pendientes

### Corrección: desplazamiento del modal "Nueva cotización"
- Causa exacta: el modal se abre como hoja de Ionic (`breakpoints: [0, 0.95, 1]`, `initialBreakpoint: 0.95`). Ionic desactiva el scroll del `ion-content` en cualquier breakpoint distinto del máximo cuando `expandToScroll` es `true` (por defecto). El cuerpo quedaba con `scrollY=false` y no respondía a la rueda del ratón.
- Cambio mínimo: en `pages/workorders/detail/detail.page.ts`, método `createQuote()`, se agregó `expandToScroll: false` al `modalController.create`. No se tocaron estilos, campos, lógica, otros modales ni la presentación visual.
- Comprobación real en navegador (mechanic, hoja al 95 %): encabezado fijo en `top=50`, `ion-content.scrollY=true`, rueda desplaza hasta el final (scrollTop 258 de 965), botones "Cancelar" y "Guardar cotización" visibles dentro del viewport. Capturas: `cotizacion-scroll-top.png` y `cotizacion-scroll-bottom.png` en el directorio de diagnóstico temporal.
- Compilación de producción: `npx ng build --configuration production` dentro de `moviles-ionic` (nombre actual del contenedor) → `BUILD_EXIT=0`, hash `3b4403ff80a26a2f`.

### Validaciones ejecutadas
- Evidencias: subida real como mechanic en una orden temporal; archivo creado en `directus_files`, registro en `evidence` con UUID, miniatura visible en el detalle. Administrator ve la imagen en `/workorders/detail/16` (evidencia #9, 2048×2048) y en `/evidences/list` (evidencias #5 y #9), sin errores de consola.
- Usuarios: alta real desde la UI (`val.final.prueba@vexora.dev`, rol client), edición del apellido y recarga del listado; alertas de éxito correctas. El usuario temporal se eliminó por API al terminar.
- Servicios: listado, búsqueda ("Frenos" → 2, "aceite" → 1, sin resultados y limpieza), paginación (10 registros, 2 páginas) y acciones visibles.
- Combustibles: listado de 5 registros con estado; en este turno se le añadió buscador y paginación (ver sección siguiente).
- Métodos de pago: listado de 5 registros, búsqueda ("efectivo" → 1, sin resultados y limpieza) y acciones visibles.
- Citas (búsqueda reportada): como Administrator, "PRU-T01" → 1 resultado, "carla" → 5, "PRU" → 5, "zzzz" → 0 con estado vacío, limpiar → 5. El filtro de la API también responde 200 con placa, VIN, nombre y apellido.

### Limpieza de datos temporales
- Eliminados por API: orden temporal #17 (kilometraje 111111), evidencia #10 y archivo `a3628bc0-813d-4484-b744-dc52881f7316`; usuario `val.final.prueba@vexora.dev` (`b10a702e-5859-4925-888e-251bfd03fe48`). Verificado: sin evidencias asociadas a la orden 17.
- Se conservan los 4 usuarios temporales de rol (`val.final.*`) porque todavía se usan para las pruebas integrales; deben eliminarse al cerrar la validación completa.

### Nota de infraestructura
- Los contenedores activos son `moviles-db`, `moviles-api`, `moviles-ionic`, `moviles-swagger` y `moviles-cloudbeaver` (proyecto Compose `moviles`), no `vexora-*`. La app sigue en `http://localhost:8100` y Directus en `http://localhost:8000`. Verificar la correspondencia de volúmenes antes de cualquier reorganización.

---

## Turno OpenCode 2026-11-22 — cierre de validación funcional

### Cambios de código (mínimos, sin tocar infraestructura)
- `pages/fuels/list`: buscador (`app-searchbar`, `handleInput()`) y paginación (`app-pagination`, `perPage = 5`, `chargerTotal()`, `adjustCurrentPage()`). El servicio ya tenía `filter()` y `total()`.
- `pages/methods/list`: paginación con el mismo patrón.
- Módulos de ambos listados ya importaban `SearchbarModule`/`PaginationModule`; no se añadieron dependencias.
- Compilación de producción: `BUILD_EXIT=0`, hash `ef75b2348637771d`.

### Roles (login real desde la UI)
- **Administrator:** 5 pestañas (Órdenes, Citas, Vehículos, Pagos, Perfil) y menú con Catálogos, Colores, Marcas, Modelos, Combustibles, Refacciones, Servicios, Métodos de pago, Diagnóstico y Evidencias.
- **client:** 5 pestañas, sin menú; perfil correcto; 0 órdenes (aislamiento). `/users/list`, `/services/list`, `/evidences/list` → `/forbidden` (403).
- **mechanic:** 2 pestañas (Órdenes, Perfil), sin menú; 0 órdenes. Citas, vehículos, pagos, usuarios, servicios y evidencias → `/forbidden`. `/workorders/detail/16` no filtra datos: muestra "Revisar ID, conexión a la base de datos o permisos".
- **assistant:** 2 pestañas (Órdenes, Perfil), sin menú; ve las 5 órdenes reales. Citas, usuarios y evidencias → `/forbidden`. En la orden #16 puede abrir los modales "Información del diagnóstico" y "Nueva Evidencia"; el botón "Guardar evidencia" está deshabilitado sin archivo.

### Módulos y CRUD verificados
- **Usuarios:** listado (9 cuentas), detalle, alta, edición con valores reales y validaciones de campos obligatorios. Sin eliminación en la UI (por diseño).
- **Vehículos:** listado (4), detalle (#6) y formulario de alta disponible para client.
- **Citas:** listado con búsqueda por placa/VIN/cliente; formulario de alta disponible para client.
- **Órdenes:** listado por rol, detalle #16 con diagnósticos, evidencias y cotizaciones.
- **Cotizaciones:** listado (4) y detalle #5 con subtotal $2380.00, IVA $380.80 y total $2760.80.
- **Pagos:** listado (2) con búsqueda por referencia; formulario con `?quoteId=5` carga la cotización y el total a pagar.
- **Diagnósticos/Evidencias:** modales abiertos desde la orden #16; miniaturas visibles en detalle y listado.
- **Historial:** listado vacío ("No hay registros de historial") y formulario vacío; no hay datos para probar detalle.

### Búsqueda y paginación probadas en UI
- Combustibles: 5 → "Gas" 2 → "Híbrido" 1 → "zzzz" 0 con estado vacío → limpiar 5.
- Métodos de pago: 5 → "Tarjeta" 2 → "zzzz" 0 con estado vacío → limpiar 5.
- Servicios: 10 registros, 2 páginas; página 2 muestra otros 5; buscar desde página 2 reinicia a página 1 con total filtrado; limpiar restaura página 1 de 2.
- Pagos: "PRU-TEST" → 1; "zzzz" → 0 con estado vacío.

### Volúmenes (verificados, sin modificar)
- `vexora_mariadb_data` (moviles-db), `vexora_directus_uploads` y `vexora_directus_extensions` (moviles-api), `vexora_ionic_node_modules` (moviles-ionic), `vexora_cloudbeaver_data` (moviles-cloudbeaver). `moviles-swagger` no monta volúmenes.
- Existen 5 volúmenes `vexora_*`; los 5 `docker_moviles_*` antiguos siguen sin uso. No se renombró ni eliminó ninguno.

### Documentación
- `docs/REVISION_MANUALES_PROFESOR.md` reescrito al formato objetivo/técnicas/estado/pruebas/justificación para los 20 manuales.
- `docs/MANUAL_DEFENSA_VEXORA.md` y `docs/MANUAL_TECNICO_VEXORA.md` corregidos: Angular 20, contenedores `moviles-*`, usuarios y evidencias marcados como probados en UI.
- `docs/DOCUMENTACION_FINAL.md` corregido: contenedores `moviles-*` y MariaDB 11.8.
- `respaldos/` contiene los 5 respaldos; `DOCUMENTACION_FINAL.md` se movió a `docs/`.

### Pendiente / bloqueado (no declarar terminado sin esto)
- **PENDIENTE (requiere autorización):** segunda página real en Combustibles y Métodos de pago (solo 5 registros y `perPage = 5`).
- **PENDIENTE (requiere autorización):** abrir el modal de cotización como `mechanic` con una orden asignada; el usuario mecánico temporal no tiene órdenes.
- **PENDIENTE (por diseño):** eliminación de usuarios y de catálogos desde la UI; no existen botones.
- **PENDIENTE (requiere autorización):** edición del perfil propio. La instalación no aplica permisos granulares (las reglas custom quedan en `permissions: null`), y el permiso amplio permitiría auto-escalado de rol. Alternativas: solo lectura (actual), edición por Administrator, endpoint propio con whitelist de `first_name`/`last_name`, o licencia con permisos granulares.

---

## Turno OpenCode 2026-11-22 (II) — diagnóstico de pendientes

### 1. Mechanic y `/workorders/detail/16`
- **Causa: asignación.** `workorders.id=16` tiene `mechanic_id=d034d515-3219-4764-983a-6a70d8500805` (`mechanic@vexora.dev`); `val.final.mechanic` es `11ee6068-43ec-48f4-8313-e57c2c1458d5`. La extensión `vexora-rls` inyecta `mechanic_id=$CURRENT_USER` en `items.query` y valida escrituras; por eso la lista devuelve 0 y el detalle responde 403.
- **No es** un bug de consulta ni de permisos de Directus. No se cambió la asignación.
- **Mejora aplicada:** `pages/workorders/detail/detail.page.ts` distingue 403/404 y muestra "No tienes acceso a esta orden. Verifica que esté asignada a tu usuario." Compilado (hash `21b94c874136677c`) y probado con `val.final.mechanic` (detalles 16 y 1 → mensaje específico); como Administrator la orden #16 sigue cargando.

### 2. Perfil
- **Evidencia actual:** `/permissions` devuelve `permissions: null` en las reglas custom (p. ej. id 146); el aislamiento efectivo lo hace `vexora-rls`. La instalación no aplica reglas custom de permisos; el registro previo cita `RESOURCE_RESTRICTED` (`custom_permission_rules_enabled`). El paquete `@directus/license` no aparece suelto en la imagen actual, así que la atribución a licencia se mantiene como evidencia previa, no re-verificada con una prueba destructiva.
- **Alternativas seguras:** (a) solo lectura actual; (b) edición por Administrator en `/users/form?id=`; (c) endpoint propio en `vexora-rls` con whitelist `first_name`/`last_name` y usuario derivado de `accountability`; (d) licencia que habilite permisos granulares. Ninguna se implementó; (c) y (d) requieren autorización.
- Se corrigió el comentario de `profile.page.ts` para reflejar la evidencia real.

### 3. Paginación
- Combustibles y Métodos tienen 5 registros y `perPage = 5`; no hay segunda página. No se crearon datos.
- **Autorización necesaria:** crear 1 registro temporal en cada catálogo (o en uno) para verificar la página 2 y eliminarlo al terminar.

### 4. Cotizaciones como mechanic
- `val.final.mechanic` no llega al detalle porque no tiene órdenes asignadas. Los permisos de creación ya existen (137 quotes, 139 quoteparts, 140 quoteitems). La orden #16 no tiene cotizaciones, así que el modal se habilitaría si estuviera asignada.
- **Autorización necesaria:** asignar temporalmente una orden a `val.final.mechanic` (y revertir) o crear una orden temporal. No se modificó ninguna asignación.

### 5. Codificación
- MariaDB y la API almacenan UTF-8 correcto: `Diésel` = `4469C3A973656C`, `Eléctrico` = `456CC3A9...`, `Híbrido` = `48C3AD...`; `character_set_*` = `utf8mb4`; la API responde `charset=utf-8`; la UI muestra las tildes. El `??` era un artefacto de la consola, no un problema de datos. No se modificó nada.

### 6. Documentación
- Corregidos `ESTADO_VEXORA.md`, `MANUAL_TECNICO_VEXORA.md`, `MANUAL_DEFENSA_VEXORA.md` y `REVISION_MANUALES_PROFESOR.md` para distinguir asignación vs permisos, la limitación de perfil y el falso problema de codificación.
- Compilación final: `BUILD_EXIT=0`, hash `21b94c874136677c`.

### Autorizaciones pendientes
1. Crear 1–2 registros temporales en Combustibles/Métodos para probar la página 2 (y borrarlos).
2. Asignar temporalmente una orden a `val.final.mechanic` (o crear una orden temporal) para probar el modal de cotización.
3. Implementar endpoint propio de perfil con whitelist (o habilitar licencia con permisos granulares).
4. Eliminación de usuarios/catálogos desde la UI (por diseño).

---

## Turno 2026-11-24 (III) — Pruebas integrales de solo lectura y propuesta de carpetas

Responsable: Freebuff. Alcance: matriz de pruebas sin escritura de datos + inspección de las tres carpetas. **No se modificó código, datos, infraestructura ni estructura de carpetas.**

### Pruebas ejecutadas en este turno (HTTP/API reales, solo lectura)

| # | Prueba | Resultado |
|---|---|---|
| 1 | Login admin (`POST /auth/login`) | 200, token emitido |
| 2 | `GET /server/ping` | 200 |
| 3 | `GET /users/me` | 200, rol `Administrator` |
| 4 | `GET /roles` | 4 roles: assistant, mechanic, client, Administrator |
| 5 | `GET /users` | 9 cuentas activas, 4 roles distintos |
| 6 | Conteos por colección | brands 11, models 10, colors 10, fuels 5, methods 5, services 10, parts 10, vehicles 4, appointments 5, workorders 5, diagnoses 1, evidence 2, quotes 4, quoteitems 2, quoteparts 2, payment 2, status 11, history 0 |
| 7 | Paginación real `services` | página 1 = 5 filas, página 2 = 5 filas, `filter_count` = 10 |
| 8 | Búsqueda real `brands?filter[name][_icontains]=Toy` | 1 resultado: Toyota |
| 9 | Asset evidencia #9 con token | 200 `image/png` 728842 B |
| 10 | Asset evidencia #9 sin token | 403 |
| 11 | `GET /items/vehicles` sin token | 403 |
| 12 | `POST /items/brands` sin token | 403 |
| 13 | CORS preflight desde `http://localhost:8100` | `Access-Control-Allow-Origin` correcto |
| 14 | Login con credenciales inválidas | 401 |
| 15 | `GET /files` | 2 archivos reales (`evidencia-prueba.png`, `vexora_isotipo_app_2048.png`) = evidencias #5 y #9 |
| 16 | `GET /items/workorders/16` con relaciones | 200, `status_id` 4, `mechanic_id` de `mechanic@vexora.dev`, `vehicle_id` 3 |
| 17 | Extensiones cargadas | `INFO: Loaded extensions: vexora-rls` |
| 18 | Ionic `:8100` | 200, `<app-root>` presente, dev server `✔ Compiled successfully` (hash dev `b975c33a685cd845`) |
| 19 | Directus `:8000`, Swagger `:8081`, CloudBeaver `:8978` | 200 / 200 / 200 |
| 20 | Errores en logs (30 min) | 0 en `moviles-ionic`; 0 en últimas 500 líneas de `moviles-api` |
| 21 | Build producción | EXIT 0, hash `21b94c874136677c` |

### Corrección de contradicciones documentales
- **Subida de evidencias = IMPLEMENTADA**, no pendiente: `EvidenceServices.upload()` sube a `/files`, crea el registro en `evidence` y valida formato (JPEG/JPG/PNG/HEIC/HEIF) y tamaño (10 MB) en `pages/evidence/form`. El volumen `vexora_directus_uploads` conserva los archivos de las evidencias #5 y #9 (verificado por `GET /files`). Queda como PENDIENTE únicamente repetir la carga desde la UI en este turno (requiere crear un registro y su archivo → autorización).
- **Perfil:** solo lectura, sin edición. No implementado por riesgo de auto-escalado de rol.
- **Borrado de catálogos:** probado por API admin; la UI no expone botón (comportamiento original).
- **Paginación de 2 páginas:** probada en Servicios (UI y API).

### Estructura de carpetas (inspección, sin cambios)
- `C:\docker_moviles` (L1): repo Git antiguo (mismo HEAD `05294bf`, tracks `docker_moviles/`), árbol de trabajo roto (510 borrados) + `docker_moviles_respaldo/` (copia del 15/11, 96 MB).
- `C:\docker_moviles\docker_moviles` (L2): repo Git utilizable (`main`, `HEAD 05294bf`, 165 modificados + 29 sin seguimiento), `.freebuff/project-id`, 17 capturas de evidencia en la raíz; **no** contiene Compose ni código.
- `C:\docker_moviles\docker_moviles\docker_moviles` (L3): proyecto real (compose, mobile, directus, database, docs, pruebas, seguridad, respaldos, .env), 9 MB sin `node_modules`/`www`.
- Docker: proyecto `vexora`, `working_dir` = L3, `config_files` = L3/docker-compose.yml, bind mount L3/mobile → /app, 5 volúmenes nombrados `vexora_*`.
- Propuesta (no ejecutada): dejar `C:\docker_moviles` como raíz Git (= L2 actual) y `C:\docker_moviles\docker_moviles` como proyecto (= L3 actual); retirar el repo antiguo de L1 y conservar `docker_moviles_respaldo` fuera del árbol. Requiere `docker compose down` (sin `-v`) + `up -d` para re-apuntar los bind mounts, y reabrir la carpeta en Freebuff.

---

## Turno OpenCode 2026-11-24/25 - Recuperacion del stack, reorganizacion y perfil editable

Responsable: OpenCode. Alcance autorizado por el usuario: recuperar el VEXORA original conservando todo el trabajo, terminar la reorganizacion de carpetas, reparar Docker/Directus y completar funcionalidades pendientes (perfil editable). No se creo un proyecto nuevo ni se sustituyo por version antigua.

### 1. Causa del problema detectado
- El stack que estaba corriendo se habia levantado por error desde `C:\docker_moviles\docker_moviles_respaldo\docker-compose.yml`: servia el codigo de `docker_moviles_respaldo\mobile` y los datos `docker_moviles_*` (4 usuarios, 1 orden, 0 cotizaciones).
- El estado real del VEXORA trabajado esta en los volumenes `vexora_*` y en `C:\docker_moviles\docker_moviles` (9 usuarios, 5 ordenes, 4 cotizaciones, 2 evidencias).
- Correccion: `docker compose down` (sin `-v`) del stack antiguo y `docker compose up -d --build` desde `C:\docker_moviles\docker_moviles`. Contenedores `moviles-*` arriba con `vexora_*`. No se borraron volumenes ni datos.

### 2. Reorganizacion de carpetas (ya ejecutada)
- Script `reorganizar-vexora.ps1` (24/11 21:49-21:52), con inventario, verificacion y rollback.
- Resultado: repo Git en `C:\docker_moviles` (HEAD `05294bf`, rama `main`), proyecto en `C:\docker_moviles\docker_moviles`, respaldo en `C:\vexora_old` (incluye el `.git` antiguo y `docker_moviles_respaldo`). No se elimino informacion.
- Git: 165 archivos modificados, 1 borrado logico (`docker_moviles/workshop_backup.sql`, conservado en `respaldos/`), 31 sin seguimiento (docs, `directus/extensions/`, `pruebas/`, `respaldos/`, `seguridad/`, capturas). Sin commit/push.

### 3. Integridad verificada tras el cambio
- Conteos en el volumen correcto: workorders 5, diagnoses 1, quotes 4, quoteitems 2, quoteparts 2, evidence 2, fuels 5, methods 5, users 9, files 2.
- Evidencia original: `45fed52e-aa65-4a94-82d6-f2e90355510a.png`, 728842 bytes, MD5 `c8cc9cc96c16a75e6aaf80c37e286038`.
- Extension `vexora-rls` en volumen identica (SHA-256) a `directus/extensions/vexora-rls` del proyecto (`index.js 84da23f6...`, `rules.js e47f0de9...`, `package.json ff7fb688...`).

### 4. Perfil editable (IMPLEMENTADO Y PROBADO)
- Motivo: `PATCH /users/me` responde 403 para los roles de la app porque Directus no aplica reglas custom (`permissions: null`) y `directus_users.update` esta en `access: none`. Otorgar `update` amplio permitiria auto-escalado de rol.
- Solucion sin tocar permisos ni `vexora-rls`: extension endpoint local `directus/extensions/vexora-profile` (`PATCH /vexora-profile/me`) con lista blanca `first_name`, `last_name`, `description`, `avatar`; el usuario sale de `req.accountability` (nunca del body). Cargada y verificada en logs: `Loaded extensions: vexora-profile, vexora-rls`.
- UI: `pages/profile` ahora es un formulario reactivo con nombre, apellido, descripcion y fotografia (subir/cambiar/quitar), validacion JPG/PNG/WEBP y maximo 5 MB, avatar autenticado via `GET /assets/:id` como object URL. Correo y rol quedan de solo lectura.
- Servicio: `services/auth/auth.ts` agrega `updateProfile`, `uploadAvatar`, `assetObjectUrl`; `User` incluye `description` y `avatar`.
- Pruebas API (usuario temporal `val.final.mechanic`): nombre OK; `role` -> 400; `id` -> 400; nombre vacio -> 400; avatar no UUID -> 400; avatar inexistente -> 400; sin token -> 401; cambio de nombre y restauracion OK.
- Pruebas UI (4 roles): lectura correcta; edicion de nombre/descripcion (`val.final.mechanic`), foto subida desde el navegador y verificada en MariaDB (`avatar` con UUID, `directus_files` creado), quitar foto y guardar (`avatar = NULL`), validacion de archivo no permitido y de tamano > 5 MB, nombre vacio bloquea el guardado. Se restauro el apellido de `val.final.client` y se eliminaron los archivos de prueba con el admin; `directus_files` volvio a 2.

### 5. Documentacion
- `docs/MANUAL_TECNICO_VEXORA.md` seccion 6.1 (perfil) reescrita con el flujo de lectura/edicion y la justificacion del endpoint; secciones C.2/C.3 actualizadas (perfil y modal de cotizacion como PROBADOS).
- `docs/MANUAL_DEFENSA_VEXORA.md`: matriz de Perfil = probado en los 4 roles; seccion 18 (pendientes reales) actualizada.
- `ESTADO_VEXORA.md` (esta seccion).

### 6. Pendiente / bloqueado en este turno
- **PENDIENTE (requiere autorizacion):** guardar una cotizacion real desde la UI (crearia registros). Calculos y validaciones ya probados.
- **PENDIENTE (requiere autorizacion):** subir una evidencia real desde la UI (crearia archivo + registro). Modal y selector probados.
- **PENDIENTE (requiere autorizacion):** pagina 2 real de Combustibles/Metodos de pago (solo 5 registros; la paginacion ya se valido con Servicios).
- **PENDIENTE (requiere autorizacion):** rediseño visual final y commit/push.
- **BLOQUEADO por diseno:** `val.final.mechanic` no ve la orden #16 (asignada a `mechanic@vexora.dev`); el modal de cotizacion se probo con esa cuenta.
- **Build de produccion (2026-11-25T04:44:40.342Z):** `BUILD_EXIT=0`, Hash `ae409fc02c62a66e` (incluye el perfil editable). El dev server compila sin errores (`Compiled successfully`).

## Fase 3 - Diagnostico del login original (2026-11-25, Freebuff, SOLO LECTURA)
- Alcance: comparar las 5 cuentas originales de `respaldos/workshop_backup.sql` con las 9 cuentas actuales de `workshop`.
- Resultado: 5 cuentas antiguas (`admin@vexora.com`, `assistant@vexora.com`, `mechanic@vexora.com`, `cutirra@gmail.com`, `waxho@waxho.com`), todas `active` con hash argon2id intacto; 0 colisiones de UUID y 0 de correo con las 9 actuales.
- Roles: assistant/client/mechanic conservan el mismo UUID; Administrator cambia (`3823f47a-...` en el dump vs `e89d5412-...` actual), por lo que un INSERT literal violaria la FK `directus_users_role_foreign`.
- Dependencias: 27 FK apuntan a `directus_users`; los datos vigentes pertenecen a `client@vexora.dev` (3 quotes, 4 vehicles, 2 payments) y `mechanic@vexora.dev` (5 workorders, 1 quote, 2 files). Los 5 UUID antiguos no tienen ninguna referencia actual.
- `cutirra@gmail.com` entraria sin datos: 0 triggers, 0 eventos y 0 filas en `directus_relations`; no existe reasignacion automatica por correo.
- Directus 12.6.0 incluye `argon2@0.44.0`, compatible con los hashes `[hash omitido]`.
- Escenarios revisados: A) 4 cuentas -> 13 usuarios y 3 administradores; B) 5 cuentas -> 14 usuarios y 4 administradores.
- Reversion: `directus_sessions` cae por CASCADE; `directus_activity` no tiene FK, por lo que hay que borrar explicitamente las filas `user IN (5 UUID)`. Baseline: actividad 1107 (max id 1394), sesiones 324.
- No se ejecuto INSERT/UPDATE/DELETE/COMMIT, no se modifico la base ni el volumen antiguo, no se toco `.env` ni se detuvieron servicios.
- Informes: Docs `Fase 3 VEXORA - Diagnostico del login y plan de recuperacion` y `Fase 3.1 VEXORA - Revision final del plan de recuperacion`.
- Siguiente accion: esperar autorizacion expresa y eleccion de escenario A o B.

## Fase 3.2 - Escenario A elegido (2026-11-25, Freebuff, sin ejecucion)
- Decision del usuario: recuperar solo `admin@vexora.com`, `assistant@vexora.com`, `mechanic@vexora.com` y `cutirra@gmail.com`; `waxho@waxho.com` queda fuera.
- Respaldo previo generado y verificado: `C:\vexora_snapshot_20261125_git\evidence\workshop_pre_fase3_20261125.sql`, 525924 bytes, SHA-256 `3cc5f8f9...80f5f5e0`, 51 tablas, `-- Dump completed`, exit 0.
- Verificacion del respaldo: 9 usuarios y 9 hashes identicos a la base viva; conteos de las 12 tablas de negocio coincidentes; 0 cuentas `@vexora.com`.
- SQL definitivo: `evidence/fase3_escenarioA_4usuarios.sql`, 4 filas, 27 columnas, 27 valores por fila, 0 ocurrencias de waxho, 1 remapeo de rol (`3823f47a` -> `e89d5412`), termina en `ROLLBACK` con `COMMIT` comentado.
- Verificacion de hashes: los 4 del SQL existen en el respaldo historico; 0 hashes nuevos; 1 hash no usado (waxho).
- No se ejecuto INSERT/UPDATE/DELETE/COMMIT; `workshop` sigue con 9 usuarios y 0 cuentas `@vexora.com`; servicios arriba.
- Siguiente accion: esperar autorizacion expresa para ejecutar el SQL y probar login.

## Fase 4 - Validacion funcional (2026-11-25, Freebuff, SOLO LECTURA)
- Alcance: perfil editable 4 roles, diagnostico, cotizacion como mechanic, evidencias, pagina 2 de Combustibles y Metodos.
- Sin escrituras: no se modificaron usuarios, roles, permisos, base, .env, archivos ni servicios; sin operaciones Git.
- Frontend compila: `Compiled successfully` en `moviles-ionic`. Extensiones cargadas: `vexora-profile, vexora-rls`; hash del endpoint repo = runtime (`7321e4bd...`).
- Endpoint de perfil: `PATCH /vexora-profile/me` sin sesion -> 401 con mensaje; `GET` -> 404 (solo PATCH).
- HALLAZGO H1 (FALLIDO): el rol `client` no tiene `create` en `directus_files`; el perfil muestra "Subir foto" para todos, por lo que la subida de foto del cliente fallara con 403. Correccion propuesta: dar `create` a la politica client u ocultar el control.
- HALLAZGO H2 (FALLIDO latente): `quotes/form/form.page.ts` asigna `this.workorders = responses[this.workorderId]` en la rama con orden precargada; no se manifiesta porque el selector esta deshabilitado.
- HALLAZGO H3: si falla el registro de evidencia tras subir el archivo, queda un archivo huerfano en `directus_files`.
- HALLAZGO H4: `AGENTS.md` dice que la subida de evidencias no esta implementada; el codigo actual si la implementa (selector, validacion, subida y miniaturas).
- Permisos verificados: assistant/mechanic con `create` en `evidence` y `directus_files`; mechanic con `create` en `quotes`, `quoteitems`, `quoteparts`; client solo lectura en `directus_files`.
- Paginacion: fuels 5 y methods 5 con `perPage=5` -> pagina 2 vacia (0 filas); el paginador oculta controles con una sola pagina. Control: services 10 -> pagina 2 con 5 filas.
- Pendiente: autorizacion para pruebas con sesion (login crea sesion/actividad) y para las correcciones C1-C4. Informe en Doc `Fase 4 VEXORA - Validacion funcional (solo lectura)`.

## Fase 5 - Correcciones controladas H2-H5 (2026-11-25, Freebuff)

- Alcance autorizado: H2 (indice de cotizacion), H3 (archivos huerfanos en evidencias), H4 (documentacion de evidencias) y H5 (avatar asignado por un administrador). **H1 queda pendiente.**
- Sin cambios de base de datos, usuarios, roles, permisos, politicas, RLS, `.env`, volumenes Docker, archivos existentes ni Git; sin rediseno de pantallas. No se ejecuto login ni ninguna escritura.

### H2 - Indice incorrecto en `pages/quotes/form/form.page.ts`
- **Antes:** en la rama con `workorderId` precargado se hacia `this.workorders = responses[this.workorderId]` (indice fuera de rango: en esa rama solo se piden servicios y refacciones) y luego se leian `responses[0]` y `responses[1]`.
- **Despues:** se usa el mismo contador `index` de la otra rama (`services = responses[0]`, `parts = responses[1]`); `workorders` queda vacio, que es correcto porque el selector esta deshabilitado con la orden precargada.
- **Prueba:** compilacion de produccion. No se creo ninguna cotizacion (escritura no autorizada).

### H3 - Archivos huerfanos al subir evidencias (`services/evidences/evidences.ts`)
- **Antes:** se subia el archivo a `/files` y, si fallaba el `POST` en `evidence`, el archivo quedaba huerfano sin un aviso especifico.
- **Despues:**
  - Validaciones previas antes de subir: formato permitido, orden presente y token de sesion.
  - Si Directus **responde rechazando** la fila, se borra unicamente el archivo creado por esa misma operacion (`DELETE /files/:id`, best-effort). Nunca se llama con un id anterior y nunca se borra ante un error de red (la fila pudo crearse y el archivo quedaria referenciado).
  - Si el borrado no esta permitido (assistant/mechanic no tienen `delete` en `directus_files`), el mensaje de error incluye el UUID para que un administrador lo limpie.
  - `pages/evidence/form` muestra el mensaje especifico del servicio en lugar del texto generico; los errores de axios conservan el mensaje generico en espanol.
- **Prueba:** compilacion. La prueba funcional del fallo requiere escrituras (archivo + fila) y no se ejecuto.

### H4 - Documentacion de evidencias
- `AGENTS.md`: el requisito 5 pasa de "NO implementada" a la descripcion real (validacion de formato/tamaño, subida a `/files`, fila en `evidence`, miniaturas autenticadas) y se añade el estado de Fase 5.
- `ESTADO_VEXORA.md`: se corrige el pendiente que declaraba la subida como no implementada y se añade esta seccion.

### H5 - Avatar asignado por un administrador (`pages/profile/profile.page.ts`)
- **Causa:** `saveProfile()` enviaba siempre `avatar`, aunque el usuario no lo hubiera tocado. Si un administrador habia asignado una foto (archivo con `uploaded_by` distinto), el endpoint `PATCH /vexora-profile/me` respondia 403 ("Solo puedes usar fotografias subidas por tu usuario") y el usuario no podia guardar nombre, apellido ni descripcion.
- **Correccion (cliente, sin permisos):** se envia `avatar` solo cuando el usuario elige una foto nueva (se sube como propia) o pulsa "Quitar foto" (`null`). Guardar el resto del perfil ya no revalida una foto ajena.
- **Conservado:** la regla del endpoint sigue rechazando apuntar el avatar a un archivo de otro usuario. No se modifico la extension ni el volumen `vexora_directus_extensions` (fuera de la autorizacion).
- **Prueba:** compilacion. La prueba funcional requiere sesion y escritura de perfil; no se ejecuto.

### Verificacion tecnica
- `npx ng build --configuration production` dentro de `moviles-ionic`: **EXIT 0**, 0 errores, `Hash: 9a3b3c91e3dc6fd6`, Build at `2026-11-25T21:11:03.238Z`.
- Sin escrituras en base de datos, sin login, sin cambios de permisos, volumenes ni operaciones Git.

### Pendiente
1. H1: el rol `client` no tiene `create` en `directus_files` y el perfil muestra "Subir foto" para todos los roles. Sin tocar (no autorizado).
2. Pruebas funcionales de H2, H3 y H5 con sesion y escritura: requieren autorizacion.
3. No fue necesario desplegar la extension de perfil: la correccion de H5 es solo de cliente.

## Fase 6 - Validacion de las correcciones de Fase 5 (2026-11-25, Freebuff)

- **Alcance:** H2, H3 y H5. Sin escrituras de negocio, sin archivos reales, sin cambios de permisos, `.env`, volumenes ni Git. Sin nuevas correcciones. La unica sesion creada fue el login real de `mechanic@vexora.dev`, autorizado para la prueba H2.
- **Metodo:** harness nuevo en `pruebas/fase6-entry.js` + `pruebas/fase6-validacion.mjs`. esbuild transpila **el codigo real de la app** y lo ejecuta en Node 22 dentro de `moviles-ionic`, con dobles de Angular/Ionic y un servidor HTTP simulado en `127.0.0.1:18999`. No se conecta a Directus ni a MariaDB.
- **Resultado: 11/11 OK, EXIT 0.**
  - **H2 (2 pruebas):** con orden precargada, `workorders` sigue siendo un arreglo (vacio) y `services`/`parts` se asignan desde `responses[0]`/`responses[1]`; sin orden precargada, las tres listas se asignan en orden; no se dispara la alerta de error.
  - **H3 (6 pruebas):** rechazo de Directus -> un unico `DELETE /files/<id>` del archivo recien subido, error con el UUID y cero `DELETE` sobre `evidence`; error de red -> **cero** `DELETE`; subida correcta -> archivo + evidencia y cero `DELETE`; formato invalido, orden ausente y sin token -> cero peticiones HTTP.
  - **H5 (3 pruebas):** avatar asignado por administrador -> el payload **no incluye** `avatar`; "Quitar foto" -> `avatar: null`; foto nueva -> `uploadAvatar` y `avatar` propio.
- **Integridad:** `PATCH /vexora-profile/me` sin sesion -> 401; `/server/ping` -> 200; conteos sin cambios (users 9, files 2, evidence 2, quotes 4, quoteitems 2, quoteparts 2).
- **Reproducir:** `export MSYS_NO_PATHCONV=1; docker cp pruebas/fase6-entry.js moviles-ionic:/tmp/fase6-entry.js && docker cp pruebas/fase6-validacion.mjs moviles-ionic:/tmp/fase6-validacion.mjs && docker exec moviles-ionic node /tmp/fase6-validacion.mjs`.
- **H2 validado E2E (2026-11-25, autorizado):** login real como `mechanic@vexora.dev` (rol mechanic confirmado por el filtro `mechanic_id=d034d515...`), Orden #16, boton "Nueva" -> modal "Nueva cotizacion". `GET /items/services?sort=id` y `GET /items/parts?sort=id` -> 200. Selector de Servicio con las 10 opciones reales; Refaccion con las 10 reales. Al elegir "Cambio de aceite y filtro": precio 350, importe 350, subtotal 350, IVA 56, total 406. Sin errores de consola. **Cero `POST`** en toda la sesion del modal (solo `GET`/`OPTIONS`). Cerrado con "Cancelar" sin guardar; la orden #16 sigue mostrando "Esta orden todavia no tiene cotizaciones". BD sin cambios: quotes 4, quoteitems 2, quoteparts 2, `MAX(quotes.id)` 5.
- **NO validado aun (requiere autorizacion):** fallo real de registro de evidencia contra Directus (H3) y guardado real de perfil con avatar ajeno (H5).
- **Archivos nuevos en este turno:** `pruebas/fase6-entry.js`, `pruebas/fase6-validacion.mjs`. Sin cambios en el codigo de la aplicacion.

## Fase 7 - H5: inspeccion de solo lectura (2026-11-25, Freebuff)

- `directus_users`: **9 usuarios, 0 con avatar** (`avatar` NULL en las 9 cuentas). No existe ningun avatar asignado que permita reproducir H5 con datos reales.
- `directus_files`: 2 archivos, **ambos subidos por `mechanic@vexora.dev`** (`d034d515-3219-4764-983a-6a70d8500805`): `2863f725-cb95-4b3f-a1d1-afc2f99dc5a7` (`evidencia-prueba.png`, 24.691 B) y `45fed52e-aa65-4a94-82d6-f2e90355510a` (`vexora_isotipo_app_2048.png`, 728.842 B).
- Endpoint desplegado: la regla de propiedad sigue activa (`/directus/extensions/vexora-profile/index.js`, lineas 120-129: rechaza con 403 si `uploaded_by` != usuario). SHA-256 `7321e4bd15388d7e83637a70eb4c230b58f71050957e8847f7bda072bcf10dee`, identico al del repositorio.
- **Conclusion:** H5 no se puede validar contra Directus sin escribir. Opcion A (sin archivos nuevos): asignar `2863f725...` como avatar de un usuario distinto de mechanic y revertir a NULL. Opcion B: subir un PNG temporal como admin, asignarlo, probar, revertir y borrarlo. Ambas requieren autorizacion expresa.
- **Sin escrituras:** no se modifico ningun usuario, archivo, permiso, `.env`, volumen ni Git. La validacion de H5 a nivel de codigo (3/3, Fase 6) sigue vigente.

## Fase 8 - H5: validacion automatizada sin escrituras (2026-11-25, Freebuff)

- **Pregunta:** si H5 se puede demostrar con el codigo real y respuestas simuladas, sin crear usuarios, subir archivos ni escribir en Directus.
- **Metodo:** harness nuevo `pruebas/fase7-h5-entry.js` + `pruebas/fase7-h5-validacion.mjs`. esbuild transpila el codigo real de `pages/profile/profile.page.ts` y `services/auth/auth.ts` (axios real, sin doble) y el endpoint real `directus/extensions/vexora-profile/index.js`, contra una base en memoria y un HTTP local en `127.0.0.1:18998`. Sin Directus, MariaDB, sesiones reales ni credenciales.
- **Resultado: 10/10 OK, EXIT 0.**
  - Carga: el perfil con avatar ajeno se lee y la foto se pide a `GET /assets/<id>` sin error.
  - Guardado sin tocar la foto: el payload **no incluye** `avatar`, `PATCH /vexora-profile/me` responde 200 y el avatar se conserva; cero `POST /files`.
  - **Regresion (evidencia del error original):** reenviar el avatar ajeno devuelve **403** "Solo puedes usar fotografias subidas por tu usuario" y no altera el avatar.
  - Reglas del endpoint real: 400 con avatar inexistente o mal formado; acepta un archivo con `uploaded_by` NULL; 401 sin sesion; 400 con campo no permitido (`role`), body vacio, nombre vacio, nombre >50 y descripcion >500.
  - "Quitar foto" envia `avatar: null` -> 200. Foto nueva -> `POST /files` -> avatar propio -> 200.
  - Cero peticiones a `/items/*` y cero `DELETE`.
- **Integridad:** users 9, files 2, avatars 0, evidence 2, quotes 4, quoteitems 2, quoteparts 2, revisions 410, sessions 290; identicos antes y despues. No se creo ninguna sesion (el login fue simulado).
- **Limite:** el transporte HTTP y la base son simulados; no cubre sesion real, permisos efectivos del rol, almacenamiento real del archivo ni la interfaz.
- **Estado de H5:** **VALIDADO A NIVEL DE CODIGO — PENDIENTE DE PRUEBA REAL.**
- **Reproducir:** `docker cp directus/extensions/vexora-profile/index.js moviles-ionic:/tmp/vexora-profile-index.mjs`, copiar los dos archivos de `pruebas/` a `/tmp` y ejecutar `docker exec moviles-ionic node /tmp/fase7-h5-validacion.mjs`.
- **Archivos nuevos:** `pruebas/fase7-h5-entry.js`, `pruebas/fase7-h5-validacion.mjs`. Sin cambios en el codigo de la aplicacion.

## Fase 9 - H3: validacion profunda de evidencias (2026-11-25, Freebuff)

- **Alcance:** validacion automatizada de la subida de evidencias con el codigo real. Sin archivos reales, sin escrituras en Directus, sin cambios de permisos ni Git.
- **Metodo:** harness nuevo `pruebas/fase8-h3-entry.js` + `pruebas/fase8-h3-validacion.mjs`. esbuild transpila y Node 22 ejecuta `services/evidences/evidences.ts`, `services/auth/auth.ts` (axios real) y `pages/evidence/form/form.page.ts`; solo se sustituyen `AlertController`, `LoadingController` y `ModalController` (interfaz). Directus simulado en `127.0.0.1:18997`.
- **Resultado: 20/20 OK, EXIT 0.**
  - **Validacion previa:** las cinco extensiones documentadas se aceptan (incluida mayuscula); `.txt`, `.gif` y nombre sin extension se rechazan sin ninguna peticion; orden ausente y sesion ausente tampoco generan peticiones; el formulario rechaza formato invalido y archivos de mas de 10 MB antes de subir.
  - **Rechazo de la fila:** exactamente un `DELETE /files/<id>` del archivo recien subido; cero `DELETE` sobre `evidence`; el mensaje incluye el UUID y el detalle del servidor.
  - **Limpieza no permitida (403) o con fallo de red:** se conserva el error original (nunca el 403) y no hay reintentos.
  - **Error de red al registrar:** cero `DELETE` (el estado no se puede confirmar).
  - **Error de red al subir:** no se intenta crear la fila y no se borra nada.
  - **Exito:** el archivo se conserva, la fila lleva `workorder_id`, `path`, `format` y `size`, se muestra "Evidencia guardada" y el modal se cierra con `{saved: true}`.
  - **Historial acumulado:** cero `DELETE /items/*`, cero `PATCH`/`PUT`, ningun `DELETE` sobre los dos UUID originales y todas las peticiones autenticadas salvo el login.
- **Integridad:** users 9, files 2, evidence 2, avatars 0, quotes 4, quoteitems 2, quoteparts 2, revisions 410, sessions 290; identicos antes y despues.
- **Observacion (sin cambiar codigo):** ante un error de red al registrar, el aviso dice "no se pudo registrar" aunque el resultado es desconocido. No afirma haber limpiado, pero convendria distinguir "rechazado" de "no confirmado".
- **Limite:** transporte HTTP y base simulados; no cubre los permisos reales de `delete` en `directus_files`, el almacenamiento real ni la interfaz.
- **Archivos nuevos:** `pruebas/fase8-h3-entry.js`, `pruebas/fase8-h3-validacion.mjs`. Sin cambios en el codigo de la aplicacion.

## Fase 10 - H1: fotografia de perfil segun permisos (2026-11-25, Freebuff)

- **Regla funcional autorizada:** Administrator, mechanic y assistant pueden subir, cambiar y quitar la fotografia; `client` no puede subir ni cambiar, pero conserva la visualizacion y la opcion de quitarla. Cierra el pendiente 1 de la Fase 5.
- **Cambio aplicado:**
  - `pages/profile/profile.page.ts`: nuevo getter `canUploadPhoto` que consulta el permiso real `auth.can('directus_files','create')`.
  - `pages/profile/profile.page.html`: el `<input type="file">` y el boton de subir/cambiar quedan dentro de `<ng-container *ngIf="canUploadPhoto">`. "Quitar foto" sigue fuera del bloque y condicionado a `avatarUrl`.
- **Sin cambios:** `role_actions.ts`, permisos, politicas, RLS, extensiones, usuarios, avatares, base, `.env`, volumenes ni Git. No se amplio ningun permiso.
- **Pruebas (harness `pruebas/fase9-h1-entry.js` + `pruebas/fase9-h1-validacion.mjs`, codigo real con permisos por rol): 11/11 OK, EXIT 0.**
  - Administrator, mechanic y assistant: `canUploadPhoto` = true.
  - `client`: `canUploadPhoto` = false; la plantilla tiene un unico `type="file"`, dentro del bloque condicional; "Quitar foto" queda fuera.
  - `client`: sigue viendo su avatar (`GET /assets/<id>`) y puede quitarlo (`avatar: null` -> 200).
  - `client`: guarda nombre, apellido y descripcion sin enviar `avatar` (200).
  - mechanic: con avatar asignado guarda sin reenviarlo (H5) y sigue pudiendo subir una foto nueva (200).
  - Cero peticiones a `/items/*` y cero `DELETE`.
- **Compilacion de produccion:** EXIT 0, `Hash: 24c65b674db888d1`, Build at `2026-11-25T22:03:35.695Z`.
- **Integridad:** users 9, files 2, avatars 0, evidence 2, revisions 410, sessions 291; identicos antes y despues (el login fue simulado).
- **Limite:** no se probo en navegador ni con sesion real; los permisos por rol se simularon con la forma real de `/permissions/me` (admin recibe todas las colecciones en `full`).
- **Archivos modificados:** `mobile/src/app/pages/profile/profile.page.ts`, `mobile/src/app/pages/profile/profile.page.html`. **Nuevos:** `pruebas/fase9-h1-entry.js`, `pruebas/fase9-h1-validacion.mjs`.

## Fase 11 - Correcciones de la auditoria general: H1, H2 y H3 (2026-11-25, Freebuff)

- **H1 - acceso por rol:** `app-routing.module.ts` añade un tercer parametro opcional `permission` a `viewRoute` y lo declara en las dos rutas con discrepancia real: `workorders/form` exige `workorders.update` y `evidences/form` exige `directus_files.create`. El guard ya validaba `access.permission`; ahora las rutas lo usan. No se modificaron `VIEW_ACCESS`, `role_actions.ts` ni permisos.
- **H2 - integridad de cotizaciones:** `pages/quotes/form/form.page.ts` incorpora `recalculateConcepts()` (recalcula importe de cada concepto y subtotal/impuesto/total con los valores actuales) y `validateConcepts()` (al menos un concepto, servicio/refaccion existentes en el catalogo, precio finito y >= 0, descuento 0-100, cantidad entera >= 1). Se ejecutan antes de cualquier POST. Si la creacion falla despues de existir la cabecera, el mensaje incluye el ID y advierte que puede quedar incompleta; no hay rechazo automatico, borrado ni reintentos. Las cotizaciones #1 y #4 no se tocaron.
- **H3 - HEIC/HEIF:** se conserva la aceptacion. Lista, detalle de evidencia y detalle de orden añaden `(error)` en la imagen; si el navegador no puede decodificar, muestran "El navegador no puede mostrar este formato (HEIC/HEIF). Descarga el archivo para verlo." y un boton de descarga del blob original. Sin dependencias nuevas.
- **Pruebas simuladas:** harness `pruebas/fase10-entry.js` + `fase10-validacion.mjs`: **20/20 OK, EXIT 0**. Incluye el `authGuard` real con Angular DI (Administrator/mechanic entran; assistant y client a `/forbidden`), el `FormPage` real de cotizaciones contra servidor HTTP local (recalculo 190/30.4/220.4; fallo del segundo concepto informa #77 sin DELETE ni PATCH) y las tres pantallas de evidencias.
- **Regresion:** fase 6 (11/11), fase 7 H5 (10/10), fase 8 H3 (20/20) y fase 9 H1 (11/11), todas EXIT 0. Total: 72 pruebas simuladas.
- **Compilacion de produccion:** EXIT 0, `Hash: 1e9452dcb59183c6`, Build at `2026-11-25T22:30:49.054Z`.
- **Integridad:** users 9, files 2, evidence 2, quotes 4, quoteitems 2, quoteparts 2, workorders 5, revisions 410, sessions 291; identicos antes y despues. Sin escrituras en Directus.
- **Pendiente real:** redireccion de assistant/client en navegador, guardado de cotizacion con fallo forzado y una evidencia HEIC real. No se probaron por requerir escrituras.
- **Archivos modificados:** `app-routing.module.ts`, `pages/quotes/form/form.page.ts`, `pages/evidence/list/list.page.ts|html`, `pages/evidence/detail/detail.page.ts|html`, `pages/workorders/detail/detail.page.ts|html`. **Nuevos:** `pruebas/fase10-entry.js`, `pruebas/fase10-validacion.mjs`.

## Fase 12 - Seguridad, limpieza de historial y cierre (2026-11-26, Freebuff)

### Seguridad de GitHub (completada)
- Historial reescrito con `git filter-branch` en todas las ramas locales y remotas: los valores literales (`Angelito04.`, `moviles-directus-clave-2026`, `admin@moviles.local`, `admin123`, `moviles123`) se reemplazaron por referencias a variables de entorno en `docker-compose.yml` y en la documentacion (`docs/correcciones/*.md`, `docs/manuales/01_listado_elementos.md`, `README.md`, `README-restaurar-directus.md`).
- `docker_moviles/workshop_backup.sql` (hashes argon2id) eliminado de todas las refs y del historial.
- Eliminados refs originales, stash, worktree obsoleto (`wind-reminder`) y commit-graph; `git gc --prune=now`.
- Push forzado de todas las ramas a `origin` (https://github.com/angeelvaleen/tallermecanico.git); `sounds/opti` publicada como nueva rama.
- Verificacion: `git log --all -S '<secreto>'` devuelve 0 resultados para cada valor; `workshop_backup.sql` ausente de todas las refs.

### Credenciales activas
- Los valores expuestos en el historial antiguo NO estan activos: login con `admin@vexora.dev / admin123` devuelve `INVALID_CREDENTIALS`; MariaDB rechaza `Angel`/`root` con `Angelito04.` (`Access denied`).
- El `.env` actual (gitignored) contiene valores regenerados el 2026-11-15 y no los valores expuestos; no se rotaron credenciales activas para no romper el sistema.
- Los nueve usuarios actuales se conservan (verificado: `directus_users = 9`).

### H-500 (marca vacia)
- Causa raiz: `saveBrand()` hacia `.trim()` despues de la validacion, por lo que un nombre solo de espacios pasaba `Validators.required` y llegaba a Directus vacio, provocando HTTP 500 (fallo de Directus 12.6.0 al traducir el error de indice unico).
- Correccion aplicada (siguiendo el patron de formularios reactivos de los manuales): se añadio `Validators.pattern(/\S/)` y su mensaje `pattern` en `mobile/src/app/pages/brands/form/form.page.ts`. Un duplicado real sigue respondiendo 400.
- Build de produccion: EXIT 0, Hash `c0f9cfc7835bfd01`, Build at `2026-11-26T03:21:50.346Z`.

### H-403 (archivo)
- No es defecto de la aplicacion: la ruta correcta es `DELETE /files/<id>`; `DELETE /items/files/<id>` devuelve 403. Era un error del script de pruebas. Sin cambios de codigo ni permisos.

### RLS
- Los fallos reportados eran falsos positivos: URL mal construida en el script y politicas de lectura permitidas por Directus. La lectura real respeta RLS (mechanic/assistant ven 9 usuarios, client ve solo su ficha). No se modificaron permisos.

### Infraestructura (verificada)
- Contenedores: `moviles-db` (healthy), `moviles-api` (Directus ping 200), `moviles-ionic` (200), `moviles-swagger` (200), `moviles-cloudbeaver` (200). Red `vexora_net`, volumenes `vexora_*` intactos.
- Entorno de pruebas aislado (`vexora_test_net`, `vexora_test_*`) sin residuos de PRU-FINAL. Conteos: brands 11, models 10, colors 10, fuels 5, methods 5, services 10, parts 10, vehicles 4, appointments 5, workorders 5, diagnoses 1, evidence 2, quotes 4, quoteitems 2, quoteparts 2, payment 2, files 2, users 9.

### Pendientes abiertos
- Escrituras desde la interfaz (cotizacion y evidencia) no se ejecutaron para no crear registros en la base original.
- Segunda pagina real de Combustibles y Metodos de pago (5 registros, perPage 5).
- Limpieza opcional de `console.log` de depuracion.
- Karma no ejecutable en el contenedor (sin Chrome); no es fallo de la aplicacion.
