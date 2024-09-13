using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using server.BackgroundServices;
using StackExchange.Redis;
using server.Models;
using server.Services;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://127.0.0.1:5500", "http://127.0.0.1:5501").AllowAnyHeader()
                                                  .AllowAnyMethod();
                      });
});

// Add services to the container.

builder.Services.AddSingleton<RabbitMQService>();
builder.Services.AddSingleton<IConnectionFactory>(sp =>
{
    return new ConnectionFactory()
    {
        HostName = "localhost",
    };
});
builder.Services.AddSingleton<LogService>();
builder.Services.AddHostedService<RabbitMQConsumerService>();
builder.Services.AddSignalR();
var logger = builder.Services.BuildServiceProvider().GetService<ILogger<Program>>();
var redis = ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis"));
builder.Services.AddSingleton<IConnectionMultiplexer>(redis);

if(redis.IsConnected){
    logger.LogInformation("Redis connected successfully");
}else{
    logger.LogError("Failed to connect");
}
// builder.Services.AddStackExchangeRedisCache(options=> {
//     options.Configuration = builder.Configuration["RedisCacheOptions:Configuration"];
//     options.InstanceName = builder.Configuration["RedisCacheOptions:InstanceName"];
// });

builder.Services.AddControllers();

builder.Services.Configure<LogDatabaseSettings>(builder.Configuration.GetSection("LogDatabase"));

builder.Services.AddDbContext<TodoContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")!));

builder.Services.Configure<FormOptions>(options => options.MultipartBodyLengthLimit = 1048576000); // Configure file size

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ProgressHub>("/progressHub");

app.Run();