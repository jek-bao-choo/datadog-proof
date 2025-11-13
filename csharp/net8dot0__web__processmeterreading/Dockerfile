# Build stage with Native AOT
FROM public.ecr.aws/sam/build-dotnet8:latest AS build
WORKDIR /src

# Copy project files
COPY *.csproj ./
RUN dotnet restore

# Copy source code
COPY . ./

# Publish with Native AOT for ARM64
RUN dotnet publish -c Release -r linux-arm64 \
    --self-contained true \
    -o /app/publish \
    -p:PublishAot=true \
    -p:StripSymbols=true

# Set executable permissions in build stage
RUN chmod +x /app/publish/net8dot0__web__processmeterreading

# Runtime stage - Use Amazon Linux 2023 with Lambda Web Adapter
FROM public.ecr.aws/lambda/provided:al2023

# ========================================
# DATADOG INSTRUMENTATION - START
# ========================================

# Step 1: Install Datadog Lambda Extension
# IMPORTANT: Check https://gallery.ecr.aws/datadog/lambda-extension for latest version
# Current latest version: 88
#
# Architecture selection:
# - For ARM64 Lambda: Use version tags that support arm64 (e.g., "88", "latest")
# - The multi-arch tags automatically pull the correct architecture
#
# We're using "88" which supports both x86_64 and arm64 architectures
COPY --from=public.ecr.aws/datadog/lambda-extension:88 /opt/extensions/ /opt/extensions/

# Step 2: Install Lambda Web Adapter extension
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

# Step 3: Install system dependencies for .NET tracer
RUN dnf install -y wget tar gzip && dnf clean all

# Step 4: Download and install Datadog .NET APM tracer
# Current latest version: 3.8.0
# Variant selection:
# - MUSL variant: For Alpine Linux, Amazon Linux 2023 (use this one)
# - GLIBC variant: For standard Linux distributions
#
# Check https://github.com/DataDog/dd-trace-dotnet/releases for the latest version
RUN TRACER_VERSION=3.30.0 && \
    wget -q https://github.com/DataDog/dd-trace-dotnet/releases/download/v${TRACER_VERSION}/datadog-dotnet-apm-${TRACER_VERSION}-musl.tar.gz -O /tmp/datadog-apm.tar.gz && \
    mkdir -p /opt/datadog && \
    tar -xzf /tmp/datadog-apm.tar.gz -C /opt/datadog && \
    rm /tmp/datadog-apm.tar.gz

ENV AWS_LAMBDA_EXEC_WRAPPER /opt/datadog_wrapper

# Step 5: Set up CLR profiling for automatic instrumentation
# These environment variables enable the Datadog .NET APM tracer to automatically
# instrument your .NET application using the CLR Profiling API
ENV CORECLR_ENABLE_PROFILING=1
ENV CORECLR_PROFILER={846F5F1C-F9AE-4B07-969E-05C26BC060D8}
ENV CORECLR_PROFILER_PATH=/opt/datadog/Datadog.Trace.ClrProfiler.Native.so
ENV DD_DOTNET_TRACER_HOME=/opt/datadog

# Step 6: Configure Datadog service name and environment
# Update these values to match your service
ENV DD_SERVICE=jek-meter-reading-api
ENV DD_ENV=development
ENV DD_VERSION=1.0.0

# ========================================
# DATADOG INSTRUMENTATION - END
# ========================================


# Copy published application with permissions already set
COPY --from=build /app/publish /var/task/

# Lambda environment configuration
ENV PORT=8080
ENV ASPNETCORE_URLS=http://+:8080

# Create bootstrap script that Lambda expects
RUN echo '#!/bin/sh' > /var/runtime/bootstrap && \
    echo 'cd /var/task' >> /var/runtime/bootstrap && \
    echo 'exec ./net8dot0__web__processmeterreading' >> /var/runtime/bootstrap && \
    chmod +x /var/runtime/bootstrap
