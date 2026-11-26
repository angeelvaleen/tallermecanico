// Fase 8 - H3: validacion profunda de la subida de evidencias.
// Ejecuta el codigo real de services/evidences/evidences.ts (axios real) y de
// pages/evidence/form/form.page.ts. Solo se sustituyen los controladores de
// Ionic (alert/loading/modal), que son interfaz y no logica de negocio.
// El servidor HTTP local imita a Directus en 127.0.0.1:18997.
// NO sube archivos reales, NO toca Directus, MariaDB ni volumenes.

import assert from 'node:assert/strict';
import http from 'node:http';

import { AuthService } from '/app/src/app/services/auth/auth';
import { EvidenceServices } from '/app/src/app/services/evidences/evidences';
import { FormPage } from '/app/src/app/pages/evidence/form/form.page';

process.env.NO_PROXY = '*';
process.env.no_proxy = '*';

const PORT = 18997;
const TOKEN = 'token-h3-fase8';
const WORKORDER = 999;

// Archivos originales de la base: no deben aparecer en ningun DELETE.
const ORIGINAL_FILES = [
  '2863f725-cb95-4b3f-a1d1-afc2f99dc5a7',
  '45fed52e-aa65-4a94-82d6-f2e90355510a',
];

// Historial acumulado: no se reinicia entre pruebas, para comprobar que en
// ninguna operacion se borro una evidencia ni un archivo anterior.
const history = { requests: [], fileDeletes: [], evidenceDeletes: [], authHeaders: [] };

const state = {
  mode: { files: 'ok', evidence: 'ok', cleanup: 'ok' },
  fileSeq: 0,
  evidenceSeq: 100,
  filesPosts: 0,
  evidencePosts: 0,
  fileDeletes: [],
  evidenceDeletes: [],
  evidenceBodies: [],
  requests: [],
  authHeaders: [],
};

function reset(overrides) {
  state.mode = { files: 'ok', evidence: 'ok', cleanup: 'ok' };
  state.filesPosts = 0;
  state.evidencePosts = 0;
  state.fileDeletes = [];
  state.evidenceDeletes = [];
  state.evidenceBodies = [];
  state.requests = [];
  state.authHeaders = [];

  Object.assign(state.mode, overrides ?? {});
}

function nextFileId() {
  state.fileSeq += 1;
  return 'aaaaaaaa-aaaa-4aaa-8aaa-' + String(state.fileSeq).padStart(12, '0');
}

function send(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(payload === undefined ? '' : JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  state.requests.push(req.method + ' ' + req.url);
  state.authHeaders.push(req.headers.authorization ?? '');
  history.requests.push(req.method + ' ' + req.url);
  history.authHeaders.push(req.headers.authorization ?? '');

  let raw = '';

  req.on('data', (chunk) => {
    raw += chunk;
  });

  req.on('end', () => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const path = url.pathname;

    if (req.method === 'POST' && path === '/auth/login') {
      send(res, 200, {
        data: { access_token: TOKEN, refresh_token: 'refresh-h3', expires: 3600000 },
      });
      return;
    }

    if (req.method === 'POST' && path === '/files') {
      state.filesPosts += 1;

      if (state.mode.files === 'network') {
        req.socket.destroy();
        return;
      }

      send(res, 200, { data: { id: nextFileId() } });
      return;
    }

    if (req.method === 'POST' && path === '/items/evidence') {
      state.evidencePosts += 1;
      state.evidenceBodies.push(JSON.parse(raw));

      if (state.mode.evidence === 'network') {
        req.socket.destroy();
        return;
      }

      if (state.mode.evidence === '400') {
        send(res, 400, { errors: [{ message: 'La orden indicada no existe.' }] });
        return;
      }

      if (state.mode.evidence === '403') {
        send(res, 403, { errors: [{ message: 'No tienes permiso para crear evidencias.' }] });
        return;
      }

      if (state.mode.evidence === '500') {
        send(res, 500, { errors: [{ message: 'Error interno del servidor.' }] });
        return;
      }

      const body = JSON.parse(raw);

      state.evidenceSeq += 1;

      send(res, 200, {
        data: {
          id: state.evidenceSeq,
          workorder_id: body.workorder_id,
          path: body.path,
          format: body.format,
          size: String(body.size),
          created_at: '2026-11-25T00:00:00.000Z',
        },
      });
      return;
    }

    if (req.method === 'DELETE' && path.startsWith('/files/')) {
      state.fileDeletes.push(path.slice('/files/'.length));
      history.fileDeletes.push(path.slice('/files/'.length));

      if (state.mode.cleanup === 'network') {
        req.socket.destroy();
        return;
      }

      if (state.mode.cleanup === '403') {
        send(res, 403, { errors: [{ message: 'No tienes permiso para borrar archivos.' }] });
        return;
      }

      if (state.mode.cleanup === '500') {
        send(res, 500, { errors: [{ message: 'Error interno del servidor.' }] });
        return;
      }

      send(res, 204);
      return;
    }

    if (req.method === 'DELETE' && path.startsWith('/items/evidence/')) {
      state.evidenceDeletes.push(path.slice('/items/evidence/'.length));
      history.evidenceDeletes.push(path.slice('/items/evidence/'.length));

      send(res, 204);
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

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

const auth = new AuthService();

await auth.signin('evidencias@vexora.dev', 'clave-de-prueba');

const service = new EvidenceServices(auth);

const image = (name = 'evidencia.png', type = 'image/png', size = 4) =>
  new File([new Uint8Array(size)], name, { type });

function formPage() {
  const ui = { alerts: [], loadings: [], dismissed: [] };

  const alertController = {
    create: async (options) => {
      ui.alerts.push({ header: options.header, message: options.message });
      return { present: async () => {}, onDidDismiss: async () => {} };
    },
  };

  const loadingController = {
    create: async (options) => {
      const record = { message: options.message, dismissed: false };
      ui.loadings.push(record);

      return {
        present: async () => {},
        dismiss: async () => {
          record.dismissed = true;
        },
      };
    },
  };

  const modalController = {
    dismiss: async (data) => {
      ui.dismissed.push(data);
    },
  };

  const page = new FormPage(alertController, loadingController, modalController, service);

  page.workorderId = WORKORDER;

  return { page, ui };
}

async function uploadError(workorderId, file) {
  try {
    await new Promise((resolve, reject) => {
      service.upload(workorderId, file).subscribe({ next: resolve, error: reject });
    });
  } catch (error) {
    return error;
  }

  throw new Error('la subida debio fallar');
}

// ---------------------------------------------------------------------------
// 1. Validacion de formato y archivo antes de subir
// ---------------------------------------------------------------------------

await test('H3: rechaza formatos no permitidos sin hacer peticiones', async () => {
  reset();

  const error = await uploadError(WORKORDER, image('nota.txt', 'text/plain'));

  assert.match(error.message, /Formato no permitido/);
  assert.deepEqual(state.requests, []);
});

await test('H3: acepta las cinco extensiones documentadas', async () => {
  for (const name of ['a.jpeg', 'b.jpg', 'c.png', 'd.heic', 'e.heif']) {
    assert.equal(EvidenceServices.resolveFormat(image(name)), name.split('.').pop());
  }

  reset();

  const evidence = await new Promise((resolve, reject) => {
    service.upload(WORKORDER, image('foto.HEIC', 'image/heic')).subscribe({ next: resolve, error: reject });
  });

  assert.equal(evidence.format, 'heic');
  assert.equal(state.evidenceBodies[0].format, 'heic');
  assert.equal(state.evidenceBodies[0].size, 4);
});

await test('H3: sin extension o extension desconocida no hace peticiones', async () => {
  reset();

  assert.equal(EvidenceServices.resolveFormat(image('sinpunto')), null);

  const error = await uploadError(WORKORDER, image('animacion.gif', 'image/gif'));

  assert.match(error.message, /Formato no permitido/);
  assert.deepEqual(state.requests, []);
});

await test('H3: orden ausente no hace peticiones', async () => {
  reset();

  const error = await uploadError(0, image());

  assert.match(error.message, /orden de trabajo es requerida/);
  assert.deepEqual(state.requests, []);
});

await test('H3: sin sesion no hace peticiones', async () => {
  reset();

  const anonymous = new EvidenceServices(new AuthService());
  let error = null;

  try {
    await new Promise((resolve, reject) => {
      anonymous.upload(WORKORDER, image()).subscribe({ next: resolve, error: reject });
    });
  } catch (caught) {
    error = caught;
  }

  assert.ok(error);
  assert.match(error.message, /sesión expiró/);
  assert.deepEqual(state.requests, []);
});

await test('H3: el formulario rechaza formato invalido antes de subir', async () => {
  reset();

  const { page, ui } = formPage();
  const input = { files: [image('nota.txt', 'text/plain')], value: 'nota.txt' };

  page.onFileSelected({ target: input });

  assert.equal(page.selectedFile, null);
  assert.equal(input.value, '');
  assert.equal(ui.alerts.length, 1);
  assert.equal(ui.alerts[0].header, 'Formato no permitido');
  assert.match(ui.alerts[0].message, /JPEG, JPG, PNG, HEIC o HEIF/);
  assert.deepEqual(state.requests, []);
});

await test('H3: el formulario rechaza archivos de mas de 10 MB', async () => {
  reset();

  const { page, ui } = formPage();
  const big = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'grande.png', { type: 'image/png' });
  const input = { files: [big], value: 'grande.png' };

  page.onFileSelected({ target: input });

  assert.equal(page.selectedFile, null);
  assert.equal(input.value, '');
  assert.equal(ui.alerts.length, 1);
  assert.equal(ui.alerts[0].header, 'Archivo demasiado grande');
  assert.match(ui.alerts[0].message, /10 MB/);
  assert.deepEqual(state.requests, []);
});

await test('H3: el formulario exige orden y archivo antes de subir', async () => {
  reset();

  const first = formPage();

  first.page.workorderId = undefined;
  first.page.selectedFile = image();
  await first.page.saveEvidence();

  assert.equal(first.ui.alerts[0].header, 'Error');
  assert.match(first.ui.alerts[0].message, /No se recibió la orden de trabajo/);

  const second = formPage();

  await second.page.saveEvidence();

  assert.equal(second.ui.alerts[0].header, 'Evidencia requerida');
  assert.match(second.ui.alerts[0].message, /Selecciona una imagen/);
  assert.deepEqual(state.requests, []);
});

// ---------------------------------------------------------------------------
// 2-3. Directus acepta el archivo y rechaza la fila
// ---------------------------------------------------------------------------

await test('H3: si Directus rechaza la fila, borra solo el archivo recien subido', async () => {
  reset({ evidence: '400' });

  const error = await uploadError(WORKORDER, image());

  assert.equal(state.filesPosts, 1);
  assert.equal(state.evidencePosts, 1);
  assert.equal(state.fileDeletes.length, 1, 'debe intentar limpiar una sola vez');
  assert.equal(state.fileDeletes[0], state.evidenceBodies[0].path);
  assert.deepEqual(state.evidenceDeletes, [], 'nunca debe borrar evidencias');
  assert.match(error.message, new RegExp(state.fileDeletes[0]));
  assert.match(error.message, /no se pudo registrar/);
  assert.match(error.message, /La orden indicada no existe/);
  assert.equal(error.isAxiosError, undefined, 'debe exponer el error de negocio');
});

await test('H3: si el borrado no esta permitido, conserva el error original y el UUID', async () => {
  reset({ evidence: '403', cleanup: '403' });

  const error = await uploadError(WORKORDER, image());
  const fileId = state.evidenceBodies[0].path;

  assert.equal(state.fileDeletes.length, 1);
  assert.equal(state.fileDeletes[0], fileId);
  assert.match(error.message, new RegExp(fileId));
  assert.match(error.message, /No tienes permiso para crear evidencias/);
  assert.doesNotMatch(error.message, /status code 403/);
  assert.equal(error.isAxiosError, undefined);
  assert.deepEqual(state.evidenceDeletes, []);
});

await test('H3: si el borrado falla por red, conserva el error original', async () => {
  reset({ evidence: '500', cleanup: 'network' });

  const error = await uploadError(WORKORDER, image());
  const fileId = state.evidenceBodies[0].path;

  assert.equal(state.fileDeletes.length, 1);
  assert.match(error.message, new RegExp(fileId));
  assert.match(error.message, /Error interno del servidor/);
  assert.equal(error.isAxiosError, undefined);
  assert.deepEqual(state.evidenceDeletes, []);
});

await test('H3: la limpieza no se repite ni toca archivos anteriores', async () => {
  reset({ evidence: '400' });

  await uploadError(WORKORDER, image());
  await uploadError(WORKORDER, image());

  assert.equal(state.fileDeletes.length, 2, 'un solo intento por operacion');
  assert.equal(new Set(state.fileDeletes).size, 2, 'cada intento usa su propio archivo');

  for (const deleted of state.fileDeletes) {
    assert.match(deleted, /^aaaaaaaa-aaaa-4aaa-8aaa-/);
  }

  for (const original of ORIGINAL_FILES) {
    assert.equal(state.fileDeletes.includes(original), false);
  }
});

// ---------------------------------------------------------------------------
// 4. Fallo de red: no se puede confirmar el estado
// ---------------------------------------------------------------------------

await test('H3: error de red al registrar no borra el archivo (no se puede confirmar)', async () => {
  reset({ evidence: 'network' });

  const error = await uploadError(WORKORDER, image());
  const fileId = state.evidenceBodies[0].path;

  assert.equal(state.filesPosts, 1);
  assert.equal(state.evidencePosts, 1);
  assert.deepEqual(state.fileDeletes, [], 'no debe borrar ante error de red');
  assert.match(error.message, new RegExp(fileId));
  assert.match(error.message, /no se pudo registrar/);
  assert.deepEqual(state.evidenceDeletes, []);
});

await test('H3: error de red al subir no crea evidencia ni borra nada', async () => {
  reset({ files: 'network' });

  const error = await uploadError(WORKORDER, image());

  assert.equal(state.filesPosts, 1);
  assert.equal(state.evidencePosts, 0, 'sin archivo confirmado no se registra la fila');
  assert.deepEqual(state.fileDeletes, []);
  assert.equal(error.isAxiosError, true);
});

// ---------------------------------------------------------------------------
// 6. Comunicacion al usuario
// ---------------------------------------------------------------------------

await test('H3: el formulario informa el rechazo con el UUID del archivo', async () => {
  reset({ evidence: '400' });

  const { page, ui } = formPage();

  page.selectedFile = image();
  await page.saveEvidence();

  const alert = ui.alerts[ui.alerts.length - 1];

  assert.equal(alert.header, 'Error');
  assert.match(alert.message, /no se pudo registrar/);
  assert.match(alert.message, new RegExp(state.evidenceBodies[0].path));
  assert.match(alert.message, /La orden indicada no existe/);
  assert.equal(page.uploading, false);
  assert.equal(ui.loadings[0].dismissed, true);
  assert.deepEqual(ui.dismissed, [], 'no debe cerrar el modal como guardado');
});

await test('H3: el formulario usa el mensaje generico ante fallo de red al subir', async () => {
  reset({ files: 'network' });

  const { page, ui } = formPage();

  page.selectedFile = image();
  await page.saveEvidence();

  const alert = ui.alerts[ui.alerts.length - 1];

  assert.equal(alert.header, 'Error');
  assert.equal(
    alert.message,
    'No fue posible subir la evidencia. Revisa la conexión, el formato y los permisos.',
  );
  assert.equal(page.uploading, false);
  assert.equal(ui.loadings[0].dismissed, true);
  assert.deepEqual(ui.dismissed, []);
});

await test('H3: ante error de red al registrar, el aviso no afirma que se limpio', async () => {
  reset({ evidence: 'network' });

  const { page, ui } = formPage();

  page.selectedFile = image();
  await page.saveEvidence();

  const alert = ui.alerts[ui.alerts.length - 1];

  assert.equal(alert.header, 'Error');
  assert.match(alert.message, new RegExp(state.evidenceBodies[0].path));
  assert.doesNotMatch(alert.message, /elimin|borr/i);
  assert.equal(page.uploading, false);
});

// ---------------------------------------------------------------------------
// 7. Subida correcta
// ---------------------------------------------------------------------------

await test('H3: una subida correcta conserva el archivo y crea la evidencia', async () => {
  reset();

  const evidence = await new Promise((resolve, reject) => {
    service.upload(WORKORDER, image('foto.png')).subscribe({ next: resolve, error: reject });
  });

  assert.equal(state.filesPosts, 1);
  assert.equal(state.evidencePosts, 1);
  assert.deepEqual(state.fileDeletes, [], 'no debe borrar el archivo valido');
  assert.deepEqual(state.evidenceDeletes, []);
  assert.equal(evidence.workorder_id, WORKORDER);
  assert.equal(evidence.path, state.evidenceBodies[0].path);
  assert.equal(evidence.format, 'png');
  assert.equal(evidence.size, '4');
});

await test('H3: el formulario confirma la subida y cierra el modal', async () => {
  reset();

  const { page, ui } = formPage();

  page.selectedFile = image();
  await page.saveEvidence();

  assert.equal(state.filesPosts, 1);
  assert.equal(state.evidencePosts, 1);
  assert.deepEqual(state.fileDeletes, []);
  assert.deepEqual(ui.alerts, [
    { header: 'Evidencia guardada', message: 'La evidencia fue cargada correctamente.' },
  ]);
  assert.deepEqual(ui.dismissed, [{ saved: true }]);
  assert.equal(page.uploading, false);
  assert.equal(ui.loadings[0].dismissed, true);
});

// ---------------------------------------------------------------------------
// 5. Nunca se borran evidencias ni archivos originales
// ---------------------------------------------------------------------------

await test('H3: nunca se borran evidencias ni archivos originales', async () => {
  assert.deepEqual(history.evidenceDeletes, [], 'cero DELETE sobre evidence');

  assert.equal(
    history.requests.some((request) => request.startsWith('DELETE /items/')),
    false,
  );

  assert.equal(
    history.requests.some((request) => /^(PATCH|PUT) /.test(request)),
    false,
  );

  assert.ok(history.fileDeletes.length > 0, 'la prueba debe haber intentado limpiezas');

  for (const original of ORIGINAL_FILES) {
    assert.equal(history.fileDeletes.includes(original), false);
  }

  assert.equal(
    history.fileDeletes.every((id) => /^aaaaaaaa-aaaa-4aaa-8aaa-/.test(id)),
    true,
    'solo se borran archivos creados por la propia operacion',
  );

  // El login es la unica peticion que no puede llevar token.
  const withoutToken = history.requests.filter(
    (request, index) =>
      request !== 'POST /auth/login' &&
      history.authHeaders[index] !== 'Bearer ' + TOKEN,
  );

  assert.deepEqual(withoutToken, [], 'todas las peticiones deben llevar el token de la sesion');
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
      filesPosts: state.filesPosts,
      evidencePosts: state.evidencePosts,
      fileDeletes: history.fileDeletes,
      evidenceDeletes: history.evidenceDeletes,
      results,
    },
    null,
    2,
  ),
);

process.exitCode = failed.length ? 1 : 0;
