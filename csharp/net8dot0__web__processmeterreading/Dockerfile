# Build stage with Native AOT
FROM public.ecr.aws/sam/build-dotnet8:latest AS build
WORKDIR /src

# Copy project files
COPY *.csproj ./
RUN dotnet restore

# Copy source code
COPY . ./

# Publish with Native AOT
RUN dotnet publish -c Release -r linux-x64 \
    --self-contained true \
    -o /app/publish \
    -p:PublishAot=true \
    -p:StripSymbols=true

# Runtime stage with Lambda Web Adapter
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1
WORKDIR /var/task

# Copy published application
COPY --from=build /app/publish .

# Lambda environment configuration
ENV PORT=8080
ENV AWS_LWA_INVOKE_MODE=response_stream

# Run the application
CMD ["./net8dot0__web__processmeterreading"]
