import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../../services/provider.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-provider',
  imports: [RouterLink],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.css',
})
export class ProviderComponent implements OnInit {
  constructor(public providerService: ProviderService) { }

  ngOnInit(): void {
    this.getProviders();
  }

  getProviders() {
    this.providerService.getProviders().subscribe({
      next: (data) => {
        this.providerService.providersList = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
