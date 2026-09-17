import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
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
  selector: "app-appointments-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: false,
})
export class ListPage implements OnInit {
  appointments: Appointment[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.chargerAppointments();
  }

  async chargerAppointments(): Promise<void> {
    try {
      const response = await axios.get<{ data: Appointment[] }>(
        `${environment.apiUrl}/appointments`,
      );

      this.appointments = response.data.data;
    } catch (error) {
      console.log("Error al cargar citas", error);
    }
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
      await this.chargerAppointments();
    }
  }
}
