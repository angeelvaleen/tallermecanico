import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';


export interface Workorder {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string;
  created_at: string;
}

export interface SavingWorkorder{
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string;
}

@Injectable({ providedIn: 'root' })
export class WorkorderServices {
  private url = environment.apiUrl + '/workorders';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { vehicle_id: {
          plate: { _icontains: text },
        } 
      },
      { vehicle_id: {
          vin: { _icontains: text },
        } 
      },
      { mechanic_id: {
          name: { _icontains: text },
        } 
      },
      {  status_id: {
          name: { _icontains: text },
        } 
      },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Workorder[]> {
    return defer(() => axios.get<{ data: Workorder[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Workorder> {
    return defer(() => axios.get<{ data: Workorder }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(workorder: SavingWorkorder): Observable<Workorder> {
    return defer(() => axios.post<{ data: Workorder }>(this.url, workorder))
      .pipe(map(response => response.data.data));
  }

  update(id: number, workorder: SavingWorkorder): Observable<Workorder> {
    return defer(() => axios.patch<{ data: Workorder }>(this.url + '/' + id, workorder))
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