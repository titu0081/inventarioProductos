using Microsoft.EntityFrameworkCore;
using productosAPI.Modelos;

namespace ProductosAPI.Contexto
{
    public class DbContexto : DbContext
    {
        public DbContexto(DbContextOptions<DbContexto> options)
        : base(options)
        {
        }

        public DbSet<Productos> Productos { get; set; }
        public DbSet<Transacciones> Transacciones { get; set; }
    }
}
