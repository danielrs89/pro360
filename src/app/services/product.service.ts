import { Injectable } from '@angular/core';
import Product from '../models/Product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API_URL = 'http://localhost:3000/product';
  // productsIDList: Product[];
  productsList: Product[];
  isCreate: boolean = false;
  isEdit: boolean = false;

  constructor(private http: HttpClient) {
    // this.productsIDList = [];
    this.productsList = [];
  }

  getAllProducts() {
    return this.http.get<Product[]>(this.API_URL);
  }
  // los productos del id_provider
  getProductById(id: number) {
    return this.http.get<Product[]>(`${this.API_URL}/${id}`);
  }

  createProduct(product: Product) {
    return this.http.post<Product>(this.API_URL, product);
  }

  updateProduct(product: Product) {
    return this.http.put<Product>(
      `${this.API_URL}/${product.id_product}`,
      product
    );
  }

  deleteProduct(id: number) {
    return this.http.delete<Product>(`${this.API_URL}/${id}`);
  }
}
