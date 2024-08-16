
namespace server.Models;

public class Employee{
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? Country { get; set; }
    public string? State { get; set; }
    public string? City { get; set; }
    public long Telephone_Number { get; set; }
    public string? Address_Line_1 { get; set; }
    public string? Address_Line_2 { get; set; }

    public string? Date_Of_Birth { get; set; }

    public long Gross_Salary_FY2019_20 { get; set; }
    public long Gross_Salary_FY2020_21 { get; set; }
    public long Gross_Salary_FY2021_22 { get; set; }
    public long Gross_Salary_FY2022_23 { get; set; }
    public long Gross_Salary_FY2023_24 { get; set; }
}
