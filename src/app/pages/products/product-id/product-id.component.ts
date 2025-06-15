import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-product-id',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './product-id.component.html',
  styleUrl: './product-id.component.css',
})
export class ProductIdComponent implements OnInit {
  id_provider_product!: number;
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
    public route: ActivatedRoute
  ) {
    //obtiene el id del proveedor que es el que tiene los productos
    this.id_provider_product = route.snapshot.params['id'];
  }
  ngOnInit(): void {
    // this.getProviderById(this.id_provider_product);
    // this.getProductById(this.id_provider_product);
    this.getAllProsById(this.id_provider_product);
    this.getProviderById(this.id_provider_product);
    // this.getProductByIdUpdate(this.id_provider_product);
    // this.getAllProducts();

    // se previene que se queden a true en todo los casos
    this.cancelCreateEdit();
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

  // READ
  /**
   * READ
   * Los productos de un provider
   * @param id_provider_product
   */
  getProductById(id_provider_product: number) {
    this.productService.getProductById(id_provider_product).subscribe({
      next: (data) => {
        // console.log(data);

        this.productService.productsIDList = data;
      },
      error: (e) => {
        console.log('ERROR getProductById() => ', e.message);
      },
    });
  }
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
  getProviderById(id_provider_product: number) {
    this.providerService.getProviderById(id_provider_product).subscribe({
      next: (data) => {
        this.provider_count = data.count_provider;
      },
      error: (e) => {
        console.log('ERROR getAllProviders() => ', e.message);
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
   */
  handleCreatePros(id_product: number) {
    // console.log("id_product", id_product);
    // console.log("id_provider_product", this.id_provider_product);

    this.updateProviderBuy(this.id_provider_product, id_product);

    this.createPros(id_product);
  }
  updateProviderBuy(id_provider_product: number, id_product: number) {
    // si coincide id_provider_product leer datos
    const provider = this.providerService.providersList.find(
      (p) => (p.id_provider = id_provider_product)
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

        // this.providerService.updateProvider(provider).subscribe({
        //   next: (data) => {
        //     console.log('UPDATE PROVIDER COUNT');
        //   },
        //   error: (e) => {
        //     console.log('ERROR updateProvider() => ', e.message);
        //   },
        // });
      },
      error: (e) => {
        console.log('ERROR updateProvider()/getProviderById => ', e.message);
      },
    });
  }
  createPros(id_product: number) {
    const form = this.productForms[id_product];

    if (form.invalid) return;
    // console.log('Enviando a createPros():', form.value);

    // console.log('form => ', form.value);

    // seteando los valores del formulario al seleccionar un proveedor
    const product = this.productService.productsList.find(
      (p) => p.id_product === id_product
    );
    if (product) {
      form.patchValue(product);
    }

    this.prosService.createPros(form.value).subscribe({
      next: (data) => {
        // console.log('data => ', data);

        // Recargar los datos
        this.getProviderById(this.id_provider_product);
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
    // this.getAllProsById(id);

    this.productService.isEdit = isEdit;
    this.getProductByIdUpdate(this.id_provider_product);
    // // seteando los valores del formulario al seleccionar un proveedor
    // const product = this.productService.productsList.find(
    //   (p) => p.id_product === id
    // );
    // if (product) {
    //   this.productForm.patchValue(product);
    // }
  }
  /**
   * UPDATE
   * creando un FormGroup individual por cada producto de un proveedor,
   * y lo guardas en un objeto productForms, usando id_product como clave.
   */
  getProductByIdUpdate(id_provider_product: number) {
    this.productService.getProductById(id_provider_product).subscribe({
      next: (data) => {
        this.productService.productsList = data;
        // Initialize FormGroups for each product in prosList
        data.forEach((product) => {
          if (!this.productForms[product.id_product]) {
            this.productForms[product.id_product] = new FormGroup({
              unit_pros: new FormControl(this.unit || 0, [
                Validators.required,
                Validators.min(1),
                Validators.max(this.unit || 0), //No puede vender más que tiene
              ]),
              price_pros: new FormControl(this.price || 0, [
                Validators.required,
                Validators.min(1),
              ]),
              id_product: new FormControl(product.id_product),
              id_provider: new FormControl(this.id_provider_product),
              id_category: new FormControl(product.id_category),
            });
          }
        });
      },
      error: (e) => {
        console.log('ERROR getAllProsById() => ', e.message);
      },
    });
  }
  handleUpdatePros(id_product: number) {
    this.updateProviderSell(this.id_provider_product, id_product);
    this.createPros(id_product);
  }

  updateProviderSell(id_provider_product: number, id_product: number) {
    this.providerService.getProviderById(id_provider_product).subscribe({
      next: (data) => {
        const provider = {
          id_provider: data.id_provider,
          name_provider: data.name_provider,
          email_provider: data.email_provider,
          phone_provider: data.phone_provider,
          cif_provider: data.cif_provider,
          count_provider: data.count_provider + this.getTotal(id_product),
          id_category: data.id_category,
        };

        this.providerService.updateProvider(provider).subscribe({
          next: (data) => {
            console.log('UPDATE PROVIDER COUNT');
          },
          error: (e) => {
            console.log('ERROR updateProvider() => ', e.message);
          },
        });
      },
      error: (e) => {
        console.log('ERROR updateProvider()/getProviderById => ', e.message);
      },
    });
  }
  updatePros(id_product: number) {
    const form = this.productForms[id_product];
    console.log('form => ', form.value);

    if (form.invalid) return;

    const unidadesVendidas = Number(form.get('unit_pros')?.value);
    const precioNuevo = Number(form.get('price_pros')?.value);
    // const unidadesVendidas = form.get('unit_pros')?.value;
    console.log('unidadesVendidas => ', unidadesVendidas);
    console.log('precioNuevo => ', precioNuevo);

    if (isNaN(unidadesVendidas) || isNaN(precioNuevo)) {
      alert('Valores inválidos');
      return;
    }

    // 1. Obtener el producto original
    const pros = this.prosService.prosList.find(
      (p) => p.id_product === id_product
    );
    if (!pros) return;

    console.log('pros => ', pros);

    // 2. Restar las unidades vendidas
    const updatedPros = {
      ...pros,
      unit_pros: pros.unit_pros - unidadesVendidas,
      price_pros: precioNuevo,
    };

    console.log('updatedPros => ', updatedPros);

    // 3. Actualizar el producto en la base de datos
    this.prosService.updatePros(updatedPros).subscribe({
      next: () => {
        // 4. Sumar dinero al proveedor
        this.updateProviderSell(this.id_provider_product, id_product);

        alert('Venta realizada con éxito.');
        form.reset();

        // Recargar los datos
        this.getProviderById(this.id_provider_product);
        this.getAllProsById(this.id_provider_product);
      },
      error: (e) => {
        console.log('ERROR updatePros() => ', e.message);
      },
    });
  }

  // updateProduct() {
  //   // console.log(this.productForm.value);
  //   // this.productService.updateProduct(this.productForm.value).subscribe({
  //   //   next: (data) => {
  //   //     console.log('UPDATE');
  //   //     this.getProductById(this.id_provider_product);
  //   //     this.productService.isEdit = false;
  //   //   },
  //   //   error: (e) => {
  //   //     console.log('ERROR updateProduct() => ', e.message);
  //   //   },
  //   // });
  // }

  // DELETE
  handleDelete(id: number) {
    const confirmed = confirm('¿Segura que quieres borrar?');
    if (confirmed) {
      this.deleteProduct();
    }
  }
  deleteProduct() {
    console.log('DELETE');
    // aqui hay que borrar el producto que tiene el proveedor no el producto en si
  }
}
