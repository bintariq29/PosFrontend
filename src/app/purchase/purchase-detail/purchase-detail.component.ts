import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@node_modules/@angular/common';
import { PurchaseOutputDto, PurchaseServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  imports:[CommonModule],
  providers: [PurchaseServiceProxy]
})
export class PurchaseDetailComponent implements OnInit {

  purchaseId!: number;
  purchase!: PurchaseOutputDto;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private purchaseService: PurchaseServiceProxy,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.purchaseId = params['id'];
      if (this.purchaseId) {
        this.loadPurchase(this.purchaseId);
      }
    });
  }

  loadPurchase(id: number) {
    this.isLoading = true;
    this.cd.detectChanges();

    this.purchaseService.getPurchaseByPurchaseId(id).subscribe({
      next: (res) => {
        this.purchase = res;
        this.isLoading = false;
        this.cd.detectChanges(); // trigger Angular to update the view
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Failed to load purchase data.');
        this.cd.detectChanges();
      }
    });
  }

  // Calculate total quantity
  getTotalQuantity(): number {
    if (!this.purchase?.products) return 0;
    return this.purchase.products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  }

  // Calculate grand total
  calculateGrandTotal(): number {
    if (!this.purchase?.products) return 0;
    return this.purchase.products.reduce((sum, p) => sum + ((p.unitPrice || 0) * (p.quantity || 0)), 0);
  }

  // Get product image URL
  getImageUrl(productId: number): string {
    const timestamp = new Date().getTime();
    return `https://localhost:44311/api/services/app/Image/GetImageById?id=${productId}&t=${timestamp}`;
  }
}