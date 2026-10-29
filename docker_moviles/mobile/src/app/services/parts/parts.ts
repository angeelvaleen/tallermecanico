import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export interface Part {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface PartCreate {
  name: string;
  price: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class PartServices {
  private url = environment.apiUrl + '/parts';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
      { description: { _icontains:text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Part[]> {
    return defer(() => axios.get<{ data: Part[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Part> {
    return defer(() => axios.get<{ data: Part }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(part: PartCreate): Observable<Part> {
    return defer(() => axios.post<{ data: Part }>(this.url, part))
      .pipe(map(response => response.data.data));
  }

  update(id: number, part: PartCreate): Observable<Part> {
    return defer(() => axios.patch<{ data: Part }>(this.url + '/' + id, part))
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