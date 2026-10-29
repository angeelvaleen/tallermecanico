import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  AlertController,
  ModalController,
} from "@ionic/angular";

import { firstValueFrom } from 'rxjs';
import { Vehicle, VehicleServices } from "src/app/services/vehicles/vehicles";
import { AppointmentCreate, AppointmentServices } from "src/app/services/appointments/appointments";

@Component({
  selector: "app-appoinments-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  appointmentForm!: FormGroup;

  vehicles: Vehicle[] = [];

  saved: boolean = false;
  isEdition: boolean = false;

  validatorsMessage: Record<
    string,
    Record<string, string>
  > = {
    vehicle_id: {
      required: "El vehículo es requerido",
    },

    date: {
      required: "La fecha es requerida",
    },

    time: {
      required: "La hora es requerida",
    },

    reason: {
      required: "El motivo es requerido",
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private vehicleServices: VehicleServices,
    private appointmentServices: AppointmentServices
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    await this.loadVehicles();

    if (this.id) {
      this.isEdition = true;

      await this.loadAppointment();
    }
  }

  private createForm(): void {
    this.appointmentForm =
      this.formBuilder.group({
        vehicle_id: [
          "",
          [Validators.required],
        ],

        date: [
          "",
          [Validators.required],
        ],

        time: [
          "",
          [Validators.required],
        ],

        reason: [
          "",
          [Validators.required],
        ],
      });
  }

  async loadVehicles(): Promise<void> {
    try {
      this.vehicles = await firstValueFrom(this.vehicleServices.listWithOutFilters());
    } catch (error) {
      console.error(
        "Error al cargar vehículos:",
        error
      );

      const alert =
        await this.alertController.create({
          header: "Error",
          message:
            "No fue posible cargar los vehículos.",
          buttons: ["Aceptar"],
        });

      await alert.present();
    }
  }

  async loadAppointment(): Promise<void> {
    if (!this.id) {
      return;
    }

    try {
      const appointment = await firstValueFrom(this.appointmentServices.detail(Number(this.id)));

      if (appointment.status_id !== 1) {
        const alert =
          await this.alertController.create({
            header: "Cita no editable",
            message:
              "Solo se pueden modificar citas que se encuentren pendientes.",
            buttons: ["Aceptar"],
          });

        await alert.present();

        await alert.onDidDismiss();

        await this.modalController.dismiss({
          saved: false,
        });

        return;
      }

      this.appointmentForm.patchValue({
        vehicle_id:
          appointment.vehicle_id.id,

        date:
          appointment.date,

        time:
          appointment.time,

        reason:
          appointment.reason,
      });
    } catch (error) {
      console.error(
        "Error al cargar cita:",
        error
      );

      const alert =
        await this.alertController.create({
          header: "Error",
          message:
            "No fue posible cargar la cita. Revisa el ID, la conexión o los permisos.",
          buttons: ["Aceptar"],
        });

      await alert.present();
    }
  }

  getError(controlName: string): string {
    const control =
      this.appointmentForm.get(
        controlName
      );

    if (
      !control ||
      !control.errors ||
      !(
        control.touched ||
        control.dirty
      )
    ) {
      return "";
    }

    const typeError =
      Object.keys(control.errors)[0];

    return (
      this.validatorsMessage[
        controlName
      ]?.[typeError] ??
      "El valor ingresado no es válido"
    );
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({
      saved: false,
    });
  }

  async saveAppointment(): Promise<void> {
    if (
      this.appointmentForm.invalid
    ) {
      this.appointmentForm.markAllAsTouched();

      return;
    }

    this.saved = true;

    const values =
      this.appointmentForm.value;

    const appointment:
      AppointmentCreate = {
      vehicle_id: Number(
        values.vehicle_id
      ),

      status_id: 1,

      date: values.date,

      time: values.time,

      reason:
        values.reason.trim(),
    };

    try {
      if (
        this.isEdition &&
        this.id
      ) {
        await firstValueFrom(this.appointmentServices.update(this.id,appointment))
      } else {
        await firstValueFrom(this.appointmentServices.create(appointment));
      }

      const alert =
        await this.alertController.create({
          header: this.isEdition
            ? "Cita actualizada"
            : "Cita guardada",

          message: this.isEdition
            ? "La cita fue actualizada exitosamente."
            : "La cita fue guardada exitosamente.",

          buttons: ["Aceptar"],
        });

      await alert.present();

      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.error(
        "Error al guardar cita:",
        error
      );

      const alert =
        await this.alertController.create({
          header: "Error",

          message:
            "No fue posible guardar la cita. Revisa los datos, la conexión o los permisos de Directus.",

          buttons: ["Aceptar"],
        });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }
}