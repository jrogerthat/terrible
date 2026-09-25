using Microsoft.EntityFrameworkCore;
using Terrible.Api.Data;

namespace Terrible.Api.Features.Todos;

public static class CompleteTodo
{
    public static async Task<IResult> Handle(
        long id,
        TerribleDbContext db,
        CancellationToken ct)
    {
        var todo = await db.Todos
            .SingleOrDefaultAsync(t => t.Id == id, ct);

        if (todo is null)
        {
            return Results.NotFound();
        }

        // Domain behavior
        todo.Complete();

        await db.SaveChangesAsync(ct);

        var response = new TodoResponse(
            todo.Id,
            todo.Title,
            todo.Description,
            todo.StoryPoints,
            todo.IsCompleted,
            todo.CreatedAt);

        return Results.Ok(response);
    }
}
