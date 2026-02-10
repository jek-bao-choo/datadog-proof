using System.Text.Json.Serialization;

namespace lambda__globalcli__net8dot0__processmeterreading.Models;

/// <summary>
/// Represents a meter reading with its value and timestamp
/// </summary>
public class MeterReading
{
    /// <summary>
    /// The meter reading value (1-999999)
    /// </summary>
    [JsonPropertyName("value")]
    public int Value { get; set; }

    /// <summary>
    /// ISO 8601 timestamp when the reading was recorded
    /// </summary>
    [JsonPropertyName("timestamp")]
    public string Timestamp { get; set; } = string.Empty;
}
