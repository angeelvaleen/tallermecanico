import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { FormPageModule } from '../form/form.module';

import { ToolbarModule } from 'src/app/components/toolbar/toolbar.module';

import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { SearchbarModule } from 'src/app/components/searchbar/searchbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    FormPageModule,
    ToolbarModule,
    PaginationModule,
    SearchbarModule
  ],
  declarations: [ListPage]
})
export class ListPageModule {}
