namespace server.Models;

public class Log{
    public int Id { get; set; }

    public string? TimeStamp { get; set; }

    public bool IsSuccess { get; set; }

    public string? ErrorMessage { get; set; }
}