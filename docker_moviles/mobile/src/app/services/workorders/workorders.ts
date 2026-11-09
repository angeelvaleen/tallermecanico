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

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text
      ? {
          filter: JSON.stringify({
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
                  name: { _icontains: text },
                },
              },
              {
                status_id: {
                  name: { _icontains: text },
                },
              },
            ],
          }),
        }
      : {};
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

  getMyWorkOrders(
    page = 1,
    perPage = 3,
    search = "",
  ): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(
        `${this.url}?filter[vehicle_id][user_id][id][_eq]=${this.authService.getID()}`,
        {
          ...this.getAuthConfig(),
          params: {
            page: page,
            limit: perPage,
            sort: ["-status_id", "-created_at"],
            ...this.filter(search),
          },
        },
      ),
    ).pipe(map((response) => response.data.data));
  }

  getWorkOrdersMechanic(
    page = 1,
    perPage = 3,
    search = "",
  ): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(
        `${this.url}?filter[mechanic_id][id][_eq]=${this.authService.getID()}`,
        {
          ...this.getAuthConfig(),
          params: {
            page: page,
            limit: perPage,
            sort: ["-status_id", "-created_at"],
            ...this.filter(search),
          },
        },
      ),
    ).pipe(map((response) => response.data.data));
  }


  getWorkOrdersInProgress(
    page = 1,
    perPage = 3,
    search = "",
  ): Observable<Workorder[]> {
    return defer(() =>
      axios.get<{ data: Workorder[] }>(
        `${this.url}?filter[status_id][id][_in]=4,5,6`,
        {
          ...this.getAuthConfig(),
          params: {
            page: page,
            limit: perPage,
            sort: ["-created_at"],
            ...this.filter(search),
          },
        },
      ),
    ).pipe(map((response) => response.data.data));
  }
}
