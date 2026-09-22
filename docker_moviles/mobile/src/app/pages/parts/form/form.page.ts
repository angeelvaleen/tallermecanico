import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

interface PartCreate {
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: "app-parts-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  partForm!: FormGroup;
  saved: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    name: {
      required: "La order es requerida",
    },
    price: {
      required: "Precio es requerido",
      min: "El precio debe ser mayor o igual que cero",
      pattern: "El precio es invalido",
    },
    description: {
      required: "La descripcion es requerida",
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
    this.partForm = this.formBuilder.group({
      name: [
        "",
        [(Validators.required)],
      ],
      price: [
        "",
        [(Validators.required, Validators.min(0), Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$"))],
      ],
      description: [
        "",
        [
          (Validators.required),
        ],
      ],
    });
  }

  getError(controlName: string): string {
    const control = this.partForm.get(controlName);

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
    if (this.partForm.invalid) {
      this.partForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.partForm.value;

    const part: PartCreate = {
      name: values.name.trim(),
      price: Number(values.price),
      description: values.description.trim(),
    };

    try {
      await axios.post(`${environment.apiUrl}/parts`, part, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const alert = await this.alertController.create({
        header: "Refaccion guardado",
        message: "La refaccion fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log("Error al guardar la refaccion", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible guardar la refaccion, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }
}
