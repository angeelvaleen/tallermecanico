import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, ModalController } from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

interface DiagnosisCreate {
  workorder_id: number;
  description: string;
  result: string;
}

@Component({
  selector: "app-diagnoses-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {
  diagnosisForm!: FormGroup;
  saved: boolean = false;

  validatorsMessage: Record<string, Record<string, string>> = {
    workorder_id: {
      required: "La order es requerida",
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
      await axios.post(`${environment.apiUrl}/diagnoses`, diagnosis, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const alert = await this.alertController.create({
        header: "Diagnostico guardado",
        message: "El diagnostico fue guardada exitosamente",
        buttons: ["Aceptar"],
      });

      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });
    } catch (error) {
      console.log("Error al guardar el diagnostico", error);

      const alert = await this.alertController.create({
        header: "Error",
        message:
          "No fue posible guardar el diagnostico, Revisar los datos, la conexion o los permisos de directus",
        buttons: ["Aceptar"],
      });

      await alert.present();
    } finally {
      this.saved = false;
    }
  }
}
