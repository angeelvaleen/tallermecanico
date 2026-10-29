import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export interface User {
  id: number;
  name: string;
}

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
  readonly client = axios.create({ baseURL: environment.apiUrl });

  constructor() {
    this.client.interceptors.request.use(config => {
      if (this.token) config.headers.set('Authorization', 'Bearer ' + this.token);
      return config;
    });
  }

  private save(data: SessionDirectus): void {
    this.token = data.access_token;
    this.refreshToken = data.refresh_token;
    this.expire = Date.now() + Number(data.expires);
  }

  async signin(email: string, password: string): Promise<void> {
    const response = await axios.post<{ data: SessionDirectus }>(environment.authUrl + '/auth/login', {
      email: email.trim(), password, mode: 'json'
    });
    this.save(response.data.data);
  }

  async register(email: string, password: string, name: string): Promise<void> {
    await axios.post(environment.authUrl + '/users/register', {
      email: email.trim(), password, first_name: name.trim()
    });
  }

  active(): boolean {
    return !!this.token && Date.now() < this.expire;
  }

  async renew(): Promise<void> {
    const response = await axios.post<{ data: SessionDirectus }>(environment.apiUrl + '/auth/refresh', {
      refresh_token: this.refreshToken, mode: 'json'
    });
    this.save(response.data.data);
  }

  async validateSession(): Promise<boolean> {
    try {
      if (!this.active()) {
        if (!this.refreshToken) return false;
        await this.renew();
      }
      await this.client.get('/users/me', { params: { fields: 'id' } });
      return true;
    } catch {
      this.clean();
      return false;
    }
  }

  private clean(): void {
    this.token = '';
    this.refreshToken = '';
    this.expire = 0;
  }

  async logout(): Promise<void> {
    try {
      if (this.refreshToken) await axios.post(environment.apiUrl + '/auth/logout', {
        refresh_token: this.refreshToken, mode: 'json'
      });
    } finally { this.clean(); }
  }
}