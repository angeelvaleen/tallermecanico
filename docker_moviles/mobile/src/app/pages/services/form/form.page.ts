import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

interface ServiceCreate {
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: "app-services-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  serviceForm!: FormGroup;
  saved: boolean = false;
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    name: {
      required: "Nombre es requerido",
      max: "El nombre no debe superar los 100 caracteres",
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
      await this.chargerService();
    }
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  private createForm() {
    this.serviceForm = this.formBuilder.group({
      name: ["",
        [(Validators.required, Validators.maxLength(100))]],
      price: [
        "",
        [(Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$"))],
      ],
      description:[''],
    });
  }

  getError(controlName: string): string {
    const control = this.serviceForm.get(controlName);

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

  async saveService(): Promise<void> {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.serviceForm.value;

    const service: ServiceCreate = {
      name: values.name.trim(),
      price: Number(values.price),
      description: values?.description.trim() ?? '',
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(`${environment.apiUrl}/services/${this.id}`, service, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/services`, service, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? "Servicio actualizado" : "Servicio guardado",
        message: this.isEdition
          ? "El servicio fue actualizado correctamente"
          : "El servicio fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? "Error al actualizar el servicio" : "Error al guardar el servicio",
        error,
      );

      const alert = await this.alertController.create({
        header: "Error",
        message: this.isEdition
          ? "No fue posible actualizar el servicio, Revisar los datos, la conexion o los permisos de directus"
          : "No fue posible guardar el servicio, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerService(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: { id: number; name: string; price: number; description: string } }>(
        `${environment.apiUrl}/services/${this.id}`,
      );

      const service = response.data.data;

      this.serviceForm.patchValue({
        name: service.name,
        price: service.price,
        description: service.description,
      });
    } catch (error) {
      console.log("Error al cargar el servicio", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible cargar los datos del servicio, Revisar la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
