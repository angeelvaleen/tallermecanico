import { Injectable } from "@angular/core";
import { defer, map, Observable } from "rxjs";
import axios from "axios";
import { environment } from "src/environments/environment";

import { QuoteItem } from "../quoteitems/quoteitems";
import { QuotePart } from "../quoteparts/quoteparts";
import { Workorder } from "../workorders/workorders";
import { AuthService } from "../auth/auth";



interface Status {
  id: number;
  name: string;
}

export interface Quote {
  id: number;
  workorder_id: number;
  user_id: number;
  status_id: number;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
  created_at: string;
}

export interface  QuoteDetail {
  id: number;
  workorder_id: Workorder;
  user_id: number;
  status_id: Status;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
  created_at: string;
  quoteitems: QuoteItem[];
  quoteparts: QuotePart[];
}

export interface QuoteWorkorder {
  id: number;
  workorder_id: number;
  user_id: number;
  status_id: Status;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
  created_at: string;
}

export interface QuoteCreate {
  workorder_id: number;
  user_id: string;
  status_id: number;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
}

@Injectable({ providedIn: "root" })
export class QuoteServices {
  private url = environment.apiUrl + "/quotes";

  constructor(private authService: AuthService) {}

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
    return text
      ? { filter: JSON.stringify({ _or: [{ workorder_id: { _eq: text } }] }) }
      : {};
  }

  list(page = 1, perPage = 3, search = ""): Observable<Quote[]> {
    return defer(() =>
      axios.get<{ data: Quote[] }>(this.url,{
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: "id",
          ...this.filter(search),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }

  detail(id: number): Observable<QuoteDetail> {
    return defer(() =>
      axios.get<{ data: QuoteDetail }>(`${this.url}/${id}?fields=*,workorder_id.*,status_id.*`, this.getAuthConfig()),
    ).pipe(map((response) => response.data.data));
  }

  create(quote: QuoteCreate): Observable<Quote> {
    return defer(() => axios.post<{ data: Quote }>(this.url, quote, this.getAuthConfig())).pipe(
      map((response) => response.data.data),
    );
  }

  update(id: number, quote: QuoteCreate): Observable<Quote> {
    return defer(() =>
      axios.patch<{ data: Quote }>(this.url + "/" + id, quote, this.getAuthConfig()),
    ).pipe(map((response) => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + "/" + id, this.getAuthConfig())).pipe(
      map(() => undefined),
    );
  }

  total(search = ""): Observable<number> {
    return defer(() =>
      axios.get<{ data: { count: string | number }[] }>(this.url, {
        ...this.getAuthConfig(),
        params: { "aggregate[count]": "*", ...this.filter(search) },
      }),
    ).pipe(map((response) => Number(response.data.data[0]?.count ?? 0)));
  }

  reject(id: number): Observable<void> {
    return defer(() =>
      axios.patch(`${environment.apiUrl}/quotes/${id}`, {
        status_id: 11,
      }, this.getAuthConfig()),
    ).pipe(map(() => undefined));
  }

  approve(id:number): Observable<void>{
    return defer(() =>
      axios.patch(`${environment.apiUrl}/quotes/${id}`, {
        status_id: 10,
      }, this.getAuthConfig()),
    ).pipe(map(() => undefined));
  }


  recalculate(id:number, subtotal: Number, tax: Number, total: Number): Observable<void>{
    return defer(() =>
      axios.patch(
        `${environment.apiUrl}/quotes/${id}`,
        {
          subtotal: subtotal,
          tax: tax,
          total: total,
        }, this.getAuthConfig()),
    ).pipe(map(() => undefined));
  } 

  ofWorkorder(id:number): Observable<QuoteWorkorder[]>{
      return defer(() => axios.get<{ data: QuoteWorkorder[] }>(`${this.url}?filter[workorder_id][_eq]=${id}&fields=*,status_id.*`, this.getAuthConfig()))
        .pipe(map(response => response.data.data));
    }
}
