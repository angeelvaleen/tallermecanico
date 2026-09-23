import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface PaymentCreate {
  quote_id: number;
  method_id: number;
  status_id: number;
  amount: number;
  reference: string | null;
  paid_at: string | null;
}

interface PaymentDetail {
  id: number;
  quote_id: number;
  method_id: number;
  status_id: number;
  amount: number;
  reference: string;
  paid_at: string;
}

@Component({
  selector: 'app-payment-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  paymentForm!: FormGroup;
  saved: boolean = false;
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    quote_id: {
      required: 'La cotizacion es requerida',
    },
    method_id: {
      required: 'El metodo es requerido',
    },
    amount: {
      required: 'El monto es requerido',
      min: 'El monto debe ser mayor que cero',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  async ngOnInit() {
    this.createForm();

    if (this.isEdition) {
      await this.chargerPayment();
    }
  }

  private createForm() {
    this.paymentForm = this.formBuilder.group({
      quote_id: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      method_id: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      reference: [''],
      paid_at: [''],
    });
  }

  getError(controlName: string): string {
    const control = this.paymentForm.get(controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }

    const typeError = Object.keys(control.errors)[0];

    return (
      this.validatorsMessage[controlName]?.[typeError] ??
      'El valor ingresado no es valido'
    );
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({
      saved: false,
    });
  }

  async savePayment(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.paymentForm.value;

    const payment: PaymentCreate = {
      quote_id: Number(values.quote_id),
      method_id: Number(values.method_id),
      status_id: 1,
      amount: Number(values.amount),
      reference: values.reference?.trim() || null,
      paid_at: values.paid_at || null,
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(`${environment.apiUrl}/payment/${this.id}`, {
          method_id: payment.method_id,
          amount: payment.amount,
          reference: payment.reference,
          paid_at: payment.paid_at,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/payment`, payment, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? 'Pago actualizado' : 'Pago guardado',
        message: this.isEdition
          ? 'El pago fue actualizado correctamente'
          : 'El pago fue guardado exitosamente',
        buttons: ['Aceptar'],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? 'Error al actualizar pago' : 'Error al guardar pago',
        error,
      );

      const alert = await this.alertController.create({
        header: 'Error',
        message: this.isEdition
          ? 'No fue posible actualizar el pago, Revisar los datos, la conexion o los permisos de directus'
          : 'No fue posible guardar el pago, Revisar los datos, la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerPayment(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: PaymentDetail }>(
        `${environment.apiUrl}/payment/${this.id}`,
      );

      const payment = response.data.data;

      this.paymentForm.patchValue({
        quote_id: payment.quote_id,
        method_id: payment.method_id,
        amount: payment.amount,
        reference: payment.reference,
        paid_at: payment.paid_at,
      });
    } catch (error) {
      console.log('Error al cargar el pago', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'No fue posible cargar los datos del pago, Revisar la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
