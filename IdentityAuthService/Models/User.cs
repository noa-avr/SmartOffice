namespace IdentityAuthService.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        // The role can be Admin or Member as required by the task
        public string Role { get; set; } = "Member"; 
    }
}