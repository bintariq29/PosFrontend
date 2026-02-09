import { NgModule } from '@angular/core';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { CreateProductDialogComponent } from './create-product/create-product-dialog.component';
import { EditProductDialogComponent } from './edit-product/edit-product-dialog.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'primeng/api';
import { BrandServiceProxy, CategoryServiceProxy, ProductServiceProxy } from '../../shared/service-proxies/service-proxies';

@NgModule({

  imports: [
    SharedModule,
    ProductsRoutingModule,
    DataViewModule,
    ProductsComponent,
  ],
  providers:[ProductServiceProxy,CategoryServiceProxy,BrandServiceProxy]
})
export class ProductsModule { }
