import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
    BrandDto, BrandDtoPagedResultDto, BrandServiceProxy,
    CategoryDto, CategoryDtoPagedResultDto, CategoryServiceProxy,
    CreateImageDto, ProductDto, ProductServiceProxy, ImageServiceProxy, UpdateProductDto,
    ImageDto
} from '../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../../shared/app-component-base';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotifyService } from '@node_modules/abp-ng2-module';

@Component({
    selector: 'app-edit-product-dialog',
    templateUrl: './edit-product-dialog.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [ProductServiceProxy, BrandServiceProxy, CategoryServiceProxy, ImageServiceProxy]
})
export class EditProductDialogComponent extends AppComponentBase implements OnInit {
    saving = false;
    updateProductDto: UpdateProductDto = new UpdateProductDto();
    productDto: ProductDto = new ProductDto();

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
        private _imageServiceProxy: ImageServiceProxy,
        private _cd: ChangeDetectorRef,
        public notify: NotifyService
    ) {
        super(injector);
    }

    ngOnInit(): void {

        console.log(this.productDto);
        this.loadBrands();
        this.loadCategories();
    }

    loadBrands() {
        this._brandService.getAll(undefined, 0, 1000).subscribe((result: BrandDtoPagedResultDto) => {
            this.brands = result.items;
            this._cd.markForCheck();
        });
    }

    loadCategories() {
        this._categoryService.getAll(undefined, 0, 1000).subscribe((result: CategoryDtoPagedResultDto) => {
            this.categories = result.items;
            this._cd.markForCheck();
        });
    }


   



    save(): void {
        this.saving = true;

        this.updateProductDto.id = this.productDto.id;
        this.updateProductDto.brandId = this.productDto.brandId;
        this.updateProductDto.categoryId = this.productDto.categoryId;
        this.updateProductDto.price = this.productDto.price;
        this.updateProductDto.sku = this.productDto.sku;
        this.updateProductDto.isActive = this.productDto.isActive;
        this.updateProductDto.isPerishable = this.productDto.isPerishable;
        this.updateProductDto.description = this.productDto.description;

        this._productService.update(this.updateProductDto).subscribe({
            next: () => {

                if (this.imageDto.imageData) {
                    this.imageDto.productId = this.productDto.id;

                    this._imageServiceProxy.updateImageByProductId(this.updateProductDto.id, this.imageDto.imageData).subscribe(() => {
                        this.notify.success('Product updated successfully');
                        this.onSave.emit();
                        this.bsModalRef.hide();
                    });
                } else {
                    this.notify.success('Product updated successfully');
                    this.onSave.emit();
                    this.bsModalRef.hide();
                }
            },
            error: () => {
                this.notify.error('Failed to update product');
                this.saving = false;
            }
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
                this.imageDto.imageData = base64String;
            };
            reader.readAsDataURL(file);
        }
    }
}