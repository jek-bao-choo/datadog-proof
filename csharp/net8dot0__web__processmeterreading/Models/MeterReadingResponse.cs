namespace net8dot0__web__processmeterreading.Models;

/// <summary>
/// Response DTO for successful meter reading submission.
/// </summary>
/// <param name="Success">Indicates if the operation was successful.</param>
/// <param name="Message">Success message.</param>
/// <param name="Reading">The submitted meter reading with timestamp.</param>
public record SuccessResponse(bool Success, string Message, MeterReading Reading);

/// <summary>
/// Response DTO for failed meter reading submission.
/// </summary>
/// <param name="Success">Indicates if the operation was successful (always false).</param>
/// <param name="Error">Error description.</param>
/// <param name="Code">HTTP status code.</param>
public record ErrorResponse(bool Success, string Error, int Code);
