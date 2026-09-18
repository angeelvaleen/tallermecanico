import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";
import { FormPage } from "../form/form.page";

interface Workorder {
  id: number;
  vehicle_id: number;
  mileage: number;
  delivery: string;
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
    private modalController:ModalController,
  ) {}

  ngOnInit() {
    this.chargerWorkorders();
  }

  async chargerWorkorders(): Promise<void> {
    try {
      const response = await axios.get<{ data: Workorder[] }>(
        `${environment.apiUrl}/workorders`,
      );
      this.workorders = response.data.data;
    } catch (error) {
      console.log("Error al cargar órdenes", error);
    }
  }

  async createWorkorder(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerWorkorders();
    }
  }
}
