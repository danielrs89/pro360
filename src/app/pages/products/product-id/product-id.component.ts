import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ProsService } from '../../../services/pros.service';
import { ProviderService } from '../../../services/provider.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-id',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './product-id.component.html',
  styleUrl: './product-id.component.css',
})
export class ProductIdComponent implements OnInit {
  id_provider_product!: number;
  id_product_provider!: number;
  provider_count!: number;
  unit?: number;
  price?: number;
  // productForm: FormGroup;
  // selected?: boolean = false;
  productForms: { [key: number]: FormGroup } = {}; // Crear un FormGroup por producto

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService,
    public prosService: ProsService,
    public providerService: ProviderService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    //obtiene el id del proveedor que es el que tiene los productos
    this.id_provider_product = Number(route.snapshot.params['id']); // Convierte el valor a número al asignarlo
  }
  ngOnInit(): void {
    // this.getProviderById(this.id_provider_product);
    // this.getProductById(this.id_provider_product);
    // this.getAllProviders();
    this.getAllProsById(this.id_provider_product);
    this.getProviderCountById(this.id_provider_product);
    // this.getProductByIdUpdate(this.id_provider_product);
    // this.getAllProducts();

    // se previene que se queden a true en todo los casos
    this.cancelCreateEdit();
  }

  sales(id_product_provider: number) {
    // console.log('id_product_provider ANTES => ', id_product_provider);

    this.id_product_provider = id_product_provider;
    // console.log('id_product_provider DESPUES => ', id_product_provider);

    this.handleUpdate(true);
  }
  /**
   * Calcula la cantidad total = (unit * price)
   * @param id_product
   * @returns
   */
  getTotal(id_product: number): number {
    const form = this.productForms[id_product];
    this.unit = Number(form.get('unit_pros')?.value) || 0;
    this.price = Number(form.get('price_pros')?.value) || 0;
    // console.log(`getTotal: unidades=${this.unit}, precio=${this.price}, total=${this.unit * this.price}`);
    return this.unit * this.price;
  }

  /**
   * Al comprar no puedes superar la count_provider
   * @param id_product
   * @returns
   */
  canBuy(id_product: number): boolean {
    const total = this.getTotal(id_product);
    const provider = this.provider_count;

    // console.log("count_provider", provider);

    return provider ? provider >= total : false;
  }

  /**
   * Resetea la opcion create/edit y el formulario
   */
  cancelCreateEdit() {
    this.productService.isCreate = false;
    this.productService.isEdit = false;
    // this.productForm.reset();
    for (const form of Object.values(this.productForms)) {
      form.reset(); // ✅ Llamar correctamente a reset()
    }
  }

  getAllProviders() {
    this.providerService.getAllProviders().subscribe({
      next: (data) => {
        this.providerService.providersList = data;
      },
      error: (e) => {
        console.log('ERROR getAllProviders() => ', e.message);
      },
    });
  }

  // READ
  /**
   * READ
   * Los productos de un provider
   * @param id_provider_product
   */
  // getProductById(id_provider_product: number) {
  //   this.productService.getProductById(id_provider_product).subscribe({
  //     next: (data) => {
  //       // console.log(data);

  //       this.productService.productsIDList = data;
  //     },
  //     error: (e) => {
  //       console.log('ERROR getProductById() => ', e.message);
  //     },
  //   });
  // }
  /**
   * READ
   * Los pros de un provider
   * @param id_provider_product
   */
  getAllProsById(id_provider_product: number) {
    this.prosService.getAllProsById(id_provider_product).subscribe({
      next: (data) => {
        this.prosService.prosList = data;
      },
      error: (e) => {
        // this.router.navigate(['provider',this.id_provider_product])
        console.log('ERROR getAllProsById() => ', e.message);
      },
    });
  }
  /**
   * Todas las categorías
   */
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
  /**
   * FALTA ver si ya lo llamamos y pasar a provider_count o directamente del obtenido
   * SOLO para tener count MAL
   * @param id_provider_product
   */
  getProviderCountById(id_provider_product: number) {
    this.providerService.getProviderById(id_provider_product).subscribe({
      next: (data) => {
        this.provider_count = data.count_provider;
      },
      error: (e) => {
        console.log('ERROR getProviderCountById() => ', e.message);
      },
    });
  }

  // ESTE BLOQUE ES EL BUENO

  // CREATE
  /**
   * desde productos de cada proveedor cuando le das a comprar pasa a crear(comprar) y muestra cada producto en un formulario individual en el que se puede modificar las unidades y dinero que lo compras NO se puede pasar de la cuenta inical del proveedor
   * @param isCreate
   */
  handleCreate(isCreate: boolean) {
    // console.log("this.productService.isCreate => ",isCreate);
    this.productService.isCreate = isCreate;
    this.getAllProducts();
  }
  /**
   * creando un FormGroup individual por cada producto, y lo guardas en un objeto productForms, usando id_product como clave.
   */
  getAllProducts() {
    this.productService.getAllProducts().subscribe((products) => {
      this.productService.productsList = products;
      products.forEach((product) => {
        this.productForms[product.id_product] = new FormGroup({
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
   * dentro de compra cuando le das a comprar, actualiza el count del provider y creas un pros con los datos
   * añadir un producto ya creado al proveedor, NO crea un producto
   * @param id_product
   */
  handleCreatePros(id_product: number) {
    // console.log("id_product", id_product);
    // console.log("id_provider_product", this.id_provider_product);

    this.updateProviderBuy(id_product);

    this.createPros(id_product);
  }
  /**
   *
   * @param id_provider_product
   * @param id_product
   * @returns
   */
  updateProviderBuy(id_product: number) {
    // si coincide id_provider_product leer datos
    const provider = this.providerService.providersList.find(
      (p) => p.id_provider === this.id_provider_product // IMP signo igual = (asignación), no el doble o triple igual === (comparación).
    );
    if (!provider) return;

    // console.log('PROVIDER => ', provider);

    // actualiza count
    const updateProvider = {
      ...provider,
      count_provider: provider.count_provider - this.getTotal(id_product),
    };

    // console.log('UPDATE PROVIDER => ', updateProvider);

    this.providerService.updateProvider(updateProvider).subscribe({
      next: (data) => {
        console.log('PROVIDER UPDATE');
      },
      error: (e) => {
        console.log('ERROR updateProviderBuy() => ', e.message);
      },
    });
  }
  /**
   *
   * @param id_product
   * @returns
   */
  createPros(id_product: number) {
    const form = this.productForms[id_product];

    if (form.invalid) return;
    // console.log('Enviando a createPros():', form.value);

    // console.log('form => ', form.value);

    // MUY IMP
    // seteando los valores del formulario al seleccionar un proveedor
    const product = this.productService.productsList.find(
      (p) => p.id_product === id_product
    );

    // console.log("product => ", product);

    if (product) {
      form.patchValue(product);
    }

    // console.log("form.value => ", form.value );

    this.prosService.createPros(form.value).subscribe({
      next: (data) => {
        // console.log('data => ', data);

        // Recargar los datos
        this.getProviderCountById(this.id_provider_product);
        this.getAllProsById(this.id_provider_product);

        form.reset(); // Resetea solo ese formulario

        alert('Producto comprado con éxito.'); //FALTA ESTILOS lo suyo sería un popup

        console.log('CREATE ');
      },
      error: (e) => {
        console.log('ERROR createPros() => ', e.message);
      },
    });
  }

  // UPDATE
  handleUpdate(isEdit: boolean) {
    this.productService.isEdit = isEdit;
    this.getProductByIdUpdate(this.id_provider_product);
    // this.getAllProsById(id);
  }
  /**
   * UPDATE
   * creando un FormGroup individual por cada producto de un proveedor,
   * y lo guardas en un objeto productForms, usando id_product como clave.
   */
  getProductByIdUpdate(id_provider_product: number) {
    this.prosService.getAllProsById(id_provider_product).subscribe({
      next: (data) => {
        this.prosService.prosList = data;
        data.forEach((product) => {
          const form = this.productForms[product.id_product];

          this.productForms[product.id_product] = new FormGroup({
            unit_pros: new FormControl(product.unit_pros, [
              Validators.required,
              Validators.min(1),
              Validators.max(product.unit_pros),
            ]),
            price_pros: new FormControl(product.price_pros ?? 0, [
              Validators.required,
              Validators.min(0.01),
            ]),
            id_product: new FormControl(product.id_product),
            id_provider: new FormControl(id_provider_product),
            id_category: new FormControl(product.id_category),
          });
        });
      },
      error: (e) => {
        console.log('ERROR getProductByIdUpdate() => ', e.message);
      },
    });
  }
  handleUpdatePros(id_product: number) {
    // console.log('id_product =>', id_product);
    // console.log('id_provider_product =>', this.id_provider_product);
    // this.updateProviderSell(this.id_provider_product, id_product);
    this.updatePros(id_product);
  }
  updateProviderSell(id_product: number) {
    this.providerService.getAllProviders().subscribe((data) => {
      this.providerService.providersList = data;

      // console.log('providersList:', this.providerService.providersList);
      // console.log('this.id_provider_product:', typeof this.id_provider_product);

      const provider = this.providerService.providersList.find(
        (p) => p.id_provider === this.id_provider_product
      );
      if (!provider) return;

      const updateProvider = {
        ...provider,
        count_provider:
          Number(provider.count_provider) + this.getTotal(id_product),
      };

      this.providerService.updateProvider(updateProvider).subscribe({
        next: () => {
          console.log('UPDATE PROVIDER SELL');
        },
        error: (e) => {
          console.log('ERROR updateProviderSell() => ', e.message);
        },
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

    const pros = this.prosService.prosList.find(
      (p) => p.id_product === id_product
    );
    if (!pros) return;

    const updatedPros = {
      ...pros,
      unit_pros: pros.unit_pros - unidadesVendidas,
      price_pros: precioNuevo,
    };

    this.prosService.updatePros(updatedPros).subscribe({
      next: () => {
        this.updateProviderSell(id_product);
        this.getProviderCountById(this.id_provider_product);
        this.getAllProsById(this.id_provider_product);

        // form.reset();
        if (updatedPros.unit_pros <= 0) {
          this.deleteProduct(updatedPros.id_pros); // ⬅️ Eliminar si queda a 0
          alert('Venta realizada con éxito.');
          console.log('DELETE PROS');
          this.router.navigate(['provider']);
          // SERIA LO SUYO PERO NO ME RECARGA COUNT QUE MUESTRA
          // // Forzar recarga
          // this.router
          //   .navigateByUrl('/', { skipLocationChange: true })
          //   .then(() => {
          //     this.router.navigate([
          //       '/product',
          //       Number(this.id_provider_product),
          //     ]);
          //   });
        } else {
          console.log('UPDATE PROS');
          this.router.navigate(['provider']);
        }
      },
      error: (e) => {
        console.log('ERROR updatePros() => ', e.message);
      },
    });
  }

  // DELETE
  handleDelete(id_pros: number) {
    const confirmed = confirm('¿Segura que quieres borrar?');
    if (confirmed) {
      this.deleteProduct(id_pros);
    }
  }
  deleteProduct(id_pros: number) {
    this.prosService.deletePros(id_pros).subscribe({
      next: () => {
        console.log('DELETE');
      },
      error: (e) => {
        console.log('ERROR deleteProduct() => ', e.message);
      },
    });
  }
}
