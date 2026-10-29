import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export interface Color {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}
export interface ColorCreate {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ColorServices {
  private url = environment.apiUrl + '/colors';

  private filtro(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Color[]> {
    return defer(() => axios.get<{ data: Color[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filtro(search) }
    })).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Color> {
    return defer(() => axios.get<{ data: Color }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(color: ColorCreate): Observable<Color> {
    return defer(() => axios.post<{ data: Color }>(this.url, color))
      .pipe(map(response => response.data.data));
  }

  update(id: number, color: ColorCreate): Observable<Color> {
    return defer(() => axios.patch<{ data: Color }>(this.url + '/' + id, color))
      .pipe(map(response => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + '/' + id)).pipe(map(() => undefined));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {
      params: { 'aggregate[count]': '*', ...this.filtro(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }
}