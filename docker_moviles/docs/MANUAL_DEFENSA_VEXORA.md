# MANUAL DE DEFENSA — VEXORA

**Sistema de gestión de taller mecánico**
Stack: Ionic 8 + Angular 20 (NgModules, `standalone: false`) · Directus 12.6.0 · MariaDB 11.8 · Docker Compose
Ruta del proyecto: `C:\docker_moviles\docker_moviles\docker_moviles`
Repositorio base: `angeelvaleen/tallermecanico` (commit `05294bf`)
Última revisión funcional: Freebuff (turno 2026-11-22)

> Este manual complementa `docs/MANUAL_TECNICO_VEXORA.md` y `docs/REVISION_MANUALES_PROFESOR.md`. Se basa en el código real del árbol `docker_moviles/`, no en informes anteriores.

---

## 1. Arquitectura de VEXORA

VEXORA es una aplicación móvil/web de una sola página (SPA) construida con Ionic + Angular que consume una API REST generada por Directus sobre MariaDB. Toda la persistencia vive en MariaDB; Directus expone las colecciones como endpoints `/items/<coleccion>` y gestiona autenticación, permisos (RLS) y archivos.

Flujo de una operación típica:

```
Ionic (localhost:8100)
   |
   | GET/POST/PATCH/DELETE /items/<coleccion>  (Authorization: Bearer <token>)
   v
Directus (localhost:8000)  --permisos por rol, hooks vexora-rls
   |
   v
MariaDB (workshop)
```

Archivos clave:
- `mobile/src/environments/environment.ts`: `apiUrl = 'http://localhost:8000/items'`, `authUrl = 'http://localhost:8000'`.
- `mobile/src/app/services/auth/auth.ts`: `login()`, `getAccessToken()`, `getRole()`, `canByRole()`.
- `docker-compose.yml`: servicios `moviles-db`, `moviles-api`, `moviles-ionic`, `moviles-cloudbeaver`, `moviles-swagger`; red `vexora_net`; volúmenes `vexora_*`.

Decisión importante: la sesión se guarda **en memoria** (`access_token` en el servicio). Al recargar la página se vuelve a iniciar sesión. Esto es intencional y está documentado.

---

## 2. Organización de carpetas

```
docker_moviles/
├── .env                      (no se modifica ni se commitea)
├── docker-compose.yml
├── ESTADO_VEXORA.md
├── README.md
├── database/                 (scripts SQL iniciales)
├── directus/
│   ├── extensions/vexora-rls/ (index.js, lib/rules.js)  <- RLS por rol
│   └── ...
├── docs/
│   ├── DOCUMENTACION_FINAL.md
│   ├── MANUAL_TECNICO_VEXORA.md
│   ├── REVISION_MANUALES_PROFESOR.md
│   ├── MANUALES_DEFENSA... (este)
│   ├── correcciones/
│   └── manuales/             (manual 01 del profesor)
├── mobile/                   (app Ionic/Angular)
│   └── src/app/
│       ├── app.component.*   (menú lateral, solo Administrator)
│       ├── app-routing.module.ts
│       ├── components/       (toolbar, searchbar, pagination)
│       ├── constants/        (view_access.ts, role_actions.ts)
│       ├── guard/            (auth-guard.ts)
│       ├── pages/            (un módulo por dominio)
│       ├── services/         (un servicio por colección)
│       └── tabs/             (tabs por rol)
├── pruebas/                  (seguridad-s2s3.js, cierre-e2e.js, ...)
├── respaldos/                (respaldos del 2026-11-21 + workshop_backup.sql)
└── seguridad/                (instalar-extension.sh, rollback-extension.sh, verify.js)
```

Regla de estilo (AGENTS.md): código original `angeelvaleen/tallermecanico@05294bf` es la referencia; NgModules con `standalone: false`, `FormBuilder`/`Validators`, `AlertController`/`ModalController`, `firstValueFrom`, servicios por colección. No se introdujeron patrones nuevos.

---

## 3. Ionic y Angular

- Páginas generadas con `ionic g page ...` → estructura `list/detail/form` + `*-routing.module.ts` + `*.module.ts`.
- `standalone: false` (configurado en `angular.json`), por lo que cada página declara su NgModule y se importa en su módulo.
- Rutas protegidas por `authGuard` (`guard/auth-guard.ts`) que usa `createUrlTree()` con `returnUrl`.
- Servicios usan `defer()` + `map()` + `firstValueFrom()` de RxJS y Axios para HTTP.
- Cada servicio adjunta `Authorization: Bearer <token>` desde `AuthService`.

Ejemplo real de servicio (`services/fuels/fuels.ts`):
```ts
list(page = 1, perPage = 3, search = ''): Observable<Fuel[]> {
  return defer(() => axios.get<{ data: Fuel[] }>(this.url, {...this.getAuthConfig(),
    params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
  })).pipe(map(response => response.data.data));
}
```

---

## 4. Componentes, páginas y servicios

Componentes reutilizables (`components/`):
- `toolbar`: `@Input() name`, `@Input() color`, botones por `ng-content`.
- `searchbar`: `@Input() value/placeholder/debounce`, `@Output() changeText: EventEmitter<string>`.
- `pagination`: `@Input() total/perPage/currentPage/maxVisiblePage`, `@Output() changePage: EventEmitter<number>`.

Páginas por dominio (`pages/<dominio>/{list,detail,form}`):
Marcas, Modelos, Colores, Combustibles, Métodos de pago, Servicios, Refacciones, Vehículos, Citas, Órdenes de trabajo, Cotizaciones, Diagnósticos, Evidencias, Historial, Pagos, Login, Registro, Perfil, Usuarios.

Servicios (`services/`): uno por colección + `auth`.

---

## 5. Rutas y guards

- `app-routing.module.ts`: rutas raíz con `canActivate: [authGuard]` y `data.access.roles`.
- `guard/auth-guard.ts`: si no hay sesión → `/login?returnUrl=...`; si el rol no está en `VIEW_ACCESS[view][action]` → `/forbidden`.
- `constants/view_access.ts`: matriz de acceso por vista/acción/rol.
- `/forbidden` redirige a `/tabs/workorders/list` con `replaceUrl` (corregido; no usa `location.back()`).

---

## 6. Directus y MariaDB

- Directus 12.6.0 expone `/items/<coleccion>`, `/auth/login`, `/files`, `/assets/:id`, `/users`, `/permissions/me`.
- MariaDB 11.8, base `workshop`, 18 tablas de negocio.
- Extensión local `vexora-rls` (`directus/extensions/vexora-rls/`): hooks `items.*` y `users.*` que acotan por rol (S2/S3). No interviene en `/assets` ni `directus_files`.
- CORS habilitado en Directus para `localhost:8100`.

---

## 7. Colecciones y relaciones

Colecciones principales: `brands`, `models`, `colors`, `fuels`, `methods`, `services`, `parts`, `vehicles`, `appointments`, `workorders`, `diagnoses`, `evidence`, `quotes`, `quoteitems`, `quoteparts`, `payments`, `history`, `users`.

Relaciones clave:
- `vehicles` → `brands`, `models`, `colors`, `fuels`, `users` (propietario).
- `workorders` → `vehicles`, `users` (mecánico).
- `diagnoses`, `evidence`, `quotes` → `workorders`.
- `quotes` → `quoteitems` (servicios) y `quoteparts` (refacciones) — relación muchos a muchos adaptada.
- `payments` → `quotes`/`workorders`.

---

## 8. Roles y permisos

Roles exactos: `Administrator`, `client`, `mechanic`, `assistant`.

Navegación por tabs:
- Administrator y client: Órdenes, Citas, Vehículos, Pagos, Perfil.
- mechanic y assistant: Órdenes, Perfil.

Menú lateral (`app.component.html`): solo para `Administrator` (`*ngIf="isAdmin"`), contiene Catálogos, Diagnóstico, Evidencias. Sin duplicar pestañas.

Permisos Directus: 84 importados; RLS por rol en `vexora-rls`. No se conceden permisos generales para resolver errores.

---

## 9. Formularios y validaciones

- Formularios reactivos con `FormBuilder` + `Validators` (`required`, `email`, `minLength`, etc.).
- `markAllAsTouched()` al guardar para mostrar errores.
- Validación de duplicados: pre-chequeo + error de Directus (usuarios).
- Modales para catálogos y diagnósticos/evidencias/cotizaciones (`ModalController`, breakpoints `[0, 0.5, 0.95]`, `initialBreakpoint: 0.95`).
- `expandToScroll: false` en `createQuote()` para que el cuerpo del modal desplace correctamente.
- Formularios en página para usuarios y vehículos (`?id=` para alternar nuevo/editar).

---

## 10. Búsquedas y paginación

- `components/searchbar`: debounce 300 ms, emite `changeText`.
- Servicios construyen filtro Directus: `{ _or: [{ name: { _icontains: text } }] }` y `page`/`limit`.
- `components/pagination`: `total`, `perPage`, `currentPage`, `maxVisiblePage`, emite `changePage`.
- Cada servicio expone `list(page, perPage, search)` y `total(search)`.
- Aplicado a: marcas, modelos, colores, combustibles, métodos, servicios, refacciones, vehículos, citas, órdenes, diagnósticos, evidencias, cotizaciones, pagos, historial, usuarios.
- Combustibles y Métodos de pago: agregado buscador y paginación real (módulos importados `SearchbarModule`/`PaginationModule`).

---

## 11. Carga y visualización de imágenes (Evidencias)

Flujo completo:
1. `EvidenceServices.upload(workorderId, file)` valida formato (`EVIDENCE_FORMATS`), sube a `/files` (FormData), crea registro en `evidence` con `path = UUID del archivo`.
2. Visualización: `assetObjectUrl(fileId)` descarga el archivo autenticado como `Blob` (`responseType: 'blob'`) y devuelve `URL.createObjectURL(...)`.
3. Las páginas `workorders/detail` y `evidence/list` precargan las miniaturas en `chargerEvidenceThumbs()`/`chargerThumbs()` y las liberan en `ngOnDestroy()` (`URL.revokeObjectURL`).
4. `isFileReference(path)` valida que `path` sea un UUID antes de intentar descargar.

Verificado con admin: `/workorders/detail/16` muestra "Evidencia #9"; `/evidences/list` muestra 2 evidencias con miniaturas. Sin token → `/assets/:id` devuelve 403. Acceso por rol respetado (no se modifican permisos).

---

## 12. Recorridos reales de las operaciones

### Login
`pages/login` → `AuthService.login(email, password)` → `POST /auth/login` con `mode: 'json'` → guarda `access_token` en memoria → redirige a `/tabs/workorders/list` (o `returnUrl`).

### Crear vehículo (client)
`pages/vehicles/form` → `VehiclesService.create()` → `POST /items/vehicles` con `Authorization: Bearer` → recarga lista.

### Crear orden de trabajo (mechanic)
`pages/workorders/form` → `WorkorderServices.create()` → `POST /items/workorders`.

### Agregar diagnóstico/evidencia/cotización (desde detalle de orden)
`workorders/detail` → `addDiagnosis()`/`addEvidence()`/`createQuote()` abren modales con `workorderId` precargado → al cerrar con `saved: true` recarga la sección.

### Cotización → Aprobación → Pago
Mecánico crea cotización (servicios/refacciones con cantidad y precio, subtotal/IVA/total). Cliente aprueba/rechaza. Pago se registra contra la cotización/orden.

### Subir evidencia
`evidence/form` → selección de archivo → `EvidenceServices.upload()` → `/files` + `/items/evidence`.

---

## 13. Funciones y archivos importantes

- `mobile/src/app/app.component.ts`: `isAdmin`, `catalogLinks`, `standaloneLinks` (menú lateral).
- `mobile/src/app/constants/view_access.ts`: `VIEW_ACCESS`.
- `mobile/src/app/constants/role_actions.ts`: `ROLE_ACTIONS` (addDiagnostic, addEvidence, addQuote, approve/reject).
- `mobile/src/app/guard/auth-guard.ts`: `authGuard`.
- `mobile/src/app/services/auth/auth.ts`: `login`, `getAccessToken`, `getRole`, `canByRole`.
- `mobile/src/app/services/evidences/evidences.ts`: `upload`, `assetUrl`, `assetObjectUrl`, `isFileReference`, `resolveFormat`.
- `mobile/src/app/pages/workorders/detail/detail.page.ts`: `chargerWorkorder`, `chargerEvidences`, `chargerEvidenceThumbs`, `hasEvidenceFile`.
- `mobile/src/app/pages/evidence/list/list.page.ts`: `chargerEvidences`, `chargerThumbs`, `hasFile`.
- `directus/extensions/vexora-rls/index.js` + `lib/rules.js`: hooks de RLS.
- `docker-compose.yml`: 5 `container_name` (`moviles-*`), volúmenes `vexora_*`, red `vexora_net`.

---

## 14. Problemas encontrados y soluciones

1. **Menú lateral estático (14 módulos para todos los roles)** → corregido: `*ngIf="isAdmin"` en `app.component.html`; menú solo Administrator con Catálogos/Diagnóstico/Evidencias.
2. **Aviso "podrás crear otra cotización" visible a roles que no crean cotizaciones** → `*ngIf="canAddQuote && !canCreateQuote()"` en `workorders/detail/detail.page.html`.
3. **`console.log(this.workorder)` de depuración** → presente pero no rompe funcionalidad (pendiente de limpieza opcional).
4. **Bug original `search.trim` sin `()` en `services/parts/parts.ts`** → corregido (rompía el buscador de Refacciones).
5. **Combustibles y Métodos de pago sin buscador/paginación** → agregado `app-searchbar` + `app-pagination` y módulos `SearchbarModule`/`PaginationModule` importados.
6. **Fallo de compilación por módulos no importados** (fuels/methods) → corregido importando `FormPageModule`, `SearchbarModule`, `PaginationModule`.
7. **Evidencias no visibles para Administrator** → implementadas miniaturas autenticadas con `assetObjectUrl` + `isFileReference`; verificado en navegador (workorder 16 y evidences/list).
8. **Modal "Nueva cotización" no desplazaba en breakpoints intermedios** → `expandToScroll: false`.
9. **Nombres de contenedores Docker** → restaurados a `moviles-*` (5 `container_name`), conservando volúmenes `vexora_*`, red `vexora_net`, puertos y variables.
10. **Carpetas duplicadas (L1/L2/L3)** → diagnosticado: L2 es raíz Git utilizable, L3 es directorio real de Docker; L1 es clon viejo duplicado. No se movieron carpetas (pendiente de autorización).

---

## 15. Preguntas y respuestas para la exposición

### Básicas
**P: ¿Qué es VEXORA?** R: Sistema de gestión de taller mecánico (órdenes, citas, vehículos, pagos, cotizaciones, diagnósticos, evidencias).
**P: ¿Qué tecnologías usa?** R: Ionic 8 + Angular 20 (NgModules), Directus 12.6.0, MariaDB 11.8, Docker Compose.
**P: ¿Cómo se comunica el frontend con el backend?** R: HTTP REST a Directus (`/items/<coleccion>`) con `Authorization: Bearer <token>` vía Axios.
**P: ¿Dónde se guardan los datos?** R: MariaDB `workshop`; Directus expone las colecciones.

### Intermedias
**P: ¿Cómo se implementa el control de acceso?** R: `authGuard` + `VIEW_ACCESS` (matriz rol/vista/acción) + RLS en Directus (`vexora-rls`). Menú lateral solo para Administrator.
**P: ¿Cómo se pagina?** R: `page`/`limit` en Directus + `aggregate[count]` para el total + componente `pagination`.
**P: ¿Cómo se busca?** R: `_icontains` en filtro `_or`, debounce 300 ms en `searchbar`.
**P: ¿Cómo se suben imágenes?** R: `FormData` a `/files`, se guarda el UUID en `evidence.path`, visualización con blob autenticado (`assetObjectUrl`).
**P: ¿Por qué la sesión se pierde al recargar?** R: El token se guarda en memoria (decisión de diseño); al recargar se vuelve a iniciar sesión.
**P: ¿Por qué no se borran catálogos desde la UI?** R: Riesgo de integridad referencial (claves foráneas); borrado verificado solo por API.

### Avanzadas
**P: ¿Qué es `expandToScroll: false` y por qué?** R: Opción del modal de Ionic; evita que el modal se expanda a pantalla completa en breakpoints intermedios, permitiendo desplazar el contenido del formulario largo.
**P: ¿Cómo se evita que un usuario cambie su propio rol?** R: Directus bloquea (403) la edición de `role` por el propio usuario; verificado por API.
**P: ¿Cómo funciona la RLS de `vexora-rls`?** R: Hooks `items.*`/`users.*` que acotan consultas por `mechanic_id`/`user_id` según el rol; no interviene en `/assets`.
**P: ¿Cómo se calculan los totales de una cotización?** R: `calculateTotals()` en `quotes/form` suma importes de `quoteitems` + `quoteparts` con IVA.
**P: ¿Cómo se garantiza que un mecánico solo vea sus órdenes?** R: Filtro `mechanic_id` en `WorkorderServices` + RLS en Directus.

---

## 16. Guía de estudio paso a paso

1. Lee `AGENTS.md` y `ESTADO_VEXORA.md` para el contexto.
2. Levanta el entorno: `docker compose up -d` en `docker_moviles/`; abre `http://localhost:8100`.
3. Inicia sesión con los 4 roles y recorre Órdenes.
4. Revisa `constants/view_access.ts` y `guard/auth-guard.ts` (seguridad).
5. Revisa `services/evidences/evidences.ts` (subida/visualización de archivos).
6. Revisa `pages/workorders/detail/detail.page.ts` (relaciones: diagnósticos, evidencias, cotizaciones).
7. Revisa `pages/quotes/form/form.page.ts` (FormArray, totales).
8. Revisa `directus/extensions/vexora-rls/` (RLS).
9. Lee `docs/REVISION_MANUALES_PROFESOR.md` (técnicas aplicadas).
10. Practica las preguntas de la sección 15.

---

## 17. Estado final de módulos (2026-11-22)

| Módulo | Listado | Detalle | Formulario | Búsqueda | Paginación | Estado |
|---|---|---|---|---|---|---|
| Marcas | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI/API) |
| Modelos | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI/API) |
| Colores | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI/API) |
| Combustibles | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI): buscador y paginación |
| Métodos de pago | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI): buscador y paginación |
| Servicios | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI): búsqueda y 2 páginas |
| Refacciones | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI/API) |
| Vehículos | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI client) |
| Citas | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI): búsqueda por placa/VIN/cliente |
| Órdenes | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI 4 roles; detalle #16) |
| Cotizaciones | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI detalle #5; modal en turno previo con `mechanic@vexora.dev`; pendiente con `val.final.mechanic` por asignación) |
| Diagnósticos | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI: modal abierto en orden #16) |
| Evidencias | ✅ | ✅ | ✅ | — | ✅ | Probado (UI admin/assistant; miniaturas) |
| Historial | ✅ | ✅ | — | — | — | Implementado; sin datos y formulario vacío |
| Pagos | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI admin/client) |
| Login/Registro | ✅ | — | ✅ | — | — | Probado (UI 4 roles) |
| Perfil | ✅ | ✅ | ✅ | ✅ | ✅ | Probado (UI 4 roles: lectura + edición propia con foto) |
| Usuarios | ✅ | ✅ | ✅ | — | — | Probado (UI alta/edición/detalle) |

Leyenda: ✅ implementado/probado · — no aplica o no existe.

---

## 18. Pendientes reales

- `val.final.mechanic` no abre `/workorders/detail/16`: la orden está asignada a `mechanic@vexora.dev`, no a `val.final.mechanic`. La lista filtrada da 0 y el detalle 403 por el aislamiento de `vexora-rls`; no es un bug de consulta ni de permisos. El modal de cotización ya se probó con `mechanic@vexora.dev` (orden #16).
- Guardado real de una cotización desde la UI: los cálculos y validaciones están probados, pero no se guardó para no crear registros. Requiere autorización.
- Segunda página real en Combustibles y Métodos de pago: hoy tienen 5 registros y `perPage = 5`; probar el cambio de página exige crear registros temporales (requiere autorización). La paginación del componente ya se validó con Servicios.
- Subida real de una evidencia (archivo) desde la UI: el modal está implementado y probado hasta el selector; la creación de archivos requiere autorización.
- Eliminación de usuarios desde la interfaz: no existe; agregarla requiere autorización.
- Limpieza opcional de `console.log` de depuración.
- Agregar respaldos a `.gitignore` (pendiente de autorización; contienen hashes).
- Decisión sobre carpetas L1/L2/L3 y volúmenes `docker_moviles_*` (pendiente de autorización).
- Commit/push (pendiente de autorización).

---

## 19. Ubicación del manual de estudio

- `docs/MANUAL_DEFENSA_VEXORA.md` (este archivo)
- `docs/MANUAL_TECNICO_VEXORA.md` (manual técnico completo)
- `docs/REVISION_MANUALES_PROFESOR.md` (clasificación de manuales del profesor)

No se modificó `.env` ni se alteraron permisos, roles o esquema de Directus. Las pruebas de perfil editaron temporalmente nombre/apellido/descripción del propietario de la cuenta y luego se restauraron; los archivos de prueba se eliminaron. No se ejecutó `docker compose down -v` ni `git reset --hard`/`git clean`.
