import { ChangeDetectorRef, Component, Injector, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase } from 'shared/paged-listing-component-base';
import { BrandServiceProxy, BrandDto, BrandDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { LazyLoadEvent, PrimeTemplate } from 'primeng/api';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  animations: [appModuleAnimation()],
  standalone: true,
  imports: [FormsModule, TableModule, PrimeTemplate, NgIf, PaginatorModule, LocalizePipe],
})
export class BrandsComponent extends PagedListingComponentBase<BrandDto> {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  brands: BrandDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _brandService: BrandServiceProxy,
    private _modalService: BsModalService,
    cd: ChangeDetectorRef
  ) {
    super(injector, cd);
  }

  createBrand(): void {
    // TODO: Implement create brand dialog
  }

  editBrand(brand: BrandDto): void {
    // TODO: Implement edit brand dialog
  }

  clearFilters(): void {
    this.keyword = '';
  }

  list(event?: LazyLoadEvent): void {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);

      if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        return;
      }
    }

    this.primengTableHelper.showLoadingIndicator();

    this._brandService
      .getAll(
        this.primengTableHelper.getSorting(this.dataTable),
        this.primengTableHelper.getSkipCount(this.paginator, event),
        this.primengTableHelper.getMaxResultCount(this.paginator, event)
      )
      .pipe(
        finalize(() => {
          this.primengTableHelper.hideLoadingIndicator();
        })
      )
      .subscribe((result: BrandDtoPagedResultDto) => {
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.hideLoadingIndicator();
        this.cd.detectChanges();
      });
  }

  delete(brand: BrandDto): void {
    abp.message.confirm(
      this.l('AreYouSure'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._brandService.delete(brand.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
