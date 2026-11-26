// Fase 9 - H1: el perfil solo permite subir/cambiar foto con create en
// directus_files. Ejecuta el codigo real de pages/profile/profile.page.ts y
// services/auth/auth.ts (axios real) contra un servidor local que devuelve los
// permisos efectivos de cada rol y despacha al endpoint real de perfil.
// NO usa Directus, NO sube archivos, NO escribe en la base ni en volumenes.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';

import { AuthService } from '/app/src/app/services/auth/auth';
import { ProfilePage } from '/app/src/app/pages/profile/profile.page';
import registerEndpoint from '/tmp/vexora-profile-index.mjs';

process.env.NO_PROXY = '*';
process.env.no_proxy = '*';

const PORT = 18996;
const TOKEN = 'token-h1-fase9';

const ADMIN_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const ADMIN_AVATAR = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const OWN_FILE = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

const ROLE_NAMES = ['Administrator', 'mechanic', 'assistant', 'client'];

const state = {
  userId: '',
  roleName: 'client',
  permissions: {},
  requests: [],
  assetsGets: [],
  filesPosts: 0,
  patchBodies: [],
  patchStatuses: [],
};

const db = {
  users: {},
  directus_files: {
    [ADMIN_AVATAR]: { id: ADMIN_AVATAR, uploaded_by: ADMIN_ID },
    [OWN_FILE]: { id: OWN_FILE, uploaded_by: 'usuario-client' },
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
  { patch: (path, handler) => { profilePatch = handler; } },
  {
    services: { UsersService },
    database,
    getSchema: async () => ({}),
    logger: { error: () => {} },
  },
);

// Mapa equivalente a /permissions/me: client solo lee; el resto crea archivos.
function permissionsFor(canCreate) {
  return {
    directus_files: {
      read: { access: 'full', fields: ['*'] },
      create: { access: canCreate ? 'full' : 'none', fields: ['*'] },
      update: { access: 'none' },
      delete: { access: 'none' },
    },
  };
}

function useRole(roleName, avatar = null) {
  const userId = 'usuario-' + roleName.toLowerCase();

  state.userId = userId;
  state.roleName = roleName;
  state.permissions = permissionsFor(roleName !== 'client');

  db.users[userId] = {
    id: userId,
    email: roleName.toLowerCase() + '@vexora.dev',
    first_name: 'Ana',
    last_name: 'Prueba',
    description: 'Perfil ' + roleName,
    avatar,
  };

  return userId;
}

function callEndpoint(userId, body) {
  return new Promise((resolve) => {
    const timer = setTimeout(
      () => resolve({ status: 0, body: { errors: [{ message: 'sin respuesta' }] } }),
      2000,
    );

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

    profilePatch({ accountability: userId ? { user: userId } : null, body }, res);
  });
}

function send(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(payload === undefined ? '' : JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  state.requests.push(req.method + ' ' + req.url);

  let raw = '';

  req.on('data', (chunk) => {
    raw += chunk;
  });

  req.on('end', async () => {
    const url = new URL(req.url, 'http://127.0.0.1');

    if (req.method === 'POST' && url.pathname === '/auth/login') {
      send(res, 200, {
        data: { access_token: TOKEN, refresh_token: 'refresh-h1', expires: 3600000 },
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/users/me') {
      const user = db.users[state.userId];

      send(res, 200, {
        data: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          description: user.description,
          avatar: user.avatar,
          role: { id: 'rol-' + state.roleName.toLowerCase(), name: state.roleName },
        },
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/permissions/me') {
      send(res, 200, { data: state.permissions });
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/assets/')) {
      state.assetsGets.push(url.pathname.slice('/assets/'.length));

      res.writeHead(200, { 'content-type': 'image/png' });
      res.end(Buffer.from([137, 80, 78, 71]));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/files') {
      state.filesPosts += 1;

      db.directus_files[OWN_FILE] = { id: OWN_FILE, uploaded_by: state.userId };

      send(res, 200, { data: { id: OWN_FILE } });
      return;
    }

    if (req.method === 'PATCH' && url.pathname === '/vexora-profile/me') {
      const body = raw.length ? JSON.parse(raw) : null;

      state.patchBodies.push(body);

      const result = await callEndpoint(state.userId, body);

      state.patchStatuses.push(result.status);

      send(res, result.status, result.body);
      return;
    }

    send(res, 404);
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

URL.createObjectURL = () => 'blob:h1-fase9';

function profileForm() {
  return {
    invalid: false,
    getRawValue: () => ({
      first_name: 'Ana H1',
      last_name: 'Prueba H1',
      description: 'Descripcion H1',
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

async function sessionFor(roleName, avatar = null) {
  useRole(roleName, avatar);

  const auth = new AuthService();

  await auth.signin(roleName.toLowerCase() + '@vexora.dev', 'clave-de-prueba');
  await auth.loadUserContext();

  return { auth, page: profilePage(auth) };
}

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

// ---------------------------------------------------------------------------
// 1. Roles que conservan la opcion de subir y cambiar
// ---------------------------------------------------------------------------

for (const roleName of ['Administrator', 'mechanic', 'assistant']) {
  await test(`H1: ${roleName} conserva la opcion de subir y cambiar foto`, async () => {
    const { page } = await sessionFor(roleName);

    assert.equal(page.canUploadPhoto, true);
    assert.equal(page.isAdmin, roleName === 'Administrator');
  });
}

// ---------------------------------------------------------------------------
// 2. client sin selector ni boton
// ---------------------------------------------------------------------------

await test('H1: client no puede subir ni cambiar la fotografia', async () => {
  const { page } = await sessionFor('client');

  assert.equal(page.canUploadPhoto, false);
  assert.equal(page.isAdmin, false);
});

await test('H1: la plantilla oculta el selector y el boton solo con canUploadPhoto', async () => {
  const html = fs.readFileSync('/app/src/app/pages/profile/profile.page.html', 'utf8');
  const start = html.indexOf('<ng-container *ngIf="canUploadPhoto">');
  const end = html.indexOf('</ng-container>', start);

  assert.ok(start > -1, 'debe existir el contenedor condicionado por canUploadPhoto');
  assert.ok(end > start, 'el contenedor debe cerrarse');

  const block = html.slice(start, end);

  assert.match(block, /type="file"/);
  assert.match(block, /fileInput\.click\(\)/);
  assert.match(block, /Cambiar foto/);
  assert.equal((html.match(/type="file"/g) ?? []).length, 1, 'solo un selector de archivo');

  const removeIndex = html.indexOf('Quitar foto');

  assert.ok(removeIndex > end, '"Quitar foto" debe quedar fuera del bloque condicionado');

  const removeButtonStart = html.lastIndexOf('<ion-button', removeIndex);
  const removeButton = html.slice(removeButtonStart, removeIndex + 20);

  assert.match(removeButton, /\*ngIf="avatarUrl"/, 'el boton de quitar solo aparece si hay foto');
});

// ---------------------------------------------------------------------------
// 3. client conserva visualizacion y opcion de quitar
// ---------------------------------------------------------------------------

await test('H1: client sigue viendo su fotografia', async () => {
  const { page } = await sessionFor('client', ADMIN_AVATAR);

  await page.ngOnInit();

  assert.equal(page.errorMessage, '');
  assert.equal(page.profile.avatar, ADMIN_AVATAR);
  assert.equal(page.avatarUrl, 'blob:h1-fase9');
  assert.deepEqual(state.assetsGets, [ADMIN_AVATAR]);
});

await test('H1: client puede quitar su fotografia', async () => {
  const { page } = await sessionFor('client', ADMIN_AVATAR);

  await page.ngOnInit();

  page.removePhoto = true;

  await page.saveProfile();

  const body = state.patchBodies[state.patchBodies.length - 1];

  assert.equal(body.avatar, null);
  assert.equal(state.patchStatuses[state.patchStatuses.length - 1], 200);
  assert.equal(db.users['usuario-client'].avatar, null);
  assert.equal(page.errorMessage, '');
  assert.equal(page.successMessage, 'Perfil actualizado correctamente.');
});

// ---------------------------------------------------------------------------
// 4. Los demas campos siguen funcionando
// ---------------------------------------------------------------------------

await test('H1: client guarda nombre, apellido y descripcion sin enviar avatar', async () => {
  const { page } = await sessionFor('client');

  await page.ngOnInit();
  await page.saveProfile();

  const body = state.patchBodies[state.patchBodies.length - 1];

  assert.deepEqual(Object.keys(body).sort(), ['description', 'first_name', 'last_name']);
  assert.equal(state.patchStatuses[state.patchStatuses.length - 1], 200);
  assert.equal(page.profile.first_name, 'Ana H1');
  assert.equal(page.errorMessage, '');
});

await test('H1: mechanic con avatar asignado guarda el resto sin reenviarlo (H5)', async () => {
  const { page } = await sessionFor('mechanic', ADMIN_AVATAR);

  await page.ngOnInit();
  await page.saveProfile();

  const body = state.patchBodies[state.patchBodies.length - 1];

  assert.equal('avatar' in body, false);
  assert.equal(state.patchStatuses[state.patchStatuses.length - 1], 200);
  assert.equal(db.users['usuario-mechanic'].avatar, ADMIN_AVATAR);
});

await test('H1: mechanic sigue pudiendo subir una foto nueva', async () => {
  const { page } = await sessionFor('mechanic');

  page.selectedFile = new File([new Uint8Array([137, 80, 78, 71])], 'foto.png', {
    type: 'image/png',
  });

  await page.saveProfile();

  const body = state.patchBodies[state.patchBodies.length - 1];

  assert.equal(state.filesPosts, 1);
  assert.equal(body.avatar, OWN_FILE);
  assert.equal(state.patchStatuses[state.patchStatuses.length - 1], 200);
  assert.equal(page.profile.avatar, OWN_FILE);
});

// ---------------------------------------------------------------------------
// 5. Sin escrituras ni peticiones inesperadas
// ---------------------------------------------------------------------------

await test('H1: la prueba no toca colecciones de negocio ni borra archivos', async () => {
  assert.equal(
    state.requests.some((request) => request.includes('/items/')),
    false,
  );
  assert.equal(
    state.requests.some((request) => request.startsWith('DELETE')),
    false,
  );
  assert.equal(
    state.requests.some((request) => request.startsWith('POST /files')),
    true,
    'solo el escenario de subida debe crear un archivo simulado',
  );
});

server.close();

const failed = results.filter((result) => result.status === 'FALLO');

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
