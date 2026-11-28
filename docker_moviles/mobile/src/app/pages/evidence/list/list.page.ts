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
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = '';

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
      this.total = await firstValueFrom(this.evidenceServices.total(this.search));
      this.adjustCurrentPage();
      await this.loadEvidences();
    } catch (error) {

      this.loadError = true;
    } finally {
      this.loading = false;
    }
  }

  private async loadEvidences(): Promise<void> {
    this.evidences = await firstValueFrom(
      this.evidenceServices.list(this.currentPage, this.perPage, this.search),
    );

    await this.chargerThumbs();
  }

  private adjustCurrentPage(): void {
    const totalPages = Math.ceil(this.total / this.perPage);

    if (totalPages === 0) {
      this.currentPage = 1;
      return;
    }

    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  async changePage(page: number): Promise<void> {
    this.currentPage = page;
    this.loading = true;
    this.loadError = false;

    try {
      await this.loadEvidences();
    } catch (error) {
      this.loadError = true;
    } finally {
      this.loading = false;
    }
  }

  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerEvidences();
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
