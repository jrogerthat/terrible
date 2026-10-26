namespace Terrible.Api.Features.Projects;

public sealed record ProjectResponse(
    long Id,
    string Name);

public sealed record CreateProjectRequest(
    string Name);
