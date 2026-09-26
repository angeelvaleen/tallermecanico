import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Vehicle {
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

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {

  vehicles: Vehicle[] = [];

  constructor(
    private modalController: ModalController,
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  async loadVehicles(): Promise<void> {

    try {

      const response = await axios.get<{ data: Vehicle[] }>(
        `${environment.apiUrl}/vehicles`
      );

      this.vehicles = response.data.data;

    } catch (error) {

      console.log(
        'Error al cargar vehículos',
        error
      );
    }
  }

  async createVehicle(): Promise<void> {

    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadVehicles();
    }
  }

  async editVehicle(id: number): Promise<void> {

    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: {
        id,
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadVehicles();
    }
  }
}