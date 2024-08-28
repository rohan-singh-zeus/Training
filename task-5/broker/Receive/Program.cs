using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

var factory = new ConnectionFactory { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

// var count = 0;

channel.QueueDeclare(queue: "chunksQueue16",
                     durable: true,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

Console.WriteLine(" [*] Waiting for messages.");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    // Console.WriteLine($" [x] Received {message}");
    // Console.WriteLine(count+1);
};
channel.BasicConsume(queue: "chunksQueue16",
                     autoAck: true,
                     consumer: consumer);

// Console.WriteLine(count);

Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine();