import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { AppointmentServices, DetailAppointment } from "src/app/services/appointments/appointments";
import { FormPage } from "../form/form.page";
import { ConfirmPage } from "../confirm/confirm.page";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: "app-appointments-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  appointment: DetailAppointment | null = null;

  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private modalController: ModalController,
    private alertController: AlertController,
    private appointmentServices: AppointmentServices,
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
      

      this.appointment = await firstValueFrom(this.appointmentServices.detail(Number(id)));
      this.messageError = "";
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

  canConfirmAppointment(): boolean {
    return this.appointment?.status_id === 1;
  }

  canCancelAppointment(): boolean {
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

  async confirmAppointment(): Promise<void> {
    if (!this.appointment || !this.canConfirmAppointment()) {
      return;
    }

    const modal = await this.modalController.create({
      component: ConfirmPage,
      componentProps: {
        appointmentId: this.appointment.id,
      },
      breakpoints: [0, 0.7, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadAppointment();
    }
  }

  async cancelAppointment(): Promise<void> {
    if (!this.appointment || !this.canCancelAppointment()) {
      return;
    }

    const alert = await this.alertController.create({
      header: "Cancelar cita",
      message: "¿Está seguro de que desea cancelar esta cita?",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Sí, cancelar",
          role: "confirm",
          handler: async () => {
            await this.executeCancelAppointment();
          },
        },
      ],
    });

    await alert.present();
  }

  private async executeCancelAppointment(): Promise<void> {
    if (!this.appointment) {
      return;
    }

    try {
      await firstValueFrom(this.appointmentServices.executeCancelAppointment(this.appointment.id));

      const alert = await this.alertController.create({
        header: "Cita cancelada",
        message: "La cita fue cancelada correctamente.",
        buttons: ["Aceptar"],
      });

      await alert.present();

      await this.loadAppointment();
    } catch (error) {
      console.error("Error al cancelar cita:", error);

      const alert = await this.alertController.create({
        header: "Error",
        message: "No se pudo cancelar la cita.",
        buttons: ["Aceptar"],
      });

      await alert.present();
    }
  }
}