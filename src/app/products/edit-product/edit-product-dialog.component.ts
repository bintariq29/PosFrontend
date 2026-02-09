import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { AppComponentBase } from '@shared/app-component-base';

import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '../../../shared/app-component-base';
import { BrandDto, BrandDtoPagedResultDto, BrandServiceProxy, CategoryDto, CategoryDtoPagedResultDto, CategoryServiceProxy, ProductDto, ProductServiceProxy, UpdateProductDto } from '../../../shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-product-dialog',
    templateUrl: './edit-product-dialog.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class EditProductDialogComponent extends AppComponentBase implements OnInit {
    saving = false;
    id: number;
    product: UpdateProductDto = new UpdateProductDto();
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
        this.loadBrands();
        this.loadCategories();
        this.loadProduct();
    }

    loadProduct() {
        this._productService.get(this.id).subscribe((result: ProductDto) => {

            this.product = new UpdateProductDto();
            this.product.init(result);

        });
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
