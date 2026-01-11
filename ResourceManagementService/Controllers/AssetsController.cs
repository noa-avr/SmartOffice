using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ResourceManagementService.Models;

namespace ResourceManagementService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize] // By default - all Endpoints require a valid token 
    public class AssetsController : ControllerBase
    {
        private readonly IMongoCollection<Asset> _assets;

        public AssetsController(IMongoDatabase database)
        {
            _assets = database.GetCollection<Asset>("Assets");
        }

        [HttpGet] // Open to all logged in users (Admin and Member) 
        public async Task<ActionResult<List<Asset>>> Get() =>
            await _assets.Find(asset => true).ToListAsync();

        [HttpPost]
            [Authorize(Roles = "Admin")] // Authorization check: Only Admin can add an asset
        public async Task<IActionResult> Create(Asset asset)
        {
            await _assets.InsertOneAsync(asset);
            return Ok(new { message = "Asset added successfully by Admin!" }); // Admin added an asset successfully
        }
    }
}