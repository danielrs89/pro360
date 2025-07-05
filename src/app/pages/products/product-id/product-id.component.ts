import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ProsService } from '../../../services/pros.service';
import { ProviderService } from '../../../services/provider.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HandleService } from '../../../services/handle.service';

@Component({
  selector: 'app-product-id',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './product-id.component.html',
  styleUrls: ['./product-id.component.css']
})
export class ProductIdComponent implements OnInit {
  id_provider_product: number;
  id_product_provider!: number;
  provider_count!: number;
  unit?: number;
  price?: number;
  productForms: { [key: number]: FormGroup } = {};

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService,
    public prosService: ProsService,
    public providerService: ProviderService,
    public handleService: HandleService,
    public route: ActivatedRoute,
    private router: Router

  ) {
    this.id_provider_product = Number(route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.getAllProsById(this.id_provider_product);
    this.getProviderCountById(this.id_provider_product);
    this.cancelCreateEdit();
  }

  // ================ OPERACIONES BÁSICAS ================

  sales(id_product_provider: number) {
    this.id_product_provider = id_product_provider;
    this.handleUpdate(true);
  }

  getTotal(id_product: number): number {
    const form = this.productForms[id_product];
    this.unit = Number(form.get('unit_pros')?.value) || 0;
    this.price = Number(form.get('price_pros')?.value) || 0;
    return this.unit * this.price;
  }

  canBuy(id_product: number): boolean {
    const total = this.getTotal(id_product);
    return this.provider_count ? this.provider_count >= total : false;
  }

  cancelCreateEdit() {
    this.handleService.isCreate = false;
    this.handleService.isEdit = false;
    Object.values(this.productForms).forEach(form => form.reset());
  }

  // ================ OPERACIONES DE LECTURA ================

  getAllProsById(id_provider_product: number) {
    this.prosService.getAllProsById(id_provider_product).subscribe({
      next: (data) => this.prosService.prosList = data,
      error: (e) => console.error('Error obteniendo pros:', e.message)
    });
  }

  getProviderCountById(id_provider_product: number) {
    this.providerService.getProviderById(id_provider_product).subscribe({
      next: (data) => this.provider_count = data.count_provider,
      error: (e) => console.error('Error obteniendo count provider:', e.message)
    });
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categoryService.categoriesLIst = data,
      error: (e) => console.error('Error obteniendo categorías:', e)
    });
  }

  // ================ OPERACIONES DE CREACIÓN ================

  handleCreate(isCreate: boolean) {
    this.handleService.isCreate = isCreate;
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.productService.productsList = products;
      products.forEach(product => {
        this.productForms[product.id_product!] = new FormGroup({
          unit_pros: new FormControl('', [Validators.required, Validators.min(1)]),
          price_pros: new FormControl('', [Validators.required, Validators.min(1)]),
          id_product: new FormControl(product.id_product),
          id_provider: new FormControl(this.id_provider_product),
          id_category: new FormControl(product.id_category)
        });
      });
    });
  }

  handleCreatePros(id_product: number) {
    this.updateProviderBuy(id_product);
    this.createPros(id_product);
  }

  updateProviderBuy(id_product: number) {
    const provider = this.providerService.providersList.find(
      p => p.id_provider === this.id_provider_product
    );
    if (!provider) return;

    const updateProvider = {
      ...provider,
      count_provider: provider.count_provider - this.getTotal(id_product)
    };

    this.providerService.updateProvider(updateProvider).subscribe({
      next: () => console.log('Provider actualizado'),
      error: (e) => console.error('Error actualizando provider:', e.message)
    });
  }

  createPros(id_product: number) {
    const form = this.productForms[id_product];
    if (form.invalid) return;

    const product = this.productService.productsList.find(p => p.id_product === id_product);
    if (product) form.patchValue(product);

    this.prosService.createPros(form.value).subscribe({
      next: () => {
        this.getProviderCountById(this.id_provider_product);
        this.getAllProsById(this.id_provider_product);
        form.reset();
        alert('Producto comprado con éxito.');
      },
      error: (e) => console.error('Error creando pros:', e.message)
    });
  }

  // ================ OPERACIONES DE ACTUALIZACIÓN ================

  handleUpdate(isEdit: boolean) {
    this.handleService.isEdit = isEdit;
    this.getProductByIdUpdate(this.id_provider_product);
  }

  getProductByIdUpdate(id_provider_product: number) {
    this.prosService.getAllProsById(id_provider_product).subscribe({
      next: (data) => {
        this.prosService.prosList = data;
        data.forEach(product => {
          this.productForms[product.id_product] = new FormGroup({
            unit_pros: new FormControl(product.unit_pros, [
              Validators.required,
              Validators.min(1),
              Validators.max(product.unit_pros)
            ]),
            price_pros: new FormControl(product.price_pros ?? 0, [
              Validators.required,
              Validators.min(0.01)
            ]),
            id_product: new FormControl(product.id_product),
            id_provider: new FormControl(id_provider_product),
            id_category: new FormControl(product.id_category)
          });
        });
      },
      error: (e) => console.error('Error obteniendo pros para actualizar:', e.message)
    });
  }

  handleUpdatePros(id_product: number) {
    this.updatePros(id_product);
  }

  updateProviderSell(id_product: number) {
    this.providerService.getAllProviders().subscribe(data => {
      const provider = data.find(p => p.id_provider === this.id_provider_product);
      if (!provider) return;

      const updateProvider = {
        ...provider,
        count_provider: Number(provider.count_provider) + this.getTotal(id_product)
      };

      this.providerService.updateProvider(updateProvider).subscribe({
        next: () => console.log('Provider actualizado por venta'),
        error: (e) => console.error('Error actualizando provider en venta:', e.message)
      });
    });
  }

  updatePros(id_product: number) {
    const form = this.productForms[id_product];
    if (!form || form.invalid) return;

    const unidadesVendidas = Number(form.get('unit_pros')?.value);
    const precioNuevo = Number(form.get('price_pros')?.value);

    if (isNaN(unidadesVendidas) || isNaN(precioNuevo)) {
      alert('Valores inválidos. Por favor, introduce números válidos.');
      return;
    }

    const pros = this.prosService.prosList.find(p => p.id_product === id_product);
    if (!pros) return;

    const updatedPros = {
      ...pros,
      unit_pros: pros.unit_pros - unidadesVendidas,
      price_pros: precioNuevo
    };

    this.prosService.updatePros(updatedPros).subscribe({
      next: () => {
        this.updateProviderSell(id_product);
        this.getProviderCountById(this.id_provider_product);
        this.getAllProsById(this.id_provider_product);

        if (updatedPros.unit_pros <= 0) {
          this.deleteProduct(updatedPros.id_pros);
          alert('Venta realizada con éxito.');
          this.router.navigate(['provider']);
        } else {
          this.router.navigate(['provider']);
        }
      },
      error: (e) => console.error('Error actualizando pros:', e.message)
    });
  }

  // ================ OPERACIONES DE ELIMINACIÓN ================

  handleDelete(id_pros: number) {
    if (confirm('¿Seguro que quieres borrar?')) {
      this.deleteProduct(id_pros);
    }
  }

  deleteProduct(id_pros: number) {
    this.prosService.deletePros(id_pros).subscribe({
      next: () => console.log('Pros eliminado'),
      error: (e) => console.error('Error eliminando pros:', e.message)
    });
  }
}