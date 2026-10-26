namespace Terrible.Api.Features.Todos;

public interface ITodo
{
    long Id { get; }

    string Title { get; }

    string Description { get; }

    int? StoryPoints { get; }

    bool IsCompleted { get; }

    DateTimeOffset CreatedAt { get; }

    long ProjectId { get; }

    void Complete();
}