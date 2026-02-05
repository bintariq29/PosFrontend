import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryDto, CategoryDtoPagedResultDto, CategoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, CommonModule, TableModule],
  templateUrl: './categories.component.html',

})
export class CategoriesComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) dataTable: Table;
  @ViewChild('paginator', { static: false }) paginator: Paginator;

  categories: CategoryDto[] = [];
  keyword = '';
  totalRecords = 0;
  loading = true;
  rows = 10;
  constructor(
    private _categoryService: CategoryServiceProxy,
    public cd: ChangeDetectorRef,
    public modalService: BsModalService,
    injector: Injector,

  ) {
  }
  ngOnInit(): void {
  }

  createCategory() { }

  onSearch() { }

  clearFilters() { }
  deleteCategory() { }

  editCategory() {

  }



  loadCategories(event?: LazyLoadEvent): void {
    this.loading = true;
    const skipCount = event?.first || 0;
    const maxResultCount = event?.rows || this.rows;

    this._categoryService
      .getAll(this.keyword, skipCount, maxResultCount)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck();
        })
      )
      .subscribe(
        (result: CategoryDtoPagedResultDto) => {
          this.categories = result.items || [];
          this.totalRecords = result.totalCount || 0;
          this.cd.detectChanges();
        },
        (error: any) => {
          console.error('Error loading Categories:', error);
          this.loading = false;
          this.cd.markForCheck();
        }
      );
  }

  createBrand(): void {
    // const initialState = {

    // };

    // this.modalService.show(CreateBrandDialogComponent, {
    //   initialState,
    //   class: 'modal-lg',
    //   backdrop: 'static',
    //   keyboard: false
    // });


    // this._modalService.onHide.subscribe(() => {
    //   this.loadBrands();
    // });
  }
  //  editBrand(brand: BrandDto): void {
  // const modal = this._modalService.show(EidtBrandDialogComponent, {
  //   initialState: {
  //     brand: brand.clone()
  //   },
  //   class: 'modal-lg',
  //   backdrop: 'static',
  //   keyboard: false
  // });

  // modal.content.onSave.subscribe(() => {
  //   this.loadBrands();
  // });
  // }

}
