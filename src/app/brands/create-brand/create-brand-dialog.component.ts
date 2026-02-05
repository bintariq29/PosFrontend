import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-brand-dialog',
  standalone: true, // Check karein agar aap standalone use kar rahe hain
  templateUrl: './create-brand-dialog.component.html',
})
export class CreateBrandDialogComponent {
  constructor(public bsModalRef: BsModalRef) { }

  save(): void {
    this.bsModalRef.hide();
  }

  close(): void {
    this.bsModalRef.hide();
  }
}