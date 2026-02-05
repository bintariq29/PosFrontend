import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsComponent } from './brands.component'
import { BrandsRoutingModule } from './brands-routing.module';
import { BrandServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    BrandsRoutingModule,
    BrandsComponent,
  ],
  providers: [BrandServiceProxy, BsModalService]
})
export class BrandsModule { }
