# Restauración de Directus — Taller Mecánico

## 1. Objetivo

Esta guía explica cómo instalar y levantar el proyecto Taller Mecánico en una computadora nueva y restaurar manualmente la configuración de Directus utilizando los archivos de la carpeta `directus/`.

El objetivo es recuperar la estructura y configuración del sistema sin importar las cuentas personales ni los registros de negocio de la instalación original.

La restauración se realiza manualmente mediante **Directus Environment Sync (`d6s`)**. Docker Compose únicamente inicia los servicios; no ejecuta ninguna restauración automática.

### Qué se pretende restaurar

- Colecciones del taller.
- Campos y estructura de las colecciones.
- Metadatos de configuración.
- Roles.
- Políticas de acceso.
- Permisos.
- Dashboards y paneles.
- Flows y operaciones.
- Otros elementos de configuración compatibles incluidos en el snapshot.

### Qué no se pretende restaurar

- Cuentas personales de la instalación original.
- Registros de clientes.
- Vehículos registrados.
- Citas.
- Órdenes de trabajo.
- Cotizaciones y pagos.
- Otros registros operativos.
- Archivos físicos subidos a Directus.

---

## 2. Estructura del proyecto

La computadora destino debe tener una copia del proyecto con esta estructura:

```text
docker_moviles/
│
├── docker-compose.yml
│
├── directus/
│   ├── default/
│   │   ├── data/
│   │   └── schema/
│   │
│   └── snapshot.yaml
│
├── database/
│   ├── init/
│   │   └── 02_database.sql
│   │
│   └── seed/
│       └── catalogo.sql
│
├── mobile/
│
└── ...
```

La carpeta `directus/` debe permanecer en la raíz, junto a `docker-compose.yml`.

No cambiar su ubicación a `backup-directus/` ni copiarla manualmente dentro del contenedor.

El CLI utiliza esa carpeta para leer la configuración que se va a restaurar.

---

## 3. Requisitos previos

Instalar en la computadora destino:

1. Docker Desktop (Windows/macOS) o Docker Engine (Linux).
2. Docker Compose.
3. Node.js 22 o posterior.
4. npm.

Comprobar las instalaciones:

```bash
docker --version
docker compose version
node --version
npm --version
```

Node.js debe ser versión 22 o posterior.

---

## 4. Preparar Docker Compose

Antes de levantar los servicios, hay que revisar `docker-compose.yml`.

### 4.1. Fijar la versión de Directus

La configuración exportada corresponde a Directus **12.6.0**.

Dentro del servicio `api`, utilizar:

```yaml
image: directus/directus:12.6.0
```

No utilizar:

```yaml
image: directus/directus:latest
```

La versión del destino debe coincidir con la versión registrada en el snapshot.

### 4.2. Configurar MariaDB

El servicio `db` debe conservar su volumen de datos, pero no debe ejecutar automáticamente los scripts SQL de inicialización.

Ejemplo:

```yaml
db:
  image: mariadb:11.8
  container_name: moviles-db
  restart: unless-stopped
  expose:
    - "3306"
  environment:
    MARIADB_ROOT_PASSWORD: "PASSWORD_ROOT_PROPIO"
    MARIADB_DATABASE: workshop
    MARIADB_USER: Angel
    MARIADB_PASSWORD: "PASSWORD_DB_PROPIO"
  volumes:
    - mariadb_data:/var/lib/mysql
  healthcheck:
    test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
    interval: 5s
    timeout: 5s
    retries: 20
  networks:
    - moviles
```

**Importante:** no agregar este montaje:

```yaml
- ./database/init:/docker-entrypoint-initdb.d
```

El archivo `02_database.sql` contiene claves foráneas que apuntan a `directus_users`.

Si MariaDB ejecuta ese archivo durante su inicialización, todavía no existirá la tabla de usuarios de Directus, porque Directus arranca después de MariaDB.

Por ese motivo, la restauración se realizará primero mediante Directus Environment Sync.

### 4.3. Configurar Directus

Ejemplo del servicio:

```yaml
api:
  image: directus/directus:12.6.0
  container_name: moviles-api
  restart: unless-stopped
  ports:
    - "8000:8055"
  environment:
    SECRET: "SECRET_PROPIO"
    ADMIN_EMAIL: "admin@moviles.local"
    ADMIN_PASSWORD: "PASSWORD_ADMIN_PROPIO"

    DB_CLIENT: "mysql"
    DB_HOST: "db"
    DB_PORT: "3306"
    DB_DATABASE: "workshop"
    DB_USER: "Angel"
    DB_PASSWORD: "PASSWORD_DB_PROPIO"

    CORS_ENABLED: "true"
    CORS_ORIGIN: "true"
    CORS_METHODS: "GET,POST,PATCH,DELETE,OPTIONS"
    CORS_ALLOWED_HEADERS: "Content-Type,Authorization"
    CORS_EXPOSED_HEADERS: "Content-Range"
    CORS_CREDENTIALS: "true"

  volumes:
    - directus_uploads:/directus/uploads
    - directus_extensions:/directus/extensions

  depends_on:
    db:
      condition: service_healthy

  networks:
    - moviles
```

Los valores de conexión de MariaDB y Directus deben coincidir.

El administrador inicial debe ser propio de la computadora destino.

Conservar las demás secciones del Compose, incluyendo:

- Servicio `mobile`.
- Servicio `swagger`.
- Volúmenes.
- Redes.
- Dependencias que ya tenga el proyecto.

No reemplazar el Compose completo si existen otros servicios necesarios.

### 4.4. Validar el Compose

Desde la raíz del proyecto:

```bash
docker compose config
```

Si no aparecen errores, se puede continuar.

---

## 5. Levantar el proyecto por primera vez

Abrir una terminal en la carpeta donde se encuentra `docker-compose.yml`.

Descargar las imágenes:

```bash
docker compose pull
```

Levantar los servicios:

```bash
docker compose up -d
```

Comprobar el estado:

```bash
docker compose ps
```

Esperar a que Directus termine de iniciar:

```bash
docker compose logs -f api
```

Cuando Directus indique que el servidor inició correctamente, salir de los logs con:

```text
Ctrl + C
```

Esto no detiene los contenedores.

Abrir en el navegador:

```text
http://localhost:8000
```

Iniciar sesión con el administrador inicial definido en `docker-compose.yml`.

En este punto se tiene una instalación nueva de Directus, todavía sin importar la configuración del proyecto.

---

## 6. Instalar Directus CLI

Abrir una terminal e instalar la herramienta:

```bash
npm install -g @directus/cli@12
```

Comprobar:

```bash
d6s --version
```

El comando `d6s` permite administrar los perfiles y ejecutar la sincronización de configuración.

La herramienta se ejecuta desde la computadora, no dentro del contenedor.

No es necesario agregar un servicio adicional a Docker Compose.

---

## 7. Crear el perfil de conexión

Volver a la raíz del proyecto:

```text
docker_moviles/
```

Comprobar que estén presentes:

```text
docker-compose.yml
directus/
```

Crear un perfil para la instalación destino:

```bash
d6s profile add companero --url http://localhost:8000
```

Cuando el CLI solicite las credenciales, introducir las del administrador inicial de Directus.

Comprobar la conexión:

```bash
d6s profile test-connection companero
```

El resultado debe confirmar que la conexión y autenticación funcionan.

**Nota:** `localhost` representa la computadora donde se está ejecutando el CLI. Si el CLI se ejecuta desde otra máquina, se debe utilizar la dirección accesible del servidor Directus.

---

## 8. Revisar la restauración antes de aplicarla

Antes de importar cualquier configuración, ejecutar:

```bash
d6s sync diff --to companero
```

Este comando compara la configuración local de:

```text
directus/default/
```

con la instalación destino.

El comando permite revisar los cambios que se aplicarían. No se debe omitir esta revisión.

### 8.1. Revisar las diferencias

Comprobar especialmente:

- Colecciones que se van a crear.
- Campos que se van a crear.
- Configuraciones que se van a actualizar.
- Roles y políticas.
- Permisos.
- Elementos de configuración que no coincidan.

Si aparece un error de versión o proveedor de base de datos, detenerse y corregirlo.

No utilizar `--allow-drift` para saltarse incompatibilidades.

### 8.2. Atención con los roles Administrator

La exportación original contiene dos roles llamados `Administrator`, pero tienen identificadores diferentes.

Por ello, si el CLI solicita relacionar registros de origen y destino, revisar cuidadosamente la correspondencia.

No seleccionar roles al azar.

La instalación destino debe conservar su administrador inicial y permitir el acceso administrativo después de la sincronización.

---

## 9. Restaurar manualmente la configuración

Una vez revisado el resultado del `diff`, ejecutar:

```bash
d6s sync push --to companero
```

El CLI mostrará el plan de sincronización y solicitará confirmación.

Revisar el plan antes de aceptar.

El modo predeterminado `merge` crea y actualiza elementos de configuración sin eliminar los que ya existen en el destino.

**No utilizar:**

```bash
--mode mirror
```

Ni:

```bash
--dangerously-allow-delete
```

Tampoco agregar `--yes` durante la primera restauración: es preferible revisar y confirmar el plan manualmente.

La sincronización se ejecuta únicamente cuando alguien ejecuta este comando. Reiniciar Docker no vuelve a importar el snapshot.

---

## 10. Verificar la configuración restaurada

Abrir nuevamente:

```text
http://localhost:8000
```

Comprobar que el administrador destino puede iniciar sesión.

Revisar los siguientes elementos:

### Colecciones

Verificar que aparezcan las 18 colecciones de negocio:

```text
appointments
brands
colors
diagnoses
evidence
fuels
history
methods
models
parts
payment
quoteitems
quoteparts
quotes
services
status
vehicles
workorders
```

### Campos

Comprobar que las colecciones tengan los campos esperados y los tipos de datos correctos.

### Roles

Verificar la existencia de los roles:

```text
Administrator
assistant
mechanic
client
```

La exportación contiene dos registros `Administrator` con identificadores diferentes. No eliminarlos sin investigar sus asignaciones.

### Políticas y permisos

Comprobar:

- Políticas de acceso.
- Permisos de lectura.
- Permisos de creación.
- Permisos de actualización.
- Permisos de eliminación.
- Asignaciones de políticas a roles.

### Dashboards y Flows

Comprobar que aparezcan los paneles, dashboards y flows incluidos en la exportación.

### Relaciones

Comprobar las relaciones desde Directus y verificar las claves foráneas de MariaDB.

**Advertencia sobre las relaciones:** el snapshot contiene referencias de claves foráneas en algunos campos, pero las listas explícitas `relations` aparecen vacías en los archivos revisados. Por ello, no se debe asumir que todas las relaciones administradas por Directus se restauraron correctamente hasta comprobarlas en la instalación destino.

Si alguna relación no aparece, detenerse y revisar el esquema antes de modificarlo manualmente.

---

## 11. Preparar los catálogos iniciales (opcional)

El proyecto tiene un archivo separado:

```text
database/seed/catalogo.sql
```

Este archivo contiene instrucciones `INSERT` para cargar datos iniciales de los catálogos.

Incluye registros de:

- brands
- models
- fuels
- colors
- services
- parts
- status
- methods

No contiene la creación de las tablas.

### Antes de ejecutarlo

Primero comprobar:

1. Que la sincronización haya terminado correctamente.
2. Que las tablas correspondientes existan.
3. Que las tablas estén vacías.
4. Que las relaciones y claves foráneas necesarias estén preparadas.
5. Que los identificadores utilizados por los INSERT sean compatibles con las relaciones.

El archivo utiliza identificadores concretos y no debe ejecutarse repetidamente sobre tablas que ya tengan registros.

Si se ejecuta dos veces, pueden producirse errores por claves duplicadas.

### Ejecutar el catálogo

Solo después de comprobar las condiciones anteriores:

```bash
docker compose exec -T db mariadb -u Angel -p workshop < database/seed/catalogo.sql
```

MariaDB solicitará la contraseña del usuario de base de datos.

No ejecutar este archivo sobre la base de datos original ni sobre una instalación que ya contenga esos registros.

---

## 12. Qué hacer con `02_database.sql`

El archivo:

```text
database/init/02_database.sql
```

contiene la definición SQL de las 18 tablas de negocio y sus claves foráneas.

En el procedimiento de restauración descrito aquí, no debe ejecutarse automáticamente ni montarse en `/docker-entrypoint-initdb.d`.

La razón es que el snapshot de Directus ya contiene los esquemas de las colecciones de negocio y se pretende restaurarlos mediante Environment Sync.

Si después de la sincronización alguna tabla o clave foránea no existe, primero hay que comparar el resultado con el esquema original.

No ejecutar el SQL completo a ciegas: puede intentar crear tablas que ya existen o generar conflictos.

---

## 13. Qué se conserva y qué no se importa

| Elemento | Resultado |
|---|---|
| Colecciones de negocio | Se restauran desde el snapshot |
| Campos | Se restauran desde el snapshot |
| Configuración de roles | Se sincroniza |
| Políticas | Se sincronizan |
| Permisos | Se sincronizan |
| Dashboards y paneles | Se sincronizan si están incluidos |
| Flows y operaciones | Se sincronizan si están incluidos |
| Administrador inicial destino | Se crea en la instalación nueva |
| Cuentas personales del origen | No se importan |
| Registros operativos | No se importan |
| Archivos físicos subidos | No se importan |
| Catálogos iniciales | Se cargan opcionalmente mediante `catalogo.sql` |

La carpeta `directus/` no es un respaldo completo de MariaDB.

Tampoco contiene necesariamente extensiones personalizadas ni los archivos físicos de Directus Uploads.

---

## 14. Comandos de mantenimiento

### Ver contenedores

```bash
docker compose ps
```

### Ver logs de Directus

```bash
docker compose logs -f api
```

### Ver logs de MariaDB

```bash
docker compose logs -f db
```

### Detener los servicios

```bash
docker compose down
```

Este comando conserva los volúmenes.

### Volver a iniciar

```bash
docker compose up -d
```

### Revisar diferencias de configuración

```bash
d6s sync diff --to companero
```

### Volver a sincronizar cambios

```bash
d6s sync push --to companero
```

Antes de cada sincronización, revisar el resultado del `diff`.

**No ejecutar:**

```bash
docker compose down -v
```

Este comando elimina los volúmenes asociados al Compose y puede borrar la base de datos y los archivos almacenados.

---

## 15. Orden resumido de restauración

Este es el orden que debe seguir cualquier persona que prepare una instalación nueva:

```text
1. Obtener el proyecto
        ↓
2. Comprobar Docker y Node.js
        ↓
3. Revisar docker-compose.yml
        ↓
4. Fijar Directus 12.6.0
        ↓
5. Configurar credenciales propias
        ↓
6. Quitar el montaje automático de database/init
        ↓
7. Ejecutar docker compose pull
        ↓
8. Ejecutar docker compose up -d
        ↓
9. Esperar a que Directus esté listo
        ↓
10. Entrar a http://localhost:8000
        ↓
11. Instalar Directus CLI
        ↓
12. Crear perfil companero
        ↓
13. Probar conexión
        ↓
14. Ejecutar d6s sync diff
        ↓
15. Revisar diferencias y roles
        ↓
16. Ejecutar d6s sync push
        ↓
17. Verificar colecciones, campos y permisos
        ↓
18. Verificar relaciones
        ↓
19. Cargar catalogo.sql si corresponde
        ↓
20. Probar Directus
```

---

## 16. Resultado esperado

Al terminar el procedimiento, la computadora destino tendrá:

- Una instancia independiente de MariaDB.
- Una instancia independiente de Directus 12.6.0.
- Las colecciones y la configuración sincronizada del taller.
- Su propio administrador inicial.
- Sus propias credenciales.
- Sin las cuentas personales ni los registros operativos de la instalación original.

La restauración será siempre manual.

Docker Compose inicia los servicios, mientras que `d6s sync push` se ejecuta únicamente cuando el responsable decide importar o actualizar la configuración.

---

## 17. Referencias oficiales

- [Directus Environment Sync — Overview](https://directus.com/docs/guides/environment-sync)
- [Directus Environment Sync — Quickstart](https://directus.com/docs/guides/environment-sync/quickstart)
- [Directus Environment Sync — Reference](https://directus.com/docs/guides/environment-sync/reference)
- [Directus Environment Sync — Common Workflows](https://directus.com/docs/guides/environment-sync/common-workflows)
