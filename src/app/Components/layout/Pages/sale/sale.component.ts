import { Component } from '@angular/core';
import { Product } from '../../../../Interfaces/product';
import { ProductSale } from '../../../../Interfaces/product-sale';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../../../Services/product.service';
import { SaleService } from '../../../../Services/sale.service';
import { AssetsService } from '../../../../Utils/assets.service';
import { ProductForSale } from '../../../../Interfaces/product-for-sale';
import { CreateSale } from '../../../../Interfaces/create-sale';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

  productList: Product[] = [];
  productListFilter: Product[] = [];

  productListForSale: ProductForSale[] = [];
  disableRegisterButton: boolean = false;

  productSelected!: Product;
  defaultPayment: string = "Cash";

  totalAmount: number = 0;

  saleForm: FormGroup;
  tableColumn: string[] = ['productName', 'quantity', 'unitPrice', 'subtotal', 'actions'];
  productSaleData = new MatTableDataSource(this.productListForSale);

  returnProductsByFilter(search: any) : Array<Product> {
    const searchTerm = typeof search === "string" ?
      search.toLocaleLowerCase() : search.name.toLocaleLowerCase();

    return this.productList.filter(item => item.name.toLocaleLowerCase().includes(searchTerm));
  }

  constructor(
    fb: FormBuilder,
    private productService: ProductService,
    private saleService: SaleService,
    private assetService: AssetsService
  ) {
    this.saleForm = fb.group({
      product: ['', Validators.required],
      quantity: [0, Validators.required]
    })

    this.productService.list().subscribe({
      next: (response) => {
        this.productList = response.data;
      },
      error: (response) => {
        this.assetService.showAlert(response.error.message ??
          "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
      }
    })

    this.saleForm.get('product')?.valueChanges.subscribe((val) => {
      this.productListFilter = this.returnProductsByFilter(val);
    })
  }

  showProductName(product: Product) : string {
    return product.name;
  }

  productForSale(event: any) {
    this.productSelected = event.option.value;
  }

  addProductToCar() {
    const quant: number = this.saleForm.value.quantity;
    const price: number = this.productSelected.price;
    const subtotal: number = quant * price;

    this.totalAmount = this.totalAmount + subtotal;

    this.productListForSale.push({
      productId: this.productSelected.id,
      productName: this.productSelected.name,
      quantity: quant,
      unitPrice: price,
      subtotal: subtotal
    })

    this.productSaleData = new MatTableDataSource(this.productListForSale);

    this.saleForm.patchValue({
      product: '',
      quantity: 0
    })
  }

  removeProductFromCar(productSale: ProductForSale) {
    this.totalAmount = this.totalAmount - productSale.subtotal;
    this.productListForSale = this.productListForSale.filter(p => p.productId !== productSale.productId);

    this.productSaleData = new MatTableDataSource(this.productListForSale);
  }

  createSale() {
    if (this.productForSale.length > 0) {
      this.disableRegisterButton = true;

      let request: CreateSale[] = [];

      this.productListForSale.forEach(product => {
        request.push({ productId:product.productId , quantity: product.quantity })
      });

      this.saleService.Create(request).subscribe({
        next: (response) => {
          this.totalAmount = 0;
          this.productListForSale = [];
          this.productSaleData = new MatTableDataSource(this.productListForSale);

          Swal.fire({
            icon: 'success',
            title: 'Sale has succesfully done!',
          })
        },
        complete: () => {
          this.disableRegisterButton = false;
        },
        error: (response:any) => {
          this.assetService.showAlert(
            response.error.message ??
            "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
        }
      })
    }
  }
}


