using Microsoft.EntityFrameworkCore;
using IdentityAuthService.Models;

namespace IdentityAuthService.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) 
        { 
        }

        public DbSet<User> Users { get; set; }
    }
}