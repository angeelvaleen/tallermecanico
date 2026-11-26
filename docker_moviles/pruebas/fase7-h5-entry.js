// Fase 7 - H5: validacion automatizada con el codigo real de cliente y servidor.
// Ejecuta pages/profile/profile.page.ts + services/auth/auth.ts (axios real) y
// el endpoint real directus/extensions/vexora-profile/index.js, con una base de
// datos en memoria y un servidor HTTP local en 127.0.0.1:18998.
// NO crea usuarios, NO sube archivos, NO toca Directus, MariaDB ni volumenes.

import assert from 'node:assert/strict';
import http from 'node:http';

import { ProfilePage } from '/app/src/app/pages/profile/profile.page';
import { AuthService } from '/app/src/app/services/auth/auth';
import registerEndpoint from '/tmp/vexora-profile-index.mjs';

process.env.NO_PROXY = '*';
process.env.no_proxy = '*';

const PORT = 18998;
const TOKEN = 'token-h5-fase7';

const ADMIN_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const CLIENT_ID = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const ADMIN_AVATAR = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const OWN_AVATAR = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const FREE_AVATAR = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

const state = {
  requests: [],
  bodies: [],
  patchStatuses: [],
  assetsGets: [],
  filesPosts: 0,
};

// Base en memoria: el endpoint real lee y escribe aqui, nunca en MariaDB.
const db = {
  users: {
    [CLIENT_ID]: {
      id: CLIENT_ID,
      email: 'h5.fase7@vexora.dev',
      first_name: 'Ana',
      last_name: 'Prueba',
      description: 'Perfil de prueba H5',
      avatar: ADMIN_AVATAR,
    },
  },
  // El endpoint consulta la tabla con su nombre real de Directus.
  directus_files: {
    [ADMIN_AVATAR]: { id: ADMIN_AVATAR, uploaded_by: ADMIN_ID },
    [OWN_AVATAR]: { id: OWN_AVATAR, uploaded_by: CLIENT_ID },
    [FREE_AVATAR]: { id: FREE_AVATAR, uploaded_by: null },
  },
};

function database(table) {
  const query = {
    value: undefined,
    select() {
      return query;
    },
    where(column, value) {
      query.value = value;
      return query;
    },
    async first() {
      return db[table] ? db[table][query.value] : undefined;
    },
  };

  return query;
}

// Doble de UsersService: el endpoint real sigue validando y decidiendo.
class UsersService {
  constructor(options) {
    this.options = options;
  }

  async updateOne(id, payload) {
    Object.assign(db.users[id], payload);
  }

  async readOne(id) {
    const user = db.users[id];

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      description: user.description,
      avatar: user.avatar,
    };
  }
}

let profilePatch = null;

registerEndpoint(
  {
    patch: (path, handler) => {
      profilePatch = handler;
    },
  },
  {
    services: { UsersService },
    database,
    getSchema: async () => ({}),
    logger: { error: () => {} },
  },
);

if (!profilePatch) {
  throw new Error('el endpoint real no registro la ruta PATCH /me');
}

function callEndpoint(userId, body) {
  return new Promise((resolve) => {
    const timer = setTimeout(
      () => resolve({ status: 0, body: { errors: [{ message: 'sin respuesta' }] } }),
      2000,
    );

    const req = {
      accountability: userId ? { user: userId } : null,
      body,
    };

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        clearTimeout(timer);
        resolve({ status: this.statusCode, body: payload });
        return this;
      },
    };

    profilePatch(req, res);
  });
}

function send(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  state.requests.push(req.method + ' ' + req.url);

  let raw = '';

  req.on('data', (chunk) => {
    raw += chunk;
  });

  req.on('end', async () => {
    if (req.method === 'POST' && req.url === '/auth/login') {
      send(res, 200, {
        data: { access_token: TOKEN, refresh_token: 'refresh-h5', expires: 3600000 },
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/users/me')) {
      const user = db.users[CLIENT_ID];

      send(res, 200, {
        data: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          description: user.description,
          avatar: user.avatar,
          role: { id: 'rol-client', name: 'client' },
        },
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/assets/')) {
      state.assetsGets.push(req.url.slice('/assets/'.length));

      res.writeHead(200, { 'content-type': 'image/png' });
      res.end(Buffer.from([137, 80, 78, 71]));
      return;
    }

    if (req.method === 'POST' && req.url === '/files') {
      state.filesPosts++;

      send(res, 200, { data: { id: OWN_AVATAR } });
      return;
    }

    if (req.method === 'PATCH' && req.url === '/vexora-profile/me') {
      const body = raw.length ? JSON.parse(raw) : null;
      const authorized = req.headers.authorization === 'Bearer ' + TOKEN;

      state.bodies.push(body);

      const result = await callEndpoint(authorized ? CLIENT_ID : null, body);

      state.patchStatuses.push(result.status);

      send(res, result.status, result.body);
      return;
    }

    res.writeHead(404);
    res.end();
  });
});

const results = [];

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: 'OK' });
    console.log('OK    ' + name);
  } catch (error) {
    results.push({ name, status: 'FALLO', error: error.message });
    console.log('FALLO ' + name + ' :: ' + error.message);
  }
}

// Node entrega Buffer en responseType blob; el navegador entrega un Blob real.
// El sustituto solo evita ese artefacto del entorno, no altera la logica.
URL.createObjectURL = () => 'blob:h5-fase7';

// Doble del formulario: la logica de H5 esta en el payload, no en los controles.
function profileForm() {
  return {
    invalid: false,
    getRawValue: () => ({
      first_name: 'Ana H5',
      last_name: 'Prueba H5',
      description: 'Descripcion H5',
    }),
    markAllAsTouched: () => {},
    markAsPristine: () => {},
  };
}

function profilePage(auth) {
  const page = new ProfilePage(
    { group: () => profileForm() },
    auth,
    { navigateByUrl: async () => {} },
  );

  page.profileForm = profileForm();
  page.selectedFile = null;
  page.removePhoto = false;

  return page;
}

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

const auth = new AuthService();
const page = profilePage(auth);

await test('H5: login y perfil real cargan el avatar asignado por el administrador', async () => {
  await auth.signin('h5.fase7@vexora.dev', 'clave-de-prueba');
  await page.ngOnInit();

  assert.equal(page.loading, false);
  assert.equal(page.errorMessage, '');
  assert.equal(page.profile.avatar, ADMIN_AVATAR);
  assert.deepEqual(state.assetsGets, [ADMIN_AVATAR]);
  assert.equal(page.avatarUrl, 'blob:h5-fase7');
});

await test('H5: guardar sin tocar la foto no envia avatar y el endpoint responde 200', async () => {
  const before = state.bodies.length;

  await page.saveProfile();

  assert.equal(state.bodies.length, before + 1);

  const body = state.bodies[state.bodies.length - 1];

  assert.equal('avatar' in body, false, 'el payload no debe incluir avatar');
  assert.deepEqual(Object.keys(body).sort(), ['description', 'first_name', 'last_name']);
  assert.equal(state.patchStatuses[state.patchStatuses.length - 1], 200);
  assert.equal(db.users[CLIENT_ID].avatar, ADMIN_AVATAR);
  assert.equal(page.profile.avatar, ADMIN_AVATAR);
  assert.equal(page.errorMessage, '');
  assert.equal(page.successMessage, 'Perfil actualizado correctamente.');
  assert.equal(state.filesPosts, 0, 'guardar sin foto no debe subir archivos');
});

await test('H5: regresion - reenviar el avatar ajeno (comportamiento anterior) da 403', async () => {
  const before = db.users[CLIENT_ID].avatar;

  await assert.rejects(
    () => auth.updateProfile({ first_name: 'Ana H5', avatar: ADMIN_AVATAR }),
    (error) => {
      assert.equal(error.response?.status, 403);
      assert.match(
        error.response?.data?.errors?.[0]?.message ?? '',
        /Solo puedes usar fotografias subidas por tu usuario/,
      );
      return true;
    },
  );

  assert.equal(db.users[CLIENT_ID].avatar, before, 'el rechazo no debe cambiar el avatar');
});

await test('H5: el endpoint real rechaza un avatar inexistente o mal formado', async () => {
  const missing = await callEndpoint(CLIENT_ID, {
    avatar: '99999999-9999-4999-8999-999999999999',
  });
  const malformed = await callEndpoint(CLIENT_ID, { avatar: 'no-es-un-uuid' });

  assert.equal(missing.status, 400);
  assert.match(missing.body.errors[0].message, /no existe/);
  assert.equal(malformed.status, 400);
  assert.match(malformed.body.errors[0].message, /no es valida/);
});

await test('H5: el endpoint real acepta un archivo sin dueno (uploaded_by NULL)', async () => {
  const result = await callEndpoint(CLIENT_ID, { avatar: FREE_AVATAR });

  assert.equal(result.status, 200);
  assert.equal(db.users[CLIENT_ID].avatar, FREE_AVATAR);

  db.users[CLIENT_ID].avatar = ADMIN_AVATAR;
});

await test('H5: quitar foto envia avatar null y el endpoint lo acepta', async () => {
  const before = state.bodies.length;

  page.removePhoto = true;

  await page.saveProfile();

  const body = state.bodies[state.bodies.length - 1];

  assert.equal(state.bodies.length, before + 1);
  assert.equal(body.avatar, null);
  assert.equal(state.patchStatuses[state.patchStatuses.length - 1], 200);
  assert.equal(db.users[CLIENT_ID].avatar, null);
  assert.equal(page.profile.avatar, null);

  db.users[CLIENT_ID].avatar = ADMIN_AVATAR;
});

await test('H5: una foto nueva se sube y se guarda como avatar propio', async () => {
  const before = state.bodies.length;

  page.selectedFile = new File([new Uint8Array([137, 80, 78, 71])], 'h5.png', {
    type: 'image/png',
  });

  await page.saveProfile();

  const body = state.bodies[state.bodies.length - 1];

  assert.equal(state.bodies.length, before + 1);
  assert.equal(state.filesPosts, 1);
  assert.equal(body.avatar, OWN_AVATAR);
  assert.equal(state.patchStatuses[state.patchStatuses.length - 1], 200);
  assert.equal(db.users[CLIENT_ID].avatar, OWN_AVATAR);
  assert.equal(page.profile.avatar, OWN_AVATAR);

  db.users[CLIENT_ID].avatar = ADMIN_AVATAR;
});

await test('H5: el endpoint real exige sesion (401) y solo acepta campos permitidos', async () => {
  const anonymous = await callEndpoint(null, { first_name: 'Ana' });
  const forbidden = await callEndpoint(CLIENT_ID, { role: ADMIN_ID });
  const empty = await callEndpoint(CLIENT_ID, {});

  assert.equal(anonymous.status, 401);
  assert.match(anonymous.body.errors[0].message, /iniciar sesion/);
  assert.equal(forbidden.status, 400);
  assert.match(forbidden.body.errors[0].message, /role/);
  assert.equal(empty.status, 400);
  assert.match(empty.body.errors[0].message, /No hay cambios/);
});

await test('H5: el endpoint real conserva las validaciones de nombre y descripcion', async () => {
  const blank = await callEndpoint(CLIENT_ID, { first_name: '   ' });
  const longName = await callEndpoint(CLIENT_ID, { first_name: 'x'.repeat(51) });
  const longDescription = await callEndpoint(CLIENT_ID, { description: 'x'.repeat(501) });

  assert.equal(blank.status, 400);
  assert.match(blank.body.errors[0].message, /nombre no puede estar vacio/);
  assert.equal(longName.status, 400);
  assert.match(longName.body.errors[0].message, /50 caracteres/);
  assert.equal(longDescription.status, 400);
  assert.match(longDescription.body.errors[0].message, /500 caracteres/);
});

await test('H5: la prueba no toco colecciones de negocio ni borro archivos', async () => {
  assert.equal(
    state.requests.some((r) => r.includes('/items/')),
    false,
    'no debe haber peticiones a colecciones de negocio',
  );
  assert.equal(
    state.requests.some((r) => r.startsWith('DELETE')),
    false,
    'no debe haber borrados',
  );
  assert.equal(state.assetsGets.length, 3, 'solo lecturas de assets del avatar');
});

server.close();

const failed = results.filter((r) => r.status === 'FALLO');

console.log('');
console.log(
  JSON.stringify(
    {
      total: results.length,
      ok: results.length - failed.length,
      failed: failed.length,
      requests: state.requests,
      results,
    },
    null,
    2,
  ),
);

process.exitCode = failed.length ? 1 : 0;
