import { Component, EventEmitter, Injector, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { BrandDto, BrandDtoPagedResultDto, BrandServiceProxy, CategoryDto, CategoryDtoPagedResultDto, CategoryServiceProxy, ProductDto, ProductServiceProxy, ImageDto, UpdateProductDto } from '@shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-product-dialog',
    templateUrl: './edit-product-dialog.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [ProductServiceProxy, BrandServiceProxy, CategoryServiceProxy]
})
export class EditProductDialogComponent extends AppComponentBase implements OnInit {
    saving = false;
    id: number;
    product: UpdateProductDto = new UpdateProductDto();
    imageDto: ImageDto = new ImageDto();
    brands: BrandDto[] = [];
    categories: CategoryDto[] = [];

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public bsModalRef: BsModalRef,
        private _productService: ProductServiceProxy,
        private _brandService: BrandServiceProxy,
        private _categoryService: CategoryServiceProxy,
        private _cd: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadBrands();
        this.loadCategories();
        this.loadProduct();
    }

    loadProduct() {
        this._productService.get(this.id).pipe(
            finalize(() => {
                this._cd.detectChanges();
            })
        ).subscribe((result: ProductDto) => {
            this.product = new UpdateProductDto();
            this.product.init(result);
            this._cd.detectChanges();
        });
    }

    loadBrands() {
        this._brandService.getAll(undefined, 0, 1000).pipe(
            finalize(() => {
                this._cd.detectChanges();
            })
        ).subscribe((result: BrandDtoPagedResultDto) => {
            this.brands = result.items || [];
            this._cd.detectChanges();
        });
    }

    loadCategories() {
        this._categoryService.getAll(undefined, 0, 1000).pipe(
            finalize(() => {
                this._cd.detectChanges();
            })
        ).subscribe((result: CategoryDtoPagedResultDto) => {
            this.categories = result.items || [];
            this._cd.detectChanges();
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                this.notify.error('File size exceeds 5MB limit');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                let base64String = e.target.result.toString();
                if (base64String.indexOf(',') > 0) {
                    base64String = base64String.split(',')[1];
                }
                this.imageDto.imageData = base64String;
                this._cd.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    save(): void {
        this.saving = true;

        this._productService
            .update(this.product)
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
