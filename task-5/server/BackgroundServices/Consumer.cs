using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using server.Models;
using server.Services;
using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace server.BackgroundServices
{
    public class RabbitMQConsumerService : BackgroundService
    {
        private readonly IConnectionFactory _connectionFactory;
        private readonly ILogger<RabbitMQConsumerService> _logger;
        private readonly IConfiguration _configuration;

        private readonly IHubContext<ProgressHub> _hubContext;

        private readonly LogService _logService;
        public RabbitMQConsumerService(IConnectionFactory connectionFactory,
        IConfiguration configuration,
         ILogger<RabbitMQConsumerService> logger, IHubContext<ProgressHub> hubContext, LogService logService)
        {
            _connectionFactory = connectionFactory;
            _configuration = configuration;
            _logger = logger;
            _hubContext = hubContext;
            _logService = logService;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("RabbitMQ Consumer Service started.");
            using var connection = _connectionFactory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: "chunksQueue12",
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                // var log = new Log{
                //     TimeStamp = DateTime.UtcNow.ToString(),
                // };
                var logMongo = new LogMongo
                {
                    TimeStamp = DateTime.UtcNow.ToString(),
                };
                try
                {
                    // Process and save the chunk to MySQL
                    // await MultipleInsert(message);
                    await MultipleInsertStr(message);
                    // log.IsSuccess = true;
                    logMongo.IsSuccess = true;
                    _logger.LogInformation("Chunk successfully processed");
                    await SendProgressUpdate(message);
                }
                catch (Exception ex)
                {
                    // log.IsSuccess = false;
                    logMongo.IsSuccess = false;
                    // log.ErrorMessage = ex.Message;
                    logMongo.ErrorMessage = ex.Message;
                    _logger.LogError(ex, "Error occurred while saving chunk to MySQL. Will retry.");
                }
                finally
                {
                    // await SaveLogsToDB(log);
                    await _logService.CreateAsync(logMongo);
                    if (logMongo.IsSuccess)
                    {
                        // Acknowledge the message to RabbitMQ only after successful processing
                        channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                    }
                    else
                    {
                        // Do not acknowledge the message (it will be requeued by RabbitMQ)
                        channel.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: true);
                    }
                }
            };
            channel.BasicConsume(queue: "chunksQueue12",
                                 autoAck: false,
                                 consumer: consumer);
            // Keep the service alive
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
        private static List<Employee> ConvertStringToJson(string content)
        {
            var line = content.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            var headers = line[0].Split(',');
            var csvData = new List<Employee>();
            foreach (var l in line.Skip(1))
            {
                var values = l.Split(',');
                var row = new Employee
                {
                    Email = values[0],
                    Name = values[1],
                    Country = values[2],
                    State = values[3],
                    City = values[4],
                    Telephone = Convert.ToInt64(values[5]),
                    Address_Line_1 = values[6],
                    Address_Line_2 = values[7],
                    DOB = values[8],
                    FY2019_20 = Convert.ToInt64(values[9]),
                    FY2020_21 = Convert.ToInt64(values[10]),
                    FY2021_22 = Convert.ToInt64(values[11]),
                    FY2022_23 = Convert.ToInt64(values[12]),
                    FY2023_24 = Convert.ToInt64(values[13]),
                };
                csvData.Add(row);
            }
            return csvData;
        }

        private List<EmployeeStr> ConverStringToJsonStr(string content)
        {
            var line = content.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            var headers = line[0].Split(',');
            var csvData = new List<EmployeeStr>();
            foreach (var l in line.Skip(1))
            {
                var values = l.Split(',');
                var row = new EmployeeStr
                {
                    Email = values[0],
                    Name = values[1],
                    Country = values[2],
                    State = values[3],
                    City = values[4],
                    Telephone = values[5],
                    Address_Line_1 = values[6],
                    Address_Line_2 = values[7],
                    DOB = values[8],
                    FY2019_20 = values[9],
                    FY2020_21 = values[10],
                    FY2021_22 = values[11],
                    FY2022_23 = values[12],
                    FY2023_24 = values[13],

                };
                csvData.Add(row);
            }
            return csvData;
        }

        private async Task SaveLogsToDB(Log log)
        {
            try
            {
                await using var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                await connection.OpenAsync();
                var insertLogQuery = "INSERT into logprocessing(timestamp, issuccess, errormessage) VALUES(@timestamp, @issuccess, @errormessage)";
                using var cmd = new MySqlCommand(insertLogQuery, connection);
                cmd.Parameters.AddWithValue("@timestamp", log.TimeStamp);
                cmd.Parameters.AddWithValue("@issuccess", log.IsSuccess);
                cmd.Parameters.AddWithValue("@errormessage", log.ErrorMessage ?? (object)DBNull.Value);
                await cmd.ExecuteNonQueryAsync();
                _logger.LogInformation("Logs of chunks stored successfully");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error while storing logs of each chunk");
                throw;
            }
        }

        private async Task MultipleInsertStr(string csvRecords)
        {
            List<EmployeeStr> records = ConverStringToJsonStr(csvRecords);
            try
            {
                await using var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                await connection.OpenAsync();
                var sql = new StringBuilder();
                sql.Append("INSERT INTO employee (email, name, country, state, city, telephone, `address_line_1`, `address_line_2`, dob, `fy2019-20`, `fy2020-21`, `fy2021-22`, `fy2022-23`, `fy2023-24`) VALUES");
                foreach (var record in records)
                {
                    sql.Append($"('{MySqlHelper.EscapeString(record.Email)}', '{MySqlHelper.EscapeString(record.Name)}', '{MySqlHelper.EscapeString(record.Country)}', '{MySqlHelper.EscapeString(record.State)}', '{MySqlHelper.EscapeString(record.City)}', '{MySqlHelper.EscapeString(record.Telephone)}', '{MySqlHelper.EscapeString(record.Address_Line_1)}', '{MySqlHelper.EscapeString(record.Address_Line_2)}', '{MySqlHelper.EscapeString(record.DOB)}', '{MySqlHelper.EscapeString(record.FY2019_20)}', '{MySqlHelper.EscapeString(record.FY2020_21)}', '{MySqlHelper.EscapeString(record.FY2021_22)}', '{MySqlHelper.EscapeString(record.FY2022_23)}', '{MySqlHelper.EscapeString(record.FY2023_24)}'),");
                }
                sql.Length--;
                // Console.WriteLine(sql.ToString());
                using var command = new MySqlCommand(sql.ToString(), connection);
                await command.ExecuteNonQueryAsync();
                _logger.LogInformation("Chunk successfully inserted into MySQL.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving chunk to MySQL.");
            }
        }

        private async Task MultipleInsert(string csvRecords)
        {
            List<Employee> records = ConvertStringToJson(csvRecords);
            try
            {
                // Open a new connection for each operation
                await using var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                await connection.OpenAsync();
                var sql = new StringBuilder();
                sql.Append("INSERT INTO employee4 (email, name, country, state, city, telephone, `address_line_1`, `address_line_2`, dob, `fy2019-20`, `fy2020-21`, `fy2021-22`, `fy2022-23`, `fy2023-24`) VALUES");
                foreach (var record in records)
                {
                    sql.Append($"('{record.Email}', '{record.Name}', '{record.Country}', '{record.State}', '{record.City}', {record.Telephone}, '{record.Address_Line_1}', '{record.Address_Line_2}', '{record.DOB}', {record.FY2019_20}, {record.FY2020_21}, {record.FY2021_22}, {record.FY2022_23}, {record.FY2023_24}),");
                }
                sql.Length--; // Remove the trailing comma
                await using var command = new MySqlCommand(sql.ToString(), connection);
                await command.ExecuteNonQueryAsync();
                _logger.LogInformation("Chunk successfully inserted into MySQL.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving chunk to MySQL.");
            }
        }

        private async Task SendProgressUpdate(string message)
        {
            int totalChunks = 10;
            int chunkSize = message.Split('\n').Length - 1;
            int progress = chunkSize * 100 / (totalChunks * chunkSize);
            await _hubContext.Clients.All.SendAsync("ProgressUpdates", progress);
            // await _hubContext.Clients.All.SendAsync("ProgressUpdates", message);
        }
    }
}



// {
//   "000qL32RpD@example.com": [
//     {
//       "name": "Alex",
//       "city": "Thane"
//     }
//   ],
//   "001OndvTbP@example.com": [
//     {
//       "city": "Mumbai",
//       "state": "Maharashtra",
//       "name": "Ashish"
//     }
//   ],
//   "004lolAjfO@example.com": [
//     {
//       "state": "Karachi"
//     }
//   ]
// }