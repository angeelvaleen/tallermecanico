import { Injectable } from "@angular/core";
import { defer, map, Observable } from "rxjs";
import axios from "axios";
import { environment } from "src/environments/environment";

export interface SavingQuoteItem {
  quote_id: number;
  service_id: number;
  price: number;
  discount: number;
  amount: number;
  is_approved: boolean;
}

export interface QuoteItem {
  id: number;
  service_id: any;
  price: number;
  discount: number;
  amount: number;
  is_approved: number;
}

@Injectable({ providedIn: "root" })
export class QuoteitemServices {
  private url = environment.apiUrl + "/quoteitems";

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text
      ? {
          filter: JSON.stringify({
            _or: [
              { plate: { _icontains: text } },
              { vin: { _icontains: text } },
            ],
          }),
        }
      : {};
  }

  list(page = 1, perPage = 3, search = ""): Observable<QuoteItem[]> {
    return defer(() =>
      axios.get<{ data: QuoteItem[] }>(this.url, {
        params: {
          page: page,
          limit: perPage,
          sort: "id",
          ...this.filter(search),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }

  ofQuote(id: number): Observable<QuoteItem[]> {
    return defer(() =>
      axios.get<{ data: QuoteItem[] }>(
        `${this.url}?filter[quote_id][_eq]=${id}&fields=*,service_id.*`,
      ),
    ).pipe(map((response) => response.data.data));
  }

  detail(id: number): Observable<QuoteItem> {
    return defer(() =>
      axios.get<{ data: QuoteItem }>(this.url + "/" + id),
    ).pipe(map((response) => response.data.data));
  }

  create(quoteitem: SavingQuoteItem): Observable<QuoteItem> {
    return defer(() =>
      axios.post<{ data: QuoteItem }>(this.url, quoteitem),
    ).pipe(map((response) => response.data.data));
  }

  update(id: number, quoteitem: SavingQuoteItem): Observable<QuoteItem> {
    return defer(() =>
      axios.patch<{ data: QuoteItem }>(this.url + "/" + id, quoteitem),
    ).pipe(map((response) => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + "/" + id)).pipe(
      map(() => undefined),
    );
  }

  total(search = ""): Observable<number> {
    return defer(() =>
      axios.get<{ data: { count: string | number }[] }>(this.url, {
        params: { "aggregate[count]": "*", ...this.filter(search) },
      }),
    ).pipe(map((response) => Number(response.data.data[0]?.count ?? 0)));
  }

  toggle(id: number, option: Number): Observable<void> {
    return defer(() =>
      axios.patch(`${environment.apiUrl}/quoteitems/${id}`, {
        is_approved: option,
      }),
    ).pipe(map(() => undefined));
  }
}
