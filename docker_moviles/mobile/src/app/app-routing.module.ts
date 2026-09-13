import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'brands/detail/:id',
    loadChildren: () => import('./pages/brands/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'brands/form',
    loadChildren: () => import('./pages/brands/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'brands/list',
    loadChildren: () => import('./pages/brands/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'appointments/detail/:id',
    loadChildren: () => import('./pages/appointments/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'appointments/form',
    loadChildren: () => import('./pages/appointments/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'appointments/list',
    loadChildren: () => import('./pages/appointments/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'colors/detail/:id',
    loadChildren: () => import('./pages/colors/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'colors/form',
    loadChildren: () => import('./pages/colors/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'colors/list',
    loadChildren: () => import('./pages/colors/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'diagnoses/detail/:id',
    loadChildren: () => import('./pages/diagnoses/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'diagnoses/form',
    loadChildren: () => import('./pages/diagnoses/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'diagnoses/list',
    loadChildren: () => import('./pages/diagnoses/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'evidences/detail/:id',
    loadChildren: () => import('./pages/evidence/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'evidences/form',
    loadChildren: () => import('./pages/evidence/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'evidences/list',
    loadChildren: () => import('./pages/evidence/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'fuels/detail/:id',
    loadChildren: () => import('./pages/fuels/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'fuels/form',
    loadChildren: () => import('./pages/fuels/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'fuels/list',
    loadChildren: () => import('./pages/fuels/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'history/detail/:id',
    loadChildren: () => import('./pages/history/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'history/form',
    loadChildren: () => import('./pages/history/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'history/list',
    loadChildren: () => import('./pages/history/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'methods/detail/:id',
    loadChildren: () => import('./pages/methods/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'methods/form',
    loadChildren: () => import('./pages/methods/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'methods/list',
    loadChildren: () => import('./pages/methods/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'models/detail/:id',
    loadChildren: () => import('./pages/models/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'models/form',
    loadChildren: () => import('./pages/models/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'models/list',
    loadChildren: () => import('./pages/models/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'parts/detail/:id',
    loadChildren: () => import('./pages/parts/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'parts/form',
    loadChildren: () => import('./pages/parts/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'parts/list',
    loadChildren: () => import('./pages/parts/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'payment/detail/:id',
    loadChildren: () => import('./pages/payment/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'payment/form',
    loadChildren: () => import('./pages/payment/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'payment/list',
    loadChildren: () => import('./pages/payment/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'quotes/detail/:id',
    loadChildren: () => import('./pages/quotes/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'quotes/form',
    loadChildren: () => import('./pages/quotes/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'quotes/list',
    loadChildren: () => import('./pages/quotes/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'services/detail/:id',
    loadChildren: () => import('./pages/services/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'services/form',
    loadChildren: () => import('./pages/services/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'services/list',
    loadChildren: () => import('./pages/services/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'vehicles/detail/:id',
    loadChildren: () => import('./pages/vehicles/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'vehicles/form',
    loadChildren: () => import('./pages/vehicles/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'vehicles/list',
    loadChildren: () => import('./pages/vehicles/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'workorders/detail/:id',
    loadChildren: () => import('./pages/workorders/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'workorders/form',
    loadChildren: () => import('./pages/workorders/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'workorders/list',
    loadChildren: () => import('./pages/workorders/list/list.module').then( m => m.ListPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}