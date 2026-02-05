import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryDto, CategoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-category-dialog.component.html',
  providers: [CategoryServiceProxy]
})
export class EditCategoryDialogComponent implements OnInit {
  saving = false;
  category: CategoryDto = new CategoryDto();
  @Output() onSave = new EventEmitter<void>();

  constructor(
    private _categoryService: CategoryServiceProxy,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void { }

  save(): void {
    this.saving = true;

    this._categoryService
      .update(this.category)
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
