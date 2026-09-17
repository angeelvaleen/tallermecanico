import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

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
  messageError:string="";

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
      this.messageError='No se proporciono id';
      return;
    }

    const loading = await this.loading.create({
      message:"Cargando couta...",
      spinner:"crescent"
    })

    await loading.present();

    try {
      const response = await axios.get<{ data: Quote }>(
        `${environment.apiUrl}/quotes/${encodeURIComponent(id)}`
      );
      this.quote = response.data.data;
    } catch (error) {
      this.messageError="Revisar id, conexion a base de datos o permisos";
      console.log('Error al cargar detalle de cotizacion', error);
    }finally{
      await loading.dismiss();
    }
  }

  abrirPagina(): void {
    if (!this.quote) {
      return;
    }
    const url = `${environment.apiUrl}/quotes/${this.quote.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}