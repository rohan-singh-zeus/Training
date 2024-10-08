using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.Extensions.Caching.Distributed;
using MySql.Data.MySqlClient;
using Mysqlx.Crud;
using NuGet.Protocol.Plugins;
using RabbitMQ.Client;
using server.Models;
using server.Services;
using StackExchange.Redis;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;
        private readonly IConfiguration _configuration;
        private readonly MySqlConnection connection;
        private readonly RabbitMQService _rabbitmqService;
        private readonly IConnectionMultiplexer _redis;
        // private readonly IDistributedCache _cache;
        public TodoItemsController(TodoContext context, IConfiguration configuration, RabbitMQService rabbitmqService, IConnectionMultiplexer redis)
        {
            _context = context;
            _configuration = configuration;
            connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            _rabbitmqService = rabbitmqService;
            // _cache = cache;
            _redis = redis;
        }

        [HttpGet("ping")]
        public IActionResult PingRedis()
        {
            var db = _redis.GetDatabase();
            var ping = db.Ping();
            return Ok($"Redis responded in {ping.Milliseconds} ms.");
        }

        [HttpPost("kTest")]
        public async Task<IActionResult> GetKeyRedis(List<Employee> employee)
        {
            var db = _redis.GetDatabase();
            var cacheKey = "TEST_KEY_2";
            var cacheStr = JsonSerializer.Serialize(employee);
            var cacheData = Encoding.UTF8.GetBytes(cacheStr);
            await db.StringSetAsync(cacheKey, cacheData);
            return Ok("Saved to cache");
        }

        [HttpGet("gTest")]
        public async Task<IActionResult> SetKeyRedis(){
            var db = _redis.GetDatabase();
            var cacheKey = "TEST_KEY_2";
            string? cacheData = await db.StringGetAsync(cacheKey);
            if(cacheData is null){
                Console.WriteLine("Data not available");
                return BadRequest("Something went wrong");
            }
            var finalData = JsonSerializer.Deserialize<List<Employee>>(cacheData);
            return Ok(finalData);
        }

        private async Task EnsureConnectionOpenAsync()
        {
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCsvRecords()
        {

            var csvRecord = new List<EmployeeStr>();

            await EnsureConnectionOpenAsync();

            using var command = new MySqlCommand("select * from employee limit 0, 50;", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                EmployeeStr item = new()
                {
                    Email = reader.GetString(0),
                    Name = reader.GetString(1),
                    Country = reader.GetString(2),
                    State = reader.GetString(3),
                    City = reader.GetString(4),
                    Telephone = reader.GetString(5),
                    Address_Line_1 = reader.GetString(6),
                    Address_Line_2 = reader.GetString(7),
                    DOB = reader.GetString(8),
                    FY2019_20 = reader.GetString(9),
                    FY2020_21 = reader.GetString(10),
                    FY2021_22 = reader.GetString(11),
                    FY2022_23 = reader.GetString(12),
                    FY2023_24 = reader.GetString(13),
                };
                csvRecord.Add(item);
            }
            return Ok(csvRecord);
            // return await _context.TodoItems.ToListAsync();
        }


        [HttpGet]
        [Route("/lazy/{from}/{to}")]
        public async Task<IActionResult> GetCsvRecordInChunks(long from, long to)
        {
            var csvRecord = new List<EmployeeStr>();

            await EnsureConnectionOpenAsync();
           
            using var command = new MySqlCommand("select * from employee limit @from, @to;", connection);
            command.Parameters.AddWithValue("@from", from);
            command.Parameters.AddWithValue("@to", to);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                EmployeeStr item = new()
                {
                    Email = reader.GetString(0),
                    Name = reader.GetString(1),
                    Country = reader.GetString(2),
                    State = reader.GetString(3),
                    City = reader.GetString(4),
                    Telephone = reader.GetString(5),
                    Address_Line_1 = reader.GetString(6),
                    Address_Line_2 = reader.GetString(7),
                    DOB = reader.GetString(8),
                    FY2019_20 = reader.GetString(9),
                    FY2020_21 = reader.GetString(10),
                    FY2021_22 = reader.GetString(11),
                    FY2022_23 = reader.GetString(12),
                    FY2023_24 = reader.GetString(13),
                };
                csvRecord.Add(item);
            }
            return Ok(csvRecord);
        }

        [HttpGet]
        [Route("/lazy_2/{from}/{to}")]
        public async Task<IActionResult> GetCsvRecordInChunks_2(long from, long to)
        {
            var csvRecord = new List<EmployeeStr>();

            await EnsureConnectionOpenAsync();
            var db = _redis.GetDatabase();
            var cacheKey = "LazyRecords";

            string? cacheData = await db.StringGetAsync(cacheKey);

            if(cacheData is not null){
                List<EmployeeStr> cacheDSTR = JsonSerializer.Deserialize<List<EmployeeStr>>(cacheData);
                Console.WriteLine("Cache Hit");
                return Ok(cacheDSTR);
            }
            using var command = new MySqlCommand("select * from employee limit @from, @to;", connection);
            command.Parameters.AddWithValue("@from", from);
            command.Parameters.AddWithValue("@to", to);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                EmployeeStr item = new()
                {
                    Email = reader.GetString(0),
                    Name = reader.GetString(1),
                    Country = reader.GetString(2),
                    State = reader.GetString(3),
                    City = reader.GetString(4),
                    Telephone = reader.GetString(5),
                    Address_Line_1 = reader.GetString(6),
                    Address_Line_2 = reader.GetString(7),
                    DOB = reader.GetString(8),
                    FY2019_20 = reader.GetString(9),
                    FY2020_21 = reader.GetString(10),
                    FY2021_22 = reader.GetString(11),
                    FY2022_23 = reader.GetString(12),
                    FY2023_24 = reader.GetString(13),
                };
                csvRecord.Add(item);
            }
            var toCache = JsonSerializer.Serialize(csvRecord);
            var finalCacheData = Encoding.UTF8.GetBytes(toCache);
            await db.StringSetAsync(cacheKey, finalCacheData);
            Console.WriteLine("Cache Miss");
            return Ok(csvRecord);
        }

        // Helper method to read file content
        private async Task<string> ReadFileContentAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            return Encoding.UTF8.GetString(stream.ToArray());
        }

        // POST: api/TodoItems/handleCsv
        [HttpPost]
        [Route("handleCsv")]
        public async Task<IActionResult> HandleCsv(IFormFile file)
        {
            Stopwatch stopwatch = new();
            stopwatch.Start();
            if (file == null || file.Length == 0)
            {
                return BadRequest("File not found!!");
            }
            try
            {
                var csvContent = await ReadFileContentAsync(file);
                List<EmployeeStr> jsonContent = ConverStringToJsonStr(csvContent);
                await MultipleInsertStr(jsonContent);
                stopwatch.Stop();
                Console.WriteLine("Time elapsed: {0} ms", stopwatch.ElapsedMilliseconds);
                return Ok("Csv data added to MySQL");
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                Console.WriteLine("Time elapsed: {0} ms", stopwatch.ElapsedMilliseconds);
                Console.WriteLine($"Error processing CSV: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/TodoItems/sendToMQ
        [HttpPost]
        [Route("sendToMQ")]
        public async Task<IActionResult> SendToMQ(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File not found!!");
            }
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            var csvContent = Encoding.UTF8.GetString(stream.ToArray());
            _rabbitmqService.SendMessage(csvContent, "csvQueue");
            return Ok("Csv data added to RabbitMQ");
        }

        // Helper method to read CSV file
        private async Task<List<string[]>> ReadCsvFileAsync(IFormFile file)
        {
            var csvData = new List<string[]>();
            using var reader = new StreamReader(file.OpenReadStream());
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                csvData.Add(line!.Split(','));
            }
            return csvData;
        }

        // Helper method to chunk data
        private IEnumerable<string[][]> ChunkCsvData(List<string[]> csvData, int chunkSize)
        {
            return csvData.Skip(1).Select((value, index) => new { value, index })
                          .GroupBy(x => x.index / chunkSize)
                          .Select(g => g.Select(x => x.value).ToArray());
        }

        // POST: api/TodoItems/sendToMQInChunks
        [HttpPost]
        [Route("sendToMQInChunks")]
        public async Task<IActionResult> SendToMQInChunks(IFormFile file)
        {
            Stopwatch stopwatch = new();
            stopwatch.Start();
            var chunkSize = 10000;
            if (file == null || file.Length == 0)
            {
                return BadRequest("File not found!!");
            }

            try
            {
                var csvData = await ReadCsvFileAsync(file);
                var chunks = ChunkCsvData(csvData, chunkSize);
                await _rabbitmqService.SendMessageInChunksAsync(chunks, "chunksQueue12");
                stopwatch.Stop();
                Console.WriteLine("Time elapsed for sending chunks from aspnet to rabbitmq: {0} ms", stopwatch.ElapsedMilliseconds);
                return Ok("Added To RabbitMQ in chunks");
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                Console.WriteLine("Time elapsed for sending chunks from aspnet to rabbitmq: {0} ms", stopwatch.ElapsedMilliseconds);
                Console.WriteLine($"Error sending to MQ: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        private List<Employee> ConverStringToJson(string content)
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

        private async Task MultipleInsert(List<Employee> csvRecords)
        {
            await connection.OpenAsync();
            var sql = new StringBuilder();
            sql.Append("INSERT INTO employee4 (email, name, country, state, city, telephone, `address_line_1`, `address_line_2`, dob, `fy2019-20`, `fy2020-21`, `fy2021-22`, `fy2022-23`, `fy2023-24`) VALUES");
            foreach (var record in csvRecords)
            {
                sql.Append($"('{MySqlHelper.EscapeString(record.Email)}', '{MySqlHelper.EscapeString(record.Name)}', '{MySqlHelper.EscapeString(record.Country)}', '{MySqlHelper.EscapeString(record.State)}', '{MySqlHelper.EscapeString(record.City)}', {record.Telephone}, '{MySqlHelper.EscapeString(record.Address_Line_1)}', '{MySqlHelper.EscapeString(record.Address_Line_2)}', '{MySqlHelper.EscapeString(record.DOB)}', {record.FY2019_20}, {record.FY2020_21}, {record.FY2021_22}, {record.FY2022_23}, {record.FY2023_24}),");
            }
            sql.Length--;
            Console.WriteLine(sql.ToString());
            using var command = new MySqlCommand(sql.ToString(), connection);
            await command.ExecuteNonQueryAsync();
        }

        private async Task MultipleInsertStr(List<EmployeeStr> csvRecords)
        {
            await connection.OpenAsync();
            var sql = new StringBuilder();
            sql.Append("INSERT INTO employee (email, name, country, state, city, telephone, `address_line_1`, `address_line_2`, dob, `fy2019-20`, `fy2020-21`, `fy2021-22`, `fy2022-23`, `fy2023-24`) VALUES");
            foreach (var record in csvRecords)
            {
                sql.Append($"('{MySqlHelper.EscapeString(record.Email)}', '{MySqlHelper.EscapeString(record.Name)}', '{MySqlHelper.EscapeString(record.Country)}', '{MySqlHelper.EscapeString(record.State)}', '{MySqlHelper.EscapeString(record.City)}', '{MySqlHelper.EscapeString(record.Telephone)}', '{MySqlHelper.EscapeString(record.Address_Line_1)}', '{MySqlHelper.EscapeString(record.Address_Line_2)}', '{MySqlHelper.EscapeString(record.DOB)}', '{MySqlHelper.EscapeString(record.FY2019_20)}', '{MySqlHelper.EscapeString(record.FY2020_21)}', '{MySqlHelper.EscapeString(record.FY2021_22)}', '{MySqlHelper.EscapeString(record.FY2022_23)}', '{MySqlHelper.EscapeString(record.FY2023_24)}'),");
            }
            sql.Length--;
            Console.WriteLine(sql.ToString());
            using var command = new MySqlCommand(sql.ToString(), connection);
            await command.ExecuteNonQueryAsync();
        }


        // POST: api/TodoItems/updateCells
        [HttpPost]
        [Route("updateCells")]
        public async Task<IActionResult> UpdateCells(Dictionary<string, List<Dictionary<string, string>>> UpdateItems)
        {
            if (UpdateItems == null || UpdateItems.Count == 0)
            {
                return BadRequest("No Data received");
            }
            await connection.OpenAsync();
            var sql = new StringBuilder();
            foreach (var item in UpdateItems)
            {
                var email = item.Key; // Email is the key
                foreach (var dict in item.Value) // Each dict contains column-value pairs
                {
                    foreach (var pair in dict)
                    {
                        var columnName = pair.Key;
                        var value = pair.Value;
                        sql.Append($"UPDATE employee SET `{columnName}` = @value WHERE `email` = @Email;");
                        using var command = new MySqlCommand(sql.ToString(), connection);
                        command.Parameters.AddWithValue("@value", value);
                        command.Parameters.AddWithValue("@Email", email);
                        try
                        {
                            await command.ExecuteNonQueryAsync();
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error updating record: {ex.Message}");
                            return StatusCode(500, $"Internal server error: {ex.Message}");
                        }
                        sql.Clear();
                    }
                }
            }
            return Ok(UpdateItems);
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            await connection.OpenAsync();
            using var command = connection.CreateCommand();
            command.CommandText = "DELETE FROM todo where id = @id";
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
            return Ok();
        }

        [HttpDelete("/row/{email}")]
        public async Task<IActionResult> DeleteTodoEmail(string email)
        {
            await connection.OpenAsync();
            using var command = connection.CreateCommand();
            command.CommandText = "DELETE FROM employee where email = @email";
            command.Parameters.AddWithValue("@email", email);
            await command.ExecuteNonQueryAsync();
            return Ok();
        }

        private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }
    }
}
