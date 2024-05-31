import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateUpdateUser } from '../../../../Interfaces/create-update-user';
import { UserService } from '../../../../Services/user.service';
import { AssetsService } from '../../../../Utils/assets.service';
import { User } from '../../../../Interfaces/user';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})
export class ModalUsuarioComponent {
  userForm: FormGroup;
  showPassword: boolean = false;
  actionTitle: string = "Create";
  actionButton: string = "Save";

  constructor(
    private currentModal: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: User, //Inyectar el componente para recibir los datos
    private fb: FormBuilder,
    private userService: UserService,
    private assetService: AssetsService
  )
  {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      password: [''],
      role: ['', Validators.required],
      active: ['', Validators.required],
    })

    if (this.userData !== null) {
      this.actionTitle = "Edit";
      this.actionButton = "Update";
    }

    if (this.userData !== null) {
      this.userForm.patchValue ({
        email: this.userData.email,
        role: this.userData.role,
        active: this.userData.active,
      })
    }
  }

  createOrUpdateUser() {
    const user: CreateUpdateUser = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      role: parseInt(this.userForm.value.role),
      active: this.userForm.value.active
    }
    if (this.userData === null) {
      this.userService.Create(user).subscribe({
        next: (response) => {
          this.assetService.showAlert(response.message, 'Exito');
        },
        complete: () => {
          this.currentModal.close("true");
        },
        error: (response:any) => {
          this.assetService.showAlert(
            response.error.message ??
            "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
        }
      })
    }
    else {
      this.userService.Update(user, this.userData.id).subscribe({
        next: (response) => {
          this.assetService.showAlert(response.message, 'Exito');
        },
        complete: () => {
          this.currentModal.close("true");
        },
        error: (response:any) => {
          this.assetService.showAlert(
            response.error.message ??
            "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
        }
      })
    }
  }
}
