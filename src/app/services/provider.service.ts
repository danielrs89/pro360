import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Provider from '../models/Provider';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  readonly API_URL = 'http://localhost:3000/provider';
  providersList: Provider[];

  constructor(private http: HttpClient) {
    this.providersList = [];
  }

  getAllProviders() {
    return this.http.get<Provider[]>(this.API_URL);
  }
  getProviderById(id_provider: number) {
    return this.http.get<Provider>(`${this.API_URL}/${id_provider}`);
  }
  createProvider(provider: Provider) {
    return this.http.post<Provider>(this.API_URL, provider);
  }
  updateProvider(provider: Provider) {
    return this.http.put<Provider>(`${this.API_URL}/${provider.id_provider}`, provider);
  }
  deleteProvider(id_provider: number) {
    return this.http.delete<Provider>(`${this.API_URL}/${id_provider}`);
  }

  // muestra los providers que tienen el mismo producto
  getProvidersByProduct(id_product:number){
    return this.http.get<Provider[]>(`${this.API_URL}/${id_product}`)
  }
}
