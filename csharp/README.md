- Use the dotnet cli to create a scaffold app. After which, use Claude to build up the app.

# .NET Development Setup Guide

This guide provides comprehensive instructions for setting up a .NET development environment and creating API projects using different approaches.

## Prerequisites

### .NET SDK Installation

1. Download the .NET SDK:
   - For .NET 8 (recommended): https://dotnet.microsoft.com/en-us/download/dotnet/8.0
   - For .NET 6 (alternative): https://dotnet.microsoft.com/en-us/download/dotnet/6.0

2. Verify your installation by running:
   ```
   dotnet --version
   ```

3. You use a global.json file to "pin" a project folder to a specific .NET SDK version.
    ```
    dotnet --list-sdks
    ```

    You'll get a list like this:

    ```
    6.0.408 [/usr/local/share/dotnet/sdk]
    7.0.306 [/usr/local/share/dotnet/sdk]
    8.0.100 [/usr/local/share/dotnet/sdk]
    ```

    Create a global.json File: Navigate to the root directory of your project in the Terminal. Run the following command, replacing <version_number> with the version you want to use from your list (e.g., 7.0.306).

    ```
    dotnet new globaljson --sdk-version <version_number>
    ```

    For example:

    ```
    dotnet new globaljson --sdk-version 7.0.306
    ```

    This creates a global.json file in the project folder. Now, any dotnet command you run in this directory (or any sub-directory) will automatically use the exact SDK version you specified.

4. For a complete reference of dotnet commands, visit:
   https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet

### Development Environment Setup

1. Install Visual Studio Code (VSCode)
2. Install the C# extension in VSCode

## Creating a New API Project

For detailed information about available project templates and `dotnet new` commands, visit:
https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new

You can choose between two main approaches for building APIs in .NET:

### 1. Minimal APIs

Minimal APIs provide a streamlined approach ideal for microservices and small applications. They offer a simplified architecture with reduced boilerplate code.

**Documentation:** https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-8.0&tabs=visual-studio-code

> Note: The `webapiaot` template (for .NET 8+) includes Ahead-of-time compilation support and is limited to minimal APIs only.

#### Setup Steps:

1. Create a new project:
   ```
   dotnet new web --output jek-dotnet8-minimalapi-web --verbosity diag --dry-run
   ```
   > Note: The `web` template creates an empty ASP.NET Core project.

   Command line parameters:
   - `--output <OUTPUT_DIRECTORY>`: Specifies the output directory
   - `--verbosity <LEVEL>`: Sets logging detail (available in .NET 7+)

2. Navigate to the project directory:
   ```
   cd jek-dotnet8-minimalapi-web
   ```

3. Configure HTTPS certificate:
   ```
   dotnet dev-certs https --trust
   ```

4. Run the application:
   ```
   dotnet run
   ```

### 2. Controller-based APIs

Controller-based APIs follow a traditional approach with a more structured architecture, making them suitable for larger applications requiring extensive features and organization.

**Documentation:** https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0&tabs=visual-studio

#### Setup Steps:

1. Create a new project:
   ```
   dotnet new webapi --use-controllers --output jek-dotnet8-controllerbasedapi-webapi --verbosity diag --dry-run
   ```
   > Note: The `webapi` template creates a standard ASP.NET Core Web API.

2. Navigate to the project directory:
   ```
   cd jek-dotnet8-controllerbasedapi-webapi
   ```

3. Add Entity Framework Core In-Memory package:
   ```
   dotnet add package Microsoft.EntityFrameworkCore.InMemory
   ```

4. Open in VSCode:
   ```
   code -r ../jek-dotnet8-controllerbasedapi-webapi
   ```

5. Configure HTTPS certificate:
   ```
   dotnet dev-certs https --trust
   ```

6. Run the application:
   ```
   dotnet run --launch-profile https
   ```

## Common Operations

### Building the Application
```
dotnet build
```

### Publishing and Containerizing the Application

Ensure Docker is running before proceeding. For more information about .NET containerization, visit:
https://learn.microsoft.com/en-us/dotnet/core/docker/introduction#building-container-images

1. Build and publish the container:
   ```
   dotnet publish --framework net8.0 -t:PublishContainer --os linux --arch x64 /p:ContainerImageName=jchoo/jek-dotnet8-minimalapi-web /p:ContainerImageTag=1.0
   ```

2. Run the container:
   ```
   docker run --rm -d -p 8000:8080 jek-dotnet8-minimalapi-web
   ```

3. Test the deployment:
   ```
   curl -s http://localhost:8000
   ```

4. Stop the container:
   ```
   docker ps
   docker kill <container id>
   ```

### Publishing to Docker Hub
```
docker push jchoo/jek-dotnet8-minimalapi-web:1.0
```

## Kubernetes Deployment

### Option 1: Semi-automated Deployment

This approach uses a custom deployment configuration in a YAML file. You can use any Kubernetes cluster (local, EKS, AKS, GKE, etc.).

1. Install the Datadog Agent Chart

2. Deploy the application:
   ```
   kubectl apply -f deployment-miniapi.yaml
   ```

3. Set up port forwarding:
   ```
   kubectl port-forward deployment/jek-dotnet8-minimalapi-web 3009:8080
   ```

4. Test the deployment:
   ```
   # Test general endpoint
   curl http://localhost:3009

   # View deployment logs
   kubectl logs deployment/jek-dotnet8-minimalapi-web
   ```

### Option 2: Automated Instrumentation with Datadog Operator

```
helm repo add [datadog operator command here]
```

```
helm repo update
```

Check if a cert-manager is already installed by looking for cert-manager pods.
```
kubectl get pods -l app=cert-manager --all-namespaces
```

Follow the command in the Datadog doc for using Datadog Operator

## Additional Info (optional)

### The popular .NET Logging Frameworks

The main logging frameworks we'll encounter in the .NET world:

* **🥇 Serilog:** The modern go-to for many developers.
    * **Why it's popular:** Its "structured logging first" design is its biggest feature. It has a rich ecosystem of "sinks" (plugins that send logs to different destinations like files, databases, or cloud services) and "enrichers" (which add context like a Request ID to your logs).

* **🥈 NLog:** Another very popular, flexible, and high-performance framework.
    * **Why it's popular:** It's known for its flexibility, high performance, and extensive configuration options. It has been a solid choice for a long time and is still actively developed.

* **🥉 Microsoft.Extensions.Logging (MEL):** The built-in logging library.
    * **Why it's popular:** This is the logging *abstraction* provided by Microsoft in .NET Core and newer. It's not a full logging framework on its own but provides the `ILogger` interface. The key benefit is that you can write your code against this common interface, and then "plug in" a framework like Serilog or NLog to handle the actual log processing and output.

* **🏛️ log4net:** The "classic" logging framework.
    * **Why it's popular:** It's one of the oldest and most established frameworks (a port of the famous Java log4j). Many older, large enterprise applications use it. While still functional, most new projects tend to choose Serilog or NLog.

* **OpenTelemetry Logs:** A growing option if you want vendor-neutral pipelines; often used with MEL and exported to your backend.
