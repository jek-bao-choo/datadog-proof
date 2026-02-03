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
dotnet lambda deploy-function
```

and indicate the lambda function name as `jek_dotnet10_al2023_native_aot`

Test it
```bash
dotnet lambda invoke-function jek_dotnet10_al2023_native_aot --payload "hello world"
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
dotnet lambda deploy-function

# Invoke multiple times to see different responses
dotnet lambda invoke-function jek_dotnet10_al2023_native_aot --payload '{}'
```

