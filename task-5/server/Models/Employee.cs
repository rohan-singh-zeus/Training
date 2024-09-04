
namespace server.Models;

public class Employee{
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? Country { get; set; }
    public string? State { get; set; }
    public string? City { get; set; }
    public long Telephone { get; set; }
    public string? Address_Line_1 { get; set; }
    public string? Address_Line_2 { get; set; }

    public string? DOB { get; set; }

    public long FY2019_20 { get; set; }
    public long FY2020_21 { get; set; }
    public long FY2021_22 { get; set; }
    public long FY2022_23 { get; set; }
    public long FY2023_24 { get; set; }
}
