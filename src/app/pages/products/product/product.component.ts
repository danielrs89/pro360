import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import Product from '../../../models/Product';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product',
  imports: [ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  // product?: Product;
  productForm: FormGroup;

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService
  ) {
    // Inicializa el formulario
    this.productForm = new FormGroup({
      id_product: new FormControl(''),
      name_product: new FormControl(''),
      description_product: new FormControl(''),
      // unit_product: new FormControl(''),
      // price_product: new FormControl(''),
      photo_product: new FormControl(''),
      id_provider: new FormControl(''),
      id_category: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();

    // previene que se queden a true en todo los casos
    this.cancelCreateEdit();
  }

  cancelCreateEdit() {
    this.productService.isCreate = false;
    this.productService.isEdit = false;
    this.productForm.reset();
  }
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categoryService.categoriesLIst = data;
      },
      error: (e) => {
        console.log('ERROR getAllCategories() => ', e);
      },
    });
  }

  // READ
  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Filtra duplicados por name_product
        this.productService.productsList = products.filter(
          (product, index, self) =>
            index ===
            self.findIndex((p) => p.name_product === product.name_product)
        );
        // this.productService.getNamePhoto(); // añade de productos el nombre de las imágenes y lo guarda en photosList.
      },
      error: (e) => {
        console.log('ERROR getProduct() => ', e.message);
      },
    });
  }

  // CREATE
  handleCreate(isCreate: boolean) {
    this.productService.isCreate = isCreate;
  }
  createProduct() {
    const newProduct = this.productForm.value;
    const exists = this.productService.productsList.some(
      (product) =>
        product.name_product.trim().toLowerCase() ===
        newProduct.name_product.trim().toLowerCase()
    );

    if (exists) {
      alert('El producto ya existe');
      return;
    }
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (data) => {
        console.log('CREATE');
        this.getAllProducts();
        this.productService.isCreate = false;
      },
      error: (e) => {
        console.log('ERROR createProduct() => ', e.message);
      },
    });
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
        this.getAllProducts();
        this.productService.isEdit = false;
      },
      error: (e) => {
        console.log('ERROR updateProduct() => ', e.message);
      },
    });
  }

  // DELETE
  handleDelete(id: number) {
    const confirmed = confirm('¿Seguro que quieres borrar?');
    if (confirmed) {
      this.deleteProduct(id);
    }
  }
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: (data) => {
        console.log('DELETE');
        this.getAllProducts();
      },
      error: (e) => {
        console.log('ERROR deleteProduct() => ', e.message);
      },
    });
  }
}
