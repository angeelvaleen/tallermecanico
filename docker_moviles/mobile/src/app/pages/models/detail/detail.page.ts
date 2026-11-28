import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Brand, BrandServices } from 'src/app/services/brands/brands';
import { Model, ModelServices } from 'src/app/services/models/models';

@Component({
  selector: 'app-models-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  model: Model | null = null;
  brand: Brand | null = null;

  messageError: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private modelServices: ModelServices,
    private brandServices: BrandServices,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadModel();
  }

  async loadModel(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    this.model = null;
    this.brand = null;
    this.messageError = '';

    if (!id) {
      this.messageError = 'No se proporcionó ID.';
      return;
    }

    const loading = await this.loading.create({
      message: 'Cargando modelo...',
      spinner: 'bubbles',
    });

    await loading.present();

    try {
      this.model = await firstValueFrom(this.modelServices.detail(Number(id)));

      await this.loadBrand(this.model.brand_id);
    } catch (error) {
      console.error('Error al cargar el modelo:', error);

      this.messageError =
        'No se pudo cargar el modelo. Revisa el ID, la conexión y los permisos de Directus.';
    } finally {
      await loading.dismiss();
    }
  }

  private async loadBrand(brandId: number): Promise<void> {
    try {
      this.brand = await firstValueFrom(this.brandServices.detail(brandId));
    } catch (error) {
      console.error('Error al cargar la marca:', error);
    }
  }
}
