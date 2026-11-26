// Aplica las reglas de fila de seguridad S1/S2/S3 sobre Directus.
// Uso: node apply.js   (requiere ADMIN_TOKEN en el entorno)
const BASE = "http://localhost:8000";
const T = process.env.ADMIN_TOKEN;

const rules = [
  // ---------- client ----------
  [114, { user_id: { _eq: "$CURRENT_USER" } }], // vehicles read
  [120, { user_id: { _eq: "$CURRENT_USER" } }], // vehicles update
  [96, { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } }], // appointments read
  [99, { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } }], // appointments update
  [107, { user_id: { _eq: "$CURRENT_USER" } }], // payment read
  [115, { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } }], // workorders read
  [111, { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } }], // quotes read
  [119, { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } }], // quotes update
  [109, { quote_id: { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } } }],
  [117, { quote_id: { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } } }],
  [110, { quote_id: { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } } }],
  [118, { quote_id: { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } } }],
  [101, { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } }], // diagnoses read
  [102, { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } }], // evidence read
  [104, { workorder_id: { vehicle_id: { user_id: { _eq: "$CURRENT_USER" } } } }], // history read
  [168, { id: { _eq: "$CURRENT_USER" } }], // directus_users read

  // ---------- mechanic ----------
  [146, { mechanic_id: { _eq: "$CURRENT_USER" } }], // workorders read
  [147, { mechanic_id: { _eq: "$CURRENT_USER" } }], // workorders update
  [136, { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } }], // quotes read
  [138, { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } }], // quotes update
  [134, { quote_id: { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } } }],
  [141, { quote_id: { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } } }],
  [135, { quote_id: { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } } }],
  [142, { quote_id: { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } } }],
  [124, { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } }], // diagnoses read
  [127, { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } }], // diagnoses update
  [125, { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } }], // evidence read
  [129, { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } }], // evidence update
  [131, { workorder_id: { mechanic_id: { _eq: "$CURRENT_USER" } } }], // history read
  [185, { _or: [{ id: { _eq: "$CURRENT_USER" } }, { role: { name: { _eq: "mechanic" } } }] }],

  // ---------- assistant ----------
  [166, { status_id: { _in: [4, 5, 6] } }], // workorders read
  [162, { workorder_id: { status_id: { _in: [4, 5, 6] } } }], // quotes read
  [160, { quote_id: { workorder_id: { status_id: { _in: [4, 5, 6] } } } }],
  [161, { quote_id: { workorder_id: { status_id: { _in: [4, 5, 6] } } } }],
  [150, { workorder_id: { status_id: { _in: [4, 5, 6] } } }], // diagnoses read
  [155, { workorder_id: { status_id: { _in: [4, 5, 6] } } }], // diagnoses update
  [151, { workorder_id: { status_id: { _in: [4, 5, 6] } } }], // evidence read
  [153, { workorder_id: { status_id: { _in: [4, 5, 6] } } }], // evidence update
  [157, { workorder_id: { status_id: { _in: [4, 5, 6] } } }], // history read
  [182, { _or: [{ id: { _eq: "$CURRENT_USER" } }, { role: { name: { _eq: "mechanic" } } }] }],
];

const publicReadIds = [192, 193, 194, 195]; // public: appointments/payment/vehicles/workorders read

(async () => {
  if (!T) throw new Error("Falta ADMIN_TOKEN");
  let ok = 0, fail = [];
  for (const [id, permissions] of rules) {
    const res = await fetch(`${BASE}/permissions/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${T}`, "Content-Type": "application/json" },
      body: JSON.stringify({ permissions }),
    });
    if (res.ok) ok++; else fail.push(`${id}:${res.status}:${(await res.text()).slice(0, 160)}`);
  }
  console.log(`reglas aplicadas: ${ok}/${rules.length}`);
  if (fail.length) console.log("FALLOS:\n" + fail.join("\n"));

  for (const id of publicReadIds) {
    const res = await fetch(`${BASE}/permissions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${T}` },
    });
    console.log(`DELETE permiso publico ${id} -> ${res.status}`);
  }
})();
