import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Product from '../models/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API_URL = 'http://localhost:3000/product';
  productsList: Product[];
  // productsIDList: Product[];

  constructor(private http: HttpClient) {
    this.productsList = [];
    // this.productsIDList = [];
  }

  getAllProducts() {
    return this.http.get<Product[]>(this.API_URL);
  }
  getProductById(id_product: number) {
    return this.http.get<Product>(`${this.API_URL}/${id_product}`);
  }
  createProduct(product: Product) {
    return this.http.post<Product>(this.API_URL, product);
  }
  updateProduct(product: Product) {
    return this.http.put<Product>(`${this.API_URL}/${product.id_product}`, product);
  }
  deleteProduct(id_product: number) {
    return this.http.delete<Product>(`${this.API_URL}/${id_product}`);
  }
}
