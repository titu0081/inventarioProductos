import { Component } from '@angular/core';
import { Productos } from '../../componentes/productos/productos';

@Component({
  selector: 'app-pagina-principal',
  imports: [Productos],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.scss',
})
export class PaginaPrincipal {}
