using Microsoft.EntityFrameworkCore;
using ProductosAPI.Contexto;
using productosAPI.Servicios;

var builder = WebApplication.CreateBuilder(args);

// Configurar la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("Conexion");
builder.Services.AddDbContext<DbContexto>(options =>
{
    options.UseSqlServer(connectionString); // Configura la cadena de string necesaria
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IServicioProducto, ServiciosProducto>();
builder.Services.AddScoped<IServicioStock, ServiciosStock>();
builder.Services.AddScoped<IServicioTransaccion, ServicioTransaccion>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowSpecificOrigin");

app.MapControllers();

app.Run();
