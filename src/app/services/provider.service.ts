import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Provider from '../models/Provider';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {

  readonly API_URL = 'http://localhost:3000/provider';
  providersList: Provider[];
  isCreate: boolean = false;
  isEdit: boolean = false;


  constructor(private http: HttpClient) {
    this.providersList = [];
  }

  getProviders() {
    return this.http.get<Provider[]>(this.API_URL);
  }
  getProviderId(id: number) {
    return this.http.get<Provider>(`${this.API_URL}/${id}`);
  }

  createProvider(provider: Provider) {
    return this.http.post<Provider>(this.API_URL, provider);
  }

  updateProvider(provider: Provider) {
    return this.http.put<Provider>(`${this.API_URL}/${provider.id_provider}`, provider);
  }

  deleteProvider(id: number) {
    return this.http.delete<Provider>(`${this.API_URL}/${id}`);
  }
}
