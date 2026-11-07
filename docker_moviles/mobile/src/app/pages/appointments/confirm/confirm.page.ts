import {
  Component,
  Input,
  OnInit,
} from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import {
  AlertController,
  ModalController,
} from "@ionic/angular";

import { firstValueFrom } from "rxjs";
import { Appointment,AppointmentServices } from '../../../services/appointments/appointments';
import { WorkorderServices,WorkorderCreate } from '../../../services/workorders/workorders';
import { User, AuthService } from "src/app/services/auth/auth";


@Component({
  selector: "app-appointment-confirm",
  templateUrl: "./confirm.page.html",
  styleUrls: ["./confirm.page.scss"],
  standalone: false,
})
export class ConfirmPage
  implements OnInit
{
  @Input() appointmentId?: number;

  confirmForm!: FormGroup;

  appointment:
    Appointment | null = null;

  mechanics: User[] = [];

  saving: boolean = false;

  validationMessages: Record<
    string,
    Record<string, string>
  > = {
    mechanic_id: {
      required:
        "El mecánico es requerido",
    },

    mileage: {
      required:
        "El kilometraje es requerido",

      min: "El kilometraje no puede ser negativo",
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private appointmentService: AppointmentServices,
    private authService: AuthService,
    private workorderService: WorkorderServices,
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    if (!this.appointmentId) {
      await this.showAlert(
        "Error",
        "No se recibió el ID de la cita."
      );

      await this.closeModal();

      return;
    }

    await this.loadAppointment();

    if (!this.appointment) {
      return;
    }

    await this.loadMechanics();
  }

  private createForm(): void {
    this.confirmForm =
      this.formBuilder.group({
        mechanic_id: [
          "",
          [Validators.required],
        ],

        mileage: [
          "",
          [
            Validators.required,
            Validators.min(0),
          ],
        ],
      });
  }

  async loadAppointment(): Promise<void> {
    if (!this.appointmentId) {
      return;
    }

    try {
      this.appointment = await firstValueFrom(this.appointmentService.get(this.appointmentId));
      if (
        this.appointment?.status_id !== 1
      ) {
        await this.showAlert(
          "Cita no disponible",
          "Solo se pueden confirmar citas pendientes."
        );

        await this.closeModal();
      }
    } catch (error) {
      console.error(
        "Error al cargar cita:",
        error
      );

      await this.showAlert(
        "Error",
        "No se pudo cargar la información de la cita."
      );

      await this.closeModal();
    }
  }

  async loadMechanics(): Promise<void> {
    try {
  

      this.mechanics = await firstValueFrom(this.authService.getMechanicList());
        
    } catch (error) {
      console.error(
        "Error al cargar mecánicos:",
        error
      );

      await this.showAlert(
        "Error",
        "No se pudo cargar la lista de mecánicos."
      );
    }
  }

  getMechanicName(
    mechanic: User
  ): string {

    if (mechanic.first_name) {
      return mechanic.first_name;
    }

    if (mechanic.email) {
      return mechanic.email;
    }

    return `Mecánico #${mechanic.id}`;
  }

  getError(
    controlName: string
  ): string {
    const control =
      this.confirmForm.get(
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
      this.validationMessages[
        controlName
      ]?.[typeError] ??
      "El valor ingresado no es válido"
    );
  }

  async confirmAppointment(): Promise<void> {
    if (
      this.confirmForm.invalid
    ) {
      this.confirmForm.markAllAsTouched();

      return;
    }

    if (!this.appointment) {
      return;
    }

    this.saving = true;

    let workorderId:
      number | undefined;

    try {
      
      const workorderData: WorkorderCreate = {
            vehicle_id:
              this.appointment.vehicle_id,

            mechanic_id:
              Number(
                this.confirmForm.value
                  .mechanic_id
              ),

            status_id: 4,

            mileage:
              Number(
                this.confirmForm.value
                  .mileage
              ),

            delivery: null,
        }

        console.log("Workorder que se enviará:", workorderData);
      const workorderResponse =
        await firstValueFrom(this.workorderService.create(workorderData));
      
        workorderId = workorderResponse.id;

      /*
       * Una vez creada correctamente
       * la orden, confirmamos la cita.
       */
      await firstValueFrom(this.appointmentService.acceptedAppointment(this.appointment.id));

      const alert =
        await this.alertController.create({
          header: "Cita confirmada",
          message:
            "La cita fue confirmada y se creó la orden de trabajo.",
          buttons: ["Aceptar"],
        });

      await alert.present();

      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
        workorderId:
          workorderId,
      });
    } catch (error) {
      console.error(
        "Error al confirmar cita:",
        error
      );

      /*
       * Si la orden se creó pero después
       * falló la confirmación de la cita,
       * intentamos eliminar la orden creada.
       */
      if (workorderId) {
        try {
          await firstValueFrom(this.workorderService.delete(workorderId));
        } catch (deleteError) {
          console.error(
            "No se pudo eliminar la orden creada después del error:",
            deleteError
          );
        }
      }

      await this.showAlert(
        "Error",
        "No se pudo confirmar la cita. La cita no fue confirmada."
      );
    } finally {
      this.saving = false;
    }
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({
      saved: false,
    });
  }

  async showAlert(
    header: string,
    message: string
  ): Promise<void> {
    const alert =
      await this.alertController.create({
        header,
        message,
        buttons: ["Aceptar"],
      });

    await alert.present();

    await alert.onDidDismiss();
  }
}