import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Pros from '../models/Pros';

@Injectable({
  providedIn: 'root',
})
export class ProsService {
  readonly API_URL = 'http://localhost:3000/pros';
  prosList: Pros[];

  constructor(private http: HttpClient) {
    this.prosList = [];
  }

  getAllProsById(id: number) {
    return this.http.get<Pros[]>(`${this.API_URL}/${id}`);
  }
  createPros(pros: Pros) {
    return this.http.post<Pros>(this.API_URL, pros);
  }

  updatePros(pros: Pros) {
    return this.http.put<Pros>(`${this.API_URL}/${pros.id_pros}`, pros);
  }
}
