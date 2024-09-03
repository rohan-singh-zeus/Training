namespace server.Models;

public class LogDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string LogsCollectionName { get; set; } = null!;
}