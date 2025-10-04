using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;

namespace productosAPI.Servicios
{
    public class ServiciosStock : IServicioStock
    {
        private readonly IServicioProducto _servicioProducto;

        public ServiciosStock(IServicioProducto servicioProducto)
        {

            _servicioProducto = servicioProducto;
        }

        public bool AjustarStock(int idProducto, int cantidad, string tipoTransaccion, out string mensajeError)
        {
            mensajeError = null;

            var producto = _servicioProducto.obtenerProducto(idProducto);
            if (producto == null)
            {
                mensajeError = "Producto no encontrado.";
                return false;
            }

            int ajuste = 0;

            if (tipoTransaccion.ToLower() == "compra")
            {
                ajuste = cantidad;
            }
            if (tipoTransaccion.ToLower() == "venta")
            {
                ajuste = -cantidad;
            }

            if (ajuste == 0)
            {
                mensajeError = "Tipo de transacción debe ser 'entrada' o 'salida'.";
                return false;
            }

         
            if (producto.stock + ajuste < 0)
            {
                mensajeError = "No hay suficiente stock para esta salida.";
                return false;
            }

   
            producto.stock += ajuste;
            _servicioProducto.actualizarProducto(producto);

            return true;
        }

    }
}
