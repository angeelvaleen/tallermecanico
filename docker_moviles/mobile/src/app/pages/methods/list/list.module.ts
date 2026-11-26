import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';

import { FormPageModule } from '../form/form.module';

import { ToolbarModule } from 'src/app/components/toolbar/toolbar.module';

import { SearchbarModule } from 'src/app/components/searchbar/searchbar.module';

import { PaginationModule } from 'src/app/components/pagination/pagination.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    FormPageModule,
    ToolbarModule,
    SearchbarModule,
    PaginationModule
  ],
  declarations: [ListPage]
})
export class ListPageModule {}
