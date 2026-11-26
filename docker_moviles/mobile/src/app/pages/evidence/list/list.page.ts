import { Component, OnDestroy, OnInit } from '@angular/core';
import { EvidenceServices, Evidence } from 'src/app/services/evidences/evidences';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-evidence-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit, OnDestroy {
  evidences: Evidence[] = [];

  // Miniaturas autenticadas: evidence.path guarda el UUID del archivo.
  thumbs: Record<number, string> = {};

  thumbErrors: Record<number, string> = {};

  loading: boolean = false;
  loadError: boolean = false;

  constructor(
    private evidenceServices: EvidenceServices,
  ) {}

  ngOnInit() {
    this.chargerEvidences();
  }

  async chargerEvidences(): Promise<void> {
    this.loading = true;
    this.loadError = false;

    try {
      this.evidences = await firstValueFrom(this.evidenceServices.listWithOutFilters());

      await this.chargerThumbs();
    } catch (error) {

      this.loadError = true;
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.releaseThumbs();
  }

  hasFile(evidence: Evidence): boolean {
    return EvidenceServices.isFileReference(evidence.path);
  }

  // El navegador no puede decodificar HEIC/HEIF: se avisa y se ofrece la
  // descarga del archivo original en lugar de dejar una imagen rota.
  onThumbError(evidence: Evidence): void {
    this.thumbErrors[evidence.id] =
      'El navegador no puede mostrar este formato (HEIC/HEIF). Descarga el archivo para verlo.';
  }

  fileName(evidence: Evidence): string {
    return `evidencia-${evidence.id}.${evidence.format}`;
  }

  async retry(): Promise<void> {
    await this.chargerEvidences();
  }

  private async chargerThumbs(): Promise<void> {
    this.releaseThumbs();

    for (const evidence of this.evidences) {
      if (!EvidenceServices.isFileReference(evidence.path)) {
        continue;
      }

      try {
        this.thumbs[evidence.id] = await firstValueFrom(
          this.evidenceServices.assetObjectUrl(evidence.path),
        );
      } catch (error) {

        this.thumbErrors[evidence.id] =
          'No fue posible mostrar la vista previa de este archivo.';
      }
    }
  }

  private releaseThumbs(): void {
    Object.values(this.thumbs).forEach((url) => URL.revokeObjectURL(url));

    this.thumbs = {};
    this.thumbErrors = {};
  }
}