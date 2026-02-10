import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { finalize } from 'rxjs/operators';
import { BrandDto, BrandDtoPagedResultDto, BrandServiceProxy, CategoryDto, CategoryDtoPagedResultDto, CategoryServiceProxy, CreateImageDto, CreateProductDto, ImageServiceProxy, ProductServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../../shared/app-component-base';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotifyService } from '@node_modules/abp-ng2-module';

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
  imageDto: CreateImageDto = new CreateImageDto();
  brands: BrandDto[] = [];
  categories: CategoryDto[] = [];
  private MaxImageSizeInBytes: number = 2 * 1024 * 1024;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _brandService: BrandServiceProxy,
    private _categoryService: CategoryServiceProxy,
    private _imageServiceProxy: ImageServiceProxy,
    private _cd: ChangeDetectorRef,
    public notify: NotifyService
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
      const maxSizeInMB = 2;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        alert(`File is too large. Maximum allowed size is ${maxSizeInMB} MB.`);

        event.target.value = '';
        this.imageDto.imageData = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        let base64String = e.target.result.toString();
        if (base64String.indexOf(',') > 0) {
          base64String = base64String.split(',')[1];
        }
        this.imageDto.imageData = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  finishSave() {
    this.notify.info(this.l('SavedSuccessfully'));
    this.bsModalRef.hide();
    this.onSave.emit();
  }
  save(): void {
    this.saving = true;

    // 1️⃣ Create the product first
    this._productService
      .create(this.product)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (createdProduct) => {
          console.log("Product created:", createdProduct);

          if (this.imageDto && this.imageDto.imageData) {
            this.imageDto.productId = createdProduct.id;

            console.log("Saving image for Product ID:", this.imageDto.productId);

            this._imageServiceProxy.create(this.imageDto).subscribe({
              next: () => {
                console.log("Image saved successfully");
                this.finishSave();
              },
              error: (err) => {
                console.error("Failed to save image", err);
                this.finishSave();
              }
            });

          } else {

            this.finishSave();
          }
        },
        error: (err) => {
          console.error("Failed to create product", err);
          this.finishSave();
        }
      });
  }
}
