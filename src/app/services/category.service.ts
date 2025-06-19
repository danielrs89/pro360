import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Category from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  readonly API_URL = 'http://localhost:3000/category';
  categoriesLIst: Category[];

  constructor(private http: HttpClient) {
    this.categoriesLIst = [];
  }

  getAllCategories() {
    return this.http.get<Category[]>(this.API_URL);
  }
}
