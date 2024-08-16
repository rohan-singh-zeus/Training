// using Microsoft.Extensions.Hosting;

// using Microsoft.Extensions.Logging;

// using MySqlConnector;

// using RabbitMQ.Client;

// using RabbitMQ.Client.Events;

// using System;

// using System.Collections.Generic;

// using System.Text;

// using System.Threading;

// using System.Threading.Tasks;

// namespace YourNamespace.Services

// {

//     public class RabbitMQConsumerService : BackgroundService

//     {

//         private readonly IConnectionFactory _connectionFactory;

//         private readonly ILogger<RabbitMQConsumerService> _logger;

//         private readonly string _connectionString;

//         public RabbitMQConsumerService(IConnectionFactory connectionFactory, ILogger<RabbitMQConsumerService> logger, string connectionString)

//         {

//             _connectionFactory = connectionFactory;

//             _logger = logger;

//             _connectionString = connectionString;

//         }

//         protected override async Task ExecuteAsync(CancellationToken stoppingToken)

//         {

//             _logger.LogInformation("RabbitMQ Consumer Service started.");

//             using var connection = _connectionFactory.CreateConnection();

//             using var channel = connection.CreateModel();

//             channel.QueueDeclare(queue: "csvQueue",

//                                  durable: true, // Mark the queue as durable to persist messages

//                                  exclusive: false,

//                                  autoDelete: false,

//                                  arguments: null);

//             var consumer = new EventingBasicConsumer(channel);

//             consumer.Received += async (model, ea) =>

//             {

//                 var body = ea.Body.ToArray();

//                 var message = Encoding.UTF8.GetString(body);

//                 try

//                 {

//                     // Process and save the chunk to MySQL

//                     await SaveChunkToDatabase(message);

//                     // Acknowledge the message to RabbitMQ only after successful processing

//                     channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);

//                 }

//                 catch (Exception ex)

//                 {

//                     _logger.LogError(ex, "Error occurred while saving chunk to MySQL. Will retry.");

//                     // Do not acknowledge the message (it will be requeued by RabbitMQ)

//                     channel.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: true);

//                 }

//             };

//             channel.BasicConsume(queue: "csvQueue",

//                                  autoAck: false, // Ensure manual message acknowledgement

//                                  consumer: consumer);

//             while (!stoppingToken.IsCancellationRequested)

//             {

//                 await Task.Delay(1000, stoppingToken);

//             }

//         }

//         private async Task SaveChunkToDatabase(string chunk)

//         {

//             var csvRecords = ParseCsv(chunk);

//             using var connection = new MySqlConnection(_connectionString);

//             await connection.OpenAsync();

//             using var transaction = await connection.BeginTransactionAsync();

//             try

//             {

//                 // Batch Insert Query

//                 var insertQuery = new StringBuilder("INSERT INTO CsvRecords (Column1, Column2, Column3) VALUES ");

//                 var parameters = new List<MySqlParameter>();

//                 for (int i = 0; i < csvRecords.Count; i++)

//                 {

//                     insertQuery.Append($"(@Column1{i}, @Column2{i}, @Column3{i}),");

//                     parameters.Add(new MySqlParameter($"@Column1{i}", csvRecords[i].Column1));

//                     parameters.Add(new MySqlParameter($"@Column2{i}", csvRecords[i].Column2));

//                     parameters.Add(new MySqlParameter($"@Column3{i}", csvRecords[i].Column3));

//                 }

//                 // Remove the trailing comma

//                 insertQuery.Length--;

//                 using var cmd = new MySqlCommand(insertQuery.ToString(), connection, transaction);

//                 cmd.Parameters.AddRange(parameters.ToArray());

//                 await cmd.ExecuteNonQueryAsync();

//                 await transaction.CommitAsync();

//                 _logger.LogInformation("Chunk successfully inserted into MySQL.");

//             }

//             catch (Exception ex)

//             {

//                 _logger.LogError(ex, "Error occurred while saving chunk to MySQL. Rolling back transaction.");

//                 // Rollback the transaction on error

//                 await transaction.RollbackAsync();

//                 throw; // Re-throw the exception to trigger retry logic

//             }

//         }

//         private List<CsvRecord> ParseCsv(string csvContent)

//         {

//             var lines = csvContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

//             var csvRecords = new List<CsvRecord>();

//             foreach (var line in lines)

//             {

//                 var values = line.Split(',');

//                 var record = new CsvRecord

//                 {

//                     Column1 = values[0],

//                     Column2 = values[1],

//                     Column3 = values[2],

//                     // Add more columns as needed

//                 };

//                 csvRecords.Add(record);

//             }

//             return csvRecords;

//         }

//     }

//     public class CsvRecord

//     {

//         public string Column1 { get; set; }

//         public string Column2 { get; set; }

//         public string Column3 { get; set; }

//         // Add more properties as per your CSV structure

//     }

// }