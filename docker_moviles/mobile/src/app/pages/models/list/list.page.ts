import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormPage } from '../form/form.page';

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
  selector: 'app-models-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  models: Model[] = [];
  brands: Brand[] = [];

  constructor(
    private modalController: ModalController,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadBrands();
    await this.loadModels();
  }

  async loadBrands(): Promise<void> {
    try {
      const response = await axios.get<{ data: Brand[] }>(
        `${environment.apiUrl}/brands`,
      );

      this.brands = response.data.data;
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  }

  async loadModels(): Promise<void> {
    try {
      const response = await axios.get<{ data: Model[] }>(
        `${environment.apiUrl}/models`,
      );

      this.models = response.data.data;
    } catch (error) {
      console.error('Error al cargar modelos:', error);
    }
  }

  getBrandName(brandId: number): string {
    const brand = this.brands.find(
      (item) => item.id === brandId,
    );

    return brand?.name ?? 'Marca no encontrada';
  }

  async createModel(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadModels();
    }
  }

  async editModel(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: {
        id,
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadModels();
    }
  }
}