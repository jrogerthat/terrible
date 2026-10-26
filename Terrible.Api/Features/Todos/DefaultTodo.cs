using Terrible.Api.Features.Projects;

namespace Terrible.Api.Features.Todos;

public sealed class DefaultTodo : ITodo
{
    public long Id { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public int? StoryPoints { get; set; }

    public bool IsCompleted { get; private set; }

    public DateTimeOffset CreatedAt { get; set; }

    // NEW: FK + navigation
    public long ProjectId { get; set; }

    public Project? Project { get; set; }

    public void Complete()
    {
        IsCompleted = true;
    }
}
