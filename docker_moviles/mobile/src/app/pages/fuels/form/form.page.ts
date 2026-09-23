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
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es obligatorio',
      maxlength: 'El nombre no debe superar los 50 caracteres',
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
      await this.chargerFuel();
    }
  }

  private createForm() {
    this.fuelForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  getError(controlName: string): string {
    const control = this.fuelForm.get(controlName);

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
        await axios.patch(`${environment.apiUrl}/fuels/${this.id}`, fuel, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/fuels`, fuel, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? 'Combustible actualizado' : 'Combustible guardado',
        message: this.isEdition
          ? 'El combustible fue actualizado correctamente'
          : 'El combustible fue guardado exitosamente',
        buttons: ['Aceptar'],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? 'Error al actualizar combustible' : 'Error al guardar combustible',
        error,
      );

      const alert = await this.alertController.create({
        header: 'Error',
        message: this.isEdition
          ? 'No fue posible actualizar el combustible, Revisar los datos, la conexion o los permisos de directus'
          : 'No fue posible guardar el combustible, Revisar los datos, la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerFuel(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: FuelDetail }>(
        `${environment.apiUrl}/fuels/${this.id}`,
      );

      const fuel = response.data.data;

      this.fuelForm.patchValue({
        name: fuel.name,
      });
    } catch (error) {
      console.log('Error al cargar el combustible', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'No fue posible cargar los datos del combustible, Revisar la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
