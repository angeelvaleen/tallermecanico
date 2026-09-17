import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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
  messageError:string="";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerPayment();
  }

  async chargerPayment(): Promise<void> {
     const id = this.route.snapshot.paramMap.get('id');
    
     if(!id) {
      this.messageError="No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
      message:"Cargando pago...",
      spinner:"crescent",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Payment }>(
        `${environment.apiUrl}/payment/${encodeURIComponent(id)}`
      );
      this.payment = response.data.data;
    } catch (error) {
      this.messageError="Revisar id, conexion a base de datos o permisos";
      console.log('Error al cargar detalle de pago', error);
    }finally{
      await loading.dismiss();
    }
  }

  abrirPagina(): void {
    if (!this.payment) {
      return;
    }
    const url = `${environment.apiUrl}/payment/${this.payment.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}