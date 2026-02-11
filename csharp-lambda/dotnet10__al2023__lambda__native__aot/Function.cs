using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.Lambda.APIGatewayEvents;
using System.Text.Json.Serialization;
// OpenTelemetry Core API: Essential for creating tracers and spans
using OpenTelemetry;
// OpenTelemetry Tracing API: Essential for configuring the trace provider
using OpenTelemetry.Trace;
// AWS Lambda Instrumentation: Essential for automatically tracing Lambda function invocations and context
using OpenTelemetry.Instrumentation.AWSLambda;
// OpenTelemetry Exporter: Essential for defining how and where to export traces (e.g., OTLP)
using OpenTelemetry.Exporter;
// OpenTelemetry Resources: Essential for defining service metadata (service name, version, env)
using OpenTelemetry.Resources;

namespace dotnet10__al2023__lambda__native__aot;

public class Function
{
    /// <summary>
    /// The main entry point for the Lambda function. The main function is called once during the Lambda init phase. It
    /// initializes the .NET Lambda runtime client passing in the function handler to invoke for each Lambda event and
    /// the JSON serializer to use for converting Lambda JSON format to the .NET types.
    /// </summary>
    private static async Task Main()
    {
        // Initialize the TracerProvider: Essential for collecting and exporting telemetry data
        // Configuration is now loaded from standard OTEL_* environment variables
        var tracerProvider = Sdk.CreateTracerProviderBuilder()
            // Add AWS Lambda Configurations: Essential for capturing Lambda-specific attributes (Request ID, ARN, etc.)
            .AddAWSLambdaConfigurations()
            // Add HTTP Client Instrumentation: Essential for tracing outgoing HTTP requests to other services
            .AddHttpClientInstrumentation()
            // Add OTLP Exporter: Essential for sending the collected traces to Datadog's OTLP endpoint
            // Endpoint, Protocol, and Headers are configured via environment variables
            .AddOtlpExporter()
            .Build();

        Func<APIGatewayProxyRequest, ILambdaContext, APIGatewayProxyResponse> handler = 
            (request, context) => 
            {
                // AWSLambdaWrapper.Trace: Essential for wrapping the handler execution in a trace span
                var response = AWSLambdaWrapper.Trace(tracerProvider, FunctionHandler, request, context);
                // ForceFlush: CRITICAL for Lambda. Forces the export of traces before the execution environment freezes.
                // Without this, traces buffered in memory may be lost when the Lambda function pauses or shuts down.
                tracerProvider.ForceFlush();
                return response;
            };

        await LambdaBootstrapBuilder.Create(handler, new SourceGeneratorLambdaJsonSerializer<LambdaFunctionJsonSerializerContext>())
            .Build()
            .RunAsync();

        // Dispose: Essential for properly shutting down the TracerProvider and flushing any remaining spans on shutdown
        tracerProvider.Dispose();
    }

    /// <summary>
    /// Lambda function handler that returns a random number with probabilistic error responses.
    /// - 34% chance: Returns 200 OK with random number (1-1000)
    /// - 33% chance: Returns 400 Bad Request (client error)
    /// - 33% chance: Returns 500 Internal Server Error
    /// </summary>
    /// <param name="request">API Gateway proxy request</param>
    /// <param name="context">Lambda execution context</param>
    /// <returns>API Gateway proxy response with JSON body</returns>
    public static APIGatewayProxyResponse FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        // Generate random number between 1 and 1000
        var randomNumber = Random.Shared.Next(1, 1001);

        // Generate error chance (1-100)
        var errorChance = Random.Shared.Next(1, 101);

        // 34% success (1-34)
        if (errorChance <= 34)
        {
            var successResponse = new SuccessResponse { RandomNumber = randomNumber };
            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = System.Text.Json.JsonSerializer.Serialize(successResponse, LambdaFunctionJsonSerializerContext.Default.SuccessResponse),
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };
        }

        // 33% client error (35-67)
        if (errorChance <= 67)
        {
            var errorResponse = new ErrorResponse
            {
                Error = "Client Error",
                Message = "Bad Request - Invalid input parameters"
            };
            return new APIGatewayProxyResponse
            {
                StatusCode = 400,
                Body = System.Text.Json.JsonSerializer.Serialize(errorResponse, LambdaFunctionJsonSerializerContext.Default.ErrorResponse),
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };
        }

        // 33% server error (68-100)
        var serverErrorResponse = new ErrorResponse
        {
            Error = "Server Error",
            Message = "Internal Server Error - Service temporarily unavailable"
        };
        return new APIGatewayProxyResponse
        {
            StatusCode = 500,
            Body = System.Text.Json.JsonSerializer.Serialize(serverErrorResponse, LambdaFunctionJsonSerializerContext.Default.ErrorResponse),
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }
}

// Response model for successful requests
public class SuccessResponse
{
    public int RandomNumber { get; set; }
}

// Response model for error requests
public class ErrorResponse
{
    public string Error { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// This class is used to register the input event and return type for the FunctionHandler method with the System.Text.Json source generator.
/// There must be a JsonSerializable attribute for each type used as the input and return type or a runtime error will occur
/// from the JSON serializer unable to find the serialization information for unknown types.
/// </summary>
[JsonSerializable(typeof(string))]
[JsonSerializable(typeof(APIGatewayProxyRequest))]
[JsonSerializable(typeof(APIGatewayProxyResponse))]
[JsonSerializable(typeof(SuccessResponse))]
[JsonSerializable(typeof(ErrorResponse))]
public partial class LambdaFunctionJsonSerializerContext : JsonSerializerContext
{
    // By using this partial class derived from JsonSerializerContext, we can generate reflection free JSON Serializer code at compile time
    // which can deserialize our class and properties. However, we must attribute this class to tell it what types to generate serialization code for.
    // See https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-source-generation
}