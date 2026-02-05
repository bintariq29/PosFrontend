import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateSupplierDto, SupplierServiceProxy } from '../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-supplier-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-supplier-dialog.component.html',
  providers: [SupplierServiceProxy]
})
export class CreateSupplierDialogComponent {
  saving = false;
  supplier = new CreateSupplierDto();
  @Output() onSave = new EventEmitter<any>();
  constructor(public bsModalRef: BsModalRef,
    private _supplierService: SupplierServiceProxy

  ) { }

  save(): void {
    if (!this.supplier.name) {
      return;
    }
    this._supplierService
      .create(this.supplier)
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
