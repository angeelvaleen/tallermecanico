import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-vehicles-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {

  vehicle: Vehicle | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerVehicleById(id);
    }
  }

  async chargerVehicleById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Vehicle }>(
        `${environment.apiUrl}/vehicles/${id}`
      );
      this.vehicle = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle del vehiculo', error);
    }
  }

}