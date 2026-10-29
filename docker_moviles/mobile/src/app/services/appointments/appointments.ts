import { Injectable } from "@angular/core";
import { defer, map, Observable } from "rxjs";
import axios from "axios";
import { environment } from "src/environments/environment";
import { Vehicle } from "../vehicles/vehicles";

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

  private filter(search: string): Record<string, string> {
    const text = search.trim();

    return text
      ? {
          filter: JSON.stringify({
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
                    name: {
                      _icontains: text,
                    },
                  },
                },
              },
            ],
          }),
        }
      : {};
  }

  list(page = 1, perPage = 3, search = ""): Observable<Appointment[]> {
    return defer(() =>
      axios.get<{ data: Appointment[] }>(this.url, {
        params: {
          page: page,
          limit: perPage,
          sort: "id",
          ...this.filter(search),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }

  detail(id: number): Observable<DetailAppointment> {
    return defer(() => axios.get<{ data: DetailAppointment }>(`${this.url}/${id}?fields=*,vehicle_id.*`)).pipe(
      map((response) => response.data.data),
    );
  }

  create(appointment: AppointmentCreate): Observable<Appointment> {
    return defer(() => axios.post<{ data: Appointment }>(this.url, appointment)).pipe(
      map((response) => response.data.data),
    );
  }

  update(id: number, appointment: AppointmentCreate): Observable<Appointment> {
    return defer(() =>
      axios.patch<{ data: Appointment }>(this.url + "/" + id, appointment),
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

  executeCancelAppointment(id:number): Observable<void>{
    return defer(()=> axios.patch(`${this.url}/${id}`,{
      status_id:3,
    })).pipe(
      map(() => undefined),
    );
  }
}
