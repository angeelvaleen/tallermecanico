import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Method {
  id: number;
  name: string;
  is_active: boolean;
  created_at:string;
}

@Component({
  selector: 'app-methods-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  methods: Method[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerMethods();
  }

  async chargerMethods(): Promise<void> {
    try {
      const response = await axios.get<{ data: Method[] }>(
        `${environment.apiUrl}/methods`
      );
      this.methods = response.data.data;
    } catch (error) {
      console.log('Error al cargar metodos', error);
    }
  }

  async createMethod(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerMethods();
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
      await this.chargerMethods();
    }
  }
}
