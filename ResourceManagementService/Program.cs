using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ResourceManagementService.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Adding the ability to read environment variables from Docker (very important for error 500)
builder.Configuration.AddEnvironmentVariables(); 

// Registering the MongoDB settings
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDB"));

// Registering the MongoClient with handling the Docker address
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    // Trying to take the address directly from the Configuration to bypass connection issues
    var connectionString = builder.Configuration["MongoDB:ConnectionString"] 
                          ?? builder.Configuration.GetSection("MongoDB:ConnectionString").Value 
                          ?? "mongodb://assets-db:27017";
    
    Console.WriteLine($"[RESOURCE SERVICE] Attempting to connect to MongoDB at: {connectionString}");
    return new MongoClient(connectionString);
});

// Registering the Database
builder.Services.AddScoped<IMongoDatabase>(serviceProvider =>
{
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    var databaseName = builder.Configuration["MongoDB:DatabaseName"] 
                      ?? builder.Configuration.GetSection("MongoDB:DatabaseName").Value 
                      ?? "SmartOfficeDB";
                      
    return client.GetDatabase(databaseName);
});

// JWT authentication settings - sync with the Auth Service (to solve error 401)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "SmartOfficeAuth",
            ValidAudience = "SmartOfficeClient",
            // Note: The key must be exactly the same as the key in the Auth Service
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsASuperSecretKeyForMySmartOfficeApp123!"))
        };
    });

builder.Services.AddAuthorization(options => {
    // Setting the Policy that checks the Role "Admin" from the token
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "Resource Management API", 
        Version = "v1" 
    });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token."
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Showing the detailed error page in development
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- Critical order of operations for CORS and Auth ---
app.UseRouting();
app.UseCors("AllowAll");

app.UseAuthentication(); 
app.UseAuthorization(); 

app.MapControllers();
app.Run();