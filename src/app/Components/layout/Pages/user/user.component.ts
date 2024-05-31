import { AfterViewInit, Component, ViewChild, viewChild } from '@angular/core';
import { User } from '../../../../Interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../Services/user.service';
import { AssetsService } from '../../../../Utils/assets.service';
import { ModalUsuarioComponent } from '../../Modal/modal-usuario/modal-usuario.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements AfterViewInit {

  tableColumns: string[] = ['Email', 'Role', 'Active', 'Actions'];
  data: User[] = []
  userDataTable = new MatTableDataSource(this.data);

  @ViewChild(MatPaginator) tablePagination!: MatPaginator; // Crear instancia de MatPaginator

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private assetService: AssetsService
  ) {
    this.GetUsers();
  }

  ngAfterViewInit(): void {
    this.userDataTable.paginator = this.tablePagination;
  }

  applyTableFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDataTable.filter = filterValue.trim().toLocaleLowerCase();
  }

  createUser(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    })
    .afterClosed()
    .subscribe((result) => {
      if (result === "true") {
        this.GetUsers();
      }
    });
  }

  updateUser(user: User){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: user
    })
    .afterClosed()
    .subscribe((result) => {
      if (result === "true") {
        this.GetUsers();
      }
    });
  }

  removeUser(user: User){
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: "Esta acción es irreversible",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      showCancelButton: true,
      cancelButtonColor: "#d33",
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.userService.Remove(user.id).subscribe({
          next: (response) => {
            this.assetService.showAlert(response.message, 'Exito');
            this.GetUsers();
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

  GetUsers() {
    this.userService.list().subscribe({
      next: (response) => {
        if (response.data !== null) {
          this.userDataTable.data = response.data;
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
}
