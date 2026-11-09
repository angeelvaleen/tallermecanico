import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";

import { firstValueFrom } from "rxjs";
import { PaymentServices,PaymentCreate } from "src/app/services/payments/payments";
import { QuoteDetail,QuoteServices } from "src/app/services/quotes/quotes";
import { Method,MethodServices } from "src/app/services/methods/methods";
import { AuthService } from "src/app/services/auth/auth";


@Component({
  selector: "app-payment-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  paymentForm!: FormGroup;

  quote: QuoteDetail | null = null;
  paymentMethods: Method[] = [];

  formattedSubtotal: string = "";
  formattedTax: string = "";
  formattedTotal: string = "";

  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    method_id: {
      required: "El método de pago es obligatorio.",
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private paymentServices: PaymentServices,
    private quoteServices: QuoteServices,
    private methodServices: MethodServices,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadData();
  }

  private createForm(): void {
    this.paymentForm = this.formBuilder.group({
      method_id: ["", [Validators.required]],
      reference: [""],
    });
  }

  private async loadData(): Promise<void> {
    const quoteId = this.route.snapshot.queryParamMap.get("quoteId");

    if (!quoteId) {
      await this.showAlert("No se encontró la cotización que se desea pagar.");

      await this.router.navigate(["/quotes/list"]);
      return;
    }

    const loading = await this.loadingController.create({
      message: "Cargando información...",
      spinner: "crescent",
    });

    await loading.present();

    try {
      await this.loadQuote(quoteId);

      if (!this.quote) {
        await loading.dismiss();

        await this.showAlert("No se encontró la cotización.");

        await this.router.navigate(["/quotes/list"]);

        return;
      }

      if (this.quote.status_id?.id !== 10) {
        await loading.dismiss();

        await this.showAlert(
          "La cotización todavía no está aprobada para realizar el pago.",
        );

        await this.router.navigate(["/quotes/detail", this.quote.id]);

        return;
      }

      await this.loadPaymentMethods();

      await loading.dismiss();
    } catch (error) {
      console.error("Error loading payment data:", error);

      await loading.dismiss();

      await this.showAlert("No fue posible cargar la información del pago.");
    }
  }

  private async loadQuote(quoteId: string): Promise<void> {
    
    this.quote = await firstValueFrom(
      this.quoteServices.detail(Number(quoteId)),
    );

    this.formattedSubtotal = Number(this.quote?.subtotal).toFixed(2);

    this.formattedTax = Number(this.quote?.tax).toFixed(2);

    this.formattedTotal = Number(this.quote?.total).toFixed(2);
  }

  private async loadPaymentMethods(): Promise<void> {
    this.paymentMethods = await firstValueFrom(
      this.methodServices.listWithOutFilters(),
    );
  }

  getError(controlName: string): string {
    const control = this.paymentForm.get(controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return "";
    }

    const errorType = Object.keys(control.errors)[0];

    return (
      this.validationMessages[controlName]?.[errorType] ??
      "El valor ingresado no es válido."
    );
  }

  async registerPayment(): Promise<void> {
    if (!this.quote) {
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const alert = await this.alertController.create({
      header: "Confirmar pago",
      message: `¿Desea registrar el pago por $${this.formattedTotal}?`,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
        },
        {
          text: "Confirmar",
          role: "confirm",
        },
      ],
    });

    await alert.present();

    const result = await alert.onDidDismiss();

    if (result.role === "confirm") {
      await this.savePayment();
    }
  }

  private createPaymentData(): PaymentCreate {
    const values = this.paymentForm.value;

    return {
      quote_id: this.quote!.id,
      user_id: this.authService.getID() ?? "",
      amount: Number(this.quote!.total),
      method_id: Number(values.method_id),
      reference: values.reference?.trim() || null,
      paid_at: new Date().toISOString(),
    };
  }

  private async savePayment(): Promise<void> {
    if (!this.quote) {
      return;
    }

    this.saving = true;

    const loading = await this.loadingController.create({
      message: "Registrando pago...",
      spinner: "crescent",
    });

    await loading.present();

    try {
      const payment = this.createPaymentData();

      const response = await firstValueFrom(this.paymentServices.create(payment));

      await loading.dismiss();
      this.saving = false;

      const alert = await this.alertController.create({
        header: "Pago registrado",
        message: "El pago se registró correctamente.",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.router.navigate(["/payment/detail", response.id], {
        replaceUrl: true,
      });
    } catch (error) {
      console.error("Error saving payment:", error);

      await loading.dismiss();
      this.saving = false;

      await this.showAlert(
        "No fue posible registrar el pago. Revise la conexión y los datos.",
      );
    }
  }

  private async showAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: "Aviso",
      message: message,
      buttons: ["Aceptar"],
    });

    await alert.present();
    await alert.onDidDismiss();
  }
}
