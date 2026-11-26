
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { Quote } from '../quotes/quotes';
import { Method } from '../methods/methods';
import { AuthService,User } from '../auth/auth';

export interface Payment {
  id: number;
  quote_id: number;
  user_id: string;
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
  user_id: User;
}

export interface PaymentCreate {
  quote_id: number;
  user_id: string;
  method_id:number;
  amount: number;
  reference: string;
  paid_at:string;
}



@Injectable({ providedIn: 'root' })
export class PaymentServices {
  private url = environment.apiUrl + '/payment';

  constructor(private authService: AuthService) {}

  private getAuthConfig() {
    const token = this.authService.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private filterObject(search: string): object | null {
    const text = search.trim();
    return text ? { _or: [
      { reference: { _icontains: text } },
    ] } : null;
  }

  private filter(search: string): Record<string, string> {
    const searchFilter = this.filterObject(search);

    return searchFilter ? { filter: JSON.stringify(searchFilter) } : {};
  }

  // El filtro de rol y el de búsqueda deben viajar en un único parámetro
  // `filter`: Directus descarta la búsqueda si se envía además por query string.
  private scopedFilter(base: object, search: string): Record<string, string> {
    const searchFilter = this.filterObject(search);

    return {
      filter: JSON.stringify(
        searchFilter ? { _and: [base, searchFilter] } : base,
      ),
    };
  }

  list(page = 1, perPage = 3, search = ''): Observable<Payment[]> {
    return defer(() => axios.get<{ data: Payment[] }>(this.url, {
      ...this.getAuthConfig(),params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Payment[]> {
    return defer(() => axios.get<{ data: Payment[] }>(this.url,this.getAuthConfig())).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<PaymentDetail> {
    return defer(() => axios.get<{ data: PaymentDetail }>(`${environment.apiUrl}/payment/${id}?fields=*,quote_id.*,method_id.*,user_id.*`,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  create(payment: PaymentCreate): Observable<Payment> {
    return defer(() => axios.post<{ data: Payment }>(this.url, payment,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  update(id: number, payment: PaymentCreate): Observable<Payment> {
    return defer(() => axios.patch<{ data: Payment }>(this.url + '/' + id, payment,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + '/' + id,this.getAuthConfig())).pipe(map(() => undefined));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {
      ...this.getAuthConfig()
      ,params: { 'aggregate[count]': '*', ...this.filter(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }

  private scopedTotal(base: object, search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {
      ...this.getAuthConfig(),
      params: { 'aggregate[count]': '*', ...this.scopedFilter(base, search) },
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }

  totalMy(search = ''): Observable<number> {
    return this.scopedTotal(
      { user_id: { id: { _eq: this.authService.getID() } } },
      search,
    );
  }

  getMyPayments(
      page = 1,
      perPage = 3,
      search = "",
    ): Observable<Payment[]> {
      return defer(() =>
        axios.get<{ data: Payment[] }>(this.url, {
          ...this.getAuthConfig(),
          params: {
            page: page,
            limit: perPage,
            sort: ["-paid_at"],
            ...this.scopedFilter(
              { user_id: { id: { _eq: this.authService.getID() } } },
              search,
            ),
          },
        }),
      ).pipe(map((response) => response.data.data));
    }
}