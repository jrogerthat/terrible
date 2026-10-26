namespace Terrible.Api.Features.Todos;

public sealed record TodoResponse(
    long Id,
    string Title,
    string Description,
    int? StoryPoints,
    bool IsCompleted,
    DateTimeOffset CreatedAt,
    long ProjectId,
    string ProjectName);

public sealed record CreateTodoRequest(
    string Title,
    string Description,
    int? StoryPoints,
    long ProjectId);
