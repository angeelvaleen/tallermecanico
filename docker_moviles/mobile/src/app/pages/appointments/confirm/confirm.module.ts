import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ConfirmPage } from "./confirm.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],

  declarations: [
    ConfirmPage,
  ],

  exports: [
    ConfirmPage,
  ],
})
export class ConfirmPageModule {}