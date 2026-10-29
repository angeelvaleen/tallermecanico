import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

import { Vehicle } from '../vehicles/vehicles';
import { User } from '../auth/auth';

interface Status {
  id: number;
  name: string;
}


export interface Workorder {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string;
  created_at: string;
}

export interface WorkorderDetail {
  id: number;
  vehicle_id: Vehicle;
  mechanic_id: User;
  status_id: Status;
  mileage: number;
  delivery: string;
  created_at: string;
}

export interface WorkorderCreate{
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

  detail(id: number): Observable<WorkorderDetail> {
    return defer(() => axios.get<{ data: WorkorderDetail }>(`${this.url}/${id}?fields=*,mechanic_id.name,status_id.name,status_id.id,vehicle_id.plate`))
      .pipe(map(response => response.data.data));
  }

  create(workorder: WorkorderCreate): Observable<Workorder> {
    return defer(() => axios.post<{ data: Workorder }>(this.url, workorder))
      .pipe(map(response => response.data.data));
  }

  update(id: number, workorder: WorkorderCreate): Observable<Workorder> {
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