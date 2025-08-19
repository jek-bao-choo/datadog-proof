# Configure IIS and .NET Framework 4.8.1 for Windows Server 2022
# This script installs IIS, ASP.NET support, and .NET Framework 4.8.1

Write-Host "Starting IIS and .NET Framework 4.8.1 configuration..." -ForegroundColor Green

# Install IIS with ASP.NET support
Write-Host "Installing IIS with ASP.NET support..." -ForegroundColor Yellow
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-HttpErrors, IIS-HttpLogging, IIS-RequestFiltering, IIS-StaticContent, IIS-DefaultDocument, IIS-DirectoryBrowsing, IIS-ASPNET45 -All

# Install .NET Framework 4.8.1 (if not already installed)
Write-Host "Downloading and installing .NET Framework 4.8.1..." -ForegroundColor Yellow
$dotnetUrl = "https://go.microsoft.com/fwlink/?linkid=2203306"
$dotnetPath = "C:\temp\ndp481-web.exe"
New-Item -ItemType Directory -Path "C:\temp" -Force

try {
    Invoke-WebRequest -Uri $dotnetUrl -OutFile $dotnetPath -UseBasicParsing
    Write-Host "Installing .NET Framework 4.8.1..." -ForegroundColor Yellow
    Start-Process -FilePath $dotnetPath -ArgumentList "/quiet" -Wait
    Write-Host ".NET Framework 4.8.1 installation completed." -ForegroundColor Green
} catch {
    Write-Host "Error installing .NET Framework: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ".NET Framework may already be installed." -ForegroundColor Yellow
}

# Import Web Administration module
Write-Host "Importing WebAdministration module..." -ForegroundColor Yellow
Import-Module WebAdministration

# Create application pool
Write-Host "Creating DotNetApp application pool..." -ForegroundColor Yellow
New-WebAppPool -Name "DotNetApp" -Force
Set-ItemProperty -Path "IIS:\AppPools\DotNetApp" -Name "managedRuntimeVersion" -Value "v4.0"

# Remove default website if it exists
Write-Host "Removing default website..." -ForegroundColor Yellow
try {
    Remove-Website -Name "Default Web Site" -ErrorAction SilentlyContinue
} catch {
    Write-Host "Default website may not exist or already removed." -ForegroundColor Yellow
}

# Create application directory
Write-Host "Creating application directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "C:\inetpub\wwwroot\DotNetApp" -Force

# Create new website
Write-Host "Creating DotNetApp website..." -ForegroundColor Yellow
New-Website -Name "DotNetApp" -Port 80 -PhysicalPath "C:\inetpub\wwwroot\DotNetApp" -ApplicationPool "DotNetApp"

Write-Host "IIS and .NET Framework configuration completed!" -ForegroundColor Green