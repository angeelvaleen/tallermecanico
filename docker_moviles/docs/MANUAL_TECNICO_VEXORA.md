# MANUAL TÉCNICO — VEXORA

Sistema de gestión de talleres mecánicos

**Proyecto:** VEXORA
**Repositorio:** angeelvaleen/tallermecanico
**Rama:** main
**Directorio local:** `C:\docker_moviles\docker_moviles`
**Frontend:** Ionic 8 + Angular 20 (NgModules, `standalone: false`)
**Backend:** Directus 12.6.0
**Base de datos:** MariaDB
**Entorno:** Docker (contenedores: `moviles-ionic`, `moviles-api`, `moviles-db`, `moviles-cloudbeaver`, `moviles-swagger`; proyecto Compose `vexora`)

> **Nota de alcance.** Este documento es una guía de estudio de la implementación real. Todas las rutas, clases, métodos y fragmentos fueron contrastados con el código del repositorio. No se documentan contraseñas, tokens ni credenciales. Las operaciones marcadas como **PENDIENTE** o **BLOQUEADO** no han sido validadas desde la interfaz y así deben presentarse en la exposición.

---

## 1. Introducción

### 1.1 Qué es VEXORA

VEXORA es una aplicación móvil/web para la gestión integral de un taller mecánico. Permite registrar vehículos, clientes, órdenes de trabajo, citas, cotizaciones, pagos, diagnósticos, evidencias fotográficas y catálogos auxiliares (marcas, modelos, colores, combustibles, refacciones, servicios, métodos de pago). El acceso está controlado por cuatro roles: `Administrator`, `client`, `mechanic` y `assistant`.

### 1.2 Qué problema resuelve

Centraliza la operación del taller: desde la recepción del vehículo hasta la entrega, pasando por diagnóstico, cotización, aprobación del cliente, pago y evidencia fotográfica. Evita el uso de hojas de cálculo dispersas y da trazabilidad a cada orden de trabajo. El aislamiento por rol garantiza que un cliente solo vea sus vehículos y órdenes, un mecánico solo las suyas, y el asistente solo las órdenes en curso.

### 1.3 Tecnologías utilizadas

| Capa | Tecnología | Función |
|---|---|---|
| Interfaz | Ionic 8 + Angular 20 | Páginas, componentes, navegación, tabs |
| HTTP | Axios + RxJS (`defer`, `map`) | Peticiones a Directus |
| Backend | Directus 12.6.0 | API REST, autenticación, archivos, permisos |
| Base de datos | MariaDB | Persistencia |
| Contenedores | Docker Compose | Orquestación de servicios |
| Documentación API | Swagger UI | Especificación OpenAPI |
| Seguridad | Extensión `vexora-rls` (hook) | Aislamiento por fila y protección de usuarios |

Versiones comprobadas (según `mobile/package.json`): Ionic 8.8.17, Angular 20.3.30, Capacitor 8.5.0.

### 1.4 Organización del proyecto

El repositorio raíz `docker_moviles/` contiene la infraestructura y la app. La carpeta `mobile/` contiene la aplicación Ionic/Angular y `directus/extensions/vexora-rls/` la extensión de seguridad.

```
docker_moviles/
├── docker-compose.yml
├── database/                     # scripts SQL de inicialización
├── directus/
│   └── extensions/
│       └── vexora-rls/           # hook de aislamiento (index.js + lib/rules.js)
├── docs/                         # manuales y correcciones
│   ├── correcciones/
│   └── manuales/
├── mobile/                       # aplicación Ionic/Angular
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   │   └── assets/
│   └── package.json
├── pruebas/                      # scripts E2E y de seguridad
└── seguridad/                    # scripts apply/verify/rollback + backups
```

---

## 2. Estructura del proyecto

### 2.1 Carpetas principales

- `docker_moviles/mobile/src/app/` — código de la aplicación.
  - `app-routing.module.ts` — rutas raíz, `viewRoute` y guard.
  - `app.component.*` — componente raíz; el `ion-menu` se renderiza solo para Administrator.
  - `components/` — `searchbar`, `pagination`, `toolbar`.
  - `constants/` — `view_access.ts` (matriz de acceso), `admin_menu.ts`, `role_actions.ts`.
  - `guard/auth-guard.ts` — guard funcional de sesión y autorización.
  - `pages/` — una carpeta por entidad, cada una con `list/`, `detail/`, `form/`.
  - `services/` — un servicio por entidad (axios + RxJS).
  - `tabs/` — contenedor de pestañas dinámicas por rol.
- `docker_moviles/directus/extensions/vexora-rls/` — extensión hook de Directus.
- `docker_moviles/seguridad/` — scripts de instalación, verificación y rollback.
- `docker_moviles/pruebas/` — `cierre-e2e.js`, `seguridad-s2s3.js`.

### 2.2 Archivos importantes

| Archivo | Propósito |
|---|---|
| `mobile/src/environments/environment.ts` | `apiUrl` (`http://localhost:8000/items`) y `authUrl` (`http://localhost:8000`) |
| `mobile/src/app/services/auth/auth.ts` | Sesión, perfil, permisos y gestión de usuarios |
| `mobile/src/app/guard/auth-guard.ts` | Valida sesión y rol/permiso por ruta |
| `mobile/src/app/constants/view_access.ts` | Matriz de roles por entidad/acción |
| `mobile/src/app/constants/role_actions.ts` | Acciones visibles por rol (botones) |
| `mobile/src/app/constants/admin_menu.ts` | Enlaces del menú administrativo |
| `mobile/src/app/app.component.html` | `ion-menu` exclusivo de Administrator |
| `docker_moviles/directus/extensions/vexora-rls/index.js` | Registro de hooks de seguridad |
| `docker_moviles/directus/extensions/vexora-rls/lib/rules.js` | Reglas de filtrado y validación |

### 2.3 Dónde realizar cambios futuros

- **Nueva entidad:** crear `pages/<entidad>/{list,detail,form}` y `services/<entidad>/`, registrar rutas en `app-routing.module.ts`, agregar la entrada en `view_access.ts` y, si aplica, en `admin_menu.ts` y `tabs.page.ts`.
- **Nueva acción por rol:** modificar `constants/role_actions.ts` (botones) y `constants/view_access.ts` (rutas).
- **Nueva regla de fila:** agregar la colección en `ITEM_COLLECTIONS` y su filtro en `scopeFilter` dentro de `lib/rules.js`, más la validación en `validateCreate/Update/Delete`.

---

## 3. Frontend (Ionic + Angular)

### 3.1 Cómo funciona Ionic/Angular en este proyecto

El proyecto usa **NgModules** (`standalone: false`). Cada página tiene su `*.module.ts` y `*-routing.module.ts`, y se carga de forma diferida (`loadChildren`) desde `app-routing.module.ts`. Angular resuelve la ruta, el guard decide si se puede activar y luego Ionic crea la página dentro de su pila de navegación.

El ciclo de vida de una página es clave:

- `ngOnInit()` se ejecuta **una sola vez**, cuando Angular crea el componente.
- `ionViewWillEnter()` se ejecuta **cada vez** que la página pasa a estar visible, incluida la vuelta desde un modal o otra página. Por eso los listados recargan datos ahí.

### 3.2 Módulos, páginas, componentes, servicios y rutas

- **Módulo** (`*.module.ts`): declara el componente y sus dependencias.
- **Página** (`*.page.ts`): clase con la lógica; `ionViewWillEnter` recarga datos.
- **Componente compartido**: `app-toolbar`, `app-searchbar`, `app-pagination`.
- **Servicio**: `@Injectable({ providedIn: 'root' })`, encapsula las llamadas HTTP.
- **Ruta**: entrada en `app-routing.module.ts` con `canActivate: [authGuard]` y `data.access` generado por `viewRoute`.

### 3.3 Conectar una página con su servicio (ejemplo real: marcas)

El listado de marcas (`pages/brands/list/list.page.ts`) inyecta `BrandServices` y llama a sus métodos dentro de `firstValueFrom`.

```typescript
// pages/brands/list/list.page.ts
constructor(
  private modalController: ModalController,
  private brandService: BrandServices,
) {}

async ionViewWillEnter(): Promise<void> {
  this.chargerData();
}

async loadBrands(): Promise<void> {
  try {
    this.brands = await firstValueFrom(
      this.brandService.list(this.currentPage, this.perPage, this.search)
    );
  } catch (error) {
    console.error('Error al cargar marcas:', error);
    this.loadError = true;
  }
}

async chargerTotal(): Promise<void> {
  this.total = await firstValueFrom(this.brandService.total(this.search));
}

async chargerData(): Promise<void> {
  this.loading = true;
  this.loadError = false;
  try {
    await this.chargerTotal();
    this.adjustCurrentPage();
    await this.loadBrands();
  } finally {
    this.loading = false;
  }
}
```

Paso a paso, cuando el usuario abre `/brands/list`:

1. El router carga el módulo de la página y Angular crea `ListPage`.
2. Ionic dispara `ionViewWillEnter()`.
3. `chargerData()` activa `loading`, limpia `loadError` y pide **primero el total**.
4. `firstValueFrom(this.brandService.total(...))` suscribe el Observable, dispara la petición y espera el primer valor.
5. `adjustCurrentPage()` corrige la página si el total cambió (por ejemplo, tras borrar el último elemento).
6. `loadBrands()` pide la página actual y asigna el arreglo a `this.brands`.
7. `loading = false` en el `finally`; la vista deja de mostrar el spinner y el `*ngFor` pinta las filas.

### 3.4 La petición HTTP real a Directus

`BrandServices` construye la URL una sola vez y arma la configuración de autenticación en cada llamada:

```typescript
// services/brands/brands.ts
@Injectable({ providedIn: 'root' })
export class BrandServices {
  private url = environment.apiUrl + '/brands';   // http://localhost:8000/items/brands

  constructor(private authService: AuthService) {}

  private getAuthConfig() {
    const token = this.authService.getAccessToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  list(page = 1, perPage = 3, search = ''): Observable<Brand[]> {
    return defer(() => axios.get<{ data: Brand[] }>(this.url, {
      ...this.getAuthConfig(),
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {
      ...this.getAuthConfig(),
      params: { 'aggregate[count]': '*', ...this.filter(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }
}
```

La URL final de un listado es, por ejemplo:

```
GET http://localhost:8000/items/brands?page=1&limit=5&sort=id
Authorization: Bearer <access_token>
```

Y la del contador:

```
GET http://localhost:8000/items/brands?aggregate[count]=*&page=1&limit=5
```

Respuesta típica de Directus (simplificada):

```json
{ "data": [ { "id": 1, "name": "Nissan", "is_active": true } ] }
```

Para el contador:

```json
{ "data": [ { "count": "7" } ] }
```

### 3.5 Cómo se recibe la respuesta y termina en pantalla

1. Axios recibe el JSON y lo entrega como `response`.
2. `response.data` es el cuerpo de Directus `{ data: [...] }`.
3. `response.data.data` es el arreglo real; `map` lo extrae del Observable.
4. `firstValueFrom` convierte ese Observable en una `Promise` y la resuelve con el arreglo.
5. `await` asigna el arreglo a `this.brands`.
6. La plantilla recorre `brands` con `*ngFor`; Angular detecta el cambio y renderiza.
7. El componente `app-pagination` recibe `total`, `perPage` y `currentPage` y calcula las páginas visibles.

### 3.6 Listados, detalles y formularios

- **Listado** (`*-list`): total + datos, paginación y búsqueda.
- **Detalle** (`*-view` / `detail`): consulta un registro por ID; algunos servicios expanden relaciones con `?fields=...`.
- **Formulario** (`*-form`): crea o edita el mismo componente; recibe `id` por `componentProps` cuando se abre como modal.

Patrón de carga con total y ajuste de página (idéntico en `brands`, `vehicles`, `workorders`, `appointments`, `payment`):

```typescript
async chargerData(): Promise<void> {
  this.loading = true;
  this.loadError = false;
  try {
    await this.chargerTotal();
    this.adjustCurrentPage();
    await this.loadBrands();
  } finally {
    this.loading = false;
  }
}
```

### 3.7 Buscadores y paginación

**Buscador.** `app-searchbar` emite `changeText` en cada entrada:

```typescript
// components/searchbar/searchbar.component.ts
@Input() value: string = '';
@Input() placeholder: string = 'Buscar...';
@Input() debounce: number = 300;
@Output() changeText = new EventEmitter<string>();

onInput(event: CustomEvent<{ value?: string | null }>): void {
  const text = event.detail.value ?? '';
  this.value = text;
  this.changeText.emit(text);
}
```

La página recibe el texto y reinicia la paginación:

```typescript
async handleInput(text: string): Promise<void> {
  this.search = text;
  this.currentPage = 1;
  await this.chargerData();
}
```

**Filtro en el servicio.** Se serializa a JSON y viaja como un único parámetro `filter`:

```typescript
// services/brands/brands.ts
private filter(search: string): Record<string, string> {
  const text = search.trim();
  return text ? { filter: JSON.stringify({ _or: [
    { name: { _icontains: text } },
  ] }) } : {};
}
```

**Paginación.** `app-pagination` calcula el total de páginas y emite `changePage`:

```typescript
// components/pagination/pagination.component.ts
ngOnChanges(): void {
  this.totalPages = Math.ceil(this.total / this.perPage);
  this.calculateVisiblesPages();
}

changerPage(page: number): void {
  if (page < 1 || page > this.totalPages || page === this.currentPage) return;
  this.changePage.emit(page);
}
```

La página responde recargando solo los datos:

```typescript
async changePage(page: number): Promise<void> {
  this.currentPage = page;
  this.loading = true;
  try {
    await this.loadBrands();
  } finally {
    this.loading = false;
  }
}
```

### 3.8 Toolbar compartido

`app-toolbar` muestra el botón de menú solo para Administrator (`showMenu && isAdmin`, con `isAdmin = auth.canByRole(['Administrator'])`). El botón para volver a órdenes aparece cuando `showBackToWorkorders` es verdadero: el usuario es Administrator y la ruta actual pertenece a `ADMIN_LIST_ROUTES`. El título se recibe por `@Input() name`.

---

## 4. Backend y base de datos

### 4.1 Qué es Directus y qué función cumple

Directus es el backend: expone una API REST sobre MariaDB, gestiona autenticación (JWT), permisos por rol/colección y almacenamiento de archivos. El frontend nunca accede a MariaDB; todo pasa por `http://localhost:8000`.

### 4.2 Conexión con MariaDB

Directus se conecta mediante variables de entorno del `docker-compose.yml` (`DB_CLIENT=mysql`, `DB_HOST=db`, `DB_PORT=3306`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD`). Los datos persisten en el volumen `mariadb_data`.

### 4.3 Colecciones

Cada entidad es una colección Directus: `users`, `roles`, `vehicles`, `workorders`, `appointments`, `quotes`, `quoteitems`, `quoteparts`, `payment`, `brands`, `models`, `colors`, `fuels`, `parts`, `services`, `methods`, `evidence`, `diagnoses`, `history`.

### 4.4 Relaciones

Claves foráneas principales:

- `vehicles.user_id` → `directus_users`
- `vehicles.model_id` → `models`; `models.brand_id` → `brands`
- `vehicles.fuel_id` → `fuels`; `vehicles.color_id` → `colors`
- `workorders.vehicle_id` → `vehicles`; `workorders.mechanic_id` → `directus_users`; `workorders.status_id` → estado
- `appointments.vehicle_id` → `vehicles`
- `quotes.workorder_id` → `workorders`
- `quoteitems.quote_id` / `quoteparts.quote_id` → `quotes`
- `payment.quote_id` → `quotes`; `payment.method_id` → `methods`; `payment.user_id` → `directus_users`
- `diagnoses.workorder_id`, `evidence.workorder_id`, `history.workorder_id` → `workorders`

### 4.5 Peticiones desde el frontend

Todas las peticiones de datos usan axios con `Authorization: Bearer <token>`. El token lo administra `AuthService` y cada servicio lo solicita con `getAuthConfig()`.

```typescript
private getAuthConfig() {
  const token = this.authService.getAccessToken();
  return { headers: { Authorization: `Bearer ${token}` } };
}
```

### 4.6 Obtención y presentación

Directus devuelve `{ data: ... }`; Axios lo envuelve en `response.data`, por eso el patrón es `response.data.data`. El total se obtiene con `aggregate[count]=*` y se convierte a número con `Number(...)`.

---

## 5. Roles y permisos

### 5.1 Los cuatro roles

- **Administrator**: acceso total (catálogos, usuarios, diagnóstico, evidencias, todas las tabs).
- **client**: tabs Órdenes, Citas, Vehículos, Pagos y Perfil. Ve solo sus propios registros.
- **mechanic**: tabs Órdenes y Perfil. Ve las órdenes asignadas.
- **assistant**: tabs Órdenes y Perfil. Ve las órdenes en curso (estados 4, 5 y 6).

Los nombres son sensibles a mayúsculas: `Administrator` lleva mayúscula inicial; los demás van en minúsculas.

### 5.2 Cómo se determina el rol (flujo real)

1. `AuthService.signin()` hace `POST /auth/login` con `{ email, password, mode: 'json' }`.
2. Directus responde `{ data: { access_token, refresh_token, expires } }`.
3. `save()` guarda token, refresh token y la fecha de expiración (`Date.now() + expires`).
4. Al navegar a una ruta protegida, `authGuard` llama `validateSession()`.
5. `validateSession()` comprueba `active()`; si expiró, llama `renew()`.
6. Luego `loadUserContext()` ejecuta en paralelo `getProfile()` (`/users/me`) y `getPermissions()` (`/permissions/me`).
7. `getRole()` devuelve `profile.role.name`; `getID()` devuelve `profile.id`.
8. `getAccessToken()` entrega el token que usan los servicios.

```typescript
// services/auth/auth.ts
getRole(): string | null {
  return this.profile?.role?.name ?? null;
}

getID(): string | null {
  return this.profile?.id ?? null;
}
```

### 5.3 Pestañas dinámicas

`tabs.page.ts` define `TABS` con un arreglo `roles` tomado de `VIEW_ACCESS` y filtra en cada entrada:

```typescript
ionViewWillEnter(): void {
  const role = this.auth.getRole() ?? '';
  this.tabs = TABS.filter(tab => tab.roles.includes(role));
  if (!this.tabs.length) {
    this.tabs = [TABS[0]];
  }
}
```

### 5.4 Menú lateral

El `ion-menu` completo está envuelto en `*ngIf="isAdmin"` en `app.component.html`. Los enlaces provienen de `constants/admin_menu.ts`: `ADMIN_CATALOG_LINKS` (Colores, Marcas, Modelos, Combustibles, Refacciones, Servicios, Métodos de pago) y `ADMIN_STANDALONE_LINKS` (Diagnóstico, Evidencias). Los listados administrativos se abren con `routerDirection="root"`.

### 5.5 Rutas protegidas y guard

`viewRoute()` en `app-routing.module.ts` genera la configuración de acceso:

```typescript
const viewRoute = (
  view: keyof typeof VIEW_ACCESS,
  action: ViewAction
) => ({
  canActivate: [authGuard],
  data: { access: { roles: VIEW_ACCESS[view][action] } }
});
```

`authGuard` ejecuta, en orden:

1. `await auth.validateSession()`; si falla, redirige a `/login` con `returnUrl`.
2. `await auth.loadUserContext()` para garantizar perfil y permisos.
3. Lee `route.data['access']`; si no hay restricción, permite.
4. Si `access.roles` no incluye el rol actual, redirige a `/forbidden`.
5. Si `access.permission`, comprueba `auth.can(collection, action)`; si no, `/forbidden`.
6. Ante cualquier excepción, registra el error y redirige a `/forbidden`.

### 5.6 Acciones por rol (botones)

`constants/role_actions.ts` decide qué botones se muestran (crear orden, agregar diagnóstico, aprobar cotización, etc.). Ejemplo real:

```typescript
workorders: {
  create: ['Administrator'],
  update: ['Administrator', 'mechanic'],
  addDiagnostic: ['mechanic', 'assistant'],
  addEvidence: ['mechanic', 'assistant'],
  addQuote: ['mechanic'],
}
```

Las páginas lo consultan con `authService.canByRole(ROLE_ACTIONS.workorders.create)` y guardan el resultado en propiedades como `canCreate` o `canAddEvidence`.

### 5.7 Extensión de seguridad `vexora-rls`

Ver la sección 9 para el detalle completo del hook, los archivos y las operaciones que controla.

---

## 6. Funcionalidades (flujo completo)

### 6.1 Perfil

**Qué hace:** muestra nombre, apellido, correo y rol del usuario autenticado; permite editar el perfil propio (nombre, apellido, descripción y fotografía), cerrar sesión y, si es Administrator, abrir la gestión de usuarios. Nunca permite cambiar el rol, el correo, la contraseña ni el estado.

**Archivos:** `pages/profile/profile.page.ts`, `profile.page.html`, `profile.page.scss`, `services/auth/auth.ts`, `directus/extensions/vexora-profile/*`.

**Flujo de lectura:**

1. Al crear la página, `ngOnInit()` llama `this.auth.getProfile()`.
2. `getProfile()` hace `GET /users/me?fields=id,email,first_name,last_name,description,avatar,role.id,role.name` con el token.
3. La respuesta se asigna a `this.profile`; `loading` pasa a `false` en el `finally`.
4. La plantilla muestra los campos en un formulario reactivo (`first_name`, `last_name`, `description`) y deja correo y rol como texto de solo lectura.
5. Si el perfil tiene `avatar`, `auth.assetObjectUrl()` descarga la imagen autenticada (`GET /assets/:id`, `responseType: blob`) y la muestra como object URL; al destruir la página se libera con `URL.revokeObjectURL`.
6. `get isAdmin()` usa `auth.canByRole(['Administrator'])`; si es true aparece el botón **Gestionar usuarios**.
7. **Cerrar sesión** ejecuta `auth.logout()`: intenta `POST /auth/logout` con el refresh token y, en el `finally`, `clean()` borra token, perfil y permisos. Luego navega a `/login` con `replaceUrl: true`.

**Flujo de edición (los 4 roles):**

1. **Guardar cambios** valida el formulario (`first_name` obligatorio, máximo 50; `last_name` máximo 50; `description` máximo 500).
2. Si se eligió una fotografía, `auth.uploadAvatar()` hace `POST /files` (multipart) y devuelve el id del archivo. La validación del cliente acepta JPG, PNG y WEBP de hasta 5 MB.
3. `auth.updateProfile()` hace `PATCH /vexora-profile/me` con `first_name`, `last_name`, `description` y `avatar`.
4. El endpoint `vexora-profile` toma el usuario de `req.accountability` (no del body) y aplica una lista blanca: `first_name`, `last_name`, `description`, `avatar`. Rechaza cualquier otro campo (`role`, `policies`, `email`, `password`, `status`, `id`) con 400.
5. El avatar debe existir en `directus_files` y, si tiene `uploaded_by`, pertenecer al mismo usuario; `avatar: null` quita la fotografía.
6. La respuesta actualiza el perfil en pantalla y muestra "Perfil actualizado correctamente.".

> **Por qué un endpoint propio:** en esta instalación Directus no aplica reglas custom de permisos (`permissions: null`; evidencia previa `RESOURCE_RESTRICTED`) y `PATCH /users/me` responde 403 para los roles de la app. Otorgar `update` sobre `directus_users` permitiría auto-escalado de rol. El endpoint local evita ese riesgo sin modificar permisos ni la extensión `vexora-rls`.

> **Observación:** el usuario Administrator original no tiene `first_name`/`last_name` cargados en la base; el formulario los muestra vacíos y exige el nombre antes de guardar. No es un defecto de la aplicación.

### 6.2 Gestión de usuarios

**Qué hace:** listar, ver detalle y crear/editar usuarios (solo Administrator).

**Archivos:** `pages/users/{list,detail,form}/*`, `services/auth/auth.ts` (`listUsers`, `listRoles`, `getUser`, `createUser`, `updateUser`).

**Flujo del listado:**

1. `ionViewWillEnter()` llama `loadUsers()`.
2. `firstValueFrom(this.auth.listUsers())` ejecuta `GET /users?fields=id,email,first_name,last_name,role.id,role.name,status&sort=first_name&limit=-1`.
3. El arreglo se asigna a `this.users`; la vista pinta correo, nombre y rol.
4. Si falla, `loadError = true` y se ofrece **Reintentar** (`retry()`).

**Flujo del detalle:**

1. `ngOnInit()` lee `route.snapshot.paramMap.get('id')`.
2. `firstValueFrom(this.auth.getUser(id))` ejecuta `GET /users/:id?fields=...`.
3. El usuario se asigna a `this.user`; si no hay ID, se desactiva la carga.

**Flujo del formulario:**

1. `ngOnInit()` se suscribe a `queryParamMap` para reaccionar a `?id=`.
2. `applyParams(id)` decide si es edición (`isEdition = !!id`) y crea el `FormGroup` con `FormBuilder`.
3. En creación, la contraseña es obligatoria y mínimo 8 caracteres; en edición es opcional.
4. `saveUser()` valida el formulario; si es inválido, `markAllAsTouched()` y termina.
5. En creación, `findDuplicateEmail()` recorre `listUsers()` y compara correos en minúsculas; si hay duplicado, muestra alerta y no guarda.
6. En creación llama `auth.createUser(...)` (`POST /users`); en edición `auth.updateUser(id, payload)` (`PATCH /users/:id`).
7. `describeError()` extrae el mensaje de Directus (`response.data.errors[0].message`) para mostrarlo.
8. Navega a `/users/list`.

```typescript
// services/auth/auth.ts
listUsers(): Observable<User[]> {
  return defer(() =>
    this.client.get<{ data: User[] }>('/users', {
      params: {
        fields: 'id,email,first_name,last_name,role.id,role.name,status',
        sort: 'first_name',
        limit: -1
      }
    })
  ).pipe(map(response => response.data.data));
}
```

> **PROBADO (UI):** alta y edición de usuarios desde la interfaz, con validaciones de campos obligatorios, selector de rol/estado y recarga del listado. **PENDIENTE:** la eliminación de usuarios no existe en la interfaz; no forma parte del diseño actual y agregarla requiere autorización.

### 6.3 Órdenes de trabajo

**Qué hace:** listar órdenes según el rol, crear (Administrator), editar (Administrator/mechanic), ver detalle y agregar diagnósticos, evidencias y cotizaciones.

**Archivos:** `pages/workorders/{list,detail,form}/*`, `services/workorders/workorders.ts`.

**Listado por rol** (`loadWorkorders()`):

```typescript
switch (this.userRole) {
  case 'Administrator':
    this.workorders = await firstValueFrom(
      this.workorderServices.list(this.currentPage, this.perPage, this.search));
    break;
  case 'client':
    this.workorders = await firstValueFrom(
      this.workorderServices.getMyWorkOrders(this.currentPage, this.perPage, this.search));
    break;
  case 'mechanic':
    this.workorders = await firstValueFrom(
      this.workorderServices.getWorkOrdersMechanic(this.currentPage, this.perPage, this.search));
    break;
  case 'assistant':
    this.workorders = await firstValueFrom(
      this.workorderServices.getWorkOrdersInProgress(this.currentPage, this.perPage, this.search));
    break;
}
```

**Filtro combinado.** El filtro de rol y el de búsqueda viajan en un único parámetro `filter` con `_and`; si se enviaran por separado, Directus descartaría la búsqueda:

```typescript
private scopedFilter(base: object, search: string): Record<string, string> {
  const searchFilter = this.filterObject(search);
  return {
    filter: JSON.stringify(
      searchFilter ? { _and: [base, searchFilter] } : base
    )
  };
}

getMyWorkOrders(page = 1, perPage = 3, search = ''): Observable<Workorder[]> {
  return defer(() => axios.get<{ data: Workorder[] }>(this.url, {
    ...this.getAuthConfig(),
    params: {
      page: page,
      limit: perPage,
      sort: ['-status_id', '-created_at'],
      ...this.scopedFilter(
        { vehicle_id: { user_id: { id: { _eq: this.authService.getID() } } } },
        search
      ),
    },
  })).pipe(map(response => response.data.data));
}
```

**Estados.** Se guardan como IDs y se muestran en español: 4 Recibida, 5 Diagnóstico, 6 Reparación, 7 Lista, 8 Entregada. En creación, la orden siempre inicia en 4.

**Detalle.** `chargerWorkorder()` ejecuta `detail(id)` (con `?fields=*,mechanic_id...,status_id...,vehicle_id...`), y luego, en paralelo, `chargerDiagnoses()`, `chargerEvidences()` y `chargerQuotes()`. El botón de cada acción depende de `ROLE_ACTIONS`.

**Formulario.** Carga vehículos (`listWithOutFilters`) y mecánicos (`getMechanicList`, que filtra `role.name = mechanic`). En edición hace `patchValue` con los datos expandidos y guarda con `update`; en creación fuerza `status_id = 4` y usa `create`.

### 6.4 Citas

**Qué hace:** listar citas (Administrator ve todas; client solo las de sus vehículos), crear y editar (client), confirmar (Administrator) y cancelar (Administrator/client).

**Archivos:** `pages/appointments/{list,detail,form,confirm}/*`, `services/appointments/appointments.ts`.

**Estados:** 1 Pendiente, 2 Confirmada, 3 Cancelada.

**Reglas de acción:** solo se edita, confirma o cancela una cita en estado 1 (`canEditAppointment`, `canConfirmAppointment`, `canCancelAppointment`).

**Cancelar:** muestra un `AlertController`; al confirmar, `executeCancelAppointment(id)` hace `PATCH /appointments/:id` con `{ status_id: 3 }` y recarga.

**Confirmar:** abre el modal `ConfirmPage`; el servicio expone `acceptedAppointment(id)` que hace `PATCH` con `{ status_id: 2 }`.

**Listado:** Administrator usa `list()`; client usa `getMyAppointments()`, que aplica el filtro `vehicle_id.user_id.id = usuario actual`.

### 6.5 Vehículos

**Qué hace:** listar vehículos (Administrator todos; client los suyos) y crear/editar (client).

**Archivos:** `pages/vehicles/{list,detail,form}/*`, `services/vehicles/vehicles.ts`.

**Listado:** usa `list()` o `getMyVehicles()` según el rol. El total se pide a `total()` o `totalMy()`.

**Detalle:** `detail(id)` expande relaciones:

```typescript
`${this.url}/${id}?fields=*,color_id.*,fuel_id.*,user_id.*,model_id.*,model_id.brand_id.*`
```

Así la vista puede mostrar marca, modelo, color, combustible y propietario sin consultas adicionales.

**Búsqueda:** `_or` sobre `plate` y `vin` con `_icontains`.

**Creación:** el formulario arma `VehicleCreate` con `model_id`, `user_id`, `fuel_id`, `color_id`, `plate`, `vin`, `year` y `mileage`.

### 6.6 Pagos

**Qué hace:** listar pagos (Administrator todos; client los suyos) y registrar pagos asociados a cotizaciones.

**Archivos:** `pages/payment/{list,detail,form}/*`, `services/payments/payments.ts`.

**Modelo:** `Payment` = `id`, `quote_id`, `user_id`, `method_id`, `amount`, `reference`, `paid_at`.

**Listado:** Administrator usa `list()` (orden por `id`); client usa `getMyPayments()`, que filtra `user_id.id = usuario actual` y ordena por `-paid_at`.

**Detalle:** `detail(id)` expande `quote_id.*`, `method_id.*`, `user_id.*`.

**Búsqueda:** `_icontains` sobre `reference`.

### 6.7 Catálogos

**Qué hace:** CRUD de marcas, modelos, colores, combustibles, refacciones, servicios y métodos de pago. Solo Administrator, accesible por el menú lateral.

**Archivos:** `pages/{brands,models,colors,fuels,parts,services,methods}/*` y sus servicios homónimos.

**Patrón común:** todos los servicios exponen `list`, `detail`, `create`, `update`, `delete` y `total`. Cada listado pide total, ajusta página y carga datos. Cada formulario es un modal con `FormGroup`, validaciones y alertas de éxito/error.

**Ejemplo de campos:** `Brand` (`id`, `name`, `is_active`, `created_at`); `Service` (`id`, `name`, `price`, `description`, `is_active`, `created_at`). `ServiceServices` busca por `name` **y** `description`.

**Menú:** los enlaces están en `ADMIN_CATALOG_LINKS` y se abren con `routerDirection="root"`.

### 6.8 Diagnóstico

**Qué hace:** listar diagnósticos y agregarlos/editar desde el detalle de una orden (Administrator, mechanic, assistant según la ruta).

**Archivos:** `pages/diagnoses/{list,detail,form}/*`, `services/diagnoses/diagnoses.ts`.

**Modelo:** `Diagnosis` = `id`, `workorder_id`, `description`, `result`, `created_at`.

**Listado global:** `listWithOutFilters()` hace `GET /items/diagnoses`.

**Por orden:** `ofWorkorder(id)` consulta:

```typescript
`${this.url}?filter[workorder_id][_eq]=${id}`
```

El detalle de la orden llama a este método y muestra los diagnósticos asociados.

**Formulario:** recibe `workorderId` por `componentProps`; al guardar hace `create` o `update` y devuelve `{ saved: true }` al modal padre, que recarga la lista.

### 6.9 Evidencias

**Qué hace:** subir y visualizar imágenes asociadas a una orden de trabajo.

**Archivos:** `pages/evidence/{list,detail,form}/*`, `services/evidences/evidences.ts`.

**Modelo:** `Evidence` = `id`, `workorder_id`, `path`, `format`, `size`, `created_at`. En `path` se guarda el **UUID del archivo** en Directus, no el nombre original.

**Subida (servicio):**

```typescript
upload(workorderId: number, file: File): Observable<Evidence> {
  const format = EvidenceServices.resolveFormat(file);

  if (!format) {
    return defer(() => { throw new Error("Formato no permitido"); });
  }

  return defer(async () => {
    const body = new FormData();
    body.append("file", file);

    const uploaded = await axios.post<{ data: { id: string } }>(
      environment.authUrl + "/files",
      body,
      { headers: { Authorization: `Bearer ${this.authService.getAccessToken()}` } },
    );

    const evidence = await axios.post<{ data: Evidence }>(
      this.url,
      { workorder_id: workorderId, path: uploaded.data.data.id, format: format, size: file.size },
      this.getAuthConfig(),
    );

    return evidence.data.data;
  });
}
```

**Validaciones del modal** (`form.page.ts`):

- `resolveFormat(file)` acepta `jpeg`, `jpg`, `png`, `heic`, `heif`.
- Si el formato no es válido, limpia el input y muestra alerta.
- Si `file.size > 10 * 1024 * 1024`, muestra "El tamaño máximo permitido es de 10 MB".

**Visualización:** `assetObjectUrl(fileId)` descarga el archivo como blob autenticado y crea un object URL:

```typescript
assetObjectUrl(fileId: string): Observable<string> {
  return defer(async () => {
    const response = await axios.get(this.assetUrl(fileId), {
      ...this.getAuthConfig(),
      responseType: "blob",
    });
    return URL.createObjectURL(response.data as Blob);
  });
}
```

`isFileReference(path)` comprueba con una expresión regular que `path` sea un UUID; solo entonces se intenta descargar la imagen. El detalle libera el object URL en `ngOnDestroy()` con `URL.revokeObjectURL(this.imageUrl)`.

> **PROBADO (UI):** la carga de una evidencia se ejecutó desde la interfaz en una orden temporal: se seleccionó un PNG, se subió a `/files`, se creó el registro en `evidence` y la miniatura se mostró en el detalle. La evidencia temporal y su archivo se eliminaron al terminar la prueba. Hoy el volumen `vexora_directus_uploads` conserva los archivos de las evidencias #5 y #9, y `/evidences/list` muestra ambas miniaturas.

---

## 7. Explicación del código

### 7.1 Imports

```typescript
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BrandServices, Brand } from 'src/app/services/brands/brands';
```

- `Component`: decorador que registra la clase como componente Angular.
- `firstValueFrom`: convierte un Observable en Promise con su primer valor.
- `BrandServices` / `Brand`: servicio e interfaz de la entidad.

### 7.2 Clases y decorador

```typescript
@Component({
  selector: 'app-brands-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage { ... }
```

`selector` es el nombre del componente; `templateUrl` y `styleUrls` apuntan a la vista y estilos; `standalone: false` indica que se declara en un NgModule.

### 7.3 Variables de estado

```typescript
total: number = 0;
currentPage: number = 1;
perPage: number = 5;
search: string = '';
brands: Brand[] = [];
loading: boolean = false;
loadError: boolean = false;
```

`currentPage`, `perPage` y `search` alimentan la petición; `total` alimenta la paginación; `loading` y `loadError` controlan spinner y botón de reintento.

### 7.4 Métodos y ciclo de vida

```typescript
async ionViewWillEnter(): Promise<void> { this.chargerData(); }
async loadBrands(): Promise<void> { ... }
private adjustCurrentPage(): void { ... }
```

- `ionViewWillEnter`: se dispara **cada vez** que la página entra en pantalla.
- `async` + `Promise<void>`: el método devuelve una promesa que se resuelve cuando termina.
- `private`: solo visible dentro de la clase.

### 7.5 Interfaces

```typescript
export interface Brand {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface BrandCreate {
  name: string;
}
```

`Brand` describe lo que devuelve el backend; `BrandCreate` describe lo que se envía al crear/editar (solo campos editables).

### 7.6 Observables y peticiones HTTP

Un **Observable** es un flujo de valores al que hay que suscribirse para que ocurra algo. Los servicios de VEXORA crean Observables **fríos**: no ejecutan la petición hasta que alguien se suscribe (por ejemplo, `firstValueFrom`).

### 7.7 `defer()`

```typescript
return defer(() => axios.get<{ data: Brand[] }>(this.url, config))
  .pipe(map(response => response.data.data));
```

`defer` recibe una función que **se ejecuta en el momento de la suscripción**. Ventajas en VEXORA:

1. La petición no se dispara al construir el componente.
2. Cada suscripción genera una petición nueva (no se reutiliza una respuesta vieja).
3. Permite capturar errores de validación dentro del propio flujo (caso de evidencias).

### 7.8 `map()`

```typescript
.pipe(map(response => response.data.data))
```

`map` transforma cada valor emitido. Aquí recibe la respuesta completa de Axios y devuelve solo el arreglo (o el objeto) de negocio, de modo que la página no conoce la forma `{ data: ... }`.

### 7.9 `firstValueFrom()`

```typescript
this.brands = await firstValueFrom(this.brandService.list(...));
```

Convierte el Observable en una Promise que se resuelve con el **primer** valor emitido (o se rechaza con el primer error). Permite usar `await` dentro de métodos `async`, que es el estilo predominante en VEXORA.

### 7.10 `Observable` vs `Promise`

| Aspecto | Observable | Promise |
|---|---|---|
| Valores | Puede emitir 0, 1 o muchos | Un único valor |
| Ejecución | Fría hasta suscribirse | Se ejecuta al crearse |
| Cancelación | `unsubscribe()` | No cancelable |
| Composición | `pipe`, `map`, `filter` | `then`, `catch` |

VEXORA usa Observables en los servicios (composición y `defer`) y Promises en las páginas (mediante `firstValueFrom` y `async/await`).

### 7.11 `async/await`

```typescript
async chargerData(): Promise<void> {
  this.loading = true;
  try {
    await this.chargerTotal();
    this.adjustCurrentPage();
    await this.loadBrands();
  } finally {
    this.loading = false;
  }
}
```

`await` pausa la función hasta que la promesa se resuelve, sin bloquear la interfaz. `try/finally` garantiza que `loading` vuelva a `false` aunque falle la petición.

### 7.12 Axios

- `axios.get(url, config)`: obtiene datos.
- `axios.post(url, body, config)`: crea.
- `axios.patch(url, body, config)`: actualiza parcialmente.
- `axios.delete(url, config)`: elimina.
- `config.headers.Authorization`: token Bearer.
- `config.params`: query string (página, límite, orden, filtro).
- `responseType: 'blob'`: descarga binaria (evidencias).

`AuthService` además crea una instancia con `axios.create({ baseURL: environment.authUrl })` y un interceptor que agrega el token automáticamente a las peticiones de esa instancia.

### 7.13 Operadores de filtros de Directus usados en VEXORA

| Operador | Significado | Ejemplo real |
|---|---|---|
| `_eq` | Igual a | `{ status_id: { _eq: 8 } }` |
| `_neq` | Distinto de | usado en pruebas de seguridad |
| `_in` | Dentro de una lista | `{ status_id: { _in: [4, 5, 6] } }` |
| `_icontains` | Contiene, sin distinguir mayúsculas | `{ name: { _icontains: 'nis' } }` |
| `_gte` | Mayor o igual | usado en pruebas de seguridad |
| `_and` | Todas las condiciones | `{ _and: [base, busqueda] }` |
| `_or` | Alguna condición | `{ _or: [{ plate: ... }, { vin: ... }] }` |

Ejemplo combinado real (búsqueda de órdenes):

```typescript
{
  _or: [
    { vehicle_id: { plate: { _icontains: text } } },
    { vehicle_id: { vin: { _icontains: text } } },
    { mechanic_id: { first_name: { _icontains: text } } },
    { mechanic_id: { last_name: { _icontains: text } } },
    { status_id: { name: { _icontains: text } } },
  ]
}
```

Los filtros se envían serializados: `params: { filter: JSON.stringify(filtro) }`.

### 7.14 Validaciones y manejo de errores

- Formularios con `FormBuilder`, `Validators.required`, `email`, `minLength`, `maxLength`, `min`, `pattern`.
- `getError(controlName)` solo muestra mensajes si el control fue tocado o modificado.
- Evidencias: formato y tamaño antes de subir.
- Usuarios: pre-chequeo de correo duplicado.
- Todos los listados capturan el error, marcan `loadError` y ofrecen `retry()`.

---

## 8. Pruebas

### 8.1 Cómo iniciar el proyecto

```powershell
cd C:\docker_moviles\docker_moviles
docker compose up -d
docker compose ps
```

Comprobar que los servicios estén `Up`. Frontend `http://localhost:8100`, backend `http://localhost:8000`, Swagger `http://localhost:8081`.

### 8.2 Comprobar frontend y backend

- Frontend: abrir `http://localhost:8100`; debe mostrar el login.
- Backend: `http://localhost:8000/server/specs/oas` devuelve el OpenAPI.
- Swagger UI: `http://localhost:8081`.

### 8.3 Probar los roles

Las cuentas de prueba existen en la base (`admin@vexora.dev`, `client@vexora.dev`, `mechanic@vexora.dev`, `assistant@vexora.dev`). **Las contraseñas no se documentan aquí**; deben solicitarse al administrador del proyecto. Para cada rol verificar:

- Tabs visibles (Administrator/client: 5; mechanic/assistant: 2).
- Menú lateral visible solo en Administrator.
- Perfil con correo y rol correctos.

### 8.4 Probar buscadores

En cada listado: término con coincidencias, término sin coincidencias (estado vacío) y limpieza del campo (restaura el listado).

### 8.5 Probar formularios y listados

Crear, editar y eliminar un registro temporal; comprobar que aparece en el listado y que la paginación se ajusta. Los registros temporales deben ser identificables y eliminarse al final.

### 8.6 Probar evidencias

Desde el detalle de una orden: abrir el modal, seleccionar una imagen válida (JPEG/JPG/PNG/HEIC/HEIF, ≤ 10 MB), subir y verificar que aparece y se visualiza. Limpiar el registro temporal.

> **Advertencia:** esta prueba **no está validada desde la interfaz**. El selector nativo de archivos impide la automatización; solo se verificó por API y por inspección de código.

### 8.7 Resultado esperado

Los listados cargan datos reales, las búsquedas filtran, los formularios guardan y los permisos restringen el acceso por rol.

---

## 9. Historial de modificaciones

### 9.1 Funcionalidades que ya existían

Login y registro; pestañas por rol; menú exclusivo de Administrator; perfil; gestión de usuarios; órdenes, citas, vehículos, pagos, cotizaciones, catálogos, diagnóstico y evidencias; búsqueda y paginación; extensión `vexora-rls`; 166 pruebas unitarias y 41 E2E aprobadas.

### 9.2 Funcionalidades conservadas

Todas las anteriores se conservaron intactas. No se eliminaron ni alteraron datos preexistentes (PRU-*, Evidencia #5, usuarios existentes).

### 9.3 Archivos modificados durante la validación

Ninguno de código. La validación fue de solo lectura en navegador y API.

### 9.4 Archivos nuevos

- `docker_moviles/docs/MANUAL_TECNICO_VEXORA.md` (este documento).

### 9.5 Correcciones realizadas

Ninguna corrección de código. Hallazgos cosméticos documentados como observaciones (Administrator sin nombre en BD; badge del panel de captura tapando el botón de menú).

---

## 10. Glosario

- **Angular**: framework de TypeScript para SPAs.
- **Ionic**: framework de UI móvil basado en componentes web.
- **Directus**: backend headless (API REST + admin) sobre SQL.
- **MariaDB**: base de datos relacional.
- **Axios**: cliente HTTP basado en promesas.
- **RxJS**: librería de programación reactiva.
- **Observable**: flujo de datos asíncrono al que hay que suscribirse.
- **Promise**: valor futuro de una operación asíncrona.
- **defer**: crea un Observable que ejecuta su función al suscribirse.
- **map**: operador que transforma cada valor emitido.
- **firstValueFrom**: convierte un Observable en Promise con el primer valor.
- **NgModules**: sistema de módulos de Angular.
- **standalone: false**: componente declarado en un NgModule.
- **ionViewWillEnter**: ciclo de vida Ionic al entrar en una página.
- **authGuard**: guard funcional que protege rutas.
- **JWT**: token de autenticación de Directus.
- **CORS**: política de origen cruzado del navegador.
- **CRUD**: Create, Read, Update, Delete.
- **`_icontains`**: búsqueda parcial sin distinguir mayúsculas.
- **`_and` / `_or`**: composición lógica de filtros.
- **`aggregate[count]`**: parámetro de Directus para contar registros.
- **Hook**: extensión de Directus que intercepta eventos (`items.query`, etc.).
- **Fail-closed**: ante un error de verificación, la petición se rechaza.

---

## Anexo A — Diagramas de flujo

### A.1 Página → Servicio → Directus → MariaDB → respuesta → interfaz

```
[Usuario abre /brands/list]
        │
        ▼
[ionViewWillEnter()]
        │
        ▼
[chargerData()]
        │
        ├──► [BrandServices.total()]
        │         │  defer + axios.get
        │         ▼
        │    [Directus /items/brands?aggregate[count]=*]
        │         │
        │         ▼
        │    [MariaDB: SELECT COUNT(*)]
        │         │
        │         ▼
        │    [{ "count": "7" }] ──► map(Number) ──► total = 7
        │
        ├──► [adjustCurrentPage()]
        │
        ▼
[BrandServices.list(page, perPage, search)]
        │  defer + axios.get + Bearer token
        ▼
[Directus /items/brands?page=1&limit=5&sort=id]
        │
        ▼
[MariaDB: SELECT ... LIMIT 5]
        │
        ▼
[{ "data": [ ...marcas... ] }]
        │
        ▼
[map(response => response.data.data)] ──► [Brand[]]
        │
        ▼
[firstValueFrom] ──► Promise resuelta
        │
        ▼
[this.brands = resultado]
        │
        ▼
[*ngFor pinta las filas] + [app-pagination recibe total]
```

### A.2 Inicio de sesión y determinación del rol

```
[Login: email + password]
        │
        ▼
[AuthService.signin()]
        │
        ▼
POST /auth/login { email, password, mode: 'json' }
        │
        ▼
[{ access_token, refresh_token, expires }]
        │
        ▼
[save(): token + refreshToken + expire]
        │
        ▼
[router.navigateByUrl('/tabs/workorders/list')]
        │
        ▼
[authGuard]
        │
        ▼
[validateSession()]
        │
        ├── active()? ──no──► renew() ──► POST .../auth/refresh
        │
        ▼
[loadUserContext()]
        │
        ├──► getProfile()  GET /users/me
        └──► getPermissions() GET /permissions/me
        │
        ▼
[profile.role.name] ──► getRole() = 'Administrator' | 'client' | 'mechanic' | 'assistant'
        │
        ▼
[TabsPage filtra TABS por rol]
```

### A.3 Navegación y autorización por rol

```
[Click en enlace / ruta]
        │
        ▼
[Router resuelve ruta]
        │
        ▼
[authGuard]
        │
        ├── validateSession() ──false──► /login?returnUrl=...
        │
        ▼
[route.data.access]
        │
        ├── sin restricción ──► true
        │
        ├── access.roles no incluye getRole() ──► /forbidden
        │
        └── access.permission && !auth.can(...) ──► /forbidden
        │
        ▼
[Página se activa]
        │
        ▼
[ionViewWillEnter() carga datos]
```

### A.4 Creación y edición de registros (ejemplo: marca)

```
[Listado /brands/list]
        │
        ├── Botón "Crear" ──► modal FormPage (sin id)
        │
        └── Botón "Editar" ──► modal FormPage (componentProps: { id })
                                   │
                                   ▼
                          [ngOnInit()]
                                   │
                                   ├── createForm()
                                   └── si isEdition: loadBrand() ──► detail(id)
                                   │
                                   ▼
                          [Usuario completa y guarda]
                                   │
                                   ▼
                          [saveBrand()]
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                    create(brand)     update(id, brand)
                          │                 │
                          ▼                 ▼
                    POST /items/brands  PATCH /items/brands/:id
                          │                 │
                          └────────┬────────┘
                                   ▼
                          [Alerta de éxito]
                                   │
                                   ▼
                          [modalController.dismiss({ saved: true })]
                                   │
                                   ▼
                    [Listado detecta data.saved y recarga]
```

### A.5 Carga y visualización de evidencias

```
[Detalle de orden] ──► addEvidence()
        │
        ▼
[Modal evidence/form (workorderId)]
        │
        ▼
[openFilePicker() → click en <input type="file">]
        │
        ▼
[onFileSelected()]
        │
        ├── resolveFormat() inválido ──► alerta + limpiar input
        ├── size > 10 MB ──► alerta + limpiar input
        └── válido ──► selectedFile = file
        │
        ▼
[saveEvidence()]
        │
        ▼
[firstValueFrom(EvidenceServices.upload(workorderId, file))]
        │
        ├──► POST /files (FormData) ──► { data: { id: UUID } }
        │
        └──► POST /items/evidence
                 { workorder_id, path: UUID, format, size }
        │
        ▼
[Alerta + modal.dismiss({ saved: true })]
        │
        ▼
[Detalle recarga chargerEvidences()]
        │
        ▼
[Listado de evidencias de la orden]
        │
        ▼
[Detalle de evidencia → assetObjectUrl(path)]
        │
        ▼
[GET /assets/:uuid con Bearer + responseType blob]
        │
        ▼
[URL.createObjectURL(blob) → <img src>]
        │
        ▼
[ngOnDestroy → URL.revokeObjectURL()]
```

---

## Anexo B — La extensión `vexora-rls` en detalle

### B.1 Qué es y cómo se carga

`vexora-rls` es una **extensión local de tipo hook** para Directus 12.6.0. Su `package.json` declara:

```json
"directus:extension": {
  "type": "hook",
  "path": "index.js",
  "source": "index.js",
  "host": "^12.6.0"
}
```

`index.js` exporta `registerHook({ filter }, { database, logger, getSchema })`. Al arrancar Directus, el hook se registra y a partir de ahí intercepta consultas y escrituras **antes** de que se construya el SQL. Por eso las reglas aplican a REST, GraphQL, filtros manipulados, agregaciones y operaciones masivas.

### B.2 Archivos que intervienen

| Archivo | Función |
|---|---|
| `directus/extensions/vexora-rls/index.js` | Registra los hooks y resuelve el rol del actor |
| `directus/extensions/vexora-rls/lib/rules.js` | Define filtros obligatorios, saneo de campos y validaciones de escritura |
| `directus/extensions/vexora-rls/package.json` | Metadatos de la extensión |
| `seguridad/instalar-extension.sh` | Copia la extensión al contenedor, reinicia y verifica |
| `seguridad/rollback-extension.sh` | Elimina la extensión y reinicia el API |
| `seguridad/apply.js` | Aplica permisos de fila en Directus (S1/S2/S3) y elimina lecturas públicas |
| `seguridad/verify.js` | Verificación de solo lectura del aislamiento |
| `seguridad/rollback.js` | Restaura `backup_permissions.json` |
| `seguridad/backup_*.json` | Respaldos de roles, políticas, permisos y accesos |

### B.3 Resolución del actor

`actorFor(context)` determina quién ejecuta la petición:

- `accountability` nulo → proceso interno (`kind: 'system'`), sin restricción.
- `accountability.admin === true` → administrador.
- Sin rol o sin usuario → `unknown` (se rechaza con 403).
- Con rol: consulta `directus_roles.name` (con caché de 30 s) y lo clasifica como `Administrator`, `client`, `mechanic`, `assistant` o `unknown`.

```javascript
async function roleNameFor(roleId, db) {
  const cached = roleCache.get(roleId);
  if (cached && cached.expires > Date.now()) return cached.name;
  const row = await db('directus_roles').select('name').where('id', roleId).first();
  if (!row || typeof row.name !== 'string') return null;
  roleCache.set(roleId, { name: row.name, expires: Date.now() + ROLE_CACHE_TTL });
  return row.name;
}
```

### B.4 Hooks registrados y operaciones que controla

```javascript
filter('items.query',  scopeQuery);
filter('items.create', scopeWrite('create'));
filter('items.update', scopeWrite('update'));
filter('items.delete', scopeWrite('delete'));

filter('users.query',  scopeUsersQuery);
filter('users.create', scopeUsersWrite('create'));
filter('users.update', scopeUsersWrite('update'));
filter('users.delete', scopeUsersWrite('delete'));
```

- `items.query` / `users.query`: inyectan un filtro obligatorio en las lecturas.
- `items.create/update/delete` y `users.create/update/delete`: validan la propiedad antes de escribir.

### B.5 Cómo protege los registros según el rol

`scopeFilter(role, userId, collection)` en `lib/rules.js` define el filtro obligatorio:

**client**

| Colección | Filtro |
|---|---|
| `vehicles` | `{ user_id: { _eq: userId } }` |
| `appointments` | `{ vehicle_id: { user_id: { _eq: userId } } }` |
| `workorders` | `{ vehicle_id: { user_id: { _eq: userId } } }` |
| `quotes` | `{ workorder_id: { vehicle_id: { user_id: { _eq: userId } } } }` |
| `quoteitems` / `quoteparts` | `{ quote_id: { workorder_id: { vehicle_id: { user_id: { _eq: userId } } } } }` |
| `payment` | `{ quote_id: { workorder_id: { vehicle_id: { user_id: { _eq: userId } } } } }` |
| `diagnoses` / `evidence` / `history` | `{ workorder_id: { vehicle_id: { user_id: { _eq: userId } } } }` |
| `directus_users` | `{ id: { _eq: userId } }` |

**mechanic**

| Colección | Filtro |
|---|---|
| `workorders` | `{ mechanic_id: { _eq: userId } }` |
| `quotes` | `{ workorder_id: { mechanic_id: { _eq: userId } } }` |
| `quoteitems` / `quoteparts` | `{ quote_id: { workorder_id: { mechanic_id: { _eq: userId } } } }` |
| `diagnoses` / `evidence` / `history` | `{ workorder_id: { mechanic_id: { _eq: userId } } }` |
| `vehicles` | `{ id: { _in: [ids de vehículos de sus órdenes] } }` |

**assistant**: `scopeQuery` **no aplica filtro** desde la extensión (`if (actor.kind === 'assistant') return query;`). La restricción del asistente a los estados 4, 5 y 6 proviene de los permisos de Directus configurados por `seguridad/apply.js` (`status_id: { _in: [4, 5, 6] }`).

**Administrator y procesos internos**: sin restricción.

### B.6 Cómo se inyecta el filtro

`applyQueryScope(query, collection, actor, schema)`:

1. Obtiene el filtro obligatorio con `scopeFilter`.
2. Si es `null` (colección no protegida o rol sin restricción), devuelve la consulta intacta.
3. Si el filtro original no es un objeto válido, lanza `forbidden()` (nunca se reemplaza la regla).
4. Si hay filtro original, lo combina con `{ _and: [mandatory, original] }`; si no, usa solo el obligatorio.
5. Sanea los campos con `sanitizeFields`.

```javascript
const hasOriginal = isPlainObject(original) && Object.keys(original).length > 0;
scoped.filter = hasOriginal ? { _and: [mandatory, original] } : mandatory;
scoped.fields = sanitizeFields(collection, query ? query.fields : undefined, schema, actor);
```

Esto significa que **manipular el filtro desde el cliente no sirve**: el filtro obligatorio siempre se antepone con `_and`.

### B.7 Protección de usuarios (S3)

Para `client`, `sanitizeFields` limita `directus_users` a `USER_SELF_FIELDS` (sin `token`, `tfa_secret`, `auth_data`, `external_identifier` ni hash de contraseña). Al expandir relaciones hacia usuarios (`mechanic_id.*`, `vehicle_id.user_id.*`), `sanitizeRelationPath` reduce los campos a `USER_RELATION_FIELDS` (`id`, `first_name`, `last_name`) o a `role.id`/`role.name`; cualquier otro campo se descarta. Así un cliente no puede leer correos ni datos privados de otros usuarios a través de relaciones.

### B.8 Verificación de escrituras

Antes de crear, actualizar o eliminar, la extensión comprueba la propiedad real en la base:

- `assertKeysOwned`: verifica que las claves pertenezcan al usuario (con joins a `vehicles`/`workorders`/`quotes`).
- `assertVehicleOwnedByUser`, `assertWorkorderOwnedByUser`, `assertQuoteOwnedByUser`: validan la relación del payload.
- `validateCreate`: en `vehicles` fuerza `user_id = actor.userId`; en `payment` fuerza el usuario y exige una cotización propia.
- `validateUpdate` / `validateDelete`: verifican las claves y, si el payload cambia una relación, que la nueva también sea propia.

Si algo no coincide, lanza `forbidden()` (403). Si ocurre un error inesperado, el wrapper `hook()` registra el error y lanza `unavailable()` (503): el sistema es **fail-closed**, nunca ejecuta una consulta sin filtro.

### B.9 Instalación y verificación

`instalar-extension.sh`:

1. Comprueba que existan `index.js` y `package.json`.
2. Verifica que `moviles-api` esté en ejecución.
3. Copia la extensión al volumen (`docker cp`) y ajusta permisos.
4. Reinicia el contenedor y espera `/server/ping`.
5. Comprueba en los logs que `vexora-rls` aparezca en "Loaded extensions".
6. Si hay credenciales en el entorno, ejecuta una prueba de humo: admin ve 5 usuarios, client 1, assistant 5.
7. Si algo falla, restaura el estado anterior.

`verify.js` es de solo lectura: inicia sesión con cada rol, consulta colecciones y registra en una tabla el estado, el número de filas y el código de error. Comprueba S1 (anónimo), S2 (aislamiento por fila) y S3 (protección de usuarios), incluidos intentos de manipulación de filtros (`_or`, `_neq`, `_gte`, filtros vacíos) y consultas GraphQL.

`rollback.js` restaura los permisos desde `backup_permissions.json`; `rollback-extension.sh` elimina la carpeta de la extensión y reinicia el API. La fila de `directus_extensions` queda inerte hasta una reinstalación.

---

## Anexo C — Validación funcional (resumen)

### C.1 Pruebas realizadas

| Módulo | Prueba | Resultado | Observaciones |
|---|---|---|---|
| Servicios | Listado (API) | PROBADO | La API devuelve los servicios; la página carga vía `ionViewWillEnter` |
| Combustibles | Listado (API) | PROBADO | La API devuelve los combustibles |
| Métodos de pago | Listado (API) | PROBADO | La API devuelve los métodos |
| Buscadores | Filtros `_icontains` + `_or` | PROBADO (API + código) | Términos con y sin coincidencias |
| Gestión de usuarios | Listado (API) | PROBADO | `GET /users` devuelve los usuarios |
| Gestión de usuarios | Detalle / formulario | PROBADO (UI) | Alta, edición, validaciones y carga de datos reales; sin eliminación en la UI |
| Evidencias | Subida / visualización (API) | PROBADO | Flujo por API verificado; registro temporal eliminado |
| Evidencias | Carga desde la UI | PROBADO (UI) | PNG subido desde el modal; miniatura visible en detalle y listado |
| Combustibles | Buscador + paginación | PROBADO (UI) | `Gas`→2, `Híbrido`→1, `zzzz`→0; total 5 |
| Métodos de pago | Buscador + paginación | PROBADO (UI) | `Tarjeta`→2, `zzzz`→0; total 5 |
| Paginación | Cambio de página | PROBADO (UI) | Servicios: página 2 con otros 5 registros; total 10 |

### C.2 Pruebas ya verificadas (anteriores)

Login de los 4 roles, tabs por rol, menú exclusivo de Administrator, perfil, navegación, restricciones de acceso, listados de órdenes/citas/vehículos/cotizaciones/pagos, visualización de evidencias, búsquedas, seguridad S2/S3 (166 unitarias + 41 E2E).

### C.3 Pendientes y bloqueos (no presentar como probado)

- **PENDIENTE (por diseño):** eliminación de usuarios desde la interfaz; no existe botón de borrado.
- **PENDIENTE (requiere datos):** segunda página real en Combustibles y Métodos de pago (hoy tienen 5 registros y `perPage = 5`).
- **PROBADO (2026-11-24/25):** el modal de cotización se abrió desde la orden #16 con la sesión de `mechanic@vexora.dev` (la orden está asignada a `d034d515…`). Se verificaron la orden precargada (solo lectura), los catálogos, el cálculo con IVA 16 % (servicio 800 + refacción 120×3 = subtotal 1160, IVA 185.60, total 1345.60), las validaciones y el cierre con Cancelar. No se guardó la cotización para no crear registros; `val.final.mechanic` (`11ee6068…`) sigue viendo 0 órdenes y 403 en la orden #16 por el aislamiento de `vexora-rls`.
- **IMPLEMENTADO Y PROBADO (2026-11-24/25):** edición del perfil propio para los 4 roles mediante el endpoint local `vexora-profile` y la página `pages/profile`. Permite nombre, apellido, descripción y fotografía (subir, cambiar y quitar), con validación de tipo/tamaño y lista blanca de campos; no permite rol, correo, contraseña ni estado. Probado en UI con `val.final.mechanic`, `val.final.client`, `val.final.assistant` y `val.final.admin`; el guardado se verificó en MariaDB y se restauraron los valores de prueba. No se modificaron permisos de Directus ni `vexora-rls`.

### C.4 Estado de Git

Sin commits, push ni cambios de rama. Los archivos modificados y sin seguimiento son preexistentes. En esta tarea solo se modificó este manual.

### C.5 Referencias consultadas

- Repositorio del compañero `https://github.com/JonathanDeLaCruz/docker_moviles` y su carpeta `docs/manuales/` (19 manuales). Los más afines a VEXORA: 09 (menú), 10 (búsqueda), 11 (servicios), 12 (login/registro), 13 (guard), 15 (subir archivos), 16 (imagen en formulario/detalle), 17 (campos de formulario), 18 (tabs por colección).
- Manuales locales: `docs/manuales/01_listado_elementos.md` y `docs/correcciones/01..03`.

VEXORA conserva el estilo del compañero (NgModules, servicios con axios + `defer` + `map`, `firstValueFrom`, `ionViewWillEnter`, paginación y búsqueda con `_icontains`), organizado en carpetas por entidad.

---

## Anexo D — Preguntas de exposición y respuestas

**1. ¿Qué arquitectura tiene VEXORA?**
Aplicación Ionic/Angular con NgModules que consume una API REST de Directus sobre MariaDB. El frontend se organiza por entidades (`pages/<entidad>` y `services/<entidad>`); Directus gestiona autenticación, permisos y archivos.

**2. ¿Por qué usan `ionViewWillEnter` y no solo `ngOnInit`?**
Porque Ionic reutiliza páginas en su pila. `ngOnInit` corre una sola vez, pero `ionViewWillEnter` se ejecuta cada vez que la página vuelve a estar visible, lo que permite recargar listados tras crear o editar en un modal.

**3. ¿Qué hace exactamente `firstValueFrom`?**
Convierte un Observable en una Promise que se resuelve con su primer valor. Así las páginas pueden usar `await` y `try/catch` en lugar de suscribirse manualmente.

**4. ¿Por qué los servicios usan `defer`?**
Para que la petición no se ejecute al construir el Observable, sino al suscribirse. Cada suscripción genera una petición nueva y los errores pueden manejarse dentro del flujo.

**5. ¿Qué hace `map(response => response.data.data)`?**
Axios entrega `response.data` (cuerpo de Directus) y Directus envuelve el resultado en otra propiedad `data`. El operador extrae el arreglo u objeto de negocio y lo emite tipado.

**6. ¿Cómo se autentica una petición?**
`AuthService` guarda el `access_token` del login. Cada servicio llama `getAuthConfig()` y agrega `Authorization: Bearer <token>`. La instancia de `AuthService` además tiene un interceptor que agrega el token automáticamente.

**7. ¿Cómo se obtiene el rol del usuario?**
Tras el login, `validateSession()` llama `loadUserContext()`, que pide `/users/me` y `/permissions/me`. `getRole()` devuelve `profile.role.name`.

**8. ¿Cómo se protege una ruta?**
Con `authGuard` y `data.access.roles` generado por `viewRoute`. El guard valida sesión, carga el contexto, compara el rol y redirige a `/forbidden` si no coincide.

**9. ¿Cómo se decide qué tabs ve cada rol?**
`tabs.page.ts` define `TABS` con un arreglo `roles` tomado de `VIEW_ACCESS`; en `ionViewWillEnter` filtra por el rol actual.

**10. ¿Por qué el menú solo lo ve el Administrator?**
Porque el `ion-menu` completo está dentro de `*ngIf="isAdmin"` en `app.component.html`, y el botón del toolbar (`app-toolbar`) solo se muestra con `*ngIf="showMenu && isAdmin"`, donde `isAdmin` usa `auth.canByRole(['Administrator'])`.

**11. ¿Cómo funciona la búsqueda?**
`app-searchbar` emite el texto; la página resetea a la página 1 y recarga. El servicio serializa un filtro Directus con `_icontains` y `_or` en el parámetro `filter`.

**12. ¿Por qué el filtro de rol y el de búsqueda van juntos?**
Porque Directus descarta la búsqueda si se envían dos parámetros `filter`. `scopedFilter` los combina con `_and` en un único JSON.

**13. ¿Qué diferencia hay entre `_and` y `_or`?**
`_and` exige que se cumplan todas las condiciones; `_or` basta con una. El aislamiento por rol usa `_and` para no perder la restricción; la búsqueda usa `_or` entre campos.

**14. ¿Cómo se obtiene el total para la paginación?**
Con `aggregate[count]=*`. El servicio convierte el conteo a número y la página calcula `Math.ceil(total / perPage)`.

**15. ¿Cómo se crea y edita un registro?**
El listado abre el formulario como modal. Si recibe `id`, es edición y precarga con `patchValue`; si no, es creación. Al guardar hace `POST` o `PATCH`, muestra alerta y devuelve `{ saved: true }` para que el listado recargue.

**16. ¿Qué estados tiene una orden de trabajo?**
4 Recibida, 5 Diagnóstico, 6 Reparación, 7 Lista, 8 Entregada. Las nuevas órdenes inician en 4.

**17. ¿Qué estados tiene una cita?**
1 Pendiente, 2 Confirmada, 3 Cancelada. Solo se edita, confirma o cancela en estado 1.

**18. ¿Cómo se sube una evidencia?**
El modal valida formato y tamaño; el servicio sube el archivo a `/files`, obtiene el UUID y crea el registro en `evidence` con `workorder_id`, `path`, `format` y `size`.

**19. ¿Cómo se visualiza una evidencia?**
Se descarga el asset con el token (`responseType: 'blob'`), se crea un object URL y se usa en `<img>`. Al destruir la página se libera con `revokeObjectURL`.

**20. ¿Qué es `vexora-rls`?**
Una extensión hook de Directus que inyecta filtros obligatorios por rol en las consultas y valida la propiedad en las escrituras, antes de construir el SQL.

**21. ¿Cómo evita que un cliente vea datos de otro?**
`scopeFilter` agrega `{ user_id: { _eq: userId } }` (o la relación equivalente) y `applyQueryScope` lo combina con `_and`. Aunque el cliente manipule el filtro, la restricción se mantiene.

**22. ¿Qué pasa si la extensión no puede determinar el rol?**
Lanza `forbidden()` (403). Si ocurre un error inesperado, el wrapper lanza `unavailable()` (503). Es fail-closed: nunca ejecuta una consulta sin filtro.

**23. ¿Cómo se protegen los datos de usuarios?**
`sanitizeFields` limita los campos a `USER_SELF_FIELDS` para el propio usuario y `sanitizeRelationPath` reduce las relaciones a `id`, `first_name`, `last_name` y `role.id/name`, evitando correos y secretos.

**24. ¿Cómo se verifica que la seguridad funciona?**
Con `seguridad/verify.js` (solo lectura) y los scripts de pruebas S2/S3, que intentan accesos anónimos, filtros manipulados, IDs ajenos y consultas GraphQL.

**25. ¿Qué pasa si se desinstala la extensión?**
Se ejecuta `rollback-extension.sh`, que elimina la carpeta y reinicia el API. Los datos no se tocan; la fila de `directus_extensions` queda inerte. Hay que advertir que S2/S3 vuelven a estar expuestas.

**26. ¿Qué diferencia hay entre los permisos de Directus y la extensión?**
`apply.js` configura los permisos por rol en Directus (S1/S2/S3); la extensión refuerza el aislamiento a nivel de hook, incluyendo filtros manipulados y relaciones anidadas.

**27. ¿Por qué usan MariaDB y no otra base?**
Porque Directus la soporta de forma nativa y el proyecto ya está dockerizado con ese motor; los datos persisten en un volumen.

**28. ¿Qué se probó y qué no?**
Se probaron login con los 4 roles, tabs por rol, menú exclusivo de Administrator, perfil editable (nombre, apellido, descripción y fotografía), listados, búsquedas, paginación, alta y edición de usuarios, carga y visualización de evidencias, modal de cotización como mecánico y seguridad. Quedan **pendientes**: eliminación de usuarios (no existe en la UI), segunda página real en Combustibles y Métodos (solo 5 registros; el componente ya está validado con Servicios) y guardado real de una cotización (crearía registros; no se ejecutó).

---

## Anexo E — Observaciones y advertencias

- El Administrator no tiene `first_name`/`last_name` en la base; el perfil muestra "—".
- El badge del panel de captura puede tapar el botón de menú; no es un defecto de la aplicación.
- No se documentan contraseñas ni tokens; deben solicitarse al administrador.
- Las operaciones de usuarios desde la interfaz y la carga visual de evidencias **no están validadas** y así deben presentarse.
