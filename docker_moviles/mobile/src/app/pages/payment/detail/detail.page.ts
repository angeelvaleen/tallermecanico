import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Payment {
  id: number;
  quote_id: number;
  method_id: number;
  status_id: number;
  amount: number;
  reference: string;
  paid_at: string;
}

@Component({
  selector: 'app-payment-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  payment: Payment | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerPaymentById(id);
    }
  }

  async chargerPaymentById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Payment }>(
        `${environment.apiUrl}/items/payment/${id}`
      );
      this.payment = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de pago', error);
    }
  }
}