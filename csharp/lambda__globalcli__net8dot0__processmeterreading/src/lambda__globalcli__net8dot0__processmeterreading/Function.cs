using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Text.Json;
using lambda__globalcli__net8dot0__processmeterreading.Models;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace lambda__globalcli__net8dot0__processmeterreading;

public class Function
{
    // In-memory storage for meter readings (resets on cold starts)
    private static readonly List<MeterReading> _readings = new();
    private static readonly object _lock = new();

    // JSON serialization options for camelCase
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    // CORS headers to include in all responses
    private static readonly Dictionary<string, string> _corsHeaders = new()
    {
        { "Content-Type", "application/json" },
        { "Access-Control-Allow-Origin", "*" },
        { "Access-Control-Allow-Methods", "GET, POST, OPTIONS" },
        { "Access-Control-Allow-Headers", "Content-Type" }
    };

    // Static constructor to initialize dummy data
    static Function()
    {
        // Initialize with dummy meter reading (4-digit random number)
        var random = new Random();
        var dummyReading = new MeterReading
        {
            Value = random.Next(1000, 10000), // 4-digit number
            Timestamp = DateTime.UtcNow.ToString("o") // ISO 8601 format
        };

        _readings.Add(dummyReading);
    }

    /// <summary>
    /// Main Lambda handler for API Gateway REST API or HTTP API v1.0 payload format
    /// </summary>
    public APIGatewayProxyResponse Handler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            context.Logger.LogInformation($"Processing API Gateway v1.0 request - Method: {request.HttpMethod}");

            // Normalize HTTP method (handle case sensitivity and null)
            var httpMethod = request.HttpMethod?.ToUpper() ?? "UNKNOWN";

            // Route based on HTTP method
            return httpMethod switch
            {
                "GET" => HandleGetRequest(context),
                "POST" => HandlePostRequest(request.Body, context),
                "OPTIONS" => HandleOptionsRequest(),
                _ => CreateErrorResponse(405, $"Method not allowed. Received: '{httpMethod}'. Supported methods: GET, POST, OPTIONS")
            };
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Unexpected error: {ex.Message}");
            return CreateErrorResponse(500, "An unexpected error occurred", ex.Message);
        }
    }

    /// <summary>
    /// Handler for API Gateway HTTP API v2.0 payload format
    /// </summary>
    public APIGatewayHttpApiV2ProxyResponse HandlerV2(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
    {
        try
        {
            context.Logger.LogInformation($"Processing API Gateway v2.0 request - Method: {request.RequestContext.Http.Method}");

            // Get HTTP method from v2.0 request structure
            var httpMethod = request.RequestContext.Http.Method?.ToUpper() ?? "UNKNOWN";

            // Route based on HTTP method
            var response = httpMethod switch
            {
                "GET" => HandleGetRequest(context),
                "POST" => HandlePostRequest(request.Body, context),
                "OPTIONS" => HandleOptionsRequest(),
                _ => CreateErrorResponse(405, $"Method not allowed. Received: '{httpMethod}'. Supported methods: GET, POST, OPTIONS")
            };

            // Convert v1.0 response to v2.0 format
            return new APIGatewayHttpApiV2ProxyResponse
            {
                StatusCode = response.StatusCode,
                Body = response.Body,
                Headers = response.Headers,
                IsBase64Encoded = response.IsBase64Encoded
            };
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Unexpected error: {ex.Message}");
            var errorResponse = CreateErrorResponse(500, "An unexpected error occurred", ex.Message);
            return new APIGatewayHttpApiV2ProxyResponse
            {
                StatusCode = errorResponse.StatusCode,
                Body = errorResponse.Body,
                Headers = errorResponse.Headers
            };
        }
    }

    /// <summary>
    /// Handle GET request - Returns all meter readings
    /// </summary>
    private APIGatewayProxyResponse HandleGetRequest(ILambdaContext context)
    {
        List<MeterReading> readingsCopy;

        // Thread-safe read of the readings list
        lock (_lock)
        {
            readingsCopy = new List<MeterReading>(_readings);
        }

        context.Logger.LogInformation($"Returning {readingsCopy.Count} meter readings");

        var json = JsonSerializer.Serialize(readingsCopy, _jsonOptions);

        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = json,
            Headers = _corsHeaders
        };
    }

    /// <summary>
    /// Handle POST request - Submit new meter reading with random success/failure
    /// </summary>
    private APIGatewayProxyResponse HandlePostRequest(string? requestBody, ILambdaContext context)
    {
        try
        {
            // Parse request body
            if (string.IsNullOrEmpty(requestBody))
            {
                return CreateErrorResponse(400, "Request body is required");
            }

            var meterRequest = JsonSerializer.Deserialize<MeterReadingRequest>(requestBody, _jsonOptions);

            if (meterRequest == null)
            {
                return CreateErrorResponse(400, "Invalid request body format");
            }

            // Validate meter reading value
            if (meterRequest.ReadingValue < 1 || meterRequest.ReadingValue > 999999)
            {
                return CreateErrorResponse(422, "Meter reading value must be between 1 and 999999");
            }

            context.Logger.LogInformation($"Processing meter reading: {meterRequest.ReadingValue}");

            // Generate random outcome (0-99)
            var random = new Random();
            var outcome = random.Next(100);

            context.Logger.LogInformation($"Random outcome: {outcome}");

            // 50% success (0-49)
            if (outcome < 50)
            {
                return HandleSuccessfulSubmission(meterRequest.ReadingValue, context);
            }
            // 25% 4XX error (50-74)
            else if (outcome < 75)
            {
                return HandleClientError(random);
            }
            // 25% 5XX error (75-99)
            else
            {
                return HandleServerError(random);
            }
        }
        catch (JsonException ex)
        {
            context.Logger.LogError($"JSON parsing error: {ex.Message}");
            return CreateErrorResponse(400, "Invalid JSON format", ex.Message);
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Error processing POST request: {ex.Message}");
            return CreateErrorResponse(500, "An error occurred processing your request", ex.Message);
        }
    }

    /// <summary>
    /// Handle successful meter reading submission
    /// </summary>
    private APIGatewayProxyResponse HandleSuccessfulSubmission(int readingValue, ILambdaContext context)
    {
        var newReading = new MeterReading
        {
            Value = readingValue,
            Timestamp = DateTime.UtcNow.ToString("o") // ISO 8601 format
        };

        // Thread-safe write to the readings list
        lock (_lock)
        {
            _readings.Add(newReading);
        }

        context.Logger.LogInformation($"Successfully added meter reading: {readingValue}");

        // Return all readings including the new one
        List<MeterReading> allReadings;
        lock (_lock)
        {
            allReadings = new List<MeterReading>(_readings);
        }

        var json = JsonSerializer.Serialize(allReadings, _jsonOptions);

        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = json,
            Headers = _corsHeaders
        };
    }

    /// <summary>
    /// Handle 4XX client errors (randomly choose between 400 and 422)
    /// </summary>
    private APIGatewayProxyResponse HandleClientError(Random random)
    {
        var errorType = random.Next(2); // 0 or 1

        return errorType == 0
            ? CreateErrorResponse(400, "Invalid meter reading format", "The submitted data format is incorrect")
            : CreateErrorResponse(422, "Meter reading value out of acceptable range", "The reading does not meet validation criteria");
    }

    /// <summary>
    /// Handle 5XX server errors (randomly choose between 500 and 503)
    /// </summary>
    private APIGatewayProxyResponse HandleServerError(Random random)
    {
        var errorType = random.Next(2); // 0 or 1

        return errorType == 0
            ? CreateErrorResponse(500, "Database connection failure. Please try again later.", "Internal server error occurred")
            : CreateErrorResponse(503, "Service temporarily overloaded. Please retry in a few moments.", "The service is currently unavailable");
    }

    /// <summary>
    /// Handle OPTIONS request (CORS preflight)
    /// </summary>
    private APIGatewayProxyResponse HandleOptionsRequest()
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = string.Empty,
            Headers = _corsHeaders
        };
    }

    /// <summary>
    /// Create an error response with specified status code and message
    /// </summary>
    private APIGatewayProxyResponse CreateErrorResponse(int statusCode, string errorMessage, string? details = null)
    {
        var errorResponse = new ErrorResponse
        {
            Error = errorMessage,
            StatusCode = statusCode,
            Details = details
        };

        var json = JsonSerializer.Serialize(errorResponse, _jsonOptions);

        return new APIGatewayProxyResponse
        {
            StatusCode = statusCode,
            Body = json,
            Headers = _corsHeaders
        };
    }
}
