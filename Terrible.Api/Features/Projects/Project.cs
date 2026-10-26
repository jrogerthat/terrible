namespace Terrible.Api.Features.Projects;

public sealed class Project
{
    public long Id { get; set; }

    public required string Name { get; set; }
}