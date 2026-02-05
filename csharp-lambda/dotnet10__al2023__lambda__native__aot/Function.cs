using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.Lambda.APIGatewayEvents;
using System.Text.Json.Serialization;

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
        Func<APIGatewayProxyRequest, ILambdaContext, APIGatewayProxyResponse> handler = FunctionHandler;
        await LambdaBootstrapBuilder.Create(handler, new SourceGeneratorLambdaJsonSerializer<LambdaFunctionJsonSerializerContext>())
            .Build()
            .RunAsync();
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