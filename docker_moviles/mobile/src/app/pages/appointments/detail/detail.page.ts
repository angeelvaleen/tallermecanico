import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

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
  ) {}

  ngOnInit() {
    this.chargerAppointment();
  }

  async chargerAppointment(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.messageError = "No se recibio el ID";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando marca...",
      spinner: "bubbles",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Appointment }>(
        `${environment.apiUrl}/appointments/${encodeURIComponent(id)}`,
      );

      this.appointment = response.data.data;
    } catch (error) {
      console.error("Error al cargar el producto:", error);
      this.messageError =
        "No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    } finally {
      await loading.dismiss();
    }
  }

  abrirPagina(): void {
    if (!this.appointment) {
      return;
    }
    const url = `${environment.apiUrl}/appointments/${this.appointment.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
