using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;
using productosAPI.Modelos;
using ProductosAPI.Controllers;

namespace productosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaccionesController : ControllerBase
    {
        private readonly DbContexto _context;

        public TransaccionesController(DbContexto context)
        {
            _context = context;
        }

        // GET: api/Transacciones
        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetTransacciones()
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("No se encuentran datos que mostrar");
            }

            var listaTransacciones = await _context.Transacciones
                                                   .Include(t => t.ProductoNav) 
                                                   .ToListAsync();

            return ApiResponse.Ok(listaTransacciones);
        }

        // GET: api/Transacciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse>> GetTransaccion(int id)
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            var transaccion = await _context.Transacciones
                                            .Include(t => t.ProductoNav)
                                            .FirstOrDefaultAsync(t => t.id == id);

            if (transaccion == null)
            {
                return ApiResponse.Fail("No se encontró la transacción");
            }

            return ApiResponse.Ok(transaccion);
        }

        // PUT: api/Transacciones/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse>> PutTransaccion(int id, Transacciones transaccion)
        {
            if (id != transaccion.id)
            {
                return ApiResponse.Fail("El ID no coincide con la transacción");
            }

            _context.Entry(transaccion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransaccionExists(id))
                {
                    return ApiResponse.Fail("No se encuentra una transacción con ese ID");
                }
                else
                {
                    throw;
                }
            }

            return ApiResponse.Ok(transaccion, "Se actualizó la transacción con éxito");
        }

        // POST: api/Transacciones
        [HttpPost]
        public async Task<ActionResult<ApiResponse>> PostTransaccion(Transacciones transaccion)
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            return ApiResponse.Ok(transaccion, "Se ingresó la transacción con éxito");
        }

        // DELETE: api/Transacciones/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteTransaccion(int id)
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            var transaccion = await _context.Transacciones.FindAsync(id);
            if (transaccion == null)
            {
                return ApiResponse.Fail("No se encuentra la transacción a eliminar");
            }

            _context.Transacciones.Remove(transaccion);
            await _context.SaveChangesAsync();

            return ApiResponse.Ok(id, "Transacción eliminada con éxito");
        }

        private bool TransaccionExists(int id)
        {
            return (_context.Transacciones?.Any(e => e.id == id)).GetValueOrDefault();
        }
    }
}
