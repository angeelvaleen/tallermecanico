import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";

import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { firstValueFrom } from "rxjs";
import { EvidenceServices } from "src/app/services/evidences/evidences";

@Component({
  selector: "app-evidence-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage {

  @Input() workorderId?: number;

  @ViewChild("fileInput") fileInput?: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;

  uploading: boolean = false;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private evidenceServices: EvidenceServices,
  ) {}

  openFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!EvidenceServices.resolveFormat(file)) {
      this.selectedFile = null;
      input.value = "";

      void this.showAlert(
        "Formato no permitido",
        "Solo se aceptan imágenes JPEG, JPG, PNG, HEIC o HEIF.",
      );

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.selectedFile = null;
      input.value = "";

      void this.showAlert(
        "Archivo demasiado grande",
        "El tamaño máximo permitido es de 10 MB.",
      );

      return;
    }

    this.selectedFile = file;
  }

  async saveEvidence(): Promise<void> {
    if (!this.workorderId) {
      await this.showAlert("Error", "No se recibió la orden de trabajo.");
      return;
    }

    if (!this.selectedFile) {
      await this.showAlert("Evidencia requerida", "Selecciona una imagen antes de guardar.");
      return;
    }

    this.uploading = true;

    const loading = await this.loadingController.create({
      message: "Subiendo evidencia...",
      spinner: "crescent",
    });

    await loading.present();

    try {
      await firstValueFrom(
        this.evidenceServices.upload(this.workorderId, this.selectedFile),
      );

      await loading.dismiss();

      await this.showAlert("Evidencia guardada", "La evidencia fue cargada correctamente.");

      await this.modalController.dismiss({ saved: true });
    } catch (error: any) {
      console.error("Error al subir evidencia:", error);

      await loading.dismiss();

      // Los errores del servicio ya traen un mensaje en espanol (por ejemplo,
      // la referencia del archivo que quedo sin registrar). Los errores de
      // axios se muestran con el mensaje generico.
      const message =
        error?.isAxiosError || !error?.message
          ? "No fue posible subir la evidencia. Revisa la conexión, el formato y los permisos."
          : error.message;

      await this.showAlert("Error", message);
    } finally {
      this.uploading = false;
    }
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({ saved: false });
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ["Aceptar"],
    });

    await alert.present();
    await alert.onDidDismiss();
  }
}
