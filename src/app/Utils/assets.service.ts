import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from '../Interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private _snackBar: MatSnackBar) { }

  showAlert(mensaje: string, tipo:string){
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    })
  }
}
