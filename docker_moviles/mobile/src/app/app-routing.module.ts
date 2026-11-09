
import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  Routes
} from '@angular/router';

import { authGuard } from './guard/auth-guard';
import { VIEW_ACCESS } from './constants/view_access';

// ==========================================
// CONFIGURACIÓN REUTILIZABLE DE ACCESO
// ==========================================

type ViewAction = 'list' | 'detail' | 'form';

const viewRoute = (
  view: keyof typeof VIEW_ACCESS,
  action: ViewAction
) => ({
  canActivate: [authGuard],
  data: {
    access: {
      roles: VIEW_ACCESS[view][action]
    }
  }
});

// ==========================================
// RUTAS
// ==========================================

const routes: Routes = [

  // ==========================================
  // INICIO / TABS
  // ==========================================

  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module')
        .then(m => m.TabsPageModule),
    canActivate: [authGuard]
  },

  // ==========================================
  // BRANDS
  // ==========================================

  {
    path: 'brands/detail/:id',
    loadChildren: () =>
      import('./pages/brands/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('brands', 'detail')
  },
  {
    path: 'brands/form',
    loadChildren: () =>
      import('./pages/brands/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('brands', 'form')
  },
  {
    path: 'brands/list',
    loadChildren: () =>
      import('./pages/brands/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('brands', 'list')
  },

  // ==========================================
  // APPOINTMENTS
  // ==========================================

  {
    path: 'appointments/detail/:id',
    loadChildren: () =>
      import('./pages/appointments/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('appointments', 'detail')
  },
  {
    path: 'appointments/form',
    loadChildren: () =>
      import('./pages/appointments/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('appointments', 'form')
  },
  {
    path: 'appointments/list',
    loadChildren: () =>
      import('./pages/appointments/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('appointments', 'list')
  },

  // ==========================================
  // COLORS
  // ==========================================

  {
    path: 'colors/detail/:id',
    loadChildren: () =>
      import('./pages/colors/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('colors', 'detail')
  },
  {
    path: 'colors/form',
    loadChildren: () =>
      import('./pages/colors/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('colors', 'form')
  },
  {
    path: 'colors/list',
    loadChildren: () =>
      import('./pages/colors/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('colors', 'list')
  },

  // ==========================================
  // DIAGNOSES
  // ==========================================

  {
    path: 'diagnoses/detail/:id',
    loadChildren: () =>
      import('./pages/diagnoses/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('diagnoses', 'detail')
  },
  {
    path: 'diagnoses/form',
    loadChildren: () =>
      import('./pages/diagnoses/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('diagnoses', 'form')
  },
  {
    path: 'diagnoses/list',
    loadChildren: () =>
      import('./pages/diagnoses/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('diagnoses', 'list')
  },

  // ==========================================
  // EVIDENCES
  // Colección Directus: evidence
  // ==========================================

  {
    path: 'evidences/detail/:id',
    loadChildren: () =>
      import('./pages/evidence/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('evidences', 'detail')
  },
  {
    path: 'evidences/form',
    loadChildren: () =>
      import('./pages/evidence/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('evidences', 'form')
  },
  {
    path: 'evidences/list',
    loadChildren: () =>
      import('./pages/evidence/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('evidences', 'list')
  },

  // ==========================================
  // FUELS
  // ==========================================

  {
    path: 'fuels/detail/:id',
    loadChildren: () =>
      import('./pages/fuels/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('fuels', 'detail')
  },
  {
    path: 'fuels/form',
    loadChildren: () =>
      import('./pages/fuels/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('fuels', 'form')
  },
  {
    path: 'fuels/list',
    loadChildren: () =>
      import('./pages/fuels/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('fuels', 'list')
  },

  // ==========================================
  // HISTORY
  // ==========================================

  {
    path: 'history/detail/:id',
    loadChildren: () =>
      import('./pages/history/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('history', 'detail')
  },
  {
    path: 'history/form',
    loadChildren: () =>
      import('./pages/history/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('history', 'form')
  },
  {
    path: 'history/list',
    loadChildren: () =>
      import('./pages/history/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('history', 'list')
  },

  // ==========================================
  // METHODS
  // ==========================================

  {
    path: 'methods/detail/:id',
    loadChildren: () =>
      import('./pages/methods/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('methods', 'detail')
  },
  {
    path: 'methods/form',
    loadChildren: () =>
      import('./pages/methods/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('methods', 'form')
  },
  {
    path: 'methods/list',
    loadChildren: () =>
      import('./pages/methods/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('methods', 'list')
  },

  // ==========================================
  // MODELS
  // ==========================================

  {
    path: 'models/detail/:id',
    loadChildren: () =>
      import('./pages/models/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('models', 'detail')
  },
  {
    path: 'models/form',
    loadChildren: () =>
      import('./pages/models/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('models', 'form')
  },
  {
    path: 'models/list',
    loadChildren: () =>
      import('./pages/models/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('models', 'list')
  },

  // ==========================================
  // PARTS
  // ==========================================

  {
    path: 'parts/detail/:id',
    loadChildren: () =>
      import('./pages/parts/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('parts', 'detail')
  },
  {
    path: 'parts/form',
    loadChildren: () =>
      import('./pages/parts/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('parts', 'form')
  },
  {
    path: 'parts/list',
    loadChildren: () =>
      import('./pages/parts/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('parts', 'list')
  },

  // ==========================================
  // PAYMENT
  // ==========================================

  {
    path: 'payment/detail/:id',
    loadChildren: () =>
      import('./pages/payment/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('payment', 'detail')
  },
  {
    path: 'payment/form',
    loadChildren: () =>
      import('./pages/payment/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('payment', 'form')
  },
  {
    path: 'payment/list',
    loadChildren: () =>
      import('./pages/payment/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('payment', 'list')
  },

  // ==========================================
  // QUOTES
  // ==========================================

  {
    path: 'quotes/detail/:id',
    loadChildren: () =>
      import('./pages/quotes/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('quotes', 'detail')
  },
  {
    path: 'quotes/form',
    loadChildren: () =>
      import('./pages/quotes/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('quotes', 'form')
  },
  {
    path: 'quotes/list',
    loadChildren: () =>
      import('./pages/quotes/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('quotes', 'list')
  },

  // ==========================================
  // SERVICES
  // ==========================================

  {
    path: 'services/detail/:id',
    loadChildren: () =>
      import('./pages/services/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('services', 'detail')
  },
  {
    path: 'services/form',
    loadChildren: () =>
      import('./pages/services/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('services', 'form')
  },
  {
    path: 'services/list',
    loadChildren: () =>
      import('./pages/services/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('services', 'list')
  },

  // ==========================================
  // VEHICLES
  // ==========================================

  {
    path: 'vehicles/detail/:id',
    loadChildren: () =>
      import('./pages/vehicles/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('vehicles', 'detail')
  },
  {
    path: 'vehicles/form',
    loadChildren: () =>
      import('./pages/vehicles/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('vehicles', 'form')
  },
  {
    path: 'vehicles/list',
    loadChildren: () =>
      import('./pages/vehicles/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('vehicles', 'list')
  },

  // ==========================================
  // WORKORDERS
  // ==========================================

  {
    path: 'workorders/detail/:id',
    loadChildren: () =>
      import('./pages/workorders/detail/detail.module')
        .then(m => m.DetailPageModule),
    ...viewRoute('workorders', 'detail')
  },
  {
    path: 'workorders/form',
    loadChildren: () =>
      import('./pages/workorders/form/form.module')
        .then(m => m.FormPageModule),
    ...viewRoute('workorders', 'form')
  },
  {
    path: 'workorders/list',
    loadChildren: () =>
      import('./pages/workorders/list/list.module')
        .then(m => m.ListPageModule),
    ...viewRoute('workorders', 'list')
  },

  // ==========================================
  // LOGIN - PÚBLICA
  // ==========================================

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login/login.module')
        .then(m => m.LoginPageModule)
  },

  // ==========================================
  // REGISTER - PÚBLICA
  // ==========================================

  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register/register.module')
        .then(m => m.RegisterPageModule)
  },

  // ==========================================
  // ACCESO DENEGADO
  // Crear esta página antes de habilitarla.
  // Debe permanecer sin authGuard.
  // ==========================================

  {
    path: 'forbidden',
    loadChildren: () =>
     import('./pages/forbidden/forbidden.module')
        .then(m => m.ForbiddenPageModule)
  },

  // ==========================================
  // RUTA DESCONOCIDA
  // ==========================================

  {
    path: '**',
    redirectTo: ''
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/profile/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'form',
    loadChildren: () => import('./pages/profile/form/form.module').then( m => m.FormPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
