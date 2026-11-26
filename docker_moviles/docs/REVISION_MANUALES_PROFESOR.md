# Revisión de los manuales del profesor aplicados a VEXORA

**Proyecto:** VEXORA — gestión de taller mecánico
**Referencia revisada:** manuales de `JonathanDeLaCruz/docker_moviles` (`docs/manuales/`, 20 documentos)
**Método:** cada manual se contrastó contra el código real (`mobile/src/app/**`) y, cuando fue posible, contra la interfaz en ejecución. No se usó como prueba ningún informe anterior.
**Regla:** no se copiaron productos, pedidos ni categorías. Se adaptó el procedimiento técnico al dominio del taller.

> Este documento complementa `MANUAL_TECNICO_VEXORA.md` y `MANUAL_DEFENSA_VEXORA.md`. No sustituye a `ESTADO_VEXORA.md`.

---

## 1. Clasificación solicitada (5 categorías)

| Categoría | Manuales |
|---|---|
| **YA IMPLEMENTADA** | 01, 02, 03a, 03b, 04a, 04b, 06, 07, 08, 09, 10, 11, 12, 13, 15, 16, 17 |
| **APLICA Y FALTA IMPLEMENTAR** | Ninguno. Todas las técnicas aplicables ya existen en el código. |
| **APLICA, PERO REQUIERE ADAPTACIÓN** | 14 (muchos a muchos → `quoteitems`/`quoteparts`), 18 (tabs por rol), 19 (encabezado + renglones → cotización) |
| **NO APLICA A VEXORA** | 05 como pantalla de borrado; entidades `productos`/`pedidos`/`categorías`; `colecciones.config.ts` genérico; fuente TTF externa |
| **REQUIERE AUTORIZACIÓN** | Borrado de catálogos desde la UI; creación de datos temporales para probar CRUD; edición de perfil con permiso amplio |

Las adaptaciones 14, 18 y 19 **ya están implementadas**; se clasifican como "requiere adaptación" porque el manual no se puede aplicar literalmente, no porque falten.

---

## 2. Resumen por manual

| # | Manual | Categoría | Implementación real | Prueba |
|---|---|---|---|---|
| 01 | Listado de elementos | YA IMPLEMENTADA | `pages/*/list/list.page.ts`, `services/*` | Listados de Servicios, Combustibles, Métodos, Vehículos, Pagos, Cotizaciones y Órdenes renderizados |
| 02 | Detalle de un elemento | YA IMPLEMENTADA | `pages/*/detail/detail.page.ts` | Orden #16, Cotización #5 y Vehículo #6 abiertos |
| 03a | Crear en modal | YA IMPLEMENTADA | `createService()`, `createFuel()`, `createMethod()`, `createQuote()`, `addDiagnosis()`, `addEvidence()` | Modal de cotización con scroll; formularios de catálogo |
| 03b | Crear en página | YA IMPLEMENTADA | `pages/users/form`, `pages/vehicles/form`, `pages/appointments/form` | Alta real de usuario y validaciones vacías |
| 04a | Actualizar en modal | YA IMPLEMENTADA | `editService()`, `editFuel()`, `editMethod()` | Edición de catálogos (turnos previos documentados) |
| 04b | Actualizar en página | YA IMPLEMENTADA | `users/form?id=`, `vehicles/form?id=` | Formulario de edición de usuario cargó valores reales |
| 05 | Eliminar elemento | NO APLICA (UI) | `delete()` en servicios; sin botón de borrado | Borrado por API probado en turnos previos con restricción FK |
| 06 | Fuentes y estilos | YA IMPLEMENTADA | `mobile/src/global.scss`, `src/theme/variables.scss` | Identidad visible en todas las pantallas |
| 07 | Componentes | YA IMPLEMENTADA | `components/toolbar`, `searchbar`, `pagination` | Buscadores y paginadores en uso |
| 08 | Paginación | YA IMPLEMENTADA | `components/pagination` + `total()` de cada servicio | Servicios: página 2 con otros 5 registros; total 10 |
| 09 | Menú lateral | YA IMPLEMENTADA | `app.component.html` | Menú solo con Administrator; ausente en client/mechanic/assistant |
| 10 | Búsqueda | YA IMPLEMENTADA | `searchbar.component.ts` + filtros de servicios | Citas, Servicios, Combustibles, Métodos y Pagos |
| 11 | Servicios | YA IMPLEMENTADA | `src/app/services/*` con `defer`/`map`/`firstValueFrom` | Todas las pantallas consumen estos servicios |
| 12 | Login y registro | YA IMPLEMENTADA | `pages/login`, `pages/register`, `services/auth` | Login con los 4 roles; validación de registro |
| 13 | Guard | YA IMPLEMENTADA | `guard/auth-guard.ts`, `constants/view_access.ts` | `/users/list` y `/services/list` → `/forbidden` para client y mechanic |
| 14 | Muchos a muchos | ADAPTADA | `quoteitems`, `quoteparts`, `pages/quotes/form` | Cotización #5 con servicio y refacción |
| 15 | Subir archivos | YA IMPLEMENTADA | `EvidenceServices.upload()` → `POST /files` | Evidencias #5 y #9 con archivo en `directus_uploads` |
| 16 | Imagen en formulario/detalle | YA IMPLEMENTADA | `assetObjectUrl()`, miniaturas en detalle y listado | Orden #16 y `/evidences/list` con `blob:` 2048×2048 |
| 17 | Campos de formulario | YA IMPLEMENTADA | Formularios reactivos de usuarios, vehículos, citas, pagos | Validaciones de usuario vacías y selects de rol/estado |
| 18 | Tabs y colecciones | ADAPTADA | `tabs.page`, `tabs-routing.module.ts` | 5 pestañas admin/client; 2 mechanic/assistant |
| 19 | Encabezado + renglones | ADAPTADA | `pages/quotes/form`, `services/quotes` | Cotización #5: subtotal $2380, IVA $380.80, total $2760.80 |

---

## 3. Detalle por manual

### 01. `01_listado_elementos.md` — Listado de elementos
- **Objetivo:** mostrar una colección de Directus en una página Ionic con Axios, `*ngFor` y paginación.
- **Técnicas:** `ngOnInit()`/`ionViewWillEnter()`, `axios.get()`, `environment.apiUrl`, `*ngFor`, pipe `date`.
- **Aplicabilidad:** total. VEXORA lista órdenes, vehículos, citas, pagos, cotizaciones y catálogos.
- **Archivos:** `pages/*/list/list.page.ts|html`, `services/*/*.ts`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno en este turno.
- **Pruebas:** `/services/list` (10 registros), `/fuels/list` (5), `/methods/list` (5), `/vehicles/list` (4), `/payment/list` (2), `/quotes/list` (4), `/tabs/workorders/list`.
- **Diferencia:** el dominio es taller mecánico, no productos.

### 02. `02_detalle_elemento.md` — Detalle de un elemento
- **Objetivo:** abrir un registro por `:id` y mostrar sus campos.
- **Técnicas:** parámetro de ruta, `ActivatedRoute`, `*ngIf="… as detalle"`, `LoadingController`, `ion-back-button`.
- **Aplicabilidad:** total.
- **Archivos:** `pages/*/detail/detail.page.ts|html`; en órdenes, `pages/workorders/detail/` integra diagnósticos, evidencias y cotizaciones.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** `/workorders/detail/16`, `/quotes/detail/5`, `/vehicles/detail/6`.
- **Diferencia:** el detalle de orden es más rico que el ejemplo del manual.

### 03a. `03_crear_elemento_modal.md` — Crear en modal
- **Objetivo:** crear registros sin salir del listado.
- **Técnicas:** `ModalController.create()`, `breakpoints`, `initialBreakpoint`, `onDidDismiss()`, formulario reactivo, `AlertController`.
- **Aplicabilidad:** total.
- **Archivos:** `pages/services/list/list.page.ts` (`createService()`), `pages/fuels/list` (`createFuel()`), `pages/methods/list` (`createMethod()`), `pages/workorders/detail` (`addDiagnosis()`, `addEvidence()`, `createQuote()`).
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** se conserva `expandToScroll: false` en `createQuote()` (corrección de scroll verificada).
- **Pruebas:** modal de Nueva cotización con encabezado fijo y cuerpo desplazable; formularios de catálogo abren y guardan (turnos previos documentados).
- **Diferencia:** los modales se usan también para diagnósticos, evidencias y cotizaciones.

### 03b. `03_crear_elemento_pagina.md` — Crear en página
- **Objetivo:** formulario de página completa con validaciones.
- **Técnicas:** `ReactiveFormsModule`, `FormBuilder`, `Validators`, `markAllAsTouched()`, `getError()`, `axios.post()`.
- **Aplicabilidad:** total.
- **Archivos:** `pages/users/form/form.page.ts`, `pages/vehicles/form/`, `pages/appointments/form/`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno en este turno.
- **Pruebas:** alta real de usuario `val.final.prueba@vexora.dev` (creada y editada en el turno anterior); formulario vacío muestra los 5 mensajes obligatorios; selects de Rol y Estado funcionan.
- **Diferencia:** el correo duplicado se controla con pre-chequeo y con el error de Directus.

### 04a. `04_actualizar_elemento_modal.md` — Actualizar en modal
- **Objetivo:** reutilizar el formulario para editar.
- **Técnicas:** `componentProps: { id }`, `@Input() id`, `patchValue()`, `axios.patch()`, `dismiss({ saved: true })`.
- **Aplicabilidad:** total.
- **Archivos:** `pages/services/list` (`editService`), `pages/fuels/list` (`editFuel`), `pages/methods/list` (`editMethod`), formularios de catálogo.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** edición de catálogos documentada en turnos previos; el patrón es idéntico al de creación.
- **Diferencia:** ninguna relevante.

### 04b. `04_actualizar_elemento_pagina.md` — Actualizar en página
- **Objetivo:** editar mediante `?id=` en la misma página.
- **Técnicas:** `ActivatedRoute.queryParamMap`, `patchValue()`, `PATCH`, `Router`.
- **Aplicabilidad:** total.
- **Archivos:** `pages/users/form/form.page.ts`, `pages/vehicles/form/`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** `/users/form?id=e37c57e4…` cargó correo, nombre, apellido, rol y estado reales; edición de apellido documentada en el turno anterior.
- **Diferencia:** el título cambia a "Editar usuario".

### 05. `05_eliminar_elemento.md` — Eliminar elemento
- **Objetivo:** confirmar y borrar un registro.
- **Técnicas:** `AlertController`, `role: cancel`, `axios.delete()`, `onDidDismiss()`.
- **Aplicabilidad:** parcial. Los servicios tienen `delete()`, pero **la interfaz no borra catálogos**.
- **Archivos:** `services/*/*.ts` (`delete()`), sin botón en los listados.
- **Estado:** NO APLICA A VEXORA como pantalla.
- **Cambios:** ninguno; no se agregó borrado.
- **Pruebas:** borrado por API con restricción de clave foránea (400/409) documentado en turnos previos.
- **Justificación:** conservar la integridad referencial y el comportamiento original. Agregar el botón requiere autorización.

### 06. `06_fuentes_estilos.md` — Fuentes y estilos
- **Objetivo:** definir identidad visual global.
- **Técnicas:** `:root`, variables `--ion-color-*`, `--ion-font-family`, `@font-face`.
- **Aplicabilidad:** total, salvo la fuente TTF.
- **Archivos:** `mobile/src/global.scss`, `mobile/src/theme/variables.scss`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** paleta azul `#0F172A` / naranja `#F97316` y estados visibles en todas las pantallas.
- **Justificación de lo no aplicado:** no se cargó TTF propio; se usó la pila del sistema para no sumar peso.

### 07. `07_componentes.md` — Componentes reutilizables
- **Objetivo:** encapsular UI repetida.
- **Técnicas:** `@Component`, `@Input()`, `@Output()`, `ng-content`, `NgModule`.
- **Aplicabilidad:** total.
- **Archivos:** `components/toolbar`, `components/searchbar`, `components/pagination`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** barra superior, buscador y paginador se reutilizan en todos los listados.
- **Diferencia:** `searchbar` y `pagination` no aparecen en el manual; se añadieron como componentes propios.

### 08. `08_paginacion.md` — Paginación
- **Objetivo:** dividir listados largos y conocer el total.
- **Técnicas:** `limit`, `page`, `aggregate[count]`, `Math.ceil()`, `@Input`/`@Output`.
- **Aplicabilidad:** total.
- **Archivos:** `components/pagination/pagination.component.ts`; `list(page, perPage, search)` y `total(search)` en cada servicio.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** se añadió paginación real a **Combustibles** y **Métodos de pago** con el mismo patrón de los demás catálogos (`perPage = 5`, `chargerTotal()`, `adjustCurrentPage()`, `changePage()`).
- **Pruebas:** Servicios: página 1 (5 registros) → página 2 (otros 5) → total 10; buscar desde página 2 vuelve a página 1 y filtra 2; limpiar restaura 10. Combustibles y Métodos: `Página 1 de 1 · 5 registros` con total correcto.
- **Límite conocido:** con solo 5 registros en Combustibles y Métodos no existe una segunda página que pulsar; el cambio de página se verificó con el mismo componente en Servicios. Probar una segunda página en esos catálogos exige crear registros temporales (requiere autorización).

### 09. `09_menu.md` — Menú lateral
- **Objetivo:** navegación lateral.
- **Técnicas:** `ion-menu`, `ion-menu-button`, `ion-menu-toggle`, `routerLink`.
- **Aplicabilidad:** total, con restricción por rol.
- **Archivos:** `app.component.html`, `app.component.ts`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** Administrator ve Catálogos, Colores, Marcas, Modelos, Combustibles, Refacciones, Servicios, Métodos de pago, Diagnóstico y Evidencias; client, mechanic y assistant no tienen botón de menú.
- **Diferencia:** el menú es exclusivo de Administrator y no duplica las pestañas.

### 10. `10_busqueda.md` — Búsqueda
- **Objetivo:** filtrar por texto sin recargar.
- **Técnicas:** `ion-searchbar`, `debounce`, `event.detail.value`, `filter`, `_or`, `_icontains`.
- **Aplicabilidad:** total.
- **Archivos:** `components/searchbar/searchbar.component.ts`; filtros en `services/*` (p. ej. `appointments.ts` busca placa, VIN, nombre y apellido).
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** se añadió buscador a **Combustibles** (`placeholder="Buscar combustible"`, `handleInput()`); el servicio ya tenía `filter()` y `total()`.
- **Pruebas:** Citas `PRU-T01`→1, `carla`→5, `zzzz`→0; Servicios `Frenos`→2, `aceite`→1; Combustibles `Gas`→2, `Híbrido`→1, `zzzz`→0; Métodos `Tarjeta`→2; Pagos `PRU-TEST`→1. Todos restauran el total al limpiar.
- **Diferencia:** el filtro se combina con la paginación y el total agregado.

### 11. `11_servicios.md` — Servicios con RxJS
- **Objetivo:** centralizar el acceso a Directus.
- **Técnicas:** `@Injectable`, `Observable<T>`, `defer()`, `map()`, `firstValueFrom()`.
- **Aplicabilidad:** total.
- **Archivos:** `src/app/services/*` (uno por colección) y `services/auth/auth.ts`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** todas las pantallas consumen estos servicios con token Bearer.
- **Diferencia:** cada servicio añade `getAuthConfig()` con el token de `AuthService`.

### 12. `12_login_registro.md` — Login y registro
- **Objetivo:** autenticar contra Directus y registrar cuentas.
- **Técnicas:** `POST /auth/login` con `mode: json`, `access_token`, `refresh`, `logout`, `POST /users/register`.
- **Aplicabilidad:** total.
- **Archivos:** `pages/login/login/`, `pages/register/register/`, `services/auth/auth.ts`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** login correcto con `val.final.admin`, `val.final.client`, `val.final.mechanic` y `val.final.assistant`; registro vacío muestra "Completa el nombre, un correo válido y una contraseña de al menos 8 caracteres".
- **Diferencia:** la sesión se guarda en memoria; recargar exige volver a iniciar sesión.

### 13. `13_guard.md` — Guard de rutas
- **Objetivo:** impedir el acceso sin sesión o sin rol.
- **Técnicas:** `CanActivateFn`, `inject()`, `createUrlTree()` con `returnUrl`.
- **Aplicabilidad:** total.
- **Archivos:** `guard/auth-guard.ts`, `constants/view_access.ts`, `pages/forbidden/`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** sin sesión, `/users/list` redirige a `/login?returnUrl=%2Fusers%2Flist`. Con client: `/users/list`, `/services/list` y `/evidences/list` → `/forbidden`. Con mechanic: citas, vehículos, pagos, usuarios, servicios y evidencias → `/forbidden`. Con assistant: citas, usuarios y evidencias → `/forbidden`.
- **Diferencia:** se añadió la matriz `VIEW_ACCESS` por vista y acción.

### 14. `14_muchos_muchos.md` — Relación muchos a muchos
- **Objetivo:** administrar relaciones N:M desde un formulario.
- **Técnicas:** `FormArray`, `patchValue`, `Set`, `create`/`delete` en `PATCH`.
- **Aplicabilidad:** adaptada a cotizaciones.
- **Archivos:** `pages/quotes/form/form.page.ts` (`addService`, `removeService`, `addPart`, `removePart`, `calculateTotals`), `services/quoteitems`, `services/quoteparts`.
- **Estado:** ADAPTADA E IMPLEMENTADA.
- **Cambios:** ninguno en este turno.
- **Pruebas:** Cotización #5 muestra un servicio y una refacción con importes y totales.
- **Diferencia:** no hay categorías; hay renglones con cantidad, precio y descuento.

### 15. `15_subir_archivos.md` — Subida de archivos
- **Objetivo:** subir un archivo a Directus y asociarlo a un registro.
- **Técnicas:** `input type="file"`, `FormData`, `POST /files`, `PATCH` con el ID, `GET /assets/{id}`.
- **Aplicabilidad:** total, aplicada a evidencias.
- **Archivos:** `services/evidences/evidences.ts` (`upload()`, `assetUrl()`, `assetObjectUrl()`), `pages/evidence/form/form.page.ts`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** subida real de PNG en una orden temporal (turno anterior), registro en `evidence` y archivo en el volumen `vexora_directus_uploads`; hoy el volumen conserva los archivos de las evidencias #5 y #9.
- **Diferencia:** la imagen pertenece a una orden de trabajo, no a un producto.

### 16. `16_imagen_formulario_detalle.md` — Imagen en formulario y detalle
- **Objetivo:** previsualizar imágenes autenticadas.
- **Técnicas:** `Blob`, `URL.createObjectURL()`, `revokeObjectURL()`, `ionViewWillEnter()`.
- **Aplicabilidad:** adaptada a evidencias.
- **Archivos:** `pages/workorders/detail/detail.page.ts` (`chargerEvidences()`, `ngOnDestroy()`), `pages/evidence/list/list.page.ts`, `services/evidences/evidences.ts` (`isFileReference()`).
- **Estado:** ADAPTADA E IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** `/workorders/detail/16` muestra la evidencia #9 como `blob:` de 2048×2048; `/evidences/list` muestra miniaturas de #5 (320×180) y #9 (2048×2048); sin errores de consola.
- **Diferencia:** las imágenes son fotografías del trabajo y su acceso depende de RLS.

### 17. `17_campos_formularios.md` — Campos de formulario
- **Objetivo:** elegir el control Ionic adecuado y validarlo.
- **Técnicas:** `ion-input` (`email`, `tel`, `url`, `number`), `ion-textarea`, `ion-select`, `ion-checkbox`, `Validators`.
- **Aplicabilidad:** total.
- **Archivos:** formularios de `users`, `vehicles`, `appointments`, `payment`, `quotes`, `workorders`.
- **Estado:** YA IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** formulario de usuario vacío muestra obligatorios de correo, nombre, apellido, rol y contraseña; selects de Rol y Estado conservan el valor.
- **Diferencia:** los tipos y longitudes salen del esquema real de Directus.

### 18. `18_tabs_colecciones.md` — Tabs y colecciones
- **Objetivo:** organizar la navegación principal.
- **Técnicas:** `tabs.page.html`, `tabs-routing.module.ts`, `ionViewWillEnter()`, `canActivateChild`.
- **Aplicabilidad:** adaptada.
- **Archivos:** `tabs/tabs.page.html|ts`, `tabs/tabs-routing.module.ts`, `app-routing.module.ts`.
- **Estado:** ADAPTADA E IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** Administrator y client ven Órdenes, Citas, Vehículos, Pagos y Perfil; mechanic y assistant ven Órdenes y Perfil.
- **Diferencia:** el manual propone tabs por colección con `colecciones.config.ts`; VEXORA usa tabs por rol y una página por catálogo. No se adoptó el patrón genérico para no reescribir la arquitectura.

### 19. `19_pedidos_detalle.md` — Encabezado y renglones
- **Objetivo:** guardar un encabezado con varios renglones y calcular totales.
- **Técnicas:** `FormArray`, `push()`/`removeAt()`, `getRawValue()`, totales, `POST` anidado, `PATCH` con `create/update/delete`.
- **Aplicabilidad:** adaptada a cotizaciones.
- **Archivos:** `pages/quotes/form/form.page.ts`, `services/quotes/quotes.ts`, `services/quoteitems`, `services/quoteparts`.
- **Estado:** ADAPTADA E IMPLEMENTADA.
- **Cambios:** ninguno.
- **Pruebas:** Cotización #5: servicio $1620, refacción $760, subtotal $2380, IVA $380.80, total $2760.80.
- **Diferencia:** no hay pedidos ni productos; hay órdenes, servicios y refacciones.

---

## 4. Técnicas que NO se aplicaron y por qué

| Técnica del material | Motivo |
|---|---|
| Entidades `productos`, `pedidos`, `categorías` | No pertenecen al dominio del taller; se usaron órdenes, servicios y refacciones. |
| `colecciones.config.ts` genérico | Implicaba reescribir la arquitectura de páginas; `AGENTS.md` exige conservar la estructura original. |
| Edición de perfil con permiso amplio | La instalación no aplica reglas custom (`permissions: null`); un permiso amplio permitiría auto-escalado. Alternativas: solo lectura, edición por Administrator o endpoint propio con whitelist. Requiere autorización. |
| Borrado de catálogos desde la UI | Riesgo de integridad referencial; se mantiene el comportamiento original. Requiere autorización. |
| Fuente TTF externa | Se prefirió la pila del sistema para no sumar recursos ni peso al build. |
| Imagen de "producto" en formulario | Se trasladó a evidencias de una orden, que es el caso real del taller. |

---

## 5. Puntos defendibles en la exposición

1. **Se aplicó el procedimiento, no el ejemplo:** mismos patrones (servicio + página + modal + validación + guard) sobre un dominio distinto.
2. **Se respetó el estilo original:** NgModules, `standalone: false`, `FormBuilder`, `AlertController`, `firstValueFrom`, un servicio por colección.
3. **Se añadieron garantías que el manual no cubre:** RLS por rol, guard por vista, `expandToScroll`, control de duplicados y subida autenticada de archivos.
4. **Las diferencias están justificadas:** cada adaptación responde a una necesidad del taller o a una restricción de integridad, no a una simplificación.
