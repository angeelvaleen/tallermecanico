import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export interface Diagnosis {
  id: number;
  workorder_id: number;
  description: string;
  result: string;
  created_at: string;
}

export interface SavingDiagnosis {
  workorder_id: number;
  description: string;
  result: string;
}

@Injectable({ providedIn: 'root' })
export class DiagnosisServices {
  private url = environment.apiUrl + '/diagnoses';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Diagnosis[]> {
    return defer(() => axios.get<{ data: Diagnosis[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Diagnosis[]> {
    return defer(() => axios.get<{ data: Diagnosis[] }>(this.url)).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Diagnosis> {
    return defer(() => axios.get<{ data: Diagnosis }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(diagnosis: SavingDiagnosis): Observable<Diagnosis> {
    return defer(() => axios.post<{ data: Diagnosis }>(this.url, diagnosis))
      .pipe(map(response => response.data.data));
  }

  update(id: number, diagnosis: SavingDiagnosis): Observable<Diagnosis> {
    return defer(() => axios.patch<{ data: Diagnosis }>(this.url + '/' + id, diagnosis))
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