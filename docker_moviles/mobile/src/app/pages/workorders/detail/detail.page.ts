import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { firstValueFrom } from 'rxjs';

import { FormPage as DiagnosisFormPage } from "../../diagnoses/form/form.page";
import { FormPage as EvidenceFormPage } from "../../evidence/form/form.page";
import { FormPage as QuoteFormPage } from "../../quotes/form/form.page";
import { WorkorderDetail,WorkorderServices } from "src/app/services/workorders/workorders";
import { Diagnosis,DiagnosisServices } from "src/app/services/diagnoses/diagnoses";
import { Evidence,EvidenceServices } from "src/app/services/evidences/evidences";
import { QuoteWorkorder, QuoteServices } from "src/app/services/quotes/quotes";




@Component({
  selector: "app-workorders-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  workorder: WorkorderDetail | null = null;

  diagnoses: Diagnosis[] = [];

  evidences: Evidence[] = [];

  quotes: QuoteWorkorder[] = [];

  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController,
    private workorderServices: WorkorderServices,
    private quoteServices: QuoteServices,
    private diagnosisServices: DiagnosisServices,
    private evidenceServices: EvidenceServices,
  ) {}

  ngOnInit() {
    this.chargerWorkorder();
  }

  async ionViewWillEnter(): Promise<void> {
    if (!this.workorder) {
      return;
    }

    await Promise.all([
      this.chargerDiagnoses(),
      this.chargerEvidences(),
      this.chargerQuotes(),
    ]);
  }

  async chargerWorkorder(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.messageError = "No se proporcionó ID";
      return;
    }

    const loading = await this.loading.create({
      message: "Cargando orden de trabajo...",
      spinner: "crescent",
    });

    await loading.present();

    try {

      this.workorder = await firstValueFrom(this.workorderServices.detail(Number(id)));
      console.log(this.workorder);

      await Promise.all([
        this.chargerDiagnoses(),
        this.chargerEvidences(),
        this.chargerQuotes(),
      ]);

      console.log(this.workorder);
    } catch (error) {
      this.messageError =
        "Revisar ID, conexión a la base de datos o permisos";

      console.log(
        "Error al cargar detalle de orden de trabajo",
        error,
      );
    } finally {
      await loading.dismiss();
    }
  }

  async chargerDiagnoses(): Promise<void> {
    if (!this.workorder) {
      return;
    }

    try {
      this.diagnoses = await firstValueFrom(this.diagnosisServices.ofWorkorder(Number(this.workorder.id)));
    } catch (error) {
      console.log(
        "Error al cargar diagnósticos",
        error,
      );

      this.diagnoses = [];
    }
  }

  async chargerEvidences(): Promise<void> {
    if (!this.workorder) {
      return;
    }

    try {
      this.evidences = await firstValueFrom(this.evidenceServices.ofWorkorder(Number(this.workorder.id)));
    } catch (error) {
      console.log(
        "Error al cargar evidencias",
        error,
      );

      this.evidences = [];
    }
  }

  async chargerQuotes(): Promise<void> {
    if (!this.workorder) {
      return;
    }

    try {
      this.quotes = await firstValueFrom(this.quoteServices.ofWorkorder(Number(this.workorder.id)));
    } catch (error) {
      console.log(
        "Error al cargar cotizaciones",
        error,
      );

      this.quotes = [];
    }
  }

  async addDiagnosis(): Promise<void> {
    if (!this.workorder) {
      return;
    }

    const modal = await this.modalController.create({
      component: DiagnosisFormPage,
      componentProps: {
        workorderId: this.workorder.id,
      },
      cssClass: "workorder-form-modal",
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95,
      handle: true,
    });

    await modal.present();

    const result = await modal.onDidDismiss();

    if (result.data?.saved) {
      await this.chargerDiagnoses();
    }
  }

  async editDiagnosis(diagnosis: Diagnosis): Promise<void> {
    const modal = await this.modalController.create({
      component: DiagnosisFormPage,
      componentProps: {
        id: diagnosis.id,
      },
      cssClass: "workorder-form-modal",
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95,
      handle: true,
    });

    await modal.present();

    const result = await modal.onDidDismiss();

    if (result.data?.saved) {
      await this.chargerDiagnoses();
    }
  }

  async addEvidence(): Promise<void> {
    if (!this.workorder) {
      return;
    }

    const modal = await this.modalController.create({
      component: EvidenceFormPage,
      componentProps: {
        workorderId: this.workorder.id,
      },
      cssClass: "workorder-form-modal",
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95,
      handle: true,
    });

    await modal.present();

    const result = await modal.onDidDismiss();

    if (result.data?.saved) {
      await this.chargerEvidences();
    }
  }

  getQuoteStatusId(quote: QuoteWorkorder): number {
    if (typeof quote.status_id === "number") {
      return quote.status_id;
    }

    return quote.status_id?.id ?? 0;
  }

  getQuoteStatusName(quote: QuoteWorkorder): string {
    const statusId = this.getQuoteStatusId(quote);

    switch (statusId) {
      case 9:
        return "Pendiente";

      case 10:
        return "Aprobada";

      case 11:
        return "Rechazada";

      default:
        return "Desconocido";
    }
  }

  getQuoteStatusColor(quote: QuoteWorkorder): string {
    const statusId = this.getQuoteStatusId(quote);

    switch (statusId) {
      case 9:
        return "warning";

      case 10:
        return "success";

      case 11:
        return "danger";

      default:
        return "medium";
    }
  }

  canCreateQuote(): boolean {
    return !this.quotes.some(
      (quote) => this.getQuoteStatusId(quote) === 9,
    );
  }

  async createQuote(): Promise<void> {
    if (!this.workorder) {
      return;
    }

    if (!this.canCreateQuote()) {
      const alert = await this.alertController.create({
        header: "Cotización pendiente",
        message:
          "No se puede crear una nueva cotización mientras exista una cotización pendiente de respuesta.",
        buttons: ["Aceptar"],
      });

      await alert.present();

      return;
    }

    const modal = await this.modalController.create({
      component: QuoteFormPage,
      componentProps: {
        workorderId: this.workorder.id,
      },
      cssClass: "workorder-form-modal",
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95,
      handle: true,
    });

    await modal.present();

    const result = await modal.onDidDismiss();

    if (result.data?.saved) {
      await this.chargerQuotes();
    }
  }
}