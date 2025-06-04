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

  getProviders() {
    return this.http.get<Provider[]>(this.API_URL);
  }
  getProviderId(id: number) {
    return this.http.get<Provider>(`${this.API_URL}/${id}`);
  }
}
