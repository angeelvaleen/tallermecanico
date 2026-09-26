import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface MethodCreate {
  name: string;
}

interface MethodDetail {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-methods-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  methodForm!: FormGroup;

  saved: boolean = false;
  loading: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es obligatorio.',
      maxlength: 'El nombre no debe superar los 50 caracteres.',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    if (this.isEdition) {
      await this.loadMethod();
    }
  }

  private createForm(): void {
    this.methodForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  getError(controlName: string): string {
    const control = this.methodForm.get(controlName);

    if (
      !control ||
      !control.errors ||
      !(control.touched || control.dirty)
    ) {
      return '';
    }

    const errorType = Object.keys(control.errors)[0];

    return (
      this.validationMessages[controlName]?.[errorType] ??
      'El valor ingresado no es válido.'
    );
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({
      saved: false,
    });
  }

  async saveMethod(): Promise<void> {
    if (this.methodForm.invalid) {
      this.methodForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.methodForm.value;

    const method: MethodCreate = {
      name: values.name.trim(),
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(
          `${environment.apiUrl}/methods/${this.id}`,
          method,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      } else {
        await axios.post(
          `${environment.apiUrl}/methods`,
          method,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }

      await this.showAlert(
        this.isEdition ? 'Método actualizado' : 'Método guardado',
        this.isEdition
          ? 'El método de pago fue actualizado correctamente.'
          : 'El método de pago fue registrado correctamente.',
      );

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.error(
        this.isEdition
          ? 'Error al actualizar el método:'
          : 'Error al guardar el método:',
        error,
      );

      await this.showAlert(
        'Error',
        this.isEdition
          ? 'No fue posible actualizar el método. Revisa los datos, la conexión y los permisos de Directus.'
          : 'No fue posible guardar el método. Revisa los datos, la conexión y los permisos de Directus.',
      );
    } finally {
      this.saved = false;
    }
  }

  private async loadMethod(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.loading = true;

    try {
      const response = await axios.get<{ data: MethodDetail }>(
        `${environment.apiUrl}/methods/${this.id}`,
      );

      const method = response.data.data;

      this.methodForm.patchValue({
        name: method.name,
      });
    } catch (error) {
      console.error('Error al cargar el método:', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar los datos del método. Revisa la conexión, el identificador y los permisos de Directus.',
      );
    } finally {
      this.loading = false;
    }
  }

  private async showAlert(
    header: string,
    message: string,
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
    await alert.onDidDismiss();
  }
}