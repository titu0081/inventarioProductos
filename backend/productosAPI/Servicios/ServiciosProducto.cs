using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;
using productosAPI.Modelos;
namespace productosAPI.Servicios
{
    public class ServiciosProducto : IServicioProducto
    {
        private readonly DbContexto _context;

        public ServiciosProducto(DbContexto context)
        {
            _context = context;
        }

        public List<Productos> obtenerProductos()
        {
            return _context.Productos.ToList();
        }
        public Productos? obtenerProducto(int id) { return _context.Productos.FirstOrDefault(p => p.id == id); }

        public void agregarProducto(Productos producto)
        {
            _context.Productos.Add(producto);
            _context.SaveChanges();
        }

        public void actualizarProducto(Productos producto)
        {
            _context.Entry(producto).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void eliminarProducto(int id)
        {
            var p = _context.Productos.Find(id);
            if (p != null)
            {
                _context.Productos.Remove(p);
                _context.SaveChanges();
            }
        }

        public bool existeProducto(int id)
        {
            return _context.Productos.Any(e => e.id == id);
        }

    }
}

