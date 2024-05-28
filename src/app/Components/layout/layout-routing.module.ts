import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UserComponent } from './Pages/user/user.component';
import { ProductComponent } from './Pages/product/product.component';
import { SaleComponent } from './Pages/sale/sale.component';
import { SaleHistoryComponent } from './Pages/sale-history/sale-history.component';
import { SaleReportComponent } from './Pages/sale-report/sale-report.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UserComponent },
    { path: 'products', component: ProductComponent },
    { path: 'sales', component: SaleComponent },
    { path: 'sales-history', component: SaleHistoryComponent },
    { path: 'sales-report', component: SaleReportComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
