import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormPage } from '../form/form.page';
import { firstValueFrom } from 'rxjs';
import { PartServices, Part } from 'src/app/services/parts/parts';

@Component({
  selector: 'app-parts-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage {

  parts: Part[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = "";

  constructor(
    private modalController: ModalController,
    private partServices: PartServices,
  ) {}

  ionViewWillEnter(): void {
    void this.chargerData();
  }

  async loadParts(): Promise<void> {
    try {
      this.parts = await firstValueFrom(this.partServices.list(this.currentPage,this.perPage,this.search));
    } catch (error) {
      console.log('Error al cargar refacciones', error);
    }
  }

  async createPart(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadParts();
    }
  }

  async editPart(id: number): Promise<void> {
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
      await this.loadParts();
    }
  }

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.partServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de partes:", error);

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
    await this.loadParts();
  }


  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadParts();
  }


  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }

}