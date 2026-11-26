import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService, User } from 'src/app/services/auth/auth';

// ==========================================
// DETALLE DE USUARIO (solo Administrator)
// ==========================================

@Component({
  selector: 'app-users-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {

  user?: User;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    try {
      this.user = await firstValueFrom(this.auth.getUser(id));
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    } finally {
      this.loading = false;
    }
  }

}
