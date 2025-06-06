import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import Product from '../../../models/Product';

@Component({
  selector: 'app-product',
  imports: [ ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  // product?: Product;

  productForm: FormGroup;

  constructor(public productService: ProductService) {
    // CREATE
    this.productForm = new FormGroup({
      id_product: new FormControl(''),
      name_product: new FormControl(''),
      description_product: new FormControl(''),
      unit_product: new FormControl(''),
      price_product: new FormControl(''),
      photo_product: new FormControl(''),
      id_provider: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.getProducts()
    // se previene que se queden a true en todo los casos
    this.cancelCreateEdit();
  }

  cancelCreateEdit() {
    this.productService.isCreate = false;
    this.productService.isEdit = false;
    this.productForm.reset();
  }


  // READ
  getProducts() {
    this.productService.getProduct().subscribe({
      next: (products) => {
        // Filtra duplicados por name_product
        this.productService.productsList = products.filter(
          (product, index, self) =>
            index === self.findIndex(p => p.name_product === product.name_product)
        );
      },
      error: (e) => {
        console.log("ERROR getProduct() => ", e.message);
      }
    });
  }
  getProductId(id: number) {
    this.productService.getProductId(id).subscribe({
      next: (data) => {
        this.productService.productsList = data
      },
      error: (e) => {
        console.log("ERROR getProductId() => ", e.message);
      }
    })
  }

  // CREATE
  handleCreate(isCreate: boolean) {
    this.productService.isCreate = isCreate;
  }
  createProduct() {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (data) => {
        console.log("CREATE");
        this.getProducts();
        this.productService.isCreate = false;
      },
      error: (e) => {
        console.log("ERROR createProduct() => ", e.message);
      }
    })
  }

  // UPDATE
  handleUpdate(id: number, isEdit: boolean) {
    this.productService.isEdit = isEdit;

    // seteando los valores del formulario al seleccionar un proveedor
    const product = this.productService.productsList.find(p => p.id_product === id);
    if (product) {
      this.productForm.patchValue(product);
    }
  }

  updateProduct() {
    this.productService.updateProduct(this.productForm.value).subscribe({
      next: (data) => {
        console.log("UPDATE");
        this.getProducts();
        this.productService.isEdit = false;
      },
      error: (e) => {
        console.log("ERROR updateProduct() => ", e.message);
      }
    })
  }

  // DELETE
  handleDelete(id: number) {
    const confirmed = confirm("¿Seguro que quieres borrar?")
    if (confirmed) {
      this.deleteProduct(id)
    }
  }
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: (data) => {
        console.log("DELETE");
        this.getProducts();
      },
      error: (e) => {
        console.log("ERROR deleteProduct() => ", e.message);
      }
    })
  }
}
