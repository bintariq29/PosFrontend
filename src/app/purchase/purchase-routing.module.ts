import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { PurchaseComponent } from "./purchase.component"

const routes: Routes = [
  {
    path: "",
    component: PurchaseComponent,
    pathMatch: "full"
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
