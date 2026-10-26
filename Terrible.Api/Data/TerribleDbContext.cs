using Microsoft.EntityFrameworkCore;
using Terrible.Api.Features.Todos;
using Terrible.Api.Features.Projects;

namespace Terrible.Api.Data;

public sealed class TerribleDbContext(
    DbContextOptions<TerribleDbContext> options)
    : DbContext(options)
{
    public DbSet<DefaultTodo> Todos => Set<DefaultTodo>();

    public DbSet<Project> Projects => Set<Project>();
}
