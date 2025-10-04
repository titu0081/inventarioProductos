using productosAPI.Modelos;

namespace productosAPI.Servicios
{
    public interface IServicioTransaccion
    {
        List<Transacciones> obtenerTransacciones();
        Transacciones? obtenerTransaccion(int id);
        void agregarTransaccion(Transacciones transaccion);
        void actualizarTransaccion(Transacciones transaccion);
        void eliminarTransaccion(int id);
        bool existeTransaccion(int id);
        List<Transacciones> obtenerTransaccionesPorProducto(int idProducto);
    }
}
