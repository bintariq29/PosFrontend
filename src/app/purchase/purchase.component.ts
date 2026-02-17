import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseServiceProxy } from '@shared/service-proxies/service-proxies';
import { TableModule } from 'primeng/table';
import { Console } from 'console';


@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './purchase.component.html',
  providers: [PurchaseServiceProxy]
})
export class PurchaseComponent implements OnInit {
  purchases: any[] = [];
  keyword = '';
  loading = false;
  rows = 10;
  totalRecords = 0;
  constructor(
    private purchaseService: PurchaseServiceProxy,
    private cd: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    this.loadPurchases();
  }
  loadPurchases(event?: any): void {
    this.loading = true;

    this.purchaseService.getAllPurchases().subscribe(result => {
      this.purchases = result;
      console.log(this.purchases);

      this.totalRecords = 12;
      this.loading = false;
      this.cd.detectChanges();
    });
  }

  onSearch(): void {
    this.loadPurchases();
  }

  clearFilters(): void {
    this.keyword = '';
    this.loadPurchases();
  }

  createPurchase(): void {
    console.log('Create Purchase');
  }

  editPurchase(row: any): void {
    console.log('Edit Purchase', row);
  }

  deletePurchase(row: any): void {
    console.log('Delete Purchase', row);
  }

  viewDetails(row: any): void {
    console.log('View Details', row.products);
  }

  // Status Badge Styling
  getStatusStyle(status: string) {
    if (status === 'Pending') {
      return {
        'background-color': '#fff3cd',
        'color': '#856404',
        'font-size': '0.75rem'
      };
    }

    if (status === 'Rejected') {
      return {
        'background-color': '#f8d7da',
        'color': '#721c24',
        'font-size': '0.75rem'
      };
    }

    if (status === 'Approved') {
      return {
        'background-color': '#e6f4ea',
        'color': '#1e7e34',
        'font-size': '0.75rem'
      };
    }

    return {};
  }


}
