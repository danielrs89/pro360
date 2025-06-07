import { Injectable } from '@angular/core';
import Product from '../models/Product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API_URL = 'http://localhost:3000/product';
  productsList: Product[];
  photosList: string[];
  isCreate: boolean = false;
  isEdit: boolean = false;

  constructor(private http: HttpClient) {
    this.productsList = [];
    this.photosList = [
      'chuleton',
      'aceite',
      'cola',
      'haba',
      'merluza',
      'tarta',
      'vino',
      'calabaza',
    ];
  }

  getProduct() {
    return this.http.get<Product[]>(this.API_URL);
  }
  // los productos del id_provider
  getProductId(id: number) {
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

  // PROBLEMA si añado una foto no sale y es justo lo que pretendo,
  // SOLUCION crear tabla solo con nombre de las fotos de los productos
  // añade el nombre de los productos de las imágenes y lo guarda en photosList.
  // getNamePhoto() {
  //   if (this.productsList.length) {
  //     const photoSet = new Set<string>(); // evitar duplicados
  //     this.productsList.forEach(product => {
  //       photoSet.add(product.photo_product);
  //     });
  //     this.photosList = Array.from(photoSet);
  //   }
  // }
}
