import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UserComponent } from './Pages/user/user.component';
import { ProductComponent } from './Pages/product/product.component';
import { SaleComponent } from './Pages/sale/sale.component';
import { SaleHistoryComponent } from './Pages/sale-history/sale-history.component';
import { SaleReportComponent } from './Pages/sale-report/sale-report.component';
import { SharedModule } from '../../Utils/shared/shared.module';
import { AccountService } from '../../Services/account.service';
import { ModalUsuarioComponent } from './Modal/modal-usuario/modal-usuario.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    ProductComponent,
    SaleComponent,
    SaleHistoryComponent,
    SaleReportComponent,
    ModalUsuarioComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule, // Modulo de compartidos como modulos de material
  ],
  providers: [
    AccountService
  ]
})
export class LayoutModule { }
