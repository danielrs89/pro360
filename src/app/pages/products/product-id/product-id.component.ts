import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-id',
  imports: [ReactiveFormsModule],
  templateUrl: './product-id.component.html',
  styleUrl: './product-id.component.css',
})
export class ProductIdComponent implements OnInit {
  id_provider_product!: number;
  productForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService
  ) {
    //obtiene el id del proveedor que es el que tiene los productos
    this.id_provider_product = route.snapshot.params['id'];

    // Inicializa el formulario
    this.productForm = new FormGroup({
      id_product: new FormControl(''),
      name_product: new FormControl(''),
      description_product: new FormControl(''),
      photo_product: new FormControl(''),
      id_provider: new FormControl(''),
      // unit_product: new FormControl(''),
      // price_product: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.getProductById(this.id_provider_product);
    // se previene que se queden a true en todo los casos
    this.cancelCreateEdit();
  }
 cancelCreateEdit() {
    this.productService.isCreate = false;
    this.productService.isEdit = false;
    this.productForm.reset();
  }
  // READ
  getProductById(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.productService.productsList = data;
      },
      error: (e) => {
        console.log('ERROR getProductById() => ', e.message);
      },
    });
  }
  // CREATE
  handleCreate(isCreate: boolean) {
    this.productService.isCreate = isCreate;
  }
  createProduct(){
        console.log('CREATE');
    // aqui hay que añadir el producto al proveedor no crear un producto
  }

  // UPDATE
  handleUpdate(id: number, isEdit: boolean) {
    this.productService.isEdit = isEdit;

    // seteando los valores del formulario al seleccionar un proveedor
    const product = this.productService.productsList.find(
      (p) => p.id_product === id
    );
    if (product) {
      this.productForm.patchValue(product);
    }
  }
  updateProduct() {
    // console.log(this.productForm.value);

    this.productService.updateProduct(this.productForm.value).subscribe({
      next: (data) => {
        console.log('UPDATE');
        this.getProductById(this.id_provider_product);
        this.productService.isEdit = false;
      },
      error: (e) => {
        console.log('ERROR updateProduct() => ', e.message);
      },
    });
  }
  // DELETE
  handleDelete(id: number) {
    const confirmed = confirm('¿Segura que quieres borrar?');
    if (confirmed) {
      this.deleteProduct();
    }
  }
  deleteProduct() {
    console.log('DELETE');
    // aqui hay que borrar el producto que tiene el proveedor no el producto en si
  }
}
