import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssetsService } from '../../Utils/assets.service';
import { AccountService } from '../../Services/account.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  userEmail: string = "";
  userRole: number = 0;

  constructor(
    private router: Router,
     private _assetService: AssetsService,
     private _accountService: AccountService
    ) {
      const user = this._accountService.getUserSession();

      this.userEmail = user.email;
      this.userRole = user.role;
  }

  logout() {
    this._accountService.removeUserSession();
  }
}
