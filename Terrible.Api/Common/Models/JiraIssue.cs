namespace Terrible.Api.Common.JiraClient;

public sealed class JiraIssue
{
    public string Key { get; init; } = string.Empty;
    public JiraIssueFields Fields { get; init; } = new();
}