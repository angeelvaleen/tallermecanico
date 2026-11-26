// VEXORA - Extension local de Directus (endpoint) para editar el perfil propio.
// Directus no aplica reglas custom de permisos en esta instalacion, por lo que
// la coleccion directus_users no es editable por los roles de la app. Este
// endpoint actualiza UNICAMENTE el usuario autenticado y solo los campos
// permitidos (nombre, apellido, descripcion y avatar). Nunca acepta rol,
// politicas, correo, contrasena ni estado; el id sale de `accountability` y no
// del body, de modo que un usuario no puede editar el perfil de otro.

const ALLOWED_FIELDS = ['first_name', 'last_name', 'description', 'avatar'];
const NAME_MAX = 50;
const DESCRIPTION_MAX = 500;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function reject(res, status, message) {
  return res.status(status).json({
    errors: [{ message }],
  });
}

function normalizeText(value) {
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  return text.length ? text : null;
}

export default function registerEndpoint(router, { services, database, getSchema, logger }) {
  const { UsersService } = services;

  router.patch('/me', async (req, res) => {
    const userId = req.accountability?.user;

    if (!userId) {
      return reject(res, 401, 'Debes iniciar sesion para editar tu perfil.');
    }

    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return reject(res, 400, 'Los datos del perfil no son validos.');
    }

    const received = Object.keys(body);

    if (!received.length) {
      return reject(res, 400, 'No hay cambios para guardar.');
    }

    const notAllowed = received.filter((field) => !ALLOWED_FIELDS.includes(field));

    if (notAllowed.length) {
      return reject(
        res,
        400,
        `No esta permitido modificar: ${notAllowed.join(', ')}.`,
      );
    }

    const payload = {};

    if (Object.prototype.hasOwnProperty.call(body, 'first_name')) {
      const firstName = normalizeText(body.first_name);

      if (firstName === undefined) {
        return reject(res, 400, 'El nombre no es valido.');
      }

      if (firstName === null) {
        return reject(res, 400, 'El nombre no puede estar vacio.');
      }

      if (firstName.length > NAME_MAX) {
        return reject(res, 400, `El nombre no puede superar ${NAME_MAX} caracteres.`);
      }

      payload.first_name = firstName;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'last_name')) {
      const lastName = normalizeText(body.last_name);

      if (lastName === undefined) {
        return reject(res, 400, 'El apellido no es valido.');
      }

      if (lastName && lastName.length > NAME_MAX) {
        return reject(res, 400, `El apellido no puede superar ${NAME_MAX} caracteres.`);
      }

      payload.last_name = lastName;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
      const description = normalizeText(body.description);

      if (description === undefined) {
        return reject(res, 400, 'La descripcion no es valida.');
      }

      if (description && description.length > DESCRIPTION_MAX) {
        return reject(
          res,
          400,
          `La descripcion no puede superar ${DESCRIPTION_MAX} caracteres.`,
        );
      }

      payload.description = description;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'avatar')) {
      const avatar = body.avatar;

      if (avatar !== null && (typeof avatar !== 'string' || !UUID_PATTERN.test(avatar))) {
        return reject(res, 400, 'La fotografia no es valida.');
      }

      if (avatar) {
        const file = await database('directus_files')
          .select('id', 'uploaded_by')
          .where('id', avatar)
          .first();

        if (!file) {
          return reject(res, 400, 'La fotografia no existe en Directus.');
        }

        if (file.uploaded_by && file.uploaded_by !== userId) {
          return reject(res, 403, 'Solo puedes usar fotografias subidas por tu usuario.');
        }
      }

      payload.avatar = avatar;
    }

    try {
      const schema = await getSchema();
      const usersService = new UsersService({
        knex: database,
        schema,
        accountability: null,
      });

      await usersService.updateOne(userId, payload);

      const updated = await usersService.readOne(userId, {
        fields: ['id', 'email', 'first_name', 'last_name', 'description', 'avatar'],
      });

      return res.json({ data: updated });
    } catch (error) {
      logger.error(error, 'vexora-profile: no se pudo actualizar el perfil');
      return reject(res, 500, 'No se pudo guardar el perfil. Intenta de nuevo.');
    }
  });
}
