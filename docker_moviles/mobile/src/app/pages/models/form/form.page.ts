import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';

import { firstValueFrom } from 'rxjs';
import { Brand, BrandServices } from 'src/app/services/brands/brands';
import { Model,ModelCreate,ModelServices } from 'src/app/services/models/models';



@Component({
  selector: 'app-models-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  modelForm!: FormGroup;

  brands: Brand[] = [];

  saved: boolean = false;
  loading: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    brand_id: {
      required: 'La marca es obligatoria.',
    },
    name: {
      required: 'El nombre del modelo es obligatorio.',
      maxlength: 'El nombre del modelo no debe superar los 100 caracteres.',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private brandServices: BrandServices,
    private modelServices: ModelServices
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    await this.loadBrands();

    if (this.isEdition) {
      await this.loadModel();
    }
  }

  private createForm(): void {
    this.modelForm = this.formBuilder.group({
      brand_id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  getError(controlName: string): string {
    const control = this.modelForm.get(controlName);

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

  async saveModel(): Promise<void> {
    if (this.modelForm.invalid) {
      this.modelForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.modelForm.value;

    const model: ModelCreate = {
      brand_id: Number(values.brand_id),
      name: values.name.trim(),
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await firstValueFrom(
          this.modelServices.update(this.id, model)
        );
      } else {
        await firstValueFrom(this.modelServices.create(model));
      }

      await this.showAlert(
        this.isEdition ? 'Modelo actualizado' : 'Modelo guardado',
        this.isEdition
          ? 'El modelo fue actualizado correctamente.'
          : 'El modelo fue registrado correctamente.',
      );

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.error(
        this.isEdition
          ? 'Error al actualizar el modelo:'
          : 'Error al guardar el modelo:',
        error,
      );

      await this.showAlert(
        'Error',
        this.isEdition
          ? 'No fue posible actualizar el modelo. Revisa los datos, la conexión y los permisos de Directus.'
          : 'No fue posible guardar el modelo. Revisa los datos, la conexión y los permisos de Directus.',
      );
    } finally {
      this.saved = false;
    }
  }

  private async loadBrands(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.brandServices.listWithOutFilters(),
      );

      this.brands = response.filter(
        (brand) => brand.is_active,
      );
    } catch (error) {
      console.error('Error al cargar las marcas:', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar las marcas. Revisa la conexión y los permisos de Directus.',
      );
    }
  }

  private async loadModel(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.loading = true;

    try {
      const response = await firstValueFrom(
        this.modelServices.detail(this.id),
      );

      const model = response;

      this.modelForm.patchValue({
        brand_id: model.brand_id,
        name: model.name,
      });
    } catch (error) {
      console.error('Error al cargar el modelo:', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar los datos del modelo. Revisa la conexión, el identificador y los permisos de Directus.',
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