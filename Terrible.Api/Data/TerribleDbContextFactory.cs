using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Terrible.Api.Data;

public sealed class TerribleDbContextFactory
    : IDesignTimeDbContextFactory<TerribleDbContext>
{
    public TerribleDbContext CreateDbContext(string[] args)
    {
        // Explicit connection string for design-time EF tools (dotnet-ef).
        const string connectionString =
            "Host=localhost;Port=5433;Database=terrible;Username=terrible_user;Password=terribible";

        var optionsBuilder = new DbContextOptionsBuilder<TerribleDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new TerribleDbContext(optionsBuilder.Options);
    }
}
