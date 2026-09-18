using EmployeeManagement.Api.Data;
using EmployeeManagement.Api.DTOs;
using EmployeeManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Api.Controllers;

[Authorize, ApiController, Route("api/employees")]
public class EmployeesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] int? departmentId, [FromQuery] bool? active)
    {
        var query = db.Employees.Include(e => e.Department).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) query = query.Where(e => e.FirstName.Contains(search) || e.LastName.Contains(search) || e.EmployeeCode.Contains(search) || e.Email.Contains(search));
        if (departmentId.HasValue) query = query.Where(e => e.DepartmentId == departmentId.Value);
        if (active.HasValue) query = query.Where(e => e.IsActive == active.Value);
        return Ok(await query.OrderBy(e => e.EmployeeCode).ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var employee = await db.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.Id == id);
        return employee is null ? NotFound(new { message = "Employee not found" }) : Ok(employee);
    }

    [HttpPost]
    public async Task<IActionResult> Create(EmployeeRequest request)
    {
        if (await db.Employees.AnyAsync(e => e.EmployeeCode == request.EmployeeCode || e.Email == request.Email)) return Conflict(new { message = "Employee code or email already exists" });
        if (!await db.Departments.AnyAsync(d => d.Id == request.DepartmentId)) return BadRequest(new { message = "Invalid department" });
        var employee = new Employee { EmployeeCode = request.EmployeeCode, FirstName = request.FirstName, LastName = request.LastName, Email = request.Email, Phone = request.Phone, Position = request.Position, Salary = request.Salary, JoiningDate = request.JoiningDate, DepartmentId = request.DepartmentId };
        db.Employees.Add(employee); await db.SaveChangesAsync(); return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, EmployeeRequest request)
    {
        var employee = await db.Employees.FindAsync(id);
        if (employee is null) return NotFound(new { message = "Employee not found" });
        if (!await db.Departments.AnyAsync(d => d.Id == request.DepartmentId)) return BadRequest(new { message = "Invalid department" });
        employee.EmployeeCode = request.EmployeeCode; employee.FirstName = request.FirstName; employee.LastName = request.LastName; employee.Email = request.Email; employee.Phone = request.Phone; employee.Position = request.Position; employee.Salary = request.Salary; employee.JoiningDate = request.JoiningDate; employee.DepartmentId = request.DepartmentId; employee.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(); return Ok(employee);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var employee = await db.Employees.FindAsync(id);
        if (employee is null) return NotFound(new { message = "Employee not found" });
        db.Employees.Remove(employee); await db.SaveChangesAsync(); return NoContent();
    }

    [HttpGet("departments")]
    public async Task<IActionResult> Departments() => Ok(await db.Departments.OrderBy(d => d.Name).ToListAsync());
}
