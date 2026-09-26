import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
} from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

import { FormPage } from "../form/form.page";

interface Workorder {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string;
  created_at: string;
}

@Component({
  selector: "app-workorders-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: false,
})
export class ListPage implements OnInit {
  workorders: Workorder[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadWorkorders();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadWorkorders();
  }

  async loadWorkorders(): Promise<void> {
    try {
      const response =
        await axios.get<{ data: Workorder[] }>(
          `${environment.apiUrl}/workorders`
        );

      this.workorders =
        response.data.data;
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
}