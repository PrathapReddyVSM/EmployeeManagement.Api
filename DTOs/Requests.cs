using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Api.DTOs;

public record LoginRequest([Required] string Username, [Required] string Password);
public record LoginResponse(string Token, string Username, string Role);

public class EmployeeRequest
{
    [Required, StringLength(20)] public string EmployeeCode { get; set; } = string.Empty;
    [Required, StringLength(50)] public string FirstName { get; set; } = string.Empty;
    [Required, StringLength(50)] public string LastName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Phone] public string Phone { get; set; } = string.Empty;
    [Required] public string Position { get; set; } = string.Empty;
    [Range(0, 100000000)] public decimal Salary { get; set; }
    public DateTime JoiningDate { get; set; }
    [Range(1, int.MaxValue)] public int DepartmentId { get; set; }
}

public class AttendanceRequest
{
    [Range(1, int.MaxValue)] public int EmployeeId { get; set; }
    public DateTime AttendanceDate { get; set; }
    [Required] public string Status { get; set; } = "Present";
    public TimeSpan? CheckIn { get; set; }
    public TimeSpan? CheckOut { get; set; }
    public string? Remarks { get; set; }
}
