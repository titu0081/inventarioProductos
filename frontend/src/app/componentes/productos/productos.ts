import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { InventarioServicio } from '../../servicios/inventarioServicios';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagen?: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-productos',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  tituloError: string = 'Ocurrió un error';
  nombreLongitud: number = 30;
  descripcionLongitud: number = 50;
  categoriaLongitud: number = 20;
  stockLongitud: number = 10;
  formulario: FormGroup;
  imagenBase64: string = '';
  mostrarFormularioProducto: boolean = false;
  numeroProductosPagina: number = 8;
  paginaActual: number = 1;
  esEditar: boolean = false;

  constructor(private inventarioServicio: InventarioServicio, private formularioProd: FormBuilder) {
    this.formulario = this.formularioProd.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(this.nombreLongitud)]],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(this.descripcionLongitud),
        ],
      ],
      imagen: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(1)]],
    });
  }

  //Obtener los valores del formulario
  get id() {
    return this.formulario.get('id');
  }
  get nombre() {
    return this.formulario.get('nombre');
  }
  get descripcion() {
    return this.formulario.get('descripcion');
  }
  get imagen() {
    return this.formulario.get('imagen');
  }
  get categoria() {
    return this.formulario.get('categoria');
  }
  get precio() {
    return this.formulario.get('precio');
  }
  get stock() {
    return this.formulario.get('stock');
  }
  get totalPaginas(): number {
    return Math.ceil(this.productos.length / this.numeroProductosPagina);
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.numeroProductosPagina;
    return this.productos.slice(inicio, inicio + this.numeroProductosPagina);
  }

  irPagina(num: number) {
    if (num >= 1 && num <= this.totalPaginas) {
      this.paginaActual = num;
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  ngOnInit(): void {
    this.obtenerTodosProductos();
  }

  obtenerTodosProductos() {
    try {
      this.inventarioServicio.getAllProductos().subscribe({
        next: (data: any) => {
          if (data.codigo == 0) {
            this.productos = data.data;
          } else {
            Swal.fire({
              icon: 'error',
              title: this.tituloError,
              text: data.error,
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: this.tituloError,
            text: 'No se pudo consultar los productos',
          });
        },
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: this.tituloError,
        text: error.message,
      });
    }
  }

  onSeleccionarImagen(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) {
      this.formulario.get('imagen')?.setValue('');

      return;
    }

    const archivo = input.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      this.formulario.patchValue({ imagen: base64 });
      this.formulario.get('imagen')?.markAsTouched();
    };
    reader.readAsDataURL(archivo);
  }

  onBlurImagen(): void {
    const imagenCtrl = this.formulario.get('imagen');
    if (!imagenCtrl?.value) {
      imagenCtrl?.markAsTouched();
    }
  }

  guardarNuevoProducto() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const nuevoProducto = this.formulario.getRawValue();

    console.log('Formulario: ', nuevoProducto);

    const datosProducto: Producto = {
      nombre: nuevoProducto.nombre,
      imagen: nuevoProducto.imagen,
      descripcion: nuevoProducto.descripcion,
      categoria: nuevoProducto.categoria,
      precio: nuevoProducto.precio,
      stock: nuevoProducto.stock,
    };

    try {
      if (this.esEditar == false) {
        this.inventarioServicio.addProducto(datosProducto).subscribe({
          next: (data: any) => {
            if (data.codigo == 0) {
              Swal.fire({
                title: '',
                text: 'Se han ingresado el producto exitosamente',
                icon: 'success',
                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              }).then(() => {
                this.regresarProductos();
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: this.tituloError,
                text: data.error,
                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: this.tituloError,
              text: 'No se pudo consultar los productos',
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
          },
        });
      } else {
        const datosProducto: Producto = {
          id: nuevoProducto.id,
          nombre: nuevoProducto.nombre,
          imagen: nuevoProducto.imagen,
          descripcion: nuevoProducto.descripcion,
          categoria: nuevoProducto.categoria,
          precio: nuevoProducto.precio,
          stock: nuevoProducto.stock,
        };
        this.inventarioServicio.updateProducto(nuevoProducto.id, datosProducto).subscribe({
          next: (data: any) => {
            if (data.codigo == 0) {
              Swal.fire({
                title: '',
                text: 'Se actualizó el producto exitosamente',
                icon: 'success',
                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              }).then(() => {
                this.regresarProductos();
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: this.tituloError,
                text: data.error,
                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: this.tituloError,
              text: 'No se pudo actualizar el productos',
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
          },
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: this.tituloError,
        text: error.message,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
    }
  }

  regresarProductos() {
    this.reiniciarFormulario();
    this.mostrarFormularioProducto = false;
    this.obtenerTodosProductos();
  }

  reiniciarFormulario() {
    this.formulario.reset();
  }

  mostrarFormulario() {
    return (this.mostrarFormularioProducto = true);
  }

  editarProducto(producto: Producto) {
    console.log('Producto: ', producto);
    this.esEditar = false;
    if (producto) {
      this.formulario.patchValue({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        imagen: producto.imagen,
        precio: producto.precio,
        stock: producto.stock,
      });
      this.mostrarFormularioProducto = true;
      this.esEditar = true;
    }
  }

  eliminarProducto(productoEliminar: Producto) {
    Swal.fire({
      title: 'Eliminar producto',
      text: `Se va eliminar el siguiente producto: ${productoEliminar.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary me-2',
        cancelButton: 'btn btn-danger',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.inventarioServicio.deleteProducto(productoEliminar.id!).subscribe({
            next: (data: any) => {
              if (data.codigo == 0) {
                Swal.fire({
                  title: '',
                  text: 'Se eliminó el producto exitosamente',
                  icon: 'success',
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: 'btn btn-primary',
                  },
                }).then(() => {
                  this.regresarProductos();
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: this.tituloError,
                  text: data.error,
                });
              }
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: this.tituloError,
                text: 'No se pudo consultar los productos',
              });
            },
          });
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: this.tituloError,
            text: error.message,
          });
        }
      }
    });
  }
}
