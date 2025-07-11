import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ProsService } from '../../../services/pros.service';
import { ProviderService } from '../../../services/provider.service';
import { HandleService } from '../../../services/handle.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-id',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './product-id.component.html',
  styleUrl: './product-id.component.css',
})
export class ProductIdComponent implements OnInit {
  // Variables de estado del componente
  id_provider_product: number; // ID del proveedor-producto actual
  id_product_provider!: number; // ID del producto-proveedor para operaciones
  provider_count!: number; // Saldo disponible del proveedor
  unit?: number; // Unidades temporales para cálculos
  price?: number; // Precio temporal para cálculos

  // Diccionario de formularios por producto
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
    // Obtiene el ID del proveedor-producto de la ruta
    this.id_provider_product = Number(route.snapshot.params['id']);
  }

  ngOnInit(): void {
    // Inicialización del componente
    this.getAllProsById(this.id_provider_product); // Obtiene todos los productos del proveedor
    this.getAllProductsRead(); // Obtiene detalles del producto
    this.getProviderCountById(this.id_provider_product); // Obtiene el saldo del proveedor

    this.cancelCreateEdit(); // Restablece estados de creación/edición
  }

  // ================ OPERACIONES BÁSICAS ================

  /**
   * Prepara el componente para realizar una venta
   * @param id_product_provider ID del producto-proveedor a vender
   */
  sales(id_product_provider: number) {
    this.id_product_provider = id_product_provider;
    this.handleUpdate(true); // Activa el modo edición
  }

  /**
   * Calcula el total a pagar por un producto
   * @param id_product ID del producto
   * @returns Total (unidades * precio)
   */
  getTotal(id_product: number): number {
    const form = this.productForms[id_product];
    this.unit = Number(form.get('unit_pros')?.value) || 0;
    this.price = Number(form.get('price_pros')?.value) || 0;
    return this.unit * this.price;
  }

  /**
   * Verifica si el proveedor puede comprar el producto
   * @param id_product ID del producto
   * @returns true si el saldo es suficiente, false en caso contrario
   */
  canBuy(id_product: number): boolean {
    const total = this.getTotal(id_product);
    return this.provider_count ? this.provider_count >= total : false;
  }

  /**
   * Restablece los estados de creación/edición y limpia formularios
   */
  cancelCreateEdit() {
    this.handleService.isCreate = false;
    this.handleService.isEdit = false;
    Object.values(this.productForms).forEach((form) => form.reset());
  }

  // ================ OPERACIONES DE LECTURA ================

  /**
   * Obtiene todos los productos asociados a un proveedor
   * @param id_provider_product ID del proveedor-producto
   */
  getAllProsById(id_provider_product: number) {
    this.prosService.getAllProsById(id_provider_product).subscribe({
      next: (data) => (this.prosService.prosList = data),
      error: (e) => console.error('Error obteniendo pros:', e.message),
    });
  }
  /**
   * Obtiene los productos de un proveedor específico
   */
  getAllProductsRead() {
    this.productService.getAllProducts().subscribe((products) => {
      this.productService.productsList = products;
    });
  }

  /**
   * Obtiene el saldo disponible de un proveedor
   * @param id_provider_product ID del proveedor-producto
   */
  getProviderCountById(id_provider_product: number) {
    this.providerService.getProviderById(id_provider_product).subscribe({
      next: (data) => (this.provider_count = data.count_provider),
      error: (e) =>
        console.error('Error obteniendo count provider:', e.message),
    });
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categoryService.categoriesLIst = data),
      error: (e) => console.error('Error obteniendo categorías:', e),
    });
  }

  // ================ OPERACIONES DE CREACIÓN ================

  /**
   * Activa el modo creación y carga todos los productos disponibles
   * @param isCreate Estado a establecer para creación
   */
  handleCreate(isCreate: boolean) {
    this.handleService.isCreate = isCreate;
    this.getAllProducts();
  }

  /**
   * Obtiene todos los productos y prepara sus formularios
   */
  getAllProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.productService.productsList = products;
      // Crea un formulario por cada producto
      products.forEach((product) => {
        this.productForms[product.id_product!] = new FormGroup({
          unit_pros: new FormControl('', [
            Validators.required,
            Validators.min(1),
          ]),
          price_pros: new FormControl('', [
            Validators.required,
            Validators.min(1),
          ]),
          id_product: new FormControl(product.id_product),
          id_provider: new FormControl(this.id_provider_product),
          id_category: new FormControl(product.id_category),
        });
      });
    });
  }

  /**
   * Maneja la creación de una nueva compra
   * @param id_product ID del producto a comprar
   */
  handleCreatePros(id_product: number) {
    this.updateProviderBuy(id_product); // Actualiza saldo del proveedor
    this.createPros(id_product); // Crea el registro de compra
  }

  /**
   * Actualiza el saldo del proveedor después de una compra
   * @param id_product ID del producto comprado
   */
  updateProviderBuy(id_product: number) {
    const provider = this.providerService.providersList.find(
      (p) => p.id_provider === this.id_provider_product
    );
    if (!provider) return;

    const updateProvider = {
      ...provider,
      count_provider: provider.count_provider - this.getTotal(id_product),
    };

    this.providerService.updateProvider(updateProvider).subscribe({
      next: () => console.log('Provider actualizado'),
      error: (e) => console.error('Error actualizando provider:', e.message),
    });
  }

  /**
   * Crea un nuevo registro de compra
   * @param id_product ID del producto comprado
   */
  createPros(id_product: number) {
    const form = this.productForms[id_product];
    if (form.invalid) return;

    // Completa los datos del formulario con información del producto
    const product = this.productService.productsList.find(
      (p) => p.id_product === id_product
    );
    if (product) form.patchValue(product);

    this.prosService.createPros(form.value).subscribe({
      next: () => {
        this.getProviderCountById(this.id_provider_product); // Actualiza saldo
        this.getAllProsById(this.id_provider_product); // Actualiza lista
        form.reset(); // Limpia formulario
        alert('Producto comprado con éxito.');
      },
      error: (e) => console.error('Error creando pros:', e.message),
    });
  }

  // ================ OPERACIONES DE ACTUALIZACIÓN ================

  /**
   * Activa el modo edición y carga los productos para vender
   * @param isEdit Estado a establecer para edición
   */
  handleUpdate(isEdit: boolean) {
    this.handleService.isEdit = isEdit;
    this.getProductByIdUpdate(this.id_provider_product);
  }

  /**
   * Obtiene los productos del proveedor para vender y prepara sus formularios
   * @param id_provider_product ID del proveedor-producto
   */
  getProductByIdUpdate(id_provider_product: number) {
    this.prosService.getAllProsById(id_provider_product).subscribe({
      next: (data) => {
        this.prosService.prosList = data;
        // Crea formularios con validaciones específicas para venta
        data.forEach((product) => {
          this.productForms[product.id_product] = new FormGroup({
            unit_pros: new FormControl(product.unit_pros, [
              Validators.required,
              Validators.min(1),
              Validators.max(product.unit_pros), // No puede vender más de lo que tiene
            ]),
            price_pros: new FormControl(product.price_pros ?? 0, [
              Validators.required,
              Validators.min(0.01), // Precio mínimo
            ]),
            id_product: new FormControl(product.id_product),
            id_provider: new FormControl(id_provider_product),
            id_category: new FormControl(product.id_category),
          });
        });
      },
      error: (e) =>
        console.error('Error obteniendo pros para actualizar:', e.message),
    });
  }

  /**
   * Maneja la actualización de un producto (venta)
   * @param id_product ID del producto a vender
   */
  handleUpdatePros(id_product: number) {
    this.updatePros(id_product);
  }

  /**
   * Actualiza el saldo del proveedor después de una venta
   * @param id_product ID del producto vendido
   */
  updateProviderSell(id_product: number) {
    this.providerService.getAllProviders().subscribe((data) => {
      const provider = data.find(
        (p) => p.id_provider === this.id_provider_product
      );
      if (!provider) return;

      const updateProvider = {
        ...provider,
        count_provider:
          Number(provider.count_provider) + this.getTotal(id_product),
      };

      this.providerService.updateProvider(updateProvider).subscribe({
        next: () => console.log('Provider actualizado por venta'),
        error: (e) =>
          console.error('Error actualizando provider en venta:', e.message),
      });
    });
  }

  /**
   * Actualiza el registro de producto después de una venta
   * @param id_product ID del producto vendido
   */
  updatePros(id_product: number) {
    const form = this.productForms[id_product];
    if (!form || form.invalid) return;

    const unidadesVendidas = Number(form.get('unit_pros')?.value);
    const precioNuevo = Number(form.get('price_pros')?.value);

    // Validación de valores numéricos
    if (isNaN(unidadesVendidas) || isNaN(precioNuevo)) {
      alert('Valores inválidos. Por favor, introduce números válidos.');
      return;
    }

    const pros = this.prosService.prosList.find(
      (p) => p.id_product === id_product
    );
    if (!pros) return;

    // Prepara los datos actualizados
    const updatedPros = {
      ...pros,
      unit_pros: pros.unit_pros - unidadesVendidas, // Reduce el stock
      price_pros: precioNuevo, // Actualiza el precio
    };

    this.prosService.updatePros(updatedPros).subscribe({
      next: () => {
        this.updateProviderSell(id_product); // Actualiza saldo del proveedor
        this.getProviderCountById(this.id_provider_product); // Actualiza vista
        this.getAllProsById(this.id_provider_product); // Actualiza lista

        // Si se agotó el producto, lo elimina
        if (updatedPros.unit_pros <= 0) {
          this.deleteProduct(updatedPros.id_pros);
          alert('Venta realizada con éxito.');
          this.router.navigate(['provider']);
        } else {
          this.router.navigate(['provider']);
        }
      },
      error: (e) => console.error('Error actualizando pros:', e.message),
    });
  }

  // ================ OPERACIONES DE ELIMINACIÓN ================

  /**
   * Confirma y maneja la eliminación de un producto
   * @param id_pros ID del producto a eliminar
   */
  handleDelete(id_pros: number) {
    if (confirm('¿Seguro que quieres borrar?')) {
      this.deleteProduct(id_pros);
    }
  }

  /**
   * Elimina un producto del proveedor
   * @param id_pros ID del producto a eliminar
   */
  deleteProduct(id_pros: number) {
    this.prosService.deletePros(id_pros).subscribe({
      next: () => console.log('Pros eliminado'),
      error: (e) => console.error('Error eliminando pros:', e.message),
    });
  }
}
