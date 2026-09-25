namespace Terrible.Api.Features.Todos;

public static class TodoEndpoints
{
    // Extension method so Program.cs can call app.MapTodoEndpoints();
    public static IEndpointRouteBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/todos");

        // GET /todos
        group.MapGet("/", GetAllTodos.Handle);

        // GET /todos/{id}
        group.MapGet("/{id:long}", GetTodoById.Handle);

        // POST /todos
        group.MapPost("/", CreateTodo.Handle);

        // POST /todos/{id}/complete
        group.MapPost("/{id:long}/complete", CompleteTodo.Handle);

        return app;
    }
}
