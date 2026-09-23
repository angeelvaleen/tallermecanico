import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Brand {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-brands-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {

  brands: Brand[] = [];
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerBrands();
  }

  async chargerBrands():Promise<void> {
    try {
      const response = await axios.get<{ data: Brand[] }>(
        `${environment.apiUrl}/brands`
      );


      this.brands = response.data.data;
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  }

  async abrirEditarModal(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: { id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerBrands();
    }
  }

  async createBrand(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerBrands();
    }
  }

}