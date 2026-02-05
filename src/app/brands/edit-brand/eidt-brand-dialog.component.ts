import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { BrandDto, BrandServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eidt-brand-dialog',
  imports: [FormsModule, CommonModule],
  templateUrl: './eidt-brand-dialog.component.html',
  standalone: true,
  providers: [BrandServiceProxy]
})
export class EidtBrandDialogComponent implements OnInit {
  saving = false;
  brand: BrandDto = new BrandDto();
  @Output() onSave = new EventEmitter<void>();

  constructor(
    private _brandService: BrandServiceProxy,
    public bsModalRef: BsModalRef,
  ) {


  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;

    this._brandService
      .update(this.brand)
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
