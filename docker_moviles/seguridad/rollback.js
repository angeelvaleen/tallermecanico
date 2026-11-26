// Revierte la configuración de permisos al respaldo backup_permissions.json.
// Uso: node rollback.js   (requiere ADMIN_TOKEN en el entorno)
const fs = require("fs");
const path = require("path");
const BASE = "http://localhost:8000";
const T = process.env.ADMIN_TOKEN;

const backup = JSON.parse(
  fs.readFileSync(path.join(__dirname, "backup_permissions.json"), "utf8"),
);

(async () => {
  if (!T) throw new Error("Falta ADMIN_TOKEN");

  const current = await (await fetch(`${BASE}/permissions?limit=-1`, {
    headers: { Authorization: `Bearer ${T}` },
  })).json();
  const byId = new Map(current.data.map((r) => [r.id, r]));

  let patched = 0, created = 0, fail = [];

  for (const row of backup.data) {
    const payload = {
      policy: row.policy.policy ?? row.policy,
      collection: row.collection,
      action: row.action,
      permissions: row.permissions,
      validation: row.validation,
      presets: row.presets,
      fields: row.fields,
    };

    if (byId.has(row.id)) {
      const res = await fetch(`${BASE}/permissions/${row.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${T}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) patched++; else fail.push(`PATCH ${row.id}: ${res.status} ${(await res.text()).slice(0, 160)}`);
    } else {
      const res = await fetch(`${BASE}/permissions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${T}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, ...payload }),
      });
      if (res.ok) created++; else fail.push(`POST ${row.id}: ${res.status} ${(await res.text()).slice(0, 160)}`);
    }
  }

  console.log(`revertidos: ${patched} · recreados: ${created} · fallos: ${fail.length}`);
  if (fail.length) console.log(fail.join("\n"));
})();
