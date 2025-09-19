using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;
using productosAPI.Modelos;

namespace ProductosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly DbContexto _context;

        public ProductosController(DbContexto context)
        {
            _context = context;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetProducto()
        {
          if (_context.Productos == null)
          {
              return ApiResponse.Fail("No se encuentran datos que mostrar");
          }
          var listaProductos = await _context.Productos.ToListAsync();

            return ApiResponse.Ok(listaProductos);
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse>> GetProductos(int id)
        {
          if (_context.Productos == null)
          {
              return ApiResponse.Fail("Existe un error en la conexión");
          }
            var productos = await _context.Productos.FindAsync(id);

            if (productos == null)
            {
                return ApiResponse.Fail("No se encontró el registro");
            }

            return ApiResponse.Ok(productos);
        }

        // PUT: api/Productos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse>> PutProductos(int id, Productos productos)
        {
            if (id != productos.id)
            {
                return ApiResponse.Fail("El ID no coincide con el producto");
            }

            _context.Entry(productos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductosExists(id))
                {
                    return ApiResponse.Fail("No se encuentra un producto con ese ID");
                }
                else
                {
                    throw;
                }
            }

            return ApiResponse.Ok(productos, "Se actualizó el producto con éxito");
        }

        // POST: api/Productos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ApiResponse>> PostProductos(Productos productos)
        {
          if (_context.Productos == null)
          {
              return ApiResponse.Fail("Existe un error en la conexión"); 
          }
            _context.Productos.Add(productos);
            await _context.SaveChangesAsync();

            return ApiResponse.Ok(productos, "Se ingresó el producto con éxito");
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteProductos(int id)
        {
            if (_context.Productos == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }
            var productos = await _context.Productos.FindAsync(id);
            if (productos == null)
            {
                return ApiResponse.Fail("No se encuentra el producto a eliminar");
            }

            _context.Productos.Remove(productos);
            await _context.SaveChangesAsync();

            return ApiResponse.Ok(id, "Producto eliminado con éxito");
        }

        private bool ProductosExists(int id)
        {
            return (_context.Productos?.Any(e => e.id == id)).GetValueOrDefault();
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



