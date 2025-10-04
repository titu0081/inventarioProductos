using productosAPI.Modelos;

namespace productosAPI.Servicios
{
    public interface IServicioProducto
    {
        List<Productos> obtenerProductos();
        Productos? obtenerProducto(int id);
        void agregarProducto(Productos productos);
        void actualizarProducto(Productos productos);
        void eliminarProducto(int id);
        bool existeProducto(int id);

    }
}
