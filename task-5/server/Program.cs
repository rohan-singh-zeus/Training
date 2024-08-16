using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using RabbitMQ.Client;
using server.BackgroundServices;
using server.Models;
using server.Services;


var builder = WebApplication.CreateBuilder(args);
 
// Add services to the container.
 
builder.Services.AddSingleton<RabbitMQService>();
builder.Services.AddSingleton<IConnectionFactory>(sp =>{
    return new ConnectionFactory(){
        HostName = "localhost",
        // UserName = "guest",
        // Password = "guest"
    };
});
builder.Services.AddHostedService<RabbitMQConsumerService>();

builder.Services.AddControllers(); 
 
builder.Services.AddDbContext<TodoContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")!));
 
builder.Services.Configure<FormOptions>(options=> options.MultipartBodyLengthLimit = 1048576000); // Configure file size
 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
 
var app = builder.Build();
 
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
 
app.UseAuthorization();
 
app.MapControllers();
app.Run();