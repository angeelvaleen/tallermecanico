import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active:boolean;
  created_at:string;
}

@Component({
  selector: 'app-services-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  services: Service[] = [];

  constructor(
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.chargerServices();
  }

  async chargerServices(): Promise<void> {
    try {
      const response = await axios.get<{ data: Service[] }>(
        `${environment.apiUrl}/services`
      );
      this.services = response.data.data;
    } catch (error) {
      console.log('Error al cargar servicios', error);
    }
  }

  async createService(): Promise<void> {
      const modal = await this.modalController.create({
        component: FormPage,
        breakpoints: [0, 0.5, 0.95],
        initialBreakpoint: 0.95,
      });
  
      await modal.present();
  
      const { data } = await modal.onDidDismiss();
  
      if (data?.saved) {
        await this.chargerServices();
      }
    }

  async abrirEditarModal(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: { id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerServices();
    }
  }
}