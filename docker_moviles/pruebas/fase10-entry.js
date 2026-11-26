// Fase 10 - Validacion de H1, H2 y H3.
// H1: ejecuta el authGuard REAL con Angular DI y permisos simulados.
// H2: ejecuta el FormPage REAL de cotizaciones contra un servidor HTTP local.
// H3: ejecuta los metodos reales de las tres pantallas de evidencias y
//     comprueba el cableado de las plantillas.
// NO usa Directus, NO crea sesiones, NO escribe en la base ni en volumenes.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';

import { Injector, runInInjectionContext } from '@angular/core';

import { AuthService } from '/app/src/app/services/auth/auth';
import { authGuard } from '/app/src/app/guard/auth-guard';
import { Router } from '@angular/router';

import { QuoteServices } from '/app/src/app/services/quotes/quotes';
import { QuoteitemServices } from '/app/src/app/services/quoteitems/quoteitems';
import { QuotepartServices } from '/app/src/app/services/quoteparts/quoteparts';
import { FormPage as QuoteFormPage } from '/app/src/app/pages/quotes/form/form.page';

import { ListPage as EvidenceListPage } from '/app/src/app/pages/evidence/list/list.page';
import { DetailPage as EvidenceDetailPage } from '/app/src/app/pages/evidence/detail/detail.page';
import { DetailPage as WorkorderDetailPage } from '/app/src/app/pages/workorders/detail/detail.page';

import { EvidenceServices } from '/app/src/app/services/evidences/evidences';

process.env.NO_PROXY = '*';
process.env.no_proxy = '*';

const PORT = 18997;
const TOKEN = 'token-fase10';

// ---------------------------------------------------------------------------
// Servidor simulado
// ---------------------------------------------------------------------------

const state = {
  quotePosts: 0,
  itemPosts: 0,
  partPosts: 0,
  deletes: 0,
  patches: 0,
  quoteBodies: [],
  itemBodies: [],
  partBodies: [],
  failItemAt: 0,
  alerts: [],
  dismissals: [],
};

function resetHttp() {
  state.quotePosts = 0;
  state.itemPosts = 0;
  state.partPosts = 0;
  state.deletes = 0;
  state.patches = 0;
  state.quoteBodies = [];
  state.itemBodies = [];
  state.partBodies = [];
  state.failItemAt = 0;
  state.alerts = [];
  state.dismissals = [];
}

const server = http.createServer((req, res) => {
  let raw = '';

  req.on('data', (chunk) => {
    raw += chunk;
  });

  req.on('end', () => {
    const url = new URL(req.url, 'http://127.0.0.1');

    if (req.method === 'DELETE') {
      state.deletes += 1;
    }

    if (req.method === 'PATCH') {
      state.patches += 1;
    }

    if (req.method === 'POST' && url.pathname === '/items/quotes') {
      state.quotePosts += 1;
      state.quoteBodies.push(JSON.parse(raw));

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: { id: 77 } }));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/items/quoteitems') {
      state.itemPosts += 1;
      state.itemBodies.push(JSON.parse(raw));

      if (state.failItemAt && state.itemPosts === state.failItemAt) {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ errors: [{ message: 'fallo simulado' }] }));
        return;
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: { id: 500 + state.itemPosts } }));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/items/quoteparts') {
      state.partPosts += 1;
      state.partBodies.push(JSON.parse(raw));

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: { id: 700 + state.partPosts } }));
      return;
    }

    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ errors: [{ message: 'no simulado' }] }));
  });
});

// ---------------------------------------------------------------------------
// H1: guard real con permisos simulados
// ---------------------------------------------------------------------------

const PERMISSIONS = {
  Administrator: {
    workorders: { update: 'full' },
    directus_files: { create: 'full' },
    diagnoses: { create: 'full' },
  },
  mechanic: {
    workorders: { update: 'full' },
    directus_files: { create: 'full' },
    diagnoses: { create: 'full' },
  },
  assistant: {
    workorders: { read: 'full' },
    diagnoses: { create: 'full' },
  },
  client: {
    directus_files: { read: 'full' },
  },
};

function fakeAuth(roleName) {
  const permissions = PERMISSIONS[roleName] ?? {};

  return {
    validateSession: async () => true,
    loadUserContext: async () => undefined,
    getRole: () => roleName,
    can: (collection, action) => {
      const access = permissions[collection]?.[action];

      return access === 'full' || access === 'partial';
    },
    getID: () => 'usuario-' + roleName,
    getAccessToken: () => TOKEN,
  };
}

class FakeRouter {
  createUrlTree(commands) {
    return { redirectTo: commands[0] };
  }
}

async function runGuard(roleName, access) {
  const injector = Injector.create({
    providers: [
      { provide: AuthService, useValue: fakeAuth(roleName) },
      { provide: Router, useValue: new FakeRouter() },
    ],
  });

  return runInInjectionContext(injector, () =>
    authGuard({ data: { access } }, { url: '/ruta-de-prueba' }),
  );
}

const WORKORDER_FORM_ACCESS = {
  roles: ['Administrator', 'mechanic', 'assistant'],
  permission: { collection: 'workorders', action: 'update' },
};

const EVIDENCE_FORM_ACCESS = {
  roles: ['Administrator', 'client', 'mechanic'],
  permission: { collection: 'directus_files', action: 'create' },
};

// ---------------------------------------------------------------------------
// H2: dobles de formulario y de Ionic
// ---------------------------------------------------------------------------

class ControlDouble {
  constructor(value) {
    this.value = value;
  }

  get() {
    return this;
  }

  patchValue(values) {
    Object.assign(this, values);
  }

  markAllAsTouched() {}
}

class GroupDouble {
  constructor(values) {
    this.controls = {};

    for (const [key, value] of Object.entries(values)) {
      this.controls[key] = new ControlDouble(value);
    }
  }

  get(name) {
    return this.controls[name];
  }

  patchValue(values) {
    for (const key of Object.keys(values)) {
      if (this.controls[key]) {
        this.controls[key].value = values[key];
      }
    }
  }

  markAllAsTouched() {}

  getRawValue() {
    const out = {};

    for (const [key, control] of Object.entries(this.controls)) {
      out[key] = control.value;
    }

    return out;
  }
}

class ArrayDouble {
  constructor(controls = []) {
    this.controls = controls;
  }

  get length() {
    return this.controls.length;
  }

  at(index) {
    return this.controls[index];
  }

  markAllAsTouched() {}
}

function conceptDouble(values) {
  return new GroupDouble(values);
}

function quoteFormDouble({ items = [], parts = [] } = {}) {
  const form = new GroupDouble({
    workorder_id: 4,
    validity: '2026-12-31',
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  form.controls.items = new ArrayDouble(items);
  form.controls.parts = new ArrayDouble(parts);
  form.invalid = false;

  const baseGetRawValue = form.getRawValue.bind(form);

  form.getRawValue = () => ({
    ...baseGetRawValue(),
    items: items.map((item) => item.getRawValue()),
    parts: parts.map((part) => part.getRawValue()),
  });

  return form;
}

function alertStub() {
  return {
    create: async (options) => {
      state.alerts.push(options);

      return {
        present: async () => undefined,
        onDidDismiss: async () => undefined,
      };
    },
  };
}

function modalStub() {
  return {
    dismiss: async (data) => {
      state.dismissals.push(data);
    },
  };
}

function quotePage() {
  return new QuoteFormPage(
    {},
    alertStub(),
    modalStub(),
    new QuoteServices({ getAccessToken: () => TOKEN }),
    new QuoteitemServices({ getAccessToken: () => TOKEN }),
    new QuotepartServices({ getAccessToken: () => TOKEN }),
    {},
    {},
    {},
    { getID: () => 'usuario-mechanic' },
  );
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

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

// ------------------------------ H1 ----------------------------------------

await test('H1: Administrator puede entrar a workorders/form', async () => {
  assert.equal(await runGuard('Administrator', WORKORDER_FORM_ACCESS), true);
});

await test('H1: mechanic puede entrar a workorders/form', async () => {
  assert.equal(await runGuard('mechanic', WORKORDER_FORM_ACCESS), true);
});

await test('H1: assistant es redirigido a /forbidden en workorders/form', async () => {
  const result = await runGuard('assistant', WORKORDER_FORM_ACCESS);

  assert.equal(result.redirectTo, '/forbidden');
});

await test('H1: client es redirigido a /forbidden en workorders/form', async () => {
  const result = await runGuard('client', WORKORDER_FORM_ACCESS);

  assert.equal(result.redirectTo, '/forbidden');
});

await test('H1: mechanic puede entrar a evidences/form', async () => {
  assert.equal(await runGuard('mechanic', EVIDENCE_FORM_ACCESS), true);
});

await test('H1: client es redirigido a /forbidden en evidences/form', async () => {
  const result = await runGuard('client', EVIDENCE_FORM_ACCESS);

  assert.equal(result.redirectTo, '/forbidden');
});

await test('H1: assistant sigue sin acceso a evidences/form (rol no incluido)', async () => {
  const result = await runGuard('assistant', EVIDENCE_FORM_ACCESS);

  assert.equal(result.redirectTo, '/forbidden');
});

await test('H1: las vistas sin permiso declarado no cambian (diagnoses/form)', async () => {
  const result = await runGuard('assistant', {
    roles: ['Administrator', 'mechanic', 'assistant'],
  });

  assert.equal(result, true);
});

await test('H1: las rutas declaran el permiso real en app-routing', async () => {
  const source = fs.readFileSync('/app/src/app/app-routing.module.ts', 'utf8');
  const evidenceRoute = source.slice(
    source.indexOf("path: 'evidences/form'"),
    source.indexOf("path: 'evidences/list'"),
  );
  const workorderRoute = source.slice(
    source.indexOf("path: 'workorders/form'"),
    source.indexOf("path: 'workorders/list'"),
  );

  assert.match(evidenceRoute, /collection: 'directus_files'/);
  assert.match(evidenceRoute, /action: 'create'/);
  assert.match(workorderRoute, /collection: 'workorders'/);
  assert.match(workorderRoute, /action: 'update'/);
});

// ------------------------------ H2 ----------------------------------------

const SERVICE_CATALOG = [
  { id: 1, price: 100 },
  { id: 2, price: 200 },
];

const PART_CATALOG = [{ id: 1, price: 50 }];

function buildPage(items, parts) {
  const page = quotePage();

  page.quoteForm = quoteFormDouble({ items, parts });
  page.services = SERVICE_CATALOG;
  page.parts = PART_CATALOG;

  return page;
}

await test('H2: sin conceptos no se envia ninguna peticion', async () => {
  resetHttp();

  const page = buildPage([], []);

  await page.saveQuote();

  assert.equal(state.quotePosts, 0);
  assert.equal(state.itemPosts, 0);
  assert.equal(state.dismissals.length, 0);
  assert.match(state.alerts[0]?.message ?? '', /al menos un servicio/i);
});

await test('H2: recalcula importes y totales antes de guardar', async () => {
  resetHttp();

  const page = buildPage(
    [
      conceptDouble({ service_id: 1, price: 100, discount: 10, amount: 0 }),
    ],
    [
      conceptDouble({ part_id: 1, quantity: 2, price: 50, discount: 0, amount: 0 }),
    ],
  );

  await page.saveQuote();

  assert.equal(state.quotePosts, 1);
  assert.equal(state.quoteBodies[0].subtotal, 190);
  assert.equal(state.quoteBodies[0].tax, 30.4);
  assert.equal(state.quoteBodies[0].total, 220.4);
  assert.equal(state.itemBodies[0].amount, 90);
  assert.equal(state.partBodies[0].amount, 100);
  assert.deepEqual(state.dismissals[0], { saved: true });
});

await test('H2: un fallo posterior informa el ID y no borra ni rechaza', async () => {
  resetHttp();

  state.failItemAt = 2;

  const page = buildPage(
    [
      conceptDouble({ service_id: 1, price: 100, discount: 0, amount: 0 }),
      conceptDouble({ service_id: 2, price: 200, discount: 0, amount: 0 }),
    ],
    [],
  );

  await page.saveQuote();

  assert.equal(state.quotePosts, 1);
  assert.equal(state.itemPosts, 2);
  assert.equal(state.deletes, 0, 'no debe borrar nada');
  assert.equal(state.patches, 0, 'no debe rechazar automaticamente');
  assert.equal(state.dismissals.length, 0, 'no debe cerrar como guardada');

  const message = state.alerts[0]?.message ?? '';

  assert.match(message, /#77/);
  assert.match(message, /no se eliminó nada/);
  assert.match(message, /incompleta/);
});

await test('H2: rechaza un servicio que ya no existe antes de escribir', async () => {
  resetHttp();

  const page = buildPage(
    [
      conceptDouble({ service_id: 999, price: 100, discount: 0, amount: 0 }),
    ],
    [],
  );

  await page.saveQuote();

  assert.equal(state.quotePosts, 0);
  assert.match(state.alerts[0]?.message ?? '', /ya no esta disponible/i);
});

await test('H2: rechaza descuentos fuera de rango antes de escribir', async () => {
  resetHttp();

  const page = buildPage(
    [
      conceptDouble({ service_id: 1, price: 100, discount: 150, amount: 0 }),
    ],
    [],
  );

  await page.saveQuote();

  assert.equal(state.quotePosts, 0);
  assert.match(state.alerts[0]?.message ?? '', /entre 0 y 100/);
});

await test('H2: rechaza cantidades de refaccion no enteras', async () => {
  resetHttp();

  const page = buildPage(
    [],
    [
      conceptDouble({ part_id: 1, quantity: 0, price: 50, discount: 0, amount: 0 }),
    ],
  );

  await page.saveQuote();

  assert.equal(state.quotePosts, 0);
  assert.match(state.alerts[0]?.message ?? '', /entero mayor o igual a 1/);
});

// ------------------------------ H3 ----------------------------------------

await test('H3: resolveFormat conserva HEIC y HEIF', async () => {
  assert.equal(
    EvidenceServices.resolveFormat(new File([], 'foto.heic')),
    'heic',
  );
  assert.equal(
    EvidenceServices.resolveFormat(new File([], 'foto.HEIF')),
    'heif',
  );
  assert.equal(
    EvidenceServices.resolveFormat(new File([], 'foto.png')),
    'png',
  );
  assert.equal(EvidenceServices.resolveFormat(new File([], 'foto.txt')), null);
});

await test('H3: la lista avisa y ofrece descarga al fallar la miniatura', async () => {
  const page = new EvidenceListPage({});
  const evidence = { id: 9, format: 'heic' };

  page.onThumbError(evidence);

  assert.match(page.thumbErrors[9], /HEIC\/HEIF/);
  assert.match(page.thumbErrors[9], /Descarga el archivo/);
  assert.equal(page.fileName(evidence), 'evidencia-9.heic');
});

await test('H3: el detalle de evidencia avisa y ofrece descarga', async () => {
  const page = new EvidenceDetailPage({}, {}, {});

  page.evidence = { id: 9, format: 'heic' };
  page.onImageError();

  assert.equal(page.imageError, true);
  assert.equal(page.downloadName(), 'evidencia-9.heic');
});

await test('H3: el detalle de la orden avisa y ofrece descarga', async () => {
  const page = new WorkorderDetailPage(
    {}, {}, {}, {}, {}, {}, {}, {}, {},
  );
  const evidence = { id: 9, format: 'heic' };

  page.onEvidenceThumbError(evidence);

  assert.match(page.evidenceThumbErrors[9], /HEIC\/HEIF/);
  assert.equal(page.evidenceFileName(evidence), 'evidencia-9.heic');
});

await test('H3: las plantillas cablean el error y la descarga', async () => {
  const list = fs.readFileSync(
    '/app/src/app/pages/evidence/list/list.page.html',
    'utf8',
  );
  const detail = fs.readFileSync(
    '/app/src/app/pages/evidence/detail/detail.page.html',
    'utf8',
  );
  const workorder = fs.readFileSync(
    '/app/src/app/pages/workorders/detail/detail.page.html',
    'utf8',
  );

  assert.match(list, /\(error\)="onThumbError\(evidence\)"/);
  assert.match(list, /\[attr\.download\]="fileName\(evidence\)"/);
  assert.match(detail, /\(error\)="onImageError\(\)"/);
  assert.match(detail, /\[attr\.download\]="downloadName\(\)"/);
  assert.match(workorder, /\(error\)="onEvidenceThumbError\(evidence\)"/);
  assert.match(workorder, /\[attr\.download\]="evidenceFileName\(evidence\)"/);
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
      results,
    },
    null,
    2,
  ),
);

process.exitCode = failed.length ? 1 : 0;
