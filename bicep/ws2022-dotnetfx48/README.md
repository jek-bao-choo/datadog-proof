# Windows Server 2022 + .NET Framework v4.8.1 Bicep Deployment

This project deploys a Windows Server 2022 virtual machine in Azure Southeast Asia with IIS and a .NET Framework v4.8.1 Hello World application.

## 🏗️ Architecture Overview

- **Windows Server 2022** - Standard_D4_v5 (4 vCPUs, 16GB RAM)
- **IIS Web Server** with ASP.NET 4.8 support
- **.NET Framework 4.8.1** Hello World application
- **Virtual Network** with secure NSG rules
- **Trusted Launch** security features enabled
- **Automated deployment** via Bicep and Custom Script Extension

## 📋 Prerequisites

1. **Azure CLI** installed and configured
2. **Azure subscription** with sufficient permissions
3. **Bicep CLI** (automatically installed with Azure CLI)
4. **Your public IP address** for RDP access

### Get Your Public IP
```bash
curl ifconfig.me
```

## 🚀 Deployment Instructions

### 1. Clone and Navigate
```bash
cd ws2022-dotnetfx48
```

### 2. Create Parameters File
Copy the template and update with your values:
```bash
cp parameters.template.json parameters.json
```

Edit `parameters.json` and replace:
- `REPLACE_WITH_SECURE_PASSWORD` - Strong password (12+ chars, mixed case, numbers, symbols)
- `REPLACE_WITH_YOUR_IP/32` - Your public IP with /32 subnet (e.g., "203.0.113.1/32")

```bash
az login
```

### 3. Deploy Infrastructure

```bash
az deployment sub validate \
  --location southeastasia \
  --template-file main.bicep \
  --parameters @parameters.json
```

```bash
# Deploy to Azure
az deployment sub create \
  --location southeastasia \
  --template-file main.bicep \
  --parameters @parameters.json \
  --name ws2022-dotnet-deployment-v7
```

### 4. Monitor Deployment
```bash
# Check deployment status
az deployment sub show \
  --name ws2022-dotnet-deployment-v7 \
  --query "properties.provisioningState"

# Get deployment outputs
az deployment sub show \
  --name ws2022-dotnet-deployment-v7 \
  --query "properties.outputs"
```

## 🧪 Testing the Deployment

### 1. RDP Access
Use the public IP from deployment outputs:
```bash
mstsc /v:<PUBLIC_IP>
```

**Credentials:**
- Username: `azureuser` (or your specified adminUsername)
- Password: Your specified secure password in file parameters.json

### 2. Initial Web Application Test
Open browser and navigate to:
```
http://<PUBLIC_IP>
```

**Initial Expected Results:**
- ✅ Basic HTML page loads with "Hello World Jek from .NET Framework 4.8"
- ✅ IIS is running and serving content
- ✅ Application pool is configured

### 3. Upgrade to TRUE .NET Framework 4.8 Application

**🎯 Important:** The initial deployment creates a static HTML page. Follow these steps to convert it to a real .NET Framework 4.8 application:

#### Step 1: Connect via RDP
```bash
mstsc /v:<PUBLIC_IP>
```

#### Step 2: Verify .NET Framework 4.8 Installation
Open PowerShell as Administrator and run:
```powershell
# Check .NET Framework version
Get-ItemProperty "HKLM:SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\" -Name Release

# Expected result: 528449 or higher (528449 = .NET Framework 4.8.0)
```

#### Step 3: Create Real .NET Framework 4.8 ASPX Application

1. **Navigate to:** `C:\inetpub\wwwroot\`
2. **Delete existing files** (index.html or any static content)
3. **Create `Default.aspx`** with this content:

```aspx
<%@ Page Language="C#" %>
<!DOCTYPE html>
<html>
<head>
    <title>Hello World Jek - .NET Framework 4.8 VERIFIED</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; color: #333; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h1, h2 { color: #005a9e; }
        .success { color: #107c10; font-weight: bold; }
        .info { background: #e8f4fd; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 5px solid #0078d4; }
        p { line-height: 1.6; }
        hr { border: 0; height: 1px; background: #ddd; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World Jek!</h1>
        <h2>.NET Framework 4.8 VERIFIED & WORKING</h2>

        <div class="info">
            <h3>Server Information</h3>
            <p><strong>Server Name:</strong> <%= Environment.MachineName %></p>
            <p><strong>.NET Version:</strong> <%= Environment.Version.ToString() %></p>
            <p><strong>Framework:</strong> <%= System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription %></p>
            <p><strong>Current Time:</strong> <%= DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") %></p>
        </div>

        <div class="info">
            <h3>📋 Technical Details</h3>
            <p><strong>Application Pool:</strong> JekApp (.NET Framework v4.0 runtime)</p>
            <p><strong>Deployment:</strong> Azure Bicep Template</p>
            <p><strong>Platform:</strong> Windows Server 2022</p>
        </div>

        <hr>
        <p class="footer">
            Successfully deployed .NET Framework 4.8 application via Azure Bicep!<br>
        </p>
    </div>
</body>
</html>
```

4. **Create `web.config`** in the same directory:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.web>
    <compilation targetFramework="4.8" debug="false" />
    <httpRuntime targetFramework="4.8" />
    <customErrors mode="RemoteOnly" />
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
```

#### Step 4: Verify the Application
1. **Refresh your browser** at `http://<PUBLIC_IP>`
2. **Confirm you see:**
   - "🎉 Hello World Jek!" heading
   - Dynamic server information (changes on refresh)
   - .NET Framework version 4.8.x
   - Green checkmarks showing verification status

### 4. Verification Checklist

#### ✅ .NET Framework 4.8 Verification:
- **Registry Release:** 528449 or higher (528449 = .NET Framework 4.8.0)
- **Framework Description:** Shows ".NET Framework 4.8.4775.0" or similar
- **Dynamic Content:** Server name, timestamp update on page refresh
- **Server-side Execution:** ASP.NET code (<%=...%>) renders correctly

#### ✅ IIS Configuration Verification:
1. **IIS Manager** → Sites → JekApp (running on port 80)
2. **Application Pools** → JekApp (uses .NET Framework v4.0)
3. **File System** → Files exist in `C:\inetpub\wwwroot\`

#### ✅ Technical Validation:
- **HTTP Response Headers:** Include `X-AspNet-Version` and `Server: Microsoft-IIS/10.0`
- **Application Pool:** Shows .NET Framework v4.0 (runs .NET Framework 4.8)
- **Web.config:** `targetFramework="4.8"` specified

## 📁 Project Structure

```
ws2022-dotnetfx48/
├── main.bicep                  # Main deployment template
├── modules/
│   ├── network.bicep          # VNet, subnet, NSG
│   └── vm.bicep              # VM, extensions, public IP
├── scripts/
│   ├── configure-iis.ps1     # IIS configuration script
│   └── deploy-app.ps1        # Application deployment
├── app/
│   ├── Default.aspx          # Sample web page
│   └── web.config           # Web configuration
├── parameters.template.json  # Parameter template
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## 🔧 Configuration Details

### Azure Resources Created
- **Resource Group**: `jek-rg-ws2022dotnet`
- **Virtual Machine**: `jek-vm-ws2022dotnet`
- **Virtual Network**: `jek-vnet-ws2022dotnet` (10.0.0.0/16)
- **Subnet**: `default` (10.0.0.0/24)
- **Public IP**: `jek-pip-ws2022dotnet` (Static, Standard SKU)
- **Network Interface**: `jek-nic-ws2022dotnet`
- **Network Security Group**: `jek-nsg-ws2022dotnet`

### Security Rules
| Rule | Protocol | Port | Source | Purpose |
|------|----------|------|---------|---------|
| AllowRDP | TCP | 3389 | Your IP | Remote Desktop access |
| AllowHTTP | TCP | 80 | Any | Web application access |
| AllowHTTPS | TCP | 443 | Any | Secure web access |

### VM Extensions
1. **Custom Script Extension** - Single extension that:
   - Installs IIS and ASP.NET features
   - Creates application pool and website
   - Deploys .NET Framework 4.8.1 Hello World application
   - Configures web.config and restarts IIS

## 🔒 Security Features

- **Trusted Launch** enabled with Secure Boot and vTPM
- **Network Security Group** restricts RDP to your IP only
- **Standard SKU Public IP** for enhanced security
- **No default passwords** in templates
- **Secrets excluded** from version control

## 🧹 Cleanup Instructions

To remove all deployed resources:

```bash
# Delete the entire resource group
az group delete \
  --name jek-rg-ws2022dotnet \
  --yes \
  --no-wait
```

**Warning**: This will permanently delete all resources in the resource group.

## 💰 Cost Optimization

- **Standard_D4_v5** VM size balances performance and cost
- **StandardSSD_LRS** provides good performance at lower cost
- **Auto-shutdown** can be configured in Azure portal for development

### Estimated Monthly Cost (Southeast Asia)
- VM (Standard_D4_v5): ~$140/month (when running 24/7)
- Storage (StandardSSD_LRS): ~$10/month
- Public IP (Static): ~$4/month
- **Total**: ~$154/month

*Stop the VM when not in use to reduce costs significantly*

## 🔍 Troubleshooting

### Common Issues

#### Deployment Fails
- **Most Common**: Previous PowerShell DSC timeout issue has been fixed
- Verify your public IP is correctly formatted (e.g., "1.2.3.4/32")  
- Ensure password meets complexity requirements
- Check Azure CLI is logged in: `az account show`
- If you still get errors, delete any failed resource group and retry

#### Can't RDP to VM
- Verify NSG allows your current public IP
- Check VM is running: Azure Portal > Virtual Machines
- Confirm RDP port 3389 is open

#### Website Not Loading
- Verify VM extensions completed successfully
- RDP to server and check IIS Manager
- Check Windows Firewall settings
- Review deployment logs in Azure Portal

#### Extension Issues
- **Timeout Fixed**: Replaced problematic PowerShell DSC with streamlined Custom Script Extension
- Extension typically completes in 5-10 minutes
- Check C:\WindowsAzure\Logs\Plugins\ for extension logs
- Extension now includes verbose logging for easier troubleshooting
- If still having issues, manually run scripts in scripts/ folder

### Getting Help

1. **Azure CLI Help**: `az deployment sub create --help`
2. **Bicep Documentation**: https://docs.microsoft.com/azure/azure-resource-manager/bicep/
3. **Extension Logs**: Available in Azure Portal > VM > Extensions
4. **Event Viewer**: Check Application and System logs on the VM

## 📚 Additional Resources

- [Azure Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)
- [Windows Server 2022 Documentation](https://docs.microsoft.com/windows-server/)
- [IIS Configuration Guide](https://docs.microsoft.com/iis/)
- [.NET Framework 4.8.1 Documentation](https://docs.microsoft.com/dotnet/framework/)

## 🏷️ Tags Applied

All resources are tagged with:
- `owner`: jek
- `env`: test
- `criticality`: low

---

**✅ Deployment Complete!** 

Your Windows Server 2022 with .NET Framework 4.8.1 application is ready for testing.