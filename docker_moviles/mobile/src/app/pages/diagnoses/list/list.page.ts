import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { firstValueFrom } from 'rxjs';
import { DiagnosisServices, Diagnosis } from "src/app/services/diagnoses/diagnoses";
import { FormPage } from "../form/form.page";



@Component({
  selector: "app-diagnoses-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: false,
})
export class ListPage {
  diagnoses: Diagnosis[] = [];
  total: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  search: string = '';

  loading: boolean = false;
  loadError: boolean = false;

  constructor(
    private modalController: ModalController,
    private diagnosesServices: DiagnosisServices,
  ) {}

  async ionViewWillEnter(): Promise<void> {
    await this.chargerDiagnoses();
  }

  async chargerDiagnoses(): Promise<void> {
    this.loading = true;
    this.loadError = false;

    try {
      await this.chargerTotal();
      this.adjustCurrentPage();
      await this.loadDiagnoses();
    } catch (error) {
      this.total = 0;
      this.diagnoses = [];
      this.loadError = true;
    } finally {
      this.loading = false;
    }
  }

  private async chargerTotal(): Promise<void> {
    this.total = await firstValueFrom(this.diagnosesServices.total(this.search));
  }

  private async loadDiagnoses(): Promise<void> {
    try {
      this.diagnoses = await firstValueFrom(
        this.diagnosesServices.list(this.currentPage, this.perPage, this.search),
      );
    } catch (error) {
      this.diagnoses = [];
      this.loadError = true;
    }
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
      await this.loadDiagnoses();
    } finally {
      this.loading = false;
    }
  }

  async handleInput(text: string): Promise<void> {
    this.search = text;
    this.currentPage = 1;
    await this.chargerDiagnoses();
  }

  async retry(): Promise<void> {
    await this.chargerDiagnoses();
  }

  async createDiagnosis(): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerDiagnoses();
    }
  }

  async editDiagnosis(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: FormPage,
      componentProps: {
        id,
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.saved) {
      await this.chargerDiagnoses();
    }
  }
}
