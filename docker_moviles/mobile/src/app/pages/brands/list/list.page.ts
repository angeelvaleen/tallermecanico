import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { FormPage } from '../form/form.page';
import { BrandServices } from 'src/app/services/brands/brands';

interface Brand {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-brands-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  brands: Brand[] = [];

  constructor(
    private modalController: ModalController,
    private brandService: BrandServices,
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  async loadBrands(): Promise<void> {
    try {
      
      this.brands = await firstValueFrom(this.brandService.listWithOutFilters());
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  }

  async createBrand(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadBrands();
    }
  }

  async editBrand(id: number): Promise<void> {
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
      await this.loadBrands();
    }
  }
}