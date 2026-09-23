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
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es obligatorio',
      maxlength: 'El nombre no debe superar los 60 caracteres',
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
      await this.chargerMethod();
    }
  }

  private createForm() {
    this.methodForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  getError(controlName: string): string {
    const control = this.methodForm.get(controlName);

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
        await axios.patch(`${environment.apiUrl}/methods/${this.id}`, method, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/methods`, method, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? 'Metodo actualizado' : 'Metodo guardado',
        message: this.isEdition
          ? 'El metodo fue actualizado correctamente'
          : 'El metodo fue guardado exitosamente',
        buttons: ['Aceptar'],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? 'Error al actualizar metodo' : 'Error al guardar metodo',
        error,
      );

      const alert = await this.alertController.create({
        header: 'Error',
        message: this.isEdition
          ? 'No fue posible actualizar el metodo, Revisar los datos, la conexion o los permisos de directus'
          : 'No fue posible guardar el metodo, Revisar los datos, la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerMethod(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: MethodDetail }>(
        `${environment.apiUrl}/methods/${this.id}`,
      );

      const method = response.data.data;

      this.methodForm.patchValue({
        name: method.name,
      });
    } catch (error) {
      console.log('Error al cargar el metodo', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'No fue posible cargar los datos del metodo, Revisar la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
