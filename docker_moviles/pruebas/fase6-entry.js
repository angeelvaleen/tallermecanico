// Fase 6 - Validacion dinamica de H2, H3 y H5.
// Ejecuta el codigo real de la app (transpilado con esbuild) contra dobles de
// prueba y un servidor HTTP local en 127.0.0.1:18999.
// NO usa Directus, ni sesiones, ni base de datos, ni archivos reales.

import assert from 'node:assert/strict';
import http from 'node:http';
import { firstValueFrom, of } from 'rxjs';

import { FormPage as QuoteFormPage } from '/app/src/app/pages/quotes/form/form.page';
import { ProfilePage } from '/app/src/app/pages/profile/profile.page';
import { EvidenceServices } from '/app/src/app/services/evidences/evidences';

process.env.NO_PROXY = '*';
process.env.no_proxy = '*';

const PORT = 18999;
const TOKEN = 'token-fase6';
const ADMIN_AVATAR = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const OWN_AVATAR = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

const state = {
  mode: 'ok',
  nextId: '',
  requests: [],
  deletes: [],
  authHeaders: [],
  filesPosts: 0,
  evidencePosts: 0,
};

const server = http.createServer((req, res) => {
  state.requests.push(req.method + ' ' + req.url);
  state.authHeaders.push(req.headers.authorization ?? '');

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    if (req.method === 'POST' && req.url === '/files') {
      state.filesPosts++;

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: { id: state.nextId } }));
      return;
    }

    if (req.method === 'POST' && req.url === '/items/evidence') {
      state.evidencePosts++;

      if (state.mode === 'network') {
        req.socket.destroy();
        return;
      }

      if (state.mode === 'reject') {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ errors: [{ message: 'La orden indicada no existe.' }] }));
        return;
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          data: {
            id: 1,
            workorder_id: 999,
            path: state.nextId,
            format: 'png',
            size: '4',
            created_at: '2026-11-25T00:00:00.000Z',
          },
        }),
      );
      return;
    }

    if (req.method === 'DELETE' && req.url.startsWith('/files/')) {
      state.deletes.push(req.url.slice('/files/'.length));

      res.writeHead(204);
      res.end();
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

function reset(overrides) {
  state.mode = 'ok';
  state.nextId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  state.requests = [];
  state.deletes = [];
  state.authHeaders = [];
  state.filesPosts = 0;
  state.evidencePosts = 0;

  Object.assign(state, overrides ?? {});
}

const evidenceService = () => new EvidenceServices({ getAccessToken: () => TOKEN });

const pngFile = () =>
  new File([new Uint8Array([137, 80, 78, 71])], 'evidencia-fase6.png', { type: 'image/png' });

// ---------------------------------------------------------------------------
// H2 - quotes/form/form.page.ts
// ---------------------------------------------------------------------------

function quotePage(workorderId, alertCalls) {
  const service = (rows) => ({ listWithOutFilter: () => of(rows) });

  const page = new QuoteFormPage(
    {},
    {
      create: async () => {
        alertCalls.count++;
        return { present: async () => {}, onDidDismiss: async () => {} };
      },
    },
    {},
    {},
    {},
    {},
    service([{ id: 4 }]),
    service([{ id: 1, name: 'Servicio F6' }]),
    service([{ id: 2, name: 'Refaccion F6' }]),
    {},
  );

  page.workorderId = workorderId;

  return page;
}

// ---------------------------------------------------------------------------
// H5 - profile.page.ts
// ---------------------------------------------------------------------------

const baseProfile = {
  id: 'usuario-fase6',
  email: 'fase6@vexora.dev',
  first_name: 'Ana',
  last_name: 'Prueba',
  description: 'Perfil de prueba',
  avatar: ADMIN_AVATAR,
  role: { id: 'rol-fase6', name: 'client' },
};

function profilePage(updateCalls, uploadCalls, assetCalls) {
  const auth = {
    canByRole: () => false,
    updateProfile: async (payload) => {
      updateCalls.push(payload);
      return Object.assign({}, baseProfile, payload);
    },
    uploadAvatar: async () => {
      uploadCalls.count++;
      return OWN_AVATAR;
    },
    assetObjectUrl: async (fileId) => {
      assetCalls.push(fileId);
      return 'blob:fase6';
    },
  };

  const page = new ProfilePage({}, auth, { navigateByUrl: async () => {} });

  page.profile = Object.assign({}, baseProfile);
  page.profileForm = {
    invalid: false,
    getRawValue: () => ({
      first_name: 'Ana F6',
      last_name: 'Prueba F6',
      description: 'Descripcion F6',
    }),
    markAllAsTouched: () => {},
    markAsPristine: () => {},
  };
  page.selectedFile = null;
  page.removePhoto = false;

  return page;
}

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

// ---------------------------------------------------------------------------
// H2
// ---------------------------------------------------------------------------

await test(
  'H2: con orden precargada, workorders sigue siendo arreglo y services/parts se cargan',
  async () => {
    const alertCalls = { count: 0 };
    const page = quotePage(4, alertCalls);

    await page.loadData();

    assert.ok(
      Array.isArray(page.workorders),
      'workorders debe ser un arreglo (antes quedaba undefined)',
    );
    assert.equal(page.workorders.length, 0);
    assert.deepEqual(page.services.map((s) => s.id), [1]);
    assert.deepEqual(page.parts.map((p) => p.id), [2]);
    assert.equal(alertCalls.count, 0);
  },
);

await test('H2: sin orden precargada, las tres listas se asignan en orden', async () => {
  const alertCalls = { count: 0 };
  const page = quotePage(undefined, alertCalls);

  await page.loadData();

  assert.deepEqual(page.workorders.map((w) => w.id), [4]);
  assert.deepEqual(page.services.map((s) => s.id), [1]);
  assert.deepEqual(page.parts.map((p) => p.id), [2]);
  assert.equal(alertCalls.count, 0);
});

// ---------------------------------------------------------------------------
// H3
// ---------------------------------------------------------------------------

await test(
  'H3: si Directus rechaza la evidencia, borra solo el archivo recien subido',
  async () => {
    reset({ mode: 'reject', nextId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' });

    let error;

    try {
      await firstValueFrom(evidenceService().upload(999, pngFile()));
    } catch (caught) {
      error = caught;
    }

    assert.ok(error, 'la subida debe fallar');
    assert.equal(state.filesPosts, 1);
    assert.equal(state.evidencePosts, 1);
    assert.deepEqual(
      state.deletes,
      [state.nextId],
      'debe borrar solo el archivo creado en esta operacion',
    );
    assert.ok(error.message.includes(state.nextId), 'el error debe identificar el archivo');
    assert.ok(error.message.includes('no se pudo registrar'), 'el error debe explicar el fallo');
    assert.ok(
      !state.requests.some((r) => r.startsWith('DELETE /items/evidence')),
      'no debe borrar evidencias',
    );
    assert.ok(
      state.authHeaders.every((h) => h === 'Bearer ' + TOKEN),
      'todas las peticiones deben llevar el token de la sesion',
    );
  },
);

await test('H3: ante error de red no borra el archivo (la fila pudo crearse)', async () => {
  reset({ mode: 'network', nextId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' });

  await assert.rejects(() => firstValueFrom(evidenceService().upload(999, pngFile())));

  assert.equal(state.filesPosts, 1);
  assert.equal(state.evidencePosts, 1);
  assert.deepEqual(state.deletes, []);
  assert.ok(!state.requests.some((r) => r.startsWith('DELETE')));
});

await test('H3: la subida correcta crea archivo y evidencia sin borrar nada', async () => {
  reset({ mode: 'ok', nextId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee' });

  const evidence = await firstValueFrom(evidenceService().upload(999, pngFile()));

  assert.equal(evidence.id, 1);
  assert.equal(state.filesPosts, 1);
  assert.equal(state.evidencePosts, 1);
  assert.deepEqual(state.deletes, []);
});

await test('H3: formato invalido no hace peticiones', async () => {
  reset();

  const txt = new File([new Uint8Array([1])], 'nota.txt', { type: 'text/plain' });

  await assert.rejects(
    () => firstValueFrom(evidenceService().upload(1, txt)),
    /Formato no permitido/,
  );
  assert.deepEqual(state.requests, []);
});

await test('H3: orden ausente no hace peticiones', async () => {
  reset();

  await assert.rejects(
    () => firstValueFrom(evidenceService().upload(0, pngFile())),
    /orden de trabajo es requerida/,
  );
  assert.deepEqual(state.requests, []);
});

await test('H3: sin token no hace peticiones', async () => {
  reset();

  const service = new EvidenceServices({ getAccessToken: () => null });

  await assert.rejects(
    () => firstValueFrom(service.upload(1, pngFile())),
    /sesión expiró/,
  );
  assert.deepEqual(state.requests, []);
});

// ---------------------------------------------------------------------------
// H5
// ---------------------------------------------------------------------------

await test('H5: con avatar asignado por admin, guardar no reenvia avatar', async () => {
  const updateCalls = [];
  const uploadCalls = { count: 0 };
  const assetCalls = [];
  const page = profilePage(updateCalls, uploadCalls, assetCalls);

  await page.saveProfile();

  assert.equal(updateCalls.length, 1);
  assert.equal('avatar' in updateCalls[0], false, 'el payload no debe incluir avatar');
  assert.equal(uploadCalls.count, 0);
  assert.equal(page.errorMessage, '');
  assert.equal(page.successMessage, 'Perfil actualizado correctamente.');
  assert.deepEqual(assetCalls, [ADMIN_AVATAR]);
});

await test('H5: quitar foto envia avatar null', async () => {
  const updateCalls = [];
  const uploadCalls = { count: 0 };
  const page = profilePage(updateCalls, uploadCalls, []);

  page.removePhoto = true;

  await page.saveProfile();

  assert.equal(updateCalls.length, 1);
  assert.equal(updateCalls[0].avatar, null);
  assert.equal(uploadCalls.count, 0);
});

await test('H5: foto nueva se sube y se envia como avatar propio', async () => {
  const updateCalls = [];
  const uploadCalls = { count: 0 };
  const page = profilePage(updateCalls, uploadCalls, []);

  page.selectedFile = new File([new Uint8Array([1])], 'foto.png', { type: 'image/png' });

  await page.saveProfile();

  assert.equal(uploadCalls.count, 1);
  assert.equal(updateCalls[0].avatar, OWN_AVATAR);
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
      results,
    },
    null,
    2,
  ),
);

process.exitCode = failed.length ? 1 : 0;
