import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplierDto, SupplierServiceProxy } from '../../../shared/service-proxies/service-proxies';
import moment from 'moment-timezone';

@Component({
  selector: 'app-edit-supplier-dialog',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-supplier-dialog.component.html',
  standalone: true,
  providers: [SupplierServiceProxy]
})
export class EditSupplierDialogComponent implements OnInit {
  saving = false;
  supplier: SupplierDto = new SupplierDto();
  @Output() onSave = new EventEmitter<void>();

  constructor(
    private _supplierService: SupplierServiceProxy,
    public bsModalRef: BsModalRef,
  ) {


  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this.supplier.updateAt = moment();

    this._supplierService
      .update(this.supplier)
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
