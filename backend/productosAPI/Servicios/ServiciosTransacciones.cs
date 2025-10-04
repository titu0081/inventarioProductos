using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;
using productosAPI.Modelos;

namespace productosAPI.Servicios
{
    public class ServicioTransaccion : IServicioTransaccion
    {
        private readonly DbContexto _context;

        public ServicioTransaccion(DbContexto context)
        {
            _context = context;
        }

        public List<Transacciones> obtenerTransacciones()
        {
            return _context.Transacciones
                           .Include(t => t.ProductoNav) 
                           .ToList();
        }

        public Transacciones? obtenerTransaccion(int id)
        {
            return _context.Transacciones
                           .Include(t => t.ProductoNav)
                           .FirstOrDefault(t => t.id == id);
        }

        public void agregarTransaccion(Transacciones transaccion)
        {

            _context.Transacciones.Add(transaccion);
            _context.SaveChanges();
        }

        public void actualizarTransaccion(Transacciones transaccion)
        {
            _context.Entry(transaccion).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void eliminarTransaccion(int id)
        {
            var t = _context.Transacciones.Find(id);
            if (t != null)
            {
                _context.Transacciones.Remove(t);
                _context.SaveChanges();
            }
        }

        public bool existeTransaccion(int id)
        {
            return _context.Transacciones.Any(e => e.id == id);
        }

        public List<Transacciones> obtenerTransaccionesPorProducto(int idProducto)
        {
            return _context.Transacciones
                           .Include(t => t.ProductoNav)
                           .Where(t => t.idProducto == idProducto)
                           .ToList();
        }

    }
}
