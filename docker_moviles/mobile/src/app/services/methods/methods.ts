
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Method {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface SavingMethod {
  name: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class MethodServices {
  private url = environment.apiUrl + '/methods';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Method[]> {
    return defer(() => axios.get<{ data: Method[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Method[]> {
    return defer(() => axios.get<{ data: Method[] }>(this.url)).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Method> {
    return defer(() => axios.get<{ data: Method }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(method: SavingMethod): Observable<Method> {
    return defer(() => axios.post<{ data: Method }>(this.url, method))
      .pipe(map(response => response.data.data));
  }

  update(id: number, method: SavingMethod): Observable<Method> {
    return defer(() => axios.patch<{ data: Method }>(this.url + '/' + id, method))
      .pipe(map(response => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + '/' + id)).pipe(map(() => undefined));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {
      params: { 'aggregate[count]': '*', ...this.filter(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }
}