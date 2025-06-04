import { HttpClient } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import Providers from '../models/Providers';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  readonly API_URL = 'http://localhost:3000/provider';
  providersList: Providers[];

  constructor(private http: HttpClient) {
    this.providersList = [];
  }

  getProviders() {
    return this.http.get<Providers[]>(this.API_URL);
  }
}
