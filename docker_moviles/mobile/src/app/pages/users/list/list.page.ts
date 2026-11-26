import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService, User } from 'src/app/services/auth/auth';

// ==========================================
// GESTIÓN DE USUARIOS (solo Administrator)
// Listado de usuarios con rol y estado.
// ==========================================

@Component({
  selector: 'app-users-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage {

  users: User[] = [];
  loading: boolean = true;
  loadError: boolean = false;

  constructor(private auth: AuthService) {}

  // Recargar al entrar (tras crear/editar un usuario)
  async ionViewWillEnter(): Promise<void> {
    await this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    this.loading = true;
    this.loadError = false;
    try {
      this.users = await firstValueFrom(this.auth.listUsers());
    } catch (error) {
      console.error('Error al cargar usuarios:', error);

      this.loadError = true;
    } finally {
      this.loading = false;
    }
  }

  async retry(): Promise<void> {
    await this.loadUsers();
  }

}
