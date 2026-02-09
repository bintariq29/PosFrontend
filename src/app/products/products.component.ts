import { Component, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { finalize } from 'rxjs/operators';
import { CreateProductDialogComponent } from './create-product/create-product-dialog.component';
import { EditProductDialogComponent } from './edit-product/edit-product-dialog.component';
import { LazyLoadEvent } from 'primeng/api';
import { BrandServiceProxy, CategoryServiceProxy, ProductDto, ProductDtoPagedResultDto, ProductServiceProxy } from '../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../shared/app-component-base';
import { appModuleAnimation } from '../../shared/animations/routerTransition';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { Console } from 'console';
import { result } from '@node_modules/@types/lodash';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  animations: [appModuleAnimation()],
  standalone: true,
  imports: [FormsModule, CommonModule, DataViewModule],
  providers: [ProductServiceProxy, BrandServiceProxy, CategoryServiceProxy]
})
export class ProductsComponent extends AppComponentBase implements OnInit {
  products: ProductDto[] = [];
  keyword = '';
  loading = false;
  totalItems = 0;

  constructor(
    injector: Injector,
    private _productService: ProductServiceProxy,
    private _modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts(event?: LazyLoadEvent): void {
    this._productService.getAll(
      this.keyword,
      0,
      10
    ).pipe(
      finalize(() => {
        this.loading = false;
        this.cd.markForCheck();
      })
    ).subscribe((result: ProductDtoPagedResultDto) => {
      this.products = result.items;
      this.totalItems = result.totalCount;
    });

  }



  refresh(): void {
    this.getAllProducts();
  }



  createProduct(): void {
  }

  editProduct(product: ProductDto): void {
  }



  onSearch(): void {
    this.refresh();
  }
}
