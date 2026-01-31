# Native AOT

Native AOT is a feature that compiles .NET assemblies into a single native executable. By using the native executable the .NET runtime 
is not required to be installed on the target platform. Native AOT can significantly improve Lambda cold starts for .NET Lambda functions. 
This project enables Native AOT by setting the .NET `PublishAot` property in the .NET project file to `true`. The `StripSymbols` property is also
set to `true` to strip debugging symbols from the deployed executable to reduce the executable's size.

## Building Native AOT

When publishing with Native AOT the build OS and Architecture must match the target platform that the application will run. For AWS Lambda that target
platform is Amazon Linux 2023. The AWS tooling for Lambda like the AWS Toolkit for Visual Studio, .NET Global Tool Amazon.Lambda.Tools and SAM CLI will 
perform a container build using a .NET 10 Amazon Linux 2023 build image when `PublishAot` is set to `true`. This means **docker is a requirement**
when packaging .NET Native AOT Lambda functions on non-Amazon Linux 2023 build environments.

## Deploy
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