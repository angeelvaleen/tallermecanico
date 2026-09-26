import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController, ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";
import { FormPage } from "../form/form.page";

interface Appointment {
  id: number;
  vehicle_id: number;
  status_id: number;
  date: string;
  time: string;
  reason: string;
  created_at: string;
}

@Component({
  selector: "app-appointments-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  appointment: Appointment | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private modalController: ModalController,
  ) {}

  ngOnInit(): void {
    this.loadAppointment();
  }

  async loadAppointment(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.messageError = "No se recibió el ID de la cita.";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando cita...",
      spinner: "bubbles",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Appointment }>(
        `${environment.apiUrl}/appointments/${encodeURIComponent(id)}`,
      );

      this.appointment = response.data.data;
    } catch (error) {
      console.error("Error al cargar la cita:", error);

      this.messageError =
        "No se pudo cargar la cita. Revisa el ID, la conexión y los permisos de lectura.";
    } finally {
      await loading.dismiss();
    }
  }

  getStatusName(statusId: number): string {
    switch (statusId) {
      case 1:
        return "Pendiente";
      case 2:
        return "Confirmada";
      case 3:
        return "Cancelada";
      default:
        return "Desconocido";
    }
  }

  canEditAppointment(): boolean {
    return this.appointment?.status_id === 1;
  }

  async editAppointment(): Promise<void> {
    if (!this.appointment || !this.canEditAppointment()) {
      return;
    }

    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: {
        id: this.appointment.id,
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadAppointment();
    }
  }
}