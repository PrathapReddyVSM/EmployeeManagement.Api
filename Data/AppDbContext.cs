using EmployeeManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Attendance> Attendances => Set<Attendance>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(x => x.Username).IsUnique();
        modelBuilder.Entity<Employee>().HasIndex(x => x.EmployeeCode).IsUnique();
        modelBuilder.Entity<Employee>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<Department>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<Employee>().Property(x => x.Salary).HasPrecision(18, 2);
        modelBuilder.Entity<Attendance>().HasIndex(x => new { x.EmployeeId, x.AttendanceDate }).IsUnique();
        modelBuilder.Entity<Employee>()
            .HasOne(x => x.Department)
            .WithMany(x => x.Employees)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Attendance>()
            .HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Human Resources", CreatedAt = new DateTime(2025, 1, 1) },
            new Department { Id = 2, Name = "Engineering", CreatedAt = new DateTime(2025, 1, 1) },
            new Department { Id = 3, Name = "Finance", CreatedAt = new DateTime(2025, 1, 1) },
            new Department { Id = 4, Name = "Sales", CreatedAt = new DateTime(2025, 1, 1) }
        );
    }
}
