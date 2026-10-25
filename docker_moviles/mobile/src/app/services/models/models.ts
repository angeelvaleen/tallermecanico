import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Model {
  id: number;
  brand_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface SavingModel {
  brand_id: number;
  name: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModelServices {
  private url = environment.apiUrl + '/models';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
      { brand_id: {
          name: {
            _icontains:text
          }
      }}
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Model[]> {
    return defer(() => axios.get<{ data: Model[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Model> {
    return defer(() => axios.get<{ data: Model }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(model: SavingModel): Observable<Model> {
    return defer(() => axios.post<{ data: Model }>(this.url, model))
      .pipe(map(response => response.data.data));
  }

  update(id: number, model: SavingModel): Observable<Model> {
    return defer(() => axios.patch<{ data: Model }>(this.url + '/' + id, model))
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