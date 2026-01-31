## CONTEXT:
- The dotnet10__al2023__lambda__native__aot project is a .NET 10 Lambda Native AOT function.
- I created the Lambda Native AOT function by following this instruction https://docs.aws.amazon.com/lambda/latest/dg/dotnet-native-aot.html 
- General information about .NET Native AOT https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/ - but this info is not directly related to Lambda Native AOT function. 
- .NET Native AOT supports Observability and telemetry https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/diagnostics. It is mentioned that the Native AOT runtime supports EventPipe, which is the base layer used by many logging and tracing libraries. You can interface with EventPipe directly through APIs like EventSource.WriteEvent or you can use libraries built on top, like OpenTelemetry. EventPipe support also allows .NET diagnostic tools like dotnet-trace, dotnet-counters, and dotnet-monitor to work seamlessly with Native AOT or full .NET runtime applications. EventPipe is an optional component in Native AOT. To include EventPipe support, set the EventSourceSupport MSBuild property to true. Native AOT provides partial support for some well-known event providers https://learn.microsoft.com/en-us/dotnet/core/diagnostics/well-known-event-providers 
- For a General .NET Native AOT app (not specific to Lambda Native AOT function) this URL https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs provides example of how to add distributed tracing instrumentation using openTelemetry-dotnet SDK 
- It is important to note that the recommendation is that "AWS doesn't recommend using layers to manage dependencies for Lambda functions written in .NET. This is because .NET is a compiled language, and your functions still have to manually load any shared assemblies into memory during the Init phase, which can increase cold start times. Using layers not only complicates the deployment process, but also prevents you from taking advantage of built-in compiler optimizations. To use external dependencies with your .NET handlers, include them directly in your deployment package at compile time. By doing so, it simplifies the deployment process and also take advantage of built-in .NET compiler optimizations. For an example of how to import and use dependencies like NuGet packages in your function." https://docs.aws.amazon.com/lambda/latest/dg/dotnet-layers.html

## TASK:
- Firstly, update the dotnet10__al2023__lambda__native__aot lambda function with the following requirements:
  - Add a HTTP GET endpoint that return a random number between 1 and 1000 in the response body as json.
  - This HTTP GET endpoint has a random chance of 34% successful, 33% unsuccessful with 4XX error, and 33% unsuccessful with 5XX error. 
  - Keep the code as simple as possible. 
  - Please propose and provide testing strategy
- Secondly, how do I re-bundle my Lambda function from ".NET 10 (C#/F#/PowerShell)" to "Amazon Linux 2023" but under the hood the app is still a .NET 10 Lambda Native AOT app just that it is repackaged into a Amazon Linux 2023 runtime when deployed to AWS Lambda.
  - Keep the explanation as concise as possible. 
- Finally, my overarching goal is to add tracing capability to my .NET 10 Lambda Native AOT function.
  - First, I want to try enabling dd-trace-dotnet dependency for distributed tracing (thereby sending the spans telemetry to Datadog) with my .NET handler via NuGet approach
  - Keep the steps as simple as possible. 
  - If dd-trace-dotnet doesn't provide me with distributed tracing observability, then I want to enable opentelemetry-dotnet dependency for distributed tracing (thereby sending the spans telemetry to Datadog) with .NET handler via NuGet approach.
- Ask any questions you want to clarify before doing the research. Think hard.

## USE CONTEXT7
- use library id /aws/aws-lambda-dotnet
- use library id /websites/aws_amazon_lambda_dg?topic=csharp
- use library id /websites/aws_amazon_lambda_dg?topic=dotnet
- use library id /awsdocs/aws-lambda-developer-guide?topic=csharp&tokens=2000
- use library id /datadog/dd-trace-dotnet?topic=manual&tokens=5000
- use library id /datadog/dd-trace-dotnet?topic=nuget&tokens=5000
- use library id /open-telemetry/opentelemetry-dotnet?topic=nuget

## Implementation should consider:
- **Documentation**: Include setup, deployment, verification, and cleanup steps in README.md
- **Git Ignore**: Create a .gitignore to avoid committing common .NET files or output to Git repo if .gitignore doesn't exist
- **Code Best Practices**: Reference https://docs.aws.amazon.com/lambda/latest/dg/csharp-handler.html#csharp-best-practices
- **PII and Sensitive Data**: Do be mindful that I will be committing the .NET project to a public Github repo so do NOT commit private key or secrets.
- **Simplicity**: Keep the .NET project really simple

## OTHER CONSIDERATIONS:
- My computer is a Macbook ARM64 M4 chip so your instructions need to relevant to my machine if necessary
- Explain the steps you would take in concise and beginner-friendly language
- Write the research on performing the task
- Save the research to `2-RESEARCH.md`