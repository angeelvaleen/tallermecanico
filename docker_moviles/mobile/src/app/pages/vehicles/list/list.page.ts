import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Vehicle {
  id: number;
  model_id: number;
  user_id: number;
  fuel_id: number;
  color_id: number;
  plate: string;
  vin: string;
  year: string;
  mileage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
@Component({
  selector: 'app-vehicles-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {

  vehicles: Vehicle[] = [];

  constructor() { }

  ngOnInit() {
    this.chargerVehicles();
  }

  async chargerVehicles(): Promise<void> {
    try {
      const response = await axios.get<{ data: Vehicle[] }>(
        `${environment.apiUrl}/vehicles`
      );
      this.vehicles = response.data.data;
    } catch (error) {
      console.log('Error al cargar vehiculos', error);
    }
  }

}