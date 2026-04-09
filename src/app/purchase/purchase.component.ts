import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseServiceProxy } from '@shared/service-proxies/service-proxies';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { AppSessionService } from '@shared/session/app-session.service';


@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './purchase.component.html',
  providers: [PurchaseServiceProxy],
  standalone: true
})
export class PurchaseComponent implements OnInit {
  purchases: any[] = [];
  keyword = '';
  loading = false;
  rows = 10;
  totalRecords = 0;
  isAdmin: boolean
  constructor(
    private purchaseService: PurchaseServiceProxy,
    private cd: ChangeDetectorRef,
    private router: Router,
    private appSessionService: AppSessionService
  ) {

  }
  ngOnInit(): void {
    this.checkUserRole();
    this.loadPurchases();
  }
  checkUserRole() {
    const user = this.appSessionService.user;
    const userId = this.appSessionService.user.id;
    console.log("USER KI ID", userId);
    if (user.userName.toLowerCase() == 'admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.cd.detectChanges();
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
    this.router.navigate(['/app/purchase/create']);

  }

  editPurchase(row: any): void {
    console.log('Edit Purchase', row);
  }

  deletePurchase(row: any): void {
    console.log('Delete Purchase', row);
  }
  viewDetails(row: any): void {
    console.log("Row is:", row);
    this.router.navigate(['/app/purchase/detail'], {
      queryParams: {
        id: row.purchase.id
      }
    });
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
