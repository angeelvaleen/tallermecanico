import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { firstValueFrom } from "rxjs";
import { EvidenceServices, Evidence } from "src/app/services/evidences/evidences";

@Component({
  selector: "app-evidences-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit, OnDestroy {
  evidence: Evidence | null = null;
  messageError: string = "";

  // URL temporal del archivo descargado con autenticación.
  imageUrl: string | null = null;

  // El navegador no puede decodificar HEIC/HEIF: se conserva el archivo y se
  // ofrece la descarga en lugar de dejar un hueco en la tarjeta.
  imageError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private evidenceServices: EvidenceServices,
  ) {}

  ngOnInit() {
    this.chargerEvidence();
  }

  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }

  isImageReference(): boolean {
    return EvidenceServices.isFileReference(this.evidence?.path);
  }

  onImageError(): void {
    this.imageError = true;
  }

  downloadName(): string {
    return `evidencia-${this.evidence?.id}.${this.evidence?.format}`;
  }

  async chargerEvidence(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.messageError = "No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando evidencia...",
      spinner: "bubbles",
    });

    await loading.present();

    try {
      this.evidence = await firstValueFrom(this.evidenceServices.detail(Number(id)));

      if (this.isImageReference()) {
        try {
          this.imageUrl = await firstValueFrom(
            this.evidenceServices.assetObjectUrl(this.evidence!.path),
          );
        } catch (assetError) {
        }
      }
    } catch (error) {
      this.messageError = "No se pudo cargar la evidencia. Revisa el ID, la conexión y los permisos de lectura.";
    } finally {
      await loading.dismiss();
    }
  }
}
