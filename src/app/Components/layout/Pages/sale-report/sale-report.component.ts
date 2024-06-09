import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as XLSX from "xlsx";
import { Report } from '../../../../Interfaces/report';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SaleService } from '../../../../Services/sale.service';
import { AssetsService } from '../../../../Utils/assets.service';
import moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';

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
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrl: './sale-report.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class SaleReportComponent {
  filterForm: FormGroup;
  reportList: Report[] = [];
  tableColumns: string[] = ["orderNumber", "registerDate", "product", "quantity", "price", "total", "totalSale"];
  reportDataTable = new MatTableDataSource(this.reportList);

  @ViewChild(MatPaginator) tablePaginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private saleService: SaleService,
    private assetService: AssetsService)
  {
    this.filterForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    this.reportDataTable.paginator = this.tablePaginator;
  }

  searchSales() {
    let startDate: string = this.filterForm.value.startDate;
    let endDate: string = this.filterForm.value.endDate;

    // Convertir las fechas a strings
    const startDateString = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
    const endDateString = moment(endDate).format('YYYY-MM-DD HH:mm:ss');

    this.saleService.GetReport(startDateString, endDateString).subscribe({
      next: (response) => {
        if (response.data !== null) {
          this.reportList = response.data;
          this.reportDataTable.data = response.data;
        } else {
          this.reportList = [];
          this.reportDataTable.data = [];
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

  exportToExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.reportList);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "Reporte-Ventas.xlsx")
  }
}
