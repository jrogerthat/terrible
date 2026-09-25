using Microsoft.EntityFrameworkCore;
using Terrible.Api.Data;

namespace Terrible.Api.Features.Todos;

public static class GetAllTodos
{
    public static async Task<IResult> Handle(TerribleDbContext db, CancellationToken ct)
    {
        var todos = await db.Todos
            .Select(t => new TodoResponse(
                t.Id,
                t.Title,
                t.Description,
                t.StoryPoints,
                t.IsCompleted,
                t.CreatedAt))
            .ToListAsync(ct);

        return Results.Ok(todos);
    }
}
