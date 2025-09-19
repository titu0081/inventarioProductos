using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace productosAPI.Modelos
{
    [Table("productos_Inventario")]
    public class Productos
    {
        [Key]
        public int id { set; get; }
        public string nombre { set; get; }
        public string descripcion { set; get; }
        public string categoria { set; get; }
        public string? imagen { set; get; }

        public decimal precio { set; get; }
        public int stock { set; get; }

        public ICollection<Transacciones> Transacciones { get; set; } = new List<Transacciones>();
    }
}
