import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotifyService } from 'abp-ng2-module';
import { SupplierServiceProxy, PaymentTypeServiceProxy, FinanceAccountDto, CreatePurchaseDto, PaymentTypeDto, CreatePurchaseProductDto, PurchaseInputDto, FinanceAccountServiceProxy, ProductServiceProxy, SupplierDto, ProductDto, StockServiceProxy, PurchaseServiceProxy } from '../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-purchase.component.html',
  providers: [SupplierServiceProxy, PaymentTypeServiceProxy, FinanceAccountServiceProxy, ProductServiceProxy, StockServiceProxy, PurchaseServiceProxy]
})
export class CreatePurchaseComponent implements OnInit {

  selectedSupplier: SupplierDto;
  selectedProduct: ProductDto;
  selectedFinanceAccount: FinanceAccountDto;
  selectedPaymentType: PaymentTypeDto;
  remarks: string;
  suppliersList: SupplierDto[]
  productList: ProductDto[]
  financeAccountList: FinanceAccountDto[]
  paymentTypeList: PaymentTypeDto[]
  purchaseInputDto: PurchaseInputDto



  constructor(
    private supplierProxy: SupplierServiceProxy,
    private cd: ChangeDetectorRef,
    private financeAccountProxy: FinanceAccountServiceProxy,
    private productProxy: ProductServiceProxy,
    private paymentTypeProxy: PaymentTypeServiceProxy,
    private notifyService: NotifyService,
    private stockServiceProxy: StockServiceProxy,
    private purchaseServiceProxy: PurchaseServiceProxy

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

  purchaseProducts: CreatePurchaseProductDto[] = [];


  onProductSelect(product: ProductDto | null) {
    if (!product) {
      return;
    }

    const existingItem = this.purchaseProducts.find(p => p.productId === product.id);

    if (existingItem) {
      this.notifyService.error('This product has already been added to the list.', 'Duplicate Item');
    } else {

      this.stockServiceProxy.getLatestBatchNoByProductId(product.id).subscribe((result) => {

        const newPurchaseProduct = new CreatePurchaseProductDto();
        newPurchaseProduct.productId = product.id;
        newPurchaseProduct.unitPrice = product.price;
        newPurchaseProduct.quantity = 1;
        newPurchaseProduct.totalPrice = product.price * 1;
        newPurchaseProduct.productName = product.name;

        if (result != null && result != -1) {
          newPurchaseProduct.batchNo = result + 1;
        } else {
          newPurchaseProduct.batchNo = 1;
        }

        this.purchaseProducts.push(newPurchaseProduct);
        console.log(this.purchaseProducts);

        this.cd.detectChanges();
      });
    }

    this.selectedProduct = undefined;
  }




  updateRowTotal(item: CreatePurchaseProductDto) {
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
    alert();
    // 1. Validation (Bilkul sahi hai aapki)
    if (!this.selectedSupplier || this.purchaseProducts.length === 0 || !this.selectedFinanceAccount) {
      this.notifyService.warn('Please select Supplier, Finance Account and add at least one product.');
      return;
    }

    // 2. Pehle poore dabba (InputDto) ko initialize karein
    this.purchaseInputDto = new PurchaseInputDto(); // <--- YE LINE ZAROORI HAI

    // 3. Purchase data set karein
    const purchase = new CreatePurchaseDto();
    purchase.suplierId = this.selectedSupplier.id;
    purchase.invoiceNumber = ''; // Backend handle kar lega, par khali string dena safe hai
    purchase.totalAmount = this.calculateGrandTotal();
    purchase.remarks = this.remarks;
    purchase.financeAccountId = this.selectedFinanceAccount.id;
    purchase.status = 'Pending';

    // 4. Data assign karein
    this.purchaseInputDto.purchase = purchase;
    this.purchaseInputDto.products = this.purchaseProducts;

    console.log('Final Input Dto Products:', this.purchaseInputDto);

    this.purchaseServiceProxy.addPurchaseRequest(this.purchaseInputDto).subscribe({
      next: (result) => {
        this.notifyService.success('Successfully Created!');
        this.resetForm();

      },
      error: (err) => {
        this.notifyService.error('Error: ' + err.message);
      }
    });

  }



  onPaymentTypeChange() {
    this.selectedFinanceAccount = undefined;
    this.financeAccountProxy.getAccountsByPaymentType(this.selectedPaymentType.id).subscribe((result) => {
      this.financeAccountList = result
      this.cd.detectChanges();
    })


  }
  resetForm() {

    this.selectedSupplier = undefined;
    this.selectedFinanceAccount = undefined;
    this.purchaseProducts = [];

    this.purchaseInputDto = new PurchaseInputDto();
    this.purchaseInputDto.purchase = new CreatePurchaseDto();
    this.selectedProduct = undefined;
    this.cd.detectChanges();
  }



  onSupplierChange() {

  }




}
