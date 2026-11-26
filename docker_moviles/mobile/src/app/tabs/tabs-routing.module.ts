import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

import { authGuard } from '../guard/auth-guard';
import { VIEW_ACCESS } from '../constants/view_access';

// ==========================================
// ACCESO REUTILIZABLE (igual que app-routing)
// ==========================================

type ViewAction = 'list' | 'detail' | 'form';

const tabRoute = (
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
// Las rutas hijas usan los mismos módulos que
// las rutas raíz; el guard aplica la matriz
// VIEW_ACCESS por rol.
// ==========================================

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'workorders/list',
        loadChildren: () =>
          import('../pages/workorders/list/list.module')
            .then(m => m.ListPageModule),
        ...tabRoute('workorders', 'list')
      },
      {
        path: 'appointments/list',
        loadChildren: () =>
          import('../pages/appointments/list/list.module')
            .then(m => m.ListPageModule),
        ...tabRoute('appointments', 'list')
      },
      {
        path: 'vehicles/list',
        loadChildren: () =>
          import('../pages/vehicles/list/list.module')
            .then(m => m.ListPageModule),
        ...tabRoute('vehicles', 'list')
      },
      {
        path: 'payment/list',
        loadChildren: () =>
          import('../pages/payment/list/list.module')
            .then(m => m.ListPageModule),
        ...tabRoute('payment', 'list')
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/profile/profile.module')
            .then(m => m.ProfilePageModule),
        ...tabRoute('profile', 'detail')
      },
      {
        path: '',
        redirectTo: '/tabs/workorders/list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/workorders/list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
