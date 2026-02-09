import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { finalize } from 'rxjs/operators';
import { BrandDto, BrandDtoPagedResultDto, BrandServiceProxy, CategoryDto, CategoryDtoPagedResultDto, CategoryServiceProxy, CreateProductDto, ProductServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../../shared/app-component-base';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-product-dialog',
  templateUrl: './create-product-dialog.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [ProductServiceProxy, BrandServiceProxy, CategoryServiceProxy]
})
export class CreateProductDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  product: CreateProductDto = new CreateProductDto();
  brands: BrandDto[] = [];
  categories: CategoryDto[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _brandService: BrandServiceProxy,
    private _categoryService: CategoryServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.product.isActive = true;
    this.product.isPerishable = false;
    this.loadBrands();
    this.loadCategories();
  }

  loadBrands() {
    this._brandService.getAll(undefined, 0, 1000).subscribe((result: BrandDtoPagedResultDto) => {
      this.brands = result.items;
    });
  }

  loadCategories() {
    this._categoryService.getAll(undefined, 0, 1000).subscribe((result: CategoryDtoPagedResultDto) => {
      this.categories = result.items;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Remove 'data:image/png;base64,' prefix if desired, or keep it depending on backend expectation.
        // Usually backend expects just the base64 string without prefix if it's explicitly byte[] mapping, 
        // but if it's string (as in UpdateProductDto), it might handle it or need stripping.
        // Start with stripping the prefix for standard byte[] compatibility via base64 string.
        let base64String = e.target.result.toString();
        // Simple strip of metadata
        if (base64String.indexOf(',') > 0) {
          base64String = base64String.split(',')[1];
        }
        this.product.image = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  save(): void {
    this.saving = true;

    this._productService
      .create(this.product)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
