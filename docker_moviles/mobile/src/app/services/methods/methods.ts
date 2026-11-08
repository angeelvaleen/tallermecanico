
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth';

export interface Method {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface MethodCreate {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class MethodServices {
  private url = environment.apiUrl + '/methods';

  constructor(private authService:AuthService){}

  private getAuthConfig() {
    const token = this.authService.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Method[]> {
    return defer(() => axios.get<{ data: Method[] }>(this.url, {...this.getAuthConfig(),
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Method[]> {
    return defer(() => axios.get<{ data: Method[] }>(this.url,this.getAuthConfig())).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Method> {
    return defer(() => axios.get<{ data: Method }>(this.url + '/' + id,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  create(method: MethodCreate): Observable<Method> {
    return defer(() => axios.post<{ data: Method }>(this.url, method,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  update(id: number, method: MethodCreate): Observable<Method> {
    return defer(() => axios.patch<{ data: Method }>(this.url + '/' + id, method,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + '/' + id,this.getAuthConfig())).pipe(map(() => undefined));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {...this.getAuthConfig(),
      params: { 'aggregate[count]': '*', ...this.filter(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }
}