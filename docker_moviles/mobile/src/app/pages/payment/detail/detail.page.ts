import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import axios from "axios";
import { environment } from "../../../../environments/environment";

interface PaymentRelation {
  id: number;
  name: string;
}

interface QuoteDetail {
  id: number;
  workorder_id: number;
  user_id: number;
  status_id: number;
  subtotal: string;
  tax: string;
  total: string;
  validity: string;
  created_at: string;
  updated_at: string;
}

interface PaymentDetail {
  id: number;
  amount: string;
  reference: string | null;
  paid_at: string | null;

  quote_id: QuoteDetail;

  method_id: PaymentRelation;
  user_id: PaymentRelation;
}

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
      const response = await axios.get<{ data: PaymentDetail }>(
        `${environment.apiUrl}/payment/${encodeURIComponent(id)}?fields=*,quote_id.*,method_id.*,user_id.id,user_id.name`);
      this.payment = response.data.data;
      console.log('Pago:', this.payment);
      console.log('Cotización:', this.payment?.quote_id);
    } catch (error) {
      this.messageError = "Revisar id, conexion a base de datos o permisos";
      console.log("Error al cargar detalle de pago", error);
    } finally {
      await loading.dismiss();
    }
  }
}
