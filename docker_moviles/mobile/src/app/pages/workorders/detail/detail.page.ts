import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import axios from "axios";
import { environment } from "src/environments/environment";

import { FormPage as DiagnosisFormPage } from "../../diagnoses/form/form.page";
import { FormPage as EvidenceFormPage } from "../../evidence/form/form.page";
import { FormPage as QuoteFormPage } from "../../quotes/form/form.page";

interface Workorder {
  id: number;
  vehicle_id: number;
  mechanic_id: number;
  status_id: number;
  mileage: number;
  delivery: string;
  created_at: string;
}

interface Diagnosis {
  id: number;
  workorder_id: number;
  description: string;
  result: string;
  created_at: string;
}

interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  created_at: string;
}

interface QuoteStatus {
  id: number;
  name: string;
}

interface Quote {
  id: number;
  workorder_id: number;
  user_id: number;
  status_id: number | QuoteStatus;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
  created_at: string;
}

@Component({
  selector: "app-workorders-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
  standalone: false,
})
export class DetailPage implements OnInit {
  workorder: Workorder | null = null;

  diagnoses: Diagnosis[] = [];

  evidences: Evidence[] = [];

  quotes: Quote[] = [];

  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController,
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
      const response = await axios.get<{ data: Workorder }>(
        `${environment.apiUrl}/workorders/${encodeURIComponent(id)}`,
      );

      this.workorder = response.data.data;

      await Promise.all([
        this.chargerDiagnoses(),
        this.chargerEvidences(),
        this.chargerQuotes(),
      ]);
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
      const response = await axios.get<{
        data: Diagnosis[];
      }>(
        `${environment.apiUrl}/diagnoses?filter[workorder_id][_eq]=${this.workorder.id}`,
      );

      this.diagnoses = response.data.data;
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
      const response = await axios.get<{
        data: Evidence[];
      }>(
        `${environment.apiUrl}/evidence?filter[workorder_id][_eq]=${this.workorder.id}`,
      );

      this.evidences = response.data.data;
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
      const response = await axios.get<{
        data: Quote[];
      }>(
        `${environment.apiUrl}/quotes?filter[workorder_id][_eq]=${this.workorder.id}&fields=*,status_id.*`,
      );

      this.quotes = response.data.data;
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

  getQuoteStatusId(quote: Quote): number {
    if (typeof quote.status_id === "number") {
      return quote.status_id;
    }

    return quote.status_id?.id ?? 0;
  }

  getQuoteStatusName(quote: Quote): string {
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

  getQuoteStatusColor(quote: Quote): string {
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