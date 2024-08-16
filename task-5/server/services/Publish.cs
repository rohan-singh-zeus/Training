using RabbitMQ.Client;

using System.Text;

namespace server.Services

{
    public class RabbitMQService(IConnectionFactory connectionFactory)
    {
        private readonly IConnectionFactory _connectionFactory = connectionFactory;
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

        public void SendMessageInChunks(IEnumerable<string[][]>? messages, string queueName){
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
                var body = Encoding.UTF8.GetBytes(message);
                channel.BasicPublish(exchange: "",
                                     routingKey: queueName,
                                     basicProperties: null,
                                     body: body);
            }
        }
    }
}