// Prueba E2E reversible con fixtures PRU-TEST-CIERRE.
// Reproduce los flujos reales de las pantallas contra Directus y limpia todo al final.
// Uso: VEXORA_PW=... VEXORA_ADMIN_PW=... node cierre-e2e.js
const B = "http://localhost:8000";
const PW = process.env.VEXORA_PW;
const APW = process.env.VEXORA_ADMIN_PW;

const out = [];
const log = (step, ok, detail = "") => {
  out.push(`${ok ? "OK  " : "FAIL"} | ${step}${detail ? " | " + detail : ""}`);
  console.log(out[out.length - 1]);
};

async function login(email, password) {
  const r = await fetch(B + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json();
  const token = j?.data?.access_token;
  // El login no devuelve el id: la app lo obtiene de /users/me.
  const me = await (await fetch(B + "/users/me?fields=id", {
    headers: { Authorization: `Bearer ${token}` },
  })).json();
  return { token, id: me?.data?.id };
}

function api(token) {
  return async (method, path, body) => {
    const r = await fetch(B + path, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    let j = null;
    const t = await r.text();
    try { j = JSON.parse(t); } catch { j = t; }
    return { status: r.status, data: j?.data, err: j?.errors?.[0]?.message };
  };
}

const created = { vehicles: [], appointments: [], workorders: [], diagnoses: [], evidence: [], quotes: [], quoteitems: [], quoteparts: [], payment: [], brands: [], services: [] };

(async () => {
  const admin = await login("admin@vexora.dev", APW);
  const client = await login("prutest01@vexora.dev", PW);
  const mechanic = await login("mechanic@vexora.dev", PW);
  const assistant = await login("assistant@vexora.dev", PW);

  const A = api(admin.token), C = api(client.token), M = api(mechanic.token), S = api(assistant.token);

  const baseline = {};
  for (const c of ["vehicles", "appointments", "workorders", "quotes", "payment", "brands", "services", "diagnoses", "evidence"]) {
    const r = await A("GET", `/items/${c}?aggregate[count]=*`);
    baseline[c] = Number(r.data?.[0]?.count ?? 0);
  }
  log("línea base", true, JSON.stringify(baseline));

  try {
    // 1. Catálogo: marca y servicio (Administrator)
    const brand = await A("POST", "/items/brands", { name: "PRU-TEST-CIERRE MARCA" });
    if (brand.status === 200) created.brands.push(brand.data.id);
    log("crear marca", brand.status === 200, `id=${brand.data?.id} status=${brand.status}`);

    const brandEdit = await A("PATCH", `/items/brands/${brand.data?.id}`, { name: "PRU-TEST-CIERRE MARCA EDIT" });
    log("editar marca", brandEdit.status === 200 && brandEdit.data?.name?.endsWith("EDIT"), brandEdit.data?.name);

    const svc = await A("POST", "/items/services", { name: "PRU-TEST-CIERRE SERVICIO", price: 100, description: "fixture" });
    if (svc.status === 200) created.services.push(svc.data.id);
    log("crear servicio", svc.status === 200, `id=${svc.data?.id} status=${svc.status}`);

    const svcEdit = await A("PATCH", `/items/services/${svc.data?.id}`, { price: 120 });
    log("editar servicio", svcEdit.status === 200 && Number(svcEdit.data?.price) === 120, `price=${svcEdit.data?.price}`);

    // 2. Vehículo (client)
    const veh = await C("POST", "/items/vehicles", {
      model_id: 1, user_id: client.id, fuel_id: 1, color_id: 1,
      plate: "PRU-CIE-1", vin: "PRUCIERRE00000001", year: 2024, mileage: 1000,
    });
    if (veh.status === 200) created.vehicles.push(veh.data.id);
    log("client crea vehículo", veh.status === 200, `id=${veh.data?.id} status=${veh.status} err=${veh.err ?? ""}`);

    const vehGet = await C("GET", `/items/vehicles/${veh.data?.id}`);
    log("client consulta vehículo", vehGet.status === 200 && vehGet.data?.plate === "PRU-CIE-1");

    const vehEdit = await C("PATCH", `/items/vehicles/${veh.data?.id}`, { mileage: 1100 });
    log("client edita vehículo", vehEdit.status === 200 && Number(vehEdit.data?.mileage) === 1100);

    // 3. Cita (client) → confirmar (Administrator: crea orden + estado 2)
    const appt = await C("POST", "/items/appointments", {
      vehicle_id: veh.data.id, status_id: 1, date: "2026-12-01", time: "10:00", reason: "PRU-TEST-CIERRE cita",
    });
    if (appt.status === 200) created.appointments.push(appt.data.id);
    log("client crea cita", appt.status === 200, `id=${appt.data?.id} status=${appt.status} err=${appt.err ?? ""}`);

    const apptEdit = await C("PATCH", `/items/appointments/${appt.data?.id}`, {
      vehicle_id: veh.data.id, status_id: 1, date: "2026-12-02", time: "11:00", reason: "PRU-TEST-CIERRE cita editada",
    });
    log("client edita cita pendiente", apptEdit.status === 200);

    const wo = await A("POST", "/items/workorders", {
      vehicle_id: veh.data.id, mechanic_id: mechanic.id, status_id: 4, mileage: 1200, delivery: null,
    });
    if (wo.status === 200) created.workorders.push(wo.data.id);
    log("admin crea orden al confirmar cita", wo.status === 200, `id=${wo.data?.id} status=${wo.status} err=${wo.err ?? ""}`);

    const confirm = await A("GET", `/items/appointments/${appt.data?.id}`);
    log("cita existe antes de confirmar", confirm.status === 200 && confirm.data?.status_id === 1, `status_id=${confirm.data?.status_id}`);

    const apptConfirm = await C("PATCH", `/items/appointments/${appt.data?.id}`, {
      vehicle_id: veh.data.id, status_id: 2, date: "2026-12-02", time: "11:00", reason: "PRU-TEST-CIERRE cita editada",
    });
    log("confirmar cita (estado 2)", apptConfirm.status === 200 && apptConfirm.data?.status_id === 2, `status=${apptConfirm.status} err=${apptConfirm.err ?? ""}`);

    // 4. Mecánico actualiza estado de su orden
    const woState = await M("PATCH", `/items/workorders/${wo.data?.id}`, {
      vehicle_id: veh.data.id, mechanic_id: mechanic.id, status_id: 5, mileage: 1200, delivery: null,
    });
    log("mechanic cambia estado a 5", woState.status === 200 && woState.data?.status_id === 5, `status=${woState.status} err=${woState.err ?? ""}`);

    // 5. Diagnóstico (mechanic)
    const diag = await M("POST", "/items/diagnoses", {
      workorder_id: wo.data.id, description: "PRU-TEST-CIERRE diagnóstico", result: "pendiente",
    });
    if (diag.status === 200) created.diagnoses.push(diag.data.id);
    log("mechanic crea diagnóstico", diag.status === 200, `id=${diag.data?.id} status=${diag.status} err=${diag.err ?? ""}`);

    const diagEdit = await M("PATCH", `/items/diagnoses/${diag.data?.id}`, {
      workorder_id: wo.data.id, description: "PRU-TEST-CIERRE diagnóstico", result: "resuelto",
    });
    log("mechanic edita diagnóstico", diagEdit.status === 200 && diagEdit.data?.result === "resuelto");

    // 6. Evidencia (assistant)
    const ev = await S("POST", "/items/evidence", {
      workorder_id: wo.data.id, path: "PRU-TEST-CIERRE/foto.png", format: "png", size: 1024,
    });
    if (ev.status === 200) created.evidence.push(ev.data.id);
    log("assistant crea evidencia", ev.status === 200, `id=${ev.data?.id} status=${ev.status} err=${ev.err ?? ""}`);

    // 7. Cotización (mechanic) + conceptos
    const quote = await M("POST", "/items/quotes", {
      workorder_id: wo.data.id, user_id: mechanic.id, status_id: 9,
      subtotal: 120, tax: 19.2, total: 139.2, validity: "2026-12-31",
    });
    if (quote.status === 200) created.quotes.push(quote.data.id);
    log("mechanic crea cotización", quote.status === 200, `id=${quote.data?.id} status=${quote.status} err=${quote.err ?? ""}`);

    const qi = await M("POST", "/items/quoteitems", {
      quote_id: quote.data?.id, service_id: svc.data.id, price: 120, discount: 0, amount: 120, is_approved: false,
    });
    if (qi.status === 200) created.quoteitems.push(qi.data.id);
    log("mechanic añade servicio a cotización", qi.status === 200, `status=${qi.status} err=${qi.err ?? ""}`);

    const qp = await M("POST", "/items/quoteparts", {
      quote_id: quote.data?.id, part_id: 1, quantity: 2, price: 50, discount: 0, amount: 100, is_approved: false,
    });
    if (qp.status === 200) created.quoteparts.push(qp.data.id);
    log("mechanic añade refacción a cotización", qp.status === 200, `status=${qp.status} err=${qp.err ?? ""}`);

    // 8. Client: marcar conceptos, recalcular y aprobar
    const toggle = await C("PATCH", `/items/quoteitems/${qi.data?.id}`, { is_approved: true });
    log("client marca servicio aprobado", toggle.status === 200);

    const recalc = await C("PATCH", `/items/quotes/${quote.data?.id}`, { subtotal: 220, tax: 35.2, total: 255.2 });
    log("client recalcula cotización", recalc.status === 200 && Number(recalc.data?.total) === 255.2, `total=${recalc.data?.total} err=${recalc.err ?? ""}`);

    const approve = await C("PATCH", `/items/quotes/${quote.data?.id}`, { status_id: 10 });
    log("client aprueba cotización", approve.status === 200 && approve.data?.status_id === 10, `status=${approve.status} err=${approve.err ?? ""}`);

    // 9. Pago (client)
    const pay = await C("POST", "/items/payment", {
      quote_id: quote.data?.id, user_id: client.id, method_id: 1, amount: 255.2,
      reference: "PRU-TEST-CIERRE-PAGO", paid_at: new Date().toISOString(),
    });
    if (pay.status === 200) created.payment.push(pay.data.id);
    log("client registra pago", pay.status === 200, `id=${pay.data?.id} status=${pay.status} err=${pay.err ?? ""}`);

    const payDetail = await C("GET", `/items/payment/${pay.data?.id}?fields=*,quote_id.*,method_id.*,user_id.*`);
    log("client consulta detalle de pago", payDetail.status === 200 && Number(payDetail.data?.amount) === 255.2);

    // 10. Cancelar una segunda cita (pending → 3)
    const appt2 = await C("POST", "/items/appointments", {
      vehicle_id: veh.data.id, status_id: 1, date: "2026-12-05", time: "09:00", reason: "PRU-TEST-CIERRE cancelar",
    });
    if (appt2.status === 200) created.appointments.push(appt2.data.id);
    const cancel = await C("PATCH", `/items/appointments/${appt2.data?.id}`, {
      vehicle_id: veh.data.id, status_id: 3, date: "2026-12-05", time: "09:00", reason: "PRU-TEST-CIERRE cancelar",
    });
    log("cancelar cita (estado 3)", cancel.status === 200 && cancel.data?.status_id === 3, `status=${cancel.status}`);

    // 11. Rechazo de cotización (segunda cotización)
    const q2 = await M("POST", "/items/quotes", {
      workorder_id: wo.data.id, user_id: mechanic.id, status_id: 9,
      subtotal: 10, tax: 1.6, total: 11.6, validity: "2026-12-31",
    });
    if (q2.status === 200) created.quotes.push(q2.data.id);
    const reject = await C("PATCH", `/items/quotes/${q2.data?.id}`, { status_id: 11 });
    log("client rechaza cotización (11)", reject.status === 200 && reject.data?.status_id === 11, `status=${reject.status}`);
  } catch (e) {
    log("excepción en el flujo", false, String(e));
  } finally {
    // Limpieza en orden inverso de dependencias (Administrator)
    const del = async (c, ids) => {
      for (const id of ids.reverse()) {
        const r = await A("DELETE", `/items/${c}/${id}`);
        log(`limpieza ${c}/${id}`, r.status === 204 || r.status === 200, `status=${r.status} ${r.err ?? ""}`);
      }
    };
    await del("payment", created.payment);
    await del("quoteitems", created.quoteitems);
    await del("quoteparts", created.quoteparts);
    await del("quotes", created.quotes);
    await del("diagnoses", created.diagnoses);
    await del("evidence", created.evidence);
    await del("workorders", created.workorders);
    await del("appointments", created.appointments);
    await del("vehicles", created.vehicles);
    await del("services", created.services);
    await del("brands", created.brands);

    const after = {};
    for (const c of Object.keys(baseline)) {
      const r = await A("GET", `/items/${c}?aggregate[count]=*`);
      after[c] = Number(r.data?.[0]?.count ?? 0);
    }
    const ok = Object.keys(baseline).every((k) => baseline[k] === after[k]);
    log("integridad tras limpieza", ok, `antes=${JSON.stringify(baseline)} después=${JSON.stringify(after)}`);
    console.log("\nRESUMEN:", out.filter((l) => l.startsWith("OK")).length, "OK /", out.filter((l) => l.startsWith("FAIL")).length, "FAIL");
  }
})();
