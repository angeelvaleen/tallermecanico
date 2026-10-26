import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export interface Quote {
  id: number;
  workorder_id: number;
  user_id:number;
  status_id:number;
  subtotal:number;
  tax:number;
  total: number;
  validity: string;
  created_at:string;
}

export interface SavingQuote {
  workorder_id: number;
  user_id:number;
  status_id:number;
  subtotal:number;
  tax:number;
  total: number;
  validity: string;
}

@Injectable({ providedIn: 'root' })
export class QuoteServices {
  private url = environment.apiUrl + '/quotes';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { workorder_id : {_eq: text} },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Quote[]> {
    return defer(() => axios.get<{ data: Quote[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Quote> {
    return defer(() => axios.get<{ data: Quote }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(quote: SavingQuote): Observable<Quote> {
    return defer(() => axios.post<{ data: Quote }>(this.url, quote))
      .pipe(map(response => response.data.data));
  }

  update(id: number, quote: SavingQuote): Observable<Quote> {
    return defer(() => axios.patch<{ data: Quote }>(this.url + '/' + id, quote))
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