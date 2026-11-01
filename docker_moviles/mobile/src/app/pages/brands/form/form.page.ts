import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Brand ,BrandCreate, BrandServices } from 'src/app/services/brands/brands';



@Component({
  selector: 'app-brands-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  brandForm!: FormGroup;

  saved: boolean = false;
  loading: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre es obligatorio.',
      maxlength: 'El nombre no debe superar los 100 caracteres.',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private brandServices: BrandServices,
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    if (this.isEdition) {
      await this.loadBrand();
    }
  }

  private createForm(): void {
    this.brandForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  getError(controlName: string): string {
    const control = this.brandForm.get(controlName);

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

  async saveBrand(): Promise<void> {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.brandForm.value;

    const brand: BrandCreate = {
      name: values.name.trim(),
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await firstValueFrom(this.brandServices.update(this.id, brand));
      } else {
        await firstValueFrom(this.brandServices.create(brand));
      }

      await this.showAlert(
        this.isEdition ? 'Marca actualizada' : 'Marca guardada',
        this.isEdition
          ? 'La marca fue actualizada correctamente.'
          : 'La marca fue registrada correctamente.',
      );

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.error(
        this.isEdition
          ? 'Error al actualizar la marca:'
          : 'Error al guardar la marca:',
        error,
      );

      await this.showAlert(
        'Error',
        this.isEdition
          ? 'No fue posible actualizar la marca. Revisa los datos, la conexión y los permisos de Directus.'
          : 'No fue posible guardar la marca. Revisa los datos, la conexión y los permisos de Directus.',
      );
    } finally {
      this.saved = false;
    }
  }

  private async loadBrand(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.loading = true;

    try {
      const brand = await firstValueFrom(this.brandServices.detail(this.id));

      this.brandForm.patchValue({
        name: brand.name,
      });
    } catch (error) {
      console.error('Error al cargar la marca:', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar los datos de la marca. Revisa la conexión y los permisos de Directus.',
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