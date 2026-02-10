namespace net8dot0__web__processmeterreading.Models;

/// <summary>
/// Represents a meter reading submission with its timestamp.
/// </summary>
/// <param name="ReadingValue">The meter reading value (1-999999).</param>
/// <param name="Timestamp">The UTC timestamp when the reading was submitted.</param>
public record MeterReading(int ReadingValue, DateTime Timestamp);
