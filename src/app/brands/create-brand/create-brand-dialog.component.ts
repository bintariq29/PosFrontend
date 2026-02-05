import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandServiceProxy, CreateBrandDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-brand-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-brand-dialog.component.html',
  providers: [BrandServiceProxy]
})
export class CreateBrandDialogComponent {
  saving = false;
  brand = new CreateBrandDto();
  @Output() onSave = new EventEmitter<any>();
  constructor(public bsModalRef: BsModalRef,
    private _brandService: BrandServiceProxy

  ) { }

  save(): void {
    if (!this.brand.name) {
      return;
    }
    this._brandService
      .create(this.brand)
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