using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;
using productosAPI.Modelos;
using ProductosAPI.Controllers;
using productosAPI.Servicios;

namespace productosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaccionesController : ControllerBase
    {
        private readonly DbContexto _context;
        private readonly IServicioTransaccion _servicioTransaccion;
        private readonly IServicioStock _servicioStock;
        private readonly IServicioProducto _servicioProducto;

        public TransaccionesController(DbContexto context, IServicioTransaccion servicioTransaccion, IServicioStock servicioStock, IServicioProducto servicioProducto  )
        {
            _context = context;
            _servicioTransaccion = servicioTransaccion;
            _servicioStock = servicioStock;
            _servicioProducto = servicioProducto;
        }

        // GET: api/Transacciones
        [HttpGet]
        public ActionResult<ApiResponse> GetTransacciones()
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("No se encuentran datos que mostrar");
            }

            var lista = _servicioTransaccion.obtenerTransacciones();
            if (lista == null || !lista.Any())
            {
                return ApiResponse.Fail("No se encuentran datos que mostrar");

            }

            return ApiResponse.Ok(lista);
        }

        // GET: api/Transacciones/5
        [HttpGet("{id}")]
        public ActionResult<ApiResponse> GetTransaccion(int id)
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            var transaccion = _servicioTransaccion.obtenerTransaccion(id);
            if (transaccion == null)
            {
                return ApiResponse.Fail("No se encontró la transacción");

            }

            return ApiResponse.Ok(transaccion);
        }

        // PUT: api/Transacciones/5
        [HttpPut("{id}")]
        public ActionResult<ApiResponse> PutTransaccion(int id, Transacciones transaccion)
        {
            if (id != transaccion.id)
            {
                return ApiResponse.Fail("El ID no coincide con la transacción");
            }

            if (!_servicioTransaccion.existeTransaccion(id))
            {
                return ApiResponse.Fail("No se encuentra una transacción con ese ID");

            }

            _servicioTransaccion.actualizarTransaccion(transaccion);
            return ApiResponse.Ok(transaccion, "Se actualizó la transacción con éxito");
        }

        // POST: api/Transacciones
        [HttpPost]
        public ActionResult<ApiResponse> PostTransaccion(Transacciones transaccion)
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            if (!_servicioStock.AjustarStock(transaccion.idProducto,
                                    transaccion.cantidad,
                                    transaccion.tipoTransaccion,
                                    out string error))
            {
                return ApiResponse.Fail(error);
            }

            _servicioTransaccion.agregarTransaccion(transaccion);

            return ApiResponse.Ok(transaccion, "Transacción y ajuste de stock realizados con éxito");
        }

        // DELETE: api/Transacciones/5
        [HttpDelete("{id}")]
        public ActionResult<ApiResponse> DeleteTransaccion(int id)
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }

            if (!_servicioTransaccion.existeTransaccion(id))
            {
                return ApiResponse.Fail("No se encuentra la transacción a eliminar");

            }

            _servicioTransaccion.eliminarTransaccion(id);
            return ApiResponse.Ok(id, "Transacción eliminada con éxito");
        }

        [HttpGet("PorProducto/{idProducto}")]
        public ActionResult<ApiResponse> GetTransaccionesPorProducto(int idProducto)
        {
            if (_context.Transacciones == null)
            {
                return ApiResponse.Fail("Existe un error en la conexión");
            }
             var producto = _servicioProducto.obtenerProducto(idProducto);


            var transacciones = _servicioTransaccion.obtenerTransaccionesPorProducto(idProducto);

            if (transacciones == null || !transacciones.Any())
            {
                return ApiResponse.Fail($"No se encontraron transacciones para el producto: {producto.nombre}");
            }

            return ApiResponse.Ok(transacciones);
        }


    }
}
