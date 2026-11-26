// VEXORA - Extension local de Directus (hook) que aplica aislamiento por fila.
// No usa reglas de permisos ni licencia: inyecta el filtro obligatorio en
// `items.query` / `users.query` y valida las escrituras antes de ejecutarlas.
// Si la extension no puede determinar el rol o verificar la propiedad, la
// peticion falla (403/503); nunca se ejecuta una consulta sin filtro.

import {
  ITEM_COLLECTIONS,
  ROLE_ADMIN,
  ROLE_ASSISTANT,
  ROLE_CLIENT,
  ROLE_MECHANIC,
  applyQueryScope,
  forbidden,
  unavailable,
  validateCreate,
  validateDelete,
  validateUpdate,
} from './lib/rules.js';

const ROLE_CACHE_TTL = 30000;

export default function registerHook({ filter }, { database, logger, getSchema }) {
  const roleCache = new Map();

  async function roleNameFor(roleId, db) {
    const now = Date.now();
    const cached = roleCache.get(roleId);
    if (cached && cached.expires > now) return cached.name;

    const row = await db('directus_roles').select('name').where('id', roleId).first();
    if (!row || typeof row.name !== 'string') return null;

    roleCache.set(roleId, { name: row.name, expires: now + ROLE_CACHE_TTL });
    return row.name;
  }

  // accountability null = proceso interno de Directus (auth, actividad, flujos).
  // Solo se exceptua ese caso o un administrador real; el resto se resuelve por rol.
  async function actorFor(context) {
    const accountability = context ? context.accountability : null;
    if (!accountability) return { kind: 'system', role: null, userId: null };

    if (accountability.admin === true) {
      return { kind: 'admin', role: ROLE_ADMIN, userId: accountability.user || null };
    }

    if (!accountability.role || !accountability.user) {
      return { kind: 'unknown', role: null, userId: accountability.user || null };
    }

    const db = context.database || database;
    const name = await roleNameFor(accountability.role, db);

    if (name === ROLE_ADMIN) {
      return { kind: 'admin', role: ROLE_ADMIN, userId: accountability.user };
    }

    if (name === ROLE_CLIENT || name === ROLE_MECHANIC || name === ROLE_ASSISTANT) {
      return { kind: name, role: name, userId: accountability.user };
    }

    return { kind: 'unknown', role: null, userId: accountability.user };
  }

  async function schemaFor(context) {
    if (context && context.schema) return context.schema;
    return await getSchema();
  }

  function hook(handler) {
    return async (payload, meta, context) => {
      try {
        return await handler(payload, meta, context);
      } catch (error) {
        if (error && error.name === 'DirectusError') throw error;
        logger.error(error, 'vexora-rls: error interno, peticion rechazada (fail-closed)');
        throw unavailable();
      }
    };
  }

  const scopeQuery = hook(async (query, meta, context) => {
    const actor = await actorFor(context);
    if (actor.kind === 'system' || actor.kind === 'admin' || actor.kind === 'assistant') return query;
    if (!ITEM_COLLECTIONS.has(meta.collection)) return query;
    if (actor.kind === 'unknown') throw forbidden();

    if (actor.role === ROLE_MECHANIC && meta.collection === 'vehicles') {
      const db = (context && context.database) || database;
      const rows = await db('workorders').select('vehicle_id').where('mechanic_id', actor.userId);
      actor.vehicleIds = [
        ...new Set(rows.map((row) => row.vehicle_id).filter((id) => id !== null && id !== undefined)),
      ];
    }

    return applyQueryScope(query, meta.collection, actor, await schemaFor(context));
  });

  const scopeUsersQuery = hook(async (query, meta, context) => {
    const actor = await actorFor(context);
    if (actor.kind === 'system' || actor.kind === 'admin' || actor.kind === 'assistant' || actor.kind === 'mechanic') {
      return query;
    }
    if (actor.kind === 'unknown') throw forbidden();
    return applyQueryScope(query, 'directus_users', actor, await schemaFor(context));
  });

  const scopeWrite = (action) => hook(async (payload, meta, context) => {
    const actor = await actorFor(context);
    if (actor.kind === 'system' || actor.kind === 'admin' || actor.kind === 'assistant') return payload;
    if (!ITEM_COLLECTIONS.has(meta.collection)) return payload;
    if (actor.kind === 'unknown') throw forbidden();

    const db = (context && context.database) || database;
    const collection = meta.collection;

    if (action === 'create') {
      return await validateCreate({ collection, payload, actor, db });
    }

    if (action === 'update') {
      return await validateUpdate({ collection, keys: meta.keys, payload, actor, db });
    }

    return await validateDelete({ collection, keys: payload, actor, db });
  });

  const scopeUsersWrite = (action) => hook(async (payload, meta, context) => {
    const actor = await actorFor(context);
    if (actor.kind === 'system' || actor.kind === 'admin' || actor.kind === 'assistant' || actor.kind === 'mechanic') {
      return payload;
    }
    if (actor.kind === 'unknown') throw forbidden();

    const db = (context && context.database) || database;
    if (action === 'create') throw forbidden();
    if (action === 'delete') {
      return await validateDelete({ collection: 'directus_users', keys: payload, actor, db });
    }

    return await validateUpdate({ collection: 'directus_users', keys: meta.keys, payload, actor, db });
  });

  filter('items.query', scopeQuery);
  filter('items.create', scopeWrite('create'));
  filter('items.update', scopeWrite('update'));
  filter('items.delete', scopeWrite('delete'));

  filter('users.query', scopeUsersQuery);
  filter('users.create', scopeUsersWrite('create'));
  filter('users.update', scopeUsersWrite('update'));
  filter('users.delete', scopeUsersWrite('delete'));
}
