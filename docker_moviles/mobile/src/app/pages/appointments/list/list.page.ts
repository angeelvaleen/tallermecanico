import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

import { FormPage } from "../form/form.page";
import { ConfirmPage } from "../confirm/confirm.page";

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
  selector: "app-appointments-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: false,
})
export class ListPage implements OnInit {
  appointments: Appointment[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadAppointments();
  }

  async loadAppointments(): Promise<void> {
    try {
      const response = await axios.get<{ data: Appointment[] }>(
        `${environment.apiUrl}/appointments`
      );

      this.appointments = response.data.data;
    } catch (error) {
      console.error("Error al cargar citas:", error);

      const alert = await this.alertController.create({
        header: "Error",
        message: "No se pudieron cargar las citas.",
        buttons: ["Aceptar"],
      });

      await alert.present();
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

  canEditAppointment(appointment: Appointment): boolean {
    return appointment.status_id === 1;
  }

  canConfirmAppointment(appointment: Appointment): boolean {
    return appointment.status_id === 1;
  }

  canCancelAppointment(appointment: Appointment): boolean {
    return appointment.status_id === 1;
  }

  async createAppointment(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadAppointments();
    }
  }

  async editAppointment(id: number): Promise<void> {
    const appointment = this.appointments.find(
      (item) => item.id === id
    );

    if (!appointment) {
      return;
    }

    if (!this.canEditAppointment(appointment)) {
      return;
    }

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
      await this.loadAppointments();
    }
  }

  async confirmAppointment(id: number): Promise<void> {
    const appointment = this.appointments.find(
      (item) => item.id === id
    );

    if (!appointment) {
      return;
    }

    if (!this.canConfirmAppointment(appointment)) {
      return;
    }

    const modal = await this.modalController.create({
      component: ConfirmPage,
      componentProps: {
        appointmentId: id,
      },
      breakpoints: [0, 0.7, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.loadAppointments();
    }
  }

  async cancelAppointment(id: number): Promise<void> {
    const appointment = this.appointments.find(
      (item) => item.id === id
    );

    if (!appointment) {
      return;
    }

    if (!this.canCancelAppointment(appointment)) {
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
            await this.executeCancelAppointment(id);
          },
        },
      ],
    });

    await alert.present();
  }

  private async executeCancelAppointment(id: number): Promise<void> {
    try {
      await axios.patch(
        `${environment.apiUrl}/appointments/${id}`,
        {
          status_id: 3,
        }
      );

      const alert = await this.alertController.create({
        header: "Cita cancelada",
        message: "La cita fue cancelada correctamente.",
        buttons: ["Aceptar"],
      });

      await alert.present();

      await this.loadAppointments();
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