import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { HandleService } from '../../../services/handle.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService,
    public handleService: HandleService
  ) {
    this.productForm = new FormGroup({
      id_product: new FormControl(''),
      name_product: new FormControl(''),
      description_product: new FormControl(''),
      photo_product: new FormControl(''),
      id_provider: new FormControl(''),
      id_category: new FormControl(''),
    });
  }

  // ==================== CICLO DE VIDA ====================
  ngOnInit(): void {
    this.loadInitialData();
    this.cancelCreateEdit();
  }

  // ==================== MÉTODOS DE INICIALIZACIÓN ====================

  /**
   * Carga los datos iniciales: productos, categorías y nombres de fotos
   */
  private loadInitialData(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.getNamePhoto();
  }

  // ==================== MANEJO DEL FORMULARIO ====================

  /**
   * Resetea el formulario y desactiva los modos de edición/creación
   */
  cancelCreateEdit(): void {
    this.handleService.handleCreate(false);
    this.handleService.handleEdit(false);
    this.productForm.reset();
  }

  // ==================== OPERACIONES CRUD - PRODUCTOS ====================

  /**
   * Obtiene todos los productos y filtra duplicados por nombre
   */
  getAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.productService.productsList = products.filter(
          (product, index, self) =>
            index ===
            self.findIndex((p) => p.name_product === product.name_product)
        );
      },
      error: (e) => console.error('Error loading products:', e),
    });
  }

  /**
   * Crea un nuevo producto con validación de formulario
   */
  createProduct(): void {
    if (!this.productForm.valid) {
      alert('¡Completa todos los campos!');
      return;
    }

    const productData = {
      name_product: this.productForm.get('name_product')?.value,
      description_product: this.productForm.get('description_product')?.value,
      id_category: Number(this.productForm.get('id_category')?.value),
      photo_product:
        this.productForm.get('photo_product')?.value || 'default.jpg',
    };

    this.productService._createProduct(productData).subscribe({
      next: () => {
        alert('¡Producto creado con éxito!');
        this.getAllProducts();
        this.cancelCreateEdit();
      },
      error: (e) => {
        console.error('Error:', e);
        alert(`Error: ${e.error?.message || 'Error al crear producto'}`);
      },
    });
  }

  /**
   * Actualiza un producto existente
   */
  updateProduct(): void {
    this.productService.updateProduct(this.productForm.value).subscribe({
      next: () => {
        this.getAllProducts();
        this.handleService.handleEdit(false);
      },
      error: (e) => console.error('Error updating product:', e),
    });
  }

  /**
   * Elimina un producto por ID
   * @param id ID del producto a eliminar
   */
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.getAllProducts(),
      error: (e) => console.error('Error deleting product:', e),
    });
  }

  // ==================== OPERACIONES CRUD - CATEGORÍAS ====================

  /**
   * Obtiene todas las categorías disponibles
   */
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categoryService.categoriesLIst = data),
      error: (e) => console.error('Error loading categories:', e),
    });
  }

  // ==================== MANEJO DE FOTOS ====================

  /**
   * Obtiene los nombres de las fotos disponibles
   */
  getNamePhoto(): void {
    this.productService.getNamePhoto().subscribe({
      next: (data) => {
        this.productService.namePhotoList = data;
      },
      error: (e) => console.error('Error loading photos:', e),
    });
  }

  // ==================== MANEJADORES DE UI ====================

  /**
   * Activa/desactiva el modo creación
   * @param isCreate Estado deseado para el modo creación
   */
  handleCreate(isCreate: boolean): void {
    this.handleService.handleCreate(isCreate);
  }

  /**
   * Prepara el formulario para editar un producto
   * @param id ID del producto a editar
   * @param isEdit Estado deseado para el modo edición
   */
  handleUpdate(id: number, isEdit: boolean): void {
    this.handleService.handleEdit(isEdit);
    const product = this.productService.productsList.find(
      (p) => p.id_product === id
    );
    if (product) this.productForm.patchValue(product);
  }

  /**
   * Confirma y ejecuta la eliminación de un producto
   * @param id ID del producto a eliminar
   */
  handleDelete(id: number): void {
    if (confirm('¿Seguro que quieres borrar?')) {
      this.deleteProduct(id);
    }
  }
}
