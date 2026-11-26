import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth';
import { ADMIN_LIST_ROUTES } from '../../constants/admin_menu';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false,
})
export class ToolbarComponent implements OnInit {

  @Input() name: string = '';
  @Input() color: string = 'primary';
  @Input() showMenu: boolean = true;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // El menu desplegable es exclusivo del Administrator
  get isAdmin(): boolean {
    return this.auth.canByRole(['Administrator']);
  }

  // Regreso explicito solo en los listados administrativos.
  // En formularios y detalles ya existe su propia navegacion de regreso.
  get showBackToWorkorders(): boolean {
    const path = this.router.url.split('?')[0];

    return this.isAdmin && ADMIN_LIST_ROUTES.includes(path);
  }

  goToWorkorders(): void {
    this.router.navigateByUrl('/tabs/workorders/list');
  }

  ngOnInit() {}

}
