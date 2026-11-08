import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth';


export interface QuotePartCreate {
  quote_id: number;
  part_id: number;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
  is_approved: boolean;
}

export interface QuotePart {
  id: number;
  part_id: any;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
  is_approved: number;
}

@Injectable({ providedIn: 'root' })
export class QuotepartServices {
  private url = environment.apiUrl + '/quoteparts';

  constructor(private authService: AuthService) { }

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { plate: { _icontains: text } },
      { vin: { _icontains: text } },
    ] }) } : {};
  }

  private getAuthConfig() {
    const token = this.authService.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  list(page = 1, perPage = 3, search = ''): Observable<QuotePart[]> {
    return defer(() => axios.get<{ data: QuotePart[] }>(this.url, {
      ...this.getAuthConfig(),
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  ofQuote(id: number): Observable<QuotePart[]> {
      return defer(() =>
        axios.get<{ data: QuotePart[] }>(
          `${this.url}?filter[quote_id][_eq]=${id}&fields=*,part_id.*`,
          this.getAuthConfig()
        ),
      ).pipe(map((response) => response.data.data));
    }

  detail(id: number): Observable<QuotePart> {
    return defer(() => axios.get<{ data: QuotePart }>(this.url + '/' + id, this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  create(quotepart: QuotePartCreate): Observable<QuotePart> {
    return defer(() => axios.post<{ data: QuotePart }>(this.url, quotepart, this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  update(id: number, quotepart: QuotePartCreate): Observable<QuotePart> {
    return defer(() => axios.patch<{ data: QuotePart }>(this.url + '/' + id, quotepart, this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + '/' + id, this.getAuthConfig())).pipe(map(() => undefined));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {
      ...this.getAuthConfig(),
      params: { 'aggregate[count]': '*', ...this.filter(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }

  toggle(id:number, option:Number): Observable<void> {
    return defer(() =>
      axios.patch(`${environment.apiUrl}/quoteparts/${id}`, {
        is_approved: option,
      }, this.getAuthConfig()),
    ).pipe(map(() => undefined));
  }
}