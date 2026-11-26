// VEXORA - Reglas de aislamiento por fila (S2) y proteccion de usuarios (S3).
// Se ejecutan dentro de Directus 12.6.0 Core (sin licencia): los filtros se
// inyectan en el servidor antes de construir la consulta SQL, por lo que
// aplican a REST, GraphQL, filtros manipulados, agregaciones y consultas masivas.

export const ROLE_CLIENT = 'client';
export const ROLE_MECHANIC = 'mechanic';
export const ROLE_ASSISTANT = 'assistant';
export const ROLE_ADMIN = 'Administrator';

// Colecciones con datos de negocio de un cliente o de un mecanico.
export const ITEM_COLLECTIONS = new Set([
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
]);

// Campos de directus_users que un cliente puede ver de su propia ficha.
// Excluye token, tfa_secret, auth_data, external_identifier y hash de clave.
export const USER_SELF_FIELDS = [
  'id',
  'email',
  'first_name',
  'last_name',
  'avatar',
  'status',
  'role',
  'role.id',
  'role.name',
  'title',
  'description',
  'location',
  'language',
  'text_direction',
];

// Campos de directus_users visibles al expandir relaciones (por ejemplo
// mechanic_id.* o user_id.*) desde una coleccion propia del cliente.
// Solo identificacion y nombre: nunca correo ni datos privados de otros usuarios.
export const USER_RELATION_FIELDS = ['id', 'first_name', 'last_name'];

export function forbidden(message = 'No tienes permiso para acceder a este recurso.') {
  const error = new Error(message);
  error.name = 'DirectusError';
  error.code = 'FORBIDDEN';
  error.status = 403;
  error.extensions = { code: 'FORBIDDEN' };
  return error;
}

export function unavailable(message = 'No se pudo verificar la seguridad de la consulta.') {
  const error = new Error(message);
  error.name = 'DirectusError';
  error.code = 'SERVICE_UNAVAILABLE';
  error.status = 503;
  error.extensions = { code: 'SERVICE_UNAVAILABLE' };
  return error;
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && Array.isArray(value) === false;
}

// ---------------------------------------------------------------------------
// Filtros obligatorios por rol y coleccion
// ---------------------------------------------------------------------------

export function scopeFilter(role, userId, collection, extra = {}) {
  if (role === ROLE_CLIENT) {
    const ownedVehicle = { user_id: { _eq: userId } };
    switch (collection) {
      case 'vehicles':
        return { user_id: { _eq: userId } };
      case 'appointments':
        return { vehicle_id: ownedVehicle };
      case 'workorders':
        return { vehicle_id: ownedVehicle };
      case 'quotes':
        return { workorder_id: { vehicle_id: ownedVehicle } };
      case 'quoteitems':
      case 'quoteparts':
        return { quote_id: { workorder_id: { vehicle_id: ownedVehicle } } };
      case 'payment':
        return { quote_id: { workorder_id: { vehicle_id: ownedVehicle } } };
      case 'diagnoses':
      case 'evidence':
      case 'history':
        return { workorder_id: { vehicle_id: ownedVehicle } };
      case 'directus_users':
        return { id: { _eq: userId } };
      default:
        return null;
    }
  }

  if (role === ROLE_MECHANIC) {
    const mine = { mechanic_id: { _eq: userId } };
    switch (collection) {
      case 'workorders':
        return mine;
      case 'quotes':
        return { workorder_id: mine };
      case 'quoteitems':
      case 'quoteparts':
        return { quote_id: { workorder_id: mine } };
      case 'diagnoses':
      case 'evidence':
      case 'history':
        return { workorder_id: mine };
      case 'vehicles':
        return { id: { _in: Array.isArray(extra.vehicleIds) ? extra.vehicleIds : [] } };
      default:
        return null;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Saneo de campos (S3 y relaciones anidadas)
// ---------------------------------------------------------------------------

function relationOf(schema, collection, field) {
  const relations = schema && Array.isArray(schema.relations) ? schema.relations : [];
  return relations.find((relation) => relation.collection === collection && relation.field === field) || null;
}

function sanitizeRelationPath(schema, collection, path, out) {
  const parts = String(path).split('.').filter((part) => part.length > 0);
  if (parts.length <= 1) {
    out.push(path);
    return;
  }

  let current = collection;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    const relation = relationOf(schema, current, part);

    if (!relation) {
      // Relacion desconocida para el esquema: se deja intacta y Directus la rechaza.
      out.push(path);
      return;
    }

    const related = relation.related_collection;

    if (related === 'directus_users') {
      const prefix = parts.slice(0, index + 1).join('.');
      const rest = parts.slice(index + 1);

      if (rest.length === 0) {
        // Solo la clave foranea escalar: no expone datos del usuario.
        out.push(path);
        return;
      }

      if (rest.length === 1 && rest[0] === '*') {
        for (const field of USER_RELATION_FIELDS) out.push(`${prefix}.${field}`);
        return;
      }

      // Campos publicos de otro usuario pedidos de forma explicita.
      if (rest.length === 1 && USER_RELATION_FIELDS.includes(rest[0])) {
        out.push(path);
        return;
      }

      if (rest[0] === 'role' && (rest.length === 1 || (rest.length === 2 && (rest[1] === '*' || rest[1] === 'id' || rest[1] === 'name')))) {
        if (rest.length === 1 || rest[1] === '*') {
          out.push(`${prefix}.role.id`);
          out.push(`${prefix}.role.name`);
        } else {
          out.push(path);
        }
        return;
      }

      // Cualquier otro dato de otro usuario se descarta; se conserva solo la referencia.
      out.push(`${prefix}.id`);
      return;
    }

    current = related;
  }

  out.push(path);
}

function sanitizeUserSelfFields(fields) {
  if (fields === undefined || fields === null) return USER_SELF_FIELDS.slice();
  const list = Array.isArray(fields) ? fields : String(fields).split(',');
  const out = [];
  for (const raw of list) {
    const field = String(raw).trim();
    if (!field) continue;
    if (field === '*') {
      for (const allowed of USER_SELF_FIELDS) out.push(allowed);
      continue;
    }
    if (USER_SELF_FIELDS.includes(field)) out.push(field);
  }
  const unique = [...new Set(out)];
  return unique.length > 0 ? unique : ['id'];
}

export function sanitizeFields(collection, fields, schema, actor) {
  if (!actor || actor.role !== ROLE_CLIENT) return fields;

  if (collection === 'directus_users') return sanitizeUserSelfFields(fields);
  if (fields === undefined || fields === null) return fields;

  const list = Array.isArray(fields) ? fields : String(fields).split(',');
  const out = [];
  for (const raw of list) {
    const field = String(raw).trim();
    if (!field) continue;
    sanitizeRelationPath(schema, collection, field, out);
  }
  return [...new Set(out)];
}

// ---------------------------------------------------------------------------
// Aplicacion del filtro obligatorio a la consulta
// ---------------------------------------------------------------------------

export function applyQueryScope(query, collection, actor, schema) {
  const mandatory = scopeFilter(actor.role, actor.userId, collection, actor);
  if (mandatory === null) return query; // rol sin restriccion (assistant) o coleccion no protegida

  const scoped = { ...query };
  const original = query ? query.filter : undefined;

  if (original !== undefined && original !== null && !isPlainObject(original)) {
    // Un filtro no reconocible nunca debe reemplazar al obligatorio: se rechaza.
    throw forbidden('Filtro no valido para esta consulta.');
  }

  const hasOriginal = isPlainObject(original) && Object.keys(original).length > 0;
  scoped.filter = hasOriginal ? { _and: [mandatory, original] } : mandatory;
  scoped.fields = sanitizeFields(collection, query ? query.fields : undefined, schema, actor);
  return scoped;
}

// ---------------------------------------------------------------------------
// Verificacion de propiedad (lecturas por clave y escrituras)
// ---------------------------------------------------------------------------

async function fetchIds(db, query, ids) {
  const rows = await query;
  return rows.map((row) => (row && row.id !== undefined ? row.id : row));
}

function clientOwnedQuery(db, collection, ids, userId) {
  switch (collection) {
    case 'vehicles':
      return db('vehicles').select('id').whereIn('id', ids).andWhere('user_id', userId);
    case 'appointments':
      return db('appointments as target')
        .join('vehicles as vehicle', 'vehicle.id', 'target.vehicle_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('vehicle.user_id', userId);
    case 'workorders':
      return db('workorders as target')
        .join('vehicles as vehicle', 'vehicle.id', 'target.vehicle_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('vehicle.user_id', userId);
    case 'quotes':
      return db('quotes as target')
        .join('workorders as workorder', 'workorder.id', 'target.workorder_id')
        .join('vehicles as vehicle', 'vehicle.id', 'workorder.vehicle_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('vehicle.user_id', userId);
    case 'quoteitems':
    case 'quoteparts':
      return db(`${collection} as target`)
        .join('quotes as quote', 'quote.id', 'target.quote_id')
        .join('workorders as workorder', 'workorder.id', 'quote.workorder_id')
        .join('vehicles as vehicle', 'vehicle.id', 'workorder.vehicle_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('vehicle.user_id', userId);
    case 'payment':
      return db('payment as target')
        .join('quotes as quote', 'quote.id', 'target.quote_id')
        .join('workorders as workorder', 'workorder.id', 'quote.workorder_id')
        .join('vehicles as vehicle', 'vehicle.id', 'workorder.vehicle_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('vehicle.user_id', userId);
    case 'diagnoses':
    case 'evidence':
    case 'history':
      return db(`${collection} as target`)
        .join('workorders as workorder', 'workorder.id', 'target.workorder_id')
        .join('vehicles as vehicle', 'vehicle.id', 'workorder.vehicle_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('vehicle.user_id', userId);
    case 'directus_users':
      return db('directus_users').select('id').whereIn('id', ids).andWhere('id', userId);
    default:
      return null;
  }
}

function mechanicOwnedQuery(db, collection, ids, userId) {
  switch (collection) {
    case 'workorders':
      return db('workorders').select('id').whereIn('id', ids).andWhere('mechanic_id', userId);
    case 'quotes':
      return db('quotes as target')
        .join('workorders as workorder', 'workorder.id', 'target.workorder_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('workorder.mechanic_id', userId);
    case 'quoteitems':
    case 'quoteparts':
      return db(`${collection} as target`)
        .join('quotes as quote', 'quote.id', 'target.quote_id')
        .join('workorders as workorder', 'workorder.id', 'quote.workorder_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('workorder.mechanic_id', userId);
    case 'diagnoses':
    case 'evidence':
    case 'history':
      return db(`${collection} as target`)
        .join('workorders as workorder', 'workorder.id', 'target.workorder_id')
        .select('target.id')
        .whereIn('target.id', ids)
        .andWhere('workorder.mechanic_id', userId);
    case 'vehicles':
      return db('vehicles')
        .select('id')
        .whereIn('id', ids)
        .andWhereIn('id', db('workorders').select('vehicle_id').where('mechanic_id', userId));
    default:
      return null;
  }
}

export async function assertKeysOwned({ collection, keys, actor, db }) {
  // Una actualizacion individual llega con la clave como texto (URL) y las
  // masivas con el tipo del payload: se comparan normalizadas a texto.
  const list = Array.isArray(keys) ? keys : [keys];
  const ids = list.filter((key) => key !== undefined && key !== null);
  if (ids.length === 0) throw forbidden();

  const query = actor.role === ROLE_CLIENT
    ? clientOwnedQuery(db, collection, ids, actor.userId)
    : mechanicOwnedQuery(db, collection, ids, actor.userId);

  if (!query) throw forbidden();

  const owned = new Set((await fetchIds(db, query, ids)).map((id) => String(id)));
  for (const id of ids) {
    if (!owned.has(String(id))) throw forbidden();
  }
}

async function assertVehicleOwnedByUser(db, vehicleId, userId) {
  if (vehicleId === undefined || vehicleId === null) throw forbidden();
  const row = await db('vehicles').select('id').where('id', vehicleId).andWhere('user_id', userId).first();
  if (!row) throw forbidden();
}

async function assertWorkorderOwnedByUser(db, workorderId, userId) {
  if (workorderId === undefined || workorderId === null) throw forbidden();
  const row = await db('workorders as workorder')
    .join('vehicles as vehicle', 'vehicle.id', 'workorder.vehicle_id')
    .select('workorder.id')
    .where('workorder.id', workorderId)
    .andWhere('vehicle.user_id', userId)
    .first();
  if (!row) throw forbidden();
}

async function assertQuoteOwnedByUser(db, quoteId, userId) {
  if (quoteId === undefined || quoteId === null) throw forbidden();
  const row = await db('quotes as quote')
    .join('workorders as workorder', 'workorder.id', 'quote.workorder_id')
    .join('vehicles as vehicle', 'vehicle.id', 'workorder.vehicle_id')
    .select('quote.id')
    .where('quote.id', quoteId)
    .andWhere('vehicle.user_id', userId)
    .first();
  if (!row) throw forbidden();
}

async function assertWorkorderOwnedByMechanic(db, workorderId, userId) {
  if (workorderId === undefined || workorderId === null) throw forbidden();
  const row = await db('workorders').select('id').where('id', workorderId).andWhere('mechanic_id', userId).first();
  if (!row) throw forbidden();
}

async function assertQuoteOwnedByMechanic(db, quoteId, userId) {
  if (quoteId === undefined || quoteId === null) throw forbidden();
  const row = await db('quotes as quote')
    .join('workorders as workorder', 'workorder.id', 'quote.workorder_id')
    .select('quote.id')
    .where('quote.id', quoteId)
    .andWhere('workorder.mechanic_id', userId)
    .first();
  if (!row) throw forbidden();
}

// ---------------------------------------------------------------------------
// Validacion de escrituras
// ---------------------------------------------------------------------------

function requirePayload(payload) {
  if (!isPlainObject(payload)) throw forbidden();
  return payload;
}

export async function validateCreate({ collection, payload, actor, db }) {
  const data = requirePayload(payload);

  if (actor.role === ROLE_CLIENT) {
    switch (collection) {
      case 'vehicles':
        if (data.user_id !== undefined && data.user_id !== null && data.user_id !== actor.userId) throw forbidden();
        data.user_id = actor.userId;
        return data;
      case 'appointments':
        await assertVehicleOwnedByUser(db, data.vehicle_id, actor.userId);
        return data;
      case 'payment':
        if (data.user_id !== undefined && data.user_id !== null && data.user_id !== actor.userId) throw forbidden();
        if (data.quote_id === undefined || data.quote_id === null) throw forbidden();
        await assertQuoteOwnedByUser(db, data.quote_id, actor.userId);
        data.user_id = actor.userId;
        return data;
      case 'directus_users':
        throw forbidden();
      default:
        return data;
    }
  }

  if (actor.role === ROLE_MECHANIC) {
    switch (collection) {
      case 'diagnoses':
      case 'evidence':
        await assertWorkorderOwnedByMechanic(db, data.workorder_id, actor.userId);
        return data;
      case 'quotes':
        await assertWorkorderOwnedByMechanic(db, data.workorder_id, actor.userId);
        return data;
      case 'quoteitems':
      case 'quoteparts':
        await assertQuoteOwnedByMechanic(db, data.quote_id, actor.userId);
        return data;
      default:
        return data;
    }
  }

  return data;
}

export async function validateUpdate({ collection, keys, payload, actor, db }) {
  const data = requirePayload(payload);

  if (actor.role === ROLE_CLIENT) {
    switch (collection) {
      case 'vehicles':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.user_id !== undefined && data.user_id !== null && data.user_id !== actor.userId) throw forbidden();
        return data;
      case 'appointments':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.vehicle_id !== undefined && data.vehicle_id !== null) {
          await assertVehicleOwnedByUser(db, data.vehicle_id, actor.userId);
        }
        return data;
      case 'quotes':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.workorder_id !== undefined && data.workorder_id !== null) {
          await assertWorkorderOwnedByUser(db, data.workorder_id, actor.userId);
        }
        if (data.user_id !== undefined && data.user_id !== null && data.user_id !== actor.userId) throw forbidden();
        return data;
      case 'quoteitems':
      case 'quoteparts':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.quote_id !== undefined && data.quote_id !== null) {
          await assertQuoteOwnedByUser(db, data.quote_id, actor.userId);
        }
        return data;
      case 'directus_users':
        await assertKeysOwned({ collection, keys, actor, db });
        return data;
      default:
        return data;
    }
  }

  if (actor.role === ROLE_MECHANIC) {
    switch (collection) {
      case 'workorders':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.mechanic_id !== undefined && data.mechanic_id !== null && data.mechanic_id !== actor.userId) throw forbidden();
        return data;
      case 'diagnoses':
      case 'evidence':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.workorder_id !== undefined && data.workorder_id !== null) {
          await assertWorkorderOwnedByMechanic(db, data.workorder_id, actor.userId);
        }
        return data;
      case 'quotes':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.workorder_id !== undefined && data.workorder_id !== null) {
          await assertWorkorderOwnedByMechanic(db, data.workorder_id, actor.userId);
        }
        return data;
      case 'quoteitems':
      case 'quoteparts':
        await assertKeysOwned({ collection, keys, actor, db });
        if (data.quote_id !== undefined && data.quote_id !== null) {
          await assertQuoteOwnedByMechanic(db, data.quote_id, actor.userId);
        }
        return data;
      default:
        return data;
    }
  }

  return data;
}

export async function validateDelete({ collection, keys, actor, db }) {
  if (ITEM_COLLECTIONS.has(collection) || collection === 'directus_users') {
    await assertKeysOwned({ collection, keys, actor, db });
  }
}
