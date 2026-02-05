# Native AOT

Native AOT is a feature that compiles .NET assemblies into a single native executable. By using the native executable the .NET runtime 
is not required to be installed on the target platform. Native AOT can significantly improve Lambda cold starts for .NET Lambda functions. 
This project enables Native AOT by setting the .NET `PublishAot` property in the .NET project file to `true`. The `StripSymbols` property is also
set to `true` to strip debugging symbols from the deployed executable to reduce the executable's size.

## Basic: Building Native AOT

When publishing with Native AOT the build OS and Architecture must match the target platform that the application will run. For AWS Lambda that target
platform is Amazon Linux 2023. The AWS tooling for Lambda like the AWS Toolkit for Visual Studio, .NET Global Tool Amazon.Lambda.Tools and SAM CLI will 
perform a container build using a .NET 10 Amazon Linux 2023 build image when `PublishAot` is set to `true`. This means **docker is a requirement**
when packaging .NET Native AOT Lambda functions on non-Amazon Linux 2023 build environments.

## Basic: Deploy
```bash
dotnet lambda deploy-function jek_dotnet10_al2023_native_aot --function-runtime provided.al2023 --function-architecture arm64 --function-handler bootstrap
```

Test it (use proper APIGatewayProxyRequest payload)
```bash
dotnet lambda invoke-function jek_dotnet10_al2023_native_aot --payload '{"httpMethod":"GET","path":"/","headers":{},"body":null}'
```

Clean up
```bash
dotnet lambda delete-function jek_dotnet10_al2023_native_aot
```

---

## Task 1: HTTP GET Endpoint (COMPLETED)

### What Was Implemented
Added HTTP GET endpoint that returns random responses:
- 34% chance: 200 OK with random number (1-1000)
- 33% chance: 400 Bad Request (client error)
- 33% chance: 500 Internal Server Error

### Changes Made
1. Added `Amazon.Lambda.APIGatewayEvents` package (v2.7.3)
2. Created response models: `SuccessResponse` and `ErrorResponse`
3. Updated handler to use `APIGatewayProxyRequest` and `APIGatewayProxyResponse`
4. Implemented random number generation with error logic

### Response Examples

**Success (200 OK):**
```json
{
  "randomNumber": 456
}
```

**Client Error (400 Bad Request):**
```json
{
  "error": "Client Error",
  "message": "Bad Request - Invalid input parameters"
}
```

**Server Error (500 Internal Server Error):**
```json
{
  "error": "Server Error",
  "message": "Internal Server Error - Service temporarily unavailable"
}
```

### Testing
Deploy and invoke the function multiple times to verify the ~34/33/33 distribution:
```bash
# Deploy
dotnet lambda deploy-function jek_dotnet10_al2023_native_aot

# Invoke multiple times to see different responses
dotnet lambda invoke-function jek_dotnet10_al2023_native_aot --payload '{"httpMethod":"GET","path":"/","headers":{},"body":null}'
```

---

## Task 2: Amazon Linux 2023 Runtime (COMPLETED)

### Configuration Status
The Lambda function is configured to deploy as Amazon Linux 2023 custom runtime with Native AOT compilation.

### How It Works
- **Native AOT:** `<PublishAot>true</PublishAot>` compiles C# to native ARM64 machine code
- **Runtime:** `provided.al2023` uses custom runtime on Amazon Linux 2023
- **Architecture:** `arm64` targets AWS Graviton processors
- **Result:** Standalone executable with faster cold starts, no .NET runtime needed

### Build Process
```bash
dotnet publish -c Release
```
This creates a native Linux ARM64 executable that runs directly on AL2023.

### Key Configuration
- **Handler:** `bootstrap` (required for provided.al2023 runtime)
- **Assembly Name:** `<AssemblyName>bootstrap</AssemblyName>` in .csproj
- **Globalization:** `<InvariantGlobalization>true</InvariantGlobalization>` (avoids ICU dependencies)
- **JSON Serialization:** Source-generated context for AOT compatibility

