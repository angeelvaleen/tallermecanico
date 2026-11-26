import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormPage } from '../form/form.page';
import { firstValueFrom } from 'rxjs';
import { BrandServices } from 'src/app/services/brands/brands';
import { ModelServices, ModelList } from 'src/app/services/models/models';

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

  models: ModelList[] = [];

  loading: boolean = false;
  loadError: boolean = false;

  constructor(
    private modalController: ModalController,
   
    private modelServices: ModelServices
  ) {}

  async ionViewWillEnter(): Promise<void> {
    this.chargerData();
  }

  async loadModels(): Promise<void> {
    try {
      this.models = await firstValueFrom(this.modelServices.list(this.currentPage,this.perPage,this.search))
    } catch (error) {
      console.error('Error al cargar modelos:', error);

      this.loadError = true;
    }
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
      await this.loadModels();
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
      await this.loadModels();
    } finally {
      this.loading = false;
    }
  }

  async handleInput(text:string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
}