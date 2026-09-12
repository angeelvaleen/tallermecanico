import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-vehicles-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {

  vehicleId: string | null = null;

  vehicle = {
    user_id: 1,
    model_id: 1,
    fuel_id: 1,
    color_id: 1,
    year: '',
    plate: '',
    vin: '',
    mileage: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (this.vehicleId) {
      this.chargerData(this.vehicleId);
    }
  }

  async chargerData(id: string) {
    try {
      const response = await axios.get(`${environment.apiUrl}/items/vehicles/${id}`);
      this.vehicle = response.data.data;
    } catch (error) {
      console.log('Error al obtener datos', error);
    }
  }

  async guardar() {
    try {
      if (this.vehicleId) {
        await axios.patch(`${environment.apiUrl}/items/vehicles/${this.vehicleId}`, this.vehicle);
      } else {
        await axios.post(`${environment.apiUrl}/items/vehicles`, this.vehicle);
      }
      this.router.navigate(['/vehicles/list']);
    } catch (error) {
      console.log('Error al guardar', error);
    }
  }

}