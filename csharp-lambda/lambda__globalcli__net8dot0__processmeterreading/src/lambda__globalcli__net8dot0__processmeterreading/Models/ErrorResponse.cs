using System.Text.Json.Serialization;

namespace lambda__globalcli__net8dot0__processmeterreading.Models;

/// <summary>
/// Error response model for API errors
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// Error message describing what went wrong
    /// </summary>
    [JsonPropertyName("error")]
    public string Error { get; set; } = string.Empty;

    /// <summary>
    /// HTTP status code
    /// </summary>
    [JsonPropertyName("statusCode")]
    public int StatusCode { get; set; }

    /// <summary>
    /// Optional additional details about the error
    /// </summary>
    [JsonPropertyName("details")]
    public string? Details { get; set; }
}
