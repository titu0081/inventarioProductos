using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;
using productosAPI.Modelos;
using productosAPI.Servicios;

namespace ProductosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly DbContexto _context;
        private readonly IServicioProducto _servicioProducto;

        public ProductosController(DbContexto context, IServicioProducto servicioProducto)
        {
            _context = context;
            _servicioProducto = servicioProducto;
        }

        // GET: api/Productos
        [HttpGet]
        public ActionResult<ApiResponse> GetProductos()
        {
          if (_context.Productos == null)
          {
              return ApiResponse.Fail("No se encuentran datos que mostrar");
          }
            var lista = _servicioProducto.obtenerProductos();
            return lista.Count == 0
                ? ApiResponse.Fail("No se encuentran datos que mostrar")
                : ApiResponse.Ok(lista);
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public ActionResult<ApiResponse> GetProductos(int id)
        {
            if (_context.Productos == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }
            var producto = _servicioProducto.obtenerProducto(id);

            if (producto == null)
            {
                return ApiResponse.Fail("No se encontró el registro");
            }

            return ApiResponse.Ok(producto);
        }

        // PUT: api/Productos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<ApiResponse> PutProductos(int id, Productos productos)
        {
            if (id != productos.id)
            {
                return ApiResponse.Fail("El ID no coincide con el producto");
            }

            if (!_servicioProducto.existeProducto(id))
            {
                return ApiResponse.Fail("No se encuentra un producto con ese ID");
            }
            _servicioProducto.actualizarProducto(productos);

            return ApiResponse.Ok(productos, "Se actualizó el producto con éxito");
        }

        // POST: api/Productos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<ApiResponse> PostProductos(Productos productos)
        {
            if (_context.Productos == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            _servicioProducto.agregarProducto(productos);

            return ApiResponse.Ok(productos, "Se ingresó el producto con éxito");
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public ActionResult<ApiResponse> DeleteProductos(int id)
        {
            if (_context.Productos == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            if (!_servicioProducto.existeProducto(id))
            {
                return ApiResponse.Fail("No se encuentra el producto a eliminar");
            }

            _servicioProducto.eliminarProducto(id);

            return ApiResponse.Ok(id, "Producto eliminado con éxito");
        }
    }

    public class ApiResponse
    {
        public int Codigo { get; init; }
        public object? Data { get; init; }
        public string Mensaje { get; init; } = string.Empty;
        public string Error { get; init; } = string.Empty;

        // helpers rápidos
        public static ApiResponse Ok(object? data = null, string? mensaje = null)
            => new() { Codigo = 0, Data = data, Mensaje = mensaje ?? string.Empty };

        public static ApiResponse Fail(string error, int code = -1)
            => new() { Codigo = code, Data = null, Error = error };
    }

}



