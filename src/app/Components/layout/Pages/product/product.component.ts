import { AfterViewInit, Component, ViewChild, viewChild } from '@angular/core';
import { User } from '../../../../Interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AssetsService } from '../../../../Utils/assets.service';
import Swal from 'sweetalert2';
import { Product } from '../../../../Interfaces/product';
import { ProductService } from '../../../../Services/product.service';
import { ModalProductComponent } from '../../Modal/modal-product/modal-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements AfterViewInit{
  tableColumns: string[] = ['SubcategoryName', 'BrandName', 'Name', 'Description', 'Price', 'Stock', 'Sku', 'Slug', 'Tags', 'Active', 'Actions'];
  data: Product[] = []
  productDataTable = new MatTableDataSource(this.data);

  @ViewChild(MatPaginator) tablePagination!: MatPaginator; // Crear instancia de MatPaginator

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private assetService: AssetsService
  ) {
    this.GetProducts();
  }

  ngAfterViewInit(): void {
    this.productDataTable.paginator = this.tablePagination;
  }

  applyTableFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataTable.filter = filterValue.trim().toLocaleLowerCase();
  }

  GetProducts() {
    this.productService.list().subscribe({
      next: (response) => {
        if (response.data !== null) {
          this.productDataTable.data = response.data;
        } else {
          this.assetService.showAlert("No se ha encontrado información", "Oops!");
        }
      },
      error: (response:any) => {
        this.assetService.showAlert(
          response.error.message ??
          "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
      }
    })
  }

  createProduct(){
    this.dialog.open(ModalProductComponent, {
      disableClose: true
    })
    .afterClosed()
    .subscribe((result) => {
      if (result === "true") {
        this.GetProducts();
      }
    });
  }

  updateProduct(product: Product){
    this.dialog.open(ModalProductComponent, {
      disableClose: true,
      data: product
    })
    .afterClosed()
    .subscribe((result) => {
      if (result === "true") {
        this.GetProducts();
      }
    });
  }

  removeProduct(product: Product){
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: "Esta acción es irreversible",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      showCancelButton: true,
      cancelButtonColor: "#d33",
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.productService.Remove(product.id).subscribe({
          next: (response) => {
            this.assetService.showAlert(response.message, 'Exito');
            this.GetProducts();
          },
          error: (response) => {
            this.assetService.showAlert(
              response.error.message ??
              "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
          }
        })
      }
    });
  }
}
