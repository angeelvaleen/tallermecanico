import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";
import { FormPage } from "../form/form.page";

interface Color {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

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

  constructor(private modalController: ModalController) {}

  ionViewWillEnter(): void {
    void this.chargerData();
  }

  async loadColors(): Promise<void> {
    try {
      const response = await axios.get<{ data: Color[] }>(
        `${environment.apiUrl}/colors`,
        {
          params: {
          limit: this.perPage,
          page: this.currentPage,
          sort: 'id',
          ...this.searchParameters()
          }
        }
      );

      this.colors = response.data.data;
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
      const response = await axios.get<{ data: { count: number | string }[] }>(
        `${environment.apiUrl}/colors?aggregate[count]=*`,
        { params: this.searchParameters() }
      );

      this.total = Number(response.data.data[0]?.count ?? 0);
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

   private searchParameters(): Record<string, string> {
    const text = this.search.trim();
    return text ? {
      filter: JSON.stringify({
        _or: [
          { name: { _icontains: text } },
        ]
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.search = event.detail.value ?? '';
    this.currentPage = 1;
    await this.chargerData();
  }
}
