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
export class ListPage implements OnInit {
  colors: Color[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerColors();
  }

  async chargerColors(): Promise<void> {
    try {
      const response = await axios.get<{ data: Color[] }>(
        `${environment.apiUrl}/colors`,
      );
      this.colors = response.data.data;
    } catch (error) {
      console.log("Error al cargar colores", error);
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
      await this.chargerColors();
    }
  }

  async editColor(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: {
        id: id,
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerColors();
    }
  }
}
