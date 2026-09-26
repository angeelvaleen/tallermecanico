import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface ServiceCreate {
  name: string;
  price: number;
  description: string;
}

interface ServiceDetail {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-services-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  serviceForm!: FormGroup;

  saved: boolean = false;
  loading: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es obligatorio.',
      maxlength: 'El nombre no debe superar los 100 caracteres.',
    },
    price: {
      required: 'El precio es obligatorio.',
      min: 'El precio debe ser mayor o igual a cero.',
      pattern: 'El precio no tiene un formato válido.',
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
      await this.loadService();
    }
  }

  private createForm(): void {
    this.serviceForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
        ],
      ],
      description: [''],
    });
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  getError(controlName: string): string {
    const control = this.serviceForm.get(controlName);

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

  async saveService(): Promise<void> {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.serviceForm.value;

    const service: ServiceCreate = {
      name: values.name.trim(),
      price: Number(values.price),
      description: values.description?.trim() ?? '',
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(
          `${environment.apiUrl}/services/${this.id}`,
          service,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      } else {
        await axios.post(
          `${environment.apiUrl}/services`,
          service,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }

      await this.showAlert(
        this.isEdition ? 'Servicio actualizado' : 'Servicio guardado',
        this.isEdition
          ? 'El servicio fue actualizado correctamente.'
          : 'El servicio fue registrado correctamente.',
      );

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.error(
        this.isEdition
          ? 'Error al actualizar el servicio:'
          : 'Error al guardar el servicio:',
        error,
      );

      await this.showAlert(
        'Error',
        this.isEdition
          ? 'No fue posible actualizar el servicio. Revisa los datos, la conexión y los permisos de Directus.'
          : 'No fue posible guardar el servicio. Revisa los datos, la conexión y los permisos de Directus.',
      );
    } finally {
      this.saved = false;
    }
  }

  private async loadService(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.loading = true;

    try {
      const response = await axios.get<{ data: ServiceDetail }>(
        `${environment.apiUrl}/services/${this.id}`,
      );

      const service = response.data.data;

      this.serviceForm.patchValue({
        name: service.name,
        price: service.price,
        description: service.description ?? '',
      });
    } catch (error) {
      console.error('Error al cargar el servicio:', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar los datos del servicio. Revisa la conexión, el identificador y los permisos de Directus.',
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