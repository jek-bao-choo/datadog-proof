using System.ComponentModel.DataAnnotations;

namespace net8dot0__web__processmeterreading.Models;

/// <summary>
/// Request DTO for submitting a meter reading.
/// </summary>
/// <param name="ReadingValue">The meter reading value (must be between 1 and 999999).</param>
public record MeterReadingRequest(
    [Range(1, 999999, ErrorMessage = "Meter reading must be between 1 and 999999")]
    int ReadingValue
);
