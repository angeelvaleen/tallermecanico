import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Brand {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface SavingBrand {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class BrandServices {
  private url = environment.apiUrl + '/brands';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Brand[]> {
    return defer(() => axios.get<{ data: Brand[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Brand[]> {
    return defer(() => axios.get<{ data: Brand[] }>(this.url)).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Brand> {
    return defer(() => axios.get<{ data: Brand }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(brand: SavingBrand): Observable<Brand> {
    return defer(() => axios.post<{ data: Brand }>(this.url, brand))
      .pipe(map(response => response.data.data));
  }

  update(id: number, brand: SavingBrand): Observable<Brand> {
    return defer(() => axios.patch<{ data: Brand }>(this.url + '/' + id, brand))
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