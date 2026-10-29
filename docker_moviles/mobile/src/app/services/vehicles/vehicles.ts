import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { ModelList } from '../models/models';
import { Brand } from '../brands/brands';
import { Fuel } from '../fuels/fuels';
import { Color } from '../colors/colors';

interface User {
  name:string;
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
  user_id: User ;
  fuel_id: Fuel;
  color_id: Color;
  
}

export interface SavingVehicle {
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

@Injectable({ providedIn: 'root' })
export class VehicleServices {
  private url = environment.apiUrl + '/vehicles';

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { plate: { _icontains: text } },
      { vin: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Vehicle[]> {
    return defer(() => axios.get<{ data: Vehicle[] }>(this.url, {
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<VehicleDetail> {
    return defer(() => axios.get<{ data: VehicleDetail }>(`${this.url}/${id}?fields=*,color_id.*,fuel_id.*,user_id.*,model_id.*,model_id.brand_id.*`))
      .pipe(map(response => response.data.data));
  }

  create(vehicle: SavingVehicle): Observable<Vehicle> {
    return defer(() => axios.post<{ data: Vehicle }>(this.url, vehicle))
      .pipe(map(response => response.data.data));
  }

  update(id: number, vehicle: SavingVehicle): Observable<Vehicle> {
    return defer(() => axios.patch<{ data: Vehicle }>(this.url + '/' + id, vehicle))
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
}