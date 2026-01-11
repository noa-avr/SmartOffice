using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ResourceManagementService.Models
{
    public class Asset
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty; // For example: "Desk 101"
        public string Type { get; set; } = string.Empty; // For example: "Furniture"
    }
}