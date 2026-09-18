import { Component, OnInit } from "@angular/core";
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
  workorderForm!: FormGroup;
  saved: boolean = false;

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

  ngOnInit() {
    this.createForm();
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
      await axios.post(`${environment.apiUrl}/workorders`, workorder, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const alert = await this.alertController.create({
        header: "Orden guardado",
        message: "La orden fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log("Error al guardar la orden", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible guardar la orden, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }
}
