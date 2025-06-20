import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Provider from '../../models/Provider';
import { CategoryService } from '../../services/category.service';
import { HandleService } from '../../services/handle.service';

@Component({
  selector: 'app-provider',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.css',
})
export class ProviderComponent implements OnInit {
  providerForm: FormGroup;
  id_provider: FormControl;
  cif_provider: FormControl;
  name_provider: FormControl;
  email_provider: FormControl;
  phone_provider: FormControl;
  count_provider: FormControl;
  id_category: FormControl;
  // idSelected: number;

  constructor(
    public providerService: ProviderService,
    public categoryService: CategoryService,
    public handleService: HandleService // private router: Router
  ) {
    // this.idSelected = 0;

    // CREATE
    this.id_provider = new FormControl('');
    this.cif_provider = new FormControl('');
    this.name_provider = new FormControl('');
    this.email_provider = new FormControl('');
    this.phone_provider = new FormControl('');
    this.count_provider = new FormControl('');
    this.id_category = new FormControl('');

    this.providerForm = new FormGroup({
      id_provider: this.id_provider,
      cif_provider: this.cif_provider,
      name_provider: this.name_provider,
      email_provider: this.email_provider,
      phone_provider: this.phone_provider,
      count_provider: this.count_provider,
      id_category: this.id_category,
    });
  }

  ngOnInit(): void {
    this.getProviders();
    // se previene que se queden a true en todo los casos
    this.cancelCreateEdit();

    this.getAllCategories();
  }
  cancelCreateEdit() {
    // se previene que se queden a true en todo los casos
    this.handleService.handleCreate(false);
    this.handleService.handleEdit(false);
    // this.providerService.isCreate = false;
    // this.providerService.isEdit = false;
    this.providerForm.reset();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categoryService.categoriesLIst = data;
      },
      error: (e) => {
        console.log('ERROR getAllCategories() => ', e);
      },
    });
  }

  // READ
  getProviders() {
    this.providerService.getAllProviders().subscribe({
      next: (data) => {
        this.providerService.providersList = data;
      },
      error: (e) => {
        console.log('ERROR getProviders() => ', e);
      },
    });
  }

  // CREATE
  handleCreate(isCreate: boolean) {
    this.handleService.handleCreate(true);
    
  }
  createProvider() {
    // console.log("Datos del formulario =>", this.providerForm.value);

    this.providerService.createProvider(this.providerForm.value).subscribe({
      next: (data) => {
        // console.log("Datos que se envía al servidor", data);
        console.log('CREATE');
        this.getProviders();
        this.handleService.handleCreate(false);
      },
      error: (e) => {
        console.log('ERROR createProvider() => ', e.message);
      },
    });
  }

  // UPDATE
  handleUpdate(id: number, isEdit: boolean) {
    this.handleService.handleEdit(true);

    // seteando los valores del formulario al seleccionar un proveedor
    const provider = this.providerService.providersList.find(
      (p) => p.id_provider === id
    );
    if (provider) {
      this.providerForm.patchValue(provider);
    }
  }

  updateProvider() {
    // console.log("Datos del formulario =>", this.providerForm.value);

    this.providerService.updateProvider(this.providerForm.value).subscribe({
      next: (data) => {
        // console.log("Datos que se envía al servidor", data);
        console.log('UPDATE');
        this.getProviders();
        
    this.handleService.handleEdit(false);
      },
      error: (e) => {
        console.log('ERROR updateProvider() => ', e.message);
      },
    });
  }
  // DELETE
  handleDelete(id: number) {
    const confirmed = confirm('¿Seguro que quieres borrar?');
    if (confirmed) {
      this.deleteProvider(id);
    }
  }
  deleteProvider(id: number) {
    this.providerService.deleteProvider(id).subscribe({
      next: (data) => {
        console.log('DELETE');
        this.getProviders();
      },
      error: (e) => {
        console.log('ERROR deleteProvider(id: number) => ', e);
      },
    });
  }
}
