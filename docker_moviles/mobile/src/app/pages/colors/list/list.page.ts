import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormPage } from "../form/form.page";
import { firstValueFrom } from 'rxjs';
import { ColorServices, Color } from '../../../services/colors/colors';

@Component({
  selector: "app-colors-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: false,
})
export class ListPage {
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  colors: Color[] = [];
  search: string = "";

  constructor(
    private modalController: ModalController,
    private colorServices: ColorServices,
  ) {}

  ionViewWillEnter(): void {
    void this.chargerData();
  }

  async loadColors(): Promise<void> {
    try {
      this.colors = await firstValueFrom(this.colorServices.list(this.currentPage, this.perPage, this.search));
    } catch (error) {
      console.error("Error al cargar colores:", error);
    }
  }

  async createColor(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadColors();
    }
  }

  async editColor(id: number): Promise<void> {
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
      await this.loadColors();
    }
  }

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.colorServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de colores:", error);

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
    await this.loadColors();
  }


  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadColors();
  }


  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.search = event.detail.value ?? '';
    this.currentPage = 1;
    await this.chargerData();
  }
}
