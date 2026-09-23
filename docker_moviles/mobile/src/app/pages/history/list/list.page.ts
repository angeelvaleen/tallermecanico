import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface History {
  id: number;
  vehicle_id: number;
  workorder_id: number;
  created_at: string;
}

@Component({
  selector: 'app-history-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  history: History[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerHistory();
  }

  async chargerHistory(): Promise<void> {
    try {
      const response = await axios.get<{ data: History[] }>(
        `${environment.apiUrl}/history`
      );
      this.history = response.data.data;
    } catch (error) {
      console.log('Error al cargar historial', error);
    }
  }

  async createHistory(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerHistory();
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
      await this.chargerHistory();
    }
  }
}
