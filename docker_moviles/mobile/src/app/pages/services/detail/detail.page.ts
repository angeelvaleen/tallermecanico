import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-services-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  service: Service | null = null;
  messageError:string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerService();
  }

  async chargerService(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageError='No se proporciono ID';
      return;
    }

    const loading = await this.loading.create({
      message:"Cargando servicio...",
      spinner:"crescent",
    })

    await loading.present();

    try {
      const response = await axios.get<{ data: Service }>(
        `${environment.apiUrl}/services/${encodeURIComponent(id)}`
      );
      this.service = response.data.data;
    } catch (error) {
      this.messageError='Revisar id, conexion a base de datos o permisos';
      console.log('Error al cargar detalle de servicio', error);
    }finally{
      await loading.dismiss();
    }
  }

  abrirPagina(): void {
    if (!this.service) {
      return;
    }
    const url = `${environment.apiUrl}/services/${this.service.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}