using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using server.Models;

using System.Text;

namespace server.Services

{
    public class RabbitMQService
    {
        private readonly IConnectionFactory _connectionFactory;
         private readonly ILogger<RabbitMQService> _logger;
        private readonly IHubContext<ProgressHub> _hubContext;

        public RabbitMQService( IConnectionFactory connectionFactory, ILogger<RabbitMQService> logger, IHubContext<ProgressHub> hubContext){
            _connectionFactory = connectionFactory;
            _logger = logger;
            _hubContext = hubContext;
        }
        public void SendMessage(string message, string queueName)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: queueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);
            var body = Encoding.UTF8.GetBytes(message);
            channel.BasicPublish(exchange: "",
                                 routingKey: queueName,
                                 basicProperties: null,
                                 body: body);
        }

        public async Task SendMessageInChunksAsync(IEnumerable<string[][]>? messages, string queueName)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: queueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);
            foreach (var chunk in messages!)
            {
                var message = string.Join("\n", chunk.Select(row => string.Join(",", row)));
                await SendProgressUpdate(message);
                var body = Encoding.UTF8.GetBytes(message);
                channel.BasicPublish(exchange: "",
                                     routingKey: queueName,
                                     basicProperties: null,
                                     body: body);
            }
        }

        private async Task SendProgressUpdate(string message){
            int totalChunks = 10;
            int chunkSize = message.Split('\n').Length - 1;
            int progress = chunkSize * 100 / (totalChunks * chunkSize);
            await _hubContext.Clients.All.SendAsync("ProgressUpdates", progress);
        }
    }
}