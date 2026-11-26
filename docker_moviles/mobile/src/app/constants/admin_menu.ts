// ==========================================
// MENU ADMINISTRATIVO
// Fuente unica de enlaces y rutas para el
// menu lateral y el boton de regreso.
// ==========================================

export interface AdminLink {
  path: string;
  text: string;
}

export const ADMIN_CATALOG_LINKS: AdminLink[] = [
  { path: '/colors/list', text: 'Colores' },
  { path: '/brands/list', text: 'Marcas' },
  { path: '/models/list', text: 'Modelos' },
  { path: '/fuels/list', text: 'Combustibles' },
  { path: '/parts/list', text: 'Refacciones' },
  { path: '/services/list', text: 'Servicios' },
  { path: '/methods/list', text: 'Métodos de pago' },
];

export const ADMIN_STANDALONE_LINKS: AdminLink[] = [
  { path: '/diagnoses/list', text: 'Diagnóstico' },
  { path: '/evidences/list', text: 'Evidencias' },
];

// Listados que se abren con routerDirection="root":
// la pila de navegacion queda vacia y no existe boton "atras".
export const ADMIN_LIST_ROUTES: string[] = [
  ...ADMIN_CATALOG_LINKS.map(link => link.path),
  ...ADMIN_STANDALONE_LINKS.map(link => link.path),
  '/users/list',
];
