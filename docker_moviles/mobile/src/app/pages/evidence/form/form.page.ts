import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface EvidenceCreate {
  workorder_id: number;
  path: string;
  format: string;
  size: number;
}

interface EvidenceDetail {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
  size: number;
  created_at: string;
}

@Component({
  selector: 'app-evidence-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  evidenceForm!: FormGroup;
  saved: boolean = false;
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    workorder_id: {
      required: 'La orden es requerida',
    },
    path: {
      required: 'La ruta es requerida',
    },
    format: {
      required: 'El formato es requerido',
    },
    size: {
      required: 'El tamaño es requerido',
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
      await this.chargerEvidence();
    }
  }

  private createForm() {
    this.evidenceForm = this.formBuilder.group({
      workorder_id: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      path: ['', [Validators.required, Validators.maxLength(255)]],
      format: ['', [Validators.required, Validators.maxLength(10)]],
      size: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
    });
  }

  getError(controlName: string): string {
    const control = this.evidenceForm.get(controlName);

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

  async saveEvidence(): Promise<void> {
    if (this.evidenceForm.invalid) {
      this.evidenceForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.evidenceForm.value;

    const evidence: EvidenceCreate = {
      workorder_id: Number(values.workorder_id),
      path: values.path.trim(),
      format: values.format.trim(),
      size: Number(values.size),
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(`${environment.apiUrl}/evidence/${this.id}`, evidence, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/evidence`, evidence, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? 'Evidencia actualizada' : 'Evidencia guardada',
        message: this.isEdition
          ? 'La evidencia fue actualizada correctamente'
          : 'La evidencia fue guardada exitosamente',
        buttons: ['Aceptar'],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? 'Error al actualizar evidencia' : 'Error al guardar evidencia',
        error,
      );

      const alert = await this.alertController.create({
        header: 'Error',
        message: this.isEdition
          ? 'No fue posible actualizar la evidencia, Revisar los datos, la conexion o los permisos de directus'
          : 'No fue posible guardar la evidencia, Revisar los datos, la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerEvidence(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: EvidenceDetail }>(
        `${environment.apiUrl}/evidence/${this.id}`,
      );

      const evidence = response.data.data;

      this.evidenceForm.patchValue({
        workorder_id: evidence.workorder_id,
        path: evidence.path,
        format: evidence.format,
        size: evidence.size,
      });
    } catch (error) {
      console.log('Error al cargar la evidencia', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'No fue posible cargar los datos de la evidencia, Revisar la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
