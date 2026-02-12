import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@node_modules/@angular/common';
import { FormsModule } from '@node_modules/@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FinanceAccountDto, FinanceAccountServiceProxy, PaymentTypeDto, PaymentTypeServiceProxy, ProductDto, ProductServiceProxy, PurchaseProductDto, PurchaseProductServiceProxy, SupplierDto, SupplierServiceProxy } from '@shared/service-proxies/service-proxies';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NotifyService } from '@node_modules/abp-ng2-module';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  providers: [SupplierServiceProxy, PaymentTypeServiceProxy, FinanceAccountServiceProxy, ProductServiceProxy, PurchaseProductServiceProxy]
})
export class PurchaseComponent implements OnInit {
  selectedSupplier: SupplierDto;
  selectedProduct: ProductDto;
  selectedFinanceAccount: FinanceAccountDto;
  selectedPaymentType: PaymentTypeDto;
  remarks: string;
  suppliersList: SupplierDto[]
  productList: ProductDto[]
  financeAccountList: FinanceAccountDto[]
  paymentTypeList: PaymentTypeDto[]



  constructor(
    private supplierProxy: SupplierServiceProxy,
    private cd: ChangeDetectorRef,
    private financeAccountProxy: FinanceAccountServiceProxy,
    private productProxy: ProductServiceProxy,
    private paymentTypeProxy: PaymentTypeServiceProxy,
    private notifyService: NotifyService,

  ) {
  }
  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();
    this.loadFinanceAccounts();
    this.loadPaymentType();
  }

  loadSuppliers() {
    this.supplierProxy.getAll(undefined, 0, 10).subscribe((result) => {
      this.suppliersList = result.items
      this.cd.detectChanges();
    })
  }

  loadProducts() {
    this.productProxy.getAll(undefined, 0, 10).subscribe((result) => {
      this.productList = result.items
      this.cd.detectChanges();
    })
  }

  loadPaymentType() {
    this.paymentTypeProxy.getAll(undefined, 0, 10).subscribe((result) => {
      this.paymentTypeList = result.items
      this.cd.detectChanges();
    })
  }

  loadFinanceAccounts() {
    this.financeAccountProxy.getAll(undefined, 0, 10).subscribe((result) => {
      this.financeAccountList = result.items
      this.cd.detectChanges();
    })
  }

  purchaseProducts: PurchaseProductDto[] = [];


  onProductSelect() {
    if (!this.selectedProduct || !(this.selectedProduct instanceof ProductDto)) {
      return;
    }

    const existingItem = this.purchaseProducts.find(p => p.productId === this.selectedProduct.id);

    if (existingItem) {
      this.notifyService.warn('This product has already been added to the list.', 'Duplicate Item');
    } else {
      const newPurchaseProduct = new PurchaseProductDto();

      newPurchaseProduct.productId = this.selectedProduct.id;
      newPurchaseProduct.unitPrice = this.selectedProduct.price;
      newPurchaseProduct.quantity = 1;
      newPurchaseProduct.totalPrice = newPurchaseProduct.unitPrice * newPurchaseProduct.quantity;
      newPurchaseProduct.batchNo = 1;
      newPurchaseProduct.productName = this.selectedProduct.name
      this.purchaseProducts.push(newPurchaseProduct);
      console.log(this.purchaseProducts);
    }
    this.selectedProduct = undefined;
    this.cd.detectChanges();
  }




  // Add these helper methods to your class
  removeItem(index: number) {
    this.purchaseProducts.splice(index, 1);
    this.cd.detectChanges();
  }

  updateRowTotal(item: PurchaseProductDto) {
    item.totalPrice = item.quantity * item.unitPrice;
    this.cd.detectChanges();
  }

  calculateGrandTotal(): number {
    return this.purchaseProducts.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  getImageUrl(product: any): string {
    const timestamp = new Date().getTime();
    // Use product.id (which will be the productId in our case)
    return `https://localhost:44311/api/services/app/Image/GetImageById?id=${product.id}&t=${timestamp}`;
  }






}
