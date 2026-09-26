import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ListPageRoutingModule } from "./list-routing.module";

import { ListPage } from "./list.page";

import { FormPageModule } from "../form/form.module";
import { ConfirmPageModule } from "../confirm/confirm.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    FormPageModule,
    ConfirmPageModule,
  ],
  declarations: [ListPage],
})
export class ListPageModule {}