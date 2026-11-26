// VEXORA - Pruebas de seguridad S2 (aislamiento por fila) y S3 (/users).
// Requiere la extension vexora-rls activa y los datos originales cargados.
//
// Uso (Git Bash):
//   VEXORA_PW=password VEXORA_ADMIN_PW=<clave admin> node pruebas/seguridad-s2s3.js
//
// Crea fixtures temporales con el Administrator, los usa para probar el
// aislamiento entre clientes y entre mecanicos, y los elimina al final.
// No modifica registros originales (las escrituras sobre datos ajenos se
// intentan y deben ser rechazadas). Compara un snapshot de las colecciones
// de negocio antes y despues para probar que no hubo alteracion ni perdida.

const API = process.env.VEXORA_API ?? 'http://localhost:8000';
const PW = process.env.VEXORA_PW;
const APW = process.env.VEXORA_ADMIN_PW;

if (!PW || !APW) {
  console.error('Defina VEXORA_PW y VEXORA_ADMIN_PW.');
  process.exit(2);
}

const BUSINESS = [
  'vehicles',
  'appointments',
  'workorders',
  'quotes',
  'quoteitems',
  'quoteparts',
  'payment',
  'diagnoses',
  'evidence',
  'history',
];

const CATALOG = ['brands', 'models', 'colors', 'fuels', 'methods', 'parts', 'services'];

let failures = 0;
let checks = 0;

function check(name, ok, detail = '') {
  checks += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? 'OK  ' : 'FAIL'} | ${name}${detail ? ` | ${detail}` : ''}`);
}

async function call(method, path, token, body) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text.length ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: response.status, data };
}

async function login(email, password) {
  const response = await call('POST', '/auth/login', null, { email, password });
  if (response.status !== 200 || !response.data?.data?.access_token) {
    throw new Error(`login fallido ${email}: ${response.status}`);
  }
  const token = response.data.data.access_token;
  const me = await call('GET', '/users/me?fields=id,email,role.id,role.name', token);
  return { token, id: me.data?.data?.id, email, role: me.data?.data?.role?.name };
}

async function count(token, collection, extra = '') {
  const path = `/items/${collection}?aggregate[count]=*&limit=-1${extra}`;
  const response = await call('GET', path, token);
  return response.data?.data?.[0]?.count;
}

async function countUsers(token) {
  const response = await call('GET', '/users?aggregate[count]=*&limit=-1', token);
  return response.data?.data?.[0]?.count;
}

async function list(token, collection, query = '') {
  const response = await call('GET', `/items/${collection}?limit=-1${query}`, token);
  return { status: response.status, rows: response.data?.data ?? [] };
}

async function gql(token, query, variables) {
  const response = await call('POST', '/graphql', token, { query, variables });
  return { status: response.status, data: response.data?.data, errors: response.data?.errors ?? [] };
}

// Las colecciones del sistema (directus_users) viven en el esquema system.
async function gqlSystem(token, query, variables) {
  const response = await call('POST', '/graphql/system', token, { query, variables });
  return { status: response.status, data: response.data?.data, errors: response.data?.errors ?? [] };
}

const created = {
  payment: [],
  quoteitems: [],
  quotes: [],
  diagnoses: [],
  evidence: [],
  workorders: [],
  appointments: [],
  vehicles: [],
};

async function removeAll(adminToken) {
  const order = ['payment', 'quoteitems', 'quotes', 'diagnoses', 'evidence', 'workorders', 'appointments', 'vehicles'];
  for (const collection of order) {
    for (const id of created[collection].slice().reverse()) {
      const response = await call('DELETE', `/items/${collection}/${id}`, adminToken);
      if (response.status !== 204) {
        console.log(`AVISO | no se pudo eliminar fixture ${collection}/${id} (status ${response.status})`);
      }
    }
  }
}

async function snapshot(adminToken) {
  const data = {};
  for (const collection of [...BUSINESS, ...CATALOG]) {
    const response = await call('GET', `/items/${collection}?limit=-1&fields=*`, adminToken);
    data[collection] = response.data?.data ?? null;
  }
  const users = await call('GET', '/users?limit=-1&fields=id,email,role,status', adminToken);
  data.users = users.data?.data ?? null;
  return data;
}

(async () => {
  const admin = await login('admin@vexora.dev', APW);
  const client = await login('client@vexora.dev', PW);
  const other = await login('prutest01@vexora.dev', PW);
  const mechanic = await login('mechanic@vexora.dev', PW);
  const assistant = await login('assistant@vexora.dev', PW);

  console.log(`Roles: admin=${admin.id} client=${client.id} prutest01=${other.id} mechanic=${mechanic.id} assistant=${assistant.id}`);

  const baseCounts = { admin: {}, client: {}, other: {}, mechanic: {}, assistant: {} };
  for (const [name, actor] of Object.entries(baseCounts)) {
    const token = { admin, client, other, mechanic, assistant }[name].token;
    for (const collection of BUSINESS) actor[collection] = await count(token, collection);
    actor.users = await countUsers(token);
  }
  console.log('Conteos base:', JSON.stringify(baseCounts));

  const before = await snapshot(admin.token);
  console.log('Snapshot previo capturado:', Object.keys(before).map((k) => `${k}=${before[k]?.length ?? 'null'}`).join(' '));

  try {
    // -----------------------------------------------------------------------
    // Bloque 0: linea base de datos originales y catalogos
    // -----------------------------------------------------------------------
    check('base: admin ve 4 vehiculos y 5 usuarios', baseCounts.admin.vehicles === 4 && baseCounts.admin.users === 5, `vehiculos=${baseCounts.admin.vehicles} usuarios=${baseCounts.admin.users}`);
    check('base: prutest01 no posee datos', BUSINESS.every((c) => Number(baseCounts.other[c]) === 0), JSON.stringify(baseCounts.other));
    check('base: client ve sus 4 vehiculos', Number(baseCounts.client.vehicles) === 4 && Number(baseCounts.client.workorders) === 4 && Number(baseCounts.client.payment) === 2, `vehiculos=${baseCounts.client.vehicles} ordenes=${baseCounts.client.workorders} pagos=${baseCounts.client.payment}`);

    // `methods` no es legible por mechanic/assistant en los permisos originales;
    // se valida solo donde el rol ya tenia acceso.
    for (const [name, actor, catalogs] of [
      ['client', client, CATALOG],
      ['mechanic', mechanic, CATALOG.filter((c) => c !== 'methods')],
      ['assistant', assistant, CATALOG.filter((c) => c !== 'methods')],
    ]) {
      let ok = true;
      const detail = [];
      for (const collection of catalogs) {
        const n = Number(await count(actor.token, collection));
        detail.push(`${collection}=${n}`);
        if (!(n > 0)) ok = false;
      }
      check(`catalogos intactos para ${name}`, ok, detail.join(' '));
    }

    // -----------------------------------------------------------------------
    // S3: /users y correos (sin fixtures)
    // -----------------------------------------------------------------------
    check('S3 client solo se ve a si mismo', Number(await countUsers(client.token)) === 1, `usuarios=${await countUsers(client.token)}`);
    check('S3 prutest01 solo se ve a si mismo', Number(await countUsers(other.token)) === 1);
    check('S3 assistant conserva 5 usuarios', Number(await countUsers(assistant.token)) === 5);
    check('S3 mechanic conserva 5 usuarios (sin cambios)', Number(await countUsers(mechanic.token)) === 5);
    check('S3 admin conserva 5 usuarios', Number(await countUsers(admin.token)) === 5);

    const clientUsers = await call('GET', '/users?limit=-1&fields=*', client.token);
    const clientRows = clientUsers.data?.data ?? [];
    check('S3 client /users?fields=* devuelve solo su ficha', clientRows.length === 1 && clientRows[0].email === 'client@vexora.dev', `filas=${clientRows.length}`);
    check('S3 client no recibe token ni tfa_secret', clientRows.length === 1 && !('token' in clientRows[0]) && !('tfa_secret' in clientRows[0]) && !('auth_data' in clientRows[0]), Object.keys(clientRows[0] ?? {}).join(','));

    const clientMe = await call('GET', '/users/me?fields=*,role.id,role.name', client.token);
    check('S3 client conserva perfil y rol', clientMe.status === 200 && clientMe.data?.data?.first_name !== undefined && clientMe.data?.data?.role?.name === 'client', `status=${clientMe.status} rol=${clientMe.data?.data?.role?.name}`);

    const clientFiltered = await call('GET', `/users?limit=-1&fields=email&filter[role][name][_eq]=mechanic`, client.token);
    check('S3 client no puede listar mecanicos por filtro', (clientFiltered.data?.data ?? []).length === 0);

    const clientEmailFilter = await call('GET', `/users?limit=-1&fields=email&filter[email][_neq]=client@vexora.dev`, client.token);
    check('S3 filtro email ajeno no devuelve correos', (clientEmailFilter.data?.data ?? []).length === 0);

    const clientOtherUser = await call('GET', `/users/${mechanic.id}?fields=email,first_name,role.name`, client.token);
    check('S3 client no puede leer ficha ajena por ID', clientOtherUser.status === 403, `status=${clientOtherUser.status}`);

    const otherClientUser = await call('GET', `/users/${client.id}?fields=email`, other.token);
    check('S3 prutest01 no puede leer ficha de client', otherClientUser.status === 403, `status=${otherClientUser.status}`);

    const clientUserEmails = await call('GET', '/users?limit=-1&fields=email', client.token);
    const emails = (clientUserEmails.data?.data ?? []).map((row) => row.email);
    check('S3 client solo obtiene su correo', emails.length === 1 && emails[0] === 'client@vexora.dev', emails.join(','));

    // -----------------------------------------------------------------------
    // S2: lecturas REST y acceso directo por ID
    // -----------------------------------------------------------------------
    check('S2 prutest01 no lista vehiculos ajenos', Number(await count(other.token, 'vehicles')) === 0);
    check('S2 prutest01 no lista ordenes ajenas', Number(await count(other.token, 'workorders')) === 0);
    check('S2 prutest01 no lista cotizaciones ajenas', Number(await count(other.token, 'quotes')) === 0);
    check('S2 prutest01 no lista pagos ajenos', Number(await count(other.token, 'payment')) === 0);
    check('S2 prutest01 no lista citas ajenas', Number(await count(other.token, 'appointments')) === 0);

    for (const collection of ['vehicles', 'appointments', 'workorders', 'quotes', 'payment']) {
      const foreign = await call('GET', `/items/${collection}/1?fields=*`, other.token);
      check(`S2 prutest01 detalle ajeno ${collection}/1 -> 403`, foreign.status === 403, `status=${foreign.status}`);
    }

    const ownVehicle = await call('GET', '/items/vehicles/1?fields=*', client.token);
    check('S2 client detalle de su vehiculo 1', ownVehicle.status === 200 && ownVehicle.data?.data?.id === 1, `status=${ownVehicle.status}`);
    const ownOrder = await call('GET', '/items/workorders/1?fields=*', client.token);
    check('S2 client detalle de su orden 1', ownOrder.status === 200, `status=${ownOrder.status}`);
    const ownQuote = await call('GET', '/items/quotes/1?fields=*', client.token);
    check('S2 client detalle de su cotizacion 1', ownQuote.status === 200, `status=${ownQuote.status}`);
    const ownPaymentRead = await call('GET', '/items/payment/1?fields=*', client.token);
    check('S2 client detalle de su pago 1', ownPaymentRead.status === 200, `status=${ownPaymentRead.status}`);

    // -----------------------------------------------------------------------
    // S2: filtros manipulados, agregaciones y consultas masivas
    // -----------------------------------------------------------------------
    const tamper = [
      ['filtro por ID ajeno', '&filter[id][_eq]=1'],
      ['filtro _or con IDs ajenos', '&filter[_or][0][id][_eq]=1&filter[_or][1][id][_eq]=3'],
      ['filtro por email del dueno', '&filter[vehicle_id][user_id][email][_eq]=client@vexora.dev'],
      ['filtro _neq para barrer todo', '&filter[id][_neq]=-1'],
      ['filtro JSON con _and', `&filter=${encodeURIComponent(JSON.stringify({ _and: [{ id: { _gte: 1 } }] }))}`],
      ['filtro JSON vacio', `&filter=${encodeURIComponent('{}')}`],
      ['filtro anidado por usuario', `&filter[vehicle_id][user_id][_eq]=${client.id}`],
    ];
    for (const [name, query] of tamper) {
      const result = await count(other.token, 'workorders', query);
      check(`S2 prutest01 ${name} -> 0 ordenes`, Number(result) === 0, `count=${result}`);
    }

    const bulkRead = await list(other.token, 'workorders', '');
    check('S2 prutest01 lectura masiva sin filas ajenas', bulkRead.rows.length === 0, `filas=${bulkRead.rows.length}`);

    const aggOther = await call('GET', '/items/vehicles?aggregate[count]=*&limit=-1', other.token);
    const aggRow = aggOther.data?.data?.[0] ?? {};
    check('S2 prutest01 agregaciones en cero', Number(aggRow.count) === 0, JSON.stringify(aggRow));

    const aggClient = await count(client.token, 'workorders');
    check('S2 client agregacion conserva 4 ordenes', Number(aggClient) === 4, `count=${aggClient}`);

    const groupOther = await call('GET', '/items/workorders?groupBy[]=status_id&aggregate[count]=*&limit=-1', other.token);
    check('S2 prutest01 agrupacion sin datos', (groupOther.data?.data ?? []).length === 0);

    // -----------------------------------------------------------------------
    // S2: GraphQL
    // -----------------------------------------------------------------------
    const gqlOther = await gql(other.token, '{ workorders { id } }');
    check('S2 GraphQL prutest01 sin ordenes', (gqlOther.data?.workorders ?? []).length === 0, `errores=${gqlOther.errors.length}`);

    const gqlOtherVehicles = await gql(other.token, `{ vehicles(filter: { id: { _eq: 1 } }) { id plate } }`);
    check('S2 GraphQL prutest01 filtro por ID ajeno vacio', (gqlOtherVehicles.data?.vehicles ?? []).length === 0);

    const gqlOtherAgg = await gql(other.token, '{ vehicles_aggregated { count { id } } }');
    check('S2 GraphQL prutest01 agregado en cero', Number(gqlOtherAgg.data?.vehicles_aggregated?.[0]?.count?.id ?? -1) === 0, JSON.stringify(gqlOtherAgg.data ?? gqlOtherAgg.errors));

    const gqlClient = await gql(client.token, '{ workorders { id } }');
    check('S2 GraphQL client conserva 4 ordenes', (gqlClient.data?.workorders ?? []).length === 4);

    const gqlMechanic = await gql(mechanic.token, '{ workorders { id } }');
    check('S2 GraphQL mechanic conserva 4 ordenes', (gqlMechanic.data?.workorders ?? []).length === 4);

    const gqlAssistant = await gql(assistant.token, '{ workorders { id } }');
    check('S2 GraphQL assistant conserva 4 ordenes', (gqlAssistant.data?.workorders ?? []).length === 4);

    const gqlUsersClient = await gqlSystem(client.token, '{ users { id email } }');
    check('S3 GraphQL client solo su usuario', (gqlUsersClient.data?.users ?? []).length === 1 && gqlUsersClient.data.users[0].email === 'client@vexora.dev', JSON.stringify(gqlUsersClient.data));

    const gqlUsersOther = await gqlSystem(other.token, '{ users { id email } }');
    check('S3 GraphQL prutest01 solo su usuario', (gqlUsersOther.data?.users ?? []).length === 1 && gqlUsersOther.data.users[0].email === 'prutest01@vexora.dev');

    const gqlUserById = await gqlSystem(other.token, `{ users_by_id(id: "${client.id}") { id email } }`);
    check('S3 GraphQL prutest01 usuario ajeno rechazado', gqlUserById.errors.length > 0 && gqlUserById.data?.users_by_id === null, JSON.stringify(gqlUserById.data));

    const gqlUsersAdmin = await gqlSystem(admin.token, '{ users { id email } }');
    check('S3 GraphQL admin conserva todos los usuarios', (gqlUsersAdmin.data?.users ?? []).length === 5);

    // Fuga de correo por relacion (REST y GraphQL)
    const nested = await call('GET', '/items/workorders?limit=-1&fields=*,mechanic_id.*,mechanic_id.email,vehicle_id.user_id.email', client.token);
    const nestedRows = nested.data?.data ?? [];
    check('S3 relacion mechanic_id sin email (REST)', nestedRows.length > 0 && nestedRows.every((row) => row.mechanic_id?.email === undefined), `filas=${nestedRows.length}`);
    check('S3 relacion vehicle_id.user_id sin email (REST)', nestedRows.length > 0 && nestedRows.every((row) => row.vehicle_id?.user_id?.email === undefined));
    check('S3 relacion conserva nombre del mecanico', nestedRows.every((row) => row.mechanic_id?.first_name !== undefined));

    const gqlNested = await gql(client.token, '{ workorders { id mechanic_id { first_name email } vehicle_id { user_id { first_name email } } } }');
    const gqlRows = gqlNested.data?.workorders ?? [];
    check('S3 relacion mechanic_id sin email (GraphQL)', gqlRows.length > 0 && gqlRows.every((row) => row.mechanic_id?.email === null));
    check('S3 relacion vehicle_id.user_id sin email (GraphQL)', gqlRows.every((row) => row.vehicle_id?.user_id?.email === null));


    // -----------------------------------------------------------------------
    // /users/me y perfil de los 4 roles
    // -----------------------------------------------------------------------
    for (const [name, actor] of [['admin', admin], ['client', client], ['mechanic', mechanic], ['assistant', assistant]]) {
      const me = await call('GET', '/users/me?fields=id,email,first_name,last_name,role.id,role.name', actor.token);
      check(`/users/me funciona para ${name}`, me.status === 200 && me.data?.data?.email === actor.email && !!me.data?.data?.role?.name, `status=${me.status} rol=${me.data?.data?.role?.name}`);
      const perms = await call('GET', '/permissions/me', actor.token);
      check(`/permissions/me funciona para ${name}`, perms.status === 200);
    }

    // -----------------------------------------------------------------------
    // Escrituras sobre datos ajenos (deben rechazarse, sin cambios)
    // -----------------------------------------------------------------------
    const denials = [
      ['client PATCH vehiculo ajeno', 'PATCH', '/items/vehicles/1', { mileage: 123456 }, other.token],
      ['client PATCH cita ajena', 'PATCH', '/items/appointments/1', { reason: 'S2' }, other.token],
      ['client PATCH cotizacion ajena', 'PATCH', '/items/quotes/1', { status_id: 10 }, other.token],
      ['client PATCH item de cotizacion ajena', 'PATCH', '/items/quoteitems/1', { is_approved: true }, other.token],
      ['client DELETE vehiculo ajeno', 'DELETE', '/items/vehicles/1', undefined, other.token],
    ];
    for (const [name, method, path, body, token] of denials) {
      const response = await call(method, path, token, body);
      check(`S2 ${name} -> 403`, response.status === 403, `status=${response.status}`);
    }

    const bulkForeign = await call('PATCH', '/items/vehicles', other.token, [{ id: 1, mileage: 111111 }]);
    check('S2 PATCH masivo de vehiculo ajeno -> 403', bulkForeign.status === 403, `status=${bulkForeign.status}`);

    const createForeignVehicle = await call('POST', '/items/vehicles', other.token, {
      model_id: 1, user_id: client.id, fuel_id: 1, color_id: 1, plate: 'PRU-S2-ROB', vin: 'PRUS2ROB000000001', year: 2024, mileage: 10,
    });
    check('S2 client no crea vehiculo a nombre de otro', createForeignVehicle.status === 403, `status=${createForeignVehicle.status}`);

    const createForeignAppointment = await call('POST', '/items/appointments', other.token, {
      vehicle_id: 1, status_id: 1, date: '2026-12-15', time: '09:00', reason: 'S2',
    });
    check('S2 client no crea cita sobre vehiculo ajeno', createForeignAppointment.status === 403, `status=${createForeignAppointment.status}`);

    const createForeignPayment = await call('POST', '/items/payment', other.token, {
      quote_id: 1, user_id: other.id, method_id: 1, amount: 1, reference: 'PRU-S2-ROB',
    });
    check('S2 client no paga cotizacion ajena', createForeignPayment.status === 403, `status=${createForeignPayment.status}`);

    const gqlForeignUpdate = await gql(other.token, `mutation { update_vehicles_item(id: "1", data: { mileage: 222222 }) { id } }`);
    check('S2 GraphQL prutest01 no actualiza vehiculo ajeno', gqlForeignUpdate.errors.length > 0, JSON.stringify(gqlForeignUpdate.data));

    const gqlForeignDelete = await gql(other.token, `mutation { delete_vehicles_item(id: "1") { id } }`);
    check('S2 GraphQL prutest01 no elimina vehiculo ajeno', gqlForeignDelete.errors.length > 0);

    const unchanged = await call('GET', '/items/vehicles/1?fields=mileage', admin.token);
    check('S2 vehiculo original sin cambios tras intentos', Number(unchanged.data?.data?.mileage) !== 123456 && Number(unchanged.data?.data?.mileage) !== 111111 && Number(unchanged.data?.data?.mileage) !== 222222, `mileage=${unchanged.data?.data?.mileage}`);

    // -----------------------------------------------------------------------
    // Fixtures temporales
    // -----------------------------------------------------------------------
    console.log('== Creando fixtures temporales (Administrator) ==');

    const vehicleFixture = await call('POST', '/items/vehicles', admin.token, {
      model_id: 1, user_id: other.id, fuel_id: 1, color_id: 1,
      plate: 'PRU-S2-VEH', vin: 'PRUS2S30000000001', year: 2024, mileage: 1000,
    });
    const V = vehicleFixture.data?.data?.id;
    if (V) created.vehicles.push(V);
    check('fixture: vehiculo de prutest01 creado', vehicleFixture.status === 200, `id=${V} status=${vehicleFixture.status} ${JSON.stringify(vehicleFixture.data?.errors ?? '')}`);

    const appointmentFixture = await call('POST', '/items/appointments', admin.token, {
      vehicle_id: V, status_id: 1, date: '2026-12-20', time: '09:00', reason: 'PRU-S2 cita',
    });
    const A1 = appointmentFixture.data?.data?.id;
    if (A1) created.appointments.push(A1);

    const woMechanic = await call('POST', '/items/workorders', admin.token, {
      vehicle_id: V, mechanic_id: mechanic.id, status_id: 4, mileage: 1000, delivery: null,
    });
    const W1 = woMechanic.data?.data?.id;
    if (W1) created.workorders.push(W1);

    const woAssistant = await call('POST', '/items/workorders', admin.token, {
      vehicle_id: V, mechanic_id: assistant.id, status_id: 4, mileage: 1000, delivery: null,
    });
    const W2 = woAssistant.data?.data?.id;
    if (W2) created.workorders.push(W2);

    const quoteFixture = await call('POST', '/items/quotes', admin.token, {
      workorder_id: W2, user_id: other.id, status_id: 9, subtotal: 10, tax: 1.6, total: 11.6, validity: '2026-12-31',
    });
    const Q1 = quoteFixture.data?.data?.id;
    if (Q1) created.quotes.push(Q1);

    const itemFixture = await call('POST', '/items/quoteitems', admin.token, {
      quote_id: Q1, service_id: 1, price: 10, discount: 0, amount: 10, is_approved: false,
    });
    const I1 = itemFixture.data?.data?.id;
    if (I1) created.quoteitems.push(I1);

    const payFixture = await call('POST', '/items/payment', admin.token, {
      quote_id: Q1, user_id: other.id, method_id: 1, amount: 11.6, reference: 'PRU-S2-PAGO', paid_at: new Date().toISOString(),
    });
    const P1 = payFixture.data?.data?.id;
    if (P1) created.payment.push(P1);

    check('fixtures completos', [V, A1, W1, W2, Q1, I1, P1].every(Boolean), JSON.stringify({ V, A1, W1, W2, Q1, I1, P1 }));

    // -----------------------------------------------------------------------
    // S2 con fixtures: clientes y mecanicos
    // -----------------------------------------------------------------------
    const otherVehicles = Number(await count(other.token, 'vehicles'));
    const otherOrders = Number(await count(other.token, 'workorders'));
    const otherQuotes = Number(await count(other.token, 'quotes'));
    const otherPayment = Number(await count(other.token, 'payment'));
    check('S2 prutest01 ve sus fixtures (1/1/2/1)', otherVehicles === 1 && otherOrders === 2 && otherQuotes === 1 && otherPayment === 1, `vehiculos=${otherVehicles} ordenes=${otherOrders} cotizaciones=${otherQuotes} pagos=${otherPayment}`);

    for (const collection of BUSINESS) {
      const now = Number(await count(client.token, collection));
      check(`S2 client ajeno a fixtures: ${collection} sin cambios`, now === Number(baseCounts.client[collection]), `${baseCounts.client[collection]} -> ${now}`);
    }

    for (const [collection, id] of [['vehicles', V], ['appointments', A1], ['workorders', W1], ['workorders', W2], ['quotes', Q1], ['payment', P1]]) {
      const foreign = await call('GET', `/items/${collection}/${id}?fields=*`, client.token);
      check(`S2 client detalle ajeno ${collection}/${id} -> 403`, foreign.status === 403, `status=${foreign.status}`);
    }

    const mechOwnOrder = await call('GET', `/items/workorders/${W1}?fields=*`, mechanic.token);
    const mechForeignOrder = await call('GET', `/items/workorders/${W2}?fields=*`, mechanic.token);
    check('S2 mechanic lee su orden W1', mechOwnOrder.status === 200, `status=${mechOwnOrder.status}`);
    check('S2 mechanic NO lee la orden W2 de otro', mechForeignOrder.status === 403, `status=${mechForeignOrder.status}`);

    const mechOrders = Number(await count(mechanic.token, 'workorders'));
    check('S2 mechanic solo suma su orden (base+1)', mechOrders === Number(baseCounts.mechanic.workorders) + 1, `base=${baseCounts.mechanic.workorders} ahora=${mechOrders}`);

    const mechQuotes = Number(await count(mechanic.token, 'quotes'));
    check('S2 mechanic no ve cotizacion de la orden ajena', mechQuotes === Number(baseCounts.mechanic.quotes), `base=${baseCounts.mechanic.quotes} ahora=${mechQuotes}`);

    const mechVehicleForeign = await call('GET', `/items/vehicles/${V}?fields=*`, mechanic.token);
    check('S2 mechanic si ve el vehiculo de su orden', mechVehicleForeign.status === 200, `status=${mechVehicleForeign.status}`);

    // Mechanic: operaciones permitidas sobre su orden
    const mechUpdateOwn = await call('PATCH', `/items/workorders/${W1}`, mechanic.token, { status_id: 5, mileage: 1100 });
    check('P5 mechanic actualiza su propia orden', mechUpdateOwn.status === 200 && Number(mechUpdateOwn.data?.data?.status_id) === 5, `status=${mechUpdateOwn.status}`);

    const mechUpdateForeign = await call('PATCH', `/items/workorders/${W2}`, mechanic.token, { status_id: 5 });
    check('S2 mechanic no actualiza orden ajena -> 403', mechUpdateForeign.status === 403, `status=${mechUpdateForeign.status}`);

    const gqlMechForeign = await gql(mechanic.token, `mutation { update_workorders_item(id: "${W2}", data: { status_id: 5 }) { id } }`);
    check('S2 GraphQL mechanic no actualiza orden ajena', gqlMechForeign.errors.length > 0, JSON.stringify(gqlMechForeign.data));

    const mechSteal = await call('PATCH', `/items/workorders/${W1}`, mechanic.token, { mechanic_id: assistant.id });
    check('S2 mechanic no reasigna su orden a otro -> 403', mechSteal.status === 403, `status=${mechSteal.status}`);

    const mechDiagForeign = await call('POST', '/items/diagnoses', mechanic.token, { workorder_id: W2, description: 'S2', result: 'x' });
    check('S2 mechanic no diagnostica orden ajena -> 403', mechDiagForeign.status === 403, `status=${mechDiagForeign.status}`);

    const mechDiagOwn = await call('POST', '/items/diagnoses', mechanic.token, { workorder_id: W1, description: 'PRU-S2 diagnostico', result: 'pendiente' });
    if (mechDiagOwn.data?.data?.id) created.diagnoses.push(mechDiagOwn.data.data.id);
    check('P5 mechanic diagnostica su orden', mechDiagOwn.status === 200, `status=${mechDiagOwn.status}`);

    const mechQuoteForeign = await call('POST', '/items/quotes', mechanic.token, {
      workorder_id: W2, user_id: mechanic.id, status_id: 9, subtotal: 5, tax: 0.8, total: 5.8, validity: '2026-12-31',
    });
    check('S2 mechanic no cotiza orden ajena -> 403', mechQuoteForeign.status === 403, `status=${mechQuoteForeign.status}`);

    const mechQuoteOwn = await call('POST', '/items/quotes', mechanic.token, {
      workorder_id: W1, user_id: mechanic.id, status_id: 9, subtotal: 5, tax: 0.8, total: 5.8, validity: '2026-12-31',
    });
    const Q2 = mechQuoteOwn.data?.data?.id;
    if (Q2) created.quotes.push(Q2);
    check('P5 mechanic cotiza su orden', mechQuoteOwn.status === 200, `status=${mechQuoteOwn.status}`);

    const mechItemForeign = await call('POST', '/items/quoteitems', mechanic.token, { quote_id: Q1, service_id: 1, price: 1, discount: 0, amount: 1 });
    check('S2 mechanic no agrega item a cotizacion ajena -> 403', mechItemForeign.status === 403, `status=${mechItemForeign.status}`);

    if (Q2) {
      const mechItemOwn = await call('POST', '/items/quoteitems', mechanic.token, { quote_id: Q2, service_id: 1, price: 5, discount: 0, amount: 5 });
      if (mechItemOwn.data?.data?.id) created.quoteitems.push(mechItemOwn.data.data.id);
      check('P5 mechanic agrega item a su cotizacion', mechItemOwn.status === 200, `status=${mechItemOwn.status}`);

      const mechQuoteOwnEdit = await call('PATCH', `/items/quotes/${Q2}`, mechanic.token, { subtotal: 6, tax: 0.96, total: 6.96 });
      check('P5 mechanic edita su cotizacion', mechQuoteOwnEdit.status === 200, `status=${mechQuoteOwnEdit.status}`);
    }

    if (Q1) {
      const mechPatchForeignQuote = await call('PATCH', `/items/quotes/${Q1}`, mechanic.token, { status_id: 10 });
      check('S2 mechanic no edita cotizacion ajena -> 403', mechPatchForeignQuote.status === 403, `status=${mechPatchForeignQuote.status}`);
    }

    if (I1) {
      const mechPatchForeignItem = await call('PATCH', `/items/quoteitems/${I1}`, mechanic.token, { is_approved: true });
      check('S2 mechanic no edita item de cotizacion ajena -> 403', mechPatchForeignItem.status === 403, `status=${mechPatchForeignItem.status}`);
    }

    // Assistant: permisos intactos
    const assistantOrders = Number(await count(assistant.token, 'workorders'));
    check('P6 assistant ve todas las ordenes (base+2)', assistantOrders === Number(baseCounts.assistant.workorders) + 2, `base=${baseCounts.assistant.workorders} ahora=${assistantOrders}`);

    const assistantQuote = await call('GET', `/items/quotes/${Q1}?fields=*`, assistant.token);
    check('P6 assistant lee cotizacion de cualquier orden', assistantQuote.status === 200);

    const assistantEvidence = await call('POST', '/items/evidence', assistant.token, {
      workorder_id: W2, path: 'pru-s2.jpg', format: 'jpg', size: 1024,
    });
    if (assistantEvidence.data?.data?.id) created.evidence.push(assistantEvidence.data.data.id);
    check('P6 assistant crea evidencia sin restriccion nueva', assistantEvidence.status === 200, `status=${assistantEvidence.status}`);

    const assistantUsers = await call('GET', '/users?limit=-1&fields=email', assistant.token);
    check('P6 assistant sigue leyendo todos los usuarios', (assistantUsers.data?.data ?? []).length === 5);

    // Administrator: acceso completo
    const adminOrders = Number(await count(admin.token, 'workorders'));
    check('P7 admin ve todas las ordenes (base+2)', adminOrders === Number(baseCounts.admin.workorders) + 2, `ahora=${adminOrders}`);
    const adminPatch = await call('PATCH', `/items/workorders/${W2}`, admin.token, { mileage: 1200 });
    check('P7 admin edita cualquier orden', adminPatch.status === 200);
    const adminUsers = await call('GET', '/users?limit=-1&fields=email', admin.token);
    check('P7 admin sigue leyendo todos los usuarios', (adminUsers.data?.data ?? []).length === 5);

    // Cliente dueno de los fixtures: operaciones permitidas
    const ownVehiclePatch = await call('PATCH', `/items/vehicles/${V}`, other.token, { mileage: 1500 });
    check('P1/P3 client edita su propio vehiculo', ownVehiclePatch.status === 200 && Number(ownVehiclePatch.data?.data?.mileage) === 1500, `status=${ownVehiclePatch.status}`);

    const ownVehicleTransfer = await call('PATCH', `/items/vehicles/${V}`, other.token, { user_id: client.id });
    check('S2 client no transfiere su vehiculo a otro -> 403', ownVehicleTransfer.status === 403, `status=${ownVehicleTransfer.status}`);

    const ownBulk = await call('PATCH', '/items/vehicles', other.token, [{ id: V, mileage: 1600 }]);
    check('S2 client PATCH masivo de su vehiculo', ownBulk.status === 200, `status=${ownBulk.status}`);

    const gqlOwnUpdate = await gql(other.token, `mutation { update_vehicles_item(id: "${V}", data: { mileage: 1700 }) { id mileage } }`);
    check('S2 client GraphQL actualiza su vehiculo', gqlOwnUpdate.errors.length === 0 && Number(gqlOwnUpdate.data?.update_vehicles_item?.mileage) === 1700, JSON.stringify(gqlOwnUpdate.errors));

    const ownAppointment = await call('POST', '/items/appointments', other.token, {
      vehicle_id: V, status_id: 1, date: '2026-12-21', time: '10:00', reason: 'PRU-S2 cita 2',
    });
    if (ownAppointment.data?.data?.id) created.appointments.push(ownAppointment.data.data.id);
    check('P1 client crea cita en su vehiculo', ownAppointment.status === 200, `status=${ownAppointment.status}`);

    const ownQuotePatch = await call('PATCH', `/items/quotes/${Q1}`, other.token, { status_id: 10 });
    check('P1 client aprueba su cotizacion', ownQuotePatch.status === 200 && Number(ownQuotePatch.data?.data?.status_id) === 10, `status=${ownQuotePatch.status}`);

    if (I1) {
      const ownItemPatch = await call('PATCH', `/items/quoteitems/${I1}`, other.token, { is_approved: true });
      check('P1 client aprueba item de su cotizacion', ownItemPatch.status === 200, `status=${ownItemPatch.status}`);
    }

    const ownPayment = await call('POST', '/items/payment', other.token, {
      quote_id: Q1, user_id: other.id, method_id: 1, amount: 11.6, reference: 'PRU-S2-PAGO-2', paid_at: new Date().toISOString(),
    });
    if (ownPayment.data?.data?.id) created.payment.push(ownPayment.data.data.id);
    check('P1 client registra pago de su cotizacion', ownPayment.status === 200, `status=${ownPayment.status}`);

    const payDetail = await call('GET', `/items/payment/${P1}?fields=*,quote_id.*,method_id.*,user_id.*`, other.token);
    const payDetailData = payDetail.data?.data;
    check('P1 detalle de pago propio con relaciones', payDetail.status === 200 && Number(payDetailData?.amount) === 11.6, `status=${payDetail.status}`);
    check('S3 detalle de pago sin email del usuario', payDetailData?.user_id?.email === undefined && payDetailData?.user_id?.first_name !== undefined, JSON.stringify(payDetailData?.user_id ?? null));

    const ownUserPatch = await call('PATCH', `/users/${other.id}`, other.token, { first_name: 'PRU' });
    check('S2 client no modifica usuarios (permiso ausente) -> 403', ownUserPatch.status === 403, `status=${ownUserPatch.status}`);

    // -----------------------------------------------------------------------
    // Integridad: nada ajeno cambio y los originales siguen intactos
    // -----------------------------------------------------------------------
    const originalVehicle = await call('GET', '/items/vehicles/1?fields=mileage', admin.token);
    check('integridad: vehiculo original 1 intacto', Number(originalVehicle.data?.data?.mileage) !== 111111, `mileage=${originalVehicle.data?.data?.mileage}`);

    const originalQuote = await call('GET', '/items/quotes/1?fields=status_id', admin.token);
    check('integridad: cotizacion original 1 intacta', originalQuote.status === 200, `status=${originalQuote.data?.data?.status_id}`);
  } catch (error) {
    check('excepcion no controlada', false, String(error));
  } finally {
    console.log('== Limpieza de fixtures ==');
    await removeAll(admin.token);

    // -----------------------------------------------------------------------
    // Postcondiciones
    // -----------------------------------------------------------------------
    for (const collection of BUSINESS) {
      const now = Number(await count(admin.token, collection));
      check(`post: ${collection} vuelve al conteo original`, now === Number(baseCounts.admin[collection]), `${baseCounts.admin[collection]} -> ${now}`);
    }
    const usersNow = Number(await countUsers(admin.token));
    check('post: usuarios sin cambios (5)', usersNow === 5, `usuarios=${usersNow}`);

    const otherAfter = {};
    for (const collection of BUSINESS) otherAfter[collection] = Number(await count(other.token, collection));
    check('post: prutest01 vuelve a 0 registros', BUSINESS.every((c) => otherAfter[c] === 0), JSON.stringify(otherAfter));

    const after = await snapshot(admin.token);
    for (const collection of [...BUSINESS, ...CATALOG, 'users']) {
      const same = JSON.stringify(before[collection]) === JSON.stringify(after[collection]);
      check(`integridad: ${collection} identico antes/despues`, same, same ? '' : 'diferencia detectada');
    }

    console.log('---------------------------------------------');
    console.log(`Pruebas: ${checks} | Fallidas: ${failures}`);
    process.exit(failures === 0 ? 0 : 1);
  }
})();
