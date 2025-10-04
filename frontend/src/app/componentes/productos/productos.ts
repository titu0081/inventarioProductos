import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
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

interface ProductoConCantidad extends Producto {
  valorEntero?: number;
}

export interface Transaccion {
  id?: number;
  fecha: string;
  tipoTransaccion: string;
  idProducto: number | undefined;
  cantidad: number | undefined;
  precioUnitario: number;
  precioTotal: number;
  detalle: string;
}

@Component({
  selector: 'app-productos',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  transaccionesPorProductos: Transaccion[] = [];
  tituloError: string = 'Ocurrió un error';
  nombreLongitud: number = 30;
  descripcionLongitud: number = 50;
  categoriaLongitud: number = 20;
  stockLongitud: number = 10;
  formulario: FormGroup;
  imagenBase64: string = '';
  mostrarFormularioProducto: boolean = false;
  mostrarTransaccionesProducto: boolean = false;
  numeroProductosPagina: number = 8;
  paginaActual: number = 1;
  esEditar: boolean = false;
  valorEntero: number = 0;
  productoSeleccionado: Producto[] = [];

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
    const lista = this.mostrarTransaccionesProducto
      ? this.transaccionesPorProductos
      : this.productos;
    return Math.ceil(lista.length / this.numeroProductosPagina);
  }

  get productosPaginados(): ProductoConCantidad[] {
    const inicio = (this.paginaActual - 1) * this.numeroProductosPagina;
    return this.productos.slice(
      inicio,
      inicio + this.numeroProductosPagina
    ) as ProductoConCantidad[];
  }

  get transaccionesPaginadas(): Transaccion[] {
    const inicio = (this.paginaActual - 1) * this.numeroProductosPagina;
    return this.transaccionesPorProductos.slice(inicio, inicio + this.numeroProductosPagina);
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
      this.inventarioServicio.obtenerTodosProductos().subscribe({
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

  obtenerProducto(idProducto: number) {
    try {
      this.inventarioServicio.obtenerProducto(idProducto).subscribe({
        next: (data: any) => {
          if (data.codigo == 0) {
            this.productoSeleccionado = [data.data];
            console.log('ProductoSS', this.productoSeleccionado);
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
        this.inventarioServicio.nuevoProducto(datosProducto).subscribe({
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
        this.inventarioServicio.actualizarProducto(nuevoProducto.id, datosProducto).subscribe({
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
    this.mostrarTransaccionesProducto = false;
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
          this.inventarioServicio.eliminarProducto(productoEliminar.id!).subscribe({
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

  agregarTransaccion(producto: Producto, tipoTransaccion: string) {
    const fechaActual = this.inventarioServicio.retornarFechaFormateada();
    console.log('Fecha: ', fechaActual, producto);
    let detalle = '';
    if (tipoTransaccion == 'compra') {
      detalle = `Compra éxitosa de: ${producto.nombre}`;
    } else {
      detalle = `Venta éxitosa de: ${producto.nombre}`;
    }
    let cantidadSeleccionada = (producto as ProductoConCantidad).valorEntero || 0;
    if (cantidadSeleccionada != 0) {
      const datosTransaccion: Transaccion = {
        fecha: fechaActual,
        tipoTransaccion: tipoTransaccion == 'compra' ? 'compra' : 'venta',
        idProducto: producto.id,
        cantidad: cantidadSeleccionada,
        precioUnitario: producto.precio,
        precioTotal: cantidadSeleccionada * producto.precio,
        detalle: detalle,
      };
      try {
        this.inventarioServicio.nuevaTransaccion(datosTransaccion).subscribe({
          next: (data: any) => {
            if (data.codigo == 0) {
              Swal.fire({
                title: '',
                text: 'Se ha realizado la transacción con éxito',
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
              text: 'No se pudo realizar la transacción',
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
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
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Revise el valor colocado',
        text: 'Ingrese un valor mayor a 0',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
    }
  }

  verTransacciones(producto: Producto) {
    this.mostrarTransaccionesProducto = false;
    try {
      this.inventarioServicio.obtenerTransaccionesPorProducto(producto.id!).subscribe({
        next: (data: any) => {
          if (data.codigo == 0 && data.data != '') {
            this.obtenerProducto(producto.id!);
            this.transaccionesPorProductos = data.data;
            this.mostrarTransaccionesProducto = true;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No hay transacciones',
              text: data.error,
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: this.tituloError,
            text: 'No se pudo consultar las transacciones',
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

  filtrar(event: any) {
    // const search = event.target.value.toLowerCase();
    // if (search === '') {
    //   this.InformacionTransaccion = this.TransaccionCompleto;
    // } else {
    //   const result = this.TransaccionCompleto.filter((item) => {
    //     for (const key in item) {
    //       if (String(item[key]).toLowerCase().indexOf(search) !== -1) {
    //         return true;
    //       }
    //     }
    //     return false;
    //   });
    //   this.InformacionTransaccion = result;
    // }
  }
}
