import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-id',
  imports: [],
  templateUrl: './product-id.component.html',
  styleUrl: './product-id.component.css',
})
export class ProductIdComponent implements OnInit {
  id_provider_product!: number;

  // productForms: { [key: number]: FormGroup } = {}; // Crear un FormGroup por producto

  constructor(public route: ActivatedRoute) {
    //obtiene el id del proveedor que es el que tiene los productos
    this.id_provider_product = Number(route.snapshot.params['id']); // Convierte el valor a número al asignarlo
  }
  ngOnInit(): void {}
}
