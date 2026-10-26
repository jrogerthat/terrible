using Microsoft.EntityFrameworkCore;
using Terrible.Api.Data;

namespace Terrible.Api.Features.Projects;

public static class GetAllProjects
{
    public static async Task<IResult> Handle(
        TerribleDbContext db,
        CancellationToken ct)
    {
        var projects = await db.Projects
            .Select(p => new ProjectResponse(p.Id, p.Name))
            .ToListAsync(ct);

        return Results.Ok(projects);
    }
}
