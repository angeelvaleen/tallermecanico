import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

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
export class FormPage implements OnInit {
  @Input() id?: number;

  workorderForm!: FormGroup;
  saved: boolean = false;
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    vehicle_id: {
      required: "El vehiculo es requerido",
      pattern: "El vehiculo debe ser un numero entero y positivo",
    },
    mechanic_id: {
      required: "El mecanico es requerido",
      pattern: "El mecanico debe ser un numero entero y positivo",
    },
    mileage: {
      required: "El kilometraje es requerido",
      min:"El kilometraje debe ser mayor o igual que 0",
      pattern:"El kilometraje debe tener 1 o hasta 6 digitos y positivo"
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
      await this.chargerWorkorder();
    }
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  private createForm() {
    this.workorderForm = this.formBuilder.group({
      vehicle_id: [
        "",
        [(Validators.required, Validators.pattern("^[1-9][0-9]*$"))],
      ],
      mechanic_id: ["",
        [(Validators.required, Validators.pattern("^[1-9][0-9]*$"))]],
      mileage: ["",
        [(Validators.required,Validators.min(0),Validators.pattern('^(0|[1-9]\\d{0,5})$'))]
      ],
    });
  }

  getError(controlName: string): string {
    const control = this.workorderForm.get(controlName);

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

  async saveWorkorder(): Promise<void> {
    if (this.workorderForm.invalid) {
      this.workorderForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.workorderForm.value;

    const workorder: WorkorderCreate = {
      vehicle_id: Number(values.vehicle_id),
      mechanic_id: Number(values.mechanic_id),
      status_id: 4,
      mileage: Number(values.mileage),
      
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(`${environment.apiUrl}/workorders/${this.id}`, {
          vehicle_id: workorder.vehicle_id,
          mechanic_id: workorder.mechanic_id,
          mileage: workorder.mileage,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/workorders`, workorder, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? "Orden actualizada" : "Orden guardado",
        message: this.isEdition
          ? "La orden fue actualizada correctamente"
          : "La orden fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? "Error al actualizar la orden" : "Error al guardar la orden",
        error,
      );

      const alert = await this.alertController.create({
        header: "Error",
        message: this.isEdition
          ? "No fue posible actualizar la orden, Revisar los datos, la conexion o los permisos de directus"
          : "No fue posible guardar la orden, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerWorkorder(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: { id: number; vehicle_id: number; mechanic_id: number; mileage: number } }>(
        `${environment.apiUrl}/workorders/${this.id}`,
      );

      const workorder = response.data.data;

      this.workorderForm.patchValue({
        vehicle_id: workorder.vehicle_id,
        mechanic_id: workorder.mechanic_id,
        mileage: workorder.mileage,
      });
    } catch (error) {
      console.log("Error al cargar la orden", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible cargar los datos de la orden, Revisar la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
