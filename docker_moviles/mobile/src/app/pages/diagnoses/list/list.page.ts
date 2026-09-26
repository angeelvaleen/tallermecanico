import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";
import { FormPage } from "../form/form.page";

interface Diagnosis {
  id: number;
  workorder_id: number;
  description: string;
  result: string;
  created_at: string;
}

@Component({
  selector: "app-diagnoses-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: false,
})
export class ListPage implements OnInit {
  diagnoses: Diagnosis[] = [];

  constructor(
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.chargerDiagnoses();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.chargerDiagnoses();
  }

  async chargerDiagnoses(): Promise<void> {
    try {
      const response = await axios.get<{ data: Diagnosis[] }>(
        `${environment.apiUrl}/diagnoses`,
      );

      this.diagnoses = response.data.data;
    } catch (error) {
      console.log("Error al cargar diagnósticos", error);
    }
  }

  async createDiagnosis(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerDiagnoses();
    }
  }

  async editDiagnosis(id: number): Promise<void> {
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
      await this.chargerDiagnoses();
    }
  }
}