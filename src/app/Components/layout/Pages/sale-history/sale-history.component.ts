import { AfterViewInit, Component, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Sale } from '../../../../Interfaces/sale';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SaleService } from '../../../../Services/sale.service';
import { AssetsService } from '../../../../Utils/assets.service';
import moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modal/modal-detalle-venta/modal-detalle-venta.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-sale-history',
  templateUrl: './sale-history.component.html',
  styleUrl: './sale-history.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class SaleHistoryComponent implements AfterViewInit {
  searchForm: FormGroup;
  searchOptions: any[] = [
    { value: "date", description: "By Date" },
    { value: "orderNumber", description: "By Order Number" },
  ]

  tableColumns: string[] = ['orderNumber', 'createdAt', 'total', 'actions']
  saleData: Sale[] = [];
  saleDataTable = new MatTableDataSource(this.saleData);

  @ViewChild(MatPaginator) tablePaginator!: MatPaginator;

  constructor (
    private fb: FormBuilder,
    private dialog: MatDialog,
    private saleService: SaleService,
    private assetService: AssetsService
  ) {

    this.searchForm = this.fb.group({
      searchTerm: ['date'],
      orderNumber: [''],
      startDate: [''],
      endDate: ['']
    })

    this.searchForm.get("SearchTerm")?.valueChanges.subscribe(value => {
      this.searchForm.patchValue({
        orderNumber: '',
        startDate: '',
        endDate: ''
      })
    })
  }

  ngAfterViewInit(): void {
    this.saleDataTable.paginator = this.tablePaginator;
  }

  applyTableFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.saleDataTable.filter = filterValue.trim().toLocaleLowerCase();
  }

  searchSales() {
    let startDate: string = this.searchForm.value.startDate;
    let endDate: string = this.searchForm.value.endDate;

    // Convertir las fechas a strings
    const startDateString = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : '';
    const endDateString = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : '';

    let obj:any = {
      'SearchTerm': this.searchForm.value.searchTerm,
      'OrderNumber': this.searchForm.value.orderNumber,
      'StartDate': startDateString,
      'EndDate': endDateString
    }

    this.saleService.GetHistory(obj).subscribe({
      next: (response) => {
        if (response.data !== null) {
          this.saleDataTable.data = response.data;
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

  showSaleDetail(sale: Sale) {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: sale,
      disableClose: true,
      width: '700px'
    })
  }
}
