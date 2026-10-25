import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ServiceServices } from 'src/app/services/services/services';
import { FormPage } from '../form/form.page';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-services-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage {
  services: Service[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = "";

  constructor(
    private modalController: ModalController,
    private serviceServices: ServiceServices,
  ) {}

  ionViewWillEnter(): void {
    void this.chargerData()
  }

  async loadServices(): Promise<void> {
    try {
      this.services = await firstValueFrom(this.serviceServices.list(this.currentPage,this.perPage,this.search));
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  }

  async createService(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadServices();
    }
  }

  async editService(id: number): Promise<void> {
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
      await this.loadServices();
    }
  }

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.serviceServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de servicios:", error);

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
    await this.loadServices();
  }


  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadServices();
  }


  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
}