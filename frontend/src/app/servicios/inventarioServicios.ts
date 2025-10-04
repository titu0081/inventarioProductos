import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InventarioServicio {
  private apiUrlProducto = `${environment.urlProductos}api/Productos`;
  private apiUrlTransacciones = `${environment.urlProductos}api/Transacciones`;

  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locale: string) {}

  obtenerTodosProductos() {
    return this.http.get(this.apiUrlProducto);
  }

  obtenerProducto(id: number) {
    return this.http.get(`${this.apiUrlProducto}/${id}`);
  }

  nuevoProducto(producto: any) {
    return this.http.post(this.apiUrlProducto, producto);
  }

  actualizarProducto(id: number, producto: any) {
    return this.http.put(`${this.apiUrlProducto}/${id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrlProducto}/${id}`);
  }

  //Servicios Transacciones
  obtenerTodasTransacciones() {
    return this.http.get(this.apiUrlTransacciones);
  }

  obtenerTransacciones(id: number) {
    return this.http.get(`${this.apiUrlTransacciones}/${id}`);
  }

  nuevaTransaccion(producto: any) {
    return this.http.post(this.apiUrlTransacciones, producto);
  }

  actualizarTransacciones(id: number, producto: any) {
    return this.http.put(`${this.apiUrlTransacciones}/${id}`, producto);
  }

  eliminarTransacciones(id: number) {
    return this.http.delete(`${this.apiUrlTransacciones}/${id}`);
  }

  obtenerTransaccionesPorProducto(id: number) {
    return this.http.get(`${this.apiUrlTransacciones}/PorProducto/${id}`);
  }

  //Retorno Fecha
  retornarFechaFormateada(): string {
    return formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', this.locale);
  }
}
