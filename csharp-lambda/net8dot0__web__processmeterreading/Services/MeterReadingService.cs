using net8dot0__web__processmeterreading.Models;

namespace net8dot0__web__processmeterreading.Services;

/// <summary>
/// Service for managing meter reading storage and retrieval.
/// Thread-safe in-memory storage implementation.
/// </summary>
public class MeterReadingService
{
    // In-memory storage for meter readings
    private readonly List<MeterReading> _readings = new();

    // Lock object for thread-safe operations
    private readonly object _lock = new();

    // Logger for tracking operations
    private readonly ILogger<MeterReadingService> _logger;

    /// <summary>
    /// Initializes the service with a dummy meter reading.
    /// </summary>
    /// <param name="logger">Logger instance for logging operations.</param>
    public MeterReadingService(ILogger<MeterReadingService> logger)
    {
        _logger = logger;

        // Add dummy reading on initialization
        var dummyReading = new MeterReading(1332, DateTime.UtcNow);
        _readings.Add(dummyReading);

        _logger.LogInformation("MeterReadingService initialized with dummy reading: {ReadingValue}", dummyReading.ReadingValue);
    }

    /// <summary>
    /// Adds a new meter reading to the storage.
    /// Thread-safe operation.
    /// </summary>
    /// <param name="reading">The meter reading to add.</param>
    public void AddReading(MeterReading reading)
    {
        lock (_lock)
        {
            _readings.Add(reading);
            _logger.LogInformation("Added meter reading: {ReadingValue} at {Timestamp}",
                reading.ReadingValue, reading.Timestamp);
        }
    }

    /// <summary>
    /// Retrieves all meter readings from storage.
    /// Returns a copy to prevent external modification.
    /// Thread-safe operation.
    /// </summary>
    /// <returns>List of all meter readings.</returns>
    public List<MeterReading> GetAllReadings()
    {
        lock (_lock)
        {
            _logger.LogInformation("Retrieved {Count} meter readings", _readings.Count);
            return new List<MeterReading>(_readings);
        }
    }
}
