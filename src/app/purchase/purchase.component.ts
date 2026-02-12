import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@node_modules/@angular/common';
import { FormsModule } from '@node_modules/@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FinanceAccountDto, FinanceAccountServiceProxy, PaymentTypeDto, PaymentTypeServiceProxy, ProductDto, ProductServiceProxy, PurchaseProductDto, PurchaseProductServiceProxy, StockServiceProxy, SupplierDto, SupplierServiceProxy } from '@shared/service-proxies/service-proxies';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NotifyService } from '@node_modules/abp-ng2-module';
import { result } from '@node_modules/@types/lodash';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  providers: [SupplierServiceProxy, PaymentTypeServiceProxy, FinanceAccountServiceProxy, ProductServiceProxy, PurchaseProductServiceProxy, StockServiceProxy]
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
    private stockServiceProxy: StockServiceProxy

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


  onProductSelect(product: ProductDto | null) {
    if (!product) {
      return;
    }

    const existingItem = this.purchaseProducts.find(p => p.productId === product.id);

    if (existingItem) {
      this.notifyService.error('This product has already been added to the list.', 'Duplicate Item');
    } else {

      this.stockServiceProxy.getLatestBatchNoByProductId(product.id).subscribe((result) => {

        const newPurchaseProduct = new PurchaseProductDto();
        newPurchaseProduct.productId = product.id;
        newPurchaseProduct.unitPrice = product.price;
        newPurchaseProduct.quantity = 1;
        newPurchaseProduct.totalPrice = product.price * 1;
        newPurchaseProduct.productName = product.name;

        if (result != null && result != -1) {
          newPurchaseProduct.batchNo = result + 1;
        } else {
          newPurchaseProduct.batchNo = 1; // first batch
        }

        this.purchaseProducts.push(newPurchaseProduct);
        console.log(this.purchaseProducts);

        this.cd.detectChanges();
      });
    }

    this.selectedProduct = undefined;
  }




  updateRowTotal(item: PurchaseProductDto) {
    // Ensure we are working with numbers (prevents string concatenation)
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    item.totalPrice = qty * price;
    this.cd.detectChanges();
  }

  calculateGrandTotal(): number {
    return this.purchaseProducts.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  getTotalQuantity(): number {
    return this.purchaseProducts.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }

  removeItem(index: number) {
    this.purchaseProducts.splice(index, 1);
    this.notifyService.info('Item removed from list');
    this.cd.detectChanges();
  }

  getImageUrl(product: any): string {
    const timestamp = new Date().getTime();
    return `https://localhost:44311/api/services/app/Image/GetImageById?id=${product.id}&t=${timestamp}`;
  }

  onProcessPurchase() {

  }

  onSupplierChange() {

  }

  onPaymentTypeChange() {
    this.selectedFinanceAccount = undefined;
    this.financeAccountProxy.getAccountsByPaymentType(this.selectedPaymentType.id).subscribe((result) => {
      this.financeAccountList = result
      this.cd.detectChanges();
    })


  }





}
