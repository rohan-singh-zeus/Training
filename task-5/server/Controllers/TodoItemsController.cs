using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using NuGet.Protocol.Plugins;
using RabbitMQ.Client;
using server.Models;
using server.Services;

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
        public TodoItemsController(TodoContext context, IConfiguration configuration, RabbitMQService rabbitmqService)
        {
            _context = context;
            _configuration = configuration;
            connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            _rabbitmqService = rabbitmqService;
        }

        // GET: api/TodoItems
        [HttpGet]
        public async Task<IActionResult> GetTodoItems()
        {

            var todoItems = new List<TodoItem>();

            await connection.OpenAsync();

            using var command = new MySqlCommand("select * from todo;", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                TodoItem item = new()
                {
                    Id = reader.GetInt32(0),
                    FirstName = reader.GetString(1),
                    LastName = reader.GetString(2),
                    Age = reader.GetInt32(3),
                    Height = reader.GetInt32(4),
                    Gender = reader.GetString(5),

                };
                todoItems.Add(item);
            }
            return Ok(todoItems);
            // return await _context.TodoItems.ToListAsync();
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
            // var todoItems = new List<TodoItem>();

            // await connection.OpenAsync();

            // using var command = new MySqlCommand("select * from todo where id = @id;", connection);
            // command.Parameters.AddWithValue("@id", id);
            // using var reader = await command.ExecuteReaderAsync();
            // var result = await reader.ReadAsync();

            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        // PUT: api/TodoItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(todoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TodoItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
        {
            // _context.TodoItems.Add(todoItem);
            // await _context.SaveChangesAsync();
            await connection.OpenAsync();
            using var command = new MySqlCommand("insert into todo (id, firstname, lastname, age, height, gender) values(@id, @firstname, @lastname, @age, @height, @gender);", connection);
            command.Parameters.AddWithValue("@id", todoItem.Id);
            command.Parameters.AddWithValue("@firstname", todoItem.FirstName);
            command.Parameters.AddWithValue("@lastname", todoItem.LastName);
            command.Parameters.AddWithValue("@age", todoItem.Age);
            command.Parameters.AddWithValue("@height", todoItem.Height);
            command.Parameters.AddWithValue("@gender", todoItem.Gender);
            await command.ExecuteNonQueryAsync();
            return CreatedAtAction(nameof(PostTodoItem), new { id = todoItem.Id }, todoItem);
        }

        [HttpPost]
        [Route("handleCsv")]
        public async Task<IActionResult> HandleCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File not found!!");
            }
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            var csvContent = Encoding.UTF8.GetString(stream.ToArray());
            List<Employee> jsonContent = ConverStringToJson(csvContent);
            await MultipleInsert(jsonContent);
            return Ok("Csv data added to MySQL");
        }

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

        [HttpPost]
        [Route("sendToMQInChunks")]
        public async Task<IActionResult> SendToMQInChunks(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File not found!!");
            }
            var csvData = new List<string[]>();
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    csvData.Add(line!.Split(','));
                }
            }
            // Chunking the CSV data
            var chunks = csvData.Skip(1).Select((value, index) => new { value, index }) // Skip the header
                                .GroupBy(x => x.index / 10)
                                .Select(g => g.Select(x => x.value).ToArray());
            _rabbitmqService.SendMessageInChunks(chunks, "chunksQueue12");
            return Ok("Added To RabbitMQ in chunks");
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
                    Telephone_Number = Convert.ToInt64(values[5]),
                    Address_Line_1 = values[6],
                    Address_Line_2 = values[7],
                    Date_Of_Birth = values[8],
                    Gross_Salary_FY2019_20 = Convert.ToInt64(values[9]),
                    Gross_Salary_FY2020_21 = Convert.ToInt64(values[10]),
                    Gross_Salary_FY2021_22 = Convert.ToInt64(values[11]),
                    Gross_Salary_FY2022_23 = Convert.ToInt64(values[12]),
                    Gross_Salary_FY2023_24 = Convert.ToInt64(values[13]),

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
                sql.Append($"('{record.Email}', '{record.Name}', '{record.Country}', '{record.State}', '{record.City}', {record.Telephone_Number}, '{record.Address_Line_1}', '{record.Address_Line_2}', '{record.Date_Of_Birth}', {record.Gross_Salary_FY2019_20}, {record.Gross_Salary_FY2020_21}, {record.Gross_Salary_FY2021_22}, {record.Gross_Salary_FY2022_23}, {record.Gross_Salary_FY2023_24}),");
            }
            sql.Length--;
            Console.WriteLine(sql.ToString());
            using var command = new MySqlCommand(sql.ToString(), connection);
            await command.ExecuteNonQueryAsync();
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

        private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }
    }
}
