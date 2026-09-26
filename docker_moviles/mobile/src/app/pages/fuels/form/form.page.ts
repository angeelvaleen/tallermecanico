import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface FuelCreate {
  name: string;
}

interface FuelDetail {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-fuels-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  fuelForm!: FormGroup;

  saved: boolean = false;
  loading: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es obligatorio.',
      maxlength: 'El nombre no debe superar los 30 caracteres.',
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
      await this.loadFuel();
    }
  }

  private createForm(): void {
    this.fuelForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  getError(controlName: string): string {
    const control = this.fuelForm.get(controlName);

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

  async saveFuel(): Promise<void> {
    if (this.fuelForm.invalid) {
      this.fuelForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.fuelForm.value;

    const fuel: FuelCreate = {
      name: values.name.trim(),
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(
          `${environment.apiUrl}/fuels/${this.id}`,
          fuel,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      } else {
        await axios.post(
          `${environment.apiUrl}/fuels`,
          fuel,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }

      await this.showAlert(
        this.isEdition ? 'Combustible actualizado' : 'Combustible guardado',
        this.isEdition
          ? 'El combustible fue actualizado correctamente.'
          : 'El combustible fue registrado correctamente.',
      );

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.error(
        this.isEdition
          ? 'Error al actualizar el combustible:'
          : 'Error al guardar el combustible:',
        error,
      );

      await this.showAlert(
        'Error',
        this.isEdition
          ? 'No fue posible actualizar el combustible. Revisa los datos, la conexión y los permisos de Directus.'
          : 'No fue posible guardar el combustible. Revisa los datos, la conexión y los permisos de Directus.',
      );
    } finally {
      this.saved = false;
    }
  }

  private async loadFuel(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.loading = true;

    try {
      const response = await axios.get<{ data: FuelDetail }>(
        `${environment.apiUrl}/fuels/${this.id}`,
      );

      const fuel = response.data.data;

      this.fuelForm.patchValue({
        name: fuel.name,
      });
    } catch (error) {
      console.error('Error al cargar el combustible:', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar los datos del combustible. Revisa la conexión, el identificador y los permisos de Directus.',
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