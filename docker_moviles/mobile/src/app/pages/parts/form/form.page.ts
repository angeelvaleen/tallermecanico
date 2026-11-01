import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';

import { firstValueFrom } from 'rxjs';
import { PartCreate,PartServices } from 'src/app/services/parts/parts';


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
    private partServices: PartServices,
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
    if (this.id === undefined) {
      return;
    }

    try {
  
      const part = await firstValueFrom(this.partServices.detail(this.id));

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

        await firstValueFrom(this.partServices.update(this.id, part));

        await this.showAlert(
          'Refacción actualizada',
          'La refacción fue actualizada exitosamente'
        );

      } else {

        await firstValueFrom(this.partServices.create(part));

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