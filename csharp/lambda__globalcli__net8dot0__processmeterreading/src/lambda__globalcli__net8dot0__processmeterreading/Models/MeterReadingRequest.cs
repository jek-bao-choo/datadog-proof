using System.Text.Json.Serialization;

namespace lambda__globalcli__net8dot0__processmeterreading.Models;

/// <summary>
/// Request body for submitting a new meter reading
/// </summary>
public class MeterReadingRequest
{
    /// <summary>
    /// The meter reading value to submit (1-999999)
    /// </summary>
    [JsonPropertyName("readingValue")]
    public int ReadingValue { get; set; }
}
