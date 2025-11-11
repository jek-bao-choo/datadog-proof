using net8dot0__web__processmeterreading.Models;
using net8dot0__web__processmeterreading.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services for dependency injection
builder.Services.AddSingleton<MeterReadingService>();
builder.Services.AddSingleton<ResponseSimulator>();

var app = builder.Build();

// Configure logging
var logger = app.Logger;

// API Endpoints

// POST /api/meter-readings - Submit a meter reading
app.MapPost("/api/meter-readings", (
    MeterReadingRequest request,
    MeterReadingService service,
    ResponseSimulator simulator,
    ILogger<Program> logger) =>
{
    // Validate input
    if (request.ReadingValue < 1 || request.ReadingValue > 999999)
    {
        logger.LogError("Invalid meter reading value: {ReadingValue}", request.ReadingValue);
        return Results.BadRequest(new ErrorResponse(
            Success: false,
            Error: "Meter reading must be between 1 and 999999",
            Code: 400
        ));
    }

    logger.LogInformation("Processing meter reading submission: {ReadingValue}", request.ReadingValue);

    // Simulate processing
    var simulationResult = simulator.Simulate();

    // Handle simulation result
    if (simulationResult.IsSuccess)
    {
        // Success path - add reading to storage
        var reading = new MeterReading(request.ReadingValue, DateTime.UtcNow);
        service.AddReading(reading);

        logger.LogInformation("Meter reading submitted successfully: {ReadingValue}", request.ReadingValue);

        return Results.Ok(new SuccessResponse(
            Success: true,
            Message: simulationResult.Message,
            Reading: reading
        ));
    }
    else if (simulationResult.StatusCode == 422)
    {
        // 422 Unprocessable Entity
        logger.LogWarning("Meter reading submission failed with 422: {ReadingValue}", request.ReadingValue);

        return Results.UnprocessableEntity(new ErrorResponse(
            Success: false,
            Error: simulationResult.Message,
            Code: 422
        ));
    }
    else // 503
    {
        // 503 Service Unavailable
        logger.LogWarning("Meter reading submission failed with 503: {ReadingValue}", request.ReadingValue);

        return Results.Json(
            new ErrorResponse(
                Success: false,
                Error: simulationResult.Message,
                Code: 503
            ),
            statusCode: 503
        );
    }
});

// GET /api/meter-readings - Retrieve all meter readings
app.MapGet("/api/meter-readings", (
    MeterReadingService service,
    ILogger<Program> logger) =>
{
    logger.LogInformation("Retrieving all meter readings");

    var readings = service.GetAllReadings();

    logger.LogInformation("Retrieved {Count} meter readings", readings.Count);

    return Results.Ok(readings);
});

// Application startup logging
logger.LogInformation("Meter Reading Processing API starting...");
logger.LogInformation("Endpoints available:");
logger.LogInformation("  POST /api/meter-readings - Submit a meter reading");
logger.LogInformation("  GET /api/meter-readings - Retrieve all meter readings");

app.Run();
