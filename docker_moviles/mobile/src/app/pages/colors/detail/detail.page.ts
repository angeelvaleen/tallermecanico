import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { firstValueFrom } from "rxjs";
import { Color, ColorServices } from "src/app/services/colors/colors";

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
    private colorServices: ColorServices,
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
      this.color = await firstValueFrom(this.colorServices.detail(Number(id)));
    } catch (error) {
      console.error("Error al cargar el producto:", error);
      this.messageError =
        "No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    } finally {
      await loading.dismiss();
    }
  }
}
