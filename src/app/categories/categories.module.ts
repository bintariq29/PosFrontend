import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryServiceProxy } from '@shared/service-proxies/service-proxies';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoriesRoutingModule
  ],
  providers: [CategoryServiceProxy]
})
export class CategoriesModule { }
