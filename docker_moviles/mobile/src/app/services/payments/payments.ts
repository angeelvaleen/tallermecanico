
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Payment {
  id: number;
  quote_id: number;
  user_id: number;
  method_id:number;
  amount: number;
  reference: string;
  paid_at:string;
}

interface SavingPayment {
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

  detail(id: number): Observable<Payment> {
    return defer(() => axios.get<{ data: Payment }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(payment: SavingPayment): Observable<Payment> {
    return defer(() => axios.post<{ data: Payment }>(this.url, payment))
      .pipe(map(response => response.data.data));
  }

  update(id: number, payment: SavingPayment): Observable<Payment> {
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