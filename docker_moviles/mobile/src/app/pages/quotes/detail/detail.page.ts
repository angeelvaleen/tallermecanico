import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface Quote {
  id: number;
  workorder_id: number;
  user_id: number;
  status_id: number;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
  created_at: string;
}

@Component({
  selector: 'app-quotes-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  quote: Quote | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerQuoteById(id);
    }
  }

  async chargerQuoteById(id: string): Promise<void> {
    try {
      const response = await axios.get<{ data: Quote }>(
        `${environment.apiUrl}/items/quotes/${id}`
      );
      this.quote = response.data.data;
    } catch (error) {
      console.log('Error al cargar detalle de cotizacion', error);
    }
  }
}