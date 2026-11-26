# AGENTS.md — Reglas compartidas de VEXORA

## Proyecto
- Nombre: VEXORA
- Ruta: `C:\docker_moviles\docker_moviles\docker_moviles`
- Repositorio: `angeelvaleen/tallermecanico`
- Commit original de referencia: `05294bf`
- Tecnologías: Ionic/Angular, Directus 12.6.0, MariaDB 11.8 y Docker Compose.
- Agentes: OpenCode y Freebuff.

## Objetivo
Terminar y verificar el funcionamiento original de VEXORA, respetando la arquitectura y los procesos definidos por el equipo.

## Estilo de programación (REGLA OBLIGATORIA — indicada por el usuario, 2026-11-17)

El código original del repositorio (`angeelvaleen/tallermecanico`, commit `05294bf`) es la **referencia principal de estilo**. Antes de escribir o modificar código:

1. Revisar cómo está escrito el código original con Git y comparar archivos similares.
2. Mantener su estilo, estructura de archivos y organización por módulos (`pages/<dominio>/list|detail|form`, servicios en `src/app/services`, constantes en `src/app/constants`).
3. Conservar sus convenciones de nombres de variables, métodos, servicios y componentes.
4. Usar las mismas convenciones de Ionic, Angular y TypeScript (componentes `standalone: false`, módulos NgModule, `FormBuilder`/`Validators`, `AlertController`/`ModalController`, `firstValueFrom`, etc.).
5. No introducir arquitecturas nuevas, patrones avanzados, librerías o abstracciones innecesarias.
6. Modificaciones pequeñas y concretas; evitar reescribir archivos completos.
7. Comentarios con el mismo estilo y frecuencia del proyecto original.
8. Respetar la lógica de negocio y las funcionalidades existentes.
9. No reformatear código que no necesite cambios.
10. Antes de crear archivos nuevos, comprobar si pueden reutilizarse los existentes.
11. Conservar todas las correcciones funcionales de OpenCode y Freebuff (ver `ESTADO_VEXORA.md`).
12. No simplificar artificialmente ni introducir errores: el código nuevo debe ser una continuación natural del repositorio original.

Aplica igualmente a Perfil, Gestión de Usuarios, Tabs por rol, Menú del administrador y Archivos.

## Requisitos funcionales del compañero (2026-11-16) — estado en ESTADO_VEXORA.md

1. **Perfil:** todos los roles consultan datos + rol; edición de datos personales bloqueada por licencia de Directus (documentado, con evidencia de por qué el permiso amplio permite auto-escalado de rol); nadie cambia su propio rol ni permisos (verificado por API: 403).
2. **Gestión de Usuarios:** solo Administrator; listar/crear/editar con roles; anti-duplicados (pre-chequeo + error de Directus); NO tocar ni eliminar los 4 usuarios de prueba.
3. **Tabs por rol:** Administrator/client = Órdenes, Citas, Vehículos, Pagos, Perfil; mechanic/assistant = Órdenes, Perfil; rutas `/tabs/...` con guard.
4. **Menú desplegable:** exclusivo de Administrator; solo Catálogos, Diagnóstico y Evidencias; sin duplicar pestañas; conservar Diagnóstico/Evidencias desde las órdenes para mechanic/assistant.
5. **Subida de archivos (opcional):** IMPLEMENTADA (2026-11-25). El modal de evidencias (`pages/evidence/form`) valida formato (JPEG/JPG/PNG/HEIC/HEIF) y tamaño (10 MB), sube el archivo a `/files`, crea la fila en `evidence` con el UUID en `path`, y el detalle/listado muestran miniaturas autenticadas vía `GET /assets/:id`. `EvidenceServices.upload()` revierte el archivo recién subido si Directus rechaza la fila (nunca toca archivos previos). La foto de perfil se sube igual desde Perfil (JPG/PNG/WEBP, 5 MB). Ver `ESTADO_VEXORA.md`, Fase 5.

## Estado resumido (2026-11-17, turno III de OpenCode)

- **Los 6 catálogos restantes (Colores, Modelos, Combustibles, Servicios, Refacciones, Métodos) están probados** (listado, validación, alta, edición, borrado seguro por API, restricciones FK, validación server-side 400). Ver detalles y evidencia en `ESTADO_VEXORA.md`, sección "Turno OpenCode 2026-11-17 (III)".
- **El borrado de catálogos NO existe en la UI** (comportamiento original); no añadirlo sin autorización.
- **`/forbidden` corregido y probado con los 4 roles** (`pages/forbidden/forbidden.page.ts`: `Router` → `/tabs/workorders/list` con `replaceUrl`). No volver a `location.back()`.
- **Bug original corregido en `services/parts/parts.ts`:** `search.trim` sin `()` rompía el buscador de Refacciones. Mantener el fix.
- Compilaciones dev y producción OK (hash `0bc3f3d52a043675`); Compose compatible y sin cambios; PRU-TEST conservados; sin commit ni push (pendiente de autorización del usuario).

## Estado resumido (2026-11-25, Fase 5)

- Correcciones aplicadas: **H1** (la foto de perfil solo se puede subir o cambiar con `create` en `directus_files`; `client` conserva visualización y "Quitar foto"), **H2** (índice de la orden en `quotes/form`), **H3** (archivos huérfanos al fallar el registro de una evidencia), **H4** (documentación de evidencias) y **H5** (avatar asignado por un administrador).
- **H1 (2026-11-25):** `pages/profile` usa `auth.can('directus_files','create')` para mostrar el selector y el botón; no se modificaron permisos ni `role_actions.ts`. Ver `ESTADO_VEXORA.md`, Fase 10.
- Sin cambios de base de datos, usuarios, roles, permisos, políticas, RLS, `.env`, volúmenes Docker ni Git. Compilación de producción OK.

## Coordinación obligatoria

1. Solo un agente puede modificar el proyecto a la vez.
2. Antes de trabajar, leer `AGENTS.md` y `ESTADO_VEXORA.md`.
3. Comprobar `git status`, `git diff` y el estado real de Docker.
4. Continuar desde la última tarea registrada; no repetir tareas completadas sin una causa concreta.
5. No utilizar informes antiguos como prueba del estado actual.
6. Antes de intervenir, confirmar qué archivos y servicios afectará la tarea.
7. Al terminar, actualizar `ESTADO_VEXORA.md` con resultados verificables.
8. No alterar el trabajo del otro agente sin revisar previamente sus cambios.

## Restricciones

- No modificar `C:\docker_moviles\docker_moviles_respaldo`.
- No borrar contenedores, volúmenes o bases de datos antiguas.
- No ejecutar `docker compose down -v`, `docker volume prune`, `git reset --hard` o `git clean -fd`.
- No cambiar nombres de contenedores, redes o volúmenes sin autorización.
- No cambiar permisos o esquemas de Directus indiscriminadamente.
- No modificar procesos de negocio originales sin justificar el cambio.
- No hacer commit, merge ni push sin autorización.
- No compartir credenciales ni copiar secretos a los informes.
- No agregar funcionalidades nuevas fuera del alcance acordado.

## Pruebas

- Una compilación satisfactoria no significa que la funcionalidad esté probada.
- Una prueba simulada no sustituye una prueba HTTP o de interfaz real.
- No alterar expectativas de pruebas para convertir errores en éxitos.
- Cada corrección debe incluir evidencia del error original, solución y nueva comprobación.
- Separar claramente lo probado, lo pendiente y lo bloqueado.

## Entrega de turno entre agentes

Al finalizar, documentar:
- Agente responsable.
- Tarea realizada y resultado.
- Archivos modificados.
- Servicios o datos afectados.
- Comandos relevantes.
- Pruebas aprobadas, fallidas o pendientes.
- Siguiente acción concreta.

Si la tarea queda incompleta, dejar el estado exacto para que el otro agente continúe sin reconstruir el proyecto.