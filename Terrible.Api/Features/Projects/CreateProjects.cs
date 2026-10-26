using Terrible.Api.Data;

namespace Terrible.Api.Features.Projects;

public static class CreateProject
{
    public static async Task<IResult> Handle(
        CreateProjectRequest request,
        TerribleDbContext db,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest("Project name is required.");
        }

        var project = new Project
        {
            Name = request.Name.Trim(),
        };

        db.Projects.Add(project);
        await db.SaveChangesAsync(ct);

        var response = new ProjectResponse(project.Id, project.Name);

        return Results.Created($"/projects/{project.Id}", response);
    }
}