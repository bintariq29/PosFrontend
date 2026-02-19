import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { PurchaseComponent } from './purchase.component';


@NgModule({
  declarations: [


  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    BsDropdownModule.forRoot(),
    CreatePurchaseComponent,
    PurchaseComponent
  ]
})
export class PurchaseModule { }
