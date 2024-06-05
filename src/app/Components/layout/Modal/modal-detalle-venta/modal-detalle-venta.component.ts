import { Component, Inject } from '@angular/core';
import { ProductSale } from '../../../../Interfaces/product-sale';
import { Sale } from '../../../../Interfaces/sale';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrl: './modal-detalle-venta.component.css'
})
export class ModalDetalleVentaComponent {
  orderNumber: string = "";
  total: number = 0;
  registerDate: string = "";
  productSale: ProductSale[] = [];
  tableColumns: string[] = ['productName', 'quantity', 'unitPrice','subtotal' ]

  constructor (
    @Inject(MAT_DIALOG_DATA) public sale: Sale
  ){
    this.registerDate = sale.createdAt;
    this.orderNumber = sale.orderNumber;
    this.total = sale.total;
    this.productSale = sale.productSales;
  }
}
