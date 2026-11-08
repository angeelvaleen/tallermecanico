import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth';


export interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
  size: string
  created_at: string;
}

export interface EvidenceCreate {
  workorder_id: number;
  path: string;
  format: string;
  size:string
}

@Injectable({ providedIn: 'root' })
export class EvidenceServices {
  private url = environment.apiUrl + '/evidence';

  constructor(private authService:AuthService){}
  private getAuthConfig() {
    const token = this.authService.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { name: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Evidence[]> {
    return defer(() => axios.get<{ data: Evidence[] }>(this.url, {...this.getAuthConfig(),
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Evidence[]> {
    return defer(() => axios.get<{ data: Evidence[] }>(this.url,this.getAuthConfig())).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Evidence> {
    return defer(() => axios.get<{ data: Evidence }>(this.url + '/' + id,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  create(evidence: EvidenceCreate): Observable<Evidence> {
    return defer(() => axios.post<{ data: Evidence }>(this.url, evidence,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  update(id: number, evidence: EvidenceCreate): Observable<Evidence> {
    return defer(() => axios.patch<{ data: Evidence }>(this.url + '/' + id, evidence,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + '/' + id,this.getAuthConfig())).pipe(map(() => undefined));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {...this.getAuthConfig(),
      params: { 'aggregate[count]': '*', ...this.filter(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }

  ofWorkorder(id:number): Observable<Evidence[]>{
      return defer(() => axios.get<{ data: Evidence[] }>(`${this.url}?filter[workorder_id][_eq]=${id}`,this.getAuthConfig()))
        .pipe(map(response => response.data.data));
    }
}