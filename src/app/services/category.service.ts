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
  getCategoryById(id_category: number) {
    return this.http.get<Category>(`${this.API_URL}/${id_category}`);
  }
  createCategory(category: Category) {
    return this.http.post<Category>(this.API_URL, category);
  }
  updateCategory(category: Category) {
    return this.http.put<Category>(`${this.API_URL}/${category.id_category}`, category);
  }
  deleteCategory(id_category: number) {
    return this.http.delete<Category>(`${this.API_URL}/${id_category}`);
  }
}
