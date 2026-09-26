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

interface DiagnosisCreate {
  workorder_id: number;
  description: string;
  result?: string;
}

interface Diagnosis {
  id: number;
  workorder_id: number;
  description: string;
  result: string;
  created_at: string;
}

@Component({
  selector: "app-diagnoses-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {

  @Input() workorderId?: number;

  @Input() id?: number;

  diagnosisForm!: FormGroup;

  saved: boolean = false;

  isEdition: boolean = false;

  validatorsMessage: Record<
    string,
    Record<string, string>
  > = {

    workorder_id: {
      required: "La orden es requerida",

      pattern:
        "La orden debe ser un número entero y positivo",
    },

    description: {
      required:
        "La descripción es requerida",
    },
  };

  constructor(
    private formBuilder: FormBuilder,

    private alertController: AlertController,

    private modalController: ModalController,
  ) {}

  ngOnInit() {

    this.isEdition =
      this.id !== undefined;

    this.createForm();

    if (this.workorderId !== undefined) {

      const control =
        this.diagnosisForm.get(
          "workorder_id",
        );

      control?.setValue(
        this.workorderId,
      );

      control?.disable();
    }

    if (this.isEdition) {
      this.loadDiagnosis();
    }
  }

  private createForm(): void {

    this.diagnosisForm =
      this.formBuilder.group({

        workorder_id: [
          "",
          [
            Validators.required,

            Validators.pattern(
              "^[1-9][0-9]*$",
            ),
          ],
        ],

        description: [
          "",
          [
            Validators.required,
          ],
        ],

        result: [
          "",
        ],
      });
  }

  private async loadDiagnosis(): Promise<void> {

    if (this.id === undefined) {
      return;
    }

    try {

      const response =
        await axios.get<{
          data: Diagnosis;
        }>(
          `${environment.apiUrl}/diagnoses/${this.id}`,
        );

      const diagnosis =
        response.data.data;

      this.diagnosisForm.patchValue({

        workorder_id:
          diagnosis.workorder_id,

        description:
          diagnosis.description,

        result:
          diagnosis.result || "",
      });

      if (
        this.workorderId !== undefined
      ) {

        this.diagnosisForm
          .get("workorder_id")
          ?.disable();
      }

    } catch (error) {

      console.log(
        "Error al cargar diagnóstico",
        error,
      );

      const alert =
        await this.alertController.create({
          header: "Error",

          message:
            "No fue posible cargar el diagnóstico.",

          buttons: ["Aceptar"],
        });

      await alert.present();
    }
  }

  getError(
    controlName: string,
  ): string {

    const control =
      this.diagnosisForm.get(
        controlName,
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
      Object.keys(
        control.errors,
      )[0];

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

  async saveDiagnosis(): Promise<void> {

    if (
      this.diagnosisForm.invalid
    ) {

      this.diagnosisForm
        .markAllAsTouched();

      return;
    }

    this.saved = true;

    const values =
      this.diagnosisForm
        .getRawValue();

    const diagnosis:
      DiagnosisCreate = {

      workorder_id:
        Number(
          values.workorder_id,
        ),

      description:
        values.description.trim(),

      result:
        values.result
          ? values.result.trim()
          : "",
    };

    try {

      if (this.isEdition) {

        await axios.patch(
          `${environment.apiUrl}/diagnoses/${this.id}`,
          diagnosis,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

      } else {

        await axios.post(
          `${environment.apiUrl}/diagnoses`,
          diagnosis,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );
      }

      const alert =
        await this.alertController.create({

          header:
            this.isEdition
              ? "Diagnóstico actualizado"
              : "Diagnóstico guardado",

          message:
            this.isEdition
              ? "El diagnóstico fue actualizado exitosamente."
              : "El diagnóstico fue guardado exitosamente.",

          buttons: ["Aceptar"],
        });

      await alert.present();

      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });

    } catch (error) {

      console.log(
        "Error al guardar diagnóstico",
        error,
      );

      const alert =
        await this.alertController.create({

          header: "Error",

          message:
            "No fue posible guardar el diagnóstico. Revisar los datos, la conexión o los permisos de Directus.",

          buttons: ["Aceptar"],
        });

      await alert.present();

    } finally {

      this.saved = false;
    }
  }
}