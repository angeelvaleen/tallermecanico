import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface PartCreate {
  name: string;
  price: number;
  description: string;
}

interface PartDetail {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-parts-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {

  @Input() id?: number;

  partForm!: FormGroup;
  saved: boolean = false;
  isEdition: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es requerido',
      maxlength: 'El nombre no puede tener más de 100 caracteres',
    },
    price: {
      required: 'El precio es requerido',
      min: 'El precio debe ser mayor o igual que cero',
      pattern: 'El precio no es válido',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    if (this.id) {
      this.isEdition = true;
      await this.loadPart();
    }
  }

  private createForm(): void {
    this.partForm = this.formBuilder.group({
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

  private async loadPart(): Promise<void> {
    try {
      const response = await axios.get<{ data: PartDetail }>(
        `${environment.apiUrl}/parts/${this.id}`
      );

      const part = response.data.data;

      this.partForm.patchValue({
        name: part.name,
        price: part.price,
        description: part.description,
      });

    } catch (error) {
      console.log('Error al cargar la refacción', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar la información de la refacción'
      );
    }
  }

  getError(controlName: string): string {
    const control = this.partForm.get(controlName);

    if (
      !control ||
      !control.errors ||
      !(control.touched || control.dirty)
    ) {
      return '';
    }

    const typeError = Object.keys(control.errors)[0];

    return (
      this.validatorsMessage[controlName]?.[typeError] ??
      'El valor ingresado no es válido'
    );
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({
      saved: false,
    });
  }

  async savePart(): Promise<void> {
    if (this.partForm.invalid) {
      this.partForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.partForm.value;

    const part: PartCreate = {
      name: values.name.trim(),
      price: Number(values.price),
      description: values.description?.trim() ?? '',
    };

    try {
      if (this.isEdition && this.id) {

        await axios.patch(
          `${environment.apiUrl}/parts/${this.id}`,
          part,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        await this.showAlert(
          'Refacción actualizada',
          'La refacción fue actualizada exitosamente'
        );

      } else {

        await axios.post(
          `${environment.apiUrl}/parts`,
          part,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        await this.showAlert(
          'Refacción guardada',
          'La refacción fue guardada exitosamente'
        );
      }

      await this.modalController.dismiss({
        saved: true,
      });

    } catch (error) {
      console.log('Error al guardar la refacción', error);

      await this.showAlert(
        'Error',
        'No fue posible guardar la refacción. Revisar los datos, la conexión o los permisos de Directus'
      );

    } finally {
      this.saved = false;
    }
  }

  private async showAlert(
    header: string,
    message: string
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