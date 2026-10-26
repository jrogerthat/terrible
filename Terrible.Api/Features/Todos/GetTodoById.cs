using Microsoft.EntityFrameworkCore;
using Terrible.Api.Data;

namespace Terrible.Api.Features.Todos;

public static class GetTodoById
{
    public static async Task<IResult> Handle(
        long id,
        TerribleDbContext db,
        CancellationToken ct)
    {
        var todo = await db.Todos
            .Include(t => t.Project) // ensure Project is loaded
            .Where(t => t.Id == id)
            .Select(t => new TodoResponse(
                t.Id,
                t.Title,
                t.Description,
                t.StoryPoints,
                t.IsCompleted,
                t.CreatedAt,
                t.ProjectId,
                t.Project != null ? t.Project.Name : string.Empty))
            .SingleOrDefaultAsync(ct);

        return todo is null
            ? Results.NotFound()
            : Results.Ok(todo);
    }
}
