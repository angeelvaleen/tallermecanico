import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Model {
  id: number;
  brand_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-models-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  models: Model[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerModels();
  }

  async chargerModels(): Promise<void> {
    try {
      const response = await axios.get<{ data: Model[] }>(
        `${environment.apiUrl}/models`
      );
      this.models = response.data.data;
    } catch (error) {
      console.log('Error al cargar modelos', error);
    }
  }

  async createModel(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerModels();
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
      await this.chargerModels();
    }
  }
}
