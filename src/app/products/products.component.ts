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

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  animations: [appModuleAnimation()],
  standalone:true,
  imports:[FormsModule,CommonModule,DataViewModule],
  providers:[ProductServiceProxy,BrandServiceProxy,CategoryServiceProxy]
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
    // Initial load will be triggered by p-dataView lazy load or explicitly
  }

  getDataPage(event?: LazyLoadEvent): void {
    this.loading = true;
    const skipCount = event?.first || 0;
    const maxResultCount = event?.rows || 10;

    this._productService
      .getAll(
        this.keyword,
        skipCount,
        maxResultCount
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck();
        })
      )
      .subscribe((result: ProductDtoPagedResultDto) => {
        this.products = result.items;
        this.totalItems = result.totalCount;
        this.cd.markForCheck();
      });
  }

  refresh(): void {
    this.getDataPage({ first: 0, rows: 10 });
  }

  delete(product: ProductDto): void {
    abp.message.confirm(
      this.l('ProductDeleteWarningMessage', product.sku),
      undefined,
      (result: boolean) => {
        if (result) {
          this._productService.delete(product.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  createProduct(): void {
    this.showCreateOrEditProductDialog();
  }

  editProduct(product: ProductDto): void {
    this.showCreateOrEditProductDialog(product.id);
  }

  private showCreateOrEditProductDialog(id?: number): void {
    let createOrEditProductDialog: BsModalRef;
    if (!id) {
      createOrEditProductDialog = this._modalService.show(
        CreateProductDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditProductDialog = this._modalService.show(
        EditProductDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditProductDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  onSearch(): void {
    this.refresh();
  }
}
