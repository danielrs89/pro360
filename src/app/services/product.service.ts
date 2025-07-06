import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Product from '../models/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API_URL = 'http://localhost:3000/product';
  productsList: Product[];
  namePhotoList: string[];
  

  constructor(private http: HttpClient) {
    this.productsList = [];
    this.namePhotoList = [];
    
  }

  getAllProducts() {
    return this.http.get<Product[]>(this.API_URL);
  }
  getProductById(id_product: number) {
    return this.http.get<Product>(`${this.API_URL}/${id_product}`);
  }
  getNamePhoto(): Observable<string[]> {
    return this.http.get<string[]>('/assets/img/products/images.json');
  }
  _getNamePhotos() {
    return this.http.get<string[]>(`${this.API_URL}/photos`);
  }
  createProduct(productData: FormData) {
    return this.http.post(this.API_URL, productData);
  }
  _createProduct(product: Product) {
    return this.http.post<Product>(this.API_URL, product);
  }
  updateProduct(product: Product) {
    return this.http.put<Product>(
      `${this.API_URL}/${product.id_product}`,
      product
    );
  }
  deleteProduct(id_product: number) {
    return this.http.delete<Product>(`${this.API_URL}/${id_product}`);
  }
}
