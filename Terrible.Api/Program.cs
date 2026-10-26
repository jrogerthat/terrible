using Microsoft.EntityFrameworkCore;
using Terrible.Api.Data;
using Terrible.Api.Features.Todos;
using Terrible.Api.Features.Projects;
using Terrible.Api.Common.JiraClient;


var builder = WebApplication.CreateBuilder(args);

// Register OpenAPI document generation.
builder.Services.AddOpenApi();

// Retrieve the PostgreSQL connection string from configuration.
// During local development, this comes from .NET user secrets.
var connectionString =
    builder.Configuration.GetConnectionString("TerribleDatabase")
    ?? throw new InvalidOperationException(
        "The TerribleDatabase connection string is missing.");

// Register AppDbContext and configure it to use PostgreSQL.
builder.Services.AddDbContext<TerribleDbContext>(options =>
    options.UseNpgsql(connectionString));

// Jira options + HttpClient
builder.Services.Configure<JiraOptions>(
    builder.Configuration.GetSection("Jira"));

builder.Services.AddHttpClient<IJiraClient, JiraClient>();

var app = builder.Build();

// Expose the OpenAPI document during local development.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// A simple endpoint for verifying that the API is running.
app.MapGet("/", () => Results.Ok(new
{
    message = "Terrible API is running."
}));

app.MapTodoEndpoints();
app.MapProjectEndpoints();


app.Run();