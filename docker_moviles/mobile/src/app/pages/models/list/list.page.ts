import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormPage } from '../form/form.page';
import { firstValueFrom } from 'rxjs';
import { BrandServices } from 'src/app/services/brands/brands';
import { ModelServices } from 'src/app/services/models/models';

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
export class ListPage {

  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = "";

  models: Model[] = [];
  brands: Brand[] = [];

  constructor(
    private modalController: ModalController,
    private brandServices: BrandServices,
    private modelServices: ModelServices
  ) {}

  async ionViewWillEnter(): Promise<void> {
    this.chargerData();
  }

  async loadBrands(): Promise<void> {
    try {
      this.brands = await firstValueFrom(this.brandServices.listWithOutFilters()) //this.currentPage,this.perPage,this.search
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  }

  async loadModels(): Promise<void> {
    try {
      this.models = await firstValueFrom(this.modelServices.list(this.currentPage,this.perPage,this.search))
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

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.modelServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de modelos:", error);

      this.total = 0;
    }
  }

  private adjustCurrentPage(): void {
    const totalPages = Math.ceil(this.total / this.perPage);

    if (totalPages === 0) {
      this.currentPage = 1;
      return;
    }

    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  async chargerData(): Promise<void> {
    await this.chargerTotal();
    this.adjustCurrentPage();
    await this.loadBrands();
    await this.loadModels();
  }

  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadBrands();
    await this.loadModels();
  }

  async handleInput(text:string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
}