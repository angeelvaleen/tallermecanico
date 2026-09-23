import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

interface Payment {
  id: number;
  quote_id: number;
  status_id: number;
  method_id:number;
  amount: number;
  reference: string;
  paid_at:string;
}

@Component({
  selector: 'app-payment-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  payments: Payment[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerPayments();
  }

  async chargerPayments(): Promise<void> {
    try {
      const response = await axios.get<{ data: Payment[] }>(
        `${environment.apiUrl}/payment`
      );
      this.payments = response.data.data;
    } catch (error) {
      console.log('Error al cargar pagos', error);
    }
  }

  async createPayment(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerPayments();
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
      await this.chargerPayments();
    }
  }
}
