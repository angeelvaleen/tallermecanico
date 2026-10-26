import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FuelServices } from 'src/app/services/fuels/fuels';
import { firstValueFrom } from 'rxjs';
import { FormPage } from '../form/form.page';

interface Fuel {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-fuels-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  fuels: Fuel[] = [];

  constructor(
    private modalController: ModalController,
    private fuelServices: FuelServices,
  ) {}

  ngOnInit(): void {
    this.loadFuels();
  }

  async loadFuels(): Promise<void> {
    try {
      

      this.fuels = await firstValueFrom(this.fuelServices.listWithOutFilters());
    } catch (error) {
      console.error('Error al cargar combustibles:', error);
    }
  }

  async createFuel(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadFuels();
    }
  }

  async editFuel(id: number): Promise<void> {
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
      await this.loadFuels();
    }
  }
}