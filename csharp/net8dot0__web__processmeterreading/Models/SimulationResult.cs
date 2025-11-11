namespace net8dot0__web__processmeterreading.Models;

/// <summary>
/// Represents the result of a simulated meter reading processing attempt.
/// </summary>
/// <param name="IsSuccess">Indicates if the simulated processing was successful.</param>
/// <param name="StatusCode">The HTTP status code to return (200, 422, or 503).</param>
/// <param name="Message">The message associated with the result.</param>
public record SimulationResult(bool IsSuccess, int StatusCode, string Message);
