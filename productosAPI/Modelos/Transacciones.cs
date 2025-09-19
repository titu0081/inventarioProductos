using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace productosAPI.Modelos
{
    [Table("transacciones")]
    public class Transacciones
    {
        [Key]
        public int id { set; get; }
        public DateTime fecha { set; get; }
        public string tipoTransaccion { set; get; }
        public int idProducto { set; get; }
        public int cantidad{ set; get; }

        public decimal precioUnitario { set; get; }
        public decimal precioTotal { set; get; }

        public string detalle { set; get; }

        [ForeignKey(nameof(idProducto))]
        [JsonIgnore] // <-- evita el ciclo
        public Productos ProductoNav { get; set; } = null!;


    }
}
