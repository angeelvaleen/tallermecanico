import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormPage } from '../form/form.page';
import { firstValueFrom } from 'rxjs';
import { BrandServices, Brand } from 'src/app/services/brands/brands';

@Component({
  selector: 'app-brands-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage {
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = '';

  brands: Brand[] = [];

  loading: boolean = false;
  loadError: boolean = false;

  constructor(
    private modalController: ModalController,
    private brandService: BrandServices,
  ) {}

  async ionViewWillEnter(): Promise<void> {
    this.chargerData();
  }

  async loadBrands(): Promise<void> {
    try {
      this.brands = await firstValueFrom(this.brandService.list(this.currentPage, this.perPage, this.search));
    } catch (error) {
      console.error('Error al cargar marcas:', error);

      this.loadError = true;
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
      await this.chargerData();
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
      await this.chargerData();
    }
  }

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.brandService.total(this.search));
    } catch (error) {
      console.error('Error al obtener el total de marcas:', error);

      this.total = 0;
      this.loadError = true;
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
    this.loading = true;
    this.loadError = false;

    try {
      await this.chargerTotal();
      this.adjustCurrentPage();
      await this.loadBrands();
    } finally {
      this.loading = false;
    }
  }

  async retry(): Promise<void> {
    await this.chargerData();
  }

  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    this.loading = true;
    this.loadError = false;

    try {
      await this.loadBrands();
    } finally {
      this.loading = false;
    }
  }

  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
}
