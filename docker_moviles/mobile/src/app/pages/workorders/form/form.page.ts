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

import axios from "axios";

import { environment } from "src/environments/environment";

interface Vehicle {
  id: number;
  plate: string;
}

interface Mechanic {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface WorkorderDetail {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery?: string;
  created_at: string;
}

interface WorkorderCreate {
  vehicle_id: number;
  status_id: number;
  mechanic_id: number;
  mileage: number;
  delivery?: string;
}

@Component({
  selector: "app-workorders-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage
  implements OnInit
{
  @Input() id?: number;

  workorderForm!: FormGroup;

  vehicles: Vehicle[] = [];
  mechanics: Mechanic[] = [];

  saved: boolean = false;
  isEdition: boolean = false;

  validatorsMessage: Record<
    string,
    Record<string, string>
  > = {
    vehicle_id: {
      required:
        "El vehículo es requerido",
    },

    mechanic_id: {
      required:
        "El mecánico es requerido",
    },

    status_id: {
      required:
        "El estado es requerido",
    },

    mileage: {
      required:
        "El kilometraje es requerido",

      min:
        "El kilometraje debe ser mayor o igual a 0",

      pattern:
        "El kilometraje debe ser un número válido",
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    await this.loadVehicles();
    await this.loadMechanics();

    if (this.id) {
      this.isEdition = true;

      await this.loadWorkorder();
    }
  }

  private createForm(): void {
    this.workorderForm =
      this.formBuilder.group({
        vehicle_id: [
          "",
          [Validators.required],
        ],

        mechanic_id: [
          "",
          [Validators.required],
        ],

        mileage: [
          "",
          [
            Validators.required,
            Validators.min(0),
            Validators.pattern(
              "^(0|[1-9][0-9]{0,5})$"
            ),
          ],
        ],

        status_id: [
          4,
          [Validators.required],
        ],

        delivery: [""],
      });
  }

  async loadVehicles(): Promise<void> {
    try {
      const response =
        await axios.get<{
          data: Vehicle[];
        }>(
          `${environment.apiUrl}/vehicles`
        );

      this.vehicles =
        response.data.data;
    } catch (error) {
      console.error(
        "Error al cargar vehículos:",
        error
      );

      await this.showAlert(
        "Error",
        "No fue posible cargar los vehículos."
      );
    }
  }

  async loadMechanics(): Promise<void> {
    try {
      const response =
        await axios.get<{
          data: Mechanic[];
        }>(
          `${environment.apiUrl}/users`
        );

      this.mechanics =
        response.data.data;
    } catch (error) {
      console.error(
        "Error al cargar mecánicos:",
        error
      );

      await this.showAlert(
        "Error",
        "No fue posible cargar los mecánicos."
      );
    }
  }

  async loadWorkorder(): Promise<void> {
    if (!this.id) {
      return;
    }

    try {
      const response =
        await axios.get<{
          data: WorkorderDetail;
        }>(
          `${environment.apiUrl}/workorders/${this.id}`
        );

      const workorder =
        response.data.data;

      this.workorderForm.patchValue({
        vehicle_id:
          workorder.vehicle_id,

        mechanic_id:
          workorder.mechanic_id,

        mileage:
          workorder.mileage,

        status_id:
          workorder.status_id,

        delivery:
          workorder.delivery || "",
      });
    } catch (error) {
      console.error(
        "Error al cargar orden:",
        error
      );

      await this.showAlert(
        "Error",
        "No fue posible cargar la orden de trabajo."
      );
    }
  }

  getMechanicName(
    mechanic: Mechanic
  ): string {
    const name =
      `${mechanic.first_name || ""} ${
        mechanic.last_name || ""
      }`.trim();

    if (name) {
      return name;
    }

    if (mechanic.email) {
      return mechanic.email;
    }

    return `Mecánico #${mechanic.id}`;
  }

  getStatusName(
    statusId: number
  ): string {
    switch (statusId) {
      case 4:
        return "Recibida";

      case 5:
        return "Diagnóstico";

      case 6:
        return "Reparación";

      case 7:
        return "Lista";

      case 8:
        return "Entregada";

      default:
        return "Desconocido";
    }
  }

  getError(
    controlName: string
  ): string {
    const control =
      this.workorderForm.get(
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

  async saveWorkorder(): Promise<void> {
    if (
      this.workorderForm.invalid
    ) {
      this.workorderForm.markAllAsTouched();

      return;
    }

    this.saved = true;

    const values =
      this.workorderForm.value;

    const workorder:
      WorkorderCreate = {
      vehicle_id:
        Number(values.vehicle_id),

      mechanic_id:
        Number(values.mechanic_id),

      status_id:
        Number(values.status_id),

      mileage:
        Number(values.mileage),

      delivery:
        values.delivery || undefined,
    };

    try {
      if (
        this.isEdition &&
        this.id
      ) {
        await axios.patch(
          `${environment.apiUrl}/workorders/${this.id}`,
          workorder
        );
      } else {
        /*
         * Las nuevas órdenes comienzan
         * en estado 4: Recibida.
         */
        workorder.status_id = 4;

        await axios.post(
          `${environment.apiUrl}/workorders`,
          workorder
        );
      }

      await this.showAlert(
        this.isEdition
          ? "Orden actualizada"
          : "Orden guardada",

        this.isEdition
          ? "La orden de trabajo fue actualizada correctamente."
          : "La orden de trabajo fue guardada correctamente."
      );

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.error(
        "Error al guardar orden:",
        error
      );

      await this.showAlert(
        "Error",
        "No fue posible guardar la orden de trabajo. Revisa los datos, la conexión o los permisos de Directus."
      );
    } finally {
      this.saved = false;
    }
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