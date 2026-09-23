import { Component, Input, OnInit } from "@angular/core";
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
  @Input() id?: number;

  partForm!: FormGroup;
  saved: boolean = false;
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    name: {
      required: "El nombre es requerido",
    },
    price: {
      required: "Precio es requerido",
      min: "El precio debe ser mayor o igual que cero",
      pattern: "El precio es invalido",
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
      await this.chargerPart();
    }
  }

  get isEdition(): boolean {
    return this.id !== undefined;
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
        ""
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

  async savePart(): Promise<void> {
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
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(`${environment.apiUrl}/parts/${this.id}`, part, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/parts`, part, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? "Refaccion actualizada" : "Refaccion guardado",
        message: this.isEdition
          ? "La refaccion fue actualizada correctamente"
          : "La refaccion fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? "Error al actualizar la refaccion" : "Error al guardar la refaccion",
        error,
      );

      const alert = await this.alertController.create({
        header: "Error",
        message: this.isEdition
          ? "No fue posible actualizar la refaccion, Revisar los datos, la conexion o los permisos de directus"
          : "No fue posible guardar la refaccion, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerPart(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: { id: number; name: string; price: number; description: string } }>(
        `${environment.apiUrl}/parts/${this.id}`,
      );

      const part = response.data.data;

      this.partForm.patchValue({
        name: part.name,
        price: part.price,
        description: part.description,
      });
    } catch (error) {
      console.log("Error al cargar la refaccion", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible cargar los datos de la refaccion, Revisar la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
