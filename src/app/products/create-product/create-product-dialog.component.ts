import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { finalize } from 'rxjs/operators';
import { BrandDto, BrandDtoPagedResultDto, BrandServiceProxy, CategoryDto, CategoryDtoPagedResultDto, CategoryServiceProxy, CreateProductDto, ImageServiceProxy, ProductServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../../shared/app-component-base';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-product-dialog',
  templateUrl: './create-product-dialog.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [ProductServiceProxy, BrandServiceProxy, CategoryServiceProxy, ImageServiceProxy]
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
    private _categoryService: CategoryServiceProxy,
    private _imageServiceProxy: ImageServiceProxy,
    private _cd: ChangeDetectorRef,
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
    this._cd.detectChanges();

  }

  loadCategories() {
    this._categoryService.getAll(undefined, 0, 1000).subscribe((result: CategoryDtoPagedResultDto) => {
      this.categories = result.items;
    });
    this._cd.detectChanges();

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {

        let base64String = e.target.result.toString();
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
