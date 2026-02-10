using System.Text.Json.Serialization;
using net8dot0__web__processmeterreading.Models;

namespace net8dot0__web__processmeterreading;

/// <summary>
/// JSON serializer context for Native AOT support.
/// This provides compile-time type information for JSON serialization,
/// which is required when using PublishAot=true.
/// </summary>
[JsonSerializable(typeof(MeterReading))]
[JsonSerializable(typeof(MeterReadingRequest))]
[JsonSerializable(typeof(SuccessResponse))]
[JsonSerializable(typeof(ErrorResponse))]
[JsonSerializable(typeof(List<MeterReading>))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}
