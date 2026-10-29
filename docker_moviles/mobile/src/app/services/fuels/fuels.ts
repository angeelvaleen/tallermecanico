
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export interface Fuel {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface FuelCreate {
  name: string;
  is_active: boolean;
}



@Injectable({ providedIn: 'root' })
export class FuelServices {
  private url = environment.apiUrl + '/fuels';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Fuel[]> {
    return defer(() => axios.get<{ data: Fuel[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Fuel[]> {
    return defer(() => axios.get<{ data: Fuel[] }>(this.url)).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Fuel> {
    return defer(() => axios.get<{ data: Fuel }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(fuel: FuelCreate): Observable<Fuel> {
    return defer(() => axios.post<{ data: Fuel }>(this.url, fuel))
      .pipe(map(response => response.data.data));
  }

  update(id: number, fuel: FuelCreate): Observable<Fuel> {
    return defer(() => axios.patch<{ data: Fuel }>(this.url + '/' + id, fuel))
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