import { Injectable } from "@angular/core";
import { defer, map, Observable } from "rxjs";
import axios from "axios";
import { environment } from "src/environments/environment";
import { Vehicle } from "../vehicles/vehicles";
import { AuthService } from "../auth/auth";

export interface Appointment {
  id: number;
  vehicle_id: number;
  status_id: number;
  date: string;
  time: string;
  reason: string;
  created_at: string;
}

export interface DetailAppointment {
  id: number;
  vehicle_id: Vehicle;
  status_id: number;
  date: string;
  time: string;
  reason: string;
  created_at: string;
}

export interface AppointmentCreate {
  vehicle_id: number;
  status_id: number;
  date: string;
  time: string;
  reason: string;
}

@Injectable({ providedIn: "root" })
export class AppointmentServices {
  private url = environment.apiUrl + "/appointments";

  constructor(private authService:AuthService){}
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
    { id: 1, names: ["pendiente", "pending"] },
    { id: 2, names: ["confirmada", "confirmado", "confirmed"] },
    { id: 3, names: ["cancelada", "cancelado", "cancelled"] },
  ];

  private statusConditions(text: string): object[] {
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return AppointmentServices.STATUS_ALIASES.filter((status) =>
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
                  plate: {
                    _icontains: text,
                  },
                },
              },
              {
                vehicle_id: {
                  vin: {
                    _icontains: text,
                  },
                },
              },
              {
                vehicle_id: {
                  user_id: {
                    first_name: {
                      _icontains: text,
                    },
                  },
                },
              },
              {
                vehicle_id: {
                  user_id: {
                    last_name: {
                      _icontains: text,
                    },
                  },
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

  list(page = 1, perPage = 3, search = ""): Observable<Appointment[]> {
    return defer(() =>
      axios.get<{ data: Appointment[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: ["-status_id","-created_at"],
          ...this.filter(search),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }

  get(id: number): Observable<Appointment> {
    return defer(() =>
      axios.get<{ data: Appointment }>(this.url + "/" + id,this.getAuthConfig()),
    ).pipe(map((response) => response.data.data));
  }

  detail(id: number): Observable<DetailAppointment> {
    return defer(() => axios.get<{ data: DetailAppointment }>(`${this.url}/${id}?fields=*,vehicle_id.*`,this.getAuthConfig())).pipe(
      map((response) => response.data.data),
    );
  }

  create(appointment: AppointmentCreate): Observable<Appointment> {
    return defer(() => axios.post<{ data: Appointment }>(this.url, appointment,this.getAuthConfig())).pipe(
      map((response) => response.data.data),
    );
  }

  update(id: number, appointment: AppointmentCreate): Observable<Appointment> {
    return defer(() =>
      axios.patch<{ data: Appointment }>(this.url + "/" + id, appointment,this.getAuthConfig()),
    ).pipe(map((response) => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + "/" + id,this.getAuthConfig())).pipe(
      map(() => undefined),
    );
  }

  total(search = ""): Observable<number> {
    return defer(() =>
      axios.get<{ data: { count: string | number }[] }>(this.url, {...this.getAuthConfig(),
        params: { "aggregate[count]": "*", ...this.filter(search) },
      }),
    ).pipe(map((response) => Number(response.data.data[0]?.count ?? 0)));
  }

  executeCancelAppointment(id:number): Observable<void>{
    return defer(()=> axios.patch(`${this.url}/${id}`,{
      status_id:3,
    },this.getAuthConfig())).pipe(
      map(() => undefined),
    );
  }

  acceptedAppointment(id:number): Observable<void>{
    return defer(()=> axios.patch(`${this.url}/${id}`,{
      status_id:2,
    },this.getAuthConfig())).pipe(
      map(() => undefined),
    );
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

  getMyAppointments(page = 1, perPage = 3, search = ""): Observable<Appointment[]> {
    return defer(() =>
      axios.get<{ data: Appointment[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: ["-status_id","-created_at"],
          ...this.scopedFilter(
            { vehicle_id: { user_id: { id: { _eq: this.authService.getID() } } } },
            search,
          ),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }

  getAppointmentActive(page = 1, perPage = 3, search = ""):Observable<Appointment[]>{
    return defer(() =>
      axios.get<{ data: Appointment[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: ["-created_at"],
          ...this.scopedFilter({ status_id: { id: { _eq: 2 } } }, search),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }
}
