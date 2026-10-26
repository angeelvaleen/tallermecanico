import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { firstValueFrom } from 'rxjs';
import { PaymentServices, PaymentDetail } from "src/app/services/payments/payments";

@Component({
  selector: "app-payment-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  payment: PaymentDetail | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private paymentServices: PaymentServices,
  ) {}

  ngOnInit() {
    this.chargerPayment();
  }

  async chargerPayment(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.messageError = "No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando pago...",
      spinner: "crescent",
    });

    await loading.present();

    try {
      this.payment = await firstValueFrom(this.paymentServices.detail(Number(id)));
    } catch (error) {
      this.messageError = "Revisar id, conexion a base de datos o permisos";
      console.log("Error al cargar detalle de pago", error);
    } finally {
      await loading.dismiss();
    }
  }
}
