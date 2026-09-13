import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

interface Color {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: "app-colors-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  color: Color | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
  ) {}

  ngOnInit() {
    this.chargerColor();
  }

  async chargerColor(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    this.color = null;
    this.messageError = "";

    if (!id) {
      this.messageError = "No se recibio ID";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando marca...",
      spinner: "bubbles",
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Color }>(
        `${environment.apiUrl}/colors/${encodeURIComponent(id)}`,
      );

      this.color = response.data.data;
    } catch (error) {
      console.error("Error al cargar el producto:", error);
      this.messageError =
        "No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    } finally {
      await loading.dismiss();
    }
  }
}
