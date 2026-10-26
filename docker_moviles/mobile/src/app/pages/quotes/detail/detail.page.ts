import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { firstValueFrom } from 'rxjs';
import { QuoteDetail, QuoteServices } from "src/app/services/quotes/quotes";
import { QuoteItem ,QuoteitemServices } from "src/app/services/quoteitems/quoteitems";
import { QuotePart ,QuotepartServices } from "src/app/services/quoteparts/quoteparts";

@Component({
  selector: "app-quotes-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  quote: QuoteDetail | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private quoteServices: QuoteServices,
    private quoteitemServices: QuoteitemServices,
    private quotepartServices: QuotepartServices
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
     
      const quote = await firstValueFrom(this.quoteServices.detail(Number(id)));

      // Obtener servicios de la cotización
      const itemsResponse = await firstValueFrom(this.quoteitemServices.ofQuote(Number(id)));

      // Obtener refacciones de la cotización
      const partsResponse = await firstValueFrom(this.quotepartServices.ofQuote(Number(id)));

      quote.quoteitems = itemsResponse;
      quote.quoteparts = partsResponse;

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
      await firstValueFrom(this.quoteServices.approve(Number(this.quote.id)));

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
      await firstValueFrom(this.quoteServices.reject(Number(this.quote.id)));

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

  async toggleService(item: QuoteItem): Promise<void> {
    const newState = item.is_approved === 1 ? 0 : 1;

    try {
      await firstValueFrom(this.quoteitemServices.toggle(Number(item.id),newState));

      item.is_approved = newState;

      await this.recalculateQuote();
    } catch (error) {
      this.messageError = "No fue posible actualizar el servicio.";
      console.log("Error al actualizar servicio", error);
    }
  }

  async togglePart(part: QuotePart): Promise<void> {
    const newState = part.is_approved === 1 ? 0 : 1;

    try {
      await firstValueFrom(this.quotepartServices.toggle(Number(part.id),newState));

      part.is_approved = newState;

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
      await firstValueFrom(this.quoteServices.recalculate(Number(this.quote.id),subtotal,tax,total));

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
