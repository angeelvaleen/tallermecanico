import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from "src/environments/environment";

interface AppointmentCreate {
  vehicle_id: number;
  status_id: number;
  date: string;
  time: string;
  reason: string;
}

@Component({
  selector: "app-appoinments-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  appointmentForm!: FormGroup;
  saved: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    vehicle_id: {
      required: "El vehiculo es requerido",
    },
    date: {
      required: "Fecha es requerida",
    },
    time: {
      required: "La hora es requerida",
    },
    reason: {
      required: "La razon es requerida",
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.appointmentForm = this.formBuilder.group({
      vehicle_id: [
        "",
        [Validators.required, Validators.pattern("^[1-9][0-9]*$")],
      ],
      date: ["", [Validators.required]],
      time: ["", [Validators.required]],
      reason: ["", [Validators.required]],
    });
  }

  getError(controlName: string): string {
    const control = this.appointmentForm.get(controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return "";
    }

    const typeError = Object.keys(control.errors)[0];

    return (
      this.validatorsMessage[controlName]?.[typeError] ??
      "El valor ingresado no es valido"
    );
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({
      saved: false,
    });
  }

  async saveAppointment(): Promise<void> {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.appointmentForm.value;

    const appointment: AppointmentCreate = {
      vehicle_id: Number(values.vehicle_id),
      status_id: 1,
      date: values.date.trim(),
      time: values.time.trim(),
      reason: values.reason.trim(),
    };

    try {
      await axios.post(`${environment.apiUrl}/appointments`,appointment , {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const alert = await this.alertController.create({
        header: "Cita guardado",
        message: "La cita fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log("Error al guardar cita", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible guardar la cita, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }
}
