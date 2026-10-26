namespace Terrible.Api.Common.JiraClient;

public sealed class JiraOptions
{
    public string BaseUrl { get; init; } = string.Empty;
    public string ApiUser { get; init; } = string.Empty;
    public string ApiToken { get; init; } = string.Empty;
}
