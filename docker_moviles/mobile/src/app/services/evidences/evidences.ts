import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
  size: string
  created_at: string;
}

export interface SavingEvidence {
  workorder_id: number;
  path: string;
  format: string;
  size:string
}

@Injectable({ providedIn: 'root' })
export class EvidenceServices {
  private url = environment.apiUrl + '/evidence';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Evidence[]> {
    return defer(() => axios.get<{ data: Evidence[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Evidence[]> {
    return defer(() => axios.get<{ data: Evidence[] }>(this.url)).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Evidence> {
    return defer(() => axios.get<{ data: Evidence }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(evidence: SavingEvidence): Observable<Evidence> {
    return defer(() => axios.post<{ data: Evidence }>(this.url, evidence))
      .pipe(map(response => response.data.data));
  }

  update(id: number, evidence: SavingEvidence): Observable<Evidence> {
    return defer(() => axios.patch<{ data: Evidence }>(this.url + '/' + id, evidence))
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