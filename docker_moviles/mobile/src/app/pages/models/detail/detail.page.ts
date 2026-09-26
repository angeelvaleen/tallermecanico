import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface Model {
  id: number;
  brand_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface Brand {
  id: number;
  name: string;
  is_active: boolean;
}

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
      const response = await axios.get<{ data: Model }>(
        `${environment.apiUrl}/models/${encodeURIComponent(id)}`,
      );

      this.model = response.data.data;

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
      const response = await axios.get<{ data: Brand }>(
        `${environment.apiUrl}/brands/${brandId}`,
      );

      this.brand = response.data.data;
    } catch (error) {
      console.error('Error al cargar la marca:', error);
    }
  }
}