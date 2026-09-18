using EmployeeManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Api.Controllers;

[Authorize, ApiController, Route("api/reports")]
public class ReportsController(ReportService reports) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard() => Ok(await reports.DashboardAsync());

    [HttpGet("employees/excel")]
    public async Task<IActionResult> EmployeesExcel() => File(await reports.EmployeeDirectoryExcelAsync(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "employee-directory.xlsx");

    [HttpGet("employees/pdf")]
    public async Task<IActionResult> EmployeesPdf() => File(await reports.EmployeeDirectoryPdfAsync(), "application/pdf", "employee-directory.pdf");

    [HttpGet("attendance/excel")]
    public async Task<IActionResult> AttendanceExcel([FromQuery] DateTime from, [FromQuery] DateTime to) => File(await reports.AttendanceExcelAsync(from, to), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "attendance-report.xlsx");
}
