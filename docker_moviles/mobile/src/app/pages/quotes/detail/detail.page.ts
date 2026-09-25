import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface QuoteService {
  id: number;
  service_id: any;
  price: number;
  discount: number;
  amount: number;
}

interface QuotePart {
  id: number;
  part_id: any;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
}

interface Quote {
  id: number;
  workorder_id: any;
  user_id: number;
  status_id: any;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
  created_at: string;
  quoteitems: QuoteService[];
  quoteparts: QuotePart[];
}

@Component({
  selector: 'app-quotes-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {

  quote: Quote | null = null;
  messageError: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerQuote();
  }

  async chargerQuote(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.messageError = 'No se proporciono id';
      return;
    }

    const loading = await this.loading.create({
      message: 'Cargando cotización...',
      spinner: 'crescent'
    });

    await loading.present();

    try {

      // Obtener cotización
      const quoteResponse = await axios.get<{ data: Quote }>(
        `${environment.apiUrl}/quotes/${encodeURIComponent(id)}?fields=*,workorder_id.*,status_id.*`
      );

      const quote = quoteResponse.data.data;

      // Obtener servicios de la cotización
      const itemsResponse = await axios.get<{ data: QuoteService[] }>(
        `${environment.apiUrl}/quoteitems?filter[quote_id][_eq]=${encodeURIComponent(id)}&fields=*,service_id.*`
      );

      // Obtener refacciones de la cotización
      const partsResponse = await axios.get<{ data: QuotePart[] }>(
        `${environment.apiUrl}/quoteparts?filter[quote_id][_eq]=${encodeURIComponent(id)}&fields=*,part_id.*`
      );

      quote.quoteitems = itemsResponse.data.data;
      quote.quoteparts = partsResponse.data.data;

      this.quote = quote;

      console.log('Cotización:', this.quote);

    } catch (error) {

      this.messageError =
        'Revisar id, conexion a base de datos o permisos';

      console.log(
        'Error al cargar detalle de cotizacion',
        error
      );

    } finally {

      await loading.dismiss();

    }
  }
}