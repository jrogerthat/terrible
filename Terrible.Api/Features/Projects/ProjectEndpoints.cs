namespace Terrible.Api.Features.Projects;

public static class ProjectEndpoints
{
    public static IEndpointRouteBuilder MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/projects");

        group.MapGet("/", GetAllProjects.Handle);
        group.MapPost("/", CreateProject.Handle);

        return app;
    }
}