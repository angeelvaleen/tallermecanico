import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
  created_at: string;
}

@Component({
  selector: 'app-evidence-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  evidences: Evidence[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerEvidences();
  }

  async chargerEvidences(): Promise<void> {
    try {
      const response = await axios.get<{ data: Evidence[] }>(
        `${environment.apiUrl}/evidence`
      );
      this.evidences = response.data.data;
    } catch (error) {
      console.log('Error al cargar evidencias', error);
    }
  }

  async createEvidence(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerEvidences();
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
      await this.chargerEvidences();
    }
  }
}
