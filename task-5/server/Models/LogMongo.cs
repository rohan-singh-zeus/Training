using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

public class LogMongo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("Timestamp")]
    public string? TimeStamp { get; set; }

    [BsonElement("IsSuccess")]
    public bool IsSuccess { get; set; }

    [BsonElement("ErrorMessage")]
    public string? ErrorMessage { get; set; }
}