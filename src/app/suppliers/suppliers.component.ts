import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Table, TableModule } from 'primeng/table';
import { LazyLoadEvent, PrimeTemplate } from 'primeng/api';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CreateSupplierDialogComponent } from './create-supplier/create-supplier-dialog.component';
import { EditSupplierDialogComponent } from './edit-supplier/edit-supplier-dialog.component';
import { SupplierDto, SupplierDtoPagedResultDto, SupplierServiceProxy } from '../../shared/service-proxies/service-proxies';
import { LocalizePipe } from '../../shared/pipes/localize.pipe';
import { appModuleAnimation } from '../../shared/animations/routerTransition';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  animations: [appModuleAnimation()],
  standalone: true,
  imports: [FormsModule, TableModule, PrimeTemplate, NgIf, NgFor, CommonModule, PaginatorModule, LocalizePipe, ButtonModule],
  providers: [SupplierServiceProxy]
})
export class SuppliersComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) dataTable: Table;
  @ViewChild('paginator', { static: false }) paginator: Paginator;

  suppliers: SupplierDto[] = [];
  keyword = '';
  totalRecords = 0;
  loading = true;
  rows = 10;

  constructor(
    injector: Injector,
    private _supplierService: SupplierServiceProxy,
    private _modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(event?: LazyLoadEvent): void {
    this.loading = true;
    const skipCount = event?.first || 0;
    const maxResultCount = event?.rows || this.rows;

    this._supplierService
      .getAll(this.keyword, skipCount, maxResultCount)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck();
        })
      )
      .subscribe(
        (result: SupplierDtoPagedResultDto) => {
          this.suppliers = result.items || [];
          this.totalRecords = result.totalCount || 0;
          this.cd.detectChanges();
        },
        (error: any) => {
          console.error('Error loading suppliers:', error);
          this.loading = false;
          this.cd.markForCheck();
        }
      );
  }

  createSupplier(): void {
    const initialState = {

    };

    this._modalService.show(CreateSupplierDialogComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });


    this._modalService.onHide.subscribe(() => {
      this.loadSuppliers();
    });
  }

  editSupplier(supplier: SupplierDto): void {
    const modal = this._modalService.show(EditSupplierDialogComponent, {
      initialState: {
        supplier: supplier.clone()
      },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });

    modal.content.onSave.subscribe(() => {
      this.loadSuppliers();
    });
  }

  deleteSupplier(supplier: SupplierDto): void {

    abp.message.confirm(
      `Are you sure you want to delete supplier "${supplier.name}"?`,
      undefined,
      (result: boolean) => {
        if (result) {
          this._supplierService.delete(supplier.id).subscribe(() => {
            abp.notify.success('Successfully Deleted');
            this.loadSuppliers();
          });
        }
      }
    );
  }

  clearFilters(): void {
    this.keyword = '';
    this.loadSuppliers();
  }

  onSearch(): void {
    this.loadSuppliers();
  }

}
