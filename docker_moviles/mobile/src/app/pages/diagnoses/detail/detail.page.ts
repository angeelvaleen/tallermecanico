import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
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
  selector: "app-diagnoses-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  diagnosis: Diagnosis | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.chargerDiagnosis();
  }

  async chargerDiagnosis(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.messageError = "No se recibió ID";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando diagnóstico...",
      spinner: "bubbles",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Diagnosis }>(
        `${environment.apiUrl}/diagnoses/${encodeURIComponent(id)}`,
      );

      this.diagnosis = response.data.data;
    } catch (error) {
      console.error("Error al cargar diagnóstico:", error);

      this.messageError =
        "No se pudo cargar el diagnóstico. Revisa el ID, la conexión y los permisos de lectura.";
    } finally {
      await loading.dismiss();
    }
  }

  async editDiagnosis(): Promise<void> {
    if (!this.diagnosis) {
      return;
    }

    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: {
        id: this.diagnosis.id,
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerDiagnosis();
    }
  }
}