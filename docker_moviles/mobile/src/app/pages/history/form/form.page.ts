import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';

interface HistoryCreate {
  vehicle_id: number;
  workorder_id: number;
}

interface HistoryDetail {
  id: number;
  vehicle_id: number;
  workorder_id: number;
  created_at: string;
}

@Component({
  selector: 'app-history-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  historyForm!: FormGroup;
  saved: boolean = false;
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    vehicle_id: {
      required: 'El vehiculo es requerido',
    },
    workorder_id: {
      required: 'La orden es requerida',
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
      await this.chargerHistory();
    }
  }

  private createForm() {
    this.historyForm = this.formBuilder.group({
      vehicle_id: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      workorder_id: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
    });
  }

  getError(controlName: string): string {
    const control = this.historyForm.get(controlName);

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

  async saveHistory(): Promise<void> {
    if (this.historyForm.invalid) {
      this.historyForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.historyForm.value;

    const history: HistoryCreate = {
      vehicle_id: Number(values.vehicle_id),
      workorder_id: Number(values.workorder_id),
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(`${environment.apiUrl}/history/${this.id}`, history, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/history`, history, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? 'Historial actualizado' : 'Historial guardado',
        message: this.isEdition
          ? 'El historial fue actualizado correctamente'
          : 'El historial fue guardado exitosamente',
        buttons: ['Aceptar'],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? 'Error al actualizar historial' : 'Error al guardar historial',
        error,
      );

      const alert = await this.alertController.create({
        header: 'Error',
        message: this.isEdition
          ? 'No fue posible actualizar el historial, Revisar los datos, la conexion o los permisos de directus'
          : 'No fue posible guardar el historial, Revisar los datos, la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerHistory(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: HistoryDetail }>(
        `${environment.apiUrl}/history/${this.id}`,
      );

      const history = response.data.data;

      this.historyForm.patchValue({
        vehicle_id: history.vehicle_id,
        workorder_id: history.workorder_id,
      });
    } catch (error) {
      console.log('Error al cargar el historial', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'No fue posible cargar los datos del historial, Revisar la conexion o los permisos de directus',
        buttons: ['Aceptar'],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
