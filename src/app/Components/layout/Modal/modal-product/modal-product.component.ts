import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subcategory } from '../../../../Interfaces/subcategory';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../Interfaces/product';
import { SubcategoryService } from '../../../../Services/subcategory.service';
import { ProductService } from '../../../../Services/product.service';
import { AssetsService } from '../../../../Utils/assets.service';
import { BrandService } from '../../../../Services/brand.service';
import { Brand } from '../../../../Interfaces/brand';
import { CreateUpdateProduct } from '../../../../Interfaces/create-update-product';

//#region Chips

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

//#endregion


@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrl: './modal-product.component.css'
})
export class ModalProductComponent {

  productForm: FormGroup;
  actionTitle: string = "Create";
  actionButton: string = "Save";
  subcategoryList: Subcategory[] = [];
  brandList: Brand[] = [];
  productTags: string[] = [];


  constructor(
    private fb: FormBuilder,
    private currentModal: MatDialogRef<ModalProductComponent>,
    @Inject(MAT_DIALOG_DATA) public productData: Product, //Inyectar el componente para recibir los datos
    private subcategoryService: SubcategoryService,
    private productService: ProductService,
    private brandService: BrandService,
    private assetService: AssetsService
  ) {

    this.productForm = this.fb.group({
      subcategoryId: [null, Validators.required],
      brandId: [null, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, Validators.required],
      stock: [null, Validators.required],
      sku: ['', Validators.required],
      slug: ['', Validators.required],
      tags: [this.productTags],
      active: [true, Validators.required]
    })

    // Validar si se está añadiendo o editando
    if (this.productData !== null) {
      this.actionTitle = "Edit";
      this.actionButton = "Update";
    }

    this.subcategoryService.list().subscribe({
      next: (response) => {
        this.subcategoryList = response.data;
      },
      error: (response) => {
        this.assetService.showAlert(response.error.message ??
          "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
      }
    })

    this.brandService.list().subscribe({
      next: (response) => {
        this.brandList = response.data;
      },
      error: (response) => {
        this.assetService.showAlert(response.error.message ??
          "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")
      }
    })

    if (this.productData !== null) {
      this.productForm.patchValue ({
        subcategoryId: this.productData.subcategoryId,
        brandId: this.productData.brandId,
        name: this.productData.name,
        description: this.productData.description,
        price: this.productData.price,
        stock: this.productData.stock,
        sku: this.productData.sku,
        slug: this.productData.slug,
        active: this.productData.active
      })

      this.productTags = this.productData.tags;
    }
  }

  createOrUpdateProduct() {
    const product: CreateUpdateProduct = {
      subcategoryId: parseInt(this.productForm.value.subcategoryId),
      brandId: parseInt(this.productForm.value.brandId),
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: parseInt(this.productForm.value.price),
      stock: parseInt(this.productForm.value.stock),
      sku: this.productForm.value.sku,
      slug: this.productForm.value.slug,
      tags: this.productTags,
      active: this.productForm.value.active
    }
    if (this.productData === null) {
      this.productService.Create(product).subscribe({
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
      this.productService.Update(product, this.productData.id).subscribe({
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

  //#region Angular Material Chips

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  announcer = Inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.productTags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.productTags.indexOf(tag);

    if (index >= 0) {
      this.productTags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  // edit(fruit: Fruit, event: MatChipEditedEvent) {
  //   const value = event.value.trim();

  //   // Remove fruit if it no longer has a name
  //   if (!value) {
  //     this.remove(fruit);
  //     return;
  //   }

  //   // Edit existing fruit
  //   const index = this.fruits.indexOf(fruit);
  //   if (index >= 0) {
  //     this.fruits[index].name = value;
  //   }
  // }

  //#endregion
}
