import { Injectable } from "@angular/core";
import { defer, map, Observable } from "rxjs";
import axios from "axios";
import { environment } from "src/environments/environment";
import { ModelList } from "../models/models";
import { Brand } from "../brands/brands";
import { Fuel } from "../fuels/fuels";
import { Color } from "../colors/colors";
import { AuthService } from "../auth/auth";

interface User {
  name: string;
}

export interface Vehicle {
  id: number;
  model_id: number;
  user_id: number;
  fuel_id: number;
  color_id: number;
  plate: string;
  vin: string;
  year: number;
  mileage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleDetail {
  id: number;
  plate: string;
  vin: string;
  year: number;
  mileage: number;
  is_active: boolean;
  created_at: string;
  model_id: ModelList;
  user_id: User;
  fuel_id: Fuel;
  color_id: Color;
}

export interface VehicleCreate {
  model_id: number;
  user_id: string;
  fuel_id: number;
  color_id: number;
  plate: string;
  vin: string;
  year: number;
  mileage: number;
}

@Injectable({ providedIn: "root" })
export class VehicleServices {
  private url = environment.apiUrl + "/vehicles";

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
    return text
      ? {
          _or: [
            { plate: { _icontains: text } },
            { vin: { _icontains: text } },
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

  list(page = 1, perPage = 3, search = ""): Observable<Vehicle[]> {
    return defer(() =>
      axios.get<{ data: Vehicle[] }>(this.url, {
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

  listWithOutFilters(): Observable<Vehicle[]> {
    return defer(() =>
      axios.get<{ data: Vehicle[] }>(this.url, this.getAuthConfig()),
    ).pipe(map((response) => response.data.data));
  }

  detail(id: number): Observable<VehicleDetail> {
    return defer(() =>
      axios.get<{ data: VehicleDetail }>(
        `${this.url}/${id}?fields=*,color_id.*,fuel_id.*,user_id.*,model_id.*,model_id.brand_id.*`,
      this.getAuthConfig()),
    ).pipe(map((response) => response.data.data));
  }

  create(vehicle: VehicleCreate): Observable<Vehicle> {
    return defer(() =>
      axios.post<{ data: Vehicle }>(this.url, vehicle, this.getAuthConfig()),
    ).pipe(map((response) => response.data.data));
  }

  update(id: number, vehicle: VehicleCreate): Observable<Vehicle> {
    return defer(() =>
      axios.patch<{ data: Vehicle }>(
        this.url + "/" + id,
        vehicle,
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
      { user_id: { id: { _eq: this.authService.getID() } } },
      search,
    );
  }

  getMyVehicles(page = 1, perPage = 3, search = ""): Observable<Vehicle[]> {
    return defer(() =>
      axios.get<{ data: Vehicle[] }>(this.url, {
        ...this.getAuthConfig(),
        params: {
          page: page,
          limit: perPage,
          sort: "id",
          ...this.scopedFilter(
            { user_id: { id: { _eq: this.authService.getID() } } },
            search,
          ),
        },
      }),
    ).pipe(map((response) => response.data.data));
  }
}
