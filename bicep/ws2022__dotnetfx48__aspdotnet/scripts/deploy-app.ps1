# Deploy .NET Framework 4.8.1 Hello World Application
# This script creates a simple ASP.NET Web Forms application

Write-Host "Starting .NET Framework 4.8.1 application deployment..." -ForegroundColor Green

# Ensure application directory exists
$appPath = "C:\inetpub\wwwroot\DotNetApp"
New-Item -ItemType Directory -Path $appPath -Force

# Create Default.aspx with server information
Write-Host "Creating Default.aspx..." -ForegroundColor Yellow
$defaultAspx = @'
<%@ Page Language="C#" %>
<!DOCTYPE html>
<html>
<head>
    <title>.NET Framework 4.8.1 Hello World</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f8f9fa;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .info { 
            background: #e9ecef; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 5px;
            border-left: 4px solid #0d6efd;
        }
        h1 { 
            color: #0d6efd; 
            text-align: center;
            margin-bottom: 30px;
        }
        h2 { 
            color: #495057; 
            border-bottom: 2px solid #dee2e6;
            padding-bottom: 10px;
        }
        .success { 
            color: #198754; 
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Hello World from .NET Framework 4.8.1!</h1>
        
        <div class="info">
            <h2>Server Information</h2>
            <p><strong>Server Name:</strong> <%= Environment.MachineName %></p>
            <p><strong>.NET Framework Version:</strong> <%= Environment.Version.ToString() %></p>
            <p><strong>OS Version:</strong> <%= Environment.OSVersion.ToString() %></p>
            <p><strong>Current Time:</strong> <%= DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") %></p>
            <p><strong>Application Pool:</strong> <%= System.Web.Hosting.HostingEnvironment.ApplicationID %></p>
        </div>
        
        <div class="info">
            <h2>Status Check</h2>
            <p class="success">✅ IIS is running successfully!</p>
            <p class="success">✅ ASP.NET application is working!</p>
            <p class="success">✅ .NET Framework 4.8.1 is operational!</p>
        </div>

        <div class="footer">
            <p>Deployed via Azure Bicep Template | Windows Server 2022 + .NET Framework 4.8.1</p>
        </div>
    </div>
</body>
</html>
'@

$defaultAspx | Out-File -FilePath "$appPath\Default.aspx" -Encoding UTF8

# Create web.config for .NET Framework 4.8.1
Write-Host "Creating web.config..." -ForegroundColor Yellow
$webConfig = @'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.web>
    <compilation targetFramework="4.8.1" debug="false" />
    <httpRuntime targetFramework="4.8.1" />
    <customErrors mode="Off" />
  </system.web>
  <system.webServer>
    <defaultDocument>
      <files>
        <clear />
        <add value="Default.aspx" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>
'@

$webConfig | Out-File -FilePath "$appPath\web.config" -Encoding UTF8

# Restart IIS to apply changes
Write-Host "Restarting IIS to apply changes..." -ForegroundColor Yellow
iisreset

Write-Host ".NET Framework 4.8.1 application deployment completed!" -ForegroundColor Green
Write-Host "Application is available at: http://localhost/" -ForegroundColor Cyan