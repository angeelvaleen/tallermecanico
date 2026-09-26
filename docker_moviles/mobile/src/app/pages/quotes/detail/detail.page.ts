import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

interface QuoteService {
  id: number;
  service_id: any;
  price: number;
  discount: number;
  amount: number;
  is_approved: number;
}

interface QuotePart {
  id: number;
  part_id: any;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
  is_approved: number;
}

interface Quote {
  id: number;
  workorder_id: any;
  user_id: number;
  status_id: any;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
  created_at: string;
  quoteitems: QuoteService[];
  quoteparts: QuotePart[];
}

@Component({
  selector: "app-quotes-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  quote: Quote | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.chargerQuote();
  }

  async chargerQuote(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.messageError = "No se proporciono id";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando cotización...",
      spinner: "crescent",
    });

    await loading.present();

    try {
      // Obtener cotización
      const quoteResponse = await axios.get<{ data: Quote }>(
        `${environment.apiUrl}/quotes/${encodeURIComponent(id)}?fields=*,workorder_id.*,status_id.*`,
      );

      const quote = quoteResponse.data.data;

      // Obtener servicios de la cotización
      const itemsResponse = await axios.get<{ data: QuoteService[] }>(
        `${environment.apiUrl}/quoteitems?filter[quote_id][_eq]=${encodeURIComponent(id)}&fields=*,service_id.*`,
      );

      // Obtener refacciones de la cotización
      const partsResponse = await axios.get<{ data: QuotePart[] }>(
        `${environment.apiUrl}/quoteparts?filter[quote_id][_eq]=${encodeURIComponent(id)}&fields=*,part_id.*`,
      );

      quote.quoteitems = itemsResponse.data.data;
      quote.quoteparts = partsResponse.data.data;

      this.quote = quote;

      console.log("Cotización:", this.quote);
    } catch (error) {
      this.messageError = "Revisar id, conexion a base de datos o permisos";

      console.log("Error al cargar detalle de cotizacion", error);
    } finally {
      await loading.dismiss();
    }
  }

  async approveQuote(): Promise<void> {
    if (!this.quote) {
      return;
    }

    const approvedServices = this.quote.quoteitems.filter(
      (item) => item.is_approved === 1,
    );

    const approvedParts = this.quote.quoteparts.filter(
      (part) => part.is_approved === 1,
    );

    const hasApprovedConcepts =
      approvedServices.length > 0 || approvedParts.length > 0;

    if (!hasApprovedConcepts) {
      await this.showAlert(
        "Debe seleccionar al menos un servicio o refacción para aceptar la cotización.",
      );

      return;
    }

    const loading = await this.loading.create({
      message: "Aprobando cotización...",
      spinner: "crescent",
    });

    await loading.present();

    try {
      await axios.patch(
        `${environment.apiUrl}/quotes/${this.quote.id}`,
        {
          status_id: 10,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      this.quote.status_id = {
        id: 10,
        name: "Aprobada",
      };

      await this.router.navigate(["/payment/form"], {
        queryParams: {
          quoteId: this.quote.id,
        },
      });
    } catch (error) {
      this.messageError = "No fue posible aprobar la cotización.";

      console.log("Error al aprobar cotización", error);
    } finally {
      await loading.dismiss();
    }
  }

  async rejectQuote(): Promise<void> {
    if (!this.quote) {
      return;
    }

    const loading = await this.loading.create({
      message: "Rechazando cotización...",
      spinner: "crescent",
    });

    await loading.present();

    try {
      await axios.patch(
        `${environment.apiUrl}/quotes/${this.quote.id}`,
        {
          status_id: 11,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      this.quote.status_id = {
        id: 11,
        name: "Rechazada",
      };
    } catch (error) {
      this.messageError = "No fue posible rechazar la cotización.";

      console.log("Error al rechazar cotización", error);
    } finally {
      await loading.dismiss();
    }
  }

  async toggleService(item: QuoteService): Promise<void> {
    const nuevoEstado = item.is_approved === 1 ? 0 : 1;

    try {
      await axios.patch(
        `${environment.apiUrl}/quoteitems/${item.id}`,
        {
          is_approved: nuevoEstado,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      item.is_approved = nuevoEstado;

      await this.recalculateQuote();
    } catch (error) {
      this.messageError = "No fue posible actualizar el servicio.";
      console.log("Error al actualizar servicio", error);
    }
  }

  async togglePart(part: QuotePart): Promise<void> {
    const nuevoEstado = part.is_approved === 1 ? 0 : 1;

    try {
      await axios.patch(
        `${environment.apiUrl}/quoteparts/${part.id}`,
        {
          is_approved: nuevoEstado,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      part.is_approved = nuevoEstado;

      await this.recalculateQuote();
    } catch (error) {
      this.messageError = "No fue posible actualizar la refacción.";
      console.log("Error al actualizar refacción", error);
    }
  }

  async recalculateQuote(): Promise<void> {
    if (!this.quote) {
      return;
    }

    const approvedServices = this.quote.quoteitems
      .filter((item) => item.is_approved === 1)
      .reduce((total, item) => total + Number(item.amount), 0);

    const approvedParts = this.quote.quoteparts
      .filter((part) => part.is_approved === 1)
      .reduce((total, part) => total + Number(part.amount), 0);

    const subtotal = approvedServices + approvedParts;

    const tax = subtotal * 0.16;

    const total = subtotal + tax;

    try {
      await axios.patch(
        `${environment.apiUrl}/quotes/${this.quote.id}`,
        {
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      this.quote.subtotal = subtotal;
      this.quote.tax = tax;
      this.quote.total = total;
    } catch (error) {
      this.messageError = "No fue posible actualizar los totales.";
      console.log("Error al actualizar totales", error);
    }
  }

  async showAlert(mensaje: string): Promise<void> {
    const alert = await this.alertController.create({
      header: "Aviso",
      message: mensaje,
      buttons: ["Aceptar"],
    });

    await alert.present();
  }
}
