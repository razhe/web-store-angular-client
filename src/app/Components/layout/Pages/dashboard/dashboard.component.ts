import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SaleService } from '../../../../Services/sale.service';
import { Y } from '@angular/cdk/keycodes';
import { DashboardService } from '../../../../Services/dashboard.service';
import { AssetsService } from '../../../../Utils/assets.service';

Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalProfit: string = "0";
  totalSales: number = 0;
  totalProducts: number = 0;


  constructor(
    private dashboardService: DashboardService,
    private assetService: AssetsService
  ) {
    this.dashboardService.GetDashboard().subscribe({
      next: (response) => {
        if (response.data !== null) {
          this.totalProfit = response.data.totalProfit;
          this.totalSales = response.data.totalSales;
          this.totalProducts = response.data.totalProducts;

          const arrayData: any[] = response.data.lastWeekSales;

          const labelTemp = arrayData.map((value) => value.date);
          const dataTemp = arrayData.map((value) => value.total);

          this.showGraphic(labelTemp, dataTemp);
        }
      },
      error: (response: any) => {
        this.assetService.showAlert(
          response.error.message ??
          "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
      }
    })
  }

  showGraphic(label: any[], data: any[]) {
    const chartBars = new Chart('chartBars', {
      type: 'bar',
      data: {
        labels: label,
        datasets: [{
          label: "# Sales",
          data: data,
          backgroundColor: [ 'rgba(54, 162, 235, 0.2)' ],
          borderColor: [ 'rgba(54, 162, 235, 1)' ],
          borderWidth: 1
        }],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          Y: { beginAtZero: true }
        }
      }
    });
  }
}
