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

# Install Lambda Web Adapter extension
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

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
