namespace productosAPI.Servicios
{
    public interface IServicioStock
    {
        bool AjustarStock(int idProducto, int cantidad, string tipoTransaccion, out string mensajeError);

    }
}
