import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
} from "@ionic/angular";

import { FormPage } from "../form/form.page";
import { firstValueFrom } from 'rxjs';
import { WorkorderServices , Workorder} from "src/app/services/workorders/workorders";

@Component({
  selector: "app-workorders-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: false,
})
export class ListPage {
  workorders: Workorder[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 15;
  search: string = "";

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private workorderServices: WorkorderServices,
  ) {}

  async ionViewWillEnter(): Promise<void> {
    await this.chargerData();
  }

  async loadWorkorders(): Promise<void> {
    try {
      this.workorders = await firstValueFrom(this.workorderServices.list(this.currentPage,this.perPage,this.search));
    } catch (error) {
      console.error(
        "Error al cargar órdenes de trabajo:",
        error
      );

      const alert =
        await this.alertController.create({
          header: "Error",
          message:
            "No se pudieron cargar las órdenes de trabajo.",
          buttons: ["Aceptar"],
        });

      await alert.present();
    }
  }

  getStatusName(statusId: number): string {
    switch (statusId) {
      case 4:
        return "Recibida";

      case 5:
        return "Diagnóstico";

      case 6:
        return "Reparación";

      case 7:
        return "Lista";

      case 8:
        return "Entregada";

      default:
        return "Desconocido";
    }
  }

  async createWorkorder(): Promise<void> {
    const modal =
      await this.modalController.create({
        component: FormPage,
        breakpoints: [0, 0.5, 0.95],
        initialBreakpoint: 0.95,
      });

    await modal.present();

    const { data } =
      await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadWorkorders();
    }
  }

  async editWorkorder(
    id: number
  ): Promise<void> {
    const modal =
      await this.modalController.create({
        component: FormPage,
        componentProps: {
          id: id,
        },
        breakpoints: [0, 0.5, 0.95],
        initialBreakpoint: 0.95,
      });

    await modal.present();

    const { data } =
      await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadWorkorders();
    }
  }

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.workorderServices.total(this.search)); 
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
    await this.loadWorkorders();
  }


  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadWorkorders();
  }


  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
}