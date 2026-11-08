import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { Observable, defer } from "rxjs";
import { map } from "rxjs/operators";

// Perfil del usuario
export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: {
    id: string;
    name: string;
  } | null;
}

// Acciones disponibles
export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete';

// Niveles de acceso
export type AccessLevel =
  | 'none'
  | 'partial'
  | 'full';

// Estructura de cada permiso
export interface ActionPermission {
  access: AccessLevel;
  fields?: string[];
  presets?: Record<string, unknown>;
}

// Permisos del usuario por colección
export type UserPermissions = Record<
  string,
  Partial<Record<PermissionAction, ActionPermission>>
>;

// Sesión Directus
interface SessionDirectus {
  access_token: string;
  refresh_token: string;
  expires: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private token = '';
  private refreshToken = '';
  private expire = 0;

  // Perfil y permisos del usuario
  private profile: User | null = null;
  private permissions: UserPermissions | null = null;

  private contextLoading: Promise<void> | null = null;
  private contextVersion = 0;

  readonly client = axios.create({
    baseURL: environment.authUrl
  });

  constructor() {
    this.client.interceptors.request.use(config => {
      if (this.token) {
        config.headers.set(
          'Authorization',
          'Bearer ' + this.token
        );
      }

      return config;
    });
  }

  // Guardar sesión
  private save(data: SessionDirectus): void {
    this.token = data.access_token;
    this.refreshToken = data.refresh_token;
    this.expire = Date.now() + Number(data.expires);
  }

  // Iniciar sesión
  async signin(email: string, password: string): Promise<void> {
    const response = await axios.post<{ data: SessionDirectus }>(
      environment.authUrl + '/auth/login',
      {
        email: email.trim(),
        password,
        mode: 'json'
      }
    );

    this.clean();
    this.save(response.data.data);
  }

  // Registrar usuario
  async register(email: string, password: string, name: string): Promise<void> {
    await axios.post(environment.authUrl + '/users/register', {
      email: email.trim(),
      password,
      first_name: name.trim()
    });
  }

  // Comprobar sesión activa
  active(): boolean {
    return !!this.token && Date.now() < this.expire;
  }

  // Renovar sesión
  async renew(): Promise<void> {
    const response = await axios.post<{ data: SessionDirectus }>(
      environment.apiUrl + '/auth/refresh',
      {
        refresh_token: this.refreshToken,
        mode: 'json'
      }
    );

    this.save(response.data.data);
  }

  // Validar sesión
  async validateSession(): Promise<boolean> {
    try {
      if (!this.active()) {
        if (!this.refreshToken) return false;
        await this.renew();
      }

      await this.loadUserContext();

      return true;

    } catch {
      this.clean();
      return false;
    }
  }

  // Obtener perfil del usuario
  async getProfile(): Promise<User> {
    const response = await this.client.get<{ data: User }>(
      '/users/me',
      {
        params: {
          fields: 'id,email,first_name,last_name,role.id,role.name'
        }
      }
    );

    return response.data.data;
  }

  // Obtener permisos efectivos
  async getPermissions(): Promise<UserPermissions> {
    const response = await this.client.get<{
      data: UserPermissions
    }>('/permissions/me');

    return response.data.data;
  }

  // Cargar perfil y permisos
  async loadUserContext(force = false): Promise<void> {

    if (
      !force &&
      this.profile !== null &&
      this.permissions !== null
    ) {
      return;
    }

    if (this.contextLoading) {
      return this.contextLoading;
    }

    const version = this.contextVersion;

    const loading = (async () => {

      const [profile, permissions] = await Promise.all([
        this.getProfile(),
        this.getPermissions()
      ]);

      if (version !== this.contextVersion) {
        throw new Error('La sesión ha cambiado');
      }

      this.profile = profile;
      this.permissions = permissions;

    })();

    this.contextLoading = loading;

    try {
      await loading;
    } finally {
      if (this.contextLoading === loading) {
        this.contextLoading = null;
      }
    }
  }

  // Obtener perfil almacenado
  getCurrentProfile(): User | null {
    return this.profile;
  }

  // Obtener rol por nombre
  getRole(): string | null {
    return this.profile?.role?.name ?? null;
  }

  getID(): string | null {
    return this.profile?.id ?? null;
  }

  getAccessToken(): string {
    return this.token;
  }

  // Comprobar rol
  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  // Comprobar permiso CRUD
  can(
    collection: string,
    action: PermissionAction
  ): boolean {

    const permission = this.permissions?.[collection]?.[action];

    return (
      permission?.access === 'full' ||
      permission?.access === 'partial'
    );
  }

  // Obtener nivel de acceso
  getAccess(
    collection: string,
    action: PermissionAction
  ): AccessLevel {

    return this.permissions?.[collection]?.[action]?.access ?? 'none';
  }

  // Limpiar sesión, perfil y permisos
  private clean(): void {
    this.contextVersion++;

    this.token = '';
    this.refreshToken = '';
    this.expire = 0;

    this.profile = null;
    this.permissions = null;

    this.contextLoading = null;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        await axios.post(
          environment.apiUrl + '/auth/logout',
          {
            refresh_token: this.refreshToken,
            mode: 'json'
          }
        );
      }

    } finally {
      this.clean();
    }
  }

  // Listar usuarios
  listUsers(): Observable<User[]> {
    return defer(() =>
      this.client.get<{ data: User[] }>('/users', {
        params: {
          fields: 'id,email,first_name,last_name',
          sort: 'first_name'
        }
      })
    ).pipe(
      map(response => response.data.data)
    );
  }

  getMechanicList(): Observable<User[]> {
    return defer(() =>
      this.client.get<{ data: User[] }>('/users', {
        params: {
          fields: 'id,email,first_name,last_name',
          sort: 'first_name',
          filter: {
            role: {
              name: {
                _eq: 'mechanic'
              }
            }
          }
        }
      })
    ).pipe(
      map(response => response.data.data)
    );
  }

  canByRole(
    roles: readonly string[]
  ): boolean {
    const role = this.getRole();

    return !!role && roles.includes(role);
}

}

