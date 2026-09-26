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
  messageError: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadService();
  }

  async loadService(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    this.service = null;
    this.messageError = '';

    if (!id) {
      this.messageError = 'No se proporcionó ID.';
      return;
    }

    const loading = await this.loading.create({
      message: 'Cargando servicio...',
      spinner: 'crescent',
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Service }>(
        `${environment.apiUrl}/services/${encodeURIComponent(id)}`,
      );

      this.service = response.data.data;
    } catch (error) {
      console.error('Error al cargar el detalle del servicio:', error);

      this.messageError =
        'No se pudo cargar el servicio. Revisa el ID, la conexión y los permisos de Directus.';
    } finally {
      await loading.dismiss();
    }
  }
}