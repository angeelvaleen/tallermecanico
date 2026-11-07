
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService, PermissionAction } from '../services/auth/auth';

interface RoutePermission {
  collection: string;
  action: PermissionAction;
}

interface RouteAccess {
  roles?: string[];
  permission?: RoutePermission;
}

export const authGuard: CanActivateFn = async (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Validar sesión
  const authenticated = await auth.validateSession();

  if (!authenticated) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url
      }
    });
  }

  try {

    // 2. Garantizar que el contexto del usuario esté cargado
    await auth.loadUserContext();

    const access = route.data['access'] as RouteAccess | undefined;

    // 3. Si no existen restricciones adicionales, permitir acceso
    if (!access) {
      return true;
    }

    // 4. Validar rol
    if (
      access.roles &&
      !access.roles.includes(auth.getRole() ?? '')
    ) {
      return router.createUrlTree(['/forbidden']);
    }

    // 5. Validar permiso de Directus
    if (access.permission) {
      const { collection, action } = access.permission;

      if (!auth.can(collection, action)) {
        return router.createUrlTree(['/forbidden']);
      }
    }

    return true;

  } catch (error) {

    console.error('Error validando acceso:', error);

    return router.createUrlTree(['/forbidden']);
  }
};
