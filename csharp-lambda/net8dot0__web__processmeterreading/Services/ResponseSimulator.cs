using net8dot0__web__processmeterreading.Models;

namespace net8dot0__web__processmeterreading.Services;

/// <summary>
/// Service for simulating random success/failure responses.
/// 50% success, 25% 422 error, 25% 503 error.
/// </summary>
public class ResponseSimulator
{
    // Random number generator for simulation
    private readonly Random _random = new();

    // Logger for tracking simulation results
    private readonly ILogger<ResponseSimulator> _logger;

    /// <summary>
    /// Initializes the simulator service.
    /// </summary>
    /// <param name="logger">Logger instance for logging simulation results.</param>
    public ResponseSimulator(ILogger<ResponseSimulator> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Simulates a meter reading processing attempt.
    /// Returns a SimulationResult indicating success or failure.
    /// Distribution: 50% success (200), 25% 422, 25% 503.
    /// </summary>
    /// <returns>Simulation result with status code and message.</returns>
    public SimulationResult Simulate()
    {
        // Generate random number between 0-99
        int randomValue = _random.Next(100);

        SimulationResult result;

        if (randomValue < 50)
        {
            // 0-49: Success (50%)
            result = new SimulationResult(
                IsSuccess: true,
                StatusCode: 200,
                Message: "Meter reading processed successfully"
            );
            _logger.LogInformation("Simulation result: Success (200) - Random value: {RandomValue}", randomValue);
        }
        else if (randomValue < 75)
        {
            // 50-74: Unprocessable Entity (25%)
            result = new SimulationResult(
                IsSuccess: false,
                StatusCode: 422,
                Message: "Unable to process meter reading at this time"
            );
            _logger.LogWarning("Simulation result: Unprocessable Entity (422) - Random value: {RandomValue}", randomValue);
        }
        else
        {
            // 75-99: Service Unavailable (25%)
            result = new SimulationResult(
                IsSuccess: false,
                StatusCode: 503,
                Message: "Meter reading service temporarily unavailable"
            );
            _logger.LogWarning("Simulation result: Service Unavailable (503) - Random value: {RandomValue}", randomValue);
        }

        return result;
    }
}
