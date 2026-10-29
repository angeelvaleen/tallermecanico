import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Service, ServiceServices } from 'src/app/services/services/services';

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
    private serviceServices: ServiceServices,
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
      this.service = await firstValueFrom(this.serviceServices.detail(Number(id)));
    } catch (error) {
      console.error('Error al cargar el detalle del servicio:', error);

      this.messageError =
        'No se pudo cargar el servicio. Revisa el ID, la conexión y los permisos de Directus.';
    } finally {
      await loading.dismiss();
    }
  }
}