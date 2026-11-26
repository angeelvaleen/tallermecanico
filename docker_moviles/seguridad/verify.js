// Verificación de solo lectura de S1/S2/S3. No ejecuta escrituras.
const BASE = "http://localhost:8000";
const PW = process.env.VEXORA_PW;
const ADMIN_PW = process.env.VEXORA_ADMIN_PW;

const rows = [];
const rec = (scope, check, status, n, note = "") =>
  rows.push({ scope, check, status, n, note });

async function login(email, password) {
  const r = await fetch(BASE + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json().catch(() => null);
  return { status: r.status, token: j?.data?.access_token, id: j?.data?.user?.id };
}

async function get(path, params, token) {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  let body = null;
  const text = await res.text();
  try { body = JSON.parse(text); } catch { body = text; }
  return {
    status: res.status,
    n: Array.isArray(body?.data) ? body.data.length : undefined,
    count: body?.data?.[0]?.count,
    code: body?.errors?.[0]?.extensions?.code || body?.errors?.[0]?.message || "",
    data: body?.data,
  };
}

const S = (o) => JSON.stringify(o);

// GraphQL de items y de sistema (los usuarios viven en /graphql/system).
async function gql(path, query, token) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query }),
  });
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, data: body?.data, errors: body?.errors ?? [] };
}

(async () => {
  const tokens = {};
  for (const [k, email, pw] of [
    ["admin", "admin@vexora.dev", ADMIN_PW],
    ["client", "client@vexora.dev", PW],
    ["prutest01", "prutest01@vexora.dev", PW],
    ["mechanic", "mechanic@vexora.dev", PW],
    ["assistant", "assistant@vexora.dev", PW],
  ]) {
    const l = await login(email, pw);
    tokens[k] = l.token;
    tokens[k + "_id"] = l.id;
    rec(k, "login", l.status, 1, "");
  }

  // ---- S1: anónimo ----
  for (const c of ["vehicles", "workorders", "appointments", "payment", "quotes", "brands", "parts", "diagnoses"]) {
    const r = await get("/items/" + c, { limit: 1 }, null);
    rec("anon", `GET /items/${c}`, r.status, r.n, r.code);
  }
  rec("anon", "GET /users", (await get("/users", { limit: 1 }, null)).status);
  rec("anon", "GET /items/payment/1", (await get("/items/payment/1", {}, null)).status);

  // ---- Administrator ----
  for (const c of ["vehicles", "workorders", "appointments", "payment", "quotes", "brands", "models", "colors", "fuels", "methods", "parts", "services", "diagnoses", "evidence", "history"]) {
    const r = await get("/items/" + c, { limit: -1 }, tokens.admin);
    rec("admin", `GET /items/${c}`, r.status, r.n, r.code);
  }
  const au = await get("/users", { limit: -1 }, tokens.admin);
  rec("admin", "GET /users", au.status, au.n, au.code);
  rec("admin", "GET /permissions/me", (await get("/permissions/me", {}, tokens.admin)).status);

  // ---- Ayudantes por rol ----
  const roles = [
    ["client", 4, 4, 5, 2, 4],
    ["prutest01", 0, 0, 0, 0, 0],
  ];
  for (const [role, veh, wo, ap, pay, qu] of roles) {
    const t = tokens[role];
    const rv = await get("/items/vehicles", { limit: -1 }, t);
    rec(role, "vehicles propios", rv.status, rv.n, rv.code);
    const rw = await get("/items/workorders", { limit: -1 }, t);
    rec(role, "workorders propios", rw.status, rw.n, rw.code);
    const ra = await get("/items/appointments", { limit: -1 }, t);
    rec(role, "appointments propios", ra.status, ra.n, ra.code);
    const rp = await get("/items/payment", { limit: -1 }, t);
    rec(role, "payment propios", rp.status, rp.n, rp.code);
    const rq = await get("/items/quotes", { limit: -1 }, t);
    rec(role, "quotes propios", rq.status, rq.n, rq.code);
    const ru = await get("/users", { limit: -1 }, t);
    rec(role, "GET /users", ru.status, ru.n, ru.code);
    rec(role, "GET /permissions/me", (await get("/permissions/me", {}, t)).status);
    rec(role, "GET /users/me", (await get("/users/me", { fields: "id,email,first_name,role.name" }, t)).status);
    const foreign = await get("/items/vehicles/1", {}, t);
    rec(role, "GET /items/vehicles/1 (ajeno a prutest01)", foreign.status, undefined, foreign.code);
    const foreignWo = await get("/items/workorders/1", {}, t);
    rec(role, "GET /items/workorders/1", foreignWo.status, undefined, foreignWo.code);
    // contadores acotados
    const aggV = await get("/items/vehicles", { "aggregate[count]": "*" }, t);
    rec(role, "vehicles contador", aggV.status, Number(aggV.count ?? 0), aggV.code);
    const aggW = await get("/items/workorders", { "aggregate[count]": "*" }, t);
    rec(role, "workorders contador", aggW.status, Number(aggW.count ?? 0), aggW.code);
  }

  // ---- mechanic ----
  const mt = tokens.mechanic;
  rec("mechanic", "workorders propios", (await get("/items/workorders", { limit: -1 }, mt)).status,
    (await get("/items/workorders", { limit: -1 }, mt)).n);
  rec("mechanic", "workorders contador", 200, Number((await get("/items/workorders", { "aggregate[count]": "*" }, mt)).count ?? 0));
  const mq = await get("/items/quotes", { limit: -1 }, mt);
  rec("mechanic", "quotes propios", mq.status, mq.n, mq.code);
  rec("mechanic", "quotes contador", 200, Number((await get("/items/quotes", { "aggregate[count]": "*" }, mt)).count ?? 0));
  const md = await get("/items/workorders/1", { fields: "*,mechanic_id.first_name,status_id.name,vehicle_id.plate" }, mt);
  rec("mechanic", "detalle orden con expansión", md.status, undefined, `${JSON.stringify(md.data?.mechanic_id ?? null)}`);
  const mu = await get("/users", { limit: -1 }, mt);
  rec("mechanic", "GET /users", mu.status, mu.n, mu.code);
  rec("mechanic", "appointments (no permitido)", (await get("/items/appointments", { limit: 1 }, mt)).status);
  rec("mechanic", "payment (no permitido)", (await get("/items/payment", { limit: 1 }, mt)).status);

  // ---- assistant ----
  const at = tokens.assistant;
  const aw = await get("/items/workorders", { limit: -1 }, at);
  rec("assistant", "workorders en curso", aw.status, aw.n, aw.code);
  rec("assistant", "workorders contador", 200, Number((await get("/items/workorders", { "aggregate[count]": "*" }, at)).count ?? 0));
  const aw8 = await get("/items/workorders", { filter: S({ status_id: { _eq: 8 } }) }, at);
  rec("assistant", "workorders filtradas estado 8", aw8.status, aw8.n, aw8.code);
  const aq = await get("/items/quotes", { limit: -1 }, at);
  rec("assistant", "quotes en curso", aq.status, aq.n, aq.code);
  const au2 = await get("/users", { limit: -1 }, at);
  rec("assistant", "GET /users", au2.status, au2.n, au2.code);
  rec("assistant", "users roles listados", 200, undefined, S((au2.data || []).map((u) => u.role?.name ?? u.role)));
  rec("assistant", "GET /permissions/me", (await get("/permissions/me", {}, at)).status);
  rec("assistant", "workorders/1", (await get("/items/workorders/1", {}, at)).status);

  // ---- S2/S3: aislamiento por fila y usuarios (extension vexora-rls) ----
  const ids = {};
  for (const k of ["admin", "client", "prutest01", "mechanic", "assistant"]) {
    const me = await get("/users/me", { fields: "id" }, tokens[k]);
    ids[k] = me.data?.id;
  }

  const tamper = [
    ["id ajeno", { id: { _eq: 1 } }],
    ["_or con IDs ajenos", { _or: [{ id: { _eq: 1 } }, { id: { _eq: 3 } }] }],
    ["email del dueno", { vehicle_id: { user_id: { _eq: ids.client } } }],
    ["_neq para barrer", { id: { _neq: -1 } }],
    ["_and con _gte", { _and: [{ id: { _gte: 1 } }] }],
    ["filtro vacio", {}],
  ];
  for (const [name, filter] of tamper) {
    const r = await get("/items/workorders", { limit: "-1", filter: S(filter) }, tokens.prutest01);
    rec("S2", `prutest01 ordenes con filtro ${name}`, r.status, r.n, `count=${r.n ?? 0} (esperado 0)`);
  }
  const aggO = await get("/items/vehicles", { "aggregate[count]": "*" }, tokens.prutest01);
  rec("S2", "prutest01 vehiculos contador", aggO.status, Number(aggO.count ?? 0), "esperado 0");
  const foreign = await get("/items/vehicles/1", { fields: "*" }, tokens.prutest01);
  rec("S2", "prutest01 vehiculo ajeno por ID", foreign.status, undefined, foreign.code || "esperado 403");

  const cu = await get("/users", { limit: "-1", fields: "*" }, tokens.client);
  const cuRow = cu.data?.[0] ?? {};
  rec("S3", "client /users?fields=*", cu.status, cu.n,
    `email=${cuRow.email ?? ""} token=${cuRow.token !== undefined} tfa=${cuRow.tfa_secret !== undefined} (esperado 1, sin secretos)`);
  const cuMail = await get("/users", { limit: "-1", fields: "email" }, tokens.client);
  rec("S3", "client correos visibles", cuMail.status, cuMail.n, S((cuMail.data || []).map((u) => u.email)));
  rec("S3", "client usuario ajeno por ID", (await get(`/users/${ids.mechanic}`, { fields: "email" }, tokens.client)).status, undefined, "esperado 403");
  rec("S3", "prutest01 usuario ajeno por ID", (await get(`/users/${ids.client}`, { fields: "email" }, tokens.prutest01)).status, undefined, "esperado 403");
  const nested = await get("/items/workorders", { limit: "-1", fields: "*,mechanic_id.*,mechanic_id.email,vehicle_id.user_id.email" }, tokens.client);
  const leaks = (nested.data || []).filter((r) => r.mechanic_id?.email !== undefined || r.vehicle_id?.user_id?.email !== undefined).length;
  rec("S3", "client relaciones sin email ajeno", nested.status, nested.n, `fugas=${leaks} (esperado 0)`);
  const mu2 = await get("/users", { limit: "-1" }, tokens.mechanic);
  rec("S3", "mechanic /users sin cambios", mu2.status, mu2.n, "esperado 5");
  const au3 = await get("/users", { limit: "-1" }, tokens.assistant);
  rec("S3", "assistant /users sin cambios", au3.status, au3.n, "esperado 5");
  const mv = await get("/items/vehicles", { "aggregate[count]": "*" }, tokens.mechanic);
  rec("S2", "mechanic vehiculos de sus ordenes", mv.status, Number(mv.count ?? 0), "sin orden no hay vehiculo");

  const gp = await gql("/graphql", "{ workorders { id } }", tokens.prutest01);
  rec("S2", "GraphQL prutest01 workorders", gp.status, (gp.data?.workorders ?? []).length, S(gp.errors.map((e) => e.extensions?.code)));
  const gc = await gql("/graphql", "{ workorders { id mechanic_id { email } } }", tokens.client);
  const gEmails = (gc.data?.workorders ?? []).filter((r) => r.mechanic_id?.email !== null).length;
  rec("S2", "GraphQL client workorders", gc.status, (gc.data?.workorders ?? []).length, `emails=${gEmails} (esperado 0)`);
  const gu = await gql("/graphql/system", "{ users { id email } }", tokens.client);
  rec("S3", "GraphQL client users", gu.status, (gu.data?.users ?? []).length, `esperado 1 (${(gu.data?.users ?? []).map((u) => u.email).join(",")})`);
  const gx = await gql("/graphql/system", `{ users_by_id(id: "${ids.client}") { email } }`, tokens.prutest01);
  rec("S3", "GraphQL prutest01 users_by_id ajeno", gx.status, undefined, gx.errors?.[0]?.extensions?.code || "esperado FORBIDDEN");

  // ---- búsquedas y contadores por rol (client) ----
  const ct = tokens.client;
  const wf = { vehicle_id: { user_id: { _eq: tokens.client_id } } };
  const scoped = (base, search) => S(search ? { _and: [base, search] } : base);
  const woSearch = (t) => ({ _or: [
    { vehicle_id: { plate: { _icontains: t } } },
    { vehicle_id: { vin: { _icontains: t } } },
    { mechanic_id: { first_name: { _icontains: t } } },
    { mechanic_id: { last_name: { _icontains: t } } },
    { status_id: { name: { _icontains: t } } },
  ] });
  for (const term of ["PRU-2026", "pru-t01", "zzzz"]) {
    const r = await get("/items/vehicles", { filter: scoped({ user_id: { _eq: tokens.client_id } }, { _or: [{ plate: { _icontains: term } }, { vin: { _icontains: term } }] }) }, ct);
    rec("client", `buscar vehiculos "${term}"`, r.status, r.n, r.code);
  }
  for (const term of ["PRU-2026-A", "reparacion", "mateo", "zzzz"]) {
    const r = await get("/items/workorders", { filter: scoped(wf, woSearch(term)) }, ct);
    rec("client", `buscar ordenes "${term}"`, r.status, r.n, r.code);
  }
  for (const term of ["PRU-2026-A", "confirmada", "carla", "zzzz"]) {
    const r = await get("/items/appointments", { filter: scoped({ vehicle_id: { user_id: { _eq: tokens.client_id } } }, { _or: [
      { vehicle_id: { plate: { _icontains: term } } },
      { vehicle_id: { vin: { _icontains: term } } },
      { vehicle_id: { user_id: { first_name: { _icontains: term } } } },
      { vehicle_id: { user_id: { last_name: { _icontains: term } } } },
    ] }) }, ct);
    rec("client", `buscar citas "${term}"`, r.status, r.n, r.code);
  }
  for (const term of ["PRU-TEST-PAGO", "zzzz"]) {
    const r = await get("/items/payment", { filter: scoped({ user_id: { _eq: tokens.client_id } }, { _or: [{ reference: { _icontains: term } }] }) }, ct);
    rec("client", `buscar pagos "${term}"`, r.status, r.n, r.code);
  }
  for (const term of ["1", "#2", "abc"]) {
    const v = Number(term.replace(/^#/, ""));
    const filter = Number.isFinite(v) && term !== "abc"
      ? S({ _or: [{ id: { _eq: v } }, { workorder_id: { _eq: v } }] })
      : S({ id: { _eq: -1 } });
    const r = await get("/items/quotes", { filter }, ct);
    rec("client", `buscar cotizaciones "${term}"`, r.status, r.n, r.code);
  }

  console.log("scope\tcheck\tstatus\tn\tnote");
  for (const r of rows) console.log([r.scope, r.check, r.status, r.n ?? "", r.note ?? ""].join("\t"));
})();
