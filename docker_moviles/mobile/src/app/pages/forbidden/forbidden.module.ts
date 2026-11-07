import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ForbiddenPageRoutingModule } from './forbidden-routing.module';
import { ForbiddenPage } from './forbidden.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ForbiddenPageRoutingModule
  ],
  declarations: [
    ForbiddenPage
  ]
})
export class ForbiddenPageModule {}