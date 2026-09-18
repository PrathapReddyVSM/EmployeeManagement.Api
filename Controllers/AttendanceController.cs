using EmployeeManagement.Api.Data;
using EmployeeManagement.Api.DTOs;
using EmployeeManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Api.Controllers;

[Authorize, ApiController, Route("api/attendance")]
public class AttendanceController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateTime? date, [FromQuery] int? employeeId)
    {
        var query = db.Attendances.Include(a => a.Employee).AsQueryable();
        if (date.HasValue) query = query.Where(a => a.AttendanceDate.Date == date.Value.Date);
        if (employeeId.HasValue) query = query.Where(a => a.EmployeeId == employeeId.Value);
        return Ok(await query.OrderByDescending(a => a.AttendanceDate).ThenBy(a => a.Employee!.FirstName).ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Upsert(AttendanceRequest request)
    {
        if (!await db.Employees.AnyAsync(e => e.Id == request.EmployeeId)) return BadRequest(new { message = "Employee not found" });
        var item = await db.Attendances.FirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId && a.AttendanceDate.Date == request.AttendanceDate.Date);
        if (item is null) { item = new Attendance { EmployeeId = request.EmployeeId }; db.Attendances.Add(item); }
        item.AttendanceDate = request.AttendanceDate.Date; item.Status = request.Status; item.CheckIn = request.CheckIn; item.CheckOut = request.CheckOut; item.Remarks = request.Remarks;
        await db.SaveChangesAsync(); return Ok(item);
    }
}
