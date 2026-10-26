using Terrible.Api.Data;

namespace Terrible.Api.Features.Todos;

public static class CreateTodo
{
    public static async Task<IResult> Handle(
        CreateTodoRequest request,
        TerribleDbContext db,
        CancellationToken ct)
    {
        var todo = new DefaultTodo
        {
            Title = request.Title,
            Description = request.Description,
            StoryPoints = request.StoryPoints,
            CreatedAt = DateTimeOffset.UtcNow,
            ProjectId = request.ProjectId
        };

        db.Todos.Add(todo);
        await db.SaveChangesAsync(ct);

        // ensure project is loaded (optional but nice for ProjectName)
        await db.Entry(todo).Reference(t => t.Project).LoadAsync(ct);

        var response = new TodoResponse(
            todo.Id,
            todo.Title,
            todo.Description,
            todo.StoryPoints,
            todo.IsCompleted,
            todo.CreatedAt,
            todo.ProjectId,
            todo.Project?.Name ?? string.Empty);

        return Results.Created($"/todos/{todo.Id}", response);
    }
}
