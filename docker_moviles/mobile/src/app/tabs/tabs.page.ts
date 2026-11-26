import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth';
import { VIEW_ACCESS } from '../constants/view_access';

// ==========================================
// TABS DINÁMICAS SEGÚN EL ROL AUTENTICADO
// - Administrator / client: todas las tabs
// - mechanic / assistant: Órdenes y Perfil
// ==========================================

interface TabItem {
  href: string;
  tab: string;
  icon: string;
  label: string;
  roles: string[];
}

const TABS: TabItem[] = [
  {
    href: 'tabs/workorders/list',
    tab: 'workorders/list',
    icon: 'hammer-outline',
    label: 'Órdenes',
    roles: [...VIEW_ACCESS.workorders.list]
  },
  {
    href: 'tabs/appointments/list',
    tab: 'appointments/list',
    icon: 'calendar-outline',
    label: 'Citas',
    roles: [...VIEW_ACCESS.appointments.list]
  },
  {
    href: 'tabs/vehicles/list',
    tab: 'vehicles/list',
    icon: 'car-sport-outline',
    label: 'Vehículos',
    roles: [...VIEW_ACCESS.vehicles.list]
  },
  {
    href: 'tabs/payment/list',
    tab: 'payment/list',
    icon: 'card-outline',
    label: 'Pagos',
    roles: [...VIEW_ACCESS.payment.list]
  },
  {
    href: 'tabs/profile',
    tab: 'profile',
    icon: 'person-circle-outline',
    label: 'Perfil',
    roles: [...VIEW_ACCESS.profile.detail]
  }
];

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  tabs: TabItem[] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // Marca visualmente la pestaña correspondiente a la ruta actual.
  // No interviene en la navegación: Ionic resuelve tabRootUrl con `tab`.
  isActive(tab: TabItem): boolean {
    return this.router.url.startsWith(`/${tab.href}`);
  }

  ionViewWillEnter(): void {
    const role = this.auth.getRole() ?? '';

    this.tabs = TABS.filter(tab => tab.roles.includes(role));

    // Sin rol conocido: solo órdenes para no quedar sin navegación
    if (!this.tabs.length) {
      this.tabs = [TABS[0]];
    }
  }

}
