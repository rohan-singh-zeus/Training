using server.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace server.Services;

public class LogService
{
    private readonly IMongoCollection<LogMongo> _logsCollection;

    public LogService(
        IOptions<LogDatabaseSettings> logDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            logDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            logDatabaseSettings.Value.DatabaseName);

        _logsCollection = mongoDatabase.GetCollection<LogMongo>(
            logDatabaseSettings.Value.LogsCollectionName);
    }

    public async Task<List<LogMongo>> GetAsync() =>
        await _logsCollection.Find(_ => true).ToListAsync();

    public async Task<LogMongo?> GetAsync(string id) =>
        await _logsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(LogMongo newLog) =>
        await _logsCollection.InsertOneAsync(newLog);

    public async Task UpdateAsync(string id, LogMongo updatedLog) =>
        await _logsCollection.ReplaceOneAsync(x => x.Id == id, updatedLog);

    public async Task RemoveAsync(string id) =>
        await _logsCollection.DeleteOneAsync(x => x.Id == id);
}