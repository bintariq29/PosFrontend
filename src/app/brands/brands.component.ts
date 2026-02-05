import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BrandServiceProxy, BrandDto, BrandDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { LazyLoadEvent, PrimeTemplate } from 'primeng/api';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { ButtonModule } from 'primeng/button';
import { CreateBrandDialogComponent } from './create-brand/create-brand-dialog.component';
import { EidtBrandDialogComponent } from './edit-brand/eidt-brand-dialog.component';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  animations: [appModuleAnimation()],
  standalone: true,
  imports: [FormsModule, TableModule, PrimeTemplate, NgIf, NgFor, CommonModule, PaginatorModule, LocalizePipe, ButtonModule],
})
export class BrandsComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) dataTable: Table;
  @ViewChild('paginator', { static: false }) paginator: Paginator;

  brands: BrandDto[] = [];
  keyword = '';
  totalRecords = 0;
  loading = true;
  rows = 10;

  constructor(
    injector: Injector,
    private _brandService: BrandServiceProxy,
    private _modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(event?: LazyLoadEvent): void {
    this.loading = true;
    const skipCount = event?.first || 0;
    const maxResultCount = event?.rows || this.rows;

    this._brandService
      .getAll(this.keyword, skipCount, maxResultCount)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck();
        })
      )
      .subscribe(
        (result: BrandDtoPagedResultDto) => {
          this.brands = result.items || [];
          this.totalRecords = result.totalCount || 0;
          this.cd.detectChanges();
        },
        (error: any) => {
          console.error('Error loading brands:', error);
          this.loading = false;
          this.cd.markForCheck();
        }
      );
  }

  createBrand(): void {
    const initialState = {

    };

    this._modalService.show(CreateBrandDialogComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });


    this._modalService.onHide.subscribe(() => {
      this.loadBrands();
    });
  }

  editBrand(brand: BrandDto): void {
    const modal = this._modalService.show(EidtBrandDialogComponent, {
      initialState: {
        brand: brand.clone()
      },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });

    modal.content.onSave.subscribe(() => {
      this.loadBrands();
    });
  }

  deleteBrand(brand: BrandDto): void {

    abp.message.confirm(
      `Are you sure you want to delete brand "${brand.name}"?`,
      undefined,
      (result: boolean) => {
        if (result) {
          this._brandService.delete(brand.id).subscribe(() => {
            abp.notify.success('Successfully Deleted');
            this.loadBrands();
          });
        }
      }
    );
  }

  clearFilters(): void {
    this.keyword = '';
    this.loadBrands();
  }

  onSearch(): void {
    this.loadBrands();
  }




}
