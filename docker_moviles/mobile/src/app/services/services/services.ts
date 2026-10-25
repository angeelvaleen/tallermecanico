import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface SavingService {
  name: string;
  price: number;
  description: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ServiceServices {
  private url = environment.apiUrl + '/services';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
      { description: { _icontains:text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Service[]> {
    return defer(() => axios.get<{ data: Service[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Service> {
    return defer(() => axios.get<{ data: Service }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(service: SavingService): Observable<Service> {
    return defer(() => axios.post<{ data: Service }>(this.url, service))
      .pipe(map(response => response.data.data));
  }

  update(id: number, service: SavingService): Observable<Service> {
    return defer(() => axios.patch<{ data: Service }>(this.url + '/' + id, service))
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