import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { FormPage } from '../form/form.page';
import { BrandServices, Brand } from 'src/app/services/brands/brands';

@Component({
  selector: 'app-brands-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  brands: Brand[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = '';

  constructor(
    private modalController: ModalController,
    private brandService: BrandServices,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.chargerData();
  }

  async loadBrands(): Promise<void> {
    try {
      this.brands = await firstValueFrom(this.brandService.list(this.currentPage, this.perPage, this.search));
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

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.brandService.total(this.search));
    } catch (error) {
      console.error('Error al obtener el total de marcas:', error);
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
  }

  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadBrands();
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.search = event.detail.value ?? '';
    this.currentPage = 1;
    await this.chargerData();
  }
}