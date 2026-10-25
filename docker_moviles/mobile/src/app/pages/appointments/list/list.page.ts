import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { firstValueFrom } from 'rxjs';
import { AppointmentServices } from '../../../services/appointments/appointments';
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
export class ListPage  {
  appointments: Appointment[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = "";
  selectedDate: string | null = null;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private appointmentServices: AppointmentServices,
  ) {}

  ionViewWillEnter(): void {
    void this.chargerData();
  }

  async loadAppointments(): Promise<void> {
    try {
      this.appointments = await firstValueFrom(this.appointmentServices.list(this.currentPage,this.perPage,this.search));
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
      await firstValueFrom(this.appointmentServices.executeCancelAppointment(id));

      const alert = await this.alertController.create({
        header: "Cita cancelada",
        message: "La cita fue cancelada correctamente.",
        buttons: ["Aceptar"],
      });

      await alert.present();

      await this.chargerData();
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

  async chargerTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.appointmentServices.total(this.search)); 
    } catch (error) {
      console.error("Error al obtener el total de citas:", error);

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
    await this.loadAppointments();
  }


  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadAppointments();
  }


  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerData();
  }
  
}