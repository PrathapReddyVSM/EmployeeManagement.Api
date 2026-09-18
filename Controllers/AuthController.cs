using BCrypt.Net;
using EmployeeManagement.Api.Data;
using EmployeeManagement.Api.DTOs;
using EmployeeManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Api.Controllers;

[ApiController, Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokenService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await db.Users.SingleOrDefaultAsync(x => x.Username == request.Username);
        if (user is null || !BCrypt.Verify(request.Password, user.PasswordHash)) return Unauthorized(new { message = "Invalid username or password" });
        return Ok(new LoginResponse(tokenService.CreateToken(user), user.Username, user.Role));
    }
}
