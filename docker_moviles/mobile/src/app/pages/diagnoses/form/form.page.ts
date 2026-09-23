import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

interface DiagnosisCreate {
  workorder_id: number;
  description: string;
  result?: string;
}

@Component({
  selector: "app-diagnoses-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  @Input() id?: number;

  diagnosisForm!: FormGroup;
  saved: boolean = false;
  charging: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    workorder_id: {
      required: "La order es requerida",
      pattern:"La orden debe ser un numero entero y positivo"
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

  async ngOnInit() {
    this.createForm();

    if (this.isEdition) {
      await this.chargerDiagnosis();
    }
  }

  get isEdition(): boolean {
    return this.id !== undefined;
  }

  private createForm() {
    this.diagnosisForm = this.formBuilder.group({
      workorder_id: ["", 
        [(Validators.required, Validators.pattern("^[1-9][0-9]*$"))]],
      description: [
        "",
        [Validators.required],
      ],
      result: [""],
    });
  }

  getError(controlName: string): string {
    const control = this.diagnosisForm.get(controlName);

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

  async saveDiagnosis(): Promise<void> {
    if (this.diagnosisForm.invalid) {
      this.diagnosisForm.markAllAsTouched();
      return;
    }

    this.saved = true;

    const values = this.diagnosisForm.value;

    const diagnosis: DiagnosisCreate = {
      workorder_id: Number(values.workorder_id),
      description: values.description.trim(),
      result: values?.result.trim() ?? "",
    };

    try {
      if (this.isEdition && this.id !== undefined) {
        await axios.patch(`${environment.apiUrl}/diagnoses/${this.id}`, diagnosis, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await axios.post(`${environment.apiUrl}/diagnoses`, diagnosis, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const alert = await this.alertController.create({
        header: this.isEdition ? "Diagnostico actualizado" : "Diagnostico guardado",
        message: this.isEdition
          ? "El diagnostico fue actualizado correctamente"
          : "El diagnostico fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log(
        this.isEdition ? "Error al actualizar el diagnostico" : "Error al guardar el diagnostico",
        error,
      );

      const alert = await this.alertController.create({
        header: "Error",
        message: this.isEdition
          ? "No fue posible actualizar el diagnostico, Revisar los datos, la conexion o los permisos de directus"
          : "No fue posible guardar el diagnostico, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }

  async chargerDiagnosis(): Promise<void> {
    if (this.id === undefined) {
      return;
    }

    this.charging = true;

    try {
      const response = await axios.get<{ data: { id: number; workorder_id: number; description: string; result: string } }>(
        `${environment.apiUrl}/diagnoses/${this.id}`,
      );

      const diagnosis = response.data.data;

      this.diagnosisForm.patchValue({
        workorder_id: diagnosis.workorder_id,
        description: diagnosis.description,
        result: diagnosis.result,
      });
    } catch (error) {
      console.log("Error al cargar el diagnostico", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible cargar los datos del diagnostico, Revisar la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.charging = false;
    }
  }
}
