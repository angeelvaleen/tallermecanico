import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';


export interface SavingQuotePart {
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

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { plate: { _icontains: text } },
      { vin: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<QuotePart[]> {
    return defer(() => axios.get<{ data: QuotePart[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  ofQuote(id: number): Observable<QuotePart[]> {
      return defer(() =>
        axios.get<{ data: QuotePart[] }>(
          `${this.url}?filter[quote_id][_eq]=${id}&fields=*,part_id.*`,
        ),
      ).pipe(map((response) => response.data.data));
    }

  detail(id: number): Observable<QuotePart> {
    return defer(() => axios.get<{ data: QuotePart }>(this.url + '/' + id))
      .pipe(map(response => response.data.data));
  }

  create(quotepart: SavingQuotePart): Observable<QuotePart> {
    return defer(() => axios.post<{ data: QuotePart }>(this.url, quotepart))
      .pipe(map(response => response.data.data));
  }

  update(id: number, quotepart: SavingQuotePart): Observable<QuotePart> {
    return defer(() => axios.patch<{ data: QuotePart }>(this.url + '/' + id, quotepart))
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

  toggle(id:number, option:Number): Observable<void> {
    return defer(() =>
      axios.patch(`${environment.apiUrl}/quoteparts/${id}`, {
        is_approved: option,
      }),
    ).pipe(map(() => undefined));
  }
}