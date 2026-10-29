
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { Quote } from '../quotes/quotes';
import { Method } from '../methods/methods';

interface PaymentUser {
  id: string;
  name: string;
}

export interface Payment {
  id: number;
  quote_id: number;
  user_id: number;
  method_id:number;
  amount: number;
  reference: string;
  paid_at:string;
}

export interface PaymentDetail {
  id: number;
  amount: string;
  reference: string | null;
  paid_at: string | null;
  quote_id: Quote;
  method_id: Method;
  user_id: PaymentUser;
}

export interface PaymentCreate {
  id: number;
  quote_id: number;
  user_id: number;
  method_id:number;
  amount: number;
}



@Injectable({ providedIn: 'root' })
export class PaymentServices {
  private url = environment.apiUrl + '/payment';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { reference: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Payment[]> {
    return defer(() => axios.get<{ data: Payment[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Payment[]> {
    return defer(() => axios.get<{ data: Payment[] }>(this.url)).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<PaymentDetail> {
    return defer(() => axios.get<{ data: PaymentDetail }>(`${environment.apiUrl}/payment/${encodeURIComponent(id)}?fields=*,quote_id.*,method_id.*,user_id.*`))
      .pipe(map(response => response.data.data));
  }

  create(payment: PaymentCreate): Observable<Payment> {
    return defer(() => axios.post<{ data: Payment }>(this.url, payment))
      .pipe(map(response => response.data.data));
  }

  update(id: number, payment: PaymentCreate): Observable<Payment> {
    return defer(() => axios.patch<{ data: Payment }>(this.url + '/' + id, payment))
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