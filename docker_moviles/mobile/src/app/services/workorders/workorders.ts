import { Injectable } from "@angular/core";
import { defer, map, Observable } from "rxjs";
import axios from "axios";
import { environment } from "src/environments/environment";

import { Vehicle } from "../vehicles/vehicles";
import { User, AuthService } from "../auth/auth";

interface Status {
  id: number;
  name: string;
}

export interface Workorder {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string | null;
  created_at: string;
}

export interface WorkorderDetail {
  id: number;
  vehicle_id: Vehicle;
  mechanic_id: User;
  status_id: Status;
  mileage: number;
  delivery: string | null;
  created_at: string;
}

export interface WorkorderCreate {
  vehicle_id: number;
  mechanic_id: string;
  status_id: number;
  mileage: number;
  delivery: string | null;
}

@Injectable({ providedIn: "root" })
export class WorkorderServices {
  private url = environment.apiUrl + "/workorders";

  constructor(private authService: AuthService) {}

  private getAuthConfig() {
    const token = this.authService.getAccessToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Los estados se guardan en inglés en la BD pero se muestran en español.
  private static readonly STATUS_ALIASES: { id: number; names: string[] }[] = [
    { id: 4, names: ["recibida", "recibido", "received"] },
    { id: 5, names: ["diagnostico", "diagnóstico", "diagnosis"] },
    { id: 6, names: ["reparacion", "reparación", "repair"] },
    { id: 7, names: ["lista", "listo", "ready"] },
    { id: 8, names: ["entregada", "entregado", "delivered"] },
  ];

  private statusConditions(text: string): object[] {
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return WorkorderServices.STATUS_ALIASES.filter((status) =>
      status.names.some(
        (name) =>
          name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
          normalized,
      ),
    ).map((status) => ({ status_id: { id: { _eq: status.id } } }));
  }

  private filterObject(search: string): object | null {
    const text = search.trim();
    return text
      ? {
          _or: [
              {
                vehicle_id: {
                  plate: { _icontains: text },
                },
              },
              {
                vehicle_id: {
                  vin: { _icontains: text },
                },
              },
              {
                mechanic_id: {
                  first_name: { _icontains: text },
                },
              },
              {
                mechanic_id: {
                  last_name: { _icontains: text },
                },
              },
              {
                status_id: {
                  name: { _icontains: text },
                },
              },
              ...this.statusConditions(text),
            ],
          }
      : null;
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

  list(page = 1, perPage = 3, search = ""): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(this.url, {
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

  listWithOutFilter(): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(this.url, {
        ...this.getAuthConfig(),
        params: { sort: "id" },
      }),
    ).pipe(map((response) => response.data.data));
  }

  detail(id: number): Observable<WorkorderDetail> {
    return defer(() =>
      axios.get<{ data: WorkorderDetail }>(
        `${this.url}/${id}?fields=*,mechanic_id.id,mechanic_id.first_name,mechanic_id.last_name,status_id.name,status_id.id,vehicle_id.plate,vehicle_id.id`,
        this.getAuthConfig(),
      ),
    ).pipe(map((response) => response.data.data));
  }

  create(workorder: WorkorderCreate): Observable<Workorder> {
    return defer(() =>
      axios.post<{ data: Workorder }>(
        this.url,
        workorder,
        this.getAuthConfig(),
      ),
    ).pipe(map((response) => response.data.data));
  }

  update(id: number, workorder: WorkorderCreate): Observable<Workorder> {
    return defer(() =>
      axios.patch<{ data: Workorder }>(
        this.url + "/" + id,
        workorder,
        this.getAuthConfig(),
      ),
    ).pipe(map((response) => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() =>
      axios.delete(this.url + "/" + id, this.getAuthConfig()),
    ).pipe(map(() => undefined));
  }



  total(search = ""): Observable<number> {
    return defer(() =>
      axios.get<{ data: { count: string | number }[] }>(this.url, {
        ...this.getAuthConfig(),
        params: { "aggregate[count]": "*", ...this.filter(search) },
      }),
    ).pipe(map((response) => Number(response.data.data[0]?.count ?? 0)));
  }

  private scopedTotal(base: object, search = ""): Observable<number> {
    return defer(() =>
      axios.get<{ data: { count: string | number }[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          "aggregate[count]": "*",
          ...this.scopedFilter(base, search),
        },
      }),
    ).pipe(map((response) => Number(response.data.data[0]?.count ?? 0)));
  }

  totalMy(search = ""): Observable<number> {
    return this.scopedTotal(
      { vehicle_id: { user_id: { id: { _eq: this.authService.getID() } } } },
      search,
    );
  }

  totalMechanic(search = ""): Observable<number> {
    return this.scopedTotal(
      { mechanic_id: { id: { _eq: this.authService.getID() } } },
      search,
    );
  }

  totalInProgress(search = ""): Observable<number> {
    return this.scopedTotal({ status_id: { id: { _in: [4, 5, 6] } } }, search);
  }

  getMyWorkOrders(
    page = 1,
    perPage = 3,
    search = "",
  ): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: ["-status_id", "-created_at"],
          ...this.scopedFilter(
            { vehicle_id: { user_id: { id: { _eq: this.authService.getID() } } } },
            search,
          ),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }

  getWorkOrdersMechanic(
    page = 1,
    perPage = 3,
    search = "",
  ): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: ["-status_id", "-created_at"],
          ...this.scopedFilter(
            { mechanic_id: { id: { _eq: this.authService.getID() } } },
            search,
          ),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }


  getWorkOrdersInProgress(
    page = 1,
    perPage = 3,
    search = "",
  ): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: ["-created_at"],
          ...this.scopedFilter(
            { status_id: { id: { _in: [4, 5, 6] } } },
            search,
          ),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }
}
