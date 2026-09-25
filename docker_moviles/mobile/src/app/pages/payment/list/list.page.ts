import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Payment {
  id: number;
  quote_id: number;
  user_id: number;
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

  constructor() {}

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
}