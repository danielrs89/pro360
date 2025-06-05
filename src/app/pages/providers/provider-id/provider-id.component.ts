import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';
import Provider from '../../../models/Provider';

@Component({
  selector: 'app-provider-id',
  imports: [],
  templateUrl: './provider-id.component.html',
  styleUrl: './provider-id.component.css'
})
export class ProviderIdComponent implements OnInit {
  providerId?: Provider;

  constructor(private route: ActivatedRoute, private providerService: ProviderService) {

  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']
    this.getProviderId(id);
  }

  getProviderId(id: number) {
    this.providerService.getProviderId(id).subscribe({
      next: (data) => {
        this.providerId = data;
      },
      error: (e) => {
        console.log("ERROR getProviderId(id: number) => ", e);
      }
    })
  }
}
