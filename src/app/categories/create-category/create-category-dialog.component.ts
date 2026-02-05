import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CategoryServiceProxy, CreateCategoryDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-category-dialog.component.html',
  providers: [CategoryServiceProxy]
})
export class CreateCategoryDialogComponent {
  saving = false;
  category = new CreateCategoryDto();
  @Output() onSave = new EventEmitter<any>();
  constructor(public bsModalRef: BsModalRef,
    private _categoryService: CategoryServiceProxy

  ) { }

  save(): void {
    if (!this.category.name) {
      return;
    }
    this._categoryService
      .create(this.category)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this.onSave.emit();
        this.bsModalRef.hide();
      });
  }

  close(): void {
    this.bsModalRef.hide();
  }
}
