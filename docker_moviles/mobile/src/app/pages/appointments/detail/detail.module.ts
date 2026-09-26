import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DetailPageRoutingModule } from "./detail-routing.module";

import { DetailPage } from "./detail.page";

import { FormPageModule } from "../form/form.module";
import { ConfirmPageModule } from "../confirm/confirm.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    FormPageModule,
    ConfirmPageModule,
  ],
  declarations: [DetailPage],
})
export class DetailPageModule {}