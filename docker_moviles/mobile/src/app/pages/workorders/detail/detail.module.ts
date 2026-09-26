import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DetailPageRoutingModule } from "./detail-routing.module";

import { DetailPage } from "./detail.page";

import { FormPageModule as DiagnosisFormPageModule } from "../../diagnoses/form/form.module";

import { FormPageModule as EvidenceFormPageModule } from "../../evidence/form/form.module";

import { FormPageModule as QuoteFormPageModule } from "../../quotes/form/form.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    DiagnosisFormPageModule,
    EvidenceFormPageModule,
    QuoteFormPageModule,
  ],

  declarations: [
    DetailPage,
  ],
})
export class DetailPageModule {}